import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';
import IconComponent from './icon-component';
import TextComponent from './text';

const CheckBox = ({ name, label, required, value, options, onChange, editable = true }) => {
    const { theme } = useTheme();

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                flex: 1,
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {options?.map(option => (
                    <TouchableOpacity
                        disabled={!editable}
                        onPress={() => onChange(name, option?.value)}
                        activeOpacity={0.8}
                        key={option?.value}
                        style={styles.container}>
                        <View style={[styles.checkBoxContainer, { borderColor: theme.colors.primaryThemeColor }]}>
                            {value === option?.value && (
                                <View style={[styles.selectedCheckBox, { backgroundColor: theme.colors.primaryThemeColor }]}>
                                    <IconComponent color={COLORS.white} type={ICON_TYPE.AntDesign} name="check" />
                                </View>
                            )}
                        </View>
                        <TextComponent type={value === option?.value ? FONT_TYPE.BOLD : FONT_TYPE.REGULAR} fontSize={FONT_SIZE.NORMAL}>
                            {option?.label}
                        </TextComponent>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: SPACING.SMALL,
        paddingHorizontal: 0,
        paddingRight: SPACING.NORMAL,
        flex: 1,
    },
    checkBoxContainer: {
        height: RFPercentage(3),
        width: RFPercentage(3),
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.NORMAL,
    },
    selectedCheckBox: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
});
