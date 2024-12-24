import React, { useState, Fragment } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import strings from 'config/localization';
import localStorage from 'global/localStorage';
import { FONT_TYPE, ICON_TYPE, LANGUAGES, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IMAGES } from 'assets/images';
import { IconComponent, Content, TextComponent, ImageComponent, GradientButton } from 'components';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';

const PreferredLanguage = ({}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { handleAppSetting } = useAppContext();
    const [selectedLanguage, setSelectedLanguage] = useState(strings.getLanguage());
    const [oldSelectedLanguage, setOldSelectedLanguage] = useState(strings.getLanguage());

    const handleLanguageChange = language => {
        setSelectedLanguage(language);
    };

    const handleSubmit = () => {
        strings.setLanguage(selectedLanguage);
        handleAppSetting('language', selectedLanguage);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SELECTED_LANGUAGE, selectedLanguage);
        navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.LAUNCH_SCREEN }],
        });
    };
    return (
        <Content>
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
                                                    backgroundColor: theme.colors.primaryDarkThemeColor,
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
                    {oldSelectedLanguage !== selectedLanguage ? (
                        <GradientButton onPress={handleSubmit}>Submit & Reload the app</GradientButton>
                    ) : null}
                </View>
            </View>
        </Content>
    );
};

export default PreferredLanguage;

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
