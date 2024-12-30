import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { Content, LottieAnimation } from 'components';
import { COLORS } from 'constants/theme-constants';

const Loader = ({ transparent, absolute}) => (
    <Content
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            ...(absolute && { position: 'absolute',
            top: 1,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,}),
            backgroundColor: transparent? COLORS.transparentGrey: COLORS.white,
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

export default Loader;
