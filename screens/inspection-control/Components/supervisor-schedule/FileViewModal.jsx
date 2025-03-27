import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';

const FileViewModal = ({ visible = false, onDismiss = () => {}, selectedValue = {} }) => {
    const [fileList, setFileList] = useState([]);
    
    const handleFileViewPress = async (fileName, url) => {
        // Example directory path for saving the file
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        try {
            // Example files - Replace with URLs or local assets as needed
            // let fileUrl;
            // switch (fileType) {
            //     case 'pdf':
            //         fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
            //         break;
            //     case 'image':
            //         fileUrl = 'https://www.w3schools.com/w3images/fjords.jpg';
            //         break;
            //     default:
            //         throw new Error('Unsupported file type');
            // }
            let fileUrl=url
            // Download the file
            const downloadResult = await RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: filePath,
            }).promise;

            if (downloadResult.statusCode === 200) {
                // Open the file
                await FileViewer.open(filePath);
            } else {
                Alert.alert('Error', 'Failed to download the file');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to open the file');
        }
    };
    const getAllFiles = async () => {
        const formData = new FormData();
        formData.append('operationId', selectedValue?.OperationID);
        formData.append('productionItemH', selectedValue?.ProductionItemId);
        const response = await postAPI(ApiUrl.IC_GET_ATTACHEMENTS, formData);
        if (response.Success) {
            setFileList(response.Data || []);
        } else {
            setFileList([]);
        }
        console.log(response, 'response');
    };
    useEffect(() => {
        if (Object.keys(selectedValue)?.length) {
            getAllFiles();
        }
    }, [selectedValue]);
    const renderFiles = ({ item, index }) => {
        return (
            <View style={[styles.fileContainer]} key={index+1}>
                <View style={[styles.iconConatiner]}>
                    <Icon name="file-document-outline" size={25} color={COLORS.white} />
                </View>
                <View style={[styles.textContainer]}>
                    <Text style={[styles.fileText]}>{item?.FileName}</Text>
                </View>
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        handleFileViewPress(item?.FileName,item.FilePath);
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
                        <FlatList data={fileList} renderItem={renderFiles} />
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
});
export default FileViewModal;
