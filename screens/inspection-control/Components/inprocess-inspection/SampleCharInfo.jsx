import React, { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform, TextInput } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import InputFilePicker from './InputFilePicker';
import SingleDropDown from '../SingleDropDown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SampleCharInfo = ({
    selectedData = {},
    setSelectedData = () => {},
    showConfirmModal = false,
    setShowConfirmModal = () => {},
    setTimer = () => {},
    timer = null,
    userUpdateValue,
    setUserUpdateValue = () => {},
    setTypeOfModal = () => {},
    charType = 'number',
    inspectionType = '',
}) => {
    const [defectList, setDefectList] = useState([]);
    const insets = useSafeAreaInsets();
    useEffect(() => {
        let tempCharInfo = Boolean(selectedData?.charInfo?.length)
            ? selectedData?.charInfo?.map(item => {
                  if (
                      item.PropertyName == 'CHighValue' ||
                      item.PropertyName == 'CLowValue' ||
                      item.PropertyName == 'CSampleSize' ||
                      item.PropertyName == 'CTolerance'
                  ) {
                      return { ...item, Value: item.Value.toString() || '' };
                  } else {
                      return { ...item, Value: item.Value || '' };
                  }
              })
            : [];
        setUserUpdateValue(prev => ({
            ...prev,
            CHighValue: selectedData?.CHighValue.toString() || '',
            CLowValue: selectedData?.CLowValue.toString() || '',
            CSampleSize: selectedData?.CSampleSize.toString() || '',
            CTolerance: selectedData?.CTolerance || '',
            charInfo: JSON.parse(JSON.stringify(tempCharInfo)) || [],
        }));
        if (selectedData?.DefectPhenomenonList?.length) {
            let temp = [];
            selectedData?.DefectPhenomenonList?.map(item => {
                temp.push({
                    ...item,
                    label: item?.DefectPhenomenon,
                    value: item?.DefectPhenomenon,
                });
            });
            setDefectList([...temp]);
        } else {
            setDefectList([]);
        }
    }, [selectedData]);

    const handleUserInputChange = (key, val, type, oldValue, staticKey) => {
        let temp = JSON.parse(JSON.stringify(userUpdateValue.charInfo));
        let updatedtemp = temp.map(item => (item.PropertyName === key ? { ...item, Value: val } : item));
        setUserUpdateValue(pre => ({ ...pre, [staticKey]: val, charInfo: updatedtemp }));
        setTypeOfModal(type);
        if (val !== oldValue) {
            if (val.length && Number(val) > 0) {
                if (timer) clearTimeout(timer); // clear previous timeout
                const newTimer = setTimeout(() => {
                    setShowConfirmModal(true);
                }, 1000); // 1 second delay
                setTimer(newTimer);
            } else {
                if (timer) clearTimeout(timer);
                type === 'samplesize' &&
                    showMessage({
                        message: 'Sample size must be a positive integer. Zero or negative values are not acceptable.',
                        backgroundColor: COLORS.ERROR,
                        color: COLORS.white,
                        duration: 1500,
                        statusBarHeight: 40,
                        icon: 'warning',
                        position: 'right',
                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : { paddingTop: insets.top },
                    });
            }
        }
    };
    const handleInputChange = (key, val) => {
        let temp = JSON.parse(JSON.stringify(selectedData.charInfo));
        let updatedtemp = temp.map(item => (item.PropertyName === key ? { ...item, Value: val } : item));
        setSelectedData(pre => ({ ...pre, [key]: val, charInfo: updatedtemp }));
    };
    const handleGetUserUpadedValue = item => {
        if (item?.PropertyName === 'CHighValue' || item?.RefData === '##HighToleranceValue##') {
            return userUpdateValue.CHighValue?.toString();
        } else if (item?.PropertyName === 'CLowValue' || item?.RefData === '##LowToleranceValue##') {
            return userUpdateValue.CLowValue?.toString();
        } else if (item?.PropertyName === 'CTolerance' || item?.RefData === '##ATTorVAR##') {
            return userUpdateValue.CTolerance?.toString();
        } else if (item?.PropertyName === 'CSampleSize' || item?.RefData === '##SampleSize##' || item.PropertyName.includes('SampleSize')) {
            return userUpdateValue.CSampleSize?.toString();
        } else {
            return item?.Value;
        }
    };
    return (
        <View style={styles.rowContainer}>
            {Boolean(selectedData?.charInfo?.length) &&
                selectedData?.charInfo
                    ?.filter(item => {
                        if (
                            charType != 'number' &&
                            (item.RefData == '##HighToleranceValue##' || item.RefData == '##LowToleranceValue##' || item.RefData == '##ATTorVAR##')
                        ) {
                            return false;
                        }
                        return true;
                    })
                    .map((item, index) => {
                        return (
                            <View style={styles.subBox} key={index + 1}>
                                <Text style={styles.headerText} numberOfLines={1}>
                                    {item.DisplayName}
                                </Text>
                                <DynamicFormField
                                    title={item.DisplayName}
                                    fieldType={item.FieldType}
                                    value={handleGetUserUpadedValue(item) || ''}
                                    // isEditable={!Boolean(item?.IsEditable)}
                                    dropDownData={item.List?.length ? item.List : []}
                                    handleChange={val => {
                                        if (item.PropertyName == 'CHighValue' || item.RefData == '##HighToleranceValue##') {
                                            handleUserInputChange(item.PropertyName, val, 'highvalue', selectedData.CHighValue, 'CHighValue');
                                        } else if (item.PropertyName == 'CLowValue' || item.RefData == '##LowToleranceValue##') {
                                            handleUserInputChange(item.PropertyName, val, 'lowvalue', selectedData.CLowValue, 'CLowValue');
                                        } else if (item.PropertyName == 'CTolerance' || item.RefData == '##ATTorVAR##') {
                                            handleUserInputChange(item.PropertyName, val, 'spec', selectedData.CTolerance, 'CTolerance');
                                        } else if (
                                            item.PropertyName == 'CSampleSize' ||
                                            item.RefData == '##SampleSize##' ||
                                            item.PropertyName.includes('SampleSize')
                                        ) {
                                            handleUserInputChange('CSampleSize', val, 'samplesize', selectedData.CSampleSize, 'CSampleSize');
                                        } else {
                                            handleInputChange(item.PropertyName, val);
                                        }
                                    }}
                                />
                            </View>
                        );
                    })}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subBox: {
        width: '48%', // two columns
        marginBottom: 10,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.headerText,
    },
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 8,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
});

export default SampleCharInfo;
