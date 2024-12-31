import React from 'react';
// import { Platform } from 'react-native';
import { COLORS, SPACING } from 'constants/theme-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useTheme from 'theme/useTheme';

const basicStyles = {
    flex: 1,
    backgroundColor: COLORS.transparent,
    padding: SPACING.NORMAL,
    flexGrow: 1,
};

const KeyboardAwareScrollViewComponent = ({ children, style = {}, noPadding = false, extraScrollHeight = 0, ...rest }) => {
    const { theme } = useTheme();
    return (
        <KeyboardAwareScrollView
            // extraHeight={100}
            // extraScrollHeight={Platform.OS === 'android' ? 0 : extraScrollHeight}
            // automaticallyAdjustContentInsets={true}
            // style={{ ...basicStyles }}
            contentContainerStyle={[{ ...basicStyles, ...style, ...(noPadding && { padding: 0 }) }, 
                // need image with transparent background
                // { backgroundColor: theme.mode.backgroundColor }
            ]}
            {...rest}>
            {children}
        </KeyboardAwareScrollView>
    );
};
export default KeyboardAwareScrollViewComponent;
