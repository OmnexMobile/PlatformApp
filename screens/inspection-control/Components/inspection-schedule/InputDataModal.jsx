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


const errorObj = {
    shift: false,
    lotNumber: false,
    lotQty: false,
    receiptNumber: false,
    frequency: false,
};

const InputDataModal = ({ modalVisible = false, hideModal = () => {}, selectedValue = {}, shiftData = [], userData = {} }) => {
    const dispatch = useDispatch();
    const { icSettings } = useSelector(state => state.inspection);
    console.log(icSettings, 'icSettings', selectedValue.ReferenceNo);
    const [formData, setFormData] = useState({
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
    const [isEditableField,setIsEditableField]=useState({
        lotNo:true
    })

    const getFrequencyList = async () => {
        let strType = selectedValue?.TypeOfInspection == '2' ? 'Aqua' : 'Custom';
        const formData = new FormData();
        formData.append('strType', strType);
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
            setFrqList([]);
        }
        return true;
    };
    const getResponsibleList = async () => {
        const formData = new FormData();
        formData.append('strUserID', userData?.UserId);
        formData.append('strOperationID', selectedValue?.OperationID);
        formData.append('strProductionitemID', selectedValue?.ProductionItemId);
        // formData.append('strOperationID', '20823;20828;20841');
        // formData.append('strProductionitemID', '20818');
        formData.append('strFrequencyID', '');
        const response = await postAPI(`${ApiUrl.IC_RESPONSIBLE_PERSON}`, formData);
        console.log(response, 'userData');
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
            setFormData(pre => ({ ...pre, lotNumber: selectedValue?.LotNo, lotQty: selectedValue?.ProductionQty?.toString() }));
            if(selectedValue?.LotNo){
                setIsEditableField((pre)=>({...pre,lotNo:false}))
            }
            getPageApi();
        }
    }, [selectedValue, userData]);
    const handleInputChange = (key, value) => {
        setFormData(pre => ({ ...pre, [key]: value }));
    };
    const handleValidation = () => {
        const { shift, lotNumber, lotQty, frequency, receiptNumber } = formData;
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
        if (frequency == null) {
            errorobj.frequency = true;
        }
        if (receiptNumber == '') {
            errorobj.receiptNumber = true;
        }
        setErrorList(errorobj);
        return Object.values(errorobj).every(item => item == false);
    };
    const handleSubmitBtnPress = () => {
        const result = handleValidation();
        if (result) {
            dispatch({ type: 'INSPECT_LIST', inspectList: [] });
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
            hideModal();
        }
    };
    return (
        <>
            {showLoader ? (
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
                        height: 500,
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
                                    value={formData.shift}
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
                                    value={formData.lotNumber}
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
                                    value={formData.lotQty}
                                    keyboardType="numeric"
                                />
                                {Boolean(errorList.lotQty) && (
                                    <HelperText type="error" visible={errorList.lotQty} padding={'none'} style={styles.errorStyle}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            {Boolean(selectedValue?.ReferenceNo?.length) && (
                                <View style={[styles.inputContainer]}>
                                    <Text style={styles.inputText}>
                                        Serial Number
                                    </Text>
                                    <TextInput
                                        style={[styles.inputBox,{backgroundColor:COLORS.icborder}]}
                                        value={selectedValue?.ReferenceNo}
                                        editable={false}
                                    />
                                </View>
                            )}
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Receipt Number <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.inputBox}
                                    onChangeText={val => {
                                        handleInputChange('receiptNumber', val);
                                    }}
                                    value={formData.receiptNumber}
                                />
                                {Boolean(errorList.receiptNumber) && (
                                    <HelperText type="error" visible={errorList.receiptNumber} padding={'none'} style={styles.errorStyle}>
                                        This field is required
                                    </HelperText>
                                )}
                            </View>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Choose Frequency <Text style={[styles.rquired]}>*</Text>
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
                            {Boolean(!icSettings.IsRespPartyBasedOnTeam) && (
                                <View style={[styles.inputContainer]}>
                                    <Text style={styles.inputText}>Responsible Person</Text>
                                    <DynamicDropDown
                                        isMultiSelect={icSettings?.IsRespPartyMultiSelect}
                                        list={resList || []}
                                        handleSelectedList={value => {
                                            console.log(value, '**************value');
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
