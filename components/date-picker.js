import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const DatePickerComponent = ({ name, label, required, value, onChange, editable = true }) => {
    const [activePicker, setActivePicker] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { theme } = useTheme();

    const showDatePicker = name => {
        setActivePicker(name);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = date => {
        onChange(name, moment(date).format(DATE_FORMAT['YYYY-MM-DD']));
        setTimeout(() => {
            setActivePicker(null);
        }, 100);
        hideDatePicker();
    };
    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.XX_SMALL,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <TouchableOpacity
                disabled={!editable}
                onPress={() => editable && showDatePicker(name)}
                activeOpacity={0.8}
                style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.whiteGrey,
                    paddingVertical: SPACING.X_SMALL,
                }}>
                <TextComponent
                    style={{
                        fontSize: FONT_SIZE.LARGE,
                        paddingVertical: SPACING.SMALL,
                        color: !value ? COLORS.searchText : theme?.mode.textColor,
                    }}>
                    {value ? moment(value).format(DATE_FORMAT.DD_MM_YYYY) : 'Select Date'}
                </TextComponent>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={data => handleConfirm(data, activePicker)}
                // onConfirm={data => handleConfirm(data, activePicker)}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

export default DatePickerComponent;
