import React, { Component } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, LogBox } from 'react-native';
//styles
import styles from '../styles/AuditDashboardListingStyle';
//components
import OfflineNotice from '../components/OfflineNotice';
import AuditCard from '../components/AuditCard';
import { Content, Header, ListSearch, NoRecordFound } from 'components';
import GlobalHeader from 'components/GlobalHeader';
//library
import * as _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
// import {DoubleBounce} from 'react-native-loader';
import { connect } from 'react-redux';
//assets
import { Fonts, Images } from '../../auditPro/Themes';
//services
import auth from '../../../services/Auditpro-Auth';
//strings
import { strings } from '../../auditPro/language/Language';
//const
import constant from '../../auditPro/constants/AppConstants';
// import { NavigationEvents } from 'react-navigation';
import CryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from 'constants/theme-constants';
import DeviceInfo from 'react-native-device-info';
import { ROUTES } from 'constants/app-constant';
import ToastNew, { ErrorToast } from 'react-native-toast-message';
import { AUDITPRO_URL } from 'screens/globalConstant/globalURL';
// import firebase from 'react-native-firebase';
var RNFS = require('react-native-fs');

const { whitneyBook_18 } = Fonts.style;
const { blackGrey } = Fonts.colors;

const toastConfig = {
    error: props => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 12,
                // color: 'white',
                // textAlign: 'center',
            }}
            // style={{
            //   backgroundColor: '#313131',
            //   borderLeftWidth: 0,
            //   height: 40,
            //   borderRadius: 10,
            // }}
        />
    ),
};

class AuditDashboardListing extends Component {
    constructor(props) {
        super(props);
        console.log('get props---->', props);
        this.pageSize = 10;
        this.pageNo = 1;
        this.onEndReachedCalledDuringMomentum = false;
        // this.filterId = this.props.navigation.getParam('filterId');
        this.filterId = this.props?.route?.params?.status ?? this.props?.route?.params?.filterId;
        this.state = {
            listEndReached: false,
            loader: true,
            error: false,
            subLoader: false,
            auditList: [],
            auditListAll: [],
            userFullName: '',
            userId: '',
            siteId: '',
            accessToken: '',
            fcmToken: '',
            deviceId: '',
            currentAuditList: [],
            currentLoginDetails: null,
            projectData: null,
            currentUserData: null,
            token: '',
            userId: '',
            siteId: '',
            AuditSearch: '',
            SortBy: '',
            SortOrder: '',
            loading: true,
            noaudits: 0,
            showMyAllAudits: false,
            notifybadge: [],
            ShowNotifyBadge: 0,
            filterId: this.props?.route?.params?.status ?? this.props?.route?.params?.filterId ?? '',
            scheduled: '',
            completed: '',
            deadlineviolated: '',
            deadlineviolatedandcompleted: '',
            isMounted: false,
            isPageEmpty: false,
            isRefreshing: false,
            isLazyLoading: false,
            isLazyLoadingRequired: true,
            default: 0, //todays activity
            searchKey: '',
            startDateFilter: '',
            endDateFilter: '',
        };
    }

    componentDidMount() {
        this.props.storeServerUrl(AUDITPRO_URL);
        LogBox.ignoreLogs(['componentWillReceiveProps has been renamed']);
        if (this.props.data.audits.language === 'Chinese') {
            this.setState({ ChineseScript: true }, () => {
                strings.setLanguage('zh');
                this.setState({});
            });
        } else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
            this.setState({ ChineseScript: false }, () => {
                strings.setLanguage('en-US');
                this.setState({});
            });
        }
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            console.log('AuditDashboardListing focused');
            // this.checkUser();
            await this.loginCall();
            await this.getAudits();

            await this.getAuditLists();
            await this.getAuditStatusDetails();
            await this.getAuditlist();
        });
    }

    componentWillUnmount() {
        this.focusListener();
    }

    async getAuditLists() {
        await this.getUserDetails();
        var pageNo = 1;
        var token = this.props?.data?.audits?.token || this.state.currentUserData?.accessToken;
        var userId = this.props?.data?.audits?.userId || this.state.currentUserData?.userId;
        var siteId = this.props?.data?.audits?.siteId || this.state.currentUserData?.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter = this.state.AuditSearch === undefined ? '' : this.state.AuditSearch;
        var StartDate = '';
        var EndDate = '';
        var SortBy = this.state.SortBy;
        var SortOrder = this.state.SortOrder;
        var SM = 1;
        console.log('reach here 001', token, userId, siteId, pageNo, pageSize, filterId, GlobalFilter, StartDate, EndDate, SortBy, SortOrder, 1, 1);
        NetInfo.fetch().then(netState => {
            this.setState({
                loading: true,
            });
            if (netState.isConnected) {
                auth.getauditlist(
                    token,
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
                    1,
                    1,
                    (response, data) => {
                        console.log('getauditlist count --->:' + data);
                        if (data.data) {
                            if (data.data.Message === 'Success') {
                                var data = data.data.Data[0].AuditCount;
                                console.log('Notification data', data);
                                this.setState({ noaudits: data, showMyAllAudits: true });
                                /** inital request will be skipped so we have data and we request the notifications */
                                this.getNotifications();
                            } else {
                                this.setState({ noaudits: 0, showMyAllAudits: true });
                            }
                        }
                    },
                );
            }
        });
    }

    getNotifications() {
        console.log('this.props.notifications', this.props?.notifications);
        const { token, userId } = this.props?.data?.audits;
        const siteId = this.props?.data?.audits?.siteId;
        const { noaudits } = this.state;
        const { auditCount, dynamicAuditCount } = this.props?.notifications;
        console.log('reach here 0011', auditCount, token, userId, siteId);
        /** First request skipped because we have initially zero */
        auth.getAuditNotification(auditCount, token, userId, siteId, (response, data) => {
            console.log('------------------------------');
            console.log('Audit notifications data', data);
            console.log('------------------------------');
            if (data?.data) {
                if (data?.data?.Message == 'Success') {
                    var auditList = [];
                    var auditListProps = this.props?.data?.audits?.audits;

                    for (var i = 0; i < data?.data?.Data?.length; i++) {
                        var auditInfo = data?.data?.Data[i];
                        auditInfo['color'] = '#1081de';
                        auditInfo['cStatus'] = constant.StatusScheduled;
                        auditInfo['key'] = this.keyVal + 1;

                        // Set Audit Status
                        if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus == '7' || auditInfo.CloseOutStatus === '9')) {
                            auditInfo['cStatus'] = constant.StatusCompleted;
                        } else if (auditInfo.AuditStatus == 3 && auditInfo.CloseOutStatus != '7' && auditInfo.CloseOutStatus != '9') {
                            auditInfo['cStatus'] = constant.Completed;
                        } else if (data?.data?.Data[i].AuditStatus == 2 && data?.data?.Data[i].PerformStarted == 0) {
                            auditInfo['cStatus'] = constant.StatusScheduled;
                        } else if (data?.data?.Data[i].AuditStatus == 2 && data?.data?.Data[i].PerformStarted == 1) {
                            auditInfo['cStatus'] = constant.StatusProcessing;
                        } else if (data?.data?.Data[i].AuditStatus == 4) {
                            auditInfo['cStatus'] = constant.StatusDV;
                        } else if (data?.data?.Data[i].AuditStatus == 5) {
                            auditInfo['cStatus'] = constant.StatusDVC;
                        }

                        for (var j = 0; j < auditListProps.length; j++) {
                            if (parseInt(auditListProps[j].ActualAuditId) == parseInt(data?.data?.Data[i].ActualAuditId)) {
                                // Update Audit Status
                                if (
                                    auditListProps[j].cStatus == constant.StatusDownloaded ||
                                    auditListProps[j].cStatus == constant.StatusNotSynced ||
                                    auditListProps[j].cStatus == constant.StatusSynced
                                ) {
                                    auditInfo['cStatus'] = auditListProps[j].cStatus;
                                }
                                break;
                            }
                        }

                        // Set Audit Card color by checking its Status
                        switch (auditInfo['cStatus']) {
                            case constant.StatusScheduled:
                                auditInfo['color'] = '#1081de';
                                break;
                            case constant.StatusDownloaded:
                                auditInfo['color'] = '#cd8cff';
                                break;
                            case constant.StatusNotSynced:
                                auditInfo['color'] = '#2ec3c7';
                                break;
                            case constant.StatusProcessing:
                                auditInfo['color'] = '#e88316';
                                break;
                            case constant.StatusSynced:
                                auditInfo['color'] = '#48bcf7';
                                break;
                            case constant.Completed:
                                auditInfo['color'] = 'green';
                                break;
                            case constant.StatusCompleted:
                                auditInfo['color'] = '#000';
                                break;
                            case constant.StatusDV:
                                auditInfo['color'] = 'red';
                                break;
                            case constant.StatusDVC:
                                auditInfo['color'] = 'green';
                                break;
                            default:
                                auditInfo['color'] = '#1081de';
                                break;
                        }

                        auditList.push(auditInfo);
                        this.keyVal = this.keyVal + 1;
                    }

                    let bufferList = Array.from(new Set(auditList));

                    if (dynamicAuditCount == noaudits) {
                        console.log('no new notification');
                        this.setState({ ShowNotifyBadge: 0 });
                    } else {
                        let badge = noaudits - dynamicAuditCount;
                        console.log('badge', badge);
                        this.setState({ ShowNotifyBadge: badge });
                    }
                    this.setState({ notifybadge: bufferList });
                } else {
                    this.setState({ ShowNotifyBadge: 0, notifybadge: [] });
                }
            } else {
                this.setState({ ShowNotifyBadge: 0, notifybadge: [] });
            }
        });
    }

    async getAuditStatusDetails() {
        await this.getUserDetails();
        this.setState({
            loading: true,
        });
        console.log(
            'getAuditStatusDetails--->',
            this.state.token,
            this.state.currentUserData?.userId,
            this.state.currentUserData?.siteId,
            this.props.data.audits,
        );
        auth.getStat(
            this.props?.data?.audits?.token || this.state.currentUserData?.accessToken,
            this.props?.data?.audits?.userId || this.state.currentUserData?.userId,
            this.props?.data?.audits?.siteId || this.state.currentUserData?.siteId,
            1,
            (response, data) => {
                if (data.data) {
                    this.props.storeAuditStats(
                        data?.data?.Data?.Scheduled,
                        data?.data?.Data?.Completed,
                        data?.data?.Data?.DeadlineViolated,
                        data?.data?.Data?.CompletedDeadlineViolated,
                    );
                    this.setState(
                        {
                            scheduled: data?.data?.Data?.Scheduled,
                            completed: data?.data?.Data?.Completed,
                            deadlineviolated: data?.data?.Data?.DeadlineViolated,
                            deadlineviolatedandcompleted: data?.data?.Data?.CompletedDeadlineViolated,
                            isInitialLoad: false,
                            isLoading: false,
                            loading: false,
                        },
                        () => {
                            this.isInitialLoad = false;
                        },
                    );
                } else {
                    this.props.storeAuditStats(0, 0, 0, 0);
                    this.setState(
                        {
                            scheduled: 0,
                            completed: 0,
                            deadlineviolated: 0,
                            deadlineviolatedandcompleted: 0,
                            isInitialLoad: false,
                            isLoading: false,
                            loading: false,
                        },
                        () => {
                            // console.log('this.state.completed',this.state.completed)
                            // console.log('this.state.inprogress',this.state.inprogress)
                            // console.log('this.state.scheduled',this.state.scheduled)
                            this.isInitialLoad = false;
                        },
                    );
                }
            },
        );
    }

    getAuditlist = (startDate, endDate) => {
        this.setState({
            loading: true,
            startDateFilter: startDate || '',
            endDateFilter: endDate || '',
        });
        if (this.props?.data?.audits?.isOfflineMode) {
            // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
            this.setState(
                {
                    auditList: this.props?.data?.audits?.audits,
                    auditListAll: this.props?.data?.audits?.audits,
                    loading: false,
                    isRefreshing: false,
                    isLazyLoading: false,
                    isLazyLoadingRequired: false,
                    isPageEmpty: false,
                    isMounted: true,
                },
                () => {
                    this.applyAuditFilter();
                },
            );
        }
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                console.log('getAuditlist ------>');
                var pageNo = 1;
                var token = this.props?.data?.audits?.token || this.state.currentUserData?.accessToken;
                var userId = this.props?.data?.audits?.userId || this.state.currentUserData?.userId;
                var siteId = this.props?.data?.audits?.siteId || this.state.currentUserData?.siteId;
                var filterId = this.state.filterId;
                var pageSize = 10;
                var GlobalFilter = this.state.AuditSearch === undefined ? '' : this.state.AuditSearch;
                var StartDate = startDate == undefined ? '' : startDate;
                var EndDate = endDate == undefined ? '' : endDate;
                var SortBy = this.state.SortBy;
                var SortOrder = this.state.SortOrder;
                var SM = 1;
                var Default = this.state.default;

                auth.getauditlist(
                    token,
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
                    1,
                    Default,
                    (response, data) => {
                        console.log('AuditList todaysactivity data', data);
                        if (data.data) {
                            if (data.data.Message === 'Success') {
                                var auditList = [];
                                var auditListProps = this.props?.data?.audits?.audits;
                                console.log(this.props?.data?.audits?.audits, '=========Au=========');
                                for (var i = 0; i < data?.data?.Data?.length; i++) {
                                    var auditInfo = data?.data?.Data[i];
                                    auditInfo['color'] = '#1081de';
                                    auditInfo['cStatus'] = constant.StatusScheduled;
                                    auditInfo['key'] = this.keyVal + 1;

                                    // Set Audit Status
                                    if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === '7' || auditInfo.CloseOutStatus === '9')) {
                                        auditInfo['cStatus'] = constant.StatusCompleted;
                                    } else if (
                                        data.data.Data[i].AuditStatus == 3 &&
                                        auditInfo.CloseOutStatus != '7' &&
                                        auditInfo.CloseOutStatus != '9'
                                    ) {
                                        auditInfo['cStatus'] = constant.Completed;
                                    } else if (data?.data?.Data[i].AuditStatus == 2 && data?.data?.Data[i].PerformStarted == 0) {
                                        auditInfo['cStatus'] = constant.StatusScheduled;
                                    } else if (data?.data?.Data[i].AuditStatus == 2 && data?.data?.Data[i].PerformStarted == 1) {
                                        auditInfo['cStatus'] = constant.StatusProcessing;
                                    } else if (data?.data?.Data[i].AuditStatus == 4) {
                                        auditInfo['cStatus'] = constant.StatusDV;
                                    } else if (data?.data?.Data[i].AuditStatus == 5) {
                                        auditInfo['cStatus'] = constant.StatusDVC;
                                    }

                                    for (var j = 0; j < auditListProps.length; j++) {
                                        console.log('auditListProps', auditListProps);
                                        if (parseInt(auditListProps[j].ActualAuditId) == parseInt(data?.data?.Data[i].ActualAuditId)) {
                                            // Update Audit Status
                                            if (
                                                auditListProps[j].cStatus == constant.StatusDownloaded ||
                                                auditListProps[j].cStatus == constant.StatusNotSynced ||
                                                auditListProps[j].cStatus == constant.StatusSynced
                                            ) {
                                                auditInfo['cStatus'] = auditListProps[j].cStatus;
                                            }
                                            break;
                                        }
                                    }

                                    // Set Audit Card color by checking its Status
                                    switch (auditInfo['cStatus']) {
                                        case constant.StatusScheduled:
                                            auditInfo['color'] = '#1081de';
                                            break;
                                        case constant.StatusDownloaded:
                                            auditInfo['color'] = '#cd8cff';
                                            break;
                                        case constant.StatusNotSynced:
                                            auditInfo['color'] = '#2ec3c7';
                                            break;
                                        case constant.StatusProcessing:
                                            auditInfo['color'] = '#e88316';
                                            break;
                                        case constant.StatusSynced:
                                            auditInfo['color'] = '#48bcf7';
                                            break;
                                        case constant.Completed:
                                            auditInfo['color'] = 'green';
                                            break;
                                        case constant.StatusCompleted:
                                            auditInfo['color'] = '#000';
                                            break;
                                        case constant.StatusDV:
                                            auditInfo['color'] = 'red';
                                            break;
                                        case constant.StatusDVC:
                                            auditInfo['color'] = 'green';
                                            break;
                                        default:
                                            auditInfo['color'] = '#1081de';
                                            break;
                                    }

                                    auditList.push(auditInfo);
                                    this.keyVal = this.keyVal + 1;
                                }

                                this.setState({ todaysactivity: auditList, todayLoading: false });
                            } else {
                                this.setState({ todaysactivity: [], todayLoading: false });
                            }
                        } else {
                            this.setState({ todaysactivity: [], todayLoading: false });
                        }
                    },
                );
            } else {
                this.setState({ todaysactivity: [], todayLoading: false });
            }
        });
    };

    checkUser = async () => {
        await this.getUserDetails();
        const { userId, token } = this.props?.data?.audits;
        console.log('user audits', this.props?.data?.audits);
        console.log('user id', this.props?.data?.audits?.userId);
        var currentToken = this.state.currentUserData?.accessToken || token;
        var userid = this.state.currentUserData?.userId || userId;

        var UserStatus = '';
        var serverUrl = this.props.data.audits.serverUrl;
        var ID = this.state.currentUserData?.userId || userId;
        var type = 3;
        var path = '';
        //  var RegisterDevice = this.props.data.audits.deviceid;
        const RegisterDevice = await AsyncStorage.getItem('loginDeviceId');
        console.log('data auth.getCheckUser', userid, currentToken, RegisterDevice);

        auth.getCheckUser(userid, RegisterDevice, currentToken, (res, data) => {
            console.log('User information', data);

            if (data.data.Message == 'Success') {
                console.log('Checking User status', data.data.Data.ActiveStatus);
                UserStatus = data.data.Data.ActiveStatus;
                if (this.props.data.audits.isOfflineMode) {
                    this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
                } else {
                    NetInfo.fetch().then(netState => {
                        if (netState.isConnected) {
                        } else {
                            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
                        }
                    });
                }

                if (UserStatus == 2) {
                    console.log('User active');
                    // this.syncAuditsToServerMethod()
                    this.checkFilePath();
                } else if (UserStatus == 1) {
                    console.log('deleting user details');

                    var cleanURL = serverUrl.replace(/^https?:\/\//, '');
                    var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                    this.propsServerUrl = formatURL;

                    console.log('cleanURL', this.propsServerUrl);
                    // var ID = this.props.data.audits.userId
                    console.log('path', this.propsServerUrl + ID);

                    if (Platform.OS == 'android') {
                        path = '/data/user/0/com.omnex.auditpro/cache/AuditUser' + '/' + this.propsServerUrl + ID;
                        console.log('path storing-->', path);
                    } else {
                        var iOSpath = RNFS.DocumentDirectoryPath;
                        path = iOSpath + '/' + this.propsServerUrl + ID;
                    }
                    console.log('*** path', path);
                    // this.deleteUserFile(path)
                    this.refs.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT);
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                } else if (UserStatus == 0) {
                    Alert.alert('Your session has expired,Please login again.');

                    this.refs.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT);
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                }
            }
        });
    };

    async getDeviceId() {
        let deviceId = await AsyncStorage.getItem('deviceid');
        this.setState({
            deviceId,
        });
        console.log('tret1 getDeviceId get--', deviceId);
        return deviceId;
    }

    async getLoginDetails() {
        try {
            const stringifiedLoginDetails = await AsyncStorage.getItem('loginDetails');
            const value = JSON.parse(stringifiedLoginDetails);
            console.log('current loginDetails--->', value);
            if (value !== null) {
                this.setState({ currentLoginDetails: value }, () => {
                    console.log('Token set');
                });
            }
        } catch (e) {
            // error reading value
            console.log('error--->', e);
        }
    }

    async getUserDetails() {
        try {
            const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
            const value = JSON.parse(stringifiedUserDetails);
            console.log('current userDetails--->', value);
            if (value !== null) {
                this.setState({ currentUserData: value }, () => {
                    console.log('Token set');
                });
            }
        } catch (e) {
            // error reading value
            console.log('error--->', e);
        }
    }


    storeData = async (key, value) => {
        console.log('checking assync details----------', key, value);
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error storing data:', error);
        }
    };

    loginCall = async () => {
        await this.getUserDetails();
        console.log('currentUserData---get', this.state.currentUserData);
        await this.getDeviceId();
        console.log('deviceId--->', this.state.deviceId);
        const loginDetails = this.state.currentUserData;
        if (loginDetails?.success == true) {
            console.log('data value checking' + loginDetails?.data);
            this.props.storeLoginData(loginDetails?.data);
            this.props.storeSupplierManagement(loginDetails?.data[0]?.SupplierManagementAccess);
            console.log('tret1 data.data', loginDetails?.data);
            console.log('default---siteId', this.props?.data?.audits?.siteId?.length, this.props?.data?.audits?.siteId, loginDetails?.data[0].Siteid);

            this.props.storeUserName(loginDetails?.data[0]?.FullName);
            // this.checkUsers(data.data.Data[0].UserId.toString(), data.data.Token)
            this.storeData('loginDeviceId', this.state.deviceId);
            this.storeData('loginFcmToken', this.state.fcmToken);
            this.storeData('loginEmail', loginDetails?.data[0]?.FullName);
            this.setState(
                {
                    userId: loginDetails?.data[0]?.UserId.toString(),
                    siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : loginDetails?.data[0]?.Siteid,
                    // siteId: data.data.Data[397].Siteid,
                    // siteId: data.data.Data[0].Siteid,
                    accessToken: loginDetails?.accessToken,
                    userFullName: loginDetails?.data[0]?.FullName,
                },
                () => {
                    this.getProfileCall(this.state.accessToken);
                    this.checkUser();
                    // this.checkUsers(this.state.userId, this.state.accessToken);
                    this.getAudits();
                    console.log('tret1 reached login data stored');
                },
            );
           
        } else {
            console.log(loginDetails?.message, 'tret1 //////loginmessage////////');
        }
    };


    getProfileCall(token) {
        var Token = token;
        console.log('Profile getting details...', Token);
        //alert('profile called --login')
        auth.getProfile(Token, (res, data) => {
            console.log('--->', data);
            if (data?.data) {
                if (data?.data?.Message === 'Success') {
                    console.log('getting into if', data);
                    // alert('Profile data get --login')
                    this.setState(
                        {
                            Address: data?.data?.Data?.Address,
                            CompanyName: data?.data?.Data?.CompanyName,
                            CompanyUrl: data?.data?.Data?.CompanyUrl,
                            Logo: data?.data?.Data?.Logo,
                            Phone: data?.data?.Data?.Phone,
                        },
                        () => {
                          
                            this._storeToken();
                        },
                    );
                } else {
                  
                }
            } else {
                this.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
            }
        });
    }

    _storeToken = () => {
        console.log('*********', '_storeToken', this.props);
        try {
            // Store audit list in redux store to set it in persistant storage
            this.props.storeSiteId(this.props?.data?.audits?.siteId);
            this.props.storeUserSession(
                this.state.userFullName,
                this.state.userId,
                this.state.accessToken,
                this.state.siteId,
                this.state.Address,
                this.state.CompanyName,
                this.state.CompanyUrl,
                this.state.Logo,
                this.state.Phone,
            );
            this.storelogindetails(
                this.state.userFullName,
                this.state.userId,
                this.state.accessToken,
                this.state.siteId,
                this.state.Address,
                this.state.CompanyName,
                this.state.CompanyUrl,
                this.state.Logo,
                this.state.Phone,
            );
            this.props.storeLoginSession(true);
            this.setState(
                {
                    progressVisible: false,
                },
                () => {
                  
                    console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                    if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                        this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE);
                    } else {
                        // this.props.navigation.navigate('AllTabAuditList');
                    }
                },
            );
        } catch (error) {
            // Error saving data
            // console.log('Failed to create a login session!!!')
        }
    };


    refillStoreValues(UserId) {
        // var propsServerUrl = 'https://omn-qa-forvia.ewqims.com/auditproapi/api/';
        var propsServerUrl = AUDITPRO_URL; // Global Server AP/SM
        // var propsServerUrl = 'https://saasmobile.ewqims.net/AuditproApi/api/';
        var cleanURL = propsServerUrl?.replace(/^https?:\/\//, '');

        var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        this.propsServerUrl = formatURL;
        console.log('tret4 cleanURL', this.propsServerUrl);
        if (Platform.OS == 'android') {
            var path =
                '/storage/emulated/0/Android/data/com.reactnativeboilerplatev70/cache/AuditUser' + '/' + this.propsServerUrl + UserId;
            console.log('tret4 path-->', path);
            console.log('tret4 path1-->', RNFS.ExternalCachesDirectoryPath);
            RNFS.readFile(path)
                .then(res => {
                    console.log('tret4 reading from the User file', JSON.parse(res));
                    var LoggedUserDetails = JSON.parse(res);
                    console.log(LoggedUserDetails[0]?.audits?.userName + 'tret4 user name');
                })
                .catch(err => {
                    console.log('tret4 refillStoreValues error', err);
                });
        }
    }

    render() {
        console.log('this.props', this.props);
        console.log('this.props?.route?.params?.category', this.props?.route?.params?.category);
        console.log('projectData---async', this.state.projectData);
        const scheduledCount = Number(this.state.scheduled ?? this.props?.routes?.params?.countValue ?? 0) || 0;
        const completedCount = Number(this.state.completed ?? this.props?.routes?.params?.countValue ?? 0) || 0;
        const deadlineViolatedCount = Number(this.state.deadlineviolated ?? this.props?.routes?.params?.countValue ?? 0) || 0;
        const closedOutCount = Number(this.state.deadlineviolatedandcompleted ?? this.props?.routes?.params?.countValue ?? 0) || 0;

        const statsSum = scheduledCount + completedCount + deadlineViolatedCount + closedOutCount;

        const totalAuditsCount = statsSum > 0 ? statsSum : this.state.auditListAll?.length || this.state.auditList?.length || 0;
        return (
            <View style={styles.wrapper}>
                {Platform.OS === 'ios' ? (
                    <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }} />
                ) : (
                    <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }} />
                )}
                <OfflineNotice />
                <GlobalHeader
                    title={
                        (this.props?.route?.params?.title || this.state.projectData?.auditTitle) 
                    }
                    onLeftPress={() => this.props.navigation.goBack()}
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: '#000' }}
                />
                <View style={styles.auditPageBody}>
                    {/* Search by Audit Number / Auditee / Date */}
                    <ListSearch
                        searchKey={this.state.searchKey}
                        setSearchKey={searchKey =>
                            this.setState({ searchKey, AuditSearch: searchKey }, () => {
                                this.applyAuditFilter();
                            })
                        }
                        placeholder="search by Audit no/Auditee"
                    />

                    {this.state.loader ? (
                        <View style={styles.loaderParent}>
                            <ActivityIndicator size={20} color={COLORS.primaryDarkThemeColor} />
                        </View>
                    ) : this.state.error ? (
                        <View style={styles.errorWrapper}>
                            <NoRecordFound />
                        </View>
                    ) : (
                        this.renderFlatList()
                    )}
                </View>
            </View>
        );
    }

    renderFlatList() {
        return (
            <>
                <FlatList
                    contentContainerStyle={[
                        styles.listPadding,
                        this.state.auditList.length === 0 && styles.emptyListContent,
                    ]}
                    data={this.state.auditList}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <AuditCard
                            dateFormat={this.props.data.audits.userDateFormat}
                            item={item}
                            index={index}
                            length={this.state.auditList.length + 1}
                            naviData={this.props.navigation}
                        />
                    )}
                    onEndReached={({ distanceFromEnd }) => {
                        /** we use this condition because will receive too many events after scroll end */
                        if (!this.onEndReachedCalledDuringMomentum) {
                            /** settng true user keep on dragging will elimintae unnecessary call */
                            this.onEndReachedCalledDuringMomentum = true;
                            this.setState({ subLoader: true });
                            this.getAudits();
                        }
                    }}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.5}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                    }}
                    ListEmptyComponent={<NoRecordFound />}
                    ListFooterComponent={this.listFooter.bind(this)}
                />
                <ToastNew config={toastConfig} />
            </>
        );
    }

    listFooter() {
        if (this.state.subLoader) {
            return (
                <View style={styles.subLoaderWrap}>
                    <ActivityIndicator size={16} color={COLORS.primaryDarkThemeColor} />
                </View>
            );
        } else {
            return null;
        }
    }

    async setAccessToken(accessToken) {
        if (accessToken) {
            await AsyncStorage.setItem('accessToken', accessToken);
        }
    }

    async getProjectDetails() {
        try {
            const stringifiedProjectDetails = await AsyncStorage.getItem('projectDetails');
            const value = JSON.parse(stringifiedProjectDetails);
            console.log('current projectDetails--->', value);
            if (value !== null) {
                // value previously stored
                this.setState({
                    projectData: value,
                    filterId: this.state.filterId || value?.projectStatus || '',
                });
            }
        } catch (e) {
            // error reading value
            console.log('projectDetails error--->', e);
        }
    }

    async getAudits() {
        console.log('trets getAudits', this.state.auditList, this.state.userFullName, this.state.userId, this.state.siteId, this.state.accessToken);
        console.log('current trets siteId--->', this.props.data.audits.siteId);
        this.setAccessToken(this.state.accessToken);
        await this.getProjectDetails();
        await this.getUserDetails();
        console.log('currentUserData---get', this.state.currentUserData);
        console.log('projectData---get', this.state.projectData);
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                const { userId, token } = this.props?.data?.audits;
                const siteId = this.props?.data?.audits?.siteId;

                var SM = 1;
                var GlobalFilter = '',
                    StartDate = '',
                    EndDate = '';
                var SortBy = '',
                    SortOrder = '',
                    Default = 1;
                const filterStatus =
                    Number(
                        this.props?.route?.params?.status ??
                            this.props?.route?.params?.filterId ??
                            this.state.projectData?.projectStatus ??
                            this.state.filterId,
                    ) || '';
                const filterStr =
                    filterStatus === 2 || filterStatus === 3 || filterStatus === 4 || filterStatus === 5 ? `AuditStatus IN (${filterStatus})` : '';
                if (filterStatus && this.state.filterId !== filterStatus) {
                    this.setState({ filterId: filterStatus });
                }

                console.log('trets data', token, userId, siteId, this.state.currentUserData);
                console.log(
                    'reach here 003',
                    this.state.currentUserData?.accessToken || token,
                    this.state.currentUserData?.userId || userId,
                    this.state.currentUserData?.siteId || siteId,
                    this.pageNo,
                    this.pageSize,
                    filterStr,
                    GlobalFilter,
                    StartDate,
                    EndDate,
                    SortBy,
                    SortOrder,
                    1,
                    Default,
                );
                auth.getauditlist(
                    // this.state.accessToken,
                    // this.state.userId,
                    // this.state.siteId,
                    this.state.currentUserData?.accessToken || token,
                    this.state.currentUserData?.userId || userId,
                    this.state.currentUserData?.siteId || siteId,
                    this.pageNo,
                    this.pageSize,
                    filterStr,
                    GlobalFilter,
                    StartDate,
                    EndDate,
                    SortBy,
                    SortOrder,
                    1,
                    Default,
                    (response, data) => {
                        console.log('trets get audit list', data, 'response', response);
                        if (data?.data) {
                            if (data?.data?.Message === 'Success') {
                                console.log('trets get audit Success', data?.data?.Message);
                                console.log('trets get audit Success', data?.data?.Data);
                                if (data?.data?.Data && data?.data?.Data?.length === 0) {
                                    if (this.state?.auditList?.length === 0) {
                                        console.log('trets this.state.auditList.length', this.state.auditList?.length);
                                        this.setState({
                                            loader: false,
                                            error: true,
                                            subLoader: false,
                                            listEndReached: false,
                                        });
                                    } else {
                                        console.log('trets this.state.auditList.length', this.state.auditList?.length);
                                        this.setState({
                                            loader: false,
                                            error: false,
                                            subLoader: false,
                                            listEndReached: false,
                                        });
                                    }
                                    this.onEndReachedCalledDuringMomentum = true;
                                } else {
                                    /** Validating api returns same amount of data */
                                    if (this.state.auditList?.length === data?.data?.Data?.length) {
                                        this.onEndReachedCalledDuringMomentum = true;
                                        this.setState({
                                            loader: false,
                                            error: false,
                                            subLoader: false,
                                            listEndReached: true,
                                        });
                                    } else {
                                        //we are incrementing the next request form data
                                        this.pageSize = this.pageSize + 10;
                                        /** We have succes api repsonse we need to populate in UI */
                                        this.transformAudits(data?.data?.Data);
                                        this.onEndReachedCalledDuringMomentum = false;
                                    }
                                }
                            } else {
                                /**
                                 * Failure response checking the list already having data
                                 * If list having data we just hide the loader
                                 * else there is no data for first request we have to show error
                                 */
                                if (this.state.auditList.length === 0) {
                                    this.setState({
                                        loader: false,
                                        error: true,
                                        subLoader: false,
                                        listEndReached: true,
                                    });
                                } else {
                                    /** Api error but we have data in the list */
                                    this.onEndReachedCalledDuringMomentum = false;
                                    this.setState({
                                        loader: false,
                                        error: false,
                                        subLoader: false,
                                        listEndReached: false,
                                    });
                                }
                            }
                        } else {
                            /**
                             * Failure response checking the list already having data
                             * If list having data we just hide the loader
                             * else there is no data for first request we have to show error
                             */
                            if (this.state.auditList.length === 0) {
                                this.setState({
                                    loader: false,
                                    error: true,
                                    subLoader: false,
                                    listEndReached: true,
                                });
                            } else {
                                /** Api error but we have data in the list */
                                this.onEndReachedCalledDuringMomentum = false;
                                this.setState({
                                    loader: false,
                                    error: false,
                                    subLoader: false,
                                    listEndReached: false,
                                });
                            }
                        }
                    },
                );
            } else {
                /** Users is offline */
                this.setState({
                    loader: false,
                    error: true,
                });
            }
        });
    }

    applyAuditFilter = () => {
        const { searchKey, auditListAll } = this.state;
        if (!auditListAll || auditListAll.length === 0) {
            return;
        }

        const query = (searchKey || '').toLowerCase().trim();

        if (!query) {
            this.setState({ auditList: auditListAll });
            return;
        }

        const filtered = auditListAll.filter(item => {
            const auditNumber = (item.AuditNumber || '').toString().toLowerCase();
            const auditee = (item.Auditee || '').toString().toLowerCase();
            const startDate = (item.StartDate || '').split('T')[0].toLowerCase();
            const endDate = (item.EndDate || '').split('T')[0].toLowerCase();

            return auditNumber.includes(query) || auditee.includes(query) || startDate.includes(query) || endDate.includes(query);
        });

        this.setState({ auditList: filtered });
    };

    transformAudits(audits) {
        var auditList = [];
        var auditListProps = this.props.data.audits.auditRecords;
        console.log('AuditListProps', auditListProps);

        for (var i = 0; i < audits.length; i++) {
            var auditInfo = audits[i];
            auditInfo['color'] = '#1081de';
            auditInfo['cStatus'] = constant.StatusScheduled;
            auditInfo['key'] = this.keyVal + 1;

            // Set Audit Status

            if (audits[i].AuditStatus == 3 && (audits[i].CloseOutStatus == '9' || audits[i].CloseOutStatus == '7')) {
                auditInfo['cStatus'] = constant.StatusCompleted;
            } else {
                if (audits[i].AuditStatus == 3 && audits[i].CloseOutStatus !== '9' && audits[i].CloseOutStatus !== '7') {
                    auditInfo['cStatus'] = constant.Completed;
                } else if (audits[i].AuditStatus == 2 && audits[i].PerformStarted == 0) {
                    auditInfo['cStatus'] = constant.StatusScheduled;
                } else if (audits[i].AuditStatus == 2 && audits[i].PerformStarted == 1) {
                    auditInfo['cStatus'] = constant.StatusProcessing;
                } else if (audits[i].AuditStatus == 4) {
                    auditInfo['cStatus'] = constant.StatusDV;
                } else if (audits[i].AuditStatus == 5) {
                    auditInfo['cStatus'] = constant.StatusDVC;
                }
            }
            for (var j = 0; j < auditListProps.length; j++) {
                if (parseInt(auditListProps[j].AuditId) == parseInt(audits[i].ActualAuditId)) {
                    // Update Audit Status
                    if (
                        auditListProps[j].AuditRecordStatus == constant.StatusDownloaded ||
                        auditListProps[j].AuditRecordStatus == constant.StatusNotSynced ||
                        auditListProps[j].AuditRecordStatus == constant.StatusSynced
                    ) {
                        auditInfo['cStatus'] = auditListProps[j].AuditRecordStatus;
                    }
                    break;
                }
            }

            // Set Audit Card color by checking its Status
            switch (auditInfo['cStatus']) {
                case constant.StatusScheduled:
                    auditInfo['color'] = '#1081de';
                    break;
                case constant.StatusDownloaded:
                    auditInfo['color'] = '#cd8cff';
                    break;
                case constant.StatusNotSynced:
                    auditInfo['color'] = '#2ec3c7';
                    break;
                case constant.StatusProcessing:
                    auditInfo['color'] = '#e88316';
                    break;
                case constant.StatusSynced:
                    auditInfo['color'] = '#48bcf7';
                    break;
                case constant.StatusCompleted:
                    auditInfo['color'] = '#000';
                    break;
                case constant.Completed:
                    auditInfo['color'] = 'green';
                    break;
                case constant.StatusDV:
                    auditInfo['color'] = 'red';
                    break;
                case constant.StatusDVC:
                    auditInfo['color'] = 'green';
                    break;
                default:
                    auditInfo['color'] = '#000';
                    break;
            }

            auditList.push(auditInfo);
            this.keyVal = this.keyVal + 1;
        }

        this.setState(
            {
                auditListAll: auditList,
                loader: false,
                error: false,
                subLoader: false,
                listEndReached: false,
            },
            () => {
                this.applyAuditFilter();
            },
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeUserSession: (userName, userId, token, siteId, address, companyname, companyurl, logo, phone) =>
            dispatch({
                type: 'STORE_USER_SESSION',
                userName,
                userId,
                token,
                siteId,
                address,
                companyname,
                companyurl,
                logo,
                phone,
            }),
        storeYearAudits: yearAudits => dispatch({ type: 'STORE_YEAR_AUDITS', yearAudits }),
        storeLoginSession: isActive => dispatch({ type: 'STORE_LOGIN_SESSION', isActive }),
        clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
        storeAuditRecords: auditRecords => dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
        storeCameraCapture: cameraCapture => dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
        storeAudits: audits => dispatch({ type: 'STORE_AUDITS', audits }),
        storeLanguage: language => dispatch({ type: 'STORE_LANGUAGE', language }),
        storeAuditStats: (scheduled, completed, DeadlineViolated, CompletedDeadlineViolated) =>
            dispatch({
                type: 'STORE_AUDIT_STATS',
                scheduled,
                completed,
                DeadlineViolated,
                CompletedDeadlineViolated,
            }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        storeServerUrl: serverUrl => dispatch({ type: 'STORE_SERVER_URL', serverUrl }),
        changeConnectionState: isConnected => dispatch({ type: 'CHANGE_CONNECTION_STATE', isConnected }),
        changeAuditState: isAuditing => dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
        storeDateFormat: userDateFormat => dispatch({ type: 'STORE_DATE_FORMAT', userDateFormat }),
        registrationState: isDeviceRegistered => dispatch({ type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered }),
        updateRecentAuditList: recentAudits => dispatch({ type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits }),
        storeUserName: loginuser => dispatch({ type: 'STORE_USER_NAME', loginuser }),
        storeLoginData: logindata => dispatch({ type: 'STORE_LOGIN_DATA', logindata }),

        storeSupplierManagement: suppliermanagementstatus => dispatch({ type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus }),
        updateAuditCount: auditCount => dispatch({ type: 'UPDATE_AUDIT_COUNT', auditCount }),
        updateDynamicAuditCount: data => dispatch({ type: 'UPDATE_DYNAMIC_AUDIT_COUNT', data }),
        storeSiteId: siteId => dispatch({ type: 'STORE_SITE_ID', siteId }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditDashboardListing);
