import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { APP_VARIABLES, FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import TextComponent from './text';

const RadioButton = ({ name, label, required, value, options, onChange, editable = true }) => {
    const { theme } = useTheme();
    if ((options?.length || 0) < 1) return null;

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                flex: 1,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.X_SMALL,
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
            <View style={{ flexDirection: 'row'}}>
                {options?.map(option => (
                    <TouchableOpacity
                        disabled={!editable}
                        onPress={() => onChange(name, option?.value)}
                        activeOpacity={0.8}
                        key={option?.value}
                        style={styles.container}>
                        <View style={[styles.radioCircle, { borderColor: theme.colors.primaryThemeColor }]}>
                            {value === option?.value && <View style={[styles.selectedRb, { backgroundColor: theme.colors.primaryThemeColor }]} />}
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

export default RadioButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: SPACING.SMALL,
        paddingHorizontal: 0,
        flex: 1,
    },
    radioCircle: {
        height: RFPercentage(2),
        width: RFPercentage(2),
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.X_SMALL,
    },
    selectedRb: {
        width: RFPercentage(1),
        height: RFPercentage(1),
        borderRadius: 50,
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
});
