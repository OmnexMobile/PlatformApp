import React from 'react';
// import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash-screen';
import { ROUTES } from '../constants/app-constant';
import useTheme from '../theme/useTheme';
import Register from '../screens/auth/register';
import Login from '../screens/auth/login';
import GlobalRegister from '../screens/globalAuth/register';
import GlobalLogin from '../screens/globalAuth/login';
import LaunchScreen from '../screens/launch-screen';
import Settings from '../screens/settings';
import PreferredLanguage from '../screens/settings/preferred-language.js';
import ThemePicker from '../screens/settings/theme-picker';
import ProblemSolver from '../screens/problem-solver';
import TeamSelection from '../screens/team-selection';
import InitiateProblemSolving from '../screens/initiate-problem-solving';
import { BottomTab } from './bottom-tab';
import NewConcernCreations from '../screens/new-concern-creations';
import ConcernInitialEvaluation from '../screens/concern-initial-evaluation';
import ListScreen from '../screens/list-screen';
import ConcernScreen from '../screens/concern-screen';
import HomeFabView from '../screens/home/components/home-fab-view'
// //// AUDITPRO ////
// import AuditDashboardListing from '../screens/auditPro/containers/AuditDashboardListing';
// import AuditPage from '../screens/auditPro/containers/AuditPage';
// import AuditAttach from '../screens/auditPro/containers/AuditAttach';
// import AuditForm from '../screens/auditPro/containers/AuditForm';
// import NCOFIPage from 'screens/auditPro/containers/NCOFIPage'
// import CreateNC from 'screens/auditPro/containers/CreateNC';
// import Conformacy from 'screens/auditPro/containers/Conformacy';
// import AuditSummary from 'screens/auditPro/containers/AuditSummary';
// import CreateAttach from 'screens/auditPro/containers/CreateAttach';
// import AuditWebView from 'screens/auditPro/containers/AuditWebView'
// import UserPreference from 'screens/auditPro/containers/UserPreference';
// import CameraCapture from 'screens/auditPro/containers/CameraCaptureAndroid';
// import AuditHome from 'screens/home';
// import AuditLaunchScreen from 'screens/auditPro/containers/LaunchScreen';
// import AuditCard from 'screens/auditPro/components/AuditCard'
// // import CameraCapture from 'screens/auditPro/containers/CameraCaptureIos';
// // import VideoCapture from 'screens/auditPro/containers/VideoCapture';
// import CheckListMenu from 'screens/auditPro/containers/CheckListMenu';
// import CheckPointDemo from 'screens/auditPro/containers/CheckPointDemo'
// import AuditStatus from 'screens/auditPro/containers/AuditStatus';
// import LPAPublish from 'screens/auditPro/containers/LPAPublish'
// import AuditResult from 'screens/auditPro/containers/AuditResult'
// import ConformacyVoice from 'screens/auditPro/containers/ConformacyVoice';
// import VoiceAssist from 'screens/auditPro/components/VoiceAssist';
// import LoginUIScreen from 'screens/auditPro/containers/LoginUIScreen';
// import Registration from 'screens/auditPro/containers/Registration';
// import Languages from 'screens/auditPro/containers/Languages';
// import UnRegistration from 'screens/auditPro/containers/UnRegister';
// import AllTabAuditList from 'screens/auditPro/containers/AllTabAuditList';
// import AuditProDashboard from 'screens/auditPro/containers/AuditProDashboard';
// import AuditNotifications from 'screens/auditPro/containers/AuditNotifications';
// import VoiceRecognition from 'screens/auditPro/containers/VoiceRecognition';
// import FilterScreen from 'screens/auditPro/containers/FilterScreen';
// import Profile from 'screens/auditPro/containers/Profile';
// import Downloads from 'screens/auditPro/containers/Downloads';
// import SyncDetails from 'screens/auditPro/containers/SyncDetails';
// import Help from 'screens/auditPro/containers/Help';
// import SupplyManage from 'screens/auditPro/containers/SupplyManage';
// import CalendarList from 'screens/auditPro/containers/CalandarList';
//// PROBLEMSOLVER ////
import LoginPrblmSolver from 'screens/problemSolver/containers/auth/login';
import RegisterPrblmSolver from 'screens/problemSolver/containers/auth/register';
import FilteredConcernListScreen from 'screens/problemSolver/containers/filtered-concern-list-screen';
import ConcernInitialEvaluationPs from 'screens/problemSolver/containers/concerns/concern-initial-evaluation';
import ConcernListScreen from 'screens/problemSolver/containers/concerns/concern-list-screen';
import CreateConcern from 'screens/problemSolver/containers/concerns/create-concern';
import ViewConcern from 'screens/problemSolver/containers/concerns/view-concern';
import { BottomTabPS } from './bottom-tab-ps';
import SplashScreenPS from '../screens/problemSolver/containers/splash-screen';
import ProjectListScreen from 'screens/problemSolver/containers/projects/project-list-screen'

//docpro
// import DocproDashboard from 'screens/docpro/DocproDashboard';
// // import DocproAction from 'screens/docpro/actions/DocproAction';
// import DocproAction from 'screens/docpro/actions/DocproAction'
// import DocproAdminAction from 'screens/docpro/DocproAdminAction';
// import DocproDocuments from 'screens/docpro/DocproDocuments';
// import DocproNewDocumentRequest from 'screens/docpro/DocproNewDocumentRequest';
// import DocumentFolder from 'screens/docpro/Levels/DocumentFolder';
// IC
import InspectionSchedule from 'screens/inspection-control/inspection-schedule';
import OperatorWorksheet from 'screens/inspection-control/operator-worksheet';
import CompletedInspection from 'screens/inspection-control/completed-inspection';
import SupervisorSchedule from 'screens/inspection-control/supervisor-schedule';
import InprocessInspection from 'screens/inspection-control/inprocess-inspection';
import ContainmentActions from 'screens/inspection-control/containmentActions';
import IcSettings from 'screens/inspection-control/icSettings';
// import SearchInspection from 'screens/inspection-control/search-inspection';
const Stack = createNativeStackNavigator();

export const AppStackData = [
    {
        name: ROUTES.SPLASH_SCREEN,
        component: SplashScreen,
        // options: {
        //     animation: 'slide_from_bottom',
        // },
    },
    {
        name: ROUTES.LOGIN,
        component: Login,
        
    },
    {
        name: ROUTES.REGISTER,
        component: Register,
        
    },
    // Global Auth
    {
        name: ROUTES.GLOBAL_LOGIN,
        component: GlobalLogin,
        
    },
    {
        name: ROUTES.GLOBAL_REGISTER,
        component: GlobalRegister,
        
    },
    {
        name: ROUTES.LAUNCH_SCREEN,
        component: LaunchScreen,
        
    },
    {
        name: ROUTES.SETTINGS,
        component: Settings,
        
    },
    {
        name: ROUTES.PREFERRED_LANGUAGE,
        component: PreferredLanguage,
        
    },
    {
        name: ROUTES.THEME_PICKER,
        component: ThemePicker,
        
    },
    {
        name: ROUTES.HOME,
        component: BottomTab,
        
    },
    {
        name: ROUTES.LIST_SCREEN,
        component: ListScreen,
        
    },
    {
        name: ROUTES.CONCERN_SCREEN,
        component: ConcernScreen,
        
    },
    {
        name: ROUTES.PROBLEM_SOLVER,
        component: ProblemSolver,
        
    },
    {
        name: ROUTES.TEAM_SELECTION,
        component: TeamSelection,
        
    },
    {
        name: ROUTES.INITIATE_PROBLEM_SOLVING,
        component: InitiateProblemSolving,
        
    },
    {
        name: ROUTES.NEW_CONCERN_CREATIONS,
        component: NewConcernCreations,
        
    },
    {
        name: ROUTES.CONCERN_INITIAL_EVALUATION,
        component: ConcernInitialEvaluation,
        
    },
    {
        name: ROUTES.HOME_FAB_VIEW,
        component: HomeFabView,
        
    },
    // audit pro
    // {
    //     name: ROUTES.AUDIT_DASHBOARD_LISTING,
    //     component: AuditDashboardListing,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_PAGE,
    //     component: AuditPage,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_ATTACH,
    //     component: AuditAttach,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_FORM,
    //     component: AuditForm,
    //     
    // },
    // {
    //     name: ROUTES.NC_OFI_PAGE,
    //     component: NCOFIPage,
    //     
    // },
    // {
    //     name: ROUTES.CREATE_NC,
    //     component: CreateNC,
    //     
    // },
    // {
    //     name: ROUTES.CONFORMACY,
    //     component: Conformacy,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_SUMMARY,
    //     component: AuditSummary,
    //     
    // },
    // {
    //     name: ROUTES.CREATE_ATTACH,
    //     component: CreateAttach,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_WEBVIEW,
    //     component: AuditWebView,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_CARD,
    //     component: AuditCard,
    //     
    // },
    // {
    //     name: ROUTES.CAMERA_CAPTURE,
    //     component: CameraCapture,
    //     
    // },
    // // {
    // //     name: ROUTES.VIDEO_CAPTURE,
    // //     component: VideoCapture,
    // //     
    // // },
    // {
    //     name: ROUTES.USER_PREFERENCE,
    //     component: UserPreference,
    //     
    // },
    // {
    //     name: ROUTES.CHECKLIST_MENU,
    //     component: CheckListMenu,
    //     
    // },
    // {
    //     name: ROUTES.CHECKPOINT_DEMO,
    //     component: CheckPointDemo,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_STATUS,
    //     component: AuditStatus,
    //     
    // },
    // {
    //     name: ROUTES.LPA_PUBLISH,
    //     component: LPAPublish,
    //     
    // },
    // {
    //     name: ROUTES.AUDIT_RESULT,
    //     component: AuditResult,
    //     
    // },
    // {
    //     name: ROUTES.CONFORMACY_VOICE,
    //     component: ConformacyVoice,
    //     
    // },
    //  {
    //     name: ROUTES.VOICE_ASSIST,
    //     component: VoiceAssist,
    //     
    //  },
    //  {
    //     name: ROUTES.LOGINUISCREEN,
    //     component: LoginUIScreen,
    //     
    //  },
    //  {
    //     name: ROUTES.REGISTRATION,
    //     component: Registration,
    //     
    //  },
    //  {
    //     name: ROUTES.LANGUAGES,
    //     component: Languages,
    //     
    //  },
    //  {
    //     name: ROUTES.AUDIT_LAUNCH,
    //     component: AuditLaunchScreen,
    //     
    //  },
    //  {
    //     name: ROUTES.UNREGISTER,
    //     component: UnRegistration,
    //     
    //  },
    //  {
    //     name: ROUTES.ALLTABAUDITLIST,
    //     component: AllTabAuditList,
    //     
    //  },
    //  {
    //     name: ROUTES.AUDITPRODASHBOARD,
    //     component: AuditProDashboard,
    //     
    //  },
    //  {
    //     name: ROUTES.AUDIT_NOTIFICATIONS,
    //     component: AuditNotifications,
    //     
    //  },
    //  {
    //     name: ROUTES.VOICE_RECOGNITION,
    //     component: VoiceRecognition,
    //     
    //  },
    //  {
    //     name: ROUTES.FILTER_SCREEN,
    //     component: FilterScreen,
    //     
    //  },
    //  {
    //     name: ROUTES.PROFILE_SCREEN,
    //     component: Profile,
    //     
    //  },
    //  {
    //     name: ROUTES.DOWNLOADS,
    //     component: Downloads,
    //     
    //  },
    //  {
    //     name: ROUTES.SYNC_DETAILS,
    //     component: SyncDetails,
    //     
    //  },
    //  {
    //     name: ROUTES.HELP,
    //     component: Help,
    //     
    //  },
    //  {
    //     name: ROUTES.SUPPLY_MANAGE,
    //     component: SupplyManage,
    //     
    //  },
    //  {
    //     name: ROUTES.CALENDER_LIST,
    //     component: CalendarList,
    //     
    //  },
     


     //// PROBLEMSOLVER ////

     {
        name: ROUTES.SPLASH_SCREEN_PS,
        component: SplashScreenPS,
        
     },
     {
        name: ROUTES.LOGIN_PS,
        component: LoginPrblmSolver,
        
     },
     {
        name: ROUTES.REGISTER_PS,
        component: RegisterPrblmSolver,
        
     },
     {
        name: ROUTES.FILTERED_LIST_PS,
        component: FilteredConcernListScreen,
        
     },
     {
        name: ROUTES.CONCERN_INITIAL_EVALUATION_PS,
        component: ConcernInitialEvaluationPs,
        
     },
     {
        name: ROUTES.LIST_SCREEN_PS,
        component: ConcernListScreen,
        
     },
     {
         name: ROUTES.CREATE_CONCERN,
         component: CreateConcern,
         
     },
     {
         name: ROUTES.VIEW_CONCERN_PS,
         component: ViewConcern,
         
     },
     {
         name: ROUTES.HOME_PS,
         component: BottomTabPS,
         
     },

     //docpro:
    //  {
    //     name: ROUTES.DOCPRO_DASHBOARD,
    //     component: DocproDashboard,
    //     
    // },
    // {
    //     name: ROUTES.DOCPRO_ACTION,
    //     component: DocproAction,
    //     cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    // },
    // {
    //     name: ROUTES.DOCPRO_ADMINACTION,
    //     component: DocproAdminAction,
    //     cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    // },
    // {
    //     name: ROUTES.DOCPRO_DOCUMENTS,
    //     component: DocproDocuments,
    //     cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    // },
    // {
    //     name: ROUTES.DOCPRO_NEWDOCUMENTREQUEST,
    //     component: DocproNewDocumentRequest,
    //     cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    // },
    // {
    //     name: ROUTES.DOCPRO_DOCUMENTFOLDER,
    //     component: DocumentFolder,
    //     
    // },

    // INSPECTION CONTROL
    {
        name: ROUTES.INSPECTION_SETTINGS,
        component: IcSettings,
        
    },
    {
        name: ROUTES.INSPECTION_SCHEDULE,
        component: InspectionSchedule,
        
    },
    {
        name: ROUTES.OPERATOR_WORKSHEET,
        component: OperatorWorksheet,
        
    },
    {
        name: ROUTES.COMPLETED_INSPECTION,
        component: CompletedInspection,
        
    },
    {
        name: ROUTES.SUPERVISOR_SCHEDULE,
        component: SupervisorSchedule,
        
    },
    {
        name: ROUTES.INPROCESS_INSPECTION,
        component: InprocessInspection,
        
    },
    {
        name: ROUTES.CONTAINMENT_ACTIONS,
        component: ContainmentActions,
        
    },
    // {
    //     name: ROUTES.SEARCH_INSPECTION,
    //     component: SearchInspection,
        
    // }
    // ...HomeStackData,
];
// export const ProfileData = [
//     {
//         name: ROUTES.PROFILE,
//         component: ProfileHome,
//         
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
//                         
//                     },
//                 }}
//             />
//         ))}
//     </Stack.Navigator>
// );


export const ProjectData = [
    {
        name: ROUTES.PROJECT_LIST_PS,
        component: ProjectListScreen,
        
    },
];

export const ProjectStack = () => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            headerShown: false,
        }}
        initialRouteName={ROUTES.PROJECT_LIST_PS}>
        {ProjectData.map(({ name, component }, index) => (
            <Stack.Screen
                key={index}
                {...{
                    name,
                    component,
                    options: {
                        
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
                    }}
                />
            ))}
        </Stack.Navigator>
    );
}
