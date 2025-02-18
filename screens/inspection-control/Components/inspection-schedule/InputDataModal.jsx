import { RadioButton } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SingleDropDown from '../SingleDropDown';
import DynamicDropDown from '../DynamicDropDown';
import { useSelector } from 'react-redux';
const data = [
    { label: 'Default', value: '1' },
    { label: 'Noon shift', value: '2' },
    { label: '12 Shift', value: '3' },
    { label: 'No Shift', value: '4' },
    { label: '2 Shift', value: '5' },
    { label: 'Yes Shift', value: '6' },
    { label: 'Ok Shift', value: '7' },
    { label: 'wc Shift', value: '8' },
];
const InputDataModal = ({ modalVisible = false, hideModal = () => {}, handleSubmitPress = () => {} }) => {
    const { icSettings } = useSelector(state => state.inspection);
    console.log(icSettings, '*********icSettings');
    const [formData, setFormData] = useState({
        shift: { label: 'Default', value: '1' },
        lotNumber: '',
        lotQty: '',
        frequency: '',
        responsible: [],
    });
    const handleInputChange = (key, value) => {
        setFormData(pre => ({ ...pre, [key]: value }));
    };
    return (
        <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{
                backgroundColor: '#fff',
                width: '90%',
                alignSelf: 'center',
                height: 500,
                paddingHorizontal: 20,
                paddingTop: 20,
            }}>
            <Text style={styles.headertext}>Form Input Data</Text>
            <Divider />
            <ScrollView style={[styles.container]} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                <View style={[]}>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Shift <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <SingleDropDown
                            data={data}
                            backgroundColor={COLORS.white}
                            borderWidth={1}
                            marginTop={15}
                            title=""
                            borderRadius={4}
                            borderColor={COLORS.icBottomBox}
                            showSearch={false}
                            maxHeight={200}
                            value={formData.shift}
                            onChange={val => {
                                handleInputChange('shift', val);
                            }}
                        />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Lot Number <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.inputBox}
                            onChangeText={val => {
                                handleInputChange('lotNumber', val);
                            }}
                        />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Lot Quantity <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.inputBox}
                            onChangeText={val => {
                                handleInputChange('lotQty', val);
                            }}
                        />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Choose Frequency <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <SingleDropDown
                            data={data}
                            backgroundColor={COLORS.white}
                            borderWidth={1}
                            marginTop={15}
                            title=""
                            borderRadius={4}
                            borderColor={COLORS.icBottomBox}
                            showSearch={false}
                            maxHeight={200}
                        />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>Responsible Person</Text>
                        <DynamicDropDown
                            isMultiSelect={icSettings.IsRespPartyMultiSelect}
                            list={data}
                            handleSelectedList={value => {
                                console.log(value, '**************value');
                            }}
                            isDisable={icSettings.IsRespPartyNonEditable}
                        />
                    </View>
                </View>
            </ScrollView>
            <Divider />
            <View style={styles.btnConatiner}>
                <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                    <Text style={styles.btnStyle}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelConatiner}
                    onPress={() => {
                        handleSubmitPress();
                    }}>
                    <Text style={styles.btnStyle}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2),
        paddingBottom: 12,
        color: '#000',
    },
    inputContainer: {
        paddingVertical: 7,
    },
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 3,
        borderColor: COLORS.icBottomBox,
        marginTop: 15,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-Bold',
        fontSize: RFPercentage(1.8),
    },
    rquired: {
        color: COLORS.ERROR,
    },
    inputText: {
        color: '#000',
        fontFamily: 'OpenSans-Regular',
    },
});

export default InputDataModal;
