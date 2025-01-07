import { ButtonComponent, TextComponent } from 'components';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useState } from 'react';
import { Divider, Modal } from 'react-native-paper';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import { RFPercentage } from 'helpers/utils';
import PartDetails from '../Components/supervisor-schedule/PartDetails';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
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
        value: 'Recieving Inspections',
        label: 'Recieving Inspections',
    },
    {
        id: 2,
        value: 'In-process Inspections',
        label: 'In-process Inspections',
    },
    {
        id: 3,
        value: 'Final Inspections',
        label: 'Final Inspections',
    },
];
const SupervisorSchedule = () => {
    const navigation = useNavigation();
    const [showFilterList, setShowFilterList] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('');
    const [showEye,setShowEye]=useState(false);
    const[showFileModal,setShowFileModal]=useState(false)
    const handleEyePress=()=>{
      setShowEye(true)
    }
    const hideModal = () => {
        setShowFilterList(false);
    };
    const handleFilePress=()=>{
      setShowFileModal(true)
    }
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
                        Inspection Date : <Text style={[styles.secondText]}>{item.createdDate}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity style={styles.launchCard}>
                        <Text style={[styles.launchText]}>Awaiting</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleEyePress()}>
                            <IconI name="eye-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleFilePress()}>
                            <ICFileIcon />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{navigation.navigate(ROUTES.INPROCESS_INSPECTION)}}>
                            <IconM name="battery-plus-variant" size={27} color="#666666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader
            title="Supervisor Schedule"
            activeTabId={4}
            handleFilterPress={() => {
                setShowFilterList(true);
            }}>
            <View style={[styles.container]}>
                <FlatList data={listData} renderItem={renderItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} />
            </View>
            <View style={[styles.bottombox]}>
                <Text style={[styles.bottomText]}>Total Inspections </Text>
                <View style={[styles.totalBox]}>
                    <Text style={[styles.bottomText, { color: COLORS.white }]}>{listData?.length}</Text>
                </View>
            </View>
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
                    }}>
                    Completed Inspections
                </ButtonComponent>
            </View>
            <Modal visible={showFilterList} onDismiss={hideModal} contentContainerStyle={[styles.modalConatiner]}>
                <View style={[styles.modalcontainer]}>
                    <View style={[styles.modalBoxOne]}>
                        <Text style={[styles.headerText]}>Supervisor Schedule</Text>
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
            <PartDetails visible={showEye} onDismiss={()=>{setShowEye(false)}} />
            <FileViewModal visible={showFileModal} onDismiss={()=>{setShowFileModal(false)}} />
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginBottom: 7,
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
        backgroundColor: COLORS.apptheme,
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
        paddingTop: 7,
    },
    totalBox: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 4,
    },
    bottomText: {
        fontSize: 14,
        fontFamily: 'ProximaNova-Bold',
    },
    bottombox: {
        flexDirection: 'row',
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.icBottomBox,
        borderRadius: 10,
    },
    modalBoxOne: {
        paddingHorizontal: 20,
        paddingTop:20
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    headerText: {
        fontFamily: 'ProximaNova-Bold',
        fontSize: 18,
        marginBottom: 13,
    },
    contentBox: {
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
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
});

export default SupervisorSchedule;
