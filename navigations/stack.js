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
import ProblemSolver from 'screens/problem-solver';
import TeamSelection from 'screens/team-selection';
import InitiateProblemSolving from 'screens/initiate-problem-solving';
import { BottomTab } from './bottom-tab';
import NewConcernCreations from 'screens/new-concern-creations';
import ConcernInitialEvaluation from 'screens/concerns/concern-initial-evaluation';
import ConcernListScreen from 'screens/concerns/concern-list-screen';
import CreateConcern from 'screens/concerns/create-concern';
import FilteredConcernListScreen from 'screens/filtered-concern-list-screen';
import ProjectListScreen from 'screens/projects/project-list-screen';
import ViewConcern from 'screens/concerns/view-concern';
import EditConcern from 'screens/concerns/edit-concern';
import ViewLogs from 'screens/view-logs';
import EightDDynamicPage from 'screens/eightd-dynamic-page';

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
