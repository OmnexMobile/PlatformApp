import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Content, FAB, TextComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';

const DATA = [
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
    },
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
    },
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
    },
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
    },
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
    },
    {
        teams: 'Delivery Team',
        reportingTeam: '-',
        teamMembers: 'Administrator QiMS',
        leader: 'Administrator QiMS',
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

const FormTeam = ({}) => {
    const { theme } = useTheme();
    return (
        <Content noPadding>
            <FlatList
                showsVerticalScrollIndicator={false}
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
                        <LabelValue {...{ label: 'Teams', value: item?.teams }} />
                        <LabelValue {...{ label: 'Reporting Team', value: item?.reportingTeam }} />
                        <LabelValue {...{ label: 'Team Members', value: item?.teamMembers }} />
                        <LabelValue {...{ label: 'Leader', value: item?.leader }} />
                    </TouchableOpacity>
                )}
            />
            <FAB iconType={ICON_TYPE.AntDesign} iconName="check" bottom={SPACING.NORMAL * 5} />
            <FAB iconType={ICON_TYPE.AntDesign} iconName="plus" />
        </Content>
    );
};

export default FormTeam;
