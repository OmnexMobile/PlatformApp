import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import useTheme from 'theme/useTheme';
import { objToQs } from 'helpers/utils';
import TextComponent from './text';
import RenderInputs from './render-inputs';

const TeamContext = createContext({});

const useTeamContext = () => {
    return useContext(TeamContext);
};

const ViewComponent = ({ dynamicInputs }) => {
    const { selectedTeam } = useTeamContext();
    const [inputs, setInputs] = useState(dynamicInputs?.data);
    const { theme } = useTheme();

    useEffect(() => {
        setInputs(dynamicInputs?.data?.map(data => ({ ...data })));
    }, [dynamicInputs?.data]);

    const handleInput = (label, value) => {
        const updatedInputs = inputs?.map(input => ({
            ...input,
            ...(input?.name === label && {
                value,
            }),
        }));
        setInputs([...updatedInputs]);
    };

    return (
        <View>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View>
                    <RenderInputs {...{ inputs, handleInputChange: handleInput }} />
                </View>
            </View>
        </View>
    );
};

const InputContent = ({ label, required }) => {
    const { theme } = useTheme();
    const { selectedTeam } = useTeamContext();
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.NORMAL }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
        </>
    );
};

const DynamicPickerComponent = ({ name, label, required, value, type, editable = true, ConcernID, handleInputChange, formelementID }) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [dynamicInputs, setDynamicInputs] = useState({
        data: [],
        loading: false,
    });

    useEffect(() => {
        formelementID && getListData();
    }, [formelementID]);

    const getListData = async () => {
        try {
            const { Data } = await postAPI(
                `${API_URL.GET_ESTIMATION_PICKER}${objToQs({
                    Type: type,
                    FormElementId: formelementID,
                })}`,
            );
            setDynamicInputs({
                data: Data,
                loading: false,
            });
        } catch (err) {
            setDynamicInputs({
                data: [],
                loading: false,
            });
            console.log('🚀 ~ file: team-picker.js:71 ~ getListData ~ err', err);
        }
    };
    return (
        <View
            style={{
                flex: 1,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.X_SMALL,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
            }}>
            <ViewComponent {...{ modalVisible, setModalVisible, ConcernID, handleInputChange, name, label, dynamicInputs }} />
            <InputContent {...{ name, label, required, value, setModalVisible, editable, ConcernID }} />
        </View>
    );
};

export default DynamicPickerComponent;
