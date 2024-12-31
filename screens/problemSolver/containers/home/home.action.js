import {
    GET_USERS,
    GET_DASHBOARD_CONCERN_COUNTS,
    GET_DASHBOARD_UPCOMING_CONCERN_LIST,
    GET_DASHBOARD_PENDING_CONCERN_LIST,
    GET_DASHBOARD_TODAY_CONCERN_LIST,
} from './home.constants';

export const getUsers = () => {
    return {
        type: GET_USERS.REQUEST,
    };
};

export const getUsersSuccess = response => ({
    type: GET_USERS.SUCCESS,
    response,
});

export const getUsersFailure = error => ({
    type: GET_USERS.ERROR,
    error,
});

export const getUsersReset = error => ({
    type: GET_USERS.RESET,
    error,
});

export const getDashboardConcernCounts = (request) => {
    return {
        type: GET_DASHBOARD_CONCERN_COUNTS.REQUEST,
        request
    };
};

export const getDashboardConcernCountsSuccess = response => ({
    type: GET_DASHBOARD_CONCERN_COUNTS.SUCCESS,
    response,
});

export const getDashboardConcernCountsFailure = error => ({
    type: GET_DASHBOARD_CONCERN_COUNTS.ERROR,
    error,
});

export const getDashboardConcernCountsReset = error => ({
    type: GET_DASHBOARD_CONCERN_COUNTS.RESET,
    error,
});

export const getTodayConcernList = request => ({
    type: GET_DASHBOARD_TODAY_CONCERN_LIST.REQUEST,
    request,
});

export const getTodayConcernListSuccess = response => ({
    type: GET_DASHBOARD_TODAY_CONCERN_LIST.SUCCESS,
    response,
});

export const getTodayConcernListFailure = error => ({
    type: GET_DASHBOARD_TODAY_CONCERN_LIST.ERROR,
    error,
});

export const getTodayConcernListReset = error => ({
    type: GET_DASHBOARD_TODAY_CONCERN_LIST.RESET,
    error,
});

export const getUpcomingConcernList = request => ({
    type: GET_DASHBOARD_UPCOMING_CONCERN_LIST.REQUEST,
    request,
});

export const getUpcomingConcernListSuccess = response => ({
    type: GET_DASHBOARD_UPCOMING_CONCERN_LIST.SUCCESS,
    response,
});

export const getUpcomingConcernListFailure = error => ({
    type: GET_DASHBOARD_UPCOMING_CONCERN_LIST.ERROR,
    error,
});

export const getUpcomingConcernListReset = error => ({
    type: GET_DASHBOARD_UPCOMING_CONCERN_LIST.RESET,
    error,
});

export const getPendingConcernList = request => ({
    type: GET_DASHBOARD_PENDING_CONCERN_LIST.REQUEST,
    request,
});

export const getPendingConcernListSuccess = response => ({
    type: GET_DASHBOARD_PENDING_CONCERN_LIST.SUCCESS,
    response,
});

export const getPendingConcernListFailure = error => ({
    type: GET_DASHBOARD_PENDING_CONCERN_LIST.ERROR,
    error,
});

export const getPendingConcernListReset = error => ({
    type: GET_DASHBOARD_PENDING_CONCERN_LIST.RESET,
    error,
});
