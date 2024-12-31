import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { AnimatableView, GradientButton, IconComponent, ImageComponent, KeyboardAwareScrollViewComponent, RadioButton } from 'components';
import { IMAGES } from 'assets/images';
import strings from 'config/localization';
import { ICON_TYPE, OPACITY_ANIMATION, OPACITY_TRANSLATE_Y_ANIMATION } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import LoginInput from 'screens/auth/login/components/login-input';
import { colors } from 'theme/colors';

const RegisterPresentational = ({ navigation, handleChange, state, handleRegister, isRegistered, handleUnRegister, loading }) => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: colors.blue.primaryThemeColor, paddingTop: useSafeAreaInsets().top }}>
            <KeyboardAwareScrollViewComponent >
                <View>
                    <AnimatableView
                        style={[styles.translateIcon]}
                        delay={1000}
                        animationConfig={OPACITY_ANIMATION}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={() => navigation.goBack()}>
                            <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.X_LARGE} />
                        </TouchableOpacity>
                    </AnimatableView>
                    <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} style={[styles.topArea]}>
                        <AnimatableView
                            animationConfig={OPACITY_TRANSLATE_Y_ANIMATION}
                            delay={500}
                            style={{
                                width: '100%',
                            }}>
                            <View style={[styles.boxModal]}>
                                <ImageComponent resizeMode='contain'  source={IMAGES.registerLogo} style={[styles.boxImage]}/>
                                <Text style={[styles.headerText]}>Server URL</Text>
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
                                <View style={{height:70}}>
                                    <RadioButton 
                                    label='Choose the default option to render forms'
                                    editable 
                                    name='Expand' 
                                    value='Expand' 
                                    options={[
                                        {
                                            label: 'Expand',
                                            value: 'Expand',
                                        },
                                        {
                                            label: 'Collapse',
                                            value: 'Collapse',
                                        }
                                    ]}
                                    onChange={(val)=>{
                                        console.log(val,'val')
                                    }}
                                    />
                                </View>
                            </View>
                        </AnimatableView>
                    </AnimatableView>
                </View>
            </KeyboardAwareScrollViewComponent>
        </View>
    );
};

export default RegisterPresentational;

const styles = StyleSheet.create({
    translateIcon: {
        width: RFPercentage(4),
        height: RFPercentage(4),
        borderRadius: SPACING.SMALL,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    icon: { alignItems: 'center', justifyContent: 'center' },
    topArea: { alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.NORMAL },
    boxModal:{
        backgroundColor:COLORS.white,
        paddingVertical:32,
        borderRadius:30,
        paddingHorizontal:15
    },
    boxImage:{
        height:47,
        width:159,
        alignSelf:'center',
        marginVertical:30,
    },
    headerText:{
        fontSize:16,
        color:COLORS.black,
        fontFamily:'ProximaNova-Bold',
        paddingBottom:10,
        marginLeft:3
    },
    bottomText:{
        fontSize:16,
        color:COLORS.black,
        fontFamily:'ProximaNova-Regular',
        paddingTop:15,
        marginLeft:3
    }
});
