import { ButtonComponent, CheckBox, RadioButton, TextComponent } from 'components';
import React, { useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import IconO from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import ICCheckBox from '../Components/ICCheckBox';
const listData = [
    {
        id: 1,
        title: '0906 Engine',
        OperationName: '2-Stroke Engine',
        InvoiceNo: 3,
        createdDate: '04/06/2024',
        isDownloaded: false,
    },
    {
        id: 2,
        title: '1000 IC Test',
        OperationName: '5-Stroke Engine',
        InvoiceNo: 4,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 3,
        title: '200 IC Test',
        OperationName: '6-Stroke Engine',
        InvoiceNo: 6,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 4,
        title: '400 IC Test',
        OperationName: '9-Stroke Engine',
        InvoiceNo: 7,
        createdDate: '01/07/2024',
        isDownloaded: false,
    },
    {
        id: 5,
        title: '100 TC Test',
        OperationName: '9-Stroke Engine',
        InvoiceNo: 8,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 6,
        title: '9000 IC Test',
        OperationName: '900-Stroke Engine',
        InvoiceNo: 9,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 51,
        title: '100 TC Test',
        OperationName: '9-Stroke Engine',
        InvoiceNo: 8,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 16,
        title: '9000 IC Test',
        OperationName: '900-Stroke Engine',
        InvoiceNo: 9,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 7,
        title: '100 TC Test',
        OperationName: '9-Stroke Engine',
        InvoiceNo: 8,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
    {
        id: 9,
        title: '9000 IC Test',
        OperationName: '900-Stroke Engine',
        InvoiceNo: 9,
        createdDate: '03/07/2024',
        isDownloaded: false,
    },
];
const optionsList = [
    {
        id: 1,
        value: 'Sync',
        label: 'Sync',
    },
    {
        id: 2,
        value: 'Accept Lot',
        label: 'Accept Lot',
    },
    {
        id: 3,
        value: 'Reject Lot',
        label: 'Reject Lot',
    },
    {
        id: 4,
        value: 'Accept Lot / Submit Inspection',
        label: 'Accept Lot / Submit Inspection',
    },
    {
        id: 5,
        value: 'Reject Lot / Submit Inspection',
        label: 'Reject Lot / Submit Inspection',
    },
];

const CompletedInspection = () => {
    const [syncModal, setSyncModal] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Sync');
    const [checkBox,setCheckBox]=useState(false)
    const navigation = useNavigation();
    const handleISbtnpress = () => {
        navigation.navigate(ROUTES.INSPECTION_SCHEDULE);
    };
    const handleSyncPress = () => {
        setSyncModal(true);
    };
    const hideModal = () => {
        setSyncModal(false);
    };
    const renderItem = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.title}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Frequency : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity style={styles.launchCard}>
                        <Text style={[styles.launchText]}>Completed</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                handleSyncPress();
                            }}>
                            <IconO name="sync" size={20} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <IconA name="delete" size={20} color={COLORS.ERROR} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader title="Completed Inspection" activeTabId={3} handleSyncPress={handleSyncPress}>
            <View style={[styles.container]}>
                <FlatList data={listData} renderItem={renderItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} />
            </View>
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        handleISbtnpress();
                    }}>
                    Inspection Schedule
                </ButtonComponent>
            </View>
            <Modal visible={syncModal} onDismiss={hideModal} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.containerOne]}>
                        <Text style={styles.headertext}>Choose Sync Options</Text>
                        <Divider />
                        <View style={[styles.contentBox]}>
                            {optionsList.map(item => {
                                return (
                                    <View style={{ marginVertical: 10 }} key={item.id}>
                                        <RadioButtonComponent
                                            lable={item.label}
                                            value={selectedRadio}
                                            onChange={val => {
                                                setSelectedRadio(val);
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                        <View>
                            <ICCheckBox isChecked={checkBox} label='Supervisor Approved' onChange={()=>{
                                setCheckBox(!checkBox)
                            }}/>
                        </View>
                    </View>
                    <View>
                        <Divider />
                        <View style={styles.btnConatiner}>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={() => {}}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recordConatiner: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
    },
    iconBox: {
        borderRadius: 40,
        backgroundColor: COLORS.apptheme,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 16,
        fontFamily: 'ProximaNova-Bold',
        color: COLORS.ictextBlack,
    },
    operationText: {
        fontSize: 14,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.ictextBlack,
        lineHeight: 22,
    },
    secondText: {
        color: COLORS.textDark,
        fontFamily: 'ProximaNova-Regular',
    },
    launchCard: {
        backgroundColor: COLORS.SUCCESS,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
    launchText: {
        color: '#fff',
        fontFamily: 'ProximaNova-Bold',
    },
    lastBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    btnContainer: {
        paddingTop: 10,
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    containerOne: {
        padding: 20,
    },
    headertext: {
        fontFamily: 'ProximaNova-Bold',
        fontSize: RFPercentage(2.2),
        paddingBottom: 12,
    },
    contentBox: {
        paddingVertical: 15,
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
});

export default CompletedInspection;
