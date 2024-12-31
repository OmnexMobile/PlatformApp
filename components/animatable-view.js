import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { OPACITY_TRANSLATE_ANIMATION } from 'constants/app-constant';

const ViewAnimatable = Animatable.createAnimatableComponent(View);

const AnimatableView = ({
    children,
    style = {},
    index = 1,
    delay = 200,
    animationConfig = OPACITY_TRANSLATE_ANIMATION,
    animation = null,
    duration = 1000,
    ...rest
}) => {
    const viewDelay = delay + (index + 1) * 100;
    return (
        <ViewAnimatable {...{ duration, useNativeDriver: true, animation: animation || animationConfig, delay: viewDelay, style, ...rest }}>
            {children}
        </ViewAnimatable>
    );
};

export default AnimatableView;
