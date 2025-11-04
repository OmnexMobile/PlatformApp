import { ButtonComponent, TextComponent } from 'components';
import React, { useEffect } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useState } from 'react';
import { Divider, Modal } from 'react-native-paper';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import { RFPercentage } from 'helpers/utils';
import PartDetails from '../Components/supervisor-schedule/PartDetails';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
import IcSkeleton from '../Components/IcSkeleton';
import NoDataFound from '../Components/NoDataFound';
import { useSelector } from 'react-redux';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import moment from 'moment';
import { addInspectionData, getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import { showMessage } from 'react-native-flash-message';
import { Bubbles } from 'react-native-loader';
import uuid from 'react-native-uuid';
import { useAppContext } from 'contexts/app-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconF from 'react-native-vector-icons/Feather';


const optionsList = [
    {
        id: 0,
        value: 'All',
        label: 'All',
    },
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
    const { icUserData } = useSelector(state => state.inspection);
    const isFocused = useIsFocused();
    const [showFilterList, setShowFilterList] = useState(false);
    const [showEye, setShowEye] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        searchBy: 'Production Item',
        inspectionType: {
            id: 0,
            value: 'All',
            label: 'All',
        },
    });
    const [selectedData, setSelectedData] = useState({});
    const [showBubble, setShowBubble] = useState(false);
    const {
        profile,
        sites: { selectedSite },
    } = useAppContext();
    const insets = useSafeAreaInsets();

    const onRefresh = () => {
        setRefreshing(true);
        handleGetAllData(false);
    };

    const handleEyePress = value => {
        setSelectedData(value);
        setShowEye(true);
    };
    const hideModal = () => {
        setShowFilterList(false);
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
    const addIsDownloadKey = async temp => {
        const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        let filtered = inspectList.filter(item => item?.userType === 'SupervisorSchedule');
        const updatedArray = temp.map(item => {
            const match = filtered.some(compareItem => compareItem.ID === item.ID);
            return {
                ...item,
                isDownloaded: match,
            };
        });
        return updatedArray;
    };
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
    const handleGetAllData = async (showSKT = true) => {
        showSKT && setShowSkeleton(true);
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        const response = await postAPI(ApiUrl.IC_SUPERVISOR_LIST, formData);
        if (response.Success) {
            let temp = response?.Data || [];
            const updatedArray = await addIsDownloadKey(temp);
            if (filters.search !== '') {
                let temp = updatedArray.filter(x => x[getSearchKey(filters.searchBy)].toLowerCase().includes(filters?.search?.toLowerCase()));
                setMasterData([...temp]);
            } else {
                setMasterData([...updatedArray]);
            }
            setOverAllData([...updatedArray]);
        } else {
            setMasterData([]);
            setOverAllData([]);
        }
        setShowSkeleton(false);
        setRefreshing(false);
        return [];
    };
    useEffect(() => {
        if (icUserData && isFocused) {
            handleGetAllData();
        }
    }, [icUserData,isFocused]);
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
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
    const handleDownloadPress = async item => {
        if (item?.isDownloaded) {
            setShowBubble(true);
            const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
            let filtered = inspectList.filter(val => val?.ID === item?.ID);
            navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: filtered[0] || {} });
            setShowBubble(false);
        } else {
            console.log(item, 'item');
            setShowBubble(true);
            setSelectedData(item);
            const formData = new FormData();
            formData.append('UserId', icUserData?.userData?.UserId);
            formData.append('siteId', parseInt(icUserData?.userData?.Siteid));
            formData.append('inspectionID', item?.ID);
            formData.append('FormId', item?.FormId);
            formData.append('FormName', item?.FormName);
            formData.append('operationIDs', item?.OperationID);
            formData.append('ProcessId', item?.InspectionType == '2' ? 1 : 0);
            formData.append('isProcess', item?.InspectionType == '2' ? 1 : 0);

            console.log('formData.UserId', icUserData?.userData?.UserId);
            console.log('formData.siteId', parseInt(icUserData?.userData?.Siteid));
            console.log('formData.inspectionID', item?.ID);
            console.log('formData.FormId', item?.FormId);
            console.log('formData.FormName', item?.FormName);
            console.log('formData.operationIDs', item?.OperationID);    
            console.log('formData.ProcessId', item?.InspectionType == '2' ? 1 : 0);
            console.log('formData.isProcess', item?.InspectionType == '2' ? 1 : 0);

            const attachments = await getAllFiles(item);
            const response = await postAPI(`${ApiUrl.IC_SUPERVISOR_DOWNLOAD}`, formData);
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
                    InspectionID: item?.ID,
                    InspectionEntryDetailsID: item?.ICInspectionEntryDetailsID,
                    intInspectionTypeID: item?.InspectionType,
                    FormId: item?.FormId,
                    OperationID: item?.OperationID,
                    intProductionItemID: item?.ProductionItemId,
                    strProductionItemName: item?.ProductionItemName,
                    intShiftID: item?.ShiftId, // missing in response
                    strShiftName: item?.Shift,
                    strOperationName: item.OperationName,
                    strFrequencyName: item?.SampleFrequency,
                    intInspectionTypeID: item?.InspectionType,
                    strInspectionType: item.InspectionType,
                    strLotNo: item?.LotNo,
                    GeneralInfo: response.GeneralInfo,
                    VariableCharacteristics: VariableCharacteristicsList,
                    AttributeCharacteristics: AttributeCharacteristicsList,
                    userType: 'SupervisorSchedule',
                    attachments: attachments,
                    userId: selectedSite?.UserId,
                    siteId: selectedSite?.Siteid,
                    status: getStatus?.status,
                    colorCode: getStatus?.colorCode,
                };

                await addInspectionData(selectedSite?.UserId, selectedSite?.Siteid, inspectObj.uniqueId, inspectObj);
                handleGetAllData(false, false);
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
    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.recordConatiner]} key={index + 1}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.InspectionType) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 2, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Inspection Date : <Text style={[styles.secondText]}>{moment(item.EnteredDate).format('DD/MM/YYYY')}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.LotNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <View style={styles.launchCard}>
                        <Text style={[styles.launchText]}>{item.LotStatus}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleEyePress(item)}>
                            <IconI name="eye-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginRight: 5 }}
                            onPress={() => {
                                handleFilePress(item);
                            }}>
                            <ICFileIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleDownloadPress(item);
                            }}
                            style={{marginLeft:5}}
                            >
                           <IconF name="download" size={23} color={item?.isDownloaded ? COLORS.fiBgColor : COLORS.grey} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    useEffect(() => {
        var handler;
        if (filters?.search?.length && isFocused) {
            handler = setTimeout(() => {
                handleTypeFilter(filters.inspectionType.id, filters.search);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [filters?.search, isFocused]);
    const handleTypeFilter = (value, search = '') => {
        let temp = JSON.parse(JSON.stringify(overAllData));
        let tempSearch = [];
        if (value !== 0) {
            tempSearch = temp.filter(item => item.InspectionType == value);
        } else {
            tempSearch = temp;
        }
        if (search?.length) {
            tempSearch = tempSearch.filter(
                item =>
                    item.ProductionItemName.toLowerCase().includes(search.toLowerCase()) ||
                    item.OperationName.toLowerCase().includes(search.toLowerCase()),
            );
        }
        setMasterData(tempSearch);
        hideModal();
    };

    return (
        <CustomHeader
            title="Supervisor Schedule"
            activeTabId={4}
            handleFilterPress={() => {
                setShowFilterList(true);
            }}
            hideSearch={isFocused}
            searchValue={filters?.search}
            handleSearch={value => {
                setFilters(pre => ({ ...pre, search: value }));
                if (!value?.length) {
                    setMasterData(overAllData);
                }
            }}
            handleClosePress={() => {
                // setSearch('');
                setFilters(pre => ({ ...pre, search: '' }));
                handleTypeFilter(filters.inspectionType.id, '');
                // handleSearch('', filterData?.type);
            }}>
            <View style={[styles.container]}>
                {Boolean(showSkeleton) ? (
                    <IcSkeleton type={PLACEHOLDERS.SUPERVISOR_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            <View style={[styles.bottombox]}>
                <Text style={[styles.bottomText]}>Total Inspections </Text>
                <View style={[styles.totalBox]}>
                    <Text style={[styles.bottomText, { color: COLORS.white }]}>{masterData?.length}</Text>
                </View>
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
                                            value={filters.inspectionType.label}
                                            onChange={val => {
                                                setFilters(pre => ({ ...pre, inspectionType: val }));
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
                            <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    handleTypeFilter(filters.inspectionType.id, filters.search);
                                }}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {Boolean(showEye) && (
                <PartDetails
                    visible={showEye}
                    onDismiss={() => {
                        setShowEye(false);
                    }}
                    selectedData={selectedData}
                />
            )}
            <FileViewModal
                selectedValue={selectedData}
                visible={showFileModal}
                onDismiss={() => {
                    setShowFileModal(false);
                }}
                userData={icUserData?.userData}
            />
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
        fontFamily: 'OpenSans-Bold',
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
    launchCard: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
    launchText: {
        color: '#fff',
        fontFamily: 'OpenSans-SemiBold',
    },
    lastBox: {
        flex: 1,
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
        fontFamily: 'OpenSans-Regular',
        color: COLORS.headerText,
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
        paddingTop: 20,
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2.1),
        marginBottom: 13,
        color: COLORS.ictextBlack,
    },
    contentBox: {
        paddingVertical: 15,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(1.8),
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
});

export default SupervisorSchedule;
