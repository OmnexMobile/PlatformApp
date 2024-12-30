import React, { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IconComponent, TextComponent } from 'components';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { FlashMessageManager } from 'react-native-flash-message';
import { RFPercentage } from 'helpers/utils';

const InputComponent = ({ defaultValue = '', placeholder = '', label = '', name = '', onChangeText, type = '', ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <View
            style={[
                {
                    ...(isPassword && { paddingRight: 0 }),
                    borderColor: isFocused ? COLORS.primaryLightThemeColor : COLORS.whiteGrey,
                },
                styles.inputContainer,
            ]}>
            <View style={{ flex: 1 }}>
                <TextComponent color={COLORS.textDark} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                <TextInput
                    {...{
                        style: styles.input,
                        placeholder,
                        onChangeText,
                        defaultValue,
                        ...(isPassword && { secureTextEntry: !showPassword }),
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                        onChangeText: text => onChangeText?.(name, text),
                        ...rest,
                    }}
                />
            </View>
            {isPassword ? (
                <View style={{ width: RFPercentage(5), alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <IconComponent size={FONT_SIZE.LARGE} type={ICON_TYPE.Feather} name={`eye${!showPassword ? '-off' : ''}`} />
                    </Pressable>
                </View>
            ) : null}
        </View>
    );
};

export default InputComponent;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: SPACING.NORMAL,
        // backgroundColor: COLORS.whiteGrey,
        // paddingHorizontal: SPACING.NORMAL,
        borderBottomWidth: 1.5,
        flexDirection: 'row',
    },
    input: {
        fontFamily: 'ProximaNova-Regular',
        fontSize: FONT_SIZE.LARGE,
        width: '100%',
        color: COLORS.themeBlack,
        padding: 0,
        paddingHorizontal: SPACING.SMALL,
    },
});
