import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const InputBoxWithHeader = ({ title = 'Title', onChangeText=()=>{},value=''}) => {
    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerText]}>{title}</Text>
            <TextInput style={[styles.inputBox]} onChangeText={onChangeText} value={value}/>
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
        color:COLORS.headerText
    },
    inputBox:{
        borderWidth:StyleSheet.hairlineWidth,
        height:40,
        borderRadius:5,
        borderColor:COLORS.inputBorder,
        padding:0,
        paddingHorizontal:10,
        backgroundColor:COLORS.inputBG,
        marginTop:8,
        color:"#000"
    }
});
export default InputBoxWithHeader;
