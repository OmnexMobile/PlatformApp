import { COLORS, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from 'theme/useTheme';

const RadioButtonComponent = ({
    lable = 'Radio Text',
    value = '',
    staticValue = '',
    onChange = () => {},
    obj = {},
    size = 25,
    selectedSize = 15,
    textSize = 19,
}) => {
    console.log(value,lable,staticValue, value == lable, staticValue == value,'valuevalue')
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => onChange(obj)} activeOpacity={0.8} style={styles.container}>
            <View style={[styles.radioCircle, { borderColor: theme.colors.primaryThemeColor, height: size, width: size }]}>
                {(value == lable || staticValue == value) && (
                    <View
                        style={[styles.selectedRb, { backgroundColor: theme.colors.primaryThemeColor, width: selectedSize, height: selectedSize }]}
                    />
                )}
            </View>
            <Text style={[styles.radioText, { fontSize: textSize, fontFamily: 'OpenSans-Regular' }]}>{lable}</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioCircle: {
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.SMALL,
    },
    selectedRb: {
        borderRadius: 50,
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',

        color: COLORS.ictextBlack,
    },
});

export default RadioButtonComponent;
