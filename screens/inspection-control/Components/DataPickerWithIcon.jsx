import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconE from 'react-native-vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RFPercentage } from 'react-native-responsive-fontsize';

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
    borderColor=COLORS.staysIcon
}) => {
    const [date, setDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

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
                style={[styles.container, { borderRadius: borderRadius, backgroundColor: backgroundColor, borderWidth, paddingVertical, borderColor: borderColor }]}
                onPress={() => {
                    showDatePicker();
                }}>
                <Text numberOfLines={1} style={[styles.textStyle]}>
                    {date !== null ? (type == 'date' ? moment(date).format('DD/MM/YYYY') : moment(date).format('hh:mm A')) : placeHolder}
                </Text>
                {type == 'date' ? <Icon name="calendar" size={20} /> : <IconE name="clock" size={19} />}
            </TouchableOpacity>
            {showPicker && Platform.OS === 'ios' && (
                <Modal transparent={true} animationType="slide" onRequestClose={handleCancel}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}>
                            <DateTimePicker
                                value={tempDate}
                                mode={type}
                                display="spinner"
                                onChange={onChange} 
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button title="Cancel" onPress={handleCancel} />
                                <Button title="Done" onPress={handleDone} />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {showPicker && Platform.OS === 'android' && (
                <DateTimePicker
                    value={tempDate}
                    mode={type}
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate && event?.type == 'set') {
                            onSelectedDate(selectedDate);
                            setDate(selectedDate);
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
        fontSize: RFPercentage(1.6),
        fontFamily: 'OpenSans-Regular',
        flex: 1,
        color:"#000"
    },
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        marginBottom: 8,
        color:COLORS.headerText
    },
});

export default DataPickerWithIcon;
