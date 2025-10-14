import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, SafeAreaView, Text, View, Platform, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SamplingPlan from './SamplingPlan';
import SwitchInspection from './SwitchInspection';

const SamplingModal = ({ visible, handleClose = () => {} }) => {
    const [selectTab, setSelectTab] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const handleCloseCall = () => {
        if (modalVisible) {
            setModalVisible(false);
        } else {
            handleClose();
        }
    };
    return (
        <Modal
            visible={visible}
            transparent={false} // full screen
            onDismiss={() => {
                handleCloseCall();
            }}
            onRequestClose={() => {
                handleCloseCall();
            }}
            contentContainerStyle={[styles.modalContainer]}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.transparentGreyDark} />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
                    <View style={[styles.iconBox]}>
                        <TouchableOpacity style={[styles.closeIcon]} onPress={() => handleClose()}>
                            <Icon name="arrowleft" size={25} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={[styles.rowcenter]}>
                            <TouchableOpacity
                                onPress={() => setSelectTab(1)}
                                style={{
                                    borderBottomColor: selectTab === 1 ? COLORS.apptheme : COLORS.transparent,
                                    borderBottomWidth: selectTab === 1 ? 2 : 0,
                                    paddingBottom: 5,
                                }}>
                                <Text style={[styles.titleText, { color: selectTab === 1 ? COLORS.apptheme : COLORS.textBlack }]}>Sampling Plan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setSelectTab(2)}
                                style={{
                                    borderBottomColor: selectTab === 2 ? COLORS.apptheme : COLORS.transparent,
                                    borderBottomWidth: selectTab === 2 ? 2 : 0,
                                    paddingBottom: 5,
                                }}>
                                <Text style={[styles.titleText, { color: selectTab === 2 ? COLORS.apptheme : COLORS.textBlack }]}>
                                    Switch Inspection
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {selectTab === 1 ? (
                        <SamplingPlan modalVisible={modalVisible} setModalVisible={setModalVisible} />
                    ) : (
                        <SwitchInspection modalVisible={modalVisible} setModalVisible={setModalVisible} />
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    btnContainer: {
        padding: 10,
    },
    closeIcon: {
        backgroundColor: COLORS.apptheme,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    iconBox: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginEnd: 20,
    },
    titleText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        color: COLORS.textBlack,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    rowcenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
});
export default SamplingModal;
