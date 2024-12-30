import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { Content, ImageComponent, LottieAnimation } from 'components';
import { IMAGES } from 'assets/images';
import { colors } from 'theme/colors';

const SplashScreenPresentational = ({ params }) => (
    <Content
        style={{
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:colors.blue.primaryThemeColor
        }}>
            <View style={{padding:RFPercentage(4),backgroundColor:"#fff",borderRadius:RFPercentage(7)}}>
                <ImageComponent source={IMAGES.bootImage} resizeMode="contain" style={{ height: RFPercentage(10), aspectRatio:1/1}} />
            </View>
    </Content>
);

export default SplashScreenPresentational;
