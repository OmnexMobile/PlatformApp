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
import { createInspectTable  } from 'store/database/inspectStorage';
import { checkForUpdate } from 'helpers/updateAppAlert';
import UpdateModal from 'helpers/UpdateModal';

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
        checkWarning();
    }, [isInternetReachable]);
    useEffect(() => {
        (async () => {
            await createInspectTable();
        })();
    }, []);
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
            <SafeAreaView style={[backgroundStyle, { backgroundColor: theme.mode.backgroundColor }]}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <AppProvider>
                            <PaperProvider>
                                <StatusBarAndroidIOS />
                                <NavigationContainer onReady={() => RNBootSplash.hide()}>
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
            </SafeAreaView>
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
