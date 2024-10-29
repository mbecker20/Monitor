use std::{collections::HashMap, str::FromStr};

use anyhow::{anyhow, Context};
use komodo_client::entities::{
  action::Action,
  alerter::Alerter,
  build::Build,
  builder::Builder,
  deployment::{Deployment, DeploymentState},
  docker::container::{ContainerListItem, ContainerStateStatusEnum},
  permission::PermissionLevel,
  procedure::Procedure,
  repo::Repo,
  server::{Server, ServerState},
  server_template::ServerTemplate,
  stack::{Stack, StackServiceNames, StackState},
  sync::ResourceSync,
  tag::Tag,
  update::Update,
  user::{admin_service_user, User},
  user_group::UserGroup,
  variable::Variable,
  Operation, ResourceTarget, ResourceTargetVariant,
};
use mungos::{
  find::find_collect,
  mongodb::{
    bson::{doc, oid::ObjectId, Document},
    options::FindOneOptions,
  },
};

use crate::{
  config::core_config,
  resource::{self, get_user_permission_on_resource},
  stack::compose_container_match_regex,
  state::{db_client, deployment_status_cache, stack_status_cache},
};

// user: Id or username
#[instrument(level = "debug")]
pub async fn get_user(user: &str) -> anyhow::Result<User> {
  if let Some(user) = admin_service_user(user) {
    return Ok(user);
  }
  db_client()
    .users
    .find_one(id_or_username_filter(user))
    .await
    .context("failed to query mongo for user")?
    .with_context(|| format!("no user found with {user}"))
}

#[instrument(level = "debug")]
pub async fn get_server_with_state(
  server_id_or_name: &str,
) -> anyhow::Result<(Server, ServerState)> {
  let server = resource::get::<Server>(server_id_or_name).await?;
  let state = get_server_state(&server).await;
  Ok((server, state))
}

#[instrument(level = "debug")]
pub async fn get_server_state(server: &Server) -> ServerState {
  if !server.config.enabled {
    return ServerState::Disabled;
  }
  // Unwrap ok: Server disabled check above
  match super::periphery_client(server)
    .unwrap()
    .request(periphery_client::api::GetHealth {})
    .await
  {
    Ok(_) => ServerState::Ok,
    Err(_) => ServerState::NotOk,
  }
}

#[instrument(level = "debug")]
pub async fn get_deployment_state(
  deployment: &Deployment,
) -> anyhow::Result<DeploymentState> {
  let state = deployment_status_cache()
    .get(&deployment.id)
    .await
    .unwrap_or_default()
    .curr
    .state;
  Ok(state)
}

/// Can pass all the containers from the same server
pub fn get_stack_state_from_containers(
  ignore_services: &[String],
  services: &[StackServiceNames],
  containers: &[ContainerListItem],
) -> StackState {
  // first filter the containers to only ones which match the service
  let services = services
    .iter()
    .filter(|service| {
      !ignore_services.contains(&service.service_name)
    })
    .collect::<Vec<_>>();
  let containers = containers.iter().filter(|container| {
    services.iter().any(|StackServiceNames { service_name, container_name }| {
      match compose_container_match_regex(container_name)
        .with_context(|| format!("failed to construct container name matching regex for service {service_name}")) 
      {
        Ok(regex) => regex,
        Err(e) => {
          warn!("{e:#}");
          return false
        }
      }.is_match(&container.name)
    })
  }).collect::<Vec<_>>();
  if containers.is_empty() {
    return StackState::Down;
  }
  if services.len() > containers.len() {
    return StackState::Unhealthy;
  }
  let running = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Running
  });
  if running {
    return StackState::Running;
  }
  let paused = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Paused
  });
  if paused {
    return StackState::Paused;
  }
  let stopped = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Exited
  });
  if stopped {
    return StackState::Stopped;
  }
  let restarting = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Restarting
  });
  if restarting {
    return StackState::Restarting;
  }
  let dead = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Dead
  });
  if dead {
    return StackState::Dead;
  }
  let removing = containers.iter().all(|container| {
    container.state == ContainerStateStatusEnum::Removing
  });
  if removing {
    return StackState::Removing;
  }
  StackState::Unhealthy
}

#[instrument(level = "debug")]
pub async fn get_stack_state(
  stack: &Stack,
) -> anyhow::Result<StackState> {
  if stack.config.server_id.is_empty() {
    return Ok(StackState::Down);
  }
  let state = stack_status_cache()
    .get(&stack.id)
    .await
    .unwrap_or_default()
    .curr
    .state;
  Ok(state)
}

#[instrument(level = "debug")]
pub async fn get_tag(id_or_name: &str) -> anyhow::Result<Tag> {
  let query = match ObjectId::from_str(id_or_name) {
    Ok(id) => doc! { "_id": id },
    Err(_) => doc! { "name": id_or_name },
  };
  db_client()
    .tags
    .find_one(query)
    .await
    .context("failed to query mongo for tag")?
    .with_context(|| format!("no tag found matching {id_or_name}"))
}

#[instrument(level = "debug")]
pub async fn get_tag_check_owner(
  id_or_name: &str,
  user: &User,
) -> anyhow::Result<Tag> {
  let tag = get_tag(id_or_name).await?;
  if user.admin || tag.owner == user.id {
    return Ok(tag);
  }
  Err(anyhow!("user must be tag owner or admin"))
}

pub async fn get_all_tags(
  filter: impl Into<Option<Document>>,
) -> anyhow::Result<Vec<Tag>> {
  find_collect(&db_client().tags, filter, None)
    .await
    .context("failed to query db for tags")
}

pub async fn get_id_to_tags(
  filter: impl Into<Option<Document>>,
) -> anyhow::Result<HashMap<String, Tag>> {
  let res = find_collect(&db_client().tags, filter, None)
    .await
    .context("failed to query db for tags")?
    .into_iter()
    .map(|tag| (tag.id.clone(), tag))
    .collect();
  Ok(res)
}

#[instrument(level = "debug")]
pub async fn get_user_user_groups(
  user_id: &str,
) -> anyhow::Result<Vec<UserGroup>> {
  find_collect(
    &db_client().user_groups,
    doc! {
      "users": user_id
    },
    None,
  )
  .await
  .context("failed to query db for user groups")
}

#[instrument(level = "debug")]
pub async fn get_user_user_group_ids(
  user_id: &str,
) -> anyhow::Result<Vec<String>> {
  let res = get_user_user_groups(user_id)
    .await?
    .into_iter()
    .map(|ug| ug.id)
    .collect();
  Ok(res)
}

pub fn user_target_query(
  user_id: &str,
  user_groups: &[UserGroup],
) -> anyhow::Result<Vec<Document>> {
  let mut user_target_query = vec![
    doc! { "user_target.type": "User", "user_target.id": user_id },
  ];
  let user_groups = user_groups.iter().map(|ug| {
    doc! {
      "user_target.type": "UserGroup", "user_target.id": &ug.id,
    }
  });
  user_target_query.extend(user_groups);
  Ok(user_target_query)
}

pub async fn get_user_permission_on_target(
  user: &User,
  target: &ResourceTarget,
) -> anyhow::Result<PermissionLevel> {
  match target {
    ResourceTarget::System(_) => Ok(PermissionLevel::None),
    ResourceTarget::Build(id) => {
      get_user_permission_on_resource::<Build>(user, id).await
    }
    ResourceTarget::Builder(id) => {
      get_user_permission_on_resource::<Builder>(user, id).await
    }
    ResourceTarget::Deployment(id) => {
      get_user_permission_on_resource::<Deployment>(user, id).await
    }
    ResourceTarget::Server(id) => {
      get_user_permission_on_resource::<Server>(user, id).await
    }
    ResourceTarget::Repo(id) => {
      get_user_permission_on_resource::<Repo>(user, id).await
    }
    ResourceTarget::Alerter(id) => {
      get_user_permission_on_resource::<Alerter>(user, id).await
    }
    ResourceTarget::Procedure(id) => {
      get_user_permission_on_resource::<Procedure>(user, id).await
    }
    ResourceTarget::Action(id) => {
      get_user_permission_on_resource::<Action>(user, id).await
    }
    ResourceTarget::ServerTemplate(id) => {
      get_user_permission_on_resource::<ServerTemplate>(user, id)
        .await
    }
    ResourceTarget::ResourceSync(id) => {
      get_user_permission_on_resource::<ResourceSync>(user, id).await
    }
    ResourceTarget::Stack(id) => {
      get_user_permission_on_resource::<Stack>(user, id).await
    }
  }
}

pub fn id_or_name_filter(id_or_name: &str) -> Document {
  match ObjectId::from_str(id_or_name) {
    Ok(id) => doc! { "_id": id },
    Err(_) => doc! { "name": id_or_name },
  }
}

pub fn id_or_username_filter(id_or_username: &str) -> Document {
  match ObjectId::from_str(id_or_username) {
    Ok(id) => doc! { "_id": id },
    Err(_) => doc! { "username": id_or_username },
  }
}

pub async fn get_variable(name: &str) -> anyhow::Result<Variable> {
  db_client()
    .variables
    .find_one(doc! { "name": &name })
    .await
    .context("failed at call to db")?
    .with_context(|| {
      format!("no variable found with given name: {name}")
    })
}

pub async fn get_latest_update(
  resource_type: ResourceTargetVariant,
  id: &str,
  operation: Operation,
) -> anyhow::Result<Option<Update>> {
  db_client()
    .updates
    .find_one(doc! {
      "target.type": resource_type.as_ref(),
      "target.id": id,
      "operation": operation.as_ref()
    })
    .with_options(
      FindOneOptions::builder()
        .sort(doc! { "start_ts": -1 })
        .build(),
    )
    .await
    .context("failed to query db for latest update")
}

pub struct VariablesAndSecrets {
  pub variables: HashMap<String, String>,
  pub secrets: HashMap<String, String>,
}

pub async fn get_variables_and_secrets(
) -> anyhow::Result<VariablesAndSecrets> {
  let variables = find_collect(&db_client().variables, None, None)
    .await
    .context("failed to get all variables from db")?;
  let mut secrets = core_config().secrets.clone();

  // extend secrets with secret variables
  secrets.extend(
    variables.iter().filter(|variable| variable.is_secret).map(
      |variable| (variable.name.clone(), variable.value.clone()),
    ),
  );

  // collect non secret variables
  let variables = variables
    .into_iter()
    .filter(|variable| !variable.is_secret)
    .map(|variable| (variable.name, variable.value))
    .collect();

  Ok(VariablesAndSecrets { variables, secrets })
}
