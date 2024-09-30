use std::sync::OnceLock;

use anyhow::Context;
use openidconnect::{
  core::{CoreClient, CoreProviderMetadata},
  reqwest::async_http_client,
  ClientId, ClientSecret, IssuerUrl, RedirectUrl,
};

use crate::config::core_config;

static DEFAULT_OIDC_CLIENT: OnceLock<Option<CoreClient>> =
  OnceLock::new();

pub fn default_oidc_client() -> Option<&'static CoreClient> {
  DEFAULT_OIDC_CLIENT
    .get()
    .expect("OIDC client get before init")
    .as_ref()
}

pub async fn init_default_oidc_client() {
  let config = core_config();
  if !config.oidc_enabled
    || config.oidc_provider.is_empty()
    || config.oidc_client_id.is_empty()
    || config.oidc_client_secret.is_empty()
  {
    DEFAULT_OIDC_CLIENT
      .set(None)
      .expect("Default OIDC client initialized twice");
    return;
  }
  async {
    let provider = config.oidc_provider.to_string();
    // Use OpenID Connect Discovery to fetch the provider metadata.
    let provider_metadata = CoreProviderMetadata::discover_async(
      IssuerUrl::new(if provider.ends_with('/') {
        provider
      } else {
        provider + "/"
      })?,
      async_http_client,
    )
    .await?;

    // Create an OpenID Connect client by specifying the client ID, client secret, authorization URL
    // and token URL.
    let client = CoreClient::from_provider_metadata(
      provider_metadata,
      ClientId::new(config.oidc_client_id.to_string()),
      Some(ClientSecret::new(config.oidc_client_secret.to_string())),
    )
    // Set the URL the user will be redirected to after the authorization process.
    .set_redirect_uri(RedirectUrl::new(format!(
      "{}/auth/oidc/callback",
      core_config().host
    ))?);

    DEFAULT_OIDC_CLIENT
      .set(Some(client))
      .expect("Default OIDC client initialized twice");

    anyhow::Ok(())
  }
  .await
  .context("Failed to init default OIDC client")
  .unwrap();
}
