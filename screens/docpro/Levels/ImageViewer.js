import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Modal, SafeAreaView, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import TextComponent from '../../../components/text';
import { IMAGES } from 'assets/images';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentListCard from './DocumentListCard';

const ImageViewer = ({ fileView, extenstion, modalVisible, setModalVisible }) => {
    const navigation = useNavigation();

    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [listStatus, setlistStatus] = useState(false);
    const closeModal = () => setModalVisible(false);

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal} // Called when back button is pressed on Android
            >
                <View style={styles.container}>
                    {extenstion == 'png' ? (
                        <Image
                            resizeMode="contain"
                            style={{ width: '100%', height: '100%' }}
                            source={{
                                uri: `data:image/png;base64,${fileView}`,
                            }}
                        />
                    ) : null}
                    {extenstion == 'jpeg' ? (
                        <Image
                            resizeMode="contain"
                            style={{ width: '100%', height: '100%' }}
                            source={{
                                uri: `data:image/jpeg;base64,${fileView}`,
                            }}
                        />
                    ) : null}
                    <View style={styles.bottomFixedView}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                marginLeft: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '20%',
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    closeModal();
                                }}>
                                <Icon name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <Button title="Close Modal" onPress={closeModal} /> */}
                </View>
            </Modal>
        </View>
    );
};

export default ImageViewer;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // padding: 16,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        widht: '100%',
        backgroundColor: 'lightgrey',
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    borderEnabled: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    detailsView: {
        flex: 3,
        borderLeftWidth: 4,
        paddingLeft: 8,
    },
    progressRound: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'lightgrey',
        borderWidth: 4,
    },
    floatingDiv: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    apqpTypeIcon: {
        width: 30,
        height: 17,
    },
    projectBoxContent: { marginLeft: '2%' },
    gridContainer: {
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        margin: 5, // Adjust margin for smaller grid items
        padding: 10, // Adjust padding based on grid size
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 14,
        textAlign: 'center', // Adjust text size for smaller grid items
    },
    bottomFixedView: {
        position: 'absolute',
        bottom: 0,
        left: '80%',
        right: 0,
        top: 10,
        // height: 60,
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'row',
        // backgroundColor: 'green',
    },
});
