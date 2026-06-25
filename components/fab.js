import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import TouchableScale from 'react-native-touchable-scale';
import { FONT_TYPE, ICON_TYPE, OPACITY_TRANSLATE_Y_ANIMATION } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import AnimatableView from './animatable-view';
import TextComponent from './text';

export const FAB_SIZE = RFPercentage(8);

const FAB = ({
    iconType = ICON_TYPE.AntDesign,
    iconName = 'plus',
    bottom = SPACING.NORMAL,
    right = SPACING.NORMAL,
    text = '',
    color = null,
    badge = null,
    floating = true,
    ...rest
}) => {
    const { theme } = useTheme();
    const buttonColor = color || theme.colors.primaryThemeColor;
    const size = FAB_SIZE;

    return (
        <AnimatableView
            {...{
                animationConfig: OPACITY_TRANSLATE_Y_ANIMATION,
                duration: 300,
            }}>
            <TouchableScale
                style={{
                    width: size,
                    height: size,
                    backgroundColor: COLORS.primaryThemeColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    ...(floating
                        ? {
                              position: 'absolute',
                              bottom,
                              right,
                          }
                        : null),
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                {...rest}>
                <LinearGradient
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', borderRadius: 50 }}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[buttonColor, buttonColor]}>
                    <IconComponent size={FONT_SIZE.X_LARGE} type={iconType} name={iconName} color={COLORS.whiteGrey} />
                    {badge ? (
                        <React.Fragment>
                            <View
                                pointerEvents="none"
                                style={{
                                    position: 'absolute',
                                    top: RFPercentage(0.5),
                                    right: RFPercentage(0.5),
                                }}>
                                <IconComponent size={FONT_SIZE.SMALL} color="red" {...badge} />
                            </View>
                        </React.Fragment>
                    ) : null}
                    {text && (
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.X_SMALL} color={COLORS.whiteGrey}>
                            {text}
                        </TextComponent>
                    )}
                </LinearGradient>
            </TouchableScale>
        </AnimatableView>
    );
};

export default FAB;
