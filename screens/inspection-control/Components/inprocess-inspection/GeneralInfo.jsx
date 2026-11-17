import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';

const GeneralInfo = ({ infoData = {}, setInfoData = () => {}, intInspectionTypeID = '', isSamplePopup = false }) => {
    const handleInputChange = (val, item) => {
        const updatedData = infoData.GeneralInfo.map(i => (i.PropertyName === item.PropertyName ? { ...i, Value: val } : i));
        setInfoData(pre => ({ ...pre, GeneralInfo: updatedData }));
    };

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
                        return (
                            <View style={styles.subBox} key={`${item.PropertyName}-${index}`}>
                                <Text style={styles.headerText} numberOfLines={1}>
                                    {intInspectionTypeID == 3
                                        ? item?.PropertyName == 'RevNo' && isSamplePopup
                                            ? 'Model'
                                            : item.StaticText
                                        : item.StaticText}
                                    {item?.Required == 1 && <Text style={styles.isRequired}> *</Text>}
                                </Text>
                                <DynamicFormField
                                    title="Supplier Name"
                                    fieldType={item.FieldType}
                                    value={item.Value}
                                    isEditable={Boolean(item?.IsEditable)}
                                    dropDownData={item?.List || []}
                                    handleChange={val => handleInputChange(val, item)}
                                    DisplayName={item.DisplayName}
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
        paddingBottom: 150
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
        // justifyContent: 'flex-end',
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
    isRequired: {
        color: COLORS.ERROR,
        fontSize: 10,
    },
});

export default GeneralInfo;
