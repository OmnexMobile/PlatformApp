import React from 'react';
import { View } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import TextComponent from './text';

const Tag = ({
    text,
}) => (
    <View
        style={{
            alignSelf: 'flex-start',
            paddingVertical: SPACING.X_SMALL,
            paddingHorizontal: SPACING.NORMAL,
            backgroundColor: COLORS.primaryThemeColor,
            borderRadius: SPACING.NORMAL,
            marginRight: SPACING.SMALL,
        }}>
        <TextComponent color={COLORS.white} fontSize={FONT_SIZE.X_SMALL} type={FONT_TYPE.BOLD}>
            {text}
        </TextComponent>
    </View>
);

export default Tag;