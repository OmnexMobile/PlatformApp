import {
    GET_USERS,
    GET_DASHBOARD_TODAY_CONCERN_LIST,
    GET_DASHBOARD_UPCOMING_CONCERN_LIST,
    GET_DASHBOARD_PENDING_CONCERN_LIST,
    GET_DASHBOARD_CONCERN_COUNTS,
} from './home.constants';

const initialState = {
    users: {
        usersLoading: true,
        usersAPILoaded: false,
        error: '',
        data: [],
    },
    dashboardConcernCounts: {
        countDetails: {},
        loading: true,
    },
    dashboardConcernList: {
        todayList: {
            data: [],
            loading: true,
        },
        upcomingList: {
            data: [],
            loading: true,
        },
        pendingList: {
            data: [],
            loading: true,
        },
    },
};

function homeReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USERS.REQUEST:
            return {
                ...state,
                users: {
                    ...state.users,
                    usersLoading: true,
                },
            };
        case GET_USERS.RESET:
            return {
                ...state,
                users: {
                    ...state.users,
                    usersLoading: true,
                    usersAPILoaded: false,
                    error: '',
                    data: [],
                },
            };
        case GET_USERS.SUCCESS:
            return {
                ...state,
                users: {
                    ...state.users,
                    usersLoading: false,
                    usersAPILoaded: true,
                    data: action?.response || [],
                },
            };
        case GET_USERS.ERROR:
            return {
                ...state,
                users: {
                    ...state.users,
                    usersLoading: false,
                    usersAPILoaded: true,
                    data: [],
                    error: action.error,
                },
            };
        case GET_DASHBOARD_CONCERN_COUNTS.REQUEST:
            return {
                ...state,
                dashboardConcernCounts: {
                    ...state.dashboardConcernCounts,
                    countDetails: {
                        ...state.dashboardConcernCounts?.countDetails,
                        loading: true,
                    },
                },
            };
        case GET_DASHBOARD_CONCERN_COUNTS.RESET:
            return {
                ...state,
                dashboardConcernCounts: {
                    ...state.dashboardConcernCounts,
                    countDetails: {},
                    loading: false,
                },
            };
        case GET_DASHBOARD_CONCERN_COUNTS.SUCCESS:
            return {
                ...state,
                dashboardConcernCounts: {
                    ...state.dashboardConcernCounts,
                    countDetails: action?.response || {},
                    loading: false,
                },
            };
        case GET_DASHBOARD_CONCERN_COUNTS.ERROR:
            return {
                ...state,
                dashboardConcernCounts: {
                    ...state.dashboardConcernCounts,
                    countDetails: {},
                    loading: false,
                },
            };
        case GET_DASHBOARD_TODAY_CONCERN_LIST.REQUEST:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    todayList: {
                        ...state.dashboardConcernList?.todayList,
                        loading: true,
                    },
                },
            };
        case GET_DASHBOARD_TODAY_CONCERN_LIST.RESET:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    todayList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_TODAY_CONCERN_LIST.SUCCESS:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    todayList: {
                        data: action?.response || [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_TODAY_CONCERN_LIST.ERROR:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    todayList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_UPCOMING_CONCERN_LIST.REQUEST:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    upcomingList: {
                        ...state.dashboardConcernList?.upcomingList,
                        loading: true,
                    },
                },
            };
        case GET_DASHBOARD_UPCOMING_CONCERN_LIST.RESET:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    upcomingList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_UPCOMING_CONCERN_LIST.SUCCESS:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    upcomingList: {
                        data: action?.response || [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_UPCOMING_CONCERN_LIST.ERROR:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    upcomingList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_PENDING_CONCERN_LIST.REQUEST:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    pendingList: {
                        ...state.dashboardConcernList?.pendingList,
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_PENDING_CONCERN_LIST.RESET:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    pendingList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_PENDING_CONCERN_LIST.SUCCESS:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    pendingList: {
                        data: action?.response || [],
                        loading: false,
                    },
                },
            };
        case GET_DASHBOARD_PENDING_CONCERN_LIST.ERROR:
            return {
                ...state,
                dashboardConcernList: {
                    ...state.dashboardConcernList,
                    pendingList: {
                        data: [],
                        loading: false,
                    },
                },
            };
        default:
            return state;
    }
}

export default homeReducer;
