import React from 'react';
import Modal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { COLORS } from 'constants/theme-constants';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from 'theme/useTheme';

const ModalComponent = ({
    noStatusBarHeight,
    children,
    modalVisible = false,
    onRequestClose,
    modalBackgroundColor = COLORS.transparent,
    animationTiming = 600,
    onBackdropPress,
    showPrimaryColorOnTop = false,
    ...rest
}) => {
    const { theme } = useTheme();
    return (
        <Modal
            {...{
                style: {
                    margin: 0,
                    paddingTop: noStatusBarHeight ? 0 : getStatusBarHeight(),
                    // backgroundColor: theme.mode.backgroundColor,
                    ...(showPrimaryColorOnTop && { backgroundColor: theme.colors.primaryThemeColor }),
                },
                isVisible: modalVisible,
                statusBarTranslucent: true,
                transparent: true,
                backdropOpacity: 0.8,
                hideModalContentWhileAnimating: true,
                backdropColor: modalBackgroundColor,
                // animationIn: 'slideInUp',
                // animationOut: 'slideOutDown',
                // animationInTiming: animationTiming,
                // animationOutTiming: animationTiming,
                // backdropTransitionInTiming: 600,
                // backdropTransitionOutTiming: 600,
                onRequestClose,
                onBackdropPress,
                onBackButtonPress: onRequestClose,
                ...rest,
            }}>
            <View style={{ flex: 1, paddingTop: useSafeAreaInsets().top }}>{children}</View>
        </Modal>
    );
};

export default ModalComponent;
