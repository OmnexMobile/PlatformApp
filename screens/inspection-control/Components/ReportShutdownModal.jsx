import { DropdownComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SingleDropDown from './SingleDropDown';

export default function ReportShutdownModal({
    visible,
    data = null,
    handleClose = () => {},
    dropDownList = [],
    setReportFormData = () => {},
    reportFormData = null,
    handleSubmitReport = () => {},
    handleCloseReport = () => {},
    formError = {},
}) {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => handleClose()}>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={[styles.message, { fontSize: 19, marginBottom: 10 }]}>Production Line Down!</Text>
                    <Text style={[styles.message]}>Line : {data?.strOperationName}</Text>
                    <Text style={[styles.message]}>Lot Number: {data?.strLotNo ? data.strLotNo : '-'}</Text>
                    <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: COLORS.grey, marginVertical: 15 }}>
                        <Text style={[styles.message, { textAlign: 'left', marginTop: 10 }]}>Reason for Downtime</Text>
                        <SingleDropDown
                            data={dropDownList}
                            onChange={value => setReportFormData({ ...reportFormData, downtimeres: value })}
                            value={reportFormData?.downtimeres}
                            placeholder="Select Downtime Reason"
                        />
                        {Boolean(formError.downtimeres) && (
                            <Text style={{ color: COLORS.error, alignSelf: 'flex-start', marginTop: 5, fontSize: 12 }}>
                                Please select a downtime reason
                            </Text>
                        )}
                        <TextInput
                            placeholderTextColor='#333333'
                            style={[styles.textarea, { backgroundColor: COLORS.inputBG }]}
                            multiline={true}
                            numberOfLines={4}
                            placeholder="Type your message..."
                            value={reportFormData?.comment || ''}
                            onChangeText={text => setReportFormData({ ...reportFormData, comment: text })}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: COLORS.error }]} onPress={() => handleSubmitReport()}>
                            <Text style={styles.closeText}>Report Downtime</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: COLORS.apptheme }]} onPress={() => handleCloseReport()}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        color: '#000',
        marginRight: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'OpenSans-SemiBold',
        color: '#000',
    },
    closeBtn: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: '49%',
        alignItems: 'center',
        marginTop: 20,
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    textarea: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top', // important for Android
        height: 100,
        marginTop: 10,
    },
});
