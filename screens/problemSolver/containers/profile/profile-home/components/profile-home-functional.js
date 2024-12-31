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
import AsyncStorage from '@react-native-community/async-storage';
// import auth from '../../../../../../services/Auditpro-Auth';

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
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    // const [currentUserData, setCurrentUserData] = useState(null);
    // const [logoutFlag, setLogoutFlag] = useState(parseInt(''));
    const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails } = useAppContext();
    const navigation = useNavigation();
    // const dispatch = useDispatch();

    //// need to fix ////
    
    useEffect(() => {
        !profile?.Token &&
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.SPLASH_SCREEN_PS }],
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
        // await getUserDetails()
        // setLogoutFlag(parseInt(0))
        setLoading(true);
        console.log('reach handlelogout---<>', globalDeviceDetails?.deviceDetails?.ServerUrl, '---', globalURL?.serverUrl)
        await registerDevice(
            // appSettings?.serverUrl,
            // globalURL?.serverUrl,
            globalDeviceDetails?.deviceDetails?.ServerUrl,
            {
                RegisteredDeviceId: await getUniqueId(),
                // ServerUrl: appSettings?.serverUrl,
                ServerUrl: globalDeviceDetails?.deviceDetails?.ServerUrl,
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

    // const logoutCall = async() => {
    //     console.log('currentUserData--->logout-->', currentUserData)
    //     const userName = currentUserData?.userFullName;
    //     const password = '';
    //     const loginfcmtkn = '';
    //     const deviceId = await AsyncStorage.getItem('loginDeviceId');
    //     const loginDeviceId = deviceId || '';
    //     const ssologinstatusbool = await AsyncStorage.getItem('ssologinstatusbool');
    //     const isSso = ssologinstatusbool || '';
    //     auth.loginUserPs(
    //     // auth.globalLogin(
    //       userName,
    //       password,
    //       loginfcmtkn,
    //       loginDeviceId,
    //       logoutFlag,
    //       isSso,
    //       (res, data) => {
    //         console.log('loginUser', data);
    //         console.log('checkingloginUserresponse', res);
    //         //this.props.storeSupplierManagement("true");
    
    //         if (data.data.Message == "Logout Successfully") {
    //           console.log('sjdfsjdfjdfjsdfjsfj',data);
    //           console.log('storeUserName', email);
              
             
    //         } else {
    //           // Alert.alert(data.data.Message)
    //           console.log('checkingloginUserresponseelse', res);
    
    //         }
    //       },
    //     );
    // };

    return (
        <ProfilePresentational
            {...{ menus, navigation, isActive, setIsActive, handleLogout: handleLogoutFun, profileData: profile, versionDetails, loading }}
        />
    );
};

export default ProfileHomeFunctional;
