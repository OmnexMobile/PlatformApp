import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const FileViewModal = ({ visible = false, onDismiss = () => {} }) => {
    const handleFileViewPress = async (fileName, fileType) => {
        // Example directory path for saving the file
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        try {
            // Example files - Replace with URLs or local assets as needed
            let fileUrl;
            switch (fileType) {
                case 'pdf':
                    fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                    break;
                case 'image':
                    fileUrl = 'https://www.w3schools.com/w3images/fjords.jpg';
                    break;
                default:
                    throw new Error('Unsupported file type');
            }

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
    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalConatiner]}>
            <View style={[styles.modalcontainer]}>
                <View style={[styles.modalBoxOne]}>
                    <Text style={[styles.headerText]}>Crank Shaft - Details</Text>
                    <Divider />
                    <View style={[styles.contentBox]}>
                        <View style={[styles.fileContainer]}>
                            <View style={[styles.iconConatiner]}>
                                <Icon name="file-document-outline" size={25} color={COLORS.white} />
                            </View>
                            <View style={[styles.textContainer]}>
                                <Text style={[styles.fileText]}>Process Segment Processecvrerv</Text>
                            </View>
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                onPress={() => {
                                    handleFileViewPress('dummy.pdf', 'pdf');
                                }}>
                                <IconF name="eye" size={25} color={COLORS.grey} />
                            </TouchableOpacity>
                        </View>
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
        fontFamily: 'ProximaNova-Bold',
        fontSize: 18,
        marginBottom: 13,
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
        fontFamily: 'ProximaNova-Bold',
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
        fontFamily: 'ProximaNova-Bold',
        fontSize: RFPercentage(1.7),
    },
});
export default FileViewModal;
