import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { FONT_TYPE } from 'constants/app-constant';
import { FONT_SIZE } from 'constants/theme-constants';
import LottieAnimation from './lottie-animation';
import TextComponent from './text';
import Content from './content';

const JailBroken = () => (
    <Content style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ height: RFPercentage(50), width: RFPercentage(20) }}>
            <LottieAnimation file={LOTTIE_FILE.Rooted} />
        </View>
        <TextComponent fontSize={FONT_SIZE.XX_LARGE} type={FONT_TYPE.BOLD}>
            Trust broken 💔
        </TextComponent>
        <TextComponent style={{ textAlign: 'center' }}>
            We found that your device is rooted or It can modify the your location which breaks our policy.
        </TextComponent>
    </Content>
);

export default JailBroken;
