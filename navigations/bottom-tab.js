import React from 'react';
import { Animated, StyleSheet, View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconComponent, TextComponent } from '../components';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme-constants';
import { ICON_TYPE, ROUTES } from '../constants/app-constant';
import Home from '../screens/home';
import Calender from '../screens/calender';
import ProfileHome from '../screens/profile/profile-home';
import useTheme from '../theme/useTheme';
import TaskStatus from '../screens/task-status';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
import { useAppContext } from 'contexts/app-context';
import HomeProblemSolver from '../screens/problemSolver/containers/home';
import CalenderProblemSolver from '../screens/problemSolver/containers/calender';
import ProfileProblemSolver from '../screens/problemSolver/containers/profile/profile-home'

const Tab = createBottomTabNavigator();

// const ICON_SIZE = 25;
const ICON_SIZE = 25;

const TabBarIcon = ({ color, focused, IconType = ICON_TYPE.MaterialCommunityIcons, iconName = '', name = '' }) => {
    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center'}, (Platform.OS === 'ios') && {paddingTop: RFPercentage(3)}]}>
           {(iconName === 'ellipsis-h') ? <Icon type={IconType} name={`${iconName}${!focused ? '' : ''}`} color={color} size={28} />
                : <IconComponent style={{ paddingBottom:  RFPercentage(5) }} type={IconType} name={`${iconName}${!focused ? '-outline' : ''}`} color={color} size={ICON_SIZE} />}
                {/* : <IconComponent type={IconType} name={`${iconName}${!focused ? '-outline' : ''}`} color={color} size={ICON_SIZE} />} */}
            {/* <TextComponent
                {...{
                    fontSize: FONT_SIZE.SMALL,
                    color,
                    ...(focused && { type: FONT_TYPE.BOLD }),
                }}>
                {name}
            </TextComponent> */}
        </View>
    );
};

function BottomTab({ style = {} }) {
    const { theme } = useTheme();
    console.log('CURRENT_PAGE--->', 'bottom-tab')
    const { profile } = useAppContext();
    console.log('profile---Bottom-tab', profile, profile?.CurrentApp)
    return (
        <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
            <Tab.Navigator
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.primaryThemeColor,
                    tabBarStyle: { backgroundColor: theme.mode.backgroundColor, height: RFPercentage(10) },
                    tabBarLabelStyle: { fontSize: FONT_SIZE.NORMAL },
                }}>
                <Tab.Screen
                    name="Home"
                    // component={profile?.CurrentApp == 'problemSolver' ? HomeProblemSolver : Home}
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            // <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.Ionicons, iconName: 'home', name: 'Ticketss' }} />
                            <Icons name="home" size={30} color={color} style={{ paddingTop: RFPercentage(1)}}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Calender"
                    // component={profile?.CurrentApp == 'problemSolver' ? CalenderProblemSolver : Calender}
                    component={Calender}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            // <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.Ionicons, iconName: 'calendar', name: 'Search' }} />
                            <Icons name="calendar" size={30} color={color} style={{ paddingTop: RFPercentage(1)}}/>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="TaskStatus"
                    component={TaskStatus}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.Ionicons, iconName: 'reader', name: 'History' }} />
                        ),
                    }}
                /> */}
                <Tab.Screen
                    name={'More'}
                    // component={ profile?.CurrentApp == 'problemSolver' ? ProfileProblemSolver : ProfileHome}
                    component={ProfileHome}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                           <Icon name="user" size={30} color={color} style={{ paddingTop: RFPercentage(1)}}/>
                        //    <TabBarIcon {...{ color, focused, IconType: ICON_TYPE.FontAwesome, iconName: 'user', name: 'user' }} />
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
        overflow: 'hidden'
    },
});
