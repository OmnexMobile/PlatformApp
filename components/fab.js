import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import TouchableScale from 'react-native-touchable-scale';
import { ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import ImageComponent from './image-component';
import { IMAGES } from 'assets/images';
import FastImage from 'react-native-fast-image';

const FAB = ({ iconType = ICON_TYPE.AntDesign, iconName = 'plus', bottom = SPACING.NORMAL, ...rest }) => {
    const { theme } = useTheme();
    return (
        <TouchableScale
            style={{
                width: RFPercentage(8),
                height: RFPercentage(8),
                backgroundColor: COLORS.primaryThemeColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                position: 'absolute',
                bottom,
                right: SPACING.NORMAL,
            }}
            {...rest}>
            <LinearGradient
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', borderRadius: 50 }}
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[theme.colors.primaryLightThemeColor, theme.colors.primaryThemeColor]}>
                {/* <IconComponent size={FONT_SIZE.X_LARGE} type={iconType} name={iconName} color={COLORS.whiteGrey} /> */}
                <ImageComponent style={{ height: 35, width: 35 }} source={IMAGES.allProjects} resizeMode={FastImage.resizeMode.contain} />
            </LinearGradient>
        </TouchableScale>
    );
};

export default FAB;
