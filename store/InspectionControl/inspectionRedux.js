import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';
import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  // Define your actions here
  inspectList:['inspectList']
});

export const InspectTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
    inspectList: [], // Initial state for the count,
};

/* ------------- Reducers ------------- */

// Set a specific count
const storeInspectList = (state, { inspectList }) => {
  return {...state,inspectList:inspectList}
}

/* ------------- Hookup Reducers To Types ------------- */
const rawReducer = createReducer(INITIAL_STATE, {
  [Types.INSPECT_LIST]: storeInspectList,
});
const persistConfig = {
  key: 'inspect', // Unique key for the reducer's data
  storage: AsyncStorage, // AsyncStorage for persistence
};
export const reducer = persistReducer(persistConfig, rawReducer);
