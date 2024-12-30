import axios from 'axios';

export const getAPI = async url => {
    try {
        const { data } = await axios.get(url);
        if (data?.response_code === '0' || data?.response_code === 0) {
            return {
                success: true,

                data: data.response,
            };
        } else {
            return { success: false, data: {} };
        }
    } catch (error) {
        return { success: false, data: {} };
    }
};

// export const postAPI = async (url, data) => await axios.post(url, data);

export const postAPI = async (url, data) => {
    console.log('POST API url, data--->', url, data )
    try {
        const response = await axios.post(url, data);
        console.log('POST RESPONSE--->', response )
        return response;
        // return {
        //     success: true,
        //     data: response,
        //     message: response?.message,
        // };
        
    } catch (error) {
        console.log('POST catch error--->', error )
        return { success: false, data: {}, message: error };
    }
};

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
