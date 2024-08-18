use anyhow::{anyhow, Context};
use formatting::format_serror;
use monitor_client::{
  api::write::*,
  entities::{
    config::core::CoreConfig,
    monitor_timestamp,
    permission::PermissionLevel,
    server::ServerState,
    stack::{ComposeContents, PartialStackConfig, Stack, StackInfo},
    update::Update,
    user::User,
    NoData, Operation,
  },
};
use mungos::{
  by_id::update_one_by_id,
  mongodb::bson::{doc, to_document},
};
use octorust::types::{
  ReposCreateWebhookRequest, ReposCreateWebhookRequestConfig,
};
use periphery_client::api::compose::{
  GetComposeContentsOnHost, GetComposeContentsOnHostResponse,
};
use resolver_api::Resolve;

use crate::{
  config::core_config,
  helpers::{
    periphery_client,
    query::get_server_with_status,
    stack::{
      remote::get_remote_compose_contents,
      services::extract_services_into_res,
    },
    update::{add_update, make_update},
  },
  resource,
  state::{db_client, github_client, State},
};

impl Resolve<CreateStack, User> for State {
  #[instrument(name = "CreateStack", skip(self, user))]
  async fn resolve(
    &self,
    CreateStack { name, config }: CreateStack,
    user: User,
  ) -> anyhow::Result<Stack> {
    resource::create::<Stack>(&name, config, &user).await
  }
}

impl Resolve<CopyStack, User> for State {
  #[instrument(name = "CopyStack", skip(self, user))]
  async fn resolve(
    &self,
    CopyStack { name, id }: CopyStack,
    user: User,
  ) -> anyhow::Result<Stack> {
    let Stack { config, .. } =
      resource::get_check_permissions::<Stack>(
        &id,
        &user,
        PermissionLevel::Write,
      )
      .await?;
    resource::create::<Stack>(&name, config.into(), &user).await
  }
}

impl Resolve<DeleteStack, User> for State {
  #[instrument(name = "DeleteStack", skip(self, user))]
  async fn resolve(
    &self,
    DeleteStack { id }: DeleteStack,
    user: User,
  ) -> anyhow::Result<Stack> {
    resource::delete::<Stack>(&id, &user).await
  }
}

impl Resolve<UpdateStack, User> for State {
  #[instrument(name = "UpdateStack", skip(self, user))]
  async fn resolve(
    &self,
    UpdateStack { id, config }: UpdateStack,
    user: User,
  ) -> anyhow::Result<Stack> {
    resource::update::<Stack>(&id, config, &user).await
  }
}

impl Resolve<RenameStack, User> for State {
  #[instrument(name = "RenameStack", skip(self, user))]
  async fn resolve(
    &self,
    RenameStack { id, name }: RenameStack,
    user: User,
  ) -> anyhow::Result<Update> {
    let stack = resource::get_check_permissions::<Stack>(
      &id,
      &user,
      PermissionLevel::Write,
    )
    .await?;

    let mut update =
      make_update(&stack, Operation::RenameStack, &user);

    update_one_by_id(
      &db_client().await.stacks,
      &stack.id,
      mungos::update::Update::Set(
        doc! { "name": &name, "updated_at": monitor_timestamp() },
      ),
      None,
    )
    .await
    .context("failed to update stack name on db")?;

    update.push_simple_log(
      "rename stack",
      format!("renamed stack from {} to {}", stack.name, name),
    );
    update.finalize();

    add_update(update.clone()).await?;

    Ok(update)
  }
}

impl Resolve<RefreshStackCache, User> for State {
  #[instrument(
    name = "RefreshStackCache",
    level = "debug",
    skip(self, user)
  )]
  async fn resolve(
    &self,
    RefreshStackCache { stack }: RefreshStackCache,
    user: User,
  ) -> anyhow::Result<NoData> {
    // Even though this is a write request, this doesn't change any config. Anyone that can execute the
    // stack should be able to do this.
    let stack = resource::get_check_permissions::<Stack>(
      &stack,
      &user,
      PermissionLevel::Execute,
    )
    .await?;

    let file_contents_empty = stack.config.file_contents.is_empty();

    if !stack.config.files_on_host
      && file_contents_empty
      && stack.config.repo.is_empty()
    {
      // Nothing to do without one of these
      return Ok(NoData {});
    }

    let mut missing_files = Vec::new();

    let (
      latest_services,
      remote_contents,
      remote_errors,
      latest_hash,
      latest_message,
    ) = if stack.config.files_on_host {
      // =============
      // FILES ON HOST
      // =============
      if stack.config.server_id.is_empty() {
        (vec![], None, None, None, None)
      } else {
        let (server, status) =
          get_server_with_status(&stack.config.server_id).await?;
        if status != ServerState::Ok {
          (vec![], None, None, None, None)
        } else {
          let GetComposeContentsOnHostResponse { contents, errors } =
            match periphery_client(&server)?
              .request(GetComposeContentsOnHost {
                file_paths: stack.file_paths().to_vec(),
                name: stack.name.clone(),
                run_directory: stack.config.run_directory.clone(),
              })
              .await
              .context(
                "failed to get compose file contents from host",
              ) {
              Ok(res) => res,
              Err(e) => GetComposeContentsOnHostResponse {
                contents: Default::default(),
                errors: vec![ComposeContents {
                  path: stack.config.run_directory.clone(),
                  contents: format_serror(&e.into()),
                }],
              },
            };

          let project_name = stack.project_name(true);

          let mut services = Vec::new();

          for contents in &contents {
            if let Err(e) = extract_services_into_res(
              &project_name,
              &contents.contents,
              &mut services,
            ) {
              warn!(
                "failed to extract stack services, things won't works correctly. stack: {} | {e:#}",
                stack.name
              );
            }
          }

          (services, Some(contents), Some(errors), None, None)
        }
      }
    } else if file_contents_empty {
      // ================
      // REPO BASED STACK
      // ================
      let (
        remote_contents,
        remote_errors,
        _,
        latest_hash,
        latest_message,
      ) =
        get_remote_compose_contents(&stack, Some(&mut missing_files))
          .await
          .context("failed to clone remote compose file")?;
      let project_name = stack.project_name(true);

      let mut services = Vec::new();

      for contents in &remote_contents {
        if let Err(e) = extract_services_into_res(
          &project_name,
          &contents.contents,
          &mut services,
        ) {
          warn!(
            "failed to extract stack services, things won't works correctly. stack: {} | {e:#}",
            stack.name
          );
        }
      }

      (
        services,
        Some(remote_contents),
        Some(remote_errors),
        latest_hash,
        latest_message,
      )
    } else {
      // =============
      // UI BASED FILE
      // =============
      let mut services = Vec::new();
      if let Err(e) = extract_services_into_res(
        // this should latest (not deployed), so make the project name fresh.
        &stack.project_name(true),
        &stack.config.file_contents,
        &mut services,
      ) {
        warn!(
          "failed to extract stack services, things won't works correctly. stack: {} | {e:#}",
          stack.name
        );
        services.extend(stack.info.latest_services);
      };
      (services, None, None, None, None)
    };

    let info = StackInfo {
      missing_files,
      deployed_services: stack.info.deployed_services,
      deployed_project_name: stack.info.deployed_project_name,
      deployed_contents: stack.info.deployed_contents,
      deployed_hash: stack.info.deployed_hash,
      deployed_message: stack.info.deployed_message,
      latest_services,
      remote_contents,
      remote_errors,
      latest_hash,
      latest_message,
    };

    let info = to_document(&info)
      .context("failed to serialize stack info to bson")?;

    db_client()
      .await
      .stacks
      .update_one(
        doc! { "name": &stack.name },
        doc! { "$set": { "info": info } },
      )
      .await
      .context("failed to update stack info on db")?;

    Ok(NoData {})
  }
}

impl Resolve<CreateStackWebhook, User> for State {
  #[instrument(name = "CreateStackWebhook", skip(self, user))]
  async fn resolve(
    &self,
    CreateStackWebhook { stack, action }: CreateStackWebhook,
    user: User,
  ) -> anyhow::Result<CreateStackWebhookResponse> {
    let Some(github) = github_client() else {
      return Err(anyhow!(
        "github_webhook_app is not configured in core config toml"
      ));
    };

    let stack = resource::get_check_permissions::<Stack>(
      &stack,
      &user,
      PermissionLevel::Write,
    )
    .await?;

    if stack.config.repo.is_empty() {
      return Err(anyhow!(
        "No repo configured, can't create webhook"
      ));
    }

    let mut split = stack.config.repo.split('/');
    let owner = split.next().context("Stack repo has no owner")?;

    let Some(github) = github.get(owner) else {
      return Err(anyhow!(
        "Cannot manage repo webhooks under owner {owner}"
      ));
    };

    let repo =
      split.next().context("Stack repo has no repo after the /")?;

    let github_repos = github.repos();

    // First make sure the webhook isn't already created (inactive ones are ignored)
    let webhooks = github_repos
      .list_all_webhooks(owner, repo)
      .await
      .context("failed to list all webhooks on repo")?
      .body;

    let CoreConfig {
      host,
      webhook_base_url,
      webhook_secret,
      ..
    } = core_config();

    let webhook_secret = if stack.config.webhook_secret.is_empty() {
      webhook_secret
    } else {
      &stack.config.webhook_secret
    };

    let host = webhook_base_url.as_ref().unwrap_or(host);
    let url = match action {
      StackWebhookAction::Refresh => {
        format!("{host}/listener/github/stack/{}/refresh", stack.id)
      }
      StackWebhookAction::Deploy => {
        format!("{host}/listener/github/stack/{}/deploy", stack.id)
      }
    };

    for webhook in webhooks {
      if webhook.active && webhook.config.url == url {
        return Ok(NoData {});
      }
    }

    // Now good to create the webhook
    let request = ReposCreateWebhookRequest {
      active: Some(true),
      config: Some(ReposCreateWebhookRequestConfig {
        url,
        secret: webhook_secret.to_string(),
        content_type: String::from("json"),
        insecure_ssl: None,
        digest: Default::default(),
        token: Default::default(),
      }),
      events: vec![String::from("push")],
      name: String::from("web"),
    };
    github_repos
      .create_webhook(owner, repo, &request)
      .await
      .context("failed to create webhook")?;

    if !stack.config.webhook_enabled {
      self
        .resolve(
          UpdateStack {
            id: stack.id,
            config: PartialStackConfig {
              webhook_enabled: Some(true),
              ..Default::default()
            },
          },
          user,
        )
        .await
        .context("failed to update stack to enable webhook")?;
    }

    Ok(NoData {})
  }
}

impl Resolve<DeleteStackWebhook, User> for State {
  #[instrument(name = "DeleteStackWebhook", skip(self, user))]
  async fn resolve(
    &self,
    DeleteStackWebhook { stack, action }: DeleteStackWebhook,
    user: User,
  ) -> anyhow::Result<DeleteStackWebhookResponse> {
    let Some(github) = github_client() else {
      return Err(anyhow!(
        "github_webhook_app is not configured in core config toml"
      ));
    };

    let stack = resource::get_check_permissions::<Stack>(
      &stack,
      &user,
      PermissionLevel::Write,
    )
    .await?;

    if stack.config.git_provider != "github.com" {
      return Err(anyhow!(
        "Can only manage github.com repo webhooks"
      ));
    }

    if stack.config.repo.is_empty() {
      return Err(anyhow!(
        "No repo configured, can't create webhook"
      ));
    }

    let mut split = stack.config.repo.split('/');
    let owner = split.next().context("Stack repo has no owner")?;

    let Some(github) = github.get(owner) else {
      return Err(anyhow!(
        "Cannot manage repo webhooks under owner {owner}"
      ));
    };

    let repo =
      split.next().context("Sync repo has no repo after the /")?;

    let github_repos = github.repos();

    // First make sure the webhook isn't already created (inactive ones are ignored)
    let webhooks = github_repos
      .list_all_webhooks(owner, repo)
      .await
      .context("failed to list all webhooks on repo")?
      .body;

    let CoreConfig {
      host,
      webhook_base_url,
      ..
    } = core_config();

    let host = webhook_base_url.as_ref().unwrap_or(host);
    let url = match action {
      StackWebhookAction::Refresh => {
        format!("{host}/listener/github/stack/{}/refresh", stack.id)
      }
      StackWebhookAction::Deploy => {
        format!("{host}/listener/github/stack/{}/deploy", stack.id)
      }
    };

    for webhook in webhooks {
      if webhook.active && webhook.config.url == url {
        github_repos
          .delete_webhook(owner, repo, webhook.id)
          .await
          .context("failed to delete webhook")?;
        return Ok(NoData {});
      }
    }

    // No webhook to delete, all good
    Ok(NoData {})
  }
}
