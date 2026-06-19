import { RadioButton } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider, HelperText, Modal } from 'react-native-paper';
import { RFPercentage } from '../../../../helpers/responsiveFont';
import SingleDropDown from '../SingleDropDown';
import DynamicDropDown from '../DynamicDropDown';
import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { isArray } from 'underscore';
import { addInspectionData } from 'store/database/inspectStorage';

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
    selectedSite = {},
}) => {
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
    const [btndisabled, setBtnDisabled] = useState(false);
    useEffect(() => {
        const currentShift = getCurrentShift(shiftData);
        if (currentShift) {
            setFormFields({ ...formFields, shift: currentShift });
        }
    }, [shiftData]);
    const getCurrentShift = shifts => {
        const now = moment(); // current time

        return shifts.find(shift => {
            const from = moment(shift.Fromtime, 'hh:mm A');
            const to = moment(shift.Totime, 'hh:mm A');

            // If shift wraps past midnight
            if (to.isBefore(from)) {
                return now.isAfter(from) || now.isBefore(to);
            } else {
                return now.isBetween(from, to, undefined, '[)');
            }
        });
    };

    const getFrequencyList = async () => {
        // let strType = selectedValue?.TypeOfInspection == '2' ? 'Aqua' : 'Custom';
        const formData = new FormData();
        formData.append('strType', selectedValue?.InspectionType);
        formData.append('strId', selectedValue?.ProductionItemId);
        formData.append('strOperationId', selectedValue?.OperationID);
        formData.append('intUserID', userData?.UserId);
        formData.append('SiteId', userData?.Siteid);
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
            setFrqList([]);
        }
        return true;
    };
    const getResponsibleList = async freq => {
        setBtnDisabled(true);
        const formData = new FormData();
        formData.append('strUserID', userData?.UserId);
        formData.append('strOperationID', selectedValue?.OperationID);
        formData.append('strProductionitemID', selectedValue?.ProductionItemId);
        formData.append('strFrequencyID', freq.FrequencyId);
        formData.append('SiteId', userData?.Siteid);
        const response = await postAPI(`${ApiUrl.IC_RESPONSIBLE_PERSON}`, formData);
        if (response.length) {
            let temp = [];
            response.forEach(item => {
                temp.push({
                    label: item?.Name,
                    value: item?.Code,
                    isChecked: false,
                    ...item,
                });
            });
            setResList(temp);
            if (temp?.length) {
                if (icSettings?.IsRespPartyMultiSelect) {
                    let updateisChecked = temp.map(item => ({ ...item, isChecked: true }));
                    setFormFields({ ...formFields, frequency: freq, responsible: [...updateisChecked] });
                    setResList(updateisChecked);
                } else {
                    let updateisChecked = temp.map((item, index) => ({
                        ...item,
                        isChecked: index == 0 ? true : false,
                    }));
                    setFormFields({ ...formFields, frequency: freq, responsible: [updateisChecked[0]] });
                    setResList(updateisChecked);
                }
            }
        } else {
            setResList([]);
        }
        setBtnDisabled(false);
        return true;
    };
    const getPageApi = async () => {
        await getFrequencyList();
        // await getResponsibleList();
        setShowLoader(false);
    };
    useEffect(() => {
        if (Object.keys(selectedValue).length && Object.keys(userData).length) {
            setFormFields(pre => ({
                ...pre,
                lotNumber: selectedValue?.LotNo,
                lotQty: selectedValue?.LotSize == 0 ? '1' : selectedValue?.LotSize?.toString(),
            }));
            if (selectedValue?.LotNo) {
                setIsEditableField(pre => ({ ...pre, lotNo: false }));
            }
            getPageApi();
        }
    }, [selectedValue, userData]);
    const handleInputChange = (key, value) => {
        console.log('called');
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
    const getAllFiles = async () => {
        const formData = new FormData();
        formData.append('operationId', selectedValue?.OperationID);
        formData.append('productionItemH', selectedValue?.ProductionItemId);
        const response = await postAPI(ApiUrl.IC_GET_ATTACHEMENTS, formData);
        if (response.Success) {
            return response.Data || [];
        } else {
            return [];
        }
    };
    const handleSubmitBtnPress = async () => {
        const result = handleValidation();
        if (result) {
            setShowLoader(true);
            const deviceId = await AsyncStorage.getItem('deviceid');
            const formData = new FormData();
            formData.append('OrderDetailsId', selectedValue?.OrderDetailsId);
            formData.append('OrderNumber', selectedValue?.OrderNumber);
            // other
            if (selectedValue.TypeOfInspection == '2') {
                formData.append('OperationWSIDs', selectedValue?.OperationWSID);
            } else {
                formData.append('OperationWSID', selectedValue?.OperationWSID);
            }
            formData.append('ProductionItemId', selectedValue?.ProductionItemId || '');
            formData.append('ProductionItemName', selectedValue?.ProductionItem || '');
            formData.append('Description', selectedValue?.Description || '');
            formData.append('PIDHierarchy', selectedValue?.PIHierarchy || '');
            formData.append('OperationIds', selectedValue?.OperationID || '');
            formData.append('OperationName', selectedValue?.OperationName || '');
            formData.append('OperationHierarchy', selectedValue?.OperationHierarchy || '');
            formData.append('SupplierId', selectedValue.SupplierId || '');
            if (selectedValue.TypeOfInspection == '1') {
                formData.append('Supplier', selectedValue.SupplierName || '');
            } else {
                formData.append('SupplierName', selectedValue.SupplierName || '');
            }
            formData.append('CustomerId', selectedValue?.CustomerId || '');
            if (selectedValue.TypeOfInspection == '3') {
                formData.append('Customer', selectedValue?.CustomerName || '');
            } else {
                formData.append('CustomerName', selectedValue?.CustomerName || '');
            }
            formData.append('CustomerName', selectedValue?.CustomerName || '');
            formData.append('InspectionLevelId', selectedValue?.InspectionLevelId || '');
            formData.append('InspectionLevel', selectedValue?.InspectionLevel || '');
            formData.append('SamplingPlanId', selectedValue?.SamplingPlanId || '');
            formData.append('SamplingPlan', selectedValue?.SamplingPlan || '');
            formData.append('DefectTypeId', selectedValue?.DefectTypeId || '');
            formData.append('DefectTypeNumber', selectedValue?.DefectTypeNumber || '');
            formData.append('InspectionId', selectedValue?.InspectionId || '');
            formData.append('Inspection', selectedValue?.Inspection || '');
            formData.append('InspectionType', selectedValue?.InspectionType || '');
            formData.append('ReceiptNo', formFields?.receiptNumber || '');
            formData.append('ProductionStartDate', selectedValue?.ProductionStartDate || '');
            formData.append('ProductionStartTime', selectedValue?.ProductionStartTime || '');
            formData.append('ProductionEndTime', selectedValue?.ProductionEndTime || '');
            formData.append('StartDate', selectedValue?.StartDate || '');
            formData.append('EndDate', selectedValue?.EndDate || '');
            formData.append('AreaID', '');
            formData.append('DeptID', '');
            formData.append('CDepartmentName', '');
            formData.append('Area', '');
            formData.append('syncMode', 0);
            formData.append('supervisorApproved', 0);
            formData.append('deviceid', deviceId);
            formData.append('UserId', userData?.UserId || '');
            formData.append('UserName', userData?.FullName || '');
            if (selectedValue?.TypeOfInspection == '2') {
                formData.append('ProcessId', 1);
            }
            formData.append('SiteId', userData?.Siteid || '');
            formData.append('LanguageId', 1);
            formData.append('LotNo', formFields?.lotNumber || '');
            formData.append('ShiftId', formFields?.shift?.ShiftID || '');
            formData.append('Shift', formFields?.shift?.ShiftName || '');
            formData.append('FrequencyID', formFields?.frequency?.FrequencyId || '');
            formData.append('SampleFrequency', formFields?.frequency?.SampleFrequency || '');
            formData.append('ProductionQty', selectedValue?.LotSize || '');

            formData.append('Executor', formFields.responsible.length > 0 ? formFields.responsible.map(item => item.Name).join(';') : ''); // responsible party
            // need to update asper API change
            formData.append('EnteredDate', moment(new Date()).format('MM/DD/YYYY h:mm:ss A '));
            // formData.append('SamplingHierarchy', ', , AQL=');
            formData.append('CreatedByID', userData?.UserId);
            formData.append('LotSize', formFields?.lotQty);
            // as of now we added once check with backend dev
            formData.append('FormId', selectedValue?.FormId || '');
            formData.append('PropertyName', 'ActualValue');

            const response = await postAPI(ApiUrl.IC_FORM_SUBMIT, formData);
            if (response.Success) {
                const attachments = await getAllFiles();
                const { shift, lotNumber, lotQty, frequency, receiptNumber } = formFields;
                let InspectionID = '';
                if (response.VariableCharacteristics.length > 0) {
                    InspectionID = response.VariableCharacteristics[0].InspectionID;
                } else if (response.AttributeCharacteristics.length > 0) {
                    InspectionID = response.AttributeCharacteristics[0].InspectionID;
                }
                let inspectObj = {
                    uniqueId: uuid.v4(),
                    FormId: selectedValue?.FormId,
                    OperationID: selectedValue?.OperationID,
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
                    OrderDetailsId: selectedValue?.OrderDetailsId,
                    InspectionEntryDetailsID: response?.Data || '',
                    InspectionID: InspectionID,
                    userType: 'Inspector',
                    attachments: attachments,
                    userId: selectedSite?.UserId,
                    siteId: selectedSite?.Siteid,
                };
                await addInspectionData(selectedSite?.UserId, selectedSite?.Siteid, inspectObj.uniqueId, inspectObj);
                showMessage({
                    message: 'Form Downloaded Successfully',
                    backgroundColor: COLORS.SUCCESS,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'success',
                    position: 'right',
                    style: { height: 150, alignItems: 'flex-end' },
                });
                handleSubmitPress(selectedValue);
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
                    style: { height: 150, alignItems: 'flex-end' },
                });
            }
        }
        setShowLoader(false);
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
                    <ActivityIndicator size="large" color="#12C0CF" />
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
                                    Lot Size <Text style={[styles.rquired]}>*</Text>
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
                                    onChange={async val => {
                                        handleInputChange('frequency', val);
                                        if (Boolean(selectedValue.TypeOfInspection == 2)) {
                                            await getResponsibleList(val);
                                        }
                                    }}
                                />
                                {Boolean(errorList.frequency) && (
                                    <HelperText type="error" visible={errorList.frequency} padding={'none'} style={[styles.errorStyle]}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            {Boolean(selectedValue.TypeOfInspection == 2) && (
                                <View style={[styles.inputContainer]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.inputText}>Responsible Person</Text>
                                        {Boolean(btndisabled) && <ActivityIndicator style={{ marginLeft: 5 }} size="small" color={COLORS.apptheme} />}
                                    </View>
                                    <DynamicDropDown
                                        isMultiSelect={icSettings?.IsRespPartyMultiSelect}
                                        list={resList || []}
                                        handleSelectedList={value => {
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
                        <TouchableOpacity disabled={btndisabled} style={styles.cancelConatiner} onPress={hideModal}>
                            <Text style={styles.btnStyle}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={btndisabled}
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
