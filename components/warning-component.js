import React from 'react';
import { Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { FONT_TYPE } from 'constants/app-constant';
import { FONT_SIZE } from 'constants/theme-constants';
import Content from './content';
import LottieAnimation from './lottie-animation';
import TextComponent from './text';

const WarningComponent = ({}) => (
    <Content style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ height: RFPercentage(50), width: RFPercentage(20) }}>
            <LottieAnimation file={LOTTIE_FILE.NoNetwork} />
        </View>
        <TextComponent fontSize={FONT_SIZE.X_LARGE} type={FONT_TYPE.BOLD}>
            Sorry you are not reachable 💔
        </TextComponent>
        <TextComponent style={{ textAlign: 'center' }}>We found that there is an connection issue with your device 😔.</TextComponent>
    </Content>
);

export default WarningComponent;
