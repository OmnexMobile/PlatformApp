import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';

const GeneralInfo = ({ infoData = {}, setInfoData = () => {} }) => {
    const handleInputChange = (val, item) => {
        const updatedData = infoData.GeneralInfo.map(i => (i.PropertyName === item.PropertyName ? { ...i, Value: val } : i));
        setInfoData(pre => ({ ...pre, GeneralInfo: updatedData }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.rowContainer}>
                    {(infoData.GeneralInfo || []).map((item, index) => {
                        let dropList=item?.List?.length && item?.List.map((i) => ({ value: i?.Supervisor, label: i?.Supervisor ,...i}))
                        return (
                            <View style={styles.subBox} key={`${item.PropertyName}-${index}`}>
                                <Text style={styles.headerText}>{item.DisplayName}</Text>
                                <DynamicFormField
                                    title="Supplier Name"
                                    fieldType={item.DisplayName == 'Approver' ? 'singleDropDown' : item.DataType}
                                    value={item.Value}
                                    // isEditable={item.intEditable == 1}
                                    dropDownData={dropList || []}
                                    handleChange={val => handleInputChange(val, item)}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 10,
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

export default GeneralInfo;
