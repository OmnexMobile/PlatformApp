import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import SplashScreen from 'screens/splash-screen';
import { ROUTES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import Register from 'screens/auth/register';
import Login from 'screens/auth/login';
import LaunchScreen from 'screens/launch-screen';
import Settings from 'screens/settings';
import PreferredLanguage from 'screens/settings/preferred-language.js';
import ThemePicker from 'screens/settings/theme-picker';
import { BottomTab } from './bottom-tab';

const Stack = createStackNavigator();


export const AppStackData = [
    {
        name: ROUTES.SPLASH_SCREEN,
        component: SplashScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGIN,
        component: Login,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTER,
        component: Register,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LAUNCH_SCREEN,
        component: LaunchScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SETTINGS,
        component: Settings,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.PREFERRED_LANGUAGE,
        component: PreferredLanguage,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.THEME_PICKER,
        component: ThemePicker,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.HOME,
        component: BottomTab,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
];


export function AppStack() {
    const { theme } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: { backgroundColor: theme.mode.backgroundColor },
                headerShown: false,
            }}
            initialRouteName={ROUTES.SPLASH_SCREEN}>
            {AppStackData.map(({ name, component, cardStyleInterpolator }, index) => (
                <Stack.Screen
                    key={index}
                    {...{
                        name,
                        component,
                        options: {
                            cardStyleInterpolator: cardStyleInterpolator || CardStyleInterpolators.forHorizontalIOS,
                        },
                    }}
                />
            ))}
        </Stack.Navigator>
    );
}
