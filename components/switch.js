import React, { useMemo, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { View as MotiView, useAnimationState } from 'moti';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'react-native-responsive-fontsize';

const transition = {
    type: 'timing',
    duration: 300,
    easing: Easing.inOut(Easing.ease),
};

const SwitchComponent = ({ size = RFPercentage(3), onPress, isActive = false }) => {
    // const animationState = useAnimationState({
    // 	from: {
    // 		backgroundColor: COLORS.whiteGrey,
    // 	},
    // 	to: {
    // 		backgroundColor: COLORS.green,
    // 	},
    // });

    // useEffect(() => {
    // 	isActive ? animationState.transitionTo('to') : animationState.transitionTo('from');
    // }, [isActive]);

    const { trackWidth, trackHeight, knobSize } = useMemo(() => {
        return { trackWidth: size * 1.5, trackHeight: size * 0.4, knobSize: size * 0.6 };
    }, [size]);
    return (
        <Pressable onPress={onPress} style={{ alignSelf: 'flex-start' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MotiView
                    transition={transition}
                    animate={{
                        backgroundColor: isActive ? COLORS.primaryThemeColor : COLORS.whiteGrey,
                    }}
                    style={{
                        position: 'absolute',
                        width: trackWidth,
                        height: trackHeight,
                        borderRadius: trackHeight / 2,
                        // backgroundColor: COLORS.primaryThemeColor,
                    }}
                    // state={animationState}
                />
                <MotiView
                    transition={transition}
                    animate={{
                        translateX: isActive ? trackWidth / 4 : -trackWidth / 4,
                    }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                    <MotiView
                        transition={transition}
                        animate={{
                            width: isActive ? 0 : knobSize,
                            borderColor: isActive ? COLORS.primaryThemeColor : COLORS.whiteGrey,
                        }}
                        style={{
                            width: knobSize,
                            height: knobSize,
                            borderRadius: knobSize / 2,
                            borderWidth: size * 0.1,
                            borderColor: COLORS.red,
                        }}
                    />
                </MotiView>
            </View>
        </Pressable>
    );
};
export default SwitchComponent;
