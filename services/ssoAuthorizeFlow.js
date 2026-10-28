import { Platform } from 'react-native';
import { authorize } from 'react-native-app-auth';
import {
    buildAuthorizeConfig,
    DEFAULT_SSO_AUTHORIZE_TIMEOUT_SECONDS,
    getAlternateIosCallbackRedirectRetryConfig,
    getAzureIosAuthorizeRedirectAttemptConfigs,
    isRetriableAuthorizeCallbackError,
    shouldRetryWithAlternateIosCallbackRedirect,
    shouldRetryWithAzureRedirect,
    getSsoBackendLoginContext,
    getSsoLoginErrorMessage,
    normalizeSsoConfig,
} from './SsoAuthConfig';

const WARN_AFTER_MS = 30000;
const RETRY_TIMEOUT_SECONDS = 45;

const errorText = e => e?.message || e?.error || String(e);

// authorize() + a timeout + a "still waiting" warning. Both timers are always cleared.
export const authorizeWithWatchdog = async (requestConfig, timeoutSeconds = DEFAULT_SSO_AUTHORIZE_TIMEOUT_SECONDS) => {
    let timeoutTimer;
    const warnTimer = setTimeout(
        () =>
            console.warn('SSO still waiting for browser callback after 30s', {
                issuer: requestConfig?.issuer,
                redirectUrl: requestConfig?.redirectUrl,
            }),
        WARN_AFTER_MS,
    );
    const timeout = new Promise((_, reject) => {
        timeoutTimer = setTimeout(
            () =>
                reject(new Error('Timed out waiting for SSO browser callback. Verify the redirect URI is registered and matches the app callback.')),
            timeoutSeconds * 1000,
        );
    });

    try {
        const result = await Promise.race([authorize(requestConfig), timeout]);
        console.log('SSO authorize raw:', typeof result, result && Object.keys(result));
        return result;
    } finally {
        clearTimeout(warnTimer);
        clearTimeout(timeoutTimer);
    }
};

// Try each config in order. Move to the next one only for retriable callback errors.
const tryConfigsInOrder = async attemptConfigs => {
    for (const [index, config] of attemptConfigs.entries()) {
        try {
            const resultAuth = await authorizeWithWatchdog(config, index === 0 ? DEFAULT_SSO_AUTHORIZE_TIMEOUT_SECONDS : RETRY_TIMEOUT_SECONDS);
            return { resultAuth, requestConfig: config };
        } catch (error) {
            const isLast = index === attemptConfigs.length - 1;
            if (isLast || !isRetriableAuthorizeCallbackError(error)) {
                throw error;
            }
            console.log('SSO attempt failed, trying next redirect', {
                attempt: index + 1,
                redirectUrl: config?.redirectUrl,
                errorMessage: errorText(error),
            });
        }
    }
};

const runAzureAttempts = async (ssoConfig, initialConfig) => {
    const attempts = getAzureIosAuthorizeRedirectAttemptConfigs(ssoConfig, Platform.OS) || [];

    return attempts.length === 0
        ? {
              resultAuth: await authorizeWithWatchdog(initialConfig),
              requestConfig: initialConfig,
          }
        : tryConfigsInOrder(attempts);
};

// Runs only after the first attempt failed. Returns a result or rethrows the original error.
const retryAfterFailure = async (error, ssoConfig, currentConfig) => {
    const retrySources = shouldRetryWithAzureRedirect(error, ssoConfig)
        ? [
              { ...ssoConfig, isAzureProvider: true, forceAzureRedirect: true },
              Platform.OS === 'android'
                  ? {
                        ...ssoConfig,
                        isAzureProvider: true,
                        forceAzureRedirect: true,
                        azureAndroidRedirectVariant: 'doubleSlash',
                    }
                  : {
                        ...ssoConfig,
                        isAzureProvider: true,
                        forceAzureRedirect: true,
                        azureIosRedirectVariant: 'singleSlash',
                    },
          ]
        : shouldRetryWithAlternateIosCallbackRedirect(error, ssoConfig)
        ? [getAlternateIosCallbackRedirectRetryConfig(ssoConfig, Platform.OS)].filter(Boolean)
        : [];

    for (const source of retrySources) {
        const built = buildAuthorizeConfig(source, Platform.OS);
        if (!built.error && built.config.redirectUrl !== currentConfig.redirectUrl) {
            return {
                resultAuth: await authorizeWithWatchdog(built.config),
                requestConfig: built.config,
            };
        }
    }

    throw error; // nothing to retry with
};

// The one function the screen calls.
// export const authorizeSso = async (ssoConfig, { config, normalizedConfig }) => {
//     const isAzure = normalizedConfig?.isAzureProvider || /^https:\/\/login\.microsoftonline\.com/i.test(normalizedConfig?.issuer || '');

//     try {
//         return isAzure ? await runAzureAttempts(ssoConfig, config) : { resultAuth: await authorizeWithWatchdog(config), requestConfig: config };
//     } catch (error) {
//         return retryAfterFailure(error, ssoConfig, config);
//     }
// };
export const authorizeSso = async (ssoConfig, built) => {
    const { config, normalizedConfig } = built;
    const isAzure =
        normalizedConfig?.isAzureProvider ||
        /^https:\/\/login\.microsoftonline\.com/i.test(normalizedConfig?.issuer || '');

    let outcome;
    try {
        if (isAzure) {
            outcome = await runAzureAttempts(ssoConfig, config);
        } else {
            const resultAuth = await authorizeWithWatchdog(config);
            outcome = { resultAuth, requestConfig: config };
        }
    } catch (error) {
        outcome = await retryAfterFailure(error, ssoConfig, config);
    }

    console.log('authorizeSso outcome keys:', outcome && Object.keys(outcome));
    return outcome;
};

export const runSsoAuthorization = async rawConfig => {
    const ssoConfig = rawConfig && Object.keys(rawConfig).length > 0 ? normalizeSsoConfig(rawConfig) : {};

    try {
        const built = buildAuthorizeConfig(ssoConfig);
        if (built.error) {
            return { ok: false, message: built.error };
        }

        // const { resultAuth, requestConfig } = await authorizeSso(ssoConfig, built);
        const outcome = await authorizeSso(ssoConfig, built);
        const { resultAuth, requestConfig } = outcome || {};
        console.log('SSO authorize result:', resultAuth, 'requestConfig:', requestConfig);
        if (!resultAuth) {
            throw new Error('SSO returned no result. The browser may have closed before sign-in finished.');
        }
        const ctx = getSsoBackendLoginContext(resultAuth);

        if (!ctx.backendLoginValue) {
            throw new Error('SSO response did not include an idToken or accessToken.');
        }

        return {
            ok: true,
            isSso: {
                backendLoginValue: ctx.backendLoginValue,
                loginIdentifier: ctx.displayLoginIdentifier,
                config: requestConfig,
                token: { tokenToRevoke: ctx.tokenToRevoke, sendClientId: true },
            },
        };
    } catch (err) {
        const text = String(err?.message || err?.error || err);
        return {
            ok: false,
            cancelled: /cancel/i.test(text), // user closed the browser, not a real error
            message: getSsoLoginErrorMessage(err, ssoConfig),
        };
    }
};
