import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';
import DataPickerWithIcon from '../DataPickerWithIcon';
import { COLORS } from 'constants/theme-constants';
import SingleDropDown from '../SingleDropDown';
import DynamicFormField from '../DynamicFormField';

const GeneralInfo = ({ infoData = {}, setInfoData = () => {} }) => {
    const handleInputChange = (val, item) => {
        const updatedData = infoData.GeneralInfo.map(i => (i.strPropertyName === item.strPropertyName ? { ...i, strValue: val } : i));
        setInfoData(pre => ({ ...pre, GeneralInfo: updatedData }));
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.subBox]} key={index+1}>
                <Text style={[styles.headerText]}>{item.strDisplayName}</Text>
                <DynamicFormField title="Supplier Name" fieldType={item.strDataType}
                value={item.strValue}
                isEditable={item.intEditable==1?true:false}
                handleChange={(val) => {
                    handleInputChange(val, item);
                }}
                />
            </View>
        );
    };
    return (
        <View style={[styles.container]}>
            <FlatList
                data={infoData.GeneralInfo || []}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    marginBottom: 10,
                }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    overallBox: {
        flex: 1,
    },
    mainBox: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    subBox: {
        flex: 1,
        marginHorizontal: 5,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
});
export default GeneralInfo;
