import React from 'react';
import { TextInput, View } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const NumberInputWithLabel = ({
    label,
    value,
    name,
    onChange,
    required = false,
    placeholder = '',
    inputStyle = {},
    multiline = false,
    numberOfLines = 1,
    editable = true,
    noPadding = false,
    keyboardType = 'numeric',
    handleBlur = true,
    ...rest
}) => {
    const { theme } = useTheme();

    const handleInputChange = (name, text) => {
        // Allow only numbers
        const finalText = text.replace(/[^0-9]/g, '');
        onChange?.(name, finalText);
    };

    const handleInputBlur = () => {
        onChange(name, value?.trim());
    };

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                backgroundColor: theme.mode.backgroundColor,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.SMALL,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                ...(noPadding && { padding: 0 }),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <View
                style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.whiteGrey,
                    marginTop: SPACING.X_SMALL,
                }}>
                <TextInput
                    {...{
                        style: {
                            padding: 0,
                            paddingVertical: SPACING.SMALL,
                            fontSize: FONT_SIZE.LARGE,
                            fontFamily: 'OpenSans-Regular',
                            color: theme.mode.textColor,
                            ...inputStyle,
                        },
                        multiline,
                        numberOfLines,
                        editable,
                        keyboardType: 'numeric',
                        value,
                        placeholderTextColor: COLORS.searchText,
                        placeholder: placeholder || `Enter ${label}`,
                        ...rest,
                        ...(handleBlur &&  {
                            onBlur: handleInputBlur, // Handle trim on blur
                        }),
                    }}
                    onChangeText={text => handleInputChange(name, text)}
                />
            </View>
        </View>
    );
};
export default NumberInputWithLabel;
