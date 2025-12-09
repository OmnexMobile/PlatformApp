import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';
import auth from '../../../services/Auditpro-Auth';
import AsyncStorage from '@react-native-community/async-storage';
import ApiUrl from 'global/ApiUrl';
import { useDispatch } from 'react-redux';

const LoginFunctional = ({}) => {
    const dispatch = useDispatch();
    const [selectLanguageModal, setSelectLanguageModal] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        // username: 'Champion1@michelin',
        // password: 'a1',
        username: '',
        password: '',
        loggingIn: false,
    });
    const [currentToken, setCurrentToken] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const isFocused = useIsFocused();
    // const [currentURL, setCurrentURL] = useState('');
    const {
        profile,
        handleLogin,
        sites,
        handleSiteList,
        appSettings,
        globalURL,
        globalLoginData,
        handleGlobalLogin,
        handleGlobalURL,
        globalDeviceDetails,
    } = useAppContext();
    const navigation = useNavigation();

    useEffect(() => {
        currentToken && navigation.navigate(ROUTES.SPLASH_SCREEN);
    }, [currentToken]);

    useLayoutEffect(() => {
        async function fetchData() {
            const currentUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister);
            let flag = currentUrl != null ? true : false;
            setIsRegistered(flag);
            !flag && navigation.navigate(ROUTES.GLOBAL_REGISTER);
        }
        fetchData();
    }, [isFocused]);

    const handleInputChange = (label, value) => {
        setLoginDetails({
            ...loginDetails,
            [label]: value,
        });
    };

    const handleSubmit = async () => {
        const loginflag = 1;
        if (isRegistered) {
            handleInputChange('loggingIn', true);
            var key = CryptoJS.enc.Utf8.parse('8080808080808080');
            var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            var encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(loginDetails?.password), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            console.log('get response from Login', loginDetails?.username, loginDetails?.password, encryptedPassword);
            handleLoginCall(encryptedPassword, loginflag);
        } else {
            navigation.navigate(ROUTES.GLOBAL_REGISTER);
        }
    };

    const handleServerURL = currentData => {
        console.log('loginDetails?.username---->', loginDetails?.username, currentData?.Data[0], typeof currentData?.Data[0].FullName);
        const userDetails = {
            userId: currentData?.Data[0]?.UserId.toString(),
            siteId: currentData?.Data[0]?.Siteid,
            accessToken: currentData?.Token,
            userFullName: currentData?.Data[0]?.FullName,
            smAccess: currentData?.Data[0]?.SupplierManagementAccess,
            message: currentData?.Message,
            success: currentData?.Success,
            data: currentData?.Data,
        };
        const stringifiedUserDetails = JSON.stringify(userDetails);
        AsyncStorage.setItem('userDetails', stringifiedUserDetails);
        console.log('Set Async userDetails ', stringifiedUserDetails);

        // localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.PSApiURL);
        // handleGlobalURL('serverUrl', globalDeviceDetails.deviceDetails.ICApiURL);
        localStorage.storeData('appLogged', true);
    };

    const handleLoginCall = async (encryptedPassword, loginflag, isSso) => {
        const deviceId = await AsyncStorage.getItem('deviceid');
        const APIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
        const formData = new FormData();
        formData.append('UserName', loginDetails?.username);
        formData.append('RegisteredDeviceId', deviceId);
        formData.append('Password', encryptedPassword.toString());
        formData.append('LoginFlag', 1);
        const response = await postAPI(`${APIURL}${ApiUrl.IC_LOGIN}`, formData);

        if (response?.Success) {
            Boolean(response?.Data?.length) && response?.Data.sort((a, b) => (a.SiteName == 'Corporate' ? -1 : b.SiteName == 'Corporate' ? 1 : 0));
            let icUserData = {
                userData: response?.Data[0] || {},
                token: response?.Token || '',
            };
            dispatch({ type: 'IC_USER_DATA', icUserData: icUserData });
            const settingsRes = await postAPI(`${APIURL}${ApiUrl.IC_SETTINGS}`);
            if (settingsRes.Success) {
                dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
            }
            response?.Token && setProfileCall(response);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, APIURL);
            handleGlobalLogin(response);
            handleServerURL(response);
        } else if (response?.Message !== '') {
            handleInputChange('loggingIn', false);
            showErrorMessage(response?.Message || 'Please enter valid username and password' || strings?.InvalidCred, 'top');
        } else if (response?.Error !== '') {
            handleInputChange('loggingIn', false);
            showErrorMessage(response?.Error, 'top');
        } else {
            handleInputChange('loggingIn', false);
            showErrorMessage('Something went wrong!!');
        }
    };

    const setProfileCall = data => {
        console.log('🚀 ~ file: login-functional.js:69 ~ setProfileCall ~ data', data);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
        localStorage.storeData('CurrentApp', 'IC');
        handleLogin({
            Token: data?.Token,
            UserId: data?.Data?.[0]?.UserId?.toString(),
            SiteId: data?.Data?.[0]?.SiteId?.toString(),
            UserFullName: data?.Data?.[0]?.FullName,
            CurrentApp: 'IC',
        });
        handleSiteList(data?.Data);
        setCurrentToken(data?.Token);
    };
    return (
        <LoginPresentational
            {...{ selectLanguageModal, setSelectLanguageModal, handleInputChange, handleSubmit, loginDetails, navigation, isRegistered }}
        />
    );
};

export default LoginFunctional;
