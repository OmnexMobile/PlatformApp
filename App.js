import React, { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { InteractionManager, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import FlashMessage from 'react-native-flash-message';
// import { ICON_TYPE } from 'constants/app-constant';
import { store } from 'store';
import { IconComponent, JailBroken, Loader, SwitchComponent, TextComponent, WarningComponent } from 'components';
import StatusBarAndroidIOS from 'components/status-bar';
import setupInterceptors from 'global/interceptor';
import LottieAnimation from 'components/lottie-animation';
import { COLORS } from 'constants/theme-constants';
import { AppStack } from 'navigations/stack';
import { useInternetReachable } from 'hooks';
import RNBootSplash from 'react-native-bootsplash';
import { AppProvider } from 'contexts/app-context';
import ThemeProvider from 'theme/ThemeProvider';
import useTheme from 'theme/useTheme';
import { isJailBroken } from 'helpers/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'store';
import { createInspectTable } from 'store/database/inspectStorage';
import { checkForUpdate } from 'helpers/updateAppAlert';
import UpdateModal from 'helpers/UpdateModal';
import { loadGlobalUrls } from 'screens/globalConstant/globalURL';
import { LogBox } from 'react-native';
import { android15FooterPadding, android15HeaderPadding } from './screens/auditPro/Themes/AndroidInsets';

setupInterceptors();

const Parent = () => {
    const { theme } = useTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const [warningList, setWarningList] = useState({ loading: true });
    const { isInternetReachable } = useInternetReachable();
    const insets = useSafeAreaInsets();
    const topPadding = Math.max(insets.top, android15HeaderPadding);
    const bottomPadding = Math.max(insets.bottom, android15FooterPadding);
    const backgroundStyle = {
        // backgroundColor: isDarkMode ? COLORS.white : COLORS.white,
        flex: 1,
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
    };

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
        // Never keep the native splash on screen indefinitely while async startup work settles.
        const timer = setTimeout(() => {
            hideSplash();
        }, 1500);

        return () => clearTimeout(timer);
    }, [hideSplash]);

    // useEffect(() => {
    //     const check = async () => {
    //         const result = await checkForUpdate();
    //         if (result.showModal) {
    //             setShowUpdateModal(true);
    //         }
    //     };
    //     check();
    // }, []);
    const checkWarning = () => {
        if (typeof isInternetReachable === 'boolean') {
            setWarningList({
                loading: false,
            });
        }
    };

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
                }
            })();
        });

        return () => {
            isCancelled = true;
            deferredTask.cancel();
        };
    }, []);

    useEffect(() => {
        checkWarning();
    }, [isInternetReachable]);

    // comment this code while you are working on debug mode
    // if (isJailBroken) {
    //     RNBootSplash.hide();
    //     return (
    //         <>
    //             <StatusBarAndroidIOS />
    //             <JailBroken />
    //         </>
    //     );
    // }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[backgroundStyle, { backgroundColor: theme.mode.backgroundColor }]}>
                <Provider store={store}>
                    <PersistGate
                        loading={
                            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                                <StatusBarAndroidIOS />
                            </View>
                        }
                        persistor={persistor}
                        onBeforeLift={hideSplash}>
                        <AppProvider>
                            <PaperProvider>
                                <StatusBarAndroidIOS />
                                <NavigationContainer onReady={hideSplash}>
                                    <AppStack />
                                </NavigationContainer>
                                {/* {warningList?.loading ? (x
                        <Loader />
                    ) : !isInternetReachable ? (
                        <WarningComponent />
                    ) : (
                        <NavigationContainer onReady={() => RNBootSplash.hide()}>
                            <AppStack />
                        </NavigationContainer>
                    )} */}
                            </PaperProvider>
                        </AppProvider>
                    </PersistGate>
                </Provider>
                {/* <StatusBarAndroidIOS />
            <IconComponent name="home" type={ICON_TYPE.AntDesign} />
            <TextComponent>Hai</TextComponent>
            <View style={{ width: RFPercentage(10), height: RFPercentage(10) }}>
                <LottieAnimation />
            </View>

            {/* Notification Component */}
                <FlashMessage />
            </View>
            <UpdateModal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
        </GestureHandlerRootView>
    );
};

const App = () => {
    return (
        <SafeAreaProvider
            initialMetrics={initialWindowMetrics}
            style={{ flex: 1 }}>
            <ThemeProvider>
                <Parent />
            </ThemeProvider>
        </SafeAreaProvider>
    );
};

export default App;
