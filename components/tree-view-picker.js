import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, UIManager, LayoutAnimation } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import ModalComponent from './modal-component';
import Header from './header';
import GradientButton from './gradient-button';
import IconComponent from './icon-component';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const explorer = {
    id: '1',
    name: 'root',
    items: [
        {
            id: '2',
            name: 'public',
            items: [
                {
                    id: '3',
                    name: 'public nested 1',
                    items: [
                        {
                            id: '4',
                            name: 'index.html',
                            items: [],
                        },
                        {
                            id: '5',
                            name: 'hello.html',
                            items: [],
                        },
                    ],
                },
                {
                    id: '6',
                    name: 'public_nested_file',
                    items: [],
                },
            ],
        },
        {
            id: '7',
            name: 'src',
            items: [
                {
                    id: '8',
                    name: 'App.js',
                    items: [],
                },
                {
                    id: '9',
                    name: 'Index.js',
                    items: [],
                },
                {
                    id: '10',
                    name: 'styles.css',
                    items: [],
                },
            ],
        },
        {
            id: '11',
            name: 'package.json',
            items: [],
        },
    ],
};

const InputContent = ({ name, label, required, value, setModalVisible, editable, ConcernID }) => {
    const { theme } = useTheme();
    return (
        <>
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
            <TouchableOpacity
                disabled={!editable}
                onPress={() => editable && setModalVisible(true)}
                activeOpacity={0.8}
                style={{
                    borderBottomWidth: 1,
                    borderColor: theme.mode.borderColor,
                    paddingVertical: SPACING.X_SMALL,
                }}>
                <TextComponent
                    style={{
                        fontSize: FONT_SIZE.LARGE,
                        paddingVertical: SPACING.X_SMALL,
                        color: !value ? COLORS.lightGrey : theme?.mode.textColor,
                    }}>
                    {value || `Select ${label}`}
                </TextComponent>
            </TouchableOpacity>
        </>
    );
};

const TreeView = ({ explorer = {}, name, value, handleInputChange }) => {
    const { theme } = useTheme();
    const [isOpened, setIsOpened] = useState(true);
    const isSelected = explorer?.id === value;
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!explorer?.items?.length ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: theme.colors.primaryThemeColor,
                            alignSelf: 'flex-start',
                            marginRight: SPACING.SMALL,
                            padding: SPACING.X_SMALL,
                            borderRadius: SPACING.X_SMALL,
                        }}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            // setIsOpened(!isOpened);
                        }}>
                        <IconComponent color={COLORS.white} name={isOpened ? 'minus' : 'plus'} type={ICON_TYPE.AntDesign} />
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: isSelected ? theme.colors.primaryThemeColor : theme.mode.backgroundColor,
                        alignSelf: 'flex-start',
                        marginBottom: SPACING.SMALL,
                        padding: SPACING.X_SMALL,
                        borderRadius: SPACING.X_SMALL,
                        borderWidth: 1,
                        borderColor: theme.colors.primaryThemeColor,
                    }}
                    onPress={() => {
                        handleInputChange(name, explorer?.id);
                    }}>
                    <TextComponent color={isSelected ? COLORS.white : theme.colors.primaryThemeColor} fontSize={FONT_SIZE.X_LARGE}>
                        {explorer?.name}
                    </TextComponent>
                </TouchableOpacity>
            </View>
            {isOpened ? (
                <>
                    {explorer?.items?.map(exp => {
                        return (
                            <View
                                key={exp?.id}
                                style={{
                                    paddingLeft: 10,
                                }}>
                                <TreeView key={exp?.id} explorer={exp} {...{ name, value, handleInputChange }} />
                            </View>
                        );
                    })}
                </>
            ) : null}
        </View>
    );
};

const TreeViewPickerComponent = ({ name, label, required, value, editable = true, ConcernID, handleInputChange }) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View
                style={{
                    padding: SPACING.NORMAL,
                    flex: 1,
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.X_SMALL,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                }}>
                <ModalComponent modalVisible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                        <View style={{ flex: 1 }}>
                            <Header title={`Select ${label}`} handleBackClick={() => setModalVisible(false)} />
                            <View style={{ padding: SPACING.NORMAL }}>
                                <TreeView {...{ name, value, handleInputChange, explorer }} />
                            </View>
                        </View>
                        {value ? (
                            <View style={{ padding: SPACING.NORMAL }}>
                                <GradientButton>Save</GradientButton>
                            </View>
                        ) : null}
                    </View>
                </ModalComponent>
                <InputContent {...{ name, label, required, value, setModalVisible, editable, ConcernID }} />
            </View>
        </>
    );
};

export default TreeViewPickerComponent;
