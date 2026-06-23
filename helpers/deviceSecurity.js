import JailMonkey from 'jail-monkey';

export const deviceSecurity = {
    isJailBroken: JailMonkey.isJailBroken(),
    canMockLocation: JailMonkey.canMockLocation(),
    trustFall: JailMonkey.trustFall(),
};

global.deviceSecurity = deviceSecurity;
global.isJailBroken = deviceSecurity.isJailBroken;
global.canMockLocation = deviceSecurity.canMockLocation;
global.trustFall = deviceSecurity.trustFall;

export const isJailBroken = deviceSecurity.isJailBroken;
export const canMockLocation = deviceSecurity.canMockLocation;
export const trustFall = deviceSecurity.trustFall;
// export const isDeviceSecurityCompromised = trustFall || isJailBroken || canMockLocation;
export const isDeviceSecurityCompromised = !__DEV__ && (trustFall || isJailBroken || canMockLocation);
