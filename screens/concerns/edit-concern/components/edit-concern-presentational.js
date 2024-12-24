import React from 'react';
import { ScrollView, View } from 'react-native';
import { ConfirmModal, RenderInputs, Content, GradientButton, Header, Loader, KeyboardAwareScrollViewComponent } from 'components';
import { SPACING } from 'constants/theme-constants';
import { STATUS_CODES } from 'constants/app-constant';
import EightDDynamicForm from 'components/eightd-dynamic-form';

const EditConcernPresentational = ({
    handleInputChange,
    handleDynamicInputChange,
    ConcernID,
    formModalVisible,
    defaultInputs,
    dynamicInputs,
    dynamicInputsLoading,
    concernDetails,
    confirmModal,
    handleDelete,
    isDeleting,
    handleSubmitConcern,
    isSubmitting,
    handleNestedInputChange,
    stateVariables,
    setStateVariables,

    handleProblemImages,
    handleAttachments,
    handleOKPicker,
    handleNotOKPicker,
}) => {
    const loading = dynamicInputsLoading || concernDetails?.Loading || isDeleting;
    return (
        <Content noPadding>
            <ConfirmModal
                {...{
                    modalVisible: confirmModal,
                    onOk: handleDelete,
                    onCancel: () => setStateVariables(stateVariables => ({ ...stateVariables, confirmModal: false })),
                    onRequestClose: () => setStateVariables(stateVariables => ({ ...stateVariables, confirmModal: false })),
                }}
            />
            {/* <EightDModal {...{ modalVisible: formModalVisible, onRequestClose: () => setFormModalVisible(false), url: concernDetails?.FormUrl }} /> */}
            <EightDDynamicForm
                {...{
                    modalVisible: formModalVisible,
                    onRequestClose: () => setStateVariables(stateVariables => ({ ...stateVariables, formModalVisible: false })),
                    url: concernDetails?.FormUrl,
                    formName: concernDetails?.ApproachName,
                }}
            />
            <Header
                {...{
                    ...(concernDetails?.StatusID !== STATUS_CODES.CloseConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.RejectConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.InprogressConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.CancelledConcern &&
                        !loading && {
                            rightIconClick: () => setStateVariables(stateVariables => ({ ...stateVariables, confirmModal: true })),
                            rightIcon: 'trash',
                        }),
                }}
                title={ConcernID ? `${concernDetails?.ConcernNo}` : 'New Concern'}
            />
            {loading ? (
                <Loader {...{ ...(isDeleting && { loadingText: 'Concern is being deleted' }) }} />
            ) : (
                <>
                    <KeyboardAwareScrollViewComponent style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                        <RenderInputs {...{ inputs: defaultInputs, handleInputChange, concernDetails }} />
                        <RenderInputs
                            {...{
                                inputs: dynamicInputs,
                                handleInputChange: handleDynamicInputChange,
                                handleNestedInputChange,
                                concernDetails,
                                ConcernID,
                                isEditPage: true,

                                handleProblemImages,
                                handleAttachments,
                                handleOKPicker,
                                handleNotOKPicker,
                            }}
                        />
                    </KeyboardAwareScrollViewComponent>
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: SPACING.NORMAL,
                            justifyContent: 'center',
                        }}>
                        <View
                            style={{
                                width: '100%',
                            }}>
                            <GradientButton
                                // disabled={!(selectedTeam && concernDetails?.ProjectStartDate && concernDetails?.PriorityID)}
                                hideIcon
                                loading={isSubmitting}
                                onPress={handleSubmitConcern}>
                                {/* onPress={concernDetails?.StatusID === STATUS_CODES.ReworkConcern ? handleUpdateStatus : handleSubmitConcern}> */}
                                Update
                            </GradientButton>
                        </View>
                    </View>
                </>
            )}
        </Content>
    );
};

export default EditConcernPresentational;
