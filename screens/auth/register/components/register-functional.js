import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getUniqueId } from 'react-native-device-info';
import API_URL from 'global/api-urls';
import { LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import RegisterPresentational from './register-presentational';

export const REGISTER_TYPES = {
    REGISTER: 1,
    UN_REGISTER: 2,
    LOGOUT: 3,
};

export const registerDevice = async (requestURL, request, type) => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    const req = formReq({
        ...request,
        Active: type === REGISTER_TYPES?.REGISTER ? 'true' : type === REGISTER_TYPES?.LOGOUT ? 'false' : '0',
        IsDeleted: type === REGISTER_TYPES?.REGISTER ? '0' : '1',
        RegisteredDate: today,
        UnRegisteredDate: today,
    });
    console.log('🚀 ~ file: register-functional.js:19 ~ registerDevice ~ request:', req);

    console.log('🚀 ~ file: register-functional.js:40 ~ registerDevice ~ requestURL:', requestURL);
    const res = await fetch(requestURL + 'RegisterDevice/RegisterDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: req,
    });
    return res.json();
};

// http://1.22.172.236/ProblemSolverAPI
// http://saas.omnex.in:2010/problemsolverapi
// https://cloudqa1.ewqims.com/problemsolverapi/
// https://saasmobile.ewqims.net/problemsolverapi/
// https://ksrint-staging.omnexewqims.com/PSapi/api/

// http://1.22.172.236/ProblemSolverAPI
// http://saas.omnex.in:2010/problemsolverapi
// http://192.168.1.181/PSAPI
// https://training-michelin.ewqims.com/psapi/

// const DEFAULT_URL = 'http://1.22.172.236/ProblemSolverAPI/';
// const DEFAULT_URL = 'http://192.168.1.181/PSAPI/';
// const DEFAULT_URL = 'http://saas.omnex.in:2010/problemsolverapi/';
// const DEFAULT_URL = 'https://cloudqa1.ewqims.com/problemsolverapi/';
// const DEFAULT_URL = 'https://training-michelin.ewqims.com/psapi/';

// const DEFAULT_URL = 'https://training-michelin.ewqims.com/psapi/';
// const DEFAULT_URL = 'https://cloudqa1.ewqims.com/problemsolverapi/';
// const DEFAULT_URL = 'https://saasmobile.ewqims.net/problemsolverapi/';
// const DEFAULT_URL = 'http://192.168.1.181/PSAPI/';
// const DEFAULT_URL = 'https://michelin.omnexewqims.com/PSAPI/';

const DEFAULT_URL = '';

const RegisterFunctional = ({}) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        serverUrl: appSettings?.serverUrl || DEFAULT_URL,
        // serverUrl: appSettings?.serverUrl || 'https://cloudqa1.ewqims.com/problemsolverapi/',
        deviceId: getUniqueId(),
    });
    // console.log('🚀 ~ file: register-functional.js:50 ~ RegisterFunctional ~ appSettings?.serverUrl:', state?.serverUrl);
    // const [state, setState] = useState({ serverUrl: appSettings?.serverUrl || 'http://1.22.172.236/ProblemSolverAPI/', deviceId: getUniqueId() });
    const navigation = useNavigation();
    const { appSettings, handleAppSetting } = useAppContext();

    React.useEffect(() => {
        if (appSettings?.serverUrl) {
            setState({
                ...state,
                serverUrl: appSettings?.serverUrl,
            });
        }
    }, [appSettings?.serverUrl]);

    const handleChange = (label, value) => {
        setState({
            ...state,
            [label]: value,
        });
    };

    const isValidUrl = urlString => {
        var urlPattern = new RegExp(
            '^(https?:\\/\\/)?' + // validate protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // validate fragment locator
        return !!urlPattern.test(urlString);
    };

    //362fc747c938360f
    //362fc747c938360f

    const getDeviceStatus = async () => {
        const deviceId = await getUniqueId();
        const req = formReq({
            RegisteredDeviceId: deviceId,
        });
        try {
            const res = await fetch(state?.serverUrl + `${API_URL.GET_DEVICE_STATUS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: req,
            });
            const data = await res.json();
            // const res = await postAPI(`${API_URL.GET_DEVICE_STATUS}`, req);
            handleAppSetting(null, {
                serverUrl: state?.serverUrl || '',
                deviceStatusSettings: data?.Data || {},
            });
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.DEVICE_STATUS_SETTINGS, data?.Data);
        } catch (err) {
            console.log('🚀 ~ file: radio-button.js:22 ~ getData ~ err', err);
        }
    };

    const handleUnRegister = async () => {
        setLoading(true);
        const deviceId = await getUniqueId();
        registerDevice(
            state?.serverUrl,
            {
                RegisteredDeviceId: deviceId,
                ServerUrl: appSettings?.serverUrl,
            },
            REGISTER_TYPES.UN_REGISTER,
        )
            .then(data => {
                setLoading(false);
                console.log('🚀 ~ file: register-functional.js:92 ~ handleUnRegister ~ data:', data?.Success);
                if (data?.Success) {
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SERVER_URL);
                    handleAppSetting('serverUrl', '');
                    setState({
                        ...state,
                        serverUrl: '',
                    });
                    successMessage({ message: 'Success', description: 'Successfully Unregistered this Device' });
                } else {
                    showErrorMessage(data?.Error || 'Something went wrong while Unregistering the Device');
                }
            })
            .catch(data => {
                setLoading(false);
                showErrorMessage(data?.Error || 'Something went wrong while Unregistering the Device');
                console.log('🚀 ~ file: register-functional.js:102 ~ handleUnRegister ~ data:', data);
            });
    };

    const handleRegister = async () => {
        console.log('🚀 ~ file: register-functional.js:157 ~ handleRegister ~ state?.serverUrl:', state?.serverUrl, isValidUrl(state?.serverUrl));
        if (isValidUrl(state?.serverUrl)) {
            setLoading(true);
            const deviceId = await getUniqueId();
            registerDevice(
                state?.serverUrl,
                {
                    RegisteredDeviceId: deviceId,
                    ServerUrl: state?.serverUrl,
                },
                REGISTER_TYPES.REGISTER,
            )
                .then(data => {
                    setLoading(false);
                    if (data?.Success) {
                        console.log('🚀 ~ file: register-functional.js:133 ~ handleRegister ~ data:', data);
                        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SERVER_URL, state?.serverUrl);
                        navigation.goBack();
                        getDeviceStatus();
                        successMessage({ message: 'Success', description: 'Successfully Registered this Device' });
                    } else {
                        showErrorMessage(data?.Data || 'Something went wrong while Registering the Device');
                    }
                    console.log('🚀 ~ file: register-functional.js:78 ~ .then ~ data:', data);
                })
                .catch(data => {
                    setLoading(false);
                    showErrorMessage(data?.Error || 'Something went wrong while Registering the Device');
                    console.log('🚀 ~ file: register-functional.js:43 ~ handleRegister ~ isValidUrl(state?.serverUrl):', data);
                });
        } else {
            showErrorMessage('Invalid Url');
        }
    };

    return (
        <RegisterPresentational
            {...{ navigation, handleChange, handleRegister, state, isRegistered: !!appSettings?.serverUrl, handleUnRegister, loading }}
        />
    );
};

export default RegisterFunctional;
