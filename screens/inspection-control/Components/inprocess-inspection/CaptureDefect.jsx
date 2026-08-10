import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconMM from 'react-native-vector-icons/MaterialIcons';
import CameraScreen from './CameraScreen';
import ButtonComponent from 'components/button-component';
import { showErrorMessage } from 'helpers/utils';

const CaptureDefect = ({ visible = false, onRequestClose = () => {}, selectedData = {}, setSelectedData = () => {} }) => {
    const [showCamera, setShowCamera] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState({
        image: false,
        measurement: false,
        value: false,
        defectType: false,
    });

    const [defectDetails, setDefectDetails] = useState({
        defectimg: null,
        measurement: '',
        value: '',
        defectType: '',
        comments: '',
        editedTime:null
    });
    const handleRetakePhoto = () => {
        setFileList([]);
        setDefectDetails(prev => ({
            ...prev,
            defectimg: null,
            editedTime:new Date().toISOString()
        }));
        setShowCamera(true);
    };
    console.log('selectedData12', selectedData);

    useEffect(() => {
        console.log('selectedData?.defectImage', selectedData?.defectImage);
        if (selectedData?.defectImage) {
            setDefectDetails(selectedData?.defectImage);
            setFileList(selectedData?.defectImage?.defectimg ? [selectedData?.defectImage?.defectimg] : []);
        } else {
            setDefectDetails({
                defectimg: null,
                measurement: '',
                value: '',
                defectType: '',
                comments: '',
                editedTime:null,
            });
            setFileList([]);
        }
    }, [selectedData?.defectImage]);
    const handleError = () => {
        let hasError = false;
        let errorObj = {
            image: false,
            measurement: false,
            value: false,
            defectType: false,
        };
        if (!defectDetails.defectimg && !fileList?.length) {
            errorObj.image = true;
            hasError = true;
        }
        if (!defectDetails.measurement) {
            errorObj.measurement = true;
            hasError = true;
        }
        if (!defectDetails.value) {
            errorObj.value = true;
            hasError = true;
        }
        if (!defectDetails.defectType) {
            errorObj.defectType = true;
            hasError = true;
        }
        setError(errorObj);
        return hasError;
    };
    const handleSubmitDefect = () => {
        const hasError = handleError();
        if (!hasError) {
            const updatedData = {
                ...selectedData,
                defectImage: defectDetails,
            };
            setSelectedData(updatedData);
            onRequestClose();
        }
    };
    const handleInputChange = (field, value) => {
        setDefectDetails(prev => ({
            ...prev,
            [field]: value,
            editedTime:new Date().toISOString()
        }));
    };
    const handlestoreFileData = fileData => {
        setDefectDetails(prev => ({
            ...prev,
            defectimg: {
                base64: fileData?.Base64,
                filename: fileData?.FileName,
                filetype: fileData?.FileType,
            },
        }));
    };
    const handleRequestClose = () => {
        setFileList([]);
        setDefectDetails({
            defectimg: null,
            measurement: '',
            value: '',
            defectType: '',
            comments: '',
            editedTime: null,
        });
        setError({
            image: false,
            measurement: false,
            value: false,
            defectType: false,
        });
        onRequestClose();
    };
    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleRequestClose}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>View Image Attachment with Sample</Text>
                        <TouchableOpacity
                            style={[styles.deleteIcon]}
                            onPress={() => {
                                handleRequestClose();
                            }}>
                            <IconMM name="close" size={25} color={COLORS.apptheme} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        {Boolean(fileList?.length) ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10,
                                    backgroundColor: '#f0f0f0',
                                }}>
                                <Image
                                    source={{
                                        uri: `data:image/${defectDetails.defectimg?.filetype};base64,${defectDetails.defectimg?.base64}`,
                                    }}
                                    style={{ height: '100%', width: '100%' }}
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        padding: 8,
                                        borderRadius: 20,
                                    }}
                                    onPress={() => {
                                        setFileList([]);
                                        setDefectDetails(prev => ({
                                            ...prev,
                                            defectimg: null,
                                        }));
                                    }}>
                                    <Text style={{ color: '#fff', fontSize: 12 }}>Remove</Text>
                                    {/* <IconMM name="close" size={10} color="#fff" /> */}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}
                                onPress={() => {
                                    setShowCamera(true);
                                }}>
                                <IconMM name="camera-alt" size={25} color={COLORS.apptheme} />
                                <Text style={{ marginTop: 10, fontSize: 16, color: '#888' }}>Click the camera icon to capture a defect image.</Text>
                                {Boolean(error.image) && <Text style={[styles.errorText, { alignSelf: 'center' }]}>Defect image is required</Text>}
                            </TouchableOpacity>
                        )}
                        <View style={{ flex: 2, alignItems: 'center', padding: 10 }}>
                            <View style={[{ width: '100%', marginBottom: 10 }]}>
                                <Text style={[styles.headerText, { fontSize: 18, fontFamily: 'OpenSans-Bold' }]}>Defect Details</Text>
                            </View>
                            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.headerText}>Measurement</Text>
                                    <TextInput
                                        placeholderTextColor={COLORS.grey}
                                        value={defectDetails.measurement}
                                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                                        onChangeText={val => {
                                            handleInputChange('measurement', val);
                                        }}
                                        placeholder={'Please enter measurement'}
                                    />
                                    {Boolean(error.measurement) && <Text style={styles.errorText}>Measurement is required</Text>}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.headerText}>Value</Text>
                                    <TextInput
                                        placeholderTextColor={COLORS.grey}
                                        value={defectDetails.value}
                                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                                        onChangeText={val => {
                                            handleInputChange('value', val);
                                        }}
                                        placeholder={'Please enter value'}
                                    />
                                    {Boolean(error.value) && <Text style={styles.errorText}>Value is required</Text>}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.headerText}>Defect Type</Text>
                                    <TextInput
                                        placeholderTextColor={COLORS.grey}
                                        value={defectDetails.defectType}
                                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                                        onChangeText={val => {
                                            handleInputChange('defectType', val);
                                        }}
                                        placeholder={'Please enter defect type'}
                                    />
                                    {Boolean(error.defectType) && <Text style={styles.errorText}>Defect Type is required</Text>}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.headerText}>Comments</Text>
                                    <TextInput
                                        placeholderTextColor={COLORS.grey}
                                        style={[styles.textarea, { backgroundColor: COLORS.inputBG }]}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Type your message..."
                                        value={defectDetails.comments}
                                        onChangeText={val => {
                                            handleInputChange('comments', val);
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: 10,
                        }}>
                        <ButtonComponent
                            danger={Boolean(fileList?.length) ? true : false}
                            textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                            style={{ height: 40, width: '48%' }}
                            onPress={() => {
                                Boolean(fileList?.length) ? handleRetakePhoto() : setShowCamera(true);
                            }}>
                            {Boolean(fileList?.length) ? 'Retake Photo' : 'Take Photo'}
                        </ButtonComponent>
                        <ButtonComponent
                            textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                            style={{ height: 40, width: '48%' }}
                            onPress={() => {
                                handleSubmitDefect();
                            }}>
                            Submit Defect
                        </ButtonComponent>
                    </View>
                    <CameraScreen
                        visible={showCamera}
                        setShowCamera={setShowCamera}
                        setFileList={setFileList}
                        handleGetImageData={fileData => {
                            handlestoreFileData(fileData);
                        }}
                    />
                </SafeAreaView>
            </GestureHandlerRootView>
        </Modal>
    );
};
const styles = StyleSheet.create({
    deleteIcon: {
        marginLeft: 10,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    title: {
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        color: '#000',
    },

    close: {
        color: 'red',
        fontSize: 16,
    },

    content: {
        flex: 1,
    },
    capturedImage: {
        height: '100%',
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        paddingBottom: 10,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
    inputBox: {
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 8,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    textarea: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top', // important for Android
        height: 100,
        marginTop: 10,
    },
    errorText: { color: COLORS.error, alignSelf: 'flex-start', marginTop: 5, fontSize: 12, marginLeft: 5 },
});
export default CaptureDefect;
