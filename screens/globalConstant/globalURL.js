import { LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import AsyncStorage from '@react-native-community/async-storage';

const globalServerUrl = null;
const globalBaseUrl = globalServerUrl ? globalServerUrl.replace(/^(https?:\/\/[^/]+).*/, '$1') : '';

const DEFAULT_URLS = {
    globalServerUrl: globalServerUrl,
    globalBaseUrl: globalBaseUrl,
    auditProUrl: globalBaseUrl ? globalBaseUrl + '/AuditproApi/api/' : '',
    problemSolvingUrl: globalBaseUrl ? globalBaseUrl + '/ProblemSolverAPI/' : '',
    apqpUrl: globalBaseUrl ? globalBaseUrl + '/APQPAPI/' : '',
    icUrl: globalBaseUrl ? globalBaseUrl + '/InspectionControlAPI/api/' : '',
};

export const stripTrailingSlash = url => (url ? url.replace(/\/+$/, '') : url);
export const ensureTrailingSlash = url => {
    if (!url) return url;
    const sanitized = stripTrailingSlash(url);
    return `${sanitized}/`;
};
export const deriveBaseUrl = url => {
    if (!url) return url;
    try {
        const parsed = new URL(url);
        return `${parsed.protocol}//${parsed.host}`;
    } catch (err) {
        const parts = url.split('/');
        return parts.length >= 3 ? `${parts[0]}//${parts[2]}` : url;
    }
};

export let GLOBALSERVER_URL = DEFAULT_URLS.globalServerUrl;
export let GLOBAL_BASE_URL = DEFAULT_URLS.globalBaseUrl;
export let AUDITPRO_URL = DEFAULT_URLS.auditProUrl;
export let PROBLEMSOLVING_URL = DEFAULT_URLS.problemSolvingUrl;
export let APQP_URL = DEFAULT_URLS.apqpUrl;
export let IC_URL = DEFAULT_URLS.icUrl;

export const getGlobalUrls = () => ({
    globalServerUrl: GLOBALSERVER_URL,
    globalBaseUrl: GLOBAL_BASE_URL,
    auditProUrl: AUDITPRO_URL,
    problemSolvingUrl: PROBLEMSOLVING_URL,
    apqpUrl: APQP_URL,
    icUrl: IC_URL,
});

export const setGlobalUrls = ({
    globalServerUrl,
    globalBaseUrl,
    auditProUrl,
    problemSolvingUrl,
    apqpUrl,
    icUrl,
} = {}) => {
    GLOBALSERVER_URL = ensureTrailingSlash(globalServerUrl || GLOBALSERVER_URL || DEFAULT_URLS.globalServerUrl);
    const baseFromInput = globalBaseUrl || deriveBaseUrl(GLOBALSERVER_URL);
    GLOBAL_BASE_URL = stripTrailingSlash(baseFromInput || GLOBAL_BASE_URL || DEFAULT_URLS.globalBaseUrl);

    // Normalize service URLs to the base host; avoid accidental platformapi paths.
    const deriveFromBase = (suffix, explicitUrl, currentUrl, defaultUrl) => {
        const desired = GLOBAL_BASE_URL ? `${GLOBAL_BASE_URL}${suffix}` : defaultUrl;
        const normalizedExplicit = ensureTrailingSlash(explicitUrl || '');
        const normalizedCurrent = ensureTrailingSlash(currentUrl || '');
        const lowerExplicit = normalizedExplicit.toLowerCase();
        const looksLikePlatformApi = lowerExplicit.includes('/platformapi/');
        const looksLikeBaseApi = lowerExplicit.includes('/platformapi/api/');
        if (normalizedExplicit && !looksLikePlatformApi && !looksLikeBaseApi) return normalizedExplicit;
        if ((looksLikePlatformApi || looksLikeBaseApi) && desired) return ensureTrailingSlash(desired);
        if (normalizedCurrent) return normalizedCurrent;
        return ensureTrailingSlash(desired || defaultUrl);
    };

    AUDITPRO_URL = deriveFromBase('/AuditproApi/api/', auditProUrl, AUDITPRO_URL, DEFAULT_URLS.auditProUrl);
    PROBLEMSOLVING_URL = deriveFromBase('/ProblemSolverAPI/', problemSolvingUrl, PROBLEMSOLVING_URL, DEFAULT_URLS.problemSolvingUrl);
    APQP_URL = deriveFromBase('/APQPAPI/', apqpUrl, APQP_URL, DEFAULT_URLS.apqpUrl);
    IC_URL = deriveFromBase('/InspectionControlAPI/api/', icUrl, IC_URL, DEFAULT_URLS.icUrl);
    try {
        // Refresh runtime API URLs without creating an import cycle at module load.
        const { refreshUrlsFromGlobals } = require('../../services/AuditPro-Api');
        if (refreshUrlsFromGlobals) {
            refreshUrlsFromGlobals();
        }
    } catch (err) {
        console.log('Skipping refreshUrlsFromGlobals', err?.message || err);
    }
};

// Load persisted URLs and update the shared bindings. Falls back to defaults.
export const loadGlobalUrls = async () => {
    const [storedServerUrl, storedRegisterUrl, storedDeviceDetails, storedAuthUrl] = await Promise.all([
        localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL),
        localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister),
        localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_DEVICE_STATUS),
        AsyncStorage.getItem('storedserverrul'),
    ]);

    const resolvedServerUrl = ensureTrailingSlash(storedServerUrl || storedRegisterUrl || storedAuthUrl || DEFAULT_URLS.globalServerUrl);
    const resolvedBase = stripTrailingSlash(deriveBaseUrl(resolvedServerUrl) || DEFAULT_URLS.globalBaseUrl);
    setGlobalUrls({
        globalServerUrl: resolvedServerUrl,
        globalBaseUrl: resolvedBase,
        auditProUrl: storedDeviceDetails?.AuditProURL || (resolvedBase ? `${resolvedBase}/AuditproApi/api/` : DEFAULT_URLS.auditProUrl),
        problemSolvingUrl: storedDeviceDetails?.PSApiURL || (resolvedBase ? `${resolvedBase}/ProblemSolverAPI/` : DEFAULT_URLS.problemSolvingUrl),
        apqpUrl: storedDeviceDetails?.APQPApiURL || (resolvedBase ? `${resolvedBase}/APQPAPI/` : DEFAULT_URLS.apqpUrl),
        icUrl: storedDeviceDetails?.ICApiURL || (resolvedBase ? `${resolvedBase}/InspectionControlAPI/api/` : DEFAULT_URLS.icUrl),
    });
};
