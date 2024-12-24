import axios from 'axios';
import API_URL from 'global/api-urls';

export default class ProfileService {
    static getProfile = ({ userId }) => {
        return axios({
            method: 'get',
            url: `${API_URL.GET_PROFILE}${userId}`,
        });
    };
    static updateProfile = ({ userId, data }) => {
        return axios({
            method: 'put',
            url: `${API_URL.UPDATE_PROFILE}${userId}`,
            data,
        });
    };
}
