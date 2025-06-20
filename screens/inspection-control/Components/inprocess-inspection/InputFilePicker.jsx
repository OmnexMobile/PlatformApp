import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import NoDataFound from '../NoDataFound';
import { showMessage } from 'react-native-flash-message';
import CameraScreen from './CameraScreen';

const InputFilePicker = ({ ListData = [], isEditable = false, title = '', handleInputChange = () => {} }) => {
    const [fileList, setFileList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showCamer, setShowCamer] = useState(false);
    useEffect(() => {
        if (ListData?.length) {
            setFileList(ListData);
        } else {
            setFileList([]);
        }
    }, [ListData]);

    const handlePickFile = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
            });
            if (response[0]?.size && response[0]?.size <= 5 * 1024 * 1024) {
                const base64 = await RNFS.readFile(response[0].uri, 'base64');
                const fileExtension = response[0]?.name?.split('.').pop();
                const file = {
                    ...response[0],
                    id: uuid.v4(),
                    base64Url: base64,
                    fileExtension: fileExtension,
                };
                setFileList([...fileList, file]);
                // setSelectedData({ ...selectedData, fileList: [...fileList, file] });
            } else {
                showMessage({
                    message: 'File size exceeds 5MB limit.',
                    backgroundColor: COLORS.ERROR,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'danger',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                });
            }
        } catch (err) {
            Alert.alert('Error', `${err}`);
            showMessage({
                message: `${err}`,
                backgroundColor: COLORS.ERROR,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'danger',
                position: 'right',
                style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
            });
        }
    };
    const openBase64File = async (base64String, fileType, name) => {
        try {
            // Create a temporary file path
            const path = `${RNFS.CachesDirectoryPath}/${name}.${fileType}`;

            // Write the base64 string to a file
            await RNFS.writeFile(path, base64String, 'base64');

            // Open the file using react-native-file-viewer
            await FileViewer.open(path);
        } catch (error) {
            Alert.alert('Error', 'Unable to open file: ' + error.message);
        }
    };
    const handleDeletePress = index => {
        let temp = JSON.parse(JSON.stringify(fileList));
        temp.splice(index, 1);
        setFileList(temp);
    };
    const handleSaveFile = () => {
        handleInputChange(fileList);
        setVisible(false);
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
                            openBase64File(item.base64Url, item.fileExtension, item?.name);
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
    const handleFilePress = () => {
        setVisible(true);
    };
    const handleNoSave = () => {
        setFileList(ListData);
        handleInputChange(ListData);
        setVisible(false);
    };
    const handleClose = () => {
        const hasChanges = JSON.stringify(ListData) !== JSON.stringify(fileList);
        if (!hasChanges) {
            setVisible(false);
        } else {
            Alert.alert('Confirm', 'There are unsaved changes. Do you want to save them?', [
                {
                    text: 'No',
                    onPress: () => {
                        handleNoSave();
                    },
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => handleSaveFile() },
            ]);
        }
    };
    return (
        <View>
            <TouchableOpacity
                style={[styles.fileBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey, justifyContent: 'center' }]}
                activeOpacity={isEditable ? 0.5 : 1}
                onPress={() => {
                    handleFilePress();
                }}>
                <View>
                    <Text style={[styles.fileText]}>{fileList.length ? `${fileList.length} Files Uploaded` : 'Upload File'}</Text>
                </View>
            </TouchableOpacity>
            <Modal
                visible={visible}
                onDismiss={() => {
                    handleClose();
                }}
                onRequestClose={() => {
                    handleClose();
                }}
                contentContainerStyle={[styles.modalContainer]}>
                <SafeAreaView style={{flex:1}}>
                    {Boolean(showCamer) ? (
                        <CameraScreen setShowCamer={setShowCamer} setFileList={setFileList} />
                    ) : (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
                            <View style={[styles.iconBox]}>
                                <Text style={[styles.titleText]} numberOfLines={1}>
                                    Upload File's For {title}{' '}
                                </Text>
                                <TouchableOpacity style={[styles.closeIcon]} onPress={() => handleClose()}>
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
                                        style={{ height: 40, width: '48%' }}
                                        onPress={() => {
                                            handleCameraPress();
                                        }}>
                                        Camera
                                    </ButtonComponent>
                                    <ButtonComponent style={{ height: 40, width: '48%' }} onPress={handlePickFile}>
                                        Upload
                                    </ButtonComponent>
                                </View>
                                <ButtonComponent style={{ height: 40 }} onPress={handleSaveFile}>
                                    Save
                                </ButtonComponent>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </SafeAreaView>
            </Modal>
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
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
    fileBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    fileText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: COLORS.headerText,
    },
    titleText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        color: COLORS.headerText,
    },
});

export default InputFilePicker;
