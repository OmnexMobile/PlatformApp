import { DASHBOARD } from 'constants/app-constant';

const S = DASHBOARD;

const LOCAL_STATUSES = [S.StatusDownloaded, S.StatusNotSynced, S.StatusSynced];

function deriveCStatusFromApi(auditInfo = {}) {
    if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === '7' || auditInfo.CloseOutStatus === '9')) {
        return S.StatusCompleted;
    }
    if (auditInfo.AuditStatus == 3) {
        return S.Completed;
    }
    if (auditInfo.AuditStatus == 2 && auditInfo.PerformStarted == 0) {
        return S.StatusScheduled;
    }
    if (auditInfo.AuditStatus == 2 && auditInfo.PerformStarted == 1) {
        return S.StatusProcessing;
    }
    if (auditInfo.AuditStatus == 4) {
        return S.StatusDV;
    }
    if (auditInfo.AuditStatus == 5) {
        return S.StatusDVC;
    }
    return S.StatusScheduled;
}

function findLocalAuditStatus(auditInfo = {}, localAudits = []) {
    const actualId = parseInt(auditInfo.ActualAuditId, 10);
    if (Number.isNaN(actualId)) {
        return null;
    }

    for (let i = 0; i < localAudits.length; i++) {
        if (parseInt(localAudits[i].ActualAuditId, 10) === actualId) {
            const localStatus = localAudits[i].cStatus;
            if (localStatus && LOCAL_STATUSES.includes(localStatus)) {
                return localStatus;
            }
            break;
        }
    }

    return null;
}

export function resolveAuditCStatus(auditInfo = {}, localAudits = []) {
    const localStatus = findLocalAuditStatus(auditInfo, localAudits);
    if (localStatus) {
        return localStatus;
    }

    if (auditInfo?.cStatus) {
        return auditInfo.cStatus;
    }

    return deriveCStatusFromApi(auditInfo);
}

export function getAuditStatusColor(cStatus) {
    switch (cStatus) {
        case S.StatusScheduled:
            return '#1081de';
        case S.StatusDownloaded:
            return '#9B59B6';
        case S.StatusNotSynced:
            return '#0E9AA7';
        case S.StatusProcessing:
            return '#e88316';
        case S.StatusSynced:
            return '#48BCF7';
        case S.Completed:
            return '#2E7D32';
        case S.StatusCompleted:
            return '#37474F';
        case S.StatusDV:
            return '#D32F2F';
        case S.StatusDVC:
            return '#1B5E20';
        default:
            return '#1081de';
    }
}

export function formatAuditStatusLabel(cStatus) {
    if (cStatus === S.StatusDVC) {
        return 'D.Violated & Completed';
    }
    return cStatus || S.StatusScheduled;
}

export function enrichAuditItem(auditInfo = {}, localAudits = []) {
    const cStatus = resolveAuditCStatus(auditInfo, localAudits);
    return {
        ...auditInfo,
        cStatus,
        color: getAuditStatusColor(cStatus),
    };
}

function toMutableList(list = []) {
    if (!list) {
        return [];
    }
    if (Array.isArray(list)) {
        return list;
    }
    if (typeof list.asMutable === 'function') {
        return list.asMutable({ deep: true });
    }
    return [...list];
}

export function syncRecentAuditsFromLocalAudits(recentAudits = [], localAudits = []) {
    const recentList = toMutableList(recentAudits);
    if (!recentList.length) {
        return recentList;
    }

    return recentList.map(recent => enrichAuditItem(recent, localAudits));
}

export function syncAuditItemsFromLocalAudits(items = [], localAudits = []) {
    const itemList = toMutableList(items);
    if (!itemList.length) {
        return itemList;
    }

    return itemList.map(item => enrichAuditItem(item, localAudits));
}
