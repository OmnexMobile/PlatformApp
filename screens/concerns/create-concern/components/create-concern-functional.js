import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_VARIABLES, INPUTS_CONSTANTS, LOCAL_STORAGE_VARIABLES, STATUS_CODES } from 'constants/app-constant';
import API_URL from 'global/api-urls';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import { getDashboardConcernCounts, getTodayConcernList } from 'screens/home/home.action';
import CreateConcernPresentational from './create-concern-presentational';

function convertObjectToArray(obj) {
    const array = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            array.push({
                Key: element.Key,
                Value: element.Value,
                Name: key,
            });
        }
    }

    return array;
}

const CreateConcernFunctional = ({}) => {
    const [concernDetails, setConcernDetails] = useState({
        CategoryID: '',
        SubCategoryID: '',
        ProblemClassificationID: '',
        // SupplierID: '',
        ConcernTitle: '',
        ProductId: '0',
    });
    const [nestedConcernDetails, setNestedConcernDetails] = useState({});
    const [dynamicConcernDetails, setDynamicConcernDetails] = useState({});
    const [problemImages, setProblemImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [okPicker, setOkPicker] = useState(null);
    const [notOkPicker, setNotOkPicker] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [dynamicInputs, setDynamicInputs] = useState([]);
    const [dynamicInputsLoading, setDynamicInputsLoading] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [savingConcern, setSavingConcern] = useState(false);
    const [listDetails, setListDetails] = useState({
        categoryList: {
            data: [],
            loading: true,
        },
        subCategoryList: {
            data: [],
            loading: true,
        },
        problemClassificationList: {
            data: [],
            loading: true,
        },
        suppliers: {
            data: [],
            loading: true,
        },
    });
    const { sites, profile } = useAppContext();
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { ConcernID = '' } = route?.params || { ConcernID: '' };

    const getCategoryList = async res => {
        const formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        const categoryList = await postAPI(`${API_URL.CATEGORY_LIST}`, formData);
        setListDetails({
            ...listDetails,
            categoryList: {
                data: (categoryList?.Data || [])?.map(category => ({
                    label: category?.CategoryName,
                    value: category?.CategoryID,
                })),
                loading: false,
            },
        });
    };

    const getDropdownList = async SiteId => {
        setListDetails({
            ...listDetails,
            suppliers: {
                ...listDetails?.suppliers,
                loading: true,
            },
        });
        try {
            const res = await postAPI(
                `${API_URL.DROPDOWN_LIST}`,
                formReq({
                    [APP_VARIABLES.SITE_ID]: SiteId,
                }),
            );
            setListDetails(listDetails => ({
                ...listDetails,
                suppliers: {
                    data: (res?.Data?.Supplier || [])?.map(supplier => ({
                        label: supplier?.SupplierName,
                        value: supplier?.SupplierId,
                    })),
                    loading: false,
                },
            }));
        } catch (err) {
            setListDetails({
                ...listDetails,
                suppliers: {
                    data: [],
                    loading: false,
                },
            });

            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
        }
    };

    const getSubCategoryList = async (res, categoryId) => {
        const formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.CategoryID, categoryId);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        const subCategories = await postAPI(`${API_URL.SUB_CATEGORY_LIST}`, formData);
        setListDetails({
            ...listDetails,
            subCategoryList: {
                data: (subCategories?.Data || [])?.map(subCategory => ({
                    label: subCategory?.SubCategoryName,
                    value: subCategory?.SubCategoryID,
                })),
                loading: false,
            },
        });
    };

    const getProblemClassificationList = async (res, subCategoryID) => {
        const formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.SubCategoryID, subCategoryID);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        const problemClassifications = await postAPI(`${API_URL.PROBLEM_CLASSIFICATION_LIST}`, formData);
        setListDetails({
            ...listDetails,
            problemClassificationList: {
                data: (problemClassifications?.Data || [])?.map(problemClassification => ({
                    label: problemClassification?.ClassificationName,
                    value: problemClassification?.ClassificationID,
                })),
                loading: false,
            },
        });
        // setConcernDetails({
        //     ...concernDetails,
        //     ProblemClassificationID: concernDetails?.ProblemClassificationID
        // })
    };

    useEffect(() => {
        handleDynamicInputChange('ProblemImages', problemImages);
    }, [problemImages]);

    useEffect(() => {
        handleDynamicInputChange('Attachments', attachments);
    }, [attachments]);

    useEffect(() => {
        okPicker?.FileName && handleDynamicInputChange('OkPicker', okPicker);
    }, [okPicker]);

    useEffect(() => {
        notOkPicker?.FileName && handleDynamicInputChange('NotOkPicker', notOkPicker);
    }, [notOkPicker]);

    const getListData = res => {
        const defaultObj = {
            [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
            [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
            [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
        };
        dispatch(
            getDashboardConcernCounts(
                formReq({
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
                }),
            ),
        );
        dispatch(
            getTodayConcernList(
                formReq({
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.TODAY_CONCERN,
                }),
            ),
        );
    };

    const getDynamicInputList = async (res, categoryId) => {
        setDynamicInputsLoading(true);
        try {
            const { Data: dynamicInputs } = await postAPI(
                `${API_URL.FORM_INPUT_LIST}`,
                formReq({
                    [APP_VARIABLES.SOURCE_ID]: categoryId,
                    [APP_VARIABLES.FORM_TYPE]: 'cat',
                    [APP_VARIABLES.FORM_TYPE_ID]: 1,
                    [APP_VARIABLES.SITE_ID]: res.SiteId,
                    [APP_VARIABLES.CONCERN_FORM_ID]: 0,
                    ...(ConcernID && {
                        ConcernId: ConcernID,
                    }),
                }),
            );
            // const filteredInputs = dynamicInputs?.filter(input => input?.name !== 'SupplierID')?.map(input => ({
            //     ...input,
            //     editable: true
            // }));
            // setDynamicInputs([...filteredInputs]);
            // console.log('🚀 ~ file: create-concern-functional.js:193 ~ filter ~ filter:', filter);
            setDynamicInputs([
                ...dynamicInputs?.map(input => ({
                    ...input,
                    editable: !!!ConcernID,
                    // value: input?.value,
                    // ...(!!ConcernID && { editable: false }),
                })),
            ]);
            setDynamicInputsLoading(false);
        } catch (error) {
            setDynamicInputsLoading(false);
        }
    };

    const getConcern = async ConcernID => {
        setDynamicInputsLoading(true);
        const formData = new FormData();
        formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
        try {
            const res = await postAPI(`${API_URL.GET_CONCERN}`, formData);
            setConcernDetails({
                ...concernDetails,
                ...res?.Data?.[0],
            });
            setSelectedTeam(res?.Data?.[0]?.TeamName);
        } catch (err) {}
    };

    const defaultInputs = useMemo(
        () => [
            {
                label: 'Category',
                name: 'CategoryID',
                data: listDetails?.categoryList?.data || [],
                required: !!!ConcernID,
                value: ConcernID ? concernDetails?.CategoryName : concernDetails?.CategoryID,
                type: ConcernID ? INPUTS_CONSTANTS.INPUT : INPUTS_CONSTANTS.DROPDOWN,
                editable: !!!ConcernID,
            },
            {
                label: 'Sub Category',
                name: 'SubCategoryID',
                data: listDetails?.subCategoryList?.data || [],
                required: !!!ConcernID,
                value: ConcernID ? concernDetails?.SubCategoryName : concernDetails?.SubCategoryID,
                type: ConcernID ? INPUTS_CONSTANTS.INPUT : INPUTS_CONSTANTS.DROPDOWN,
                editable: !!!ConcernID,
            },
            {
                label: 'Problem Classification',
                name: 'ProblemClassificationID',
                data: listDetails?.problemClassificationList?.data || [],
                required: !!!ConcernID,
                value: ConcernID ? concernDetails?.ProblemClassificationName : concernDetails?.ProblemClassificationID,
                type: ConcernID ? INPUTS_CONSTANTS.INPUT : INPUTS_CONSTANTS.DROPDOWN,
                editable: !!!ConcernID,
            },
            {
                label: 'Concern Title',
                name: 'ConcernTitle',
                required: !!!ConcernID,
                value: concernDetails?.ConcernTitle,
                type: INPUTS_CONSTANTS.INPUT,
                editable: !!!ConcernID,
            },
            // {
            //     label: 'Ok',
            //     name: 'OkPicker',
            //     required: !!!ConcernID,
            //     value: concernDetails?.OkPicker,
            //     type: INPUTS_CONSTANTS.OK_PICKER,
            // },
            // {
            //     label: 'Supplier',
            //     name: 'SupplierID',
            //     data: listDetails?.suppliers?.data || [],
            //     required: !!!ConcernID,
            //     value: ConcernID ? concernDetails?.SupplierID : concernDetails?.SupplierID,
            //     type: ConcernID ? INPUTS_CONSTANTS.INPUT : INPUTS_CONSTANTS.DROPDOWN,
            //     editable: !!!ConcernID,
            // },
            // {
            //     label: 'Entity',
            //     name: 'Entity',
            //     required: !!!ConcernID,
            //     value: concernDetails?.Entity,
            //     type: INPUTS_CONSTANTS.TREE_VIEW_PICKER,
            //     editable: !!!ConcernID,
            // },
            // {
            //     label: 'Choices',
            //     name: 'Choices',
            //     value: concernDetails?.Choices,
            //     required: true,
            //     options: [
            //         { label: 'Option 1', value: '1option' },
            //         { label: 'Option 2', value: '2option' },
            //     ],
            //     type: INPUTS_CONSTANTS.CHECK_BOX,
            // },
            // {
            //     label: 'Assign Team',
            //     name: 'ReportedDate',
            //     value: concernDetails?.ReportedDate || '',
            //     required: true,
            //     type: INPUTS_CONSTANTS.TEAM_PICKER,
            // },
            // {
            //     label: 'Reported Date',
            //     name: 'ReportedDate',
            //     value: concernDetails?.ReportedDate || '',
            //     isDate: true,
            //     required: true,
            //     type: INPUTS_CONSTANTS.DATE_PICKER,
            // },

            // {
            //     label: 'Image',
            //     name: 'Image',
            //     value: concernDetails?.Image,
            //     required: true,
            //     type: INPUTS_CONSTANTS.IMAGE_PICKER,
            // },
            // {
            //     label: 'File',
            //     name: 'File',
            //     value: concernDetails?.File,
            //     // required: true,
            //     type: INPUTS_CONSTANTS.FILE_PICKER,
            // },
            // {
            //     label: 'Choices',
            //     name: 'Choices',
            //     value: concernDetails?.Choices,
            //     required: true,
            //     options: [
            //         { label: 'Option 1', value: '1option' },
            //         { label: 'Option 2', value: '2option' },
            //     ],
            //     type: INPUTS_CONSTANTS.RADIO_BUTTON,
            // },
        ],
        [
            listDetails?.categoryList?.data,
            listDetails?.subCategoryList?.data,
            listDetails?.problemClassificationList?.data,
            listDetails?.suppliers?.data,
            concernDetails,
        ],
    );

    const handleDynamicInputs = dynamicConcernDetails => {
        const dyInputs = dynamicInputs.map(input => {
            return {
                ...input,
                ...(!ConcernID && {
                    value: dynamicConcernDetails?.[input?.name],
                }),
            };
        });
        setDynamicInputs([...dyInputs]);
    };

    const handleNestedInputChange = (name, Value, Key, isBulk) => {
        if (isBulk) {
            setNestedConcernDetails({
                ...nestedConcernDetails,
                ...Value,
            });
        } else {
            setNestedConcernDetails({
                ...nestedConcernDetails,
                [name]: Value,
                // [name]: { Value, Key },
            });
        }
    };

    const handleInputChange = (label, value) => {
        setConcernDetails({
            ...concernDetails,
            [label]: value,
        });
    };

    // const nestedDynamicInputs = useMemo(() => {
    //     return convertObjectToArray(nestedConcernDetails);
    // }, [nestedConcernDetails]);

    const handleDynamicInputChange = (label, value, isBulk = false) => {
        if (isBulk) {
            setDynamicConcernDetails({
                ...dynamicConcernDetails,
                ...value,
            });
        } else {
            const fieldName = label === 'CustomerId' ? 'CustomerID' : label === 'SupplierId' ? 'SupplierID' : label;
            setDynamicConcernDetails({
                ...dynamicConcernDetails,
                [fieldName]: value,
            });
        }
    };

    const proceedToSaveOrSubmit = async Mode => {
        let formattedDynamicConcernDetails = Object.entries(dynamicConcernDetails)
            .map(([Name, Value]) => {
                const Key = dynamicInputs?.find(input => input?.name === Name)?.formelementID;
                const isDynamic = dynamicInputs?.find(input => input?.name === Name)?.dynamic;
                if (isDynamic) {
                    return {
                        Key: (Key || '').toString(),
                        Name,
                        Value: (Value || '').toString(),
                    };
                }
                return null;
            })
            .filter(input => input);

        const formattedConcernDetails = { ...concernDetails };
        await dynamicInputs?.map(input => {
            if (!input.dynamic && input.name) {
                formattedConcernDetails[input.name] = (dynamicConcernDetails?.[input.name] || '').toString() || '';
            }
        });

        delete formattedConcernDetails?.OkPicker;
        delete formattedConcernDetails?.NotOkPicker;
        console.log('🚀 ~ proceedToSaveOrSubmit ~ formattedConcernDetails:', formattedConcernDetails);

        const request = {
            StaticConcernInput: [
                {
                    ...formattedConcernDetails,
                    ...nestedConcernDetails,
                    // NotifySupplier: nestedConcernDetails?.NotifySupplier === 'Yes',
                    // CustomerID: formattedConcernDetails?.CustomerID || 0,
                    ButtonSave: Mode,
                    Mode: 'Add',
                    CreatedBy: sites?.selectedSite?.UserId,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: sites?.selectedSite?.SiteId,
                },
            ],
            DynamicConcernInput: formattedDynamicConcernDetails,
            ...(problemImages?.length > 0 && {
                ProblemImages: problemImages,
            }),
            ...(attachments?.length > 0 && {
                Attachments: attachments,
            }),
            ...(okPicker?.FileName && {
                OkPicker: [okPicker],
            }),
            ...(notOkPicker?.FileName && {
                NotOkPicker: [notOkPicker],
            }),
        };

        delete request?.StaticConcernInput?.[0]?.ProblemImages;
        delete request?.StaticConcernInput?.[0]?.Attachments;
        delete request?.StaticConcernInput?.[0]?.NotOkPicker;
        delete request?.StaticConcernInput?.[0]?.OkPicker;

        console.log('🚀 ~ proceedToSaveOrSubmit ~ request:', request);
        setSavingConcern(true);
        try {
            const res = await postAPI(`${API_URL.SAVE_CONCERN}`, request);
            if (res?.Success) {
                setSavingConcern(false);
                navigation.goBack();
                getListData(sites?.selectedSite);
                successMessage({ message: 'Success', description: 'Concern has been created' });
            } else {
                showErrorMessage(res?.Error);
                setSavingConcern(false);
            }
        } catch (err) {
            showErrorMessage("Sorry can't able to save right now!!");
            setSavingConcern(false);
        }
    };

    const handleSaveConcern = async Mode => {
        if (Mode === APP_VARIABLES.SUBMIT) {
            // if (!!dynamicConcernDetails?.SupplierID) {
            proceedToSaveOrSubmit(Mode);
            // } else {
            //     showErrorMessage('Supplier Id is required!!');
            // }
        } else {
            proceedToSaveOrSubmit(Mode);
        }
    };

    const handleCategoryValueChange = () => {
        getDynamicInputList(sites?.selectedSite, concernDetails?.CategoryID);
        getSubCategoryList(sites?.selectedSite, concernDetails?.CategoryID);
    };

    useEffect(() => {
        if (sites?.selectedSite) {
            getCategoryList(sites?.selectedSite);
            getDropdownList(sites?.selectedSite?.SiteId);
        }
    }, [sites?.selectedSite]);

    useEffect(() => {
        if (concernDetails?.SubCategoryID) {
            if (!!!ConcernID) {
                setConcernDetails({
                    ...concernDetails,
                    ProblemClassificationID: '',
                });
            }
            getProblemClassificationList(sites?.selectedSite, concernDetails?.SubCategoryID);
        }
    }, [concernDetails?.SubCategoryID, sites?.selectedSite]);

    useEffect(() => handleDynamicInputs(dynamicConcernDetails), [dynamicConcernDetails]);

    useEffect(() => {
        ConcernID && getConcern(ConcernID);
    }, [ConcernID]);

    useEffect(() => {
        if (concernDetails?.CategoryID) {
            handleCategoryValueChange();
        }
    }, [concernDetails?.CategoryID, sites?.selectedSite]);

    const isValid = useMemo(
        () =>
            defaultInputs.filter(detail => detail?.required && concernDetails[detail?.name])?.length ===
            defaultInputs.filter(detail => detail.required)?.length,
        [concernDetails],
    );

    const isDynamicInputsValid = useMemo(
        () =>
            dynamicInputs.filter(detail => detail?.required && dynamicConcernDetails[detail?.name])?.length ===
            dynamicInputs.filter(detail => detail.required)?.length,
        [dynamicInputs, dynamicConcernDetails],
    );

    console.log(
        '🚀 ~ CreateConcernFunctional ~ isDynamicInputsValid:',
        // dynamicConcernDetails,
        isDynamicInputsValid,
        dynamicInputs.find(detail => detail?.required && !dynamicConcernDetails[detail?.name]),
        dynamicInputs.filter(detail => detail?.required && dynamicConcernDetails[detail?.name])?.length,
        dynamicInputs.filter(detail => detail.required),
    );

    const handleProblemImages = images => {
        setProblemImages(images);
    };

    const handleAttachments = attachments => {
        setAttachments(attachments);
    };

    const handleOKPicker = okPicker => {
        setOkPicker(okPicker);
    };

    const handleNotOKPicker = notOkPicker => {
        setNotOkPicker(notOkPicker);
    };

    return (
        <CreateConcernPresentational
            {...{
                defaultInputs,
                handleInputChange,
                handleDynamicInputChange,
                isValid,
                isDynamicInputsValid,
                handleSaveConcern,
                savingConcern,
                ConcernID,
                formModalVisible,
                setFormModalVisible,
                dynamicInputs,
                dynamicInputsLoading,
                concernDetails,
                selectedTeam,
                setSelectedTeam,
                handleNestedInputChange,
                handleProblemImages,
                handleAttachments,
                handleOKPicker,
                handleNotOKPicker,
            }}
        />
    );
};

export default CreateConcernFunctional;
