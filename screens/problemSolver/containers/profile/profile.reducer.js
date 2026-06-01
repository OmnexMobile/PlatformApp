import { API_STATUS } from 'constants/app-constant';
import { GET_PROFILE, UPDATE_PROFILE } from './profile.constants';

const initialState = {
    profileLoading: true,
    profileAPILoaded: false,
    error: '',
    profileData: null,
    updateProfileAPIStatus: '',
};

function profileReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE.REQUEST:
            return {
                ...state,
                profileLoading: true,
            };
        case GET_PROFILE.RESET:
            return {
                ...state,
                profileLoading: true,
                profileAPILoaded: false,
                error: '',
                profileData: null,
            };
        case GET_PROFILE.SUCCESS:
            return {
                ...state,
                profileLoading: false,
                profileAPILoaded: true,
                profileData: action.response,
            };
        case GET_PROFILE.ERROR:
            return {
                ...state,
                profileLoading: false,
                profileAPILoaded: true,
                profileData: null,
                error: action.error,
            };
        case UPDATE_PROFILE.REQUEST:
            return {
                ...state,
                updateProfileAPIStatus: API_STATUS.PENDING,
            };
        case UPDATE_PROFILE.SUCCESS:
            return {
                ...state,
                updateProfileAPIStatus: API_STATUS.SUCCESS,
            };
        case UPDATE_PROFILE.ERROR:
            return {
                ...state,
                updateProfileAPIStatus: API_STATUS.ERROR,
            };
        case UPDATE_PROFILE.RESET:
            return {
                ...state,
                updateProfileAPIStatus: '',
            };
        default:
            return state;
    }
}

export default profileReducer;
