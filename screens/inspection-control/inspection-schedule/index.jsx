import { ButtonComponent } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from 'constants/theme-constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';

const filterList = [
    {
        id: 0,
        title: 'All',
    },
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
    const { inspectList, icUserData, icSettings } = useSelector(state => state.inspection);
    const inspectionRef = useRef(inspectList);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
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
    const [overAllData, setOverAllData] = useState([]);
    const [showQR, setShowQR] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedData, setSelectedData] = useState({});
    const [formList, setFormList] = useState({
        shiftList: [],
        frequencyList: [],
        personList: [],
    });

    // Keep it updated
    useEffect(() => {
        inspectionRef.current = inspectList;
    }, [inspectList]);

    const handleFilePress = item => {
        let temp = {
            ProductionItem: item.ProductionItem,
            OperationID: item.OperationID,
            ProductionItemId: item.ProductionItemId,
        };
        setSelectedData(temp);
        setShowFileModal(true);
    };
    const getOverAllSettings = async () => {
        const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`);
        if (settingsRes.Success) {
            dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
        }
    };
    const handleListFetch = async (inspect = null, showSktn = true, filterType = '') => {
        showSktn && setShowSkeleton(true);
        const { startDate, endDate, type } = filterData;
        let dateFlag = startDate !== '' && endDate !== '';
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        // formData.append('UserID', 7);
        formData.append('SiteID', parseInt(icUserData?.userData?.Siteid));
        formData.append('LanguageID', 1);
        formData.append('StartDate', dateFlag ? moment(startDate).format('MM/DD/YYYY') : '');
        formData.append('EndDate', dateFlag ? moment(endDate).format('MM/DD/YYYY') : '');
        // formData.append('InspectionType', inspect !== null ? inspect : type);
        const response = await postAPI(`${ApiUrl.IC_GET_IS}`, formData);
        await getOverAllSettings();
        if (response.Success) {
            let temp = response?.Data?.InspectionSchedules || [];
            const updatedArray = temp.map(item => {
                const match = inspectList.some(compareItem => compareItem.intProductionItemID === item.ProductionItemId);
                return {
                    ...item,
                    isDownloaded: match,
                };
            });
            if (filterType !== '') {
                let filterTemp = updatedArray.filter(item => item.TypeOfInspection == filterType);
                setMasterData(filterTemp || []);
            } else {
                setMasterData(updatedArray || []);
            }
            setOverAllData(updatedArray || []);
            let tempShift = response?.Data?.InspectionShifts.map(item => ({ ...item, label: item.ShiftName, value: item.ShiftID }));
            setFormList(pre => ({ ...pre, shiftList: tempShift || [] }));
        } else {
            setMasterData([]);
            setOverAllData([]);
        }
        setRefreshing(false);
        showSktn && setShowSkeleton(false);
    };
    const handleInputChange = (key, value, filter) => {
        setFilterData(pre => ({ ...pre, [key]: value }));
        handleFilterInspection(value, filter);
    };
    const handleFilterInspection = (value, filtertype) => {
        let temp = JSON.parse(JSON.stringify(overAllData));
        let tempSearch = [];
        if (value !== '' && filtertype == 'typeFilter') {
            tempSearch = temp.filter(item => item.TypeOfInspection == value);
        } else {
            tempSearch = temp;
        }
        if (search.length) {
            tempSearch = tempSearch.filter(
                item =>
                    item.ProductionItem.toLowerCase().includes(search.toLowerCase()) ||
                    item.OperationName.toLowerCase().includes(search.toLowerCase()),
            );
        }
        setMasterData(tempSearch);
    };
    useEffect(() => {
        if (icUserData && isFocused) {
            handleListFetch(null, true);
        }
    }, [icUserData, isFocused]);
    const handleCIbtnpress = () => {
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
    };
    const handleDownloadPress = async item => {
        setSelectedData(item);
        await getOverAllSettings();
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
                handleListFetch(null);
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
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
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
                    <Text style={[styles.secondText]}>{moment(new Date(item.ProductionStartDate)).format('DD/MM/YYYY')}</Text>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleFilePress(item);
                            }}>
                            <ICFileIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleDownloadPress(item);
                            }}>
                            <IconF name="download" size={25} color={item.isDownloaded ? '#66BB6B' : '#666666'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    const onRefresh = () => {
        setRefreshing(true);
        setSearch('');
        handleListFetch(null, false, filterData.type);
    };
    const handleSearch = value => {
        let temp = JSON.parse(JSON.stringify(overAllData));
        if (value.length) {
            const tempSearch = temp.filter(
                item =>
                    item.ProductionItem.toLowerCase().includes(value.toLowerCase()) || item.OperationName.toLowerCase().includes(value.toLowerCase()),
            );
            setMasterData(tempSearch);
        } else {
            setMasterData(overAllData);
        }
    };
    useEffect(() => {
        var handler;
        if (search.length && isFocused) {
            handler = setTimeout(() => {
                handleSearch(search);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [search, isFocused]);
    const handleSubmitBtnPress = () => {
        const latestInspection = inspectionRef.current;
        let temp = [...overAllData] || [];
        const updatedArray = temp.map(item => {
            const match = latestInspection.some(compareItem => compareItem.intProductionItemID === item.ProductionItemId);
            return {
                ...item,
                isDownloaded: match,
            };
        });
        setMasterData(updatedArray);
    };
    return (
        <CustomHeader
            title="Inspection Schedule"
            activeTabId={1}
            handleQRPress={() => {
                setShowQR(true);
            }}
            hideSearch={isFocused}
            handleSearch={value => {
                setSearch(value);
                if (!value?.length) {
                    handleSearch('');
                }
            }}
            searchValue={search}
            handleClosePress={() => {
                console.log('close prsss');
            }}>
            <View style={[styles.mainContainer]}>
                <View style={[styles.overAllBox]}>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.startDate || null}
                            onSelectedDate={val => {
                                handleInputChange('startDate', val, 'dateFilter');
                            }}
                        />
                    </View>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.endDate || null}
                            placeHolder="End Date"
                            onSelectedDate={val => {
                                handleInputChange('endDate', val, 'dateFilter');
                            }}
                        />
                    </View>
                    <View style={[styles.filterList]}>
                        <FilterWithMenu
                            dataList={filterList}
                            type="BtnFilter"
                            onSelectedPress={val => {
                                // handleListFetch(val.id != 0 ? val.id : '');
                                handleInputChange('type', val.id != 0 ? val.id : '', 'typeFilter');
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
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderData}
                        keyExtractor={(item, index) => index + 1}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
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
            {Boolean(showModal) && (
                <InputDataModal
                    selectedValue={selectedData}
                    modalVisible={showModal}
                    hideModal={() => {
                        setShowModal(false);
                    }}
                    handleSubmitPress={() => {
                        handleSubmitBtnPress();
                    }}
                    shiftData={formList.shiftList}
                    userData={icUserData?.userData}
                />
            )}
            {Boolean(showFileModal) && (
                <FileViewModal
                    selectedValue={selectedData}
                    visible={showFileModal}
                    onDismiss={() => {
                        setShowFileModal(false);
                    }}
                />
            )}
            {Boolean(showQR) && (
                <QRCodeScannerScreen
                    modalVisible={showQR}
                    hideModal={() => {
                        setShowQR(false);
                    }}
                    handleScanData={val => {
                        handleSearch(val);
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
