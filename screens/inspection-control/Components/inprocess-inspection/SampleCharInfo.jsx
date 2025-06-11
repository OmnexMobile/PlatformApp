import React, { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Platform, TextInput } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import DynamicFormField from '../DynamicFormField';
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

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
}) => {
    useEffect(() => {
        setUserUpdateValue(prev => ({
            ...prev,
            CHighValue: selectedData?.CHighValue.toString() || '',
            CLowValue: selectedData?.CLowValue.toString() || '',
            CSampleSize: selectedData?.CSampleSize.toString() || '',
            CTolerance: selectedData?.CTolerance || '',
        }));
    }, [selectedData]);

    const handleUserInputChange = (key, val, type) => {
        setUserUpdateValue(pre => ({ ...pre, [key]: val }));
        setTypeOfModal(type);
        // if (type === 'samplesize') {
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
        // }
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
                <Text style={styles.headerText}>Characteristic Description</Text>
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
                <Text style={styles.headerText}>Spec</Text>
                <TextInput
                    value={userUpdateValue?.CTolerance || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleUserInputChange('CTolerance', val, 'spec');
                    }}
                    placeholder={''}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText}>High value</Text>
                <TextInput
                    value={userUpdateValue?.CHighValue || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleUserInputChange('CHighValue', val, 'highvalue');
                    }}
                    placeholder={''}
                />
            </View>
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Low value</Text>
                <TextInput
                    value={userUpdateValue?.CLowValue || ''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleUserInputChange('CLowValue', val, 'lowvalue');
                    }}
                    placeholder={''}
                />
            </View>
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
            {/* need to ask about this */}
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
            {/* <View style={styles.subBox}>
                <Text style={styles.headerText}>Inspectec result</Text>
                <TextInput
                    value={''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('', val);
                    }}
                    placeholder={''}
                />
            </View> */}
            {/* defect list need to add */}
            <View style={styles.subBox}>
                <Text style={styles.headerText}>Defect</Text>
                <TextInput
                    value={''}
                    style={[styles.inputBox, { backgroundColor: COLORS.inputBG }]}
                    onChangeText={val => {
                        handleInputChange('', val);
                    }}
                    placeholder={''}
                />
            </View>
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
            {/* {(infoData.GeneralInfo || []).map((item, index) => (
                <View style={styles.subBox} key={`${item.strPropertyName}-${index}`}>
                    <Text style={styles.headerText}>{item.strDisplayName}</Text>
                    <DynamicFormField
                        title="Supplier Name"
                        fieldType={item.strDataType}
                        value={item.strValue}
                        isEditable={item.intEditable == 1}
                        handleChange={val => handleInputChange(val, item)}
                    />
                   
                </View>
            ))} */}
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
