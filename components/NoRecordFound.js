import React, { useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

const NoRecordFound = () => {
    const lottieRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const { width } = useWindowDimensions();
    const size = width * 0.44;

    // Triggered when the View container is physically rendered
    const handleLayout = () => {
        setIsLayoutReady(true);
        // Smallest possible delay to ensure the ref is attached
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
                flex: 1,
            }}>
            <View style={{ width: size, height: size }}>
                    <AnimatedLottieView
                        ref={lottieRef}
                        source={require('../assets/lottie/norecords.json')}
                        loop
                        autoPlay={false} // We control it manually
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