import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeSsoConfig } from './SsoAuthConfig';

const SSO_KEYS = {
  loginState: 'sso_login_state',
  rawConfig: 'sso_raw_config_flags',
  config: 'sso_config_flags',
  issuer: 'sso_issuer',
  clientId: 'sso_clientid',
  redirectUrl: 'sso_redirecturl',
  isRegistered: 'isRegistered', // see note above: overloaded key
};

const isSsoOff = sso =>
  sso === undefined || sso === null || sso === '' || sso === false || sso === 'false';

const hasKeys = obj =>
  obj !== null && obj !== undefined && Object.keys(obj).length > 0;

// ---- pure / standalone helpers ----

export const storeSsoState = sso =>
  AsyncStorage.setItem(SSO_KEYS.loginState, isSsoOff(sso) ? 'false' : 'true');

export const storeSsoConfig = async ssoConfig => {
  const normalized = normalizeSsoConfig(ssoConfig);
  console.log('Registration normalized SSO config', normalized);

  await AsyncStorage.multiSet([
    [SSO_KEYS.rawConfig, JSON.stringify(ssoConfig)],
    [SSO_KEYS.config, JSON.stringify(normalized)],
    [SSO_KEYS.issuer, JSON.stringify(normalized.issuer)],
    [SSO_KEYS.clientId, JSON.stringify(normalized.clientId)],
    [SSO_KEYS.redirectUrl, JSON.stringify(normalized.redirectUrl)],
  ]);
};

// ---- hook ----

const useSsoRegistration = () => {
  /**
   * Call with `data.data.Data` from auth.checkRegistrationStatus.
   * Returns whether SSO is active.
   */
  const processSsoResponse = useCallback(async registrationData => {
    const {SSOActive, SSOFlags} = registrationData || {};
    const isSsoActive =
      SSOActive !== null && SSOActive !== undefined ? SSOActive : false;

    if (SSOActive !== null && SSOActive !== undefined) {
      await storeSsoState(isSsoActive);
    }

    console.log('isRegistered::::----', isSsoActive.toString());
    await AsyncStorage.setItem(SSO_KEYS.isRegistered, isSsoActive.toString());

    if (isSsoActive === true && hasKeys(SSOFlags)) {
      await storeSsoConfig(SSOFlags);
    }

    return isSsoActive;
  }, []);

  const clearSsoData = useCallback(
    () => AsyncStorage.multiRemove(Object.values(SSO_KEYS)),
    [],
);

  // Preserves the original behavior in the "redirected from login" branch.
  const markDeviceRegistered = useCallback(
    () => AsyncStorage.setItem(SSO_KEYS.isRegistered, 'true'),
    [],
  );

  return {processSsoResponse, markDeviceRegistered,clearSsoData};
};

export default useSsoRegistration;