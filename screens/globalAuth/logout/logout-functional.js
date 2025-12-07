import React, { useEffect, useState } from 'react';
import VersionNumber from 'react-native-version-number';
import { useNavigation } from '@react-navigation/native';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import LogoutPresentational from './logout-presentational';
import { useAppContext } from 'contexts/app-context';
import { showErrorMessage, successMessage } from 'helpers/utils';
import { registerDevice, REGISTER_TYPES } from 'screens/globalAuth/register/register-functional';
import { getUniqueId } from 'react-native-device-info';
import localStorage from 'global/localStorage';
import AsyncStorage from '@react-native-community/async-storage';
import { GLOBALSERVER_URL } from 'screens/globalConstant/globalURL';
import { useDispatch } from 'react-redux';

const menus = [];
const versionDetails = {
    appVersion: VersionNumber.appVersion,
    buildVersion: VersionNumber.buildVersion,
    bundleIdentifier: VersionNumber.bundleIdentifier,
};

const LogoutFunctional = () => {
    const dispatch = useDispatch();
    console.log('reach ProfileHomeFunctional')
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails, clearSite } = useAppContext();
    const navigation = useNavigation();
    console.log('current appSettings', appSettings)
    
    useEffect(() => {
        !profile?.Token &&
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.SPLASH_SCREEN }],
            });
    }, [profile]);

    // const getUserDetails = async () => {
    //     try {
    //       const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
    //       const value = JSON.parse(stringifiedUserDetails);
    //       console.log('current userDetails--->', value)
    //       if (value !== null) {
    //         setCurrentUserData(value);
    //       }
    //     } catch (e) {
    //       // error reading value
    //       console.log('error--->', e)
    //     }
    // };

    const handleLogoutFun = async () => {
      setLoading(true);
			handleLogout();
			dispatch({ type: 'RESET_TO_INITIAL' });
			successMessage({ message: 'Success', description: 'Successfully Logged Out' });
			localStorage.storeData('appLogged', false);
			await AsyncStorage.removeItem('userDetails');
			console.log('globalDeviceDetails--->2', globalDeviceDetails?.deviceDetails?.ServerUrl, '--', GLOBALSERVER_URL)
			localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, GLOBALSERVER_URL)
			handleGlobalURL('serverUrl', GLOBALSERVER_URL)
			clearSite();
    }

		const handleLogoutFun1 = async () => {
			setLoading(true);
			console.log('reach handlelogout---<>',globalDeviceDetails, globalDeviceDetails?.deviceDetails?.ServerUrl, '---', globalURL?.serverUrl, appSettings?.serverUrl,)
			const DEFAULT_URL = GLOBALSERVER_URL;
			const BASE_URL = DEFAULT_URL.replace(/\/$/, '');
			// const currentServerUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
			// console.log('DEFAULT_URL------>', currentServerUrl, DEFAULT_URL)
			await registerDevice(
					DEFAULT_URL,
					{
							RegisteredDeviceId: await getUniqueId(),
							serverUrl: BASE_URL,
					},
					REGISTER_TYPES.LOGOUT,
			).then(async data => {
					console.log('🚀 ~ file: profile-home-functional.js:100 ~ handleLogoutFun ~ data:', data);
					if (data?.Success) {
						handleLogout();
						successMessage({ message: 'Success', description: 'Successfully Logged Out' });
						localStorage.storeData('appLogged', false);
						await AsyncStorage.removeItem('userDetails');
						console.log('globalDeviceDetails--->2', globalDeviceDetails?.deviceDetails?.ServerUrl, '--', DEFAULT_URL)
						localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, DEFAULT_URL)
						handleGlobalURL('serverUrl', DEFAULT_URL)
						clearSite();
					} else {
						console.log('error data:', data);
						showErrorMessage(data?.Error || 'Something went wrong while Logout');
						setLoading(false);
					}
			})
			.catch(data => {
				setLoading(false);
				console.log('catch error data:', data);
				showErrorMessage(data?.Error || 'Something went wrong while Logout');
			});
		};

    return (
        <LogoutPresentational
            {...{ menus, navigation, isActive, setIsActive, handleLogout: handleLogoutFun, profileData: profile, versionDetails, loading }}
        />
    );
};

export default LogoutFunctional;
