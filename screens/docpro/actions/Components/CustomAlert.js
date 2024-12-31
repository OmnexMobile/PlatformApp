import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const CustomAlert = ({setalertVisible,alertVisible}) => {
    const [visible, setVisible] = useState(true);

    const handleYes = () => {
        console.log('Exiting the app...');
        setVisible(false);
        // Add app exit logic here if required
    };

    const handleNo = () => {
        console.log('Stay in the app.');
        setVisible(false);
    };

    return (
        <Modal visible={alertVisible} transparent={true} animationType="fade" onRequestClose={() => setalertVisible(false)}>
            <View style={styles.alertContainer}>
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>Are you sure you want to terminate?</Text>
                    <View style={styles.alertButtons}>
                        <TouchableOpacity
                            style={[styles.alertButton, styles.alertYes]}
                            onPress={() => {
                                console.log('Terminated');
                                setalertVisible(false);
                            }}>
                            <Text style={styles.alertButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.alertButton, styles.alertNo]} onPress={() => setalertVisible(false)}>
                            <Text style={styles.alertButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    alertContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    alertBox: { width: 300, backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
    alertText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
    alertButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    alertButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 5, alignItems: 'center' },
    alertYes: { backgroundColor: '#ff5b5b' },
    alertNo: { backgroundColor: '#00c4cc' },
    alertButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default CustomAlert;
