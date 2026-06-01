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
    const { profile } = useAppContext();
    const navigation = useNavigation();
    console.log('profile---splash', profile, profile?.CurrentApp)

    useEffect(() => {
        !loading &&
            navigation.reset({
                index: 0,
                // routes: [{ name: profile?.Token ? ROUTES.HOME : profile?.CurrentApp == 'problemSolver' ? ROUTES.LOGIN_PS : ROUTES.LOGIN }],
                // routes: [{ name: profile?.Token ? ROUTES.HOME_PS : ROUTES.LOGIN_PS }],
                routes: [{ name: profile?.Token ? ROUTES.HOME_PS : ROUTES.GLOBAL_LOGIN }],
            });
    }, [loading]);

    const getLocalStorageData = async () => {
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(() => {
            getLocalStorageData();
        }, 1000);
        // handleLanguage();
    }, []);

    // const handleLanguage = async () => {
    //     const language = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SELECTED_LANGUAGE)) || Languages.ENGLISH;
    //     strings.setLanguage(language);
    // };

    return <SplashScreenPresentational />;
};

export default SplashScreenFunctional;
