import AsyncStorage from '@react-native-async-storage/async-storage';

const logAuditSnapshot = (stage, details) => {
  try {
    if (details === undefined) {
      console.log(`[AuditSummarySnapshot] ${stage}`);
    } else {
      console.log(`[AuditSummarySnapshot] ${stage}`, details);
    }
  } catch (error) {
    console.log('[AuditSummarySnapshot] log error', error);
  }
};

const baseTotals = {
  TotalNC: 0,
  ProcessNC: 0,
  MajorNC: 0,
  MinorNC: 0,
  TotalOFI: 0,
  ProcessOFI: 0,
  MajorOFI: 0,
  MinorOFI: 0,
};

const sanitizeTotals = totals => {
  if (!totals || typeof totals !== 'object') {
    return { ...baseTotals };
  }
  const sanitized = { ...baseTotals };
  Object.keys(baseTotals).forEach(key => {
    const value = Number(totals[key]);
    sanitized[key] = Number.isFinite(value) ? value : 0;
  });
  return sanitized;
};

const parseTotals = rawValue => {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue);
    return sanitizeTotals(parsed);
  } catch (error) {
    console.log('AuditSummary snapshot totals parse error', error);
    return null;
  }
};

const parseTrackedItems = rawValue => {
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('AuditSummary snapshot tracked parse error', error);
    return [];
  }
};

const sanitizeTrackedItems = items => {
  if (!Array.isArray(items)) return [];
  const unique = new Set();
  items.forEach(value => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) unique.add(trimmed);
    }
  });
  return Array.from(unique);
};

const accumulateTotalsFromItem = (
  item,
  isPending,
  fallbackToken,
  auditId,
  totals,
  trackedSet
) => {
  if (!item) return { nc: 0, ofi: 0 };

  const checkTypeFields = [
    'CheckNC',
    'Category',
    'categoryDrop',
    'CategoryType',
    'checkType',
    'check_type',
    'CheckType',
    'CheckNc',
    'checkNc',
    'checknc',
    'ncType',
    'nc_type',
  ];

  const categoryFields = [
    'Category',
    'CategoryType',
    'categoryDrop',
    'CategoryDesc',
    'category',
    'category_desc',
  ];

  const processFields = ['ProcessName', 'processName', 'Process', 'process'];
  const pendingProcessFields = ['selectedItemsProcess', ...processFields];

  const checkSource = pickFirstAvailable(item, checkTypeFields);
  const checkType = normalizeCheckType(checkSource);
  if (!checkType) {
    return { nc: 0, ofi: 0 };
  }

  const categorySource = pickFirstAvailable(item, categoryFields);
  const categoryType = normalizeCategory(categorySource);
  const processInfo = pickFirstAvailable(
    item,
    isPending ? pendingProcessFields : processFields
  );

  const itemKey = generateItemKey(
    item,
    checkType,
    auditId,
    fallbackToken,
    isPending
  );
  if (!itemKey) {
    return { nc: 0, ofi: 0 };
  }
  if (trackedSet.has(itemKey)) {
    return { nc: 0, ofi: 0 };
  }

  trackedSet.add(itemKey);

  if (checkType === 'NC') {
    totals.TotalNC += 1;
    if (hasProcess(processInfo)) totals.ProcessNC += 1;
    if (categoryType === 'Major') totals.MajorNC += 1;
    if (categoryType === 'Minor') totals.MinorNC += 1;
    return { nc: 1, ofi: 0 };
  }

  if (checkType === 'OFI') {
    totals.TotalOFI += 1;
    if (hasProcess(processInfo)) totals.ProcessOFI += 1;
    if (categoryType === 'Major') totals.MajorOFI += 1;
    if (categoryType === 'Minor') totals.MinorOFI += 1;
    return { nc: 0, ofi: 1 };
  }

  return { nc: 0, ofi: 0 };
};

const createAuditKeyInfo = audit => {
  if (audit === undefined || audit === null) return null;
  const raw = String(audit);
  if (!raw) return null;
  const trimmed = raw.trim();
  const canonical = trimmed.length > 0 ? trimmed : raw;
  if (!canonical) return null;
  const variants = [];
  variants.push(canonical);
  if (raw !== canonical) variants.push(raw);
  return {
    canonical,
    variants: Array.from(new Set(variants.filter(Boolean))),
  };
};

const buildKeyVariants = (audit, suffix) => {
  const info = createAuditKeyInfo(audit);
  if (!info) return { canonical: null, variants: [] };
  const variants = info.variants.map(value => `audit_summary_${suffix}_${value}`);
  const canonical = `audit_summary_${suffix}_${info.canonical}`;
  return { canonical, variants };
};

const totalsKeyInfoForAudit = audit => buildKeyVariants(audit, 'totals');
const totalNcKeyInfoForAudit = audit => buildKeyVariants(audit, 'total_nc');
const totalOfiKeyInfoForAudit = audit => buildKeyVariants(audit, 'total_ofi');
const trackedItemsKeyInfoForAudit = audit => buildKeyVariants(audit, 'tracked_keys');
const aggregateTotalsKeyInfoForAudit = audit =>
  buildKeyVariants(audit, 'aggregate_totals');
const aggregateTrackedItemsKeyInfoForAudit = audit =>
  buildKeyVariants(audit, 'aggregate_tracked_keys');

const canonicalAuditKey = audit => {
  const info = createAuditKeyInfo(audit);
  if (info && info.canonical) return info.canonical;
  if (audit === undefined || audit === null) return '';
  const raw = String(audit);
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : raw;
};

const toArray = value => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') return Object.values(parsed);
    } catch (_error) {
      // ignore parse error
    }
    return [];
  }
  if (value && typeof value === 'object') return Object.values(value);
  return [];
};

const collapseValueToString = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

const collapseAndTrim = (value, maxLength = 80) => {
  const result = collapseValueToString(value);
  if (!result) return '';
  return result.length > maxLength ? result.slice(0, maxLength) : result;
};

const pickFirstAvailable = (item, fields) => {
  if (!item) return null;
  for (const field of fields) {
    if (field === '__self__') {
      if (collapseAndTrim(item)) {
        return item;
      }
      continue;
    }
    const value = item?.[field];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return null;
};

const normalizeCheckType = value => {
  if (value === null || value === undefined) return null;

  const fromString = rawValue => {
    const trimmed = rawValue.trim().toLowerCase();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/[\s_-]+/g, ' ');
    if (
      normalized === '0' ||
      normalized === 'nc' ||
      normalized === 'nonconformity' ||
      normalized === 'non conformity' ||
      normalized === 'non-conformity'
    ) {
      return 'NC';
    }

    if (
      normalized === '1' ||
      normalized === 'ofi' ||
      normalized === 'opportunity for improvement' ||
      normalized === 'opportunity for improvements'
    ) {
      return 'OFI';
    }

    if (
      normalized.includes('nc') ||
      normalized.includes('non conform')
    ) {
      return 'NC';
    }

    if (
      normalized.includes('ofi') ||
      normalized.includes('opportunity')
    ) {
      return 'OFI';
    }

    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) {
      if (parsed === 0) return 'NC';
      if (parsed === 1) return 'OFI';
    }

    return null;
  };

  if (typeof value === 'string') {
    return fromString(value);
  }

  if (typeof value === 'number') {
    if (value === 0) return 'NC';
    if (value === 1) return 'OFI';
    return null;
  }

  if (typeof value === 'boolean') {
    return value ? 'OFI' : 'NC';
  }

  if (typeof value === 'object') {
    if ('value' in value) return normalizeCheckType(value.value);
    if ('label' in value) return normalizeCheckType(value.label);
    if ('name' in value) return normalizeCheckType(value.name);
    if ('checkType' in value) return normalizeCheckType(value.checkType);
    if ('id' in value) return normalizeCheckType(value.id);
    return null;
  }

  return null;
};

const normalizeCategory = value => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('major')) return 'Major';
    if (normalized.includes('minor')) return 'Minor';
    return null;
  }

  if (typeof value === 'number') {
    if (value === 1) return 'Major';
    if (value === 2) return 'Minor';
    return null;
  }

  if (typeof value === 'object') {
    if ('value' in value) return normalizeCategory(value.value);
    if ('label' in value) return normalizeCategory(value.label);
    if ('name' in value) return normalizeCategory(value.name);
    if ('category' in value) return normalizeCategory(value.category);
    if ('id' in value) return normalizeCategory(value.id);
  }

  return null;
};

const hasProcess = processField => {
  if (!processField) return false;
  if (Array.isArray(processField)) return processField.length > 0;
  if (typeof processField === 'string') return processField.trim().length > 0;
  return true;
};

const generateItemKey = (item, checkType, auditIdValue, fallbackIndex = null, isPending = false) => {
  if (!item) return null;
  const auditMarker = collapseAndTrim(
    auditIdValue === undefined || auditIdValue === null ? '' : auditIdValue,
    24
  );
  const auditSection = auditMarker ? `audit_${auditMarker}` : 'audit_unknown';
  const typeSection = collapseAndTrim(checkType || 'unknown', 16) || 'unknown';

  const candidateGroups = [
    ['uniqueNCkey', 'UniqueNCkey', 'uniqueNcKey'],
    ['NCNumber', 'ncNumber', 'NcNumber', 'NCNo', 'ncNo'],
    ['ncIdentifier', 'NCIdentifier'],
    ['PendingId', 'pendingId', 'PendingID'],
    ['ChecklistTemplateId', 'ChecklistTemplateID', 'ChecklistId', 'ChecklistID'],
    ['ChecklistItemId', 'ChecklistItemID', 'checklistItemId', 'checklistItemID'],
    ['CheckPointId', 'CheckPointID', 'CheckpointId', 'CheckpointID'],
    ['CheckId', 'CheckID', 'checkId'],
    ['id', 'Id', 'ID'],
    ['LocalId', 'localId', 'LocalID'],
    ['Sno', 'SNo', 'SerialNo', 'serialNo'],
  ];

  for (const group of candidateGroups) {
    const candidateValue = pickFirstAvailable(item, group);
    const collapsed = collapseAndTrim(candidateValue);
    if (collapsed) {
      return `${auditSection}_${typeSection}_${collapsed}`;
    }
  }

  const fallbackFields = [
    'Category',
    'CategoryType',
    'categoryDrop',
    'CategoryDesc',
    'category',
    'category_desc',
    'ProcessName',
    'processName',
    'Process',
    'process',
    'selectedItemsProcess',
    'Remark',
    'remark',
    'Remarks',
    'remarks',
    'description',
    'Description',
    'createdDate',
    'CreatedDate',
    'ModifiedDate',
    'modifiedDate',
    'timestamp',
  ];

  const fallbackParts = [];
  fallbackFields.forEach(field => {
    const value = collapseAndTrim(item?.[field], 40);
    if (value) fallbackParts.push(value);
  });

  if (fallbackParts.length > 0) {
    const fallbackKey = fallbackParts.join('|');
    return `${auditSection}_${typeSection}_${fallbackKey.slice(0, 160)}`;
  }

  try {
    const serialized = JSON.stringify(item);
    if (serialized) {
      return `${auditSection}_${typeSection}_${serialized.slice(0, 160)}`;
    }
  } catch (error) {
    console.log('AuditSummary item key serialization error', error);
  }

  if (fallbackIndex !== null) {
    return `${auditSection}_${typeSection}_idx_${fallbackIndex}_${
      isPending ? 'pending' : 'uploaded'
    }`;
  }

  return `${auditSection}_${typeSection}_fallback_${Date.now()}`;
};

const buildAuditSummarySnapshot = (records, auditId) => {
  if (!auditId) {
    return { totals: { ...baseTotals }, trackedKeys: [] };
  }

  const totals = { ...baseTotals };
  const trackedSet = new Set();
  const metrics = {
    recordsProcessed: 0,
    uploadedEvaluated: 0,
    pendingEvaluated: 0,
    skippedMissingCheckType: 0,
    skippedDuplicateKey: 0,
    newKeysTracked: 0,
    ncIncrements: 0,
    ofiIncrements: 0,
  };

  logAuditSnapshot('build:start', {
    auditId,
    recordsCount: Array.isArray(records) ? records.length : 0,
  });

  const checkTypeFields = [
    'CheckNC',
    'Category',
    'categoryDrop',
    'CategoryType',
    'checkType',
    'check_type',
    'CheckType',
    'CheckNc',
    'checkNc',
    'checknc',
    'ncType',
    'nc_type',
  ];

  const categoryFields = [
    'Category',
    'CategoryType',
    'categoryDrop',
    'CategoryDesc',
    'category',
    'category_desc',
  ];

  const processFields = ['ProcessName', 'processName', 'Process', 'process'];
  const pendingProcessFields = ['selectedItemsProcess', ...processFields];

  const relevantRecords = (records || []).filter(record => {
    const recordAuditId = record?.AuditID ?? record?.AuditId ?? record?.auditId;
    if (recordAuditId === undefined || recordAuditId === null) return false;
    return String(recordAuditId) === String(auditId);
  });

  const registerItem = (item, isPending, fallbackToken) => {
    if (!item) return;

    const checkSource = pickFirstAvailable(item, checkTypeFields);
    const checkType = normalizeCheckType(checkSource);
    if (!checkType) {
      metrics.skippedMissingCheckType += 1;
      return;
    }

    const categorySource = pickFirstAvailable(item, categoryFields);
    const categoryType = normalizeCategory(categorySource);
    const processInfo = pickFirstAvailable(
      item,
      isPending ? pendingProcessFields : processFields
    );
    const itemKey = generateItemKey(
      item,
      checkType,
      auditId,
      fallbackToken,
      isPending
    );
    if (!itemKey) {
      metrics.skippedDuplicateKey += 1;
      return;
    }
    if (trackedSet.has(itemKey)) {
      metrics.skippedDuplicateKey += 1;
      return;
    }

    trackedSet.add(itemKey);
    metrics.newKeysTracked += 1;

    if (checkType === 'NC') {
      totals.TotalNC += 1;
      if (hasProcess(processInfo)) totals.ProcessNC += 1;
      if (categoryType === 'Major') totals.MajorNC += 1;
      if (categoryType === 'Minor') totals.MinorNC += 1;
      metrics.ncIncrements += 1;
    } else if (checkType === 'OFI') {
      totals.TotalOFI += 1;
      if (hasProcess(processInfo)) totals.ProcessOFI += 1;
      if (categoryType === 'Major') totals.MajorOFI += 1;
      if (categoryType === 'Minor') totals.MinorOFI += 1;
      metrics.ofiIncrements += 1;
    }
  };

  relevantRecords.forEach((record, recordIndex) => {
    const uploadedItems = toArray(record?.Uploaded);
    const pendingItems = toArray(record?.Pending);
    metrics.recordsProcessed += 1;
    metrics.uploadedEvaluated += uploadedItems.length;
    metrics.pendingEvaluated += pendingItems.length;

    uploadedItems.forEach((item, idx) =>
      registerItem(item, false, `u_${recordIndex}_${idx}`)
    );
    pendingItems.forEach((item, idx) =>
      registerItem(item, true, `p_${recordIndex}_${idx}`)
    );
  });

  logAuditSnapshot('build:complete', {
    auditId,
    totals,
    trackedCount: trackedSet.size,
    metrics,
  });

  return { totals, trackedKeys: Array.from(trackedSet) };
};


const mergeAuditSummaryAggregate = async (records, auditId) => {
  if (auditId === undefined || auditId === null || auditId === '') {
    return { totals: { ...baseTotals }, trackedKeys: [], updated: false };
  }

  const aggregateTotalsKeyInfo = aggregateTotalsKeyInfoForAudit(auditId);
  const aggregateTrackedKeyInfo = aggregateTrackedItemsKeyInfoForAudit(auditId);

  const relevantRecords = (records || []).filter(record => {
    const recordAuditId = record?.AuditID ?? record?.AuditId ?? record?.auditId;
    if (recordAuditId === undefined || recordAuditId === null) {
      return false;
    }
    return String(recordAuditId) === String(auditId);
  });

  const snapshot = buildAuditSummarySnapshot(relevantRecords, auditId);
  const sanitizedTotals = sanitizeTotals(snapshot?.totals);
  const trackedArray = Array.isArray(snapshot?.trackedKeys)
    ? sanitizeTrackedItems(snapshot.trackedKeys)
    : [];

  logAuditSnapshot('aggregate:recomputed', {
    auditId: canonicalAuditKey(auditId),
    relevantRecords: relevantRecords.length,
    totals: sanitizedTotals,
    trackedCount: trackedArray.length,
  });

  try {
    const aggregatePairs = [];
    const totalsJson = JSON.stringify(sanitizedTotals);
    const trackedJson = JSON.stringify(trackedArray);

    aggregateTotalsKeyInfo.variants.forEach(key => {
      aggregatePairs.push([key, totalsJson]);
    });
    aggregateTrackedKeyInfo.variants.forEach(key => {
      aggregatePairs.push([key, trackedJson]);
    });

    const uniquePairs = aggregatePairs.filter(
      pair => Array.isArray(pair) && pair[0] !== undefined && pair[0] !== null,
    );
    if (uniquePairs.length > 0) {
      await AsyncStorage.multiSet(uniquePairs);
      logAuditSnapshot('aggregate:stored', {
        auditId: canonicalAuditKey(auditId),
        totals: sanitizedTotals,
        trackedCount: trackedArray.length,
      });
    } else {
      logAuditSnapshot('aggregate:skippedStore', {
        auditId: canonicalAuditKey(auditId),
        reason: 'noValidPairs',
      });
    }
  } catch (error) {
    console.log('AuditSummary aggregate persist error', error);
  }

  return {
    totals: sanitizedTotals,
    trackedKeys: trackedArray,
    updated: true,
  };
};



const persistAuditSummarySnapshot = async (records, auditId) => {
  if (auditId === undefined || auditId === null || auditId === '') {
    return;
  }

  const snapshot = buildAuditSummarySnapshot(records, auditId);
  const totalsKeyInfo = totalsKeyInfoForAudit(auditId);
  const totalNcKeyInfo = totalNcKeyInfoForAudit(auditId);
  const totalOfiKeyInfo = totalOfiKeyInfoForAudit(auditId);
  const trackedItemsKeyInfo = trackedItemsKeyInfoForAudit(auditId);

  let aggregateResult = null;
  try {
    aggregateResult = await mergeAuditSummaryAggregate(records, auditId);
  } catch (error) {
    console.log('AuditSummary aggregate merge error', error);
  }

  const finalTotals = aggregateResult?.totals
    ? sanitizeTotals(aggregateResult.totals)
    : sanitizeTotals(snapshot.totals);
  const finalTracked = Array.isArray(aggregateResult?.trackedKeys)
    ? aggregateResult.trackedKeys
    : snapshot.trackedKeys;

  try {
    const totalsJson = JSON.stringify(finalTotals);
    const trackedJson = JSON.stringify(finalTracked);
    const writePairs = [];
    totalsKeyInfo.variants.forEach(key => {
      writePairs.push([key, totalsJson]);
    });
    trackedItemsKeyInfo.variants.forEach(key => {
      writePairs.push([key, trackedJson]);
    });
    const uniquePairs = writePairs.filter(
      pair => Array.isArray(pair) && pair[0] !== undefined && pair[0] !== null,
    );
    if (uniquePairs.length > 0) {
      await AsyncStorage.multiSet(uniquePairs);
    }
    logAuditSnapshot('persist:totalsStored', {
      auditId: canonicalAuditKey(auditId),
      totalsKeys: totalsKeyInfo.variants,
      trackedKeys: trackedItemsKeyInfo.variants,
      totals: finalTotals,
      trackedCount: finalTracked.length,
    });

    const countPairs = [];
    if (Number.isFinite(finalTotals.TotalNC)) {
      totalNcKeyInfo.variants.forEach(key => {
        countPairs.push([key, String(finalTotals.TotalNC)]);
      });
    }
    if (Number.isFinite(finalTotals.TotalOFI)) {
      totalOfiKeyInfo.variants.forEach(key => {
        countPairs.push([key, String(finalTotals.TotalOFI)]);
      });
    }
    if (countPairs.length > 0) {
      await AsyncStorage.multiSet(countPairs);
      logAuditSnapshot('persist:countPairsStored', {
        auditId: canonicalAuditKey(auditId),
        countPairs,
      });
    }
  } catch (error) {
    console.log('AuditSummary snapshot persist error', error);
  }
};


const clearAuditSummarySnapshot = async auditId => {
  if (auditId === undefined || auditId === null || auditId === '') {
    return;
  }
  const totalsKeyInfo = totalsKeyInfoForAudit(auditId);
  const totalNcKeyInfo = totalNcKeyInfoForAudit(auditId);
  const totalOfiKeyInfo = totalOfiKeyInfoForAudit(auditId);
  const trackedItemsKeyInfo = trackedItemsKeyInfoForAudit(auditId);
  const aggregateTotalsKeyInfo = aggregateTotalsKeyInfoForAudit(auditId);
  const aggregateTrackedKeyInfo = aggregateTrackedItemsKeyInfoForAudit(auditId);
  const keys = Array.from(
    new Set(
      [
        ...totalsKeyInfo.variants,
        ...totalNcKeyInfo.variants,
        ...totalOfiKeyInfo.variants,
        ...trackedItemsKeyInfo.variants,
        ...aggregateTotalsKeyInfo.variants,
        ...aggregateTrackedKeyInfo.variants,
      ].filter(Boolean),
    ),
  );
  try {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
    logAuditSnapshot('clear', {
      auditId: canonicalAuditKey(auditId),
      removedKeys: keys,
    });
  } catch (error) {
    console.log('AuditSummary snapshot clear error', error);
  }
};

export {
  buildAuditSummarySnapshot,
  persistAuditSummarySnapshot,
  clearAuditSummarySnapshot,
};
