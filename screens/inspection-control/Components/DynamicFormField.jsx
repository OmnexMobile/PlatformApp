import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import SingleDropDown from './SingleDropDown';
import DataPickerWithIcon from './DataPickerWithIcon';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import InputFilePicker from './inprocess-inspection/InputFilePicker';
import ListRadioButton from './inprocess-inspection/ListRadioButton';
import AutoSizingTextInput from './AutoSizingTextInput';

const DynamicFormField = ({
    fieldType = '',
    handleChange = () => {},
    dropDownData = [],
    value = '',
    placeHolder = '',
    isEditable = true,
    title = '',
    DisplayName = '',
    backgroundColor = COLORS.inputBG,
    dropdownPosition = 'top',
}) => {
    const parseToDate = val => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (moment.isMoment(val)) return val.toDate();

        const str = typeof val === 'string' ? val.trim() : val;

        const parsed = moment(
            str,
            [
                'MM/DD/YYYY h:mm:ss A', // 12-hour with AM/PM
                'MM/DD/YYYY HH:mm:ss', // 24-hour
                'MM/DD/YYYY',
                moment.ISO_8601,
            ],
            true,
        );

        return parsed.isValid() ? parsed.toDate() : null;
    };
    const { width } = useWindowDimensions();
    switch (fieldType) {
        case 'textinput':
        case 'text':
        case 'Integer':
        case 'Text':
            return (
                // <TextInput
                //     value={value || ''}
                //     style={[styles.inputBox, { backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey }]}
                //     onChangeText={val => {
                //         if (isEditable) {
                //             handleChange(val);
                //         }
                //     }}
                //     placeholder={placeHolder}
                //     // multiline={true}
                //     // editable={isEditable}
                // />
                // <TextInput
                //     value={value || ''}
                //     style={[
                //         styles.multilineInput,
                //         {
                //             backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey,
                //         },
                //     ]}
                //     onChangeText={val => {
                //         if (isEditable) {
                //             handleChange(val);
                //         }
                //     }}
                //     placeholder={placeHolder}
                //     multiline={true}
                //     scrollEnabled={true}
                //     textAlignVertical="center"
                //     // numberOfLines={3}
                // />
                <AutoSizingTextInput
                    value={value || ''}
                    onChangeText={handleChange}
                    editable={isEditable}
                    placeholder={placeHolder}
                    backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
                    borderColor={COLORS.icBottomBox}
                    color={COLORS.ictextBlack}
                    style={{ marginTop: 8 }}
                    maxHeight={120}
                />
            );
        case 'singleDropDown':
        case 'Dropdown':
            return (
                <SingleDropDown
                    data={dropDownData}
                    backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
                    borderWidth={1}
                    marginTop={8}
                    title=""
                    borderRadius={4}
                    borderColor={COLORS.icBottomBox}
                    showSearch={dropDownData?.length > 10 ? true : false}
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
                    dropdownPosition={dropdownPosition}
                />
            );
        case 'datePicker':
        case 'datetime':
        case 'DateTime':
        case 'Date':
            return (
                <View style={{ marginTop: 8 }}>
                    <DataPickerWithIcon
                        // value={value ? moment(value, 'MM/DD/YYYY').toDate() : null}
                        value={parseToDate(value)}
                        onSelectedDate={val => {
                            // handleChange(val);
                            handleChange(moment(val).format('MM/DD/YYYY h:mm:ss A'));
                        }}
                        borderRadius={4}
                        paddingVertical={9}
                        borderColor={COLORS.icBottomBox}
                        placeHolder={placeHolder}
                        backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
                        editable={isEditable}
                    />
                </View>
            );
        case 'timePicker':
        case 'TimePicker':
        case 'Time':
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
                        backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
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
                    <ListRadioButton
                        options={dropDownData}
                        value={value}
                        handleRadioChange={val => {
                            handleChange(val.value);
                        }}
                        title={DisplayName}
                    />
                </View>
            );
        case 'textarea':
        case 'Textarea':
        case 'TextArea':
            return (
                <View style={{ marginTop: 8 }}>
                    {/* <AutoSizingTextInput
                        isEditable={isEditable}
                        value={value || ''}
                        handleChange={val => handleChange(val)}
                        placeholder={placeHolder}
                    /> */}

                    <AutoSizingTextInput
                        value={value || ''}
                        onChangeText={handleChange}
                        editable={isEditable}
                        placeholder={placeHolder}
                        backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
                        borderColor={COLORS.icBottomBox}
                        color={COLORS.ictextBlack}
                        style={{ marginTop: 8 }}
                        maxHeight={80}
                    />
                </View>
            );
        default:
            return (
                // <TextInput
                //     value={value || ''}
                //     style={[styles.inputBox, { backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey }]}
                //     onChangeText={val => {
                //         if (isEditable) {
                //             handleChange(val);
                //         }
                //     }}
                //     placeholder={placeHolder}
                //     // editable={isEditable}
                // />
                // <TextInput
                //     value={value || ''}
                //     style={[
                //         styles.multilineInput,
                //         {
                //             backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey,
                //         },
                //     ]}
                //     onChangeText={val => {
                //         if (isEditable) {
                //             handleChange(val);
                //         }
                //     }}
                //     placeholder={placeHolder}
                //     multiline={true}
                //     scrollEnabled={true}
                //     textAlignVertical="center"
                //     // numberOfLines={3}
                // />
                <AutoSizingTextInput
                    value={value || ''}
                    onChangeText={handleChange}
                    editable={isEditable}
                    placeholder={placeHolder}
                    backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
                    borderColor={COLORS.icBottomBox}
                    color={COLORS.ictextBlack}
                    style={{ marginTop: 8 }}
                    maxHeight={120}
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
    multilineInput: {
        minHeight: 40,
        height: undefined,
        paddingVertical: 10,
        textAlignVertical: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 8,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
});

export default DynamicFormField;
