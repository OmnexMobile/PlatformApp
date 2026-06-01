import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import { Modal } from 'react-native-paper';
import React, { useEffect, useRef } from 'react';
import SignatureScreen from 'react-native-signature-canvas';
import { RFPercentage } from 'helpers/utils';
import { COLORS } from 'constants/theme-constants';
import { useState } from 'react';

const SignatureComponent = ({ modalVisible = false, hideModal = () => {}, infoData = {}, setInfoData = () => {}, signType = '' }) => {
    const ref = useRef();
    const [savedSignature, setSavedSignature] = useState(null);
    useEffect(() => {
        if (infoData && signType !== '') {
            setSavedSignature(signType == '1' ? infoData.supervisorSignature || null : infoData.inspectorSignature || null);
        } else {
            setSavedSignature(null);
        }
    }, [infoData, signType]);
    // Callback when signature is submitted
    const handleSignature = signature => {
        if (signType == '1') {
            setInfoData(pre => ({ ...pre, supervisorSignature: signature }));
        } else {
            setInfoData(pre => ({ ...pre, inspectorSignature: signature }));
        }
    };

    // Clear signature
    const handleClear = () => {
        ref.current.clearSignature();
        setSavedSignature(null);
    };

    // Save signature
    const handleSave = () => {
        ref.current.readSignature();
    };
    const webStyle = savedSignature
        ? `
      .m-signature-pad {
        background-image: url(${savedSignature});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        box-shadow: none;
        border: none;
      }
        .m-signature-pad--body {border: none;border-bottom:1px solid gray}
        .m-signature-pad--footer {display: none; margin: 0px;}
    `
        : `.m-signature-pad {
        background-image: url(${savedSignature});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        box-shadow: none;
        border: none;
      }
        .m-signature-pad--body {border: none;border-bottom:1px solid gray}
        .m-signature-pad--footer {display: none; margin: 0px;}`;
    return (
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <View style={[styles.container]}>
                <SignatureScreen
                    bgHeight={200}
                    ref={ref}
                    onOK={handleSignature} // Called when "Done" button is pressed
                    onClear={() => console.log('Signature cleared!')}
                    webStyle={webStyle}
                />
                <View style={[styles.btnBox]}>
                    <TouchableOpacity style={[styles.btnStyle]} onPress={handleClear}>
                        <Text style={styles.btnText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnStyle]} onPress={handleSave}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 3,
        height: RFPercentage(43),
    },
    btnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    btnStyle: {
        backgroundColor: COLORS.apptheme,
        width: '48%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    btnText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'OpenSans-SemiBold',
    },
});

export default SignatureComponent;
