import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent } from 'components';
import { IMAGES } from 'assets/images';
import strings from 'config/localization';
import { ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION,ROUTES} from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from 'screens/auth/login/components/login-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RegisterPresentational = ({ navigation, handleChange, handleRegister, state, isRegistered, handleUnRegister, loading, getDeviceStatus }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const topInset = insets.top;
    const bottomInset = insets.bottom;
		console.log('editable check-->',isRegistered, '--',  !isRegistered, state?.globalServerURL,'---', state?.serverUrl)
		const currentURL = state?.serverUrl ? state?.serverUrl : state?.globalServerURL ;
        console.log('state?.serverUrl register--->', state?.serverUrl, 'state?.globalServerURL--->', state?.globalServerURL)
		console.log('currentURL--->', currentURL)
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingTop: topInset,
                paddingBottom: bottomInset,
            }}>
             {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }        
            {/* need image with transparent background */}
            {/* {isRegistered ? null : <ImageComponent style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />} */}
            <KeyboardAwareScrollViewComponent style={{ flex: 1, backgroundColor: COLORS.transparent }}>
               {isRegistered ? <AnimatableView
                    style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                    delay={1000}
                    animationConfig={OPACITY_ANIMATION}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.navigate(ROUTES.GLOBAL_LOGIN)}>
                        {/* <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => setSelectLanguageModal(true)}> */}
                        <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </TouchableOpacity>
                </AnimatableView> : null}
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                    <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '100%' }} />
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={{ flex: 6 }}>
                    <LoginInput
                        {...{
                            value: currentURL,
                            label: strings.Server_Url,
                            name: 'serverUrl',
                            onChangeText: handleChange,
                            placeholder: 'Enter API URL',
                            editable: true,
                        }}
                    />
                        <GradientButton
                            loading={loading}
                            disabled={isRegistered ? false : !(currentURL?.length > 1)}
                            onPress={isRegistered ? handleUnRegister : handleRegister}>
                            {isRegistered ? strings.Unregister : strings.Register}
                        </GradientButton>
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
    topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
});
