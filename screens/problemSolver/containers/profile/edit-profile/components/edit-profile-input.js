import React from 'react';
import { View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { ICON_TYPE } from 'constants/app-constant';
import { IconComponent, TextComponent, InputWithLabel } from 'components';

const EditProfileInput = ({
    editable = true,
    defaultValue = '',
    label = '',
    name = '',
    handleRemove,
    handleChange,
    value,
    helpText = null,
    placeholder = '',
    inputStyle = {},
    ...rest
}) => (
    <View
        style={{
            // borderBottomWidth: 1,
            borderColor: COLORS.whiteGrey,
            padding: SPACING.NORMAL,
            paddingBottom: 0,
            ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
        }}>
        {label ? <TextComponent style={{ fontSize: FONT_SIZE.SMALL }}>{label}</TextComponent> : null}
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
            <InputWithLabel
                {...{
                    value,
                    defaultValue,
                    editable,
                    placeholder: placeholder ? placeholder : label,
                    style: { fontSize: FONT_SIZE.LARGE, width: '100%', color: COLORS.themeBlack, ...inputStyle },
                    onChangeText: text => handleChange?.(name, text),
                    ...rest,
                }}
            />
            {value && editable && handleRemove ? (
                <IconComponent
                    onPress={() => value && handleRemove?.(name)}
                    color={COLORS.primaryLightThemeColor}
                    size={13}
                    type={ICON_TYPE.AntDesign}
                    name="closecircle"
                />
            ) : null}
        </View>
        {helpText ? (
            <TextComponent color={COLORS.ALERT} style={{ marginBottom: SPACING.NORMAL }}>
                {helpText}
            </TextComponent>
        ) : null}
    </View>
);

export default EditProfileInput;
