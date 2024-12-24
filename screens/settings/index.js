import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Content, Header } from 'components';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';
import ProfileMenuButton from 'screens/profile/profile-home/components/profile-menu-button';

const menus = [
    {
        title: 'General',
        menus: [
            {
                title: 'Appearance',
                iconType: ICON_TYPE.MaterialIcons,
                iconName: 'nightlight-round',
                route: ROUTES.THEME_PICKER,
            },
            // {
            //     title: 'Language',
            //     iconType: ICON_TYPE.Ionicons,
            //     iconName: 'language',
            //     route: ROUTES.PREFERRED_LANGUAGE,
            // },
        ],
    },
];

const Settings = ({}) => {
    const navigation = useNavigation();
    return (
        <Content noPadding>
            <Header title="Settings" />
            {menus.map((menu, i) => (
                <ProfileMenuButton key={i} {...{ navigation, menu }} />
            ))}
        </Content>
    );
};
export default Settings;
