import React from 'react';
import { View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/core';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { IconComponent, TextComponent } from 'components';
// import { openLink } from 'helpers/utils';

const ProfileMenuButton = ({ menu, getProfileReset }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    return (
        <View style={{}}>
            {menu.title ? (
                <View style={{ width: '90%', alignSelf: 'center', paddingTop: 10, paddingBottom: 0 }}>
                    <TextComponent type={FONT_TYPE.BOLD} style={{ fontSize: FONT_SIZE.LARGE, color: theme.colors.primaryThemeColor }}>
                        {menu.title}
                    </TextComponent>
                </View>
            ) : null}
            {menu.menus.map((menu, i) => {
                const isLogout = menu.title === 'Logout';
                return (
                    <View key={i}>
                        <Ripple
                            rippleColor={theme.mode.textColor}
                            onPress={() =>
                                menu.link
                                    ? console.log(menu.link)
                                    : // ? openLink(menu.link)
                                      menu.route && navigation.navigate(menu.route)
                            }
                            style={[
                                {
                                    paddingVertical: 15,
                                },
                            ]}>
                            <View
                                style={{
                                    width: '90%',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                <TextComponent
                                    style={[{ fontSize: FONT_SIZE.REGULAR }, menu.title === 'Logout' && { color: COLORS.primaryThemeColor }]}>
                                    {menu.title}
                                </TextComponent>
                                {menu.title !== 'Logout' && (
                                    <IconComponent size={FONT_SIZE.X_LARGE} color={theme.mode.textColor} name={menu.iconName} type={menu.iconType} />
                                )}
                            </View>
                        </Ripple>
                        <View style={{ height: 1, backgroundColor: theme.mode.borderColor, width: '90%', alignSelf: 'center' }} />
                    </View>
                );
            })}
        </View>
    );
};

export default ProfileMenuButton;
