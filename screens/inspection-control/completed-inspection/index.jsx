import { ButtonComponent, CheckBox, RadioButton, TextComponent } from 'components';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import IconO from 'react-native-vector-icons/Octicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import ICCheckBox from '../Components/ICCheckBox';
import DeleteModal from '../Components/DeleteModal';
import IcSkeleton from '../Components/IcSkeleton';
import NoDataFound from '../Components/NoDataFound';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ApiUrl from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { Bubbles } from 'react-native-loader';
import { showMessage } from 'react-native-flash-message';
import { deleteInspectionByUniqueId, deleteInspectionsByUniqueIds, getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import { isArray } from 'underscore';
import { getElevation, getICList, showErrorMessage } from 'helpers/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from 'theme/useTheme';

const optionsList = [
    {
        id: 1,
        value: 'Sync',
        label: 'Sync',
        Mode: 1,
    },
    {
        id: 2,
        value: 'Accept Lot',
        label: 'Accept Lot',
        Mode: 2,
    },
    {
        id: 3,
        value: 'Reject Lot',
        label: 'Reject Lot',
        Mode: 3,
    },
    {
        id: 4,
        value: 'Accept Lot / Submit Inspection',
        label: 'Accept Lot / Submit Inspection',
        Mode: 4,
    },
    {
        id: 5,
        value: 'Reject Lot / Submit Inspection',
        label: 'Reject Lot / Submit Inspection',
        Mode: 5,
    },
];

const CompletedInspection = () => {
    const insets = useSafeAreaInsets();
    const elevation = getElevation();
    const { theme } = useTheme();
    const { icUserData } = useSelector(state => state.inspection);
    const [syncModal, setSyncModal] = useState(false);
    const [syncList, setSyncList] = useState([...optionsList]);
    const [selectedRadio, setSelectedRadio] = useState({
        id: 1,
        value: 'Sync',
        label: 'Sync',
        Mode: 1,
    });
    const [checkBox, setCheckBox] = useState(false);
    const navigation = useNavigation();
    const [showDelete, setShowDelete] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState({});
    const [disableBtn, setDisableBtn] = useState(false);
    const [isBulkSync, setIsBulkSync] = useState(false);

    const isFocused = useIsFocused();

    const getAllCompletedData = async (showSkt = true) => {
        showSkt && setShowSkeleton(true);
        const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        const list = inspectList?.filter(item => item?.status === 'Completed' || item?.status === 'In Progress');
        let filtered = [];
        let superVisorData = [];
        if (list?.length > 0) {
            filtered = list
                .filter(item => item?.userType != 'SupervisorSchedule')
                .sort((a, b) => new Date(b.downloadedDate) - new Date(a.downloadedDate));
            superVisorData = list
                .filter(item => item?.userType === 'SupervisorSchedule')
                .sort((a, b) => new Date(b.downloadedDate) - new Date(a.downloadedDate));
        }
        setMasterData([...filtered, ...superVisorData]);
        await getICList(icUserData?.userData?.UserId, icUserData?.userData?.Siteid, false);
        setShowSkeleton(false);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        getAllCompletedData(false);
    };
    useLayoutEffect(() => {
        if (isFocused) {
            getAllCompletedData();
        }
    }, [icUserData, isFocused]);

    const handleSyncPress = item => {
        setSyncModal(true);
        setSelectedValue(item);
    };
    const hideModal = () => {
        setIsBulkSync(false);
        if (!disableBtn) {
            setSelectedRadio({
                id: 1,
                value: 'Sync',
                label: 'Sync',
                Mode: 1,
            });
            setSyncModal(false);
        }
        setCheckBox(false);
    };
    const handleDeletePress = item => {
        setSelectedValue(item);
        setShowDelete(true);
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const handleCompletedPress = item => {
        navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: item });
    };
    const renderItem = ({ item, index }) => {
        return (
            <View
                style={[
                    styles.recordConatiner,
                    {
                        borderRadius: SPACING.SMALL,
                        marginBottom: SPACING.NORMAL,
                        marginTop: SPACING.X_SMALL,
                        marginHorizontal: SPACING.X_SMALL,
                    },
                    elevation,
                    { backgroundColor: item?.backgroundColor ? item?.backgroundColor : theme.mode.backgroundColor },
                ]}
                key={index + 1}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.intInspectionTypeID) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.strProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item.strOperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Frequency : <Text style={[styles.secondText]}>{item.strFrequencyName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.strLotNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity
                        style={[styles.launchCard, { backgroundColor: item.colorCode }]}
                        onPress={() => {
                            handleCompletedPress(item);
                        }}>
                        <Text style={[styles.launchText]}>{item?.status}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                if (item?.status == 'In Progress') {
                                    setSyncList([...optionsList.slice(0, 1)]);
                                } else {
                                    setSyncList([...optionsList]);
                                }
                                setSelectedValue(item);
                                handleSyncPress(item);
                            }}>
                            <IconO name="sync" size={20} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeletePress(item)}>
                            <Icon name="delete-outline" size={25} color={COLORS.ERROR} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    const createConatinmentList = templist => {
        let temp = [];
        if (templist?.length) {
            templist.forEach((item, index) => {
                if (item.ContainmentValue !== '') {
                    temp.push({
                        ContainmentID: item?.ContainmentID,
                        ContainmentNumber: item?.ContainmentNumber,
                        ContainmentValue: item?.ContainmentValue,
                        ContainmentComment: item?.ContainmentComment,
                        Type: 'Value',
                        BackColorForContainment: item?.BackColorForContainment,
                        FontColorForContainment: '#000000',
                    });
                }
            });
        }
        return temp;
    };
    const convertSampleList = (templist, type = 'number') => {
        let characteristicDetails = templist.map(item => {
            // let charInfoObj = {};
            // if (item.charInfo) {
            //     // charInfoObj = item.charInfo.reduce((acc, curr) => {
            //     //     acc[curr.PropertyName] = curr.Value;
            //     //     return acc;
            //     // }, {});
            //     item.charInfo.map(item => {
            //         if (item.ReferenceName != null) {
            //             charInfoObj[item.ReferenceName] = item?.Value?.value ? item.Value.value : item.Value;
            //         } else if (item.ReferenceName == null && item.PropertyName) {
            //             charInfoObj[item.PropertyName] = item?.Value?.value ? item.Value.value : item.Value;
            //         }
            //     });
            // }
            const array = item.charInfo;

            // find the index of the target object
            const index = array.findIndex(x => x.RefData === '##DROPDOWN:DefectPhenomenon##');

            if (index !== -1) {
                let defectObj = array[index]; // reference to the original object

                if (typeof defectObj.Value === 'string' && defectObj.Value !== '') {
                    const temp = defectObj.List.find(x => x.value === defectObj.Value);
                    defectObj = { ...defectObj, Value: temp || '' }; // replace with new object
                } else if (typeof defectObj.Value === 'object' && defectObj.Value !== null) {
                    defectObj = { ...defectObj, Value: defectObj.Value };
                } else {
                    defectObj = { ...defectObj, Value: '' };
                }

                // replace in the array
                array[index] = defectObj;
            }
            const charInfoObj = array.reduce((acc, item) => {
                const key = item.ReferenceName ?? item.PropertyName;
                acc[key] = item.RefData === '##DROPDOWN:DefectPhenomenon##' ? item.Value : item?.Value?.value ? item.Value.value : item.Value;
                return acc;
            }, {});

            Object.entries(charInfoObj).forEach(([key, value]) => {
                item[key] = value; // update if exists, add if not
            });

            const samples = item.Samples || [];
            let actualValue = null;
            if (type === 'number') {
                // Filter only valid numeric values
                // const numericValues = samples.map(s => parseFloat(s.FunctionValue)).filter(val => !isNaN(val));
                const notOkSample = samples.filter(x => x?.backColor == '#FF0100');
                const finalNotOkaySample = notOkSample.length
                    ? notOkSample[notOkSample.length - 1]?.FunctionValue
                    : samples?.length
                    ? samples[samples.length - 1]?.FunctionValue
                    : '';
                // Use Math.min only if numericValues has at least one number
                actualValue = finalNotOkaySample;
            } else {
                // For string values: return first non-"ok" FunctionValue
                actualValue = 'ok';
                for (const sample of samples) {
                    const val = sample?.FunctionValue?.toLowerCase();
                    if (val && val !== 'ok') {
                        actualValue = sample?.FunctionValue;
                        break;
                    }
                }
            }
            return {
                ...item,
                Samples: undefined,
                charInfo: undefined,
                ActualValue: actualValue !== Infinity ? String(actualValue) : '',
                ID: String(item.ID || ''),
                ...(item?.DefectPhenomenon &&
                    Object.keys(item?.DefectPhenomenon)?.length && {
                        Case: 'DEFECTPHENOMENON',
                        StrID: item?.DefectPhenomenon?.ID,
                        Name: type === 'number' ? 'CustomInspectionCharacteristicsV' : 'CustomInspectionCharacteristics',
                        Topic: 'DefectPhenomenon',
                    }),
                DefectPhenomenon: item?.DefectPhenomenon ? item?.DefectPhenomenon?.value : undefined,
                samples: samples.map(sample => ({
                    sampleName: String(sample.sampleName || ''),
                    data: {
                        FuncDetailsId: sample.FuncDetailsId || '',
                        SerialNo: String(sample.SerialNo || ''),
                        FunctionValue: sample.FunctionValue || '',
                        status: sample.backColor === '#00FF00' ? 0 : 1,
                        backColor: sample.backColor,
                        fontColor: sample.fontColor,
                        EnteredDate: sample.EnteredDate,
                        IsApproved: sample.IsApproved,
                        IsNumericSample: sample.IsNumericSample,
                        IsRejected: sample.backColor === '#00FF00' ? 0 : 1,
                        Comments: sample.Comments,
                        ...(sample?.ContainmentActions &&
                            sample?.ContainmentActions?.length > 0 && { ContainmentActions: createConatinmentList(sample?.ContainmentActions) }),
                    },
                })),
            };
        });
        return characteristicDetails;
    };
    const handleSingleFormSync = async () => {
        setDisableBtn(true);
        const templist = [
            ...convertSampleList(selectedValue.VariableCharacteristics, 'number'),
            ...convertSampleList(selectedValue.AttributeCharacteristics, 'char'),
        ];
        const updatedGeneralInfo = selectedValue.GeneralInfo.map(item => {
            if ((item.DisplayName === 'Supervisor' || item.StaticText === 'Approver') && typeof item.Value === 'object' && item.Value !== null) {
                return {
                    ...item,
                    Value: item.Value.value,
                    Case: 'SUPERVISOR',
                    StrID: item.Value.ID,
                    Name: 'CustomInspection',
                    Topic: 'Supervisor',
                };
            } else if (
                item.DisplayName !== 'Supervisor' &&
                item.DisplayName !== 'Approver' &&
                typeof item.Value === 'object' &&
                item.Value === null
            ) {
                return {
                    ...item,
                    Value: item.Value.value,
                };
            }
            return item;
        });
        const payLoad = {
            EnteredBy: icUserData?.userData?.UserId,
            InspectedDate: moment(new Date()).format('MM/DD/YYYY hh:mm:ss A'),
            characteristicDetails: templist,
            GeneralInfo: updatedGeneralInfo,
            SiteId: icUserData?.userData?.Siteid,
            Status: [
                {
                    UserId: icUserData?.userData?.UserId,
                    InspectionID: selectedValue?.InspectionID.toString(),
                    SupervisorID: checkBox ? icUserData?.userData?.UserId : '',
                    InspectionEntryDetailsID: selectedValue.InspectionEntryDetailsID.toString(),
                    Mode: selectedRadio.Mode,
                    SupervisorApproved: checkBox ? 1 : 0,
                    IsProcess: selectedValue.intInspectionTypeID == '2' ? 1 : 0,
                },
            ],
        };
        const response = await postAPI(selectedValue.intInspectionTypeID == '2' ? ApiUrl.IC_INPROCESS_SINGLE_SYNC : ApiUrl.IC_SINGLE_SYNC, payLoad);
        if (response?.insertedSamples) {
            setSyncModal(false);
            const flag = await deleteInspectionByUniqueId(selectedValue.uniqueId);
            showMessage({
                message: 'Inspection synced successfully',
                backgroundColor: COLORS.SUCCESS,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'success',
                position: 'right',
                style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
            });
            if (flag) {
                getAllCompletedData(true);
            }
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
        }
        setDisableBtn(false);
    };
    const handleSingleDeletePress = async () => {
        const flag = await deleteInspectionByUniqueId(selectedValue.uniqueId);
        if (flag) {
            setShowDelete(false);
            getAllCompletedData(false);
        } else {
            showErrorMessage('Error deleting inspection');
        }
    };
    const handleBulkSyncPress = () => {
        setIsBulkSync(true);
        const allStatus = masterData?.map(item => item?.status);
        const isAllCompleted = allStatus?.every(item => item === 'Completed');
        console.log('isAllCompleted', isAllCompleted);
        if (!isAllCompleted) {
            setSyncList([...optionsList.slice(0, 1)]);
        } else {
            setSyncList([...optionsList]);
        }
        setSyncModal(true);
    };
    const handleBulkFormSync = async () => {
        setDisableBtn(true);
        const allInspectionEntryDetailsID = masterData?.map(item => item?.InspectionEntryDetailsID.toString()).join(',');
        const allInspectionID = masterData?.map(item => item?.InspectionID.toString()).join(',');
        const temp = [];
        masterData?.forEach(value => {
            const templist = [
                ...convertSampleList(value.VariableCharacteristics, 'number'),
                ...convertSampleList(value.AttributeCharacteristics, 'char'),
            ];
            const updatedGeneralInfo = value.GeneralInfo.map(item => {
                if ((item.DisplayName === 'Supervisor' || item.StaticText === 'Approver') && typeof item.Value === 'object' && item.Value !== null) {
                    return {
                        ...item,
                        Value: item.Value.value,
                        Case: 'SUPERVISOR',
                        StrID: item.Value.ID,
                        Name: 'CustomInspection',
                        Topic: 'Supervisor',
                    };
                } else if (
                    item.DisplayName !== 'Supervisor' &&
                    item.DisplayName !== 'Approver' &&
                    typeof item.Value === 'object' &&
                    item.Value === null
                ) {
                    return {
                        ...item,
                        Value: item.Value.value,
                    };
                }
                return item;
            });
            temp.push({
                characteristicDetails: templist,
                GeneralInfo: updatedGeneralInfo,
            });
        });
        const payLoad = {
            EnteredBy: icUserData?.userData?.UserId,
            InspectedDate: moment(new Date()).format('MM/DD/YYYY hh:mm:ss A'),
            InspectionData: [...temp],
            SiteId: icUserData?.userData?.Siteid,
            Status: [
                {
                    UserId: icUserData?.userData?.UserId,
                    InspectionID: allInspectionID,
                    SupervisorID: checkBox ? icUserData?.userData?.UserId : '',
                    InspectionEntryDetailsID: allInspectionEntryDetailsID,
                    Mode: selectedRadio.Mode,
                    SupervisorApproved: checkBox ? 1 : 0,
                    // IsProcess: selectedValue.intInspectionTypeID == '2' ? 1 : 0,
                    // IsProcess: 0,
                },
            ],
        };
        const response = await postAPI(ApiUrl.IC_BULK_SYNC, payLoad);
        if (response?.results) {
            const uniqueIds = masterData?.map(item => item?.uniqueId);
            console.log('uniqueIds', uniqueIds);
            setSyncModal(false);
            // const flag = await deleteInspectionByUniqueId(selectedValue.uniqueId);
            const flag = await deleteInspectionsByUniqueIds(uniqueIds);
            showMessage({
                message: 'Inspection synced successfully',
                backgroundColor: COLORS.SUCCESS,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'success',
                position: 'right',
                style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
            });
            if (flag) {
                getAllCompletedData(true);
            }
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
        }
        setDisableBtn(false);
    };
    return (
        <CustomHeader title="Completed Inspection" activeTabId={3} handleSyncPress={handleBulkSyncPress} showHomeIcon>
            <View style={[styles.container]}>
                {Boolean(showSkeleton) ? (
                    <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderItem}
                        keyExtractor={item => item?.uniqueId}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            {Boolean(syncModal) && (
                <Modal visible={syncModal} onDismiss={hideModal} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={[styles.modalContainer]}>
                        {disableBtn ? (
                            <View style={[styles.bubbleBox]}>
                                <Bubbles size={10} color="#12C0CF" />
                            </View>
                        ) : (
                            <View style={[styles.containerOne]}>
                                <Text style={styles.headertext}>Choose Sync Options</Text>
                                <Divider />
                                <View style={[styles.contentBox]}>
                                    {syncList.map(item => {
                                        return (
                                            <View style={{ marginVertical: 10 }} key={item.id}>
                                                <RadioButtonComponent
                                                    lable={item.label}
                                                    value={selectedRadio.value}
                                                    onChange={val => {
                                                        setSelectedRadio(val);
                                                    }}
                                                    obj={item}
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                                {Boolean(syncList.length > 1) && (
                                    <View>
                                        <ICCheckBox
                                            isChecked={checkBox}
                                            label="Supervisor Approved"
                                            onChange={() => {
                                                setCheckBox(!checkBox);
                                            }}
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                        <View>
                            <Divider />
                            <View style={styles.btnConatiner}>
                                <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal} disabled={disableBtn}>
                                    <Text style={styles.btnStyle}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelConatiner}
                                    onPress={() => {
                                        if (isBulkSync) {
                                            handleBulkFormSync();
                                        } else {
                                            setIsBulkSync(false);
                                            handleSingleFormSync();
                                        }
                                    }}
                                    disabled={disableBtn}>
                                    <Text style={styles.btnStyle}>SUBMIT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            <DeleteModal
                visible={showDelete}
                handleClose={() => {
                    setShowDelete(false);
                }}
                handleYesPress={() => {
                    handleSingleDeletePress();
                }}
            />
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
        paddingHorizontal: 13,
        paddingVertical: 4,
        borderRadius: 5,
    },
    launchText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
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
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 22,
        paddingBottom: 12,
        color: COLORS.ictextBlack,
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
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18,
    },
    bubbleBox: {
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CompletedInspection;
