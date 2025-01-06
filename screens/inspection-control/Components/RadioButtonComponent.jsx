import { SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from 'theme/useTheme';

const RadioButtonComponent = ({lable='Radio Text',value='',onChange=()=>{}}) => {
    const { theme } = useTheme();
  return (
    <TouchableOpacity
        onPress={() => onChange(lable)}
        activeOpacity={0.8}
        style={styles.container}
    >
        <View style={[styles.radioCircle, { borderColor: theme.colors.primaryThemeColor }]}>
            {value === lable && <View style={[styles.selectedRb, { backgroundColor: theme.colors.primaryThemeColor }]} />}
        </View>
        <Text style={styles.radioText}>{lable}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioCircle: {
        height: RFPercentage(2.5),
        width: RFPercentage(2.5),
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.SMALL,
    },
    selectedRb: {
        width: RFPercentage(1.5),
        height: RFPercentage(1.5),
        borderRadius: 50,
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
    radioText:{
        fontFamily:'ProximaNova-Regular',
        fontSize:RFPercentage(2)
    }
});

export default RadioButtonComponent
