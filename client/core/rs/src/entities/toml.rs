use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::{
  alerter::PartialAlerterConfig,
  build::PartialBuildConfig,
  builder::PartialBuilderConfig,
  deployment::PartialDeploymentConfig,
  permission::PermissionLevel,
  procedure::PartialProcedureConfig,
  repo::PartialRepoConfig,
  server::PartialServerConfig,
  server_template::PartialServerTemplateConfig,
  sync::PartialResourceSyncConfig,
  update::{ResourceTarget, ResourceTargetVariant},
  variable::Variable,
};

/// Specifies resources to sync on monitor
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ResourcesToml {
  #[serde(
    default,
    rename = "server",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub servers: Vec<ResourceToml<PartialServerConfig>>,

  #[serde(
    default,
    rename = "deployment",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub deployments: Vec<ResourceToml<PartialDeploymentConfig>>,

  #[serde(
    default,
    rename = "build",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub builds: Vec<ResourceToml<PartialBuildConfig>>,

  #[serde(
    default,
    rename = "repo",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub repos: Vec<ResourceToml<PartialRepoConfig>>,

  #[serde(
    default,
    rename = "procedure",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub procedures: Vec<ResourceToml<PartialProcedureConfig>>,

  #[serde(
    default,
    rename = "alerter",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub alerters: Vec<ResourceToml<PartialAlerterConfig>>,

  #[serde(
    default,
    rename = "builder",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub builders: Vec<ResourceToml<PartialBuilderConfig>>,

  #[serde(
    default,
    rename = "server_template",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub server_templates:
    Vec<ResourceToml<PartialServerTemplateConfig>>,

  #[serde(
    default,
    rename = "resource_sync",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub resource_syncs: Vec<ResourceToml<PartialResourceSyncConfig>>,

  #[serde(
    default,
    rename = "user_group",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub user_groups: Vec<UserGroupToml>,

  #[serde(
    default,
    rename = "variable",
    skip_serializing_if = "Vec::is_empty"
  )]
  pub variables: Vec<Variable>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceToml<PartialConfig: Default> {
  /// The resource name. Required
  pub name: String,

  /// The resource description. Optional.
  #[serde(default, skip_serializing_if = "String::is_empty")]
  pub description: String,

  /// Tag ids or names. Optional
  #[serde(default, skip_serializing_if = "Vec::is_empty")]
  pub tags: Vec<String>,

  /// Optional. Only relevant for deployments.
  ///
  /// Will ensure deployment is running with the latest configuration.
  /// Deploy actions to achieve this will be included in the sync.
  #[serde(default, skip_serializing_if = "is_false")]
  pub deploy: bool,

  /// Optional. Only relevant for deployments using the 'deploy' sync feature.
  ///
  /// Specify other deployments as dependencies.
  /// The sync will ensure the deployment will only be deployed 'after' its dependencies.
  #[serde(default, skip_serializing_if = "Vec::is_empty")]
  pub after: Vec<String>,

  /// Resource specific configuration.
  #[serde(default)]
  pub config: PartialConfig,
}

fn is_false(b: &bool) -> bool {
  !b
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserGroupToml {
  /// User group name
  pub name: String,

  /// Users in the group
  #[serde(default)]
  pub users: Vec<String>,

  /// Give the user group elevated permissions on all resources of a certain type
  #[serde(default)]
  pub all: HashMap<ResourceTargetVariant, PermissionLevel>,

  /// Permissions given to the group
  #[serde(default, alias = "permission")]
  pub permissions: Vec<PermissionToml>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PermissionToml {
  /// Id can be:
  ///   - resource name. `id = "abcd-build"`
  ///   - regex matching resource names. `id = "\^(.+)-build-([0-9]+)$\"`
  pub target: ResourceTarget,

  /// The permission level:
  ///   - None
  ///   - Read
  ///   - Execute
  ///   - Write
  pub level: PermissionLevel,
}
