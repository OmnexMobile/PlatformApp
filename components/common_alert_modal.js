import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModalComponent from './modal-component';

const CommonAlertModal = ({
    visible = false,
    title = 'Alert',
    message = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
    onConfirm = () => {},
    onCancel = () => {},
}) => {
    const handleClose = showCancel ? onCancel : onConfirm;

    return (
        <ModalComponent modalVisible={visible} onRequestClose={handleClose} onBackdropPress={handleClose} modalBackgroundColor="rgba(0,0,0,0.45)">
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={[styles.buttonRow, !showCancel && styles.singleButtonRow]}>
                        {showCancel ? (
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity style={[styles.button, styles.confirmButton, !showCancel && styles.singleButton]} onPress={onConfirm}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ModalComponent>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#5f6368',
        textAlign: 'center',
        marginBottom: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    singleButtonRow: {
        justifyContent: 'center',
    },
    button: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    singleButton: {
        flex: 0,
        minWidth: 120,
        alignSelf: 'center',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    confirmButton: {
        backgroundColor: '#123C95',
    },
    cancelText: {
        color: '#333',
        fontWeight: '600',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default CommonAlertModal;
