import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';

const CameraScreen = ({ setShowCamer = () => {}, setFileList = () => {} }) => {
    const cameraRef = useRef(null);
    const [photoUri, setPhotoUri] = useState(null);
    const [fileData, setFileData] = useState({});

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            const fileExtension = data?.uri.split('.').pop().split('?')[0];
            const file = {
                ...data,
                id: uuid.v4(),
                base64Url: data.base64,
                fileExtension: fileExtension,
                name:data.uri.split('/').pop()
            };
            setFileData(file);
            setPhotoUri(data.uri);
        }
    };

    const retake = () => {
        setPhotoUri(null);
        setFileData({})
    };
    console.log(photoUri, 'photoUri');
    const handleClose = () => {
        setPhotoUri(null);
        setFileData({})
        setShowCamer(false);
    };
    const handleConfirm = () => {
        setFileList(pre => [...pre,fileData]);
        setShowCamer(false);
    };

    return (
        <View style={styles.container}>
            {!photoUri ? (
                <RNCamera ref={cameraRef} style={styles.preview} type={RNCamera.Constants.Type.back} captureAudio={false}>
                    <View style={styles.captureContainer}>
                        <TouchableOpacity onPress={takePicture} style={styles.capture}>
                            <IconM name="circle-slice-8" size={70} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            ) : (
                <View style={styles.preview}>
                    <Image source={{ uri: photoUri }} style={styles.capturedImage} />
                    <View style={[styles.btnContainer]}>
                        <TouchableOpacity onPress={retake}>
                            <IconM name="arrow-u-left-bottom" size={40} color={'#fff'} />
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
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 20,
    },
    capture: {
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    captureText: {
        fontSize: 14,
        color: '#000',
    },
    capturedImage: {
        width: '100%',
        height: '90%',
        resizeMode: 'contain',
    },
});

export default CameraScreen;
