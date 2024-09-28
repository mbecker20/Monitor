use std::time::Duration;

use anyhow::Context;
use komodo_client::entities::{
  build::{
    Build, BuildConfig, BuildConfigDiff, BuildInfo, BuildListItem,
    BuildListItemInfo, BuildQuerySpecifics, BuildState,
    PartialBuildConfig,
  },
  builder::Builder,
  environment_vars_from_str,
  permission::PermissionLevel,
  resource::Resource,
  update::Update,
  user::User,
  Operation, ResourceTargetVariant,
};
use mungos::{
  find::find_collect,
  mongodb::{bson::doc, options::FindOptions, Collection},
};

use crate::{
  config::core_config,
  helpers::{empty_or_only_spaces, query::get_latest_update},
  state::{action_states, build_state_cache, db_client},
};

impl super::KomodoResource for Build {
  type Config = BuildConfig;
  type PartialConfig = PartialBuildConfig;
  type ConfigDiff = BuildConfigDiff;
  type Info = BuildInfo;
  type ListItem = BuildListItem;
  type QuerySpecifics = BuildQuerySpecifics;

  fn resource_type() -> ResourceTargetVariant {
    ResourceTargetVariant::Build
  }

  async fn coll(
  ) -> &'static Collection<Resource<Self::Config, Self::Info>> {
    &db_client().await.builds
  }

  async fn to_list_item(
    build: Resource<Self::Config, Self::Info>,
  ) -> Self::ListItem {
    let state = get_build_state(&build.id).await;
    BuildListItem {
      name: build.name,
      id: build.id,
      tags: build.tags,
      resource_type: ResourceTargetVariant::Build,
      info: BuildListItemInfo {
        last_built_at: build.info.last_built_at,
        version: build.config.version,
        builder_id: build.config.builder_id,
        git_provider: build.config.git_provider,
        repo: build.config.repo,
        branch: build.config.branch,
        built_hash: build.info.built_hash,
        latest_hash: build.info.latest_hash,
        state,
      },
    }
  }

  async fn busy(id: &String) -> anyhow::Result<bool> {
    action_states()
      .build
      .get(id)
      .await
      .unwrap_or_default()
      .busy()
  }

  // CREATE

  fn create_operation() -> Operation {
    Operation::CreateBuild
  }

  fn user_can_create(user: &User) -> bool {
    user.admin
      || (!core_config().disable_non_admin_create
        && user.create_build_permissions)
  }

  async fn validate_create_config(
    config: &mut Self::PartialConfig,
    user: &User,
  ) -> anyhow::Result<()> {
    validate_config(config, user).await
  }

  async fn post_create(
    _created: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    refresh_build_state_cache().await;
    Ok(())
  }

  // UPDATE

  fn update_operation() -> Operation {
    Operation::UpdateBuild
  }

  async fn validate_update_config(
    _id: &str,
    config: &mut Self::PartialConfig,
    user: &User,
  ) -> anyhow::Result<()> {
    validate_config(config, user).await
  }

  async fn post_update(
    _updated: &Self,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    refresh_build_state_cache().await;
    Ok(())
  }

  // DELETE

  fn delete_operation() -> Operation {
    Operation::DeleteBuild
  }

  async fn pre_delete(
    _resource: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    Ok(())
  }

  async fn post_delete(
    _resource: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    Ok(())
  }
}

pub fn spawn_build_state_refresh_loop() {
  tokio::spawn(async move {
    loop {
      refresh_build_state_cache().await;
      tokio::time::sleep(Duration::from_secs(60)).await;
    }
  });
}

pub async fn refresh_build_state_cache() {
  let _ = async {
    let builds = find_collect(&db_client().await.builds, None, None)
      .await
      .context("failed to get builds from db")?;
    let cache = build_state_cache();
    for build in builds {
      let state = get_build_state_from_db(&build.id).await;
      cache.insert(build.id, state).await;
    }
    anyhow::Ok(())
  }
  .await
  .inspect_err(|e| {
    error!("failed to refresh build state cache | {e:#}")
  });
}

#[instrument(skip(user))]
async fn validate_config(
  config: &mut PartialBuildConfig,
  user: &User,
) -> anyhow::Result<()> {
  if let Some(builder_id) = &config.builder_id {
    if !builder_id.is_empty() {
      let builder = super::get_check_permissions::<Builder>(builder_id, user, PermissionLevel::Read)
        .await
        .context("cannot create build using this builder. user must have at least read permissions on the builder.")?;
      config.builder_id = Some(builder.id)
    }
  }
  if let Some(build_args) = &config.build_args {
    environment_vars_from_str(build_args)
      .context("Invalid build_args")?;
  }
  if let Some(secret_args) = &config.secret_args {
    environment_vars_from_str(secret_args)
      .context("Invalid secret_args")?;
  }
  if let Some(extra_args) = &mut config.extra_args {
    extra_args.retain(|v| !empty_or_only_spaces(v))
  }
  Ok(())
}

async fn get_build_state(id: &String) -> BuildState {
  if action_states()
    .build
    .get(id)
    .await
    .map(|s| s.get().map(|s| s.building))
    .transpose()
    .ok()
    .flatten()
    .unwrap_or_default()
  {
    return BuildState::Building;
  }
  build_state_cache().get(id).await.unwrap_or_default()
}

async fn get_build_state_from_db(id: &str) -> BuildState {
  async {
    let state = match tokio::try_join!(
      latest_2_build_updates(id),
      get_latest_update(
        ResourceTargetVariant::Build,
        id,
        Operation::CancelBuild
      ),
    )? {
      ([Some(build), second], Some(cancel))
        if cancel.start_ts > build.start_ts =>
      {
        match second {
          Some(build) => {
            if build.success {
              BuildState::Ok
            } else {
              BuildState::Failed
            }
          }
          None => BuildState::Ok,
        }
      }
      ([Some(build), _], _) => {
        if build.success {
          BuildState::Ok
        } else {
          BuildState::Failed
        }
      }
      _ => {
        // No build update ever, should be fine
        BuildState::Ok
      }
    };
    anyhow::Ok(state)
  }
  .await
  .inspect_err(|e| {
    warn!("failed to get build state for {id} | {e:#}")
  })
  .unwrap_or(BuildState::Unknown)
}

async fn latest_2_build_updates(
  id: &str,
) -> anyhow::Result<[Option<Update>; 2]> {
  let mut builds = find_collect(
    &db_client().await.updates,
    doc! {
      "target.type": "Build",
      "target.id": id,
      "operation": "RunBuild"
    },
    FindOptions::builder()
      .sort(doc! { "start_ts": -1 })
      .limit(2)
      .build(),
  )
  .await
  .context("failed to query for latest updates")?;
  let second = builds.pop();
  let first = builds.pop();
  Ok([first, second])
}
