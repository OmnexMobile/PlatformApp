import { takeLatest } from 'redux-saga/effects';
import {
    GET_DASHBOARD_PENDING_CONCERN_LIST,
    GET_DASHBOARD_TODAY_CONCERN_LIST,
    GET_DASHBOARD_UPCOMING_CONCERN_LIST,
    GET_DASHBOARD_CONCERN_COUNTS,
    GET_USERS,
} from 'screens/home/home.constants';
import { getDashboardConcernCountsSaga, getPendingConcernListSaga, getTodayConcernListSaga, getUpcomingConcernListSaga, getUsersSaga } from 'screens/home/home.saga';

export default function* saga() {
    yield takeLatest(GET_USERS.REQUEST, getUsersSaga);
    yield takeLatest(GET_DASHBOARD_CONCERN_COUNTS.REQUEST, getDashboardConcernCountsSaga);
    yield takeLatest(GET_DASHBOARD_TODAY_CONCERN_LIST.REQUEST, getTodayConcernListSaga);
    yield takeLatest(GET_DASHBOARD_UPCOMING_CONCERN_LIST.REQUEST, getUpcomingConcernListSaga);
    yield takeLatest(GET_DASHBOARD_PENDING_CONCERN_LIST.REQUEST, getPendingConcernListSaga);
}

