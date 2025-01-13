import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const InputBoxWithHeader = ({ title = 'Title' }) => {
    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerText]}>{title}</Text>
            <TextInput style={[styles.inputBox]}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
    },
    inputBox:{
        borderWidth:StyleSheet.hairlineWidth,
        height:40,
        borderRadius:5,
        borderColor:COLORS.inputBorder,
        padding:0,
        paddingHorizontal:10,
        backgroundColor:COLORS.inputBG,
        marginTop:8
    }
});
export default InputBoxWithHeader;
