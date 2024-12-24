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

// const HomeStackData = [
//     {
//         name: ROUTES.HOME,
//         component: Home,
//     },
//     {
//         name: ROUTES.TICKET_DETAIL,
//         component: TicketDetail,
//     },
//     {
//         name: ROUTES.CHANGE_STATUS,
//         component: ChangeStatus,
//     },
//     {
//         name: ROUTES.SCAN_SERIAL,
//         component: ScanSerial,
//     },
//     {
//         name: ROUTES.SET_SERIAL_NO,
//         component: SetSerialNumber,
//     },
//     {
//         name: ROUTES.SCANNER,
//         component: QrCodeCamera,
//     },
//     {
//         name: ROUTES.UPLOAD_IMAGES,
//         component: UploadImages,
//     },
//     {
//         name: ROUTES.SALES,
//         component: Sales,
//     },
//     {
//         name: ROUTES.AMOUNT_SUMMARY,
//         component: AmountSummary,
//     },
//     {
//         name: ROUTES.PAYMENT,
//         component: Payment,
//     },
// ];

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
    {
        name: ROUTES.LIST_SCREEN,
        component: ConcernListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTERED_LIST_SCREEN,
        component: FilteredConcernListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.CONCERN_SCREEN,
        component: CreateConcern,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROBLEM_SOLVER,
        component: ProblemSolver,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TEAM_SELECTION,
        component: TeamSelection,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.INITIATE_PROBLEM_SOLVING,
        component: InitiateProblemSolving,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NEW_CONCERN_CREATIONS,
        component: NewConcernCreations,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONCERN_INITIAL_EVALUATION,
        component: ConcernInitialEvaluation,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VIEW_CONCERN,
        component: ViewConcern,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.EDIT_CONCERN,
        component: EditConcern,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.EIGHTD_DYNAMIC_PAGE,
        component: EightDDynamicPage,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.VIEW_LOGS,
        component: ViewLogs,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },

    // ...HomeStackData,
];

// export const ProfileData = [
//     {
//         name: ROUTES.PROFILE,
//         component: ProfileHome,
//         cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
//     },
//     {
//         name: ROUTES.EDIT_PROFILE,
//         component: EditProfile,
//     },
// ];

// export const ProfileStack = () => (
//     <Stack.Navigator
//         screenOptions={{
//             cardStyle: { backgroundColor: 'transparent' },
//             cardOverlayEnabled: true,
//             headerShown: false,
//         }}
//         initialRouteName={ROUTES.PROFILE}>
//         {ProfileData.map(({ name, component }, index) => (
//             <Stack.Screen
//                 key={index}
//                 {...{
//                     name,
//                     component,
//                     options: {
//                         cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
//                     },
//                 }}
//             />
//         ))}
//     </Stack.Navigator>
// );

export const ProjectData = [
    {
        name: ROUTES.PROJECT_LIST,
        component: ProjectListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
];

export const ProjectStack = () => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            headerShown: false,
        }}
        initialRouteName={ROUTES.PROJECT_LIST}>
        {ProjectData.map(({ name, component }, index) => (
            <Stack.Screen
                key={index}
                {...{
                    name,
                    component,
                    options: {
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    },
                }}
            />
        ))}
    </Stack.Navigator>
);

export function AppStack() {
    const { theme } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: { backgroundColor: theme.mode.backgroundColor },
                // cardStyle: { backgroundColor: 'transparent' },
                // cardOverlayEnabled: true,
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
