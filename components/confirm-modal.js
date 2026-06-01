import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FONT_TYPE, ICON_TYPE, Modes } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import { IMAGES } from 'assets/images';
import useTheme from 'theme/useTheme';
import ModalComponent from './modal-component';
import TextComponent from './text';
import ImageComponent from './image-component';
import GradientButton from './gradient-button';
import IconComponent from './icon-component';

const ConfirmModal = ({ modalVisible, onRequestClose, content = 'Are you sure you want to delete this Concern?', onOk, onCancel }) => {
    const { theme } = useTheme();
    return (
        <ModalComponent
            modalBackgroundColor={COLORS.transparentGreyDark}
            onBackdropPress={onRequestClose}
            onRequestClose={onRequestClose}
            modalVisible={modalVisible}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <View
                    style={{
                        backgroundColor: theme.mode.backgroundColor,
                        width: '80%',
                        borderRadius: SPACING.NORMAL,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        minHeight: RFPercentage(30),
                        padding: SPACING.NORMAL, 
                    }}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={{padding: SPACING.SMALL,
                            alignSelf: 'flex-end',
                            borderRadius: SPACING.SMALL,
                            backgroundColor: theme.colors.primaryThemeColor,
                            marginBottom: SPACING.NORMAL
                        }}>
                        <IconComponent color={COLORS.white} name='close' type={ICON_TYPE.AntDesign} resizeMode="contain" source={IMAGES.apqpModuleIcon} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.X_LARGE}>
                            {content}
                        </TextComponent>
                        <View style={{ width:'100%',flexDirection: 'row', paddingVertical: SPACING.SMALL }}>
                            <GradientButton style={{width:'100%'}} onPress={onOk}>Delete</GradientButton>
                            {/* <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onOk}
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
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onCancel}
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
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </View>
        </ModalComponent>
    );
};

export default ConfirmModal;
