import axios from 'axios';
import API_URL from 'global/ApiUrl';

export default class HomeService {
    static getUsers = ({ userId }) => {
        return axios({
            method: 'get',
            url: `${API_URL.GET_USERS}`,
        });
    };

    static getDashboardConcernList = ({ userId }) => {
        return axios({
            method: 'get',
            url: `${API_URL.GET_USERS}`,
        });
    };
    
    static getDashboardConcernCounts = ({ request }) => {
        return axios({
            method: 'post',
            url: `${API_URL.DASHBOARD_CONCERN_COUNTS}`,
            data: request
        });
    };
    
    static getTodayConcernList = ({ request }) => {
        return axios({
            method: 'post',
            url: `${API_URL.DASHBOARD_CONCERN_LIST}`,
            data: request
        });
    };
    
    static getUpcomingConcernList = ({ request }) => {
        return axios({
            method: 'post',
            url: `${API_URL.DASHBOARD_CONCERN_LIST}`,
            data: request
        });
    };
    
    static getPendingConcernList = ({ request }) => {
        return axios({
            method: 'post',
            url: `${API_URL.DASHBOARD_CONCERN_LIST}`,
            data: request
        });
    };
}
