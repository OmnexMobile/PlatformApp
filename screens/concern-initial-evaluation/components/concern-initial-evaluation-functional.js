import React, { useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { APP_VARIABLES, INPUTS_CONSTANTS } from 'constants/app-constant';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';
import { formReq } from 'helpers/utils';
import ConcernInitialEvaluationPresentational from './concern-initial-evaluation-presentational';

const ConcernInitialEvaluationFunctional = ({}) =>{
    const [concernDetails, setConcernDetails] = useState({
        ConcernNo: '',
        CategoryID: '',
        SubCategoryID: '',
        ProblemClassificationID: '',
        ConcernTitle: '',
        ButtonSave: 'Save',
        Mode: 'Save',
    });
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [dynamicInputs, setDynamicInputs] = useState([]);
    const [dynamicInputsLoading, setDynamicInputsLoading] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const { sites } = useAppContext();
    const route = useRoute();

    const { ConcernID = '' } = route?.params || { ConcernID: '' };

    const getFormInputList = async (res, categoryId) => {
        setDynamicInputsLoading(true);
        try {
            const { Data: dynamicInputs } = await postAPI(
                `${API_URL.FORM_INPUT_LIST}`,
                formReq({
                    [APP_VARIABLES.SOURCE_ID]: categoryId,
                    [APP_VARIABLES.FORM_TYPE]: 'cat',
                    [APP_VARIABLES.FORM_TYPE_ID]: 1,
                    [APP_VARIABLES.SITE_ID]: res.SiteId,
                    [APP_VARIABLES.CONCERN_FORM_ID]: 1,
                    ...(ConcernID && {
                        ConcernId: ConcernID,
                    }),
                }),
            );

            const tempDynamicInputs = dynamicInputs?.filter(input => input?.value)
            setDynamicInputs([
                ...tempDynamicInputs?.map(input => ({
                    ...input,
                    editable: !!!ConcernID,
                    type:  INPUTS_CONSTANTS.INPUT,
                    ...(input?.name === "CustomerID" && { value: concernDetails["CustomerName"] })
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
        const formData = new FormData();
        formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
        try {
            const res = await postAPI(`${API_URL.GET_CONCERN}`, formData);
            setConcernDetails({
                ...concernDetails,
                ...res?.Data?.[0],
            });
            setSelectedTeam(res?.Data?.[0]?.TeamName);
        } catch (err) {
            console.log("🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err", err)
        }
    };

    const defaultInputs = useMemo(
        () => [
            {
                label: 'Category',
                name: 'CategoryID',
                required: !!!ConcernID,
                value:  concernDetails?.CategoryName,
                type:  INPUTS_CONSTANTS.INPUT ,
                editable: !!!ConcernID,
            },
            {
                label: 'Sub Category',
                name: 'SubCategoryID',
                required: !!!ConcernID,
                value:  concernDetails?.SubCategoryName ,
                type:  INPUTS_CONSTANTS.INPUT,
                editable: !!!ConcernID,
            },
            {
                label: 'Problem Classification',
                name: 'ProblemClassificationID',
                required: !!!ConcernID,
                value:  concernDetails?.ProblemClassificationName,
                type:  INPUTS_CONSTANTS.INPUT,
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
        getFormInputList(sites?.selectedSite, concernDetails?.CategoryID);
    };

    useEffect(() => handleDynamicInputs(concernDetails), [concernDetails]);

    useEffect(() => {
        ConcernID && getConcern(ConcernID);
    }, [ConcernID]);

    useEffect(() => {
        if (concernDetails?.CategoryID) {
            handleCategoryValueChange();
        }
    }, [concernDetails?.CategoryID, sites?.selectedSite]);

    return  <ConcernInitialEvaluationPresentational {...{  defaultInputs,
        handleInputChange,
        ConcernID,
        formModalVisible,
        setFormModalVisible,
        dynamicInputs,
        dynamicInputsLoading,
        concernDetails,
        selectedTeam,
        setSelectedTeam,
    }}/>
};

export default ConcernInitialEvaluationFunctional;
