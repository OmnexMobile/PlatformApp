import React, { useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
    interpolateColor,
    runOnJS,
} from 'react-native-reanimated';
import { COLORS } from 'constants/theme-constants';
import strings from 'config/localization';
import { RFValue } from 'helpers/utils';
import useTheme from 'theme/useTheme';
// import TextComponent from './text';

const BUTTON_WIDTH = RFPercentage(50);
// const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = RFPercentage(9);
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SwipeButton = ({ onToggle }) => {
    const { theme } = useTheme();
    // Animated value for X translation
    const X = useSharedValue(0);
    // Toggled State
    const [toggled, setToggled] = useState(false);

    // Fires when animation ends
    const handleComplete = isToggled => {
        if (isToggled !== toggled) {
            setToggled(isToggled);
            onToggle?.(isToggled);
        }
    };

    // Gesture Handler Events
    const animatedGestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.completed = toggled;
        },
        onActive: (e, ctx) => {
            let newValue;
            if (ctx.completed) {
                newValue = H_SWIPE_RANGE + e.translationX;
            } else {
                newValue = e.translationX;
            }

            if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
                X.value = newValue;
            }
        },
        onEnd: () => {
            if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
                X.value = withSpring(0);
                runOnJS(handleComplete)(false);
            } else {
                X.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)(true);
            }
        },
    });

    const InterpolateXInput = [0, H_SWIPE_RANGE];
    const AnimatedStyles = {
        swipeCont: useAnimatedStyle(() => {
            return {};
        }),
        colorWave: useAnimatedStyle(() => {
            return {
                width: H_WAVE_RANGE + X.value,

                opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
            };
        }),
        swipeable: useAnimatedStyle(() => {
            return {
                backgroundColor: interpolateColor(
                    X.value,
                    [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
                    [theme.colors.primaryThemeColor, COLORS.white],
                ),
                transform: [{ translateX: X.value }],
            };
        }),
        swipeText: useAnimatedStyle(() => {
            return {
                opacity: interpolate(X.value, InterpolateXInput, [0.7, 0], Extrapolate.CLAMP),
                transform: [
                    {
                        translateX: interpolate(X.value, InterpolateXInput, [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS], Extrapolate.CLAMP),
                    },
                ],
            };
        }),
    };

    return (
        <Animated.View
            style={[
                styles.swipeCont,
                {
                    backgroundColor: theme.mode.backgroundColor,
                    //  borderColor: theme.colors.primaryLightThemeColor
                },
                AnimatedStyles.swipeCont,
            ]}>
            <AnimatedLinearGradient
                style={[AnimatedStyles.colorWave, styles.colorWave]}
                colors={[theme.colors.primaryLightThemeColor, theme.colors.primaryDarkThemeColor]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            />
            <PanGestureHandler onGestureEvent={animatedGestureHandler}>
                <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>{/* <TextComponent>Swipe</TextComponent> */}</Animated.View>
            </PanGestureHandler>
            <Animated.View>
                <Animated.Text style={[styles.swipeText, { color: theme.colors.primaryThemeColor }, AnimatedStyles.swipeText]}>
                    {strings.Swipe}
                </Animated.Text>
                <Animated.Text style={[styles.swipeText, { color: theme.colors.primaryThemeColor }, AnimatedStyles.swipeText]}>
                    {strings.unlock}
                </Animated.Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    swipeCont: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        // backgroundColor: '#fff',
        borderRadius: BUTTON_HEIGHT,
        padding: BUTTON_PADDING,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.whiteGrey,
        alignSelf: 'center',
    },
    colorWave: {
        position: 'absolute',
        left: 0,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
    },
    swipeable: {
        position: 'absolute',
        left: BUTTON_PADDING,
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS,
        zIndex: 3,
    },
    swipeText: {
        alignSelf: 'center',
        fontSize: RFValue(12),
        zIndex: 2,
        fontFamily: 'ProximaNova-Bold',
    },
});

export default SwipeButton;
