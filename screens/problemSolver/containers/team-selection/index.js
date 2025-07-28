import React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Content, Header, TextComponent } from 'components';
import useTheme from 'theme/useTheme';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import CurrentTeam from './current-team';
import FormTeam from './form-team';
import { FONT_TYPE } from 'constants/app-constant';

const TeamSelection = ({}) => {
    const { theme } = useTheme();
    const [index, setIndex] = React.useState(0);
    const [routes] = [
        [
            { key: 'first', title: `Current Team` },
            { key: 'second', title: `Form Team` },
        ],
    ];

    const renderScene = SceneMap({
        first: CurrentTeam,
        second: FormTeam,
    });

    const renderLabel = ({ route }) => (
        <TextComponent
            style={{
                fontSize: FONT_SIZE.SMALL,
                color: theme.mode.textColor,
                paddingVertical: SPACING.SMALL,
            }}
            type={FONT_TYPE.BOLD}>
            {route.title}
        </TextComponent>
    );

    const renderHeader = props => (
        <TabBar
            indicatorStyle={{ backgroundColor: theme.colors.primaryThemeColor, height: 1.5 }}
            style={{ backgroundColor: theme.mode.backgroundColor, elevation: 0, borderBottomWidth: 0.2, borderColor: COLORS.accordionBorderColor }}
            renderLabel={renderLabel}
            {...props}
        />
    );
    return (
        <Content noPadding>
            <Header title="Team Selection" />
            <TabView renderTabBar={renderHeader} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
        </Content>
    );
};
export default TeamSelection;
