// components/UpdateModal.js
import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { Alert } from 'react-native';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const UpdateModal = ({ visible, onClose }) => {
    const handleUpdate = async () => {
        try {
            const res = await VersionCheck.needUpdate();
            if (res.isNeeded) {
                try {
                    await Linking.openURL(res.storeUrl);
                } catch (err) {
                    Alert.alert('Update ', 'Unable to open the store link. Please update manually from the App Store or Play Store.');
                }
            }
        } catch (err) {
            console.log('handleUpdate error:', err);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update Available</Text>
                    <Text style={styles.message}>A new version of the app is available. Please update.</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.buttonLater} onPress={onClose}>
                            <Text style={styles.textLater}>Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonUpdate} onPress={handleUpdate}>
                            <Text style={styles.textUpdate}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default UpdateModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonLater: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
    },
    buttonUpdate: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.apptheme,
        alignItems: 'center',
    },
    textLater: { color: '#555', fontWeight: '600' },
    textUpdate: { color: '#fff', fontWeight: '600' },
});
