use std::{collections::HashSet, str::FromStr, time::Duration};

use anyhow::{anyhow, Context};
use futures::future::join_all;
use mongo_indexed::Document;
use monitor_client::{
  api::write::CreateServer,
  entities::{
    monitor_timestamp,
    permission::{Permission, PermissionLevel, UserTarget},
    server::{PartialServerConfig, Server},
    sync::ResourceSync,
    update::{Log, ResourceTarget, Update},
    user::{system_user, User},
    EnvironmentVar,
  },
};
use mungos::{
  find::find_collect,
  mongodb::bson::{doc, oid::ObjectId, to_document, Bson},
};
use periphery_client::PeripheryClient;
use query::get_global_variables;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use resolver_api::Resolve;

use crate::{
  config::core_config,
  resource,
  state::{db_client, State},
};

pub mod action_state;
pub mod alert;
pub mod build;
pub mod builder;
pub mod cache;
pub mod channel;
pub mod procedure;
pub mod prune;
pub mod query;
pub mod repo;
pub mod stack;
pub mod sync;
pub mod update;

// pub mod resource;

pub fn empty_or_only_spaces(word: &str) -> bool {
  if word.is_empty() {
    return true;
  }
  for char in word.chars() {
    if char != ' ' {
      return false;
    }
  }
  true
}

pub fn random_duration(min_ms: u64, max_ms: u64) -> Duration {
  Duration::from_millis(thread_rng().gen_range(min_ms..max_ms))
}

pub fn random_string(length: usize) -> String {
  thread_rng()
    .sample_iter(&Alphanumeric)
    .take(length)
    .map(char::from)
    .collect()
}

/// First checks db for token, then checks core config.
/// Only errors if db call errors.
/// Returns (token, use_https)
pub async fn git_token(
  provider_domain: &str,
  account_username: &str,
  mut on_https_found: impl FnMut(bool),
) -> anyhow::Result<Option<String>> {
  let db_provider = db_client()
    .await
    .git_accounts
    .find_one(doc! { "domain": provider_domain, "username": account_username })
    .await
    .context("failed to query db for git provider accounts")?;
  if let Some(provider) = db_provider {
    on_https_found(provider.https);
    return Ok(Some(provider.token));
  }
  Ok(
    core_config()
      .git_providers
      .iter()
      .find(|provider| provider.domain == provider_domain)
      .and_then(|provider| {
        on_https_found(provider.https);
        provider
          .accounts
          .iter()
          .find(|account| account.username == account_username)
          .map(|account| account.token.clone())
      }),
  )
}

/// First checks db for token, then checks core config.
/// Only errors if db call errors.
pub async fn registry_token(
  provider_domain: &str,
  account_username: &str,
) -> anyhow::Result<Option<String>> {
  let provider = db_client()
    .await
    .registry_accounts
    .find_one(doc! { "domain": provider_domain, "username": account_username })
    .await
    .context("failed to query db for docker registry accounts")?;
  if let Some(provider) = provider {
    return Ok(Some(provider.token));
  }
  Ok(
    core_config()
      .docker_registries
      .iter()
      .find(|provider| provider.domain == provider_domain)
      .and_then(|provider| {
        provider
          .accounts
          .iter()
          .find(|account| account.username == account_username)
          .map(|account| account.token.clone())
      }),
  )
}

#[instrument]
pub async fn remove_from_recently_viewed<T>(resource: T)
where
  T: Into<ResourceTarget> + std::fmt::Debug,
{
  let resource: ResourceTarget = resource.into();
  let (ty, id) = resource.extract_variant_id();
  if let Err(e) = db_client()
    .await
    .users
    .update_many(
      doc! {},
      doc! {
        "$pull": {
          "recently_viewed": {
            "type": ty.to_string(),
            "id": id,
          }
        }
      },
    )
    .await
    .context("failed to remove resource from users recently viewed")
  {
    warn!("{e:#}");
  }
}

//

pub fn periphery_client(
  server: &Server,
) -> anyhow::Result<PeripheryClient> {
  if !server.config.enabled {
    return Err(anyhow!("server not enabled"));
  }

  let client = PeripheryClient::new(
    &server.config.address,
    &core_config().passkey,
  );

  Ok(client)
}

#[instrument]
pub async fn create_permission<T>(
  user: &User,
  target: T,
  level: PermissionLevel,
) where
  T: Into<ResourceTarget> + std::fmt::Debug,
{
  // No need to actually create permissions for admins
  if user.admin {
    return;
  }
  let target: ResourceTarget = target.into();
  if let Err(e) = db_client()
    .await
    .permissions
    .insert_one(Permission {
      id: Default::default(),
      user_target: UserTarget::User(user.id.clone()),
      resource_target: target.clone(),
      level,
    })
    .await
  {
    error!("failed to create permission for {target:?} | {e:#}");
  };
}

/// Flattens a document only one level deep
///
/// eg `{ config: { label: "yes", thing: { field1: "ok", field2: "ok" } } }` ->
/// `{ "config.label": "yes", "config.thing": { field1: "ok", field2: "ok" } }`
pub fn flatten_document(doc: Document) -> Document {
  let mut target = Document::new();

  for (outer_field, bson) in doc {
    if let Bson::Document(doc) = bson {
      for (inner_field, bson) in doc {
        target.insert(format!("{outer_field}.{inner_field}"), bson);
      }
    } else {
      target.insert(outer_field, bson);
    }
  }

  target
}

/// Returns the secret replacers
pub async fn interpolate_variables_secrets_into_environment(
  environment: &mut Vec<EnvironmentVar>,
  update: &mut Update,
) -> anyhow::Result<HashSet<(String, String)>> {
  // Interpolate variables into environment
  let variables = get_global_variables().await?;
  let core_config = core_config();

  let mut global_replacers = HashSet::new();
  let mut secret_replacers = HashSet::new();

  for env in environment {
    // first pass - global variables
    let (res, more_replacers) = svi::interpolate_variables(
      &env.value,
      &variables,
      svi::Interpolator::DoubleBrackets,
      false,
    )
    .with_context(|| {
      format!(
        "failed to interpolate global variables - {}",
        env.variable
      )
    })?;
    global_replacers.extend(more_replacers);
    // second pass - core secrets
    let (res, more_replacers) = svi::interpolate_variables(
      &res,
      &core_config.secrets,
      svi::Interpolator::DoubleBrackets,
      false,
    )
    .context("failed to interpolate core secrets")?;
    secret_replacers.extend(more_replacers);

    // set env value with the result
    env.value = res;
  }

  // Show which variables were interpolated
  if !global_replacers.is_empty() {
    update.push_simple_log(
      "interpolate global variables",
      global_replacers
        .into_iter()
        .map(|(value, variable)| format!("<span class=\"text-muted-foreground\">{variable} =></span> {value}"))
        .collect::<Vec<_>>()
        .join("\n"),
    );
  }

  if !secret_replacers.is_empty() {
    update.push_simple_log(
      "interpolate core secrets",
      secret_replacers
        .iter()
        .map(|(_, variable)| format!("<span class=\"text-muted-foreground\">replaced:</span> {variable}"))
        .collect::<Vec<_>>()
        .join("\n"),
    );
  }

  Ok(secret_replacers)
}

pub async fn startup_cleanup() {
  tokio::join!(
    startup_in_progress_update_cleanup(),
    startup_open_alert_cleanup(),
  );
}

/// Run on startup, as no updates should be in progress on startup
async fn startup_in_progress_update_cleanup() {
  let log = Log::error(
    "monitor shutdown",
    String::from("Monitor shutdown during execution. If this is a build, the builder may not have been terminated.")
  );
  // This static log won't fail to serialize, unwrap ok.
  let log = to_document(&log).unwrap();
  if let Err(e) = db_client()
    .await
    .updates
    .update_many(
      doc! { "status": "InProgress" },
      doc! {
        "$set": {
          "status": "Complete",
          "success": false,
        },
        "$push": {
          "logs": log
        }
      },
    )
    .await
  {
    error!("failed to cleanup in progress updates on startup | {e:#}")
  }
}

/// Run on startup, ensure open alerts pointing to invalid resources are closed.
async fn startup_open_alert_cleanup() {
  let db = db_client().await;
  let Ok(alerts) =
    find_collect(&db.alerts, doc! { "resolved": false }, None)
      .await
      .inspect_err(|e| {
        error!(
          "failed to list all alerts for startup open alert cleanup | {e:?}"
        )
      })
  else {
    return;
  };
  let futures = alerts.into_iter().map(|alert| async move {
    match alert.target {
      ResourceTarget::Server(id) => {
        resource::get::<Server>(&id)
          .await
          .is_err()
          .then(|| ObjectId::from_str(&alert.id).inspect_err(|e| warn!("failed to clean up alert - id is invalid ObjectId | {e:?}")).ok()).flatten()
      }
      ResourceTarget::ResourceSync(id) => {
        resource::get::<ResourceSync>(&id)
          .await
          .is_err()
          .then(|| ObjectId::from_str(&alert.id).inspect_err(|e| warn!("failed to clean up alert - id is invalid ObjectId | {e:?}")).ok()).flatten()
      }
      // No other resources should have open alerts.
      _ => ObjectId::from_str(&alert.id).inspect_err(|e| warn!("failed to clean up alert - id is invalid ObjectId | {e:?}")).ok(),
    }
  });
  let to_update_ids = join_all(futures)
    .await
    .into_iter()
    .flatten()
    .collect::<Vec<_>>();
  if let Err(e) = db
    .alerts
    .update_many(
      doc! { "_id": { "$in": to_update_ids } },
      doc! { "$set": {
        "resolved": true,
        "resolved_ts": monitor_timestamp()
      } },
    )
    .await
  {
    error!(
      "failed to clean up invalid open alerts on startup | {e:#}"
    )
  }
}

/// Ensures a default server exists with the defined address
pub async fn ensure_server() {
  let ensure_server = &core_config().ensure_server;
  if ensure_server.is_empty() {
    return;
  }
  let db = db_client().await;
  let Ok(server) = db
    .servers
    .find_one(doc! { "config.address": ensure_server })
    .await
    .inspect_err(|e| error!("Failed to initialize 'ensure_server'. Failed to query db. {e:?}"))
  else {
    return;
  };
  if server.is_some() {
    return;
  }
  if let Err(e) = State
    .resolve(
      CreateServer {
        name: String::from("default"),
        config: PartialServerConfig {
          address: Some(ensure_server.to_string()),
          ..Default::default()
        },
      },
      system_user().to_owned(),
    )
    .await
  {
    error!("Failed to initialize 'ensure_server'. Failed to CreateServer. {e:?}");
  }
}
