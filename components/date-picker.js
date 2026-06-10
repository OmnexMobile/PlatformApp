import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import TextComponent from './text';

const DatePickerComponent = ({ name, label, required, value, onChange, editable = true, containerStyle = {} }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { theme } = useTheme();
    const { timeSettings } = useAppContext();
    const parsedValue = value ? moment(value) : null;
    const hasValidValue = !!parsedValue && parsedValue.isValid();
    const pickerDate = hasValidValue ? parsedValue.toDate() : new Date();

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = date => {
        onChange(name, moment(date).format(DATE_FORMAT['YYYY-MM-DD']));
        hideDatePicker();
    };

    return (
        <View
            style={[
                {
                    padding: SPACING.NORMAL,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.X_SMALL,
                },
                containerStyle,
            ]}>
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
                onPress={showDatePicker}
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
                    {hasValidValue ? parsedValue.format(DATE_FORMAT[timeSettings || 'DD_MM_YYYY']) : 'Select Date'}
                </TextComponent>
            </TouchableOpacity>
            <DatePicker
                modal
                open={isDatePickerVisible}
                date={pickerDate}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

export default DatePickerComponent;