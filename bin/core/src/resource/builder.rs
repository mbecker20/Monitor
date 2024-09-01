use anyhow::Context;
use komodo_client::entities::{
  builder::{
    Builder, BuilderConfig, BuilderConfigDiff, BuilderConfigVariant,
    BuilderListItem, BuilderListItemInfo, BuilderQuerySpecifics,
    PartialBuilderConfig, PartialServerBuilderConfig,
  },
  permission::PermissionLevel,
  resource::Resource,
  server::Server,
  update::Update,
  user::User,
  MergePartial, Operation, ResourceTargetVariant,
};
use mungos::mongodb::{
  bson::{doc, to_document, Document},
  Collection,
};

use crate::state::db_client;

impl super::KomodoResource for Builder {
  type Config = BuilderConfig;
  type PartialConfig = PartialBuilderConfig;
  type ConfigDiff = BuilderConfigDiff;
  type Info = ();
  type ListItem = BuilderListItem;
  type QuerySpecifics = BuilderQuerySpecifics;

  fn resource_type() -> ResourceTargetVariant {
    ResourceTargetVariant::Builder
  }

  async fn coll(
  ) -> &'static Collection<Resource<Self::Config, Self::Info>> {
    &db_client().await.builders
  }

  async fn to_list_item(
    builder: Resource<Self::Config, Self::Info>,
  ) -> Self::ListItem {
    let (builder_type, instance_type) = match builder.config {
      BuilderConfig::Server(config) => (
        BuilderConfigVariant::Server.to_string(),
        Some(config.server_id),
      ),
      BuilderConfig::Aws(config) => (
        BuilderConfigVariant::Aws.to_string(),
        Some(config.instance_type),
      ),
    };
    BuilderListItem {
      name: builder.name,
      id: builder.id,
      tags: builder.tags,
      resource_type: ResourceTargetVariant::Builder,
      info: BuilderListItemInfo {
        builder_type,
        instance_type,
      },
    }
  }

  async fn busy(_id: &String) -> anyhow::Result<bool> {
    Ok(false)
  }

  // CREATE

  fn create_operation() -> Operation {
    Operation::CreateBuilder
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
    _created: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    Ok(())
  }

  // UPDATE

  fn update_operation() -> Operation {
    Operation::UpdateBuilder
  }

  async fn validate_update_config(
    _id: &str,
    config: &mut Self::PartialConfig,
    user: &User,
  ) -> anyhow::Result<()> {
    validate_config(config, user).await
  }

  fn update_document(
    original: Resource<Self::Config, Self::Info>,
    config: Self::PartialConfig,
  ) -> Result<Document, mungos::mongodb::bson::ser::Error> {
    let config = original.config.merge_partial(config);
    to_document(&config)
  }

  async fn post_update(
    _updated: &Self,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    Ok(())
  }

  // DELETE

  fn delete_operation() -> Operation {
    Operation::DeleteBuilder
  }

  async fn pre_delete(
    resource: &Resource<Self::Config, Self::Info>,
    _update: &mut Update,
  ) -> anyhow::Result<()> {
    // remove the builder from any attached builds
    db_client()
      .await
      .builds
      .update_many(
        doc! { "config.builder.params.builder_id": &resource.id },
        mungos::update::Update::Set(
          doc! { "config.builder.params.builder_id": "" },
        ),
      )
      .await
      .context("failed to update_many builds on database")?;
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
  config: &mut PartialBuilderConfig,
  user: &User,
) -> anyhow::Result<()> {
  match config {
    PartialBuilderConfig::Server(PartialServerBuilderConfig {
      server_id: Some(server_id),
    }) if !server_id.is_empty() => {
      let server = super::get_check_permissions::<Server>(
        server_id,
        user,
        PermissionLevel::Write,
      )
      .await?;
      *server_id = server.id;
    }
    _ => {}
  }
  Ok(())
}
