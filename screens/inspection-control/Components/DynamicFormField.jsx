import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import SingleDropDown from './SingleDropDown';
import DataPickerWithIcon from './DataPickerWithIcon';

const DynamicFormField = ({ fieldType = '', handleChange = () => {}, dropDownData = [], value = '', placeHolder = '' }) => {
    switch (fieldType) {
        case 'inputbox':
            return (
                <TextInput
                    value={value || ''}
                    style={styles.inputBox}
                    onChangeText={val => {
                        handleChange(val);
                    }}
                    placeholder={placeHolder}
                />
            );
        case 'singleDropDown':
            return (
                <SingleDropDown
                    data={dropDownData}
                    backgroundColor={COLORS.white}
                    borderWidth={1}
                    marginTop={15}
                    title=""
                    borderRadius={4}
                    borderColor={COLORS.icBottomBox}
                    showSearch={false}
                    maxHeight={200}
                    value={value || {}}
                    onChange={val => {
                        handleChange(val);
                    }}
                />
            );
        case 'datePicker':
            return (
                <View style={{ marginTop: 10 }}>
                    <DataPickerWithIcon
                        value={value || null}
                        onSelectedDate={val => {
                            handleChange(val);
                        }}
                        borderRadius={4}
                        paddingVertical={9}
                        borderColor={COLORS.icBottomBox}
                        placeHolder={placeHolder}
                    />
                </View>
            );
        case 'timePicker':
            return (
                <View style={{ marginTop: 10 }}>
                    <DataPickerWithIcon
                        value={value || null}
                        onSelectedDate={val => {
                            handleChange(val);
                        }}
                        borderRadius={4}
                        paddingVertical={9}
                        borderColor={COLORS.icBottomBox}
                        placeHolder={placeHolder}
                        type='time'
                    />
                </View>
            );
        default:
            return null;
    }
};
const styles = StyleSheet.create({
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 3,
        borderColor: COLORS.icBottomBox,
        marginTop: 15,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
});

export default DynamicFormField;
