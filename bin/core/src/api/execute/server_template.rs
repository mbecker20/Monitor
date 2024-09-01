use anyhow::{anyhow, Context};
use formatting::format_serror;
use komodo_client::{
  api::{execute::LaunchServer, write::CreateServer},
  entities::{
    permission::PermissionLevel,
    server::PartialServerConfig,
    server_template::{ServerTemplate, ServerTemplateConfig},
    update::Update,
    user::User,
  },
};
use mungos::mongodb::bson::doc;
use resolver_api::Resolve;

use crate::{
  cloud::{
    aws::ec2::launch_ec2_instance, hetzner::launch_hetzner_server,
  },
  helpers::update::update_update,
  resource,
  state::{db_client, State},
};

impl Resolve<LaunchServer, (User, Update)> for State {
  #[instrument(name = "LaunchServer", skip(self, user, update), fields(user_id = user.id, update_id = update.id))]
  async fn resolve(
    &self,
    LaunchServer {
      name,
      server_template,
    }: LaunchServer,
    (user, mut update): (User, Update),
  ) -> anyhow::Result<Update> {
    // validate name isn't already taken by another server
    if db_client()
      .await
      .servers
      .find_one(doc! {
        "name": &name
      })
      .await
      .context("failed to query db for servers")?
      .is_some()
    {
      return Err(anyhow!("name is already taken"));
    }

    let template = resource::get_check_permissions::<ServerTemplate>(
      &server_template,
      &user,
      PermissionLevel::Execute,
    )
    .await?;

    update.push_simple_log(
      "launching server",
      format!("{:#?}", template.config),
    );
    update_update(update.clone()).await?;

    let config = match template.config {
      ServerTemplateConfig::Aws(config) => {
        let region = config.region.clone();
        let instance = match launch_ec2_instance(&name, config).await
        {
          Ok(instance) => instance,
          Err(e) => {
            update.push_error_log(
              "launch server",
              format!("failed to launch aws instance\n\n{e:#?}"),
            );
            update.finalize();
            update_update(update.clone()).await?;
            return Ok(update);
          }
        };
        update.push_simple_log(
          "launch server",
          format!(
            "successfully launched server {name} on ip {}",
            instance.ip
          ),
        );
        PartialServerConfig {
          address: format!("http://{}:8120", instance.ip).into(),
          region: region.into(),
          ..Default::default()
        }
      }
      ServerTemplateConfig::Hetzner(config) => {
        let datacenter = config.datacenter;
        let server = match launch_hetzner_server(&name, config).await
        {
          Ok(server) => server,
          Err(e) => {
            update.push_error_log(
              "launch server",
              format!("failed to launch hetzner server\n\n{e:#?}"),
            );
            update.finalize();
            update_update(update.clone()).await?;
            return Ok(update);
          }
        };
        update.push_simple_log(
          "launch server",
          format!(
            "successfully launched server {name} on ip {}",
            server.ip
          ),
        );
        PartialServerConfig {
          address: format!("http://{}:8120", server.ip).into(),
          region: datacenter.as_ref().to_string().into(),
          ..Default::default()
        }
      }
    };

    match self.resolve(CreateServer { name, config }, user).await {
      Ok(server) => {
        update.push_simple_log(
          "create server",
          format!("created server {} ({})", server.name, server.id),
        );
        update.other_data = server.id;
      }
      Err(e) => {
        update.push_error_log(
          "create server",
          format_serror(&e.context("failed to create server").into()),
        );
      }
    };

    update.finalize();
    update_update(update.clone()).await?;
    Ok(update)
  }
}
