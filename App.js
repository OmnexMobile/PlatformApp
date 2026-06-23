import React, { useCallback, useEffect, useState } from 'react';
import { InteractionManager, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import RNBootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './store';
import setupInterceptors from './global/interceptor';
import ThemeProvider from 'theme/ThemeProvider';
import useTheme from 'theme/useTheme';
import { AppProvider } from 'contexts/app-context';
import StatusBarAndroidIOS from 'components/status-bar';
import AndroidBottomSafeArea from 'components/AndroidBottomSafeArea';
import { AppStack } from 'navigations/stack';
import UpdateModal from 'helpers/UpdateModal';
import { createInspectTable } from 'store/database/inspectStorage';
import { loadGlobalUrls } from 'screens/globalConstant/globalURL';

const Parent = () => {
    const { theme } = useTheme();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [splashHidden, setSplashHidden] = useState(false);

    const hideSplash = useCallback(() => {
        if (splashHidden) {
            return;
        }
        RNBootSplash.hide({ fade: true }).catch(() => {});
        setSplashHidden(true);
    }, [splashHidden]);

    useEffect(() => {
        LogBox.ignoreAllLogs();
    }, []);

    useEffect(() => {
        try {
            setupInterceptors(store);
        } catch (error) {
            console.error('Interceptor setup failed', error);
        }
    }, []);

    useEffect(() => {
        let isCancelled = false;
        const deferredTask = InteractionManager.runAfterInteractions(() => {
            (async () => {
                try {
                    await loadGlobalUrls();
                    if (isCancelled) return;
                    await createInspectTable();
                } catch (error) {
                    console.error('Startup initialization failed', error);
                } finally {
                    if (!isCancelled) {
                        hideSplash();
                    }
                }
            })();
        });

        const fallbackTimer = setTimeout(() => {
            hideSplash();
        }, 1800);

        return () => {
            isCancelled = true;
            clearTimeout(fallbackTimer);
            deferredTask.cancel();
        };
    }, [hideSplash]);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                    <Provider store={store}>
                        <PersistGate
                            persistor={persistor}
                            onBeforeLift={hideSplash}
                            loading={
                                <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                                    <StatusBarAndroidIOS />
                                </View>
                            }>
                            <AppProvider>
                                <PaperProvider>
                                    <StatusBarAndroidIOS />
                                    <NavigationContainer onReady={hideSplash}>
                                        <AndroidBottomSafeArea>
                                            <AppStack />
                                        </AndroidBottomSafeArea>
                                    </NavigationContainer>
                                    <FlashMessage />
                                </PaperProvider>
                            </AppProvider>
                        </PersistGate>
                    </Provider>
                </View>
                <UpdateModal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <Parent />
        </ThemeProvider>
    );
};

export default App;
