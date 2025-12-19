import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { APP_VARIABLES, DATE_FORMAT, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { useAppContext } from 'contexts/app-context';
import ConcernListScreenPresentational from './concern-list-screen-presentational';
import moment from 'moment';

const ConcernListScreenFunctional = ({}) => {
    const { ConcernStatusID, DashboardConcern, title } = useRoute()?.params;
    const { sites, timeSettings } = useAppContext();
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
        console.log('getConcernList--->', res, '--', res?.Siteid, 'res.Siteid--->', res.Siteid);
        var formData = new FormData();
        formData.append(LOCAL_STORAGE_VARIABLES.UserId, res.UserId);
        // formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res?.Siteid);
        formData.append(LOCAL_STORAGE_VARIABLES.SiteId, res.Siteid);
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

    // const filteredData = React.useMemo(
    //     () =>
    //         list?.data?.filter(
    //             concern =>
    //                 concern?.ConcernNo?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
    //                 concern?.Title?.toLowerCase()?.includes(searchKey?.toLowerCase()) || moment(concern?.CreatedDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"]).toString()?.includes(searchKey),
    //         ),
    //     [searchKey, list?.data],
    // );
    const filteredData = React.useMemo(() => {
        if (!searchKey) return list?.data;

        const key = searchKey.toLowerCase();

        return list?.data?.filter(concern => {
            const concernNo = concern?.ConcernNo?.toLowerCase() || '';
            const title = concern?.Title?.toLowerCase() || '';

            const dateFormat = DATE_FORMAT[timeSettings] || 'DD_MM_YYYY';
            const createdDate = moment(concern?.CreatedDate).format(dateFormat).toLowerCase();
            return concernNo.includes(key) || title.includes(key) || createdDate.includes(key);
        });
    }, [searchKey, list?.data, timeSettings]);

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
