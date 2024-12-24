import { call, put } from 'redux-saga/effects';
import localStorage from 'global/localStorage';
import { APP_VARIABLES } from 'constants/app-constant';
import { getProfileSuccess, getProfileFailure, updateProfileSuccess, updateProfileFailure, getProfile } from './profile.action';
import ProfileService from './profile.service';
import { showMessage } from 'react-native-flash-message';
import { Colors } from 'constants/theme-constants';
import { showErrorMessage } from 'helpers/utils';

export function* getProfileSaga() {
    try {
        const userId = yield localStorage.getStringItem(APP_VARIABLES.USER_ID);
        const response = yield call(ProfileService.getProfile, { userId });
        yield put(getProfileSuccess(response));
    } catch (e) {
        // yield localStorage.removeItem(APP_VARIABLES.TOKEN);
        yield put(getProfileFailure(e));
    }
}

export function* updateProfileSaga({ data }) {
    try {
        const userId = yield localStorage.getStringItem(APP_VARIABLES.USER_ID);
        const response = yield call(ProfileService.updateProfile, { userId, data });
        yield put(updateProfileSuccess(response));
        yield put(getProfile());
    } catch (e) {
        // yield localStorage.removeItem(APP_VARIABLES.TOKEN);
        yield showErrorMessage(e);
        yield put(updateProfileFailure(e));
    }
}
