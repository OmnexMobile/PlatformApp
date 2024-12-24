import { combineReducers } from 'redux';
import homeReducer from 'screens/home/home.reducer';
import profileReducer from 'screens/profile/profile.reducer';
import commonReducer from './common/reducer';
const rootReducer = combineReducers({
    commonState: commonReducer,
    homeRedux: homeReducer,
    profile: profileReducer,
});

export default rootReducer;
