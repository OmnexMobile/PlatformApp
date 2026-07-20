import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const DropdownComponent = ({
    name,
    label,
    value,
    onChange,
    data = [],
    required = false,
    error = false,
    containerStyle = {},
    labelStyle = {},
    selectedTextStyle = {},
    placeholderStyle = {},
    dropdownContainerStyle = {},
    editable = true,
    search = false,
    dropdownRef,
}) => {
    const { theme } = useTheme();
    return (
        <View
            style={[
                {
                    padding: SPACING.NORMAL,
                    backgroundColor: theme.mode.backgroundColor,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.X_SMALL,
                },
                containerStyle,
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent
                    style={[{ fontSize: FONT_SIZE.SMALL }, labelStyle]}
                    type={FONT_TYPE.BOLD}
                    color={error ? COLORS.ERROR : COLORS.themeBlack}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <Dropdown
                ref={dropdownRef}
                style={[styles.dropdown, error ? styles.dropdownError : null]}
                placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
                selectedTextStyle={[styles.selectedTextStyle, { color: COLORS.themeBlack }, selectedTextStyle]}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search={search}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={`Select ${label}`}
                searchPlaceholder="Search..."
                value={value}
                disable={!editable}
                onChange={item => {
                    onChange?.(item.value);
                }}
                containerStyle={{
                    zIndex: 1000,
                    elevation: 10,
                    marginTop: Platform.OS === 'android' ? 4 : 0,
                    ...dropdownContainerStyle,
                }}
                selectedTextProps={{ numberOfLines: 1 }}
                //  backgroundColor={COLORS.primaryLightTransparentThemeColor}
                renderItem={(item, selected) => (
                    <View
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                            padding: SPACING.NORMAL,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <TextComponent
                            style={{ fontSize: FONT_SIZE.NORMAL }}
                            color={COLORS.themeBlack}
                            {...{
                                ...(selected && { type: FONT_TYPE.BOLD }),
                            }}>
                            {item?.label?.toString()}
                        </TextComponent>
                    </View>
                )}
                // renderLeftIcon={() => <IconComponent type={ICON_TYPE.AntDesign} style={styles.icon} color="black" name="Safety" size={20} />}
            />
        </View>
    );
};
export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        borderBottomWidth: 1,
        borderColor: COLORS.whiteGrey,
        paddingVertical: SPACING.SMALL,
        // borderWidth: 1,
        // margin: 16,
        // height: 50,
    },
    dropdownError: {
        borderColor: COLORS.ERROR,
    },
    icon: {
        // marginRight: 5,
    },
    placeholderStyle: {
        fontSize: FONT_SIZE.NORMAL,
        fontFamily: 'OpenSans-Regular',
        color: '#5C5C5C',
    },
    selectedTextStyle: {
        fontSize: FONT_SIZE.NORMAL,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.themeBlack,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: FONT_SIZE.NORMAL,
        color: COLORS.searchText,
    },
});
