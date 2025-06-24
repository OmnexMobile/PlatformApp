import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from 'constants/theme-constants';

const { width, height } = Dimensions.get('screen');

const QRCodeScannerScreen = ({ modalVisible, hideModal = () => {}, handleScanData = () => {} }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [canScan, setCanScan] = useState(true);

  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
      );
      setHasCameraPermission(result === RESULTS.GRANTED);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.');
      }
    } catch (err) {
      console.error('Camera permission error:', err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleQRCodeRead = ({ data }) => {
    if (!canScan) return;

    setCanScan(false);

    Alert.alert('QR Code Scanned', `Data: ${data}`, [
      {
        text: 'Cancel',
        onPress: () => setCanScan(true),
        style: 'cancel',
      },
      {
        text: 'Submit',
        onPress: () => {
          handleScanData(data);
          hideModal();
          setCanScan(true); // allow scanning again next time
        },
      },
    ]);
  };

  return (
    <Modal visible={modalVisible} onRequestClose={hideModal} animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBox} onPress={hideModal}>
            <Icon name="close" size={20} color={COLORS.moreIcon} />
          </TouchableOpacity>
        </View>

        {hasCameraPermission ? (
          <View style={styles.container}>
            <RNCamera
              style={styles.cameraStyle}
              onBarCodeRead={handleQRCodeRead}
              captureAudio={false}
              flashMode={RNCamera.Constants.FlashMode.auto}
              type={RNCamera.Constants.Type.back}
              androidCameraPermissionOptions={{
                title: 'Camera Permission',
                message: 'We need access to your camera to scan QR codes',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
              }}
            />
            <Text style={styles.footer}>Position the QR code within the frame</Text>
          </View>
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Please grant camera access to use the QR Code Scanner.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: '100%',
    padding: 30,
    zIndex: 10000,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    zIndex: 1000,
    justifyContent: 'center',
  },
  cameraStyle: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
  },
  footer: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconBox: {
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
