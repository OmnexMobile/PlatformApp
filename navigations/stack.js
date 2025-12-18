import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import SplashScreen from '../screens/splash-screen';
import { ROUTES } from '../constants/app-constant';
import useTheme from '../theme/useTheme';
import Register from '../screens/auth/register';
import Login from '../screens/auth/login';
import GlobalRegister from '../screens/globalAuth/register';
import GlobalLogin from '../screens/globalAuth/login';
import GlobalDashBoard from '../screens/globalDashboard/home-dashboard';
import GlobalLogout from '../screens/globalAuth/logout';
import GlobalSettings from '../screens/globalsettings/index';
import GlobalSites from '../screens/globalsettings/globalSites';
import LaunchScreen from '../screens/launch-screen';
import { BottomTab } from './bottom-tab';
import HomeFabView from '../screens/home/components/home-fab-view';
//// AUDITPRO ////
import AuditDashboardListing from '../screens/auditPro/containers/AuditDashboardListing';
import AuditPage from '../screens/auditPro/containers/AuditPage1';
import AuditAttach from '../screens/auditPro/containers/AuditAttach';
import AuditForm from '../screens/auditPro/containers/AuditForm';
import NCOFIPage from 'screens/auditPro/containers/NCOFIPage';
import CreateNC from 'screens/auditPro/containers/CreateNC';
import Conformacy from 'screens/auditPro/containers/Conformacy';
import AuditSummary from 'screens/auditPro/containers/AuditSummary';
import CreateAttach from 'screens/auditPro/containers/CreateAttach';
import AuditWebView from 'screens/auditPro/containers/AuditWebView';
import UserPreference from 'screens/auditPro/containers/UserPreference';
import CameraCapture from 'screens/auditPro/containers/CameraCaptureAndroid';
import AuditHome from 'screens/home';
import AuditLaunchScreen from 'screens/auditPro/containers/LaunchScreen';
import AuditCard from 'screens/auditPro/components/AuditCard';
// import CameraCapture from 'screens/auditPro/containers/CameraCaptureIos';
// import VideoCapture from 'screens/auditPro/containers/VideoCapture';
import CheckListMenuSM from 'screens/auditPro/containers/CheckListMenuSM';
import CheckListMenu from 'screens/auditPro/containers/CheckListMenu';
import CheckPointDemo from 'screens/auditPro/containers/CheckPointDemo';
import AuditStatus from 'screens/auditPro/containers/AuditStatus';
import LPAPublish from 'screens/auditPro/containers/LPAPublish';
import AuditResult from 'screens/auditPro/containers/AuditResult';
import ConformacyVoice from 'screens/auditPro/containers/ConformacyVoice';
import VoiceAssist from 'screens/auditPro/components/VoiceAssist';
import LoginUIScreen from 'screens/auditPro/containers/LoginUIScreen';
import Registration from 'screens/auditPro/containers/Registration';
import Languages from 'screens/auditPro/containers/Languages';
import UnRegistration from 'screens/auditPro/containers/UnRegister';
import AllTabAuditList from 'screens/auditPro/containers/AllTabAuditList';
import AuditProDashboard from 'screens/auditPro/containers/AuditProDashboard';
import AuditNotifications from 'screens/auditPro/containers/AuditNotifications';
import VoiceRecognition from 'screens/auditPro/containers/VoiceRecognition';
import FilterScreen from 'screens/auditPro/containers/FilterScreen';
import Profile from 'screens/auditPro/containers/Profile';
import Downloads from 'screens/auditPro/containers/Downloads';
import SyncDetails from 'screens/auditPro/containers/SyncDetails';
import Help from 'screens/auditPro/containers/Help';
import SupplyManage from 'screens/auditPro/containers/SupplyManage';
import CalendarList from 'screens/auditPro/containers/CalandarList';
import Createnclpa from 'screens/auditPro/containers/Createnclpa';
//// PROBLEMSOLVER ////
import LoginPrblmSolver from 'screens/problemSolver/containers/auth/login';
import RegisterPrblmSolver from 'screens/problemSolver/containers/auth/register';
import Settings from '../screens/problemSolver/containers/settings';
import PreferredLanguage from '../screens/problemSolver/containers/settings/preferred-language.js';
import ThemePicker from '../screens/problemSolver/containers/settings/theme-picker';
import ProblemSolver from '../screens/problemSolver/containers/problem-solver';
import TeamSelection from '../screens/problemSolver/containers/team-selection';
import InitiateProblemSolving from '../screens/problemSolver/containers/initiate-problem-solving';
import NewConcernCreations from '../screens/problemSolver/containers/new-concern-creations';
import ConcernInitialEvaluation from '../screens/problemSolver/containers/concerns/concern-initial-evaluation';
import ListScreen from '../screens/problemSolver/containers/list-screen';
import ConcernScreen from '../screens/problemSolver/containers/concerns/create-concern';
import FilteredConcernListScreen from 'screens/problemSolver/containers/filtered-concern-list-screen';
import ConcernListScreen from 'screens/problemSolver/containers/concerns/concern-list-screen';
import ViewConcern from 'screens/problemSolver/containers/concerns/view-concern';
import HomeListCard from '../screens/globalDashboard/home-listcard';
import HomeListCardAPQP from '../screens/globalDashboard/home-listcard-apqp';
import { BottomTabPS } from './bottom-tab-ps';
import SplashScreenPS from '../screens/problemSolver/containers/splash-screen';
import ProjectListScreen from 'screens/problemSolver/containers/projects/project-list-screen';
import EditConcern from 'screens/problemSolver/containers/concerns/edit-concern';
import ViewLogs from 'screens/problemSolver/containers/view-logs';
import EightDDynamicPage from 'screens/problemSolver/containers/eightd-dynamic-page';
import TimeSettings from 'screens/problemSolver/containers/settings/time-settings';
//// APQP ////
import DashBoardAPQP from '../screens/apqp/containers/DashboardScreen';
import CalandarListAPQP from '../screens/apqp/containers/CalandarList';
import ProjectListAPQP from '../screens/apqp/containers/ProjectListScreen';
import ApqpPpapManagerScreen from '../screens/apqp/containers/ApqpPpapManagerScreen';
import RiskScreen from '../screens/apqp/containers/RiskScreen';
import FilterScreenAPQP from 'screens/apqp/containers/FilterScreen';
import MeetingScreen from 'screens/apqp/containers/MeetingScreen';
import OpenScreen from 'screens/apqp/containers/OpenScreen';
import InProgressScreen from 'screens/apqp/containers/InProgressScreen';
import TodaysTask from 'screens/apqp/containers/TodaysTask';
import ActionTabInterface from 'screens/apqp/containers/ActionTabInterface';
import PeriodicUpdateScreen from 'screens/apqp/containers/PeriodicUpdateScreen';
import Calenderview from 'screens/apqp/containers/DailyAction';
import RiskActionScreen from 'screens/apqp/containers/RiskActionScreen';
import MeetingPlanScreen from 'screens/apqp/containers/MeetingPlanScreen';
import ApqpmanagerScreen from 'screens/apqp/containers/ApqpmanagerScreen';
import TaskListScreen from 'screens/apqp/containers/TaskListScreen';
import PeriodicHistoryScreen from 'screens/apqp/containers/PeriodicHistoryScreen';
import PeriodicEditScreen from 'screens/apqp/containers/PeriodicEditScreen';
import DeliverableInfoScreen from 'screens/apqp/containers/DeliverableInfoScreen';
import RevisionHistoryScreen from 'screens/apqp/containers/RevisionHistoryScreen';
import OpenDocumentScreen from 'screens/apqp/containers/OpenDocumentScreen';
import AttachAdditionalDocScreen from 'screens/apqp/containers/AttachAdditionalDocScreen';
import ProfileAPQP from 'screens/apqp/containers/Profile';
import HelpAPQP from 'screens/apqp/containers/Help';
import DailyAction from 'screens/apqp/containers/DailyAction';
//// SUPPLIERMANAGEMENT ////
import SupplyManageSM from 'screens/supplierManagement/containers/supplyManage';
import RegisterSM from 'screens/supplierManagement/containers/registrationSM';
import LoginSM from 'screens/supplierManagement/containers/loginUIScreenSM';
import AllTabAuditListSM from 'screens/supplierManagement/containers/allTabAuditListSM';
import AuditDashboardListingSM from 'screens/supplierManagement/containers/auditDashboardListingSM';
import AuditDashboardSM from 'screens/supplierManagement/containers/auditProDashboardSM';
import CheckPointDemoSM from 'screens/supplierManagement/containers/checkPointDemoSM';
import AuditPageSM from 'screens/supplierManagement/containers/auditPageSM';
import AuditFormSM from '../screens/supplierManagement/containers/auditFormSM';
import CreateNCSM from 'screens/supplierManagement/containers/createNC-SM';
import NCOFIPageSM from 'screens/supplierManagement/containers/NCOFIPageSM';
//DOC-PRO
import DocproDashboard from 'screens/docpro/DocproDashboard';
// import DocproAction from 'screens/docpro/actions/DocproAction';
import DocproAction from 'screens/docpro/actions/DocproAction';
import DocproAdminAction from 'screens/docpro/DocproAdminAction';
import DocproDocuments from 'screens/docpro/DocproDocuments';
import DocproNewDocumentRequest from 'screens/docpro/DocproNewDocumentRequest';
import DocumentFolder from 'screens/docpro/Levels/DocumentFolder';
//INNSPECTION-CONTROL
import InspectionSchedule from 'screens/inspection-control/inspection-schedule';
import OperatorWorksheet from 'screens/inspection-control/operator-worksheet';
import CompletedInspection from 'screens/inspection-control/completed-inspection';
import SupervisorSchedule from 'screens/inspection-control/supervisor-schedule';
import InprocessInspection from 'screens/inspection-control/inprocess-inspection';
import ContainmentActions from 'screens/inspection-control/containmentActions';
import IcSettings from 'screens/inspection-control/icSettings';
import SearchInspection from 'screens/inspection-control/search-inspection';
import HomeListCardApqp from '../screens/globalDashboard/home-listcard-apqp';
import Calender from 'screens/problemSolver/containers/calender';

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
    // Global Auth
    {
        name: ROUTES.GLOBAL_LOGIN,
        component: GlobalLogin,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.GLOBAL_REGISTER,
        component: GlobalRegister,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.GLOBAL_DASHBOARD,
        component: GlobalDashBoard,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.GLOBAL_LOGOUT,
        component: GlobalLogout,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.GLOBAL_SETTINGS,
        component: GlobalSettings,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.GLOBAL_SITES,
        component: GlobalSites,
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
        name: ROUTES.AUDIT_HOME,
        component: AuditHome,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LIST_SCREEN,
        component: ListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONCERN_SCREEN,
        component: ConcernScreen,
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
        name: ROUTES.HOME_FAB_VIEW,
        component: HomeFabView,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_DASHBOARD_LISTING,
        component: AuditDashboardListing,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_PAGE,
        component: AuditPage,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_ATTACH,
        component: AuditAttach,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_FORM,
        component: AuditForm,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NC_OFI_PAGE,
        component: NCOFIPage,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NC,
        component: CreateNC,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONFORMACY,
        component: Conformacy,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_SUMMARY,
        component: AuditSummary,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_ATTACH,
        component: CreateAttach,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_WEBVIEW,
        component: AuditWebView,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_CARD,
        component: AuditCard,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CAMERA_CAPTURE,
        component: CameraCapture,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    // {
    //     name: ROUTES.VIDEO_CAPTURE,
    //     component: VideoCapture,
    //     cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    // },
    {
        name: ROUTES.USER_PREFERENCE,
        component: UserPreference,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKLIST_MENU_SM,
        component: CheckListMenuSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKLIST_MENU,
        component: CheckListMenu,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKPOINT_DEMO,
        component: CheckPointDemo,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_STATUS,
        component: AuditStatus,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LPA_PUBLISH,
        component: LPAPublish,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_RESULT,
        component: AuditResult,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONFORMACY_VOICE,
        component: ConformacyVoice,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VOICE_ASSIST,
        component: VoiceAssist,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGINUISCREEN,
        component: LoginUIScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTRATION,
        component: Registration,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LANGUAGES,
        component: Languages,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_LAUNCH,
        component: AuditLaunchScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.UNREGISTER,
        component: UnRegistration,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ALLTABAUDITLIST,
        component: AllTabAuditList,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDITPRODASHBOARD,
        component: AuditProDashboard,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_NOTIFICATIONS,
        component: AuditNotifications,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VOICE_RECOGNITION,
        component: VoiceRecognition,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTER_SCREEN,
        component: FilterScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROFILE_SCREEN,
        component: Profile,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DOWNLOADS,
        component: Downloads,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SYNC_DETAILS,
        component: SyncDetails,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HELP,
        component: Help,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SUPPLY_MANAGE,
        component: SupplyManage,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALENDER_LIST,
        component: CalendarList,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NCLPA,
        component: Createnclpa,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //// PROBLEMSOLVER ////

    {
        name: ROUTES.SPLASH_SCREEN_PS,
        component: SplashScreenPS,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGIN_PS,
        component: LoginPrblmSolver,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTER_PS,
        component: RegisterPrblmSolver,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTERED_LIST_PS,
        component: FilteredConcernListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LIST_SCREEN_PS,
        component: ConcernListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_LIST_PS,
        component: HomeListCard,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_LIST_APQP,
        component: HomeListCardApqp,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VIEW_CONCERN_PS,
        component: ViewConcern,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_PS,
        component: BottomTabPS,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.EDIT_CONCERN,
        component: EditConcern,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VIEW_LOGS,
        component: ViewLogs,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.EIGHTD_DYNAMIC_PAGE,
        component: EightDDynamicPage,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.TIME_SETTINGS,
        component: TimeSettings,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.CALENDER,
        component: Calender,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROJECT_LIST_PS,
        component: ProjectListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //// APQP ////

    {
        name: ROUTES.DASHBOARD_APQP,
        component: DashBoardAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALANDAR_LIST_APQP,
        component: CalandarListAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROJECT_LIST_APQP,
        component: ProjectListAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.APQP_PPAP_MANAGER_SCREEN,
        component: ApqpPpapManagerScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.RISK_SCREEN,
        component: RiskScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTER_SCREEN_APQP,
        component: FilterScreenAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.MEETING_SCREEN,
        component: MeetingScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.OPEN_SCREEN,
        component: OpenScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.INPROGRESS_SCREEN,
        component: InProgressScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TODAYS_TASK,
        component: TodaysTask,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ACTION_TAB_INTERFACE,
        component: ActionTabInterface,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_UPDATE_SCREEN,
        component: PeriodicUpdateScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALENDER_VIEW,
        component: Calenderview,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.RISK_ACTION_SCREEN,
        component: RiskActionScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.MEETING_PLAN_SCREEN,
        component: MeetingPlanScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.APQP_MANAGER_SCREEN,
        component: ApqpmanagerScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TASK_LIST_SCREEN,
        component: TaskListScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_HISTORY_SCREEN,
        component: PeriodicHistoryScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_EDIT_SCREEN,
        component: PeriodicEditScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DELIVERABLE_INFO_SCREEN,
        component: DeliverableInfoScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REVISION_HISTORY_SCREEN,
        component: RevisionHistoryScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.OPEN_DOCUMENT_SCREEN,
        component: OpenDocumentScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ATTACH_ADDITIONAL_DOC_SCREEN,
        component: AttachAdditionalDocScreen,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROFILE_APQP,
        component: ProfileAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HELP_APQP,
        component: HelpAPQP,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DAILY_ACTION,
        component: DailyAction,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SUPPLY_MANAGE_SM,
        component: SupplyManageSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTRATION_SM,
        component: RegisterSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGIN_SM,
        component: LoginSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ALLTABAUDITLIST_SM,
        component: AllTabAuditListSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_DASHBOARD_LISTING_SM,
        component: AuditDashboardListingSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    {
        name: ROUTES.AUDITPRODASHBOARD_SM,
        component: AuditDashboardSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKPOINT_DEMO_SM,
        component: CheckPointDemoSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_PAGE_SM,
        component: AuditPageSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_FORM_SM,
        component: AuditFormSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NC_SM,
        component: CreateNCSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NC_OFI_PAGE_SM,
        component: NCOFIPageSM,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //DOC-PRO
    {
        name: ROUTES.DOCPRO_DASHBOARD,
        component: DocproDashboard,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DOCPRO_ACTION,
        component: DocproAction,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_ADMINACTION,
        component: DocproAdminAction,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_DOCUMENTS,
        component: DocproDocuments,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_NEWDOCUMENTREQUEST,
        component: DocproNewDocumentRequest,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_DOCUMENTFOLDER,
        component: DocumentFolder,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    // INSPECTION CONTROL
    {
        name: ROUTES.INSPECTION_SCHEDULE,
        component: InspectionSchedule,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.OPERATOR_WORKSHEET,
        component: OperatorWorksheet,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.COMPLETED_INSPECTION,
        component: CompletedInspection,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.SUPERVISOR_SCHEDULE,
        component: SupervisorSchedule,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.INPROCESS_INSPECTION,
        component: InprocessInspection,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.CONTAINMENT_ACTIONS,
        component: ContainmentActions,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.INSPECTION_SETTINGS,
        component: IcSettings,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.SEARCH_INSPECTION,
        component: SearchInspection,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
];

export const ProjectData = [
    {
        name: ROUTES.PROJECT_LIST_PS,
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
        initialRouteName={ROUTES.PROJECT_LIST_PS}>
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
