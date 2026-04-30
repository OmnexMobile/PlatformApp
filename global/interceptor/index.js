import axios from 'axios';
import ApiError from './ApiError';
import ERRORS from './errorConstants';
import localStorage from '../localStorage';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES } from '../../constants/app-constant';

// export const BaseURL = () => localStorage.getStringItem(LOCAL_STORAGE_VARIABLES.SERVER_URL);
export const BaseURL = () => localStorage.getStringItem(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
// export const BaseURLString = () => 'http://1.22.172.236/ProblemSolverAPI/';
// export const BaseURL = () => 'http://1.22.172.236/ProblemSolverAPI/';
export const LoginStatus = () => localStorage.getStringItem('appLogged');

const getErrorMessage = (response, fallbackMessage) => {
    const message =
        response?.data?.message ??
        response?.data?.Message ??
        response?.data?.error ??
        response?.data?.Error ??
        response?.message;

    if (typeof message === 'string' && message.trim().length > 0) {
        return message.trim();
    }

    return fallbackMessage;
};

// const { globalLoginData } = useAppContext();

// eslint-disable-next-line no-unused-vars
const setupInterceptors = async store => {
    // Default settings for axios request
    // TODO : Replace base URL with API from process.env

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.validateStatus = () => true;

    axios.interceptors.request.use(
        async config => {

            let url = await BaseURL();
            console.log('url-->', url)
            let loginStatus = await LoginStatus();
            console.log('loginStatus-->', loginStatus)
            url = url.substring(1, url.length-1);
            config.baseURL = url;

            const token = await localStorage.getStringItem(APP_VARIABLES.TOKEN);
            // setAuthToken();
            // const token =
            //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjU1YmMzMDViNmJmZjE5YzQ1NDI2ZDgiLCJleHBpcmF0aW9uVGltZSI6NTI1MjgwOTQwODM2OSwiaWF0IjoxNjUyODA5NDA4fQ.Nc1BHeJeNM-8TUenYGnE4pVWL0wBSruinkziOoNhSeQ';
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (config.data instanceof FormData) {
                Object.assign(config.headers, { 'Content-Type': 'multipart/form-data', 'User-Agent': 'Mozilla/5.0' });
            }
            return config;
        },
        error => Promise.reject(error),
    );

    // axios.interceptors.request.use(
    //     async config => {
    //         const url = await BaseURL();
    //         // config.baseURL = url;
    //         config.baseURL = url.replaceAll("^\"|\"$", "");
    //         console.log('🚀 ~ file: index.js:47 ~ setupInterceptors ~ url', url, typeof url);
    //         return config;
    //     },
    //     error => Promise.reject(error),
    // );

    axios.interceptors.response.use(
        response => {
            // Process response body
            // use store.dispatch() to dispatch any redux ArticleActions
            // console.warn('---------------------Network', response);
            if (response?.status >= 500) {
                return Promise.reject(getErrorMessage(response, `Server Error (${response?.status}). Please Try Again Later.`));
            } else if (response?.status === 401) {
                localStorage.removeItem(APP_VARIABLES.TOKEN);
                return Promise.reject(getErrorMessage(response, 'Unauthorized Access.'));
            } else if (response?.status === 403) {
                return Promise.reject(getErrorMessage(response, 'Access Forbidden.'));
            } else if (response?.status === 404) {
                return Promise.reject(getErrorMessage(response, `Server Error (${response?.status}). Please Try Again Later.`));
            } else if (response?.status === 406) {
                return Promise.reject(getErrorMessage(response, `Server Error (${response?.status}). Please Try Again Later.`));
            } else if (response?.status === 200 || response?.status === 201 || response?.status === 202) {
                return response.data;
            } else if (response?.status === 422) {
                return Promise.reject(getErrorMessage(response, 'Validation Failed.'));
            } else if (response?.status === 400) {
                return Promise.reject(getErrorMessage(response, 'Bad Request.'));
            } else {
                return response;
            }
        },
        error => Promise.reject(error),
    );
};

/**
 * Set auth token as default in axios
 * @param token
 */
export const setAuthToken = async () => {
    const authToken = await localStorage.getStringItem(APP_VARIABLES.TOKEN);
    if (authToken) {
        // axios.defaults.headers.common.authtoken = `${authToken}`;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    }
};

setAuthToken();

export default setupInterceptors;
