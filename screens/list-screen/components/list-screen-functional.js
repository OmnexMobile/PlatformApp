import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { useAppContext } from 'contexts/app-context';
import ListScreenPresentational from './list-screen-presentational';

const ListScreenFunctional = ({}) => {
    const { ConcernStatusID, DashboardConcern, title } = useRoute()?.params;
    const { sites } = useAppContext();
    const [list, setList] = useState({
        data: [],
        loading: true,
    });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (sites?.selectedSite) {
            getListData(sites?.selectedSite);
        }
    }, [sites?.selectedSite]);

    useEffect(() => {
        if (!list?.loading) {
            setRefreshing(false);
        }
    }, [list?.loading]);

    const handleRefresh = () => {
        setRefreshing(true);
        if (sites?.selectedSite) {
            getListData(sites?.selectedSite);
        }
    };

    const getListData = async res => {
        var formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.UserId, res.UserId);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        // formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.Siteid);
        if (DashboardConcern) {
            formData.append(LOCAL_STORAGE_VARIABLES.Filterstring, DashboardConcern);
        }
        if (ConcernStatusID) {
            formData.append(APP_VARIABLES.CONCERN_STATUS_ID, ConcernStatusID);
        }
        setList({
            ...list,
            loading: true,
        });
        console.log('formData--->1', formData)
        Promise.all([postAPI(`${DashboardConcern ? API_URL.DASHBOARD_CONCERN_LIST : API_URL.GET_LIST}`, formData)])
            .then(([res1]) => {
                setList({
                    data: res1?.Data || [],
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

    return <ListScreenPresentational {...{ list, title, handleRefresh, refreshing }} />;
};

export default ListScreenFunctional;
