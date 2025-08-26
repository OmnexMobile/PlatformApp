import { COLORS, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from 'theme/useTheme';

const RadioButtonComponent = ({lable='Radio Text',value='',onChange=()=>{},obj={}}) => {
    const { theme } = useTheme();
  return (
    <TouchableOpacity
        onPress={() => onChange(obj)}
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
        height: 25,
        width: 25,
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.SMALL,
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
    radioText:{
        fontFamily:'OpenSans-Regular',
        fontSize:19,
        color:COLORS.ictextBlack
    }
});

export default RadioButtonComponent
