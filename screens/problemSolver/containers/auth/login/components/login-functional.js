import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import API_URL from 'global/ApiUrl';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';

const LoginFunctional = ({}) => {
    const [selectLanguageModal, setSelectLanguageModal] = useState(false);
    const { profile, handleLogin, handleSiteList, appSettings } = useAppContext();
    const [loginDetails, setLoginDetails] = useState({
        // username: 'Champion1@michelin',
        // password: 'a1',
        username: '',
        password: '',
        loggingIn: false,
        // isRegister: !!appSettings?.serverUrl,
    });
   
    const navigation = useNavigation();
    console.log('Loginp----', appSettings, !!appSettings?.serverUrl, appSettings?.serverUrl)
    const isRegistered = !!appSettings?.serverUrl;
    // const isRegistered = loginDetails?.isRegister

    useEffect(() => {
        profile?.Token && navigation.navigate(ROUTES.SPLASH_SCREEN_PS);
        console.log(' profile?.Token----',  profile?.Token)
        // profile?.Token ? ROUTES.HOME : ROUTES.LOGIN_PS
    }, [profile?.Token]);

    useEffect(() => {
        !isRegistered && navigation.navigate(ROUTES.REGISTER_PS);
    }, []);

    //need to fix ******

    // useEffect(() => {
    //     console.log('reach here useefect---unregister', loginDetails?.isRegister)
    //     !isRegistered && navigation.navigate(ROUTES.REGISTER_PS);
    // }, []);

    const handleInputChange = (label, value) => {
        setLoginDetails({
            ...loginDetails,
            [label]: value,
        });
    };

    const handleSubmit = async () => {
        console.log('isRegistered-->', isRegistered)
        if (isRegistered) {
            console.log('loginDetails', loginDetails);
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
            console.log('get response from Login', loginDetails?.username,'--', loginDetails?.password, '--', encryptedPassword);
            console.log('postAPI from Login', `${API_URL.LOGIN}`,'--', [LOCAL_STORAGE_VARIABLES.UserName], '--', [LOCAL_STORAGE_VARIABLES.Password]);
            console.log('Registered Login url----', appSettings?.serverUrl)
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.SERVER_URL, appSettings?.serverUrl);
            try {
                const data = await postAPI(
                    `${API_URL.LOGIN}`,
                    formReq({
                        [LOCAL_STORAGE_VARIABLES.UserName]: loginDetails?.username,
                        [LOCAL_STORAGE_VARIABLES.Password]: encryptedPassword?.toString(),
                    }),
                ) 
                // fetch('https://saasmobile.ewqims.net/problemsolverapi/Login/List', {
                //     method: 'POST',
                //     headers: {
                //       'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //       username: loginDetails?.username,
                //       password: encryptedPassword?.toString(),
                //     }),
                //   })
                //     .then(response => response.json())
                //     .then(data => {
                //         console.log('data', data);
                     
                //     })
                //     .catch(err => {
                //       console.error('Error:', err);
                      
                //     });

                
                // .then(response => console.log('response--->', response.json()))
                // .then(data => {
                //   // Assuming data.someProperty is the string you're working with
                //   let myString = data.someProperty;
                  
                //   if (myString) {
                //     let substringValue = myString.substring(0, 10);
                //     console.log('substringValue', substringValue);
                //   } else {
                //     console.error('myString is null or undefined');
                //   }
                // })
                // .catch(error => {
                //   console.error('Error fetching data:', error);
                // });
                console.log('login data API--->', data,'----', data?.Data)
                console.log('data?.Data?.Message && data?.Data?.length', data?.Message, '---', data?.Data?.length)
                if (data?.Message == 'Success' && data?.Data?.length) {
                    data?.Token && setProfileCall(data);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
                    localStorage.storeData('CurrentApp', 'problemSolver');
                    const userDetailsPS = {
                        userId: data?.Data[0]?.UserId.toString(),
                        accessToken: data?.Token,
                        userFullName: data?.Data[0]?.FullName
                      };
                      const stringifiedUserDetails = JSON.stringify(userDetailsPS);
                      AsyncStorage.setItem('userDetailsPS', stringifiedUserDetails);
                      console.log('Set Async userDetailsPS ', stringifiedUserDetails)
                } else {
                    handleInputChange('loggingIn', false);
                    showErrorMessage('User data not found!' || data?.Message || strings?.InvalidCred);
                }
                console.log('🚀 ~ file: login-functional.js:53 ~ handleSubmit ~ data', data);
                handleInputChange('loggingIn', false);
            } catch (err) {
                console.log('🚀 ~ file: login-functional.js:58 ~ handleSubmit ~ err', err);
                handleInputChange('loggingIn', false);
                // showErrorMessage('Something went wrong!!');
            }
        } else {
            console.log('reach here---unregister')
            navigation.navigate(ROUTES.REGISTER_PS);
        }
    };

    const setProfileCall = data => {
        console.log('🚀 ~ file: login-functional.js:69 ~ setProfileCall ~ data', data);
        handleLogin({
            Token: data?.Token,
            UserId: data?.Data?.[0]?.UserId?.toString(),
            SiteId: data?.Data?.[0]?.SiteId?.toString(),
            UserFullName: data?.Data?.[0]?.FullName,
            CurrentApp: 'problemSolver',
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
