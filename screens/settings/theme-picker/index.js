import React from 'react';
import { BounceableView, Content, GradientButton, Header, TextComponent } from 'components';
import { useNavigation } from '@react-navigation/native';
import { LayoutAnimation, Platform, TouchableOpacity, UIManager, View } from 'react-native';
import { RFPercentage } from 'helpers/utils';
import { COLORS, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, MODES, THEMES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const ThemePicker = ({}) => {
    const { theme, handleChangeTheme, handleChangeMode } = useTheme();
    const navigation = useNavigation();

    React.useEffect(() => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }, [theme.selectedMode]);

    return (
        <Content noPadding>
            <Header title="Pick your theme" />
            <Content>
                <View style={{ flex: 1 }}>
                    <View>
                        <TextComponent type={FONT_TYPE.BOLD}>Themes</TextComponent>
                        <View style={{ padding: SPACING.NORMAL, flexDirection: 'row', paddingBottom: SPACING.LARGE, paddingLeft: 0 }}>
                            {THEMES.map((themeObj, index) => (
                                <View
                                    key={index}
                                    style={{
                                        ...(theme.selectedColor === themeObj?.label && { borderWidth: 1 }),
                                        marginRight: SPACING.SMALL,
                                        borderColor: theme.selectedColor === themeObj?.label ? theme.colors.primaryThemeColor : COLORS.white,
                                        borderRadius: 100,
                                        padding: SPACING.X_SMALL,
                                        width: RFPercentage(6),
                                        height: RFPercentage(6),
                                    }}>
                                    <BounceableView
                                        activeOpacity={1}
                                        style={{
                                            backgroundColor: themeObj?.value,
                                            borderRadius: 100,
                                            flex: 1,
                                            shadowColor: '#000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,
                                        }}
                                        onPress={() => handleChangeTheme(themeObj?.label)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                    <View>
                        <TextComponent type={FONT_TYPE.BOLD}>Modes</TextComponent>
                        <View style={{ padding: SPACING.NORMAL, flexDirection: 'row', paddingLeft: 0 }}>
                            {MODES.map((themeObj, index) => (
                                <View key={index} style={{ alignItems: 'center', marginRight: SPACING.SMALL }}>
                                    <View
                                        style={{
                                            ...(theme.selectedMode === themeObj?.label && { borderWidth: 1 }),
                                            borderColor: theme.selectedMode === themeObj?.label ? theme.colors.primaryThemeColor : COLORS.white,
                                            borderRadius: 100,
                                            padding: SPACING.X_SMALL,
                                            width: RFPercentage(6),
                                            height: RFPercentage(6),
                                        }}>
                                        <BounceableView
                                            activeOpacity={0.8}
                                            style={{
                                                backgroundColor: themeObj?.value,
                                                borderRadius: 100,
                                                flex: 1,
                                                shadowColor: '#000',
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                elevation: 5,
                                            }}
                                            onPress={() => handleChangeMode(themeObj?.label)}
                                        />
                                    </View>
                                    <TextComponent type={FONT_TYPE.BOLD} style={{ paddingVertical: SPACING.SMALL }}>
                                        {themeObj?.label}
                                    </TextComponent>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <GradientButton onPress={() => navigation.goBack()}>Submit & Proceed</GradientButton>
            </Content>
        </Content>
    );
};

export default ThemePicker;
