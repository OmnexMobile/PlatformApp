import { isIphoneX } from 'react-native-iphone-x-helper';
import { Platform, StatusBar, Dimensions, Alert } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import JailMonkey from 'jail-monkey';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { LOCAL_STORAGE_VARIABLES, TOAST_STATUS } from 'constants/app-constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getApp } from '@react-native-firebase/app';
import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  getAPNSToken,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages
} from '@react-native-firebase/messaging';

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

export const successMessage = ({ message = 'Success', description = 'Successfully Saved', type = 'success', position = 'top' }) =>
    showMessage({
        message,
        description,
        type,
        backgroundColor: COLORS.success,
        color: COLORS.white,
        duration: 1500,
        // problem Solver
        position: position,
        // style: {
        //     borderRadius: SPACING.NORMAL,
        //     margin: SPACING.SMALL,
        // },
    });

export const showErrorMessage = (message, position = 'bottom') =>
    showMessage({
        message: 'Error',
        description: message,
        type: 'danger',
        backgroundColor: FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration: 1500,
        position: position,
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });

export const showWarningMessage = message =>
    showMessage({
        message: 'Warning',
        description: message,
        type: 'Warning',
        backgroundColor: FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration: 1500,
        position: 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });

// problem solver
export const toast = (title = 'Success', desc = 'Successfully Saved', type = TOAST_STATUS.SUCCESS, duration = 1500) => {
    const message = title ? title : type === TOAST_STATUS.SUCCESS ? 'Success' : 'Error';
    return showMessage({
        type,
        message,
        description: desc,
        backgroundColor: type === TOAST_STATUS.SUCCESS ? COLORS.success : FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration,
        position: 'bottom',
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



export async function requestNotificationPermission() {
  const firebaseApp = getApp();
  const messaging = getMessaging(firebaseApp);

  // --- 1. ANDROID 13+ ---
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const androidPermission = 'android.permission.POST_NOTIFICATIONS';
    let status = await check(androidPermission);

    if (status === RESULTS.DENIED) {
      status = await request(androidPermission);
    }

    if (status === RESULTS.GRANTED) {
      console.log('✅ Android Notification Permission Granted');
      const token = await getToken(messaging);
      console.log('FCM Token:', token);
      return true;
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ]
      );
    }
    return false;
  }

  // --- 2. IOS ---
  if (Platform.OS === 'ios') {
    // Modular requestPermission
    const authStatus = await requestPermission(messaging);

    // Status 1 = Authorized, 2 = Provisional
    const enabled = authStatus === 1 || authStatus === 2;
    console.log('iOS Permission Status:', authStatus);

    if (!enabled) {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ]
      );
      return false;
    }

    try {
      // Check if already registered to avoid redundant calls/warnings
      if (!isDeviceRegisteredForRemoteMessages(messaging)) {
        await registerDeviceForRemoteMessages(messaging);
      }

      // getAPNSToken is used primarily to verify Apple connectivity
      const apnsToken = await getAPNSToken(messaging);
      
      if (!apnsToken) {
        console.warn('❌ APNS token not available (Likely running on Simulator)');
        // Note: You can still try to get the FCM token, but it might fail on physical devices without APNS
      } else {
        console.log('✅ APNS Token:', apnsToken);
      }

      // Get FCM token
      const fcmToken = await getToken(messaging);
      console.log('✅ FCM Token:', fcmToken);

      return true;
    } catch (error) {
      console.error('❌ iOS Notification Setup Error:', error);
      return false;
    }
  }

  // --- 3. ANDROID < 13 ---
  console.log('✅ Older Android: Permission auto granted');
  const token = await getToken(messaging);
  console.log('FCM Token:', token);

  return true;
}