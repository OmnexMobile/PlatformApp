import React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Content, Header, TextComponent } from 'components';
import strings from 'config/localization';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import AllTasks from './all';
import ToBeCompleted from './to-be-completed';
import Pending from './pending';

const TaskStatus = ({ params }) => {
    const { theme } = useTheme();
    const [index, setIndex] = React.useState(0);
    const [routes] = [
        [
            { key: 'first', title: `All` },
            { key: 'second', title: `To be completed` },
            { key: 'third', title: `Pending` },
        ],
    ];

    const renderScene = SceneMap({
        first: AllTasks,
        second: ToBeCompleted,
        third: Pending,
    });

    const renderLabel = ({ route }) => (
        <TextComponent
            style={{
                fontFamily: 'ProximaNova-Bold',
                fontSize: FONT_SIZE.SMALL,
                color: theme.mode.textColor,
                paddingVertical: SPACING.SMALL,
            }}>
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
            <Header title={strings.APQPManager} />
            <TabView renderTabBar={renderHeader} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
        </Content>
    );
};
export default TaskStatus;
