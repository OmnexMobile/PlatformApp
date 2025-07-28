import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { EIGHTD_FORM_VALUE_TYPE, FOLLOWUP_PICKER_STATUS, FONT_TYPE, INPUTS_CONSTANTS } from 'constants/app-constant';
import { TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import NotifyUser from './notify-user';
import Notifier from './notifier';
import FormAttachmentView from './form-attachment-view';

const RenderStaticValues = ({ isHTMLContent, StaticFormDataValue, staticObj, setSelectedData, loading, getDynamicFormData, ConcernID }) => {
    const { theme } = useTheme();

    const isFollowUpPicker = staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER;
    const isNotifyUser = staticObj?.Type === INPUTS_CONSTANTS.NOTIFY_USER;
    const isNotifier = staticObj?.Type === INPUTS_CONSTANTS.NOTIFIER;
    const isLabelType = staticObj?.Type === INPUTS_CONSTANTS.LABEL;

    const calculateTotalRPN = (type, obj) => {
        const factors = {
            RPNBefore: ['RPNBeforeDet', 'RPNBeforeOcc', 'RPNBeforeSev'],
            RPNAfter: ['RPNAfterDet', 'RPNAfterOcc', 'RPNAfterSev'],
        };
        const selectedFactors = factors[type];
        if (!selectedFactors) return 0;
        return selectedFactors.reduce((total, factor) => total * (obj[factor] || 1), 1);
    };

    const getBackgroundColor = () => {
        if (isFollowUpPicker) {
            const status = StaticFormDataValue?.[staticObj?.ColumnDefinition];
            return status === FOLLOWUP_PICKER_STATUS.PASS ? COLORS.SUCCESS : status === FOLLOWUP_PICKER_STATUS.FAIL ? COLORS.ERROR : COLORS.white;
        }
        return theme.mode.backgroundColor;
    };

    const handlePress = () => {
        setSelectedData({
            ...staticObj,
            type: EIGHTD_FORM_VALUE_TYPE.STATIC,
            Value: StaticFormDataValue?.[staticObj?.ColumnDefinition],
            rowData: { SaveAPIEndPoint: '/PhaseAction/Update8DMichelinStaticFields', FileId: StaticFormDataValue?.FileId || '' },
        });
    };

    const displayValue = () => {
        if (['RPNAfter', 'RPNBefore'].includes(staticObj.ColumnDefinition)) {
            return calculateTotalRPN(staticObj?.ColumnDefinition, StaticFormDataValue);
        }
        return StaticFormDataValue?.[staticObj?.ColumnDefinition]?.replace(/(<([^>]+)>)/gi, '') || 'No Data';
    };

    const renderContent = () => {
        if (isNotifyUser && !loading) return <NotifyUser />;
        if (isNotifier && !loading) return <Notifier {...{ StaticFormDataValue, staticObj, getDynamicFormData, ConcernID }} />;
        if (!isHTMLContent) {
            return staticObj?.Type !== INPUTS_CONSTANTS.FILE_UPLOAD ? (
                <TextComponent
                    style={isFollowUpPicker ? styles.centerText : undefined}
                    numberOfLines={8}
                    type={FONT_TYPE.BOLD}
                    fontSize={FONT_SIZE.SMALL}>
                    {displayValue()}
                </TextComponent>
            ) : (
                <FormAttachmentView
                    text={StaticFormDataValue?.[staticObj?.ColumnDefinition]?.replace(/(<([^>]+)>)/gi, '') || 'No Data'}
                    isFollowUpPicker={isFollowUpPicker}
                    style={isFollowUpPicker ? styles.centerText : undefined}
                    ConcernID={ConcernID}
                    formAttachmentId={StaticFormDataValue?.["COPQAttachmentId"]}
                />
            );
        }
        return null;
    };

    return (
        <View
            style={[
                styles.container,
                {
                    width: isHTMLContent ? '100%' : '50%',
                    backgroundColor: getBackgroundColor(),
                    ...(isFollowUpPicker && styles.followUpPickerStyle),
                },
            ]}>
            <TextComponent
                numberOfLines={5}
                fontSize={FONT_SIZE.SMALL}
                color={COLORS.textDark}
                style={isFollowUpPicker ? styles.centerText : undefined}>
                {staticObj?.Label}
            </TextComponent>
            <TouchableOpacity disabled={isLabelType} onPress={handlePress}>
                <ScrollView
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        paddingRight: SPACING.SMALL,
                    }}>
                    {isHTMLContent && !loading && (
                        <RichEditor
                            editorStyle={{
                                padding: 0,
                                backgroundColor: COLORS.whiteGrey,
                            }}
                            disabled
                            initialContentHTML={StaticFormDataValue?.[staticObj?.ColumnDefinition] || 'No Data'}
                        />
                    )}
                </ScrollView>
                {renderContent()}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: SPACING.SMALL,
    },
    followUpPickerStyle: {
        borderWidth: 1,
        paddingTop: SPACING.SMALL,
        marginTop: SPACING.XX_SMALL,
    },
    centerText: {
        textAlign: 'center',
    },
});

export default RenderStaticValues;
