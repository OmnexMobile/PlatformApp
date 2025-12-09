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
import { Keyboard } from 'react-native';
import { GLOBALSERVER_URL, ensureTrailingSlash, getGlobalUrls, setGlobalUrls, stripTrailingSlash } from 'screens/globalConstant/globalURL';
import { deleteAllInspectionData } from 'store/database/inspectStorage';
import { useDispatch } from 'react-redux';

export const REGISTER_TYPES = {
    REGISTER: 1,
    UN_REGISTER: 2,
    LOGOUT: 3,
};

export const registerDevice = async (requestURL, request, type) => {
    console.log('getting requestURL, request, type', requestURL, '--', request, '--', type);
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
    const url = requestURL?.endsWith('/') ? `${requestURL}RegisterDevice` : `${requestURL}/RegisterDevice`;
    const req = formReq({
        ...request,
        Active: type === REGISTER_TYPES?.REGISTER ? 'true' : type === REGISTER_TYPES?.LOGOUT ? 'false' : '0',
        IsDeleted: type === REGISTER_TYPES?.REGISTER ? '0' : '1',
        RegisteredDate: today,
        UnRegisteredDate: today,
    });

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: req,
        });

        const text = await res.text(); // safer than res.json()

        try {
            const data = JSON.parse(text); // try parsing as JSON
            console.log('✅ API response:', data);
            return data;
        } catch (jsonError) {
            console.log('📦 Response status:', res.status);
            console.log('❌ Not JSON:', text); // probably HTML or error page
            showErrorMessage('Server did not return valid JSON');
        }
    } catch (error) {
        console.log('❌ API call failed:', error.message);
        showErrorMessage(error.message);
    }
};

const RegisterFunctional = ({}) => {
    const urls = getGlobalUrls();
    const defaultGlobalServerUrl = ensureTrailingSlash(urls.globalServerUrl || GLOBALSERVER_URL);
    const defaultBaseUrl = stripTrailingSlash(defaultGlobalServerUrl || '');
    const { appSettings, handleAppSetting, globalURL, handleGlobalURL, globalDeviceDetails, handleDeviceDetails } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        serverUrl: appSettings?.serverUrl || defaultGlobalServerUrl,
        globalServerURL: defaultGlobalServerUrl,
        deviceId: getUniqueId(),
    });
    const [currentURL, setCurrentURL] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();
    console.log('🚀 ~ file: register-functional.js:64 ~ RegisterFunctional ~ globalURL?.serverUrl:', globalURL, globalURL?.serverUrl);
    console.log('globalDeviceDetails---->', globalDeviceDetails, 'appSettings?.serverUrl', appSettings, appSettings?.serverUrl, currentURL);
    console.log('checking reg status-->', !!appSettings?.serverUrl, !!currentURL);
    // React.useEffect(() => {
    //     if (globalURL?.serverUrl) {
    //         setState({
    //             ...state,
    //             // serverUrl: appSettings?.serverUrl,
    //             globalServerURL: globalURL?.serverUrl,
    //         });
    //     }
    // }, [globalURL?.serverUrl]);

    console.log('editable currentURL-->', currentURL, 'isregistered-->', !!currentURL);

    React.useEffect(() => {
        if (currentURL) {
            setState({
                ...state,
                globalServerURL: currentURL,
                serverUrl: currentURL,
            });
        }
    }, [currentURL]);

    // React.useEffect(() => {
    //     if (appSettings?.serverUrl) {
    //         setState({
    //             ...state,
    //             serverUrl: appSettings?.serverUrl,
    //         });
    //     }
    // }, [appSettings?.serverUrl]);

    React.useEffect(() => {
        async function fetchData() {
            const currentUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
            console.log('currentURL--->login', currentUrl);
            setCurrentURL(currentUrl);
        }
        fetchData();
    }, [currentURL]);

    const handleChange = (label, value) => {
        const updates = { [label]: value };
        if (label === 'serverUrl') {
            updates.globalServerURL = value;
        }
        setState({
            ...state,
            ...updates,
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
        const targetUrl = ensureTrailingSlash(state?.serverUrl || state?.globalServerURL || defaultGlobalServerUrl);
        await AsyncStorage.setItem('deviceid', deviceId);
        console.log('set deviceId', deviceId);
        const req = formReq({
            RegisteredDeviceId: deviceId,
        });
        console.log('DEFAULT_URL + `${API_URL.DEVICE_STATUS}`', targetUrl + `${API_URL.DEVICE_STATUS}`, 'deviceId', deviceId, 'req', req);
        const url = targetUrl?.endsWith('/') ? `${targetUrl}${API_URL.DEVICE_STATUS}` : `${targetUrl}/${API_URL.DEVICE_STATUS}`;
        try {
            const res = await fetch(url, {
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
            console.log('state?.globalServerURL-->', state?.globalServerURL, '--', globalServerUrl);
            handleGlobalURL('serverUrl', targetUrl);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, targetUrl);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.globalRegister, targetUrl);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.IC_API_URL, data?.Data.ICApiURL);
            handleDeviceDetails(data?.Data);
            setGlobalUrls({
                globalServerUrl: targetUrl,
                auditProUrl: data?.Data?.AuditProURL,
                problemSolvingUrl: data?.Data?.PSApiURL,
                apqpUrl: data?.Data?.APQPApiURL,
                icUrl: data?.Data?.ICApiURL,
            });
            console.log('handleDeviceDetails-->', data, '--', data?.Data);
            setCurrentURL(targetUrl);
            await AsyncStorage.setItem('isdeviceregistered', 'yes');
            console.log('🚀 ~ file: DEVICE_STATUS ~ res', data, '---', data?.Data);
            return data?.Data;
        } catch (err) {
            console.log('🚀 ~ file: DEVICE_STATUS ~ err', err);
            return err;
        }
    };
    const getLoginLogo = async url => {
        console.log('url', url);
        try {
            const res = await fetch(url + `${API_URL.LOGIN_LOGO}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data?.Success) {
                // localStorage.storeData(LOCAL_STORAGE_VARIABLES.LOGIN_LOGO, data?.Data?.LogoBig);
                dispatch({ type: 'STORE_LOGIN_LOGO', icLoginlogo: data?.Data?.LogoBig });
            }
        } catch (err) {
            console.log('🚀 ~ file: DEVICE_STATUS ~ err', err);
        }
    };
    const handleUnRegister = async () => {
        const baseUrl = stripTrailingSlash(state?.serverUrl || state?.globalServerURL || defaultBaseUrl);
        console.log('reach here handleUnRegister', baseUrl);
        setLoading(true);
        const deviceId = await getUniqueId();
        registerDevice(
            ensureTrailingSlash(state?.serverUrl || state?.globalServerURL || defaultGlobalServerUrl),
            {
                RegisteredDeviceId: deviceId,
                // ServerUrl: state?.globalServerURL,
                ServerUrl: baseUrl,
            },
            REGISTER_TYPES.UN_REGISTER,
        )
            .then(async data => {
                setLoading(false);
                console.log('🚀 ~ file: register-functional.js:92 ~ handleUnRegister ~ data:', data?.Success);
                if (data?.Success) {
                    await deleteAllInspectionData();
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.globalRegister);
                    handleAppSetting('serverUrl', '');
                    handleGlobalURL('serverUrl', '');
                    setGlobalUrls({ globalServerUrl: defaultGlobalServerUrl });
                    setState({
                        ...state,
                        globalServerURL: '',
                    });

                    globalAuth.setServerUrl('');
                    dispatch({ type: 'RESET_ALL' });
                    setCurrentURL('');
                    console.log('currentURL--->unregister', currentURL, !!currentURL);
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
        const targetUrl = ensureTrailingSlash(state?.serverUrl || state?.globalServerURL || defaultGlobalServerUrl);
        const baseUrl = stripTrailingSlash(targetUrl || '');
        console.log('reach here handleregister', baseUrl);
        Keyboard.dismiss();
        console.log(
            '🚀 ~ file: register-functional.js:219 ~ handleRegister ~ state?.serverUrl:',
            state?.serverUrl,
            isValidUrl(state?.serverUrl),
            '-',
            state?.globalServerURL,
        );
        if (isValidUrl(targetUrl)) {
            setLoading(true);
            const deviceId = await getUniqueId();
            registerDevice(
                // state?.globalServerURL,
                targetUrl,
                {
                    RegisteredDeviceId: deviceId,
                    // ServerUrl: state?.serverUrl,
                    ServerUrl: baseUrl,
                },
                REGISTER_TYPES.REGISTER,
            )
                .then(async data => {
                    setLoading(false);
                    if (data?.Success) {
                        console.log('🚀 ~ file: register-functional.js:236 ~ handleRegister ~ data:', data);
                        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, targetUrl);
                        navigation.goBack();
                        const deviceStatusURL = await getDeviceStatus();
                        const auditProUrl = ensureTrailingSlash(deviceStatusURL?.AuditProURL);
                        if (auditProUrl) {
                            globalAuth.setServerUrl(auditProUrl);
                            await AsyncStorage.setItem('storedserverrul', auditProUrl);
                        }
                        await getLoginLogo(deviceStatusURL?.ICApiURL);
                        successMessage({ message: 'Success', description: 'Successfully Registered this Device' });
                        dispatch({ type: 'DATE_FORMAT', dateFormat: 'DD/MM/YYYY' });
                    } else {
                        // showErrorMessage(data?.Data || 'Something went wrong while Registering the Device');
                    }
                    console.log('🚀 ~ file: register-functional.js:246 ~ .then ~ data:', data);
                })
                .catch(data => {
                    setLoading(false);
                    showErrorMessage(data?.Error || 'Something went wrong while Registering the Device');
                    console.log('🚀 ~ file: register-functional.js:257 ~ handleRegister', data);
                });
        } else {
            showErrorMessage('Invalid Url');
        }
    };

    return (
        <RegisterPresentational //!!globalURL?.serverUrl
            {...{ navigation, handleChange, handleRegister, state, isRegistered: !!currentURL, handleUnRegister, loading, getDeviceStatus }}
        />
    );
};

export default RegisterFunctional;
