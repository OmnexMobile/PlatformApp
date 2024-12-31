import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import useTheme from 'theme/useTheme';
import { objToQs } from 'helpers/utils';
import RenderInputs from './render-inputs';
import DropdownComponent from './dropdown';
import InputWithLabel from './input-with-label';
import RadioButton from './radio-button';

const DEFAULT_CUSTOMER_DETAILS = {
    NotifySupplier: '0',
    SupplierContactNumber: '',
    SupplierPartAddress: '',
    SupplierContactEmail: '',
    SupplierPrimaryContactName: '',
    ManufacturingLocation: '',
    SQEManager: '',
    SQEEngineer: '',
};

const SupplierPickerComponent = ({
    name,
    label,
    required,
    ConcernID,
    value,
    type,
    editable = true,
    handleInputChange,
    formelementID,
    handleNestedInputChange,
    concernDetails,
}) => {
    const { theme } = useTheme();
    const [dynamicInputFields, setDynamicInputFields] = useState([]);
    const [supplierDetails, setSupplierDetails] = useState(DEFAULT_CUSTOMER_DETAILS);
    const [supplierAddress, setSupplierAddress] = useState({
        data: [],
        loading: false,
    });
    const [supplierContacts, setSupplierContacts] = useState({
        data: [],
        loading: false,
    });
    const [SQEManagerValue, setSQEManagerValue] = useState('');
    const [SQEEngineerValue, setSQEEngineerValue] = useState('');

    const [dynamicInputs, setDynamicInputs] = useState({
        data: [],
        staticInputs: [],
        dyInputs: [],
        loading: false,
    });

    const handleSupplierDetails = (name, value) => {
        setSupplierDetails(supplierDetails => ({
            ...supplierDetails,
            [name]: value,
        }));
    };

    const handleDynamicInputChange = (name, value) => {
        handleSupplierDetails(name, value);
        handleNestedInputChange(name, value, formelementID);
        setDynamicInputFields(prevState => {
            return prevState.map(item => {
                if (item.name === name) {
                    return {
                        ...item,
                        value: value,
                    };
                }
                return item;
            });
        });
    };

    const getSupplierContactDetails = async () => {
        try {
            const formData = new FormData();
            formData.append('SupplierContactId', supplierDetails?.SupplierPrimaryContactName);
            const { Data } = await postAPI(`${API_URL.GET_SUPPLIERS_CONTACT_DETAILS}`, formData);
            const contactDetails = Data?.[0] || {};
            const fieldValues = {
                SupplierContactEmail: contactDetails?.Email,
                SupplierContactNumber: contactDetails?.Phone,
            };
            const nestedFieldValues = {
                SupplierContactEmail: {
                    Value: contactDetails?.Email || '',
                    Key: formelementID,
                },
                SupplierContactNumber: {
                    Value: contactDetails?.Phone || '',
                    Key: formelementID,
                },
            };
            setSupplierDetails(supplierDetails => ({
                ...supplierDetails,
                ...fieldValues,
            }));
            // handleInputChange('', fieldValues, true);
            handleNestedInputChange('', fieldValues, formelementID, true);
        } catch (err) {}
    };

    const getSupplierContactPersons = async () => {
        try {
            const formData = new FormData();
            formData.append('SupplierID', value);
            formData.append('SupplierAddressID', supplierDetails?.SupplierPartAddress);
            const { Data } = await postAPI(`${API_URL.GET_SUPPLIERS_CONTACT_PERSONS}`, formData);
            console.log('🚀 ~ getSupplierContactPersons ~ Data:', Data);
            setSupplierContacts({
                data:
                    (Data || [])?.map(data => ({
                        label: data?.Name,
                        value: data?.UserId,
                    })) || [],
                loading: false,
            });

            // concernDetails?.ContactPersonId &&
            //     setCustomerDetails(customerDetails => ({
            //         ...customerDetails,
            //         CustomerPrimaryContactName: concernDetails?.ContactPersonId,
            //     }));
        } catch (err) {
            setSupplierContacts({
                data: [],
                loading: false,
            });
        }
    };

    const getSupplierAddress = async () => {
        try {
            const formData = new FormData();
            formData.append('SupplierID', value);
            const { Data } = await postAPI(`${API_URL.GET_SUPPLIERS_ADDRESS}`, formData);
            setSupplierAddress({
                data:
                    (Data || [])?.map(data => ({
                        label: data?.Address,
                        value: data?.SupplierAddressID,
                    })) || [],
                loading: false,
            });
        } catch (err) {
            setSupplierAddress({
                data: [],
                loading: false,
            });
        }
    };

    const getSupplierSQEManager = async () => {
        try {
            const formData = new FormData();
            formData.append('SupplierID', value);
            const { Data } = await postAPI(`${API_URL.GET_SQE_MANAGER}`, formData);
            const details = Data?.[0] || {};
            console.log('🚀 ~ getSupplierSQEManager ~ details:', details);
            const fieldValues = {
                SQEManager: details?.FullName || '',
            };
            const nestedFieldValues = {
                SQEManager: {
                    Value: details?.FullName || '',
                    Key: formelementID,
                },
            };
            setSupplierDetails(supplierDetails => ({
                ...supplierDetails,
                ...fieldValues,
            }));
            setSQEManagerValue(details?.FullName || '');
            // handleInputChange('', fieldValues, true);
            handleNestedInputChange('', fieldValues, formelementID, true);
        } catch (err) {
            console.log('🚀 ~ getSupplierSQEManager ~ err:', err);
            setSupplierAddress({
                data: [],
                loading: false,
            });
        }
    };

    const getSupplierSQEEngineer = async () => {
        try {
            const formData = new FormData();
            formData.append('SupplierID', value);
            const { Data } = await postAPI(`${API_URL.GET_SQE_ENGINEER}`, formData);
            const details = Data?.[0] || {};
            const fieldValues = {
                SQEEngineer: details?.FullName || '',
            };
            // const nestedFieldValues = {
            //     SQEEngineer: {
            //         Value: details?.FullName,
            //         Key: formelementID,
            //     },
            // };
            setSupplierDetails(supplierDetails => ({
                ...supplierDetails,
                ...fieldValues,
            }));
            setSQEEngineerValue(details?.FullName || '');
            // handleInputChange('', fieldValues, true);
            handleNestedInputChange('', fieldValues, formelementID, true);
        } catch (err) {
            console.log('🚀 ~ getSupplierSQEEngineer ~ err:', err);
            setSupplierAddress({
                data: [],
                loading: false,
            });
        }
    };

    useEffect(() => {
        formelementID && supplierDetails?.SupplierPartAddress && getSupplierContactPersons();
    }, [formelementID, supplierDetails?.SupplierPartAddress]);

    useEffect(() => {
        formelementID && supplierDetails?.SupplierPrimaryContactName && getSupplierContactDetails();
    }, [formelementID, supplierDetails?.SupplierPrimaryContactName]);

    useEffect(() => {
        if (formelementID && value) {
            getSupplierAddress();
            getSupplierSQEManager();
            getSupplierSQEEngineer();
        }
    }, [formelementID, value]);

    useEffect(() => {
        formelementID && getListData();
    }, [formelementID]);

    const getListData = useCallback(async () => {
        try {
            const { Data } = await postAPI(
                `${API_URL.GET_CUSTOMERS_PICKER}${objToQs({
                    Type: 'SUPPLIER_PICKER',
                    FormElementId: formelementID,
                })}`,
            );
            console.log('🚀 ~ getListData ~ Data:', Data);
            setDynamicInputs({
                data: Data || [],
                staticInputs:
                    Data?.filter(data => data?.name === 'SupplierID')?.map(data => {
                        return {
                            ...data,
                            value: concernDetails?.['SupplierID']?.toString() || data.value,
                            editable,
                            search: true,
                        };
                    }) || [],
                // staticInputs: Data?.filter(data => data?.name === 'SupplierID') || [],
                dyInputs: Data?.slice(1) || [],
                loading: false,
            });

            setSupplierDetails({
                NotifySupplier: concernDetails?.NotifySupplier?.toString(),
                SupplierContactNumber: concernDetails?.SupplierContactNumber,
                SupplierPartAddress: concernDetails?.SupplierPartAddress,
                SupplierContactEmail: concernDetails?.SupplierContactEmail,
                SupplierPrimaryContactName: concernDetails?.SupplierPrimaryContactId,
                ManufacturingLocation: concernDetails?.concernDetails,
                SQEManager: concernDetails?.SQEManager,
                SQEEngineer: concernDetails?.SQEEngineer,
            });
        } catch (err) {
            setDynamicInputs({
                data: [],
                loading: false,
            });
        }
    }, [formelementID, type, concernDetails]);

    const SQE_Manager_Label = dynamicInputs?.data?.find(data => data?.name === 'SQEManager')?.label;
    const SQE_Engineer_Label = dynamicInputs?.data?.find(data => data?.name === 'SQEEngineer')?.label;

    return (
        <View
            style={{
                flex: 1,
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
            }}>
            <RadioButton
                {...{
                    editable,
                    label: 'Notify Supplier',
                    value: supplierDetails?.NotifySupplier?.toString(),
                    name: 'NotifySupplier',
                    onChange: (name, value) => handleDynamicInputChange('NotifySupplier', parseInt(value)),
                    options: [
                        {
                            label: 'Yes',
                            value: '1',
                        },
                        {
                            label: 'No',
                            value: '0',
                        },
                    ],
                }}
            />
            {dynamicInputs?.loading ? null : (
                <RenderInputs
                    {...{
                        inputs: dynamicInputs?.staticInputs,
                        handleInputChange: (name, value) => {
                            handleInputChange(name, value);
                            handleNestedInputChange(name, value, formelementID);
                            // setSupplierDetails(DEFAULT_CUSTOMER_DETAILS);
                        },
                    }}
                />
            )}
            <DropdownComponent
                {...{
                    label: 'Supplier Part Address',
                    value: supplierDetails?.SupplierPartAddress,
                    onChange: value => handleDynamicInputChange('SupplierPartAddress', value),
                    data: supplierAddress?.data,
                    editable,
                }}
            />
            <DropdownComponent
                {...{
                    label: 'Primary Contact Name',
                    value: supplierDetails?.SupplierPrimaryContactName,
                    onChange: value => handleDynamicInputChange('SupplierPrimaryContactName', value),
                    data: supplierContacts?.data,
                    editable,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Contact Number',
                    name: 'SupplierContactNumber',
                    value: supplierDetails?.SupplierContactNumber,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Contact Email',
                    name: 'SupplierContactEmail',
                    value: supplierDetails?.SupplierContactEmail,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: SQE_Manager_Label || 'SQE Manager',
                    name: 'SQEManager',
                    value: SQEManagerValue,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: SQE_Engineer_Label || 'SQE Engineer',
                    name: 'SQEEngineer',
                    value: SQEEngineerValue,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            {/* {dynamicInputs?.loading ? null : <RenderInputs {...{ inputs: dynamicInputFields, handleInputChange: handleDynamicInputChange }} />} */}
        </View>
    );
};

export default SupplierPickerComponent;
