import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { View, Image, Dimensions, Alert, Platform, AppState } from 'react-native'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { Images } from '../Themes';
import ResponsiveImage from 'react-native-responsive-image';
import ToastNew from 'react-native-toast-message';
import { NavigationActions, StackActions } from 'react-navigation'
import firebase from 'react-native-firebase';
import auth from "../Services/Auth";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
// create our store
const { store, persistor } = createStore()
console.disableYellowBox = true;
const window_width = Dimensions.get('window').width
const window_height = Dimensions.get('window').height
const ANDROID_15_API_LEVEL = 35
const isAndroid15OrAbove =
  Platform.OS === 'android' && Number(Platform.Version) >= ANDROID_15_API_LEVEL
const android15SafeAreaStyle = isAndroid15OrAbove
  ? { marginBottom: initialWindowMetrics?.insets.bottom ?? 0 }
  : undefined

const unauthorizedHandlers = new Set()
const registerUnauthorizedHandler = handler => {
  if (typeof handler === 'function') {
    unauthorizedHandlers.add(handler)
  }
  return () => unauthorizedHandlers.delete(handler)
}

const notifyUnauthorizedHandlers = response => {
  unauthorizedHandlers.forEach(handler => {
    try {
      handler(response)
    } catch (error) {
      if (__DEV__) {
        console.warn('Unauthorized handler error', error)
      }
    }
  })
}

const installFetch401Interceptor = () => {
  if (global.__auditProFetch401InterceptorInstalled || typeof global.fetch !== 'function') {
    return
  }
  const originalFetch = global.fetch.bind(global)
  global.fetch = async (...args) => {
    const response = await originalFetch(...args)
    if (response?.status === 401) {
      const requestUrl = extractRequestUrl(args)
      if (shouldSkipUnauthorizedHandling(requestUrl)) {
        return response
      }
      notifyUnauthorizedHandlers(response)
    }
    return response
  }
  if (originalFetch.polyfill) {
    global.fetch.polyfill = originalFetch.polyfill
  }
  global.__auditProFetch401InterceptorInstalled = true
}

const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null
  }
  const { index = 0, routes = [] } = navigationState
  const route = routes[index]
  if (!route) {
    return null
  }
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName || null
}

installFetch401Interceptor()

function extractRequestUrl(args) {
  if (!args || args.length === 0) {
    return null
  }
  const requestOrUrl = args[0]
  if (typeof requestOrUrl === 'string') {
    return requestOrUrl
  }
  if (requestOrUrl && typeof requestOrUrl.url === 'string') {
    return requestOrUrl.url
  }
  if (requestOrUrl && typeof requestOrUrl.uri === 'string') {
    return requestOrUrl.uri
  }
  return null
}

function shouldSkipUnauthorizedHandling(url) {
  if (!url) {
    return false
  }
  const normalized = url.toLowerCase()
  return normalized.includes('credentialcheck')
}

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  state = {
    isAppLoaded: false,
    deviceId: '',
    appState: AppState.currentState || 'active',
    currentID: '',
  }

  appStateSubscription = null
  lastReportedAppState = null
  lastErrorToastStatus = null
  lastErrorToastAt = 0
  errorToastCooldownMs = 8000
  unregisterUnauthorized = null
  logoutInProgress = false
  defaultGlobalHandler = global.ErrorUtils?.getGlobalHandler?.()

  getCrashlyticsInstance = () => {
    try {
      return typeof firebase?.crashlytics === 'function' ? firebase.crashlytics() : null
    } catch (error) {
      return null
    }
  }

  initializeCrashlytics = () => {
    const crashlytics = this.getCrashlyticsInstance()
    if (!crashlytics) {
      return
    }
    try {
      crashlytics.enableCrashlyticsCollection()
      if (global.ErrorUtils?.setGlobalHandler) {
        global.ErrorUtils.setGlobalHandler((error, isFatal) => {
          try {
            const message = error?.message || 'Unhandled JS error'
            crashlytics.log(error?.stack || message)
            crashlytics.recordError(isFatal ? 1 : 0, message)
          } catch (loggingError) {
            if (__DEV__) {
              console.warn('Crashlytics logging failed', loggingError)
            }
          }
          if (typeof this.defaultGlobalHandler === 'function') {
            this.defaultGlobalHandler(error, isFatal)
          }
        })
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Crashlytics init failed', error)
      }
    }
  }

  setCrashlyticsUserId = (deviceId) => {
    const crashlytics = this.getCrashlyticsInstance()
    if (!crashlytics || !deviceId) {
      return
    }
    try {
      crashlytics.setUserIdentifier(deviceId)
    } catch (error) {
      if (__DEV__) {
        console.warn('Crashlytics user id set failed', error)
      }
    }
  }

  onBeforeLift = () => {
    setTimeout(() => { 
      this.setState({ isAppLoaded: true}) 
    }, 500);
  }

  async componentDidMount() {
    this.initializeCrashlytics()
    this.unregisterUnauthorized = registerUnauthorizedHandler(this.handleUnauthorizedAccess)
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange)
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setCrashlyticsUserId(deviceId)
      this.setState({ deviceId }, () => {
        this.reportAppStatus(this.state.appState)
      })
    })
    this.checkPermission();
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    //   const { title, body } = notification;
    //   console.log('notif title:fg:', title)
    //   console.log('notif body:fg:', body)
    //   this.showAlert(title, body);
    // });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //     const { title, body } = notificationOpen.notification;
    //     console.log('notif title:bg:', title)
    //     console.log('notif body:bg:', body)
    //     this.showAlert(title, body);
    // });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    /* const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        console.log('notif title:', title)
        console.log('notif body:', body)
        this.showAlert(title, body);
    } */
    /*
    * Triggered for data only payload in foreground
    * */
    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   //process data message
    //   console.log(JSON.stringify(message));
    // });
  }

  componentWillUnmount() {
    if (this.appStateSubscription?.remove) {
      this.appStateSubscription.remove()
    } else {
      AppState.removeEventListener?.('change', this._handleAppStateChange)
    }
    if (typeof this.unregisterUnauthorized === 'function') {
      this.unregisterUnauthorized()
    }
  }
  _handleAppStateChange = (nextAppState) => {
 
    this.setState({ appState: nextAppState });
    this.reportAppStatus(nextAppState)
  };

  reportAppStatus = (nextAppState) => {
    const { deviceId } = this.state
    if (!deviceId) {
      return
    }
    const normalizedState = nextAppState === 'active' ? 'active' : 'background'
    if (this.lastReportedAppState === normalizedState) {
      return
    }
    this.lastReportedAppState = normalizedState
    // auth.AppStatus(normalizedState, deviceId, (response) => {
    //   if (__DEV__) {
    //     console.log(`App status sent: ${normalizedState}`, response?.status)
    //   }
    //   if (response && [401, 404, 500, 503].includes(response.status)) {
    //     this.showApiErrorToast(response.status)
    //   }
    // })
  }

  showApiErrorToast = (status) => {
    const now = Date.now()
    if (this.lastErrorToastStatus === status && now - this.lastErrorToastAt < this.errorToastCooldownMs) {
      return
    }
    this.lastErrorToastStatus = status
    this.lastErrorToastAt = now
    const statusMessages = {
      401: 'Please log in again.',
      404: 'Server not reachable (404).',
      500: 'Server error (500). Please try again later.',
      503: 'Service unavailable (503). Please try again shortly.',
    }
    ToastNew.show({
      type: 'error',
      text1: 'Session Expired',
      text2: statusMessages[status] || 'Unexpected server response.',
      position: 'top',
      visibilityTime: 7000,
    })
  }

  handleUnauthorizedAccess = () => {
    const state = typeof store.getState === 'function' ? store.getState() : null
    const navState = state ? state.nav : null
    const currentRoute = getActiveRouteName(navState)
    const authRoutes = ['LoginUIScreen', 'Registration']
    if (this.logoutInProgress) {
      return
    }
    this.showApiErrorToast(401)
    if (authRoutes.includes(currentRoute)) {
      return
    }
    this.logoutInProgress = true
    store.dispatch({ type: 'STORE_LOGIN_SESSION', isActive: false })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'LoginUIScreen' })
      ],
    })
    store.dispatch(resetAction)
    setTimeout(() => {
      this.logoutInProgress = false
    }, 2000)
  }
 
  async checkPermission() {
    // const enabled = await firebase.messaging().hasPermission();
    // if (enabled) {
    //     this.getToken();
    // } else {
    //     this.requestPermission();
    // }
  }
  
  async getToken() {
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    // if(fcmToken) {
    //   console.log('FCM Token:',fcmToken.toString())
    // }    
    // if (!fcmToken) {
    //     fcmToken = await firebase.messaging().getToken();
    //     if (fcmToken) {
    //         // user has a device token
    //         await AsyncStorage.setItem('fcmToken', fcmToken);
    //     }
    // }
  }
  
  async requestPermission() {
    // try {
    //     await firebase.messaging().requestPermission();
    //     // User has authorised
    //     this.getToken();
    // } catch (error) {
    //     // User has rejected permissions
    //     console.log('permission rejected');
    // }
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
  render () {
    return (
      <SafeAreaProvider style={android15SafeAreaStyle}>
        <Provider store={store}>
          <PersistGate onBeforeLift={this.onBeforeLift} persistor={persistor}>
            {(this.state.isAppLoaded) ? 
              <RootContainer /> : 
              <View
                style={{
                  paddingVertical: 20,
                  borderTopWidth: 1,
                  borderColor: "#CED0CE",
                  width: window_width,
                  height: 300,
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: parseInt((window_height / 2) - 50),
                  backgroundColor: '#fff'
                }}
              >
                {/* <ActivityIndicator animating size="large" /> */}
                {/* <DoubleBounce size={20} color="#1CAFF6" /> */}
                <ResponsiveImage source={Images.loadingLogo} initWidth="310" initHeight="69"/>
              </View>
            }
          </PersistGate>
        </Provider>
        <ToastNew />
      </SafeAreaProvider>
    )
  }
}



// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
