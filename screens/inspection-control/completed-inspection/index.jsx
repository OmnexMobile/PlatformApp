import { ButtonComponent, CheckBox, RadioButton, TextComponent } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    const { icUserData, inspectList } = useSelector(state => state.inspection);
    const inspectionRef = useRef(inspectList);
    const [syncModal, setSyncModal] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Sync');
    const [checkBox, setCheckBox] = useState(false);
    const navigation = useNavigation();
    const [showDelete, setShowDelete] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState({});

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    // Keep it updated
    useEffect(() => {
        inspectionRef.current = inspectList;
    }, [inspectList, isFocused]);
    const getAllCompletedData = async (showSkt = true) => {
        showSkt && setShowSkeleton(true);
        const completedList = inspectionRef?.current?.filter(item => item?.status === 'Completed');
        setMasterData(completedList?.length ? completedList : []);
        setShowSkeleton(false);
        setRefreshing(false);
    };
    const onRefresh = () => {
        setRefreshing(true);
        getAllCompletedData(false);
    };
    useEffect(() => {
        getAllCompletedData();
    }, [inspectList]);

    const handleISbtnpress = () => {
        navigation.navigate(ROUTES.INSPECTION_SCHEDULE);
    };
    const handleSyncPress = item => {
        setSyncModal(true);
        setSelectedValue(item);
    };
    const hideModal = () => {
        setSyncModal(false);
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
                        style={styles.launchCard}
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
    const convertSampleList = (templist, type = 'number') => {
        let characteristicDetails = templist.map(item => {
            const samples = item.Samples || [];
            let actualValue = null;

            if (type === 'number') {
                // Filter only valid numeric values
                const numericValues = samples.map(s => parseFloat(s.FunctionValue)).filter(val => !isNaN(val));

                // Use Math.min only if numericValues has at least one number
                actualValue = numericValues.length > 0 ? Math.min(...numericValues) : null;
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
                samples: samples.map(sample => ({
                    sampleName: String(sample.sampleName || ''),
                    data: {
                        FuncDetailsId: sample.FuncDetailsId || '',
                        SerialNo: String(sample.SerialNo || ''),
                        FunctionValue: sample.FunctionValue || '',
                        status: sample.status,
                        backColor: sample.backColor,
                        fontColor: sample.fontColor,
                        EnteredDate: sample.EnteredDate,
                        IsApproved: sample.IsApproved,
                        IsNumericSample: sample.IsNumericSample,
                        IsRejected: sample.IsRejected,
                        Comments: sample.Comments,
                    },
                })),
            };
        });
        return characteristicDetails;
    };
    const handleSingleFormSync = async () => {
        const templist = [
            ...convertSampleList(selectedValue.VariableCharacteristics, 'number'),
            ...convertSampleList(selectedValue.AttributeCharacteristics, 'char'),
        ];
        const payLoad = {
            EnteredBy: icUserData?.userData?.UserId,
            InspectedDate: moment(new Date()).format('DD/MM/YYYY hh:mm:ss A'),
            characteristicDetails: templist,
            GeneralInfo: selectedValue.GeneralInfo,
        };
        const response = await postAPI(ApiUrl.IC_SINGLE_SYNC, payLoad);
        if (response?.insertedCount) {
            setSyncModal(false);
            dispatch({
                type: 'REMOVE_INSPECT_LIST',
                inspectionToRemove: selectedValue,
            });
            getAllCompletedData(true);
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
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        handleISbtnpress();
                    }}>
                    Inspection Schedule
                </ButtonComponent>
            </View>
            {Boolean(syncModal) && (
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
                                                    setSelectedRadio(val.value);
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
                        <View>
                            <Divider />
                            <View style={styles.btnConatiner}>
                                <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                                    <Text style={styles.btnStyle}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelConatiner}
                                    onPress={() => {
                                        handleSingleFormSync();
                                    }}>
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
                    dispatch({
                        type: 'REMOVE_INSPECT_LIST',
                        inspectionToRemove: selectedValue,
                    });
                    setShowDelete(false);
                    getAllCompletedData(false);
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
        backgroundColor: COLORS.fiBgColor,
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
});

export default CompletedInspection;
