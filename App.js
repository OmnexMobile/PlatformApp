import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView, useColorScheme, View } from 'react-native';
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
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'store';
import { createInspectTable } from 'store/database/inspectStorage';
import { checkForUpdate } from 'helpers/updateAppAlert';
import UpdateModal from 'helpers/UpdateModal';
import { loadGlobalUrls } from 'screens/globalConstant/globalURL';
import { refreshUrlsFromGlobals } from 'services/AuditPro-Api';
import { LogBox } from 'react-native';

setupInterceptors();

const Parent = () => {
    const { theme } = useTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const [warningList, setWarningList] = useState({ loading: true });
    const { isInternetReachable } = useInternetReachable();
    const backgroundStyle = {
        // backgroundColor: isDarkMode ? COLORS.white : COLORS.white,
        flex: 1,
    };

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [reduxReady, setReduxReady] = useState(false);
    const [navReady, setNavReady] = useState(false);
    const [splashHidden, setSplashHidden] = useState(false);

    useEffect(() => {
        LogBox.ignoreAllLogs();
    }, []);

    useEffect(() => {
        // Hide only after both redux and navigation are ready, with a safety timeout.
        const hideSplash = () => {
            if (splashHidden) return;
            RNBootSplash.hide({ fade: true }).catch(() => {});
            setSplashHidden(true);
        };
        if (reduxReady && navReady) {
            hideSplash();
            return;
        }
        const timer = setTimeout(() => {
            hideSplash();
        }, 8000);
        return () => clearTimeout(timer);
    }, [reduxReady, navReady, splashHidden]);

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
        (async () => {
            await loadGlobalUrls();
            refreshUrlsFromGlobals();
            await createInspectTable();
        })();
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
                        onBeforeLift={() => setReduxReady(true)}>
                        <AppProvider>
                            <PaperProvider>
                                <StatusBarAndroidIOS />
                                <NavigationContainer onReady={() => setNavReady(true)}>
                                    {!reduxReady || !navReady ? (
                                        <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                                            <StatusBarAndroidIOS />
                                        </View>
                                    ) : (
                                        <AppStack />
                                    )}
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
        <ThemeProvider>
            <Parent />
        </ThemeProvider>
    );
};

export default App;
