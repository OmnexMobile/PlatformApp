import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterWithMenu from '../FilterWithMenu';
import { ButtonComponent } from 'components';
import { RFPercentage } from 'helpers/utils';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import SampleCharInfo from './SampleCharInfo';
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
    setInfoData = () => {},
    infoData = {},
}) => {
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
    useEffect(() => {
        if (type == 'number') {
            if (Object.keys(selectedData).length && !selectedData?.sampleList?.length) {
                let sampleSize = selectedData.strSampleSize;
                const temp = Array.from({ length: sampleSize }, (_, index) => ({
                    id: index + 1,
                    count: index + 1,
                    value: '',
                    lowValue: selectedData.strLowValue,
                    highValue: selectedData.strHighValue,
                    tolerance: inspectionType == 2 ? selectedData?.strTolerance || 0 : 0,
                }));
                setMasterData([...temp]);
                setValueUpadted([...temp]);
            } else if (selectedData?.sampleList?.length > 0) {
                setMasterData([...selectedData?.sampleList]);
                setValueUpadted([...selectedData?.sampleList]);
            }
        } else if (type == 'char') {
            if (Object.keys(selectedData).length && !selectedData?.sampleList?.length) {
                let sampleSize = selectedData.strSampleSize;
                const temp = Array.from({ length: sampleSize }, (_, index) => ({
                    id: index + 1,
                    count: index + 1,
                    value: icSettings?.DefaultAllOK ? 'OK' : '',
                }));
                // if you want alert to ask enable temp1 and stroe in valueUpadted
                const temp1 = Array.from({ length: sampleSize }, (_, index) => ({
                    id: index + 1,
                    count: index + 1,
                    value: '',
                }));
                setMasterData([...temp]);
                if (icSettings?.DefaultAllOK) {
                    setValueUpadted([...temp1]);
                } else {
                    setValueUpadted([...temp]);
                }
            } else if (selectedData?.sampleList?.length > 0) {
                setMasterData([...selectedData?.sampleList]);
                setValueUpadted([...selectedData?.sampleList]);
            }
        }
    }, [selectedData, type]);

    const handleInputChange = (val, id) => {
        const updatedData = masterData.map(item => (item.id === id ? { ...item, value: val } : item));
        setMasterData(updatedData);
    };
    const handleContainmentSave = value => {
        const updatedData = masterData.map(item => (item.id === value.id ? { ...value } : item));
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
        if (index < masterData?.length - 1) {
            inputsRef.current[index + 1].focus(); // Focus next input
        } else {
            Keyboard.dismiss(); // Last input: dismiss keyboard
        }
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
        const renderIcon = (value, type) => {
            if (value === '') {
                return false;
            }
            if (type === 'number') {
                let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
                let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
                return Number(value) >= Number(lowValue) && Number(value) <= Number(highValue) ? false : true;
            }
            return value.toLowerCase() === 'ok' ? false : true;
        };
        return (
            <View style={[styles.contentBox]} key={item?.id}>
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
                    {renderIcon(item.value, type) && Boolean(icSettings?.ISContainmentAction) && (
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
                            handleInputChange(val, item.id);
                        }}
                        keyboardType={type == 'number' ? 'number-pad' : 'default'}
                        returnKeyType="done"
                        onSubmitEditing={() => handleSubmit(index)}
                        ref={ref => (inputsRef.current[index] = ref)}
                        blurOnSubmit={false}
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
    };
    const handleMenuPress = value => {
        if (value.id == 2) {
            let temp = JSON.parse(JSON.stringify(masterData));
            temp.push({
                id: temp?.length + 1,
                count: temp?.length + 1,
                value: '',
                lowValue: selectedData.strLowValue,
                highValue: selectedData.strHighValue,
                tolerance: inspectionType == 2 ? selectedData?.strTolerance || 0 : 0,
            });
            setMasterData(temp);
            setValueUpadted(temp);
        } else if (value.id == 1) {
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
                              : Number(x?.value) <= Number(x?.highValue))
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
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <View style={[styles.container]}>
                <ScrollView style={[styles.overallBox]} showsVerticalScrollIndicator={false}>
                    {/* need to chage the infodata as selectedData and setSelectedData */}
                    {showCharInfo && <SampleCharInfo infoData={infoData} setInfoData={setInfoData} />}
                    <View style={[styles.tableBox]}>
                        <View style={[styles.headerBox]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.headerText, { marginLeft: 15 }]}>No</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={[styles.headerText]}>Actual Value</Text>
                            </View>
                        </View>
                        {Boolean(masterData?.length) &&
                            masterData.map((item, index) => {
                                return renderItem(item, index);
                            })}
                    </View>
                    <View>
                        <BorderContent title="Total Samples Tested" color={COLORS.apptheme} count={masterData?.length} />
                        <BorderContent title="Sample(s) OK " color={COLORS.SUCCESS} count={renderOkCount(masterData)} />
                        <BorderContent title="Sample(s) Not OK " color={COLORS.ERROR} count={renderNotOkCount(masterData)} />
                    </View>
                </ScrollView>
                <View style={[styles.btnContainer]}>
                    <ButtonComponent
                        style={{ height: 40, width: '89%' }}
                        onPress={() => {
                            handleSavePress(true, 'saveBtn');
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
        width: RFPercentage(4.5),
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
});

export default CharacteristicsInfo;
