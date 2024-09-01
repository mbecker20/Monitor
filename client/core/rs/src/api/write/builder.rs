use derive_empty_traits::EmptyTraits;
use resolver_api::derive::Request;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::entities::builder::{Builder, PartialBuilderConfig};

use super::KomodoWriteRequest;

//

/// Create a builder. Response: [Builder].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(KomodoWriteRequest)]
#[response(Builder)]
pub struct CreateBuilder {
  /// The name given to newly created builder.
  pub name: String,
  /// Optional partial config to initialize the builder with.
  pub config: PartialBuilderConfig,
}

//

/// Creates a new builder with given `name` and the configuration
/// of the builder at the given `id`. Response: [Builder]
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(KomodoWriteRequest)]
#[response(Builder)]
pub struct CopyBuilder {
  /// The name of the new builder.
  pub name: String,
  /// The id of the builder to copy.
  pub id: String,
}

//

/// Deletes the builder at the given id, and returns the deleted builder.
/// Response: [Builder]
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(KomodoWriteRequest)]
#[response(Builder)]
pub struct DeleteBuilder {
  /// The id or name of the builder to delete.
  pub id: String,
}

//

/// Update the builder at the given id, and return the updated builder.
/// Response: [Builder].
///
/// Note. This method updates only the fields which are set in the [PartialBuilderConfig],
/// effectively merging diffs into the final document.
/// This is helpful when multiple users are using
/// the same resources concurrently by ensuring no unintentional
/// field changes occur from out of date local state.
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(KomodoWriteRequest)]
#[response(Builder)]
pub struct UpdateBuilder {
  /// The id of the builder to update.
  pub id: String,
  /// The partial config update to apply.
  pub config: PartialBuilderConfig,
}
