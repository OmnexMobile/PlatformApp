import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VersionNumber from 'react-native-version-number';
import { useNavigation } from '@react-navigation/native';
import localStorage from 'global/localStorage';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getProfileReset } from 'screens/profile/profile.action';
import ProfilePresentational from './profile-home-presentational';
import { useAppContext } from 'contexts/app-context';

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
    {
        title: 'SUPPORT',
        menus: [
            {
                title: 'Get help',
                iconType: ICON_TYPE.Ionicons,
                iconName: 'ios-help',
                link: 'https://www.swiggy.com/terms-and-conditions',
            },
            {
                title: 'Give us feedback',
                iconType: ICON_TYPE.AntDesign,
                iconName: 'message1',
            },
        ],
    },
    {
        title: 'LEGAL',
        menus: [
            {
                title: 'Terms of Services',
                iconType: ICON_TYPE.Ionicons,
                iconName: 'ios-document-text-outline',
                link: 'https://www.swiggy.com/terms-and-conditions',
            },
        ],
    },
];

const versionDetails = {
    appVersion: VersionNumber.appVersion,
    buildVersion: VersionNumber.buildVersion,
    bundleIdentifier: VersionNumber.bundleIdentifier,
};

const ProfileHomeFunctional = () => {
    const [isActive, setIsActive] = useState(false);
    const { profile, handleLogout } = useAppContext();
    const navigation = useNavigation();
    // const dispatch = useDispatch();

    useEffect(() => {
        !profile?.Token &&
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.SPLASH_SCREEN }],
            });
    }, [profile]);

    // const handleLogout = async () => {
    //     await dispatch(getProfileReset());
    //     await localStorage.clearAll();
    // };

    return <ProfilePresentational {...{ menus, navigation, isActive, setIsActive, handleLogout, profileData: profile, versionDetails }} />;
};

export default ProfileHomeFunctional;
