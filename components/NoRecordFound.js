import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, View, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

const NORECORDS_LOTTIE = require('../assets/lottie/norecords.json');
const NORECORDS_IMAGE = require('../screens/auditPro/Images/emptybox.png');

const NoRecordIllustration = ({ size }) => {
    const [showImageFallback, setShowImageFallback] = useState(false);
    const lottieRef = useRef(null);

    useEffect(() => {
        if (!showImageFallback) {
            lottieRef.current?.play?.();
        }
    }, [showImageFallback]);

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
                ref={lottieRef}
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

const NoRecordFound = ({
    title = 'No Records Found',
    subtitle,
}) => {
    const { width } = useWindowDimensions();
    const size = Math.min(width * 0.44, 280);

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
