import localStorage from 'global/localStorage';

// "Recently viewed" lives in redux-persist (AuditPro/SM + APQP) and in the shared
// RECENT_ACTIVITIES key (Problem Solver/DocPro), all of which logout resets so that
// the next user does not inherit the previous user's data. Keeping a copy under a
// per-user key lets us hand the lists back when the same user signs in again.
const KEY_PREFIX = 'recentViewed_';

export const EMPTY_RECENT_VIEWED = {
    recentAudits: [],
    recentActivityAPQP: [],
    recentActivityPS: [],
};

const buildKey = userId => {
    const normalized = userId == null ? '' : String(userId).trim();
    return normalized ? `${KEY_PREFIX}${normalized}` : null;
};

// Redux slices hand us seamless-immutable arrays; JSON round-tripping them is fine
// but anything non-array (null on a fresh install) must not reach storage.
const asPlainArray = value => {
    if (Array.isArray(value)) {
        return value.slice();
    }
    if (value && typeof value.asMutable === 'function') {
        return value.asMutable({ deep: true });
    }
    return [];
};

export const loadRecentViewed = async userId => {
    const key = buildKey(userId);
    if (!key) {
        return EMPTY_RECENT_VIEWED;
    }

    const stored = await localStorage.getData(key);
    if (!stored) {
        return EMPTY_RECENT_VIEWED;
    }

    return {
        recentAudits: asPlainArray(stored.recentAudits),
        recentActivityAPQP: asPlainArray(stored.recentActivityAPQP),
        recentActivityPS: asPlainArray(stored.recentActivityPS),
    };
};

// Module level logouts only know about their own list, so omitted fields keep
// whatever was stored previously instead of being blanked out.
export const saveRecentViewed = async (userId, snapshot = {}) => {
    const key = buildKey(userId);
    if (!key) {
        console.log('[RecentViewed] No user id available, skipping save');
        return;
    }

    const existing = await loadRecentViewed(userId);
    const merge = (incoming, stored) => (typeof incoming === 'undefined' ? stored : asPlainArray(incoming));

    const payload = {
        recentAudits: merge(snapshot.recentAudits, existing.recentAudits),
        recentActivityAPQP: merge(snapshot.recentActivityAPQP, existing.recentActivityAPQP),
        recentActivityPS: merge(snapshot.recentActivityPS, existing.recentActivityPS),
    };

    await localStorage.storeData(key, payload);
    console.log('[RecentViewed] Saved for', key, payload);
};

export const clearRecentViewed = async userId => {
    const key = buildKey(userId);
    if (key) {
        await localStorage.removeItem(key);
    }
};
