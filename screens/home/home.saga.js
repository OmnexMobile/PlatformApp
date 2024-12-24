import { call, put } from 'redux-saga/effects';
import {
    getUsersSuccess,
    getUsersFailure,
    getTodayConcernListSuccess,
    getTodayConcernListFailure,
    getPendingConcernListSuccess,
    getPendingConcernListFailure,
    getUpcomingConcernListSuccess,
    getUpcomingConcernListFailure,
    getDashboardConcernCountsSuccess,
    getDashboardConcernCountsFailure,
} from './home.action';
import { showErrorMessage } from 'helpers/utils';
import HomeService from './home.service';

export function* getUsersSaga() {
    try {
        // const userId = yield localStorage.getStringItem(APP_VARIABLES.USER_ID);
        const response = yield call(HomeService.getUsers);
        console.log('🚀 ~ file: home.saga.js ~ line 12 ~ function*getUsersSaga ~ response', response.results);
        yield put(getUsersSuccess(response.results));
    } catch (e) {
        yield showErrorMessage(e);
        yield put(getUsersFailure(e));
    }
}

export function* getDashboardConcernCountsSaga({ request }) {
    try {
        const response = yield call(HomeService.getDashboardConcernCounts, { request });
        yield put(getDashboardConcernCountsSuccess(response?.Data));
    } catch (e) {
        yield showErrorMessage(e);
        yield put(getDashboardConcernCountsFailure(e));
    }
}

export function* getTodayConcernListSaga({ request }) {
    try {
        const response = yield call(HomeService.getTodayConcernList, { request });
        yield put(getTodayConcernListSuccess(response?.Data));
    } catch (e) {
        console.log("🚀 ~ file: home.saga.js:44 ~ function*getTodayConcernListSaga ~ e", e)
        yield showErrorMessage(e);
        yield put(getTodayConcernListFailure(e));
    }
}

export function* getUpcomingConcernListSaga({ request }) {
    try {
        const response = yield call(HomeService.getUpcomingConcernList, { request });
        yield put(getUpcomingConcernListSuccess(response?.Data));
    } catch (e) {
        console.log("🚀 ~ file: home.saga.js:44 ~ function*getTodayConcernListSaga ~ e", e)

        yield showErrorMessage(e);
        yield put(getUpcomingConcernListFailure(e));
    }
}

export function* getPendingConcernListSaga({ request }) {
    try {
        const response = yield call(HomeService.getPendingConcernList, { request });
        yield put(getPendingConcernListSuccess(response?.Data));
    } catch (e) {
        console.log("🚀 ~ file: home.saga.js:44 ~ function*getTodayConcernListSaga ~ e", e)

        yield showErrorMessage(e);
        yield put(getPendingConcernListFailure(e));
    }
}
