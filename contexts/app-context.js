import React, { useState, useContext, useEffect, useCallback } from 'react';
import moment from 'moment';
import localStorage from '../global/localStorage';
import { API_URL, COMPANY_DETAILS, DATE_FORMAT, Languages, LOCAL_STORAGE_VARIABLES } from '../constants/app-constant';
import strings from '../config/localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creating the context object and passing the default values.
const AppContext = React.createContext({});

const DEFAULT_VALUE = {
    Token: '',
    UserId: '',
    SiteId: '',
    SiteDetails: '',
    UserFullName: '',
    UserEmail: '',
    Address: COMPANY_DETAILS.Address,
    CompanyName: COMPANY_DETAILS.CompanyName,
    CompanyUrl: COMPANY_DETAILS.CompanyUrl,
    Logo: COMPANY_DETAILS.Logo,
    Phone: COMPANY_DETAILS.Phone,
    loading: true,
    CurrentApp: '',
};

const AppProvider = ({ children }) => {
    const [organization, setOrganization] = useState({
        selectedOrganization: null,
        organizationList: [],
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [sites, setSites] = useState({
        selectedSite: null,
        siteList: [],
    });
    const [profile, setProfile] = useState(DEFAULT_VALUE);
    const [appSettings, setAppSettings] = useState({
        language: 'en',
        serverUrl: '',
        //Problem solver
        deviceStatusSettings: null,
    });
    const [timeSettings, setTimeSettings] = useState(DATE_FORMAT.DD_MM_YYYY)
    const [globalURL, setGlobalURL] = useState({
        serverUrl: '',
    });
    const [globalLoginData, setGlobalLoginData] = useState({
        loginData: [],
        token: '',
        userName: '',
        userId: '',
    });
    const [globalDeviceDetails, setGlobalDeviceDetails] = useState({
        deviceDetails: [],
    });

    const resolveSelectedSite = (siteList = [], storedSiteDetails, storedSiteId) => {
        if (storedSiteDetails && typeof storedSiteDetails === 'object' && !Array.isArray(storedSiteDetails)) {
            return storedSiteDetails;
        }

        const normalizedStoredId = storedSiteId?.Siteid || storedSiteId?.SiteId || storedSiteId?.SiteID || storedSiteId;

        if (normalizedStoredId && Array.isArray(siteList)) {
            const matchedSite = siteList.find(site => {
                const candidateId = site?.Siteid || site?.SiteId || site?.SiteID || site?.id;
                return candidateId != null && candidateId.toString() === normalizedStoredId.toString();
            });
            if (matchedSite) {
                return matchedSite;
            }
        }

        return Array.isArray(siteList) && siteList.length ? siteList[0] : null;
    };
    useEffect(() => {
        (async () => {
            try {
                const [storedGlobalUrl, storedDeviceStatus] = await Promise.all([
                    localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL),
                    localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_DEVICE_STATUS),
                ]);
                if (storedGlobalUrl) {
                    setGlobalURL(prev => ({ ...prev, serverUrl: storedGlobalUrl }));
                }
                if (storedDeviceStatus) {
                    setGlobalDeviceDetails(prev => ({ ...prev, deviceDetails: storedDeviceStatus }));
                }
            } catch (err) {
                console.log('Failed to pre-load global URLs/device details', err);
            }
        })();
    }, []);

    // const handleLogout = async () => {
    //     setProfile(DEFAULT_VALUE);
    //     await localStorage.clearAll();
    // };

    //Problem solver
    const handleLogout = async () => {
        await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.Token);
        await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.UserId);
        await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.UserFullName);
        setProfile(DEFAULT_VALUE);
    };

    const handleLogin = async data => {
        setProfile({
            ...profile,
            ...data,
        });
    };

    const handleLanguage = async () => {
        const language = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SELECTED_LANGUAGE)) || Languages.ENGLISH;
        strings.setLanguage(language);
        setAppSettings({
            ...appSettings,
            language,
        });
    };

    const handleAppSetting = (key, value) => {
        if (key === 'timeSettings') {
            setTimeSettings(value);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.TIME_SETTINGS, value);
            return;
        }
        if (typeof value === 'string') {
            setAppSettings({
                ...appSettings,
                [key]: value,
            });
        } else {
            setAppSettings({
                ...appSettings,
                ...value,
            });
        }
    };

    const handleGlobalURL = useCallback((key, value) => {
        setGlobalURL(prev => {
            if (prev?.[key] === value) return prev;
            console.log('🚀 ~ file: app-context.js:93 ~ handleGlobalURL ~ handleGlobalURL', key, value);
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    const handleGlobalLogin = async (data) => {
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.globalLogin, data);
        setGlobalLoginData({
            ...globalLoginData,
            loginData: data?.Data,
            token: data?.Token,
            userName: data?.Data[0]?.FullName,
            userId: data?.Data[0]?.UserId.toString(),
        });
        const userDetailsPS = {
            userId: data?.Data[0]?.UserId.toString(),
            accessToken: data?.Token,
            userFullName: data?.Data[0]?.FullName,
            userData: data?.Data,
        };
        const stringifiedUserDetails = JSON.stringify(userDetailsPS);
        AsyncStorage.setItem('userDetailsPS', stringifiedUserDetails);
        console.log('Set Async userDetailsPS ', stringifiedUserDetails)
    };

    const handleDeviceDetails = async deviceDetails => {
        console.log('🚀 ~ file: app-context.js ~ handleDeviceDetails ~ deviceDetails:', deviceDetails);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_DEVICE_STATUS, deviceDetails);
        setGlobalDeviceDetails({
            ...globalDeviceDetails,
            deviceDetails,
        })
    }

    const resetContextData = () => {
        setOrganization({
            selectedOrganization: null,
            organizationList: [],
        });
    };

    // const handleSite = async selectedSite => {
    //     console.log('🚀 ~ file: app-context.js:151 ~ handleSite ~ selectedSite:', selectedSite, selectedSite?.[0]);
    //     // await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, selectedSite);
    //     await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, selectedSite);
    //     console.log('🚀 ~ sites?.selectedSite ~ handleSite ~ selectedSite:',sites?.selectedSite, sites);
    //     !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, selectedSite?.[0]));
    //     setSites({
    //         ...sites,
    //         selectedSite: siteList?.[0] || null,
    //     });
    // };

    // const handleSiteList = async siteList => {
    //     console.log('🚀 ~ file: app-context.js:162 ~ handleSite ~ siteList:', siteList);
    //     await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SITES, siteList);
    //     !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, siteList?.[0]));
    //     // !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, siteList?.[0]));
    //     setSites({
    //         ...sites,
    //         selectedSite: siteList?.[0] || null,
    //         siteList,
    //     });
    // };

    const handleSite = async selectedSite => {
        const normalizedSelectedSite = Array.isArray(selectedSite) ? selectedSite?.[0] : selectedSite;

        if (!normalizedSelectedSite) {
            await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SiteId);
            await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SiteDetails);
            setSites({
                ...sites,
                selectedSite: null,
            });
            return;
        }

        console.log('🚀 ~ file: app-context.js:--80 ~ handleSite1111 ~ selectedSite:', normalizedSelectedSite, '--', normalizedSelectedSite?.Siteid, '--', normalizedSelectedSite?.length);
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, normalizedSelectedSite);
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, normalizedSelectedSite);
        setSites({
            ...sites,
            selectedSite: normalizedSelectedSite,
        });
    };

    const clearSite = async () => {
        console.log('🧹 Clearing selected site');
        await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SiteId);
        await localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SiteDetails); // or storeData(null)
        setSites({
            ...sites,
            selectedSite: null, // or {} or ''
        });
    };

    // const handleSiteList = async siteList => {
    //     console.log('🚀 ~ file: app-context.js:193 ~ handleSiteList ~ siteList:', siteList);
    //     await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SITES, siteList);
    //     !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, siteList?.[0]));
    //     setSites({
    //         ...sites,
    //         selectedSite: siteList?.[0] || null,
    //         siteList,
    //     });
    // };
       const handleSiteList = async (siteList, selectedSite) => {
        const resolvedSite = resolveSelectedSite(
            siteList,
            typeof selectedSite === 'object' && !Array.isArray(selectedSite) ? selectedSite : sites?.selectedSite,
            selectedSite,
        );

        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SITES, siteList);

        if (resolvedSite) {
            await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, resolvedSite);
            await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, resolvedSite);
        }

        setSites({
            ...sites,
            selectedSite: resolvedSite,
            siteList,
        });
    };

    const handleOrganization = selectedOrganization =>
        setOrganization({
            ...organization,
            selectedOrganization,
        });
    
    const handleAddRecentActivities = recentActivities => {
        console.log('🚀 ~ file: app-context.js:213 ~ handleAddRecentActivities ~ recentActivities:', recentActivities);
        setRecentActivities([...recentActivities]);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES, [...recentActivities]);
    };

    const handleRemoveActivity = () => {
        setRecentActivities([]);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES, []);
    };

    const handleRecentActivity = (concern, deleteConcern = false) => {
        if (deleteConcern) {
            const filteredRecentActivities = recentActivities?.filter(x => x.ConcernID !== concern?.ConcernID);
            handleAddRecentActivities(filteredRecentActivities);
        } else {
            const index = recentActivities.findIndex(x => x.ConcernID === concern?.ConcernID);
            if (index === -1) {
                recentActivities.push({ ...concern, lastOpened: moment() });
                handleAddRecentActivities(recentActivities);
            } else {
                // If the concern is already added, update its lastOpened timestamp
                recentActivities[index].lastOpened = moment();
                handleAddRecentActivities(recentActivities);
            }
        }
    };

    const getLocalStorageData = async () => {
        const SiteList = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SITES);
        const Token = await localStorage.getData(LOCAL_STORAGE_VARIABLES.Token);
        const UserId = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserId);
        const SiteId = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SiteId);
        const SiteDetails = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SiteDetails);
        const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
        const UserEmail = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserEmail);
        const CurrentApp = await localStorage.getData('CurrentApp')
        let serverUrl = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SERVER_URL)) || '';
        let deviceStatusSettings = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.DEVICE_STATUS_SETTINGS)) || '';
        let timeSettings = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.TIME_SETTINGS)) || DATE_FORMAT.DD_MM_YYYY;
        Token &&
            setProfile({
                ...profile,
                Token,
                UserId,
                // SiteDetails,
                SiteId,
                UserFullName,
                UserEmail,
                loading: false,
                CurrentApp,
            });
        setAppSettings({
            ...appSettings,
            serverUrl,
            //problem solver
            deviceStatusSettings,
        });
        setTimeSettings(timeSettings);
        const resolvedSite = resolveSelectedSite(SiteList, SiteDetails, SiteId);
        await handleSiteList(SiteList, resolvedSite);
    };

    const getRecentActivity = async () => {
        let recentActivities = await localStorage.getData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES);
        recentActivities = recentActivities || [];

        // Sort the recentActivities array by lastOpened in descending order
        recentActivities.sort((a, b) => {
            return moment(b.lastOpened).diff(moment(a.lastOpened));
        });

        setRecentActivities(recentActivities);
    };

    useEffect(() => {
        getLocalStorageData();
        getRecentActivity();
    }, []);

    useEffect(() => {
        handleLanguage();
    }, []);

    useEffect(() => {
        if (sites?.selectedSite) {
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, sites.selectedSite);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, sites.selectedSite);
        }
    }, [sites?.selectedSite]);

    return (
        <AppContext.Provider
            value={{
                organization,
                profile,
                sites,
                recentActivities,
                appSettings,
                timeSettings,
                globalURL,
                globalLoginData,
                globalDeviceDetails,
                handleLogin,
                handleLogout,
                handleOrganization,
                handleSite,
                clearSite,
                resetContextData,
                handleAppSetting,
                handleSiteList,
                handleRecentActivity,
                handleRemoveActivity,
                handleGlobalURL,
                handleGlobalLogin,
                handleDeviceDetails,
            }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };
