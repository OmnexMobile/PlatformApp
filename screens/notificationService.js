import { getMessaging, onMessage, getToken, onNotificationOpenedApp, getInitialNotification } from '@react-native-firebase/messaging';
import { store } from 'store';
let navigationRef = null;

export const setNavigationRef = ref => {
    navigationRef = ref;
};
// 🔑 Get FCM Token
export async function fetchFCMToken() {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    console.log('🔥 FCM TOKEN :', token);
    return token;
}

// 🟢 FOREGROUND (App is OPEN)
export const setupForegroundHandler = setNotificationData => {
    const messaging = getMessaging();

    return onMessage(messaging, async remoteMessage => {
        console.log('🟢 Foreground:', remoteMessage);
        store.dispatch({ type: 'STORE_NOTIFICATION_DATA', notificationData: remoteMessage });
        setNotificationData({
            remoteMessage,
            showModal: true,
        });
        // 👉 SHOW SOMETHING (since no system UI)
        // Option 1: Alert
        // Option 2: Custom UI
    });
};

// 🟡 BACKGROUND → user taps notification
export const setupBackgroundOpenHandler = setNotificationData => {
    const messaging = getMessaging();

    onNotificationOpenedApp(messaging, remoteMessage => {
        console.log('🟡 Opened from background:', remoteMessage);
        store.dispatch({ type: 'STORE_NOTIFICATION_DATA', notificationData: remoteMessage });
        setNotificationData({
            remoteMessage,
            showModal: true,
        });
        handleNavigation(remoteMessage);
    });
};

// 🔴 QUIT → user taps notification
export const setupQuitOpenHandler = setNotificationData => {
    const messaging = getMessaging();

    getInitialNotification(messaging).then(remoteMessage => {
        if (remoteMessage) {
            console.log('🔴 Opened from quit:', remoteMessage);
            store.dispatch({ type: 'STORE_NOTIFICATION_DATA', notificationData: remoteMessage });
            setTimeout(() => {
                setNotificationData({
                    showModal: true,
                    remoteMessage,
                });
            }, 3000);
            handleNavigation(remoteMessage);
        }
    });
};

// 🚀 Navigation logic
const handleNavigation = message => {
    const screen = message?.data?.screen;

    if (navigationRef && screen) {
        navigationRef.navigate(screen, message?.data);
    } else {
        console.log('⚠️ No screen found in data');
    }
};