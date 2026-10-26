// // import React, { useEffect, useRef, useState } from 'react';
// // import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Platform, useWindowDimensions } from 'react-native';

// // import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

// // import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { COLORS } from 'constants/theme-constants';
// // import { SafeAreaView } from 'react-native-safe-area-context';

// // const QRCodeScannerScreen = ({ modalVisible, hideModal = () => {}, handleScanData = () => {} }) => {
// //     const { height, width } = useWindowDimensions();
// //     const [hasCameraPermission, setHasCameraPermission] = useState(false);

// //     const device = useCameraDevice('back');

// //     const scanLockRef = useRef(false);

// //     const requestCameraPermission = async () => {
// //         try {
// //             const result = await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);

// //             const granted = result === RESULTS.GRANTED;

// //             setHasCameraPermission(granted);

// //             if (!granted) {
// //                 Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.');
// //             }
// //         } catch (error) {
// //             console.log(error);
// //         }
// //     };

// //     useEffect(() => {
// //         requestCameraPermission();
// //     }, []);

// //     const codeScanner = useCodeScanner({
// //         codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'code-39'],

// //         onCodeScanned: codes => {
// //             if (scanLockRef.current) {
// //                 return;
// //             }

// //             const value = codes?.[0]?.value;

// //             if (!value) {
// //                 return;
// //             }

// //             scanLockRef.current = true;

// //             Alert.alert(
// //                 'QR Code Scanned',
// //                 value,
// //                 [
// //                     {
// //                         text: 'Cancel',
// //                         style: 'cancel',
// //                         onPress: () => {
// //                             scanLockRef.current = false;
// //                         },
// //                     },
// //                     {
// //                         text: 'Submit',
// //                         onPress: () => {
// //                             handleScanData(value);

// //                             hideModal();

// //                             setTimeout(() => {
// //                                 scanLockRef.current = false;
// //                             }, 500);
// //                         },
// //                     },
// //                 ],
// //                 {
// //                     cancelable: false,
// //                 },
// //             );
// //         },
// //     });

// //     return (
// //         <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen" hardwareAccelerated onRequestClose={hideModal}>
// //             <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
// //                 <View style={styles.header}>
// //                     <TouchableOpacity style={styles.iconBox} onPress={hideModal}>
// //                         <Icon name="close" size={22} color={COLORS.moreIcon} />
// //                     </TouchableOpacity>
// //                 </View>

// //                 {hasCameraPermission && device ? (
// //                     <View style={styles.container}>
// //                         <Camera style={StyleSheet.absoluteFill} device={device} isActive={modalVisible} codeScanner={codeScanner} />

// //                         {/* Overlay */}
// //                         <View style={styles.overlay}>
// //                             <View style={[styles.scanBox, { height: height * 0.3, width: width * 0.8 }]} />
// //                         </View>

// //                         <View style={styles.footerContainer}>
// //                             <Text style={styles.footer}>Position the QR/Barcode within the frame</Text>
// //                         </View>
// //                     </View>
// //                 ) : (
// //                     <View style={styles.permissionContainer}>
// //                         <Text style={styles.permissionText}>Please grant camera access to use the scanner.</Text>
// //                     </View>
// //                 )}
// //             </SafeAreaView>
// //         </Modal>
// //     );
// // };

// // export default QRCodeScannerScreen;

// // const styles = StyleSheet.create({
// //     header: {
// //         position: 'absolute',
// //         top: Platform.OS === 'ios' ? 50 : 20,
// //         right: 20,
// //         zIndex: 9999,
// //     },

// //     container: {
// //         flex: 1,
// //         backgroundColor: '#000',
// //     },

// //     iconBox: {
// //         backgroundColor: COLORS.icBottomBox,
// //         width: 36,
// //         height: 36,
// //         borderRadius: 18,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },

// //     overlay: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },

// //     scanBox: {
// //         borderWidth: 3,
// //         borderRadius: 16,
// //         borderColor: COLORS.apptheme,
// //         backgroundColor: 'transparent',
// //     },

// //     footerContainer: {
// //         position: 'absolute',
// //         bottom: 70,
// //         width: '100%',
// //         alignItems: 'center',
// //     },

// //     footer: {
// //         color: '#FFFFFF',
// //         fontSize: 16,
// //         fontWeight: '600',
// //     },

// //     permissionContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },

// //     permissionText: {
// //         color: '#000',
// //         fontSize: 16,
// //         textAlign: 'center',
// //         paddingHorizontal: 20,
// //     },
// // });
// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Platform, useWindowDimensions } from 'react-native';

// import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { useNavigation } from '@react-navigation/native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { COLORS } from 'constants/theme-constants';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import IcSkeleton from './IcSkeleton';
// import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
// import NoDataFound from './NoDataFound';

// const QRCodeScannerScreen = ({
//     modalVisible,
//     hideModal = () => {},
//     handleScanData = () => {},
//     nextScreen = 'InspectionEntry', // change to whatever screen you want to navigate to
// }) => {
//     const { height, width } = useWindowDimensions();
//     const navigation = useNavigation();

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

//     // Resume scanning whenever the result modal is closed
//     const resumeScanning = () => {
//         // small delay avoids the same code being caught again in the same frame
//         setTimeout(() => {
//             scanLockRef.current = false;
//         }, 300);
//     };

//     // useEffect(() => {
//     //     let dummyvalue = '20784-1';
//     //     let dummyvalue1 = dummyvalue.split('-');
//     //     console.log('dummyvalue1', dummyvalue1);
//     //     let payload = { ProductionItemId: parseInt(dummyvalue1[0]), OperationId: parseInt(dummyvalue1[1]) };
//     //     navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
//     // }, []);
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

//             let dummyvalue1 = value.split('-');
//             let payload = { ProductionItemId: parseInt(dummyvalue1[0]), OperationId: parseInt(dummyvalue1[1]) };
//             hideModal();
//             navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
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

//     resultOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     resultBox: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#FFFFFF',
//         padding: 20,
//     },

//     resultTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#000',
//         marginBottom: 10,
//     },

//     resultValue: {
//         fontSize: 15,
//         color: '#333',
//         marginBottom: 20,
//     },

//     resultButtonRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },

//     resultBtn: {
//         flex: 1,
//         paddingVertical: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginHorizontal: 5,
//     },

//     closeBtn: {
//         backgroundColor: '#EFEFEF',
//     },

//     closeBtnText: {
//         color: '#333',
//         fontWeight: '600',
//     },

//     nextBtn: {
//         backgroundColor: COLORS.apptheme,
//     },

//     nextBtnText: {
//         color: '#FFFFFF',
//         fontWeight: '600',
//     },
// });





import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Platform, Linking, useWindowDimensions } from 'react-native';

import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from 'constants/theme-constants';
import { ROUTES } from 'constants/app-constant';

const QRCodeScannerScreen = ({ modalVisible, hideModal = () => {} }) => {
    const { height, width } = useWindowDimensions();
    const navigation = useNavigation();

    // VisionCamera's own permission API: no Podfile / setup_permissions needed
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const scanLockRef = useRef(false);

    // Request permission only when the scanner is opened (not on mount while hidden)
    useEffect(() => {
        if (!modalVisible) {
            return;
        }

        // Release the scan lock every time the scanner opens
        scanLockRef.current = false;

        if (hasPermission) {
            return;
        }

        (async () => {
            try {
                const granted = await requestPermission();
                if (!granted) {
                    Alert.alert('Permission Required', 'Camera permission is required to scan QR codes. You can enable it in Settings.', [
                        { text: 'Cancel', style: 'cancel', onPress: hideModal },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]);
                }
            } catch (error) {
                console.log('Camera permission error:', error);
            }
        })();
    }, [modalVisible, hasPermission]);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'code-39'],

        onCodeScanned: codes => {
            if (scanLockRef.current) {
                return;
            }

            const value = codes?.[0]?.value;
            if (!value) {
                return;
            }

            scanLockRef.current = true;

            // Expected format: "<ProductionItemId>-<OperationId>", e.g. "20784-1"
            const [itemId, operationId] = value.split('-').map(part => parseInt(part, 10));

            if (Number.isNaN(itemId) || Number.isNaN(operationId)) {
                Alert.alert('Invalid code', 'This QR/Barcode is not recognized.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // small delay avoids re-reading the same code in the same frame
                            setTimeout(() => {
                                scanLockRef.current = false;
                            }, 300);
                        },
                    },
                ]);
                return;
            }

            const payload = { ProductionItemId: itemId, OperationId: operationId };

            hideModal();

            // On iOS, navigating while the full-screen Modal is still dismissing can be dropped
            const delay = Platform.OS === 'ios' ? 400 : 0;
            setTimeout(() => {
                navigation.navigate(ROUTES.BARCODE_LIST, { barcodeValue: payload });
            }, delay);
        },
    });

    return (
        <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen" hardwareAccelerated onRequestClose={hideModal}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBox} onPress={hideModal}>
                        <Icon name="close" size={22} color={COLORS.moreIcon} />
                    </TouchableOpacity>
                </View>

                {hasPermission && device ? (
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
                        <Text style={styles.permissionText}>
                            {hasPermission ? 'No camera found on this device.' : 'Please grant camera access to use the scanner.'}
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

export default QRCodeScannerScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },

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
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});