import React, { useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

const NoRecordFound = () => {
    const lottieRef = useRef(null);
    const { width } = useWindowDimensions();
    const size = Math.min(width * 0.44, 280);

    const handleLayout = () => {
        setTimeout(() => {
            lottieRef.current?.play();
        }, 50);
    };

    return (
        <View
            onLayout={handleLayout}
            style={{
                padding: SPACING.NORMAL,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: size + SPACING.LARGE * 2,
            }}>
            <View style={{ width: size, height: size }}>
                <LottieView
                    ref={lottieRef}
                    source={require('../assets/lottie/norecords.json')}
                    loop
                    autoPlay={false}
                    cacheComposition={false}
                    cacheStrategy="none"
                    renderMode="SOFTWARE"
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                No Records Found
            </TextComponent>
        </View>
    );
};

export default NoRecordFound;
