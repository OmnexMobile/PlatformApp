import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { LOCAL_STORAGE_VARIABLES, STATUS_CODES } from 'constants/app-constant';
import Auth from 'services/Auth';
import { useAppContext } from 'contexts/app-context';
import { getDashboardConcernCounts, getPendingConcernList, getTodayConcernList, getUpcomingConcernList } from '../home.action';
import { formReq } from 'helpers/utils';
import HomePresentational from './home-presentational'

const HomeFunctional = ({}) => {
    const { sites } = useAppContext();
    const [searchKey, setSearchKey] = useState('');
    const modalizeRef = React.useRef(null);
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const navigation = useNavigation();
    const {
        todayList,
        upcomingList,
        pendingList,
        countDetails = {},
        loading: countDetailsLoading,
    } = useSelector(
        ({
            homeRedux: {
                dashboardConcernList: { todayList, upcomingList, pendingList },
                dashboardConcernCounts: { countDetails, loading },
            },
        }) => ({ todayList, upcomingList, pendingList, countDetails, loading }),
    );
    console.log('CURRENT_PAGE---->', 'home-functional')

    const isFocused = useIsFocused();

    // useEffect(() => {
    //     StatusBar.setBarStyle(isFocused ? 'light-content' : theme?.selectedMode === Modes.light ? 'dark-content' : 'light-content');
    //     Platform.OS === 'android' && StatusBar.setBackgroundColor(isFocused ? theme.colors.primaryThemeColor : theme.mode.backgroundColor);
    // }, [isFocused]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (sites?.selectedSite) {
            console.log("🚀 ~ file: home-functional.js:45 ~ useEffect ~ sites?.selectedSite", sites?.selectedSite)
            getListData(sites?.selectedSite);
        }
    }, [sites?.selectedSite?.SiteId]);

    const getListData = async res => {
        const defaultObj = {
            [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
            [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
            [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
        };
        dispatch(
            getDashboardConcernCounts(
                formReq( {
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
                }),
            ),
        );
        dispatch(
            getTodayConcernList(
                formReq( {
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.TODAY_CONCERN,
                }),
            ),
        );
        dispatch(
            getUpcomingConcernList(
                formReq( {
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.UPCOMING_CONCERN,
                }),
            ),
        );
        dispatch(
            getPendingConcernList(
                formReq( {
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.PENDING_CONCERN,
                }),
            ),
        );
    };

    useEffect(() => {
        const backAction = () => {
            if (!navigation.canGoBack()) {
                setExitModalVisible(true);
                return true;
            }
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    const openModal = () => {
        modalizeRef.current?.open();
    };

    const filteredSites = useMemo(
        () => sites?.siteList?.filter(site => site?.SiteName?.toLowerCase()?.includes(searchKey?.toLowerCase())),
        [sites?.siteList, searchKey],
    );

    return (
        <HomePresentational
            {...{
                profile: sites?.selectedSite,
                exitModalVisible,
                setExitModalVisible,
                countDetails,
                modalizeRef,
                openModal,
                sites,
                searchKey,
                setSearchKey,
                filteredSites,
                todayList,
                upcomingList,
                pendingList,
            }}
        />
    );
};

export default HomeFunctional;
