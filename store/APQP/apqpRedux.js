import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

function ensureImmutable(state) {
  return Immutable.isImmutable(state) ? state : Immutable(state);
}

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storeCounts: ["counts"],
  storeMeetings: ["meetings"],
  clearMeetings: null,
  storeActions: ["actions"],
  clearActions: null,
  storeProjects: ["projects"],
  clearProjects: null,
  storeUserSession: ["userSession"],
  storeLanguage: ["userLanguage"],
  storeServerUrl: ["setServerUrl"],
  storeDeviceRegStatus: ["registrationState"],
  changeConnectionState: ["connectionState"],
  changeOfflineModeState: ["isOfflineMode"],
  storeDateFormat: ["userDateFormat"],
  storeLoginSession: ["isActive"],
  updateRecentActivityList: ["recentActivity"],
  SetRecentActivityList: ["recentActivity"],
  storeUserName: ["loginuser"],
});

export const TemperatureTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  documents: [],
  meetings: [],
  risks: [],
  actions: [],
  counts: null,
  projects: [],
  recentActivity: [],
  serverUrl: null,
  userId: null,
  userName: null,
  language: null,
  token: null,
  siteId: null,
  address: null,
  companyname: null,
  companyurl: null,
  logo: null,
  phone: null,
  isConnected: true,
  isDeviceRegistered: false,
  isOfflineMode: false,
  userDateFormat: "MM/DD/YYYY",
  isActive: null,
  loginuser: null,
});

/* ------------- Reducers ------------- */

export const updateRecentActivityList = (state, { recentActivity }) => {
  console.log("reducer updateRecentAuditList", recentActivity);
  state = ensureImmutable(state);
  return state.merge({ recentActivity: recentActivity });
};
export const SetRecentActivityList = (state, { recentActivity }) => {
  console.log("reducer updateRecentAuditList", recentActivity);
  state = ensureImmutable(state);
  return state.merge({ recentActivity: recentActivity });
};
export const storeMeetings = (state, { meetings }) => {
  state = ensureImmutable(state);
  return state.merge({ meetings: meetings });
};

export const clearMeetings = (state) => INITIAL_STATE;

export const storeActions = (state, { actions }) => {
  //console.log("storeActions", actions);
  state = ensureImmutable(state);
  return state.merge({ actions: actions });
};

export const storeCounts = (state, { counts }) => {
  //console.log("storeActions", actions);
  state = ensureImmutable(state);
  return state.merge({ counts: counts });
};

export const clearActions = (state) => INITIAL_STATE;

export const storeProjects = (state, { projects }) => {
  state = ensureImmutable(state);
  return state.merge({ projects: projects });
};

export const storeLoginSession = (state, { isActive }) => {
  state = ensureImmutable(state);
  return state.merge({ isActive: isActive });
};

export const storeUserSession = (
  state,
  {
    userName,
    userId,
    token,
    siteId,
    address,
    companyname,
    companyurl,
    logo,
    phone,
  }
) => {
  state = ensureImmutable(state);
  return state.merge({
    userName: userName,
    userId: userId,
    token: token,
    siteId: siteId,
    address: address,
    companyname: companyname,
    companyurl: companyurl,
    logo: logo,
    phone: phone,
  });
};

export const storeLanguage = (state, { language }) => {
  state = ensureImmutable(state);
  return state.merge({ language: language });
};

export const storeServerUrl = (state, { serverUrl }) => {
  state = ensureImmutable(state);
  return state.merge({ serverUrl: serverUrl });
};

export const storeDeviceRegStatus = (state, { isDeviceRegistered }) => {
  state = ensureImmutable(state);
  return state.merge({ isDeviceRegistered: isDeviceRegistered });
};

export const changeConnectionState = (state, { isConnected }) => {
  // console.log('reducer changeConnectionState', isConnected)
  state = ensureImmutable(state);
  return state.merge({ isConnected: isConnected });
};

export const changeOfflineModeState = (state, { isOfflineMode }) => {
  // console.log('reducer changeOfflineModeState', isOfflineMode)
  state = ensureImmutable(state);
  return state.merge({ isOfflineMode: isOfflineMode });
};

export const storeUserName = (state, { loginuser }) => {
  console.log("reducer changeOfflineModeState", loginuser);
  state = ensureImmutable(state);
  return state.merge({ loginuser: loginuser });
};

export const clearProjects = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STORE_COUNTS]: storeCounts,
  [Types.STORE_ACTIONS]: storeActions,
  [Types.CLEAR_ACTIONS]: clearActions,
  [Types.STORE_MEETINGS]: storeMeetings,
  [Types.CLEAR_MEETINGS]: clearMeetings,
  [Types.STORE_PROJECTS]: storeProjects,
  [Types.STORE_LOGIN_SESSION]: storeLoginSession,
  [Types.STORE_USER_SESSION]: storeUserSession,
  [Types.STORE_LANGUAGE]: storeLanguage,
  [Types.STORE_SERVER_URL]: storeServerUrl,
  [Types.STORE_DEVICE_REG_STATUS]: storeDeviceRegStatus,
  [Types.CHANGE_CONNECTION_STATE]: changeConnectionState,
  [Types.CHANGE_OFFLINE_MODE_STATE]: changeOfflineModeState,
  [Types.CLEAR_PROJECTS]: clearProjects,
  [Types.STORE_USER_NAME]: storeUserName,
  [Types.UPDATE_RECENT_ACTIVITY_LIST]: updateRecentActivityList,
  [Types.SET_RECENT_ACTIVITY_LIST]: SetRecentActivityList,
});
