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

const RegisterPresentational = ({ navigation, handleChange, state, handleRegister, isRegistered, handleUnRegister, loading }) => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* need image with transparent background */}
            <ImageComponent style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
            <KeyboardAwareScrollViewComponent style={{ flex: 1, backgroundColor: COLORS.transparent }}>
                <AnimatableView
                    style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
                    delay={1000}
                    animationConfig={OPACITY_ANIMATION}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.goBack()}>
                        {/* <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => setSelectLanguageModal(true)}> */}
                        <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </TouchableOpacity>
                </AnimatableView>
                <AnimatableView
                    style={[styles.translateIcon1, { backgroundColor: theme.colors.primaryThemeColor }]}
                    delay={1000}
                    animationConfig={OPACITY_ANIMATION}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.navigate(ROUTES.HOME_FAB_VIEW)}>
                        <IconComponent name={'home'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </TouchableOpacity>
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
                    <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '100%' }} />
                </AnimatableView>
                <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={{ flex: 6 }}>
                    <LoginInput {...{ value: state?.serverUrl, label: strings.Server_Url, name: 'serverUrl', onChangeText: handleChange, placeholder:'Enter API URL', editable: !isRegistered }} />
                    <GradientButton
                        loading={loading}
                        disabled={!(state?.serverUrl?.length > 1)}
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
    translateIcon1: {
        position: 'absolute',
        top: RFPercentage(2),
        right: SPACING.NORMAL,
        backgroundColor: COLORS.primaryThemeColor,
        width: RFPercentage(4),
        height: RFPercentage(4),
        borderRadius: SPACING.SMALL,
        zIndex: 1,
    },
    icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
});



// import React from 'react';
// import { StyleSheet, View, TouchableOpacity } from 'react-native';
// import { RFPercentage } from 'react-native-responsive-fontsize';
// import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent } from 'components';
// import { IMAGES } from 'assets/images';
// import strings from 'config/localization';
// import { ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION } from 'constants/app-constant';
// import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
// import useTheme from 'theme/useTheme';
// import LoginInput from 'screens/problemSolver/containers/auth/login/components/login-input';

// const RegisterPresentational = ({ navigation, handleChange, state, handleRegister, isRegistered, handleUnRegister, loading }) => {
//     const { theme } = useTheme();
//     console.log("reach presentational-->", isRegistered)
//     return (
//         <View style={{ flex: 1, backgroundColor: COLORS.white }}>
//             {/* need image with transparent background */}
//             <ImageComponent style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }} source={IMAGES.loginBack} />
//             <KeyboardAwareScrollViewComponent style={{ flex: 1, backgroundColor: COLORS.transparent }}>
//                 <AnimatableView
//                     style={[styles.translateIcon, { backgroundColor: theme.colors.primaryThemeColor }]}
//                     delay={1000}
//                     animationConfig={OPACITY_ANIMATION}>
//                     <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.goBack()}>
//                         {/* <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => setSelectLanguageModal(true)}> */}
//                         <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
//                     </TouchableOpacity>
//                 </AnimatableView>
//                 <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={styles.topArea}>
//                     <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '100%' }} />
//                 </AnimatableView>
//                 <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={{ flex: 6 }}>
//                     <LoginInput {...{ value: state?.serverUrl, label: strings.Server_Url, name: 'serverUrl', onChangeText: handleChange, placeholder:'Enter API URL', editable: !isRegistered }} />
//                     <GradientButton
//                         loading={loading}
//                         disabled={!(state?.serverUrl?.length > 1)}
//                         // onPress={isRegistered ? handleUnRegister : handleRegister}>
//                         onPress={handleRegister}>
//                         {isRegistered ? strings.Unregister : strings.Register}
//                     </GradientButton>
//                 </AnimatableView>
//             </KeyboardAwareScrollViewComponent>
//         </View>
//     );
// };

// export default RegisterPresentational;

// const styles = StyleSheet.create({
//     translateIcon: {
//         position: 'absolute',
//         top: SPACING.NORMAL,
//         left: SPACING.NORMAL,
//         backgroundColor: COLORS.primaryThemeColor,
//         width: RFPercentage(4),
//         height: RFPercentage(4),
//         borderRadius: SPACING.SMALL,
//         zIndex: 1,
//     },
//     icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//     topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
// });
