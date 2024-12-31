import axios from 'axios';

export const getAPI = async url => {
    try {
        const res = await axios.get(url);
        const data = res?.data || res;
        if (data?.response_code === '0' || data?.response_code === 0 || typeof data === "number") {
            return {
                success: true,
                data: data.response || data,
            };
        } else {
            return { success: false, data: {} };
        }
    } catch (error) {
        return { success: false, data: {} };
    }
};

export const postAPI = async (url, data) => await axios.post(url, data);

export const deleteAPI = async (url, data) => {
    try {
        const response = await axios.delete(url, { data });
        return {
            success: true,
            data: response,
            message: response?.message,
        };
    } catch (error) {
        return { success: false, data: {}, message: error };
    }
};
