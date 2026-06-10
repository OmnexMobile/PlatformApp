import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BUTTON_ICONS, FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import TextComponent from './text';

const ICON_SLOT_WIDTH = RFPercentage(4.5);

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
    hideIcon = false,
    ...rest
}) => {
    const { theme } = useTheme();
    const primary = theme?.colors?.primaryThemeColor || COLORS.primaryThemeColor;
    const primaryLight = theme?.colors?.primaryLightThemeColor || COLORS.primaryLightThemeColor;
    const defaultGradientColors = theme?.colors?.buttonGradientColors || [primaryLight, primary];
    const isInactive = disabled || loading;

    const handlePress = () => {
        if (!loading && !disabled) {
            Keyboard.dismiss();
            onPress?.();
        }
    };

    const gradientColors = isInactive
        ? ['#B8CCE8', '#9BB5DC']
        : danger
          ? [COLORS.ERROR, COLORS.red]
          : colors || defaultGradientColors;

    const labelColor = isInactive ? '#2E4A7A' : COLORS.white;

    return (
        <TouchableOpacity
            {...{
                disabled: isInactive,
                activeOpacity: isInactive ? 1 : 0.88,
                onPress: handlePress,
                ...rest,
                style: [styles.touchable, isInactive && styles.touchableDisabled, style],
            }}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={gradientColors}
                style={[styles.button, isInactive && styles.buttonDisabled]}>
                <View style={styles.contentRow}>
                    {!hideIcon ? <View style={styles.iconSlot} /> : null}
                    <View style={styles.labelWrap}>
                        {loading ? (
                            <ActivityIndicator color={labelColor} size="small" />
                        ) : (
                            <TextComponent
                                fontSize={FONT_SIZE.NORMAL}
                                type={FONT_TYPE.BOLD}
                                numberOfLines={1}
                                style={[{ color: labelColor, textAlign: 'center' }, fontStyle]}>
                                {children}
                            </TextComponent>
                        )}
                    </View>
                    {!hideIcon ? (
                        <View style={styles.iconSlot}>
                            {!loading && icon && !isInactive ? (
                                <IconComponent
                                    color={COLORS.white}
                                    type={ICON_TYPE.AntDesign}
                                    size={FONT_SIZE.LARGE}
                                    name={icon}
                                />
                            ) : null}
                        </View>
                    ) : null}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
    },
    touchableDisabled: {
        opacity: 0.92,
    },
    button: {
        width: '100%',
        minHeight: RFPercentage(6.5),
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#123C95',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    contentRow: {
        width: '100%',
        minHeight: RFPercentage(6.5),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.SMALL,
        paddingVertical: SPACING.SMALL,
    },
    iconSlot: {
        width: ICON_SLOT_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    labelWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.X_SMALL,
    },
});
