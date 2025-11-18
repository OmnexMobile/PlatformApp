import React from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import useTheme from '../theme/useTheme';
import { Modes, Themes } from '../constants/app-constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StatusBarAndroidIOS = ({ backgroundColor = null, animated = true }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[Platform.OS === 'ios' ? { height: getStatusBarHeight() }:{paddingTop: insets.top,backgroundColor:'#a09f9f'}]}>
            <StatusBar
                backgroundColor={backgroundColor || theme.mode.backgroundColor}
                barStyle={theme.selectedMode === Modes.light ? 'light-content':'dark-content' }
                animated={animated}
            />
        </View>
    );
};

export default StatusBarAndroidIOS;
