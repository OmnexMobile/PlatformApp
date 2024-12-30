import React from 'react';
import { TextInput, View } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const InputWithLabel = ({
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
}) => {
    const { theme } = useTheme();
    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                backgroundColor: theme.mode.backgroundColor,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.XX_SMALL,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
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
                            padding: 0,
                            paddingVertical: SPACING.SMALL,
                            fontSize: FONT_SIZE.LARGE,
                            fontFamily: 'ProximaNova-Regular',
                            color: theme.mode.textColor,
                            ...inputStyle,
                        },
                        multiline,
                        numberOfLines,
                        editable,
                        value,
                        onChangeText: value => onChange(name, value),
                        placeholderTextColor: COLORS.searchText,
                        placeholder: placeholder || `Enter ${label}`,
                    }}
                />
            </View>
        </View>
    );
};
export default InputWithLabel;
