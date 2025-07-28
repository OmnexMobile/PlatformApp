import React, { useState, useCallback, memo } from 'react';
import { Platform, TouchableOpacity, View, UIManager, LayoutAnimation, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import IconComponent from './icon-component';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const explorerData = {
    id: '1',
    name: 'root',
    ParentId: 0,
    RootCauseCategoryType: 0,
    items: [
        {
            id: '2',
            name: 'Occur',
            ParentId: 0,
            RootCauseCategoryType: 2,
            items: [
                {
                    id: '50',
                    name: 'Occur Sub',
                    ParentId: 2,
                    RootCauseCategoryType: 0,
                    items: [
                        {
                            id: '53',
                            name: 'Occur Sub 1',
                            ParentId: 50,
                            RootCauseCategoryType: 0,
                            items: [
                                {
                                    id: '56',
                                    name: 'Occur Sub 2',
                                    ParentId: 53,
                                    RootCauseCategoryType: 0,
                                    items: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '3',
            name: 'System',
            ParentId: 0,
            RootCauseCategoryType: 3,
            items: [
                {
                    id: '52',
                    name: 'System Sub',
                    ParentId: 3,
                    RootCauseCategoryType: 0,
                    items: [
                        {
                            id: '55',
                            name: 'System Sub 1',
                            ParentId: 52,
                            RootCauseCategoryType: 0,
                            items: [
                                {
                                    id: '59',
                                    name: 'System Sub 2',
                                    ParentId: 55,
                                    RootCauseCategoryType: 0,
                                    items: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '4',
            name: 'Escape',
            ParentId: 0,
            RootCauseCategoryType: 1,
            items: [
                {
                    id: '51',
                    name: 'Escape Sub',
                    ParentId: 4,
                    RootCauseCategoryType: 0,
                    items: [
                        {
                            id: '54',
                            name: 'Escape Sub 1',
                            ParentId: 51,
                            RootCauseCategoryType: 0,
                            items: [
                                {
                                    id: '57',
                                    name: 'Escape Sub 2',
                                    ParentId: 54,
                                    RootCauseCategoryType: 0,
                                    items: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const TreeView = memo(({ explorer, name, value, onChange }) => {
    const { theme } = useTheme();
    const [isOpened, setIsOpened] = useState(true);
    const isSelected = explorer?.id === value;

    const handleToggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpened(!isOpened);
    }, [isOpened]);

    const handleSelect = useCallback(() => {
        onChange(name, explorer?.id);
    }, [name, explorer?.id, onChange]);

    return (
        <View>
            <View style={styles.row}>
                {!!explorer?.items?.length && (
                    <TouchableOpacity style={styles.toggleButton(theme)} onPress={handleToggle}>
                        <IconComponent color={COLORS.white} name={isOpened ? 'minus' : 'plus'} type={ICON_TYPE.AntDesign} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.selectButton(isSelected, explorer?.items?.length, theme)} onPress={handleSelect}>
                    <TextComponent color={isSelected ? COLORS.white : theme.colors.primaryThemeColor} fontSize={FONT_SIZE.SMALL}>
                        {explorer?.name}
                    </TextComponent>
                </TouchableOpacity>
            </View>
            {isOpened &&
                explorer?.items?.map(exp => (
                    <View key={exp?.id} style={styles.childContainer}>
                        <TreeView key={exp?.id} explorer={exp} {...{ name, value, onChange }} />
                    </View>
                ))}
        </View>
    );
});

const RootCauseCategoryPickerComponent = ({ name, label, required, value, editable = true, onChange }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, !editable && { backgroundColor: theme.mode.disabledBackgroundColor }]}>
            <View style={styles.labelContainer}>
                <TextComponent style={styles.labelText} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={styles.requiredMark} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <ScrollView>
                <TreeView name={name} value={value} onChange={onChange} explorer={explorerData} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: SPACING.NORMAL,
    },
    labelText: {
        fontSize: FONT_SIZE.SMALL,
    },
    requiredMark: {
        fontSize: FONT_SIZE.SMALL,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButton: theme => ({
        backgroundColor: theme.colors.primaryThemeColor,
        alignSelf: 'flex-start',
        marginRight: SPACING.SMALL,
        padding: SPACING.X_SMALL,
        borderRadius: SPACING.X_SMALL,
    }),
    selectButton: (isSelected, hasChildren, theme) => ({
        backgroundColor: isSelected ? theme.colors.primaryThemeColor : theme.mode.backgroundColor,
        alignSelf: 'flex-start',
        marginBottom: SPACING.SMALL,
        padding: SPACING.X_SMALL,
        borderRadius: SPACING.X_SMALL,
        marginLeft: hasChildren ? 0 : SPACING.LARGE,
        borderWidth: 1,
        borderColor: theme.colors.primaryThemeColor,
    }),
    childContainer: {
        paddingLeft: SPACING.NORMAL,
    },
});

export default RootCauseCategoryPickerComponent;