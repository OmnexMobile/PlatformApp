import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import TextComponent from '../../../components/text';
import Icon from 'react-native-vector-icons/FontAwesome';
import ReqDetails from '../json/PendingReqDetails';
import ViewComponent from './ViewComponent';
import ApprovalStatusModal from './ApprovalStatusModal';
import CustomAlert from './Components/CustomAlert';
const DocProActionViewScreen = ({ setpendingListStatus, setisActionDetailsOn, ListStatus }) => {
    const [reqDetails, setreqDetails] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setalertVisible] = useState(false);

    useEffect(() => {
        console.log('Requestssss-----', ReqDetails);
        const pendingDetails = ReqDetails.response.loaded.request;
        setreqDetails(pendingDetails);
    });
    return (
        <View style={styles.container}>
            <View style={{ marginTop: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center', height: 50 }}>
                <TouchableOpacity
                    onPress={() => {
                        setpendingListStatus(false);
                    }}>
                    <Icon name="home" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
                </TouchableOpacity>

                <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>
                <TouchableOpacity
                    onPress={() => {
                        setisActionDetailsOn(false);
                    }}>
                    <Icon name="list" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
                </TouchableOpacity>
                <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>

                <TextComponent type={FONT_TYPE.BOLD} color={COLORS.black} fontSize={FONT_SIZE.LARGE} numberOfLines={1} style={{ marginLeft: 10 }}>
                    Request Details
                </TextComponent>
            </View>
            <View style={{ flex: 1 }}>
                <ViewComponent reqDetails={reqDetails} />
            </View>
            <View style={styles.footerView}>
                {ListStatus == 'PendingRequestList' ? null : (
                    <TouchableOpacity style={styles.footerOpacity}>
                        <Icon name="share-square-o" size={24} color="white" style={{ marginLeft: 15 }}></Icon>
                        <TextComponent
                            type={FONT_TYPE.BOLD}
                            color={COLORS.white}
                            fontSize={FONT_SIZE.NORMAL}
                            numberOfLines={1}
                            style={{ marginLeft: 10 }}>
                            Change Request
                        </TextComponent>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.footerOpacity}
                    onPress={() => {
                        setalertVisible(true);
                    }}>
                    <Icon name="trash" size={24} color="white" style={{ marginLeft: 15 }}></Icon>
                    <TextComponent
                        type={FONT_TYPE.BOLD}
                        color={COLORS.white}
                        fontSize={FONT_SIZE.NORMAL}
                        numberOfLines={1}
                        style={{ marginLeft: 10 }}>
                        Terminate
                    </TextComponent>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.floatingView}
                onPress={() => {
                    setModalVisible(true);
                }}>
                <Text style={styles.buttonText}>Status of Approval</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <ApprovalStatusModal setModalVisible={setModalVisible} />
            </Modal>
            {alertVisible ? <CustomAlert alertVisible={alertVisible} setalertVisible={setalertVisible} /> : null}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingView: {
        position: 'absolute',
        bottom: 100, // Distance from the bottom
        right: 20, // Distance from the right
        width: 60, // Width of the floating button
        height: 60, // Height of the floating button
        borderRadius: 30, // Makes it a circle
        backgroundColor: '#00c3d2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
    },
    footerView: {
        height: 100,
        backgroundColor: 'rgba(237,242,246,255)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerOpacity: {
        flex: 1,
        height: 50,
        backgroundColor: '#00c3d2',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
});

export default DocProActionViewScreen;
