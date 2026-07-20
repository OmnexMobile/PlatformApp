import React, { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IconComponent, TextComponent } from 'components';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { FlashMessageManager } from 'react-native-flash-message';
import { RFPercentage } from 'helpers/utils';

const InputComponent = ({
    defaultValue = '',
    placeholder = '',
    required = false,
    error = false,
    label = '',
    name = '',
    onChangeText,
    type = '',
    inputRef,
    containerStyle = {},
    inputStyle = {},
    labelStyle = {},
    placeholderTextColor = COLORS.searchText,
    focusBorderColor = COLORS.primaryDarkThemeColor,
    blurBorderColor = COLORS.whiteGrey,
    errorBorderColor = COLORS.ERROR,
    style: textInputStyle,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <View
            style={[
                {
                    ...(isPassword && { paddingRight: 0 }),
                    borderColor: error ? errorBorderColor : isFocused ? focusBorderColor : blurBorderColor,
                },
                styles.inputContainer,
                containerStyle,
            ]}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.SMALL }}>
                    <TextComponent style={[{ fontSize: FONT_SIZE.SMALL }, labelStyle]} type={FONT_TYPE.BOLD} color={error ? COLORS.ERROR : null}>
                        {label}
                    </TextComponent>
                    {required && (
                        <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                            *
                        </TextComponent>
                    )}
                </View>

                <TextInput
                    {...{
                        ref: inputRef,
                        style: [styles.input, inputStyle, textInputStyle],
                        placeholder,
                        placeholderTextColor,
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
        borderBottomWidth: .5,
        flexDirection: 'row',
        marginLeft: 10,
    },
    input: {
        fontFamily: 'OpenSans-Regular',
        fontSize: FONT_SIZE.SMALL,
        width: '100%',
        color: COLORS.themeBlack,
        padding: 0,
        paddingHorizontal: SPACING.SMALL,
    },
});
