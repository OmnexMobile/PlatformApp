import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import IconComponent from './icon-component';

const Header = ({ title, leftIcon = null, rightIcon = null, back = true, rightIconClick, handleBackClick = null, backState }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    onNavigationToBack = () => {
      console.log('click go back')
      navigation?.goBack()
    }

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
                <TouchableOpacity
                    // activeOpacity={0.8}
                    onPress={() => { backState ? onNavigationToBack() :
                        back ? handleBackClick ? handleBackClick() : navigation?.goBack() : navigation.openDrawer()
                    }}
                    hitSlop={{top: 20, bottom: 20, left: 100, right: 100}}
                    style={styles.leftIconContainer}>
                    <IconComponent
                        name={back ? 'arrowleft' : 'arrowleft'}
                        type={ICON_TYPE.AntDesign}
                        color={theme.colors.primaryThemeColor}
                        size={25}
                    />
                </TouchableOpacity>
            ) : null}
            <TextComponent style={{ fontSize: 20 }} type={FONT_TYPE.BOLD}>
                {title}
            </TextComponent>
            {rightIcon ? (
                <View style={styles.rightIconContainer}>
                    <IconComponent
                        onPress={rightIconClick}
                        type={ICON_TYPE.Entypo}
                        name={rightIcon}
                        color={theme.colors.primaryThemeColor}
                        size={25}
                    />
                </View>
            ) : null}
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
        height: '100%',
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: SPACING.SMALL,
    },
    rightIconContainer: { height: '100%', width: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: 0 },
});
