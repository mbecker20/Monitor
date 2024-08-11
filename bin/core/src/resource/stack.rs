use anyhow::Context;
use formatting::format_serror;
use monitor_client::entities::{
  permission::PermissionLevel,
  resource::Resource,
  server::Server,
  stack::{
    PartialStackConfig, Stack, StackConfig, StackConfigDiff,
    StackInfo, StackListItem, StackListItemInfo, StackQuerySpecifics,
    StackState,
  },
  update::{ResourceTargetVariant, Update},
  user::User,
  Operation,
};
use mungos::mongodb::Collection;
use periphery_client::api::compose::ComposeExecution;

use crate::{
  helpers::{periphery_client, query::get_stack_state},
  monitor::update_cache_for_server,
  resource,
  state::{
    action_states, db_client, server_status_cache, stack_status_cache,
  },
};

use super::get_check_permissions;

impl super::MonitorResource for Stack {
  type Config = StackConfig;
  type PartialConfig = PartialStackConfig;
  type ConfigDiff = StackConfigDiff;
  type Info = StackInfo;
  type ListItem = StackListItem;
  type QuerySpecifics = StackQuerySpecifics;

  fn resource_type() -> ResourceTargetVariant {
    ResourceTargetVariant::Stack
  }

  async fn coll(
  ) -> &'static Collection<Resource<Self::Config, Self::Info>> {
    &db_client().await.stacks
  }

  async fn to_list_item(
    stack: Resource<Self::Config, Self::Info>,
  ) -> Self::ListItem {
    let status = stack_status_cache().get(&stack.id).await;
    let state =
      status.as_ref().map(|s| s.curr.state).unwrap_or_default();
    let project_name = stack.project_name(false);
    let services = match (
      state,
      stack.info.deployed_services,
      stack.info.latest_services,
    ) {
      // Always use latest if its down.
      (StackState::Down, _, latest_services) => latest_services,
      // Also use latest if deployed services is empty.
      (_, Some(deployed_services), _) => deployed_services,
      // Otherwise use deployed services
      (_, _, latest_services) => latest_services,
    }
    .into_iter()
    .map(|service| service.service_name)
    .collect();
    // This is only true if it is KNOWN to be true. so other cases are false.
    let (project_missing, status) =
      if stack.config.server_id.is_empty()
        || matches!(state, StackState::Down | StackState::Unknown)
      {
        (false, None)
      } else if let Some(status) = server_status_cache()
        .get(&stack.config.server_id)
        .await
        .as_ref()
      {
        if let Some(projects) = &status.projects {
          if let Some(project) = projects
            .iter()
            .find(|project| project.name == project_name)
          {
            (false, project.status.clone())
          } else {
            // The project doesn't exist
            (true, None)
          }
        } else {
          (false, None)
        }
      } else {
        (false, None)
      };
    StackListItem {
      id: stack.id,
      name: stack.name,
      tags: stack.tags,
      resource_type: ResourceTargetVariant::Stack,
      info: StackListItemInfo {
        state,
        status,
        services,
        project_missing,
        server_id: stack.config.server_id,
        missing_files: stack.info.missing_files,
        git_provider: stack.config.git_provider,
        repo: stack.config.repo,
        branch: stack.config.branch,
        latest_hash: stack.info.latest_hash,
        deployed_hash: stack.info.deployed_hash,
      },
    }
  }

  async fn busy(id: &String) -> anyhow::Result<bool> {
    action_states()
      .stack
      .get(id)
      .await
      .unwrap_or_default()
      .busy()
  }

  // CREATE

  fn create_operation() -> Operation {
    Operation::CreateStack
  }

  fn user_can_create(user: &User) -> bool {
    user.admin
  }

  async fn validate_create_config(
    config: &mut Self::PartialConfig,
    user: &User,
  ) -> anyhow::Result<()> {
    validate_config(config, user).await
  }

  async fn post_create(
    created: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    if !created.config.server_id.is_empty() {
      let server =
        resource::get::<Server>(&created.config.server_id).await?;
      update_cache_for_server(&server).await;
    }
    Ok(())
  }

  // UPDATE

  fn update_operation() -> Operation {
    Operation::UpdateStack
  }

  async fn validate_update_config(
    _id: &str,
    config: &mut Self::PartialConfig,
    user: &User,
  ) -> anyhow::Result<()> {
    validate_config(config, user).await
  }

  async fn post_update(
    updated: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    if !updated.config.server_id.is_empty() {
      let server =
        resource::get::<Server>(&updated.config.server_id).await?;
      update_cache_for_server(&server).await;
    }
    Ok(())
  }

  // DELETE

  fn delete_operation() -> Operation {
    Operation::DeleteStack
  }

  async fn pre_delete(
    stack: &Resource<Self::Config, Self::Info>,
    update: &mut Update,
  ) -> anyhow::Result<()> {
    // If it is Up, it should be taken down
    let state = get_stack_state(stack)
      .await
      .context("failed to get stack state")?;
    if matches!(state, StackState::Down | StackState::Unknown) {
      return Ok(());
    }
    // stack needs to be destroyed
    let server =
      match super::get::<Server>(&stack.config.server_id).await {
        Ok(server) => server,
        Err(e) => {
          update.push_error_log(
            "destroy stack",
            format_serror(
              &e.context(format!(
                "failed to retrieve server at {} from db.",
                stack.config.server_id
              ))
              .into(),
            ),
          );
          return Ok(());
        }
      };

    if !server.config.enabled {
      // Don't need to
      update.push_simple_log(
        "destroy stack",
        "skipping stack destroy, server is disabled.",
      );
      return Ok(());
    }

    let periphery = match periphery_client(&server) {
      Ok(periphery) => periphery,
      Err(e) => {
        // This case won't ever happen, as periphery_client only fallible if the server is disabled.
        // Leaving it for completeness sake
        update.push_error_log(
          "destroy stack",
          format_serror(
            &e.context("failed to get periphery client").into(),
          ),
        );
        return Ok(());
      }
    };

    match periphery
      .request(ComposeExecution {
        project: stack.project_name(false),
        command: String::from("down --remove-orphans"),
      })
      .await
    {
      Ok(log) => update.logs.push(log),
      Err(e) => update.push_simple_log(
        "Failed to destroy stack",
        format_serror(
          &e.context(
            "failed to destroy stack on periphery server before delete",
          )
          .into(),
        ),
      ),
    };

    Ok(())
  }

  async fn post_delete(
    _resource: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    Ok(())
  }
}

#[instrument(skip(user))]
async fn validate_config(
  config: &mut PartialStackConfig,
  user: &User,
) -> anyhow::Result<()> {
  if let Some(server_id) = &config.server_id {
    if !server_id.is_empty() {
      let server = get_check_permissions::<Server>(server_id, user, PermissionLevel::Write)
          .await
          .context("cannot create stack on this server. user must have update permissions on the server to perform this action.")?;
      // in case it comes in as name
      config.server_id = Some(server.id);
    }
  }
  Ok(())
}

// pub fn spawn_resource_sync_state_refresh_loop() {
//   tokio::spawn(async move {
//     loop {
//       refresh_resource_sync_state_cache().await;
//       tokio::time::sleep(Duration::from_secs(60)).await;
//     }
//   });
// }

// pub async fn refresh_resource_sync_state_cache() {
//   let _ = async {
//     let resource_syncs =
//       find_collect(&db_client().await.resource_syncs, None, None)
//         .await
//         .context("failed to get resource_syncs from db")?;
//     let cache = resource_sync_state_cache();
//     for resource_sync in resource_syncs {
//       let state =
//         get_resource_sync_state_from_db(&resource_sync.id).await;
//       cache.insert(resource_sync.id, state).await;
//     }
//     anyhow::Ok(())
//   }
//   .await
//   .inspect_err(|e| {
//     error!("failed to refresh resource_sync state cache | {e:#}")
//   });
// }

// async fn get_resource_sync_state(
//   id: &String,
//   data: &PendingSyncUpdatesData,
// ) -> StackState {
//   if let Some(state) = action_states()
//     .resource_sync
//     .get(id)
//     .await
//     .and_then(|s| {
//       s.get()
//         .map(|s| {
//           if s.syncing {
//             Some(StackState::Syncing)
//           } else {
//             None
//           }
//         })
//         .ok()
//     })
//     .flatten()
//   {
//     return state;
//   }
//   let data = match data {
//     PendingSyncUpdatesData::Err(_) => return StackState::Failed,
//     PendingSyncUpdatesData::Ok(data) => data,
//   };
//   if !data.no_updates() {
//     return StackState::Pending;
//   }
//   resource_sync_state_cache()
//     .get(id)
//     .await
//     .unwrap_or_default()
// }

// async fn get_resource_sync_state_from_db(id: &str) -> StackState {
//   async {
//     let state = db_client()
//       .await
//       .updates
//       .find_one(doc! {
//         "target.type": "Stack",
//         "target.id": id,
//         "operation": "RunSync"
//       })
//       .with_options(
//         FindOneOptions::builder()
//           .sort(doc! { "start_ts": -1 })
//           .build(),
//       )
//       .await?
//       .map(|u| {
//         if u.success {
//           StackState::Ok
//         } else {
//           StackState::Failed
//         }
//       })
//       .unwrap_or(StackState::Ok);
//     anyhow::Ok(state)
//   }
//   .await
//   .inspect_err(|e| {
//     warn!(
//       "failed to get resource sync state from db for {id} | {e:#}"
//     )
//   })
//   .unwrap_or(StackState::Unknown)
// }
