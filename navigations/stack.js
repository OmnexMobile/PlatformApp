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

const Stack = createStackNavigator();

const getModuleDefault = module => module?.default || module;

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
        // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
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
        getComponent: () => require('../screens/problemSolver/containers/settings').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.PREFERRED_LANGUAGE,
        getComponent: () => require('../screens/problemSolver/containers/settings/preferred-language.js').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.THEME_PICKER,
        getComponent: () => require('../screens/problemSolver/containers/settings/theme-picker').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.HOME,
        getComponent: () => require('./bottom-tab').BottomTab,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_HOME,
        getComponent: () => require('../screens/home').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LIST_SCREEN,
        getComponent: () => require('../screens/problemSolver/containers/list-screen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONCERN_SCREEN,
        getComponent: () => require('../screens/problemSolver/containers/concerns/create-concern').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROBLEM_SOLVER,
        getComponent: () => require('../screens/problemSolver/containers/problem-solver').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TEAM_SELECTION,
        getComponent: () => require('../screens/problemSolver/containers/team-selection').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.INITIATE_PROBLEM_SOLVING,
        getComponent: () => require('../screens/problemSolver/containers/initiate-problem-solving').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NEW_CONCERN_CREATIONS,
        getComponent: () => require('../screens/problemSolver/containers/new-concern-creations').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONCERN_INITIAL_EVALUATION,
        getComponent: () => require('../screens/problemSolver/containers/concerns/concern-initial-evaluation').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_FAB_VIEW,
        getComponent: () => require('../screens/home/components/home-fab-view').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_DASHBOARD_LISTING,
        getComponent: () => require('../screens/auditPro/containers/AuditDashboardListing').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_PAGE,
        getComponent: () => require('../screens/auditPro/containers/AuditPage1').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_ATTACH,
        getComponent: () => require('../screens/auditPro/containers/AuditAttach').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_ATTACHSM,
        getComponent: () => require('../screens/supplierManagement/containers/CreateAttachSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_ATTACHSM,
        getComponent: () => require('../screens/supplierManagement/containers/AuditAttachSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_FORM,
        getComponent: () => require('../screens/auditPro/containers/AuditForm').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NC_OFI_PAGE,
        getComponent: () => require('../screens/auditPro/containers/NCOFIPage').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NC,
        getComponent: () => require('../screens/auditPro/containers/CreateNC').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONFORMACY,
        getComponent: () => require('../screens/auditPro/containers/Conformacy').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_SUMMARY,
        getComponent: () => require('../screens/auditPro/containers/AuditSummary').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_ATTACH,
        getComponent: () => require('../screens/auditPro/containers/CreateAttach').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_WEBVIEW,
        getComponent: () => require('../screens/auditPro/containers/AuditWebView').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_CARD,
        getComponent: () => require('../screens/auditPro/components/AuditCard').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CAMERA_CAPTURE,
        getComponent: () => require('../screens/auditPro/containers/CameraCaptureAndroid').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    // {
    //     name: ROUTES.VIDEO_CAPTURE,
    //     component: VideoCapture,
    //     cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    // },
    {
        name: ROUTES.USER_PREFERENCE,
        getComponent: () => require('../screens/auditPro/containers/UserPreference').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKLIST_MENU_SM,
        getComponent: () => require('../screens/auditPro/containers/CheckListMenuSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKLIST_MENU,
        getComponent: () => require('../screens/auditPro/containers/CheckListMenu').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKPOINT_DEMO,
        getComponent: () => require('../screens/auditPro/containers/CheckPointDemo').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_STATUS,
        getComponent: () => require('../screens/auditPro/containers/AuditStatus').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LPA_PUBLISH,
        getComponent: () => require('../screens/auditPro/containers/LPAPublish').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_RESULT,
        getComponent: () => require('../screens/auditPro/containers/AuditResult').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CONFORMACY_VOICE,
        getComponent: () => require('../screens/auditPro/containers/ConformacyVoice').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VOICE_ASSIST,
        getComponent: () => require('../screens/auditPro/components/VoiceAssist').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGINUISCREEN,
        getComponent: () => require('../screens/auditPro/containers/LoginUIScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTRATION,
        getComponent: () => require('../screens/auditPro/containers/Registration').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LANGUAGES,
        getComponent: () => require('../screens/auditPro/containers/Languages').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_LAUNCH,
        getComponent: () => require('../screens/auditPro/containers/LaunchScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.UNREGISTER,
        getComponent: () => require('../screens/auditPro/containers/UnRegister').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ALLTABAUDITLIST,
        getComponent: () => require('../screens/auditPro/containers/AllTabAuditList').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDITPRODASHBOARD,
        getComponent: () => require('../screens/auditPro/containers/AuditProDashboard').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_NOTIFICATIONS,
        getComponent: () => require('../screens/globalsettings/AuditNotifications').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VOICE_RECOGNITION,
        getComponent: () => require('../screens/auditPro/containers/VoiceRecognition').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTER_SCREEN,
        getComponent: () => require('../screens/auditPro/containers/FilterScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROFILE_SCREEN,
        getComponent: () => require('../screens/auditPro/containers/Profile').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DOWNLOADS,
        getComponent: () => require('../screens/auditPro/containers/Downloads').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SYNC_DETAILS,
        getComponent: () => require('../screens/auditPro/containers/SyncDetails').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HELP,
        getComponent: () => require('../screens/auditPro/containers/Help').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SUPPLY_MANAGE,
        getComponent: () => require('../screens/auditPro/containers/SupplyManage').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALENDER_LIST,
        getComponent: () => require('../screens/auditPro/containers/CalandarList').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NCLPA,
        getComponent: () => require('../screens/auditPro/containers/Createnclpa').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //// PROBLEMSOLVER ////

    {
        name: ROUTES.SPLASH_SCREEN_PS,
        getComponent: () => require('../screens/problemSolver/containers/splash-screen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGIN_PS,
        getComponent: () => require('../screens/problemSolver/containers/auth/login').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTER_PS,
        getComponent: () => require('../screens/problemSolver/containers/auth/register').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTERED_LIST_PS,
        getComponent: () => require('../screens/problemSolver/containers/filtered-concern-list-screen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LIST_SCREEN_PS,
        getComponent: () => require('../screens/problemSolver/containers/concerns/concern-list-screen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_LIST_PS,
        getComponent: () => require('../screens/globalDashboard/home-listcard').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_LIST_APQP,
        getComponent: () => require('../screens/globalDashboard/home-listcard-apqp').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VIEW_CONCERN_PS,
        getComponent: () => require('../screens/problemSolver/containers/concerns/view-concern').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HOME_PS,
        getComponent: () => require('./bottom-tab-ps').BottomTabPS,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.EDIT_CONCERN,
        getComponent: () => require('../screens/problemSolver/containers/concerns/edit-concern').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.VIEW_LOGS,
        getComponent: () => require('../screens/problemSolver/containers/view-logs').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.EIGHTD_DYNAMIC_PAGE,
        getComponent: () => require('../screens/problemSolver/containers/eightd-dynamic-page').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.TIME_SETTINGS,
        getComponent: () => require('../screens/problemSolver/containers/settings/time-settings').default,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
    {
        name: ROUTES.CALENDER,
        getComponent: () => require('../screens/problemSolver/containers/calender').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROJECT_LIST_PS,
        getComponent: () => require('../screens/problemSolver/containers/projects/project-list-screen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //// APQP ////

    {
        name: ROUTES.DASHBOARD_APQP,
        getComponent: () => require('../screens/apqp/containers/DashboardScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALANDAR_LIST_APQP,
        getComponent: () => require('../screens/apqp/containers/CalandarList').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROJECT_LIST_APQP,
        getComponent: () => require('../screens/apqp/containers/ProjectListScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.APQP_PPAP_MANAGER_SCREEN,
        getComponent: () => require('../screens/apqp/containers/ApqpPpapManagerScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.RISK_SCREEN,
        getComponent: () => require('../screens/apqp/containers/RiskScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.FILTER_SCREEN_APQP,
        getComponent: () => require('../screens/apqp/containers/FilterScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.MEETING_SCREEN,
        getComponent: () => require('../screens/apqp/containers/MeetingScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.OPEN_SCREEN,
        getComponent: () => require('../screens/apqp/containers/OpenScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.INPROGRESS_SCREEN,
        getComponent: () => require('../screens/apqp/containers/InProgressScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TODAYS_TASK,
        getComponent: () => require('../screens/apqp/containers/TodaysTask').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ACTION_TAB_INTERFACE,
        getComponent: () => require('../screens/apqp/containers/ActionTabInterface').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_UPDATE_SCREEN,
        getComponent: () => require('../screens/apqp/containers/PeriodicUpdateScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CALENDER_VIEW,
        getComponent: () => require('../screens/apqp/containers/DailyAction').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.RISK_ACTION_SCREEN,
        getComponent: () => require('../screens/apqp/containers/RiskActionScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.MEETING_PLAN_SCREEN,
        getComponent: () => require('../screens/apqp/containers/MeetingPlanScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.APQP_MANAGER_SCREEN,
        getComponent: () => require('../screens/apqp/containers/ApqpmanagerScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.TASK_LIST_SCREEN,
        getComponent: () => require('../screens/apqp/containers/TaskListScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_HISTORY_SCREEN,
        getComponent: () => require('../screens/apqp/containers/PeriodicHistoryScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PERIODIC_EDIT_SCREEN,
        getComponent: () => require('../screens/apqp/containers/PeriodicEditScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DELIVERABLE_INFO_SCREEN,
        getComponent: () => require('../screens/apqp/containers/DeliverableInfoScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REVISION_HISTORY_SCREEN,
        getComponent: () => require('../screens/apqp/containers/RevisionHistoryScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.OPEN_DOCUMENT_SCREEN,
        getComponent: () => require('../screens/apqp/containers/OpenDocumentScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ATTACH_ADDITIONAL_DOC_SCREEN,
        getComponent: () => require('../screens/apqp/containers/AttachAdditionalDocScreen').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.PROFILE_APQP,
        getComponent: () => require('../screens/apqp/containers/Profile').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.HELP_APQP,
        getComponent: () => require('../screens/apqp/containers/Help').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DAILY_ACTION,
        getComponent: () => require('../screens/apqp/containers/DailyAction').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.SUPPLY_MANAGE_SM,
        getComponent: () => require('../screens/supplierManagement/containers/supplyManage').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.REGISTRATION_SM,
        getComponent: () => require('../screens/supplierManagement/containers/registrationSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.LOGIN_SM,
        getComponent: () => require('../screens/supplierManagement/containers/loginUIScreenSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.ALLTABAUDITLIST_SM,
        getComponent: () => require('../screens/supplierManagement/containers/allTabAuditListSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_DASHBOARD_LISTING_SM,
        getComponent: () => require('../screens/supplierManagement/containers/auditDashboardListingSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    {
        name: ROUTES.AUDITPRODASHBOARD_SM,
        getComponent: () => require('../screens/supplierManagement/containers/auditProDashboardSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CHECKPOINT_DEMO_SM,
        getComponent: () => getModuleDefault(require('../screens/supplierManagement/containers/checkPointDemoSM')),
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_PAGE_SM,
        getComponent: () => require('../screens/supplierManagement/containers/auditPageSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.AUDIT_FORM_SM,
        getComponent: () => require('../screens/supplierManagement/containers/auditFormSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.CREATE_NC_SM,
        getComponent: () => require('../screens/supplierManagement/containers/createNC-SM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.NC_OFI_PAGE_SM,
        getComponent: () => require('../screens/supplierManagement/containers/NCOFIPageSM').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    //DOC-PRO
    {
        name: ROUTES.DOCPRO_DASHBOARD,
        getComponent: () => require('../screens/docpro/DocproDashboard').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },
    {
        name: ROUTES.DOCPRO_ACTION,
        getComponent: () => require('../screens/docpro/actions/DocproAction').default,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_ADMINACTION,
        getComponent: () => require('../screens/docpro/DocproAdminAction').default,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_DOCUMENTS,
        getComponent: () => require('../screens/docpro/DocproDocuments').default,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_NEWDOCUMENTREQUEST,
        getComponent: () => require('../screens/docpro/DocproNewDocumentRequest').default,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
    {
        name: ROUTES.DOCPRO_DOCUMENTFOLDER,
        getComponent: () => require('../screens/docpro/Levels/DocumentFolder').default,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    },

    // INSPECTION CONTROL
    {
        name: ROUTES.INSPECTION_SCHEDULE,
        getComponent: () => require('../screens/inspection-control/inspection-schedule').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.OPERATOR_WORKSHEET,
        getComponent: () => require('../screens/inspection-control/operator-worksheet').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.COMPLETED_INSPECTION,
        getComponent: () => require('../screens/inspection-control/completed-inspection').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.SUPERVISOR_SCHEDULE,
        getComponent: () => require('../screens/inspection-control/supervisor-schedule').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.INPROCESS_INSPECTION,
        getComponent: () => require('../screens/inspection-control/inprocess-inspection').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.CONTAINMENT_ACTIONS,
        getComponent: () => require('../screens/inspection-control/containmentActions').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    {
        name: ROUTES.INSPECTION_SETTINGS,
        getComponent: () => require('../screens/inspection-control/icSettings').default,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    },
    // {
    //     name: ROUTES.SEARCH_INSPECTION,
    //     getComponent: () => require('../screens/inspection-control/search-inspection').default,
    //     cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    // },
];

export const ProjectData = [
    {
        name: ROUTES.PROJECT_LIST_PS,
        getComponent: () => require('../screens/problemSolver/containers/projects/project-list-screen').default,
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
        {ProjectData.map(({ name, component, getComponent }, index) => (
            <Stack.Screen
                key={index}
                {...{
                    name,
                    ...(component ? { component } : {}),
                    ...(getComponent ? { getComponent } : {}),
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
            {AppStackData.map(({ name, component, getComponent, cardStyleInterpolator }, index) => {
            const isLogout = name === ROUTES.GLOBAL_LOGOUT;
            return (
                <Stack.Screen
                    key={index}
                    {...{
                        name,
                        ...(component ? { component } : {}),
                        ...(getComponent ? { getComponent } : {}),
                        // options: {
                        //     cardStyleInterpolator: cardStyleInterpolator || CardStyleInterpolators.forHorizontalIOS,
                        // },
                        options: isLogout
                            ? {
                                presentation: 'transparentModal',
                                animation: 'fade',
                                headerShown: false,
                                gestureEnabled: false,
                                cardStyle: { backgroundColor: 'transparent' },
                              }
                            : {
                                cardStyleInterpolator: cardStyleInterpolator || CardStyleInterpolators.forHorizontalIOS,
                            }
                    }}
                />)
            })}
        </Stack.Navigator>
    );
}
