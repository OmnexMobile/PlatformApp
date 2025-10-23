import React from 'react';
import { Text } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Text as MotiText } from 'moti';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const transition = {
    type: 'timing',
    duration: 300,
    easing: Easing.inOut(Easing.ease),
};

const TextComponent = ({
    color = null,
    fontSize = FONT_SIZE.REGULAR,
    type = FONT_TYPE.REGULAR, // default value
    numberOfLines = 3,
    rupee = null,
    animate = null,
    style,
    children,
    ...rest
}) => {
    const { theme } = useTheme();

    const getFontFamily = type => {
        switch (type) {
            case FONT_TYPE.REGULAR:
                return 'ProximaNova-Regular';
            case FONT_TYPE.LIGHT:
                return 'ProximaNova-Light';
            case FONT_TYPE.SEMIBOLD:
                return 'ProximaNova-Extrabld';
            case FONT_TYPE.BOLD:
                return 'ProximaNova-Bold';
            default:
                return 'ProximaNova-Light';
        }
    };

    const TextComp = animate ? MotiText : Text;

    return (
        <TextComp
            {...rest}
            numberOfLines={numberOfLines}
            style={[
                {
                    fontFamily: getFontFamily(type),
                    fontSize,
                    color: color || theme.mode.textColor,
                },
                style,
            ]}
            {...(animate && { transition })}
        >
            {rupee ? `₹` : ''}
            {children}
        </TextComp>
    );
};

export default TextComponent;
