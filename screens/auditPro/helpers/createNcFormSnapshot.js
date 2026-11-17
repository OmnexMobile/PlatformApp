const normalizeText = value => (value === undefined || value === null ? '' : String(value).trim());

export const getCreateNcValidationErrors = (state, { isLpaForm = false, smdata } = {}) => {
    const hasText = value => typeof value === 'string' && value.trim().length > 0;
    const hasSelection = value => Array.isArray(value) && value.length > 0;
    const hasDropdownValue = value => {
        const candidates = value && typeof value === 'object' ? [value.id, value.value, value.FailureCategoryId] : [value];
        return candidates.some(id => id !== undefined && id !== null && String(id).trim() !== '' && String(id) !== '0');
    };
    const isNC = state.RouteParam === 'NC';
    const hasLpaSelection = value => hasDropdownValue(value) || hasSelection(value);
    const simplifiedForm = Number(smdata) === 2 || Number(smdata) === 3;
    const needsClause = isNC && Number(state.clauseMandatory) === 1 && !(isLpaForm && state.isLPA);
    const category = state.NCcategoryt;

    return {
        nonconfirmityText: isNC && !hasText(state.nonconfirmityText),
        ofitext: !isNC && !hasText(state.ofitext),
        NCcategoryt: !hasDropdownValue(category),
        NCFailure: !hasDropdownValue(state.NCFailure),
        NCrequestby: !isLpaForm && !hasDropdownValue(state.NCrequestby),
        selectedItemsResponse: isLpaForm && !hasSelection(state.selectedItemsResponse),
        selectedItemsProcess: !hasSelection(state.selectedItemsProcess),
        NCresponsible: isLpaForm ? !hasLpaSelection(state.NCresponsible) : !hasDropdownValue(state.NCresponsible),
        selectedItems: needsClause && !hasSelection(state.selectedItems) && !(isLpaForm && hasText(state.displayData)),
        objEvidence: !isLpaForm && !simplifiedForm && !hasText(state.objEvidence),
        displayData: !isLpaForm && isNC && Number(smdata) !== 3 && !hasText(state.displayData),
    };
};

const normalizeArray = value => {
    const items = Array.isArray(value) ? value : [];
    return JSON.stringify(
        items.map(item => {
            if (item && typeof item === 'object') {
                return item.id ?? item.fileName ?? item;
            }
            return item;
        }),
    );
};

export const captureCreateNcFormSnapshot = state => ({
    nonconfirmityText: normalizeText(state.nonconfirmityText),
    ofitext: normalizeText(state.ofitext),
    objEvidence: normalizeText(state.objEvidence),
    recommAction: normalizeText(state.recommAction),
    documentRef: normalizeText(state.documentRef),
    requirementText: normalizeText(state.requirementText),
    displayData: normalizeText(state.displayData),
    ncIdentifier: normalizeText(state.ncIdentifier),
    NCcategoryt: normalizeText(state.NCcategoryt),
    NCuser: normalizeText(state.NCuser),
    NCrequestby: normalizeText(state.NCrequestby),
    NCdept: normalizeText(state.NCdept),
    NCFailure: normalizeText(state.NCFailure),
    selectedItems: normalizeArray(state.selectedItems),
    selectedItemsProcess: normalizeArray(state.selectedItemsProcess),
    fileArrayList: JSON.stringify(state.fileArrayList || []),
});

export const hasCreateNcUnsavedChanges = (state, baseline) => {
    if (state.isSaved) {
        return false;
    }

    const current = captureCreateNcFormSnapshot(state);

    if (!baseline) {
        return Object.values(current).some(value => value && value !== '[]');
    }

    return Object.keys(baseline).some(key => baseline[key] !== current[key]);
};
