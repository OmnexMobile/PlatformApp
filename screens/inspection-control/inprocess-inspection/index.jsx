import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { Alert, BackHandler, FlatList, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        const list = item?.sampleList || [];
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
                    <Text style={[styles.headerTitle]}>{item.strCharacteristicName}</Text>
                    <Text style={[styles.headerName]}>{item.strOperationName}</Text>
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
    const handleFinalSavePress = (flag = false) => {
        console.log('callleddd2');
        dispatch({
            type: 'UPDATE_INSPECT_LIST',
            updatedData: infoData,
        });
        Boolean(flag) && navigation.goBack();
    };
    const handleBackPress = () => {
        if (!showCamer) {
            if (!showFilePage) {
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
                }
            } else {
                setShowFilePage(false);
            }
        } else {
            setShowCamer(false);
        }
        setShowAlart(false);
    };
    const handleSaveAlert = useCallback(
        (movenext = '', typeid = '') => {
            let isChanged = false;
            const filterdData = inspectList.filter(
                item => item.intProductionItemID == infoData.intProductionItemID && item.OperationID == infoData.OperationID,
            );
            const finalData = filterdData[0];
            if (showChar) {
                if (formType == 'number' || formType == 'char') {
                    // if sampleList avilable we need to check this or we need to use masterData
                    isChanged = selectedData?.sampleList?.some((item, index) => {
                        return item?.value !== masterData[index]?.value;
                    });
                    if (!selectedData?.sampleList?.length && masterData?.length > 0) {
                        isChanged = masterData?.some((item, index) => {
                            return item?.value !== valueUpadted[index]?.value;
                        });
                    }
                    if (selectedData?.sampleList?.length !== undefined && selectedData?.sampleList?.length !== masterData?.length) {
                        isChanged = true;
                    }
                    if (isChanged) {
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
    const handleSavePress = (close = true, btnText = 'noBtn') => {
        if (showChar) {
            const list = masterData || [];
            const allValues = list.length > 0 && list.every(({ value }) => value.trim() !== '');
            const someValues = list.some(({ value }) => value.trim() !== '');
            let status = allValues ? 'Completed' : someValues ? 'In Progress' : 'Launch';
            const updatedObj = {
                ...selectedData,
                sampleList: masterData,
                status: status,
            };
            const { VariableCharacteristics, AttributeCharacteristics } = infoData;
            const characteristicsList = formType === 'number' ? VariableCharacteristics : AttributeCharacteristics;
            const index = characteristicsList.findIndex(obj => obj?.intCCharacteristicId === selectedData?.intCCharacteristicId);
            const newCharacteristicsList = [...characteristicsList];
            if (index !== -1) {
                newCharacteristicsList[index] = updatedObj;
            }
            setSelectedData(updatedObj);
            setInfoData(pre => ({
                ...pre,
                [formType === 'number' ? 'VariableCharacteristics' : 'AttributeCharacteristics']: newCharacteristicsList,
            }));
        } else {
            handleFinalSavePress();
        }
        if (close) {
            console.log('close');
            setShowChar(false);
            handleBackPress();
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
            } else {
                Alert.alert('End of Sample List', 'You have reached the last sample.');
            }
        } else {
            let tempData = formType == 'number' ? infoData?.VariableCharacteristics : infoData.AttributeCharacteristics;
            if (currentIndex.index < tempData?.length - 1) {
                setNextSave(false);
                handleSaveAlert('nextSample');
                Keyboard.dismiss();
            } else if (currentIndex.index == tempData?.length - 1 && formType == 'number') {
                setMixedList('2');
                setNextSave(false);
                handleSaveAlert('nextSample', infoData.intInspectionTypeID);
                Keyboard.dismiss();
            } else {
                Alert.alert('End of Sample List', 'You have reached the last sample.');
            }
        }
    };

    const handleNextItem = (id = mixedList) => {
        if (id == '' || id == undefined) {
            let tempData = formType == 'number' ? infoData?.VariableCharacteristics : infoData.AttributeCharacteristics;
            const nextIndex = currentIndex.index + 1;
            setCurrentIndex({ index: nextIndex, type: formType });
            setSelectedData(tempData[nextIndex]);
        } else {
            let tempData = infoData.AttributeCharacteristics;
            setCurrentIndex({ index: 0, type: 'char' });
            setFormType('char');
            setSelectedData(tempData[0]);
        }
        setShowAlart(false);
        setNextSave(true);
        setMixedList('');
    };

    return (
        <CustomHeader
            title={renderHeader(inspectData.intInspectionTypeID)}
            activeTabId={2}
            showIcons={false}
            showFileIcon={showChar}
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
                                <GeneralInfo infoData={infoData} setInfoData={setInfoData} />
                            </View>
                        )}
                    </View>
                )}
                {!showChar && !showGeneral && (
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
                                style={{ height: 40, width: '87%' }}
                                onPress={() => {
                                    handleFinalSavePress(true);
                                }}>
                                Save
                            </ButtonComponent>
                            <View style={[styles.iconFilter]}>
                                <FilterWithMenu
                                    dataList={moreList}
                                    type="IconFilter"
                                    onSelectedPress={value => {
                                        handleMenuPress(value);
                                    }}
                                    anchorPosition="top"
                                />
                            </View>
                        </View>
                    </View>
                )}
                {showChar && (
                    <View style={{ flex: showChar ? 1 : 0 }}>
                        <TouchableOpacity
                            style={[styles.tabStyle, { borderBottomLeftRadius: showChar ? 0 : 10, borderBottomRightRadius: showChar ? 0 : 10 }]}
                            onPress={() => {
                                if (showChar) {
                                    handleCharOpen();
                                } else {
                                    showMessage({
                                        message: 'Please press the "Inspect" button.',
                                        backgroundColor: COLORS.WARNING,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 40,
                                        // style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                                        position: 'bottom',
                                    });
                                }
                            }}>
                            <Text style={[styles.headerText]}>Characteristics Info</Text>
                            <Icon name={showChar ? 'down' : 'right'} size={20} color={COLORS.moreIcon} />
                        </TouchableOpacity>
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
                            <Text style={[styles.modalText]} t>
                                There are unsaved changes. Do you want to save them?
                            </Text>
                        </View>
                        <View style={[styles.modalBtnContainer]}>
                            <View style={[styles.modalBtn]}>
                                <ButtonComponent
                                    style={{ height: 40, width: '45%' }}
                                    onPress={() => {
                                        nextSave ? handleBackPress() : handleNextItem();
                                    }}>
                                    No
                                </ButtonComponent>
                                <ButtonComponent
                                    style={{ height: 40, width: '45%' }}
                                    onPress={() => {
                                        handleSavePress(nextSave);
                                    }}>
                                    yes
                                </ButtonComponent>
                            </View>
                        </View>
                    </View>
                </Modal>
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
});

export default InprocessInspection;
