import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import moment from 'moment';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';

const KeyValueList = ({ title = '', value = '' }) => {
    return (
        <View style={[styles.boxConatiner]}>
            <View style={[styles.boxOne]}>
                <Text style={[styles.cardTitle]}>{title}</Text>
            </View>
            <View style={[styles.boxOne]}>
                <Text style={[styles.cardTitle]} >{value}</Text>
            </View>
        </View>
    );
};

const PartDetails = ({ visible = false, onDismiss = () => {},selectedData={} }) => {
    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalConatiner]}>
            <View style={[styles.modalcontainer]}>
                <View style={[styles.modalBoxOne]}>
                    <Text style={[styles.headerText]}>{selectedData?.ProductionItemName} - Details</Text>
                    <Divider />
                    <ScrollView style={[styles.contentBox]} showsVerticalScrollIndicator={false}>
                        <KeyValueList title="Reference No" value={selectedData?.ReferenceNo} />
                        <KeyValueList title="Operation" value={selectedData?.OperationName} />
                        <KeyValueList title="Lot Number" value={selectedData?.LotNo} />
                        <KeyValueList title="Lot Size" value={selectedData?.LotSize} />
                        {Boolean(selectedData?.InspectionType !==2) &&<KeyValueList title="Supplier" value={selectedData?.SupplierName} />}
                        {Boolean(selectedData?.InspectionType ==2) && <KeyValueList title="Production Line Name" value={selectedData?.ProductionLineName} />}
                        <KeyValueList title="Sample Frequency" value={selectedData?.SampleFrequency} />
                        <KeyValueList title="Inspector" value={selectedData?.Operator} />
                        <KeyValueList title="Inspected Date" value={selectedData?.EnteredDate!==''?moment(new Date(selectedData?.EnteredDate)).format('DD/MM/YYYY hh:mm A'):''} />
                    </ScrollView>
                </View>
                <View>
                    <Divider />
                    <View style={styles.btnConatiner}>
                        <TouchableOpacity style={styles.cancelConatiner} onPress={onDismiss}>
                            <Text style={styles.btnStyle}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    modalBoxOne: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        marginBottom: 13,
        color:COLORS.ictextBlack
    },
    contentBox: {
        maxHeight:370,
        marginVertical:15
    },
    boxConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    boxOne: {
        width: '49%',
        backgroundColor: COLORS.icborder,
        padding: 10,
        borderRadius: 3,
    },
    cardTitle: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color:COLORS.headerText
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
    cardValue: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
        color:COLORS.headerText
    },
});
export default PartDetails;
