import axios from 'axios';
import API_URL from 'global/ApiUrl';

export default class CommonServices {
    static getOrganizationServices = ({}) => {
        return axios({
            method: 'GET',
            url: `${API_URL.GET_ORGANIZATIONS}`,
        });
    };
}
