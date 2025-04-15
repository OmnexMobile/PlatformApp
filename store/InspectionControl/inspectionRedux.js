import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';
import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  // Define your actions here
  inspectList:['inspectList'],
  icUserData:["icUserData"],
  icSettings:["icSettings"],
  removeInspectList:["removeInspectList"],
});

export const InspectTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
    inspectList: [], 
    icUserData:{},
    icSettings:{},
};

/* ------------- Reducers ------------- */

// Set a specific count
const storeInspectList = (state, { inspectList }) => {
  return {...state,inspectList:[...state.inspectList,...inspectList]}
}
const removeInspectList = (state, { inspectionToRemove }) => {
  const updatedInspectList = state.inspectList.filter(
    inspection => inspection.intProductionItemID !== inspectionToRemove.intProductionItemID
  );
  console.log('state.inspectList',state.inspectList,);
  console.log('updatedInspectList',updatedInspectList);
  console.log('inspectionToRemove', inspectionToRemove);

  return { ...state, inspectList: [...updatedInspectList] };
};
const storeIcUserData=(state, { icUserData })=>{
  return {...state,icUserData:icUserData}
}

const storeIcSettings=(state, { icSettings })=>{
  return {...state,icSettings:icSettings}
}
/* ------------- Hookup Reducers To Types ------------- */
const rawReducer = createReducer(INITIAL_STATE, {
  [Types.INSPECT_LIST]: storeInspectList,
  [Types.IC_USER_DATA]: storeIcUserData,
  [Types.IC_SETTINGS]: storeIcSettings,
  [Types.REMOVE_INSPECT_LIST]: removeInspectList,
});
const persistConfig = {
  key: 'inspect', // Unique key for the reducer's data
  storage: AsyncStorage, // AsyncStorage for persistence
};
export const reducer = persistReducer(persistConfig, rawReducer);
