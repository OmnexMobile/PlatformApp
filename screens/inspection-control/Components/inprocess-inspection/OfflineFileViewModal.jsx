import { COLORS } from 'constants/theme-constants';
import { RFPercentage, RFValue } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Platform, Share } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Bubbles } from 'react-native-loader';
import NoDataFound from '../NoDataFound';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';

const OfflineFileViewModal = ({ list = [], visible = false, onDismiss = () => {} }) => {
    const [fileList, setFileList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const handleFileViewPress = async (fileName, url, fileExtension) => {
        try {
            // Define the file path (change extension based on file type)
            let fileNameText = fileName.split('.');
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileNameText[0]}.${fileExtension}`;

            // Write the Base64 string to a file
            await RNFS.writeFile(filePath, url, 'base64');

            // Open the file using FileViewer
            await FileViewer.open(filePath);
        } catch (error) {
            Alert.alert('Error', 'Failed to open file: ' + error.message);
        }
    };
    useEffect(() => {
        if (list?.length) {
            setFileList([...list]);
        } else {
            setFileList([]);
        }
    }, [list]);
    const handleDownloadLocal = async (fileName, base64Data, fileExtension) => {
        try {
            const fileNameText = fileName.split('.')[0];
            const fullFileName = `${fileNameText}.${fileExtension}`;

            if (Platform.OS === 'android') {
                const filePath = `${RNFS.DownloadDirectoryPath}/${fullFileName}`;
                await RNFS.writeFile(filePath, base64Data, 'base64');
                showMessage({
                    message: 'File saved successfully',
                    backgroundColor: COLORS.SUCCESS,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'success',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                });
                return filePath;
            } else {
                const filePath = `${RNFS.TemporaryDirectoryPath}/${fullFileName}`;
                await RNFS.writeFile(filePath, base64Data, 'base64');

                const result = await Share.share({
                    url: 'file://' + filePath,
                    message: `Download ${fullFileName}`,
                    title: fullFileName,
                });
                if (result.action === Share.sharedAction) {
                    showMessage({
                        message: 'File saved successfully',
                        backgroundColor: COLORS.SUCCESS,
                        color: COLORS.white,
                        duration: 1500,
                        statusBarHeight: 40,
                        icon: 'success',
                        position: 'right',
                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                    });
                }

                return filePath;
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', `Failed to save file: ${error.message}`);
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
                Alert.alert('Permission Blocked', 'Storage permission is blocked. Please enable it from Settings.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => openSettings() },
                ]);
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
                    <Text style={[styles.headerText]}>Attachments</Text>
                    <Divider />

                    <View style={[styles.contentBox]}>
                        {Boolean(showLoader) ? (
                            <View style={[styles.loaderStyle]}>
                                <Bubbles size={10} color="#12C0CF" />
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
        fontSize: 18,
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
        fontSize: 18,
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
        fontSize: 16,
        color: COLORS.ictextBlack,
    },
    loaderStyle: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
    },
});
export default OfflineFileViewModal;
