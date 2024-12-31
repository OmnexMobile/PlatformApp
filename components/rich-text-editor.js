import React from 'react';
import { ScrollView, View } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const RichTextEditor = ({
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
    keyboardType = '',
    ...rest
}) => {
    const { theme } = useTheme();

    const handleEditorChange = text => {
        onChange(name, text);
    };

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                backgroundColor: theme.mode.backgroundColor,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.X_SMALL,
                paddingHorizontal: 10,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                ...(noPadding && { padding: 0 }),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
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
                <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <RichEditor
                        style={{
                            // padding: 0,
                            // paddingVertical: SPACING.SMALL,
                            fontSize: FONT_SIZE.LARGE,
                            fontFamily: 'ProximaNova-Regular',
                            color: theme.mode.textColor,
                            // ...inputStyle,
                            ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                        }}
                        editorStyle={{
                            placeholderColor: COLORS.searchText,
                            // backgroundColor: 'red',
                        }}
                        // multiline={multiline}
                        // numberOfLines={numberOfLines}
                        // editable={editable}
                        disabled={!editable}
                        {...(keyboardType && { keyboardType })}
                        initialContentHTML={value}
                        onChange={handleEditorChange}
                        placeholderTextColor={COLORS.searchText}
                        placeholder={placeholder || `Enter ${label}`}
                        {...rest}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

export default RichTextEditor;
