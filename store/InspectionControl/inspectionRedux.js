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

export const INITIAL_STATE = Immutable({
    inspectList: [], // Initial state for the count,
});

/* ------------- Reducers ------------- */

// Set a specific count
const storeInspectList = (state, { inspectList }) => state.merge({ inspectList:inspectList });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INSPECT_LIST]: storeInspectList,
});
