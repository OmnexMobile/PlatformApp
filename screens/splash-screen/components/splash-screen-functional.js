import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import localStorage from 'global/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import SplashScreenPresentational from './splash-screen-presentational';

const SplashScreenFunctional = ({}) => {
    const [loading, setLoading] = useState(true);
    const [startupRoute, setStartupRoute] = useState(ROUTES.GLOBAL_REGISTER);
    const navigation = useNavigation();

    useEffect(() => {
        if (!loading) {
            navigation.reset({
                index: 0,
                routes: [{ name: startupRoute }],
            });
        }
    }, [loading, navigation, startupRoute]);

    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(async () => {
            try {
                const [token, storedGlobalUrl, storedRegisterUrl, storedAuthUrl] = await Promise.all([
                    localStorage.getData(LOCAL_STORAGE_VARIABLES.Token),
                    localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL),
                    localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister),
                    AsyncStorage.getItem('storedserverrul'),
                ]);

                if (!isMounted) {
                    return;
                }

                const isRegistered = !!(storedGlobalUrl || storedRegisterUrl || storedAuthUrl);
                const nextRoute = token
                    ? ROUTES.GLOBAL_DASHBOARD
                    : isRegistered
                      ? ROUTES.GLOBAL_LOGIN
                      : ROUTES.GLOBAL_REGISTER;

                console.log('[Splash] startup state', {
                    hasToken: !!token,
                    isRegistered,
                    nextRoute,
                });
                setStartupRoute(nextRoute);
            } catch (error) {
                console.log('[Splash] failed to resolve startup route', error);
                if (isMounted) {
                    setStartupRoute(ROUTES.GLOBAL_REGISTER);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    return <SplashScreenPresentational />;
};

export default SplashScreenFunctional;
