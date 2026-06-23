import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOOTER_BAR_HEIGHT, getAndroidBottomInset } from 'helpers/safe-area';

/**
 * Wraps a bottom action bar so it clears the Android system navigation area.
 * Prefer the root AndroidBottomSafeArea wrapper; use this for modals or
 * screens rendered outside the main navigation tree.
 */
const SafeBottomBar = ({ children, style, footerHeight = FOOTER_BAR_HEIGHT }) => {
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === 'android' ? getAndroidBottomInset(insets) : insets.bottom;

    return (
        <View
            style={[
                style,
                bottomInset > 0 && {
                    paddingBottom: bottomInset,
                    minHeight: footerHeight + bottomInset,
                },
            ]}>
            {children}
        </View>
    );
};

export default SafeBottomBar;
