import React, { useEffect, useState } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ScrollView } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from 'constants/theme-constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import DataPickerWithIcon from '../Components/DataPickerWithIcon';
import FilterWithMenu from '../Components/FilterWithMenu';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import { useAppContext } from 'contexts/app-context';
import moment from 'moment';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
import IcSkeleton from '../Components/IcSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import NoDataFound from '../Components/NoDataFound';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Divider, Modal } from 'react-native-paper';
import { Bubbles } from 'react-native-loader';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import PartDetails from '../Components/supervisor-schedule/PartDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { addInspectionData, getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import ICCheckBox from '../Components/ICCheckBox';
import SingleDropDown from '../Components/SingleDropDown';
import DynamicFormField from '../Components/DynamicFormField';

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
const searchFilterList = [
    {
        id: 1,
        label: 'Production Item',
        isSelected: true,
    },
    // {
    //     id: 2,
    //     label: 'Refrence No',
    //     isSelected: false,
    // },
    {
        id: 3,
        isSelected: false,
        label: 'Operation',
    },
    {
        id: 4,
        isSelected: false,
        label: 'Lot No',
    },
    // {
    //     id: 5,
    //     isSelected: false,
    //     label: 'Lot Size',
    // },
    // {
    //     id: 6,
    //     isSelected: false,
    //     label: 'Sample Frequency',
    // },
    // {
    //     id: 7,
    //     isSelected: false,
    //     label: 'Inspector(s)',
    // },
    {
        id: 8,
        isSelected: false,
        label: 'Status',
    },
];
const searchFilterOptions = [
    {
        id: 1,
        title: 'ProductionItemName',
        label: 'Production Item',
        type: 'search',
        value: 'Production Item',
    },
    {
        id: 2,
        title: 'OperationName',
        label: 'Operation',
        type: 'search',
        value: 'Operation',
    },
    {
        id: 3,
        title: 'LotNo',
        label: 'Lot No',
        type: 'search',
        value: 'Lot No',
    },
    {
        id: 4,
        label: 'Refrence No',
        title: 'ReferenceNo',
        type: 'singleDropDown',
        value: 'Refrence No',
    },
    {
        id: 5,
        label: 'Lot Size',
        title: 'LotSize',
        type: 'search',
        value: 'Lot Size',
    },
    {
        id: 6,
        label: 'Sample Frequency',
        title: 'SampleFrequency',
        type: 'search',
        value: 'Sample Frequency',
    },
];
const SearchInspection = () => {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const { icUserData, dateFormat } = useSelector(state => state.inspection);
    const uiDateFormat = dateFormat || 'DD/MM/YYYY';
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const {
        profile,
        sites: { selectedSite },
    } = useAppContext();
    const navigation = useNavigation();
    const [showSearchFilter, setShowSearchFilter] = useState(false);
    const [filterData, setFilterData] = useState({
        startDate: moment().subtract(7, 'days').toDate(),
        endDate: new Date(),
        type: 0,
    });
    const [searchFilter, setSearchFilter] = useState({
        searchBy: 'Production Item',
        searchText: '',
    });
    const [showFileModal, setShowFileModal] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [showBubble, setShowBubble] = useState(false);
    const [searchList, setSearchList] = useState([...searchFilterList]);
    const [refreshing, setRefreshing] = useState(false);
    const [showEye, setShowEye] = useState(false);
    const [selectedSeachOptions, setSelectedSeachOptions] = useState([
        {
            id: 1,
            title: '',
            label: '',
            searchBy: '',
            searchText: '',
        },
    ]);
    const [showMutiSearchFilter, setShowMutiSearchFilter] = useState(false);

    const handleEyePress = value => {
        setSelectedData(value);
        setShowEye(true);
    };

    const handleFilePress = item => {
        let temp = {
            ProductionItem: item.ProductionItemName,
            OperationID: item.OperationID,
            ProductionItemId: item.ProductionItemId,
        };
        setSelectedData(temp);
        setShowFileModal(true);
    };
    useEffect(() => {
        if (isFocused && icUserData) {
            handleListFetch(true);
        }
    }, [filterData, isFocused, icUserData]);
    useEffect(() => {
        return () => {
            setSelectedSeachOptions([
                {
                    id: 1,
                    title: '',
                    label: '',
                    searchBy: '',
                    searchText: '',
                },
            ]);
        };
    }, [isFocused]);
    const addIsDownloadKey = async temp => {
        const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        let filtered = inspectList.filter(item => item?.userType === 'SearchInspection');
        const updatedArray = temp.map(item => {
            const match = filtered.some(compareItem => compareItem.ID === item.ID);
            return {
                ...item,
                isDownloaded: match,
            };
        });
        return updatedArray;
    };
    const handleListFetch = async (showSktn = true, notRefresh = true) => {
        showSktn && setShowSkeleton(true);
        const { startDate, endDate, type } = filterData;
        let dateFlag = startDate !== '' && endDate !== '';
        const formData = new FormData();
        formData.append('UserId', icUserData?.userData?.UserId);
        formData.append('siteId', parseInt(icUserData?.userData?.Siteid));
        formData.append('InspectionType', type == 0 ? '' : type);
        formData.append('StartDate', dateFlag ? moment(startDate).format('YYYY/MM/DD') : '');
        formData.append('EndDate', dateFlag ? moment(endDate).format('YYYY/MM/DD') : '');
        const response = await postAPI(`${ApiUrl.IC_GET_SEARCH_INSPECTIONLIST}`, formData);
        if (response.Success && response?.Data?.length) {
            let temp = response?.Data || [];
            const updatedArray = await addIsDownloadKey(temp);
            if (searchFilter.searchText !== '' && notRefresh) {
                let temp = updatedArray.filter(x =>
                    x[getSearchKey(searchFilter.searchBy)].toLowerCase().includes(searchFilter.searchText.toLowerCase()),
                );
                setMasterData([...temp]);
            } else {
                setMasterData([...updatedArray]);
            }
            setOverAllData([...updatedArray]);
        } else {
            setMasterData([]); // no more data
            setOverAllData([]);
        }
        setShowSkeleton(false);
        setRefreshing(false);
    };
    const getItemStatus = (list, isSamplePopup, input) => {
        if (isSamplePopup) {
            const allValues = list?.length > 0 && list?.every(({ value }) => value?.trim() !== '');
            const someValues = list?.some(({ value }) => value?.trim() !== '');
            let status = allValues ? 'Completed' : someValues ? 'In Progress' : 'Inspect';
            return status;
        } else {
            console.log(input, 'input');
            let temp = input?.filter(x => x?.Required && x?.Value == '')?.length;
            let tempAllValue = input?.filter(x => x?.Required && x?.Value != '')?.length;
            let tempReq = input?.filter(x => x?.Required)?.length;
            let status = temp == 0 ? 'Completed' : tempAllValue != 0 && tempReq > tempAllValue ? 'In Progress' : 'Inspect';
            return status;
        }
    };
    const getContainmentList = (list, item) => {
        if (Boolean(list?.length)) {
            const highValue = item.CHighValue || '';
            const lowValue = item.CLowValue || '';
            const tolerance = item.CTolerance || 0;
            let finalval = list.map((value, index) => ({
                count: index + 1,
                highValue: highValue,
                id: index + 1,
                lowValue: lowValue,
                ContainmentValue: value.ContainmentValue,
                actualValue: item.value,
                tolerance: tolerance,
                ContainmentComment: value.ContainmentComment,
                isEditable: index + 1 == 1 ? true : false,
                isCommentsEditable: index + 1 == 1 ? true : false,
                showBtn: index + 1 == 1 ? true : false,
                ContainmentID: index + 1,
                ContainmentNumber: value.ContainmentNumber,
                Type: value.Type,
                BackColorForContainment: value.BackColorForContainment,
                FontColorForContainment: value.FontColorForContainment,
            }));
            return finalval;
        }
        return [];
    };
    const transformInspectionData = (input, isNumericSample) => {
        const result = [];
        input.forEach(item => {
            const sampleSize = parseInt(item.CSampleSize || 0);
            const highValue = item.CHighValue || '';
            const lowValue = item.CLowValue || '';
            const tolerance = item.CTolerance || 0;
            let Samples = [];
            for (let i = 1; i <= sampleSize; i++) {
                const sample = item.samples?.find(s => parseInt(s.SampleName) === i);
                const data = sample?.Data;
                Samples.push({
                    Comments: data?.Comments || '',
                    EnteredDate: data?.EnteredDate || '',
                    FuncDetailsId: parseInt(data?.FuncDetailsId || 0),
                    FunctionValue: data?.FunctionValue || '',
                    IsApproved: parseInt(data?.IsApproved || 0),
                    IsNumericSample: isNumericSample,
                    IsRejected: parseInt(data?.IsRejected || 1),
                    SerialNo: parseInt(data?.SerialNo || i),
                    backColor: data?.BackColor || '',
                    count: i,
                    fontColor: data?.FontColor || '#FFFFFF',
                    highValue: highValue,
                    id: i,
                    lowValue: lowValue,
                    sampleName: i,
                    status: parseInt(data?.Status || 1),
                    tolerance: tolerance,
                    value: data?.FunctionValue || '',
                    ContainmentActions: getContainmentList(sample?.ContainmentActions, item),
                });
            }
            let isSamplePopup = Array.isArray(item.charInfo) && item.charInfo.some(c => c.PropertyName === 'ActualValue');
            const status = getItemStatus(Samples, isSamplePopup, item.charInfo);
            result.push({
                ...item,
                isSamplePopup: isSamplePopup,
                Samples: isSamplePopup ? Samples : [],
                status: status,
            });
        });
        return result;
    };

    // Example usage:
    const rendetBtnText = item => {
        const combined = [...item?.VariableCharacteristics, ...item?.AttributeCharacteristics];
        if (!combined.some(item => 'status' in item)) {
            return {
                status: 'launch',
                colorCode: COLORS.apptheme,
            };
        }
        let hasInprogress = false;
        let hasCompleted = false;
        let hasMissingStatus = false;

        for (const item of combined) {
            if ('status' in item) {
                if (item.status === 'In Progress') {
                    hasInprogress = true;
                } else if (item.status === 'Completed') {
                    hasCompleted = true;
                }
            } else {
                hasMissingStatus = true;
            }
        }
        if (hasInprogress) return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        if (hasCompleted && hasMissingStatus) return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        if (hasCompleted && !hasMissingStatus) return { colorCode: COLORS.fiBgColor, status: 'Completed' };

        return {
            status: 'launch',
            colorCode: COLORS.apptheme,
        };
    };
    const handleDownloadPress = async item => {
        if (item?.isDownloaded) {
            setShowBubble(true);
            const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
            let filtered = inspectList.filter(val => val?.ID === item?.ID);
            navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: filtered[0] || {} });
            setShowBubble(false);
        } else {
            setShowBubble(true);
            setSelectedData(item);
            const formData = new FormData();
            formData.append('UserId', icUserData?.userData?.UserId);
            formData.append('siteId', parseInt(icUserData?.userData?.Siteid));
            formData.append('inspectionID', item.ID);
            formData.append('FormId', item.FormId);
            formData.append('FormName', item?.FormName);
            formData.append('operationIDs', item.OperationID);
            formData.append('ProcessId', item.InspectionType == '2' ? 1 : 0);
            formData.append('isProcess', item.InspectionType == '2' ? 1 : 0);
            const attachments = await getAllFiles(item);
            const response = await postAPI(`${ApiUrl.IC_SEARCH_INSPECTION_DOWNLOAD}`, formData);
            if (response?.GeneralInfo?.length || response?.VariableCharacteristics?.length || response?.AttributeCharacteristics?.length) {
                const VariableCharacteristicsList = transformInspectionData(response.VariableCharacteristics, 1);
                const AttributeCharacteristicsList = transformInspectionData(response.AttributeCharacteristics, 0);
                const getStatus = rendetBtnText({
                    VariableCharacteristics: VariableCharacteristicsList,
                    AttributeCharacteristics: AttributeCharacteristicsList,
                });
                let inspectObj = {
                    uniqueId: uuid.v4(),
                    ID: item?.ID,
                    InspectionID: item.ID,
                    InspectionEntryDetailsID: item?.ICInspectionEntryDetailsID,
                    intInspectionTypeID: item?.InspectionType,
                    FormId: item?.FormId,
                    OperationID: item?.OperationID,
                    intProductionItemID: item?.ProductionItemId,
                    strProductionItemName: item?.ProductionItemName,
                    intShiftID: item?.ShiftId,
                    strShiftName: item?.Shift,
                    strOperationName: item.OperationName,
                    strFrequencyName: item?.SampleFrequency,
                    intInspectionTypeID: item?.InspectionType,
                    strInspectionType: item.InspectionType,
                    strLotNo: item.LotNo,
                    GeneralInfo: response.GeneralInfo,
                    VariableCharacteristics: VariableCharacteristicsList,
                    AttributeCharacteristics: AttributeCharacteristicsList,
                    userType: 'SearchInspection',
                    attachments: attachments,
                    userId: selectedSite?.UserId,
                    siteId: selectedSite?.Siteid,
                    status: getStatus?.status,
                    colorCode: getStatus?.colorCode,
                };

                await addInspectionData(selectedSite?.UserId, selectedSite?.Siteid, inspectObj.uniqueId, inspectObj);
                handleListFetch(false, false);
                showMessage({
                    message: 'Form Downloaded Successfully',
                    backgroundColor: COLORS.SUCCESS,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'success',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
                });
                setShowBubble(false);
                navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: inspectObj });
            } else {
                console.log('response', response);
                showMessage({
                    message: 'Something went wrong',
                    backgroundColor: COLORS.ERROR,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'warning',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
                });
                setShowBubble(false);
            }
        }
    };
    const getAllFiles = async item => {
        const formData = new FormData();
        formData.append('operationId', item?.OperationID);
        formData.append('productionItemH', item?.ProductionItemId);
        const response = await postAPI(ApiUrl.IC_GET_ATTACHEMENTS, formData);
        if (response.Success) {
            return response.Data || [];
        } else {
            return [];
        }
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderBackgroundColor = value => {
        switch (value) {
            case 'In Progress':
                return COLORS.ipBgColor;
            case 'Accepted':
                return COLORS.fiBgColor;
            case 'Rejected':
                return COLORS.red;
            default:
                return COLORS.apptheme;
        }
    };
    const handleSearchFilterSubmit = () => {
        setShowSearchFilter(false);
        const tempFilter = searchList.filter(x => x.isSelected)[0];
        setSearchFilter(pre => ({ ...pre, searchBy: tempFilter?.label }));
    };
    useEffect(() => {
        var handler;
        if (searchFilter.searchText && searchFilter.searchBy) {
            handler = setTimeout(() => {
                handleSearchList(searchFilter.searchText, searchFilter.searchBy);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [searchFilter]);
    const getSearchKey = (searchBy = '') => {
        switch (searchBy) {
            case 'Production Item':
                return 'ProductionItemName';
            case 'Operation':
                return 'OperationName';
            case 'Lot No':
                return 'LotNo';
            case 'Status':
                return 'LotStatus';
            default:
                return 'ProductionItemName';
        }
    };
    const handleSearchList = (search = '', searchBy = '') => {
        let temp = overAllData.filter(x => x[getSearchKey(searchBy)].toLowerCase().includes(search.toLowerCase()));
        setMasterData([...temp]);
    };
    const onRefresh = () => {
        setRefreshing(true);
        setSearchFilter({
            searchBy: 'Production Item',
            searchText: '',
        });
        handleListFetch(false, false);
    };
    const handleOuterRefersh = () => {
        handleListFetch(true);
    };
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.InspectionType) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 2, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot No : <Text style={[styles.secondText]}>{item?.LotNo ? item?.LotNo : '-'}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Inspected Date : <Text style={[styles.secondText]}>{moment(new Date(item.EnteredDate)).format(uiDateFormat)}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <Text style={[styles.statusText, { backgroundColor: renderBackgroundColor(item?.LotStatus) }]}>{item?.LotStatus}</Text>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleEyePress(item);
                            }}>
                            <IconI name="eye-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
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
                            <IconF name="download" size={25} color={item?.isDownloaded ? COLORS.fiBgColor : COLORS.grey} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    const handleAddPress = () => {
        let temp = [...selectedSeachOptions];
        temp.push({
            id: temp[temp?.length - 1]?.id ? temp[temp?.length - 1]?.id + 1 : 1,
            title: '',
            label: '',
            searchBy: '',
            searchText: '',
        });
        setSelectedSeachOptions([...temp]);
    };
    const handleDeletePress = id => {
        let temp = [...selectedSeachOptions];
        temp = temp.filter(item => item.id !== id);
        setSelectedSeachOptions([...temp]);
    };
    const handleFetchDropdownList = val => {
        if (val.label == 'Refrence No') {
            let temp = [];
            masterData.forEach((item, index) => {
                if (item?.ReferenceNo) {
                    temp.push({
                        id: index + 1,
                        label: item.ReferenceNo,
                        value: item.ReferenceNo,
                    });
                }
            });
            return temp;
        } else {
            return [];
        }
    };
    const handleMultiSearchFilterSubmit = () => {
        setShowMutiSearchFilter(false);
        let temp = [];
        selectedSeachOptions.forEach(item => {
            if (item.searchText && item.searchBy) {
                temp.push({
                    searchBy: item.searchBy.title,
                    searchText: item?.searchText?.value ? item?.searchText?.value : item.searchText,
                });
            }
        });
        handleDoMultiFilter(temp);
        console.log(temp, 'selectedSeachOptions');
    };
    const handleDoMultiFilter = (criteria = []) => {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            setMasterData([...overAllData]); // reset if no criteria
            return;
        }

        let temp = [...overAllData];

        // Apply filters one by one (AND logic)
        criteria.forEach(({ searchBy, searchText }) => {
            if (searchText && searchBy) {
                temp = temp.filter(item => item[searchBy]?.toString().toLowerCase().includes(searchText.toLowerCase()));
            }
        });

        setMasterData([...temp]);
    };
    return (
        <CustomHeader
            title="Search Inspection"
            activeTabId={0}
            hideSearch={isFocused}
            handleSearch={value => {
                setSearchFilter(pre => ({ ...pre, searchText: value }));
                if (value?.length == 0) {
                    handleSearchList('', searchFilter.searchBy);
                }
            }}
            searchValue={searchFilter.searchText}
            handleClosePress={() => {
                setSearchFilter(pre => ({ ...pre, searchText: '' }));
                handleSearchList('', searchFilter.searchBy);
            }}
            handleFilterPress={() => {
                setShowSearchFilter(true);
            }}
            handleMultiSearch={() => {
                setShowMutiSearchFilter(true);
            }}>
            <View style={[styles.mainContainer]}>
                <View style={[styles.overAllBox]}>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.startDate || null}
                            onSelectedDate={val => {
                                const { endDate } = filterData;
                                const tempStart = moment(val);
                                const tempEnd = moment(endDate);
                                if (tempStart.isBefore(tempEnd)) {
                                    setFilterData(pre => ({ ...pre, startDate: val }));
                                } else {
                                    showMessage({
                                        message: 'Start Date must be less than End Date',
                                        backgroundColor: COLORS.ERROR,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 40,
                                        icon: 'danger',
                                        position: 'right',
                                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
                                    });
                                }
                            }}
                        />
                    </View>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.endDate || null}
                            placeHolder="End Date"
                            onSelectedDate={val => {
                                const { startDate } = filterData;
                                const tempStart = moment(startDate);
                                const tempEnd = moment(val);
                                if (tempStart.isBefore(tempEnd)) {
                                    setFilterData(pre => ({ ...pre, endDate: val }));
                                } else {
                                    showMessage({
                                        message: 'Start Date must be less than End Date',
                                        backgroundColor: COLORS.ERROR,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 40,
                                        icon: 'danger',
                                        position: 'right',
                                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
                                    });
                                }
                            }}
                        />
                    </View>
                    <View style={[styles.filterList]}>
                        <FilterWithMenu
                            dataList={filterList}
                            type="BtnFilter"
                            onSelectedPress={val => {
                                setFilterData(pre => ({ ...pre, type: val.id }));
                            }}
                        />
                    </View>
                    <View style={[styles.iconFilter]}>
                        <TouchableOpacity
                            style={styles.getDataBox}
                            onPress={() => {
                                handleOuterRefersh();
                            }}>
                            <IconI name="sync-sharp" size={22} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>
                {showSkeleton ? (
                    <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            {Boolean(showFileModal) && (
                <FileViewModal
                    selectedValue={selectedData}
                    visible={showFileModal}
                    onDismiss={() => {
                        setShowFileModal(false);
                    }}
                    userData={icUserData?.userData}
                />
            )}
            {Boolean(showBubble) && (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={showBubble}
                    onRequestClose={() => {
                        console.log('close modal');
                    }}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        height: '100%',
                    }}>
                    <Bubbles size={10} color="#12C0CF" />
                </Modal>
            )}
            {Boolean(showSearchFilter) && (
                <Modal
                    visible={showSearchFilter}
                    onDismiss={() => {
                        setShowSearchFilter(false);
                    }}
                    contentContainerStyle={{
                        backgroundColor: '#fff',
                        width: '90%',
                        alignSelf: 'center',
                        maxHeight: 500,
                    }}>
                    <View style={[styles.containerOne]}>
                        <Text style={styles.headertext}>Choose Filter Option</Text>
                        <Divider />
                        <View style={[styles.contentBox]}>
                            {searchList.map((item, index) => {
                                return (
                                    <View style={{ marginVertical: 10 }} key={item.id}>
                                        <RadioButtonComponent
                                            lable={item.label}
                                            value={item.isSelected ? item.label : ''}
                                            onChange={val => {
                                                setSearchList(pre => {
                                                    let temp = pre.map(item =>
                                                        item.id === val.id ? { ...item, isSelected: true } : { ...item, isSelected: false },
                                                    );
                                                    return temp;
                                                });
                                            }}
                                            obj={item}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View>
                        <Divider />
                        <View style={styles.btnConatiner}>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={() => setShowSearchFilter(false)}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    handleSearchFilterSubmit();
                                }}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {Boolean(showMutiSearchFilter) && (
                <Modal
                    visible={showMutiSearchFilter}
                    onDismiss={() => {
                        setShowMutiSearchFilter(false);
                    }}
                    contentContainerStyle={{
                        backgroundColor: '#fff',
                        width: '98%',
                        alignSelf: 'center',
                        height: '100%',
                    }}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={{}}>
                            <Text style={styles.headertext}>Search Filter</Text>
                            <Divider />
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            {selectedSeachOptions.map((item, index) => {
                                console.log('item', item);
                                return (
                                    <View style={styles.filterContainer} key={item.id}>
                                        <View style={styles.filterBox1}>
                                            <SingleDropDown
                                                placeholder="Column Name"
                                                data={searchFilterOptions}
                                                dropdownPosition="bottom"
                                                value={item.searchBy || {}}
                                                onChange={val => {
                                                    const updatedData = selectedSeachOptions.map(i =>
                                                        i.id === item.id
                                                            ? {
                                                                  ...i,
                                                                  searchBy: val,
                                                                  id: item.id,
                                                                  title: val.label,
                                                                  label: val.label,
                                                                  searchText: '',
                                                                  List: handleFetchDropdownList(val),
                                                              }
                                                            : i,
                                                    );
                                                    setSelectedSeachOptions(updatedData);
                                                }}
                                            />
                                        </View>
                                        <View style={styles.filterBox2}>
                                            <DynamicFormField
                                                fieldType={item.searchBy.type}
                                                value={item.searchText}
                                                isEditable={item.searchBy !== ''}
                                                dropDownData={item?.List || []}
                                                handleChange={val => {
                                                    const updatedData = selectedSeachOptions.map(i =>
                                                        i.id === item.id ? { ...i, searchText: val } : i,
                                                    );
                                                    setSelectedSeachOptions(updatedData);
                                                }}
                                                dropdownPosition="bottom"
                                            />
                                        </View>
                                        {Boolean(selectedSeachOptions?.length > 1) && (
                                            <View style={styles.filterBox3}>
                                                <TouchableOpacity
                                                    style={{ backgroundColor: COLORS.apptheme, padding: 5, borderRadius: 50, marginTop: 5 }}
                                                    onPress={() => handleDeletePress(item.id)}>
                                                    <IconI name="close" size={20} color={COLORS.white} />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View>
                            <View style={[styles.outerAddContainer]}>
                                <TouchableOpacity style={[styles.addConatiner]} onPress={() => handleAddPress()}>
                                    <IconI name="add" size={25} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                            <Divider />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 10,
                                }}>
                                <TouchableOpacity style={styles.cancelConatiner} onPress={() => setShowMutiSearchFilter(false)}>
                                    <Text style={styles.btnStyle}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelConatiner}
                                    onPress={() => {
                                        setSelectedSeachOptions([
                                            {
                                                id: 1,
                                                title: '',
                                                label: '',
                                                searchBy: '',
                                                searchText: '',
                                            },
                                        ]);
                                    }}>
                                    <Text style={styles.btnStyle}>CLEAR ALL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelConatiner}
                                    onPress={() => {
                                        handleMultiSearchFilterSubmit();
                                    }}>
                                    <Text style={styles.btnStyle}>SUBMIT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            {Boolean(showEye) && (
                <PartDetails
                    visible={showEye}
                    onDismiss={() => {
                        setShowEye(false);
                    }}
                    selectedData={selectedData}
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
    statusText: {
        color: COLORS.white,
        fontFamily: 'OpenSans-Regular',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        textAlign: 'center',
    },
    iconlist: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    lastBox: {
        flex: 1,
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
        width: '32%',
    },
    filterList: {
        width: '23%',
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
    containerOne: {
        padding: 20,
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        paddingBottom: 12,
        color: COLORS.ictextBlack,
    },
    contentBox: {
        paddingVertical: 15,
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 10,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
    },
    addText: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
    },
    addConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: COLORS.apptheme,
        borderRadius: 50,
    },
    outerAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginRight: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterBox1: {
        flex: 1,
    },
    filterBox2: {
        flex: 1.4,
        marginHorizontal: 5,
    },
    filterBox3: {},
});

export default SearchInspection;
