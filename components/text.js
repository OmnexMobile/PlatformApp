import React from 'react';
import { Text } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Text as MotiText } from 'moti';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { FONT_TYPE, Modes } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const transition = {
    type: 'timing',
    duration: 300,
    easing: Easing.inOut(Easing.ease),
};

const TextComponent = ({ color = null, fontSize = FONT_SIZE.X_SMALL, type, numberOfLines = 3, rupee = null, animate = null, ...rest }) => {
    const { children, style, onPress } = rest;
    const { theme } = useTheme();
    const getFontFamily = type => {
        switch (type) {
            case FONT_TYPE.REGULAR:
                return 'OpenSans-Regular';
            case FONT_TYPE.LIGHT:
                return 'OpenSans-Light';
            case FONT_TYPE.SEMIBOLD:
                return 'OpenSans-Extrabld';
            case FONT_TYPE.BOLD:
                return 'OpenSans-Bold';
            default:
                return 'OpenSans-Light';
        }
    };
    const TextComponent = animate ? MotiText : Text;
    return (
        <TextComponent
            {...{
                numberOfLines,
                ...rest,
                style: [
                    {
                        fontFamily: getFontFamily(type),
                        fontSize,
                        color: color || theme.mode.textColor,
                    },
                    style,
                ],
                ...(animate && { transition }),
            }}>
            {rupee ? `₹` : ''}
            {children}
        </TextComponent>
    );
};

export default TextComponent;

TextComponent.defaultProps = {
    type: FONT_TYPE.REGULAR,
};
