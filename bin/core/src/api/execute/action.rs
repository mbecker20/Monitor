use std::{
  collections::HashSet,
  path::{Path, PathBuf},
  str::FromStr,
  sync::OnceLock,
};

use anyhow::Context;
use command::run_komodo_command;
use futures::future::join_all;
use komodo_client::{
  api::{
    execute::{
      BatchExecutionResult, BatchExecutionResultItemErr,
      BatchRunAction, RunAction,
    },
    user::{CreateApiKey, CreateApiKeyResponse, DeleteApiKey},
  },
  entities::{
    action::Action,
    config::core::CoreConfig,
    permission::PermissionLevel,
    update::Update,
    user::{action_user, User},
  },
};
use mungos::{by_id::update_one_by_id, mongodb::bson::to_document};
use resolver_api::Resolve;
use tokio::fs;

use crate::{
  api::execute::ExecuteRequest,
  config::core_config,
  helpers::{
    interpolate::{
      add_interp_update_log,
      interpolate_variables_secrets_into_string,
    },
    query::get_variables_and_secrets,
    random_string,
    update::update_update,
  },
  resource::{
    self, list_full_for_user_using_match_string,
    refresh_action_state_cache,
  },
  state::{action_states, db_client, State},
};

impl Resolve<BatchRunAction, (User, Update)> for State {
  async fn resolve(
    &self,
    BatchRunAction { action }: BatchRunAction,
    (user, _): (User, Update),
  ) -> anyhow::Result<BatchExecutionResult> {
    let actions = list_full_for_user_using_match_string::<Action>(
      &action,
      Default::default(),
      &user,
      &[],
    )
    .await?;
    let futures = actions.into_iter().map(|action| {
      let user = user.clone();
      async move {
        super::inner_handler(
          ExecuteRequest::RunAction(RunAction {
            action: action.name.clone(),
          }),
          user,
        )
        .await
        .map(|r| {
          let super::ExecutionResult::Single(update) = r else {
            unreachable!()
          };
          update
        })
        .map_err(|e| BatchExecutionResultItemErr {
          name: action.name,
          error: e.into(),
        })
        .into()
      }
    });
    Ok(join_all(futures).await)
  }
}

impl Resolve<RunAction, (User, Update)> for State {
  async fn resolve(
    &self,
    RunAction { action }: RunAction,
    (user, mut update): (User, Update),
  ) -> anyhow::Result<Update> {
    let mut action = resource::get_check_permissions::<Action>(
      &action,
      &user,
      PermissionLevel::Execute,
    )
    .await?;

    // get the action state for the action (or insert default).
    let action_state = action_states()
      .action
      .get_or_insert_default(&action.id)
      .await;

    // This will set action state back to default when dropped.
    // Will also check to ensure action not already busy before updating.
    let _action_guard =
      action_state.update(|state| state.running = true)?;

    update_update(update.clone()).await?;

    let CreateApiKeyResponse { key, secret } = State
      .resolve(
        CreateApiKey {
          name: update.id.clone(),
          expires: 0,
        },
        action_user().to_owned(),
      )
      .await?;

    let contents = &mut action.config.file_contents;

    // Wrap the file contents in the execution context.
    *contents = full_contents(contents, &key, &secret);

    let replacers =
      interpolate(contents, &mut update, key.clone(), secret.clone())
        .await?
        .into_iter()
        .collect::<Vec<_>>();

    let file = format!("{}.ts", random_string(10));
    let path = core_config().action_directory.join(&file);

    if let Some(parent) = path.parent() {
      let _ = fs::create_dir_all(parent).await;
    }

    fs::write(&path, contents).await.with_context(|| {
      format!("Failed to write action file to {path:?}")
    })?;

    let mut res = run_komodo_command(
      // Keep this stage name as is, the UI will find the latest update log by matching the stage name
      "Execute Action",
      None,
      format!("deno run --allow-all {}", path.display()),
      false,
    )
    .await;

    res.stdout = svi::replace_in_string(&res.stdout, &replacers)
      .replace(&key, "<ACTION_API_KEY>");
    res.stderr = svi::replace_in_string(&res.stderr, &replacers)
      .replace(&secret, "<ACTION_API_SECRET>");

    cleanup_run(file + ".js", &path).await;

    if let Err(e) = State
      .resolve(DeleteApiKey { key }, action_user().to_owned())
      .await
    {
      warn!(
        "Failed to delete API key after action execution | {e:#}"
      );
    };

    update.logs.push(res);
    update.finalize();

    // Need to manually update the update before cache refresh,
    // and before broadcast with update_update.
    // The Err case of to_document should be unreachable,
    // but will fail to update cache in that case.
    if let Ok(update_doc) = to_document(&update) {
      let _ = update_one_by_id(
        &db_client().updates,
        &update.id,
        mungos::update::Update::Set(update_doc),
        None,
      )
      .await;
      refresh_action_state_cache().await;
    }

    update_update(update.clone()).await?;

    Ok(update)
  }
}

async fn interpolate(
  contents: &mut String,
  update: &mut Update,
  key: String,
  secret: String,
) -> anyhow::Result<HashSet<(String, String)>> {
  let mut vars_and_secrets = get_variables_and_secrets().await?;

  vars_and_secrets
    .secrets
    .insert(String::from("ACTION_API_KEY"), key);
  vars_and_secrets
    .secrets
    .insert(String::from("ACTION_API_SECRET"), secret);

  let mut global_replacers = HashSet::new();
  let mut secret_replacers = HashSet::new();

  interpolate_variables_secrets_into_string(
    &vars_and_secrets,
    contents,
    &mut global_replacers,
    &mut secret_replacers,
  )?;

  add_interp_update_log(update, &global_replacers, &secret_replacers);

  Ok(secret_replacers)
}

fn full_contents(contents: &str, key: &str, secret: &str) -> String {
  let CoreConfig {
    port, ssl_enabled, ..
  } = core_config();
  let protocol = if *ssl_enabled { "https" } else { "http" };
  let base_url = format!("{protocol}://localhost:{port}");
  format!(
    "import {{ KomodoClient }} from '{base_url}/client/lib.js';
import * as __YAML__ from 'jsr:@std/yaml';
import * as __TOML__ from 'jsr:@std/toml';

const YAML = {{
  stringify: __YAML__.stringify,
  parse: __YAML__.parse,
  parseAll: __YAML__.parseAll,
  parseDockerCompose: __YAML__.parse,
}}

const TOML = {{
  stringify: __TOML__.stringify,
  parse: __TOML__.parse,
  parseResourceToml: __TOML__.parse,
  parseCargoToml: __TOML__.parse,
}}

const komodo = KomodoClient('{base_url}', {{
  type: 'api-key',
  params: {{ key: '{key}', secret: '{secret}' }}
}});

async function main() {{{contents}}}

main().catch(error => {{
  console.error('🚨 Action exited early with errors 🚨')
  if (error.status !== undefined && error.result !== undefined) {{
    console.error('Status:', error.status);
    console.error(JSON.stringify(error.result, null, 2));
  }} else {{
    console.error(JSON.stringify(error, null, 2));
  }}
  Deno.exit(1)
}}).then(() => console.log('🦎 Action completed successfully 🦎'));"
  )
}

/// Cleans up file at given path.
/// ALSO if $DENO_DIR is set,
/// will clean up the generated file matching "file"
async fn cleanup_run(file: String, path: &Path) {
  if let Err(e) = fs::remove_file(path).await {
    warn!(
      "Failed to delete action file after action execution | {e:#}"
    );
  }
  // If $DENO_DIR is set (will be in container),
  // will clean up the generated file matching "file" (NOT under path)
  let Some(deno_dir) = deno_dir() else {
    return;
  };
  delete_file(deno_dir.join("gen/file"), file).await;
}

fn deno_dir() -> Option<&'static Path> {
  static DENO_DIR: OnceLock<Option<PathBuf>> = OnceLock::new();
  DENO_DIR
    .get_or_init(|| {
      let deno_dir = std::env::var("DENO_DIR").ok()?;
      PathBuf::from_str(&deno_dir).ok()
    })
    .as_deref()
}

/// file is just the terminating file path,
/// it may be nested multiple folder under path,
/// this will find the nested file and delete it.
/// Assumes the file is only there once.
fn delete_file(
  dir: PathBuf,
  file: String,
) -> std::pin::Pin<Box<dyn std::future::Future<Output = bool> + Send>>
{
  Box::pin(async move {
    let Ok(mut dir) = fs::read_dir(dir).await else {
      return false;
    };
    // Collect the nested folders for recursing
    // only after checking all the files in directory.
    let mut folders = Vec::<PathBuf>::new();

    while let Ok(Some(entry)) = dir.next_entry().await {
      let Ok(meta) = entry.metadata().await else {
        continue;
      };
      if meta.is_file() {
        let Ok(name) = entry.file_name().into_string() else {
          continue;
        };
        if name == file {
          if let Err(e) = fs::remove_file(entry.path()).await {
            warn!(
            "Failed to clean up generated file after action execution | {e:#}"
          );
          };
          return true;
        }
      } else {
        folders.push(entry.path());
      }
    }

    if folders.len() == 1 {
      // unwrap ok, folders definitely is not empty
      let folder = folders.pop().unwrap();
      delete_file(folder, file).await
    } else {
      // Check folders with file.clone
      for folder in folders {
        if delete_file(folder, file.clone()).await {
          return true;
        }
      }
      false
    }
  })
}
