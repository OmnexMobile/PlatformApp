import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    BackHandler,
    FlatList,
    InteractionManager,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMM from 'react-native-vector-icons/MaterialIcons';
import FilterWithMenu from '../FilterWithMenu';
import { ButtonComponent } from 'components';
import { RFPercentage } from 'helpers/utils';
import { calculateCapability, getCPKPPKAlert, validateSPC } from 'helpers/processCapability';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import SampleCharInfo from './SampleCharInfo';
import moment from 'moment';
import DeleteModal from '../DeleteModal';
import ConfirmationModal from './ConfirmationModal';
import { showMessage } from 'react-native-flash-message';
import CapabilityCard from '../CapabilityCard';
import ZoomableImage from '../ZoomableImage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CaptureDefect from './CaptureDefect';
import { SafeAreaView } from 'react-native-safe-area-context';
const moreList = [
    {
        id: 1,
        title: 'Next Sample',
        iconName: 'play-skip-forward-outline',
        iconFrom: 'Ionicons',
    },
    {
        id: 2,
        title: 'Add Sample',
        iconName: 'plus',
        iconFrom: 'AntDesign',
    },
];
const suzlonMoreList = [
    {
        id: 1,
        title: 'Next Sample',
        iconName: 'play-skip-forward-outline',
        iconFrom: 'Ionicons',
    },
];
const BorderContent = ({ title = 'Title', count = 0, color = '#000' }) => {
    return (
        <View style={[styles.borderContainer]}>
            <View style={[styles.borderBox, { backgroundColor: color }]} />
            <View>
                <Text style={[styles.borderText]}>{title}</Text>
                <Text style={[styles.borderText, { color: color, fontFamily: 'OpenSans-SemiBold' }]}>{count}</Text>
            </View>
        </View>
    );
};

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const CharacteristicsInfo = ({
    selectedData = {},
    type = '',
    setShowChar = () => {},
    masterData,
    setMasterData = () => {},
    setValueUpadted = () => {},
    handleSavePress = () => {},
    handleNextSamplePress = () => {},
    icSettings = {},
    inspectionType = '',
    showCharInfo = false,
    setSelectedData = () => {},
    setShowConfirmModal = () => {},
    showConfirmModal = false,
    setTimer = () => {},
    timer = null,
    userUpdateValue,
    setUserUpdateValue = () => {},
    setTypeOfModal = () => {},
    flatListRef = null,
    FileList = [],
    userType = '',
}) => {
    const [showCPKModal, setShowCPKModal] = useState(false);
    const [showImageWithSample, setShowImageWithSample] = useState(false);
    const [showCaptureDefect, setShowCaptureDefect] = useState(false);
    const imageFiles = useMemo(() => {
        return FileList.filter(file => imageExtensions.includes(file.FileExtension?.toLowerCase())).map(file => ({
            uri: `data:image/${file.FileExtension};base64,${file.FileContentBase64}`,
        }));
    }, [FileList]);

    console.log('imageFiles', imageFiles.length);
    useEffect(() => {
        const backAction = () => {
            setShowChar(false);
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);
    const inputsRef = useRef([]);
    const navigation = useNavigation();
    console.log('FileList', FileList.length);
    useEffect(() => {
        getOverAllData();
    }, [type, selectedData]);
    const getOverAllData = () => {
        if (selectedData?.isSamplePopup) {
            if (type == 'number') {
                let valueSampleSize = selectedData?.Samples?.length && selectedData?.Samples.filter(x => x?.value != '')?.length;
                let sampleEnterdSize = masterData.filter(x => x?.value != '')?.length;
                if (Object.keys(selectedData).length && !selectedData?.Samples?.length && sampleEnterdSize == 0) {
                    console.log('********************step1');
                    let sampleSize = selectedData.CSampleSize;
                    const temp = Array.from({ length: sampleSize }, (_, index) => ({
                        id: index + 1,
                        count: index + 1,
                        value: '',
                        lowValue: selectedData.CLowValue,
                        highValue: selectedData.CHighValue,
                        tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                        // newly add based on syn api
                        sampleName: index + 1,
                        SerialNo: index + 1,
                        status: 1,
                        fontColor: '#000000',
                        IsApproved: 0,
                        IsNumericSample: '1',
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                        FunctionValue: '',
                        backColor: '',
                        EnteredDate: '',
                        IsRejected: 1,
                    }));
                    setMasterData([...temp]);
                    setValueUpadted([...temp]);
                } else if (selectedData?.Samples?.length > 0 && selectedData?.Samples?.length === selectedData?.CSampleSize) {
                    console.log('********************step2');
                    let updatedSample = selectedData?.Samples.map(item => ({
                        ...item,
                        lowValue: selectedData.CLowValue,
                        highValue: selectedData.CHighValue,
                        tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                    }));
                    setMasterData([...updatedSample]);
                    setValueUpadted([...updatedSample]);
                } else if (valueSampleSize == 0 && selectedData?.CSampleSize > 0 && sampleEnterdSize == 0) {
                    console.log(valueSampleSize, masterData.filter(x => x?.value != '').length, '********************step3');
                    let sampleSize = selectedData.CSampleSize;
                    const temp = Array.from({ length: sampleSize }, (_, index) => ({
                        id: index + 1,
                        count: index + 1,
                        value: '',
                        lowValue: selectedData.CLowValue,
                        highValue: selectedData.CHighValue,
                        tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                        // newly add based on syn api
                        sampleName: index + 1,
                        SerialNo: index + 1,
                        status: 1,
                        fontColor: '#000000',
                        IsApproved: 0,
                        IsNumericSample: '1',
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                        FunctionValue: '',
                        backColor: '',
                        EnteredDate: '',
                        IsRejected: 1,
                    }));
                    setMasterData([...temp]);
                    setValueUpadted([...temp]);
                } else if (sampleEnterdSize != 0 && selectedData?.CSampleSize >= sampleEnterdSize) {
                    console.log(sampleEnterdSize, selectedData?.CSampleSize, '********************step4');
                    let filterMasterData = masterData
                        .filter(x => x?.value != '')
                        .map((item, index) => ({
                            ...item,
                            id: index + 1,
                            count: index + 1,
                            sampleName: index + 1,
                            SerialNo: index + 1,
                            lowValue: selectedData.CLowValue,
                            highValue: selectedData.CHighValue,
                            tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                        }));
                    let finalSampleSize = Number(selectedData?.CSampleSize) - Number(filterMasterData.length);
                    const temp = Array.from({ length: finalSampleSize }, (_, index) => ({
                        id: filterMasterData.length + index + 1,
                        count: filterMasterData.length + index + 1,
                        value: '',
                        lowValue: selectedData.CLowValue,
                        highValue: selectedData.CHighValue,
                        tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                        // newly add based on syn api
                        sampleName: filterMasterData.length + index + 1,
                        SerialNo: filterMasterData.length + index + 1,
                        status: 1,
                        fontColor: '#000000',
                        IsApproved: 0,
                        IsNumericSample: '1',
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                        FunctionValue: '',
                        backColor: '',
                        EnteredDate: '',
                        IsRejected: 1,
                    }));
                    setMasterData([...filterMasterData, ...temp]);
                    setValueUpadted([...filterMasterData, ...temp]);
                } else if (selectedData.CSampleSize <= sampleEnterdSize) {
                    console.log('********************step5');
                    let temp = JSON.parse(JSON.stringify(masterData)); // Deep copy
                    let slicedList = temp.slice(0, Number(selectedData.CSampleSize));
                    console.log(slicedList.length, 'slicedList');
                    setMasterData([...slicedList]);
                    setValueUpadted([...slicedList]);
                    // showMessage({
                    //     message: 'Something went wrong',
                    //     backgroundColor: COLORS.ERROR,
                    //     color: COLORS.white,
                    //     duration: 1500,
                    //     statusBarHeight: 40,
                    //     icon: 'warning',
                    //     position: 'right',
                    //     style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                    // });
                } else {
                    console.log('********************step6', ...selectedData?.Samples);
                    setMasterData([...selectedData?.Samples]);
                    setValueUpadted([...selectedData?.Samples]);
                }
            } else if (type == 'char') {
                let valueSampleSize = selectedData?.Samples?.length && selectedData?.Samples.filter(x => x?.value != '')?.length;
                let sampleEnterdSize = masterData.filter(x => x?.value != '')?.length;
                if (Object.keys(selectedData).length && !selectedData?.Samples?.length && sampleEnterdSize == 0) {
                    console.log('********************step1');
                    let sampleSize = selectedData.CSampleSize;
                    const temp = Array.from({ length: sampleSize }, (_, index) => ({
                        id: index + 1,
                        count: index + 1,
                        value: icSettings?.DefaultAllOK ? 'OK' : '',
                        // newly add based on syn api
                        sampleName: index + 1,
                        SerialNo: index + 1,
                        FunctionValue: icSettings?.DefaultAllOK ? 'OK' : '',
                        status: 0,
                        backColor: icSettings?.DefaultAllOK ? '#00FF00' : '',
                        fontColor: '#000000',
                        EnteredDate: moment(new Date()).format('MM/DD/YYYY h:mm:ss A '),
                        IsApproved: 0,
                        IsNumericSample: '0',
                        IsRejected: 0,
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                    }));
                    // if you want alert to ask enable temp1 and stroe in valueUpadted
                    const temp1 = temp.map(item => ({
                        ...item,
                        value: '',
                        FunctionValue: '',
                    }));
                    setMasterData([...temp]);
                    if (icSettings?.DefaultAllOK) {
                        setValueUpadted([...temp1]);
                    } else {
                        setValueUpadted([...temp]);
                    }
                    return null;
                } else if (selectedData?.Samples?.length > 0 && selectedData?.Samples?.length === selectedData?.CSampleSize) {
                    console.log('********************step2');
                    setMasterData([...selectedData?.Samples]);
                    setValueUpadted([...selectedData?.Samples]);
                } else if (valueSampleSize == 0 && selectedData?.CSampleSize > 0 && sampleEnterdSize == 0) {
                    console.log(valueSampleSize, masterData.filter(x => x?.value != '').length, '********************step3');
                    let sampleSize = selectedData.CSampleSize;
                    const temp = Array.from({ length: sampleSize }, (_, index) => ({
                        id: index + 1,
                        count: index + 1,
                        value: icSettings?.DefaultAllOK ? 'OK' : '',
                        // newly add based on syn api
                        sampleName: index + 1,
                        SerialNo: index + 1,
                        FunctionValue: icSettings?.DefaultAllOK ? 'OK' : '',
                        status: 0,
                        backColor: icSettings?.DefaultAllOK ? '#00FF00' : '',
                        fontColor: '#000000',
                        EnteredDate: moment(new Date()).format('MM/DD/YYYY h:mm:ss A '),
                        IsApproved: 0,
                        IsNumericSample: '0',
                        IsRejected: 0,
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                    }));
                    // if you want alert to ask enable temp1 and stroe in valueUpadted
                    const temp1 = temp.map(item => ({
                        ...item,
                        value: '',
                        FunctionValue: '',
                    }));
                    setMasterData([...temp]);
                    if (icSettings?.DefaultAllOK) {
                        setValueUpadted([...temp1]);
                    } else {
                        setValueUpadted([...temp]);
                    }
                } else if (sampleEnterdSize != 0 && selectedData?.CSampleSize >= sampleEnterdSize) {
                    console.log(sampleEnterdSize, selectedData?.CSampleSize, '1111********************step4');
                    let filterMasterData = masterData
                        .filter(x => x?.value != '')
                        .map((item, index) => ({
                            ...item,
                            id: index + 1,
                            count: index + 1,
                            sampleName: index + 1,
                            SerialNo: index + 1,
                        }));
                    let finalSampleSize = Number(selectedData?.CSampleSize) - Number(filterMasterData.length);
                    const temp = Array.from({ length: finalSampleSize }, (_, index) => ({
                        id: filterMasterData.length + index + 1,
                        count: filterMasterData.length + index + 1,
                        tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                        // newly add based on syn api
                        sampleName: filterMasterData.length + index + 1,
                        SerialNo: filterMasterData.length + index + 1,
                        value: icSettings?.DefaultAllOK ? 'OK' : '',
                        // newly add based on syn api
                        FunctionValue: icSettings?.DefaultAllOK ? 'OK' : '',
                        status: 0,
                        backColor: icSettings?.DefaultAllOK ? '#00FF00' : '',
                        fontColor: '#000000',
                        EnteredDate: moment(new Date()).format('MM/DD/YYYY h:mm:ss A '),
                        IsApproved: 0,
                        IsNumericSample: '0',
                        IsRejected: 0,
                        Comments: '',
                        FuncDetailsId: selectedData?.FuncDetailsId,
                    }));
                    setMasterData([...filterMasterData, ...temp]);
                    const temp1 = temp.map(item => ({
                        ...item,
                        value: '',
                        FunctionValue: '',
                    }));
                    if (icSettings?.DefaultAllOK) {
                        setValueUpadted([...filterMasterData, ...temp1]);
                    } else {
                        setValueUpadted([...filterMasterData, ...temp]);
                    }
                } else if (selectedData.CSampleSize <= sampleEnterdSize) {
                    console.log('********************step5 ');
                    let temp = JSON.parse(JSON.stringify(masterData)); // Deep copy
                    let slicedList = temp.slice(0, Number(selectedData.CSampleSize));
                    setMasterData([...slicedList]);
                    setValueUpadted([...slicedList]);
                    // showMessage({
                    //     message: 'Something went wrong',
                    //     backgroundColor: COLORS.ERROR,
                    //     color: COLORS.white,
                    //     duration: 1500,
                    //     statusBarHeight: 40,
                    //     icon: 'warning',
                    //     position: 'right',
                    //     style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                    // });
                } else {
                    console.log('1111********************step6');
                    setMasterData([...selectedData?.Samples]);
                    setValueUpadted([...selectedData?.Samples]);
                    return null;
                }
            }
        }
    };
    const getBackColor = (value, type, item) => {
        if (value === '') {
            return COLORS.white;
        }
        if (type === 'number') {
            let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
            let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
            return Number(value) >= Number(lowValue) && Number(value) <= Number(highValue) ? '#00FF00' : '#FF0100';
        }
        return value.toLowerCase() === 'ok' ? '#00FF00' : '#FF0100';
    };
    const handleInputChange = (val, id, type, items) => {
        const getBackColorValue = getBackColor(val, type, items);
        const updatedData = masterData.map(item =>
            item.id === id
                ? {
                      ...item,
                      value: val,
                      FunctionValue: val,
                      EnteredDate: moment(new Date()).format('MM/DD/YYYY h:mm:ss A '),
                      backColor: getBackColorValue,
                      IsRejected: getBackColorValue == '#00FF00' ? 0 : 1,
                  }
                : item,
        );
        setMasterData(updatedData);
    };
    const handleContainmentSave = value => {
        const getBackColorValue = getBackColor(value.value, type, value);
        const updatedData = masterData.map(item =>
            item.id === value.id
                ? {
                      ...value,
                      FunctionValue: value.value,
                      EnteredDate: moment(new Date()).format('MM/DD/YYYY h:mm:ss A '),
                      backColor: getBackColorValue,
                      IsRejected: getBackColorValue == '#00FF00' ? 0 : 1,
                  }
                : item,
        );
        setMasterData(updatedData);
    };
    const handleSendPress = (type, item, index) => {
        navigation.navigate(ROUTES.CONTAINMENT_ACTIONS, {
            type: type,
            index: index,
            selectedData: item,
            inspectionType: inspectionType,
            onSave: handleContainmentSave,
        });
    };
    const handleSubmit = index => {
        // if (index < masterData?.length - 1) {
        //     inputsRef.current[index + 1].focus(); // Focus next input
        // } else {
        //     Keyboard.dismiss(); // Last input: dismiss keyboard
        // }
        const nextIndex = index + 1;
        if (inputsRef.current[nextIndex]) {
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setTimeout(() => {
                inputsRef.current[nextIndex]?.focus();
            }, 200);
        } else {
            console.log('last input');
            Keyboard.dismiss(); // last input
        }
    };
    const handleScrollAndFocus = index => {
        flatListRef.current?.scrollToIndex({ index, animated: true });

        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                inputsRef.current[index]?.focus(); // This works even for last input
            }, 100); // slight delay
        });
    };
    const renderItem = (item, index) => {
        const renderBackGroundColor = (value, type) => {
            if (value === '') {
                return COLORS.white;
            }
            if (type === 'number') {
                let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
                let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
                return Number(value) >= Number(lowValue) && Number(value) <= Number(highValue) ? COLORS.SUCCESS : COLORS.ERROR;
            }
            return value.toLowerCase() === 'ok' ? COLORS.SUCCESS : COLORS.ERROR;
        };
        const renderIcon = (value, type, list) => {
            let itsHaveData = list?.some(item => item?.ContainmentValue !== '');
            if (value === '') {
                return false;
            }
            if (type === 'number') {
                let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
                let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
                let flag = Number(value) >= Number(lowValue) && Number(value) <= Number(highValue);
                return flag ? (itsHaveData ? true : false) : true;
            }
            let flagOk = value.toLowerCase() === 'ok';
            return flagOk ? (itsHaveData ? true : false) : true;
        };
        return (
            <View style={[styles.contentBox]}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        marginRight: 5,
                    }}>
                    <Text style={[styles.headerText]}>{item.count}</Text>
                    {renderIcon(item.value, type, item?.ContainmentActions) && Boolean(icSettings?.ISContainmentAction) && (
                        <TouchableOpacity
                            style={[styles.iconContainer]}
                            onPress={() => {
                                handleSendPress(type, item, index);
                            }}>
                            <IconF name="send" size={20} color={COLORS.moreIcon} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        style={[styles.inputBox, { backgroundColor: renderBackGroundColor(item.value, type) }]}
                        value={item.value}
                        onChangeText={val => {
                            let cleaned = val;
                            if (type === 'number') {
                                cleaned = val
                                    .replace(/[^0-9.-]/g, '') // Remove invalid characters
                                    .replace(/(?!^)-/g, '') // Remove all '-' except at the start
                                    .replace(/(\..*)\./g, '$1'); // Allow only the first dot

                                // 2. Allow only one dot
                                const parts = cleaned.split('.');
                                if (parts.length > 2) {
                                    cleaned = parts[0] + '.' + parts[1]; // keep only first two parts
                                }
                                // Optional: prevent starting with a dot (e.g., ".5" => "0.5")
                                if (cleaned.startsWith('.')) {
                                    cleaned = '0' + cleaned;
                                }
                            } else {
                                // 1. Remove leading spaces
                                cleaned = val.replace(/^\s+/, '');

                                // 2. Remove all characters except letters and spaces
                                cleaned = cleaned.replace(/[^a-zA-Z\s]/g, '');
                            }
                            handleInputChange(cleaned, item.id, type, item);
                        }}
                        keyboardType={type == 'number' ? 'number-pad' : 'default'}
                        returnKeyType="done"
                        onSubmitEditing={() => handleSubmit(index)}
                        ref={ref => (inputsRef.current[index] = ref)}
                        blurOnSubmit={false}
                        onPressIn={() => {
                            // Prevent auto keyboard — handle it yourself
                            handleScrollAndFocus(index);
                        }}
                    />
                    <TouchableOpacity
                        style={[styles.deleteIcon]}
                        onPress={() => {
                            handleDeletePress(item, index);
                        }}>
                        <IconM name="delete-outline" size={25} color={COLORS.ALERT} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const handleDeletePress = (item, index) => {
        let temp = JSON.parse(JSON.stringify(masterData));
        temp.splice(index, 1);
        const updatedData = temp.map((obj, i) => ({
            ...obj,
            id: i + 1,
            count: i + 1,
        }));

        setMasterData(updatedData);
        setValueUpadted(updatedData);
        setSelectedData(pre => ({ ...pre, CSampleSize: updatedData?.length, Samples: updatedData }));
    };
    const handleMenuPress = value => {
        if (value.id == 2) {
            let temp = JSON.parse(JSON.stringify(masterData));
            temp.push({
                id: temp?.length + 1,
                count: temp?.length + 1,
                value: '',
                lowValue: selectedData.CLowValue,
                highValue: selectedData.CHighValue,
                tolerance: inspectionType == 2 ? selectedData?.CTolerance || 0 : 0,
                // newly add based on syn api
                sampleName: temp?.length + 1,
                SerialNo: temp?.length + 1,
                status: 1,
                fontColor: '#000000',
                IsApproved: 0,
                IsNumericSample: '1',
                Comments: '',
                FuncDetailsId: selectedData?.FuncDetailsId,
                FunctionValue: '',
                backColor: '',
                EnteredDate: '',
                IsRejected: 1,
            });
            setMasterData(temp);
            setValueUpadted(temp);
            setSelectedData(pre => ({ ...pre, CSampleSize: temp?.length, Samples: temp }));
        } else if (value?.id == 1) {
            handleNextSamplePress();
        }
    };
    const renderOkCount = (value = []) => {
        let temp =
            type == 'number'
                ? value?.filter(
                      x =>
                          x?.value != '' &&
                          (inspectionType == 2
                              ? Number(x?.value) >= Number(x?.tolerance) - Number(x?.lowValue)
                              : Number(x?.value) >= Number(x?.lowValue)) &&
                          (inspectionType == 2
                              ? Number(x?.value) <= Number(x?.tolerance) + Number(x?.highValue)
                              : Number(x?.value) <= Number(x?.highValue)),
                  )
                : value.filter(x => x?.value?.toLowerCase() == 'ok' && x?.value !== '');
        return temp.length || 0;
    };
    const renderNotOkCount = (value = []) => {
        let temp =
            type == 'number'
                ? value.filter(
                      x =>
                          x?.value != '' &&
                          !(
                              (inspectionType == 2
                                  ? Number(x?.value) >= Number(x?.tolerance) - Number(x?.lowValue)
                                  : Number(x?.value) >= Number(x?.lowValue)) &&
                              (inspectionType == 2
                                  ? Number(x?.value) <= Number(x?.tolerance) + Number(x?.highValue)
                                  : Number(x?.value) <= Number(x?.highValue))
                          ),
                  )
                : value.filter(x => x?.value?.toLowerCase() != 'ok' && x?.value !== '');
        return temp?.length || 0;
    };
    const handleCloseCPKModal = () => {
        setShowCPKModal(false);
        handleSavePress(true, 'saveBtn');
    };
    const handleViewPhotoWithSample = (item, index) => {
        setShowImageWithSample(true);
    };

    const handleInnerSavePress = (isSave, btntype) => {
        // if (type == 'number') {
        //     // console.log(masterData, 'needmemasterDatatest1newvalue');
        //     // console.log(selectedData?.Samples, 'needmeuserselectedData1oldvalue');
        //     const samplelistarray = masterData?.filter(x => x?.value != '')?.map(x => parseFloat(x?.value));
        //     const perviousSampleList =
        //         selectedData?.Samples?.length && selectedData?.Samples?.filter(x => x?.value != '')?.map(x => parseFloat(x?.value));
        //     const hasChanges =
        //         perviousSampleList?.length !== samplelistarray?.length || perviousSampleList.some((value, index) => value !== samplelistarray[index]);
        //     if (samplelistarray.length >= 2) {
        //         const result = calculateCapability({
        //             sampleSize: parseInt(samplelistarray?.length),
        //             sampleList: samplelistarray,
        //             lowerSpecLimit: parseInt(userUpdateValue?.CLowValue),
        //             upperSpecLimit: parseInt(userUpdateValue?.CHighValue),
        //         });
        //         const alertOp = getCPKPPKAlert({ cpk: result?.cpk, ppk: result?.ppk });
        //         if (hasChanges) {
        //             if (alertOp?.color == 'red') {
        //                 showMessage({
        //                     message: alertOp?.message,
        //                     backgroundColor: COLORS.ERROR,
        //                     color: COLORS.white,
        //                     duration: 1500,
        //                     statusBarHeight: 40,
        //                     icon: 'warning',
        //                     position: 'right',
        //                     style: { height: 120, alignItems: 'flex-end' },
        //                 });
        //             } else if (alertOp?.color == 'orange') {
        //                 showMessage({
        //                     message: alertOp?.message,
        //                     backgroundColor: COLORS.WARNING,
        //                     color: COLORS.white,
        //                     duration: 1500,
        //                     statusBarHeight: 40,
        //                     icon: 'warning',
        //                     position: 'right',
        //                     style: { height: 120, alignItems: 'flex-end' },
        //                 });
        //             } else if (alertOp?.color == 'green') {
        //                 showMessage({
        //                     message: alertOp?.message,
        //                     backgroundColor: COLORS.SUCCESS,
        //                     color: COLORS.white,
        //                     duration: 1500,
        //                     statusBarHeight: 40,
        //                     icon: 'success',
        //                     position: 'right',
        //                     style: { height: 120, alignItems: 'flex-end' },
        //                 });
        //             }
        //         }
        //         handleSavePress(isSave, btntype, alertOp?.message, alertOp?.color);
        //     } else {
        //         handleSavePress(isSave, btntype);
        //     }
        //     // { cp, cpk, pp, ppk, mean, subgroupCount, warnings }
        // } else {
        //     handleSavePress(isSave, btntype);
        // }
        if (type === 'number' && userType == 'Inspector') {
            const validation = validateSPC({
                type,
                masterData,
                previousSamples: selectedData?.Samples,
                lowValue: inspectionType != 2 ? userUpdateValue?.CLowValue : Number(userUpdateValue?.CTolerance) - Number(userUpdateValue?.CLowValue),
                highValue:
                    inspectionType != 2 ? userUpdateValue?.CHighValue : Number(userUpdateValue?.CTolerance) + Number(userUpdateValue?.CHighValue),
            });
            handleSavePress(isSave, btntype, validation.alertMessage, validation.alertColor);
        } else {
            handleSavePress(isSave, btntype);
        }
    };
    const renderFaltList = (showHeader = true) => {
        return (
            <View style={{}}>
                {Boolean(selectedData?.alertCPKPPKMessage?.length) && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 5 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: 'OpenSans-SemiBold',
                                color:
                                    selectedData?.alertCPKPPKColor == 'red'
                                        ? COLORS.ERROR
                                        : selectedData?.alertCPKPPKColor == 'orange'
                                        ? COLORS.WARNING
                                        : COLORS.SUCCESS,
                            }}>
                            {selectedData?.alertCPKPPKMessage || ''}
                        </Text>
                    </View>
                )}
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    ref={flatListRef}
                    data={masterData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return <View style={[styles.tableBox]}>{renderItem(item, index)}</View>;
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    // contentContainerStyle={[styles.tableBox]}

                    ListHeaderComponent={
                        <View>
                            {showCharInfo && showHeader && (
                                <SampleCharInfo
                                    selectedData={selectedData}
                                    setSelectedData={setSelectedData}
                                    masterData={masterData}
                                    setMasterData={setMasterData}
                                    setValueUpadted={setValueUpadted}
                                    showConfirmModal={showConfirmModal}
                                    setShowConfirmModal={setShowConfirmModal}
                                    setTimer={setTimer}
                                    timer={timer}
                                    userUpdateValue={userUpdateValue}
                                    setUserUpdateValue={setUserUpdateValue}
                                    setTypeOfModal={setTypeOfModal}
                                    charType={type}
                                    inspectionType={inspectionType}
                                />
                            )}
                            {Boolean(selectedData?.isSamplePopup) && (
                                <>
                                    <View style={[styles.headerBox]}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.headerText, { marginLeft: 15 }]}>No</Text>
                                        </View>
                                        {/* <View>
                                        <Text style={[styles.headerText]}>Sample Value</Text>
                                    </View> */}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                            <Text style={[styles.headerText]}>Actual Value</Text>
                                            {showHeader && (
                                                <TouchableOpacity
                                                    style={[styles.deleteIcon]}
                                                    onPress={() => {
                                                        handleViewPhotoWithSample();
                                                    }}>
                                                    <IconMM name="file-present" size={20} color={COLORS.apptheme} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                    {Boolean(type == 'number') ? (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingBottom: 5,
                                                paddingHorizontal: 10,
                                                backgroundColor: COLORS.appthemeShadow,
                                            }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.headerTextValue, { marginLeft: 15 }]}>L : {selectedData?.CLowValue || 0} </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.headerTextValue, { marginLeft: 15 }]}>H : {selectedData?.CHighValue || 0} </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.headerTextValue, { marginLeft: 15 }]}>
                                                    Spec : {selectedData?.CTolerance || 0}{' '}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                </>
                            )}
                        </View>
                    }
                    ListFooterComponent={
                        Boolean(selectedData?.isSamplePopup) ? (
                            <View>
                                <BorderContent title="Total Samples Tested" color={COLORS.apptheme} count={masterData?.length} />
                                <BorderContent title="Sample(s) OK " color={COLORS.SUCCESS} count={renderOkCount(masterData)} />
                                <BorderContent title="Sample(s) Not OK " color={COLORS.ERROR} count={renderNotOkCount(masterData)} />
                            </View>
                        ) : null
                    }
                />
                {/* {Boolean(masterData?.length) &&
                            masterData.map((item, index) => {
                                return renderItem(item, index);
                            })} */}
            </View>
        );
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <View style={[styles.container]}>
                <View style={[styles.overallBox]}>
                    {/* need to chage the infodata as selectedData and setSelectedData */}
                    {renderFaltList(true)}
                </View>
                <View style={[styles.btnContainer]}>
                    <View
                        style={[
                            {
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: COLORS.icborder,
                                padding: 10,
                                borderRadius: 50,
                            },
                        ]}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                setShowCaptureDefect(true);
                            }}>
                            <IconM name="camera" size={20} color={COLORS.apptheme} />
                        </TouchableOpacity>
                    </View>
                    <ButtonComponent
                        textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                        style={{ height: 40, width: '73%' }}
                        onPress={() => {
                            handleInnerSavePress(true, 'saveBtn');
                            // setShowCPKModal(true);
                        }}>
                        Save
                    </ButtonComponent>
                    <View style={[styles.iconFilter]}>
                        <FilterWithMenu
                            dataList={selectedData?.isSamplePopup ? moreList : suzlonMoreList}
                            type="IconFilter"
                            onSelectedPress={value => {
                                handleMenuPress(value);
                            }}
                            anchorPosition="top"
                        />
                    </View>
                </View>
            </View>
            <CapabilityCard
                visible={showCPKModal}
                // setVisible={setShowCPKModal}
                handleClose={handleCloseCPKModal}
                data={{
                    pp: 2.5,
                    ppk: 2.1,
                    cp: 0.78,
                    cpk: -0.22,
                }}
            />
            <Modal visible={showImageWithSample} animationType="slide" transparent={false} onRequestClose={() => setShowImageWithSample(false)}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>View Image Attachment with Sample</Text>
                            <TouchableOpacity
                                style={[styles.deleteIcon]}
                                onPress={() => {
                                    setShowImageWithSample(false);
                                }}>
                                <IconMM name="close" size={25} color={COLORS.apptheme} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ZoomableImage fileList={FileList} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                <View style={{ flex: 1, width: '100%' }}>{renderFaltList(false)}</View>
                            </View>
                        </View>
                    </SafeAreaView>
                </GestureHandlerRootView>
            </Modal>
            <CaptureDefect
                visible={showCaptureDefect}
                onRequestClose={() => setShowCaptureDefect(false)}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
            />
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    tableBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.icBottomBox,
        borderTopColor: COLORS.cloud,
        borderLeftColor: COLORS.icBottomBox,
        borderRightColor: COLORS.icBottomBox,
        borderRadius: 5,
    },
    overallBox: {
        flex: 1,
    },
    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: COLORS.appthemeShadow,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 15,
        color: '#000',
    },
    headerTextValue: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
        color: '#000',
    },
    contentBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.icBottomBox,
    },
    iconContainer: {
        backgroundColor: COLORS.icborder,
        padding: 10,
        borderRadius: 100,
    },
    inputBox: {
        height: 37,
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 0,
        paddingHorizontal: 10,
        borderColor: COLORS.icBottomBox,
        textAlign: 'center',
        color: COLORS.white,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
    },
    btnContainer: {
        paddingTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconFilter: {
        width: '12%',
    },
    mainBox: {
        flex: 1,
    },
    borderBox: {
        height: 40,
        width: 5,
        borderRadius: 10,
        backgroundColor: 'red',
        marginRight: 10,
    },
    borderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    borderText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: '#000',
    },
    deleteIcon: {
        marginLeft: 10,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    title: {
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        color: '#000',
    },

    close: {
        color: 'red',
        fontSize: 16,
    },

    content: {
        flex: 1,
    },
});

export default CharacteristicsInfo;
