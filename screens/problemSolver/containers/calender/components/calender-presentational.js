import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { CalendarComponent, Content, GradientButton, Header, LottieAnimation, TextComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { LOTTIE_FILE } from 'assets/lottie';
import { APP_VARIABLES, FONT_TYPE, ROUTES } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';

const CalenderPresentational = ({ selectedDate, setSelectedDate }) => {
    const navigation = useNavigation();
    return (
        <Content noPadding>
            <Header title="Filter by Date" />
            <View style={{ flex: 1 }}>
                <CalendarComponent
                    markingType="period"
                    date={selectedDate}
                    onDateChange={value => setSelectedDate(value)}
                    // markedDates={{
                    //     '2023-04-24': { startingDay: true, selected: true, marked: true, selectedColor: 'blue', color: 'lightgreen' },
                    //     '2023-04-25': { marked: true, color: 'lightgreen' },
                    //     '2023-04-26': { endingDay: true, selected: true, marked: true, selectedColor: 'blue', color: 'lightgreen' },
                    // }}
                />
            </View>
            <View style={{ padding: SPACING.NORMAL, paddingTop: 0 }}>
                <GradientButton
                    onPress={() =>
                        navigation.navigate(ROUTES.FILTERED_LIST_PS
                            , {
                            [APP_VARIABLES.FROM_DATE]: selectedDate,
                        })
                    }>
                    Filter
                </GradientButton>
            </View>
            {/* navigation.navigate(ROUTES.LIST_SCREEN, {
                            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                            title,
                        }) */}
        </Content>
    );
};
// const CalenderPresentational = ({}) => (
//     <Content noPadding>
//         <Header title="Calender" />
//         <View style={{
//             flex: 1,
//             alignItems: 'center', justifyContent: 'center'
//         }}>
//             <TextComponent fontSize={FONT_SIZE.LARGE}>Work in Progress</TextComponent>
//         </View>
//         {/* <CalendarComponent /> */}
//     </Content>
// );

export default CalenderPresentational;
