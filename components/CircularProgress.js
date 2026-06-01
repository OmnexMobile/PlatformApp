import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = forwardRef(({
    value = 0,
    radius = 60,
    duration = 800,
    valueSuffix = '%',
    inActiveStrokeWidth = 10,
    activeStrokeWidth = 10,
    activeStrokeColor = '#00BFFF',
    inActiveStrokeColor = '#e0e0e0',
}, ref) => {

    const circumference = 2 * Math.PI * radius;
    const progress = useSharedValue(0);
    const size = (radius + Math.max(activeStrokeWidth, inActiveStrokeWidth)) * 2;
    const center = size / 2;

    // ✅ Expose ref methods like original library
    useImperativeHandle(ref, () => ({
        play: () => {
            progress.value = withTiming(value / 100, { duration });
        },
        pause: () => {
            // handle pause if needed
        },
        reset: () => {
            progress.value = withTiming(0, { duration: 300 });
        },
    }));

    useEffect(() => {
        progress.value = withTiming(value / 100, { duration });
    }, [value, duration]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                {/* Background inactive circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={inActiveStrokeColor}
                    strokeWidth={inActiveStrokeWidth}
                    fill="none"
                />
                {/* Animated active circle */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={activeStrokeColor}
                    strokeWidth={activeStrokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${center}, ${center}`}
                />
            </Svg>
            {/* Center Text */}
            <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={{ fontSize: radius * 0.35, fontWeight: 'bold', color: '#000' }}>
                    {`${Math.round(value)}${valueSuffix}`}
                </Text>
            </View>
        </View>
    );
});

export default CircularProgress;