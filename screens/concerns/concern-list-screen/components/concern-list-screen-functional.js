import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import API_URL from 'global/api-urls';
import { postAPI } from 'global/api-helpers';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { useAppContext } from 'contexts/app-context';
import ConcernListScreenPresentational from './concern-list-screen-presentational';

const ConcernListScreenFunctional = ({}) => {
    const { ConcernStatusID, DashboardConcern, title } = useRoute()?.params;
    const { sites } = useAppContext();
    const [searchKey, setSearchKey] = useState('');
    const [list, setList] = useState({
        data: [],
        loading: true,
    });
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            sites?.selectedSite && getConcernList(sites?.selectedSite);
        }, [sites?.selectedSite]),
    );

    useEffect(() => {
        if (!list?.loading) {
            setRefreshing(false);
        }
    }, [list?.loading]);

    const handleRefresh = () => {
        setRefreshing(true);
        if (sites?.selectedSite) {
            getConcernList(sites?.selectedSite);
        }
    };

    const getConcernList = async res => {
        var formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.UserId, res.UserId);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.SiteId);
        formData.append(APP_VARIABLES.MAX_ROW, 500);
        if (DashboardConcern) {
            formData.append(LOCAL_STORAGE_VARIABLES.Filterstring, DashboardConcern);
        }
        if (ConcernStatusID !== null) {
            formData.append(APP_VARIABLES.CONCERN_STATUS_ID, ConcernStatusID);
        }
        setList({
            ...list,
            loading: true,
        });
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

    const filteredData = React.useMemo(
        () =>
            list?.data?.filter(
                concern =>
                    concern?.ConcernNo?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
                    concern?.Title?.toLowerCase()?.includes(searchKey?.toLowerCase()),
            ),
        [searchKey, list?.data],
    );

    console.log('list?.data', list?.data);

    return (
        <ConcernListScreenPresentational
            {...{
                list: {
                    data: filteredData,
                    loading: list?.loading,
                },
                title,
                handleRefresh,
                refreshing,
                searchKey,
                setSearchKey,
            }}
        />
    );
};

export default ConcernListScreenFunctional;