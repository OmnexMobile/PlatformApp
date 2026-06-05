import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
    ImagePicker,
    RadioButton,
    DatePickerComponent,
    DropdownComponent,
    InputWithLabel,
    TeamPickerComponent,
    TreeViewPickerComponent,
    CheckBox,
    EstimationPickerComponent,
    DynamicPickerComponent,
    NumberInputWithLabel,
    ProblemImages,
    RichTextEditor,
    AttachmentPicker,
    OKPicker,
    NotOKPicker,
    LinkComponent,
    MultiSelectDropdownComponent,
} from 'components';
import { useAppContext } from 'contexts/app-context';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/ApiUrl';
import { APP_VARIABLES, FONT_TYPE, INPUTS_CONSTANTS } from 'constants/app-constant';
import { RFPercentage, openLink } from 'helpers/utils';
import CustomerPickerComponent from './customer-picker';
import ProblemInformationPickerComponent from './problem-information-picker';
import SupplierPickerComponent from './supplier-picker';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { WrapperMultiSelectDropdownComponent } from './multi-select-dropdown';

const WrapperRadioButton = ({ input, handleInputChange }) => {
    const [data, setData] = useState([]);
    const { sites } = useAppContext();

    const getData = async SiteID => {
        const formData = new FormData();
        formData.append(APP_VARIABLES.SITE_ID, SiteID);
        formData.append(APP_VARIABLES.DropDownID, input?.formelementID);
        formData.append(APP_VARIABLES.IsDynamic, input?.dynamic);
        try {
            const res = await postAPI(`${API_URL.GET_CUSTOM_DROPDOWN}`, formData);
            setData(
                (res?.Data || [])?.map(data => ({
                    label: data?.Text,
                    value: data?.Value,
                })),
            );
        } catch (err) {
            console.log('🚀 ~ file: render-inputs.js:39 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData(sites?.selectedSite?.Siteid);
    }, [sites?.selectedSite?.Siteid]);

    return <RadioButton {...{ ...input, options: data, onChange: (name, value) => handleInputChange?.(name, value) }} />;
};

const WrapperCheckBox = ({ input, handleInputChange }) => {
    const [data, setData] = useState([]);
    const { sites } = useAppContext();

    const getData = async SiteID => {
        const formData = new FormData();
        formData.append(APP_VARIABLES.SITE_ID, SiteID);
        formData.append(APP_VARIABLES.DropDownID, input?.formelementID);
        formData.append(APP_VARIABLES.IsDynamic, input?.dynamic);
        try {
            const res = await postAPI(`${API_URL.GET_CUSTOM_DROPDOWN}`, formData);
            setData(
                (res?.Data || [])?.map(data => ({
                    label: data?.Text,
                    value: data?.Value,
                })),
            );
        } catch (err) {
            console.log('🚀 ~ file: render-inputs.js:69 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData(sites?.selectedSite?.Siteid);
    }, [sites?.selectedSite?.Siteid]);

    return <CheckBox {...{ ...input, options: data, onChange: (name, value) => handleInputChange?.(name, value) }} />;
};

const WrapperDropDown = ({ input, handleInputChange }) => {
    const [data, setData] = useState([]);
    const { sites } = useAppContext();

    const getData = async SiteID => {
        const formData = new FormData();
        formData.append(APP_VARIABLES.SITE_ID, SiteID);
        formData.append(APP_VARIABLES.DropDownID, input?.formelementID);
        formData.append(APP_VARIABLES.IsDynamic, input?.dynamic);
        try {
            const res = await postAPI(`${API_URL.GET_CUSTOM_DROPDOWN}`, formData);
            setData(
                (res?.Data || [])?.map(data => ({
                    label: data?.Text,
                    value: data?.Value,
                })),
            );
        } catch (err) {
            console.log('🚀 ~ file: render-inputs.js:99 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData(sites?.selectedSite?.Siteid);
    }, [sites?.selectedSite?.Siteid]);

    return (
        <DropdownComponent
            {...{
                label: input?.label,
                onChange: value => handleInputChange(input?.name, value),
                data,
                ...input,
                value: (input?.value || '')?.toString(),
            }}
        />
    );

    if (!!data?.length)
        return (
            <DropdownComponent
                {...{
                    label: input?.label,
                    onChange: value => handleInputChange(input?.name, value),
                    data,
                    ...input,
                    value: (input?.value || '')?.toString(),
                }}
            />
        );

    return null;
};

const RenderInputs = ({
    inputs,
    handleInputChange,
    handleNestedInputChange,
    concernDetails,
    handleProblemImages,
    handleAttachments,
    handleOKPicker,
    handleNotOKPicker,
    ConcernID,
    isEditPage,
    padding = false,
}) => {
    const renderInputs = (input, index) => {
        const inputKey = `${input?.name || 'input'}-${input?.formelementID || input?.label || index}`;
        switch (input?.type) {
            case INPUTS_CONSTANTS.DROPDOWN:
                return input?.formelementID ? (
                    <WrapperDropDown
                        key={inputKey}
                        {...{
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <DropdownComponent
                        key={inputKey}
                        {...{
                            label: input?.label,
                            value: input?.name,
                            onChange: value => handleInputChange(input?.name, value),
                            data: input?.data,
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.MULTI_SELECT:
                return input?.formelementID ? (
                    <WrapperMultiSelectDropdownComponent
                        key={inputKey}
                        {...{
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <MultiSelectDropdownComponent
                        key={inputKey}
                        {...{
                            label: input?.label,
                            value: input?.name,
                            onChange: value => handleInputChange(input?.name, value),
                            data: input?.data,
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.INPUT:
                return (
                    <InputWithLabel
                        key={inputKey}
                        {...{
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            onChange: (name, value) => handleInputChange?.(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.NUMBER:
                return (
                    <NumberInputWithLabel
                        key={inputKey}
                        {...{
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            onChange: (name, value) => handleInputChange?.(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.TEXT_INPUT:
                return (
                    <InputWithLabel
                        key={inputKey}
                        {...{
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            onChange: (name, value) => handleInputChange?.(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.LINK:
                return (
                    // <View
                    //     style={{
                    //         paddingHorizontal: SPACING.NORMAL,
                    //     }}>
                    //     <View
                    //         style={{
                    //             borderRadius: 5,
                    //         }}>
                    //         <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    //             {input?.label}
                    //         </TextComponent>
                    //         <TouchableOpacity activeOpacity={1} onPress={() => openLink(input?.masterurl)}>
                    //             <TextComponent
                    //                 color={theme.colors.primaryThemeColor}
                    //                 style={{ fontSize: FONT_SIZE.SMALL, textDecorationLine: 'underline' }}
                    //                 type={FONT_TYPE.BOLD}>
                    //                 Open Link
                    //             </TextComponent>
                    //         </TouchableOpacity>
                    //     </View>
                    // </View>
                    <LinkComponent key={inputKey} {...{ input }} />
                );
            case INPUTS_CONSTANTS.RICH_EDITOR:
                return (
                    <RichTextEditor
                        key={inputKey}
                        {...{
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            multiline: Platform.OS === 'ios' ? false : true,
                            numberOfLines: 5,
                            inputStyle: { textAlignVertical: 'top', minHeight: RFPercentage(10) },
                            maxLength: 100,
                            onChange: (name, value) => handleInputChange?.(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.DATE_PICKER:
                return <DatePickerComponent key={inputKey} {...{ ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />;
            case INPUTS_CONSTANTS.ESTIMATION_PICKER:
                return <EstimationPickerComponent key={inputKey} {...{ ...input, handleInputChange, handleNestedInputChange, concernDetails }} />;
            case INPUTS_CONSTANTS.CUSTOMER_PICKER:
                return <CustomerPickerComponent key={inputKey} {...{ ...input, handleInputChange, handleNestedInputChange, concernDetails }} />;
            case INPUTS_CONSTANTS.SUPPLIER_PICKER:
                return <SupplierPickerComponent key={inputKey} {...{ ...input, handleInputChange, handleNestedInputChange, concernDetails }} />;
            case INPUTS_CONSTANTS.PROBLEMINFORMATION_PICKER:
                return (
                    <ProblemInformationPickerComponent key={inputKey} {...{ ...input, handleInputChange, handleNestedInputChange, concernDetails }} />
                );
            case INPUTS_CONSTANTS.EQUIPMENT_PICKER:
                return <DynamicPickerComponent key={inputKey} {...{ ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.TEAM_PICKER:
                return <TeamPickerComponent key={inputKey} {...{ ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.PROBLEM_IMAGES:
                return (
                    <ProblemImages
                        key={inputKey}
                        {...{ ...input, handleInputChange, handleProblemImages, ConcernID, isEditPage, concernDetails }}
                        allowAdd
                    />
                );
            case INPUTS_CONSTANTS.ATTACHMENT_PICKER:
                return (
                    <AttachmentPicker
                        key={inputKey}
                        {...{ ...input, handleInputChange, handleAttachments, ConcernID, isEditPage, concernDetails }}
                        allowAdd
                    />
                );
            case INPUTS_CONSTANTS.OK_PICKER:
                return (
                    <OKPicker
                        key={inputKey}
                        {...{
                            ...input,
                            handleInputChange,
                            handleOKPicker,
                            ConcernID,
                            isEditPage,
                            concernDetails,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.NOTOK_PICKER:
                return (
                    <NotOKPicker
                        key={inputKey}
                        {...{
                            ...input,
                            handleInputChange,
                            handleNotOKPicker,
                            ConcernID,
                            isEditPage,
                            concernDetails,
                        }}
                    />
                );
            // return <DynamicPickerComponent {...{ key: `${input.name}-${input.formelementID || input.label}`, ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.TREE_PICKER:
                return null;
                return <TreeViewPickerComponent key={inputKey} {...{ ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.RADIO_BUTTON:
                return input?.formelementID ? (
                    <WrapperRadioButton
                        key={inputKey}
                        {...{
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <RadioButton key={inputKey} {...{ ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />
                );
            case INPUTS_CONSTANTS.RADIOBUTTON:
                return input?.formelementID ? (
                    <WrapperRadioButton
                        key={inputKey}
                        {...{
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <RadioButton key={inputKey} {...{ ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />
                );
            case INPUTS_CONSTANTS.CHECK_BOX:
                return input?.formelementID ? (
                    <WrapperCheckBox
                        key={inputKey}
                        {...{
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <CheckBox key={inputKey} {...{ ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />
                );
            // case INPUTS_CONSTANTS.IMAGE_PICKER:
            //     return <ImagePicker {...{ key: `${input.name}-${input.formelementID || input.label}`, ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />;
            // case INPUTS_CONSTANTS.FILE_PICKER:
            //     return <FilePicker {...{ key: `${input.name}-${input.formelementID || input.label}`, ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />;
            case INPUTS_CONSTANTS.FILE_UPLOAD:
                return <AttachmentPicker key={inputKey} {...{ ...input, handleInputChange, handleAttachments, ConcernID }} allowAdd />;
            // return <FilePicker {...{ key: `${input.name}-${input.formelementID || input.label}`, ...input, onChange: (name, value) => handleInputChange?.(name, value) }} />;
            default:
                break;
        }
    };
    return <View style={{ paddingBottom: padding? SPACING.XX_LARGE : 0 }}>{inputs?.map((input, index) => renderInputs(input, index))}</View>;
};
export default RenderInputs;
