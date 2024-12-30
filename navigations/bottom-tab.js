import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconComponent, TextComponent } from 'components';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';
import Home from 'screens/home';
import Calender from 'screens/calender';
import ProfileHome from 'screens/profile/profile-home';
import useTheme from 'theme/useTheme';

const Tab = createBottomTabNavigator();

const ICON_SIZE = 23;

const TabBarIcon = ({ color, focused, IconType = ICON_TYPE.MaterialCommunityIcons, iconName = '', name = '' }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: SPACING.SMALL }}>
            <IconComponent type={IconType} name={`${iconName}${!focused ? '-outline' : ''}`} color={color} size={ICON_SIZE} />
        </View>
    );
};

function BottomTab({ style = {} }) {
    const { theme } = useTheme();
    return (
        <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
            <Tab.Navigator
                screenOptions={{
                    // tabBarHideOnKeyboard: true,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.primaryThemeColor,
                    tabBarStyle: {
                        backgroundColor: theme.mode.backgroundColor,
                        height: RFPercentage(10),
                        borderTopColor: theme.mode.borderColor,
                        borderTopWidth: 1,
                    },
                }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.Ionicons, iconName: 'home', name: 'Ticketss' }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Calender"
                    component={Calender}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.Ionicons, iconName: 'calendar', name: 'Search' }} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </Animated.View>
    );
}

export { BottomTab };

const styles = StyleSheet.create({
    stack: {
        flex: 1,
        shadowColor: '#FFF',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 5,
        borderColor: COLORS.transparent,
        overflow: 'hidden',
    },
});
