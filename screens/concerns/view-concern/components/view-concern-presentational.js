import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ConfirmModal, RenderInputs, Content, GradientButton, Header, Loader, FAB } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { BUTTON_ICONS, INPUTS_CONSTANTS, ROUTES, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
// import EightDModal from 'screens/concerns/create-concern/components/8DModal';
import EightDDynamicForm from 'components/eightd-dynamic-form';
import { RFPercentage } from 'helpers/utils';

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
    handleNestedInputChange,
    sites,
    isDynamicInputsValid,
    handleProblemImages,
    handleAttachments,
    handleOKPicker,
    handleNotOKPicker,
}) => {
    const loading = dynamicInputsLoading || concernDetails?.Loading || isDeleting;
    const navigation = useNavigation();
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
            {/* <EightDModal {...{ modalVisible: formModalVisible, onRequestClose: () => setFormModalVisible(false), url: concernDetails?.FormUrl }} /> */}
            <EightDDynamicForm
                {...{
                    modalVisible: formModalVisible,
                    onRequestClose: () => setFormModalVisible(false),
                    url: concernDetails?.FormUrl,
                    formName: concernDetails?.ApproachName,
                    ConcernID,
                }}
            />
            <Header
                {...{
                    ...(concernDetails?.StatusID !== STATUS_CODES.CloseConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.RejectConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.InprogressConcern &&
                        concernDetails?.StatusID !== STATUS_CODES.CancelledConcern &&
                        sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER &&
                        concernDetails?.IsUserSuperChampion &&
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
                        <RenderInputs
                            {...{
                                inputs: dynamicInputs,
                                handleInputChange: handleDynamicInputChange,
                                concernDetails,
                                handleNestedInputChange,
                                ConcernID,
                                handleProblemImages,
                                handleAttachments,
                                handleOKPicker,
                                handleNotOKPicker,
                            }}
                        />
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
                                            editable: sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER,
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
                    {(concernDetails?.StatusID === STATUS_CODES.DraftConcern ||
                        (concernDetails?.StatusID === STATUS_CODES.ReworkConcern && concernDetails?.IsUserSuperChampion)) &&
                    sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER ? (
                        <View
                            style={{
                                padding: SPACING.NORMAL,
                                paddingBottom:
                                    concernDetails?.FormUrl && concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? 0 : SPACING.NORMAL,
                            }}>
                            {isDynamicInputsValid ? (
                                <GradientButton
                                    loading={isSubmitting}
                                    onPress={concernDetails?.StatusID === STATUS_CODES.ReworkConcern ? handleUpdateStatus : handleSubmitConcern}>
                                    Submit
                                </GradientButton>
                            ) : (
                                <GradientButton
                                    loading={isSubmitting}
                                    fontStyle={{
                                        fontSize: FONT_SIZE.SMALL,
                                    }}
                                    danger
                                    onPress={() =>
                                        navigation.navigate(ROUTES.EDIT_CONCERN, {
                                            ConcernID,
                                        })
                                    }>
                                    Fill mandatory fields to proceed
                                </GradientButton>
                            )}
                        </View>
                    ) : null}
                    {concernDetails?.FormUrl && concernDetails?.StatusID === STATUS_CODES.InprogressConcern ? (
                        <View style={{ padding: SPACING.NORMAL }}>
                            <GradientButton
                                icon={BUTTON_ICONS.eye}
                                //  onPress={() => setFormModalVisible(true)}
                                onPress={() =>
                                    navigation.navigate(ROUTES.EIGHTD_DYNAMIC_PAGE, {
                                        ConcernID,
                                        formName: concernDetails?.ApproachName,
                                    })
                                }>
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
            {sites?.selectedSite?.UserType === USER_TYPE.SUPPLIER || !isDynamicInputsValid ? null : (
                <FAB
                    onPress={() =>
                        navigation.navigate(ROUTES.EDIT_CONCERN, {
                            ConcernID,
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
