import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SingleDropDown = ({ data = [], onChange = () => {}, value ,title=''}) => {
    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerText]}>{title}</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select"
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                    onChange(item.value);
                }}
            />
        </View>
    );
};

export default SingleDropDown;

const styles = StyleSheet.create({
    dropdown: {
        borderColor: COLORS.inputBorder,
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.inputBG,
        borderRadius: 5,
        padding: 2,
        marginTop:8,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        paddingLeft: 10,
        color: '#333333',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333333',
        paddingLeft: 10,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    itemTextStyle: {
        fontSize: 14,
        color: '#333333',
        marginTop: -10,
    },
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color:COLORS.headerText
    },
});
