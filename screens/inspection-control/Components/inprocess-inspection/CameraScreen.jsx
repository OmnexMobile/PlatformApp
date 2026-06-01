import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import uuid from 'react-native-uuid';

const CameraScreen = ({
  setShowCamer = () => {},
  setFileList = () => {},
}) => {
  const cameraRef = useRef(null);

  const device = useCameraDevice('back');

  const { hasPermission, requestPermission } = useCameraPermission();

  const [photoUri, setPhotoUri] = useState(null);

  const [fileData, setFileData] = useState({});

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();

      if (!permission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required',
        );
      }
    }
  };

  const convertToBase64 = async path => {
    try {
      const response = await fetch(`file://${path}`);

      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result;

          resolve(result.split(',')[1]);
        };

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
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
        });

        const imagePath = `file://${photo.path}`;

        const fileExtension =
          imagePath?.split('.').pop()?.split('?')[0] || 'jpg';

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

    setShowCamer(false);
  };

  const handleConfirm = () => {
    setFileList(pre => [...pre, fileData]);

    setShowCamer(false);
  };

  if (!device) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.capture}>
              <IconM
                name="circle-slice-8"
                size={70}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.preview}>
          <Image
            source={{ uri: photoUri }}
            style={styles.capturedImage}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={retake}>
              <IconM
                name="arrow-u-left-bottom"
                size={40}
                color={'#fff'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm}>
              <IconM name="check" size={40} color={'#fff'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClose}>
              <IconM name="close" size={40} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  captureContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  capture: {
    borderRadius: 100,
    padding: 10,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default CameraScreen;