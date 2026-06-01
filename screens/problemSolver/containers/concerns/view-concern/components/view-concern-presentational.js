import React from 'react';
import { ScrollView, View } from 'react-native';
import { ConfirmModal, RenderInputs, Content, GradientButton, Header, Loader } from 'components';
import { SPACING } from 'constants/theme-constants';
import { BUTTON_ICONS, INPUTS_CONSTANTS, STATUS_CODES } from 'constants/app-constant';
import EightDModal from 'screens/problemSolver/containers/concerns/create-concern/components/8DModal';

const ConcernInitialEvaluationPresentational = ({
    handleInputChange,
    handleDynamicInputChange,
    ConcernID,
    formModalVisible,
    setFormModalVisible,
    defaultInputs,
    dynamicInputs,
    dynamicInputsLoading,
    concernDetails,
    confirmModal,
    setConfirmModal,
    handleDelete,
    isDeleting,
    handleSubmitConcern,
    isSubmitting,
    dropdownList,
    isProjectCreating,
    handleUpdateStatus,
    statusValue,
    setStatusValue,
}) => {
    const loading = dynamicInputsLoading || concernDetails?.Loading || isDeleting;
    return (
        <Content noPadding>
            <ConfirmModal
                {...{
                    modalVisible: confirmModal,
                    onOk: handleDelete,
                    onCancel: () => setConfirmModal(false),
                    onRequestClose: () => setConfirmModal(false),
                }}
            />
            <EightDModal {...{ modalVisible: formModalVisible, onRequestClose: () => setFormModalVisible(false), url: concernDetails?.FormUrl }} />
            <Header
                {...{
                    ...(concernDetails?.StatusID !== STATUS_CODES.CloseConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.RejectConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.InprogressConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.CancelledConcern &&
                        !loading && {
                            rightIconClick: () => setConfirmModal(true),
                            rightIcon: 'trash',
                        }),
                }}
                title={ConcernID ? `${concernDetails?.ConcernNo}` : 'New Concern'}
            />
            {isProjectCreating ? <Loader {...{ loadingText: 'Project is being created...', absolute: true }} /> : null}
            {loading ? (
                <Loader {...{ ...(isDeleting && { loadingText: 'Concern is being deleted' }) }} />
            ) : (
                <>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                        <RenderInputs {...{ inputs: defaultInputs, handleInputChange }} />
                        <RenderInputs {...{ inputs: dynamicInputs, handleInputChange: handleDynamicInputChange }} />
                        {concernDetails?.StatusID === STATUS_CODES.CancelledConcern ||
                        concernDetails?.StatusID === STATUS_CODES.RejectConcern ||
                        concernDetails?.StatusID === STATUS_CODES.CloseConcern ||
                        concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? (
                            <RenderInputs
                                {...{
                                    inputs: [
                                        {
                                            label: 'Status',
                                            name: 'StatusID',
                                            value: statusValue,
                                            data: (dropdownList?.data?.Status || []).map(data => ({
                                                label: data?.StatusCode,
                                                value: data?.StatusID,
                                            })),
                                            type: INPUTS_CONSTANTS.DROPDOWN,
                                        },
                                    ],
                                    handleInputChange: (name, value) => {
                                        handleUpdateStatus(value);
                                        setStatusValue(value);
                                    },
                                }}
                            />
                        ) : (
                            <RenderInputs
                                {...{
                                    inputs: [
                                        {
                                            label: 'Concern Status',
                                            name: 'ConcernStatus',
                                            value: concernDetails?.ConcernStatus,
                                            type: INPUTS_CONSTANTS.INPUT,
                                            editable: false,
                                        },
                                    ],
                                }}
                            />
                        )}
                    </ScrollView>
                    {concernDetails?.StatusID === STATUS_CODES.DraftConcern || concernDetails?.StatusID === STATUS_CODES.ReworkConcern ? (
                        <View
                            style={{
                                padding: SPACING.NORMAL,
                                paddingBottom:
                                    concernDetails?.FormUrl && concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? 0 : SPACING.NORMAL,
                            }}>
                            <GradientButton
                                // disabled={!(selectedTeam && concernDetails?.ProjectStartDate && concernDetails?.PriorityID)}
                                loading={isSubmitting}
                                onPress={concernDetails?.StatusID === STATUS_CODES.ReworkConcern ? handleUpdateStatus : handleSubmitConcern}>
                                Submit
                            </GradientButton>
                        </View>
                    ) : null}
                    {concernDetails?.FormUrl && concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? (
                        <View style={{ padding: SPACING.NORMAL }}>
                            <GradientButton icon={BUTTON_ICONS.eye} onPress={() => setFormModalVisible(true)}>
                                {concernDetails?.ApproachName || ''} Form
                            </GradientButton>
                        </View>
                    ) : null}
                </>
            )}
            {/* {!ConcernID ? (
                <View style={{ padding: SPACING.NORMAL }}>
                    <GradientButton loading={savingConcern} onPress={handleSaveConcern} disabled={!isValid || !isDynamicInputsValid}>
                        Submit
                    </GradientButton>
                </View>
            ) : null} */}
        </Content>
    );
};

export default ConcernInitialEvaluationPresentational;
