import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Content, TextComponent, ExitModal, ChooseSite, FAB, Avatar } from 'components';
import { APP_VARIABLES, FONT_TYPE, ROUTES, USER_TYPE, ICON_TYPE, STATUS_CODES, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import strings from 'config/localization';
import IconComponent from 'components/icon-component';
import { useAppContext } from 'contexts/app-context';
import { formReq, getAvatarInitials, getICList, RFPercentage } from 'helpers/utils';
import { useSelector, useDispatch } from 'react-redux';
import ProjectCount from './ProjectCount';
import { ScrollView } from 'react-native-gesture-handler';
import localStorage from 'global/localStorage';
import { HomeListComponent } from './home-list';
import { HomeListRecentActivity } from './home-RecentActivity';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import supplierAuth from '../../services/SupplierMgnt-Auth';
import { useIsFocused } from '@react-navigation/native';
import APQPAuth from '../../services/APQP-Auth';
import { APQP_URL, PROBLEMSOLVING_URL } from 'screens/globalConstant/globalURL';
import { getDashboardConcernCounts, getTodayConcernList } from 'screens/home/home.action';
import { HomeListComponentApqp } from './home-list-apqp';
import { getInspectionDataByUserAndSite } from 'store/database/inspectStorage';

const HomeDashboard = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { sites, recentActivities, handleGlobalURL } = useAppContext();
    console.log('recentActivities in home dashboard', recentActivities);
    const [currentName, setCurrentName] = useState('');
    const [moduleLicenses, setModuleLicenses] = useState(null);
    //Apqp
    const [todaysActivityAPQP, setTodaysActivityAPQP] = useState([]); //APQP
    const [todayLoading, setTodayLoading] = useState(true); //APQP
    const [countAPQP, setCountAPQP] = useState([]); //APQP/
    //PS
    const [todaysActivityPS, setTodaysActivityPS] = useState([]);
    const [accessToken, setaccessToken] = useState('');
    const [userId, setuserId] = useState('');
    const [siteId, setsiteId] = useState('');
    //SM&AuditPro
    const [auditList, setauditList] = useState([]);
    const [userDetailsAudit, setuserDetailsAudit] = useState([]);
    const [todaysActivitySM, settodaysActivitySM] = useState([]);
    const [todaysActivity, settodaysActivity] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    // const [recentActivitySM, setRecentActivitySM] = useState([]);
    // const [recentSM, setRecentSM] = useState([]);
    const Reducers_RecentActivity = useSelector(state => state);
    console.log('Full Redux State:', Reducers_RecentActivity);
    const recentActivitySM = Reducers_RecentActivity?.audits?.recentAudits?.slice(-1)[0];
    console.log('Reversed Recent Audits:', recentActivitySM);

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
    // const [, set] = useState("");aa1eeeeer
    const isFocused = useIsFocused();

    const data = useSelector(state => state?.projects?.recentActivity?.flat() ?? []);
    const recentActivityAPQP = data.length > 0 ? [...data].reverse() : [];
    console.log('111 Recent Activity:', recentActivityAPQP);
    console.log('111 todaysActivityAPQP', todaysActivityAPQP);

    const recentActivityPS = recentActivities.filter(item => !item.ProjectDescription);
    console.log('222 Recent Activity:', recentActivityPS);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsString = await AsyncStorage.getItem('userDetails');
                const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

                if (userDetails) {
                    setuserDetailsAudit(userDetails);
                    setaccessToken(userDetails.accessToken);
                    setsiteId(userDetails.siteId);
                    setuserId(userDetails.userId);
                }
            } catch (err) {
                console.log("Error fetching user details", err);
            }
        };

        if (isFocused) {
            fetchUserDetails();
        }
    }, [isFocused]);

    useEffect(() => {
        console.log('isFocused----->', isFocused);

        if (accessToken && siteId && userId) {
            console.log('Now calling getAuditlist after states are set ✅');
            console.log('inside isFocused----->');
            getAuditlist('', '');
            // getApqpList();
        }
    }, [accessToken, siteId, userId, isFocused]);

    useEffect(() => {
        console.log('isFocused----->1', isFocused);
        if (accessToken && siteId && userId) {
            console.log('inside isFocused----->1');
            getApqpList();
            getICList(userId,siteId);
        }
    }, [isFocused]);

    useEffect(() => {
        const fetchData = async () => {
            const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
            console.log('UserFullName------------', UserFullName);
            setCurrentName(UserFullName);
        }
        fetchData();
    }, [currentName]);

    useEffect(() => {
        console.log('todaysActivitySM---->', todaysActivitySM);
        console.log('todaysActivityAPQP---->', todaysActivityAPQP);
        console.log('todaysActivityPS---->', todaysActivityPS);

        setTodaysActivityPS(todayList?.data || []);
        if (todaysActivitySM.length > 0 || todaysActivityAPQP.length > 0 || todaysActivityPS.length > 0) {
            const mergedActivity = [...todaysActivitySM, ...todaysActivityPS, ...todaysActivityAPQP];
            settodaysActivity(mergedActivity);
            console.log('Final today activity------->123', mergedActivity);
        }

        // Normalize each input to an array
        const rSM = Array.isArray(recentActivitySM) ? recentActivitySM : recentActivitySM ? [recentActivitySM] : [];
        // const rAPQP = Array.isArray(recentActivityAPQP) ? recentActivityAPQP : recentActivityAPQP ? [recentActivityAPQP] : [];
        const rPS = Array.isArray(recentActivityPS) ? recentActivityPS : recentActivityPS ? [recentActivityPS] : [];

        console.log('Final recent activity rSM:', rSM);
        // console.log('Final recent activity rAPQP:', rAPQP);
        console.log('Final recent activity rPS:', rPS);

        // if (rSM.length > 0 || rAPQP.length > 0 || rPS.length > 0) {
        if (rSM.length > 0  || rPS.length > 0) {
            // const mergedRecentActivity = [...rSM, ...rAPQP, ...rPS];
            const mergedRecentActivity = [...rSM, ...rPS];
            setRecentActivity(mergedRecentActivity);
            console.log('Final merged recent activity:', mergedRecentActivity);
        }

    }, [todaysActivitySM, todaysActivityAPQP, todaysActivityPS]);
    console.log('Final array of today and Recent activity------->', todaysActivity, '------',recentActivity);

    useEffect(() => {
      const loadLicenses = async () => {
        const stored = await AsyncStorage.getItem('moduleLicenses');
        console.log('stored licenses', stored);
        if (stored) {
          setModuleLicenses(JSON.parse(stored));
        }
      };
      loadLicenses();
    }, []);
    console.log('moduleLicenses hasApqpPpapLicense', moduleLicenses?.hasSupplierManagementLicense,moduleLicenses?.hasApqpPpapLicense, moduleLicenses?.hasProblemSolverLicense)

    // const updateRecentList = (SM) => {
    //     console.log('updateRecentList called', SM);
    //     const updatedList = recentSM.map(item => ({
    //         ...item,
    //         Module_name: SM === 1
    //             ? 'AuditPro'
    //             : SM === 2
    //                 ? 'Supplier Initial Assessment'
    //                 : 'Supplier Routine Audit'
    //     }));

    //     console.log(updatedList);
    //     setRecentActivitySM(updatedList);
    // }

    const getAuditlist = (startDate, endDate) => {
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                const pageNo = 1;
                const filterId = '';
                const pageSize = 10;
                const GlobalFilter = '';
                const StartDate = startDate == undefined ? '' : startDate;
                const EndDate = endDate == undefined ? '' : endDate;
                const SortBy = '';
                const SortOrder = '';
                const Default = 1;

                console.log('checkaccesstokennnnn', accessToken, userId, siteId);

                // 🔹 helper function to fetch audits by SM
                const fetchAuditData = SM =>
                    new Promise(resolve => {
                        supplierAuth.getauditlist(
                            accessToken,
                            userId,
                            siteId,
                            pageNo,
                            pageSize,
                            filterId,
                            GlobalFilter,
                            StartDate,
                            EndDate,
                            SortBy,
                            SortOrder,
                            SM,
                            Default,
                            (response, data) => {
                                if (data?.data?.Message === 'Success' && data?.data?.Data) {

                                    // Add S_name based on SM value
                                    const updatedData = data.data.Data.map(item => ({
                                        ...item,
                                        Module_name: SM === 1 ? 'AuditPro' : SM == 2 ? 'Supplier Initial Assessment' : 'Supplier Routine Audit',
                                    }));

                                    resolve(updatedData);
                                } else {
                                    resolve([]); // No data
                                }
                                // updateRecentList(SM);
                            },
                        );
                    });

                // 🔹 Fetch both SM=2 and SM=3 data in parallel
                Promise.all([fetchAuditData(1), fetchAuditData(2), fetchAuditData(3)])
                    .then(([sm1Data, sm2Data, sm3Data]) => {
                        // Merge results
                        const combinedData = [...sm1Data, ...sm2Data, ...sm3Data];

                        // 🔹 Date & status filter
                        const today = new Date();
                        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

                        const filteredAuditList = combinedData
                            .filter(audit => {
                                const startDate = new Date(audit.StartDate);
                                const endDate = new Date(audit.EndDate);
                                const isInDateRange = endDate >= today && startDate <= endOfMonth;
                                const isValidStatus = audit.AuditStatus === 2 || audit.AuditStatus === 4;
                                return isInDateRange && isValidStatus;
                            })
                            .map(audit => ({
                                ...audit,
                                SiteName: sites.selectedSite.SiteName, // 👈 Add SiteName here
                            }));

                        console.log('✅ Final Filtered AuditList:', filteredAuditList);
                        settodaysActivitySM(filteredAuditList);
                    })
                    .catch(err => {
                        console.log('Error fetching audit lists:', err);
                    });
            } else {
                console.log('No internet connection');
            }
        });
    };

    const getApqpList = async () => {
        const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
        console.log('UserFullName------------', UserFullName);
        // if(moduleLicenses?.hasApqpPpapLicense) {
            getData()
                .then(res => {
                    console.log('async  getdata apqp', res);
                    APQPAuth.setServerUrl(APQP_URL);
                    getapqpDashboarddata(res); //counts API
                    getTodaysTask(res);
                    // getRecentTask(res);
                })
                .catch(e => {
                    console.log('Async aerror', e);
                });
        // }
    };


    const getData = async () => {
        try {
            var userdata = [];
            // const stringifiedUserDetails = await AsyncStorage.getItem('userDataApqp');
            // const value = JSON.parse(stringifiedUserDetails);
            const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
            const value = JSON.parse(stringifiedUserDetails);
            console.log('current userdata--->', value);
            var userdata = {
                UserId: value?.userId,
                SiteId: value?.siteId,
                Token: value?.accessToken,
                UserFullName: value?.userFullName,
            };
            console.log('userdata aync', userdata);
            return userdata;
        } catch (e) {
            console.log('No user session');
        }
    };

    const getTodaysTask = async res => {
        var UserID = res.UserId;
        var Token = res.Token;
        var Siteid = res.SiteId;
        var TodayTask = 1;
        console.log('API  getTodaysTask', res);
        console.log('Siteid--->', Siteid);
        console.log('UserID--->', UserID);
        console.log('Token--->', Token);
        NetInfo.fetch().then(netStatus => {
            if (netStatus.isConnected) {
                APQPAuth.calendarapi(UserID, Siteid, Token, TodayTask, (res, data) => {
                    console.log(' todaystask data', data);
                    if (data.data.Message == 'Success') {
                        console.log(' todaystask data.data.Data', data.data.Data);
                        setTodaysActivityAPQP(data.data.Data);
                        setTodayLoading(false);
                    }
                });
            }
        });
    };
    const getapqpDashboarddata = async res => {
        console.log('API_Calls------------------>1');
        console.log('calling dashboard api counts');
        var UserID = res.UserId;
        var Siteid = res.SiteId;
        var token = res.Token;
        console.log(UserID, Siteid, token);
        NetInfo.fetch().then(isConnected => {
            if (isConnected) {
                APQPAuth.getapqpDashboarddata(UserID, Siteid, token, (res, data) => {
                    console.log('getting counts responses', data);
                    if (data.data.Message == 'Success') {
                        setCountAPQP(data.data.Data);
                        console.log('getting counts apqpDashboarddata', data.data.Data);
                        AsyncStorage.setItem('countAPQP', JSON.stringify(data.data.Data));
                    }
                });
            }
        });
    };
    const dispatch = useDispatch();

    const storeUrl = async url => {
        console.log('reach storeUrl--->', url);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, url);
        handleGlobalURL('serverUrl', url);
        await AsyncStorage.setItem('storedserverrul', url);
    };

    console.log('sites?.selectedSite?.FullName || currentName---->', sites?.selectedSite?.FullName, '---', currentName, '---', sites);
    console.log('handleAddRecentActivities ~ recentActivities', sites);
    useEffect(() => {
        const fetchData = async () => {
            console.log(
                '🚀 ~ file: home-DASHBOARD ~ useEffect ~ sites?.selectedSite',
                sites,
                '----',
                sites?.selectedSite,
                'currentName',
                currentName,
            );
            const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
            console.log('UserFullName------------', UserFullName);
                if (sites?.selectedSite) {
                    console.log('🚀 ~ sites?.selectedSite2', sites, '----', sites?.selectedSite);
                    storeUrl(PROBLEMSOLVING_URL);
                    getListData(sites?.selectedSite);
                }
        };
        fetchData(); // call it
        // optional cleanup:
        return () => {
            // nothing to clean up here, unless you have subscriptions
        };
    }, [sites?.selectedSite?.Siteid]);

    const getListData = async res => {
        console.log('getListData-->res', res);
        const defaultObj = {
            [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
            [LOCAL_STORAGE_VARIABLES.SiteId]: res.Siteid,
            [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
        };
        dispatch(
            getDashboardConcernCounts(
                formReq({
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
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

    const navigateToSettings = () => {
        console.log('click settings');
        navigation.navigate(ROUTES.GLOBAL_SETTINGS);
    };

    return (
        <Content noPadding>
            <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}>
                <View style={{ flex: 9 }}>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                        {strings.welcome}!
                    </TextComponent>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
                        {sites?.selectedSite?.FullName || currentName}
                    </TextComponent>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToSettings()}>
                        <Avatar
                            // img={activeOrganization?.img}
                            placeholder={getAvatarInitials(sites?.selectedSite?.SiteName)}
                            width={RFPercentage(7)}
                            height={RFPercentage(7)}
                            style={{
                                backgroundColor: theme.colors.primaryThemeColor,
                                borderRadius: 100,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {/* Today Activity */}
                <HomeListComponent
                    {...{
                        statusCode: STATUS_CODES.TODAY_CONCERN,
                        title: 'Today’s Activity/Concern',
                        data: todaysActivity,
                        // loading: todayList?.loading,
                        loading: false,
                        currentName: currentName,
                    }}
                />
                {/* Recent Activity */}             
                {moduleLicenses?.hasApqpPpapLicense ?
                    <HomeListComponentApqp
                        {...{
                            statusCode: STATUS_CODES.PENDING_CONCERN,
                            title: 'Recently Viewed',
                            data: recentActivityAPQP,
                            loading: false,
                            hideSeeAll: true,
                            currentName: currentName,
                        }}
                    />
                :
                    <HomeListRecentActivity
                        {...{
                            statusCode: STATUS_CODES.PENDING_CONCERN,
                            // title: APP_VARIABLES.PENDING_CONCERN,
                            title: 'Recently Viewed',
                            // data: recentActivities,
                            // data: currentName == 'Dhanapal Swetha   ' ? recentActivities : null,
                            data: recentActivity,
                            loading: false,
                            hideSeeAll: true,
                            currentName: currentName,
                        }}
                    />
                }
            </ScrollView>
            <FAB iconName="tasks" iconType={ICON_TYPE.FontAwesome5} onPress={() => navigation.navigate(ROUTES.HOME_FAB_VIEW)} />
        </Content>
    );
};

export default HomeDashboard;
