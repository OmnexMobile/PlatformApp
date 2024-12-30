import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { Content, LottieAnimation } from 'components';

const SplashScreenPresentational = ({ params }) => (
    <Content
        style={{
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        <View
            style={{
                height: RFPercentage(25),
                width: RFPercentage(25),
            }}>
            <LottieAnimation file={LOTTIE_FILE.Loader} />
        </View>
    </Content>
);

export default SplashScreenPresentational;
