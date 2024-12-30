import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { BUTTON_ICONS, FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import TextComponent from './text';

const GradientButton = ({
    children,
    onPress,
    style = {},
    fontStyle = {},
    loading = false,
    disabled = false,
    icon = BUTTON_ICONS.right,
    danger = false,
    colors = null,
    ...rest
}) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity keyboardShouldPersistTaps={'always'}
            {...{
                disabled: disabled || loading,
                activeOpacity: 1,
                onPress,
                ...rest,
                style,
            }}>
            <LinearGradient
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={
                    disabled || loading
                        ? [COLORS.whiteGrey, COLORS.lightGrey]
                        : danger
                        ? [COLORS.ERROR, COLORS.red]
                        : [theme.colors.primaryLightThemeColor, theme.colors.primaryThemeColor]
                }
                style={[styles.button]}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 8, alignItems: 'center' }}>
                    <TextComponent
                        type={FONT_TYPE.BOLD}
                        style={[
                            {
                                color: COLORS.white,
                            },
                            fontStyle,
                        ]}>
                        {children}
                    </TextComponent>
                </View>
                <View style={ Platform.OS === 'ios' ? { flex: 1, alignItems: 'flex-end' } : null }>
                    {!loading && icon && (
                        <IconComponent color={COLORS.white} type={ICON_TYPE.AntDesign} style={[{ fontSize: 25 }, fontStyle]} name={icon} />
                    )}
                    {loading && <ActivityIndicator style={{ paddingLeft: 10 }} color={COLORS.white} size="small"></ActivityIndicator>}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        flexDirection: 'row',
        borderRadius: SPACING.SMALL,
        paddingHorizontal: SPACING.NORMAL,
    },
});
