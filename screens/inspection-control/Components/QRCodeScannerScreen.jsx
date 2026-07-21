// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Platform, useWindowDimensions } from 'react-native';

// import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { COLORS } from 'constants/theme-constants';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const QRCodeScannerScreen = ({ modalVisible, hideModal = () => {}, handleScanData = () => {} }) => {
//     const { height, width } = useWindowDimensions();
//     const [hasCameraPermission, setHasCameraPermission] = useState(false);

//     const device = useCameraDevice('back');

//     const scanLockRef = useRef(false);

//     const requestCameraPermission = async () => {
//         try {
//             const result = await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);

//             const granted = result === RESULTS.GRANTED;

//             setHasCameraPermission(granted);

//             if (!granted) {
//                 Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.');
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         requestCameraPermission();
//     }, []);

//     const codeScanner = useCodeScanner({
//         codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'code-39'],

//         onCodeScanned: codes => {
//             if (scanLockRef.current) {
//                 return;
//             }

//             const value = codes?.[0]?.value;

//             if (!value) {
//                 return;
//             }

//             scanLockRef.current = true;

//             Alert.alert(
//                 'QR Code Scanned',
//                 value,
//                 [
//                     {
//                         text: 'Cancel',
//                         style: 'cancel',
//                         onPress: () => {
//                             scanLockRef.current = false;
//                         },
//                     },
//                     {
//                         text: 'Submit',
//                         onPress: () => {
//                             handleScanData(value);

//                             hideModal();

//                             setTimeout(() => {
//                                 scanLockRef.current = false;
//                             }, 500);
//                         },
//                     },
//                 ],
//                 {
//                     cancelable: false,
//                 },
//             );
//         },
//     });

//     return (
//         <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen" hardwareAccelerated onRequestClose={hideModal}>
//             <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
//                 <View style={styles.header}>
//                     <TouchableOpacity style={styles.iconBox} onPress={hideModal}>
//                         <Icon name="close" size={22} color={COLORS.moreIcon} />
//                     </TouchableOpacity>
//                 </View>

//                 {hasCameraPermission && device ? (
//                     <View style={styles.container}>
//                         <Camera style={StyleSheet.absoluteFill} device={device} isActive={modalVisible} codeScanner={codeScanner} />

//                         {/* Overlay */}
//                         <View style={styles.overlay}>
//                             <View style={[styles.scanBox, { height: height * 0.3, width: width * 0.8 }]} />
//                         </View>

//                         <View style={styles.footerContainer}>
//                             <Text style={styles.footer}>Position the QR/Barcode within the frame</Text>
//                         </View>
//                     </View>
//                 ) : (
//                     <View style={styles.permissionContainer}>
//                         <Text style={styles.permissionText}>Please grant camera access to use the scanner.</Text>
//                     </View>
//                 )}
//             </SafeAreaView>
//         </Modal>
//     );
// };

// export default QRCodeScannerScreen;

// const styles = StyleSheet.create({
//     header: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 50 : 20,
//         right: 20,
//         zIndex: 9999,
//     },

//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },

//     iconBox: {
//         backgroundColor: COLORS.icBottomBox,
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     overlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     scanBox: {
//         borderWidth: 3,
//         borderRadius: 16,
//         borderColor: COLORS.apptheme,
//         backgroundColor: 'transparent',
//     },

//     footerContainer: {
//         position: 'absolute',
//         bottom: 70,
//         width: '100%',
//         alignItems: 'center',
//     },

//     footer: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: '600',
//     },

//     permissionContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     permissionText: {
//         color: '#000',
//         fontSize: 16,
//         textAlign: 'center',
//         paddingHorizontal: 20,
//     },
// });
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Platform, useWindowDimensions } from 'react-native';

import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from 'constants/theme-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import IcSkeleton from './IcSkeleton';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import NoDataFound from './NoDataFound';

const QRCodeScannerScreen = ({
    modalVisible,
    hideModal = () => {},
    handleScanData = () => {},
    nextScreen = 'InspectionEntry', // change to whatever screen you want to navigate to
}) => {
    const { height, width } = useWindowDimensions();
    const navigation = useNavigation();

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const device = useCameraDevice('back');
    const scanLockRef = useRef(false);

    const requestCameraPermission = async () => {
        try {
            const result = await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
            const granted = result === RESULTS.GRANTED;
            setHasCameraPermission(granted);
            if (!granted) {
                Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        requestCameraPermission();
    }, []);

    // Resume scanning whenever the result modal is closed
    const resumeScanning = () => {
        // small delay avoids the same code being caught again in the same frame
        setTimeout(() => {
            scanLockRef.current = false;
        }, 300);
    };

    // useEffect(() => {
    //     let dummyvalue = '20784 27';
    //     let dummyvalue1 = dummyvalue.split(' ');
    //     console.log('dummyvalue1', dummyvalue1);
    //     let payload = { ProductionItemId: parseInt(dummyvalue1[0]), OperationId: parseInt(dummyvalue1[1]) };
    //     navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
    // }, []);
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'code-39'],

        onCodeScanned: codes => {
            navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
            if (scanLockRef.current) {
                return;
            }
            const value = codes?.[0]?.value;
            if (!value) {
                return;
            }

            scanLockRef.current = true;

            let dummyvalue1 = value.split(' ');
            let payload = { ProductionItemId: parseInt(dummyvalue1[0]), OperationId: parseInt(dummyvalue1[1]) };
            navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
        },
    });

    return (
        <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen" hardwareAccelerated onRequestClose={hideModal}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBox} onPress={hideModal}>
                        <Icon name="close" size={22} color={COLORS.moreIcon} />
                    </TouchableOpacity>
                </View>

                {hasCameraPermission && device ? (
                    <View style={styles.container}>
                        <Camera style={StyleSheet.absoluteFill} device={device} isActive={modalVisible} codeScanner={codeScanner} />

                        {/* Overlay */}
                        <View style={styles.overlay}>
                            <View style={[styles.scanBox, { height: height * 0.3, width: width * 0.8 }]} />
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footer}>Position the QR/Barcode within the frame</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.permissionContainer}>
                        <Text style={styles.permissionText}>Please grant camera access to use the scanner.</Text>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

export default QRCodeScannerScreen;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 20,
        zIndex: 9999,
    },

    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    iconBox: {
        backgroundColor: COLORS.icBottomBox,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scanBox: {
        borderWidth: 3,
        borderRadius: 16,
        borderColor: COLORS.apptheme,
        backgroundColor: 'transparent',
    },

    footerContainer: {
        position: 'absolute',
        bottom: 70,
        width: '100%',
        alignItems: 'center',
    },

    footer: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    permissionText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    resultOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    resultBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },

    resultTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
    },

    resultValue: {
        fontSize: 15,
        color: '#333',
        marginBottom: 20,
    },

    resultButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    resultBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    closeBtn: {
        backgroundColor: '#EFEFEF',
    },

    closeBtnText: {
        color: '#333',
        fontWeight: '600',
    },

    nextBtn: {
        backgroundColor: COLORS.apptheme,
    },

    nextBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});