import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconE from 'react-native-vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

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
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (value !== null) {
            setDate(value instanceof Date ? value : new Date(value));
        }
    }, [value]);

    const handleConfirm = (selectedDate) => {
        setShowPicker(false);
        setDate(selectedDate);
        onSelectedDate(selectedDate);
    };

    const handleCancel = () => {
        setShowPicker(false);
    };

    const displayValue = value !== null || date;

    return (
        <>
            {showHeader && <Text style={styles.headerText}>{title}</Text>}

            <TouchableOpacity
                style={[
                    styles.container,
                    {
                        borderRadius,
                        backgroundColor,
                        borderWidth,
                        paddingVertical,
                        borderColor,
                    },
                ]}
                onPress={() => editable && setShowPicker(true)}
                activeOpacity={editable ? 0.5 : 1}
            >
                <Text numberOfLines={1} style={styles.textStyle}>
                    {displayValue
                        ? (type === 'date'
                            ? moment(date).format('DD/MM/YYYY')
                            : moment(date).format('hh:mm A'))
                        : placeHolder}
                </Text>
                {type === 'date' ? (
                    <Icon name="calendar" size={20} color={COLORS.moreIcon} />
                ) : (
                    <IconE name="clock" size={19} color={COLORS.moreIcon} />
                )}
            </TouchableOpacity>

            {editable && (
                <DateTimePickerModal
                    isVisible={showPicker}
                    date={date}
                    mode={type === 'date' ? 'date' : 'time'}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
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
