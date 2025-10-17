import React, { useEffect, useState } from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import RNBootSplash from 'react-native-bootsplash';

import { store, persistor } from './store';
// import { AppStack } from './navigations/stack';
import { createInspectTable } from './store/database/inspectStorage';
import { useInternetReachable } from './hooks';
import { AppProvider } from './contexts/app-context';
import ThemeProvider from './theme/ThemeProvider';
import useTheme from './theme/useTheme';
import StatusBarAndroidIOS from './components/status-bar';
import UpdateModal from './helpers/UpdateModal';
// import { checkForUpdate } from 'helpers/updateAppAlert';
// import { isJailBroken } from 'helpers/utils';
// import JailBroken from 'components/jailbroken';
import setupInterceptors from './global/interceptor';
import AppStack from './navigations/stack';

// initialize interceptors globally
setupInterceptors();

const Parent: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [warningList, setWarningList] = useState<{ loading: boolean }>({ loading: true });
  const { isInternetReachable } = useInternetReachable();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: theme.mode.backgroundColor,
  };

  // Uncomment to enable update check logic
  /*
  useEffect(() => {
    const check = async () => {
      const result = await checkForUpdate();
      if (result.showModal) {
        setShowUpdateModal(true);
      }
    };
    check();
  }, []);
  */

  useEffect(() => {
    if (typeof isInternetReachable === 'boolean') {
      setWarningList({ loading: false });
    }
  }, [isInternetReachable]);

  useEffect(() => {
    (async () => {
      await createInspectTable();
    })();
  }, []);

  // Uncomment to block jailbroken devices
  /*
  if (isJailBroken) {
    RNBootSplash.hide();
    return (
      <>
        <StatusBarAndroidIOS />
        <JailBroken />
      </>
    );
  }
  */

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={backgroundStyle}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppProvider>
              <PaperProvider>
                <StatusBarAndroidIOS />
                <NavigationContainer onReady={() => RNBootSplash.hide()}>
                  <AppStack />
                </NavigationContainer>
              </PaperProvider>
            </AppProvider>
          </PersistGate>
        </Provider>

        <FlashMessage />
        <UpdateModal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
      </View>
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Parent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default App;
