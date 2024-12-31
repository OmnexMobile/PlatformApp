import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import RegisterPresentational from './register-presentational';
import { useAppContext } from 'contexts/app-context';
import AsyncStorage from '@react-native-community/async-storage';

const RegisterFunctional = ({}) => {
    const navigation = useNavigation();
    const { appSettings, handleAppSetting } = useAppContext();
    console.log('CURRENT_PAGE---->', 'register-functional')
    //static Temporarily
    const currentUrl = 'https://omn-qa-forvia.ewqims.com/auditproapi/api/'
    // const currentUrl = 'https://saasmobile.ewqims.net/EwQIMSAPI/api/'
    // const [state, setState] = useState({ serverUrl: appSettings?.serverUrl || currentUrl, deviceId: '' });
    const [state, setState] = useState({ serverUrl: currentUrl, deviceId: '' });
    console.log('🚀 ~ file: register-functional.js:13 ~ RegisterFunctional ~ appSettings', appSettings);

    useEffect(() => {
        DeviceInfo.getUniqueId().then(async (deviceId) => {
            console.log('tret1 deviceId!', deviceId)
            await AsyncStorage.setItem('deviceid', deviceId);
            return deviceId;
        })
    },[]);

    const handleChange = (label, value) => {
        setState({
            ...state,
            [label]: value,
        });
    };

    const handleUnRegistered = () => {
        localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SERVER_URL);
        handleAppSetting('serverUrl', '');
        setState({
            ...state,
            serverUrl: ''
        })
    }

    const handleSubmit = async () => {
        console.log('🚀 ~ file: register-functional.js:26 ~ handleSubmit ~ state?.serverUrl', state?.serverUrl);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SERVER_URL, state?.serverUrl);
        handleAppSetting('serverUrl', state?.serverUrl);
        console.log('tret1 appSettings server URL!', state?.serverUrl)
        await AsyncStorage.setItem('storedserverrul', state?.serverUrl);
        navigation.goBack()
    };

    return <RegisterPresentational {...{ navigation, handleChange, handleSubmit, state, isRegistered: !!appSettings?.serverUrl, handleUnRegistered }} />;
};

export default RegisterFunctional;
