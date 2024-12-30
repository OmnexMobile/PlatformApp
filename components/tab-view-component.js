import React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';

const TabViewComponent = ({ tabs = [] }) => {
    const { theme } = useTheme();
    const [index, setIndex] = React.useState(0);
    const [routes] = [
        tabs.map(({ title }, index) => ({
            key: index + 1,
            title,
        })),
    ];

    // const renderScene = SceneMap({
    //     1: AllTasks,
    //     2: Pending,
    // });
    const renderScene = SceneMap(
        Object.assign(
            {},
            ...tabs.map(({ component }, index) => ({
                [index + 1]: component,
            })),
        ),
    );

    const renderLabel = ({ route }) => (
        <TextComponent
            style={{
                fontFamily: 'ProximaNova-Bold',
                color: theme.mode.textColor,
                // fontSize: FONT_SIZE.SMALL,
                // paddingVertical: SPACING.SMALL,
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

    return <TabView renderTabBar={renderHeader} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />;
};

export default TabViewComponent;
