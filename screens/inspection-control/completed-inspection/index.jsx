import { ButtonComponent, CheckBox, RadioButton, TextComponent } from 'components';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
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
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ApiUrl from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { Bubbles } from 'react-native-loader';
import { showMessage } from 'react-native-flash-message';
import { deleteInspectionByUniqueId, getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import { isArray } from 'underscore';
import { showErrorMessage } from 'helpers/utils';

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
    const { icUserData } = useSelector(state => state.inspection);
    const [syncModal, setSyncModal] = useState(false);
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

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const getAllCompletedData = async (showSkt = true) => {
        showSkt && setShowSkeleton(true);
        const inspectList = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        const completedList = inspectList?.filter(item => item?.status === 'Completed' || item?.status === 'In Progress');
        setMasterData(completedList?.length ? completedList : []);
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

    const handleISbtnpress = () => {
        navigation.navigate(ROUTES.INSPECTION_SCHEDULE);
    };
    const handleSyncPress = item => {
        setSyncModal(true);
        setSelectedValue(item);
    };
    const hideModal = () => {
        if (!disableBtn) {
            setSelectedRadio({
                id: 1,
                value: 'Sync',
                label: 'Sync',
                Mode: 1,
            });
            setSyncModal(false);
        }
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
            <View style={[styles.recordConatiner]} key={index + 1}>
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
            const samples = item.Samples || [];
            let actualValue = null;
            if (type === 'number') {
                // Filter only valid numeric values
                // const numericValues = samples.map(s => parseFloat(s.FunctionValue)).filter(val => !isNaN(val));
                const notOkSample = samples.filter(x => x?.backColor == '#FF0100');
                const finalNotOkaySample = notOkSample?.length
                    ? notOkSample[notOkSample.length - 1].FunctionValue
                    : samples[samples.length - 1].FunctionValue;
                // Use Math.min only if numericValues has at least one number
                actualValue = finalNotOkaySample;
            } else {
                // For string values: return first non-"ok" FunctionValue
                actualValue = 'ok';
                for (const sample of samples) {
                    const val = sample.FunctionValue?.toLowerCase();
                    if (val && val !== 'ok') {
                        actualValue = sample.FunctionValue;
                        break;
                    }
                }
            }
            return {
                ...item,
                Samples: undefined,
                ActualValue: actualValue !== Infinity ? String(actualValue) : '',
                ID: String(item.ID || ''),
                ...(item?.DefectsValue &&
                    Object.keys(item?.DefectsValue)?.length && {
                        Case: 'DEFECTPHENOMENON',
                        StrID: item?.DefectsValue.ID,
                        Name: type === 'number' ? 'CustomInspectionCharacteristicsV' : 'CustomInspectionCharacteristics',
                        Topic: 'DefectPhenomenon',
                    }),
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
            if (item.DisplayName === 'Approver' && typeof item.Value === 'object' && item.Value !== null) {
                return {
                    ...item,
                    Value: item.Value.value,
                    Case: 'SUPERVISOR',
                    StrID: item.Value.ID,
                    Name: 'CustomInspection',
                    Topic: 'Supervisor',
                };
            }
            return item;
        });
        const payLoad = {
            EnteredBy: icUserData?.userData?.UserId,
            InspectedDate: moment(new Date()).format('MM/DD/YYYY hh:mm:ss A'),
            characteristicDetails: templist,
            GeneralInfo: updatedGeneralInfo,
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
        if (response?.insertedCount) {
            setSyncModal(false);
            dispatch({
                type: 'REMOVE_INSPECT_LIST',
                inspectionToRemove: selectedValue,
            });
            getAllCompletedData(true);
        } else {
            showMessage({
                message: 'Something went wrong',
                backgroundColor: COLORS.ERROR,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'warning',
                position: 'right',
                style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
            });
        }
        setDisableBtn(false);
    };
    const handleSingleDeletePress = async () => {
        const flag = await deleteInspectionByUniqueId(icUserData?.userData?.UserId, icUserData?.userData?.Siteid, selectedValue.uniqueId);
        if (flag) {
            setShowDelete(false);
            getAllCompletedData(false);
        } else {
            showErrorMessage('Error deleting inspection');
        }
    };
    return (
        <CustomHeader title="Completed Inspection" activeTabId={3} handleSyncPress={handleSyncPress}>
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
            {/* <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        handleISbtnpress();
                    }}
                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                    Inspection Schedule
                </ButtonComponent>
            </View> */}
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
                                    {optionsList.map(item => {
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
                                <View>
                                    <ICCheckBox
                                        isChecked={checkBox}
                                        label="Supervisor Approved"
                                        onChange={() => {
                                            setCheckBox(!checkBox);
                                        }}
                                    />
                                </View>
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
                                        handleSingleFormSync();
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
        fontSize: RFPercentage(2.2),
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
        fontSize: RFPercentage(1.8),
    },
    bubbleBox: {
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CompletedInspection;
