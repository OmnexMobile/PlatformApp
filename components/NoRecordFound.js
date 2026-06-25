<<<<<<< HEAD
import React, { useState } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
=======
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
>>>>>>> 8c2370e (downloads screen and bug fix.)
import LottieView from 'lottie-react-native';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

<<<<<<< HEAD
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

=======
const NoRecordFound = ({
    title = 'No Records Found',
    subtitle,
}) => {
    const { width } = useWindowDimensions();
    const size = Math.min(width * 0.44, 280);

>>>>>>> 8c2370e (downloads screen and bug fix.)
    return (
        <View
            style={{
                padding: SPACING.NORMAL,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: size + SPACING.LARGE * 2,
            }}>
<<<<<<< HEAD
            <NoRecordIllustration size={size} />
=======
            <View style={{ width: size, height: size }}>
                <LottieView
                    source={require('../assets/lottie/norecords.json')}
                    loop
                    autoPlay
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
>>>>>>> 8c2370e (downloads screen and bug fix.)
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                {title}
            </TextComponent>
            {subtitle ? (
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                    {subtitle}
                </TextComponent>
            ) : null}
        </View>
    );
};

export default NoRecordFound;
