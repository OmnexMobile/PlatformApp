import { RadioButton } from 'components';
import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SingleDropDown from '../SingleDropDown';
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
    return (
        <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center', width: '90%', alignSelf: 'center' }}>
            <ScrollView style={[styles.container]}>
                <View style={[styles.containerOne]}>
                    <Text style={styles.headertext}>Form Input Data</Text>
                    <Divider />
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Shift <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <SingleDropDown data={data} backgroundColor={COLORS.white} borderWidth={1} marginTop={15} title='' borderRadius={4}  borderColor={COLORS.icBottomBox} showSearch={false} maxHeight={200} />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Lot Number <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <TextInput style={styles.inputBox} />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Lot Quantity <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <TextInput style={styles.inputBox} />
                    </View>
                    <View style={[styles.inputContainer]}>
                        <Text style={styles.inputText}>
                            Choose Frequency <Text style={[styles.rquired]}>*</Text>
                        </Text>
                        <View style={{ height: 30, marginTop: -10 }}>
                            <RadioButton onChange={() => {}} value="" options={[{ value: 'Each Lot', label: 'Each Lot' }]} />
                        </View>
                    </View>
                </View>
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
            </ScrollView>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    containerOne: {
        padding: 20,
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
