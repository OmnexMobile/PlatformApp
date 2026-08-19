import { isIphoneX } from 'react-native-iphone-x-helper';
import { Platform, StatusBar, Dimensions, Alert, Linking, LogBox } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import JailMonkey from 'jail-monkey';
import moment from 'moment';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { DATE_FORMAT, IMAGE_UPLOAD_STATUS, INPUTS_CONSTANTS, LOCAL_STORAGE_VARIABLES, TOAST_STATUS } from 'constants/app-constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import localStorage from 'global/localStorage';
import ApiUrl from 'global/ApiUrl';
import { useDispatch } from 'react-redux';

LogBox.ignoreLogs(['Require cycle:']);

export const getAvatarInitials = textString => {
    if (!textString) return '';
    const text = textString.trim();
    const textSplit = text.split(' ');
    if (textSplit.length <= 1) return text.charAt(0);
    const initials = textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    return initials;
};

//
// ─── JAIL MONKEY VARIABLES ──────────────────────────────────────────────────────
//
export const isJailBroken = JailMonkey.isJailBroken();
export const canMockLocation = JailMonkey.canMockLocation();
export const trustFall = JailMonkey.trustFall();

//
// ─── ACTION CREATORS ────────────────────────────────────────────────────────────
//
export const createAction = module => ({
    REQUEST: `${module}_REQUEST`,
    LOADING: `${module}_LOADING`,
    SUCCESS: `${module}_SUCCESS`,
    ERROR: `${module}_ERROR`,
    RESET: `${module}_RESET`,
    SET_DATA: `${module}_SET_DATA`,
});

// export const objToQs = params =>
//     Object.keys(params)
//         .map(key => key + '=' + params[key])
//         .join('&');

export const objToQs = params =>
    Object.keys(params)
        .filter(key => params[key] !== '' && params[key] !== undefined)
        .map(key => key + '=' + params[key])
        .join('&');

export const successMessage = (messageOrConfig, descriptionOrPosition, position = 'top') => {
    const isPositionValue = value =>
        (typeof value === 'string' && ['top', 'bottom', 'center'].includes(value)) || (value && typeof value === 'object');

    let message = 'Success';
    let description = '';
    let finalPosition = position;
    let duration = 1500;

    if (messageOrConfig && typeof messageOrConfig === 'object') {
        message = messageOrConfig.message || 'Success';
        description = messageOrConfig.description || '';
        finalPosition = messageOrConfig.position || position;
        duration = messageOrConfig.duration || 1500;
    } else if (isPositionValue(descriptionOrPosition)) {
        // Legacy usage: successMessage('Saved successfully', 'bottom')
        description = `${messageOrConfig || ''}`;
        finalPosition = descriptionOrPosition;
    } else if (typeof descriptionOrPosition === 'string' && descriptionOrPosition.length > 0) {
        // Title + description usage: successMessage('Loading...', 'setting up...')
        message = `${messageOrConfig || 'Success'}`;
        description = descriptionOrPosition;
    } else {
        // Default usage: successMessage('Saved successfully')
        description = `${messageOrConfig || ''}`;
    }

    return showMessage({
        message,
        description,
        type: 'success',
        backgroundColor: COLORS.fiBgColor,
        color: COLORS.white,
        duration,
        position: finalPosition === 'top' ? { top: 60 } : finalPosition || 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });
};

export const showErrorMessage = (message, position = 'top') => {
    const normalizedMessage =
        typeof message === 'string' ? message.trim() : message?.message || message?.Message || message?.error || message?.Error || '';

    return showMessage({
        message: 'Error',
        description: normalizedMessage || 'Something Went Wrong.',
        type: 'danger',
        backgroundColor: FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration: 1500,
        position: position === 'top' ? { top: 60 } : position ? position : 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });
};

export const showWarningMessage = ({ message, position = 'top' }) =>
    showMessage({
        message: 'Warning',
        description: message,
        type: 'Warning',
        backgroundColor: FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration: 1500,
        position: position === 'top' ? { top: 60 } : position ? position : 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });

// problem solver
export const toast = (title = 'Success', desc = 'Successfully Saved', type = TOAST_STATUS.SUCCESS, duration = 2500, position = 'bottom') => {
    const message = title ? title : type === TOAST_STATUS.SUCCESS ? 'Success' : 'Error';
    return showMessage({
        type,
        message,
        description: desc,
        backgroundColor: type === TOAST_STATUS.SUCCESS ? COLORS.success : FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration,
        position,
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });
};

// Responsive font size
export function RFPercentage(percent) {
    const { height, width } = Dimensions.get('window');
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait
    const deviceHeight = isIphoneX() || Platform.OS === 'android' ? standardLength - offset : standardLength;
    const heightPercent = (percent * deviceHeight) / 100;
    return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680
export function RFValue(fontSize, standardScreenHeight = 680) {
    const { height, width } = Dimensions.get('window');
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight = isIphoneX() || Platform.OS === 'android' ? standardLength - offset : standardLength;

    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
}

export const getElevation = () => {
    const { theme } = useTheme();
    return {
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: theme.mode.backgroundColor,
    };
};

export const formReq = request => {
    var formData = new FormData();
    const transformedData = Object.entries(request).map(([key, value]) => ({ key, value }));
    transformedData.map(({ key, value }) => formData.append(key, value));
    return formData;
};

export const requestAllPermissionsOnce = async () => {
    const alreadyAsked = await AsyncStorage.getItem('permissionsAskedOnce');
    if (alreadyAsked === 'true') return;

    const androidPermissions = [];

    // Check Android version
    const sdkVersion = parseInt(Platform.Version, 10);

    if (sdkVersion < 30) {
        androidPermissions.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }

    androidPermissions.push(PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    const permissionsToRequest = Platform.select({
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY, PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        android: androidPermissions,
    });

    let allGranted = true;

    for (const permission of permissionsToRequest) {
        const status = await check(permission);

        if (status === RESULTS.GRANTED) continue;

        if (status === RESULTS.BLOCKED) {
            Alert.alert('Permission Blocked', 'Some permissions are blocked. Please enable them in device Settings.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
            ]);
            allGranted = false;
            continue;
        }

        const result = await request(permission);

        if (result !== RESULTS.GRANTED) {
            Alert.alert('Permission Denied', `App needs permission: ${permission.split('.').pop()} to function properly.`);
            allGranted = false;
        }
    }
    if (allGranted) {
        await AsyncStorage.setItem('permissionsAskedOnce', 'true');
    }
};

export function convertStringToHTML(htmlString) {
    // Create a map of HTML entities and their corresponding characters
    const entitiesMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&apos;': "'",
        '&cent;': '¢',
        '&pound;': '£',
        '&yen;': '¥',
        '&euro;': '€',
        '&copy;': '©',
        '&reg;': '®',
        '&nbsp;': ' ',
        '&iexcl;': '¡',
        '&laquo;': '«',
        '&raquo;': '»',
        '&middot;': '·',
        '&para;': '¶',
        '&sect;': '§',
        '&trade;': '™',
    };

    // Use a regular expression to replace all entities in the map
    const decodedString = htmlString.replace(/&[a-zA-Z]+;/g, match => entitiesMap[match] || match);

    return decodedString;
}

export const isHTML = str => {
    // Regular expression to match HTML tags
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
};

export const openLink = async (link = '', color = '#fff') => {
    try {
        const url = link;
        if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                preferredBarTintColor: color,
                preferredControlTintColor: 'white',
                readerMode: false,
                animated: true,
                modalPresentationStyle: 'fullScreen',
                modalTransitionStyle: 'coverVertical',
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: color,
                secondaryToolbarColor: 'black',
                navigationBarColor: 'black',
                navigationBarDividerColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                    startEnter: 'slide_in_right',
                    startExit: 'slide_out_left',
                    endEnter: 'slide_in_left',
                    endExit: 'slide_out_right',
                },
                headers: {
                    'my-custom-header': 'my custom header value',
                },
            });
            // await this.sleep(800);
            // Alert.alert(JSON.stringify(result));
        } else Linking.openURL(url);
    } catch (error) {
        // Alert.alert(error.message);
    }
};

export const getDisplayValue = (columnValue, columnData, rowData, timeSettings) => {
    columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && console.log('columnData?.Type', columnData?.Type, columnValue, columnData);
    switch (columnData?.Type) {
        case INPUTS_CONSTANTS.FILE_UPLOAD:
            return rowData?.Attachment || columnValue || '---';

        case INPUTS_CONSTANTS.DATE_PICKER:
            return columnValue ? moment(columnValue, DATE_FORMAT.MM_DD_YYYY).format(DATE_FORMAT[timeSettings || 'DD/MM/YYYY']) : '---';

        default:
            if (rowData?.UploadStatus === IMAGE_UPLOAD_STATUS.InProgress) {
                return 'Upload in progress';
            }
            return columnValue ?? '---';
    }
};
// export const getICList = async (userId, siteId, online = true) => {
//     const OpList = await getInspectionDataByUserAndSite(userId, siteId);
//     const completedList = OpList?.filter(item => item?.status === 'Completed' || item?.status === 'In Progress');
//     const ICAPIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
//     let apiData;
//     if (online) {
//         const formData = new FormData();
//         formData.append('userId', userId);
//         formData.append('siteId', siteId);
//         try {
//             const res = await fetch(`${ICAPIURL}${ApiUrl.ICTABCOUNT}`, {
//                 method: 'POST',
//                 body: formData, // No need to set headers; fetch auto-sets multipart boundary
//             });
//             const data = await res.json();
//             apiData = data?.Data;
//         } catch (error) {
//             console.error('Fetch Error:', error);
//         }
//     } else {
//         const countIC = await AsyncStorage.getItem('countIC');
//         const data = JSON.parse(countIC);
//         apiData = {
//             InspectionSchedule: data?.inspection,
//             SearchInspection: data?.search,
//             SupervisorSchedule: data?.supervisor,
//         };
//     }
//     const OverAllCount = {
//         inspection: apiData?.InspectionSchedule || 0, // api data need to add
//         search: apiData?.SearchInspection || 0, // api data need to add
//         completed: completedList?.length || 0,
//         operatorList: OpList?.length || 0,
//         supervisor: apiData?.SupervisorSchedule || 0,
//     };
//     AsyncStorage.setItem('countIC', JSON.stringify(OverAllCount));
// };
export const getICList = async (userId, siteId, online = true) => {
    const OpList = await getInspectionDataByUserAndSite(userId, siteId);
    const completedList = OpList?.filter(item => item?.status === 'Completed');
    const ICAPIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
    let apiData;
    if (online) {
        const formData = new FormData();
        const startDate = moment().subtract(7, 'days').toDate();
        const endDate = new Date();
        formData.append('userId', userId);
        formData.append('siteId', siteId);
        formData.append('LanguageID', 1);
        formData.append('StartDate', moment(startDate).format('MM/DD/YYYY'));
        formData.append('EndDate', moment(endDate).format('MM/DD/YYYY'));
        try {
            const res = await fetch(`${ICAPIURL}${ApiUrl.IC_GET_IS}`, {
                method: 'POST',
                body: formData, // No need to set headers; fetch auto-sets multipart boundary
            });
            const data = await res.json();
            apiData = {
                InspectionSchedule: data?.Data?.InspectionSchedules?.length || 0,
                SearchInspection: 0,
                SupervisorSchedule: 0,
            };
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    } else {
        const countIC = await AsyncStorage.getItem('countIC');
        const data = JSON.parse(countIC);
        apiData = {
            InspectionSchedule: data?.inspection,
            SearchInspection: data?.search,
            SupervisorSchedule: data?.supervisor,
        };
    }
    const OverAllCount = {
        inspection: apiData?.InspectionSchedule || 0, // api data need to add
        search: 0, // api data need to add
        completed: completedList?.length || 0,
        operatorList: OpList?.length || 0,
        supervisor: 0,
    };
    console.log('apiDatautils',OverAllCount, OpList, completedList, apiData);

    AsyncStorage.setItem('countIC', JSON.stringify(OverAllCount));
};
export const getICSettingsData = async (userId, siteId) => {
    const APIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
    const newFormData = new FormData();
    newFormData.append('UserID', userId);
    newFormData.append('SiteID', siteId);
    try {
        const res = await fetch(`${APIURL}${ApiUrl.IC_SETTINGS}`, {
            method: 'POST',
            body: newFormData,
        });

        const data = await res.json();
        if (data?.Success) {
            const settings = {
                ...data?.Data?.[0],
            };
            return settings;
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return {};
    }
};
// export const getICSettingsData = async (userId, siteId) => {
//     const APIURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.IC_API_URL);
//     const newFormData = new FormData();
//     newFormData.append('UserID', userId);
//     newFormData.append('SiteID', siteId);
//     try {
//         const res = await fetch(`${APIURL}${ApiUrl.IC_SETTINGS}`, {
//             method: 'POST',
//             body: newFormData,
//         });

//         const data = await res.json();
//         if (data?.Success) {
//             const settings = {
//                 ...data?.Data?.[0],
//             };
//             return settings;
//         }
//     } catch (error) {
//         console.error('Fetch Error:', error);
//         return {};
//     }
// };
