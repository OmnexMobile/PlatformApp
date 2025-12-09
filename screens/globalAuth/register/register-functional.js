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
import { deleteAllInspectionData } from 'store/database/inspectStorage';

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

    const res = await fetch(requestURL + '/RegisterDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: req,
    });
    console.log('res.json--->', res.json);
    return res.json();
};

// const DEFAULT_URL = 'https://saasmobile.ewqims.net/EwQIMSAPI/api/';

const RegisterFunctional = ({}) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        // serverUrl: DEFAULT_URL,
        globalServerURL: '',
        deviceId: getUniqueId(),
    });
    const [currentURL, setCurrentURL] = useState('');
    // const [state, setState] = useState({ serverUrl: appSettings?.serverUrl || 'http://1.22.172.236/ProblemSolverAPI/', deviceId: getUniqueId() });
    const navigation = useNavigation();
    const { appSettings, handleAppSetting, globalURL, handleGlobalURL, globalDeviceDetails, handleDeviceDetails } = useAppContext();

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
            console.log('currentURL--->login', currentUrl);
            setCurrentURL(currentUrl);
        }
        fetchData();
    }, [currentURL]);

    const handleChange = (label, value) => {
        console.log('label, value', label, value);
        setState({
            ...state,
            [label]: value,
        });
    };

    console.log('state--->', state);

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
        console.log('set deviceId', deviceId);
        const req = formReq({
            RegisteredDeviceId: deviceId,
        });
        try {
            const res = await fetch(state?.globalServerURL + `/${API_URL.DEVICE_STATUS}`, {
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
            handleGlobalURL('serverUrl', state?.globalServerURL);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, state?.globalServerURL);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.globalRegister, state?.globalServerURL);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.IC_API_URL, data?.Data.ICApiURL);
            // handleDeviceDetails(data?.Data)
            console.log('data?.Data--->', data?.Data);
            handleDeviceDetails({ ...data?.Data });
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
            .then(async data => {
                setLoading(false);
                if (data?.Success) {
                    await deleteAllInspectionData();
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.globalRegister);
                    handleAppSetting('serverUrl', '');
                    handleGlobalURL('serverUrl', '');
                    setState({
                        ...state,
                        globalServerURL: '',
                    });
                    setCurrentURL('');
                    globalAuth.setServerUrl('');
                    successMessage({ message: 'Success', description: 'Successfully Unregistered this Device' });
                } else {
                    showErrorMessage(data?.Error || 'Something went wrong while Unregistering the Device');
                }
            })
            .catch(data => {
                setLoading(false);
                showErrorMessage(data?.Error || 'Something went wrong while Unregistering the Device');
            });
    };

    const handleRegister = async () => {
        if (isValidUrl(state?.globalServerURL)) {
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
                    if (data?.Success && data?.Data !== 'Invalid Url') {
                        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, state?.globalServerURL);
                        localStorage.storeData(LOCAL_STORAGE_VARIABLES.globalRegister, state?.globalServerURL);
                        globalAuth.setServerUrl(state?.globalServerURL);
                        await AsyncStorage.setItem('storedserverrul', state?.globalServerURL);
                        navigation.goBack();
                        getDeviceStatus();
                        successMessage({ message: 'Success', description: 'Successfully Registered this Device' });
                    } else {
                        showErrorMessage(data?.Data || data?.Error || 'Something went wrong while Registering the Device');
                    }
                })
                .catch(data => {
                    setLoading(false);
                    showErrorMessage(data?.Error || 'Something went wrong while Registering the Device');
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
