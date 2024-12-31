import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import localStorage from 'global/localStorage';
import { COMPANY_DETAILS, Languages, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import strings from 'config/localization';
import SplashScreenPresentational from './splash-screen-presentational';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileSuccess } from 'screens/profile/profile.action';
import { useAppContext } from 'contexts/app-context';

const SplashScreenFunctional = ({}) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const { profile } = useAppContext();
    const navigation = useNavigation();

    useEffect(() => {
   
    console.log('token----> splash', token?.length, token)
        !loading &&
            navigation.reset({
                index: 0,
                // routes: [{ name: profile?.Token ? ROUTES.HOME_FAB_VIEW : ROUTES.LOGIN }],
                // routes: [{ name: profile?.Token ? ROUTES.LAUNCH_SCREEN : ROUTES.REGISTER }],
                // routes: [{ name: profile?.Token ? ROUTES.HOME_FAB_VIEW : ROUTES.GLOBAL_LOGIN }],
                
                routes: [{ name: token?.length > 0 ? ROUTES.HOME_FAB_VIEW : ROUTES.GLOBAL_LOGIN }],
            });
    }, [loading]);

    const getLocalStorageData = async () => {
        setLoading(false);
    };

    useEffect(() => {
        async function fetchData() {
          const currentToken = await localStorage.getData(LOCAL_STORAGE_VARIABLES.Token);
          console.log('currentToken--->splash', currentToken, currentToken?.length)
          setToken(currentToken)
        }
        fetchData();
      }, [token]);

    // const currentAppToken = async () => {
    //     const currentToken = await localStorage.getData(LOCAL_STORAGE_VARIABLES.Token);
    //     console.log('currentToken--->splash', currentToken, currentToken?.length)
    //     setToken(currentToken)
    // }

    useEffect(() => {
        setTimeout(() => {
            getLocalStorageData();
            // currentAppToken();
        }, 1000);
        // handleLanguage();
    }, []);

    // useEffect(() => {
    //     setTimeout(() => {
    //         currentAppToken();
    //     }, 1000);
    //     // handleLanguage();
    // }, []);

    // const handleLanguage = async () => {
    //     const language = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SELECTED_LANGUAGE)) || Languages.ENGLISH;
    //     strings.setLanguage(language);
    // };

    return <SplashScreenPresentational />;
};

export default SplashScreenFunctional;
