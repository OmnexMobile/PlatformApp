import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';

const Content = ({ children, noPadding = false, scroll = false, style = {}, contentContainerStyle = {}, ...rest }) => {
    const { theme } = useTheme();
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
                              ...contentContainerStyle,
                              ...(noPadding && { padding: 0 }),
                              paddingTop: useSafeAreaInsets().top,
                              ...style,
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
                              ...style,
                              paddingTop: useSafeAreaInsets().top,
                              ...(noPadding && { padding: 0 }),
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
