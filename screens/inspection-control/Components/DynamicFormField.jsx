import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import SingleDropDown from './SingleDropDown';
import DataPickerWithIcon from './DataPickerWithIcon';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import InputFilePicker from './inprocess-inspection/InputFilePicker';
import ListRadioButton from './inprocess-inspection/ListRadioButton';

const DynamicFormField = ({
    fieldType = '',
    handleChange = () => {},
    dropDownData = [],
    value = '',
    placeHolder = '',
    isEditable = true,
    title = '',
    DisplayName = '',
}) => {
    const { width } = useWindowDimensions();
    switch (fieldType) {
        case 'textinput':
        case 'text':
        case 'Integer':
        case 'Text':
            return (
                <TextInput
                    value={value || ''}
                    style={[styles.inputBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey }]}
                    onChangeText={val => {
                        if (isEditable) {
                            handleChange(val);
                        }
                    }}
                    placeholder={placeHolder}
                    // editable={isEditable}
                />
            );
        case 'singleDropDown':
        case 'Dropdown':
            return (
                <SingleDropDown
                    data={dropDownData}
                    backgroundColor={isEditable ? COLORS.inputBG : COLORS.whiteGrey}
                    borderWidth={1}
                    marginTop={8}
                    title=""
                    borderRadius={4}
                    borderColor={COLORS.icBottomBox}
                    showSearch={false}
                    maxHeight={200}
                    value={value || {}}
                    onChange={val => {
                        handleChange(val);
                    }}
                    editable={isEditable}
                    containerStyle={{
                        elevation: 10,
                        width: width / 2.2,
                    }}
                />
            );
        case 'datePicker':
        case 'datetime':
            return (
                <View style={{ marginTop: 8 }}>
                    <DataPickerWithIcon
                        value={value ? moment(value, 'MM/DD/YYYY').toDate() : null}
                        onSelectedDate={val => {
                            handleChange(val);
                        }}
                        borderRadius={4}
                        paddingVertical={9}
                        borderColor={COLORS.icBottomBox}
                        placeHolder={placeHolder}
                        backgroundColor={isEditable ? COLORS.inputBG : COLORS.whiteGrey}
                        editable={isEditable}
                    />
                </View>
            );
        case 'timePicker':
            return (
                <View style={{ marginTop: 8 }}>
                    <DataPickerWithIcon
                        value={value || null}
                        onSelectedDate={val => {
                            handleChange(val);
                        }}
                        borderRadius={4}
                        paddingVertical={9}
                        borderColor={COLORS.icBottomBox}
                        placeHolder={placeHolder}
                        type="time"
                        backgroundColor={isEditable ? COLORS.inputBG : COLORS.whiteGrey}
                        editable={isEditable}
                    />
                </View>
            );
        case 'filepicker':
        case 'File':
            return (
                <View style={{ marginTop: 8 }}>
                    <InputFilePicker
                        maxLimit={1}
                        ListData={typeof value == 'object' ? [value] : value || []}
                        isEditable={isEditable}
                        title={title}
                        handleInputChange={val => {
                            if (val.length) {
                                console.log(val[0], 'val[0]');
                                handleChange(val[0]);
                            } else {
                                handleChange('');
                            }
                        }}
                    />
                </View>
            );
        case 'radioButton':
        case 'RadioButton':
        case 'Radio':
            return (
                <View style={{ marginTop: 8 }}>
                    <ListRadioButton options={dropDownData} value={value || ''} handleRadioChange={handleChange} title={DisplayName} />
                </View>
            );
        default:
            return (
                <TextInput
                    value={value || ''}
                    style={[styles.inputBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey }]}
                    onChangeText={val => {
                        if (isEditable) {
                            handleChange(val);
                        }
                    }}
                    placeholder={placeHolder}
                    // editable={isEditable}
                />
            );
    }
};
const styles = StyleSheet.create({
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 8,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    fileBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    fileText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: COLORS.headerText,
    },
});

export default DynamicFormField;
