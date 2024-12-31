import React, { useEffect, useState,useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import API_URL from 'global/ApiUrl';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import Auth from 'services/Auth';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { getProfileSuccess } from 'screens/profile/profile.action';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';
import { Keyboard } from 'react-native';
// import Toast,{ DURATION } from 'react-native-easy-toast';

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
        console.log('CURRENT_PAGE---->', 'login-functional')
        !isRegistered && navigation.navigate(ROUTES.REGISTER);
    }, []);

    const handleInputChange = (label, value) => {
        setLoginDetails({
            ...loginDetails,
            [label]: value,
        });
    };

    const handleSubmit = async () => {
        console.log('reach handleSubmit----------')
        if (isRegistered) {
            console.log('get response from Login', loginDetails?.username, loginDetails?.password);
            if(loginDetails?.username == 'deva' && loginDetails?.password == 'a123') {
                // console.log('loginDetails', loginDetails);
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
            console.log('get response from Login', loginDetails?.username, loginDetails?.password, encryptedPassword);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, loginDetails?.username);

                try {
                    // const data = await postAPI(
                    //     `${API_URL.LOGIN}`,
                    //     formReq({
                    //         [LOCAL_STORAGE_VARIABLES.UserName]: loginDetails?.username,
                    //         [LOCAL_STORAGE_VARIABLES.Password]: encryptedPassword?.toString(),
                    //     }),
                    // );
                    // console.log('data-------------', data)
                    // if (data?.Message == 'Success') {
                    //     data?.Token && setProfileCall(data);
                    //     localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
                    //     localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
                    //     localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
                    // } else {
                    //     handleInputChange('loggingIn', false);
                    //     showErrorMessage(strings?.InvalidCred);
                    // }
                    // console.log('🚀 ~ file: login-functional.js:53 ~ handleSubmit ~ data', data);
            
                    handleInputChange('loggingIn', false);
                    navigation.navigate(ROUTES.LAUNCH_SCREEN);
                } catch (err) {
                    console.log('🚀 ~ file: login-functional.js:58 ~ handleSubmit ~ err', err);
                    handleInputChange('loggingIn', false);
                    showErrorMessage('Network Error!!');
                }
            } else {
                showErrorMessage('Invalid Credentials');
            }          
        } else {
            navigation.navigate(ROUTES.REGISTER);
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
