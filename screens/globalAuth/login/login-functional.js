import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import API_URL from 'global/ApiUrl';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';
import globalAuth from '../../../services/Auditpro-Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import ApiUrl from 'global/ApiUrl';
import { GLOBALSERVER_URL, ensureTrailingSlash, setGlobalUrls } from 'screens/globalConstant/globalURL';
import axios from 'axios';

const LoginFunctional = ({}) => {
    const dispatch = useDispatch();
    const { icLoginlogo } = useSelector(state => state.inspection);
    const [selectLanguageModal, setSelectLanguageModal] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        // username: 'Champion1@michelin',
        // password: 'a1',
        username: '',
        password: '',
        loggingIn: false,
    });
    const [currentToken, setCurrentToken] = useState('');
    const [serverUrlLoaded, setServerUrlLoaded] = useState(false);
    const [bootstrappedUrl, setBootstrappedUrl] = useState('');
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
        handleSite,
    } = useAppContext();
    const navigation = useNavigation();
    const isRegistered = !!(globalURL?.serverUrl || bootstrappedUrl);
    // console.log('currentURL--->login1', currentURL)
    // const isRegistered = currentURL;

    useEffect(() => {
        console.log('currentToken--->', currentToken);
        if (currentToken) {
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.GLOBAL_DASHBOARD }],
            });
        }
    }, [currentToken, navigation]);

    // useEffect(() => {
    // 	async function fetchData() {
    // 		const currentUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
    // 		console.log('currentURL--->login', currentUrl)
    // 		setCurrentURL(currentUrl)
    // 	}
    // 	fetchData();

    // }, [currentURL])

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const bootstrapUrl = async () => {
                const registeredUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister);
                const storedUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
                const persistedAuthUrl = await AsyncStorage.getItem('storedserverrul');
                const fallbackUrl = ensureTrailingSlash(GLOBALSERVER_URL);

                console.log('bootstrapUrl storedUrl, registeredUrl, persistedAuthUrl, fallbackUrl', storedUrl,'--', registeredUrl, '--', persistedAuthUrl,'--', fallbackUrl);
                const resolvedUrl = ensureTrailingSlash(registeredUrl || storedUrl || persistedAuthUrl || fallbackUrl || '');

                if (!isActive) return;

                if (resolvedUrl) {
                    handleGlobalURL('serverUrl', resolvedUrl);
                    setGlobalUrls({ globalServerUrl: resolvedUrl });
                    globalAuth.setServerUrl(resolvedUrl);
                    setBootstrappedUrl(resolvedUrl);
                    await localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, resolvedUrl);
                    await AsyncStorage.setItem('storedserverrul', resolvedUrl);
                } else {
                    setBootstrappedUrl('');
                }
                setServerUrlLoaded(true);
            };
            bootstrapUrl();
            return () => {
                isActive = false;
            };
        }, [handleGlobalURL]),
    );

    useEffect(() => {
        if (serverUrlLoaded && !isRegistered) {
            navigation.navigate(ROUTES.GLOBAL_REGISTER);
        }
    }, [serverUrlLoaded, isRegistered, navigation]);

    const handleInputChange = (label, value) => {
        setLoginDetails({
            ...loginDetails,
            [label]: value,
        });
    };

    // console.log('!!globalURL?.serverUrl--->', !!globalURL?.serverUrl, '--', globalURL?.serverUrl, '--globalLoginData', globalLoginData)
    // console.log('sites---->get', sites)

    const handleSubmit = async () => {
        const loginflag = 1;
        console.log('isRegistered-----', isRegistered);
        if (isRegistered) {
            console.log('loginDetails', loginDetails, 'loginURL--->', globalURL?.serverUrl + `${API_URL.GLOBAL_LOGIN}`);
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
            AsyncStorage.setItem('loginUserName', loginDetails?.username);
            AsyncStorage.setItem('loginPassword', loginDetails?.password);
            handleLoginCall(encryptedPassword, loginflag);
        } else {
            navigation.navigate(ROUTES.GLOBAL_REGISTER);
            // navigation.navigate(ROUTES.HOME_FAB_VIEW);
        }
    };

    const handleServerURL = currentData => {
        console.log('loginDetails?.username---->', loginDetails?.username, currentData?.Data[0], typeof currentData?.Data[0].FullName);
        const userDetails = {
            userId: currentData?.Data[0]?.UserId.toString(),
            siteId: currentData?.Data[0]?.Siteid,
            accessToken: currentData?.Token,
            userFullName: currentData?.Data[0].FullName,
            smAccess: currentData?.Data[0]?.SupplierManagementAccess,
            message: currentData?.Message,
            success: currentData?.Success,
            data: currentData?.Data,
        };
        const stringifiedUserDetails = JSON.stringify(userDetails);
        AsyncStorage.setItem('userDetails', stringifiedUserDetails);
        console.log('Set Async userDetails ', stringifiedUserDetails);
        localStorage.storeData('appLogged', true);
    };

    const handleLoginCall = async (encryptedPassword, loginflag, isSso) => {
        const fcmToken = '';
        const deviceId = await AsyncStorage.getItem('deviceid');
        console.log('get deviceId', deviceId);
        try {
            globalAuth.globalLogin(
                loginDetails?.username,
                encryptedPassword.toString(),
                fcmToken,
                deviceId,
                loginflag,
                isSso,
                async (res, data) => {
                    // console.log('global loginUser---->', data, res);
                    console.log('global loginUser---->',  data?.data?.Message);
                    
                    if (data?.data?.Success == true) {
                        console.log('checking global loginResponse---->', data?.data);

                        // Persist NCOFI setting so AuditPro CheckPoint screens can use it
                        try {
                            const fromLogin =
                                data?.data?.Data?.NCOFISetting ??
                                (Array.isArray(data?.data?.Data)
                                    ? data.data.Data[0]?.NCOFISetting
                                    : undefined) ??
                                data?.data?.NCOFISetting;
                            const fromDevice =
                                globalDeviceDetails?.deviceDetails?.NCOFISetting;
                            const ncofiSetting = fromLogin ?? fromDevice;
                            if (
                                typeof ncofiSetting !== 'undefined' &&
                                ncofiSetting !== null
                            ) {
                                const normalized = String(ncofiSetting);
                                console.log(
                                    '[GlobalLogin] NCOFISetting resolved:',
                                    normalized,
                                );
                                await AsyncStorage.setItem(
                                    'NCSettingValue',
                                    normalized,
                                );
                            } else {
                                console.log(
                                    '[GlobalLogin] NCOFISetting not found in login or device details',
                                    {
                                        fromLogin,
                                        fromDevice,
                                    },
                                );
                            }
                        } catch (e) {
                            console.log(
                                '[GlobalLogin] Failed to persist NCOFISetting',
                                e,
                            );
                        }

                        AsyncStorage.setItem('userDetails', JSON.stringify(data?.data));
                        data?.data?.Token && (await setProfileCall(data?.data)); // navigate to home
                        handleGlobalLogin(data?.data);
                        handleServerURL(data?.data);
                    } else {
                    // console.log('global loginUser---->',  res?.data?.Message);

                        handleInputChange('loggingIn', false);
                        showErrorMessage(
                            data?.data?.Message ||
                                data?.Message ||
                                strings?.InvalidCred,
                        );
                    }
                    handleInputChange('loggingIn', false);
                },
            );
        } catch (err) {
            console.log('🚀 ~ file: login-functional.js:58 ~ handleSubmit ~ err', err);
            handleInputChange('loggingIn', false);
            showErrorMessage('Something went wrong!!');
        }
    };

    const setProfileCall = async data => {
        console.log('🚀 ~ file: login-functional.js:148,  ~ setProfileCall ~ data', data, '--', data?.Data);
        const APIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
        const newFormData = new FormData();
            newFormData.append('UserID', data?.Data[0]?.UserId);
            newFormData.append('SiteID', data?.Data[0]?.Siteid);
        try {
            const res = await fetch(`${APIURL}${ApiUrl.IC_SETTINGS}`, {
                method: 'POST',
                body: newFormData,
            });
 
            const data = await res.json();
 
            if (data?.Success) {
                console.log(data?.Data,'data?.Data')
                const settings = {
                    ...data?.Data?.[0],
                };
 
                dispatch({
                    type: 'IC_SETTINGS',
                    icSettings: settings || {},
                });
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
        // localStorage.storeData('CurrentApp', 'problemSolver');
        handleLogin({
            Token: data?.Token,
            UserId: data?.Data?.[0]?.UserId?.toString(),
            SiteId: data?.Data?.[0]?.SiteId?.toString(),
            UserFullName: data?.Data?.[0]?.FullName,
            // CurrentApp: 'problemSolver',
        });
        handleSiteList(data?.Data);
        handleSite(data?.Data);
        setCurrentToken(data?.Token);
        let icUserData = {
            userData: data?.Data[0] || {},
            token: data?.Token || '',
        };
        dispatch({ type: 'IC_USER_DATA', icUserData: icUserData });
    };

    return (
        <LoginPresentational
            {...{ selectLanguageModal, setSelectLanguageModal, handleInputChange, handleSubmit, loginDetails, navigation, isRegistered ,loginLogo:icLoginlogo}}
        />
    );
};

export default LoginFunctional;
