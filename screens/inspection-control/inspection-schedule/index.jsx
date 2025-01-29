import { ButtonComponent } from 'components';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from 'constants/theme-constants';
import { useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import DataPickerWithIcon from '../Components/DataPickerWithIcon';
import FilterWithMenu from '../Components/FilterWithMenu';
import InputDataModal from '../Components/inspection-schedule/InputDataModal';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import { useAppContext } from 'contexts/app-context';
import moment from 'moment';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
import IcSkeleton from '../Components/IcSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import QRCodeScannerScreen from '../Components/QRCodeScannerScreen';
import NoDataFound from '../Components/NoDataFound';

const dummyData = [
    {
        ICInspectionEntryID: 1,
        ICInspectionLotDetailsID: 2,
        ICInspectionEntryDetailsID: 2,
        ProductionItemID: 21727,
        ProductionItemName: 'Battery Management System',
        OperationName: 'Voltage reading',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '2',
    },
    {
        ICInspectionEntryID: 2,
        ICInspectionLotDetailsID: 3,
        ICInspectionEntryDetailsID: 3,
        ProductionItemID: 31727,
        ProductionItemName: 'Battery Management System 1',
        OperationName: 'Voltage reading 1',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '2',
    },
    {
        ICInspectionEntryID: 3,
        ICInspectionLotDetailsID: 4,
        ICInspectionEntryDetailsID: 4,
        ProductionItemID: 43727,
        ProductionItemName: 'Battery Management System 2',
        OperationName: 'Voltage reading 2',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '1',
    },
    {
        ICInspectionEntryID: 4,
        ICInspectionLotDetailsID: 5,
        ICInspectionEntryDetailsID: 5,
        ProductionItemID: 56427,
        ProductionItemName: 'Battery Management System 3',
        OperationName: 'Voltage reading 3',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '3',
    },
    {
        ICInspectionEntryID: 5,
        ICInspectionLotDetailsID: 6,
        ICInspectionEntryDetailsID: 6,
        ProductionItemID: 72447,
        ProductionItemName: 'Battery Management System 4',
        OperationName: 'Voltage reading 4',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '1',
    },
    {
        ICInspectionEntryID: 6,
        ICInspectionLotDetailsID: 7,
        ICInspectionEntryDetailsID: 7,
        ProductionItemID: 91727,
        ProductionItemName: 'Battery Management System 5',
        OperationName: 'Voltage reading 5',
        OperationID: '21777',
        EnteredDate: '2024-05-23T18:13:34',
        InspectionType: '2',
    },
];
const filterList = [
    {
        id: 1,
        title: 'Receiving Inspection',
    },
    {
        id: 2,
        title: 'In-process Inspection',
    },
    {
        id: 3,
        title: 'Final Inspection',
    },
];
const moreList = [
    {
        id: 1,
        title: 'Get Schedule',
        iconName: 'calendar-check-o',
        iconFrom: 'FontAwesome',
    },
    {
        id: 2,
        title: 'Start Inspection',
        iconName: 'search',
        iconFrom: 'FontAwesome',
    },
];
const InspectionSchedule = () => {
    const { inspectList } = useSelector(state => state.inspection);
    const dispatch = useDispatch();
    const {
        profile,
        sites: { selectedSite },
    } = useAppContext();
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [filterData, setFilterData] = useState({
        startDate: moment().subtract(7, 'days').toDate(),
        endDate: new Date(),
        type: '',
    });
    const [showFileModal, setShowFileModal] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [showQR, setShowQR] = useState(false);

    setTimeout(() => {
        setShowSkeleton(false);
    }, 1000);
    const handleFilePress = () => {
        setShowFileModal(true);
    };

    const handleListFetch = (inspect = '') => {
        console.log('**********Called');
        setShowSkeleton(true);
        const { startDate, endDate, type } = filterData;
        let dateFlag = startDate !== '' && endDate !== '';
        const formData = new FormData();
        formData.append('UserID', profile?.UserId);
        formData.append('SiteID', parseInt(selectedSite?.Siteid));
        formData.append('LanguageID', 1);
        formData.append('StartDate', dateFlag ? startDate : '');
        formData.append('EndDate', dateFlag ? endDate : '');
        formData.append('InspectionType', inspect || type);
        if (dummyData.length) {
            setMasterData(dummyData);
        } else {
            setMasterData([]);
        }
    };

    // useEffect(() => {
    //     const { startDate, endDate } = filterData;
    //     if (startDate !== '' && endDate !== '') {
    //         handleListFetch();
    //     }
    // }, [filterData]);

    const handleInputChange = (key, value) => {
        setFilterData(pre => ({ ...pre, [key]: value }));
    };
    useEffect(() => {
        if (selectedSite?.Siteid) {
            handleListFetch();
        }
    }, [selectedSite?.Siteid]);

    const handleCIbtnpress = () => {
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
    };
    const handleDownloadPress = item => {
        setShowModal(true);
    };
    const handleMenuPress = value => {
        if (value.id == 2) {
            navigation.navigate(ROUTES.OPERATOR_WORKSHEET);
            return null;
        }
        if (value.id == 1) {
            const { startDate, endDate } = filterData;
            const tempStart = moment(startDate);
            const tempEnd = moment(endDate);
            if (tempStart.isBefore(tempEnd)) {
                handleListFetch();
            } else {
                showMessage({
                    message: 'Start Date must be less than End Date',
                    backgroundColor: COLORS.ERROR,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'danger',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                });
            }
        }
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.ciBgColor;
    };
    handleSubmitPress = () => {
        dispatch({ type: 'INSPECT_LIST', inspectList: masterData });
        setShowModal(false);
        showMessage({
            message: 'Form Downloaded Successfully',
            backgroundColor: COLORS.SUCCESS,
            color: COLORS.white,
            duration: 1500,
            statusBarHeight: 40,
            icon: 'success',
            position: 'right',
            style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
        });
    };
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.InspectionType) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Invoice No : <Text style={[styles.secondText]}>{item?.ProductionItemID}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <Text style={[styles.secondText]}>{moment(item.EnteredDate).format('DD/MM/YYYY')}</Text>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleFilePress();
                            }}>
                            <ICFileIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleDownloadPress(item);
                            }}>
                            <IconF name="download" size={25} color="#666666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader
            title="Inspection Schedule"
            activeTabId={1}
            handleQRPress={() => {
                setShowQR(true);
            }}>
            <View style={[styles.mainContainer]}>
                <View style={[styles.overAllBox]}>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.startDate || null}
                            onSelectedDate={val => {
                                handleInputChange('startDate', val);
                            }}
                        />
                    </View>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.endDate || null}
                            placeHolder="End Date"
                            onSelectedDate={val => {
                                handleInputChange('endDate', val);
                            }}
                        />
                    </View>
                    <View style={[styles.filterList]}>
                        <FilterWithMenu
                            dataList={filterList}
                            type="BtnFilter"
                            onSelectedPress={val => {
                                handleListFetch(val.title);
                                handleInputChange('type', val.title);
                            }}
                        />
                    </View>
                    <View style={[styles.iconFilter]}>
                        <FilterWithMenu
                            dataList={moreList}
                            type="IconFilter"
                            onSelectedPress={value => {
                                handleMenuPress(value);
                            }}
                        />
                    </View>
                </View>
                {showSkeleton ? (
                    <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
                ) : (
                    Boolean(masterData?.length)?<FlatList
                        data={masterData}
                        renderItem={renderData}
                        keyExtractor={item => item?.ICInspectionEntryID}
                        showsVerticalScrollIndicator={false}
                    />:<NoDataFound/>
                )}
                <View style={[styles.bottombox]}>
                    <Text style={[styles.bottomText]}>Total Inspections </Text>
                    <View style={[styles.totalBox]}>
                        <Text style={[styles.bottomText, { color: COLORS.white }]}>{masterData?.length}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        handleCIbtnpress();
                    }}>
                    Completed Inspections
                </ButtonComponent>
            </View>
            <InputDataModal
                modalVisible={showModal}
                hideModal={() => {
                    setShowModal(false);
                }}
                handleSubmitPress={handleSubmitPress}
            />
            <FileViewModal
                visible={showFileModal}
                onDismiss={() => {
                    setShowFileModal(false);
                }}
            />
            {Boolean(showQR) && (
                <QRCodeScannerScreen
                    modalVisible={showQR}
                    hideModal={() => {
                        setShowQR(false);
                    }}
                />
            )}
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
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
    },
    overAllBox: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default InspectionSchedule;
