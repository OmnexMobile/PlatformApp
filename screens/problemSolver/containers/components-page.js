import React, { useState } from 'react';
import Ripple from 'react-native-material-ripple';
import { LayoutAnimation, Platform, UIManager, View } from 'react-native';
import {
    Avatar,
    BounceableView,
    ButtonComponent,
    Content,
    DropdownComponent,
    GradientButton,
    Header,
    IconComponent,
    PlaceHolders,
    SwitchComponent,
    TextComponent,
} from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, Languages, PLACEHOLDERS } from 'constants/app-constant';
import { getAvatarInitials } from 'helpers/utils';
import strings from 'config/localization';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomerType = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Business', value: 'Business' },
];

const user = {
    gender: 'male',
    name: { title: 'Mr', first: 'Matthew', last: 'Singh' },
    picture: {
        large: 'https://randomuser.me/api/portraits/men/33.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/33.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/33.jpg',
    },
};

const languages = [
    {
        label: 'English',
        value: Languages.ENGLISH,
    },
    {
        label: 'Chinese',
        value: Languages.CHINESE,
    },
];

const ComponentPage = ({}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(Languages.ENGLISH);

    const handleLanguageChange = language => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        strings.setLanguage(language);
        setSelectedLanguage(language);
    };
    return (
        <>
            <Header back={false} title={'Header Component'} />
            <Content scroll style={{ padding: SPACING.NORMAL }}>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.CHOOSE_LANGUAGE}</TextComponent>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingVertical: SPACING.SMALL }}>
                        {languages.map((language, i) => (
                            <Ripple
                                key={i}
                                onPress={() => handleLanguageChange(language.value)}
                                rippleContainerBorderRadius={SPACING.NORMAL}
                                style={{
                                    height: 50,
                                    width: '49%',
                                    backgroundColor: language.value === selectedLanguage ? COLORS.primaryThemeColor : COLORS.accDividerColor,
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: SPACING.NORMAL,
                                }}>
                                <TextComponent color={language.value === selectedLanguage ? COLORS.white : COLORS.themeBlack} type={FONT_TYPE.BOLD}>
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
                        ))}
                    </View>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.FONTS}</TextComponent>
                    <TextComponent>Text Normal</TextComponent>
                    <TextComponent type={FONT_TYPE.BOLD}>Text Bold</TextComponent>
                    <TextComponent fontSize={FONT_SIZE.LARGE}>Text Large</TextComponent>
                    <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                        Text Large Bold
                    </TextComponent>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.DROPDOWN}</TextComponent>
                    <DropdownComponent label="Customer Type" onChange={value => console.log('customerType', value)} data={CustomerType} />
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.BUTTON}</TextComponent>
                    <ButtonComponent>Click here</ButtonComponent>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.GRADIENT_BUTTON}</TextComponent>
                    <GradientButton>Click here</GradientButton>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.SWITCH}</TextComponent>
                    <View style={{ paddingLeft: SPACING.SMALL }}>
                        <SwitchComponent isActive />
                    </View>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.AVATAR}</TextComponent>
                    <View style={{ flexDirection: 'row' }}>
                        <Avatar
                            {...{
                                img: { uri: user?.picture?.medium },
                                placeholder: getAvatarInitials(`${user?.name?.first || ''} ${user?.name?.last || ''}`),
                                width: 40,
                                height: 40,
                            }}
                        />
                        <View style={{ paddingLeft: SPACING.SMALL }}>
                            <Avatar
                                {...{
                                    placeholder: getAvatarInitials(`${user?.name?.first || ''} ${user?.name?.last || ''}`),
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.BOUNCEABLE_VIEW}</TextComponent>
                    <BounceableView>
                        <Avatar
                            {...{
                                ...(user?.picture?.medium && { uri: user?.picture?.medium }),
                                placeholder: getAvatarInitials(`${user?.name?.first || ''} ${user?.name?.last || ''}`),
                                width: 40,
                                height: 40,
                            }}
                        />
                    </BounceableView>
                </View>
                <View style={{ paddingBottom: SPACING.LARGE }}>
                    <TextComponent type={FONT_TYPE.BOLD}>{strings.PLACEHOLDER}</TextComponent>
                    <PlaceHolders type={PLACEHOLDERS.USER_CARD} />
                </View>
            </Content>
        </>
    );
};
export default ComponentPage;
