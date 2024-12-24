import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_VARIABLES, INPUTS_CONSTANTS, LOCAL_STORAGE_VARIABLES, STATUS_CODES } from 'constants/app-constant';
import API_URL from 'global/api-urls';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import { getDashboardConcernCounts, getTodayConcernList } from 'screens/home/home.action';
import EditConcernPresentational from './edit-concern-presentational';

const EditConcernFunctional = () => {
    const [stateVariables, setStateVariables] = useState({
        concernDetails: {
            ConcernNo: '',
            CategoryID: '',
            SubCategoryID: '',
            ProblemClassificationID: '',
            ConcernTitle: '',
            ButtonSave: 'Save',
            Mode: 'Save',
            Loading: false,
        },
        dynamicConcernDetails: {},
        editedConcernDetails: {},
        editedDynamicConcernDetails: {},
        nestedConcernDetails: {},
        confirmModal: false,
        isDeleting: false,
        isSubmitting: false,
        dynamicInputs: [],
        dynamicInputsLoading: false,
        formModalVisible: false,
        dropdownList: {
            data: null,
            loading: false,
        },
    });
    // console.log(
    //     '🚀 ~ EditConcernFunctional ~ dynamicConcernDetails:',
    //     stateVariables?.editedDynamicConcernDetails,
    //     stateVariables?.nestedConcernDetails,
    // );
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

    const [problemImages, setProblemImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [okPicker, setOkPicker] = useState(null);
    const [notOkPicker, setNotOkPicker] = useState(null);

    const route = useRoute();
    const { sites, handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { ConcernID = '', FormTypeID = '', refreshElementData } = route?.params || { ConcernID: '', FormTypeID: '' };
    // console.log('🚀 ~ EditConcernFunctional ~ FormTypeID:', FormTypeID);

    const getDynamicInputList = async (res, categoryId) => {
        setStateVariables(stateVariables => ({
            ...stateVariables,
            dynamicInputsLoading: true,
        }));
        try {
            const { Data: dynamicInputs } = await postAPI(
                `${API_URL.FORM_INPUT_LIST}`,
                formReq({
                    [APP_VARIABLES.SOURCE_ID]: categoryId,
                    [APP_VARIABLES.FORM_TYPE]: 'cat',
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    [APP_VARIABLES.FORM_TYPE_ID]: FormTypeID || 1, // 1 for Draft page
                    [APP_VARIABLES.SITE_ID]: res.SiteId,
                    [APP_VARIABLES.CONCERN_FORM_ID]: stateVariables?.concernDetails?.ConcernFormID,
                    ...(ConcernID && {
                        ConcernId: ConcernID,
                    }),
                }),
            );
            const tempDynamicInputs = dynamicInputs;

            const dynamicConcernDetails = {};

            setStateVariables(stateVariables => ({
                ...stateVariables,
                dynamicInputs: [
                    ...tempDynamicInputs?.map(input => {
                        dynamicConcernDetails[input.name] =
                            input?.name === 'ReportedDate' ? moment.utc(stateVariables?.concernDetails['ReportedDate']).format() : input.value;
                        return {
                            ...input,
                            // editable: true,
                            value: stateVariables?.concernDetails[input?.name] || input?.Value || input?.value || '',
                            ...(input?.name === 'PriorityID' && { value: stateVariables?.concernDetails['PriorityID']?.toString() }),
                            ...(input?.name === 'CategoryofComplaint' && {
                                value: stateVariables?.concernDetails['CategoryofComplaint']?.toString(),
                            }),
                            ...(input?.name === 'SerialNumber' && { value: stateVariables?.concernDetails['SerialNumber']?.toString() }),
                            ...(input?.name === 'Source' && { value: stateVariables?.concernDetails['Source']?.toString() }),
                            ...(input?.name === 'NotifySupplier' && { value: stateVariables?.concernDetails['NotifySupplier']?.toString() }),
                            ...(input?.name === 'Repeat' && { value: stateVariables?.concernDetails['Repeat']?.toString() }),

                            ...(input?.name === 'ProbDesc' && {
                                type: INPUTS_CONSTANTS.RICH_EDITOR,
                                value: stateVariables?.concernDetails['ProbDesc']?.replace(/<[^>]+>|&[^;]+;/gi, ''),
                            }),
                        };
                    }),
                ],
                dynamicInputsLoading: false,
                dynamicConcernDetails,
            }));
        } catch (error) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                dynamicInputsLoading: false,
            }));
        }
    };

    const getCategoryList = async res => {
        const formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        const categoryList = await postAPI(`${API_URL.CATEGORY_LIST}`, formData);
        setListDetails(listDetails => ({
            ...listDetails,
            categoryList: {
                data: (categoryList?.Data || [])?.map(category => ({
                    label: category?.CategoryName,
                    value: category?.CategoryID,
                })),
                loading: false,
            },
        }));
    };

    const getDropdownList = useCallback(
        async SiteId => {
            try {
                const dropDownRes = await postAPI(
                    `${API_URL.DROPDOWN_LIST}`,
                    formReq({
                        [APP_VARIABLES.SITE_ID]: SiteId,
                    }),
                );
                setStateVariables(prevState => ({
                    ...prevState,
                    dropdownList: {
                        ...prevState.dropdownList,
                        data: dropDownRes?.Data,
                        loading: false,
                    },
                }));
            } catch (err) {
                setStateVariables(prevState => ({
                    ...prevState,
                    dropdownList: {
                        ...prevState.dropdownList,
                        loading: false,
                    },
                }));
                showErrorMessage('Sorry, Error while loading the Dropdown List!!');
            }
        },
        [setStateVariables],
    );

    const getSubCategoryList = async (res, categoryId) => {
        const formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.CategoryID, categoryId);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        const subCategories = await postAPI(`${API_URL.SUB_CATEGORY_LIST}`, formData);
        setListDetails(listDetails => ({
            ...listDetails,
            subCategoryList: {
                data: (subCategories?.Data || [])?.map(subCategory => ({
                    label: subCategory?.SubCategoryName,
                    value: subCategory?.SubCategoryID,
                })),
                loading: false,
            },
        }));
    };

    const getProblemClassificationList = async (res, subCategoryID) => {
        if (subCategoryID) {
            const formData = new FormData();
            formData.append(LOCAL_STORAGE_VARIABLES.SubCategoryID, subCategoryID);
            formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
            const problemClassifications = await postAPI(`${API_URL.PROBLEM_CLASSIFICATION_LIST}`, formData);
            setListDetails(listDetails => ({
                ...listDetails,
                problemClassificationList: {
                    data: (problemClassifications?.Data || [])?.map(problemClassification => ({
                        label: problemClassification?.ClassificationName,
                        value: problemClassification?.ClassificationID,
                    })),
                    loading: false,
                },
            }));
        }
    };

    const getConcern = async ConcernID => {
        const formData = new FormData();
        formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
        setStateVariables(stateVariables => ({
            ...stateVariables,
            concernDetails: {
                ...stateVariables.concernDetails,
                Loading: true,
            },
        }));
        try {
            const res = await postAPI(`${API_URL.GET_CONCERN}`, formData);
            setStateVariables(stateVariables => ({
                ...stateVariables,
                concernDetails: {
                    ...stateVariables.concernDetails,
                    ...res?.Data?.[0],
                    Loading: false,
                    // ProbDesc: (res?.Data?.[0]?.ProbDesc || '')?.replace(/(<([^>]+)>)/gi, ''),
                },
            }));
        } catch (err) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                concernDetails: {
                    ...stateVariables.concernDetails,
                    Loading: false,
                },
            }));
            showErrorMessage('Sorry, Error while loading the concern!!');
        }
    };

    const defaultInputs = useMemo(
        () => [
            {
                label: 'Category',
                name: 'CategoryID',
                required: !!!ConcernID,
                value: stateVariables?.concernDetails?.CategoryID,
                type: INPUTS_CONSTANTS.DROPDOWN,
                data: listDetails?.categoryList?.data || [],
                // editable: !!!ConcernID,
            },
            {
                label: 'Sub Category',
                name: 'SubCategoryID',
                required: !!!ConcernID,
                value: stateVariables?.concernDetails?.SubCategoryID,
                data: listDetails?.subCategoryList?.data || [],
                type: INPUTS_CONSTANTS.DROPDOWN,
            },
            {
                label: 'Problem Classification',
                name: 'ProblemClassificationID',
                required: !!!ConcernID,
                value: stateVariables?.concernDetails?.ProblemClassificationID,
                data: listDetails?.problemClassificationList?.data || [],
                type: INPUTS_CONSTANTS.DROPDOWN,
            },
            {
                label: 'Concern Title',
                name: 'ConcernTitle',
                required: !!!ConcernID,
                value: stateVariables?.concernDetails?.ConcernTitle,
                type: INPUTS_CONSTANTS.INPUT,
            },
        ],
        [
            stateVariables?.concernDetails,
            listDetails?.categoryList?.data,
            listDetails?.subCategoryList?.data,
            listDetails?.problemClassificationList?.data,
        ],
    );

    const handleDynamicInputChange = (label, value, isBulk = false) => {
        if (isBulk) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                dynamicConcernDetails: {
                    ...stateVariables?.dynamicConcernDetails,
                    ...value,
                },
                editedDynamicConcernDetails: {
                    ...stateVariables?.editedDynamicConcernDetails,
                    ...value,
                },
            }));
        } else {
            const fieldName = label === 'CustomerId' ? 'CustomerID' : label === 'SupplierId' ? 'SupplierID' : label;
            setStateVariables(prevState => ({
                ...prevState,
                dynamicConcernDetails: {
                    ...prevState.dynamicConcernDetails,
                    [fieldName]: value,
                },
                editedDynamicConcernDetails: {
                    ...prevState.editedDynamicConcernDetails,
                    [fieldName]: value,
                },
            }));
            handleDynamicInputs(
                {
                    ...stateVariables.dynamicConcernDetails,
                    [fieldName]: value,
                },
                label,
            );
        }
    };

    const handleNestedInputChange = (name, Value, Key, isBulk) => {
        if (isBulk) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                nestedConcernDetails: {
                    ...stateVariables?.nestedConcernDetails,
                    ...Value,
                },
            }));
        } else {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                nestedConcernDetails: {
                    ...stateVariables?.nestedConcernDetails,
                    [name]: Value,
                },
            }));
        }
    };

    const handleDynamicInputs = (concernDetails, label) => {
        const dynamicInputs = stateVariables?.dynamicInputs.map(input => ({
            ...input,
            ...(label === input?.name && { value: concernDetails?.[label] }),
        }));

        setStateVariables(stateVariables => ({
            ...stateVariables,
            dynamicInputs,
        }));
    };

    const handleInputChange = (label, value) => {
        setStateVariables(stateVariables => ({
            ...stateVariables,
            concernDetails: {
                ...stateVariables.concernDetails,
                [label]: value,
            },
            editedConcernDetails: {
                ...stateVariables.editedConcernDetails,
                [label]: value,
            },
        }));
    };

    const handleCategoryValueChange = () => {
        getDynamicInputList(sites?.selectedSite, stateVariables?.concernDetails?.CategoryID);
        getSubCategoryList(sites?.selectedSite, stateVariables?.concernDetails?.CategoryID);
    };

    useEffect(() => handleDynamicInputs(stateVariables?.concernDetails), [stateVariables?.concernDetails?.CategoryID]);

    useEffect(() => {
        ConcernID && getConcern(ConcernID);
    }, [ConcernID]);

    useEffect(() => {
        if (sites?.selectedSite) {
            getCategoryList(sites?.selectedSite);
            getDropdownList(sites?.selectedSite?.SiteId);
        }
    }, [sites?.selectedSite]);

    useEffect(() => {
        if (stateVariables?.concernDetails?.SubCategoryID) {
            if (!!!ConcernID) {
                setStateVariables(stateVariables => ({
                    concernDetails: {
                        ...stateVariables.concernDetails,
                        ProblemClassificationID: '',
                    },
                }));
            }
            getProblemClassificationList(sites?.selectedSite, stateVariables?.concernDetails?.SubCategoryID);
        }
    }, [stateVariables?.concernDetails?.SubCategoryID, sites?.selectedSite]);

    useEffect(() => {
        if (stateVariables?.concernDetails?.CategoryID) {
            handleCategoryValueChange();
        }
    }, [stateVariables?.concernDetails?.CategoryID]);

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

    const handleDelete = async () => {
        setStateVariables(stateVariables => ({
            ...stateVariables,
            confirmModal: false,
            isDeleting: true,
        }));
        try {
            const res = await postAPI(
                `${API_URL.DELETE_CONCERN}`,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                    [APP_VARIABLES.USER_ID]: sites?.selectedSite?.UserId,
                }),
            );
            if (res?.Success) {
                navigation.goBack();
                setStateVariables(stateVariables => ({
                    ...stateVariables,
                    isDeleting: false,
                }));
                getListData(sites?.selectedSite);
                handleRecentActivity(stateVariables?.concernDetails, true);
                successMessage({ message: 'Success', description: 'Concern has been deleted' });
            } else {
                showErrorMessage(res?.Error);
                setStateVariables(stateVariables => ({
                    ...stateVariables,
                    isDeleting: false,
                }));
            }
        } catch (err) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                isDeleting: false,
            }));
            showErrorMessage("Sorry can't able to delete right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    const handleSubmitConcern = async () => {
        // const filteredConcern = {
        //     ConcernId: ConcernID,
        //     CategoryID: stateVariables?.concernDetails?.CategoryID,
        //     SubCategoryID: stateVariables?.concernDetails?.SubCategoryID,
        //     ProblemClassificationID: stateVariables?.concernDetails?.ProblemClassificationID,
        //     ConcernTitle: stateVariables?.concernDetails?.ConcernTitle,
        // };
        let formattedDynamicConcernDetails = Object.entries(stateVariables?.editedDynamicConcernDetails)
            .map(([Name, Value]) => {
                const Key = stateVariables?.dynamicInputs?.find(input => input?.name === Name)?.formelementID;
                const isDynamic = stateVariables?.dynamicInputs?.find(input => input?.name === Name)?.dynamic;
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
        console.log(
            '🚀 ~ handleSubmitConcern ~ stateVariables?.editedDynamicConcernDetails:',
            stateVariables?.editedDynamicConcernDetails,
            stateVariables?.dynamicInputs,
            formattedDynamicConcernDetails,
        );

        const formattedConcernDetails = { ...stateVariables?.concernDetails, ConcernId: ConcernID };
        await stateVariables?.dynamicInputs?.map(input => {
            if (!input.dynamic && input.name) {
                formattedConcernDetails[input.name] = (stateVariables?.editedDynamicConcernDetails?.[input.name] || '').toString() || '';
            }
        });

        const request = {
            StaticConcernInput: [
                {
                    ...stateVariables?.editedConcernDetails,
                    ...stateVariables?.editedDynamicConcernDetails,
                    ...stateVariables?.nestedConcernDetails,
                    ConcernId: ConcernID,
                    ButtonSave: APP_VARIABLES.SAVE,
                    Mode: 'Add',
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

        setStateVariables(stateVariables => ({
            ...stateVariables,
            isSubmitting: true,
        }));
        try {
            const res = await postAPI(`${API_URL.SAVE_CONCERN}`, request);
            if (res?.Success) {
                setStateVariables(stateVariables => ({
                    ...stateVariables,
                    isSubmitting: false,
                }));
                navigation.goBack();
                getListData(sites?.selectedSite);
                refreshElementData && refreshElementData?.();
                successMessage({ message: 'Success', description: 'Concern has been saved successfully' });
            } else {
                showErrorMessage(res?.Error);
                setStateVariables(stateVariables => ({
                    ...stateVariables,
                    isSubmitting: false,
                }));
            }
        } catch (err) {
            setStateVariables(stateVariables => ({
                ...stateVariables,
                isSubmitting: false,
            }));
            showErrorMessage("Sorry can't able to submit right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    const handleProblemImages = images => {
        setProblemImages(images);
    };

    const handleAttachments = attachments => {
        console.log('🚀 ~ handleAttachments ~ attachments:', attachments);
        setAttachments(attachments);
    };

    const handleOKPicker = okPicker => {
        setOkPicker(okPicker);
    };

    const handleNotOKPicker = notOkPicker => {
        setNotOkPicker(notOkPicker);
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

    return (
        <EditConcernPresentational
            {...{
                ConcernID,
                handleInputChange,
                handleDynamicInputChange,
                handleDelete,
                handleSubmitConcern,
                handleNestedInputChange,
                defaultInputs,
                ...stateVariables,
                setStateVariables,

                handleProblemImages,
                handleAttachments,
                handleOKPicker,
                handleNotOKPicker,
            }}
        />
    );
};

export default EditConcernFunctional;
