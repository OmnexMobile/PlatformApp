import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ConfirmModal, RenderInputs, Content, GradientButton, Header, Loader, FAB } from 'components';
import { SPACING } from 'constants/theme-constants';
import { INPUTS_CONSTANTS, ROUTES, STATUS, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import EightDModal from 'screens/concerns/create-concern/components/8DModal';
import { RFPercentage } from 'helpers/utils';

const ConcernInitialEvaluationPresentational = ({
    isValid,
    isDynamicInputsValid,
    handleSaveConcern,
    savingConcern,
    handleInputChange,
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
    sites,
    handleDynamicInputChange,
    refreshElementData,
}) => {
    const navigation = useNavigation();
    const pageLoading = dynamicInputsLoading || concernDetails?.Loading || isDeleting;
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
                    ...(sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER &&
                        concernDetails?.IsUserSuperChampion && {
                            rightIcon: 'trash',
                            rightIconClick: () => setConfirmModal(true),
                        }),
                }}
                title={ConcernID ? `${concernDetails?.ConcernNo}` : 'New Concern'}
            />
            {isProjectCreating ? <Loader {...{ loadingText: 'Project is being created...', absolute: true }} /> : null}
            {pageLoading ? (
                <Loader {...{ ...(isDeleting && { loadingText: 'Concern is being deleted' }) }} />
            ) : (
                <>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                        <RenderInputs {...{ inputs: defaultInputs, handleInputChange }} />
                        <RenderInputs {...{ inputs: dynamicInputs, handleInputChange: handleDynamicInputChange, concernDetails, ConcernID }} />
                        {/* {ConcernID && concernDetails?.ConcernStatus === 'Created' && concernDetails?.IsUserSuperChampion ? ( */}
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
                                            editable: sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && concernDetails?.IsUserSuperChampion,
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
                                            editable: sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && concernDetails?.IsUserSuperChampion,
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
                                            editable: sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && concernDetails?.IsUserSuperChampion,
                                        },
                                    ],
                                    handleInputChange,
                                }}
                            />
                            {concernDetails?.IsUserSuperChampion && (
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
                                                editable: sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && concernDetails?.IsUserSuperChampion,
                                            },
                                            ,
                                        ],
                                        handleInputChange,
                                    }}
                                />
                            )}
                        </>
                        {/* ) : null} */}
                    </ScrollView>
                    {sites?.selectedSite?.UserType === USER_TYPE.SUPPLIER || !concernDetails?.IsUserSuperChampion ? null : (
                        <View style={{ padding: SPACING.NORMAL }}>
                            <GradientButton
                                disabled={
                                    !(
                                        selectedTeam &&
                                        concernDetails?.ProjectStartDate &&
                                        concernDetails?.PriorityID &&
                                        concernDetails?.StatusID !== STATUS_CODES.OpenConcern
                                    )
                                }
                                loading={isSubmitting}
                                onPress={handleSubmitConcern}>
                                Submit
                            </GradientButton>
                        </View>
                    )}
                </>
            )}
            {/* {!ConcernID ? (
                <View style={{ padding: SPACING.NORMAL }}>
                    <GradientButton loading={savingConcern} onPress={handleSaveConcern} disabled={!isValid || !isDynamicInputsValid}>
                        Submit
                    </GradientButton>
                </View>
            ) : null} */}
            {sites?.selectedSite?.UserType === USER_TYPE.SUPPLIER ? null : (
                <FAB
                    onPress={() =>
                        navigation.navigate(ROUTES.EDIT_CONCERN, {
                            ConcernID,
                            FormTypeID: 3,
                            refreshElementData,
                        })
                    }
                    iconName="edit"
                    bottom={RFPercentage(15)}
                />
            )}
        </Content>
    );
};

export default ConcernInitialEvaluationPresentational;
