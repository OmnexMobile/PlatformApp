import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
import { pick, types, errorCodes } from '@react-native-documents/picker';
import uuid from 'react-native-uuid';
import RNBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import NoDataFound from '../NoDataFound';
import { showMessage } from 'react-native-flash-message';
import CameraScreen from './CameraScreen';

const ModalFilePickerWithList = ({
    visible = false,
    onDismiss = () => {},
    selectedData = {},
    masterData = {},
    setSelectedData = () => {},
    infoData = {},
    setInfoData = () => {},
    formType = '',
    showCamer = false,
    setShowCamer = () => {},
}) => {
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        if (selectedData?.fileList?.length) {
            setFileList(selectedData?.fileList);
        } else {
            setFileList([]);
        }
    }, [selectedData]);

    // const handlePickFile = async () => {
    //     try {
    //         const response = await DocumentPicker.pick({
    //             presentationStyle: 'fullScreen',
    //         });
    //         if (response[0]?.size && response[0]?.size <= 5 * 1024 * 1024) {
    //             const base64 = await RNFS.readFile(response[0].uri, 'base64');
    //             const fileExtension = response[0]?.name?.split('.').pop();
    //             const file = {
    //                 ...response[0],
    //                 id: uuid.v4(),
    //                 Base64: base64,
    //                 FileType: fileExtension,
    //                 FileName: response[0]?.name,
    //             };
    //             setFileList([...fileList, file]);
    //             // setSelectedData({ ...selectedData, fileList: [...fileList, file] });
    //         } else {
    //             showMessage({
    //                 message: 'File size exceeds 5MB limit.',
    //                 backgroundColor: COLORS.ERROR,
    //                 color: COLORS.white,
    //                 duration: 1500,
    //                 statusBarHeight: 40,
    //                 icon: 'danger',
    //                 position: 'right',
    //                 style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
    //             });
    //         }
    //     } catch (err) {
    //         showMessage({
    //             message: `${err}`,
    //             backgroundColor: COLORS.ERROR,
    //             color: COLORS.white,
    //             duration: 1500,
    //             statusBarHeight: 40,
    //             icon: 'danger',
    //             position: 'right',
    //             style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
    //         });
    //     }
    // };
    const handlePickFile = async () => {
        try {
            const response = await pick({
                allowMultiSelection: false,
                type: [types.allFiles],
            });

            const selectedFile = response[0];

            if (selectedFile?.size && selectedFile.size <= 5 * 1024 * 1024) {
                const filePath = selectedFile.fileCopyUri || selectedFile.uri;

                const cleanedPath = filePath.replace('file://', '');

                const base64 = await RNBlobUtil.fs.readFile(cleanedPath, 'base64');

                const fileExtension = selectedFile?.name?.split('.').pop();

                const file = {
                    ...selectedFile,

                    id: uuid.v4(),

                    Base64: base64,

                    FileType: fileExtension,

                    FileName: selectedFile?.name,
                };

                setFileList(prev => [...prev, file]);

                // setSelectedData({
                //   ...selectedData,
                //   fileList: [...fileList, file],
                // });
            } else {
                showMessage({
                    message: 'File size exceeds 5MB limit.',

                    backgroundColor: COLORS.ERROR,

                    color: COLORS.white,

                    duration: 1500,

                });
            }
        } catch (err) {
            if (err?.code === errorCodes.OPERATION_CANCELED) {
                return;
            }

            showMessage({
                message: `${err}`,

                backgroundColor: COLORS.ERROR,

                color: COLORS.white,

                duration: 1500,
            });
        }
    };
    const openBase64File = async (base64String, fileType, name) => {
        try {
            const ext = fileType?.toLowerCase() || 'txt';
            const fileName = `${name}.${ext}`;
            const path = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;

            // Write the base64 string to a file
            await RNBlobUtil.fs.writeFile(path, base64String, 'base64');

            // Verify file written successfully
            const exists = await RNBlobUtil.fs.exists(path);
            if (!exists) {
                Alert.alert('Error', 'File could not be created.');
                return;
            }

            if (Platform.OS === 'ios') {
                // iOS - open document directly
                await RNBlobUtil.ios.openDocument(path);
            } else {
                // Android - open with intent using MIME type
                await RNBlobUtil.android.actionViewIntent(path, getMimeType(ext));
            }
        } catch (error) {
            console.error('File open error:', error);
            Alert.alert('Error', 'Unable to open file.');
        }
    };
    const handleDeletePress = index => {
        let temp = JSON.parse(JSON.stringify(fileList));
        temp.splice(index, 1);
        setFileList(temp);
        // setSelectedData({ ...selectedData, fileList: temp });
    };
    const handleSaveFile = () => {
        const updatedObj = {
            ...selectedData,
            fileList: fileList,
        };
        const { VariableCharacteristics, AttributeCharacteristics } = infoData;
        const characteristicsList = formType === 'number' ? VariableCharacteristics : AttributeCharacteristics;
        const index = characteristicsList.findIndex(obj => obj?.intCCharacteristicId === selectedData?.intCCharacteristicId);
        const newCharacteristicsList = [...characteristicsList];
        if (index !== -1) {
            newCharacteristicsList[index] = updatedObj;
        }
        setSelectedData(updatedObj);
        setInfoData(pre => ({
            ...pre,
            [formType === 'number' ? 'VariableCharacteristics' : 'AttributeCharacteristics']: newCharacteristicsList,
        }));
        onDismiss();
    };
    const renderFileList = ({ item, index }) => {
        return (
            <View key={index + 1} style={[styles.listBox]}>
                <View>
                    <Text style={[styles.fileText, { marginRight: 10 }]}>{index + 1}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.fileText]}>{item?.name}</Text>
                </View>
                <View style={[styles.iconContainer]}>
                    <TouchableOpacity
                        style={[styles.iconBoxStyle]}
                        onPress={() => {
                            openBase64File(item.Base64, item.FileType, item?.FileName);
                        }}>
                        <IconI name="eye-outline" size={22} color={COLORS.grey} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            handleDeletePress(index);
                        }}>
                        <IconM name="delete-outline" size={22} color={COLORS.ERROR} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const handleCameraPress = () => {
        setShowCamer(true);
    };
    return (
        <Modal visible={visible} onDismiss={onDismiss} onRequestClose={onDismiss} contentContainerStyle={[styles.modalContainer]}>
            <SafeAreaView style={{ flex: 1 }}>
                {Boolean(showCamer) ? (
                    <CameraScreen setShowCamer={setShowCamer} setFileList={setFileList} />
                ) : (
                    <View style={[styles.container]}>
                        <View style={[styles.iconBox]}>
                            <TouchableOpacity style={[styles.closeIcon]} onPress={onDismiss}>
                                <Icon name="close" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                        {Boolean(fileList.length) ? (
                            <FlatList
                                data={fileList}
                                renderItem={renderFileList}
                                contentContainerStyle={{ marginHorizontal: 10 }}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <NoDataFound />
                        )}
                        <View style={[styles.btnContainer]}>
                            <View style={[styles.btnBox]}>
                                <ButtonComponent
                                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                    style={{ height: 40, width: '48%' }}
                                    onPress={() => {
                                        handleCameraPress();
                                    }}>
                                    Camera
                                </ButtonComponent>
                                <ButtonComponent
                                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                    style={{ height: 40, width: '48%' }}
                                    onPress={handlePickFile}>
                                    Upload
                                </ButtonComponent>
                            </View>

                            <ButtonComponent
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                style={{ height: 40 }}
                                onPress={handleSaveFile}>
                                Save
                            </ButtonComponent>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    btnContainer: {
        padding: 10,
    },
    closeIcon: {
        backgroundColor: COLORS.apptheme,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    iconBox: {
        alignItems: 'flex-end',
        padding: 5,
    },
    textContainer: {
        flex: 1,
        marginEnd: 20,
    },
    listBox: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.grey,
    },
    fileText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.black,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconBoxStyle: {
        marginEnd: 10,
    },
    btnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

export default ModalFilePickerWithList;
