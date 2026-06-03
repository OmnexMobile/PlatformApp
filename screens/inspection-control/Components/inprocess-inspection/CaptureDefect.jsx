import { COLORS } from 'constants/theme-constants';
import React from 'react'
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import IconMM from 'react-native-vector-icons/MaterialIcons';


const CaptureDefect = ({ visible=false, onRequestClose=() => {} }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onRequestClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>View Image Attachment with Sample</Text>
                        <TouchableOpacity
                            style={[styles.deleteIcon]}
                            onPress={() => {
                                onRequestClose();
                            }}>
                            <IconMM name="close" size={25} color={COLORS.apptheme} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>

                        </View>
                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </Modal>
    )
}
const styles = StyleSheet.create({
    deleteIcon: {
        marginLeft: 10,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    title: {
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        color: '#000',
    },

    close: {
        color: 'red',
        fontSize: 16,
    },

    content: {
        flex: 1,
    },
})
export default CaptureDefect