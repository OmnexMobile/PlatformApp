import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import {
    ImagePicker,
    RadioButton,
    DatePickerComponent,
    DropdownComponent,
    InputWithLabel,
    TeamPickerComponent,
    FilePicker,
    TreeViewPickerComponent,
    CheckBox,
} from 'components';
import { useAppContext } from 'contexts/app-context';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/ApiUrl';
import { APP_VARIABLES, INPUTS_CONSTANTS } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';

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
            console.log('🚀 ~ file: render-inputs.js:41 ~ getData ~ res?.Data', res?.Data);
        } catch (err) {
            console.log('🚀 ~ file: render-inputs.js:39 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData(sites?.selectedSite?.SiteId);
    }, [sites?.selectedSite?.SiteId]);

    return <RadioButton {...{ ...input, options: data, onChange: (name, value) => handleInputChange(name, value) }} />;
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
            console.log('🚀 ~ file: render-inputs.js:62 ~ getData ~ res', res?.Data);
        } catch (err) {
            console.log('🚀 ~ file: render-inputs.js:69 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData(sites?.selectedSite?.SiteId);
    }, [sites?.selectedSite?.SiteId]);

    return <CheckBox {...{ ...input, options: data, onChange: (name, value) => handleInputChange(name, value) }} />;
};

const WrapperDropDown = ({ input, handleInputChange }) => {
    const [data, setData] = useState([]);
    const { sites } = useAppContext();

    const getData = async SiteID => {
        console.log('🚀 ~ file: render-inputs.js:85 ~ getData ~ SiteID', SiteID);
        const formData = new FormData();
        formData.append(APP_VARIABLES.SITE_ID, SiteID);
        formData.append(APP_VARIABLES.DropDownID, input?.formelementID);
        formData.append(APP_VARIABLES.IsDynamic, input?.dynamic);
        try {
            const res = await postAPI(`${API_URL.GET_CUSTOM_DROPDOWN}`, formData);
            console.log('🚀 ~ file: render-inputs.js:92 ~ getData ~ res', res);
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
        getData(sites?.selectedSite?.SiteId);
    }, [sites?.selectedSite?.SiteId]);

    if (!!data?.length)
        return (
            <DropdownComponent
                {...{
                    label: input?.label,
                    value: input?.name,
                    onChange: value => handleInputChange(input?.name, value),
                    data,
                    ...input,
                }}
            />
        );

    return null;
};

const RenderInputs = ({ inputs, handleInputChange }) => {
    const renderInputs = (input, index) => {
        switch (input?.type) {
            case INPUTS_CONSTANTS.DROPDOWN:
                return input?.formelementID ? (
                    <WrapperDropDown
                        {...{
                            key: index,
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <DropdownComponent
                        {...{
                            key: index,
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
                        {...{
                            key: index,
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            onChange: (name, value) => handleInputChange(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.RICH_EDITOR:
                return (
                    <InputWithLabel
                        {...{
                            key: index,
                            label: input?.label,
                            name: input?.name,
                            value: input?.value,
                            multiline: true,
                            numberOfLines: 5,
                            inputStyle: { textAlignVertical: 'top', minHeight: RFPercentage(10) },
                            onChange: (name, value) => handleInputChange(name, value),
                            ...input,
                        }}
                    />
                );
            case INPUTS_CONSTANTS.DATE_PICKER:
                return <DatePickerComponent {...{ key: index, ...input, onChange: (name, value) => handleInputChange(name, value) }} />;
            case INPUTS_CONSTANTS.TEAM_PICKER:
                return <TeamPickerComponent {...{ key: index, ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.TREE_VIEW_PICKER:
                return <TreeViewPickerComponent {...{ key: index, ...input, handleInputChange }} />;
            case INPUTS_CONSTANTS.RADIO_BUTTON:
                return input?.formelementID ? (
                    <WrapperRadioButton
                        {...{
                            key: index,
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <RadioButton {...{ key: index, ...input, onChange: (name, value) => handleInputChange(name, value) }} />
                );
            case INPUTS_CONSTANTS.CHECK_BOX:
                return input?.formelementID ? (
                    <WrapperCheckBox
                        {...{
                            key: index,
                            input,
                            handleInputChange,
                        }}
                    />
                ) : (
                    <CheckBox {...{ key: index, ...input, onChange: (name, value) => handleInputChange(name, value) }} />
                );
            // case INPUTS_CONSTANTS.IMAGE_PICKER:
            //     return <ImagePicker {...{ key: index, ...input, onChange: (name, value) => handleInputChange(name, value) }} />;
            // case INPUTS_CONSTANTS.FILE_PICKER:
            //     return <FilePicker {...{ key: index, ...input, onChange: (name, value) => handleInputChange(name, value) }} />;
            default:
                break;
        }
    };
    return <View>{inputs?.map((input, index) => renderInputs(input, index))}</View>;
};
export default RenderInputs;
