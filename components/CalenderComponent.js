import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import TextComponent from './text';

const INITIAL_DATE = '2022-09-16';

const CalendarComponent = ({
    title = '',
    current = INITIAL_DATE,
    minDate = -20,
    markedDates,
    markingType,
    disabledDaysIndexes = [0, 6],
    onDateChange,
}) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState(INITIAL_DATE);

    const getDate = count => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const onDayPress = useCallback(day => {
        setSelected(day.dateString);
    }, []);

    const renderCalendar = () => (
        <Calendar
            {...{
                current,
                minDate: getDate(minDate),
                markingType,
                markedDates,
                disabledDaysIndexes,
                theme: {
                    backgroundColor:theme.mode.backgroundColor,
                    textInactiveColor: '#a68a9f',
                    textSectionTitleDisabledColor: 'grey',
                    textSectionTitleColor: '#319e8e',
                    arrowColor: theme.colors.primaryThemeColor,
                    textDayFontFamily: 'ProximaNova-Regular',
                    textMonthFontFamily: 'ProximaNova-Regular',
                    textDayHeaderFontFamily: 'ProximaNova-Regular',
                    textTodayFontFamily: 'ProximaNova-Regular',
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
            <ScrollView showsVerticalScrollIndicator={false}>{renderCalendar()}</ScrollView>
        </>
    );
};

export default CalendarComponent;

const styles = StyleSheet.create({});
