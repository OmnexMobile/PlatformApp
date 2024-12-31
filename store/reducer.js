import { combineReducers } from 'redux';
import homeReducer from 'screens/home/home.reducer';
import commonReducer from './common/reducer';
const rootReducer = combineReducers({
    commonState: commonReducer,
    homeRedux: homeReducer,
});

export default rootReducer;
