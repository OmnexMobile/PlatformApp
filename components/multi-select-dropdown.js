import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export const WrapperMultiSelectDropdownComponent = ({ input, handleInputChange }) => {
    const [data, setData] = useState([]);
    const { sites } = useAppContext();

    const getData = async SiteID => {
        try {
            const formData = new FormData();
            formData.append(APP_VARIABLES.SITE_ID, SiteID);
            formData.append(APP_VARIABLES.DropDownID, input?.formelementID);
            formData.append(APP_VARIABLES.IsDynamic, input?.dynamic);
            const res = await postAPI(`${API_URL.GET_CUSTOM_DROPDOWN}`, formData);
            setData(
                (res?.Data || [])?.map(data => ({
                    label: data?.Text,
                    value: data?.Value,
                })),
            );
        } catch (err) {}
    };

    useEffect(() => {
        getData(sites?.selectedSite?.Siteid);
    }, [sites?.selectedSite?.Siteid]);

    return <MultiSelectDropdownComponent {...{ ...input, data, onChange: value => handleInputChange?.(input?.name, value) }} />;
};

const MultiSelectDropdownComponent = ({
    name,
    label,
    value = [],
    onChange,
    data = [],
    required = false,
    containerStyle = {},
    editable = true,
    search = false,
    multiSelect = true,
}) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selectedItems = data.filter(item => value.includes(item.value));

    const handleSelectionChange = useCallback(
        selectedItems => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onChange?.(selectedItems);
        },
        [onChange],
    );

    const handleClearAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onChange?.([]);
    };

    const handleRemoveItem = valueToRemove => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updated = value.filter(val => val !== valueToRemove);
        onChange?.(updated);
    };

    const backgroundColor = editable ? theme.mode.backgroundColor : theme.mode.disabledBackgroundColor;

    return (
        <View style={[styles.container(backgroundColor), containerStyle]}>
            <View style={styles.labelRow}>
                <TextComponent style={styles.labelText} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={styles.requiredMark} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
                {multiSelect && value.length > 0 && editable && (
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                        <MaterialIcons name="clear" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                )}      
            </View>

            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={[styles.selectedTextStyle, { color: theme.mode.textColor }]}
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
                onChange={handleSelectionChange}
                disable={!editable}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                renderSelectedItem={() => <View />} // Hide default pills
                renderItem={(item, selected) => (
                    <View style={styles.itemContainer}>
                        <TextComponent {...(selected && { type: FONT_TYPE.BOLD })} style={[styles.itemText, selected && { color: COLORS.primary }]}>
                            {item.label}
                        </TextComponent>
                        {selected && <MaterialIcons name="check" size={20} color={COLORS.primary} />}
                    </View>
                )}
            />

            {multiSelect && selectedItems.length > 0 && (
                <View style={styles.pillsContainer}>
                    {selectedItems.map(item => (
                        <View key={item.value} style={[styles.pill, { backgroundColor: theme.colors.primaryThemeColor }]}>
                            <TextComponent style={styles.pillText}>{item.label}</TextComponent>
                            {editable && (
                                <TouchableOpacity onPress={() => handleRemoveItem(item.value)}>
                                    <MaterialIcons name="close" size={14} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default MultiSelectDropdownComponent;

const styles = StyleSheet.create({
    container: backgroundColor => ({
        padding: SPACING.NORMAL,
        backgroundColor,
        paddingBottom: SPACING.SMALL,
        marginBottom: SPACING.X_SMALL,
    }),
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontSize: FONT_SIZE.SMALL,
    },
    requiredMark: {
        fontSize: FONT_SIZE.SMALL,
        marginLeft: 2,
    },
    clearButton: {
        marginLeft: 10,
    },
    dropdown: {
        borderBottomWidth: 1,
        borderColor: COLORS.whiteGrey,
        paddingVertical: SPACING.SMALL,
    },
    placeholderStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.searchText,
    },
    selectedTextStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.NORMAL,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.whiteGrey,
    },
    itemText: {
        fontSize: FONT_SIZE.NORMAL,
        fontFamily: 'ProximaNova-Regular',
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        margin: 4,
    },
    pillText: {
        color: '#fff',
        marginRight: 6,
        fontSize: FONT_SIZE.SMALL,
    },
});