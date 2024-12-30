import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';

const DropdownComponent = ({ name, label, value, onChange, data = [], required = false, containerStyle = {}, editable = true }) => {
    const { theme } = useTheme();
    return (
        <View
            style={[
                {
                    padding: SPACING.NORMAL,
                    backgroundColor: theme.mode.backgroundColor,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.XX_SMALL,
                },
                containerStyle,
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={[styles.selectedTextStyle, { color: theme.mode.textColor }]}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search={false}
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
        // padding: SPACING.NORMAL,
        // borderWidth: 1,
        // margin: 16,
        // height: 50,
    },
    icon: {
        // marginRight: 5,
    },
    placeholderStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.searchText,
    },
    selectedTextStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
        // color: COLORS.themeBlack,
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
