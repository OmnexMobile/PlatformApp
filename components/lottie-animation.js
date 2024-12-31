import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LOTTIE_FILE } from '../assets/lottie';

export default function LottieAnimation({ file = LOTTIE_FILE.Loader, loop = true, autoPlay = true }) {
    return (
        <View style={{ flex: 1 }}>
            <LottieView {...{ loop, autoPlay, source: file }} />
        </View>
    );
}
