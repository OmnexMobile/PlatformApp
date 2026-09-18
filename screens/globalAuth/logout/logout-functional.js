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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBALSERVER_URL, getGlobalUrls, setGlobalUrls } from 'screens/globalConstant/globalURL';
import { useDispatch, useSelector } from 'react-redux';
import APQPActions from 'store/APQP/apqpRedux';
import AUDITPROActions from 'store/AuditPro/auditRedux';
import { saveRecentViewed } from 'helpers/recent-viewed-store';

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
    const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails, clearSite, handleRemoveActivity, recentActivities } = useAppContext();
    const navigation = useNavigation();
    const recentAudits = useSelector(state => state?.audits?.recentAudits);
    const recentActivityAPQP = useSelector(state => state?.projects?.recentActivity);
    console.log('current appSettings', appSettings)
    
    useEffect(() => {
        if (!profile?.Token) {
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.GLOBAL_LOGIN }],
            });
        }
    }, [profile, navigation]);

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

    // The logged in user is only known before handleLogout() resets the profile.
    const resolveCurrentUserId = async () => {
      if (profile?.UserId) {
        return profile.UserId;
      }
      try {
        const stored = await AsyncStorage.getItem('userDetails');
        const parsed = stored ? JSON.parse(stored) : null;
        return parsed?.userId ?? parsed?.Data?.[0]?.UserId ?? null;
      } catch (err) {
        console.log('Failed to resolve user id for recent activity snapshot', err);
        return null;
      }
    };

    const handleLogoutFun = async () => {
      console.log('reach here logout')
      setLoading(true);
      // Keep this user's recently viewed items so signing back in restores them.
      const currentUserId = await resolveCurrentUserId();
      await saveRecentViewed(currentUserId, {
        recentAudits,
        recentActivityAPQP,
        recentActivityPS: recentActivities,
      });
      handleLogout();
      dispatch({ type: 'RESET_TO_INITIAL' });
      successMessage({ message: 'Success', description: 'Successfully Logged Out' });
      localStorage.storeData('appLogged', false);
      await AsyncStorage.removeItem('userDetails');
      const currentGlobal = getGlobalUrls().globalServerUrl || GLOBALSERVER_URL;
      console.log('globalDeviceDetails--->2', globalDeviceDetails?.deviceDetails?.ServerUrl, '--', currentGlobal)
      localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobal)
      handleGlobalURL('serverUrl', currentGlobal)
      setGlobalUrls({ globalServerUrl: currentGlobal });
      clearSite();
      // Clear the in-memory/shared copies so the next user cannot see them; the
      // per-user snapshot taken above is what gets restored on the next login.
      handleRemoveActivity(); //PS
      dispatch(APQPActions.updateRecentActivityList([])); //APQP
      dispatch(AUDITPROActions.clearAudits()); //AuditPro/SM

    }

		const handleLogoutFun1 = async () => {
			setLoading(true);
			console.log('reach handlelogout---<>',globalDeviceDetails, globalDeviceDetails?.deviceDetails?.ServerUrl, '---', globalURL?.serverUrl, appSettings?.serverUrl,)
			const currentGlobal = getGlobalUrls().globalServerUrl || GLOBALSERVER_URL;
			const BASE_URL = currentGlobal.replace(/\/$/, '');
			// const currentServerUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
			// console.log('DEFAULT_URL------>', currentServerUrl, DEFAULT_URL)
			await registerDevice(
					currentGlobal,
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
						console.log('globalDeviceDetails--->2', globalDeviceDetails?.deviceDetails?.ServerUrl, '--', currentGlobal)
						localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobal)
						handleGlobalURL('serverUrl', currentGlobal)
            setGlobalUrls({ globalServerUrl: currentGlobal });
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
