import { API_STATUS } from 'constants/app-constant';
import { GET_ORGANIZATIONS } from './constant';

const initialState = {
    commonDataLoaded: false,
    organizations: {
        data: [],
        organizationErr: null,
        loading: false,
        apiStatus: null,
    },
    profileStatusUpdating: false,
    error: '',
    config: {},
};

function commonReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ORGANIZATIONS.REQUEST:
            return {
                ...state,
                organizations: {
                    ...state.organizations,
                    loading: true,
                },
            };
        case GET_ORGANIZATIONS.SUCCESS:
            return {
                ...state,
                organizations: {
                    ...state.organizations,
                    loading: false,
                    data: action.data,
                },
            };
        case GET_ORGANIZATIONS.ERROR:
            return {
                ...state,
                organizations: {
                    ...state.organizations,
                    loading: false,
                },
            };
        case GET_ORGANIZATIONS.RESET:
            return {
                ...state,
                organizations: {
                    ...state.organizations,
                    loading: false,
                },
            };
        default:
            return state;
    }
}

export default commonReducer;
