import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import { IMAGES } from 'assets/images';
import useTheme from 'theme/useTheme';
import { ModalComponent, TextComponent, GradientButton, IconComponent, InputWithLabel } from 'components';

const UpdatePercentageModel = ({
    onChangeText,
    value = '',
    modalVisible,
    onRequestClose,
    title = 'Quick Percentage Update',
    onOk,
    onCancel,
    updatingPercentage,
    errorText,
    isValid,
}) => {
    console.log('🚀 ~ file: update-progress-modal.js:11 ~ UpdatePercentageModel ~ value:', value);
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
                        minHeight: RFPercentage(35),
                        padding: SPACING.NORMAL,
                    }}>
                    <View style={{ flexDirection: 'row', marginBottom: SPACING.NORMAL, alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.X_LARGE}>
                            {title}
                        </TextComponent>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={{
                                padding: SPACING.SMALL,
                                alignSelf: 'flex-end',
                                borderRadius: SPACING.SMALL,
                                backgroundColor: theme.colors.primaryThemeColor,
                            }}>
                            <IconComponent
                                color={COLORS.white}
                                name="close"
                                type={ICON_TYPE.AntDesign}
                                resizeMode="contain"
                                source={IMAGES.apqpModuleIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            {/* <TextComponent type={FONT_TYPE.BOLD}>Enter the Cumulative progress percentage</TextComponent> */}
                            <InputWithLabel
                                keyboardType="numeric"
                                value={value}
                                noPadding
                                autoFocus
                                label="Enter the Cumulative progress percentage"
                                placeholder="enter"
                                onChange={(label, value) => onChangeText(value)}
                                returnKeyType="done"
                                onSubmitEditing={() => isValid && onOk()}
                            />
                        </View>
                        {errorText ? (
                            <TextComponent
                                style={{ paddingBottom: SPACING.SMALL }}
                                color={COLORS.red}
                                fontSize={FONT_SIZE.SMALL}
                                type={FONT_TYPE.BOLD}>
                                {errorText}
                            </TextComponent>
                        ) : null}
                        {parseInt(value) > 100 && (
                            <TextComponent
                                style={{ paddingBottom: SPACING.SMALL }}
                                color={COLORS.red}
                                fontSize={FONT_SIZE.SMALL}
                                type={FONT_TYPE.BOLD}>
                                Value should be less than 100
                            </TextComponent>
                        )}
                        <View style={{ width: '100%', flexDirection: 'row', paddingVertical: SPACING.SMALL }}>
                            <GradientButton
                                loading={updatingPercentage}
                                disabled={!isValid || parseInt(value) > 100}
                                style={{ width: '100%' }}
                                onPress={() => onOk()}>
                                Update
                            </GradientButton>
                        </View>
                    </View>
                </View>
            </View>
        </ModalComponent>
    );
};

export default UpdatePercentageModel;
