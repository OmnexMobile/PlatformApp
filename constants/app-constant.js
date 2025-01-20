import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import { Easing } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { IMAGES } from '../assets/images';

export const API_URL = 'http://1.22.172.236/ProblemSolverAPI/';

export const INPUTS_CONSTANTS = {
    DROPDOWN: 'DROPDOWN',
    INPUT: 'INPUT',
    RICH_EDITOR: 'RICH_EDITOR',
    DATE_PICKER: 'DATE_PICKER',
    TEAM_PICKER: 'TEAM_PICKER',
    RADIO_BUTTON: 'RADIOBUTTON',
    CHECK_BOX: 'CHECK_BOX',
    IMAGE_PICKER: 'IMAGE_PICKER',
    FILE_PICKER: 'FILE_PICKER',
    TREE_VIEW_PICKER: 'TREE_VIEW_PICKER',
};

export const MOTI_TRANSITION = {
    type: 'timing',
    duration: 200,
    easing: Easing.inOut(Easing.ease),
};

export const FONT_TYPE = {
    REGULAR: 'REGULAR',
    LIGHT: 'LIGHT',
    BOLD: 'BOLD',
    SEMIBOLD: 'SEMIBOLD',
};

export const Stays = {
    UPCOMING: 'UPCOMING',
    PAST: 'PAST',
    CANCELLED: 'CANCELLED',
};

export const ICON_TYPE = {
    FontAwesome: FontAwesome,
    Ionicons: Ionicons,
    AntDesign: AntDesign,
    Feather: Feather,
    MaterialCommunityIcons: MaterialCommunityIcons,
    Entypo: Entypo,
    EvilIcons: EvilIcons,
    MaterialIcons: MaterialIcons,
    FontAwesome5: FontAwesome5,
    Fontisto: Fontisto,
    Octicons: Octicons,
};

export const APP_VARIABLES = {
    USER_ID: 'user_id',
    STATUS_ID: 'StatusId',
    SITE_ID: 'SiteId',
    MAX_ROW: 'maxrow',
    FROM_DATE: 'fromdate',
    TO_DATE: 'todate',
    DropDownID: 'DropDownID',
    IsDynamic: 'IsDynamic',
    RadioButtonType: 'radiobuttontype',
    RadioButtonTypeRepeat: 'Repeat',
    RadioButtonTypeFMEAType: 'FMEAType',
    TOKEN: 'token',
    CHAMPION_ID: 'ChampionID',
    PAGE: 'Page',
    SIZE: 'Size',
    SAVE: 'Save',
    SUBMIT: 'Submit',
    TODAY_CONCERN: 'TODAY_CONCERN',
    UPCOMING_CONCERN: 'UPCOMING_CONCERN',
    PENDING_CONCERN: 'PENDING_CONCERN',
    CONCERN_STATUS_ID: 'ConcernStatusID',
    DASHBOARD_CONCERNS: 'DashboardConcern',
    CONCERN_ID: 'ConcernID',
    TASK_ID: 'TaskId',
    PRIORITY_ID: 'PriorityId',
    PROJECT_START_DATE: 'ProjectStartDate',
    FROM_PERCENTAGE: 'FromPercent',
    PERCENTAGE: 'Percent',
    SOURCE_ID: 'SourceID',
    FORM_TYPE: 'FormType',
    FORM_TYPE_ID: 'FormTypeID',
    CONCERN_FORM_ID: 'ConcernFormID',
};

export const COMPANY_DETAILS = {
    Address: '1/807A Pillaiyar Kovil Street, Thoraipakkam, Chennai - 600097',
    CompanyName: 'Omnex Software Solutions',
    CompanyUrl: 'http://www.omnexsystems.com',
    Logo: '',
    Phone: '044248634566',
};

export const STATUS_CODES = {
    IN_PROGRESS: 2,
    PROBLEM_SOLVER: 5,
    OPEN: 1,
    TODAY_CONCERN: '1',
    UPCOMING_CONCERN: '2',
    PENDING_CONCERN: '3',
    TotalConcern: 0,
    OpenConcern: 1,
    InprogressConcern: 2,
    CloseConcern: 3,
    RejectConcern: 4,
    DraftConcern: 5,
    ReworkConcern: 6,
    CancelledConcern: 7,
};

export const STATUS = {
    CREATED: 'Created',
};

export const USER_TYPE = {
    SUPPLIER: '3',
};

export const LOCAL_STORAGE_VARIABLES = {
    SERVER_URL: 'SERVER_URL',
    GLOBAL_SERVER_URL: 'GLOBAL_SERVER_URL',
    DEVICE_STATUS_SETTINGS: 'DEVICE_STATUS_SETTINGS',
    GLOBAL_DEVICE_STATUS: 'GLOBAL_DEVICE_STATUS',
    SITES: 'SITES',
    RECENT_ACTIVITIES: 'RECENT_ACTIVITIES',
    IS_FIRST_TIME_USER: 'IS_FIRST_TIME_USER',
    SELECTED_LANGUAGE: 'SELECTED_LANGUAGE',
    SELECTED_THEME: 'SELECTED_THEME',
    SELECTED_MODE: 'SELECTED_MODE',
    USER_DATA: 'USER_DATA',
    CategoryID: 'CategoryID',
    SubCategoryID: 'SubCategoryID',
    UserId: 'UserId',
    UserName: 'UserName',
    Password: 'Password',
    RegisteredDeviceId: 'RegisteredDeviceId',
    FCMRegistrationToken: 'FCMRegistrationToken',
    LoginFlag: 'LoginFlag',
    fromSSO: 'fromSSO',
    Filterstring: 'Filterstring',
    MaxRow: 'MaxRow',
    Token: 'Token',
    SiteId: 'SiteId',
    SiteDetails: 'SiteDetails',
    UserFullName: 'UserFullName',
    UserEmail: 'UserEmail',
    deviceId: 'deviceId',
    currentApp: 'currentApp',
    globalLogin: 'globalLogin',
};

export const POST = 'POST';
export const GET = 'GET';
export const HEADER_HEIGHT = 60;
export const API_IP = 'http://122.165.203.72:9094/vin-app-api/api/v1/';
export const ROUTES = {
    BOTTOM_NAV: 'BOTTOM_NAV',
    SUCCESS: 'SUCCESS',
    SPLASH_SCREEN: 'SPLASH_SCREEN',
    APP_INTRO: 'APP_INTRO',
    ENTER_PHONE: 'ENTER_PHONE',
    DASHBOARD: 'DASHBOARD',
    PROFILE: 'PROFILE',
    PROJECT: 'PROJECT',
    PROJECT_LIST: 'PROJECT_LIST',
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    GLOBAL_LOGIN: 'GLOBAL_LOGIN',
    GLOBAL_REGISTER: 'GLOBAL_REGISTER',
    LAUNCH_SCREEN: 'LAUNCH_SCREEN',
    SETTINGS: 'SETTINGS',
    PREFERRED_LANGUAGE: 'PREFERRED_LANGUAGE',
    THEME_PICKER: 'THEME_PICKER',
    PROFILE_STACK: 'PROFILE_STACK',
    EDIT_PROFILE: 'EDIT_PROFILE',
    SALON_DETAIL: 'SALON_DETAIL',
    HOME: 'HOME',
    LIST_SCREEN: 'LIST_SCREEN',
    FILTERED_LIST_SCREEN: 'FILTERED_LIST_SCREEN',
    CONCERN_SCREEN: 'CONCERN_SCREEN',
    PAYMENT: 'PAYMENT',
    CALENDER: 'CALENDER',
    PROBLEM_SOLVER: 'PROBLEM_SOLVER',
    TEAM_SELECTION: 'TEAM_SELECTION',
    INITIATE_PROBLEM_SOLVING: 'INITIATE_PROBLEM_SOLVING',
    NEW_CONCERN_CREATIONS: 'NEW_CONCERN_CREATIONS',
    CONCERN_INITIAL_EVALUATION: 'CONCERN_INITIAL_EVALUATION',
    VIEW_CONCERN: 'VIEW_CONCERN',
    HOME_FAB_VIEW: 'HOME_FAB_VIEW',
    AUDIT_DASHBOARD_LISTING: 'AUDIT_DASHBOARD_LISTING',
    AUDIT_PAGE: 'AUDIT_PAGE',
    AUDIT_ATTACH: 'AUDIT_ATTACH',
    AUDIT_FORM: 'AUDIT_FORM',
    NC_OFI_PAGE: 'NC_OFI_PAGE',
    CREATE_NC: 'CREATE_NC',
    CONFORMACY: 'CONFORMACY',
    AUDIT_SUMMARY: 'AUDIT_SUMMARY',
    CREATE_ATTACH: 'CREATE_ATTACH',
    AUDIT_WEBVIEW: 'AUDIT_WEBVIEW',
    CAMERA_CAPTURE: 'CAMERA_CAPTURE',
    VIDEO_CAPTURE: 'VIDEO_CAPTURE',
    USER_PREFERENCE: 'USER_PREFERENCE',
    CHECKLIST_MENU: 'CHECKLIST_MENU',
    CHECKPOINT_DEMO: 'CHECKPOINT_DEMO',
    AUDIT_STATUS: 'AUDIT_STATUS',
    LPA_PUBLISH: 'LPA_PUBLISH',
    AUDIT_RESULT: 'AUDIT_RESULT',
    CONFORMACY_VOICE: 'CONFORMACY_VOICE',
    VOICE_ASSIST: 'VOICE_ASSIST',
    LOGINUISCREEN: 'LOGINUISCREEN',
    REGISTRATION: 'REGISTRATION',
    LANGUAGES: 'LANGUAGES',
    AUDIT_HOME: 'AUDIT_HOME',
    AUDIT_CARD: 'AUDIT_CARD',
    //PROBLEMSOLVER//
    LOGIN_PS: 'LOGIN_PS',
    REGISTER_PS: 'REGISTER_PS',
    FILTERED_LIST_PS: 'FILTERED_LIST_PS',
    LIST_SCREEN_PS: 'LIST_SCREEN_PS',
    CONCERN_INITIAL_EVALUATION_PS: 'CONCERN_INITIAL_EVALUATION_PS',
    CREATE_CONCERN: 'CREATE_CONCERN',
    VIEW_CONCERN_PS: 'VIEW_CONCERN_PS',
    HOME_PS: 'HOME_PS',
    SPLASH_SCREEN_PS: 'SPLASH_SCREEN_PS',
    PROJECT_LIST_PS: 'PROJECT_LIST_PS',
    AUDIT_LAUNCH: 'AUDIT_LAUNCH',
    UNREGISTER: 'UNREGISTER',
    ALLTABAUDITLIST: 'ALLTABAUDITLIST',
    AUDITPRODASHBOARD: 'AUDITPRODASHBOARD',
    AUDIT_NOTIFICATIONS: 'AUDIT_NOTIFICATIONS',
    VOICE_RECOGNITION: 'VOICE_RECOGNITION',
    FILTER_SCREEN: 'FILTER_SCREEN',
    PROFILE_SCREEN: 'PROFILE_SCREEN',
    DOWNLOADS: 'DOWNLOADS',
    SYNC_DETAILS: 'SYNC_DETAILS',
    HELP: 'HELP',
    SUPPLY_MANAGE: 'SUPPLY_MANAGE',
    CALENDER_LIST: 'CALENDER_LIST',

    //docpro:
    DOCPRO_DASHBOARD: 'DOCPRO_DASHBOARD',
    DOCPRO_ACTION: 'DOCPRO_ACTION',
    DOCPRO_ADMINACTION: 'DOCPRO_ADMINACTION',
    DOCPRO_DOCUMENTS: 'DOCPRO_DOCUMENTS',
    DOCPRO_NEWDOCUMENTREQUEST: 'DOCPRO_NEWDOCUMENTREQUEST',
    DOCPRO_DOCUMENTFOLDER: 'DOCPRO_DOCUMENTFOLDER',

    //IC
    INSPECTION_SCHEDULE:'INSPECTION_SCHEDULE',
    OPERATOR_WORKSHEET:'OPERATOR_WORKSHEET',
    COMPLETED_INSPECTION:'COMPLETED_INSPECTION',
    SUPERVISOR_SCHEDULE:'SUPERVISOR_SCHEDULE',
    INPROCESS_INSPECTION:'INPROCESS_INSPECTION',
    CONTAINMENT_ACTIONS:'CONTAINMENT_ACTIONS'
};

export const TRANSLATE_ANIMATION = {
    0: {
        translateX: RFPercentage(50),
    },
    1: {
        translateX: 0,
    },
};
export const OPACITY_TRANSLATE_ANIMATION = {
    0: {
        opacity: 0,
        translateX: 50,
    },
    1: {
        opacity: 1,
        translateX: 0,
    },
};
export const OPACITY_TRANSLATE_Y_ANIMATION = {
    0: {
        opacity: 0,
        translateY: 50,
    },
    1: {
        opacity: 1,
        translateY: 0,
    },
};
export const OPACITY_ANIMATION = {
    0: {
        opacity: 0,
    },
    1: {
        opacity: 1,
    },
};

export const Languages = {
    ENGLISH: 'en',
    CHINESE: 'zh',
};

export const PLACEHOLDERS = {
    USER_CARD: 'USER_CARD',
    TODAY_CARD: 'TODAY_CARD',
    TEAM_CARD: 'TEAM_CARD',
};

export const API_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

export const DATE_FORMAT = {
    DD_MMM_YYYY: 'DD MMM YYYY',
    DD_MMM: 'DD MMM',
    DD_MM_YYYY: 'DD/MM/YYYY',
    DD_MM_YYYY_HH_MM: 'DD/MM/YYYY HH:MM',
};

export const BUTTON_ICONS = {
    left: 'arrowleft',
    right: 'arrowright',
    up: 'arrowup',
    down: 'arrowdown',
    plus: 'plus',
    delete: 'delete',
    edit: 'edit',
    eye: 'eyeo',
};

export const LANGUAGES = [
    {
        label: 'English',
        value: Languages.ENGLISH,
        image: IMAGES.usa,
    },
    {
        label: 'Chinese',
        value: Languages.CHINESE,
        image: IMAGES.china,
    },
    {
        label: 'Japnaese',
        // value: Languages.CHINESE,
        image: IMAGES.japan,
        disabled: true,
    },
    {
        label: 'German',
        // value: Languages.CHINESE,
        image: IMAGES.germany,
        disabled: true,
    },
    {
        label: 'Arabic',
        // value: Languages.CHINESE,
        image: IMAGES.saudi,
        disabled: true,
    },
    {
        label: 'French',
        // value: Languages.CHINESE,
        image: IMAGES.france,
        disabled: true,
    },
];

export const Themes = {
    neon: 'neon',
    red: 'red',
    blue: 'blue',
    yellow: 'yellow',
};

export const THEMES = [
    {
        label: 'neon',
        value: '#1FBFD0',
    },
    // {
    //     label: 'red',
    //     value: '#DA3743',
    // },
    {
        label: 'blue',
        value: '#0180ff',
    },
    {
        label: 'yellow',
        value: '#edb015',
    },
    {
        label: 'pink',
        value: '#ea4c89',
    },
];

export const Modes = {
    light: 'light',
    dark: 'dark',
};

export const MODES = [
    {
        label: 'light',
        value: '#fff',
    },
    {
        label: 'dark',
        value: '#000',
    },
];

export const TOAST_STATUS = {
    SUCCESS: 'success',
    ERROR: 'danger',
};

export const DASHBOARD = {
    No_records_found: "No records found!",
    StatusProcessing: 'In progress',
    StatusScheduled: 'Scheduled',
    StatusCompleted: 'Closed Out',
    StatusDownloaded: 'Downloaded',
    StatusNotSynced: 'Not-synced',
    StatusSynced: 'Synced',
    StatusDV: 'Deadline Violated',
    StatusDVC: 'Deadline Violated and Completed',
    StatusClosed: 'Deadline Violated and Completed',
    Completed: 'Completed',
}
