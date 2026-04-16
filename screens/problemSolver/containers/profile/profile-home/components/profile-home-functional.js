import React, { useEffect, useState } from 'react';
import VersionNumber from 'react-native-version-number';
import { useNavigation } from '@react-navigation/native';
import { ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import ProfilePresentational from './profile-home-presentational';
import { useAppContext } from 'contexts/app-context';
import { showErrorMessage, successMessage } from 'helpers/utils';
// import { registerDevice, REGISTER_TYPES } from 'screens/problemSolver/containers/auth/register/components/register-functional';
import { registerDevice, REGISTER_TYPES } from 'screens/globalAuth/register/register-functional';
import { getUniqueId } from 'react-native-device-info';
import localStorage from 'global/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const menus = [
    // {
    //     // title: 'Tasks',
    //     menus: [
    //         {
    //             title: 'Settings',
    //             iconType: ICON_TYPE.AntDesign,
    //             iconName: 'setting',
    //             route: ROUTES.SETTINGS,
    //         },
    //     ],
    // },
    // {
    //     title: 'SUPPORT',
    //     menus: [
    //         {
    //             title: 'Get help',
    //             iconType: ICON_TYPE.Ionicons,
    //             iconName: 'ios-help',
    //             link: 'https://www.swiggy.com/terms-and-conditions',
    //         },
    //         {
    //             title: 'Give us feedback',
    //             iconType: ICON_TYPE.AntDesign,
    //             iconName: 'message1',
    //         },
    //     ],
    // },
    // {
    //     title: 'LEGAL',
    //     menus: [
    //         {
    //             title: 'Terms of Services',
    //             iconType: ICON_TYPE.Ionicons,
    //             iconName: 'ios-document-text-outline',
    //             link: 'https://www.swiggy.com/terms-and-conditions',
    //         },
    //     ],
    // },
];

const versionDetails = {
    appVersion: VersionNumber.appVersion,
    buildVersion: VersionNumber.buildVersion,
    bundleIdentifier: VersionNumber.bundleIdentifier,
};

const ProfileHomeFunctional = () => {
    console.log('reach ProfileHomeFunctional')
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    // const [currentUserData, setCurrentUserData] = useState(null);
    // const [logoutFlag, setLogoutFlag] = useState(parseInt(''));
    const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails } = useAppContext();
    const navigation = useNavigation();
    // const dispatch = useDispatch();

        console.log('current appSettings', appSettings)

    //// need to fix ////
    
    useEffect(() => {
        !profile?.Token &&
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.SPLASH_SCREEN_PS }],
            });
    }, [profile]);

    const handleLogoutFun = async () => {
        // await getUserDetails()
        // setLogoutFlag(parseInt(0))
        setLoading(true);
        console.log('reach handlelogout---<>',globalDeviceDetails, globalDeviceDetails?.deviceDetails?.ServerUrl, '---', globalURL?.serverUrl)
        const currentServerUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
        // const currentServerUrl = JSON.parse(rawServerUrl);
        console.log('currentServerUrl------>', currentServerUrl)
        await registerDevice(
            // appSettings?.serverUrl,
            // globalURL?.serverUrl,
            globalDeviceDetails?.deviceDetails?.ServerUrl,
            // currentServerUrl,
            {
                RegisteredDeviceId: await getUniqueId(),
                // ServerUrl: appSettings?.serverUrl,
                ServerUrl: globalDeviceDetails?.deviceDetails?.ServerUrl,
                // ServerUrl: currentServerUrl,
            },
            REGISTER_TYPES.LOGOUT,
        )
            .then(data => {
                console.log('🚀 ~ file: profile-home-functional.js:100 ~ handleLogoutFun ~ data:', data);
                if (data?.Success) {
                    // logoutCall();
                    handleLogout();
                    successMessage({ message: 'Success', description: 'Successfully Logged Out' });
                    localStorage.storeData('appLogged', false);
                    console.log('globalDeviceDetails--->2', globalDeviceDetails?.deviceDetails?.ServerUrl)
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ServerUrl)
                    handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.ServerUrl)
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN)
                    // navigation.navigate(ROUTES.GLOBAL_LOGIN)
                    // navigation.navigate(ROUTES.LOGIN_PS)
                } else {
                    console.log('error data:', data);
                    showErrorMessage(data?.Error || 'Something went wrong while Logout');
                    setLoading(false);
                }
            })
            .catch(data => {
                setLoading(false);
                console.log('catch error data:', data);
                // showErrorMessage(data?.Error || 'Something went wrong while Logout');
            });
    };

    return (
        <ProfilePresentational
            {...{ menus, navigation, isActive, setIsActive, handleLogout: handleLogoutFun, profileData: profile, versionDetails, loading }}
        />
    );
};

export default ProfileHomeFunctional;
