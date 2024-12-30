import { combineReducers } from 'redux';
import homeReducer from '../screens/home/home.reducer';
import profileReducer from '../screens/profile/profile.reducer';
import commonReducer from './common/reducer';

const rootReducer = combineReducers({
    commonState: commonReducer,
    homeRedux: homeReducer,
    profile: profileReducer,
    audits: require('./AuditPro/auditRedux').reducer,
    notifications: require('./AuditPro/notificationsRedux').reducer, // audits: auditReducer,
    search: require('./AuditPro/searchRedux').reducer,
    projects: require('./APQP/apqpRedux').reducer,
});

export default rootReducer;
