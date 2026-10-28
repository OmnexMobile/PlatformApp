import {Platform} from 'react-native';

const DEFAULT_SCOPES = ['openid', 'email'];
const AZURE_DEFAULT_SCOPES = ['openid', 'profile', 'email', 'offline_access'];
const DEFAULT_RESPONSE_TYPES = ['code'];
const DEFAULT_HTTP_READ_TIMEOUT_SECONDS = 10;
export const DEFAULT_SSO_AUTHORIZE_TIMEOUT_SECONDS = 90;

const PLATFORM_CALLBACK_SCHEMES = {
  ios: 'com.omnex.integratedapp',
  android: 'com.omnex.integratedapp',
};

const AZURE_AUTHORITY_HOSTS = [
  'login.microsoftonline.com',
  'login.windows.net',
  'sts.windows.net',
  'ciamlogin.com',
  'b2clogin.com',
];
const AZURE_ANDROID_REDIRECT_SCHEME = 'msauth';
const AZURE_PROVIDER_HINT_PATTERNS = [
  /azure/i,
  /microsoft/i,
  /entra/i,
  /aad/i,
  /b2c/i,
];
const PINGONE_PROVIDER_HINT_PATTERNS = [/pingone/i, /pingidentity/i, /ping access/i];
const PINGONE_HOST_PATTERNS = [/pingone\./i, /pingidentity\./i];
const AZURE_ENDPOINT_PATTERNS = [
  /\/oauth2\/v2\.0\/authorize$/i,
  /\/oauth2\/v2\.0\/token$/i,
  /\/oauth2\/authorize$/i,
  /\/oauth2\/token$/i,
  /\/tfp\//i,
  /\bb2c_1_/i,
];

const ensureString = value =>
  value === null || value === undefined ? '' : String(value).trim();

const stripTrailingSlash = value => ensureString(value).replace(/\/+$/, '');

const isHttpUrl = value => /^https?:\/\//i.test(ensureString(value));

const getUriScheme = value => {
  const normalizedValue = ensureString(value);
  const schemeMatch = normalizedValue.match(/^([a-z][a-z0-9+.-]*):/i);
  return schemeMatch ? schemeMatch[1].toLowerCase() : '';
};

const isCustomSchemeUrl = value => {
  const scheme = getUriScheme(value);
  return Boolean(scheme) && !['http', 'https', 'javascript'].includes(scheme);
};

const getUrlHostname = value => {
  const normalizedValue = ensureString(value);

  if (!normalizedValue) {
    return '';
  }

  try {
    if (typeof URL === 'function') {
      return ensureString(new URL(normalizedValue).hostname).toLowerCase();
    }
  } catch (error) {
    // Fall through to regex parsing below.
  }

  const hostMatch = normalizedValue.match(/^https?:\/\/([^/:?#]+)/i);
  return hostMatch ? hostMatch[1].toLowerCase() : '';
};

const isAzureAuthorityHost = hostname =>
  AZURE_AUTHORITY_HOSTS.some(
    authorityHost =>
      hostname === authorityHost || hostname.endsWith(`.${authorityHost}`),
  );

const isAzureAuthorityUrl = value => {
  const hostname = getUrlHostname(value);
  return Boolean(hostname) && isAzureAuthorityHost(hostname);
};

const isAzureEndpointPattern = value => {
  const normalizedValue = ensureString(value);
  return AZURE_ENDPOINT_PATTERNS.some(pattern => pattern.test(normalizedValue));
};

const isAzureProviderHint = value => {
  const normalizedValue = ensureString(value);
  return AZURE_PROVIDER_HINT_PATTERNS.some(pattern =>
    pattern.test(normalizedValue),
  );
};

const isPingOneProviderHint = value => {
  const normalizedValue = ensureString(value);
  return PINGONE_PROVIDER_HINT_PATTERNS.some(pattern =>
    pattern.test(normalizedValue),
  );
};

const isPingOneAuthorityUrl = value => {
  const hostname = getUrlHostname(value);
  const normalizedValue = ensureString(value);

  return (
    PINGONE_HOST_PATTERNS.some(pattern => pattern.test(hostname)) ||
    PINGONE_HOST_PATTERNS.some(pattern => pattern.test(normalizedValue))
  );
};

const isJsonLikeValue = value => {
  const normalizedValue = ensureString(value);
  return (
    normalizedValue.startsWith('{') || normalizedValue.startsWith('[')
  );
};

const pickFirstDefinedValue = (...values) =>
  values.find(value => ensureString(value).length > 0);

const sanitizeDiscoveryParametersForLogs = discoveryParameters => {
  const sanitizedParameters = {};

  Object.keys(discoveryParameters || {}).forEach(key => {
    sanitizedParameters[key] =
      key.toLowerCase() === 'client_secret'
        ? '[redacted]'
        : discoveryParameters[key];
  });

  return sanitizedParameters;
};

export const parseJsonLikeObject = value => {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value;
  }

  const normalizedValue = ensureString(value);

  if (!isJsonLikeValue(normalizedValue)) {
    return {};
  }

  try {
    return JSON.parse(normalizedValue.replace(/'/g, '"'));
  } catch (error) {
    console.log('SSO config parseJsonLikeObject error', error);
    return {};
  }
};

export const parseBooleanValue = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', '1', 'yes'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0', 'no'].includes(normalizedValue)) {
      return false;
    }
  }

  return fallback;
};

const parseIntegerValue = (value, fallback) => {
  const parsedValue = parseInt(value, 10);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const padBase64Value = value => {
  const remainder = value.length % 4;

  if (remainder === 0) {
    return value;
  }

  return `${value}${'='.repeat(4 - remainder)}`;
};

const decodeJwtClaims = token => {
  const normalizedToken = ensureString(token);
  const jwtParts = normalizedToken.split('.');

  if (jwtParts.length < 2 || typeof global.atob !== 'function') {
    return {};
  }

  try {
    const base64Payload = padBase64Value(
      jwtParts[1].replace(/-/g, '+').replace(/_/g, '/'),
    );

    return JSON.parse(global.atob(base64Payload));
  } catch (error) {
    console.log('SSO config decodeJwtClaims error', error);
    return {};
  }
};

const isCompactJwsJwt = token => ensureString(token).split('.').length === 3;

const getDisplayLoginIdentifierFromClaims = (...claimSets) => {
  for (const claimSet of claimSets) {
    const displayLoginIdentifier = ensureString(
      claimSet?.preferred_username ||
        claimSet?.email ||
        claimSet?.upn ||
        claimSet?.unique_name ||
        claimSet?.sub,
    );

    if (displayLoginIdentifier) {
      return displayLoginIdentifier;
    }
  }

  return '';
};

const hasExplicitScopeValue = scopeValue => {
  if (Array.isArray(scopeValue)) {
    return scopeValue.some(scope => Boolean(ensureString(scope)));
  }

  return typeof scopeValue === 'string' && scopeValue.trim().length > 0;
};

export const parseScopes = (scopeValue, options = {}) => {
  const defaultScopes =
    options.useAzureDefaults === true ? AZURE_DEFAULT_SCOPES : DEFAULT_SCOPES;

  if (Array.isArray(scopeValue) && scopeValue.length > 0) {
    const scopes = scopeValue
      .map(scope => ensureString(scope).replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    return scopes.length > 0 ? scopes : defaultScopes;
  }

  if (typeof scopeValue === 'string' && scopeValue.trim().length > 0) {
    const scopes = scopeValue
      .replace(/[\[\]]/g, ' ')
      .replace(/['"]/g, '')
      .split(/[\s,]+/)
      .map(scope => scope.trim())
      .filter(Boolean);

    return scopes.length > 0 ? scopes : defaultScopes;
  }

  return defaultScopes;
};

const deriveAzureServiceConfiguration = issuer => {
  const normalizedIssuer = stripTrailingSlash(ensureString(issuer));
  if (!normalizedIssuer) {
    return undefined;
  }

  // Accept both .../{tenant} and .../{tenant}/v2.0 issuer forms.
  const tenantBaseMatch = normalizedIssuer.match(
    /^(https:\/\/(?:login\.microsoftonline\.com|login\.windows\.net|sts\.windows\.net)\/[^/]+)(?:\/v2\.0)?$/i,
  );

  if (!tenantBaseMatch) {
    return undefined;
  }

  const tenantBase = tenantBaseMatch[1];
  return {
    authorizationEndpoint: `${tenantBase}/oauth2/v2.0/authorize`,
    tokenEndpoint: `${tenantBase}/oauth2/v2.0/token`,
    endSessionEndpoint: `${tenantBase}/oauth2/v2.0/logout`,
  };
};

export const parseResponseTypes = responseTypeValue => {
  if (Array.isArray(responseTypeValue) && responseTypeValue.length > 0) {
    const responseTypes = responseTypeValue
      .map(type => ensureString(type).replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    return responseTypes.length > 0 ? responseTypes : DEFAULT_RESPONSE_TYPES;
  }

  if (
    typeof responseTypeValue === 'string' &&
    responseTypeValue.trim().length > 0
  ) {
    const responseTypes = responseTypeValue
      .replace(/['"]/g, '')
      .split(/[\s,]+/)
      .map(type => type.trim())
      .filter(Boolean);

    return responseTypes.length > 0 ? responseTypes : DEFAULT_RESPONSE_TYPES;
  }

  return DEFAULT_RESPONSE_TYPES;
};

const getAzurePlatformSsoRedirectConfig = (
  platform = Platform.OS,
  options = {},
) => {
  if (platform === 'ios') {
    const scheme = `msauth.${PLATFORM_CALLBACK_SCHEMES.ios}`;
    const iosVariant = ensureString(options.iosVariant).toLowerCase();
    const redirectUrl =
      iosVariant === 'singleslash' ? `${scheme}:/auth` : `${scheme}://auth`;

    return {
      scheme,
      redirectUrl,
      endSessionRedirectUri: redirectUrl,
    };
  }

  const androidVariant = ensureString(options.androidVariant).toLowerCase();
  // Entra's Authentication UI only accepts customScheme://... (double slash).
  // Keep single-slash as an explicit retry variant for older registrations.
  const useSingleSlashVariant = androidVariant === 'singleslash';
  const scheme = PLATFORM_CALLBACK_SCHEMES.android;

  return {
    scheme,
    redirectUrl: useSingleSlashVariant
      ? `${scheme}:/callback`
      : `${scheme}://callback`,
    endSessionRedirectUri: useSingleSlashVariant
      ? `${scheme}:/logoutCallback`
      : `${scheme}://logoutCallback`,
  };
};

const getDefaultPlatformSsoRedirectConfig = (
  platform = Platform.OS,
  options = {},
) => {
  const scheme =
    platform === 'ios'
      ? PLATFORM_CALLBACK_SCHEMES.ios
      : PLATFORM_CALLBACK_SCHEMES.android;

  if (platform === 'ios') {
    const iosVariant = ensureString(options.iosVariant).toLowerCase();
    const useDoubleSlashVariant = iosVariant === 'doubleslash';

    return {
      scheme,
      redirectUrl: useDoubleSlashVariant
        ? `${scheme}://callback`
        : `${scheme}:/callback`,
      endSessionRedirectUri: useDoubleSlashVariant
        ? `${scheme}://logoutCallback`
        : `${scheme}:/logoutCallback`,
    };
  }

  const androidVariant = ensureString(options.androidVariant).toLowerCase();
  const useDoubleSlashVariant = androidVariant === 'doubleslash';

  return {
    scheme,
    redirectUrl: useDoubleSlashVariant
      ? `${scheme}://callback`
      : `${scheme}:/callback`,
    endSessionRedirectUri: useDoubleSlashVariant
      ? `${scheme}://logoutCallback`
      : `${scheme}:/logoutCallback`,
  };
};

const getIosPlatformRedirectVariant = value => {
  const normalizedValue = ensureString(value);
  const defaultScheme = PLATFORM_CALLBACK_SCHEMES.ios;

  if (
    normalizedValue === `${defaultScheme}://callback` ||
    normalizedValue === `${defaultScheme}://logoutCallback`
  ) {
    return 'doubleslash';
  }

  if (
    normalizedValue === `${defaultScheme}:/callback` ||
    normalizedValue === `${defaultScheme}:/logoutCallback`
  ) {
    return 'singleslash';
  }

  if (normalizedValue.startsWith(`${defaultScheme}://`)) {
    return 'doubleslash';
  }

  if (normalizedValue.startsWith(`${defaultScheme}:/`)) {
    return 'singleslash';
  }

  return '';
};

const isPlatformIosCallbackRedirect = value => {
  const defaultScheme = PLATFORM_CALLBACK_SCHEMES.ios;
  const normalizedValue = ensureString(value);

  return (
    normalizedValue === `${defaultScheme}:/callback` ||
    normalizedValue === `${defaultScheme}://callback` ||
    normalizedValue === `${defaultScheme}:/logoutCallback` ||
    normalizedValue === `${defaultScheme}://logoutCallback`
  );
};

const getAlternateIosPlatformRedirectVariant = value => {
  const currentVariant = getIosPlatformRedirectVariant(value);

  if (currentVariant === 'singleslash') {
    return 'doubleSlash';
  }

  if (currentVariant === 'doubleslash') {
    return 'singleSlash';
  }

  return '';
};

const isAzureRedirectUrl = value => {
  const scheme = getUriScheme(value);
  return scheme === AZURE_ANDROID_REDIRECT_SCHEME || ensureString(value).startsWith('msauth.');
};

const getProviderHint = (rawConfig = {}, additionalParameters = {}) =>
  pickFirstDefinedValue(
    rawConfig.provider,
    rawConfig.providerName,
    rawConfig.provider_name,
    rawConfig.providerType,
    rawConfig.provider_type,
    rawConfig.identityProvider,
    rawConfig.identity_provider,
    rawConfig.identityProviderType,
    rawConfig.identity_provider_type,
    rawConfig.idp,
    rawConfig.idpName,
    rawConfig.idp_name,
    rawConfig.idpType,
    rawConfig.idp_type,
    rawConfig.authProvider,
    rawConfig.auth_provider,
    rawConfig.ssoProvider,
    rawConfig.sso_provider,
    rawConfig.authorityType,
    rawConfig.authority_type,
    additionalParameters.provider,
    additionalParameters.providerName,
    additionalParameters.provider_name,
    additionalParameters.providerType,
    additionalParameters.provider_type,
    additionalParameters.identityProvider,
    additionalParameters.identity_provider,
    additionalParameters.identityProviderType,
    additionalParameters.identity_provider_type,
    additionalParameters.idp,
    additionalParameters.idpName,
    additionalParameters.idp_name,
    additionalParameters.idpType,
    additionalParameters.idp_type,
    additionalParameters.authProvider,
    additionalParameters.auth_provider,
    additionalParameters.ssoProvider,
    additionalParameters.sso_provider,
    additionalParameters.authorityType,
    additionalParameters.authority_type,
  );

const parseBooleanLikeValue = value =>
  typeof value === 'boolean'
    ? value
    : typeof value === 'string'
    ? ['true', '1', 'yes'].includes(value.trim().toLowerCase())
    : typeof value === 'number'
    ? value === 1
    : false;

const isGuidLikeValue = value => {
  const normalizedValue = ensureString(value);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    normalizedValue,
  );
};

const shouldForceAzureRedirect = (
  rawConfig = {},
  additionalParameters = {},
) =>
  [
    rawConfig.forceAzureRedirect,
    rawConfig.force_azure_redirect,
    rawConfig.forceAzureCallback,
    rawConfig.force_azure_callback,
    additionalParameters.forceAzureRedirect,
    additionalParameters.force_azure_redirect,
    additionalParameters.forceAzureCallback,
    additionalParameters.force_azure_callback,
  ].some(parseBooleanLikeValue);

const shouldForcePlatformCallbackRedirect = (
  rawConfig = {},
  additionalParameters = {},
) =>
  [
    rawConfig.forcePlatformCallbackRedirect,
    rawConfig.force_platform_callback_redirect,
    rawConfig.forceDefaultCallbackRedirect,
    rawConfig.force_default_callback_redirect,
    additionalParameters.forcePlatformCallbackRedirect,
    additionalParameters.force_platform_callback_redirect,
    additionalParameters.forceDefaultCallbackRedirect,
    additionalParameters.force_default_callback_redirect,
  ].some(parseBooleanLikeValue);

const getExplicitRedirectConfig = (
  rawConfig = {},
  additionalParameters = {},
) => {
  const redirectUrl = pickFirstDefinedValue(
    rawConfig.redirectUrl,
    rawConfig.redirectUri,
    rawConfig.redirect_uri,
    additionalParameters.redirectUrl,
    additionalParameters.redirectUri,
    additionalParameters.redirect_uri,
  );
  const endSessionRedirectUri = pickFirstDefinedValue(
    rawConfig.endSessionRedirectUri,
    rawConfig.end_session_redirect_uri,
    rawConfig.postLogoutRedirectUrl,
    rawConfig.post_logout_redirect_url,
    rawConfig.logoutRedirectUri,
    rawConfig.logout_redirect_uri,
    additionalParameters.endSessionRedirectUri,
    additionalParameters.end_session_redirect_uri,
    additionalParameters.postLogoutRedirectUrl,
    additionalParameters.post_logout_redirect_url,
    additionalParameters.logoutRedirectUri,
    additionalParameters.logout_redirect_uri,
  );
  const customUriScheme = pickFirstDefinedValue(
    rawConfig.customUriScheme,
    rawConfig.custom_uri_scheme,
    additionalParameters.customUriScheme,
    additionalParameters.custom_uri_scheme,
  );
  const normalizedRedirectUrl = ensureString(redirectUrl);
  const normalizedEndSessionRedirectUri = ensureString(endSessionRedirectUri);
  const scheme =
    getUriScheme(normalizedRedirectUrl) || ensureString(customUriScheme);

  if (!normalizedRedirectUrl || !scheme || !isCustomSchemeUrl(normalizedRedirectUrl)) {
    return undefined;
  }

  return {
    scheme,
    redirectUrl: normalizedRedirectUrl,
    endSessionRedirectUri:
      normalizedEndSessionRedirectUri &&
      isCustomSchemeUrl(normalizedEndSessionRedirectUri)
        ? normalizedEndSessionRedirectUri
        : normalizedRedirectUrl,
    isAzureRedirect:
      scheme === AZURE_ANDROID_REDIRECT_SCHEME ||
      normalizedRedirectUrl.startsWith('msauth.'),
  };
};

const isPingOneSsoConfig = ({
  rawConfig = {},
  issuer = '',
  discoveryUri = '',
  serviceConfiguration,
  additionalParameters = {},
  providerHint = '',
} = {}) => {
  const urlCandidates = [
    issuer,
    discoveryUri,
    rawConfig.issuer,
    rawConfig.discoveryUri,
    rawConfig.discovery_uri,
    rawConfig.wellKnownEndpoint,
    rawConfig.well_known_endpoint,
    rawConfig.authorizationEndpoint,
    rawConfig.authorization_endpoint,
    serviceConfiguration?.authorizationEndpoint,
    serviceConfiguration?.tokenEndpoint,
    additionalParameters.authorizationEndpoint,
    additionalParameters.authorization_endpoint,
    additionalParameters.tokenEndpoint,
    additionalParameters.token_endpoint,
  ];

  return (
    parseBooleanLikeValue(rawConfig.isPingOneProvider) ||
    parseBooleanLikeValue(additionalParameters.isPingOneProvider) ||
    isPingOneProviderHint(providerHint) ||
    urlCandidates.some(value => isPingOneAuthorityUrl(value))
  );
};

const isAzureSsoConfig = ({
  rawConfig = {},
  issuer = '',
  discoveryUri = '',
  serviceConfiguration,
  additionalParameters = {},
  providerHint = '',
} = {}) => {
  const hasAzureProviderHint =
    parseBooleanLikeValue(rawConfig.isAzureProvider) ||
    parseBooleanLikeValue(additionalParameters.isAzureProvider) ||
    isAzureProviderHint(providerHint);
  const hasGuidLikeClientId = isGuidLikeValue(rawConfig.clientId);
  const urlCandidates = [
    issuer,
    discoveryUri,
    rawConfig.issuer,
    rawConfig.discoveryUri,
    rawConfig.discovery_uri,
    rawConfig.wellKnownEndpoint,
    rawConfig.well_known_endpoint,
    rawConfig.authorizationEndpoint,
    rawConfig.authorization_endpoint,
    rawConfig.tokenEndpoint,
    rawConfig.token_endpoint,
    rawConfig.endSessionEndpoint,
    rawConfig.end_session_endpoint,
    serviceConfiguration?.authorizationEndpoint,
    serviceConfiguration?.tokenEndpoint,
    serviceConfiguration?.endSessionEndpoint,
    additionalParameters.authorizationEndpoint,
    additionalParameters.authorization_endpoint,
    additionalParameters.tokenEndpoint,
    additionalParameters.token_endpoint,
    additionalParameters.endSessionEndpoint,
    additionalParameters.end_session_endpoint,
    additionalParameters.logoutEndpoint,
    additionalParameters.logout_endpoint,
    rawConfig.redirectUrl,
    rawConfig.redirectUri,
    rawConfig.redirect_uri,
  ];

  return (
    hasAzureProviderHint ||
    (hasGuidLikeClientId &&
      urlCandidates.some(value => /microsoft|entra|aad|azure/i.test(ensureString(value)))) ||
    urlCandidates.some(
      value =>
        isAzureAuthorityUrl(value) ||
        isAzureEndpointPattern(value) ||
        isAzureRedirectUrl(value),
    )
  );
};

const resolvePlatformSsoRedirectConfig = ({
  platform = Platform.OS,
  rawConfig = {},
  issuer = '',
  discoveryUri = '',
  serviceConfiguration,
  additionalParameters = {},
  providerHint = '',
} = {}) => {
  const explicitRedirectConfig = getExplicitRedirectConfig(
    rawConfig,
    additionalParameters,
  );
  const forcePlatformCallbackRedirect = shouldForcePlatformCallbackRedirect(
    rawConfig,
    additionalParameters,
  );
  const forceAzureRedirect = shouldForceAzureRedirect(
    rawConfig,
    additionalParameters,
  );
  const isAzureProvider = isAzureSsoConfig({
    rawConfig,
    issuer,
    discoveryUri,
    serviceConfiguration,
    additionalParameters,
    providerHint,
  });
  const isPingOneProvider = isPingOneSsoConfig({
    rawConfig,
    issuer,
    discoveryUri,
    serviceConfiguration,
    additionalParameters,
    providerHint,
  });

  const azureIosVariant = pickFirstDefinedValue(
    rawConfig.azureIosRedirectVariant,
    rawConfig.azure_ios_redirect_variant,
    additionalParameters.azureIosRedirectVariant,
    additionalParameters.azure_ios_redirect_variant,
  );
  const azureAndroidVariant = pickFirstDefinedValue(
    rawConfig.azureAndroidRedirectVariant,
    rawConfig.azure_android_redirect_variant,
    additionalParameters.azureAndroidRedirectVariant,
    additionalParameters.azure_android_redirect_variant,
  );
  const iosRedirectVariant = pickFirstDefinedValue(
    rawConfig.iosRedirectVariant,
    rawConfig.ios_redirect_variant,
    additionalParameters.iosRedirectVariant,
    additionalParameters.ios_redirect_variant,
  );
  const androidRedirectVariant = pickFirstDefinedValue(
    rawConfig.androidRedirectVariant,
    rawConfig.android_redirect_variant,
    additionalParameters.androidRedirectVariant,
    additionalParameters.android_redirect_variant,
  );
  const pingOneIosRedirectVariant = pickFirstDefinedValue(
    rawConfig.pingOneIosRedirectVariant,
    rawConfig.pingone_ios_redirect_variant,
    additionalParameters.pingOneIosRedirectVariant,
    additionalParameters.pingone_ios_redirect_variant,
  );
  const isLegacyAndroidAzureRedirect =
    platform === 'android' &&
    explicitRedirectConfig?.scheme === AZURE_ANDROID_REDIRECT_SCHEME;

  if (forcePlatformCallbackRedirect) {
    return getDefaultPlatformSsoRedirectConfig(platform, {
      iosVariant: iosRedirectVariant,
      androidVariant: androidRedirectVariant,
    });
  }

  if (forceAzureRedirect) {
    return getAzurePlatformSsoRedirectConfig(platform, {
      iosVariant: azureIosVariant,
      androidVariant: azureAndroidVariant || androidRedirectVariant,
    });
  }

  if (isAzureProvider) {
    if (explicitRedirectConfig?.isAzureRedirect && !isLegacyAndroidAzureRedirect) {
      return explicitRedirectConfig;
    }

    return getAzurePlatformSsoRedirectConfig(platform, {
      iosVariant: azureIosVariant,
      androidVariant: azureAndroidVariant || androidRedirectVariant,
    });
  }

  if (explicitRedirectConfig) {
    if (isLegacyAndroidAzureRedirect) {
      return getAzurePlatformSsoRedirectConfig(platform, {
        iosVariant: azureIosVariant,
      });
    }

    if (
      platform === 'ios' &&
      isPingOneProvider &&
      isPlatformIosCallbackRedirect(explicitRedirectConfig.redirectUrl)
    ) {
      return getDefaultPlatformSsoRedirectConfig(platform, {
        iosVariant: pingOneIosRedirectVariant || iosRedirectVariant || 'doubleslash',
      });
    }

    return explicitRedirectConfig;
  }

  if (platform === 'ios' && isPingOneProvider) {
    return getDefaultPlatformSsoRedirectConfig(platform, {
      iosVariant: pingOneIosRedirectVariant || iosRedirectVariant || 'doubleslash',
    });
  }

  return getDefaultPlatformSsoRedirectConfig(platform, {
    iosVariant: iosRedirectVariant,
    androidVariant: androidRedirectVariant,
  });
};

export const getPlatformSsoRedirectConfig = (
  platform = Platform.OS,
  rawConfig = {},
) => {
  const additionalParameters = parseAdditionalSsoParameters(rawConfig);
  const configuredDiscoveryUri = getConfiguredDiscoveryUri(rawConfig);
  const issuer = resolveIssuer(rawConfig, configuredDiscoveryUri);
  const serviceConfiguration = buildServiceConfiguration(
    rawConfig,
    additionalParameters,
  );
  const providerHint = getProviderHint(rawConfig, additionalParameters);

  return resolvePlatformSsoRedirectConfig({
    platform,
    rawConfig,
    issuer,
    discoveryUri: configuredDiscoveryUri,
    serviceConfiguration,
    additionalParameters,
    providerHint,
  });
};

const getIssuerOrigin = issuer => {
  try {
    if (typeof URL === 'function') {
      return new URL(issuer).origin;
    }
  } catch (error) {
    // Fall through to regex parsing below.
  }

  const originMatch = ensureString(issuer).match(/^https?:\/\/[^/]+/i);
  return originMatch ? originMatch[0] : '';
};

const parseAdditionalSsoParameters = rawConfig => {
  const discoveryParameters = parseJsonLikeObject(rawConfig.discoveryUri);
  const additionalParameters = parseJsonLikeObject(
    rawConfig.additionalParameters || rawConfig.additional_parameters,
  );

  return {
    ...discoveryParameters,
    ...additionalParameters,
  };
};

const getConfiguredDiscoveryUri = rawConfig => {
  const discoveryUri = ensureString(
    rawConfig.discoveryUri ||
      rawConfig.discovery_uri ||
      rawConfig.wellKnownEndpoint ||
      rawConfig.well_known_endpoint,
  );

  return isHttpUrl(discoveryUri) ? stripTrailingSlash(discoveryUri) : '';
};

const deriveIssuerFromDiscoveryUri = discoveryUri =>
  stripTrailingSlash(discoveryUri).replace(
    /\/\.well-known\/openid-configuration$/i,
    '',
  );

// PingFederate often registers OAuth routes under /as/* but publishes OIDC
// discovery at the domain root (/.well-known/openid-configuration).
const isPingFederateShorthandIssuer = issuer => {
  const normalizedIssuer = stripTrailingSlash(ensureString(issuer));
  return /^https:\/\/[^/]+\/as$/i.test(normalizedIssuer);
};

const normalizePingFederateIssuer = issuer => {
  const normalizedIssuer = stripTrailingSlash(ensureString(issuer));

  if (isPingFederateShorthandIssuer(normalizedIssuer)) {
    return getIssuerOrigin(normalizedIssuer) || normalizedIssuer;
  }

  return normalizedIssuer;
};

const resolveIssuer = (rawConfig, configuredDiscoveryUri) => {
  const configuredIssuer = normalizePingFederateIssuer(rawConfig.issuer);
  const derivedIssuer = configuredDiscoveryUri
    ? deriveIssuerFromDiscoveryUri(configuredDiscoveryUri)
    : '';

  if (!configuredIssuer) {
    return derivedIssuer;
  }

  const issuerOrigin = getIssuerOrigin(configuredIssuer);

  if (
    derivedIssuer &&
    issuerOrigin === configuredIssuer &&
    derivedIssuer !== configuredIssuer
  ) {
    return derivedIssuer;
  }

  return configuredIssuer;
};

const parseServiceConfigurationObject = value => {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value;
  }

  return parseJsonLikeObject(value);
};

const normalizeEndpoint = value => {
  const endpoint = ensureString(value);
  return isHttpUrl(endpoint) ? stripTrailingSlash(endpoint) : '';
};

const buildServiceConfiguration = (rawConfig = {}, additionalParameters = {}) => {
  const serviceConfigurationPayload = parseServiceConfigurationObject(
    rawConfig.serviceConfiguration ||
      rawConfig.service_configuration ||
      additionalParameters.serviceConfiguration ||
      additionalParameters.service_configuration,
  );

  const authorizationEndpoint = normalizeEndpoint(
    pickFirstDefinedValue(
      rawConfig.authorizationEndpoint,
      rawConfig.authorization_endpoint,
      serviceConfigurationPayload.authorizationEndpoint,
      serviceConfigurationPayload.authorization_endpoint,
      additionalParameters.authorizationEndpoint,
      additionalParameters.authorization_endpoint,
    ),
  );
  const tokenEndpoint = normalizeEndpoint(
    pickFirstDefinedValue(
      rawConfig.tokenEndpoint,
      rawConfig.token_endpoint,
      serviceConfigurationPayload.tokenEndpoint,
      serviceConfigurationPayload.token_endpoint,
      additionalParameters.tokenEndpoint,
      additionalParameters.token_endpoint,
    ),
  );
  const revocationEndpoint = normalizeEndpoint(
    pickFirstDefinedValue(
      rawConfig.revocationEndpoint,
      rawConfig.revocation_endpoint,
      serviceConfigurationPayload.revocationEndpoint,
      serviceConfigurationPayload.revocation_endpoint,
      additionalParameters.revocationEndpoint,
      additionalParameters.revocation_endpoint,
    ),
  );
  const endSessionEndpoint = normalizeEndpoint(
    pickFirstDefinedValue(
      rawConfig.endSessionEndpoint,
      rawConfig.end_session_endpoint,
      rawConfig.logoutEndpoint,
      rawConfig.logout_endpoint,
      serviceConfigurationPayload.endSessionEndpoint,
      serviceConfigurationPayload.end_session_endpoint,
      serviceConfigurationPayload.logoutEndpoint,
      serviceConfigurationPayload.logout_endpoint,
      additionalParameters.endSessionEndpoint,
      additionalParameters.end_session_endpoint,
      additionalParameters.logoutEndpoint,
      additionalParameters.logout_endpoint,
    ),
  );

  if (!authorizationEndpoint || !tokenEndpoint) {
    return undefined;
  }

  return {
    authorizationEndpoint,
    tokenEndpoint,
    ...(revocationEndpoint ? {revocationEndpoint} : {}),
    ...(endSessionEndpoint ? {endSessionEndpoint} : {}),
  };
};

const RESERVED_AUTHORIZATION_PARAMETER_KEYS = new Set([
  'authorizationendpoint',
  'authorization_endpoint',
  'clientid',
  'client_id',
  'codechallenge',
  'code_challenge',
  'codechallengemethod',
  'code_challenge_method',
  'codeverifier',
  'code_verifier',
  'tokenendpoint',
  'token_endpoint',
  'revocationendpoint',
  'revocation_endpoint',
  'endsessionendpoint',
  'end_session_endpoint',
  'logoutendpoint',
  'logout_endpoint',
  'serviceconfiguration',
  'service_configuration',
  'discoveryuri',
  'discovery_uri',
  'wellknownendpoint',
  'well_known_endpoint',
  'granttype',
  'grant_type',
  'nonce',
  'resptype',
  'responsetype',
  'responsetypes',
  'redirecturi',
  'redirect_uri',
  'responsemode',
  'response_mode',
  'scope',
  'state',
  'usepkce',
  'usenounce',
  'usenonce',
  'client_secret',
  'clientsecret',
]);

const buildAuthorizationAdditionalParameters = (
  rawConfig = {},
  additionalParameters = {},
) => {
  const authorizationParameters = {};
  const explicitAuthorizationParameters = parseJsonLikeObject(
    rawConfig.authorizationParameters ||
      rawConfig.authorization_parameters ||
      rawConfig.additionalParameters ||
      rawConfig.additional_parameters,
  );

  Object.entries({
    ...additionalParameters,
    ...explicitAuthorizationParameters,
  }).forEach(([key, value]) => {
    if (!key || RESERVED_AUTHORIZATION_PARAMETER_KEYS.has(key.toLowerCase())) {
      return;
    }

    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length === 0)
    ) {
      return;
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      authorizationParameters[key] = String(value);
    }
  });

  return Object.keys(authorizationParameters).length > 0
    ? authorizationParameters
    : undefined;
};

const getClientSecretHintValue = (rawConfig = {}, discoveryParameters = {}) =>
  ensureString(
    rawConfig.clientSecret ||
      rawConfig.client_secret ||
      discoveryParameters.client_secret ||
      discoveryParameters.clientSecret,
  );

const getMaskedClientSecretHintValue = (rawConfig = {}) =>
  ensureString(rawConfig.maskedClientSecretHint);

const maskSecretValue = value => {
  const secret = ensureString(value);

  if (!secret) {
    return '';
  }

  if (secret.length <= 4) {
    return '*'.repeat(secret.length);
  }

  return `${'*'.repeat(secret.length - 4)}${secret.slice(-4)}`;
};

const detectClientSecretHint = (rawConfig = {}, discoveryParameters = {}) =>
  Boolean(
    getClientSecretHintValue(rawConfig, discoveryParameters) ||
      parseBooleanValue(rawConfig.hasClientSecretHint, false),
  );

export const normalizeSsoConfig = (
  rawConfig = {},
  platform = Platform.OS,
) => {
  const additionalParameters = parseAdditionalSsoParameters(rawConfig);
  const configuredDiscoveryUri = getConfiguredDiscoveryUri(rawConfig);
  const issuer = resolveIssuer(rawConfig, configuredDiscoveryUri);
  const explicitServiceConfiguration = buildServiceConfiguration(
    rawConfig,
    additionalParameters,
  );
  const providerHint = getProviderHint(rawConfig, additionalParameters);
  const isAzureProvider = isAzureSsoConfig({
    rawConfig,
    issuer,
    discoveryUri: configuredDiscoveryUri,
    serviceConfiguration: explicitServiceConfiguration,
    additionalParameters,
    providerHint,
  });
  const isPingOneProvider = isPingOneSsoConfig({
    rawConfig,
    issuer,
    discoveryUri: configuredDiscoveryUri,
    serviceConfiguration: explicitServiceConfiguration,
    additionalParameters,
    providerHint,
  });
  const serviceConfiguration =
    explicitServiceConfiguration ||
    (isAzureProvider ? deriveAzureServiceConfiguration(issuer) : undefined);
  const {scheme, redirectUrl, endSessionRedirectUri} =
    resolvePlatformSsoRedirectConfig({
      platform,
      rawConfig,
      issuer,
      discoveryUri: configuredDiscoveryUri,
      serviceConfiguration,
      additionalParameters,
      providerHint,
    });
  const hasClientSecretHint = detectClientSecretHint(
    rawConfig,
    additionalParameters,
  );
  const maskedClientSecretHint =
    getMaskedClientSecretHintValue(rawConfig) ||
    maskSecretValue(getClientSecretHintValue(rawConfig, additionalParameters));
  const authorizationAdditionalParameters =
    buildAuthorizationAdditionalParameters(rawConfig, additionalParameters);
  const hasExplicitScopes = hasExplicitScopeValue(
    rawConfig.scopes || rawConfig.scope,
  );

  return {
    issuer,
    clientId: ensureString(rawConfig.clientId),
    redirectUrl,
    redirectUri: redirectUrl,
    endSessionRedirectUri,
    postLogoutRedirectUrl: endSessionRedirectUri,
    discoveryUri:
      configuredDiscoveryUri ||
      (issuer ? `${stripTrailingSlash(issuer)}/.well-known/openid-configuration` : ''),
    scopes: parseScopes(rawConfig.scopes || rawConfig.scope, {
      useAzureDefaults: isAzureProvider && !hasExplicitScopes,
    }),
    usePKCE: parseBooleanValue(
      rawConfig.usePKCE ?? additionalParameters.usepkce,
      true,
    ),
    useNonce: parseBooleanValue(
      rawConfig.useNonce ?? additionalParameters.usenounce,
      true,
    ),
    responseTypes: parseResponseTypes(
      rawConfig.responseTypes ?? additionalParameters.resptype,
    ),
    maskedClientSecretHint,
    requireHardwareBackedKeyStore: parseBooleanValue(
      rawConfig.requireHardwareBackedKeyStore,
      false,
    ),
    httpReadTimeout: parseIntegerValue(
      rawConfig.httpReadTimeout,
      DEFAULT_HTTP_READ_TIMEOUT_SECONDS,
    ),
    hasClientSecretHint,
    discoveryParametersForLogs: sanitizeDiscoveryParametersForLogs(
      additionalParameters,
    ),
    additionalParameters: authorizationAdditionalParameters,
    additionalParametersForLogs: sanitizeDiscoveryParametersForLogs(
      authorizationAdditionalParameters,
    ),
    customUriScheme: scheme,
    serviceConfiguration,
    usesExplicitServiceConfiguration: Boolean(explicitServiceConfiguration),
    authorizationEndpoint: serviceConfiguration?.authorizationEndpoint,
    tokenEndpoint: serviceConfiguration?.tokenEndpoint,
    revocationEndpoint: serviceConfiguration?.revocationEndpoint,
    endSessionEndpoint: serviceConfiguration?.endSessionEndpoint,
    providerHint,
    isAzureProvider,
    isPingOneProvider,
  };
};

export const getSsoConfigDiagnostics = (
  rawConfig = {},
  platform = Platform.OS,
) => {
  const normalizedConfig = normalizeSsoConfig(rawConfig, platform);
  const issues = [];

  if (normalizedConfig.hasClientSecretHint) {
    issues.push(
      'Backend SSO config contains a client secret hint. Okta mobile PKCE clients must be public/native clients without client_secret.',
    );
  }

  if (!normalizedConfig.usePKCE) {
    issues.push(
      'PKCE is disabled in the SSO config. Okta mobile login must use Authorization Code + PKCE.',
    );
  }

  if (!normalizedConfig.scopes.includes('openid')) {
    issues.push('SSO scopes must include openid for OIDC login.');
  }

  if (
    normalizedConfig.redirectUrl &&
    normalizedConfig.customUriScheme &&
    !normalizedConfig.redirectUrl.startsWith(
      `${normalizedConfig.customUriScheme}:/`,
    )
  ) {
    issues.push(
      `Redirect URL ${normalizedConfig.redirectUrl} does not match the mobile callback scheme ${normalizedConfig.customUriScheme}.`,
    );
  }

  if (
    normalizedConfig.issuer &&
    getIssuerOrigin(normalizedConfig.issuer) === normalizedConfig.issuer &&
    !normalizedConfig.usesExplicitServiceConfiguration
  ) {
    issues.push(
      'SSO issuer is only the domain origin. If this customer IdP publishes OIDC under a path or auth server, the backend must send the full issuer or explicit authorize/token endpoints.',
    );
  }

  return {
    normalizedConfig,
    issues,
    hasClientSecretHint: normalizedConfig.hasClientSecretHint,
  };
};

export const buildAuthorizeConfig = (
  rawConfig = {},
  platform = Platform.OS,
) => {
  const normalizedConfig = normalizeSsoConfig(rawConfig, platform);
  const additionalParameters = parseAdditionalSsoParameters(rawConfig);
  const forceAzureRedirect = shouldForceAzureRedirect(
    rawConfig,
    additionalParameters,
  );

  if (normalizedConfig.hasClientSecretHint) {
    console.warn('SSO client secret hint detected', {
      issuer: normalizedConfig.issuer,
      clientId: normalizedConfig.clientId,
      redirectUrl: normalizedConfig.redirectUrl,
      maskedClientSecretHint: normalizedConfig.maskedClientSecretHint || '',
    });
  }

  if (!/^https:\/\//i.test(normalizedConfig.issuer)) {
    return {
      error:
        'SSO configuration is missing a valid HTTPS issuer. Re-register the device and try again.',
    };
  }

  if (!normalizedConfig.clientId) {
    return {
      error:
        'SSO configuration is missing a client ID. Re-register the device and try again.',
    };
  }

  console.log('SSO buildAuthorizeConfig redirect selection', {
    platform,
    issuer: normalizedConfig.issuer,
    clientId: normalizedConfig.clientId,
    redirectUrl: normalizedConfig.redirectUrl,
    endSessionRedirectUri: normalizedConfig.endSessionRedirectUri,
    customUriScheme: normalizedConfig.customUriScheme,
    isAzureProvider: normalizedConfig.isAzureProvider,
    providerHint: normalizedConfig.providerHint,
    forceAzureRedirect,
    configuredRedirectUrl:
      ensureString(rawConfig.redirectUrl) ||
      ensureString(rawConfig.redirectUri) ||
      ensureString(rawConfig.redirect_uri),
  });

  return {
    normalizedConfig,
    config: {
      issuer: normalizedConfig.issuer,
      serviceConfiguration: normalizedConfig.serviceConfiguration,
      clientId: normalizedConfig.clientId,
      redirectUrl: normalizedConfig.redirectUrl,
      scopes: normalizedConfig.scopes,
      additionalParameters: normalizedConfig.additionalParameters,
      usePKCE: normalizedConfig.usePKCE,
      useNonce: normalizedConfig.useNonce,
      responseTypes: normalizedConfig.responseTypes,
      connectionTimeoutSeconds: normalizedConfig.httpReadTimeout,
    },
  };
};

export const isRetriableAuthorizeCallbackError = error => {
  const rawMessage = ensureString(error?.message || error?.error || error);
  return /timed out waiting for|browser callback|redirect uri|redirect_uri|AADSTS50011|invalid_data|invalid_value|user cancelled|authentication cancelled|authentication failed|network error|network request failed/i.test(
    rawMessage,
  );
};

export const getAzureIosAuthorizeRedirectAttemptConfigs = (
  rawConfig = {},
  platform = Platform.OS,
) => {
  const attemptSources =
    platform === 'ios'
      ? [
          rawConfig,
          {
            ...rawConfig,
            forceAzureRedirect: true,
          },
          {
            ...rawConfig,
            forceAzureRedirect: true,
            azureIosRedirectVariant: 'singleSlash',
          },
          {
            ...rawConfig,
            forcePlatformCallbackRedirect: true,
            iosRedirectVariant: 'doubleslash',
          },
          {
            ...rawConfig,
            forcePlatformCallbackRedirect: true,
            iosRedirectVariant: 'singleSlash',
          },
        ]
      : [
          rawConfig,
          {
            ...rawConfig,
            forceAzureRedirect: true,
            azureAndroidRedirectVariant: 'doubleSlash',
          },
          {
            ...rawConfig,
            forceAzureRedirect: true,
            azureAndroidRedirectVariant: 'singleSlash',
          },
          {
            ...rawConfig,
            forcePlatformCallbackRedirect: true,
            androidRedirectVariant: 'doubleslash',
          },
          {
            ...rawConfig,
            forcePlatformCallbackRedirect: true,
            androidRedirectVariant: 'singleSlash',
          },
        ];

  const seenRedirectUrls = new Set();
  const attemptConfigs = [];

  attemptSources.forEach(source => {
    const built = buildAuthorizeConfig(source, platform);
    const redirectUrl = ensureString(built?.config?.redirectUrl);

    if (built.error || !redirectUrl || seenRedirectUrls.has(redirectUrl)) {
      return;
    }

    seenRedirectUrls.add(redirectUrl);
    attemptConfigs.push(built.config);
  });

  return attemptConfigs;
};

export const shouldRetryWithAzureRedirect = (
  error,
  rawConfig = {},
  platform = Platform.OS,
) => {
  const rawMessage = ensureString(error?.message || error?.error || error);
  const normalizedConfig = normalizeSsoConfig(rawConfig, platform);
  const isAlreadyUsingAzureRedirect = isAzureRedirectUrl(
    normalizedConfig.redirectUrl,
  );
  const isAzureContext =
    normalizedConfig.isAzureProvider === true ||
    isAzureAuthorityUrl(normalizedConfig.issuer) ||
    /AADSTS50011|login\.microsoftonline\.com|entra|microsoft/i.test(
      rawMessage,
    );
  const looksLikeRedirectOrCallbackFailure =
    /AADSTS50011|login\.microsoftonline\.com|redirect uri|redirect_uri|network error|network request failed|timed out waiting for|browser callback/i.test(
      rawMessage,
    );
  const azureRetryRedirectUrl = ensureString(
    getAzurePlatformSsoRedirectConfig(platform).redirectUrl,
  );
  const currentRedirectUrl = ensureString(normalizedConfig.redirectUrl);
  const hasDistinctAzureRetryRedirect =
    Boolean(azureRetryRedirectUrl) &&
    azureRetryRedirectUrl !== currentRedirectUrl;
  const shouldRetry =
    isAzureContext &&
    !isAlreadyUsingAzureRedirect &&
    looksLikeRedirectOrCallbackFailure &&
    (platform === 'ios' || hasDistinctAzureRetryRedirect);

  console.log('SSO Azure redirect retry evaluation', {
    platform,
    issuer: normalizedConfig.issuer,
    redirectUrl: normalizedConfig.redirectUrl,
    customUriScheme: normalizedConfig.customUriScheme,
    isAzureProvider: normalizedConfig.isAzureProvider,
    providerHint: normalizedConfig.providerHint,
    isAlreadyUsingAzureRedirect,
    hasDistinctAzureRetryRedirect,
    shouldRetry,
    rawMessage,
  });

  return shouldRetry;
};

export const shouldRetryWithAlternateIosCallbackRedirect = (
  error,
  rawConfig = {},
  platform = Platform.OS,
) => {
  const rawMessage = ensureString(error?.message || error?.error || error);
  const normalizedConfig = normalizeSsoConfig(rawConfig, platform);
  const alternateIosRedirectVariant = getAlternateIosPlatformRedirectVariant(
    normalizedConfig.redirectUrl,
  );
  const shouldRetry =
    platform === 'ios' &&
    normalizedConfig.isAzureProvider !== true &&
    normalizedConfig.customUriScheme === PLATFORM_CALLBACK_SCHEMES.ios &&
    Boolean(alternateIosRedirectVariant) &&
    /redirect_uri|redirect uri|invalid_data|invalid_value/i.test(rawMessage);

  console.log('SSO iOS callback retry evaluation', {
    platform,
    issuer: normalizedConfig.issuer,
    redirectUrl: normalizedConfig.redirectUrl,
    customUriScheme: normalizedConfig.customUriScheme,
    isAzureProvider: normalizedConfig.isAzureProvider,
    alternateIosRedirectVariant,
    shouldRetry,
    rawMessage,
  });

  return shouldRetry;
};

export const getAlternateIosCallbackRedirectRetryConfig = (
  rawConfig = {},
  platform = Platform.OS,
) => {
  if (platform !== 'ios') {
    return undefined;
  }

  const normalizedConfig = normalizeSsoConfig(rawConfig, platform);
  const alternateIosRedirectVariant = getAlternateIosPlatformRedirectVariant(
    normalizedConfig.redirectUrl,
  );

  if (
    !alternateIosRedirectVariant ||
    normalizedConfig.isAzureProvider === true ||
    normalizedConfig.customUriScheme !== PLATFORM_CALLBACK_SCHEMES.ios
  ) {
    return undefined;
  }

  return {
    ...rawConfig,
    forcePlatformCallbackRedirect: true,
    iosRedirectVariant: alternateIosRedirectVariant,
  };
};

export const getSsoBackendLoginContext = authResult => {
  const accessToken = ensureString(authResult?.accessToken);
  const idToken = ensureString(authResult?.idToken);
  const refreshToken = ensureString(authResult?.refreshToken);
  const accessTokenClaimsForLogs = decodeJwtClaims(accessToken);
  const idTokenClaimsForLogs = decodeJwtClaims(idToken);
  const preferredBackendLoginValue =
    idToken && !isCompactJwsJwt(accessToken) ? idToken : accessToken || idToken;
  const displayLoginIdentifier =
    getDisplayLoginIdentifierFromClaims(
      idTokenClaimsForLogs,
      accessTokenClaimsForLogs,
    ) || 'SSO user';
  const backendLoginValue = preferredBackendLoginValue;
  const backendLoginValueType =
    backendLoginValue === accessToken
      ? 'accessToken'
      : backendLoginValue === idToken
      ? 'idToken'
      : '';

  return {
    backendLoginValue,
    backendLoginValueType,
    displayLoginIdentifier,
    tokenToRevoke: accessToken || refreshToken || idToken,
    accessTokenClaimsForLogs,
    idTokenClaimsForLogs,
  };
};

export const getSsoLoginErrorMessage = (
  error,
  rawConfig = {},
  platform = Platform.OS,
) => {
  const diagnostics = getSsoConfigDiagnostics(rawConfig, platform);
  const normalizedConfig = diagnostics.normalizedConfig;
  const rawMessage = ensureString(error?.message || error?.error || error);
  const callbackConfig = getPlatformSsoRedirectConfig(platform);
  const redirectUrl =
    normalizedConfig.redirectUrl || callbackConfig.redirectUrl;

  if (/client authentication failed|invalid_client/i.test(rawMessage)) {
    if (diagnostics.hasClientSecretHint) {
      return `Okta rejected this mobile login because the configured client is behaving like a confidential/web app. Replace it with an Okta Native Application client ID, remove client_secret from the SSO config, and register ${redirectUrl} as the sign-in redirect URI.`;
    }

    return `Okta rejected the client for this mobile PKCE flow. Verify the Okta app integration is a Native Application, Authorization Code + PKCE is enabled, and ${redirectUrl} is registered as the sign-in redirect URI.`;
  }

  if (/405|method not allowed/i.test(rawMessage)) {
    return `The identity provider rejected the SSO request with HTTP 405. Verify the backend issuer/endpoints are correct for this customer IdP, the authorize endpoint supports GET, and the token endpoint supports POST.`;
  }

  if (/timed out waiting for.*browser callback/i.test(rawMessage)) {
    if (platform === 'ios' && normalizedConfig.isAzureProvider === true) {
      return `Microsoft Entra login timed out waiting for the app callback. Register one of these exact iOS redirect URIs in Azure: msauth.com.omnex.integratedapp://auth, msauth.com.omnex.integratedapp:/auth, com.omnex.integratedapp://callback, or com.omnex.integratedapp:/callback. The app last tried ${redirectUrl}.`;
    }

    return `SSO login timed out waiting for the browser callback. Verify ${redirectUrl} is registered exactly in the identity provider.`;
  }

  if (/timeout|network request failed|^network error$/i.test(rawMessage)) {
    if (platform === 'android' && normalizedConfig.isAzureProvider === true) {
      return `Microsoft Entra login failed with a network/callback error. Verify the device can reach login.microsoftonline.com, and that Azure has the exact Android redirect URI registered (try both ${PLATFORM_CALLBACK_SCHEMES.android}:/callback and ${PLATFORM_CALLBACK_SCHEMES.android}://callback). Last tried ${redirectUrl}.`;
    }

    return `The app could not complete SSO with the identity provider (network or callback failure). Verify connectivity and that ${redirectUrl} is registered exactly in the identity provider.`;
  }

  if (/AADSTS50011|redirect uri|redirect_uri|invalid_data|invalid_value/i.test(rawMessage)) {
    if (platform === 'ios' && normalizedConfig.isAzureProvider === true) {
      const baseScheme =
        ensureString(normalizedConfig.customUriScheme) ||
        PLATFORM_CALLBACK_SCHEMES.ios;
      const callbackPath = baseScheme.startsWith('msauth.')
        ? 'auth'
        : 'callback';
      const doubleSlash = `${baseScheme}://${callbackPath}`;
      const singleSlash = `${baseScheme}:/${callbackPath}`;
      return `Microsoft Entra rejected the redirect URI. Ensure the Azure app registration contains the exact iOS redirect URI. Common variants are ${doubleSlash} and ${singleSlash}. Add the one(s) that match your build and retry.`;
    }

    if (
      platform === 'ios' &&
      ensureString(normalizedConfig.customUriScheme) ===
        PLATFORM_CALLBACK_SCHEMES.ios
    ) {
      const baseScheme = PLATFORM_CALLBACK_SCHEMES.ios;
      const singleSlash = `${baseScheme}:/callback`;
      const doubleSlash = `${baseScheme}://callback`;
      if (normalizedConfig.isPingOneProvider) {
        return `PingOne rejected the redirect URI. Register the exact iOS callback URI in the PingOne application. Common variants are ${doubleSlash} and ${singleSlash}. The app is currently using ${redirectUrl}.`;
      }
      return `The identity provider rejected the redirect URI. Verify the provider is registered with the exact iOS callback URI. Common variants are ${singleSlash} and ${doubleSlash}.`;
    }

    return `The identity provider rejected the redirect URI. Verify ${redirectUrl} is registered exactly for this mobile app in the identity provider.`;
  }

  return rawMessage || 'SSO login failed.';
};

export const getSanitizedSsoConfigForLogs = rawConfig => {
  const diagnostics = getSsoConfigDiagnostics(rawConfig);
  const normalizedConfig = diagnostics.normalizedConfig;

  return {
    issuer: normalizedConfig.issuer,
    clientId: normalizedConfig.clientId,
    redirectUrl: normalizedConfig.redirectUrl,
    endSessionRedirectUri: normalizedConfig.endSessionRedirectUri,
    discoveryUri: normalizedConfig.discoveryUri,
    scopes: normalizedConfig.scopes,
    usePKCE: normalizedConfig.usePKCE,
    useNonce: normalizedConfig.useNonce,
    responseTypes: normalizedConfig.responseTypes,
    hasClientSecretHint: normalizedConfig.hasClientSecretHint,
    maskedClientSecretHint: normalizedConfig.maskedClientSecretHint,
    configIssues: diagnostics.issues,
    discoveryParametersForLogs: normalizedConfig.discoveryParametersForLogs,
    additionalParametersForLogs: normalizedConfig.additionalParametersForLogs,
    customUriScheme: normalizedConfig.customUriScheme,
    providerHint: normalizedConfig.providerHint,
    isAzureProvider: normalizedConfig.isAzureProvider,
    isPingOneProvider: normalizedConfig.isPingOneProvider,
    serviceConfiguration: normalizedConfig.serviceConfiguration,
    usesExplicitServiceConfiguration:
      normalizedConfig.usesExplicitServiceConfiguration,
    requireHardwareBackedKeyStore:
      normalizedConfig.requireHardwareBackedKeyStore,
    httpReadTimeout: normalizedConfig.httpReadTimeout,
  };
};
