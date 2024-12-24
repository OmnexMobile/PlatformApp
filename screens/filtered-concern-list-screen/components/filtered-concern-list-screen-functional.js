import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import API_URL from 'global/api-urls';
import { postAPI } from 'global/api-helpers';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { useAppContext } from 'contexts/app-context';
import FilteredConcernListScreenPresentational from './filtered-concern-list-screen-presentational';

const FilteredConcernListScreenFunctional = ({}) => {
    const { fromdate } = useRoute()?.params;
    const { sites } = useAppContext();
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
        if (fromdate) {
            formData.append(APP_VARIABLES.FROM_DATE, fromdate);
            formData.append(APP_VARIABLES.TO_DATE, fromdate);
        }
        setList({
            ...list,
            loading: true,
        });
        Promise.all([postAPI(`${API_URL.CONCERN_LIST_FILTERED_BY_DATE}`, formData)])
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

    return <FilteredConcernListScreenPresentational {...{ list, title: fromdate, handleRefresh, refreshing }} />;
};

export default FilteredConcernListScreenFunctional;
