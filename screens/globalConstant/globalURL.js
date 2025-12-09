import { LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import localStorage from 'global/localStorage';

const DEFAULT_URLS = {
    globalServerUrl: 'https://mobility-dev.ewqims.com/EwQIMSAPI/api/',
    globalBaseUrl: 'https://mobility-dev.ewqims.com',
    auditProUrl: 'https://mobility-dev.ewqims.com/AuditproApi/api/',
    problemSolvingUrl: 'https://mobility-dev.ewqims.com/ProblemSolverAPI/',
    apqpUrl: 'https://mobility-dev.ewqims.com/APQPAPI/',
    icUrl: 'https://mobility-dev.ewqims.com/InspectionControlAPI/api/',
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
    AUDITPRO_URL = ensureTrailingSlash(auditProUrl || AUDITPRO_URL || DEFAULT_URLS.auditProUrl);
    PROBLEMSOLVING_URL = ensureTrailingSlash(problemSolvingUrl || PROBLEMSOLVING_URL || DEFAULT_URLS.problemSolvingUrl);
    APQP_URL = ensureTrailingSlash(apqpUrl || APQP_URL || DEFAULT_URLS.apqpUrl);
    IC_URL = ensureTrailingSlash(icUrl || IC_URL || DEFAULT_URLS.icUrl);
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
    const [storedServerUrl, storedDeviceDetails] = await Promise.all([
        localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL),
        localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_DEVICE_STATUS),
    ]);

    setGlobalUrls({
        globalServerUrl: storedServerUrl,
        auditProUrl: storedDeviceDetails?.AuditProURL,
        problemSolvingUrl: storedDeviceDetails?.PSApiURL,
        apqpUrl: storedDeviceDetails?.APQPApiURL,
        icUrl: storedDeviceDetails?.ICApiURL,
    });
};
