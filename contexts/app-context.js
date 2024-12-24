import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import localStorage from 'global/localStorage';
import { API_URL, COMPANY_DETAILS, Languages, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import strings from 'config/localization';

// Creating the context object and passing the default values.
const AppContext = React.createContext({});

const DEFAULT_VALUE = {
    Token: '',
    UserId: '',
    SiteDetails: '',
    UserFullName: '',
    UserEmail: '',
    Address: COMPANY_DETAILS.Address,
    CompanyName: COMPANY_DETAILS.CompanyName,
    CompanyUrl: COMPANY_DETAILS.CompanyUrl,
    Logo: COMPANY_DETAILS.Logo,
    Phone: COMPANY_DETAILS.Phone,
    loading: true,
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
        deviceStatusSettings: null,
    });
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

    const resetContextData = () => {
        setOrganization({
            selectedOrganization: null,
            organizationList: [],
        });
    };

    const handleSite = async selectedSite => {
        console.log('🚀 ~ file: app-context.js:79 ~ handleSite ~ selectedSite:', selectedSite);
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, selectedSite);
        setSites({
            ...sites,
            selectedSite,
        });
    };

    const handleSiteList = async siteList => {
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SITES, siteList);
        !sites?.selectedSite && (await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SiteDetails, siteList?.[0]));
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

    const handleAddRecentActivities = recentActivities => {
        setRecentActivities([...recentActivities]);
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.RECENT_ACTIVITIES, [...recentActivities]);
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
        const SiteDetails = await localStorage.getData(LOCAL_STORAGE_VARIABLES.SiteDetails);
        const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
        const UserEmail = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserEmail);
        let serverUrl = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SERVER_URL)) || '';
        let deviceStatusSettings = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.DEVICE_STATUS_SETTINGS)) || '';
        // console.log('🚀 ~ file: app-context.js:125 ~ getLocalStorageData ~ SiteDetails:', deviceStatusSettings);
        // if(!serverUrl) {
        //     await localStorage.storeData(LOCAL_STORAGE_VARIABLES.SERVER_URL, API_URL);
        //     serverUrl = API_URL
        // }
        Token &&
            setProfile({
                ...profile,
                Token,
                UserId,
                SiteDetails,
                UserFullName,
                UserEmail,
                loading: false,
            });
        setAppSettings({
            ...appSettings,
            serverUrl,
            deviceStatusSettings,
        });
        handleSiteList(SiteList);
        SiteDetails && handleSite(SiteDetails);
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

    return (
        <AppContext.Provider
            value={{
                organization,
                profile,
                sites,
                recentActivities,
                appSettings,
                handleLogin,
                handleLogout,
                handleOrganization,
                handleSite,
                resetContextData,
                handleAppSetting,
                handleSiteList,
                handleRecentActivity,
            }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };
