use clap::{Parser, Subcommand};
use derive_variants::EnumVariants;
use resolver_api::HasResponse;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};
use typeshare::typeshare;

mod build;
mod deployment;
mod procedure;
mod repo;
mod server;
mod server_template;
mod stack;
mod sync;

pub use build::*;
pub use deployment::*;
pub use procedure::*;
pub use repo::*;
pub use server::*;
pub use server_template::*;
pub use stack::*;
pub use sync::*;

use crate::entities::{NoData, I64};

pub trait KomodoExecuteRequest: HasResponse {}

/// A wrapper for all Komodo exections.
#[typeshare]
#[derive(
  Debug,
  Clone,
  PartialEq,
  Serialize,
  Deserialize,
  EnumVariants,
  Subcommand,
)]
#[variant_derive(
  Debug,
  Clone,
  Copy,
  Serialize,
  Deserialize,
  Display,
  EnumString
)]
#[serde(tag = "type", content = "params")]
pub enum Execution {
  /// The "null" execution. Does nothing.
  None(NoData),

  // PROCEDURE
  RunProcedure(RunProcedure),

  // BUILD
  RunBuild(RunBuild),
  CancelBuild(CancelBuild),

  // DEPLOYMENT
  Deploy(Deploy),
  StartDeployment(StartDeployment),
  RestartDeployment(RestartDeployment),
  PauseDeployment(PauseDeployment),
  UnpauseDeployment(UnpauseDeployment),
  StopDeployment(StopDeployment),
  DestroyDeployment(DestroyDeployment),

  // REPO
  CloneRepo(CloneRepo),
  PullRepo(PullRepo),
  BuildRepo(BuildRepo),
  CancelRepoBuild(CancelRepoBuild),

  // SERVER (Container)
  StartContainer(StartContainer),
  RestartContainer(RestartContainer),
  PauseContainer(PauseContainer),
  UnpauseContainer(UnpauseContainer),
  StopContainer(StopContainer),
  DestroyContainer(DestroyContainer),
  StartAllContainers(StartAllContainers),
  RestartAllContainers(RestartAllContainers),
  PauseAllContainers(PauseAllContainers),
  UnpauseAllContainers(UnpauseAllContainers),
  StopAllContainers(StopAllContainers),
  PruneContainers(PruneContainers),

  // SERVER (Prune)
  DeleteNetwork(DeleteNetwork),
  PruneNetworks(PruneNetworks),
  DeleteImage(DeleteImage),
  PruneImages(PruneImages),
  DeleteVolume(DeleteVolume),
  PruneVolumes(PruneVolumes),
  PruneDockerBuilders(PruneDockerBuilders),
  PruneBuildx(PruneBuildx),
  PruneSystem(PruneSystem),

  // SYNC
  RunSync(RunSync),

  // STACK
  DeployStack(DeployStack),
  StartStack(StartStack),
  RestartStack(RestartStack),
  PauseStack(PauseStack),
  UnpauseStack(UnpauseStack),
  StopStack(StopStack),
  DestroyStack(DestroyStack),

  // SLEEP
  Sleep(Sleep),
}

#[typeshare]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Parser)]
pub struct Sleep {
  #[serde(default)]
  pub duration_ms: I64,
}
