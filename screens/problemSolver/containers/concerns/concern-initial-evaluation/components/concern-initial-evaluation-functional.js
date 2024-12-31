import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_VARIABLES, INPUTS_CONSTANTS, LOCAL_STORAGE_VARIABLES, STATUS_CODES, DATE_FORMAT } from 'constants/app-constant';
import API_URL from 'global/ApiUrl';
import { postAPI, getAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { formReq, showErrorMessage, successMessage } from 'helpers/utils';
import { getDashboardConcernCounts, getTodayConcernList } from 'screens/home/home.action';
import ConcernInitialEvaluationPresentational from './concern-initial-evaluation-presentational';

const CHANGE_TO = {
    [STATUS_CODES.DraftConcern]: STATUS_CODES.OpenConcern,
    [STATUS_CODES.OpenConcern]: STATUS_CODES.InprogressConcern,
    [STATUS_CODES.InprogressConcern]: STATUS_CODES.CloseConcern,
};

const ConcernInitialEvaluationFunctional = ({}) => {
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

    const route = useRoute();
    const { appSettings, sites, handleRecentActivity } = useAppContext();
    const CREATE_PROJECT_URL = appSettings?.deviceStatusSettings?.InstanceUrl || '';
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
                    [APP_VARIABLES.FORM_TYPE_ID]: 2,
                    [APP_VARIABLES.SITE_ID]: res.SiteId,
                    [APP_VARIABLES.CONCERN_FORM_ID]: concernDetails?.ConcernFormID,
                    ...(ConcernID && {
                        ConcernId: ConcernID,
                    }),
                }),
            );

            const tempDynamicInputs = dynamicInputs?.filter(input => input?.value && input?.name !== 'StatusID');
            // console.log('🚀 ~ file: concern-initial-evaluation-functional.js:63 ~ getDynamicInputList ~ tempDynamicInputs:', tempDynamicInputs);
            setDynamicInputs([
                ...tempDynamicInputs?.map(input => ({
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
                })),
            ]);
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
        ],
        [concernDetails],
    );

    const filteredPriorities = useMemo(() => {
        return dropdownList?.data?.Priorities?.filter(
            priority => priority?.ParentCategoryId === concernDetails?.CategoryID && priority.ParentSubCategoryId === concernDetails?.SubCategoryID,
        );
    }, [dropdownList?.data?.Priorities, concernDetails?.SubCategoryID, concernDetails?.CategoryID]);

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
        setConcernDetails({
            ...concernDetails,
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

    const createProject = async () => {
        if (CREATE_PROJECT_URL) {
            setIsProjectCreating(true);
            try {
                const url = `${CREATE_PROJECT_URL}common/ProblemSolver/concerns/CreateProject?concernid=${ConcernID}&checksession=0`;
                // console.log("🚀 ~ file: concern-initial-evaluation-functional.js:292 ~ createProject ~ url:", url)
                // const res = await getAPI(
                //     `${CREATE_PROJECT_URL}EwQIMS/common/ProblemSolver/concerns/CreateProject?concernid=${ConcernID}&checksession=0`,
                // );
                const res = await getAPI(url);
                // const res = await getAPI(
                //     `http://saas.omnex.in:2010/EwQIMS/common/ProblemSolver/concerns/CreateProject?concernid=${ConcernID}&checksession=0`,
                // );
                console.log(
                    '🚀 ~ file: concern-initial-evaluation-functional.js:280 ~ createProject ~ res:',
                    url,
                    res,
                    res?.data,
                    typeof res?.data,
                    typeof res?.data === 'number',
                );
                // const res = await getAPI(`${API_URL.CREATE_PROJECT}?ConcernId=${ConcernID}`);
                if (typeof res?.data === 'number') {
                    // setIsProjectCreating(false);
                    handleSubmitConcern({
                        [APP_VARIABLES.STATUS_ID]: concernDetails?.StatusID,
                        [APP_VARIABLES.CONCERN_ID]: ConcernID,
                        [APP_VARIABLES.PROJECT_START_DATE]: concernDetails?.ProjectStartDate,
                    });
                    // navigation.goBack();
                    // getListData(sites?.selectedSite);
                    // successMessage({ message: 'Success', description: 'Project has been created for this Concern successfully' });
                } else {
                    showErrorMessage(res?.Error);
                    setIsSubmitting(false);
                    setIsProjectCreating(false);
                }
            } catch (err) {
                setIsProjectCreating(false);
                setIsSubmitting(false);
                // showErrorMessage("Sorry can't able to create Project!!");
                console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
            }
        }
    };

    const handleSubmitConcern = async req => {
        console.log('Concern details', concernDetails?.SupplierID);
        setIsSubmitting(true);
        try {
            const requestForForm = req || {
                [APP_VARIABLES.CONCERN_ID]: ConcernID,
                [APP_VARIABLES.STATUS_ID]: STATUS_CODES?.OPEN,
                [APP_VARIABLES.PROJECT_START_DATE]: concernDetails?.ProjectStartDate,
                [APP_VARIABLES.PRIORITY_ID]: concernDetails?.PriorityID,
            };
            const res = await postAPI(`${API_URL.UPDATE_CONCERN}`, formReq(requestForForm));
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:324 ~ handleSubmitConcern ~ res:', !req);
            if (res?.Success) {
                // getConcern(ConcernID);
                if (!req) {
                    createProject();
                } else {
                    setIsSubmitting(false);
                    successMessage({ message: 'Success', description: 'Concern has been submitted successfully' });
                    navigation.goBack();
                    getListData(sites?.selectedSite);
                    setIsProjectCreating(false);
                }
            } else {
                console.log('🚀 ~ handleSubmitConcern ~ res?.Error:', res?.Error);
                showErrorMessage(res?.Error);
                setIsSubmitting(false);
                setIsProjectCreating(false);
            }
        } catch (err) {
            setIsSubmitting(false);
            setIsProjectCreating(false);
            showErrorMessage("Sorry can't able to submit right now!!");
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
        }
    };

    return (
        <ConcernInitialEvaluationPresentational
            {...{
                defaultInputs,
                handleInputChange,
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
                filteredPriorities,
            }}
        />
    );
};

export default ConcernInitialEvaluationFunctional;
