import React, { useState, Fragment } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Grayscale, Sepia, Tint, ColorMatrix, concatColorMatrices, invert, contrast, saturate } from 'react-native-color-matrix-image-filters';
import strings from 'config/localization';
import localStorage from 'global/localStorage';
import { FONT_TYPE, ICON_TYPE, LANGUAGES, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IMAGES } from 'assets/images';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import ModalComponent from './modal-component';
import Content from './content';
import TextComponent from './text';
import ImageComponent from './image-component';

const SelectLanguage = ({ modalVisible = false, onRequestClose }) => {
    const { theme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState(strings.getLanguage());

    const handleLanguageChange = language => {
        strings.setLanguage(language);
        setSelectedLanguage(language);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SELECTED_LANGUAGE, language);
    };
    return (
        <ModalComponent {...{ modalVisible, onRequestClose }}>
            <Content>
                <TouchableOpacity onPress={onRequestClose}>
                    <IconComponent name={'arrowleft'} type={ICON_TYPE.AntDesign} color={theme.colors.primaryThemeColor} size={25} />
                </TouchableOpacity>
                <View style={styles.topArea}>
                    <ImageComponent
                        withLoader={false}
                        resizeMode="contain"
                        source={IMAGES.translation}
                        style={{ height: RFPercentage(12), width: RFPercentage(12) }}
                    />
                </View>
                <View style={{ flex: 8 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.X_LARGE}>
                            {strings.CHOOSE_LANGUAGE}
                        </TextComponent>
                        <View style={{ paddingVertical: SPACING.SMALL }}>
                            <TextComponent>{strings.SELECT_LANGUAGE}</TextComponent>
                        </View>
                    </View>
                    <View style={{ paddingTop: SPACING.LARGE, flex: 1 }}>
                        <FlatList
                            data={LANGUAGES}
                            horizontal={false}
                            keyExtractor={(item, index) => {
                                return index;
                            }}
                            numColumns={2}
                            renderItem={({ item }) => {
                                const Component = item?.disabled ? Grayscale : Fragment;
                                return (
                                    <View style={{ flex: 1, padding: SPACING.NORMAL, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            disabled={item?.disabled}
                                            onPress={() => handleLanguageChange(item?.value)}
                                            activeOpacity={0.8}
                                            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                            <Component>
                                                <ImageComponent
                                                    withLoader={false}
                                                    resizeMode="contain"
                                                    source={item?.image}
                                                    style={{ height: RFPercentage(7), width: RFPercentage(7) }}
                                                />
                                            </Component>
                                            <TextComponent type={FONT_TYPE.BOLD} style={{ paddingTop: SPACING.SMALL }}>
                                                {item?.label}
                                            </TextComponent>
                                            {item?.value === selectedLanguage ? (
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        backgroundColor: COLORS.green,
                                                        top: -RFPercentage(0.5),
                                                        right: -RFPercentage(0.5),
                                                        height: RFPercentage(3),
                                                        width: RFPercentage(3),
                                                        borderRadius: 100,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                    <IconComponent color={COLORS.white} name="check" type={ICON_TYPE.AntDesign} />
                                                </View>
                                            ) : null}
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />
                        {/* {LANGUAGES.map((language, i) => (
                            <Ripple
                                key={i}
                                onPress={() => handleLanguageChange(language.value)}
                                rippleContainerBorderRadius={SPACING.NORMAL}
                                style={[
                                    styles.buttonStyle,
                                    { backgroundColor: language.value === selectedLanguage ? COLORS.primaryThemeColor : COLORS.accDividerColor },
                                ]}>
                                <TextComponent
                                    fontSize={FONT_SIZE.X_LARGE}
                                    color={language.value === selectedLanguage ? COLORS.white : COLORS.themeBlack}
                                    type={FONT_TYPE.BOLD}>
                                    {language.label}
                                </TextComponent>
                                <View>
                                    {language.value === selectedLanguage ? (
                                        <IconComponent
                                            name={'check'}
                                            type={ICON_TYPE.AntDesign}
                                            size={FONT_SIZE.X_LARGE}
                                            color={selectedLanguage ? COLORS.white : COLORS.themeBlack}
                                        />
                                    ) : null}
                                </View>
                            </Ripple>
                        ))} */}
                    </View>
                </View>
            </Content>
        </ModalComponent>
    );
};

export default SelectLanguage;

const styles = StyleSheet.create({
    buttonStyle: {
        height: 60,
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.NORMAL,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: SPACING.NORMAL,
        marginBottom: SPACING.NORMAL,
    },
    topArea: { flex: 2, alignItems: 'center', justifyContent: 'center' },
});
