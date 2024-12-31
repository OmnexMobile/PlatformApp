import React from 'react';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import { FONT_TYPE, Modes } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import { IMAGES } from 'assets/images';
import useTheme from 'theme/useTheme';
import ModalComponent from './modal-component';
import TextComponent from './text';
import ImageComponent from './image-component';

const ExitModal = ({ exitModalVisible, setExitModalVisible }) => {
    const { theme } = useTheme();
    return (
        <ModalComponent modalVisible={exitModalVisible}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <View
                    style={{
                        backgroundColor: theme.mode.backgroundColor,
                        width: '80%',
                        borderRadius: SPACING.SMALL,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                    <View
                        style={{
                            width: RFPercentage(15),
                            height: RFPercentage(5),
                            position: 'absolute',
                            alignSelf: 'center',
                            top: -RFPercentage(2),
                        }}>
                        <ImageComponent resizeMode="contain" source={IMAGES.apqpModuleIcon} />
                    </View>
                    <View style={{ paddingTop: RFPercentage(5), padding: SPACING.NORMAL }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                            Are you sure you want to exit the app?
                        </TextComponent>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.SMALL }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => BackHandler.exitApp()}
                                style={{
                                    width: '45%',
                                    paddingVertical: SPACING.SMALL,
                                    paddingHorizontal: SPACING.NORMAL,
                                    backgroundColor: COLORS.red,
                                    borderRadius: SPACING.SMALL,
                                    alignItems: 'center',
                                }}>
                                <TextComponent
                                    color={theme.selectedMode === Modes.light ? COLORS.white : theme.mode.textColor}
                                    type={FONT_TYPE.BOLD}
                                    fontSize={FONT_SIZE.REGULAR}>
                                    Yes
                                </TextComponent>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setExitModalVisible(false)}
                                style={{
                                    width: '45%',
                                    paddingVertical: SPACING.SMALL,
                                    paddingHorizontal: SPACING.NORMAL,
                                    backgroundColor: theme.colors.primaryThemeColor,
                                    borderRadius: SPACING.SMALL,
                                    alignItems: 'center',
                                }}>
                                <TextComponent
                                    color={theme.selectedMode === Modes.light ? COLORS.white : theme.mode.textColor}
                                    type={FONT_TYPE.BOLD}
                                    fontSize={FONT_SIZE.REGULAR}>
                                    No
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ModalComponent>
    );
};

export default ExitModal;
