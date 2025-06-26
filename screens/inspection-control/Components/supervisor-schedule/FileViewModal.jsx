import { COLORS } from 'constants/theme-constants';
import { RFPercentage, RFValue } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Bubbles } from 'react-native-loader';
import NoDataFound from '../NoDataFound';

const FileViewModal = ({ visible = false, onDismiss = () => {}, selectedValue = {} }) => {
    const [fileList, setFileList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const handleFileViewPress = async (fileName, url,fileExtension) => {
        try {
            // Define the file path (change extension based on file type)
            let fileNameText=fileName.split('.');
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileNameText[0]}.${fileExtension}`;

            // Write the Base64 string to a file
            await RNFS.writeFile(filePath, url, 'base64');

            // Open the file using FileViewer
            await FileViewer.open(filePath);
        } catch (error) {
            Alert.alert('Error', 'Failed to open file: ' + error.message);
        }

    //     let fileNameText=fileName.split('.');
    //     console.log(fileNameText[0])
    //     try {
    //     // Define the local file path (change extension based on file type)
    //     const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileNameText[0]}.${fileExtension}`;

    //     // Download the file
    //     const options = {
    //       fromUrl: url,
    //       toFile: localFilePath,
    //       background: true,
    //     };

    //     const downloadResult = await RNFS.downloadFile(options).promise;

    //     // Check if the file downloaded successfully
    //     if (downloadResult.statusCode === 200) {
    //       // Open the downloaded file
    //       await FileViewer.open(localFilePath);
    //     } else {
    //       throw new Error('Failed to download file');
    //     }
    //   } catch (error) {
    //     Alert.alert('Error', 'Failed to open file: ' + error.message);
    //   }
    };
    const getAllFiles = async () => {
        setShowLoader(true);
        const formData = new FormData();
        formData.append('operationId', selectedValue?.OperationID);
        formData.append('productionItemH', selectedValue?.ProductionItemId);
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
                        handleFileViewPress(item?.FileName, item.FileContentBase64,item.FileExtension);
                    }}>
                    <IconF name="eye" size={25} color={COLORS.grey} />
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
        fontSize: RFPercentage(1.8),
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
        fontSize: RFPercentage(1.7),
        color: COLORS.ictextBlack,
    },
    loaderStyle: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
    },
});
export default FileViewModal;
