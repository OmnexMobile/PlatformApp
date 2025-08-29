import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';
import ListRadioButton from './ListRadioButton';

const GeneralInfo = ({ infoData = {}, setInfoData = () => {}, intInspectionTypeID = '' }) => {
    const handleInputChange = (val, item) => {
        console.log('handlechange', val, item);
        const updatedData = infoData.GeneralInfo.map(i => (i.PropertyName === item.PropertyName ? { ...i, Value: val } : i));
        setInfoData(pre => ({ ...pre, GeneralInfo: updatedData }));
    };
    // console.log(infoData.GeneralInfo, 'infoData');

    return (
        <KeyboardAvoidingView
            contentContainerStyle={styles.scrollContainer}
            extraScrollHeight={80}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.rowContainer}>
                    {(infoData.GeneralInfo || []).map((item, index) => {
                        let dropList = item?.List?.length && item?.List.map(i => ({ value: i?.Supervisor, label: i?.Supervisor, ...i }));
                        if (intInspectionTypeID == 1) {
                            return (
                                item.DisplayName != 'Model' &&
                                item.DisplayName != 'Rev No' &&
                                item.DisplayName != 'Customer' &&
                                item.DisplayName != 'Customer Code' && (
                                    <View style={styles.subBox} key={`${item.PropertyName}-${index}`}>
                                        <Text style={styles.headerText}>
                                            {item.DisplayName == 'ReceiptNo' && intInspectionTypeID == 1 ? 'GRN No' : item.DisplayName}
                                        </Text>
                                        <DynamicFormField
                                            title="Supplier Name"
                                            fieldType={item.FieldType}
                                            value={item.Value}
                                            isEditable={Boolean(item?.IsEditable)}
                                            dropDownData={dropList || []}
                                            handleChange={val => handleInputChange(val, item)}
                                            DisplayName={item.DisplayName}
                                        />
                                    </View>
                                )
                            );
                        } else if (intInspectionTypeID == 3) {
                            return (
                                item.DisplayName != 'Rev No' &&
                                item.DisplayName != 'ReceiptNo' &&
                                item.DisplayName != 'GRN Date' &&
                                item.DisplayName != 'Supplier Code' &&
                                item.DisplayName != 'Invoice Number' &&
                                item.DisplayName != 'Invoice Date' && (
                                    <View style={styles.subBox} key={`${item.PropertyName}-${index}`}>
                                        <Text style={styles.headerText}>{item.DisplayName}</Text>
                                        <DynamicFormField
                                            title="Supplier Name"
                                            fieldType={item.FieldType}
                                            value={item.Value}
                                            isEditable={Boolean(item?.IsEditable)}
                                            dropDownData={dropList || []}
                                            handleChange={val => handleInputChange(val, item)}
                                            DisplayName={item.DisplayName}
                                        />
                                    </View>
                                )
                            );
                        } else if (intInspectionTypeID == 2) {
                            return (
                                <View style={styles.subBox} key={`${item.PropertyName}-${index}`}>
                                    <Text style={styles.headerText}>
                                        {item.DisplayName == 'UserName' && intInspectionTypeID == 2 ? 'Operator' : item.DisplayName}
                                    </Text>
                                    <DynamicFormField
                                        title="Supplier Name"
                                        fieldType={item.FieldType}
                                        value={item.Value}
                                        isEditable={Boolean(item?.IsEditable)}
                                        dropDownData={dropList || []}
                                        handleChange={val => handleInputChange(val, item)}
                                        DisplayName={item.DisplayName}
                                    />
                                </View>
                            );
                        } else {
                            return null;
                        }
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
        flex: 1,
    },
    subBox: {
        width: '48%', // two columns
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
});

export default GeneralInfo;
