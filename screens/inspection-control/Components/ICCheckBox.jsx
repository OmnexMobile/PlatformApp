import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ICCheckBox = ({ isChecked = false, label = 'label', onChange = () => {}, fontSize = RFPercentage(2), fontFamily = 'OpenSans-Regular' }) => {
    return (
        <TouchableOpacity style={[styles.box]} activeOpacity={1} onPress={onChange}>
            <TouchableOpacity
                style={[
                    styles.container,
                    { backgroundColor: isChecked ? COLORS.apptheme : COLORS.white, borderColor: COLORS.apptheme, borderWidth: isChecked ? 1 : 2 },
                ]}
                onPress={onChange}>
                {isChecked && <Icon name="check" size={15} color={COLORS.white} />}
            </TouchableOpacity>
            <Text style={[styles.radioText, { fontSize: fontSize,fontFamily:fontFamily }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: RFPercentage(2.5),
        width: RFPercentage(2.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioText: {
        marginLeft: 10,
        color: COLORS.ictextBlack,
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ICCheckBox;
