import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';
import DataPickerWithIcon from '../DataPickerWithIcon';
import { COLORS } from 'constants/theme-constants';
import SingleDropDown from '../SingleDropDown';

const data = [
    { label: 'Balu', value: '1' },
    { label: 'Ajith', value: '2' },
    { label: 'Vijay', value: '3' },
];
const GeneralInfo = () => {
    const [formData,setFormData]=useState({
        approver:null,
        supplierName:'',
        partName:'',
        inspectedDate:''
    })
    return (
        <View style={[styles.container]}>
            <ScrollView style={[styles.overallBox]} showsVerticalScrollIndicator={false}>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Supplier Name" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Part Name" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <DataPickerWithIcon borderRadius={5} showHeader={true} title="Inspected Date" backgroundColor={COLORS.inputBG} borderWidth={StyleSheet.hairlineWidth}  borderColor={COLORS.inputBorder} paddingVertical={10} placeHolder=''/>
                    </View>
                    <View style={[styles.subBox]}>
                        <DataPickerWithIcon borderRadius={5} showHeader={true}  backgroundColor={COLORS.inputBG} borderWidth={StyleSheet.hairlineWidth}  borderColor={COLORS.inputBorder}paddingVertical={10} type='time' placeHolder=''/>
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Lot Quantity" />
                    </View>
                    <View style={[styles.subBox]}>
                        <SingleDropDown data={data} onChange={(val)=>{setFormData((pre)=>({...pre,approver:val}))}} value={formData.approver} title='Approver'/>
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Supplier Code" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Part Number" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Shift" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Invoice No." />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Inspector" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Quality Level State" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <DataPickerWithIcon borderRadius={5} showHeader={true} title="GRN Date" backgroundColor={COLORS.inputBG} borderWidth={StyleSheet.hairlineWidth}  borderColor={COLORS.inputBorder} paddingVertical={10} placeHolder='' />
                    </View>
                    <View style={[styles.subBox]}>
                        <DataPickerWithIcon borderRadius={5} showHeader={true} title="Invoice Date"  backgroundColor={COLORS.inputBG} borderWidth={StyleSheet.hairlineWidth}  borderColor={COLORS.inputBorder} paddingVertical={10} placeHolder='' />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Lot No" />
                    </View>
                    <View style={[styles.subBox]}>
                    </View>
                </View>
            </ScrollView>
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
    mainBox:{
        flex:1,
        flexDirection:'row',
        marginBottom:10,
    },
    subBox:{
        flex:1,
        marginHorizontal:5
    }
});
export default GeneralInfo;
