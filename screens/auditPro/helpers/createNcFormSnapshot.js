const normalizeText = value => (value === undefined || value === null ? '' : String(value).trim());

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
