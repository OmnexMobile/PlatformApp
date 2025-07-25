import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import SingleDropDown from './SingleDropDown';
import DataPickerWithIcon from './DataPickerWithIcon';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import InputFilePicker from './inprocess-inspection/InputFilePicker';

const DynamicFormField = ({
    fieldType = '',
    handleChange = () => {},
    dropDownData = [],
    value = '',
    placeHolder = '',
    isEditable = true,
    title = '',
}) => {
    switch (fieldType) {
        case 'textinput':
        case 'text':
        case 'Integer':
            return (
                <TextInput
                    value={value || ''}
                    style={[styles.inputBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey}]}
                    onChangeText={val => {
                        if(isEditable){
                            handleChange(val);
                        }
                    }}
                    placeholder={placeHolder}
                    // editable={isEditable}
                />
            );
        case 'singleDropDown':
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
                        width:220
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
            return (
                <View style={{ marginTop: 8 }}>
                    <InputFilePicker
                        ListData={value || []}
                        isEditable={isEditable}
                        title={title}
                        handleInputChange={val => {
                            handleChange(val);
                        }}
                    />
                </View>
            );
        default:
            return (
                <TextInput
                   value={value || ''}
                    style={[styles.inputBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey}]}
                    onChangeText={val => {
                        if(isEditable){
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
