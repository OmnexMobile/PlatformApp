import React from 'react';
import { View, ActivityIndicator, Platform, Keyboard } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const ButtonComponent = props => {
    const {
        children,
        style,
        loading,
        onPress,
        icon,
        round,
        borderRadius = SPACING.SMALL,
        fontColor = COLORS.white,
        disabled = false,
        outline = false,
        danger = false,
        success = false,
        textStyle = {},
    } = props;
    const { theme } = useTheme();

    const handlePress = () => {
        if (!loading) {
            Keyboard.dismiss();
            onPress?.();
        }
    };
    return (
        <Ripple
            {...{ disabled }}
            rippleContainerBorderRadius={borderRadius}
            rippleColor={loading ? COLORS.transparent : COLORS.white}
            rippleSize={180}
            onPress={handlePress}
            style={[
                {
                    backgroundColor:
                        loading || disabled ? COLORS.accordionBorderColor : (style && style.backgroundColor) || theme.colors.primaryThemeColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: borderRadius,
                    paddingHorizontal: RFPercentage(2),
                    borderColor: loading || disabled ? COLORS.accordionBorderColor : theme.colors.primaryThemeColor,
                    // borderWidth: 2,
                    // alignSelf: 'center',
                    // height: (style && style.height) || RFPercentage(Platform.OS === 'android' ? 6 : 6),
                    height: 50,
                },
                {
                    ...style,
                    ...(outline && { backgroundColor: COLORS.white, borderColor: theme.colors.primaryThemeColor, ...style }),
                    ...(danger && { backgroundColor: COLORS.red, borderColor: COLORS.red }),
                    ...(success && { backgroundColor: COLORS.success, borderColor: COLORS.success }),
                },
            ]}>
            <View
                style={[
                    {
                        backgroundColor: COLORS.transparent,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        backgroundColor: `${loading ? COLORS.transparent : COLORS.transparent}`,
                        borderRadius: round ? 20 : 0,
                    },
                ]}>
                <View style={{ flex: 1 }}>{/* <TextComponent>{''}</TextComponent> */}</View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flex: 8,
                    }}>
                    <View style={{ flex: 8, alignItems: 'center' }}>
                        <TextComponent
                            type={FONT_TYPE.BOLD}
                            style={{
                                fontSize: (style && style.fontSize) || SPACING.NORMAL,
                                color: (style && style.color) || COLORS.white,
                                ...textStyle,
                                ...(outline && { color: theme.colors.primaryThemeColor, ...textStyle }),
                            }}>
                            {children}
                        </TextComponent>
                    </View>

                    {!loading && icon && <Feather style={{ fontSize: 25 }} name="arrow-right" />}
                </View>
                <View style={{ flex: 1 }}>
                    {loading && <ActivityIndicator style={{ paddingLeft: 10 }} color={COLORS.white} size="small"></ActivityIndicator>}
                </View>
            </View>
        </Ripple>
    );
};

export default ButtonComponent;
