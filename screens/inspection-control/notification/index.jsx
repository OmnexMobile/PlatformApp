import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconA from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import IcSkeleton from '../Components/IcSkeleton';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import NoDataFound from '../Components/NoDataFound';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from 'contexts/app-context';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import InputDataModal from '../Components/inspection-schedule/InputDataModal';
import { getInspectionDataByUserAndSite } from 'store/database/inspectStorage';

const data = {
    InspectionSchedules: [
        {
            OrderDetailsId: 6,
            OrderNumber: '',
            Description: '',
            ReferenceNo: '',
            PIHierarchy: ',1079,20787',
            OperationHierarchy: 'obi20787,obi20859,obi20799,obi20804,obi20806',
            OperationWSID: '18',
            ProductionQty: 100,
            SupplierId: 0,
            SupplierName: '',
            SupplierCode: '',
            CustomerId: 0,
            CustomerName: '',
            CustomerCode: '',
            InspectionLevelId: 0,
            InspectionLevel: 'NA',
            SamplingPlanId: 0,
            SamplingPlan: 'NA',
            DefectTypeId: 0,
            DefectTypeNumber: null,
            InspectionId: 0,
            Inspection: 'NA',
            TypeOfInspection: '2',
            LotNo: 'GLOBAL00444Lot',
            ReceiptNo: '',
            ProductionStartDate: '08/08/2025',
            ProductionStartTime: '09:00',
            ProductionEndTime: '17:30',
            StartDate: '02/19/2025',
            EndDate: '02/19/2026',
            ICInspectionEntryID: 0,
            ICInspectionLotDetailsID: 0,
            ICInspectionEntryDetailsID: 0,
            ProductionItemId: 20787,
            ProductionItem: '01_Battery Management',
            OperationName: 'Voltage Reading',
            OperationID: '20806',
            InspectionType: 'Aqua',
            ShiftId: null,
            FrequencyId: null,
            FormId: 271,
            canDownload: true,
            ReceivedQuantity: 100,
            InspectedQty: 251,
            LotSize: 0,
        },
        {
            OrderDetailsId: 6,
            OrderNumber: '',
            Description: '',
            ReferenceNo: '',
            PIHierarchy: ',1079,20787',
            OperationHierarchy: 'obi20787,obi20859,obi20799,obi20804,obi20807',
            OperationWSID: '19',
            ProductionQty: 100,
            SupplierId: 0,
            SupplierName: '',
            SupplierCode: '',
            CustomerId: 0,
            CustomerName: '',
            CustomerCode: '',
            InspectionLevelId: 0,
            InspectionLevel: 'NA',
            SamplingPlanId: 0,
            SamplingPlan: 'NA',
            DefectTypeId: 0,
            DefectTypeNumber: null,
            InspectionId: 0,
            Inspection: 'NA',
            TypeOfInspection: '2',
            LotNo: 'GLOBAL00444Lot',
            ReceiptNo: '',
            ProductionStartDate: '08/08/2025',
            ProductionStartTime: '09:00',
            ProductionEndTime: '17:30',
            StartDate: '02/19/2025',
            EndDate: '02/19/2026',
            ICInspectionEntryID: 0,
            ICInspectionLotDetailsID: 0,
            ICInspectionEntryDetailsID: 0,
            ProductionItemId: 20787,
            ProductionItem: '01_Battery Management',
            OperationName: 'Temperature Control',
            OperationID: '20807',
            InspectionType: 'Aqua',
            ShiftId: null,
            FrequencyId: null,
            FormId: 271,
            canDownload: true,
            ReceivedQuantity: 100,
            InspectedQty: 251,
            LotSize: 0,
        },
        {
            OrderDetailsId: 6,
            OrderNumber: '',
            Description: '',
            ReferenceNo: '',
            PIHierarchy: ',1079,20787',
            OperationHierarchy: 'obi20787,obi20859,obi20799,obi20804,obi20805',
            OperationWSID: '20',
            ProductionQty: 100,
            SupplierId: 0,
            SupplierName: '',
            SupplierCode: '',
            CustomerId: 0,
            CustomerName: '',
            CustomerCode: '',
            InspectionLevelId: 0,
            InspectionLevel: 'NA',
            SamplingPlanId: 0,
            SamplingPlan: 'NA',
            DefectTypeId: 0,
            DefectTypeNumber: null,
            InspectionId: 0,
            Inspection: 'NA',
            TypeOfInspection: '2',
            LotNo: 'GLOBAL00444Lot',
            ReceiptNo: '',
            ProductionStartDate: '08/08/2025',
            ProductionStartTime: '09:00',
            ProductionEndTime: '17:30',
            StartDate: '02/19/2025',
            EndDate: '02/19/2026',
            ICInspectionEntryID: 0,
            ICInspectionLotDetailsID: 0,
            ICInspectionEntryDetailsID: 0,
            ProductionItemId: 20787,
            ProductionItem: '01_Battery Management',
            OperationName: 'Current Measurement',
            OperationID: '20805',
            InspectionType: 'Aqua',
            ShiftId: null,
            FrequencyId: null,
            FormId: 271,
            canDownload: true,
            ReceivedQuantity: 100,
            InspectedQty: 251,
            LotSize: 0,
        },
    ],
    InspectionShifts: [
        {
            ShiftID: 2,
            ShiftName: 'Default',
            Fromtime: '9:00 am',
            Totime: '5:30 pm',
        },
    ],
};

const NotificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { payload } = route.params;
    const [storePayload, setStorePayload] = useState(null);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const { icUserData } = useSelector(state => state.inspection);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const {
        profile,
        sites: { selectedSite },
    } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [formList, setFormList] = useState({
        shiftList: [],
        frequencyList: [],
        personList: [],
    });
    const [showBubble, setShowBubble] = useState(false);
    useEffect(() => {
        if (isFocused && payload) {
            console.log(payload,'payloadnew')
            setStorePayload(payload);
            handleListFetch(payload);
        }
    }, [isFocused, payload]);
    console.log(storePayload,'storedpayload')
    const handleListFetch = async payload => {
        console.log('payloadtest', payload);
        setShowSkeleton(true);
        const data = await postAPI(`${ApiUrl.IC_NOTIFICATION_LIST}`, payload);
        console.log('datatest', data);
        if (data?.InspectionSchedules?.length) {
            const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
            let retunListData = [];
            if (data?.InspectionSchedules?.length) {
                let temp = data?.InspectionSchedules || [];
                const updatedArray = temp.map(item => {
                    const match = inspectList.some(
                        compareItem =>
                            compareItem.intProductionItemID === item.ProductionItemId &&
                            compareItem.OperationID == item.OperationID &&
                            compareItem?.OrderDetailsId == item?.OrderDetailsId,
                    );
                    return {
                        ...item,
                        isDownloaded: match,
                    };
                });
                const sortedSchedules = updatedArray.sort((a, b) => {
                    return new Date(b.ProductionStartDate) - new Date(a.ProductionStartDate);
                });
                retunListData = sortedSchedules;
                setMasterData(sortedSchedules || []);
                setOverAllData(sortedSchedules || []);
                let tempShift = data?.InspectionShifts.map(item => ({ ...item, label: item.ShiftName, value: item.ShiftID }));
                setFormList(pre => ({ ...pre, shiftList: tempShift || [] }));
                setShowSkeleton(false);
            }
        } else {
            setMasterData([]);
            setOverAllData([]);
            setShowSkeleton(false);
        }
        setShowSkeleton(false);
        return data?.InspectionSchedules || [];
    };
    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.HOME_FAB_VIEW }],
            });
        }
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const getOverAllSettings = async () => {
        const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`);
        if (settingsRes.Success) {
            dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
        }
    };
    const handleDownloadPress = async item => {
        setSelectedData(item);
        await getOverAllSettings();
        setShowModal(true);
    };
    const handleSubmitBtnPress = async val => {
        setShowBubble(true);
        const latestInspection = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        const apiData = await handleListFetch(storePayload);
        let filterTemp = apiData;
        let temp = [...filterTemp] || [];
        const updatedArray = temp.map(item => {
            const match = latestInspection.some(
                compareItem =>
                    compareItem.intProductionItemID === item.ProductionItemId &&
                    compareItem.OperationID == item.OperationID &&
                    compareItem?.OrderDetailsId == item?.OrderDetailsId,
            );
            return {
                ...item,
                isDownloaded: match,
            };
        });
        setMasterData(updatedArray);
        setShowBubble(false);
    };

    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.TypeOfInspection) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItem}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Invoice No : <Text style={[styles.secondText]}>{item?.OrderNumber ? item?.OrderNumber : '-'}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <Text style={[styles.secondText]}>{moment(item.ProductionStartDate, 'MM/DD/YYYY').format('DD/MM/YYYY')}</Text>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                if (item?.canDownload) {
                                    handleDownloadPress(item);
                                } else {
                                    showMessage({
                                        message: 'Template or operation mapping not done for this Production item, please do the mapping',
                                        backgroundColor: COLORS.WARNING,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 45,
                                        icon: 'danger',
                                        position: 'right',
                                        style: { height: 120, alignItems: 'flex-end' },
                                    });
                                }
                            }}>
                            <IconF name="download" size={25} color={item?.isDownloaded ? '#66BB6B' : '#666666'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.headerBox]}>
                <TouchableOpacity onPress={handleGoBack}>
                    <IconA name="arrowleft" size={25} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.headerText]} numberOfLines={1}>
                            Notifications <Text style={{ fontSize: 15 }}>{`(${selectedSite.SiteName})`}</Text>
                        </Text>
                    </View>
                </View>
            </View>
            {showSkeleton ? (
                <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
            ) : Boolean(masterData?.length) ? (
                <FlatList
                    data={masterData}
                    renderItem={renderData}
                    keyExtractor={(item, index) => index + 1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            ) : (
                <NoDataFound />
            )}
            {Boolean(showModal) && (
                <InputDataModal
                    selectedValue={selectedData}
                    modalVisible={showModal}
                    hideModal={() => {
                        setShowModal(false);
                    }}
                    handleSubmitPress={val => {
                        handleSubmitBtnPress(val);
                    }}
                    shiftData={formList.shiftList}
                    userData={icUserData?.userData}
                    selectedSite={selectedSite}
                />
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.icBackground,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contentContainer: {
        backgroundColor: COLORS.white,
        margin: 10,
        borderRadius: 10,
    },
    headerBox: {
        backgroundColor: COLORS.apptheme,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    rightIconList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 10,
    },
    headerText: {
        color: COLORS.white,
        fontSize: 20,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    btnContainer: {
        paddingTop: 10,
    },
    recordConatiner: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.icborder,
        flexDirection: 'row',
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
        fontFamily: 'OpenSans-SemiBold',
        color: COLORS.ictextBlack,
    },
    operationText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.ictextBlack,
        lineHeight: 22,
    },
    secondText: {
        color: COLORS.textDark,
        fontFamily: 'OpenSans-Regular',
    },
    iconlist: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    lastBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bottombox: {
        flexDirection: 'row',
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.icBottomBox,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    totalBox: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 4,
    },
    bottomText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.headerText,
    },
    filterBox: {
        width: '30%',
    },
    filterList: {
        width: '25%',
    },
    iconFilter: {
        width: '10%',
        alignItems: 'center',
    },
    overAllBox: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    getDataBox: {
        height: 35,
        width: 35,
        backgroundColor: COLORS.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
});
export default NotificationScreen;
