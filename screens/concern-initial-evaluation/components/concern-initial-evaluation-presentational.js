import React from 'react';
import { ScrollView, View } from 'react-native';
import { Content, GradientButton, Header, Loader } from 'components';
import { SPACING } from 'constants/theme-constants';
import RenderInputs from 'components/render-inputs';
import { INPUTS_CONSTANTS } from 'constants/app-constant';
import EightDModal from 'screens/concern-screen/components/8DModal';


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
}) => {
    return (
        <Content noPadding>
            {dynamicInputsLoading ? <Loader transparent absolute /> : null}
            <EightDModal {...{ modalVisible: formModalVisible, onRequestClose: () => setFormModalVisible(false), url: concernDetails?.FormUrl }} />
            <Header title={ConcernID ? `Concern #${ConcernID}` : 'New Concern'} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}>
                <RenderInputs {...{ inputs: defaultInputs, handleInputChange }} />
                <RenderInputs {...{ inputs: dynamicInputs, handleInputChange }} />
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
            </ScrollView>
            {!ConcernID ? (
                <View style={{ padding: SPACING.NORMAL }}>
                    <GradientButton loading={savingConcern} onPress={handleSaveConcern} disabled={!isValid || !isDynamicInputsValid}>
                        Submit
                    </GradientButton>
                </View>
            ) : null}
            {concernDetails?.FormUrl ? (
                <View style={{ padding: SPACING.NORMAL, paddingTop: 0 }}>
                    <GradientButton onPress={() => setFormModalVisible(true)}>View 8D form</GradientButton>
                </View>
            ) : null}
        </Content>
    );
};

export default ConcernInitialEvaluationPresentational;
