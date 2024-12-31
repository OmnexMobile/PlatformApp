import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { APP_VARIABLES, LOCAL_STORAGE_VARIABLES, ROUTES, STATUS_CODES } from 'constants/app-constant';
import Auth from 'services/Auth';
import { useAppContext } from 'contexts/app-context';
import { getDashboardConcernCounts, getPendingConcernList, getTodayConcernList, getUpcomingConcernList } from '../home.action';
import { formReq } from 'helpers/utils';
import HomePresentational from './home-presentational';
import AsyncStorage from '@react-native-community/async-storage';

const HomeFunctional = ({}) => {
    const { sites } = useAppContext();
    const [searchKey, setSearchKey] = useState('');
    const [currentConcerns, setCurrentConcerns] = useState('')
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

    const isFocused = useIsFocused();
    console.log('Home---problemsolver reached')

    // useEffect(() => {
    //     StatusBar.setBarStyle(isFocused ? 'light-content' : theme?.selectedMode === Modes.light ? 'dark-content' : 'light-content');
    //     Platform.OS === 'android' && StatusBar.setBackgroundColor(isFocused ? theme.colors.primaryThemeColor : theme.mode.backgroundColor);
    // }, [isFocused]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (sites?.selectedSite) {
            console.log('🚀 ~ file: home-functional.js:45 ~ useEffect ~ sites?.selectedSite', sites?.selectedSite);
            getListData(sites?.selectedSite);
        }
    }, [sites?.selectedSite?.Siteid]);
    // }, [sites?.selectedSite?.SiteId]);

    const getListData = React.useCallback(
        async res => {
            try {
                // const res = sites?.selectedSite;
                if (res?.UserId) {
                    const defaultObj = {
                        [LOCAL_STORAGE_VARIABLES.UserId]: res?.UserId,
                        // [LOCAL_STORAGE_VARIABLES.SiteId]: res.SiteId,
                        [LOCAL_STORAGE_VARIABLES.SiteId]: res.Siteid,
                        [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
                    };
                    dispatch(
                        getDashboardConcernCounts(
                            formReq({
                                [LOCAL_STORAGE_VARIABLES.UserId]: res?.UserId,
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
                    dispatch(
                        getUpcomingConcernList(
                            formReq({
                                ...defaultObj,
                                [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.UPCOMING_CONCERN,
                            }),
                        ),
                    );
                    dispatch(
                        getPendingConcernList(
                            formReq({
                                ...defaultObj,
                                [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.PENDING_CONCERN,
                            }),
                        ),
                    );
                }
            } catch (error) {
                console.log('🚀 ~ file: home-functional.js:95 ~ getListData ~ error:', error);
            }
        },
        [sites?.selectedSite?.Siteid],
        // [sites?.selectedSite?.SiteId],
    );

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

    useEffect(() => {
        async function getCurrentConcerns() {
          try {
            const value = await AsyncStorage.getItem('concerns')
            if (value !== null) {
              // value previously stored
              console.log('current concerns--->', value)
              setCurrentConcerns(value)
              navigateToStatusCount(value)
            }
          } catch (e) {
            // error reading value
            console.log('concerns error--->', e)
          }
        }
        getCurrentConcerns()
      }, [ ])
    
    console.log('countDetails, countDetailsLoading, sites--->reach func', countDetails, '--', countDetailsLoading, '--', sites)

    const openModal = () => {
        modalizeRef.current?.open();
    };

    const filteredSites = useMemo(
        () => sites?.siteList?.filter(site => site?.SiteName?.toLowerCase()?.includes(searchKey?.toLowerCase())),
        [sites?.siteList, searchKey],
    );

    const navigateToStatusCount = (concerns) => {
        console.log('navigateToStatusCount---->', concerns)
        // loading={countDetailsLoading}
        //                 navigation={navigation}
        //                 title="All"
        //                 value={countDetails?.TotalConcern || 0}
        //                 field={'TotalConcern'}

        // navigation.navigate(ROUTES.LIST_SCREEN_PS, {
        //   concerns: concerns,
        //   countDetails: countDetails,
        //   countDetailsLoading: countDetailsLoading,
        //   sites: sites,
        // })  Open Concerns

        if (concerns == 'Supplier Concerns'){
            const field = 'TotalConcern'
            const title = 'All'
            navigation.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            })
        } 
        else if (concerns == 'Open Concerns'){
            const field = 'OpenConcern'
            const title = 'Open'
            navigation.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            })
        }
        else if (concerns == 'In Progress Concerns'){
            const field = 'InprogressConcern'
            const title = 'In-Progress'
            navigation.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            })
        }

    }

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
                countDetailsLoading,
                handleRefresh: () => getListData(sites?.selectedSite),
            }}
        />
    );
};

export default HomeFunctional;
