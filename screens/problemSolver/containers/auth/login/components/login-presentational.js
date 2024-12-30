import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { IMAGES } from 'assets/images';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent, TextComponent } from 'components';
import SelectLanguage from 'components/select-language';
import strings from 'config/localization';
import { FONT_TYPE, ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from './login-input';

import { useAppContext } from 'contexts/app-context';

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

    const { appSettings, handleAppSetting } = useAppContext();
    console.log('isRegistered--->', isRegistered, !isRegistered,  'appSettings?.serverUrl', appSettings?.serverUrl)
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* need image with transparent background */}
            <ImageComponent style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
            <KeyboardAwareScrollViewComponent keyboardShouldPersistTaps="always" style={{ flex: 1, backgroundColor: COLORS.transparent }}>
                <AnimatableView
                    style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                    delay={1000}
                    animationConfig={OPACITY_ANIMATION}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.navigate(ROUTES.REGISTER_PS)}>
                        {/* <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => setSelectLanguageModal(true)}> */}
                        <IconComponent name={'setting'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </TouchableOpacity>
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                    <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '100%' }} />
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={{ flex: 6 }}>
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
                <SelectLanguage modalVisible={selectLanguageModal} onRequestClose={() => setSelectLanguageModal(false)} />
            </KeyboardAwareScrollViewComponent>
            {!isRegistered ? (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate(ROUTES.REGISTER_PS)}
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
        position: 'absolute',
        top: SPACING.NORMAL,
        right: SPACING.NORMAL,
        width: RFPercentage(4),
        height: RFPercentage(4),
        borderRadius: SPACING.SMALL,
        zIndex: 1,
    },
    icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
});
