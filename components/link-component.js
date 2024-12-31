import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import TextComponent from './text';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import { openLink } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';

const LinkComponent = ({ input }) => {
    const { theme } = useTheme();
    const { appSettings } = useAppContext();
    const CREATE_PROJECT_URL = appSettings?.deviceStatusSettings?.InstanceUrl || '';
    const url = `${CREATE_PROJECT_URL}${input?.masterurl}`;
    console.log('🚀 ~ LinkComponent ~ url:', url);
    return (
        <View
            style={{
                paddingHorizontal: SPACING.NORMAL,
            }}>
            <View
                style={{
                    borderRadius: 5,
                }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {input?.label}
                </TextComponent>
                <TouchableOpacity activeOpacity={1} onPress={() => openLink(url, theme.colors.primaryThemeColor)}>
                    <TextComponent
                        color={theme.colors.primaryThemeColor}
                        style={{ fontSize: FONT_SIZE.SMALL, textDecorationLine: 'underline' }}
                        type={FONT_TYPE.BOLD}>
                        Open Link
                    </TextComponent>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LinkComponent;
