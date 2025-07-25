import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { Alert, BackHandler, FlatList, Keyboard, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import { COLORS } from 'constants/theme-constants';
import { ButtonComponent } from 'components';
import FilterWithMenu from '../Components/FilterWithMenu';
import { RFPercentage } from 'helpers/utils';
import SignatureComponent from '../Components/SignatureComponent';
import CharacteristicsInfo from '../Components/inprocess-inspection/CharacteristicsInfo';
import GeneralInfo from '../Components/inprocess-inspection/GeneralInfo';
import { showMessage } from 'react-native-flash-message';
import ModalFilePickerWithList from '../Components/inprocess-inspection/ModalFilePickerWithList';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from 'constants/app-constant';
import { Modal } from 'react-native-paper';
import NoDataFound from '../Components/NoDataFound';
import ConfirmationModal from '../Components/inprocess-inspection/ConfirmationModal';
const moreList = [
    {
        id: 1,
        title: 'Supervisor Signature',
        iconName: 'user-check',
        iconFrom: 'Feather',
    },
    {
        id: 2,
        title: 'Inspector Signature',
        iconName: 'user-tie',
        iconFrom: 'FontAwesome5',
    },
];

const InprocessInspection = ({ route }) => {
    const { inspectData } = route.params;
    const { inspectList, icSettings } = useSelector(state => state.inspection);
    const [showGeneral, setShowGeneral] = useState(false);
    const [showChar, setShowChar] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    const [formType, setFormType] = useState('');
    const [showFilePage, setShowFilePage] = useState(false);
    const [infoData, setInfoData] = useState({});
    const [selectedData, setSelectedData] = useState({});
    const [showAlart, setShowAlart] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [valueUpadted, setValueUpadted] = useState([]);
    const [signType, setSignType] = useState('');
    const [currentIndex, setCurrentIndex] = useState({
        index: 0,
        type: '',
    });
    const [nextSave, setNextSave] = useState(true);
    const [showCamer, setShowCamer] = useState(false);
    const [mixedList, setMixedList] = useState('');
    const [showCharInfo, setShowCharInfo] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [typeOfModal, setTypeOfModal] = useState('');
    const [timer, setTimer] = useState(null);
    const [userUpdateValue, setUserUpdateValue] = useState({
        CHighValue: '',
        CLowValue: '',
        CSampleSize: '',
        CTolerance: '',
    });
    const [finalConfirmation, setFinalConfirmation] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const flatListRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        setInfoData(inspectData);
    }, [inspectData]);

    const handleGenOpen = () => {
        setShowGeneral(!showGeneral);
        setShowChar(false);
    };
    const handleCharOpen = () => {
        setShowChar(!showChar);
        setShowGeneral(false);
    };
    const handleMenuPress = value => {
        setSignType(value?.id);
        setShowSignModal(true);
    };
    const renderBtnText = (item, type) => {
        const list = item?.Samples || [];
        let iconFlag = false;
        const allValues = list.length > 0 && list.every(({ value }) => value.trim() !== '');
        const someValues = list.some(({ value }) => value.trim() !== '');
        let status = allValues ? 'Completed' : someValues ? 'In Progress' : 'Inspect';
        if (allValues) {
            let temp =
                type == 'number'
                    ? list.filter(x =>
                          x?.value != '' && inspectData?.intInspectionTypeID == 2
                              ? !(
                                    Number(x?.value) >= Number(inspectData?.intInspectionTypeID == 2 ? x?.tolerance : 0) - Number(x?.lowValue) &&
                                    Number(x?.value) <= Number(x?.highValue) + Number(inspectData.intInspectionTypeID == 2 ? x?.tolerance : 0)
                                )
                              : !(Number(x?.value) >= Number(x?.lowValue) && Number(x?.value) <= Number(x?.highValue)),
                      )
                    : list.filter(x => x?.value?.toLowerCase() != 'ok' && x?.value !== '');
            iconFlag = temp?.length ? true : false;
        }
        let colorCode = COLORS.apptheme;
        if (status === 'Completed') colorCode = COLORS.fiBgColor;
        else if (status === 'In Progress') colorCode = COLORS.ipBgColor;
        return { status, colorCode, iconFlag };
    };
    const renderItem = ({ item, index, type }) => {
        const { status, colorCode, iconFlag } = renderBtnText(item, type);
        return (
            <View style={[styles.recordConatiner]} key={index + 1}>
                <View style={[styles.iconBox]}>
                    <IconM name="information-variant" size={25} color={COLORS.moreIcon} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle]}>{item.CCharacteristics}</Text>
                    <Text style={[styles.headerName]}>{item.OperationName}</Text>
                </View>
                <View style={[styles.lastBox, { flexDirection: 'row' }]}>
                    {Boolean(iconFlag) && <IconF name="alert-triangle" size={22} color={COLORS.ipBgColor} style={{ marginRight: 5 }} />}
                    <TouchableOpacity
                        style={[styles.inspectBox, { backgroundColor: colorCode }]}
                        onPress={() => {
                            handleCharOpen();
                            setSelectedData(item);
                            setFormType(type);
                            setCurrentIndex({ index, type });
                        }}>
                        <Text style={[styles.iText]}>{status}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const renderHeader = value => {
        return value == '1' ? 'Receiving Inspection' : value == '2' ? 'Inprocess Inspection' : 'Final Inspection';
    };

    const MyHeader = ({ title }) => (
        <View style={[styles.flatHeaderContainer]}>
            <Text style={[styles.flatHeader]}>Sample Information - {title}</Text>
        </View>
    );
    const handleValidation = data => {
        let list = [...data.GeneralInfo].filter(x => x.DisplayName == 'Approver');
        return inspectData.intInspectionTypeID !== 2 ? (list?.length ? list[0].Value !== '' : true) : true;
        // return list.length ? list[0].Value !== '':true;
    };
    const handleFinalSavePress = (flag = false) => {
        const result = handleValidation(infoData);
        if (result) {
            dispatch({
                type: 'UPDATE_INSPECT_LIST',
                updatedData: infoData,
            });
            if (!showChar && !flag) {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ROUTES.HOME_FAB_VIEW }],
                    });
                }
            }
            Boolean(flag) && navigation.goBack();
        } else {
            setShowAlart(false);
            showMessage({
                message: 'Please choose the approver from the general info.',
                backgroundColor: COLORS.ERROR,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'warning',
                position: 'right',
                style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
            });
        }
    };
    const handleBackPress = () => {
        if (!showConfirmModal) {
            if (!showCamer) {
                if (!showFilePage) {
                    if (!showGeneral) {
                        if (!showChar) {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            } else {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: ROUTES.HOME_FAB_VIEW }],
                                });
                            }
                        } else {
                            setShowChar(false);
                            setSelectedData({});
                            setMasterData([]);
                            setValueUpadted([]);
                        }
                    } else {
                        setShowGeneral(false);
                    }
                } else {
                    setShowFilePage(false);
                }
            } else {
                setShowCamer(false);
            }
        } else {
            setShowConfirmModal(false);
            setTypeOfModal('');
        }
        setShowAlart(false);
    };
    const handleSaveAlert = useCallback(
        (movenext = '', typeid = '') => {
            let isChanged = false;
            const filterdData = inspectList.filter(
                item =>
                    item.intProductionItemID == infoData.intProductionItemID &&
                    item.OperationID == infoData.OperationID &&
                    item?.OrderDetailsId == infoData?.OrderDetailsId &&
                    item?.uniqueId == infoData?.uniqueId,
            );
            const finalData = filterdData[0];
            if (showChar) {
                if (formType == 'number' || formType == 'char') {
                    // if Samples avilable we need to check this or we need to use masterData
                    isChanged = selectedData?.Samples?.some((item, index) => {
                        return item?.value !== masterData[index]?.value;
                    });
                    if (!selectedData?.Samples?.length && masterData?.length > 0) {
                        isChanged = masterData?.some((item, index) => {
                            return item?.value !== valueUpadted[index]?.value;
                        });
                    }
                    if (selectedData?.Samples?.length !== undefined && selectedData?.Samples?.length !== masterData?.length) {
                        isChanged = true;
                    }
                    let arrayList = [...finalData.VariableCharacteristics, ...finalData.AttributeCharacteristics];
                    let selectedFinal = arrayList.filter(item => item?.CCharacteristicsId == selectedData?.CCharacteristicsId);
                    const hasChanges = selectedFinal.length ? JSON.stringify(selectedFinal[0]) !== JSON.stringify(selectedData) : false;
                    if (isChanged || hasChanges) {
                        setShowAlart(true);
                    } else {
                        if (movenext == 'nextSample') {
                            handleNextItem(typeid);
                        } else {
                            handleBackPress();
                        }
                    }
                }
            } else {
                const hasChanges = JSON.stringify(finalData) !== JSON.stringify(infoData);
                if (!hasChanges) {
                    handleBackPress();
                } else {
                    setShowAlart(true);
                }
            }

            return true;
        },
        [inspectList, infoData, showChar, formType, selectedData, masterData, valueUpadted, handleBackPress, handleNextItem],
    );
    useEffect(() => {
        const backAction = () => {
            handleSaveAlert();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove(); // cleanup on unmount
    }, [handleSaveAlert]);
    const handleSavePress = async (close = true, btnText = 'noBtn') => {
        if (showChar) {
            const list = masterData || [];
            const allValues = list.length > 0 && list.every(({ value }) => value.trim() !== '');
            const someValues = list.some(({ value }) => value.trim() !== '');
            let status = allValues ? 'Completed' : someValues ? 'In Progress' : 'Launch';
            const updatedObj = {
                ...selectedData,
                Samples: masterData,
                status: status,
            };
            const { VariableCharacteristics, AttributeCharacteristics } = infoData;
            const characteristicsList = formType === 'number' ? VariableCharacteristics : AttributeCharacteristics;
            const index = characteristicsList.findIndex(
                obj => obj?.CCharacteristicsId === selectedData?.CCharacteristicsId && obj.FuncDetailsId == selectedData?.FuncDetailsId,
            );
            console.log(characteristicsList.filter(obj => obj?.CCharacteristicsId === selectedData?.CCharacteristicsId).length, 'lrnh');
            const newCharacteristicsList = [...characteristicsList];
            if (index !== -1) {
                newCharacteristicsList[index] = updatedObj;
            }
            // setSelectedData(updatedObj);
            setInfoData(pre => ({
                ...pre,
                [formType === 'number' ? 'VariableCharacteristics' : 'AttributeCharacteristics']: newCharacteristicsList,
            }));
            setMasterData([]);
            setValueUpadted([]);
            console.log('inside1');
        } else {
            handleFinalSavePress();

            console.log('inside2', showChar);
        }
        if (close && showChar) {
            setShowChar(false);
            handleBackPress();
            console.log('inside3', showChar);
        }
        if (!close && btnText == 'noBtn') {
            handleNextItem();
        }
    };
    const handleNextSamplePress = () => {
        if (infoData.intInspectionTypeID != 2) {
            let tempData = formType == 'number' ? infoData?.VariableCharacteristics : infoData.AttributeCharacteristics;
            if (currentIndex.index < tempData?.length - 1) {
                setNextSave(false);
                handleSaveAlert('nextSample');
                Keyboard.dismiss();
                // setShowCharInfo(false);
            } else {
                console.log(formType == 'number', 'formType');
                Alert.alert(`End of ${formType == 'number' ? 'variable' : 'attribute'} sample list`, 'You have reached the last sample.');
            }
        } else {
            let tempData = formType == 'number' ? infoData?.VariableCharacteristics : infoData.AttributeCharacteristics;
            console.log(currentIndex, tempData?.length - 1, 'tempData?.length - 1');
            if (currentIndex.index < tempData?.length - 1) {
                console.log('error1');
                setNextSave(false);
                handleSaveAlert('nextSample');
                Keyboard.dismiss();
                // setShowCharInfo(false);
            } else if (currentIndex.index == tempData?.length - 1 && formType == 'number' && infoData.AttributeCharacteristics?.length !== 0) {
                setMixedList('2');
                setNextSave(false);
                handleSaveAlert('nextSample', infoData.intInspectionTypeID);
                Keyboard.dismiss();
                console.log('error2');
                // setShowCharInfo(false);
            } else {
                Alert.alert(`End of Sample List`, 'You have reached the last sample.');
            }
        }
    };

    const handleNextItem = (id = mixedList) => {
        if (id == '' || id == undefined) {
            let tempData = formType == 'number' ? infoData?.VariableCharacteristics : infoData.AttributeCharacteristics;
            const nextIndex = currentIndex.index + 1;
            setCurrentIndex({ index: nextIndex, type: formType });
            setMasterData([]);
            setValueUpadted([]);
            setSelectedData(tempData[nextIndex]);
            console.log('inside5');
        } else {
            setMasterData([]);
            setValueUpadted([]);
            let tempData = infoData.AttributeCharacteristics;
            setSelectedData(tempData[0]);
            setCurrentIndex({ index: 0, type: 'char' });
            setFormType('char');
            console.log('inside6');
        }
        setShowAlart(false);
        setNextSave(true);
        setMixedList('');
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };
    const handleShowCharInfo = () => {
        setShowCharInfo(!showCharInfo);
    };
    const handleFinalConfirmYesPress = () => {
        setSelectedData(pre => ({ ...pre, CSampleSize: userUpdateValue.CSampleSize }));
        setFinalConfirmation(false);
        setTypeOfModal('');
    };

    const handleConfirmYesPress = () => {
        if (typeOfModal == 'samplesize') {
            let sampleEnterdSize = masterData.filter(x => x?.value != '')?.length;
            if (userUpdateValue.CSampleSize < sampleEnterdSize) {
                setShowConfirmModal(false);
                setFinalConfirmation(true);
                // setTypeOfModal('');
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
                // setUserUpdateValue(pre => ({ ...pre, CSampleSize: selectedData.CSampleSize.toString() }));
            } else {
                setSelectedData(pre => ({ ...pre, CSampleSize: userUpdateValue.CSampleSize }));
                setShowConfirmModal(false);
                setTypeOfModal('');
            }
        } else if (typeOfModal == 'highvalue') {
            if (Number(userUpdateValue.CHighValue) <= Number(selectedData.CLowValue)) {
                setShowConfirmModal(false);
                setTypeOfModal('');
                showMessage({
                    message: 'High Value must be greater than Low Value',
                    backgroundColor: COLORS.ERROR,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'warning',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                });
                setUserUpdateValue(pre => ({ ...pre, CHighValue: selectedData.CHighValue.toString() }));
            } else {
                setSelectedData(pre => ({ ...pre, CHighValue: userUpdateValue.CHighValue }));
                setShowConfirmModal(false);
                setTypeOfModal('');
            }
        } else if (typeOfModal == 'lowvalue') {
            if (Number(selectedData.CHighValue) >= Number(userUpdateValue.CLowValue)) {
                setSelectedData(pre => ({ ...pre, CLowValue: userUpdateValue.CLowValue }));
                setShowConfirmModal(false);
                setTypeOfModal('');
            } else {
                setShowConfirmModal(false);
                setTypeOfModal('');
                showMessage({
                    message: 'Low Value must be less than High Value',
                    backgroundColor: COLORS.ERROR,
                    color: COLORS.white,
                    duration: 1500,
                    statusBarHeight: 40,
                    icon: 'warning',
                    position: 'right',
                    style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                });
                setUserUpdateValue(pre => ({ ...pre, CLowValue: selectedData.CLowValue.toString() }));
            }
        } else if (typeOfModal == 'spec') {
            setSelectedData(pre => ({ ...pre, CTolerance: userUpdateValue.CTolerance }));
            setShowConfirmModal(false);
            setTypeOfModal('');
        }
    };
    console.log(masterData.filter(x => x?.value != '')?.length, 'masterData');
    return (
        <CustomHeader
            title={renderHeader(inspectData.intInspectionTypeID)}
            activeTabId={2}
            showIcons={false}
            showFileIcon={false}
            handleFileIconPress={() => {
                setShowFilePage(true);
            }}
            customBackHandler={true}
            customHandleGoBack={() => {
                handleSaveAlert();
            }}>
            <View style={[styles.conatiner]}>
                {!showChar && (
                    <View style={{ flex: showGeneral ? 1 : 0 }}>
                        <TouchableOpacity
                            style={[styles.tabStyle, { borderBottomLeftRadius: showGeneral ? 0 : 10, borderBottomRightRadius: showGeneral ? 0 : 10 }]}
                            onPress={() => {
                                handleGenOpen();
                            }}>
                            <Text style={[styles.headerText]}>General Info</Text>
                            <Icon name={showGeneral ? 'down' : 'right'} size={20} color={COLORS.moreIcon} />
                        </TouchableOpacity>
                        {showGeneral && (
                            <View style={[styles.tabBox]}>
                                <GeneralInfo infoData={infoData} setInfoData={setInfoData} intInspectionTypeID={inspectData.intInspectionTypeID} />
                            </View>
                        )}
                    </View>
                )}
                {!showChar &&
                    !showGeneral &&
                    (Boolean(infoData?.VariableCharacteristics?.length == 0) && Boolean(infoData?.AttributeCharacteristics?.length == 0) ? (
                        <View style={[styles.centerBox]}>
                            <NoDataFound />
                        </View>
                    ) : (
                        <View style={[styles.centerBox]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {Boolean(infoData?.VariableCharacteristics?.length) && (
                                    <View>
                                        {Boolean(inspectData.intInspectionTypeID != 2) && <MyHeader title={'VARIABLE'} />}
                                        {infoData?.VariableCharacteristics.map((item, index) => {
                                            return renderItem({ item, index, type: 'number' });
                                        })}
                                    </View>
                                )}
                                {Boolean(infoData?.AttributeCharacteristics?.length) && (
                                    <View style={{ marginVertical: 10 }}>
                                        {Boolean(inspectData.intInspectionTypeID != 2) && <MyHeader title={'ATTRIBUTE'} />}
                                        {infoData?.AttributeCharacteristics.map((item, index) => {
                                            return renderItem({ item, index, type: 'char' });
                                        })}
                                    </View>
                                )}
                            </ScrollView>
                            <View style={[styles.btnContainer]}>
                                <ButtonComponent
                                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                    style={{ height: 40, width: '100%' }}
                                    onPress={() => {
                                        handleFinalSavePress(true);
                                    }}>
                                    Save
                                </ButtonComponent>
                                {/* <View style={[styles.iconFilter]}>
                                    <FilterWithMenu
                                        dataList={moreList}
                                        type="IconFilter"
                                        onSelectedPress={value => {
                                            handleMenuPress(value);
                                        }}
                                        anchorPosition="top"
                                    />
                                </View> */}
                            </View>
                        </View>
                    ))}
                {showChar && (
                    <View style={{ flex: showChar ? 1 : 0 }}>
                        <View
                            style={[styles.tabStyle, { borderBottomLeftRadius: showChar ? 0 : 10, borderBottomRightRadius: showChar ? 0 : 10 }]}
                            onPress={() => {
                                // if (showChar) {
                                //     handleCharOpen();
                                // } else {
                                //     showMessage({
                                //         message: 'Please press the "Inspect" button.',
                                //         backgroundColor: COLORS.WARNING,
                                //         color: COLORS.white,
                                //         duration: 1500,
                                //         statusBarHeight: 40,
                                //         // style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                                //         position: 'bottom',
                                //     });
                                // }
                            }}>
                            <Text style={[styles.headerText]}>Characteristics Info</Text>
                            <TouchableOpacity onPress={handleShowCharInfo}>
                                <Icon name={showCharInfo ? 'down' : 'right'} size={20} color={COLORS.moreIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.tabBox]}>
                            <CharacteristicsInfo
                                selectedData={selectedData}
                                type={formType}
                                setShowChar={setShowChar}
                                setMasterData={setMasterData}
                                masterData={masterData}
                                setValueUpadted={setValueUpadted}
                                handleSavePress={handleSavePress}
                                handleNextSamplePress={handleNextSamplePress}
                                icSettings={icSettings}
                                inspectionType={inspectData.intInspectionTypeID}
                                showCharInfo={showCharInfo}
                                setInfoData={setInfoData}
                                infoData={infoData}
                                setSelectedData={setSelectedData}
                                showConfirmModal={showConfirmModal}
                                setShowConfirmModal={setShowConfirmModal}
                                setTimer={setTimer}
                                timer={timer}
                                userUpdateValue={userUpdateValue}
                                setUserUpdateValue={setUserUpdateValue}
                                setTypeOfModal={setTypeOfModal}
                                flatListRef={flatListRef}
                            />
                        </View>
                    </View>
                )}
            </View>
            <SignatureComponent
                infoData={infoData}
                setInfoData={setInfoData}
                modalVisible={showSignModal}
                hideModal={() => {
                    setShowSignModal(false);
                }}
                signType={signType}
            />
            {Boolean(showFilePage) && (
                <ModalFilePickerWithList
                    selectedData={selectedData}
                    visible={showFilePage}
                    masterData={masterData}
                    onDismiss={() => {
                        setShowFilePage(false);
                    }}
                    setSelectedData={setSelectedData}
                    infoData={infoData}
                    setInfoData={setInfoData}
                    formType={formType}
                    showCamer={showCamer}
                    setShowCamer={setShowCamer}
                />
            )}
            {Boolean(showAlart) && (
                <Modal
                    visible={showAlart}
                    onDismiss={() => {
                        setShowAlart(false);
                    }}
                    onRequestClose={() => {
                        setShowAlart(false);
                    }}
                    contentContainerStyle={[styles.modalContainer]}>
                    <View style={[styles.modalBox]}>
                        <Text style={[styles.modalHeader]}>Confirm</Text>
                        <View>
                            <Text style={[styles.modalText]}>There are unsaved changes. Do you want to save them?</Text>
                        </View>
                        <View style={[styles.btnStyle]}>
                            <ButtonComponent
                                danger={true}
                                style={{ height: 30, width: 100, marginRight: 20 }}
                                onPress={() => {
                                    nextSave ? handleBackPress() : handleNextItem();
                                }}
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                                No
                            </ButtonComponent>
                            <ButtonComponent
                                success={true}
                                style={{ height: 30, width: 100 }}
                                onPress={async () => {
                                    await handleSavePress(nextSave);
                                }}
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                                {' '}
                                Yes
                            </ButtonComponent>
                        </View>
                        {/* <View style={[styles.modalBtnContainer]}>
                            <View style={[styles.modalBtn]}>
                                <ButtonComponent
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                    style={{ height: 40, width: '45%' }}
                                    onPress={() => {
                                        nextSave ? handleBackPress() : handleNextItem();
                                    }}>
                                    No
                                </ButtonComponent>
                                <ButtonComponent
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                                    style={{ height: 40, width: '45%' }}
                                    onPress={async () => {
                                        await handleSavePress(nextSave);
                                    }}>
                                    yes
                                </ButtonComponent>
                            </View>
                        </View> */}
                    </View>
                </Modal>
            )}
            {Boolean(showConfirmModal) && (
                <ConfirmationModal
                    visible={showConfirmModal}
                    handleClose={() => {
                        setUserUpdateValue(pre => ({
                            ...pre,
                            CSampleSize: selectedData.CSampleSize,
                            CHighValue: selectedData.CHighValue,
                            CLowValue: selectedData.CLowValue,
                            CTolerance: selectedData.CTolerance,
                        }));
                        setShowConfirmModal(false);
                        setTypeOfModal('');
                    }}
                    handleYesPress={() => {
                        handleConfirmYesPress();
                    }}
                    typeOfModal={typeOfModal}
                />
            )}
            {Boolean(finalConfirmation) && (
                <ConfirmationModal
                    visible={finalConfirmation}
                    handleClose={() => {
                        setUserUpdateValue(pre => ({
                            ...pre,
                            CSampleSize: selectedData.CSampleSize,
                            CHighValue: selectedData.CHighValue,
                            CLowValue: selectedData.CLowValue,
                            CTolerance: selectedData.CTolerance,
                        }));
                        setFinalConfirmation(false);
                        setTypeOfModal('');
                    }}
                    content={`You've already entered ${masterData.filter(x => x?.value != '')?.length || ''} samples value. Do you want to continue and change it`}
                    handleYesPress={() => {
                        handleFinalConfirmYesPress();
                    }}
                    typeOfModal={typeOfModal}
                    showType={false}
                />
            )}
            {Boolean(finalConfirmation) && (
                <ConfirmationModal
                    visible={finalConfirmation}
                    handleClose={() => {
                        setUserUpdateValue(pre => ({
                            ...pre,
                            CSampleSize: selectedData.CSampleSize,
                            CHighValue: selectedData.CHighValue,
                            CLowValue: selectedData.CLowValue,
                            CTolerance: selectedData.CTolerance,
                        }));
                        setFinalConfirmation(false);
                        setTypeOfModal('');
                    }}
                    content={`You've already entered ${
                        masterData.filter(x => x?.value != '')?.length || ''
                    } samples value. Do you want to continue and change it`}
                    handleYesPress={() => {
                        handleFinalConfirmYesPress();
                    }}
                    typeOfModal={typeOfModal}
                    showType={false}
                />
            )}
            {Boolean(showFileModal) && (
                <OfflineFileViewModal
                    visible={showFileModal}
                    list={inspectData?.attachments || []}
                    onDismiss={() => {
                        setShowFileModal(false);
                    }}
                />
            )}
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    tabStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
    },
    centerBox: {
        flex: 1,
        marginVertical: 10,
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    btnContainer: {
        paddingTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconFilter: {
        width: RFPercentage(5),
    },
    tabBox: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 10,
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
        backgroundColor: COLORS.icborder,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastBox: {
        alignSelf: 'center',
    },
    inspectBox: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
    },
    iText: {
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.white,
    },
    headerTitle: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    headerName: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color: '#000',
    },
    flatHeader: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    flatHeaderContainer: {
        padding: 8,
        backgroundColor: COLORS.icBackground,
        borderRadius: 5,
    },
    modalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalBox: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 180,
        padding: 10,
    },
    modalHeader: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18,
        color: '#000',
        padding: 10,
    },
    modalText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: '#000',
        padding: 10,
        textAlign: 'center',
    },
    modalBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBtnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    btnStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
});

export default InprocessInspection;
