import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from 'assets/images';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent, TextComponent } from 'components';
import SelectLanguage from 'components/select-language';
import strings from 'config/localization';
import { FONT_TYPE, ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from './login-input';

const LoginPresentational = ({
    selectLanguageModal,
    setSelectLanguageModal,
    handleInputChange,
    handleSubmit,
    loginDetails,
    navigation,
    isRegistered,
}) => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: useSafeAreaInsets().top }}>
            {/* need image with transparent background */}
            <ImageComponent style={{ width: '100%', height: '105%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
            <KeyboardAwareScrollViewComponent keyboardShouldPersistTaps="always" style={{ flex: 1, backgroundColor: COLORS.transparent }}>
                <View
                    style={{
                        flex: 5,
                    }}>
                    <AnimatableView
                        style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                        delay={1000}
                        animationConfig={OPACITY_ANIMATION}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                            {/* <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => setSelectLanguageModal(true)}> */}
                            <IconComponent name={'setting'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                        </TouchableOpacity>
                    </AnimatableView>
                    <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                        <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(8), width: '100%' }} />
                        <AnimatableView
                            animationConfig={OPACITY_TRANSLATE_Y_ANIMATION}
                            delay={500}
                            style={{
                                width: '100%',
                            }}>
                            <LoginInput {...{ placeholder: strings.Username, name: 'username', onChangeText: handleInputChange }} />
                            <LoginInput
                                {...{
                                    placeholder: strings.Password,
                                    name: 'password',
                                    type: 'password',
                                    onChangeText: handleInputChange,
                                    returnKeyType: 'done',
                                    onSubmitEditing: () => loginDetails?.username?.length > 1 && loginDetails?.password?.length > 1 && handleSubmit(),
                                }}
                            />
                            <GradientButton
                                loading={loginDetails?.loggingIn}
                                disabled={!(loginDetails?.username?.length > 1 && loginDetails?.password?.length > 1)}
                                onPress={handleSubmit}>
                                {strings.Login}
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
                <SelectLanguage modalVisible={selectLanguageModal} onRequestClose={() => setSelectLanguageModal(false)} />
            </KeyboardAwareScrollViewComponent>
            {!isRegistered ? (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate(ROUTES.REGISTER)}
                    style={{
                        backgroundColor: COLORS.red,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: SPACING.NORMAL,
                        margin: SPACING.NORMAL,
                        borderRadius: SPACING.SMALL,
                    }}>
                    <View style={{ paddingRight: SPACING.SMALL }}>
                        <IconComponent color={COLORS.white} name="infocirlceo" type={ICON_TYPE.AntDesign} />
                    </View>
                    <View>
                        <TextComponent color={COLORS.white} type={FONT_TYPE.BOLD}>
                            Please Register API URL to Login.
                        </TextComponent>
                        <TextComponent color={COLORS.white} fontSize={FONT_SIZE.SMALL}>
                            Click here to Register.
                        </TextComponent>
                    </View>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

export default LoginPresentational;

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
