import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';

const DeleteModal = ({ visible = false,handleClose=()=>{} ,handleYesPress=()=>{}}) => {
    return (
        <Modal
            visible={visible}
            onDismiss={() => {
                handleClose();
            }}
            contentContainerStyle={[styles.modalConatiner]}>
            <View style={[styles.modalcontainer]}>
                <Text style={[styles.deleteHeader]}>Delete</Text>
                <View style={[styles.contentContainer]}>
                    <Divider />
                    <Text style={[styles.contentText]}>Do you want to delete this form ?</Text>
                </View>
                <View style={[styles.btnStyle]}>
                    <ButtonComponent style={{ height: 30, width: RFPercentage(10), marginRight: 10 }} onPress={() => {handleClose()}}>
                        No
                    </ButtonComponent>
                    <ButtonComponent style={{ height: 30, width: RFPercentage(10) }} onPress={() => {handleYesPress()}}>
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
export default DeleteModal;
