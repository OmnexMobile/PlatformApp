import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_VARIABLES, DATE_FORMAT, INPUTS_CONSTANTS, LOCAL_STORAGE_VARIABLES, STATUS_CODES } from 'constants/app-constant';
import API_URL from 'global/ApiUrl';
import { postAPI, getAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import { getDashboardConcernCounts, getTodayConcernList } from 'screens/home/home.action';
import ViewConcernPresentational from './view-concern-presentational';

const CHANGE_TO = {
    [STATUS_CODES.DraftConcern]: STATUS_CODES.OpenConcern,
    [STATUS_CODES.OpenConcern]: STATUS_CODES.InprogressConcern,
    [STATUS_CODES.InprogressConcern]: STATUS_CODES.CloseConcern,
};

const ViewConcernFunctional = ({}) => {
    const [concernDetails, setConcernDetails] = useState({
        ConcernNo: '',
        CategoryID: '',
        SubCategoryID: '',
        ProblemClassificationID: '',
        ConcernTitle: '',
        ButtonSave: 'Save',
        Mode: 'Save',
        Loading: true,
    });
    const [dynamicConcernDetails, setDynamicConcernDetails] = useState({});
    const [confirmModal, setConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProjectCreating, setIsProjectCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [dynamicInputs, setDynamicInputs] = useState([]);
    const [dynamicInputsLoading, setDynamicInputsLoading] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [dropdownList, setDropdownList] = useState({
        data: null,
        loading: false,
    });
    const [statusValue, setStatusValue] = useState(null);
    console.log('🚀 ~ file: concern-initial-evaluation-functional.js:40 ~ ViewConcernFunctional ~ dropdownList:', dropdownList?.data?.Priorities);

    const route = useRoute();
    const { sites, handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { ConcernID = '' } = route?.params || { ConcernID: '' };

    const getDynamicInputList = async (res, categoryId) => {
        setDynamicInputsLoading(true);
        try {
            const { Data: dynamicInputs } = await postAPI(
                `${API_URL.FORM_INPUT_LIST}`,
                formReq({
                    [APP_VARIABLES.SOURCE_ID]: categoryId,
                    [APP_VARIABLES.FORM_TYPE]: 'cat',
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    [APP_VARIABLES.FORM_TYPE_ID]: 1, // 1 for Draft page
                    // [APP_VARIABLES.SITE_ID]: res.SiteId,
                    [APP_VARIABLES.SITE_ID]: res.Siteid,
                    [APP_VARIABLES.CONCERN_FORM_ID]: concernDetails?.ConcernFormID,
                    ...(ConcernID && {
                        ConcernId: ConcernID,
                    }),
                }),
            );

            const tempDynamicInputs = dynamicInputs?.filter(input => input?.value);
            const dynamicConcernDetails = {};
            console.log(
                '🚀 ~ file: concern-initial-evaluation-functional.js:63 ~ getDynamicInputList ~ tempDynamicInputs:',
                concernDetails,
                concernDetails['SupplierName'],
            );
            setDynamicInputs([
                ...tempDynamicInputs?.map(input => {
                    dynamicConcernDetails[input.name] =
                        input?.name === 'ReportedDate' ? moment.utc(concernDetails['ReportedDate']).format() : input.value;
                    return {
                        ...input,
                        editable: !!!ConcernID,
                        type: INPUTS_CONSTANTS.INPUT,
                        ...(input?.name === 'CustomerID' && { value: concernDetails['CustomerName'] }),
                        ...(input?.name === 'ApproachID' && { value: concernDetails['ApproachName'] }),
                        ...(input?.name === 'QAlert' && { value: concernDetails['QAlertType'] }),
                        ...(input?.name === 'Disposition' && { value: concernDetails['DispositionName'] }),
                        ...(input?.name === 'SupplierID' && {
                            value: concernDetails['SupplierName'],
                            ...(!!!concernDetails['SupplierName'] && {
                                type: INPUTS_CONSTANTS.DROPDOWN,
                                editable: true,
                            }),
                        }),
                        ...(input?.name === 'ReportedDate' && { value: moment(concernDetails['ReportedDate']).format(DATE_FORMAT.DD_MM_YYYY) }),
                        ...(input?.name === 'ProbDesc' && {
                            type: INPUTS_CONSTANTS.RICH_EDITOR,
                            value: concernDetails['ProbDesc']?.replace(/<[^>]+>|&[^;]+;/gi, ''),
                        }),
                        // value: input?.value,
                        // ...(!!ConcernID && { editable: false }),
                    };
                }),
            ]);
            setDynamicConcernDetails(dynamicConcernDetails);
            console.log('🚀 ~ file: view-concern-functional.js:108 ~ getDynamicInputList ~ dynamicConcernDetails:', dynamicConcernDetails);
            setDynamicInputsLoading(false);
        } catch (error) {
            setDynamicInputsLoading(false);
        }
    };

    const getDropdownList = async SiteId => {
        console.log('🚀 ~ file: concern-initial-evaluation-functional.js:90 ~ getDropdownList ~ res:', SiteId);
        try {
            const dropDownRes = await postAPI(
                `${API_URL.DROPDOWN_LIST}`,
                formReq({
                    [APP_VARIABLES.SITE_ID]: SiteId,
                }),
            );
            // console.log('🚀 ~ file: concern-initial-evaluation-functional.js:68 ~ getDynamicInputList ~ res:', dropDownRes?.Data);
            setDropdownList({
                ...dropdownList,
                data: dropDownRes?.Data,
                loading: false,
            });
        } catch (err) {
            setDropdownList({
                ...dropdownList,
                loading: false,
            });
            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    const getConcern = async ConcernID => {
        const formData = new FormData();
        formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
        try {
            const res = await postAPI(`${API_URL.GET_CONCERN}`, formData);
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:70 ~ getConcern ~ res:', res);
            setConcernDetails({
                ...concernDetails,
                ...res?.Data?.[0],
                Loading: false,
                // ProbDesc: (res?.Data?.[0]?.ProbDesc || '')?.replace(/(<([^>]+)>)/gi, ''),
            });
            setStatusValue(res?.Data?.[0]?.StatusID || '');
            setSelectedTeam(res?.Data?.[0]?.TeamName);
        } catch (err) {
            setConcernDetails({
                ...concernDetails,
                Loading: false,
            });
            showErrorMessage('Sorry, Error while loading the concern!!');
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    const defaultInputs = useMemo(
        () => [
            {
                label: 'Category',
                name: 'CategoryID',
                required: !!!ConcernID,
                value: concernDetails?.CategoryName,
                type: INPUTS_CONSTANTS.INPUT,
                editable: !!!ConcernID,
            },
            {
                label: 'Sub Category',
                name: 'SubCategoryID',
                required: !!!ConcernID,
                value: concernDetails?.SubCategoryName,
                type: INPUTS_CONSTANTS.INPUT,
                editable: !!!ConcernID,
            },
            {
                label: 'Problem Classification',
                name: 'ProblemClassificationID',
                required: !!!ConcernID,
                value: concernDetails?.ProblemClassificationName,
                type: INPUTS_CONSTANTS.INPUT,
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
            //     label: 'Team Name',
            //     name: 'TeamName',
            //     value: concernDetails?.TeamName,
            //     type: INPUTS_CONSTANTS.INPUT,
            //     editable: false,
            // },
            // {
            //     label: 'Priority Name',
            //     name: 'PriorityName',
            //     value: concernDetails?.PriorityName,
            //     type: INPUTS_CONSTANTS.INPUT,
            //     editable: false,
            // },
            // {
            //     label: 'Project Start Date',
            //     name: 'ProjectStartDate',
            //     value: concernDetails?.ProjectStartDate ? moment(concernDetails?.ProjectStartDate).format(DATE_FORMAT.DD_MM_YYYY) : '',
            //     type: INPUTS_CONSTANTS.INPUT,
            //     editable: false,
            // },
        ],
        [concernDetails],
    );

    const handleDynamicInputs = concernDetails => {
        const dyInputs = dynamicInputs.map(input => {
            return {
                ...input,
                ...(!ConcernID && {
                    value: concernDetails?.[input?.name],
                }),
            };
        });
        setDynamicInputs([...dyInputs]);
    };

    const handleInputChange = (label, value) => {
        console.log('🚀 ~ file: view-concern-functional.js:233 ~ handleInputChange ~ label, value:', label, value);
        setConcernDetails({
            ...concernDetails,
            [label]: value,
        });
    };

    const handleDynamicInputChange = (label, value) => {
        setDynamicConcernDetails({
            ...dynamicConcernDetails,
            [label]: value,
        });
    };

    const handleCategoryValueChange = () => {
        getDynamicInputList(sites?.selectedSite, concernDetails?.CategoryID);
    };

    useEffect(() => handleDynamicInputs(concernDetails), [concernDetails]);

    useEffect(() => {
        ConcernID && getConcern(ConcernID);
    }, [ConcernID]);

    useEffect(() => {
        // sites?.selectedSite?.SiteId && getDropdownList(sites?.selectedSite?.SiteId);
        sites?.selectedSite?.Siteid && getDropdownList(sites?.selectedSite?.Siteid);
    }, [sites?.selectedSite]);

    useEffect(() => {
        if (concernDetails?.CategoryID) {
            handleCategoryValueChange();
        }
    }, [concernDetails?.CategoryID, sites?.selectedSite]);

    const getListData = res => {
        const defaultObj = {
            [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
            // [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
            [LOCAL_STORAGE_VARIABLES.SiteId]: res.Siteid,
            [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
        };
        dispatch(
            getDashboardConcernCounts(
                formReq({
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    // [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: res.Siteid,
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
        setIsDeleting(true);
        setConfirmModal(false);
        try {
            const res = await postAPI(
                `${API_URL.DELETE_CONCERN}`,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                    [APP_VARIABLES.USER_ID]: sites?.selectedSite?.UserId,
                }),
            );
            if (res?.Success) {
                setIsDeleting(false);
                navigation.goBack();
                getListData(sites?.selectedSite);
                handleRecentActivity(concernDetails, true);
                successMessage({ message: 'Success', description: 'Concern has been deleted' });
            } else {
                showErrorMessage(res?.Error);
                setIsDeleting(false);
            }
        } catch (err) {
            setIsDeleting(false);
            showErrorMessage("Sorry can't able to delete right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    console.log('🚀 ~ file: view-concern-functional.js:321 ~ handleSubmitConcern ~ dynamicConcernDetails:', dynamicConcernDetails?.SupplierID);
    const handleSubmitConcern = async () => {
        // if (!!dynamicConcernDetails?.SupplierID) {
        const filteredConcern = {
            ConcernId: ConcernID,
            CategoryID: concernDetails?.CategoryID,
            SubCategoryID: concernDetails?.SubCategoryID,
            ProblemClassificationID: concernDetails?.ProblemClassificationID,
            ConcernTitle: concernDetails?.ConcernTitle,
        };
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

        const formattedConcernDetails = { ...filteredConcern };
        await dynamicInputs?.map(input => {
            if (!input.dynamic && input.name) {
                formattedConcernDetails[input.name] = (dynamicConcernDetails?.[input.name] || '').toString() || '';
            }
        });

        const request = {
            StaticConcernInput: [
                {
                    ...formattedConcernDetails,
                    ButtonSave: APP_VARIABLES.SUBMIT,
                    Mode: 'Add',
                    CreatedBy: sites?.selectedSite?.UserId,
                    // [LOCAL_STORAGE_VARIABLES.SiteId]: sites?.selectedSite?.SiteId,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: sites?.selectedSite?.Siteid,
                },
            ],
            // ...(!!formattedDynamicConcernDetails?.length && { DynamicConcernInput: formattedDynamicConcernDetails }),
            DynamicConcernInput: formattedDynamicConcernDetails,
        };
        console.log('🚀 ~ file: view-concern-functional.js:353 ~ handleSubmitConcern ~ request:', request);

        setIsSubmitting(true);
        try {
            const res = await postAPI(`${API_URL.SAVE_CONCERN}`, request);
            if (res?.Success) {
                setIsSubmitting(false);
                navigation.goBack();
                getListData(sites?.selectedSite);
                successMessage({ message: 'Success', description: 'Concern has been submitted successfully' });
            } else {
                showErrorMessage(res?.Error);
                setIsSubmitting(false);
            }
        } catch (err) {
            setIsSubmitting(false);
            showErrorMessage("Sorry can't able to submit right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
        // } else {
        //     showErrorMessage('Supplier Id is required!!');
        // }
    };

    const handleUpdateStatus = async (StatusID, isRework = false) => {
        console.log('🚀 ~ file: view-concern-functional.js:392 ~ handleUpdateStatus ~ concernDetails:', isRework, StatusID);
        setIsSubmitting(true);
        try {
            const res = await postAPI(
                `${API_URL.UPDATE_CONCERN}`,
                formReq({
                    [APP_VARIABLES.STATUS_ID]: StatusID || STATUS_CODES.OPEN,
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                }),
            );
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:324 ~ handleSubmitConcern ~ res:', res);
            if (res?.Success) {
                // getConcern(ConcernID);
                navigation.goBack();
                getListData(sites?.selectedSite);
                setIsSubmitting(false);
                successMessage({ message: 'Success', description: 'Concern status has been submitted successfully' });
            } else {
                showErrorMessage(res?.Error);
                setIsSubmitting(false);
            }
        } catch (err) {
            setIsSubmitting(false);
            showErrorMessage("Sorry can't able to submit right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    return (
        <ViewConcernPresentational
            {...{
                defaultInputs,
                handleInputChange,
                handleDynamicInputChange,
                ConcernID,
                formModalVisible,
                setFormModalVisible,
                dynamicInputs,
                dynamicInputsLoading,
                concernDetails,
                selectedTeam,
                setSelectedTeam,
                confirmModal,
                setConfirmModal,
                handleDelete,
                isDeleting,
                handleSubmitConcern,
                isSubmitting,
                dropdownList,
                isProjectCreating,
                handleUpdateStatus,
                statusValue,
                setStatusValue,
            }}
        />
    );
};

export default ViewConcernFunctional;
