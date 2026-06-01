import React from 'react';
import { FlatList, View } from 'react-native';
import moment from 'moment';
import { Content, Header, PendingCard, PlaceHolders, TextComponent } from 'components';
import { DATE_FORMAT, FONT_TYPE, PLACEHOLDERS } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';

const DATA = [
    {
        TaskDescription: 'AVP safety validation Specification AVP safety validation Specification AVP safety validation Specification',
        StartDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        FinishDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        ProjectDescription: 'FAW FuSa SOTIF Project Plan',
        site: 'Omnex Systems',
        DueByDays: '10',
    },
    {
        TaskDescription: 'AVP safety validation Specification AVP safety validation Specification AVP safety validation Specification',
        StartDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        FinishDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        ProjectDescription: 'FAW FuSa SOTIF Project Plan',
        site: 'Omnex Systems',
        DueByDays: '10',
    },
    {
        TaskDescription: 'AVP safety validation Specification AVP safety validation Specification AVP safety validation Specification',
        StartDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        FinishDate: moment().format(DATE_FORMAT.DD_MM_YYYY),
        ProjectDescription: 'FAW FuSa SOTIF Project Plan',
        site: 'Omnex Systems',
        DueByDays: '10',
    },
];

const Open = ({ params }) => (
    <Content noPadding>
        {/* <View style={{ flex: 1 }}>
            <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
        </View> */}
        <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            ListHeaderComponent={
                <TextComponent fontSize={FONT_SIZE.X_LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                    In-Progress
                </TextComponent>
            }
            data={DATA}
            renderItem={({ item }) => <PendingCard item={item} />}
        />
    </Content>
);

export default Open;
