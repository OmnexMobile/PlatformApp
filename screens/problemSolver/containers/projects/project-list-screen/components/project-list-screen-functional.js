import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import moment from 'moment';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES, TOAST_STATUS } from 'constants/app-constant';
import { useAppContext } from 'contexts/app-context';
import ProjectListScreenPresentational from './project-list-screen-presentational';
import { projectData } from './data';
import { formReq, toast } from 'helpers/utils';

const ProjectListScreenFunctional = ({}) => {
    const { sites } = useAppContext();
    const [errorText, setErrorText] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [updatingPercentage, setUpdatingPercentage] = useState(false);
    const [list, setList] = useState({
        data: [],
        loading: true,
    });
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            sites?.selectedSite && getProjectList(sites?.selectedSite);
        }, [sites?.selectedSite]),
    );

    useEffect(() => {
        !selectedTask && setErrorText('');
    }, [selectedTask]);

    useEffect(() => {
        if (!list?.loading) {
            setRefreshing(false);
        }
    }, [list?.loading]);

    const handleRefresh = () => {
        setRefreshing(true);
        if (sites?.selectedSite) {
            getProjectList(sites?.selectedSite);
        }
    };

    const getProjectList = async res => {
        setList({
            ...list,
            loading: true,
        });
        // setTimeout(() => {
        //     const groupedByProjectId = projectData.reduce(function (acc, obj) {
        //         acc[obj?.ProjectID] = acc[obj?.ProjectID] || [];
        //         acc[obj?.ProjectID].push(obj);
        //         return acc;
        //     }, {});

        //     const formatAsArray = Object.entries(groupedByProjectId || {}).map(([, value]) => ({
        //         title: value?.[0]?.Actions,
        //         list: value || [],
        //     }));
        //     setList({
        //         data: formatAsArray,
        //         loading: false,
        //     });
        // }, 1500);
        Promise.all([
            postAPI(`${API_URL.PROJECT_LIST}`, {
                UserID: res.UserId,
                // SiteID: res.SiteId,
                SiteID: res.Siteid,
                Index: '0',
                MaxRow: '500',
                ListType: '0',
                ProjectView: '0',
                StartDate: '1969-01-07',
                EndDate: moment().format('YYYY-MM-DD'),
                FilterColumn: '',
                FilterValue: '',
                OrderBy: '',
                SortType: '',
            }),
        ])
            .then(([res1]) => {
                const groupedByProjectId = (res1?.Data || []).reduce(function (acc, obj) {
                    acc[obj?.ProjectID] = acc[obj?.ProjectID] || [];
                    acc[obj?.ProjectID].push(obj);
                    return acc;
                }, {});

                const formatAsArray = Object.entries(groupedByProjectId || {}).map(([, value]) => ({
                    title: value?.[0]?.Actions,
                    list: value || [],
                }));
                setList({
                    data: formatAsArray || [],
                    loading: false,
                });
            })
            .catch(err => {
                setList({
                    data: [],
                    loading: false,
                });
            });
    };

    const filteredData = React.useMemo(
        () => list?.data?.filter(concern => concern?.title?.toLowerCase()?.includes(searchKey?.toLowerCase())),
        [searchKey, list?.data],
    );

    const handleUpdatePercentage = async () => {
        setUpdatingPercentage(true);
        setErrorText('');
        try {
            const res = await postAPI(
                `${API_URL.PROJECT_PERCENTAGE_UPDATE}`,
                formReq({
                    [LOCAL_STORAGE_VARIABLES.UserId]: sites?.selectedSite?.UserId,
                    [APP_VARIABLES.TASK_ID]: selectedTask?.ActionId,
                    [APP_VARIABLES.FROM_PERCENTAGE]: selectedTask?.FromPercent,
                    [APP_VARIABLES.PERCENTAGE]: selectedTask?.Percentage,
                }),
            );
            if (res?.Message === 'Success') {
                setSelectedTask(null);
                getProjectList(sites?.selectedSite);
                toast('Success', res?.message, res?.Message === 'Success' ? TOAST_STATUS.SUCCESS : TOAST_STATUS.ERROR);
            } else {
                setErrorText(res?.Data || '');
            }
            setUpdatingPercentage(false);
        } catch (err) {
            setUpdatingPercentage(false);
            console.log('🚀 ~ file: project-list-screen-functional.js:119 ~ handleUpdatePercentage ~ res:', err);
        }
    };

    return (
        <ProjectListScreenPresentational
            {...{
                list: {
                    data: filteredData,
                    loading: list?.loading,
                },
                title: 'Projects',
                handleRefresh,
                refreshing,
                searchKey,
                setSearchKey,
                handleUpdatePercentage,
                setSelectedTask,
                selectedTask,
                updatingPercentage,
                errorText,
            }}
        />
    );
};

export default ProjectListScreenFunctional;
