import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';

const DeleteModal = ({ visible = false, handleClose = () => {}, handleYesPress = () => {} }) => {
    return (
        <Modal
            visible={visible}
            onDismiss={() => {
                handleClose();
            }}
            contentContainerStyle={[styles.modalConatiner]}
            style={{ backgroundColor: 'transparent' }}>
            <View style={[styles.modalcontainer]}>
                <Text style={[styles.deleteHeader]}>Delete</Text>
                <View style={[styles.contentContainer]}>
                    <Divider />
                    <Text style={[styles.contentText]}>Do you want to delete this form ?</Text>
                </View>
                <View style={[styles.btnStyle]}>
                    <ButtonComponent
                        style={{ height: 30, width: 100, marginRight: 10 }}
                        onPress={() => {
                            handleClose();
                        }}
                        textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                        No
                    </ButtonComponent>
                    <ButtonComponent
                        style={{ height: 30, width: 100 }}
                        onPress={() => {
                            handleYesPress();
                        }}
                        textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
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
        fontSize: 24,
        padding: 10,
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    contentText: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize:18,
        paddingVertical: 15,
    },
    btnStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
});
export default DeleteModal;
