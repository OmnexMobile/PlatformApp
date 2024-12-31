import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getUniqueId } from 'react-native-device-info';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/ApiUrl';
import { LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import RegisterPresentational from './register-presentational';
import AsyncStorage from '@react-native-community/async-storage';
import globalAuth from '../../../services/Auditpro-Auth';
import { ROUTES } from 'constants/app-constant';

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

    console.log('🚀 ~ file: register-functional.js:40 ~ registerDevice ~ requestURL:', requestURL + 'RegisterDevice');
    const res = await fetch(requestURL + 'RegisterDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: req,
    });
    console.log('res.json--->', res.json)
    return res.json();
};

const DEFAULT_URL = 'https://saasmobile.ewqims.net/EwQIMSAPI/api/';

const RegisterFunctional = ({}) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        // serverUrl: DEFAULT_URL,
        globalServerURL: DEFAULT_URL,
        deviceId: getUniqueId(),
    });
    const [currentURL, setCurrentURL] = useState('');
    // const [state, setState] = useState({ serverUrl: appSettings?.serverUrl || 'http://1.22.172.236/ProblemSolverAPI/', deviceId: getUniqueId() });
    const navigation = useNavigation();
    const { appSettings, handleAppSetting, globalURL, handleGlobalURL, globalDeviceDetails, handleDeviceDetails } = useAppContext();

    console.log('🚀 ~ file: register-functional.js:64 ~ RegisterFunctional ~ globalURL?.serverUrl:',globalURL, globalURL?.serverUrl);
    console.log('globalDeviceDetails---->', globalDeviceDetails)

    // React.useEffect(() => {
    //     if (globalURL?.serverUrl) {
    //         setState({
    //             ...state,
    //             // serverUrl: appSettings?.serverUrl,
    //             globalServerURL: globalURL?.serverUrl,
    //         });
    //     }
    // }, [globalURL?.serverUrl]);

    React.useEffect(() => {
        if (currentURL) {
            setState({
                ...state,
                globalServerURL: currentURL,
            });
        }
    }, [currentURL]);

    React.useEffect(() => {
		async function fetchData() {
			const currentUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
			console.log('currentURL--->login', currentUrl)
			setCurrentURL(currentUrl)
		}
		fetchData();

	}, [currentURL])

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
        await AsyncStorage.setItem('deviceid', deviceId);
        console.log('set deviceId', deviceId)
        const req = formReq({
            RegisteredDeviceId: deviceId,
        });
        console.log('DEFAULT_URL + `${API_URL.DEVICE_STATUS}`', DEFAULT_URL + `${API_URL.DEVICE_STATUS}`, 'deviceId', deviceId, 'req', req )
        try {
            const res = await fetch(DEFAULT_URL + `${API_URL.DEVICE_STATUS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: req,
            });
            const data = await res.json();
            // const res = await postAPI(`${API_URL.GET_DEVICE_STATUS}`, req);
            // handleAppSetting(null, {
            //     serverUrl: state?.serverUrl || '',
            //     deviceStatusSettings: data?.Data || {},
            // });
            // localStorage.storeData(LOCAL_STORAGE_VARIABLES.DEVICE_STATUS_SETTINGS, data?.Data);
            console.log('state?.globalServerURL-->', state?.globalServerURL)
            handleGlobalURL('serverUrl', state?.globalServerURL)
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, state?.globalServerURL)
            handleDeviceDetails(data?.Data)
            console.log('🚀 ~ file: DEVICE_STATUS ~ res', data, '---', data?.Data);
        } catch (err) {
            console.log('🚀 ~ file: DEVICE_STATUS ~ err', err);
        }
    };

    const handleUnRegister = async () => {
        setLoading(true);
        const deviceId = await getUniqueId();
        registerDevice(
            state?.globalServerURL,
            {
                RegisteredDeviceId: deviceId,
                ServerUrl: state?.globalServerURL,
            },
            REGISTER_TYPES.UN_REGISTER,
        )
            .then(data => {
                setLoading(false);
                console.log('🚀 ~ file: register-functional.js:92 ~ handleUnRegister ~ data:', data?.Success);
                if (data?.Success) {
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
                    handleAppSetting('serverUrl', '');
                    handleGlobalURL('serverUrl', '')
                    setState({
                        ...state,
                        globalServerURL: '',
                    });

                    globalAuth.setServerUrl('');
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
        if (isValidUrl(DEFAULT_URL)) {
            setLoading(true);
            const deviceId = await getUniqueId();
            registerDevice(
                state?.globalServerURL,
                {
                    RegisteredDeviceId: deviceId,
                    // ServerUrl: state?.serverUrl,
                    ServerUrl: state?.globalServerURL,
                },
                REGISTER_TYPES.REGISTER,
            )
                .then(async data => {
                    setLoading(false);
                    if (data?.Success) {
                        console.log('🚀 ~ file: register-functional.js:133 ~ handleRegister ~ data:', data);
                        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, state?.globalServerURL);
                        globalAuth.setServerUrl(state?.globalServerURL);
                        await AsyncStorage.setItem('storedserverrul', state?.globalServerURL);
                        navigation.goBack();
                        getDeviceStatus();
                        successMessage({ message: 'Success', description: 'Successfully Registered this Device' });
                    } else {
                        // showErrorMessage(data?.Data || 'Something went wrong while Registering the Device');
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
        <RegisterPresentational  //!!globalURL?.serverUrl
            {...{ navigation, handleChange, handleRegister, state, isRegistered: !!currentURL, handleUnRegister, loading, getDeviceStatus }}
        />
    );
};

export default RegisterFunctional;