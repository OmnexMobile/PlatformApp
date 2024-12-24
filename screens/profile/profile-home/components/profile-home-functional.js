import React, { useEffect, useState } from 'react';
import VersionNumber from 'react-native-version-number';
import { useNavigation } from '@react-navigation/native';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getProfileReset } from 'screens/profile/profile.action';
import ProfilePresentational from './profile-home-presentational';
import { useAppContext } from 'contexts/app-context';
import { showErrorMessage, successMessage } from 'helpers/utils';
import { registerDevice, REGISTER_TYPES } from 'screens/auth/register/components/register-functional';
import { getUniqueId } from 'react-native-device-info';

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
    const { profile, appSettings, handleLogout } = useAppContext();
    const navigation = useNavigation();
    // const dispatch = useDispatch();

    useEffect(() => {
        !profile?.Token &&
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.SPLASH_SCREEN }],
            });
    }, [profile]);

    const handleLogoutFun = async () => {
        setLoading(true);
        registerDevice(
            appSettings?.serverUrl,
            {
                RegisteredDeviceId: await getUniqueId(),
                ServerUrl: appSettings?.serverUrl,
            },
            REGISTER_TYPES.LOGOUT,
        )
            .then(data => {
                console.log('🚀 ~ file: profile-home-functional.js:100 ~ handleLogoutFun ~ data:', data);
                if (data?.Success) {
                    handleLogout();
                    // successMessage({ message: 'Success', description: 'Successfully Unregistered this Device' });
                } else {
                    showErrorMessage(data?.Error || 'Something went wrong while Logout');
                    setLoading(false);
                }
            })
            .catch(data => {
                setLoading(false);
                showErrorMessage(data?.Error || 'Something went wrong while Logout');
            });
    };

    return (
        <ProfilePresentational
            {...{ menus, navigation, isActive, setIsActive, handleLogout: handleLogoutFun, profileData: profile, versionDetails, loading }}
        />
    );
};

export default ProfileHomeFunctional;
