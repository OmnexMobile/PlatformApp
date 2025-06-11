import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';

const ConfirmationModal = ({ visible = false, handleClose = () => {}, handleYesPress = () => {}, typeOfModal = '' }) => {
    const retunText = text => {
        switch (typeOfModal) {
            case 'samplesize':
                return 'Sample Size';
            case 'highvalue':
                return 'High Value';
            case 'lowvalue':
                return 'Low Value';
            case 'spec':
                return 'Spec';
            default:
                return '';
        }
    };
    return (
        <Modal
            visible={visible}
            onDismiss={() => {
                handleClose();
            }}
            contentContainerStyle={[styles.modalConatiner]}
            style={{ backgroundColor: 'transparent' }}>
            <View style={[styles.modalcontainer]}>
                <Text style={[styles.deleteHeader]}>Confirm</Text>
                <View style={[styles.contentContainer]}>
                    <Divider />
                    <Text style={[styles.contentText]}>Do you want to Update the {retunText(typeOfModal)} ?</Text>
                </View>
                <View style={[styles.btnStyle]}>
                    <ButtonComponent
                        style={{ height: 30, width: RFPercentage(10), marginRight: 10 }}
                        onPress={() => {
                            handleClose();
                        }}>
                        No
                    </ButtonComponent>
                    <ButtonComponent
                        style={{ height: 30, width: RFPercentage(10) }}
                        onPress={() => {
                            handleYesPress();
                        }}>
                        Yes
                    </ButtonComponent>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteHeader: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2.3),
        padding: 10,
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    contentText: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(1.9),
        paddingVertical: 15,
    },
    btnStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
});

export default ConfirmationModal;
