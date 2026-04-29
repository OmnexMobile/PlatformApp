import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const getAlert = ({ cpk, ppk }) => {
    if (cpk < 0 || ppk < 0) {
        return {
            message: 'PARTS OUT OF SPEC – STOP PRODUCTION IMMEDIATELY',
            color: 'red',
            icon: 'close-sharp',
            title: 'Critical Alert',
        };
    }

    if ((cpk >= 0 && cpk < 1.0) || (ppk >= 0 && ppk < 1.0)) {
        return {
            message: 'PROCESS DRIFTING – ADJUST MACHINE NOW',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    if (cpk >= 1.0 && cpk < 1.33) {
        return {
            message: 'PROCESS NOT CAPABLE – MONITOR CLOSELY',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    if (cpk > ppk) {
        return {
            message: 'PROCESS NOT CONSISTENT OVER TIME – CHECK SETUP VARIATION',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    return {
        message: 'PROCESS IS STABLE AND CAPABLE',
        color: 'green',
        icon: '✅',
    };
};

export default function CapabilityCard({ visible, data = null, handleClose = () => {} }) {
    const alert = getAlert(data);
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => handleClose()}>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    {/* <Text style={[styles.icon, { color: alert.color }]}>{alert.icon}</Text> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={[styles.title]}>{alert.title}</Text>
                        <Icon name={alert.icon} size={30} color={alert.color} />
                    </View>

                    <Text style={[styles.message]}>{alert.message}</Text>
                    <TouchableOpacity style={[styles.closeBtn, { backgroundColor: COLORS.apptheme }]} onPress={() => handleClose(false)}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
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
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
