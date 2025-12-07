import React, { useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IconComponent } from 'components';
import { ICON_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const LoginInput = ({ placeholder = '', name = '', onChangeText, editable = true, type = '', ...rest }) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const [value, setValue] = useState('');

    return (
        <View
            style={[
                {
                    ...(isPassword && { paddingRight: 0 }),
                    borderColor: isFocused ? theme?.colors?.primaryThemeColor : COLORS.whiteGrey,
                },
                styles.inputContainer,
            ]}>
            <TextInput
                {...{
                    editable,
                    placeholder,
                    onChangeText,
                    placeholderTextColor: COLORS.grey,
                    selectionColor: COLORS.black,
                    keyboardAppearance: 'light',
                    autoCapitalize: false,
                    ...(isPassword && { secureTextEntry: !showPassword }),
                    style: [styles.input, value ? styles.inputFilled : null],
                    onFocus: () => setIsFocused(true),
                    onBlur: () => setIsFocused(false),
                    onChangeText: text => {
                        setValue(text);
                        onChangeText?.(name, text);
                    },
                    ...rest,
                }}
            />
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

export default LoginInput;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: SPACING.NORMAL,
        backgroundColor: COLORS.whiteGrey,
        paddingHorizontal: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
        borderWidth: 1.5,
        flexDirection: 'row',
        height: 50,
    },
    input: {
        fontFamily: 'OpenSans-Regular',
        fontSize: FONT_SIZE.LARGE,
        flex: 1,
        color: COLORS.black,
        fontWeight: '400',
    },
    inputFilled: {
        fontFamily: 'ProximaNova-Semibold',
        fontWeight: '600',
    },
});
