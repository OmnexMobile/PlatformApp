import { GET_PROFILE, UPDATE_PROFILE } from './profile.constants';

export const getProfile = () => {
    return {
        type: GET_PROFILE.REQUEST,
    };
};

export const getProfileSuccess = response => ({
    type: GET_PROFILE.SUCCESS,
    response,
});

export const getProfileFailure = error => ({
    type: GET_PROFILE.ERROR,
    error,
});

export const getProfileReset = error => ({
    type: GET_PROFILE.RESET,
    error,
});

export const updateProfile = data => {
    return {
        type: UPDATE_PROFILE.REQUEST,
        data,
    };
};

export const updateProfileSuccess = response => ({
    type: UPDATE_PROFILE.SUCCESS,
    response,
});

export const updateProfileFailure = error => ({
    type: UPDATE_PROFILE.ERROR,
    error,
});

export const updateProfileReset = error => ({
    type: UPDATE_PROFILE.RESET,
    error,
});
