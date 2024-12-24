import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Content, GradientButton, Header, KeyboardAwareScrollViewComponent, Loader } from 'components';
import { SPACING } from 'constants/theme-constants';
import RenderInputs from 'components/render-inputs';
import { APP_VARIABLES, INPUTS_CONSTANTS } from 'constants/app-constant';
import EightDModal from './8DModal';

const CreateConcernPresentational = ({
    handleInputChange,
    handleDynamicInputChange,
    isValid,
    isDynamicInputsValid,
    handleSaveConcern,
    savingConcern,
    formModalVisible,
    setFormModalVisible,
    defaultInputs,
    dynamicInputs,
    dynamicInputsLoading,
    concernDetails,
    selectedTeam,
    setSelectedTeam,
    ConcernID,
    handleNestedInputChange,
    handleProblemImages,
    handleAttachments,
    handleOKPicker,
    handleNotOKPicker,
}) => {
    return (
        <Content noPadding>
            {dynamicInputsLoading ? <Loader transparent absolute /> : null}
            <EightDModal {...{ modalVisible: formModalVisible, onRequestClose: () => setFormModalVisible(false), url: concernDetails?.FormUrl }} />
            <Header title={ConcernID ? `Concern #${ConcernID}` : 'New Concern'} />
            <KeyboardAwareScrollViewComponent contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                <RenderInputs
                    {...{
                        inputs: defaultInputs,
                        handleInputChange,
                    }}
                />
                <RenderInputs
                    {...{
                        inputs: dynamicInputs,
                        handleInputChange: handleDynamicInputChange,
                        handleNestedInputChange,
                        handleProblemImages,
                        handleAttachments,
                        handleOKPicker,
                        handleNotOKPicker,
                    }}
                />
                {ConcernID ? (
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
                ) : null}
            </KeyboardAwareScrollViewComponent>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {!ConcernID ? (
                    <View style={{ padding: SPACING.NORMAL, paddingBottom: 0, width: '50%' }}>
                        <GradientButton
                            style={{}}
                            hideIcon
                            loading={savingConcern}
                            onPress={() => handleSaveConcern(APP_VARIABLES.SAVE)}
                            disabled={!isValid}>
                            Save
                        </GradientButton>
                    </View>
                ) : null}
                {!ConcernID ? (
                    <View style={{ padding: SPACING.NORMAL, width: '50%', paddingRight: SPACING.SMALL }}>
                        <GradientButton
                            hideIcon
                            loading={savingConcern}
                            onPress={() => handleSaveConcern(APP_VARIABLES.SUBMIT)}
                            disabled={!isValid || !isDynamicInputsValid}>
                            Submit
                        </GradientButton>
                    </View>
                ) : null}
            </View>
            {concernDetails?.FormUrl ? (
                <View style={{ padding: SPACING.NORMAL, paddingTop: 0, paddingLeft: SPACING.SMALL }}>
                    <GradientButton onPress={() => setFormModalVisible(true)}>View 8D form</GradientButton>
                </View>
            ) : null}
        </Content>
    );
};

export default CreateConcernPresentational;
