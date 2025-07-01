import React, { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform, TextInput } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import InputFilePicker from './InputFilePicker';
import SingleDropDown from '../SingleDropDown';

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

    useEffect(() => {
        setUserUpdateValue(prev => ({
            ...prev,
            CHighValue: selectedData?.CHighValue.toString() || '',
            CLowValue: selectedData?.CLowValue.toString() || '',
            CSampleSize: selectedData?.CSampleSize.toString() || '',
            CTolerance: selectedData?.CTolerance || '',
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

    const handleUserInputChange = (key, val, type, oldValue) => {
        setUserUpdateValue(pre => ({ ...pre, [key]: val }));
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
                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                    });
            }
        }
    };
    const handleInputChange = (key, val) => {
        setSelectedData(pre => ({ ...pre, [key]: val }));
    };
    return (
        <View style={styles.rowContainer}>
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Characteristics No</Text>
                <TextInput
                    value={selectedData?.CharacteristicsNumber || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('CharacteristicsNumber', val);
                    }}
                    placeholder={''}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText} numberOfLines={1}>
                    Characteristic Description
                </Text>
                <TextInput
                    value={selectedData?.CCharacteristicsDescription || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('CCharacteristicsDescription', val);
                    }}
                    placeholder={''}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText} numberOfLines={1}>
                    Characteristic Class
                </Text>
                <TextInput
                    value={selectedData?.CCharacteristicsClass || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('CCharacteristicsClass', val);
                    }}
                    placeholder={''}
                />
            </View>
            {Boolean(inspectionType == 1) && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>UOM</Text>
                    <TextInput
                        value={selectedData?.UOM || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleInputChange('UOM', val);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {charType === 'number' && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Specification</Text>
                    <TextInput
                        value={userUpdateValue?.CTolerance || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleUserInputChange('CTolerance', val, 'spec', selectedData.CTolerance);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {charType === 'number' && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>High value</Text>
                    <TextInput
                        value={userUpdateValue?.CHighValue || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleUserInputChange('CHighValue', val, 'highvalue', selectedData.CHighValue);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {charType === 'number' && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Low value</Text>
                    <TextInput
                        value={userUpdateValue?.CLowValue || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleUserInputChange('CLowValue', val, 'lowvalue', selectedData.CLowValue);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {Boolean(inspectionType == 2) && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Eval Tech</Text>
                    <TextInput
                        value={selectedData?.GageNo || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleInputChange('GageNo', val);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {/* need to ask about this */}
            {Boolean(inspectionType != 2) && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Inspection method</Text>
                    <TextInput
                        value={''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleInputChange('', val);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            {Boolean(inspectionType != 2) && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Gage or Instrument</Text>
                    <TextInput
                        value={selectedData?.GageName || ''}
                        style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                        onChangeText={val => {
                            handleInputChange('GageName', val);
                        }}
                        placeholder={''}
                    />
                </View>
            )}
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Sample frequency</Text>
                <TextInput
                    value={selectedData?.CSampleFrequency || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('CSampleFrequency', val);
                    }}
                    placeholder={''}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Sample size</Text>
                <TextInput
                    value={userUpdateValue?.CSampleSize || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleUserInputChange('CSampleSize', val, 'samplesize');
                    }}
                    placeholder={''}
                />
            </View>
            {Boolean(inspectionType != 2) && (
                <View style={styles.subBox}>
                    <Text style={styles.headerText}>Defect</Text>
                    <SingleDropDown
                        data={defectList || []}
                        // backgroundColor={isEditable ? COLORS.inputBG : COLORS.whiteGrey}
                        borderWidth={1}
                        marginTop={8}
                        title=""
                        borderRadius={4}
                        borderColor={COLORS.icBottomBox}
                        showSearch={false}
                        maxHeight={200}
                        value={selectedData.Defects || {}}
                        onChange={val => {
                            handleInputChange('Defects', val);
                        }}
                        // editable={isEditable}
                    />
                </View>
            )}
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Remarks</Text>
                <TextInput
                    value={selectedData?.Remarks || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('Remarks', val);
                    }}
                    placeholder={''}
                />
            </View>
            {/* <View style={styles.subBox}>
                <Text style={styles.headerText}>Evidence 1</Text>
                <DynamicFormField
                    title="Evidence1"
                    fieldType={'filepicker'}
                    value={selectedData?.Evidence1 || []}
                    isEditable={true}
                    handleChange={val => handleInputChange('Evidence1', val)}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Evidence1</Text>
                <DynamicFormField
                    title="Evidence2"
                    fieldType={'filepicker'}
                    value={selectedData?.Evidence2 || []}
                    isEditable={true}
                    handleChange={val => handleInputChange('Evidence2', val)}
                />
            </View> */}
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
