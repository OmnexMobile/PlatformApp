import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import RNBlobUtil from 'react-native-blob-util';
import { pick, types, errorCodes } from '@react-native-documents/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import NoDataFound from '../NoDataFound';
import CameraScreen from './CameraScreen';

const FileUploadScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fileList: initialFileList = [], maxLimit = 10, title = '', onSave = () => {} } = route.params || {};

    const [fileList, setFileList] = useState(initialFileList);
    const [showCamer, setShowCamer] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);

    const skipConfirmRef = useRef(false);
    useLayoutEffect(() => {
        setDisableBtn(fileList?.length >= maxLimit);
    }, [fileList, maxLimit]);

    // Intercept hardware/header back to run the same unsaved-changes confirm
    // that the Modal's onDismiss/onRequestClose used to do.
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', e => {
            if (skipConfirmRef.current) {
                // Save already handled it — let navigation proceed untouched.
                return;
            }
            const hasChanges = JSON.stringify(initialFileList) !== JSON.stringify(fileList);
            if (!hasChanges) return;

            e.preventDefault();
            Alert.alert('Confirm', 'There are unsaved changes. Do you want to save them?', [
                {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => navigation.dispatch(e.data.action),
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        onSave(fileList);
                        navigation.dispatch(e.data.action);
                    },
                },
            ]);
        });
        return unsubscribe;
    }, [navigation, fileList, initialFileList, onSave]);

    // const handlePickFile = async () => {
    //     try {
    //         const response = await pick({ allowMultiSelection: false, type: [types.allFiles] });
    //         const selectedFile = response[0];

    //         if (selectedFile?.size && selectedFile.size <= 5 * 1024 * 1024) {
    //             const base64 = await RNBlobUtil.fs.readFile(selectedFile.uri, 'base64');
    //             const fileExtension = selectedFile?.name?.split('.').pop();

    //             const file = {
    //                 id: uuid.v4(),
    //                 Base64: base64,
    //                 FileType: fileExtension,
    //                 FileName: selectedFile?.name,
    //             };

    //             setFileList(prev => [...prev, file]);
    //         } else {
    //             Alert.alert('Error', 'File size exceeds 5MB limit.');
    //         }
    //     } catch (err) {
    //         if (err?.code === errorCodes.OPERATION_CANCELED) return;
    //         Alert.alert('Error', String(err));
    //     }
    // };
const handlePickFile = async () => {
    try {
        const response = await pick({
            allowMultiSelection: false,
            type: [types.allFiles],
            ...(Platform.OS === 'ios' && { copyTo: 'cachesDirectory' }),
        });

        const selectedFile = response[0];

        if (selectedFile?.size && selectedFile.size <= 5 * 1024 * 1024) {
            let readUri = selectedFile.uri;

            if (Platform.OS === 'ios') {
                // Picker copies the file into app sandbox when copyTo is set.
                // Field name can be localUri or fileCopyUri depending on
                // @react-native-documents/picker version — log response[0]
                // once to confirm which one your installed version returns.
                const copiedUri = selectedFile.localUri || selectedFile.fileCopyUri;
                readUri = (copiedUri || selectedFile.uri).replace('file://', '');
            }

            const base64 = await RNBlobUtil.fs.readFile(readUri, 'base64');

            const fileExtension = selectedFile?.name?.split('.').pop();

            const file = {
                id: uuid.v4(),
                Base64: base64,
                FileType: fileExtension,
                FileName: selectedFile?.name,
            };

            setFileList(prev => [...prev, file]);
        } else {
            Alert.alert('Error', 'File size exceeds 5MB limit.');
        }
    } catch (err) {
        if (err?.code === errorCodes.OPERATION_CANCELED) return;
        console.log('Pick file error:', err);
        Alert.alert('Error', String(err));
    }
};
    const getMimeType = extension => {
        const mimeTypes = {
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            txt: 'text/plain',
            mp4: 'video/mp4',
            mp3: 'audio/mpeg',
        };
        return mimeTypes[extension?.toLowerCase()] ?? 'application/octet-stream';
    };

    const openBase64File = async (base64String, fileType, name) => {
        try {
            const ext = fileType?.toLowerCase().replace(/^\./, '') || 'txt';
            const fileName = `${name}.${ext}`;
            const path = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;

            await RNBlobUtil.fs.writeFile(path, base64String, 'base64');

            const exists = await RNBlobUtil.fs.exists(path);
            if (!exists) {
                Alert.alert('Error', 'File could not be created.');
                return;
            }

            if (Platform.OS === 'ios') {
                await RNBlobUtil.ios.openDocument(path);
            } else {
                await RNBlobUtil.android.actionViewIntent(path, getMimeType(ext));
            }
        } catch (error) {
            console.error('File open error:', error);
            Alert.alert('Error', 'Unable to open file.');
        }
    };

    const handleDeletePress = index => {
        const temp = JSON.parse(JSON.stringify(fileList));
        temp.splice(index, 1);
        setFileList(temp);
    };

    const handleSaveFile = () => {
        skipConfirmRef.current = true; 
        onSave(fileList);
        navigation.goBack();
    };

    const handleClosePress = () => {
        // goBack triggers the beforeRemove listener above, which handles
        // the unsaved-changes confirm the same way onRequestClose used to.
        navigation.goBack();
    };

    const renderFileList = ({ item, index }) => (
        <View key={index + 1} style={[styles.listBox]}>
            <View>
                <Text style={[styles.fileText, { marginRight: 10 }]}>{index + 1}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.fileText]}>{item?.FileName}</Text>
            </View>
            <View style={[styles.iconContainer]}>
                <TouchableOpacity style={[styles.iconBoxStyle]} onPress={() => openBase64File(item.Base64, item.FileType, item?.FileName)}>
                    <IconI name="eye-outline" size={22} color={COLORS.grey} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePress(index)}>
                    <IconM name="delete-outline" size={22} color={COLORS.ERROR} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (showCamer) {
        return <CameraScreen visible={showCamer} setShowCamera={setShowCamer} setFileList={setFileList} handleGetImageData={() => {}} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
                <View style={[styles.iconBox]}>
                    <Text style={[styles.titleText]} numberOfLines={1}>
                        Upload File's For {title}{' '}
                    </Text>
                    <TouchableOpacity style={[styles.closeIcon]} onPress={handleClosePress}>
                        <Icon name="close" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                {fileList.length ? (
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
                            disabled={disableBtn}
                            textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                            style={{ height: 40, width: '48%' }}
                            onPress={() => setShowCamer(true)}>
                            Camera
                        </ButtonComponent>
                        <ButtonComponent
                            disabled={disableBtn}
                            textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                            style={{ height: 40, width: '48%' }}
                            onPress={handlePickFile}>
                            Upload
                        </ButtonComponent>
                    </View>
                    <ButtonComponent textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }} style={{ height: 40 }} onPress={handleSaveFile}>
                        Save
                    </ButtonComponent>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', borderRadius: 3 },
    btnContainer: { padding: 10 },
    closeIcon: {
        backgroundColor: COLORS.apptheme,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    iconBox: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
    textContainer: { flex: 1, marginEnd: 20 },
    listBox: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.grey,
    },
    iconContainer: { flexDirection: 'row' },
    iconBoxStyle: { marginEnd: 10 },
    btnBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    fileText: { fontFamily: 'OpenSans-Regular', fontSize: 13, color: COLORS.headerText },
    titleText: { fontFamily: 'OpenSans-Bold', fontSize: 16, color: COLORS.headerText },
});

export default FileUploadScreen;
