import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';

const CameraScreen = ({
  visible = false,
  setShowCamera = () => {},
  setFileList = () => {},
  handleGetImageData = () => {},
}) => {
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState('back');
  const device = useCameraDevice(facing);

  const { hasPermission, requestPermission } = useCameraPermission();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [fileData, setFileData] = useState({});

  useEffect(() => {
    if (visible) checkPermission();
  }, [visible]);

  const checkPermission = async () => {
    if (hasPermission) {
      setPermissionGranted(true);
      return;
    }
    const granted = await requestPermission();
    if (granted) {
      setPermissionGranted(true);
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device Settings.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setShowCamera(false) },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  const convertToBase64 = async path => {
    try {
      const response = await fetch(`file://${path}`);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log('Base64 Error', error);
      return '';
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({ flash: 'off' });
        const imagePath = `file://${photo.path}`;
        const fileExtension = imagePath?.split('.').pop()?.split('?')[0] || 'jpg';
        const base64 = await convertToBase64(photo.path);
        const file = {
          id: uuid.v4(),
          Base64: base64,
          FileType: fileExtension,
          FileName: imagePath.split('/').pop(),
          uri: imagePath,
        };
        setFileData(file);
        setPhotoUri(imagePath);
      }
    } catch (error) {
      console.log('Take Picture Error', error);
    }
  };

  const retake = () => {
    setPhotoUri(null);
    setFileData({});
  };

  const handleClose = () => {
    setPhotoUri(null);
    setFileData({});
    setPermissionGranted(false);
    setShowCamera(false);
  };

  const handleConfirm = () => {
    setFileList(prev => [...prev, fileData]);
    setPhotoUri(null);
    setFileData({});
    setPermissionGranted(false);
    setShowCamera(false);
    handleGetImageData(fileData);
  };

  const toggleFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>

        {!permissionGranted || !device ? (
          <View style={styles.container} />

        ) : !photoUri ? (

          // ── Live Camera View ──────────────────────────────
          <View style={styles.container}>
            {/* Camera fills the whole view */}
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={visible && permissionGranted}
              photo={true}
            />

            {/* Top bar — rendered OUTSIDE <Camera> */}
            <SafeAreaView style={styles.topBar}>
              <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                <IconM name="close" size={26} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleFacing} style={styles.iconBtn}>
                <IconM name="camera-flip-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>

            {/* Shutter — rendered OUTSIDE <Camera> */}
            <View style={styles.shutterRow}>
              <TouchableOpacity onPress={takePicture} style={styles.shutterOuter}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
            </View>
          </View>

        ) : (

          // ── Preview View ──────────────────────────────────
          <View style={styles.preview}>
            <Image source={{ uri: photoUri }} style={styles.capturedImage} />

            <View style={styles.previewOverlay}>
              <TouchableOpacity onPress={retake} style={styles.actionBtn}>
                <IconM name="arrow-u-left-bottom" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                <IconM name="check" size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={styles.actionBtn}>
                <IconM name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
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
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRow: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    backgroundColor: '#000',
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});

export default CameraScreen;