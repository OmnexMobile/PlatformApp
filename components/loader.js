import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LOTTIE_FILE } from 'assets/lottie';
import { Content, LottieAnimation, TextComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const Loader = ({ transparent, absolute, loadingText = '', file = LOTTIE_FILE.Loader }) => {
    const { theme } = useTheme();
    return (
        <Content
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                ...(absolute && { position: 'absolute', top: 1, right: 0, bottom: 0, left: 0, zIndex: 100 }),
                backgroundColor: transparent ? COLORS.transparentGrey : theme.mode.backgroundColor,
            }}>
            <View
                style={{
                    height: RFPercentage(25),
                    width: RFPercentage(25),
                }}>
                <LottieAnimation file={LOTTIE_FILE.Loader} />
            </View>
            {loadingText ? (
                <View
                    style={{
                        alignItems: 'center',
                    }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{loadingText},</TextComponent>
                    <TextComponent type={FONT_TYPE.BOLD}>Please wait...</TextComponent>
                </View>
            ) : null}
        </Content>
    );
};
export default Loader;
