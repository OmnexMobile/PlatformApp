import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';

const KeyValueList = ({ title = '', value = '' }) => {
    return (
        <View style={[styles.boxConatiner]}>
            <View style={[styles.boxOne]}>
                <Text style={[styles.cardTitle]}>{title}</Text>
            </View>
            <View style={[styles.boxOne]}>
                <Text>{value}</Text>
            </View>
        </View>
    );
};

const PartDetails = ({ visible = false, onDismiss = () => {} }) => {
    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalConatiner]}>
            <View style={[styles.modalcontainer]}>
                <View style={[styles.modalBoxOne]}>
                    <Text style={[styles.headerText]}>Crank Shaft - Details</Text>
                    <Divider />
                    <View style={[styles.contentBox]}>
                        <KeyValueList title="Reference No" value="001" />
                        <KeyValueList title="Operation" value="001" />
                        <KeyValueList title="Lot Number" value="001" />
                        <KeyValueList title="Lot Size" value="001" />
                        <KeyValueList title="Supplier" value="001" />
                        <KeyValueList title="Production Line Name" value="001" />
                        <KeyValueList title="Sample Frequency" value="001" />
                    </View>
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
        fontFamily: 'ProximaNova-Bold',
        fontSize: 18,
        marginBottom: 13,
    },
    contentBox: {
        paddingVertical: 15,
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
        fontFamily: 'ProximaNova-Bold',
        fontSize: 14,
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
        fontFamily: 'ProximaNova-Bold',
        fontSize: RFPercentage(1.8),
    },
});
export default PartDetails;
