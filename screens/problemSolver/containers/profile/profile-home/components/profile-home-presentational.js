import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextComponent, GradientButton, ImageComponent, IconComponent, Content } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { IMAGES } from 'assets/images';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import ProfileMenuButton from './profile-menu-button';

const LabelValue = React.memo(({ iconType, iconName, value }) => (
    <View style={styles.labelContainer}>
        <IconComponent color={COLORS.searchText} type={iconType} name={iconName} />
        <TextComponent style={styles.labelText} fontSize={FONT_SIZE.SMALL}>
            {value}
        </TextComponent>
    </View>
));

const ProfileHomePresentational = ({ menus, navigation, versionDetails, handleLogout, profileData, loading }) => {
    const { theme } = useTheme();
    const { appSettings } = useAppContext();
    const insets = useSafeAreaInsets();
    const headerStyle = useMemo(() => ({
        top: insets.top + 10,
        color: theme.colors.primaryThemeColor,
    }), [insets.top, theme.colors.primaryThemeColor]);

    return (
        
        <Content noPadding>
            {  console.log('current appSettings', appSettings)}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.iconButton, { left: SPACING.NORMAL, top: headerStyle.top }]}>
                <IconComponent name="arrowleft" type={ICON_TYPE.AntDesign} color={headerStyle.color} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.SETTINGS)}
                style={[styles.iconButton, { right: SPACING.NORMAL, top: headerStyle.top }]}>
                <IconComponent name="setting" type={ICON_TYPE.AntDesign} color={headerStyle.color} size={25} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animatable.View animation="fadeIn" duration={300} style={styles.container}>
                    <View style={[styles.section, { borderColor: theme.mode.borderColor }]}>
                        <View style={styles.profileInfo}>
                            <View style={[styles.profileImageContainer, { borderColor: theme.mode.borderColor }]}>
                                <ImageComponent style={styles.profileImage} source={IMAGES.ologo} resizeMode="contain" />
                            </View>
                            <TextComponent style={styles.companyName} type={FONT_TYPE.BOLD}>
                                Omnex Software Systems
                            </TextComponent>
                            <View>
                                <LabelValue iconType={ICON_TYPE.Feather} iconName="globe" value={profileData?.CompanyUrl} />
                                <LabelValue iconType={ICON_TYPE.Feather} iconName="phone" value={profileData?.Phone} />
                                <LabelValue iconType={ICON_TYPE.Feather} iconName="map-pin" value={profileData?.Address} />
                                <LabelValue iconType={ICON_TYPE.Feather} iconName="link" value={appSettings?.serverUrl || ''} />
                            </View>
                        </View>
                    </View>
                    <View>
                        {menus.map((menu, i) => (
                            <ProfileMenuButton key={i} {...{ navigation, menu }} />
                        ))}
                    </View>
                </Animatable.View>
                <ImageComponent
                    source={IMAGES.PSlogo}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <View style={styles.buttonContainer}>
                    <GradientButton loading={loading} onPress={handleLogout}>
                        Logout
                    </GradientButton>
                </View>
                <TextComponent color={COLORS.lightGrey} style={styles.versionText} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                    Version - {versionDetails?.appVersion}
                </TextComponent>
            </ScrollView>
        </Content>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        position: 'absolute',
        zIndex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: SPACING.NORMAL,
    },
    container: {
        flex: 1,
    },
    section: {
        borderBottomWidth: 0.2,
    },
    profileInfo: {
        padding: SPACING.NORMAL,
    },
    profileImageContainer: {
        width: RFPercentage(15),
        height: RFPercentage(15),
        alignSelf: 'center',
        borderWidth: 3,
        borderRadius: 100,
        padding: SPACING.SMALL,
    },
    profileImage: {
        flex: 1,
    },
    companyName: {
        fontSize: FONT_SIZE.XX_LARGE,
        paddingTop: SPACING.NORMAL,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: SPACING.SMALL,
    },
    labelText: {
        paddingLeft: SPACING.SMALL,
        color: COLORS.searchText,
    },
    logo: {
        height: RFPercentage(4),
        width: '100%',
        marginTop: SPACING.NORMAL,
    },
    buttonContainer: {
        padding: SPACING.NORMAL,
        paddingBottom: 0,
    },
    versionText: {
        alignSelf: 'center',
        paddingVertical: SPACING.SMALL,
    },
});

export default React.memo(ProfileHomePresentational);