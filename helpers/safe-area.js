import { Platform } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const FOOTER_BAR_HEIGHT = 70;
export const MIN_ANDROID_BOTTOM_INSET = 6;

export function getAndroidBottomInset(insets) {
    if (Platform.OS !== 'android') {
        return 0;
    }

    const bottom = insets?.bottom ?? initialWindowMetrics?.insets?.bottom ?? 0;
    return Math.max(MIN_ANDROID_BOTTOM_INSET, bottom);
}

/** Content padding: Android is handled by AndroidBottomSafeArea at the root. */
export function getContentBottomInset(insets) {
    return Platform.OS === 'android' ? 0 : insets?.bottom ?? 0;
}

export function getAbsoluteFooterStyle(style, inset, footerHeight = FOOTER_BAR_HEIGHT) {
    if (!inset) {
        return style;
    }

    return [
        style,
        {
            height: footerHeight + inset,
            paddingBottom: inset,
        },
    ];
}
