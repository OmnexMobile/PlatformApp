import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../assets/images';
import { AnimatableView, Content, ImageComponent, SwipeButton } from '../../components';
import { OPACITY_TRANSLATE_Y_ANIMATION, ROUTES } from '../../constants/app-constant';
import { RFPercentage } from '../../helpers/utils';
import useTheme from '../../theme/useTheme';
import { SPACING } from '../../constants/theme-constants';

const LaunchScreen = ({}) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    return (
        <Content noPadding>
            <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={500} style={styles.topArea}>
                <ImageComponent source={IMAGES.omnexLogo} resizeMode="contain" style={{ height: RFPercentage(10), width: '100%' }} />
            </AnimatableView>
            <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={800} style={{ paddingBottom: SPACING.NORMAL }}>
                <ImageComponent source={IMAGES.bg_image_human} resizeMode="contain" style={{ height: RFPercentage(50), width: '100%' }} />
            </AnimatableView>
            <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={1200} style={{ paddingVertical: SPACING.NORMAL }}>
                <SwipeButton
                    onToggle={value =>
                        value &&
                        navigation.reset({
                            index: 0,
                            // routes: [{ name: ROUTES.HOME }],
                            routes: [{ name: ROUTES.HOME_FAB_VIEW }],
                        })
                    }
                    // onToggle={handleToggle}
                />
            </AnimatableView>
            <AnimatableView animationConfig={OPACITY_TRANSLATE_Y_ANIMATION} delay={1500} style={{ paddingVertical: SPACING.LARGE }}>
                {/* <ImageComponent source={IMAGES.apqp_ppap_manager} resizeMode="contain" style={{ height: RFPercentage(4), width: '100%' }} /> */}
            </AnimatableView>
        </Content>
    );
};

export default LaunchScreen;

const styles = StyleSheet.create({
    icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topArea: { flex: 4, alignItems: 'center', justifyContent: 'center' },
});
