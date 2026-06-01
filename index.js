/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App'
import { name as appName } from './app.json';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

// 🟡 BACKGROUND RECEIVE (silent handling)
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('🟡 Background received:', remoteMessage);
});
console.log('Registering App');

console.log('Registering App');
AppRegistry.registerComponent(appName, () => App);