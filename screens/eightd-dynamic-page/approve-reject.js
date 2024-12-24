import React, { Fragment, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import useTheme from 'theme/useTheme';
import API_URL from 'global/api-urls';
import { AnimatableView, ButtonComponent, IconComponent, ModalComponent, TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, OPACITY_TRANSLATE_Y_ANIMATION } from 'constants/app-constant';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { showErrorMessage, successMessage } from 'helpers/utils';

const TYPES = {
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
};

const ApproveRejectComponent = ({ ConcernID, ApproveButtonId, RejectButtonId, refreshData }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [modalType, setModalType] = useState(null);
    const { sites } = useAppContext();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
            formData.append(APP_VARIABLES.UserId, sites?.selectedSite?.UserId);
            formData.append(APP_VARIABLES.DocumentStatus, modalType === TYPES.APPROVE ? ApproveButtonId : RejectButtonId);
            formData.append(APP_VARIABLES.Remarks, remarks);
            const { Success, Message, Data } = await postAPI(`${API_URL.APPROVE_REJECT}`, formData);
            setLoading(false);
            if (Success) {
                successMessage({ message: 'Success', description: Data });
                setModalType(null);
                refreshData();
                setRemarks('');
            } else {
                showErrorMessage(Message);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <AnimatableView
                animationConfig={OPACITY_TRANSLATE_Y_ANIMATION}
                duration={300}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: SPACING.NORMAL,
                    elevation: 5,
                    backgroundColor: theme.mode.backgroundColor,
                    borderTopWidth: 1,
                    borderColor: theme.mode.borderColor,
                    shadowColor: COLORS.black,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}>
                <ButtonComponent
                    onPress={() => setModalType(TYPES.APPROVE)}
                    style={{
                        width: '49%',
                    }}>
                    Approve
                </ButtonComponent>
                <ButtonComponent
                    onPress={() => setModalType(TYPES.REJECT)}
                    style={{
                        width: '49%',
                    }}
                    danger>
                    Reject
                </ButtonComponent>
            </AnimatableView>
            <ModalComponent
                modalVisible={Boolean(modalType)}
                onRequestClose={() => setModalType(null)}
                modalBackgroundColor={COLORS.transparentGrey}
                transparent>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 3, backgroundColor: COLORS.transparentGrey }}></View>
                    <View
                        style={{
                            flex: 7,
                            backgroundColor: theme.mode.backgroundColor,
                            borderTopLeftRadius: SPACING.NORMAL,
                            borderTopRightRadius: SPACING.NORMAL,
                            width: '100%',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                padding: SPACING.NORMAL,
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderColor: theme.mode.borderColor,
                            }}>
                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                                Please provide a reason for {modalType === TYPES.APPROVE ? 'Approve' : 'Reject'}
                                <TextComponent fontSize={FONT_SIZE.LARGE} color={COLORS.red}>
                                    *
                                </TextComponent>
                            </TextComponent>
                            <TouchableOpacity onPress={() => setModalType(null)}>
                                <IconComponent size={FONT_SIZE.X_LARGE} type={ICON_TYPE.Ionicons} name="close" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: SPACING.NORMAL, flex: 1 }}>
                            <>
                                <TextInput
                                    value={remarks}
                                    returnKeyType="done"
                                    multiline
                                    autoFocus
                                    placeholder="Enter your reason here"
                                    onChangeText={setRemarks}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.mode.borderColor,
                                        borderRadius: SPACING.SMALL,
                                        padding: SPACING.NORMAL,
                                        paddingTop: SPACING.NORMAL,
                                        marginTop: SPACING.X_SMALL,
                                        height: 150,
                                        fontSize: FONT_SIZE.NORMAL,
                                        verticalAlign: 'top',
                                    }}
                                />
                            </>
                            <ButtonComponent
                                loading={loading}
                                style={{
                                    marginTop: SPACING.SMALL,
                                }}
                                disabled={!Boolean(remarks)}
                                onPress={handleSubmit}>
                                Submit
                            </ButtonComponent>
                        </View>
                    </View>
                </View>
            </ModalComponent>
        </Fragment>
    );
};

export default ApproveRejectComponent;
