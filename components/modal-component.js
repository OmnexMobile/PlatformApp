import React from 'react';
import Modal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { COLORS } from 'constants/theme-constants';

const ModalComponent = ({
    noStatusBarHeight,
    children,
    modalVisible = false,
    onRequestClose,
    modalBackgroundColor = COLORS.transparent,
    animationTiming = 600,
    onBackdropPress,
    ...rest
}) => (
    <Modal
        {...{
            style: {
                margin: 0,
                paddingTop: noStatusBarHeight ? 0 : getStatusBarHeight(),
                // backgroundColor: modalBackgroundColor,
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
        {children}
    </Modal>
);

export default ModalComponent;
