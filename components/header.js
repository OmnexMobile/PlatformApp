import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import IconComponent from './icon-component';
import { RFPercentage } from 'helpers/utils';

const Header = ({ title, leftIcon = null, rightIcon = null, back = true, rightIconClick, handleBackClick = null }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const handleLeftIconClick = () => {
        console.log('clicked');
        if (back) {
            if (handleBackClick) {
                handleBackClick();
            } else {
                navigation?.goBack();
            }
        } else {
            navigation.openDrawer();
        }
    };
    return (
        <View
            style={[
                styles.headerContainer,
                {
                    backgroundColor: theme.mode.backgroundColor,
                    borderBottomColor: theme.mode.borderColor,
                },
            ]}>
            {leftIcon || back ? (
                <TouchableOpacity activeOpacity={0.3} onPress={handleLeftIconClick} style={styles.leftIconContainer}>
                    <IconComponent
                        name={back ? 'arrowleft' : 'arrowleft'}
                        type={ICON_TYPE.AntDesign}
                        color={theme.colors.primaryThemeColor}
                        size={25}
                    />
                </TouchableOpacity>
            ) : null}
            <View style={{ flex: 8, alignItems: 'center', paddingHorizontal: SPACING.X_LARGE }}>
                <TextComponent numberOfLines={1} style={{ fontSize: 20 }} type={FONT_TYPE.BOLD}>
                    {title}
                </TextComponent>
            </View>
            <View style={styles.rightIconContainer}>
                {rightIcon ? (
                    <TouchableOpacity activeOpacity={0.3} onPress={rightIconClick}>
                        <IconComponent type={ICON_TYPE.Entypo} name={rightIcon} color={theme.colors.primaryThemeColor} size={25} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        minHeight: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingHorizontal: SPACING.NORMAL,
        // marginBottom: RFPercentage(1),
    },
    leftIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        flex: 1,
    },
    rightIconContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
