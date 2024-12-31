import React from 'react';
import { FONT_SIZE } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';

const IconComponent = ({ style, type, name, size = FONT_SIZE.REGULAR, color = null, onPress }) => {
    const { theme } = useTheme();
    const renderIcons = () => {
        let Icon = null;
        Icon = type;

        return (
            <Icon
                {...{
                    onPress,
                    style,
                    name,
                    size,
                    color: color || theme.mode.textColor,
                }}
            />
        );
    };

    return <>{renderIcons()}</>;
};

export default IconComponent;
