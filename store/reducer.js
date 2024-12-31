import { combineReducers } from 'redux';
import commonReducer from './common/reducer';
const rootReducer = combineReducers({
    commonState: commonReducer,
});

export default rootReducer;
