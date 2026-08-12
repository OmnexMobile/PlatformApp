import { COLORS } from 'constants/theme-constants';
import { RFPercentage, RFValue } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Platform, Share, ActivityIndicator } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import FileViewer from 'react-native-file-viewer';
import RNBlobUtil from 'react-native-blob-util';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import NoDataFound from '../NoDataFound';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FileViewModal = ({ visible = false, onDismiss = () => { }, selectedValue = {}, userData = {} }) => {
    const [fileList, setFileList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const insets = useSafeAreaInsets();

    // const handleFileViewPress = async (fileName, url, fileExtension) => {
    //     try {
    //         // Define the file path (change extension based on file type)
    //         let fileNameText = fileName.split('.');
    //         const filePath = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileNameText[0]}.${fileExtension}`;

    //         // Write the Base64 string to a file
    //         await RNBlobUtil.fs.writeFile(filePath, url, 'base64');

    //         // Open the file using FileViewer
    //         await FileViewer.open(filePath);
    //     } catch (error) {
    //         Alert.alert('Error', 'Failed to open file: ' + error.message);
    //     }
    // };
        const getAllFiles = async () => {
        setShowLoader(true);
        const formData = new FormData();
        formData.append('operationId', selectedValue?.OperationID);
        formData.append('productionItemH', selectedValue?.ProductionItemId);
        formData.append('SiteId', userData?.Siteid || '');
        const response = await postAPI(ApiUrl.IC_GET_ATTACHEMENTS, formData);
        if (response.Success) {
            setFileList(response.Data || []);
        } else {
            setFileList([]);
        }
        setShowLoader(false);
    };
    useEffect(() => {
        if (Object.keys(selectedValue)?.length) {
            getAllFiles();
        }
    }, [selectedValue]);
    const getMimeType = (extension) => {
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
    const handleFileViewPress = async (fileName, fileContentBase64, fileExtension) => {
        try {
            // Define the path to save the file
            const filePath = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}.${fileExtension}`;

            // Write the base64 content to a file
            await RNBlobUtil.fs.writeFile(filePath, fileContentBase64, 'base64');

            // Open the file with the device's default viewer
            if (Platform.OS === 'ios') {
                await RNBlobUtil.ios.openDocument(filePath);
            } else {
                await RNBlobUtil.android.actionViewIntent(filePath, getMimeType(fileExtension));
            }
        } catch (error) {
            // console.error('Error viewing file:', error);
            // Alert.alert('Error', 'Unable to open the file.');
            Alert.alert('Error', 'Failed to open file: ' + error.message);
        }
    };

    const requestPermsion = async item => {
        const isAndroid11OrAbove = Platform.OS === 'android' && Platform.Version >= 30;
        const permission = Platform.select({
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
            android: isAndroid11OrAbove ? null : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        });

        let granted = true;

        if (permission) {
            let status = await check(permission);
            if (status === RESULTS.DENIED) {
                status = await request(permission);
            }

            if (status === RESULTS.BLOCKED) {
                Alert.alert(
                    'Permission Blocked',
                    'Storage permission is blocked. Please enable it from Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => openSettings() },
                    ]
                );
                granted = false;
            } else if (status !== RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'Storage permission is required to download files.');
                granted = false;
            }
        }

        if (granted) {
            await handleDownloadLocal(item?.FileName, item.FileContentBase64, item.FileExtension);
        }
    };

    const getUniqueFilePath = async (dir, originalBaseName, extension) => {
        let baseName = originalBaseName;
        let fileName = `${baseName}.${extension}`;
        let filePath = `${dir}/${fileName}`;
        let counter = 1;

        const namePattern = /(.*)\((\d+)\)$/;

        while (await RNBlobUtil.fs.exists(filePath)) {
            const match = baseName.match(namePattern);

            if (match) {
                baseName = `${match[1]}(${parseInt(match[2], 10) + 1})`;
            } else {
                baseName = `${originalBaseName}(${counter})`;
            }

            fileName = `${baseName}.${extension}`;
            filePath = `${dir}/${fileName}`;
            counter++;
        }

        return { fileName, filePath };
    };


    const handleDownloadLocal = async (fileNameValue, base64Data, fileExtension) => {
        try {
            const dir =
                Platform.OS === 'android'
                    ? RNBlobUtil.fs.dirs.DownloadDir
                    : RNBlobUtil.fs.dirs.TemporaryDir;

            const fileNameText = fileNameValue?.split('.')[0] || 'File';
            const ext = fileExtension || fileNameValue?.split('.').pop() || 'txt';

            const { fileName, filePath } = await getUniqueFilePath(dir, fileNameText, ext);

            await RNBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

            if (Platform.OS === 'android') {
                // ✅ Notify media store so file appears in Downloads
                await RNBlobUtil.android.addCompleteDownload({
                    title: fileName,
                    description: 'File downloaded successfully',
                    mime: getMimeType(ext),
                    path: filePath,
                    showNotification: true,
                });

                showMessage({
                    message: 'File saved successfully',
                    backgroundColor: COLORS.SUCCESS,
                    color: COLORS.white,
                    duration: 1500,
                });
            } else {
                const result = await Share.share({
                    url: 'file://' + filePath,
                    title: fileName,
                });

                if (result.action === Share.sharedAction) {
                    showMessage({
                        message: 'File saved successfully',
                        backgroundColor: COLORS.SUCCESS,
                        color: COLORS.white,
                        duration: 1500,
                    });
                }
            }

            return filePath;
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', `Failed to save file: ${error.message}`);
        }
    };
    const renderFiles = ({ item, index }) => {
        return (
            <View style={[styles.fileContainer]} key={index + 1}>
                <View style={[styles.iconConatiner]}>
                    <Icon name="file-document-outline" size={25} color={COLORS.white} />
                </View>
                <View style={[styles.textContainer]}>
                    <Text style={[styles.fileText]}>{item?.FileName}</Text>
                </View>
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        handleFileViewPress(item?.FileName, item.FileContentBase64, item.FileExtension);
                    }}>
                    <IconF name="eye" size={25} color={COLORS.grey} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={async () => {
                        await requestPermsion(item);
                    }}>
                    <IconF name="download" size={25} color={COLORS.grey} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalConatiner]}>
            <View style={[styles.modalcontainer]}>
                <View style={[styles.modalBoxOne]}>
                    <Text style={[styles.headerText]}>{selectedValue?.ProductionItem || ''} - Attachments</Text>
                    <Divider />

                    <View style={[styles.contentBox]}>
                        {Boolean(showLoader) ? (
                            <View style={[styles.loaderStyle]}>
                                <ActivityIndicator size="large" color="#12C0CF" />
                            </View>
                        ) : Boolean(fileList.length) ? (
                            <FlatList data={fileList} renderItem={renderFiles} showsVerticalScrollIndicator={false} />
                        ) : (
                            <View style={{ height: 170 }}>
                                <NoDataFound />
                            </View>
                        )}
                    </View>
                </View>
                <View>
                    <Divider />
                    <View style={styles.btnConatiner}>
                        <TouchableOpacity style={styles.cancelConatiner} onPress={onDismiss}>
                            <Text style={styles.btnStyle}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    modalBoxOne: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        marginBottom: 13,
        color: COLORS.ictextBlack,
    },
    contentBox: {
        paddingVertical: 15,
        maxHeight: RFValue(300),
    },
    boxOne: {
        width: '49%',
        backgroundColor: COLORS.icborder,
        padding: 10,
        borderRadius: 3,
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
    },
    iconConatiner: {
        backgroundColor: COLORS.apptheme,
        padding: 10,
        borderRadius: 100,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    fileText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.ictextBlack,
    },
    loaderStyle: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
    },
});
export default FileViewModal;
