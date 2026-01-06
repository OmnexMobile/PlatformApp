import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';
import TextComponent from './text';

const RadioButton = ({ name, label, required, value, options, onChange, editable = true, noPadding = false }) => {
    
    const { theme } = useTheme();

    if ((options?.length || 0) < 1) return null;

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                // flex: 1,
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {options?.map(option => (
                    <TouchableOpacity
                        disabled={!editable}
                        onPress={() => onChange(name, option?.Value ?? option?.value)}
                        activeOpacity={0.8}
                        key={option?.Value ?? option?.value}
                        style={styles.container}>
                        <View style={[styles.radioCircle, { borderColor: theme.colors.primaryThemeColor }]}>
                            {value == (option?.Value ?? option?.value) && (
                                <View style={[styles.selectedRb, { backgroundColor: theme.colors.primaryThemeColor }]} />
                            )}
                        </View>
                        <TextComponent
                            type={value == (option?.Value ?? option?.value) ? FONT_TYPE.BOLD : FONT_TYPE.REGULAR}
                            fontSize={FONT_SIZE.NORMAL}>
                            {option?.Label || option?.label}
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
        paddingRight: SPACING.NORMAL,
        flex: 1,
    },
    radioCircle: {
        height: RFPercentage(2),
        width: RFPercentage(2),
        borderRadius: 100,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.NORMAL,
    },
    selectedRb: {
        width: RFPercentage(2),
        height: RFPercentage(2),
        borderRadius: 50,
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
});
