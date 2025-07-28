import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Content, Header, IconComponent, TextComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const DATA = [
    {
        notification: '',
        deliverableName: 'Form Team',
        startDate: '25-10-2022',
        finishDate: '28-10-2022',
        actualStartDate: 'NA',
        actualFinishDate: 'NA',
    },
    {
        notification: '',
        deliverableName: 'Form Team',
        startDate: '25-10-2022',
        finishDate: '28-10-2022',
        actualStartDate: 'NA',
        actualFinishDate: 'NA',
    },
    {
        notification: '',
        deliverableName: 'Form Team',
        startDate: '25-10-2022',
        finishDate: '28-10-2022',
        actualStartDate: 'NA',
        actualFinishDate: 'NA',
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

const InitiateProblemSolvingPresentational = ({}) => {
    const { theme } = useTheme();
    return (
        <Content noPadding>
            <Header title="Initiate Problem Solving" />
            <FlatList
                data={DATA}
                contentContainerStyle={{ flexGrow: 1, padding: SPACING.NORMAL }}
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
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                right: SPACING.NORMAL,
                                top: SPACING.NORMAL,
                            }}>
                            <IconComponent
                                color={theme.colors.primaryThemeColor}
                                size={FONT_SIZE.LARGE}
                                type={ICON_TYPE.AntDesign}
                                name="questioncircleo"
                            />
                        </TouchableOpacity>
                        <LabelValue {...{ label: 'Notification', value: item?.notification }} />
                        <LabelValue {...{ label: 'Deliverable Name', value: item?.deliverableName }} />
                        <LabelValue {...{ label: 'Sch. Start Date', value: item?.startDate }} />
                        <LabelValue {...{ label: 'Sch. Finish Date', value: item?.finishDate }} />
                        <LabelValue {...{ label: 'Actual Start Date', value: item?.actualStartDate }} />
                        <LabelValue {...{ label: 'Actual End Date', value: item?.actualFinishDate }} />
                    </TouchableOpacity>
                )}
            />
        </Content>
    );
};

export default InitiateProblemSolvingPresentational;
