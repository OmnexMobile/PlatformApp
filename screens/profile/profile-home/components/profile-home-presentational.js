import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextComponent, GradientButton, ImageComponent, IconComponent, Header, Content } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { IMAGES } from 'assets/images';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import ProfileMenuButton from './profile-menu-button';

const LabelValue = ({ iconType = '', iconName = '', value = '' }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.SMALL }}>
        <IconComponent color={COLORS.searchText} type={iconType} name={iconName} />
        <TextComponent style={{ paddingLeft: SPACING.SMALL, color: COLORS.searchText }} fontSize={FONT_SIZE.SMALL}>
            {value}
        </TextComponent>
    </View>
);

const ProfileHomePresentational = ({ menus, navigation, versionDetails, handleLogout, profileData, loading }) => {
    const { theme } = useTheme();
    const { appSettings } = useAppContext();
    return (
        <Content noPadding>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', left: SPACING.NORMAL, top: useSafeAreaInsets().top + 10, zIndex: 1 }}>
                <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={theme.colors.primaryThemeColor} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.SETTINGS)}
                style={{ position: 'absolute', right: SPACING.NORMAL, top: useSafeAreaInsets().top + 10, zIndex: 1 }}>
                <IconComponent name={'setting'} type={ICON_TYPE.AntDesign} color={theme.colors.primaryThemeColor} size={25} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: SPACING.NORMAL }}>
                <Animatable.View animation="fadeIn" duration={300} style={{ flex: 1 }}>
                    <View
                        style={{
                            borderBottomWidth: 0.2,
                            borderColor: theme.mode.borderColor,
                        }}>
                        <View style={{ padding: SPACING.NORMAL }}>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}>
                                <View
                                    style={{
                                        width: RFPercentage(15),
                                        height: RFPercentage(15),
                                        alignSelf: 'center',
                                        borderWidth: 3,
                                        borderRadius: 100,
                                        padding: SPACING.SMALL,
                                        borderColor: theme.mode.borderColor,
                                    }}>
                                    <ImageComponent style={{ flex: 1 }} source={IMAGES.ologo} resizeMode="contain" />
                                </View>
                                <TextComponent style={{ fontSize: FONT_SIZE.XX_LARGE, paddingTop: SPACING.NORMAL }} type={FONT_TYPE.BOLD}>
                                    Omnex Software Systems
                                </TextComponent>
                                <View>
                                    <LabelValue
                                        {...{
                                            iconType: ICON_TYPE.Feather,
                                            iconName: 'globe',
                                            value: profileData?.CompanyUrl,
                                        }}
                                    />
                                    <LabelValue
                                        {...{
                                            iconType: ICON_TYPE.Feather,
                                            iconName: 'phone',
                                            value: profileData?.Phone,
                                        }}
                                    />
                                    <LabelValue
                                        {...{
                                            iconType: ICON_TYPE.Feather,
                                            iconName: 'map-pin',
                                            value: profileData?.Address,
                                        }}
                                    />
                                    <LabelValue
                                        {...{
                                            iconType: ICON_TYPE.Feather,
                                            iconName: 'link',
                                            value: appSettings?.serverUrl || '',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 0 }}>
                        {menus.map((menu, i) => (
                            <ProfileMenuButton key={i} {...{ navigation, menu }} />
                        ))}
                    </View>
                </Animatable.View>
                <ImageComponent
                    source={IMAGES.PSlogo}
                    resizeMode="contain"
                    style={{ height: RFPercentage(4), width: '100%', marginTop: SPACING.NORMAL }}
                />
                <View style={{ padding: SPACING.NORMAL, paddingBottom: 0 }}>
                    <GradientButton
                        {...{
                            loading,
                            onPress: handleLogout,
                        }}>
                        Logout
                    </GradientButton>
                </View>
                <TextComponent
                    color={COLORS.lightGrey}
                    style={{ alignSelf: 'center', paddingVertical: SPACING.SMALL }}
                    type={FONT_TYPE.BOLD}
                    fontSize={FONT_SIZE.SMALL}>
                    Version - {versionDetails?.appVersion}
                </TextComponent>
            </ScrollView>
        </Content>
    );
};

export default ProfileHomePresentational;
