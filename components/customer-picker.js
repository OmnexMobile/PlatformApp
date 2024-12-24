import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import useTheme from 'theme/useTheme';
import { objToQs } from 'helpers/utils';
import RenderInputs from './render-inputs';
import DropdownComponent from './dropdown';
import InputWithLabel from './input-with-label';

const TeamContext = createContext({});

const useTeamContext = () => {
    return useContext(TeamContext);
};

const DEFAULT_CUSTOMER_DETAILS = {
    CustomerContactNumber: '',
    CustomerAddress: '',
    CustomerContactEmail: '',
    CustomerPrimaryContactName: '',
    CustomerPartNumber: '',
    CustomerContactSupervisorName: '',
    CustomerContactNextLevel: '',
    CustomerContactNextLevelPhNo: '',
    CustomerContactNextLevelEmail: '',
};

const CustomerPickerComponent = ({
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
    console.log('🚀 ~ editable:', editable);
    const { theme } = useTheme();
    const [dynamicInputFields, setDynamicInputFields] = useState([]);
    const [customerDetails, setCustomerDetails] = useState(DEFAULT_CUSTOMER_DETAILS);
    const [customerAddress, setCustomerAddress] = useState({
        data: [],
        loading: false,
    });
    const [customerContacts, setCustomerContacts] = useState({
        data: [],
        loading: false,
    });
    const [dynamicInputs, setDynamicInputs] = useState({
        data: [],
        staticInputs: [],
        dyInputs: [],
        loading: false,
    });

    const handleCustomerDetails = (name, value) => {
        setCustomerDetails(customerDetails => ({
            ...customerDetails,
            [name]: value,
        }));
    };

    const handleDynamicInputChange = (name, value) => {
        handleCustomerDetails(name, value);
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

    const getCustomerContactDetails = async () => {
        try {
            const formData = new FormData();
            formData.append('ContactPersonID', customerDetails?.CustomerPrimaryContactName);
            const { Data } = await postAPI(`${API_URL.GET_CUSTOMERS_CONTACT_DETAILS}`, formData);
            const contactDetails = Data?.[0] || {};
            // console.log('🚀 ~ getCustomerContactDetails ~ contactDetails:', contactDetails);

            // const nestedFieldValues = {
            //     CustomerContactEmail: {
            //         Value: contactDetails?.Email || '',
            //         Key: formelementID,
            //     },
            //     CustomerContactNumber: {
            //         Value: contactDetails?.Phone || '',
            //         Key: formelementID,
            //     },
            //     CustomerContactSupervisorName: {
            //         Value: contactDetails?.SupervisorName || '',
            //         Key: formelementID,
            //     },
            //     CustomerContactNextLevel: {
            //         Value: contactDetails?.NextLevelContact || '',
            //         Key: formelementID,
            //     },
            //     CustomerContactNextLevelPhNo: {
            //         Value: contactDetails?.NextLevelContactPhone || '',
            //         Key: formelementID,
            //     },
            //     CustomerContactNextLevelEmail: {
            //         Value: contactDetails?.NextLevelContactMail || '',
            //         Key: formelementID,
            //     },
            // };

            const fieldValues = {
                CustomerContactEmail: contactDetails?.Email || '',
                CustomerContactNumber: contactDetails?.Phone || '',
                CustomerContactSupervisorName: contactDetails?.SupervisorName || '',
                CustomerContactNextLevel: contactDetails?.NextLevelContact || '',
                CustomerContactNextLevelPhNo: contactDetails?.NextLevelContactPhone || '',
                CustomerContactNextLevelEmail: contactDetails?.NextLevelContactMail || '',
            };
            setCustomerDetails(customerDetails => ({
                ...customerDetails,
                ...fieldValues,
            }));
            handleNestedInputChange('', fieldValues, formelementID, true);
        } catch (err) {}
    };

    const getCustomerContactPersons = async () => {
        try {
            const formData = new FormData();
            formData.append('CustomerID', value);
            formData.append('AddressID', customerDetails?.CustomerAddress);
            const { Data } = await postAPI(`${API_URL.GET_CUSTOMERS_CONTACT_PERSONS}`, formData);
            setCustomerContacts({
                data:
                    (Data || [])?.map(data => ({
                        label: data?.Name,
                        value: data?.CustomerContactID,
                    })) || [],
                loading: false,
            });

            concernDetails?.ContactPersonId &&
                setCustomerDetails(customerDetails => ({
                    ...customerDetails,
                    CustomerPrimaryContactName: concernDetails?.ContactPersonId,
                }));
        } catch (err) {
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
            setCustomerContacts({
                data: [],
                loading: false,
            });
        }
    };

    const getCustomerAddress = async value => {
        try {
            const formData = new FormData();
            formData.append('CustomerID', value);
            const { Data } = await postAPI(`${API_URL.GET_CUSTOMERS_ADDRESS}`, formData);
            setCustomerAddress({
                data:
                    (Data || [])?.map(data => ({
                        label: data?.Address,
                        value: data?.CustomerAddressID,
                    })) || [],
                loading: false,
            });

            concernDetails?.CustomerAddressId &&
                setCustomerDetails(customerDetails => ({
                    ...customerDetails,
                    CustomerAddress: concernDetails?.CustomerAddressId,
                }));
        } catch (err) {
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
            setCustomerAddress({
                data: [],
                loading: false,
            });
        }
    };

    useEffect(() => {
        formelementID && customerDetails?.CustomerAddress && getCustomerContactPersons();
    }, [formelementID, customerDetails?.CustomerAddress]);

    useEffect(() => {
        formelementID && customerDetails?.CustomerPrimaryContactName && getCustomerContactDetails();
    }, [formelementID, customerDetails?.CustomerPrimaryContactName]);

    useEffect(() => {
        formelementID && value && getCustomerAddress(value);
    }, [formelementID, value]);

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
            setDynamicInputs({
                data: Data || [],
                staticInputs:
                    [Data?.[0]]?.map(data => {
                        return {
                            ...data,
                            value: concernDetails?.[data.name]?.toString() || data.value,
                            editable,
                        };
                    }) || [],
                // dyInputs: Data?.slice(1) || [],
                loading: false,
            });
            setCustomerDetails({
                CustomerContactNumber: concernDetails?.CustomerContactNumber?.toString() || '',
                CustomerAddress: concernDetails?.CustomerAddressId || '',
                CustomerPrimaryContactName: concernDetails?.ContactPersonId || '',
                CustomerContactEmail: concernDetails?.CustomerEmail || '',
                CustomerPartNumber: concernDetails?.CustomerPartNumber || '',
                CustomerContactSupervisorName: concernDetails?.CustomerContactSupervisorName || '',
                CustomerContactNextLevel: concernDetails?.CustomerContactNextLevel || '',
                CustomerContactNextLevelPhNo: concernDetails?.CustomerContactNextLevelPhNo || '',
                CustomerContactNextLevelEmail: concernDetails?.CustomerContactNextLevelEmail || '',
            });
            setDynamicInputFields(Data?.slice(1) || []);
        } catch (err) {
            setDynamicInputs({
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
                ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
            }}>
            {dynamicInputs?.loading ? null : (
                <RenderInputs
                    {...{
                        inputs: dynamicInputs?.staticInputs,
                        handleInputChange: (name, value) => {
                            handleInputChange(name, value);
                            handleNestedInputChange(name, value, formelementID);
                            setCustomerDetails(DEFAULT_CUSTOMER_DETAILS);
                        },
                    }}
                />
            )}
            <DropdownComponent
                {...{
                    label: 'Customer Address',
                    value: customerDetails?.CustomerAddress,
                    onChange: value => handleDynamicInputChange('CustomerAddress', value),
                    data: customerAddress?.data,
                    editable,
                }}
            />
            <DropdownComponent
                {...{
                    label: 'Primary Contact Name',
                    value: customerDetails?.CustomerPrimaryContactName,
                    onChange: value => handleDynamicInputChange('CustomerPrimaryContactName', value),
                    data: customerContacts?.data,
                    editable,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Contact Number',
                    name: 'CustomerContactNumber',
                    value: customerDetails?.CustomerContactNumber,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Contact Email',
                    name: 'CustomerContactEmail',
                    value: customerDetails?.CustomerContactEmail,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Contact Part Number',
                    name: 'CustomerPartNumber',
                    value: customerDetails?.CustomerPartNumber,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Customer Contact Supervisor Name',
                    name: 'CustomerContactSupervisorName',
                    value: customerDetails?.CustomerContactSupervisorName,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Customer Contact Next Level',
                    name: 'CustomerContactNextLevel',
                    value: customerDetails?.CustomerContactNextLevel,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Customer Contact NextLevel PhNo',
                    name: 'CustomerContactNextLevelPhNo',
                    value: customerDetails?.CustomerContactNextLevelPhNo,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
            <InputWithLabel
                {...{
                    label: 'Customer Contact NextLevel Email',
                    name: 'CustomerContactNextLevelEmail',
                    value: customerDetails?.CustomerContactNextLevelEmail,
                    onChange: (name, value) => handleDynamicInputChange(name, value),
                    editable: false,
                }}
            />
        </View>
    );
};

export default CustomerPickerComponent;
