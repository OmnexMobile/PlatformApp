import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import API_URL from 'global/api-urls';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';

const LoginFunctional = ({}) => {
    const [selectLanguageModal, setSelectLanguageModal] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        username: '',
        password: '',
        loggingIn: false,
    });
    const { profile, handleLogin, handleSiteList, appSettings } = useAppContext();
    const navigation = useNavigation();
    const isRegistered = !!appSettings?.serverUrl;

    useEffect(() => {
        profile?.Token && navigation.navigate(ROUTES.SPLASH_SCREEN);
    }, [profile?.Token]);

    useEffect(() => {
        !isRegistered && navigation.navigate(ROUTES.REGISTER);
    }, []);

    const handleInputChange = (label, value) => {
        setLoginDetails({
            ...loginDetails,
            [label]: value,
        });
    };

    const handleSubmit = async () => {
        if (isRegistered) {
            // navigation.navigate(ROUTES.HOME);
            handleInputChange('loggingIn', true);
            var key = CryptoJS.enc.Utf8.parse('8080808080808080');
            var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            var encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(loginDetails?.password), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            // console.log('get response from Login', loginDetails?.username, loginDetails?.password, encryptedPassword);

            try {
                const data = await postAPI(
                    `${API_URL.LOGIN}`,
                    formReq({
                        [LOCAL_STORAGE_VARIABLES.UserName]: loginDetails?.username,
                        [LOCAL_STORAGE_VARIABLES.Password]: encryptedPassword?.toString(),
                    }),
                );
                if (data?.Message == 'Success' && data?.Data?.length) {
                    data?.Token && setProfileCall(data);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
                } else {
                    handleInputChange('loggingIn', false);
                    showErrorMessage('User data not found!' || data?.Message || strings?.InvalidCred);
                }
                console.log('🚀 ~ file: login-functional.js:53 ~ handleSubmit ~ data', data);
                handleInputChange('loggingIn', false);
            } catch (err) {
                console.log('🚀 ~ file: login-functional.js:58 ~ handleSubmit ~ err', err);
                handleInputChange('loggingIn', false);
                showErrorMessage('Something went wrong!!');
            }
        } else {
            // navigation.navigate(ROUTES.REGISTER);
            navigation.navigate(ROUTES.HOME);
        }
    };

    const setProfileCall = data => {
        console.log('🚀 ~ file: login-functional.js:69 ~ setProfileCall ~ data', data);
        handleLogin({
            Token: data?.Token,
            UserId: data?.Data?.[0]?.UserId?.toString(),
            SiteId: data?.Data?.[0]?.SiteId?.toString(),
            UserFullName: data?.Data?.[0]?.FullName,
        });
        handleSiteList(data?.Data);
        // dispatch(
        //     getProfileSuccess({
        //         Token: data?.Token,
        //         UserId: data?.Data?.UserId.toString(),
        //         SiteId: data?.Data?.SiteId.toString(),
        //         UserFullName: data?.Data?.FullName,
        //     }),
        // );
    };

    return (
        <LoginPresentational
            {...{ selectLanguageModal, setSelectLanguageModal, handleInputChange, handleSubmit, loginDetails, navigation, isRegistered }}
        />
    );
};

export default LoginFunctional;
