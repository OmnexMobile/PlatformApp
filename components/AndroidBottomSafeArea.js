import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAndroidBottomInset } from 'helpers/safe-area';

const AndroidBottomSafeArea = ({ children, style }) => {
    const insets = useSafeAreaInsets();
    const bottomInset = getAndroidBottomInset(insets);

    return (
        <View
            style={[
                { flex: 1 },
                Platform.OS === 'android' && bottomInset > 0 && { paddingBottom: bottomInset },
                style,
            ]}>
            {children}
        </View>
    );
};

export default AndroidBottomSafeArea;
