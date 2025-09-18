import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconE from 'react-native-vector-icons/Fontisto';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';

const DataPickerWithIcon = ({
    placeHolder = 'Start Date',
    onSelectedDate = () => {},
    borderRadius = 10,
    showHeader = false,
    title = '',
    backgroundColor = '#fff',
    borderWidth = 1,
    paddingVertical = 7,
    type = 'date',
    borderColor = COLORS.staysIcon,
    value = null,
    editable = true,
}) => {
    const { dateFormat} = useSelector(state => state.inspection);
    const uiDateFormat = dateFormat || 'DD/MM/YYYY';
    const [date, setDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (value !== null) {
            setDate(value);
            setTempDate(value);
        }
    }, [value]);

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const handleDone = () => {
        setDate(tempDate);
        onSelectedDate(tempDate);
        setShowPicker(false);
    };

    const handleCancel = () => {
        setShowPicker(false);
    };

    return (
        <>
            {showHeader && <Text style={[styles.headerText]}>{title}</Text>}
            <TouchableOpacity
                style={[
                    styles.container,
                    { borderRadius: borderRadius, backgroundColor: backgroundColor, borderWidth, paddingVertical, borderColor: borderColor },
                ]}
                onPress={() => {
                    if (editable) {
                        showDatePicker();
                    }
                }}
                activeOpacity={editable ? 0.5 : 1}>
                <Text numberOfLines={1} style={[styles.textStyle]}>
                    {date !== null ? (type == 'date' ? moment(date).format(uiDateFormat) : moment(date).format('hh:mm A')) : placeHolder}
                </Text>
                {type == 'date' ? (
                    <Icon name="calendar" size={20} color={COLORS.moreIcon} />
                ) : (
                    <IconE name="clock" size={19} color={COLORS.moreIcon} />
                )}
            </TouchableOpacity>
            {/* {editable && showPicker && Platform.OS === 'ios' && (
                <Modal transparent={true} animationType="slide" onRequestClose={handleCancel}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 20,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}>
                            <DateTimePicker value={tempDate} mode={type} display="spinner" onChange={onChange} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button title="Cancel" onPress={handleCancel} />
                                <Button title="Done" onPress={handleDone} />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {editable && showPicker && Platform.OS === 'android' && ( */}
            {editable && (
                <DateTimePicker
                    isVisible={showPicker}
                    mode="date"
                    onCancel={() => setShowPicker(false)}
                    onConfirm={selectedDate => {
                        setShowPicker(false);
                        if (selectedDate) {
                            onSelectedDate(selectedDate);
                        }
                    }}
                />
            )}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    textStyle: {
        fontSize: 15,
        fontFamily: 'OpenSans-Regular',
        flex: 1,
        color: '#000',
    },
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        marginBottom: 8,
        color: COLORS.headerText,
    },
});

export default DataPickerWithIcon;
