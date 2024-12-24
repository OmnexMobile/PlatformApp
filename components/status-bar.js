import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { StatusBar } from 'react-native';

const StatusBarAndroidIOS = ({ backgroundColor = COLORS.transparent, animated = true }) => {
    return <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" animated={animated} translucent />;
};

export default StatusBarAndroidIOS;
