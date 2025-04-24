import { RadioButton } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider, HelperText, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SingleDropDown from '../SingleDropDown';
import DynamicDropDown from '../DynamicDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { Bubbles } from 'react-native-loader';
import { showMessage } from 'react-native-flash-message';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const errorObj = {
    shift: false,
    lotNumber: false,
    lotQty: false,
    receiptNumber: false,
    frequency: false,
};

const InputDataModal = ({
    modalVisible = false,
    hideModal = () => {},
    selectedValue = {},
    shiftData = [],
    userData = {},
    handleSubmitPress = () => {},
}) => {
    const dispatch = useDispatch();
    const { icSettings } = useSelector(state => state.inspection);
    const [formFields, setFormFields] = useState({
        shift: null,
        lotNumber: '',
        lotQty: '',
        frequency: null,
        responsible: [],
        receiptNumber: '',
    });
    const [frqList, setFrqList] = useState([]);
    const [resList, setResList] = useState([]);
    const [errorList, setErrorList] = useState(errorObj);
    const [showLoader, setShowLoader] = useState(true);
    const [isEditableField, setIsEditableField] = useState({
        lotNo: true,
    });
    console.log(selectedValue?.TypeOfInspection, 'TypeOfInspection');

    const getFrequencyList = async () => {
        // let strType = selectedValue?.TypeOfInspection == '2' ? 'Aqua' : 'Custom';
        const formData = new FormData();
        formData.append('strType', selectedValue?.InspectionType);
        formData.append('strId', selectedValue?.ProductionItemId);
        formData.append('strOperationId', selectedValue?.OperationID);
        formData.append('intUserID', userData?.UserId);
        const response = await postAPI(`${ApiUrl.IC_FRQ_FORM}`, formData);
        if (response.Success) {
            if (response?.Data?.length) {
                let temp = [];
                response?.Data.forEach(item => {
                    temp.push({
                        label: item?.SampleFrequency,
                        value: item?.FrequencyId,
                        ...item,
                    });
                });
                setFrqList(temp || []);
            } else {
                setFrqList([]);
            }
        } else {
            let response = {
                Data: [
                    {
                        FrequencyId: 1,
                        SampleFrequency: 'Frequency1',
                        FrequencyCode: 'obi02171',
                    },
                ],
                Success: true,
                Message: 'Success',
            };
            let temp = [];
            response?.Data.forEach(item => {
                temp.push({
                    label: item?.SampleFrequency,
                    value: item?.FrequencyId,
                    ...item,
                });
            });
            setFrqList(temp || []);

            // setFrqList([]);
        }
        return true;
    };
    const getResponsibleList = async () => {
        const formData = new FormData();
        formData.append('strUserID', userData?.UserId);
        formData.append('strOperationID', selectedValue?.OperationID);
        formData.append('strProductionitemID', selectedValue?.ProductionItemId);
        formData.append('strFrequencyID', '');
        const response = await postAPI(`${ApiUrl.IC_RESPONSIBLE_PERSON}`, formData);
        if (response.length) {
            let temp = [];
            response.forEach(item => {
                temp.push({
                    label: item?.Name,
                    value: item?.Code,
                    ...item,
                });
            });
            setResList(temp);
        } else {
            setResList([]);
        }
        return true;
    };
    const getPageApi = async () => {
        await getFrequencyList();
        await getResponsibleList();
        setShowLoader(false);
    };
    useEffect(() => {
        if (Object.keys(selectedValue).length && Object.keys(userData).length) {
            setFormFields(pre => ({ ...pre, lotNumber: selectedValue?.LotNo, lotQty: selectedValue?.ProductionQty?.toString() }));
            if (selectedValue?.LotNo) {
                setIsEditableField(pre => ({ ...pre, lotNo: false }));
            }
            getPageApi();
        }
    }, [selectedValue, userData]);
    const handleInputChange = (key, value) => {
        setFormFields(pre => ({ ...pre, [key]: value }));
    };
    const handleValidation = () => {
        const { shift, lotNumber, lotQty, frequency, receiptNumber } = formFields;
        const errorobj = {
            shift: false,
            lotNumber: false,
            lotQty: false,
            frequency: false,
            receiptNumber: false,
        };
        if (shift == null) {
            errorobj.shift = true;
        }
        if (lotNumber == '') {
            errorobj.lotNumber = true;
        }
        if (lotQty == '') {
            errorobj.lotQty = true;
        }
        if (frequency == null && selectedValue.TypeOfInspection == 2) {
            errorobj.frequency = true;
        }
        if (receiptNumber == '' && selectedValue.TypeOfInspection == 1) {
            errorobj.receiptNumber = true;
        }
        setErrorList(errorobj);
        return Object.values(errorobj).every(item => item == false);
    };
    const handleSubmitBtnPress = async () => {
        const result = handleValidation();
        if (result) {
            const deviceId = await AsyncStorage.getItem('deviceid');
            const formData = new FormData();
            formData.append('OrderDetailsId', selectedValue?.OrderDetailsId);
            formData.append('OrderNumber', selectedValue?.OrderNumber);
            formData.append('ProductionItemId', selectedValue?.ProductionItemId);
            formData.append('ProductionItemName', selectedValue?.ProductionItem);
            formData.append('Description', selectedValue?.Description);
            formData.append('PIDHierarchy', selectedValue?.PIHierarchy);
            formData.append('OperationIds', selectedValue?.OperationID);
            formData.append('OperationName', selectedValue?.OperationName);
            formData.append('OperationHierarchy', selectedValue?.OperationHierarchy);
            formData.append('SupplierId', selectedValue.SupplierId);
            formData.append('SupplierName', selectedValue.SupplierName);
            formData.append('CustomerId', selectedValue?.CustomerId);
            formData.append('CustomerName', selectedValue?.CustomerName);
            formData.append('InspectionLevelId', selectedValue?.InspectionLevelId);
            formData.append('InspectionLevel', selectedValue?.InspectionLevel);
            formData.append('SamplingPlanId', selectedValue?.SamplingPlanId);
            formData.append('SamplingPlan', selectedValue?.SamplingPlan);
            formData.append('DefectTypeId', selectedValue?.DefectTypeId);
            formData.append('DefectTypeNumber', selectedValue?.DefectTypeNumber);
            formData.append('InspectionId', selectedValue?.InspectionId);
            formData.append('Inspection', selectedValue?.Inspection);
            formData.append('InspectionType', selectedValue?.InspectionType);
            formData.append('ProductionStartDate', selectedValue?.ProductionStartDate);
            formData.append('ProductionStartTime', selectedValue?.ProductionStartTime);
            formData.append('ProductionEndTime', selectedValue?.ProductionEndTime);
            formData.append('StartDate', selectedValue?.StartDate);
            formData.append('EndDate', selectedValue?.EndDate);
            formData.append('AreaID', '');
            formData.append('DeptID', '');
            formData.append('CDepartmentName', '');
            formData.append('Area', '');
            formData.append('syncMode', 0);
            formData.append('supervisorApproved', 0);

            // other
            if (selectedValue.TypeOfInspection == '2') {
                formData.append('OperationWSIDs', selectedValue?.OperationWSID);
            } else {
                formData.append('OperationWSID', selectedValue?.OperationWSID);
            }

            formData.append('deviceid', deviceId);
            formData.append('UserId', userData?.UserId);
            formData.append('UserName', userData?.FullName);
            formData.append('SiteId', userData?.Siteid);
            formData.append('LanguageId', 1);
            formData.append('LotNo', formFields?.lotNumber);
            formData.append('ShiftId', formFields?.shift?.ShiftID);
            formData.append('Shift', formFields?.shift?.ShiftName);
            formData.append('FrequencyID', formFields?.frequency?.FrequencyId || '');
            formData.append('SampleFrequency', formFields?.frequency?.SampleFrequency || '');
            formData.append('ProductionQty', formFields?.lotQty);
            formData.append('ReceiptNo', formFields?.receiptNumber || '');
            formData.append('Executor', JSON.stringify(formFields.responsible)); // responsible party
            // need to update asper API change
            formData.append('EnteredDate', moment(new Date()).format('MM/DD/YYYY h:mm:ss A '));
            // formData.append('SamplingHierarchy', ', , AQL=');
            formData.append('CreatedByID', userData?.UserId);

            const response = await postAPI(ApiUrl.IC_FORM_SUBMIT, formData);
            if (response.Success) {
                const { shift, lotNumber, lotQty, frequency, receiptNumber } = formFields;
                dispatch({
                    type: 'INSPECT_LIST',
                    inspectList: [
                        {
                            intProductionItemID: selectedValue?.ProductionItemId,
                            strProductionItemName: selectedValue?.ProductionItem,
                            intShiftID: shift?.ShiftID,
                            strShiftName: shift?.ShiftName,
                            strOperationName: selectedValue.OperationName,
                            strFrequencyName: frequency?.SampleFrequency,
                            intInspectionTypeID: selectedValue?.TypeOfInspection,
                            strInspectionType: selectedValue.InspectionType,
                            strLotNo: lotNumber,
                            intInspectionID: selectedValue?.ProductionItemId,
                            receiptNumber: receiptNumber,
                            GeneralInfo: response.GeneralInfo,
                            VariableCharacteristics: response.VariableCharacteristics,
                            AttributeCharacteristics: response.AttributeCharacteristics,
                        },
                    ],
                });
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
                handleSubmitPress();
                hideModal();
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
        }
    };
    return (
        <>
            {Boolean(showLoader) ? (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={showLoader}
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
            ) : (
                <Modal
                    visible={modalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                        backgroundColor: '#fff',
                        width: '90%',
                        alignSelf: 'center',
                        maxHeight: 500,
                        paddingHorizontal: 20,
                        paddingTop: 20,
                    }}>
                    <Text style={styles.headertext}>Form Input Data</Text>
                    <Divider />
                    <ScrollView style={[styles.container]} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        <View style={[]}>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Shift <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <SingleDropDown
                                    data={shiftData}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    value={formFields.shift}
                                    onChange={val => {
                                        handleInputChange('shift', val);
                                    }}
                                />
                                {Boolean(errorList.shift) && (
                                    <HelperText type="error" visible={errorList.shift} padding={'none'} style={styles.errorStyle}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Lot Number <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <TextInput
                                    value={formFields.lotNumber}
                                    style={styles.inputBox}
                                    onChangeText={val => {
                                        handleInputChange('lotNumber', val);
                                    }}
                                    editable={isEditableField.lotNo}
                                />
                                {Boolean(errorList.lotNumber) && (
                                    <HelperText type="error" visible={errorList.lotNumber} padding={'none'} style={styles.errorStyle}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Lot Quantity <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.inputBox}
                                    onChangeText={val => {
                                        handleInputChange('lotQty', val);
                                    }}
                                    value={formFields.lotQty}
                                    keyboardType="numeric"
                                />
                                {Boolean(errorList.lotQty) && (
                                    <HelperText type="error" visible={errorList.lotQty} padding={'none'} style={styles.errorStyle}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            {Boolean(icSettings?.IsRefNo) && (
                                <View style={[styles.inputContainer]}>
                                    <Text style={styles.inputText}>Serial Number</Text>
                                    <TextInput
                                        style={[styles.inputBox, { backgroundColor: COLORS.icborder }]}
                                        value={selectedValue?.ReferenceNo}
                                        editable={false}
                                    />
                                </View>
                            )}
                            {Boolean(selectedValue.TypeOfInspection == 1) && (
                                <View style={[styles.inputContainer]}>
                                    <Text style={styles.inputText}>
                                        Receipt Number <Text style={[styles.rquired]}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        onChangeText={val => {
                                            handleInputChange('receiptNumber', val);
                                        }}
                                        value={formFields.receiptNumber}
                                    />
                                    {Boolean(errorList.receiptNumber) && (
                                        <HelperText type="error" visible={errorList.receiptNumber} padding={'none'} style={styles.errorStyle}>
                                            This field is required
                                        </HelperText>
                                    )}
                                </View>
                            )}
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Choose Frequency {Boolean(selectedValue.TypeOfInspection == 2) && <Text style={[styles.rquired]}>*</Text>}
                                </Text>
                                <SingleDropDown
                                    data={frqList}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={val => {
                                        handleInputChange('frequency', val);
                                    }}
                                />
                                {Boolean(errorList.frequency) && (
                                    <HelperText type="error" visible={errorList.frequency} padding={'none'} style={[styles.errorStyle]}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            {Boolean(!icSettings.IsRespPartyBasedOnTeam) && Boolean(selectedValue.TypeOfInspection == 2) && (
                                <View style={[styles.inputContainer]}>
                                    <Text style={styles.inputText}>Responsible Person</Text>
                                    <DynamicDropDown
                                        isMultiSelect={icSettings?.IsRespPartyMultiSelect}
                                        list={resList || []}
                                        handleSelectedList={value => {
                                            console.log(value, '**************value');
                                            handleInputChange('responsible', value);
                                        }}
                                        isDisable={icSettings?.IsRespPartyNonEditable}
                                    />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <Divider />
                    <View style={styles.btnConatiner}>
                        <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                            <Text style={styles.btnStyle}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelConatiner}
                            onPress={() => {
                                handleSubmitBtnPress();
                            }}>
                            <Text style={styles.btnStyle}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2),
        paddingBottom: 12,
        color: '#000',
    },
    inputContainer: {
        paddingVertical: 7,
    },
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 3,
        borderColor: COLORS.icBottomBox,
        marginTop: 10,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
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
        fontFamily: 'OpenSans-Bold',
        fontSize: RFPercentage(1.8),
    },
    rquired: {
        color: COLORS.ERROR,
    },
    inputText: {
        color: '#000',
        fontFamily: 'OpenSans-Regular',
    },
    errorStyle: {
        color: COLORS.ERROR,
        marginBottom: -5,
    },
});

export default InputDataModal;
