import React from 'react';
import { ScrollView, View } from 'react-native';
import { ConfirmModal, RenderInputs, Content, GradientButton, Header, Loader } from 'components';
import { SPACING } from 'constants/theme-constants';
import { BUTTON_ICONS, INPUTS_CONSTANTS, STATUS_CODES } from 'constants/app-constant';
import EightDModal from 'screens/problemSolver/containers/concerns/create-concern/components/8DModal';

const ConcernInitialEvaluationPresentational = ({
    handleInputChange,
    isValid,
    isDynamicInputsValid,
    handleSaveConcern,
    savingConcern,
    ConcernID,
    formModalVisible,
    setFormModalVisible,
    defaultInputs,
    dynamicInputs,
    dynamicInputsLoading,
    concernDetails,
    selectedTeam,
    setSelectedTeam,
    confirmModal,
    setConfirmModal,
    handleDelete,
    isDeleting,
    handleSubmitConcern,
    isSubmitting,
    dropdownList,
    isProjectCreating,
    filteredPriorities,
}) => {
    console.log('concernDetails?.FormUrl', selectedTeam, concernDetails?.ProjectStartDate, concernDetails?.PriorityID, concernDetails?.StatusID);
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
            {/* <Header rightIconClick={() => setConfirmModal(true)} rightIcon="trash" title={ConcernID ? `Concern #${ConcernID}` : 'New Concern'} /> */}
            <Header
                rightIconClick={() => setConfirmModal(true)}
                rightIcon="trash"
                title={ConcernID ? `${concernDetails?.ConcernNo}` : 'New Concern'}
            />
            {isProjectCreating ? <Loader {...{ loadingText: 'Project is being created...', absolute: true }} /> : null}
            {dynamicInputsLoading || concernDetails?.Loading || isDeleting ? (
                <Loader {...{ ...(isDeleting && { loadingText: 'Concern is being deleted' }) }} />
            ) : (
                <>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                        <RenderInputs {...{ inputs: defaultInputs, handleInputChange }} />
                        <RenderInputs {...{ inputs: dynamicInputs, handleInputChange }} />
                        {ConcernID && concernDetails?.ConcernStatus === 'Created' && !concernDetails?.IsUserSuperChampion ? (
                            <>
                                <RenderInputs
                                    {...{
                                        inputs: [
                                            {
                                                label: 'Assign Team',
                                                name: 'TeamId',
                                                type: INPUTS_CONSTANTS.TEAM_PICKER,
                                                ConcernID,
                                                value: selectedTeam,
                                                required: true,
                                                // editable: false
                                            },
                                        ],
                                        handleInputChange: (TeamId, value) => setSelectedTeam(value),
                                    }}
                                />
                                <RenderInputs
                                    {...{
                                        inputs: [
                                            {
                                                type: INPUTS_CONSTANTS.DATE_PICKER,
                                                ConcernID,
                                                label: 'Project Start date',
                                                name: 'ProjectStartDate',
                                                value: concernDetails?.ProjectStartDate,
                                                required: true,
                                                dynamic: false,
                                                handleInputChange: (TeamId, value) => setSelectedTeam(value),
                                            },
                                        ],
                                        handleInputChange,
                                    }}
                                />
                                <RenderInputs
                                    {...{
                                        inputs: [
                                            {
                                                label: 'Priority',
                                                name: 'PriorityID',
                                                data: (filteredPriorities || []).map(data => ({
                                                    label: data?.PriorityName,
                                                    value: data?.PriorityID,
                                                })),
                                                required: true,
                                                value: concernDetails?.PriorityID,
                                                type: INPUTS_CONSTANTS.DROPDOWN,
                                            },
                                            ,
                                        ],
                                        handleInputChange,
                                    }}
                                />
                                <RenderInputs
                                    {...{
                                        inputs: [
                                            {
                                                label: 'Status',
                                                name: 'StatusID',
                                                data: (dropdownList?.data?.Status || []).map(data => ({
                                                    label: data?.StatusCode,
                                                    value: data?.StatusID,
                                                })),
                                                required: true,
                                                value: concernDetails?.StatusID,
                                                type: INPUTS_CONSTANTS.DROPDOWN,
                                            },
                                            ,
                                        ],
                                        handleInputChange,
                                    }}
                                />
                            </>
                        ) : null}
                    </ScrollView>
                    {concernDetails?.ConcernStatus === 'Created' && !concernDetails?.IsUserSuperChampion ? (
                        <View style={{ padding: SPACING.NORMAL }}>
                            <GradientButton
                                disabled={
                                    !(
                                        selectedTeam &&
                                        concernDetails?.ProjectStartDate &&
                                        concernDetails?.PriorityID &&
                                        concernDetails?.StatusID !== 1
                                    )
                                }
                                loading={isSubmitting}
                                onPress={handleSubmitConcern}>
                                Submit
                            </GradientButton>
                        </View>
                    ) : null}
                    {/* {concernDetails?.FormUrl && concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? (
                        <View style={{ padding: SPACING.NORMAL, paddingTop: 0 }}>
                            <GradientButton icon={BUTTON_ICONS.eye} onPress={() => setFormModalVisible(true)}>
                                {concernDetails?.ApproachName || ''} Form
                            </GradientButton>
                        </View>
                    ) : null} */}
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
