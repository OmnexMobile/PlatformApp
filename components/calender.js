import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { format } from 'date-fns';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import { useIsFocused } from '@react-navigation/native';

const INITIAL_DATE = format(new Date(), 'yyyy-MM-ddd');

const CalendarComponent = ({ title = '', date, minDate = -20, markedDates, markingType, disabledDaysIndexes = [0, 6], onDateChange }) => {
    const { theme } = useTheme();
    // const [selected, setSelected] = useState(INITIAL_DATE);

    const isFocused = useIsFocused();

    const getDate = count => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const marked = useMemo(() => {
        return {
            //   [getDate(-1)]: {
            //     dotColor: 'red',
            //     marked: true
            //   },
            [date]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: theme.colors.primaryThemeColor,
                // selectedTextColor: 'red'
            },
        };
    }, [date]);

    const renderCalendar = () => (
        <Calendar
            {...{
                enableSwipeMonths: true,
                current: date,
                // minDate: getDate(minDate),
                // markingType,
                markedDates: marked,
                disabledDaysIndexes,
                style: {
                    backgroundColor: theme.mode.backgroundColor,
                },
                theme: {
                    backgroundColor: theme.mode.backgroundColor,
                    calendarBackground: theme.mode.backgroundColor,

                    textInactiveColor: '#a68a9f',
                    textSectionTitleDisabledColor: 'grey',
                    textSectionTitleColor: '#319e8e',
                    arrowColor: theme.colors.primaryThemeColor,
                    textDayFontFamily: 'ProximaNova-Regular',
                    textMonthFontFamily: 'ProximaNova-Regular',
                    textDayHeaderFontFamily: 'ProximaNova-Bold',
                    textTodayFontFamily: 'ProximaNova-Regular',
                    // textDayFontSize: FONT_SIZE.LARGE,
                    // textMonthFontSize: FONT_SIZE.LARGE,
                    // // textDayHeaderFontSize: FONT_SIZE.LARGE,
                    // textTodayFontSize: FONT_SIZE.LARGE,
                },
                onDayPress: day => onDateChange?.(day.dateString),
            }}
        />
    );
    return (
        <>
            {title ? (
                <View
                    style={{
                        height: RFPercentage(8),
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.primaryThemeColor,
                    }}>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} color={COLORS.white}>
                        {title}
                    </TextComponent>
                </View>
            ) : null}
            {isFocused && <View>{renderCalendar()}</View>}
        </>
    );
};

export default CalendarComponent;

const styles = StyleSheet.create({});
