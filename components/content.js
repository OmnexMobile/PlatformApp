import React from 'react';
import { ScrollView, View } from 'react-native';
import useTheme from 'theme/useTheme';
import { SPACING } from 'constants/theme-constants';

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
                          },
                          scrollIndicatorInsets: { right: 1 },
                      }
                    : { style: { flex: 1, backgroundColor: theme.mode.backgroundColor, padding: SPACING.NORMAL, ...style } }),
                ...(noPadding && { padding: 0 }),
            }}
            {...rest}>
            {children}
        </Component>
    );
};

export default Content;
