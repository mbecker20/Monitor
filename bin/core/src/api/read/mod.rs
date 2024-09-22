use std::{collections::HashSet, sync::OnceLock, time::Instant};

use anyhow::{anyhow, Context};
use axum::{middleware, routing::post, Extension, Router};
use axum_extra::{headers::ContentType, TypedHeader};
use komodo_client::{
  api::read::*,
  entities::{
    build::Build,
    builder::{Builder, BuilderConfig},
    config::{DockerRegistry, GitProvider},
    repo::Repo,
    server::Server,
    sync::ResourceSync,
    user::User,
    ResourceTarget,
  },
};
use resolver_api::{
  derive::Resolver, Resolve, ResolveToString, Resolver,
};
use serde::{Deserialize, Serialize};
use serror::Json;
use typeshare::typeshare;
use uuid::Uuid;

use crate::{
  auth::auth_request, config::core_config, helpers::periphery_client,
  resource, state::State,
};

mod alert;
mod alerter;
mod build;
mod builder;
mod deployment;
mod permission;
mod procedure;
mod provider;
mod repo;
mod search;
mod server;
mod server_template;
mod stack;
mod sync;
mod tag;
mod toml;
mod update;
mod user;
mod user_group;
mod variable;

#[typeshare]
#[derive(Serialize, Deserialize, Debug, Clone, Resolver)]
#[resolver_target(State)]
#[resolver_args(User)]
#[serde(tag = "type", content = "params")]
enum ReadRequest {
  #[to_string_resolver]
  GetVersion(GetVersion),
  #[to_string_resolver]
  GetCoreInfo(GetCoreInfo),
  ListSecrets(ListSecrets),
  ListGitProvidersFromConfig(ListGitProvidersFromConfig),
  ListDockerRegistriesFromConfig(ListDockerRegistriesFromConfig),

  // ==== USER ====
  GetUsername(GetUsername),
  GetPermissionLevel(GetPermissionLevel),
  FindUser(FindUser),
  ListUsers(ListUsers),
  ListApiKeys(ListApiKeys),
  ListApiKeysForServiceUser(ListApiKeysForServiceUser),
  ListPermissions(ListPermissions),
  ListUserTargetPermissions(ListUserTargetPermissions),

  // ==== USER GROUP ====
  GetUserGroup(GetUserGroup),
  ListUserGroups(ListUserGroups),

  // ==== SEARCH ====
  FindResources(FindResources),

  // ==== PROCEDURE ====
  GetProceduresSummary(GetProceduresSummary),
  GetProcedure(GetProcedure),
  GetProcedureActionState(GetProcedureActionState),
  ListProcedures(ListProcedures),
  ListFullProcedures(ListFullProcedures),

  // ==== SERVER TEMPLATE ====
  GetServerTemplate(GetServerTemplate),
  GetServerTemplatesSummary(GetServerTemplatesSummary),
  ListServerTemplates(ListServerTemplates),
  ListFullServerTemplates(ListFullServerTemplates),

  // ==== SERVER ====
  GetServersSummary(GetServersSummary),
  GetServer(GetServer),
  GetServerState(GetServerState),
  GetPeripheryVersion(GetPeripheryVersion),
  GetServerActionState(GetServerActionState),
  GetHistoricalServerStats(GetHistoricalServerStats),
  ListServers(ListServers),
  ListFullServers(ListFullServers),
  InspectDockerContainer(InspectDockerContainer),
  GetResourceMatchingContainer(GetResourceMatchingContainer),
  GetContainerLog(GetContainerLog),
  SearchContainerLog(SearchContainerLog),
  InspectDockerNetwork(InspectDockerNetwork),
  InspectDockerImage(InspectDockerImage),
  ListDockerImageHistory(ListDockerImageHistory),
  InspectDockerVolume(InspectDockerVolume),
  #[to_string_resolver]
  ListDockerContainers(ListDockerContainers),
  #[to_string_resolver]
  ListDockerNetworks(ListDockerNetworks),
  #[to_string_resolver]
  ListDockerImages(ListDockerImages),
  #[to_string_resolver]
  ListDockerVolumes(ListDockerVolumes),
  #[to_string_resolver]
  ListComposeProjects(ListComposeProjects),

  // ==== DEPLOYMENT ====
  GetDeploymentsSummary(GetDeploymentsSummary),
  GetDeployment(GetDeployment),
  GetDeploymentContainer(GetDeploymentContainer),
  GetDeploymentActionState(GetDeploymentActionState),
  GetDeploymentStats(GetDeploymentStats),
  GetDeploymentLog(GetDeploymentLog),
  SearchDeploymentLog(SearchDeploymentLog),
  ListDeployments(ListDeployments),
  ListFullDeployments(ListFullDeployments),
  ListCommonDeploymentExtraArgs(ListCommonDeploymentExtraArgs),

  // ==== BUILD ====
  GetBuildsSummary(GetBuildsSummary),
  GetBuild(GetBuild),
  GetBuildActionState(GetBuildActionState),
  GetBuildMonthlyStats(GetBuildMonthlyStats),
  ListBuildVersions(ListBuildVersions),
  GetBuildWebhookEnabled(GetBuildWebhookEnabled),
  ListBuilds(ListBuilds),
  ListFullBuilds(ListFullBuilds),
  ListCommonBuildExtraArgs(ListCommonBuildExtraArgs),

  // ==== REPO ====
  GetReposSummary(GetReposSummary),
  GetRepo(GetRepo),
  GetRepoActionState(GetRepoActionState),
  GetRepoWebhooksEnabled(GetRepoWebhooksEnabled),
  ListRepos(ListRepos),
  ListFullRepos(ListFullRepos),

  // ==== SYNC ====
  GetResourceSyncsSummary(GetResourceSyncsSummary),
  GetResourceSync(GetResourceSync),
  GetResourceSyncActionState(GetResourceSyncActionState),
  GetSyncWebhooksEnabled(GetSyncWebhooksEnabled),
  ListResourceSyncs(ListResourceSyncs),
  ListFullResourceSyncs(ListFullResourceSyncs),

  // ==== STACK ====
  GetStacksSummary(GetStacksSummary),
  GetStack(GetStack),
  GetStackActionState(GetStackActionState),
  GetStackWebhooksEnabled(GetStackWebhooksEnabled),
  GetStackServiceLog(GetStackServiceLog),
  SearchStackServiceLog(SearchStackServiceLog),
  ListStacks(ListStacks),
  ListFullStacks(ListFullStacks),
  ListStackServices(ListStackServices),
  ListCommonStackExtraArgs(ListCommonStackExtraArgs),
  ListCommonStackBuildExtraArgs(ListCommonStackBuildExtraArgs),

  // ==== BUILDER ====
  GetBuildersSummary(GetBuildersSummary),
  GetBuilder(GetBuilder),
  ListBuilders(ListBuilders),
  ListFullBuilders(ListFullBuilders),

  // ==== ALERTER ====
  GetAlertersSummary(GetAlertersSummary),
  GetAlerter(GetAlerter),
  ListAlerters(ListAlerters),
  ListFullAlerters(ListFullAlerters),

  // ==== TOML ====
  ExportAllResourcesToToml(ExportAllResourcesToToml),
  ExportResourcesToToml(ExportResourcesToToml),

  // ==== TAG ====
  GetTag(GetTag),
  ListTags(ListTags),

  // ==== UPDATE ====
  GetUpdate(GetUpdate),
  ListUpdates(ListUpdates),

  // ==== ALERT ====
  ListAlerts(ListAlerts),
  GetAlert(GetAlert),

  // ==== SERVER STATS ====
  #[to_string_resolver]
  GetSystemInformation(GetSystemInformation),
  #[to_string_resolver]
  GetSystemStats(GetSystemStats),
  #[to_string_resolver]
  ListSystemProcesses(ListSystemProcesses),

  // ==== VARIABLE ====
  GetVariable(GetVariable),
  ListVariables(ListVariables),

  // ==== PROVIDER ====
  GetGitProviderAccount(GetGitProviderAccount),
  ListGitProviderAccounts(ListGitProviderAccounts),
  GetDockerRegistryAccount(GetDockerRegistryAccount),
  ListDockerRegistryAccounts(ListDockerRegistryAccounts),
}

pub fn router() -> Router {
  Router::new()
    .route("/", post(handler))
    .layer(middleware::from_fn(auth_request))
}

#[instrument(name = "ReadHandler", level = "debug", skip(user), fields(user_id = user.id))]
async fn handler(
  Extension(user): Extension<User>,
  Json(request): Json<ReadRequest>,
) -> serror::Result<(TypedHeader<ContentType>, String)> {
  let timer = Instant::now();
  let req_id = Uuid::new_v4();
  debug!("/read request | user: {}", user.username);
  let res =
    State
      .resolve_request(request, user)
      .await
      .map_err(|e| match e {
        resolver_api::Error::Serialization(e) => {
          anyhow!("{e:?}").context("response serialization error")
        }
        resolver_api::Error::Inner(e) => e,
      });
  if let Err(e) = &res {
    debug!("/read request {req_id} error: {e:#}");
  }
  let elapsed = timer.elapsed();
  debug!("/read request {req_id} | resolve time: {elapsed:?}");
  Ok((TypedHeader(ContentType::json()), res?))
}

fn version() -> &'static String {
  static VERSION: OnceLock<String> = OnceLock::new();
  VERSION.get_or_init(|| {
    serde_json::to_string(&GetVersionResponse {
      version: env!("CARGO_PKG_VERSION").to_string(),
    })
    .context("failed to serialize GetVersionResponse")
    .unwrap()
  })
}

impl ResolveToString<GetVersion, User> for State {
  async fn resolve_to_string(
    &self,
    GetVersion {}: GetVersion,
    _: User,
  ) -> anyhow::Result<String> {
    Ok(version().to_string())
  }
}

fn core_info() -> &'static String {
  static CORE_INFO: OnceLock<String> = OnceLock::new();
  CORE_INFO.get_or_init(|| {
    let config = core_config();
    let info = GetCoreInfoResponse {
      title: config.title.clone(),
      monitoring_interval: config.monitoring_interval,
      webhook_base_url: config
        .webhook_base_url
        .clone()
        .unwrap_or_else(|| config.host.clone()),
      transparent_mode: config.transparent_mode,
      ui_write_disabled: config.ui_write_disabled,
      disable_confirm_dialog: config.disable_confirm_dialog,
      github_webhook_owners: config
        .github_webhook_app
        .installations
        .iter()
        .map(|i| i.namespace.to_string())
        .collect(),
    };
    serde_json::to_string(&info)
      .context("failed to serialize GetCoreInfoResponse")
      .unwrap()
  })
}

impl ResolveToString<GetCoreInfo, User> for State {
  async fn resolve_to_string(
    &self,
    GetCoreInfo {}: GetCoreInfo,
    _: User,
  ) -> anyhow::Result<String> {
    Ok(core_info().to_string())
  }
}

impl Resolve<ListSecrets, User> for State {
  async fn resolve(
    &self,
    ListSecrets { target }: ListSecrets,
    _: User,
  ) -> anyhow::Result<ListSecretsResponse> {
    let mut secrets = core_config()
      .secrets
      .keys()
      .cloned()
      .collect::<HashSet<_>>();

    if let Some(target) = target {
      let server_id = match target {
        ResourceTarget::Server(id) => Some(id),
        ResourceTarget::Builder(id) => {
          match resource::get::<Builder>(&id).await?.config {
            BuilderConfig::Server(config) => Some(config.server_id),
            BuilderConfig::Aws(config) => {
              secrets.extend(config.secrets);
              None
            }
          }
        }
        _ => {
          return Err(anyhow!("target must be `Server` or `Builder`"))
        }
      };
      if let Some(id) = server_id {
        let server = resource::get::<Server>(&id).await?;
        let more = periphery_client(&server)?
          .request(periphery_client::api::ListSecrets {})
          .await
          .with_context(|| {
            format!(
              "failed to get secrets from server {}",
              server.name
            )
          })?;
        secrets.extend(more);
      }
    }

    let mut secrets = secrets.into_iter().collect::<Vec<_>>();
    secrets.sort();

    Ok(secrets)
  }
}

impl Resolve<ListGitProvidersFromConfig, User> for State {
  async fn resolve(
    &self,
    ListGitProvidersFromConfig { target }: ListGitProvidersFromConfig,
    user: User,
  ) -> anyhow::Result<ListGitProvidersFromConfigResponse> {
    let mut providers = core_config().git_providers.clone();

    if let Some(target) = target {
      match target {
        ResourceTarget::Server(id) => {
          merge_git_providers_for_server(&mut providers, &id).await?;
        }
        ResourceTarget::Builder(id) => {
          match resource::get::<Builder>(&id).await?.config {
            BuilderConfig::Server(config) => {
              merge_git_providers_for_server(
                &mut providers,
                &config.server_id,
              )
              .await?;
            }
            BuilderConfig::Aws(config) => {
              merge_git_providers(
                &mut providers,
                config.git_providers,
              );
            }
          }
        }
        _ => {
          return Err(anyhow!("target must be `Server` or `Builder`"))
        }
      }
    }

    let (builds, repos, syncs) = tokio::try_join!(
      resource::list_full_for_user::<Build>(
        Default::default(),
        &user
      ),
      resource::list_full_for_user::<Repo>(Default::default(), &user),
      resource::list_full_for_user::<ResourceSync>(
        Default::default(),
        &user
      ),
    )?;

    for build in builds {
      if !providers
        .iter()
        .any(|provider| provider.domain == build.config.git_provider)
      {
        providers.push(GitProvider {
          domain: build.config.git_provider,
          https: build.config.git_https,
          accounts: Default::default(),
        });
      }
    }
    for repo in repos {
      if !providers
        .iter()
        .any(|provider| provider.domain == repo.config.git_provider)
      {
        providers.push(GitProvider {
          domain: repo.config.git_provider,
          https: repo.config.git_https,
          accounts: Default::default(),
        });
      }
    }
    for sync in syncs {
      if !providers
        .iter()
        .any(|provider| provider.domain == sync.config.git_provider)
      {
        providers.push(GitProvider {
          domain: sync.config.git_provider,
          https: sync.config.git_https,
          accounts: Default::default(),
        });
      }
    }

    providers.sort();

    Ok(providers)
  }
}

impl Resolve<ListDockerRegistriesFromConfig, User> for State {
  async fn resolve(
    &self,
    ListDockerRegistriesFromConfig { target }: ListDockerRegistriesFromConfig,
    _: User,
  ) -> anyhow::Result<ListDockerRegistriesFromConfigResponse> {
    let mut registries = core_config().docker_registries.clone();

    if let Some(target) = target {
      match target {
        ResourceTarget::Server(id) => {
          merge_docker_registries_for_server(&mut registries, &id)
            .await?;
        }
        ResourceTarget::Builder(id) => {
          match resource::get::<Builder>(&id).await?.config {
            BuilderConfig::Server(config) => {
              merge_docker_registries_for_server(
                &mut registries,
                &config.server_id,
              )
              .await?;
            }
            BuilderConfig::Aws(config) => {
              merge_docker_registries(
                &mut registries,
                config.docker_registries,
              );
            }
          }
        }
        _ => {
          return Err(anyhow!("target must be `Server` or `Builder`"))
        }
      }
    }

    registries.sort();

    Ok(registries)
  }
}

async fn merge_git_providers_for_server(
  providers: &mut Vec<GitProvider>,
  server_id: &str,
) -> anyhow::Result<()> {
  let server = resource::get::<Server>(server_id).await?;
  let more = periphery_client(&server)?
    .request(periphery_client::api::ListGitProviders {})
    .await
    .with_context(|| {
      format!(
        "failed to get git providers from server {}",
        server.name
      )
    })?;
  merge_git_providers(providers, more);
  Ok(())
}

fn merge_git_providers(
  providers: &mut Vec<GitProvider>,
  more: Vec<GitProvider>,
) {
  for incoming_provider in more {
    if let Some(provider) = providers
      .iter_mut()
      .find(|provider| provider.domain == incoming_provider.domain)
    {
      for account in incoming_provider.accounts {
        if !provider.accounts.contains(&account) {
          provider.accounts.push(account);
        }
      }
    } else {
      providers.push(incoming_provider);
    }
  }
}

async fn merge_docker_registries_for_server(
  registries: &mut Vec<DockerRegistry>,
  server_id: &str,
) -> anyhow::Result<()> {
  let server = resource::get::<Server>(server_id).await?;
  let more = periphery_client(&server)?
    .request(periphery_client::api::ListDockerRegistries {})
    .await
    .with_context(|| {
      format!(
        "failed to get docker registries from server {}",
        server.name
      )
    })?;
  merge_docker_registries(registries, more);
  Ok(())
}

fn merge_docker_registries(
  registries: &mut Vec<DockerRegistry>,
  more: Vec<DockerRegistry>,
) {
  for incoming_registry in more {
    if let Some(registry) = registries
      .iter_mut()
      .find(|registry| registry.domain == incoming_registry.domain)
    {
      for account in incoming_registry.accounts {
        if !registry.accounts.contains(&account) {
          registry.accounts.push(account);
        }
      }
    } else {
      registries.push(incoming_registry);
    }
  }
}
