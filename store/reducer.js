import { combineReducers } from 'redux';
import homeReducer from '../screens/home/home.reducer';
import profileReducer from '../screens/profile/profile.reducer';
import commonReducer from './common/reducer';

const noopReducer = (state = {}) => state;

const getReducerExport = (moduleName, loadModule) => {
    try {
        const moduleExports = loadModule();
        if (typeof moduleExports?.reducer === 'function') {
            return moduleExports.reducer;
        }
        console.error(`[store/reducer] Missing reducer export from ${moduleName}`);
        return noopReducer;
    } catch (error) {
        console.error(`[store/reducer] Failed to load ${moduleName}`, error);
        return noopReducer;
    }
};

const rootReducer = combineReducers({
    commonState: commonReducer,
    homeRedux: homeReducer,
    profile: profileReducer,
    audits: getReducerExport('./AuditPro/auditRedux', () => require('./AuditPro/auditRedux')),
    notifications: getReducerExport('./AuditPro/notificationsRedux', () => require('./AuditPro/notificationsRedux')),
    search: getReducerExport('./AuditPro/searchRedux', () => require('./AuditPro/searchRedux')),
    github: getReducerExport('./APQP/githubRedux', () => require('./APQP/githubRedux')),
    projects: getReducerExport('./APQP/apqpRedux', () => require('./APQP/apqpRedux')),
    inspection: getReducerExport('./InspectionControl/inspectionRedux', () => require('./InspectionControl/inspectionRedux')),
});

export default rootReducer;
