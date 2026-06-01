import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Content, FAB, Header, TextComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';

const DATA = [
    {
        action: 'Health',
        description: 'HS23 - Health',
        actionType: 'Concern Initial Evaluation',
        site: 'Corporate',
        createdAt: '25-05-2022',
        dueByDays: '-6',
        dueDate: '28-05-2022',
        status: 'open',
    },
    {
        action: 'Health',
        description: 'HS23 - Health',
        actionType: 'Concern Initial Evaluation',
        site: 'Corporate',
        createdAt: '25-05-2022',
        dueByDays: '-6',
        dueDate: '28-05-2022',
        status: 'open',
    },
];

const LabelValue = ({ label = '', value = '' }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: SPACING.SMALL }}>
        <TextComponent fontSize={FONT_SIZE.SMALL}>{label}:</TextComponent>
        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} style={{ marginLeft: SPACING.SMALL }}>
            {value}
        </TextComponent>
    </View>
);

const ProblemSolverPresentational = ({}) => {
    const { theme } = useTheme();
    return (
        <Content noPadding>
            <Header title="Problem Solver" />
            <View>
                <TextComponent style={{ padding: SPACING.NORMAL }} type={FONT_TYPE.BOLD}>
                    Open(<TextComponent color={theme.colors.primaryThemeColor}>2</TextComponent>)
                </TextComponent>
                <FlatList
                    data={DATA}
                    contentContainerStyle={{ flexGrow: 1, padding: SPACING.NORMAL, paddingTop: SPACING.SMALL }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                borderRadius: SPACING.SMALL,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                backgroundColor: theme.mode.backgroundColor,
                                padding: SPACING.NORMAL,
                                marginBottom: SPACING.NORMAL,
                            }}>
                            <LabelValue {...{ label: 'Action', value: item?.action }} />
                            <LabelValue {...{ label: 'Description', value: item?.description }} />
                            <LabelValue {...{ label: 'Action Type', value: item?.actionType }} />
                            <LabelValue {...{ label: 'Action Created Date', value: item?.createdAt }} />
                            <LabelValue {...{ label: 'Due by days', value: item?.dueByDays }} />
                            <LabelValue {...{ label: 'Due Date', value: item?.dueDate }} />
                            <LabelValue {...{ label: 'Status', value: item?.status }} />
                        </TouchableOpacity>
                    )}
                />
            </View>
            <FAB />
        </Content>
    );
};

export default ProblemSolverPresentational;
