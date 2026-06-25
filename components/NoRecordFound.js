import React, { useState } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

const NORECORDS_LOTTIE = require('../assets/lottie/norecords.json');
const NORECORDS_IMAGE = require('../screens/auditPro/Images/documents.png');

const getLottieSize = () => {
    const screenWidth = Dimensions.get('window').width;
    return Math.min(screenWidth * 0.44, 280);
};

const NoRecordIllustration = ({ size }) => {
    const [showImageFallback, setShowImageFallback] = useState(false);

    if (showImageFallback) {
        return (
            <Image
                source={NORECORDS_IMAGE}
                resizeMode="contain"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <View
            collapsable={false}
            style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView
                source={NORECORDS_LOTTIE}
                autoPlay
                loop
                resizeMode="contain"
                style={{ width: size, height: size }}
                onAnimationFailure={() => setShowImageFallback(true)}
                {...(Platform.OS === 'android' ? { renderMode: 'SOFTWARE' } : {})}
            />
        </View>
    );
};

const NoRecordFound = () => {
    const size = getLottieSize();

    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: size + SPACING.LARGE * 2,
            }}>
            <NoRecordIllustration size={size} />
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                No Records Found
            </TextComponent>
        </View>
    );
};

export default NoRecordFound;
