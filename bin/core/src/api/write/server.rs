use anyhow::Context;
use formatting::format_serror;
use komodo_client::{
  api::write::*,
  entities::{
    komodo_timestamp,
    permission::PermissionLevel,
    server::Server,
    update::{Update, UpdateStatus},
    user::User,
    Operation,
  },
};
use mungos::{by_id::update_one_by_id, mongodb::bson::doc};
use periphery_client::api;
use resolver_api::Resolve;

use crate::{
  helpers::{
    periphery_client,
    update::{add_update, make_update, update_update},
  },
  resource,
  state::{db_client, State},
};

impl Resolve<CreateServer, User> for State {
  #[instrument(name = "CreateServer", skip(self, user))]
  async fn resolve(
    &self,
    CreateServer { name, config }: CreateServer,
    user: User,
  ) -> anyhow::Result<Server> {
    resource::create::<Server>(&name, config, &user).await
  }
}

impl Resolve<DeleteServer, User> for State {
  #[instrument(name = "DeleteServer", skip(self, user))]
  async fn resolve(
    &self,
    DeleteServer { id }: DeleteServer,
    user: User,
  ) -> anyhow::Result<Server> {
    resource::delete::<Server>(&id, &user).await
  }
}

impl Resolve<UpdateServer, User> for State {
  #[instrument(name = "UpdateServer", skip(self, user))]
  async fn resolve(
    &self,
    UpdateServer { id, config }: UpdateServer,
    user: User,
  ) -> anyhow::Result<Server> {
    resource::update::<Server>(&id, config, &user).await
  }
}

impl Resolve<RenameServer, User> for State {
  #[instrument(name = "RenameServer", skip(self, user))]
  async fn resolve(
    &self,
    RenameServer { id, name }: RenameServer,
    user: User,
  ) -> anyhow::Result<Update> {
    let server = resource::get_check_permissions::<Server>(
      &id,
      &user,
      PermissionLevel::Write,
    )
    .await?;
    let mut update =
      make_update(&server, Operation::RenameServer, &user);

    update_one_by_id(&db_client().await.servers, &id, mungos::update::Update::Set(doc! { "name": &name, "updated_at": komodo_timestamp() }), None)
      .await
      .context("failed to update server on db. this name may already be taken.")?;
    update.push_simple_log(
      "rename server",
      format!("renamed server {id} from {} to {name}", server.name),
    );
    update.finalize();
    update.id = add_update(update.clone()).await?;
    Ok(update)
  }
}

impl Resolve<CreateNetwork, User> for State {
  #[instrument(name = "CreateNetwork", skip(self, user))]
  async fn resolve(
    &self,
    CreateNetwork { server, name }: CreateNetwork,
    user: User,
  ) -> anyhow::Result<Update> {
    let server = resource::get_check_permissions::<Server>(
      &server,
      &user,
      PermissionLevel::Write,
    )
    .await?;

    let periphery = periphery_client(&server)?;

    let mut update =
      make_update(&server, Operation::CreateNetwork, &user);
    update.status = UpdateStatus::InProgress;
    update.id = add_update(update.clone()).await?;

    match periphery
      .request(api::network::CreateNetwork { name, driver: None })
      .await
    {
      Ok(log) => update.logs.push(log),
      Err(e) => update.push_error_log(
        "create network",
        format_serror(&e.context("failed to create network").into()),
      ),
    };

    update.finalize();
    update_update(update.clone()).await?;

    Ok(update)
  }
}
