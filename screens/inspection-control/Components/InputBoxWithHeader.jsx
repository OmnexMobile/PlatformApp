import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const InputBoxWithHeader = ({
    title = 'Title',
    onChangeText = () => {},
    value = '',
    height = 40,
    editable = true,
    multiline = false,
    padding = 0,
    numberOfLines = 1,
    textAlignVertical = 'center',
    backgroundColor=COLORS.inputBG,
    color= '#000',
    onFocus=()=>{},
}) => {
    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerText]}>{title}</Text>
            <TextInput
                style={[styles.inputBox, { height: height, padding: padding , backgroundColor: backgroundColor,color:color}]}
                onChangeText={onChangeText}
                value={value}
                editable={editable}
                numberOfLines={numberOfLines}
                multiline={multiline}
                textAlignVertical={textAlignVertical}
                onFocus={onFocus}
                
            />
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
        color: COLORS.headerText,
    },
    inputBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        borderColor: COLORS.inputBorder,
        padding: 0,
        paddingHorizontal: 10,
        marginTop: 8,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        
    },
});
export default InputBoxWithHeader;
