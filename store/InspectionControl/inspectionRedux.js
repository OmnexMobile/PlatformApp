import AsyncStorage from '@react-native-community/async-storage';
import { update } from 'ramda';
import { persistReducer } from 'redux-persist';
import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    // Define your actions here
    inspectList: ['inspectList'],
    icUserData: ['icUserData'],
    icSettings: ['icSettings'],
    removeInspectList: ['removeInspectList'],
    updateInspectList: ['updateInspectList'],
    deleteAllInspectList: ['deleteAllInspectList'],
    resetToInitial: ['resetToInitial'],
    storeLoginLogo: ['storeLoginLogo'],
    resetAll:['resetAll'],
    dateFormat: ['dateFormat'],
});

export const InspectTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
    inspectList: [],
    icUserData: {},
    icSettings: {},
    icLoginlogo: '',
    dateFormat:'',
};

/* ------------- Reducers ------------- */

// Set a specific count
const storeLoginLogo = (state, { icLoginlogo }) => {
    return { ...state, icLoginlogo: icLoginlogo };
};
const dateFormat = (state, { dateFormat }) => {
    return { ...state, dateFormat: dateFormat };
}
const storeInspectList = (state, { inspectList }) => {
    return { ...state, inspectList: [...state.inspectList, ...inspectList] };
};
const deleteAllInspectList = (state, { inspectList }) => {
    return { ...state, inspectList: [] };
};
const removeInspectList = (state, { inspectionToRemove }) => {
    //  inspection.intProductionItemID == inspectionToRemove.intProductionItemID &&
    //         inspection.OperationID == inspectionToRemove.OperationID &&
    //         inspection?.OrderDetailsId == inspectionToRemove?.OrderDetailsId
    const indexToRemove = state.inspectList.findIndex(inspection => inspection?.uniqueId == inspectionToRemove?.uniqueId);
    if (indexToRemove > -1) {
        const updatedInspectList = [...state.inspectList];
        updatedInspectList.splice(indexToRemove, 1);
        return { ...state, inspectList: updatedInspectList };
    }
    return state;
};
const storeIcUserData = (state, { icUserData }) => {
    return { ...state, icUserData: icUserData };
};

const storeIcSettings = (state, { icSettings }) => {
    return { ...state, icSettings: icSettings };
};
const getStatus = updatedData => {
    const ststusBoolean = (updatedData?.VariableCharacteristics || [])
        .concat(updatedData?.AttributeCharacteristics || [])
        .every(item => item?.status == 'Completed');
    const someValues = (updatedData?.VariableCharacteristics || [])
        .concat(updatedData?.AttributeCharacteristics || [])
        .some(item => item?.status == 'Completed');
    return {
        status: ststusBoolean ? 'Completed' : someValues ? 'In Progress' : 'Launch',
    };
};
const updateInspectList = (state, { updatedData }) => {
    const { status } = getStatus(updatedData);
    const updatedArray = state.inspectList.map(item => {
        if (item?.uniqueId === updatedData?.uniqueId) {
            return { ...item, ...updatedData, status: status }; // merge changes
        }
        return item; // leave others unchanged
    });
    return { ...state, inspectList: updatedArray };
};
const resetToInitial = state => {
    return {
        ...state,
        inspectList: [],
        icUserData: {},
        icSettings: {},
    };
};
const resetAll = () => {
    return INITIAL_STATE;
};

/* ------------- Hookup Reducers To Types ------------- */
const rawReducer = createReducer(INITIAL_STATE, {
    [Types.INSPECT_LIST]: storeInspectList,
    [Types.IC_USER_DATA]: storeIcUserData,
    [Types.IC_SETTINGS]: storeIcSettings,
    [Types.REMOVE_INSPECT_LIST]: removeInspectList,
    [Types.UPDATE_INSPECT_LIST]: updateInspectList,
    [Types.DELETE_ALL_INSPECT_LIST]: deleteAllInspectList,
    [Types.RESET_TO_INITIAL]: resetToInitial,
    [Types.STORE_LOGIN_LOGO]: storeLoginLogo,
    [Types.RESET_ALL]: resetAll,
    [Types.DATE_FORMAT]: dateFormat,
});
const persistConfig = {
    key: 'inspect', // Unique key for the reducer's data
    storage: AsyncStorage, // AsyncStorage for persistence
};
export const reducer = persistReducer(persistConfig, rawReducer);
