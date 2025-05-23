import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';

const SampleCharInfo = ({ infoData = {}, setInfoData = () => {} }) => {
    const handleInputChange = (val, item) => {
        const updatedData = infoData.GeneralInfo.map(i => (i.strPropertyName === item.strPropertyName ? { ...i, strValue: val } : i));
        setInfoData(pre => ({ ...pre, GeneralInfo: updatedData }));
    };

    return (
        <View style={styles.rowContainer}>
            {(infoData.GeneralInfo || []).map((item, index) => (
                <View style={styles.subBox} key={`${item.strPropertyName}-${index}`}>
                    <Text style={styles.headerText}>{item.strDisplayName}</Text>
                    <DynamicFormField
                        title="Supplier Name"
                        fieldType={item.strDataType}
                        value={item.strValue}
                        isEditable={item.intEditable == 1}
                        handleChange={val => handleInputChange(val, item)}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subBox: {
        width: '48%', // two columns
        marginBottom: 10,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
});

export default SampleCharInfo;
