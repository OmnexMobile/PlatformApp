import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent } from 'components';
import { IMAGES } from 'assets/images';
import strings from 'config/localization';
import { ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from 'screens/auth/login/components/login-input';

const RegisterPresentational = ({ navigation, handleChange, state, handleRegister, isRegistered, handleUnRegister, loading }) => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: useSafeAreaInsets().top }}>
            {/* need image with transparent background */}
            <ImageComponent style={{ width: '100%', height: '105%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
            <KeyboardAwareScrollViewComponent style={{ backgroundColor: COLORS.transparent }}>
                <View
                    style={{
                        flex: 5,
                    }}>
                    <AnimatableView
                        style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                        delay={1000}
                        animationConfig={OPACITY_ANIMATION}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.goBack()}>
                            <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                        </TouchableOpacity>
                    </AnimatableView>
                    <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                        <ImageComponent
                            source={IMAGES.omnexLogo}
                            resizeMode="contain"
                            style={{ height: RFPercentage(8), width: '100%', marginTop: SPACING.NORMAL }}
                        />
                        <AnimatableView
                            animationConfig={OPACITY_TRANSLATE_Y_ANIMATION}
                            delay={500}
                            style={{
                                width: '100%',
                                paddingTop: SPACING.LARGE,
                            }}>
                            <LoginInput
                                {...{
                                    value: state?.serverUrl,
                                    label: strings.Server_Url,
                                    name: 'serverUrl',
                                    onChangeText: handleChange,
                                    placeholder: 'Enter API URL',
                                    editable: !isRegistered,
                                }}
                            />
                            <GradientButton
                                loading={loading}
                                disabled={!(state?.serverUrl?.length > 1)}
                                onPress={isRegistered ? handleUnRegister : handleRegister}>
                                {isRegistered ? strings.Unregister : strings.Register}
                            </GradientButton>
                        </AnimatableView>
                    </AnimatableView>
                </View>
                <View
                    style={{
                        flex: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ImageComponent source={IMAGES.PSlogo} resizeMode="contain" style={{ height: RFPercentage(4), width: '100%' }} />
                </View>
            </KeyboardAwareScrollViewComponent>
        </View>
    );
};

export default RegisterPresentational;

const styles = StyleSheet.create({
    translateIcon: {
        backgroundColor: COLORS.primaryThemeColor,
        width: RFPercentage(4),
        height: RFPercentage(4),
        borderRadius: SPACING.SMALL,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    icon: { alignItems: 'center', justifyContent: 'center' },
    topArea: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.NORMAL },
});
