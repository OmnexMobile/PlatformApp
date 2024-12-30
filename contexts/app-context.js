import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import localStorage from '../global/localStorage';
import { API_URL, COMPANY_DETAILS, Languages, LOCAL_STORAGE_VARIABLES } from '../constants/app-constant';
import strings from '../config/localization';
import AsyncStorage from '@react-native-community/async-storage';

// Creating the context object and passing the default values.
const AppContext = React.createContext({});

const DEFAULT_VALUE = {
    Token: '',
    UserId: '',
    SiteId: '',
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
        // deviceStatusSettings: null,
    });
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
        console.log('🚀 ~ file: app-context.js:62 ~ handleAppSetting ~ handleAppSetting', key, value);
        setAppSettings({
            ...appSettings,
            [key]: value,
        });
        // problem solver
        // if (typeof value === 'string') {
        //     setAppSettings({
        //         ...appSettings,
        //         [key]: value,
        //     });
        // } else {
        //     setAppSettings({
        //         ...appSettings,
        //         ...value
        //     });
        // }
    };

    const handleGlobalURL = (key, value) => {
        console.log('🚀 ~ file: app-context.js:93 ~ handleGlobalURL ~ handleGlobalURL', key, value);
        setGlobalURL({
            ...globalURL,
            [key]: value,
        });
    };

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

    const handleSite = async selectedSite => {
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, selectedSite);
        setSites({
            ...sites,
            selectedSite,
        });
    };

    const handleSiteList = async siteList => {
        console.log('handleSiteList---->siteList', siteList)
        console.log('handleSiteList---->sites?.selectedSite', sites?.selectedSite, '---', siteList?.[0])
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SITES, siteList);
        !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteId, siteList?.[0]));
        setSites({
            ...sites,
            selectedSite: siteList?.[0] || null,
            siteList,
        });
    };

    const handleOrganization = selectedOrganization =>
        setOrganization({
            ...organization,
            selectedOrganization,
        });
    
    //problem solver
    // const handleAddRecentActivities = recentActivities => {
    //     setRecentActivities([...recentActivities]);
    //     localStorage.storeData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES, [...recentActivities]);
    // };

    // const handleRecentActivity = (concern, deleteConcern = false) => {
    //     if (deleteConcern) {
    //         const filteredRecentActivities = recentActivities?.filter(x => x.ConcernID !== concern?.ConcernID);
    //         handleAddRecentActivities(filteredRecentActivities);
    //     } else {
    //         const index = recentActivities.findIndex(x => x.ConcernID === concern?.ConcernID);
    //         if (index === -1) {
    //             recentActivities.push({ ...concern, lastOpened: moment() });
    //             handleAddRecentActivities(recentActivities);
    //         }
    //     }
    // };

    const handleRecentActivity = concern => {
        const index = recentActivities.findIndex(x => x.ConcernID === concern?.ConcernID);
        if (index === -1) {
            recentActivities.push({ ...concern, lastOpened: moment() });
            setRecentActivities([...recentActivities]);
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES, [...recentActivities]);
        }
    };

    const getLocalStorageData = async () => {
        const SiteList = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SITES);
        const Token = await localStorage.getData(LOCAL_STORAGE_VARIABLES.Token);
        const UserId = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserId);
        const SiteId = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SiteId);
        const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
        const UserEmail = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserEmail);
        const CurrentApp = await localStorage.getData('CurrentApp')
        let serverUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SERVER_URL) || "";
        // if(!serverUrl) {
        //     await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SERVER_URL, API_URL);
        //     serverUrl = API_URL
        // }

        //prblem solver
        // let deviceStatusSettings = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.DEVICE_STATUS_SETTINGS)) || ''
        Token &&
            setProfile({
                ...profile,
                Token,
                UserId,
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
            // deviceStatusSettings
        });
        handleSiteList(SiteList);
        SiteId && handleSite(SiteId);
    };

    const getRecentActivity = async () => {
        const recentActivities = await localStorage.getData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES);
        setRecentActivities(recentActivities || []);
    };

    useEffect(() => {
        getLocalStorageData();
        getRecentActivity();
    }, []);

    useEffect(() => {
        handleLanguage();
    }, []);

    return (
        <AppContext.Provider
            value={{
                organization,
                profile,
                sites,
                recentActivities,
                appSettings,
                globalURL,
                globalLoginData,
                globalDeviceDetails,
                handleLogin,
                handleLogout,
                handleOrganization,
                handleSite,
                resetContextData,
                handleAppSetting,
                handleSiteList,
                handleRecentActivity,
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
