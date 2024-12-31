import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, Modes, INPUTS_CONSTANTS } from 'constants/app-constant';
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

const ProblemInformationPickerComponent = ({
    name,
    label,
    required,
    value,
    ConcernID,
    concernDetails,
    type,
    editable = true,
    handleInputChange,
    formelementID,
    handleNestedInputChange,
}) => {
    const { theme } = useTheme();
    const [dynamicInputFields, setDynamicInputFields] = useState({
        data: [],
        loading: true,
    });

    // const formRequestBasedOndynamicInputFields = useMemo(() => {
    //     const object = {};
    //     dynamicInputFields.forEach(item => {
    //         object[item.name] = item.value;
    //     });
    //     return object;
    // }, [dynamicInputFields]);

    const handleDynamicInputChange = (name, value) => {
        handleNestedInputChange?.(name, value, formelementID);
        setDynamicInputFields(prevState => {
            return {
                ...prevState,
                data: prevState.data.map(item => {
                    if (item.name === name) {
                        return {
                            ...item,
                            value: value,
                        };
                    }
                    return item;
                }),
            };
        });
    };

    useEffect(() => {
        formelementID && getListData();
    }, [formelementID]);

    const getListData = useCallback(async () => {
        try {
            const { Data } = await postAPI(
                `${API_URL.GET_CUSTOMERS_PICKER}${objToQs({
                    Type: type,
                    FormElementId: formelementID,
                })}`,
            );

            setDynamicInputFields({
                data:
                    Data?.map(data => {
                        return {
                            ...data,
                            value: concernDetails?.[data.name] || data.value,
                            editable: editable,
                        };
                    }) || [],
                loading: false,
            });
        } catch (err) {
            setDynamicInputFields({
                data: [],
                loading: false,
            });
            console.log('🚀 ~ file: team-picker.js:71 ~ getListData ~ err', err);
        }
    }, [formelementID, type, concernDetails]);

    return (
        <View
            style={{
                flex: 1,
                paddingBottom: SPACING.SMALL,
                marginBottom: SPACING.X_SMALL,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
            }}>
            {dynamicInputFields?.loading ? null : (
                <RenderInputs
                    {...{
                        inputs: dynamicInputFields?.data,
                        handleInputChange: (name, value) => {
                            handleInputChange(name, value);
                            handleInputChange('ProblemInformation', value);
                            handleDynamicInputChange(name, value);
                        },
                    }}
                />
            )}
        </View>
    );
};

export default ProblemInformationPickerComponent;
