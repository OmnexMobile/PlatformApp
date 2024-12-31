import { GET_ORGANIZATIONS } from './constant';

export const getOrganizations = () => {
    return {
        type: GET_ORGANIZATIONS.REQUEST,
    };
};

export const getOrganizationsSuccess = data => ({
    type: GET_ORGANIZATIONS.SUCCESS,
    data,
});

export const getOrganizationsFailure = error => ({
    type: GET_ORGANIZATIONS.ERROR,
    error,
});

export const getOrganizationsReset = error => ({
    type: GET_ORGANIZATIONS.RESET,
    error,
});
