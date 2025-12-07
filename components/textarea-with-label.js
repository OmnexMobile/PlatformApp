import React from 'react';
import { TextInput, View } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const TextAreaWithLabel = ({
    label,
    value,
    name,
    onChange,
    required = false,
    placeholder = '',
    inputStyle = {},
    editable = true,
    noPadding = false,
    handleBlur = true,
    numberOfLines = 5, // Default to 4 lines for textarea
    ...rest
}) => {
    const { theme } = useTheme();

    const handleInputChange = (name, text) => {
        onChange(name, text);
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
                marginBottom: SPACING.X_SMALL,
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
                }}>
                <TextInput
                    {...{
                        style: {
                            padding: SPACING.SMALL,
                            fontSize: FONT_SIZE.LARGE,
                            fontFamily: 'OpenSans-Regular',
                            color: theme.mode.textColor,
                            height: numberOfLines * 20, // Adjust height based on number of lines
                            textAlignVertical: 'top', // Start text from the top for textarea look
                            ...inputStyle,
                        },
                        multiline: true, // Set to true for TextArea
                        numberOfLines,
                        editable,
                        value,
                        onChangeText: text => handleInputChange(name, text),
                        ...(handleBlur && {
                            onBlur: handleInputBlur, // Handle trim on blur
                        }),
                        placeholderTextColor: COLORS.searchText,
                        placeholder: placeholder || `Enter ${label}`,
                        ...rest,
                    }}
                />
            </View>
        </View>
    );
};

export default TextAreaWithLabel;