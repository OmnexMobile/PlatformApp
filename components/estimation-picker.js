import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, Modes, INPUTS_CONSTANTS, APP_VARIABLES } from 'constants/app-constant';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import { formReq, objToQs, showErrorMessage } from 'helpers/utils';
import TextComponent from './text';
import ModalComponent from './modal-component';
import IconComponent from './icon-component';
import GradientButton from './gradient-button';
import RenderInputs from './render-inputs';
import KeyboardAwareScrollViewComponent from './keyboard-aware-scroll-view';

const TeamContext = createContext({});

// const DATA = [
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Extra Incoming Inspection',
//         masterurl: '',
//         name: 'PreventionCosts',
//         required: false,
//         type: 'INPUT',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Sorting Cost',
//         masterurl: '',
//         name: 'ExternalFailureCosts',
//         required: false,
//         type: 'INPUT',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Rework Cost',
//         masterurl: '',
//         name: 'InternalFailureCosts',
//         required: false,
//         type: 'INPUT',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Rejects Cost',
//         masterurl: '',
//         name: 'AppraisalCosts',
//         required: false,
//         type: 'INPUT',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Other Cost',
//         masterurl: '',
//         name: 'OthersCost',
//         required: false,
//         type: 'INPUT',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: false,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Guidelines',
//         masterurl: 'https://www.google.com/',
//         name: 'Guidelines',
//         required: false,
//         type: 'LINK',
//         value: '',
//     },
//     {
//         dynamic: false,
//         editable: true,
//         fieldType: 0,
//         formelementID: 16,
//         label: 'Currency',
//         masterurl: '',
//         name: 'CurrencyId',
//         required: false,
//         type: 'DROPDOWN',
//         value: '',
//     },
// ];

const useTeamContext = () => {
    return useContext(TeamContext);
};
const TeamProvider = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    return <TeamContext.Provider value={{ selectedTeam, setSelectedTeam }}>{children}</TeamContext.Provider>;
};

const Modal = ({
    modalVisible,
    setModalVisible,
    ConcernID,
    handleInputChange,
    name,
    label,
    dynamicInputs,
    estimationDetails,
    setEstimationDetails,
    handleNestedInputChange,
    formelementID,
    setTotalAmount,
    concernDetails,
}) => {
    const [dropdownList, setDropdownList] = useState({
        data: null,
        loading: false,
    });
    const { sites } = useAppContext();
    const [inputs, setInputs] = useState(dynamicInputs?.data);
    const { theme } = useTheme();

    const handleCancel = () => {
        setModalVisible(false);
        // setEstimationDetails(DEFAULT_ESTIMATION_DETAILS);
        // setInputs(dynamicInputs?.data?.map(data => ({ ...data, value: '' })));
    };

    useEffect(() => {
        setInputs(dynamicInputs?.data?.map(data => ({ ...data, keyboardType: 'numeric' })));
    }, [dynamicInputs?.data]);

    // useEffect(() => {
    //     selectedTeam?.name && handleInputChange?.(selectedTeam?.name);
    // }, [selectedTeam?.name]);

    const handleDynamicInputChange = (label, value) => {
        const updatedInputs = inputs?.map(input => ({
            ...input,
            ...(input?.name === label && {
                value,
            }),
        }));
        setInputs([...updatedInputs]);
        handleNestedInputChange?.(label, value, formelementID);
    };

    const total = inputs?.reduce((acc, current) => +current?.value + +acc, 0);

    const getDropdownList = async SiteId => {
        try {
            const dropDownRes = await postAPI(
                `${API_URL.DROPDOWN_LIST}`,
                formReq({
                    [APP_VARIABLES.SITE_ID]: SiteId,
                }),
            );
            setDropdownList({
                ...dropdownList,
                data: (dropDownRes?.Data?.Currency || [])?.map(currency => ({
                    label: currency?.ShortName,
                    value: currency?.CurrencyId,
                })),
                loading: false,
            });
        } catch (err) {
            setDropdownList({
                ...dropdownList,
                loading: false,
            });
            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
        }
    };

    useEffect(() => {
        if (sites?.selectedSite) {
            getDropdownList(sites?.selectedSite?.SiteId);
        }
    }, [sites?.selectedSite]);

    const defaultInputs = useMemo(
        () => [
            {
                dynamic: false,
                editable: true,
                fieldType: 0,
                label: 'Currency',
                masterurl: '',
                name: 'CurrencyId',
                required: false,
                search: false,
                type: 'DROPDOWN',
                value: '',
                ...(concernDetails?.CurrencyId && {
                    value: concernDetails?.CurrencyId,
                }),
                data: dropdownList?.data || [],
            },
        ],
        [dropdownList?.data, concernDetails?.CurrencyId],
    );

    useEffect(() => {
        setTotalAmount(total);
    }, [inputs]);

    return (
        <ModalComponent showPrimaryColorOnTop modalVisible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View
                    style={{
                        borderRadius: SPACING.SMALL,
                        flex: 1,
                    }}>
                    <View
                        style={{
                            backgroundColor: theme.colors.primaryThemeColor,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            padding: SPACING.SMALL,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <TextComponent
                            fontSize={FONT_SIZE.LARGE}
                            color={theme.selectedMode === Modes.light ? COLORS.white : theme.mode.textColor}
                            type={FONT_TYPE.BOLD}>
                            {label}
                        </TextComponent>
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={{
                                padding: SPACING.SMALL,
                                alignSelf: 'flex-end',
                                borderRadius: SPACING.SMALL,
                                backgroundColor: theme.colors.primaryThemeColor,
                            }}>
                            <IconComponent size={FONT_SIZE.X_LARGE} color={COLORS.white} name="close" type={ICON_TYPE.AntDesign} />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollViewComponent noPadding>
                        <RenderInputs {...{ inputs, handleInputChange: handleDynamicInputChange }} />
                        <RenderInputs {...{ inputs: defaultInputs, handleInputChange: handleDynamicInputChange }} />
                    </KeyboardAwareScrollViewComponent>
                </View>
            </View>

            <View style={{ padding: SPACING.NORMAL, backgroundColor: theme.mode.backgroundColor }}>
                {total ? (
                    <GradientButton
                        onPress={() => {
                            handleInputChange(name, total);
                            setModalVisible(false);
                        }}>
                        Save
                    </GradientButton>
                ) : null}
            </View>
        </ModalComponent>
    );
};

const InputContent = ({ name, label, required, value, setModalVisible, editable, ConcernID }) => {
    const { theme } = useTheme();
    const { selectedTeam } = useTeamContext();
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <TouchableOpacity
                disabled={!editable}
                onPress={() => editable && setModalVisible(true)}
                activeOpacity={0.8}
                style={{
                    borderBottomWidth: 1,
                    borderColor: theme.mode.borderColor,
                    paddingVertical: SPACING.X_SMALL,
                }}>
                <TextComponent
                    style={{
                        fontSize: FONT_SIZE.LARGE,
                        paddingVertical: SPACING.X_SMALL,
                        color: !value && !selectedTeam?.name ? COLORS.searchText : theme?.mode.textColor,
                    }}>
                    {value || selectedTeam?.name || '0'}
                </TextComponent>
            </TouchableOpacity>
        </>
    );
};

const DEFAULT_ESTIMATION_DETAILS = {
    PreventionCosts: 0,
    ExternalFailureCosts: 0,
    InternalFailureCosts: 0,
    AppraisalCosts: 0,
};

const EstimationPickerComponent = ({
    name,
    label,
    required,
    value,
    editable = true,
    ConcernID,
    handleInputChange,
    formelementID,
    handleDynamicInputChange,
    handleNestedInputChange,
    concernDetails,
}) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [estimationDetails, setEstimationDetails] = useState(DEFAULT_ESTIMATION_DETAILS);
    const [dynamicInputs, setDynamicInputs] = useState({
        data: [],
        loading: false,
    });
    const [totalAmount, setTotalAmount] = useState(0);

    const getListData = useCallback(async () => {
        try {
            const { Data } = await postAPI(
                `${API_URL.GET_ESTIMATION_PICKER}${objToQs({
                    Type: INPUTS_CONSTANTS.ESTIMATION_PICKER,
                    FormElementId: formelementID,
                })}`,
            );
            setDynamicInputs({
                // data:
                //     DATA?.map(data => {
                //         return {
                //             ...data,
                //             ...(concernDetails?.[data.name] && {
                //                 value: concernDetails?.[data.name]?.toString(),
                //             }),
                //         };
                //     }) || [],
                data:
                    Data?.map(data => {
                        return {
                            ...data,
                            ...(concernDetails?.[data.name] && {
                                value: concernDetails?.[data.name]?.toString(),
                            }),
                        };
                    }) || [],
                loading: false,
            });
        } catch (err) {
            setDynamicInputs({
                data: [],
                loading: false,
            });
            console.log('🚀 ~ file: team-picker.js:71 ~ getListData ~ err', err);
        }
    }, [formelementID, concernDetails]);

    const total = dynamicInputs?.data?.reduce((acc, current) => +current?.value + +acc, 0);

    useEffect(() => {
        getListData();
    }, []);

    useEffect(() => {
        handleInputChange?.(name, total);
    }, [total]);
    console.log('🚀 ~ estimationDetails:concernDetails?.CurrencyId', concernDetails?.CurrencyId,estimationDetails, total, dynamicInputs);

    return (
        <TeamProvider>
            <View
                style={{
                    padding: SPACING.NORMAL,
                    flex: 1,
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.X_SMALL,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                }}>
                <InputContent {...{ name, label, required, value: totalAmount, setModalVisible, editable, ConcernID }} />
            </View>
            <Modal
                {...{
                    modalVisible,
                    setModalVisible,
                    ConcernID,
                    handleInputChange,
                    name,
                    label,
                    dynamicInputs,
                    estimationDetails,
                    setEstimationDetails,
                    handleDynamicInputChange,
                    handleNestedInputChange,
                    formelementID,
                    setTotalAmount,
                    concernDetails,
                }}
            />
        </TeamProvider>
    );
};

export default EstimationPickerComponent;
