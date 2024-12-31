import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent } from 'components';
import { IMAGES } from 'assets/images';
import strings from 'config/localization';
import { ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from 'screens/auth/login/components/login-input';
import { useNavigation } from '@react-navigation/native';
import { Images } from 'screens/auditPro/Themes';
import ResponsiveImage from 'react-native-responsive-image';


const RegisterPresentational = ({ navigation, handleChange, state, handleSubmit, isRegistered, handleUnRegistered }) => {
    const { theme } = useTheme();
    console.log('CURRENT_PAGE---->', 'register-presentational')
    const navigations = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* need image with transparent background */}
            <ImageComponent style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
            <KeyboardAwareScrollViewComponent keyboardShouldPersistTaps='handled' style={{ flex: 1, backgroundColor: COLORS.transparent }}>
                {/* <AnimatableView
                    style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                    delay={1000}
                    animationConfig={OPACITY_ANIMATION}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.goBack()}>
                        <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </TouchableOpacity>
                </AnimatableView> */}
                <TouchableOpacity
                  onPress={() => navigations.navigate(ROUTES.LOGINUISCREEN)}
                  style={styles.backlogo}
                  >
                  {/* <Icon name="angle-left" size={30} color="#00C3EA" /> */}
                  <IconComponent
                              name={'arrowleft'}
                              type={ICON_TYPE.AntDesign}
                              // color={theme.colors.primaryThemeColor}
                              color="#00C3EA"
                              size={25}
                          />
                </TouchableOpacity>

                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                    <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '80%' }} />
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={{ flex: 6 }}>
                    <LoginInput {...{ value: state?.serverUrl, label: strings.Server_Url, name: 'serverUrl', onChangeText: handleChange, placeholder:'Enter API URL', editable: !isRegistered }} />
                    <GradientButton
                        // loading={state?.loggingIn}
                        disabled={!(state?.serverUrl?.length > 1)}
                        onPress={isRegistered ? handleUnRegistered : handleSubmit}>
                        {isRegistered ? strings.Unregister : strings.Register}
                    </GradientButton>
                    <View style={styles.logoBox}>
                      <ResponsiveImage
                        source={Images.auditPro}
                        initWidth="160"
                        initHeight="35"
                      />
                    </View>
                </AnimatableView>
            </KeyboardAwareScrollViewComponent>
        </View>
    );
};

export default RegisterPresentational;

const styles = StyleSheet.create({
    translateIcon: {
        position: 'absolute',
        top: SPACING.NORMAL,
        left: SPACING.NORMAL,
        backgroundColor: COLORS.primaryThemeColor,
        width: RFPercentage(4),
        height: RFPercentage(4),
        borderRadius: SPACING.SMALL,
        zIndex: 1,
    },
    icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    // topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
    topArea: { flex: 3, alignItems: 'center', justifyContent: 'center' },
});
