import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const PdfViewer = ({ pdffile, setpdfStatus }) => {
    const navigation = useNavigation();
    const base64String = pdffile;
    const type = 'pdf';
    
    useEffect(() => {
        if (base64String) {
            viewFile(base64String, type);
        }
    }, [base64String]); // Dependency array: will run when `base64String` changes

    const viewFile = async (base64Data, fileType) => {
        try {
            // Save the base64 data to a temporary file
            const path = `${RNFS.DocumentDirectoryPath}/tempfile.${fileType}`;
            await RNFS.writeFile(path, base64Data, 'base64');

            // Use FileViewer to open the file
            FileViewer.open(path)
                .then(() => {
                    // success, you can also update the pdf status here if necessary
                    setpdfStatus(false);
                })
                .catch(error => {
                    // error
                    Alert.alert('Error', `Failed to open file: ${error.message}`);
                    setpdfStatus(false);
                });
        } catch (error) {
            Alert.alert('Error', `Failed to save file: ${error.message}`);
            setpdfStatus(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Optional: You can add a custom header here */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
});

export default PdfViewer;
