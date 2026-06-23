import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { getContentBottomInset } from 'helpers/safe-area';

const Content = ({ children, noPadding = false, scroll = false, style = {}, contentContainerStyle = {}, ...rest }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const topInset = insets.top;
    const bottomInset = getContentBottomInset(insets);
    const Component = scroll ? ScrollView : View;
    return (
        <Component
            {...{
                ...(scroll
                    ? {
                          contentContainerStyle: {
                              flexGrow: 1,
                              padding: SPACING.NORMAL,
                              backgroundColor: theme.mode.backgroundColor,
                              paddingTop: topInset,
                              paddingBottom: bottomInset,
                              ...contentContainerStyle,
                              ...style,
                              ...(noPadding && { padding: 0, paddingTop: 0, paddingBottom: 0 }),
                          },
                          style: {
                              flex: 1,
                              ...style,
                          },
                          scrollIndicatorInsets: { right: 1 },
                      }
                    : {
                          style: {
                              flex: 1,
                              backgroundColor: theme.mode.backgroundColor,
                              padding: SPACING.NORMAL,
                              paddingTop: topInset,
                              paddingBottom: bottomInset,
                              ...style,
                              ...(noPadding && { padding: 0, paddingTop: 0, paddingBottom: 0 }),
                          },
                      }),
                ...(noPadding && { padding: 0 }),
            }}
            {...rest}>
            {children}
        </Component>
    );
};

export default Content;
