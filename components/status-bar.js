import React from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import useTheme from '../theme/useTheme';
import { Modes, Themes } from '../constants/app-constant';

const StatusBarAndroidIOS = ({ backgroundColor = null, animated = true }) => {
    const { theme } = useTheme();
    return (
        <View style={[Platform.OS === 'ios' && { height: getStatusBarHeight() }]}>
            <StatusBar
                backgroundColor={backgroundColor || theme.mode.backgroundColor}
                barStyle={theme.selectedMode === Modes.light ? 'dark-content' : 'light-content'}
                animated={animated}
            />
        </View>
    );
};

export default StatusBarAndroidIOS;
