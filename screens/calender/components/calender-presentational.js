import React from 'react';
import { View, Platform } from 'react-native';
import { CalendarComponent, Content, Header, TextComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';

const CalenderPresentational = ({}) => (
    <Content noPadding>
         {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
        <Header title="Calender" backState={true} />
        <View style={{
            flex: 1,
            alignItems: 'center', justifyContent: 'center'
        }}>
            <TextComponent fontSize={FONT_SIZE.LARGE}>Work in Progress</TextComponent>
        </View>
        {/* <CalendarComponent /> */}
    </Content>
);

export default CalenderPresentational;
