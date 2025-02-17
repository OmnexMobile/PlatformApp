import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, Dimensions, TouchableOpacity, Modal, SafeAreaView, StatusBar } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from 'constants/theme-constants';
const { width, height } = Dimensions.get('screen');
const QRCodeScannerScreen = ({ modalVisible, hideModal = () => {}, handleScanData = () => {} }) => {
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [reScan, setReSacn] = useState(true);

    // Function to request camera permission
    const requestCameraPermission = async () => {
        try {
            const result = await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);

            if (result === RESULTS.GRANTED) {
                setHasCameraPermission(true); // Permission granted
            } else {
                Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.', [{ text: 'OK' }]);
                setHasCameraPermission(false); // Permission denied
            }
        } catch (err) {
            console.error('Error requesting camera permission:', err);
        }
    };

    // Run permission request when the screen loads
    useEffect(() => {
        requestCameraPermission();
    }, []);

    const handleQRCodeRead = e => {
        Alert.alert('Alert Title', `Data: ${e.data}`, [
            {
                text: 'Cancel',
                onPress: () => {
                    setReSacn(true);
                },
                style: 'cancel',
            },
            {
                text: 'Submit',
                onPress: () => {
                    handleScanData(e.data);
                    hideModal();
                },
            },
        ]);
        setReSacn(false);
    };

    return (
        <Modal visible={modalVisible} onDismiss={hideModal} style={{ flex: 1, backgroundColor: '#000' }} onRequestClose={hideModal}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                <View style={{ position: 'absolute', width: '100%', padding: 30, zIndex: 10000 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={[styles.iconBox]} onPress={hideModal}>
                            <Icon name="close" size={20} color={COLORS.moreIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                {hasCameraPermission ? (
                    reScan && (
                        <View style={styles.container}>
                            <QRCodeScanner
                                onRead={handleQRCodeRead}
                                flashMode={RNCamera.Constants.FlashMode.auto}
                                bottomContent={<Text style={styles.footer}>Position the QR code within the frame</Text>}
                                cameraStyle={styles.cameraStyle}
                                reactivate={reScan}
                                reactivateTimeout={2000}
                            />
                        </View>
                    )
                ) : (
                    <View style={styles.permissionContainer}>
                        <Text style={styles.permissionText}>Please grant camera access to use the QR Code Scanner.</Text>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    footer: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    cameraStyle: {
        width: width * 0.8, // 80% of screen width
        height: height * 0.5, // 50% of screen height
        alignSelf: 'center', // Center align the camera view
        backgroundColor: '#fff',
    },
    iconBox: {
        flexDirection: 'row',
        backgroundColor: COLORS.icBottomBox,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    permissionText: {
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default QRCodeScannerScreen;
