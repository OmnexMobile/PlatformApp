import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Button,
    ScrollView,
    Alert,
    BackHandler,
    Platform,
} from 'react-native';
import styles from '../../auditPro/styles/AuditDashboardStyle';
import Images from '../../auditPro/Themes/Images';
import auth from '../../../services/SupplierMgnt-Auth';
import { connect } from 'react-redux';

import { withNavigation } from 'react-navigation';
// import FilterSection from "./FilterSection";
import Toast, { DURATION } from 'react-native-easy-toast';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { width, height } from 'react-native-dimension';
import ProgressCircle from 'react-native-progress-circle';
import ResponsiveImage from 'react-native-responsive-image';
import Fonts from '../../auditPro/Themes/Fonts';
import { strings } from '../../auditPro/language/Language';
import NetInfo from '@react-native-community/netinfo';
import Immutable from 'seamless-immutable';
import { debounce, once } from 'underscore';
import constant from '../../../constants/SupplierMgnt/AppConstants';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Feather';
//component
// import CalendarAgenda from '../../auditPro/components/CalendarAgenda';
import { Dropdown } from 'react-native-element-dropdown';
import * as _ from 'lodash';
// import { NavigationEvents } from 'react-navigation';s

// Static register nd login //

import { API_URL_SM } from '../../../constants/SupplierMgnt/APIConstants';
import { isRegExp } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox as CheckedElement } from 'react-native-elements';
import { authorize, logout } from 'react-native-app-auth';
import CryptoJS from 'crypto-js';
var RNFS = require('react-native-fs');
import DeviceInfo from 'react-native-device-info';

import { Dialog, ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs';
import { create } from 'apisauce';
import { add } from 'lodash';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import { Bubbles } from 'react-native-loader';
import { AUDITPRO_URL } from 'screens/globalConstant/globalURL';

const moment = extendMoment(Moment);
const window_width = Dimensions.get('window').width;

const Reset = 'Reset';

class AllTabAuditList extends Component {
    keyVal = 0;
    sortType = 0;
    isCalender = undefined;
    dropdata = [
        {
            text: 'Reset',
            value: strings.reset,
        },
        {
            text: 'StartDate',
            value: strings.SortByStartDate,
        },
        {
            text: 'Auditee',
            value: strings.SortByAuditee,
        },

        {
            text: 'EndDate',
            value: strings.SortByEndDate,
        },
        {
            text: 'AuditNumber',
            value: strings.SortByAuditNo,
        },
        {
            text: 'AuditCycleName',
            value: strings.SortByAuditCycle,
        },
        /*{
          text: 'AuditProgramName',
          value: 'A.Program'
        },
        {
          text: 'AuditTypeName',
          value: 'A.Type'
        },
        {
          text: 'LeadAuditor',
          value: 'L.Auditor'
        },*/
        {
            text: 'cStatus',
            value: strings.SortByStatus,
        },
    ];
    constructor(props) {
        super(props);
        console.log('current Props--->', props);
        this.keyVal = 0;
        this.state = {
            auditList: [],
            auditListAll: [],
            token: '',
            userId: '',
            siteId: '',
            page: 1,
            loading: true,
            isRefreshing: false,
            isLazyLoading: false,
            isLazyLoadingRequired: true,
            filterType: '',
            sortype: '',
            dataSetArr: [],
            filterId: '',
            isMounted: false,
            isPageEmpty: false,
            isLocalFilterApplied: false,
            isSearchFinished: false,
            enableScrollViewScroll: true,
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            AuditSearch: '',
            filterTypeFG: 0,
            SortBy: 'StartDate',
            SortOrder: '',
            cFilterVal: 0,
            default: 1, // existing workf
            // default: 0 // today activity
            recentAudits: this.props?.data?.audits?.recentAudits
                ? this.props?.data?.audits?.recentAudits?.length > 0
                    ? this.props?.data?.audits?.recentAudits?.asMutable
                        ? this.props?.data?.audits?.recentAudits.asMutable()
                        : this.props?.data?.audits?.recentAudits || []
                    : []
                : [],
            filterArrSplit: [],
            activeTab: 0,
            // default for SORT
            audit_sort: 0,
            audit_filterType: 'Sort',
            audit_sortText: '',
            agendaData: {},
            todayLoader: true,
            isErrorRefresh: false,
            // Static register //
            isLoading: true,
            isDeviceRegistered: '',
            deviceRegistration: '',
            serverUrl: API_URL_SM || this.props.data?.audits?.serverUrl,
            type: 1,
            screenWidth: Dimensions.get('window').width,
            // login //
            username: '',
            password: '',
            userId: '',
            siteId: '',
            accessToken: '',
            Address: '',
            CompanyName: '',
            CompanyUrl: '',
            Logo: '',
            Phone: '',
            ChineseScript: false,
            fcmToken: '',
            existingFile: [],
            progressVisible: false,
            userFullName: '',
            isActiveDirectory: false,
            isAdvalue: true,
            loginFlag: parseInt(''),
            loading: false,
            currentUserData: null,
            deviceId: '',
        };
        console.log('props', this.props.data.audits.serverUrl, 'API_URL_SM', API_URL_SM, 'serverurl', this.state.serverUrl);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // this.backHandle();
            return true;
        });
    }

    async componentDidMount() {
        this.setState({ loading: true });
        this.props.storeServerUrl(API_URL_SM);
        var propsServerUrl = API_URL_SM || this.props.data?.audits?.serverUrl;
        var cleanURL = propsServerUrl?.replace(/^https?:\/\//, '');

        var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        this.propsServerUrl = formatURL;
        console.log('cleanURL', this.propsServerUrl);
        try {
            // await this.loadDataSM(); // 1. Load data and static login & register call
            // await this.registerCall(); // 1. wait for async call

            await this.globalLoginCall();

            await this.getAuditLists();
            await this.getAuditStatusDetails();
            await this.getRecentAuditlist();

            console.log('this.state.activetab', this.state.activeTab);
            console.log('check audits.smdata', this.props.data.audits.smdata);
            console.log('this.props check', this.props);

            // 2. Handle language setting
            const language = this.props.data.audits.language;
            if (language === 'Chinese') {
                this.setState({ ChineseScript: true }, () => {
                    strings.setLanguage('zh');
                });
            } else if (language === null || language === 'English') {
                this.setState({ ChineseScript: false }, () => {
                    strings.setLanguage('en-US');
                });
            }

            // 3. Set up focus listener
            this.focusListener = this.props.navigation.addListener('didFocus', () => {
                console.log('Audit List SM Component Focused!');

                const filterArr = this.props?.route?.params?.filter_Arr;
                console.log('checking---0000000>>>>>>>>>', this.props);

                if (filterArr) {
                    console.log('Filter Applied:', filterArr);
                    this.filterApplied(filterArr);
                } else {
                    if (this.state.isMounted) {
                        this.setState({
                            auditList: this.props.data.audits.audits,
                            auditListAll: this.props.data.audits.audits,
                            loading: false,
                            isRefreshing: false,
                            isPageEmpty: false,
                            isErrorRefresh: false,
                        });
                    }
                    if (this.state.token === '') {
                        this.getSessionValues();
                    }
                }
            });

            // 4. Final setup calls
            // this.getYearAudits();
            // this.handleRefresh();
        } catch (error) {
            console.error('componentDidMount error:', error);
        }
    }

    deleteFilter() {
        // this.props.navigation.state.params = undefined;
        this.props.route.params = undefined;
        this.setState(
            {
                filterArrSplit: [],
                AuditSearch: '',
                page: 1,
                loading: true,
                isErrorRefresh: false,
            },
            () => {
                this.getAuditlist();
            },
        );
    }
    onChangeText(value) {
        console.log(value);
        console.log('this.state.audit_sortText', this.state.audit_sortText);
        var dropvalue = value.value;
        var dropText = '';
        for (var i = 0; i < this.dropdata.length; i++) {
            if (this.dropdata[i].value == dropvalue) {
                dropText = this.dropdata[i].text;
            }
        }
        this.setState(
            {
                audit_sortText: dropText == Reset ? 'StartDate' : dropText,
            },
            () => {
                this.applyFilterChanges(this.state.audit_sort, this.state.audit_sortText, this.state.audit_filterType, null, null);
            },
        );
    }

    changeAuditSort(value) {
        this.setState({ audit_sort: value }, () => {
            console.log(this.state.audit_sort);
            this.applyFilterChanges(this.state.audit_sort, this.state.audit_sortText, this.state.audit_filterType, null, null);
        });
    }

    backNavigation() {
        console.log('sm_ backNavigation called');
        this.props.navigation.goBack();
        // console.log("GETBACKNAVIGATION!!!!!!!!!!!!!!!",this.props?.route?.params);
        // if(this.props?.route?.params == undefined){
        //   this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW);
        // } else if (this.props?.route?.params?.navagationPage == ROUTES.CALENDER_LIST){
        //   // this.props.navigation.goBack();
        //   this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW);
        // }else{
        //     this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW);
        // }
    }
    filterSection() {
        return (
            <View style={styles.filterCont}>
                <TouchableOpacity style={styles.filterBox} onPress={() => this.props.navigation.navigate(ROUTES.FILTER_SCREEN)}>
                    <Icon name="filter" size={20} color="#89888A" />
                    <Text
                        style={{
                            fontSize: Fonts.size.mediump,
                            color: '#89888A',
                            paddingLeft: 5,
                            fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.filter}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBox}>
                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="sort" size={20} color="#89888A" />
                    </View>
                    <View style={{ flex: 2 }}>
                        <Dropdown
                            value={strings.SortByStartDate}
                            onChange={this.onChangeText.bind(this)}
                            data={this.dropdata}
                            labelField="text"
                            valueField="value"
                            containerStyle={{ flex: 1 }}
                            itemPadding={5}
                            dropdownOffset={{ top: 20, left: 0 }}
                            width={300}
                            baseColor="grey"
                            itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                        />
                    </View>
                    {this.state.audit_sort == 0 ? (
                        <TouchableOpacity
                            onPress={() => this.changeAuditSort(1)}
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Icon name="long-arrow-down" size={20} color="#19BFC1" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => this.changeAuditSort(0)}
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Icon name="long-arrow-up" size={20} color="#19BFC1" />
                        </TouchableOpacity>
                    )}

                    {/* <Text style={{ fontSize: Fonts.size.mediump, color: "#89888A", paddingLeft: 5}}>Sort</Text> */}
                </TouchableOpacity>
            </View>
        );
    }

    allAudits() {
        return (
            <View tabLabel={strings.allaudits} style={styles.scrollViewBody}>
                {this.filterSection()}
                {/*this.state.filterArrSplit.length > 0 ? this.renderFilter() : null*/}
                {!this.state.loading ? (
                    this.state.auditList.length > 0 ? (
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 30 }}
                            data={this.state.auditList}
                            extraData={this.state}
                            onEndReached={this.handleEnd.bind(this)}
                            onEndReachedThreshold={0.01}
                            refreshing={this.state.isRefreshing}
                            onRefresh={debounce(this.handleRefresh.bind(this), 800)}
                            ListFooterComponent={this.listFooter.bind(this)}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                    <View
                                        style={{
                                            flex: 0.5,
                                            backgroundColor: '#fff',
                                            margin: 10,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            elevation: 3,
                                            shadowColor: Platform.OS === 'ios' ? '#D3D3D3' : '#000',
                                            shadowOffset: { width: 5, height: 5 },
                                            shadowOpacity: 5,
                                        }}>
                                        <View style={{ flex: 0.035, backgroundColor: item.color ? item.color : 'orange', margin: 10 }}></View>
                                        <View style={styles.auditBoxContent}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: Fonts.size.regular,
                                                    color: '#485B9E',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.Auditee}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: Fonts.size.small,
                                                    color: '#A6A6A6',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingTop: 5,
                                                    fontSize: Fonts.size.medium,
                                                    color: '#545454',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.AuditProgramName}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: Fonts.size.medium,
                                                    color: '#545454',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.AuditNumber}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: Fonts.size.medium,
                                                    color: '#545454',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.AuditCycleName}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: Fonts.size.medium,
                                                    color: '#545454',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.cStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.cStatus}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.key}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        width: window_width,
                                        height: 1,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            )}
                        />
                    ) : this.state.isErrorRefresh ? (
                        <View
                            style={{
                                paddingVertical: 20,
                                // borderTopWidth: 1,
                                // borderColor: "#CED0CE",
                                width: window_width,
                                height: height(100) - 213,
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity onPress={() => this.setState({ loading: true }, () => this.getAuditlist())}>
                                <Icon name="retweet" color="#21AFD5" size={30} />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: Fonts.size.h5,
                                        color: '#21AFD5',
                                        fontFamily: 'OpenSans-Regular',
                                    }}>
                                    Refresh
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text
                            style={{
                                width: window_width,
                                height: height(100) - 213,
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                fontSize: Fonts.size.h5,
                                paddingTop: 40,
                                fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.No_records_found}
                        </Text>
                    )
                ) : (
                    <View
                        style={{
                            paddingVertical: 20,
                            // borderTopWidth: 1,
                            // borderColor: "#CED0CE",
                            width: window_width,
                            height: height(100) - 213,
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <ActivityIndicator size={20} color="#1CAFF6" />
                    </View>
                )}
            </View>
        );
    }

    recentAudits() {
        console.log('this.state.recentAudits', this.state.recentAudits);
        return (
            <View tabLabel={strings.recentaudits} style={styles.scrollViewBody}>
                <View style={{ marginTop: 60 }}></View>
                {this.state.recentAudits.length > 0 ? (
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 40 }}
                        data={this.state.recentAudits}
                        extraData={this.state}
                        ListFooterComponent={this.listFooter.bind(this)}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                <View
                                    style={{
                                        flex: 0.5,
                                        backgroundColor: '#fff',
                                        margin: 10,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        elevation: 3,
                                        shadowColor: Platform.OS === 'ios' ? '#D3D3D3' : '#000',
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowOpacity: 5,
                                    }}>
                                    <View style={{ flex: 0.02, backgroundColor: this.getColorCode(item.cStatus), margin: 10 }}></View>
                                    <View style={styles.auditBoxContent}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                {
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: 'rgba(36,236,206,255)',
                                                },
                                            ]}>
                                            {item.Auditee}
                                        </Text>
                                        <Text numberOfLines={1} style={[{ fontFamily: 'OpenSans-Regular', color: 'black' }]}>
                                            {this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                paddingTop: 5,
                                                fontSize: Fonts.size.medium,
                                                color: '#545454',
                                                fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {item.AuditProgramName}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: Fonts.size.medium,
                                                color: '#545454',
                                                fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {item.AuditNumber}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: Fonts.size.medium,
                                                color: '#545454',
                                                fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {item.AuditCycleName}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: Fonts.size.medium,
                                                color: '#545454',
                                                fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {item.cStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.cStatus}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.key}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    width: window_width,
                                    height: 1,
                                    backgroundColor: 'transparent',
                                }}
                            />
                        )}
                    />
                ) : (
                    <Text style={styles.empty_text_}>{strings.No_records_found}</Text>
                )}
            </View>
        );
    }
    //all tab offline mode
    todayAudits() {
        return (
            <View tabLabel={strings.todaysaudits} style={styles.calendarScrollViewBody}>
                {this.props.data.audits.isOfflineMode ? (
                    <View
                        style={{
                            width: window_width,
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ fontFamily: 'OpenSans-Regular', color: 'grey', fontSize: Fonts.size.h5 }}>
                            Data will be visible only in the online mode
                        </Text>
                    </View>
                ) : this.state.todayLoader ? (
                    <View
                        style={{
                            paddingVertical: 20,
                            width: window_width,
                            height: height(100) - 213,
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <ActivityIndicator size={20} color="#1CAFF6" />
                    </View>
                ) : (
                    // <CalendarAgenda
                    //   dateFormat={this.props.data.audits.userDateFormat}
                    //   agendaData={this.state.agendaData}
                    // />
                    <></>
                )}
            </View>
        );
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        this.backNavigation();
                    }}>
                    <View style={styles.backlogo}>
                        {/* {!this.state.isLoading && !this.state.isDownloading ? ( */}
                        {/* // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                        <Icon name="angle-left" size={30} color="white" />
                        {/* ) : null} */}
                    </View>
                </TouchableOpacity>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>{strings.audits}</Text>
                </View>
                <View style={styles.headerDiv}>
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}>
                        <Icon name="home" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    backHandle() {
        // var getCurrentPage = [];
        // getCurrentPage = this.props.data.nav.routes;
        // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
        var PreviousPage = this.props.route.name;
        console.log('--PreviousPage--->', PreviousPage);
        if (PreviousPage == ROUTES.GLOBAL_LOGIN || PreviousPage == ROUTES.SUPPLY_MANAGE_SM) {
            this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
        } else {
            if (this.backHandler) {
                this.backHandler.remove();
            }
        }
    }
    componentWillUnmount() {
        this.backHandler.remove();
        if (this.props.navigation?.removeListener) {
            this.props.navigation.removeListener('didFocus');
        }
    }

    UNSAFE_componentWillMount() {
        console.log(
            'this.props.navigation.state.params',
            //   this.props.navigation.state.params,
            this.props?.route?.params,
        );
        if (this.props?.route?.params) {
            if (this.props?.route?.params?.ActiveTab) {
                if (this.props?.route?.params?.ActiveTab == 'recent') {
                    this.setState({ activeTab: 1 });
                } else if (this.props?.route?.params?.ActiveTab == 'today') {
                    this.setState({ activeTab: 2 });
                }
            }
        }
    }

    async getdeviceRegisterStatus() {
        this.setState({
            deviceRegistration: await AsyncStorage.getItem('isdeviceregistered'),
        });
        console.log(this.state.deviceRegistration, 'deviceregistrationstatus');
    }

    RestoringLoginData = async () => {
        try {
            const active = await AsyncStorage.getItem('isActive');
            console.log('isActive status:' + active);
            if (active !== null && active == 'yes') {
                this.setState({ isDeviceRegistered: true });
                console.log('isdeviceregister status:' + this.isDeviceRegistered);
                await AsyncStorage.setItem('isdeviceregistered', 'yes');
                this.props.registrationState(this.state.isDeviceRegistered);
                this.props.storeDeviceid(this.state.deviceId);
            }
        } catch (error) {
            console.log(error);
        }
    };

    async getDeviceId() {
        let deviceId = await AsyncStorage.getItem('deviceid');
        this.setState({
            deviceId,
        });
        console.log('tret1 getDeviceId get--', deviceId);
        return deviceId;
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

    async getAuditLists() {
        await this.getUserDetails();
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex getAuditLists----->', smIndex);
        var pageNo = 1;
        var token = this.props?.data?.audits?.token || this.state.currentUserData?.accessToken;
        var userId = this.props?.data?.audits?.userId || this.state.currentUserData?.userId;
        var siteId = this.props?.data?.audits?.siteId || this.state.currentUserData?.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter = this.state.AuditSearch === undefined ? '' : this.state.AuditSearch;
        var StartDate = '';
        var EndDate = '';
        var SortBy = '';
        var SortOrder = this.state.SortOrder;
        var SM = smIndex || this.props?.data?.audits?.smdata;
        console.log('reach here 001', token, userId, siteId, pageNo, pageSize, filterId, GlobalFilter, StartDate, EndDate, SortBy, SortOrder, SM, 1);
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
                    SM,
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
        console.log('reach here 0011', auditCount, token, userId, siteId, this.props?.data?.audits);
        /** First request skipped because we have initially zero */
        auth.getAuditNotification(
            auditCount,
            token || this.state.currentUserData?.accessToken,
            userId || this.state.currentUserData?.userId,
            siteId || this.state.currentUserData?.siteId,
            (response, data) => {
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
            },
        );
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
            this.props?.data?.audits?.smdata,
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

    storeSSoCreds = async sso => {
        console.log('Registration:SSO_Status', sso);
        sso = sso === undefined || sso === null || sso === '' || sso === false || sso === 'false' ? 'false' : 'true';
        await AsyncStorage.setItem('sso_login_state', sso.toString());
    };

    storeSSoConfig = async ssoConfig => {
        console.log('in', ssoConfig);
        await AsyncStorage.setItem('sso_config_flags', JSON.stringify(ssoConfig));
        await AsyncStorage.setItem('sso_issuer', JSON.stringify(ssoConfig.issuer));
        await AsyncStorage.setItem('sso_clientid', JSON.stringify(ssoConfig.clientId));
        await AsyncStorage.setItem('sso_redirecturl', JSON.stringify(ssoConfig?.redirectUrl));
    };

    getSsoCreds = async () => {
        try {
            let sso = await AsyncStorage.getItem('sso_login_state');
            console.log('sso_login_state', sso);
            //sso = true;
            if (sso !== null && sso !== undefined && (sso === 'true' || sso === true)) {
                let ss_configs = await AsyncStorage.getItem('sso_config_flags');
                if (ss_configs && Object.keys(JSON.parse(ss_configs)).length > 0) {
                    this.setState({
                        ssoConfigObj: JSON.parse(ss_configs),
                        ssoEnabled: true,
                        checkboxSelection: 'sso',
                    });

                    console.log(this.state.ssoEnabled, 'this.state.ssoEnabled_ sso');
                    AsyncStorage.setItem('ssoenableflag', 'true');
                }
            } else {
                //} if (sso === 'false' || sso === false) {
                this.setState({
                    ssoEnabled: false,
                    checkboxSelection: 'ewqims',
                });

                console.log(this.state.ssoEnabled, 'this.state.ssoEnabled_ ewqims');
                AsyncStorage.setItem('ssoenableflag', 'false');
            }
        } catch (err) {
            console.log('<==JS==>  getSsoCreds catch', err);
        }
    };

    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (fcmToken) {
            this.setState(
                {
                    fcmToken: fcmToken,
                },
                () => {
                    // console.log('login fcmToken',this.state.fcmToken)
                },
            );
        }
        if (!fcmToken) {
            //   fcmToken = await firebase.messaging().getToken();
            fcmToken = '';
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
                this.setState(
                    {
                        fcmToken: fcmToken,
                    },
                    () => {
                        // console.log('login fcmToken',this.state.fcmToken)
                    },
                );
            }
        }
    }

    async initialLoginCall() {
        console.log('initialLoginCall===>', this.props);
        console.log('nR===>', this.props?.data?.audits?.isDeviceRegistered);
        const isDeviceRegisteredLog = await AsyncStorage.getItem('isdeviceregistered');
        console.log('loginscreenisDeviceRegisteredLog:::::=====', isDeviceRegisteredLog);
        if (isDeviceRegisteredLog == 'no') {
            console.log('checking the device Registered or not-----------', this.props.data.audits.isDeviceRegistered);
            alert('Register the device before login..');
        } else {
            // Keyboard.dismiss();
            // let pwdfield = this.state.password;
            // let usrfield = this.state.username;

            let usrfield = 'smith';
            let pwdfield = 's1';

            // let usrfield = "omnex";
            // let pwdfield = "a1";
            // let usrfield = "kaalaa";
            console.log('pwdfield &&& usrfield  ===>', pwdfield, usrfield);
            this.setState({
                username: usrfield,
                password: pwdfield,
                loginFlag: 1,
            });
            if (pwdfield === '' || usrfield === '') {
                // this.refs.toast.show(strings.LoginCred, DURATION.LENGTH_LONG);
                alert(strings.LoginCred);
                console.log('Login credentials are empty');
            } else {
                // console.log('Email and password', this.state.username, this.state.password)
                if (this.props?.data?.audits?.isOfflineMode) {
                    this.refs.toast.show(strings.Offline_Notice);
                } else {
                    await AsyncStorage.setItem('ssologinstatusbool', 'false');

                    NetInfo.fetch().then(netState => {
                        if (netState.isConnected) {
                            this.setState(
                                {
                                    progressVisible: true,
                                },
                                () => {
                                    // check active directoery
                                    if (this.state.isActiveDirectory == true && this.state.isAdvalue == true) {
                                        this.callActiveDirectory(usrfield, pwdfield);
                                    } else {
                                        this.globalLoginCall(usrfield, pwdfield, this.state.loginFlag);
                                    }
                                },
                            );
                        } else {
                            this.refs.toast.show(strings.NoInternet);
                        }
                    });
                }
            }
        }
    }

    callActiveDirectory(username, password) {
        var activeURL = this.props?.data?.audits?.serverUrl;
        var filterURL1 = activeURL.replace('AuditPro', 'EwQIMS');
        var filterURL2 = filterURL1.replace('api', 'common');
        var ADdomain = 'ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=' + username + '&Password=' + password;

        // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=svibu&Password=P@ssw0rd

        const check = create({
            baseURL: filterURL2 + ADdomain,
        });
        check
            .post()
            .then(res => {
                // console.log('AD response',res)
                if (res.data == 'False') {
                    this.setState(
                        {
                            progressVisible: false,
                        },
                        () => {
                            alert(strings.usernotallowed);
                        },
                    );
                } else {
                    this.globalLoginCall(username, password);
                }
            })
            .catch(err => console.warn(err));
    }
    globalLoginCall = async () => {
        await this.getUserDetails();
        console.log('currentUserData---get', this.state?.currentUserData);
        await this.getDeviceId();
        console.log('deviceId--->', this.state?.deviceId);
        const loginDetails = this.state.currentUserData;
        console.log('loginDetails--->', loginDetails);
        console.log('loginDetails1--->', loginDetails?.Data);
        if (loginDetails?.success == true) {
            // if (data?.data?.Success == true) {
            console.log('data value checking' + loginDetails?.data[0]?.SupplierManagementAccess);
            this.props.storeLoginData(loginDetails?.data);
            this.props.storeSupplierManagement(loginDetails?.data[0].SupplierManagementAccess);
            console.log('storeUserName', this.state.username);

            this.props.storeUserName(this.state.username);
            this.setState(
                {
                    userId: loginDetails?.data[0]?.UserId.toString(),
                    siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : loginDetails?.data[0]?.Siteid,
                    accessToken: loginDetails?.accessToken,
                    userFullName: loginDetails?.data[0]?.FullName,
                },
                () => {
                    // console.log('userFullName',this.state.userFullName)
                    // call below 2 methods later zzzss
                    // this.getProfileCall(this.state.accessToken)
                    // this.getYearAudit()
                    this.getProfileCall(this.state.accessToken);
                    this.checkUser(this.state.userId, this.state.accessToken);

                    // alert('ok')
                },
            );
        } else {
            this.setState(
                {
                    progressVisible: false,
                },
                () => {
                    // this.refs.toast.show(data.data.Message, DURATION.LENGTH_LONG);
                    Alert.alert(loginDetails?.Message);
                },
            );
        }
    };

    storeData = async (key, value) => {
        console.log('checking assync details----------', key, value);
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error storing data:', error);
        }
    };

    checkUser(ID, token) {
        var UserStatus = '';
        console.log('Getting last user session', this.props.data, ID, this.state.deviceId);
        // console.log('User trying to log in',ID)
        var currentID = this.props.data.audits.userId;
        var currentDeviceId = this.props?.data?.audits?.deviceId || this.state.deviceId;
        // auth.getCheckUser(ID, token, (res, data) => {
        auth.getCheckUser(ID, currentDeviceId, token, (res, data) => {
            console.log('LoginUI:User information', data);

            if (data.data.Message == 'Success') {
                if (data.data.Data.ActiveStatus) UserStatus = data.data.Data.ActiveStatus;
                else {
                    //alert('Active Status not getting..:'+data.data.Data.ActiveStatus)
                }
                console.log('LoginUI:Currnt:', currentID, '--', 'id:', ID);
                if (UserStatus == 2) {
                    if (currentID != ID) {
                        console.log('refillStoreValues:multipleAuditUser');
                        this.multipleAuditUser(ID);
                        //  this.refillStoreValues(ID);
                        // 4. Final setup calls
                        this.getYearAudits();
                        this.handleRefresh();
                    } else {
                        console.log('refillStoreValues:Same user detected');
                        this.refillStoreValues(ID);
                    }
                } else {
                    this.setState(
                        {
                            progressVisible: false,
                        },
                        () => {
                            this.refs.toast.show(strings.not_permitted, DURATION.LENGTH_SHORT);
                        },
                    );
                }
            } else {
                this.setState(
                    {
                        progressVisible: false,
                    },
                    () => {
                        this.refs.toast.show(strings.error_connecting, DURATION.LENGTH_SHORT);
                    },
                );
            }
        });
    }

    multipleAuditUser(ID) {
        //alert('Called multiple audit user')
        var index = undefined;
        var FillArr = [];
        var Files = [];
        var isFileExist = false;
        //alert('MultipleAudit user'+ID)
        // console.log('RNFS.DocumentDirectoryPath',RNFS.DocumentDirectoryPath)
        if (Platform.OS == 'android') {
            RNFS.readDir('/data/user/0/com.omnex.suppliermanagement/cache/AuditUser')
                .then(result => {
                    console.log('LoginUI:GOT RESULT', result);
                    //alert('got result - readed directory:/data/user/0/com.omnex.auditpro/cache/AuditUser --login'+result)
                    //alert('server url:'+this.propsServerUrl+' ID:'+id)
                    Files = result;
                    for (var i = 0; i < Files.length; i++) {
                        console.log('LoginUI:propsURl', this.propsServerUrl, '+', ID);
                        if (Files[i].name.includes(this.propsServerUrl + ID)) {
                            FillArr.push(Files[i]);
                            console.log('LoginUI:FillArr', FillArr);
                            //alert("fileArr ---login:"+FillArr)
                            index = i;
                            isFileExist = true;
                            //alert('File exists')
                            // console.log('index',i)
                            // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
                            return Promise.all([RNFS.stat(Files[index].path), Files[index].path]);
                        }
                    }
                    if (isFileExist === false) {
                        //alert('File exists false')
                        index = 0;
                        // this.WriteFile(ID)
                    }
                })
                .then(statResult => {
                    console.log('LoginUI:statResult', statResult);
                    if (FillArr.length == 0) {
                        this.WriteFile(ID);
                        //alert("fill arr lenght --login data:0")
                        console.log('LoginUI:hitting here');
                    } else {
                        console.log('LoginUI:statResult reading', statResult);
                        //alert('start result reading --login')
                        RNFS.readFile(statResult[1])
                            .then(result => {
                                console.log(result + 'LoginUI:result value');
                                var read = JSON.parse(result);
                                console.log('LoginUI:Reading', read);
                                console.log('refillStoreValues ID value', ID);
                                this.refillStoreValues(ID);
                            })
                            .catch(err => {
                                console.log(err.message, err.code, 'LoginUI:ERR MSG');
                            });
                    }
                });
        } else {
            // console.log('Ios detected')
            var iOSpath = RNFS.DocumentDirectoryPath;
            RNFS.readDir(iOSpath)
                .then(result => {
                    // console.log('GOT RESULT', result);
                    Files = result;
                    for (var i = 0; i < Files.length; i++) {
                        if (Files[i].name.includes(this.propsServerUrl + ID)) {
                            FillArr.push(Files[i]);
                            // console.log('FillArr',FillArr)
                            index = i;
                            isFileExist = true;
                            // console.log('index',i)
                            // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
                            return Promise.all([RNFS.stat(Files[index].path), Files[index].path]);
                        }
                    }
                    if (isFileExist === false) {
                        // console.log('--ios---')
                        index = 0;
                        // this.WriteFile(ID)
                    }
                })
                .then(statResult => {
                    // console.log("statResult",statResult)
                    if (FillArr.length == 0) {
                        // console.log('FillArr is 0')
                        this.WriteFile(ID);
                        // console.log('hitting here')
                    } else {
                        // console.log('statResult reading',statResult)
                        RNFS.readFile(statResult[1]).then(result => {
                            var read = JSON.parse(result);
                            console.log('refillStoreValues', read);
                            // console.log('ID value',ID)
                            this.refillStoreValues(ID);
                        });
                    }
                })
                .then(contents => {
                    // log the file contents
                    // console.log('Filestorage',contents)
                })
                .catch(err => {
                    // console.log(err.message, err.code);
                });
        }
    }

    storeDataSM = async ID => {
        console.log('Store refilling is in progress');
        console.log('getting id from store', ID);
        //alert('refilling store values'+ID)
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex----->', smIndex);
        var isException = false;
        var UserId = ID;
        if (Platform.OS == 'android') {
            var path = '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + UserId;
            console.log('path-->', path);
            RNFS.readFile(path).then(res => {
                // console.log('reading from the User file',JSON.parse(res))
                var LoggedUserDetails = JSON.parse(res);
                console.log(LoggedUserDetails[0].audits.userName + 'user name');
                if (LoggedUserDetails[0].audits.userName == null) {
                    // console.log('Exception handled')
                    console.log('not refilled props');
                    this.WriteFile(ID);
                    isException = true;
                } else {
                    console.log('Refillign props', LoggedUserDetails[0].audits);
                    var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
                    this.props.updateAuditCount(auditCount);
                    var dynamicAuditCount = LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
                    this.props.updateDynamicAuditCount(dynamicAuditCount);

                    this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
                    this.props.storeUserSession(
                        LoggedUserDetails[0].audits.userName,
                        LoggedUserDetails[0].audits.userId,
                        LoggedUserDetails[0].audits.token,
                        LoggedUserDetails[0].audits.siteId,
                        LoggedUserDetails[0].audits.address,
                        LoggedUserDetails[0].audits.companyname,
                        LoggedUserDetails[0].audits.companyurl,
                        LoggedUserDetails[0].audits.logo,
                        LoggedUserDetails[0].audits.phone,
                    );
                    //storing user details using asyncstorage
                    // this.storelogindetails(
                    //   LoggedUserDetails[0].audits.userName,
                    //   LoggedUserDetails[0].audits.userId,
                    //   LoggedUserDetails[0].audits.token,
                    //   LoggedUserDetails[0].audits.siteId,
                    //   LoggedUserDetails[0].audits.address,
                    //   LoggedUserDetails[0].audits.companyname,
                    //   LoggedUserDetails[0].audits.companyurl,
                    //   LoggedUserDetails[0].audits.logo,
                    //   LoggedUserDetails[0].audits.phone,
                    // );

                    var auditRecords = LoggedUserDetails[0].audits.auditRecords;
                    this.props.storeAuditRecords(auditRecords);
                    var auditList = LoggedUserDetails[0].audits.audits;
                    this.props.storeAudits(auditList);
                    var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
                    this.props.storeYearAudits(getRawStartDate);
                    var loginuser = LoggedUserDetails[0].audits.loginuser;
                    this.props.storeUserName(loginuser);
                    var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
                    this.props.storeNCRecords(dupNCrecords);
                    var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
                    this.props.storeCameraCapture(cameraCapture);
                    var newLanguage = this.state.ChineseScript === true ? 'Chinese' : 'English';
                    this.props.storeLanguage(newLanguage);
                    var recentAudits = LoggedUserDetails[0].audits.recentAudits;
                    this.props.updateRecentAuditList(recentAudits);
                    var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
                    this.props.storeServerUrl(ServerUrl);
                    var isConnected = LoggedUserDetails[0].audits.isConnected;
                    this.props.changeConnectionState(isConnected);
                    var bool = LoggedUserDetails[0].audits.isAuditing;
                    this.props.changeAuditState(bool);
                    var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
                    this.props.storeDateFormat(selectedFormat);
                    this.props.storeLoginSession(true);
                    this.props.storeAuditStats(
                        LoggedUserDetails[0].audits.scheduledAudits,
                        LoggedUserDetails[0].audits.completedAudits,
                        LoggedUserDetails[0].audits.DeadlineViolatedAudits.LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
                    );
                    var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
                    this.props.registrationState(bool1);
                }
            });

            setTimeout(() => {
                // console.log('After refilling props',this.props.data)
                var UserDetails = [];
                UserDetails.push({
                    UserId: this.props.data.audits.userId,
                    audits: this.props.data.audits,
                });

                // console.log('UserDetails',UserDetails)
                var stringify = JSON.stringify(UserDetails);
                if (Platform.OS == 'android') {
                    var path = '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + UserId;

                    // write the file
                    RNFS.writeFile(path, stringify, 'utf8')
                        .then(success => {
                            // console.log('FILE WRITTEN!');
                            this.setState(
                                {
                                    progressVisible: false,
                                },
                                () => {
                                    //this.props.navigation.navigate('AuditProDashboard')
                                    console.log(
                                        'checking props' +
                                            this.props.data.audits.userFullName +
                                            this.props.data.audits.siteId +
                                            'user id:' +
                                            this.props.data.audits.userId +
                                            'token:' +
                                            this.props.data.audits.token +
                                            'isactive' +
                                            this.props.data.audits.isActive +
                                            'device registration status:' +
                                            this.props.data.audits.isDeviceRegistered,
                                    );
                                    console.log(this.props.data.audits.isDeviceRegistered, '********DeviceID********');
                                    // zthis.props.navigation.navigate("AllTabAuditList");z
                                    //if (this.props.data.audits.siteId !=''&& this.props.data.audits.userId !=''){
                                    //alert('navigated to alltabauditlist')
                                    console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                                    if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                                        // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                                        console.log('current smIndex1----->', smIndex, smIndex == 2);
                                        smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                                        this.backHandler.remove();
                                        // setTimeout(() => {
                                        this.setState({ loading: false });
                                        //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                                        // }, 2000);
                                    } else {
                                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                                    }

                                    //}else{
                                    //alert('navigated to dashboard to avoid null issue')
                                    //  this.props.navigation.navigate('AuditDashboard')
                                    //}
                                },
                            );
                        })
                        .catch(err => {
                            // console.log(err.message);
                        });
                } else {
                    var iOSpath = RNFS.DocumentDirectoryPath;
                    var path = iOSpath + '/' + this.propsServerUrl + UserId;

                    // write the file
                    RNFS.writeFile(path, stringify, 'utf8')
                        .then(success => {
                            // console.log('FILE WRITTEN!');
                            // this.props.navigation.navigate('AuditProDashboard')
                        })
                        .catch(err => {
                            // console.log(err.message);
                        });
                }
            }, 500);
        } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            var path = iOSpath + '/' + this.propsServerUrl + UserId;
            // console.log('path-->',path)
            RNFS.readFile(path).then(res => {
                // console.log('reading from the User file',JSON.parse(res))
                var LoggedUserDetails = JSON.parse(res);
                if (LoggedUserDetails[0].audits.userName == null) {
                    // console.log('Exception handled')
                    this.WriteFile(ID);
                    isException = true;
                } else {
                    console.log('Refillign props', LoggedUserDetails[0]);
                    var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
                    this.props.updateAuditCount(auditCount);
                    var dynamicAuditCount = LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
                    this.props.updateDynamicAuditCount(dynamicAuditCount);
                    this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
                    this.props.storeUserSession(
                        LoggedUserDetails[0].audits.userName,
                        LoggedUserDetails[0].audits.userId,
                        LoggedUserDetails[0].audits.token,
                        LoggedUserDetails[0].audits.siteId,
                        LoggedUserDetails[0].audits.address,
                        LoggedUserDetails[0].audits.companyname,
                        LoggedUserDetails[0].audits.companyurl,
                        LoggedUserDetails[0].audits.logo,
                        LoggedUserDetails[0].audits.phone,
                    );
                    console.log(LoggedUserDetails[0].audits.siteId, 'siteidinlogin');

                    // this.storelogindetails(
                    //   LoggedUserDetails[0].audits.userName,
                    //   LoggedUserDetails[0].audits.userId,
                    //   LoggedUserDetails[0].audits.token,
                    //   LoggedUserDetails[0].audits.siteId,
                    //   LoggedUserDetails[0].audits.address,
                    //   LoggedUserDetails[0].audits.companyname,
                    //   LoggedUserDetails[0].audits.companyurl,
                    //   LoggedUserDetails[0].audits.logo,
                    //   LoggedUserDetails[0].audits.phone,
                    // );

                    var auditRecords = LoggedUserDetails[0].audits.auditRecords;
                    this.props.storeAuditRecords(auditRecords);
                    var auditList = LoggedUserDetails[0].audits.audits;
                    this.props.storeAudits(auditList);
                    var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
                    this.props.storeYearAudits(getRawStartDate);
                    var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
                    this.props.storeNCRecords(dupNCrecords);
                    var loginuser = LoggedUserDetails[0].audits.loginuser;
                    this.props.storeUserName(loginuser);
                    var recentAudits = LoggedUserDetails[0].audits.recentAudits;
                    this.props.updateRecentAuditList(recentAudits);
                    var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
                    this.props.storeCameraCapture(cameraCapture);
                    var newLanguage = this.state.ChineseScript === true ? 'Chinese' : 'English';
                    this.props.storeLanguage(newLanguage);
                    var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
                    this.props.storeServerUrl(ServerUrl);
                    var isConnected = LoggedUserDetails[0].audits.isConnected;
                    this.props.changeConnectionState(isConnected);
                    var bool = LoggedUserDetails[0].audits.isAuditing;
                    this.props.changeAuditState(bool);
                    var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
                    this.props.storeDateFormat(selectedFormat);
                    this.props.storeLoginSession(true);
                    this.props.storeAuditStats(
                        LoggedUserDetails[0].audits.scheduledAudits,
                        LoggedUserDetails[0].audits.completedAudits,
                        LoggedUserDetails[0].audits.DeadlineViolatedAudits.LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
                    );
                    var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
                    this.props.registrationState(bool1);
                }
            });

            if (isException == false) {
                setTimeout(() => {
                    // console.log('After refilling props',this.props.data)
                    var UserDetails = [];
                    UserDetails.push({
                        UserId: this.props.data.audits.userId,
                        audits: this.props.data.audits,
                    });

                    // console.log('UserDetails',UserDetails)
                    var stringify = JSON.stringify(UserDetails);
                    if (Platform.OS == 'android') {
                        var path = '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + UserId;

                        // write the file
                        RNFS.writeFile(path, stringify, 'utf8')
                            .then(success => {
                                // console.log('FILE WRITTEN!');
                                this.setState(
                                    {
                                        progressVisible: false,
                                    },
                                    () => {
                                        //this.props.navigation.navigate('SupplyManage')
                                        console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                                        if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                                            // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                                            console.log('current smIndex1----->', smIndex, smIndex == 2);
                                            smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                                            this.backHandler.remove();
                                            // setTimeout(() => {
                                            this.setState({ loading: false });
                                            //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                                            // }, 2000);
                                        } else {
                                            this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                                        }

                                        //this.props.navigation.navigate("AllTabAuditList");
                                    },
                                );
                            })
                            .catch(err => {
                                // console.log(err.message);
                            });
                    } else {
                        var iOSpath = RNFS.DocumentDirectoryPath;
                        var path = iOSpath + '/' + this.propsServerUrl + UserId;

                        // write the file
                        RNFS.writeFile(path, stringify, 'utf8')
                            .then(success => {
                                // console.log('FILE WRITTEN!');
                                this.setState(
                                    {
                                        progressVisible: false,
                                    },
                                    () => {
                                        //this.props.navigation.navigate('SupplyManage')
                                        //this.props.navigation.navigate("AllTabAuditList");
                                        console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                                        if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                                            // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                                            console.log('current smIndex1----->', smIndex, smIndex == 2);
                                            smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                                            this.backHandler.remove();
                                            // setTimeout(() => {
                                            this.setState({ loading: false });
                                            //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                                            // }, 2000);
                                        } else {
                                            this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                                        }
                                    },
                                );
                            })
                            .catch(err => {
                                // console.log(err.message);
                            });
                    }
                }, 500);
            }
        }
    };

    async refillStoreValues(ID) {
        await this.storeDataSM(ID);
        console.log('reach here after storeDataSM');
        // 4. Final setup calls
        this.getYearAudits();
        this.handleRefresh();
    }

    // async refillStoreValues(ID) {
    //   console.log('Store refilling is in progress');
    //   console.log('getting id from store', ID);
    //   //alert('refilling store values'+ID)
    //   var smIndex = await AsyncStorage.getItem('supplierIndex');
    //   console.log('smIndex----->', smIndex);
    //   var isException = false;
    //   var UserId = ID;
    //   if (Platform.OS == 'android') {
    //     var path =
    //       '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
    //       '/' +
    //       this.propsServerUrl +
    //       UserId;
    //     console.log('path-->', path);
    //     RNFS.readFile(path).then(res => {
    //       // console.log('reading from the User file',JSON.parse(res))
    //       var LoggedUserDetails = JSON.parse(res);
    //       console.log(LoggedUserDetails[0].audits.userName + 'user name');
    //       if (LoggedUserDetails[0].audits.userName == null) {
    //         // console.log('Exception handled')
    //         console.log('not refilled props');
    //         this.WriteFile(ID);
    //         isException = true;
    //       } else {
    //         console.log('Refillign props', LoggedUserDetails[0].audits);
    //         var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
    //         this.props.updateAuditCount(auditCount);
    //         var dynamicAuditCount =
    //           LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
    //         this.props.updateDynamicAuditCount(dynamicAuditCount);

    //         this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
    //         this.props.storeUserSession(
    //           LoggedUserDetails[0].audits.userName,
    //           LoggedUserDetails[0].audits.userId,
    //           LoggedUserDetails[0].audits.token,
    //           LoggedUserDetails[0].audits.siteId,
    //           LoggedUserDetails[0].audits.address,
    //           LoggedUserDetails[0].audits.companyname,
    //           LoggedUserDetails[0].audits.companyurl,
    //           LoggedUserDetails[0].audits.logo,
    //           LoggedUserDetails[0].audits.phone,
    //         );
    //         //storing user details using asyncstorage
    //         // this.storelogindetails(
    //         //   LoggedUserDetails[0].audits.userName,
    //         //   LoggedUserDetails[0].audits.userId,
    //         //   LoggedUserDetails[0].audits.token,
    //         //   LoggedUserDetails[0].audits.siteId,
    //         //   LoggedUserDetails[0].audits.address,
    //         //   LoggedUserDetails[0].audits.companyname,
    //         //   LoggedUserDetails[0].audits.companyurl,
    //         //   LoggedUserDetails[0].audits.logo,
    //         //   LoggedUserDetails[0].audits.phone,
    //         // );

    //         var auditRecords = LoggedUserDetails[0].audits.auditRecords;
    //         this.props.storeAuditRecords(auditRecords);
    //         var auditList = LoggedUserDetails[0].audits.audits;
    //         this.props.storeAudits(auditList);
    //         var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
    //         this.props.storeYearAudits(getRawStartDate);
    //         var loginuser = LoggedUserDetails[0].audits.loginuser;
    //         this.props.storeUserName(loginuser);
    //         var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
    //         this.props.storeNCRecords(dupNCrecords);
    //         var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
    //         this.props.storeCameraCapture(cameraCapture);
    //         var newLanguage =
    //           this.state.ChineseScript === true ? 'Chinese' : 'English';
    //         this.props.storeLanguage(newLanguage);
    //         var recentAudits = LoggedUserDetails[0].audits.recentAudits;
    //         this.props.updateRecentAuditList(recentAudits);
    //         var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
    //         this.props.storeServerUrl(ServerUrl);
    //         var isConnected = LoggedUserDetails[0].audits.isConnected;
    //         this.props.changeConnectionState(isConnected);
    //         var bool = LoggedUserDetails[0].audits.isAuditing;
    //         this.props.changeAuditState(bool);
    //         var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
    //         this.props.storeDateFormat(selectedFormat);
    //         this.props.storeLoginSession(true);
    //         this.props.storeAuditStats(
    //           LoggedUserDetails[0].audits.scheduledAudits,
    //           LoggedUserDetails[0].audits.completedAudits,
    //           LoggedUserDetails[0].audits.DeadlineViolatedAudits
    //             .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
    //         );
    //         var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
    //         this.props.registrationState(bool1);
    //       }
    //     });

    //     setTimeout(() => {
    //       // console.log('After refilling props',this.props.data)
    //       var UserDetails = [];
    //       UserDetails.push({
    //         UserId: this.props.data.audits.userId,
    //         audits: this.props.data.audits,
    //       });

    //       // console.log('UserDetails',UserDetails)
    //       var stringify = JSON.stringify(UserDetails);
    //       if (Platform.OS == 'android') {
    //         var path =
    //           '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
    //           '/' +
    //           this.propsServerUrl +
    //           UserId;

    //         // write the file
    //         RNFS.writeFile(path, stringify, 'utf8')
    //           .then(success => {
    //             // console.log('FILE WRITTEN!');
    //             this.setState(
    //               {
    //                 progressVisible: false,
    //               },
    //               () => {
    //                 //this.props.navigation.navigate('AuditProDashboard')
    //                 console.log(
    //                   'checking props' +
    //                     this.props.data.audits.userFullName +
    //                     this.props.data.audits.siteId +
    //                     'user id:' +
    //                     this.props.data.audits.userId +
    //                     'token:' +
    //                     this.props.data.audits.token +
    //                     'isactive' +
    //                     this.props.data.audits.isActive +
    //                     'device registration status:' +
    //                     this.props.data.audits.isDeviceRegistered,
    //                 );
    //                 console.log(
    //                   this.props.data.audits.isDeviceRegistered,
    //                   '********DeviceID********',
    //                 );
    //                 // zthis.props.navigation.navigate("AllTabAuditList");z
    //                 //if (this.props.data.audits.siteId !=''&& this.props.data.audits.userId !=''){
    //                 //alert('navigated to alltabauditlist')
    //                 console.log(
    //                   'supplier management value' +
    //                   this.props?.data?.audits?.suppliermanagementstatus,
    //                 );
    //                 if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
    //                   // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
    //                   console.log('current smIndex1----->', smIndex, smIndex == 2);
    //                   smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
    //                   this.backHandler.remove();
    //                   setTimeout(() => {
    //                     this.setState({loading: false});
    //                     this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
    //                   }, 2000);
    //                 } else {
    //                   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
    //                 }

    //                 //}else{
    //                 //alert('navigated to dashboard to avoid null issue')
    //                 //  this.props.navigation.navigate('AuditDashboard')
    //                 //}
    //               },
    //             );
    //           })
    //           .catch(err => {
    //             // console.log(err.message);
    //           });
    //       } else {
    //         var iOSpath = RNFS.DocumentDirectoryPath;
    //         var path = iOSpath + '/' + this.propsServerUrl + UserId;

    //         // write the file
    //         RNFS.writeFile(path, stringify, 'utf8')
    //           .then(success => {
    //             // console.log('FILE WRITTEN!');
    //             // this.props.navigation.navigate('AuditProDashboard')
    //           })
    //           .catch(err => {
    //             // console.log(err.message);
    //           });
    //       }
    //     }, 500);
    //   } else {
    //     var iOSpath = RNFS.DocumentDirectoryPath;
    //     var path = iOSpath + '/' + this.propsServerUrl + UserId;
    //     // console.log('path-->',path)
    //     RNFS.readFile(path).then(res => {
    //       // console.log('reading from the User file',JSON.parse(res))
    //       var LoggedUserDetails = JSON.parse(res);
    //       if (LoggedUserDetails[0].audits.userName == null) {
    //         // console.log('Exception handled')
    //         this.WriteFile(ID);
    //         isException = true;
    //       } else {
    //         console.log('Refillign props', LoggedUserDetails[0]);
    //         var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
    //         this.props.updateAuditCount(auditCount);
    //         var dynamicAuditCount =
    //           LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
    //         this.props.updateDynamicAuditCount(dynamicAuditCount);
    //         this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
    //         this.props.storeUserSession(
    //           LoggedUserDetails[0].audits.userName,
    //           LoggedUserDetails[0].audits.userId,
    //           LoggedUserDetails[0].audits.token,
    //           LoggedUserDetails[0].audits.siteId,
    //           LoggedUserDetails[0].audits.address,
    //           LoggedUserDetails[0].audits.companyname,
    //           LoggedUserDetails[0].audits.companyurl,
    //           LoggedUserDetails[0].audits.logo,
    //           LoggedUserDetails[0].audits.phone,
    //         );
    //         console.log( LoggedUserDetails[0].audits.siteId,"siteidinlogin");

    //         // this.storelogindetails(
    //         //   LoggedUserDetails[0].audits.userName,
    //         //   LoggedUserDetails[0].audits.userId,
    //         //   LoggedUserDetails[0].audits.token,
    //         //   LoggedUserDetails[0].audits.siteId,
    //         //   LoggedUserDetails[0].audits.address,
    //         //   LoggedUserDetails[0].audits.companyname,
    //         //   LoggedUserDetails[0].audits.companyurl,
    //         //   LoggedUserDetails[0].audits.logo,
    //         //   LoggedUserDetails[0].audits.phone,
    //         // );

    //         var auditRecords = LoggedUserDetails[0].audits.auditRecords;
    //         this.props.storeAuditRecords(auditRecords);
    //         var auditList = LoggedUserDetails[0].audits.audits;
    //         this.props.storeAudits(auditList);
    //         var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
    //         this.props.storeYearAudits(getRawStartDate);
    //         var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
    //         this.props.storeNCRecords(dupNCrecords);
    //         var loginuser = LoggedUserDetails[0].audits.loginuser;
    //         this.props.storeUserName(loginuser);
    //         var recentAudits = LoggedUserDetails[0].audits.recentAudits;
    //         this.props.updateRecentAuditList(recentAudits);
    //         var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
    //         this.props.storeCameraCapture(cameraCapture);
    //         var newLanguage =
    //           this.state.ChineseScript === true ? 'Chinese' : 'English';
    //         this.props.storeLanguage(newLanguage);
    //         var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
    //         this.props.storeServerUrl(ServerUrl);
    //         var isConnected = LoggedUserDetails[0].audits.isConnected;
    //         this.props.changeConnectionState(isConnected);
    //         var bool = LoggedUserDetails[0].audits.isAuditing;
    //         this.props.changeAuditState(bool);
    //         var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
    //         this.props.storeDateFormat(selectedFormat);
    //         this.props.storeLoginSession(true);
    //         this.props.storeAuditStats(
    //           LoggedUserDetails[0].audits.scheduledAudits,
    //           LoggedUserDetails[0].audits.completedAudits,
    //           LoggedUserDetails[0].audits.DeadlineViolatedAudits
    //             .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
    //         );
    //         var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
    //         this.props.registrationState(bool1);
    //       }
    //     });

    //     if (isException == false) {
    //       setTimeout(() => {
    //         // console.log('After refilling props',this.props.data)
    //         var UserDetails = [];
    //         UserDetails.push({
    //           UserId: this.props.data.audits.userId,
    //           audits: this.props.data.audits,
    //         });

    //         // console.log('UserDetails',UserDetails)
    //         var stringify = JSON.stringify(UserDetails);
    //         if (Platform.OS == 'android') {
    //           var path =
    //             '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
    //             '/' +
    //             this.propsServerUrl +
    //             UserId;

    //           // write the file
    //           RNFS.writeFile(path, stringify, 'utf8')
    //             .then(success => {
    //               // console.log('FILE WRITTEN!');
    //               this.setState(
    //                 {
    //                   progressVisible: false,
    //                 },
    //                 () => {
    //                   //this.props.navigation.navigate('SupplyManage')
    //                   console.log(
    //                     'supplier management value' +
    //                     this.props?.data?.audits?.suppliermanagementstatus,
    //                   );
    //                   if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
    //                     // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
    //                     console.log('current smIndex1----->', smIndex, smIndex == 2);
    //                     smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
    //                     this.backHandler.remove();
    //                     setTimeout(() => {
    //                       this.setState({loading: false});
    //                       this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
    //                     }, 2000);
    //                   } else {
    //                       this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
    //                   }

    //                   //this.props.navigation.navigate("AllTabAuditList");
    //                 },
    //               );
    //             })
    //             .catch(err => {
    //               // console.log(err.message);
    //             });
    //         } else {
    //           var iOSpath = RNFS.DocumentDirectoryPath;
    //           var path = iOSpath + '/' + this.propsServerUrl + UserId;

    //           // write the file
    //           RNFS.writeFile(path, stringify, 'utf8')
    //             .then(success => {
    //               // console.log('FILE WRITTEN!');
    //               this.setState(
    //                 {
    //                   progressVisible: false,
    //                 },
    //                 () => {
    //                   //this.props.navigation.navigate('SupplyManage')
    //                   //this.props.navigation.navigate("AllTabAuditList");
    //                   console.log(
    //                     'supplier management value' +
    //                     this.props?.data?.audits?.suppliermanagementstatus,
    //                   );
    //                   if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
    //                     // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
    //                     console.log('current smIndex1----->', smIndex, smIndex == 2);
    //                     smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
    //                     this.backHandler.remove();
    //                     setTimeout(() => {
    //                       this.setState({loading: false});
    //                       this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
    //                     }, 2000);
    //                   } else {
    //                       this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
    //                   }
    //                 },
    //               );
    //             })
    //             .catch(err => {
    //               // console.log(err.message);
    //             });
    //         }
    //       }, 500);
    //     }
    //   }
    // }

    async WriteFile(id) {
        //alert('write file id:'+id)
        console.log('getting from store', id);
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex----->', smIndex);

        var UserId = id;
        if (Platform.OS == 'android') {
            var path = '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + UserId;
            console.log('path-->', path);
            // console.log('Before clearing props',this.props.data)
            this.getProfileCall(this.state.accessToken);
            this.getYearAudit();

            setTimeout(() => {
                // console.log('Checking the props after refilling',this.props.data)
                var UserDetails = [];
                UserDetails.push({
                    UserId: this.props.data.audits.userId,
                    audits: this.props.data.audits,
                });

                // console.log('UserDetails',UserDetails)
                var stringify = JSON.stringify(UserDetails);

                // console.log('Writing new file',stringify)

                // write the file
                RNFS.writeFile(path, stringify, 'utf8')
                    .then(success => {
                        // console.log('FILE WRITTEN!');

                        this.setState(
                            {
                                progressVisible: false,
                            },
                            () => {
                                //this.props.navigation.navigate('SupplyManage')
                                // this.props.navigation.navigate("AllTabAuditList");
                                console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                                if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                                    // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                                    console.log('current smIndex1----->', smIndex, smIndex == 2);
                                    smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                                    this.backHandler.remove();
                                    // setTimeout(() => {
                                    this.setState({ loading: false });
                                    //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                                    // }, 2000);
                                } else {
                                    this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                                }
                            },
                        );
                    })
                    .catch(err => {
                        // console.log(err.message);
                    });
            }, 500);
        } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            var path = iOSpath + '/' + this.propsServerUrl + UserId;
            // console.log('path-->',path)
            // console.log('Before clearing props',this.props.data)
            this.getProfileCall(this.state.accessToken);
            this.getYearAudit();
            setTimeout(() => {
                // console.log('Checking the props after refilling',this.props.data)
                var UserDetails = [];
                UserDetails.push({
                    UserId: this.props.data.audits.userId,
                    audits: this.props.data.audits,
                });

                // console.log('UserDetails',UserDetails)
                var stringify = JSON.stringify(UserDetails);

                // write the file
                RNFS.writeFile(path, stringify, 'utf8')
                    .then(success => {
                        // console.log('FILE WRITTEN!');
                        this.setState(
                            {
                                progressVisible: false,
                            },
                            () => {
                                //this.props.navigation.navigate('SupplyManage')
                                console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                                if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                                    // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                                    console.log('current smIndex2----->', smIndex, smIndex == 2);
                                    smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                                    this.backHandler.remove();
                                    // setTimeout(() => {
                                    this.setState({ loading: false });
                                    //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                                    // }, 2000);
                                } else {
                                    this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                                }

                                //  this.props.navigation.navigate("AllTabAuditList");
                            },
                        );
                    })
                    .catch(err => {
                        // console.log(err.message);
                    });
            }, 500);
        }
    }

    getProfileCall(token) {
        var Token = token;
        // console.log('Profile getting details...',Token)
        //alert('profile called --login')
        auth.getProfile(Token, (res, data) => {
            // console.log('--->',data)
            if (data?.data) {
                if (data?.data?.Message === 'Success') {
                    // console.log('getting into if',data)
                    //alert('Profile data get --login')
                    this.setState(
                        {
                            Address: data.data.Data.Address,
                            CompanyName: data.data.Data.CompanyName,
                            CompanyUrl: data.data.Data.CompanyUrl,
                            Logo: data.data.Data.Logo,
                            Phone: data.data.Data.Phone,
                        },
                        () => {
                            // console.log('settings address...',this.state.Address)
                            // console.log('setting companyname...',this.state.CompanyName)
                            // console.log('setting CompanyUrl',this.state.CompanyUrl)
                            // console.log(' setting Logo...',this.state.Logo)
                            // console.log('setting Phone...',this.state.Phone)
                            this._storeToken();
                        },
                    );
                } else {
                    this.refs.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
                }
            } else {
                this.refs.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
            }
        });
    }

    async getYearAudit() {
        const token = this.state.accessToken;
        const siteid = this.state.siteId;
        const userid = this.state.userId;
        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
        console.log('checkinguserSiteselectiongetYearAudits', value);
        console.log('getYearAudits---->', value?.siteId, value?.userId, value?.accessToken);
        auth.getYearAudit(value?.siteId, value?.userId, value?.accessToken, (res, data) => {
            // auth.getYearAudit(siteid, userid, token, (res, data) => {
            // console.log('Calender filter api is called',data)
            if (data?.data?.Message == 'Success') {
                var GrossAudits = data.data.Data;
                var getRawStartDate = [];
                for (var i = 0; i < GrossAudits.length; i++) {
                    getRawStartDate.push({
                        StartDate: GrossAudits[i].StartDate,
                    });
                }
                // console.log('getRawStartDate',getRawStartDate)
                // this.props.yearAudits(getStartDate)
                // storing the yearly audits in the store
                this.props.storeYearAudits(getRawStartDate);
            }
        });
    }

    _storeToken = async () => {
        // console.log('*********',this.state.username)
        try {
            // Store audit list in redux store to set it in persistant storage
            // this.props.storeSiteId(this.props?.data?.audits?.siteId);
            var smIndex = await AsyncStorage.getItem('supplierIndex');
            console.log('smIndex----->', smIndex);
            this.props.storeSiteId(this.state.siteId);
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
            console.log(this.state.siteId, 'siteidinlogin1');

            // this.storelogindetails(
            //   this.state.userFullName,
            //   this.state.userId,
            //   this.state.accessToken,
            //   this.state.siteId,
            //   this.state.Address,
            //   this.state.CompanyName,
            //   this.state.CompanyUrl,
            //   this.state.Logo,
            //   this.state.Phone,
            // );
            // console.log('reach storelogindetails');
            this.props.storeLoginSession(true);
            console.log('reach storeLoginSession');
            // console.log('LoginUIScreen Props After Props Changing...', this.props)
            // console.log('Session created and stored the values.')
            this.setState(
                {
                    progressVisible: false,
                },
                () => {
                    //this.props.navigation.navigate('SupplyManage')
                    //this.props.navigation.navigate("AllTabAuditList");
                    console.log('supplier management value' + this.props?.data?.audits?.suppliermanagementstatus);
                    if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                        // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                        console.log('current smIndex1----->', smIndex, smIndex == 2);
                        smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                        this.backHandler.remove();
                        // setTimeout(() => {
                        this.setState({ loading: false });
                        //   this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                        // }, 2000);
                    } else {
                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                    }
                },
            );
        } catch (error) {
            // Error saving data
            // console.log('Failed to create a login session!!!')
        }
    };

    async getYearAudits() {
        this.keyVal = 0;
        // const {userId, token} = this.props.data.audits;
        // const siteId = this.props.data.audits.siteId;

        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
        console.log('checkinguserSiteselectiongetYearAuditsallltabauditsmmmm---->>>>', value);
        console.log('getYearAudits---->', value?.siteId, value?.userId, value?.accessToken);

        const token = this.state.accessToken || this.props.data.audits.token;
        const siteId = this.state.siteId || this.props.data.audits.siteId;
        const userId = this.state.userId || this.props.data.audits.userId;
        console.log(this.props.data.audits, 'SITEIDDDDD');
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                auth.getYearAudit(siteId, userId, token, (response, data) => {
                    if (data.data) {
                        if (data.data.Message === 'Success') {
                            if (data.data.Data && data.data.Data.length > 0) {
                                console.log('year Audits---->', data.data.Data);
                                var auditList = data.data.Data;
                                let agendaObj = {};
                                var auditListProps = this.props.data.audits.auditRecords;
                                let keyVal = 0;
                                _.forEach(auditList, function (Audit_res) {
                                    var auditInfo = Audit_res;
                                    auditInfo['color'] = '#1081de';
                                    auditInfo['cStatus'] = constant.StatusScheduled;
                                    auditInfo['key'] = Audit_res.ActualAuditId + '_' + (keyVal + 1);

                                    // Set Audit Status
                                    if (Audit_res.AuditStatus == 3 && (Audit_res.CloseOutStatus == '7' || Audit_res.CloseOutStatus === '9')) {
                                        auditInfo['cStatus'] = constant.StatusCompleted;
                                    } else if (Audit_res.AuditStatus == 3 && Audit_res.CloseOutStatus != '7' && Audit_res.CloseOutStatus != '9') {
                                        auditInfo['cStatus'] = constant.Completed;
                                    } else if (Audit_res.AuditStatus == 2) {
                                        auditInfo['cStatus'] = constant.StatusScheduled;
                                    } else if (Audit_res.AuditStatus == 2 && Audit_res.PerformStarted == 1) {
                                        auditInfo['cStatus'] = constant.StatusProcessing;
                                    } else if (Audit_res.AuditStatus == 4) {
                                        auditInfo['cStatus'] = constant.StatusDV;
                                    } else if (Audit_res.AuditStatus == 5) {
                                        auditInfo['cStatus'] = constant.StatusDVC;
                                    }

                                    for (var j = 0; j < auditListProps.length; j++) {
                                        if (parseInt(auditListProps[j].AuditId) == parseInt(Audit_res.ActualAuditId)) {
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
                                            auditInfo['color'] = 'black';
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
                                            auditInfo['color'] = '#1081de';
                                            break;
                                    }
                                    // auditList.push(auditInfo)
                                    if (auditInfo.StartDate) {
                                        const dateT = new Date(auditInfo.StartDate);
                                        /** Adding prefix zero if not calendar will not shown any data */
                                        let month = dateT.getMonth() + 1 < 10 ? '0' + (dateT.getMonth() + 1) : dateT.getMonth() + 1;
                                        let datestr = dateT.getDate() < 10 ? '0' + dateT.getDate() : dateT.getDate();
                                        let key = dateT.getFullYear() + '-' + month + '-' + datestr;
                                        /** Mapping the audits based on the start date */
                                        if (agendaObj[key]) {
                                            agendaObj[key] = [...agendaObj[key], { ...auditInfo }];
                                        } else {
                                            agendaObj[key] = [{ ...auditInfo }];
                                        }
                                    }
                                    keyVal = keyVal + 1;
                                });
                                /**
                                 * Finally we have a structure like
                                 * { 2020-02-10: [{},{}], 2020-01-28: [{}] }
                                 */
                                this.setState({ agendaData: agendaObj, todayLoader: false });
                                // this.transformAuditForAgenda(auditList)
                            } else {
                                this.setState({ todayLoader: false });
                            }
                        } else {
                            this.setState({ todayLoader: false });
                        }
                    } else {
                        this.setState({ todayLoader: false });
                    }
                });
            } else {
                /** offline */
            }
        });
    }

    async filterApplied(filter) {
        console.log('filterApplied', filter);
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex filterApplied----->', smIndex);
        var sortype = this.state.audit_sort;
        var droptext = this.state.audit_sortText;
        var FilterArray = [];
        if (filter[0].filterType === 'GlobalFilter') {
            filter[0].text.globalSearchText && filter[0].text.globalSearchText !== '' ? FilterArray.push(filter[0].text.globalSearchText) : null;
            filter[0].startDate !== '' && filter[0].endDate !== ''
                ? FilterArray.push(filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate)
                : null;
            filter[0].text.auditNumber && filter[0].text.auditNumber !== '' ? FilterArray.push(filter[0].text.auditNumber) : null;
            filter[0].text.auditCycle && filter[0].text.auditCycle !== '' ? FilterArray.push(filter[0].text.auditCycle) : null;
            filter[0].text.auditee && filter[0].text.auditee !== '' ? FilterArray.push(filter[0].text.auditee) : null;
            filter[0].text.auditProgram && filter[0].text.auditProgram !== '' ? FilterArray.push(filter[0].text.auditProgram) : null;
            filter[0].text.auditType && filter[0].text.auditType !== '' ? FilterArray.push(filter[0].text.auditType) : null;
        }
        if (filter[0].filterType === 'Status') {
            FilterArray = filter[0].text.split('and');
            filter[0].startDate !== '' && filter[0].endDate !== ''
                ? FilterArray.push(filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate)
                : null;
        }
        if (filter[0].filterType === 'Calendar') {
            FilterArray = [filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate];
            // if(filter[0].startDate  !== '' && filter[0].endDate !== ''){
            //     var StartDateTimeStamp = new Date(filter[0].startDate)
            //     var EndDateTimeStamp = new Date(filter[0].endDate)
            //      if(StartDateTimeStamp < EndDateTimeStamp){
            //         FilterArray = [filter[0].startDate+' '+strings.to+' '+filter[0].endDate]
            //      }else{
            //          var temp = ''
            //          temp = filter[0].startDate
            //         filter[0].startDate = filter[0].endDate
            //         filter[0].endDate = temp

            //      }
            // }
        }
        console.log('FilterArray', FilterArray);
        this.setState(
            {
                AuditSearch: filter[0].globalSearch,
                filterArrSplit: FilterArray,
                loading: true,
                SortBy: droptext,
                SortOrder: sortype,
                isErrorRefresh: false,
                auditList: [],
                auditListAll: [],
                isMounted: false,
            },
            () => {
                console.log('SortBy', this.state.SortBy);
                console.log('SortOrder', this.state.SortOrder);
                console.log('SortOrder', this.state.SortOrder);

                console.log('getAuditlist ------>11111');
                var pageNo = this.state.page;
                // var token = this.props.data.audits.token;
                // var userId = this.props.data.audits.userId;
                // var siteId = this.props.data.audits.siteId;
                const token = this.state.accessToken || this.props.data.audits.token;
                const siteId = this.state.siteId || this.props.data.audits.siteId;
                const userId = this.state.userId || this.props.data.audits.userId;
                var filterId = this.state.filterId;
                var pageSize = 10;
                var GlobalFilter = this.state.AuditSearch;
                // var StartDate = (startDate == undefined) ? '' : startDate
                // var EndDate = (endDate == undefined) ? '' : endDate
                var SortBy = this.state.SortBy;
                var SortOrder = this.state.SortOrder;
                var Default = this.state.default;
                var SM = smIndex || this.props.data.audits.smdata;

                // this.getAuditlist(filter.startDate,filter.endDate)
                // console.log('jdata',getauditlist)
                auth.getauditlist(
                    token,
                    userId,
                    siteId,
                    pageNo,
                    pageSize,
                    filterId,
                    GlobalFilter,
                    filter[0].startDate,
                    filter[0].endDate,
                    SortBy,
                    SortOrder,
                    SM,
                    Default,
                    (response, data) => {
                        console.log('Filter data', data);
                        if (data.data.Message === 'Success') {
                            var auditList = [];
                            var auditListProps = this.props.data.audits.audits;

                            for (var i = 0; i < data.data.Data.length; i++) {
                                var auditInfo = data.data.Data[i];
                                auditInfo['color'] = '#1081de';
                                auditInfo['cStatus'] = constant.StatusScheduled;
                                auditInfo['key'] = this.keyVal + 1;

                                // Set Audit Status
                                /*if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === "7" || auditInfo.CloseOutStatus === "9")) {
                  auditInfo['cStatus'] = constant.StatusCompleted;
                }
                else*/
                                if (auditInfo.AuditStatus == 3) {
                                    //} && auditInfo.CloseOutStatus != "7" && auditInfo.CloseOutStatus != "9") {
                                    auditInfo['cStatus'] = constant.Completed;
                                } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 0) {
                                    auditInfo['cStatus'] = constant.StatusScheduled;
                                } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 1) {
                                    auditInfo['cStatus'] = constant.StatusProcessing;
                                } else if (data.data.Data[i].AuditStatus == 4) {
                                    auditInfo['cStatus'] = constant.StatusDV;
                                } else if (data.data.Data[i].AuditStatus == 5) {
                                    auditInfo['cStatus'] = constant.StatusDVC;
                                }

                                for (var j = 0; j < auditListProps.length; j++) {
                                    if (parseInt(auditListProps[j].ActualAuditId) == parseInt(data.data.Data[i].ActualAuditId)) {
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
                                auditInfo['color'] = this.getColorCode(auditInfo['cStatus']);

                                auditList.push(auditInfo);
                                this.keyVal = this.keyVal + 1;
                            }

                            // console.log('AuditDashBody Props Before Changing...', this.props)
                            // var finalAuditListAll = this.state.auditListAll.concat(auditList)
                            // var finalAuditList = this.state.auditList.concat(auditList)

                            let bufferList = Array.from(new Set(auditList));
                            this.setState({
                                auditList: bufferList,
                                loading: false,
                                isRefreshing: false,
                                isLazyLoading: false,
                                isLazyLoadingRequired: true,
                                isPageEmpty: false,
                                isMounted: true,
                                isErrorRefresh: false,
                            });
                        } else {
                            this.setState({
                                auditList: this.props.data.audits,
                                loading: false,
                                isRefreshing: false,
                                isLazyLoading: false,
                                isLazyLoadingRequired: true,
                                isPageEmpty: false,
                                isMounted: true,
                                isErrorRefresh: false,
                            });
                        }
                    },
                );
            },
        );
        // this.applyFilterChanges(sortype, droptext, filterType, startDate, endDate)
    }

    getColorCode(status) {
        let statusColor = '#1081de';
        switch (status) {
            case constant.StatusScheduled:
                statusColor = '#1081de';
                break;
            case constant.StatusDownloaded:
                statusColor = '#cd8cff';
                break;
            case constant.StatusNotSynced:
                statusColor = '#2ec3c7';
                break;
            case constant.StatusProcessing:
                statusColor = '#e88316';
                break;
            case constant.StatusSynced:
                statusColor = '#48bcf7';
                break;
            case constant.StatusCompleted:
                statusColor = 'black';
                break;
            case constant.Completed:
                statusColor = 'green';
                break;
            case constant.StatusDV:
                statusColor = 'red';
                break;
            case constant.StatusDVC:
                statusColor = 'green';
                break;
            default:
                statusColor = '#1081de';
                break;
        }
        return statusColor;
    }

    // componentDidUpdate(prevProps) {
    //   const CurrentPage = this.props?.route?.name;
    //   console.log("--CurrentPage--->", CurrentPage);

    //   if (CurrentPage === ROUTES.ALLTABAUDITLIST_SM && this.state.isMounted && this.state.isLazyLoadingRequired) {
    //     const filterType = parseInt(this.props.filterType);
    //     const prevSearch = prevProps.onRecieveSearchSubmit;
    //     const newSearch = this.props.onRecieveSearchSubmit;
    //     const searchFlag = this.props.searchFlag;

    //     const filterChanged = filterType > 0 && this.state.filterTypeFG !== filterType;
    //     const resetFilter = this.state.filterTypeFG > 0 && filterType === 0;

    //     const updateFilters = () => {
    //       if (filterChanged) {
    //         this.applyFilterChanges(filterType, '', 'Status', '', '');
    //       } else if (resetFilter) {
    //         this.applyFilterChanges(0, '', 'Status', '', '');
    //       }
    //     };

    //     if (searchFlag && newSearch !== '') {
    //       if (this.state.AuditSearch !== newSearch) {
    //         this.setState({
    //           AuditSearch: newSearch,
    //           page: 1,
    //           loading: true,
    //           isRefreshing: false,
    //           isSearchFinished: true,
    //           auditList: [],
    //           auditListAll: [],
    //         }, () => {
    //           updateFilters();
    //           if (!filterChanged && !resetFilter) this.getAuditlist();
    //         });
    //       } else {
    //         updateFilters();
    //       }
    //     } else {
    //       if (this.state.AuditSearch !== '') {
    //         this.setState({
    //           AuditSearch: '',
    //           page: 1,
    //           loading: true,
    //           isRefreshing: false,
    //           isSearchFinished: true,
    //           auditList: [],
    //           auditListAll: [],
    //         }, () => {
    //           updateFilters();
    //           if (!filterChanged && !resetFilter) this.getAuditlist();
    //         });
    //       } else {
    //         this.setState({
    //           auditList: this.props.data?.audits?.audits || [],
    //           auditListAll: this.props.data?.audits?.audits || [],
    //           loading: false,
    //           isRefreshing: false,
    //           isPageEmpty: false,
    //           selectedFormat:
    //             this.props.data?.audits?.userDateFormat ?? 'DD-MM-YYYY',
    //         }, () => {
    //           updateFilters();
    //         });
    //       }
    //     }
    //   }
    // }

    componentWhenReceiveProps() {
        // componentDidUpdate(prevProps) {
        var getCurrentPage = [];
        // getCurrentPage = this.props.data.nav.routes;
        // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
        var CurrentPage = this.props?.route?.name;
        console.log('--CurrentPage--->', CurrentPage);

        if (CurrentPage == ROUTES.ALLTABAUDITLIST_SM) {
            console.log('this.state.isMounted && this.state.isLazyLoadingRequired', this.state.isMounted, this.state.isLazyLoadingRequired);
            if (this.state.isMounted && this.state.isLazyLoadingRequired) {
                console.log(
                    'this.props.searchFlag == true----this.props.onRecieveSearchSubmit',
                    this.props.searchFlag == true,
                    this.props.onRecieveSearchSubmit,
                );
                if (this.props.searchFlag == true && this.props.onRecieveSearchSubmit != '') {
                    console.log('searchFlag is true -->', this.state.AuditSearch);
                    if (this.state.AuditSearch != this.props.onRecieveSearchSubmit) {
                        console.log('After check ====>', props.onRecieveSearchSubmit);
                        this.setState(
                            {
                                AuditSearch: props.onRecieveSearchSubmit,
                                page: 1,
                                loading: true,
                                isRefreshing: false,
                                isSearchFinished: true,
                                auditList: [],
                                auditListAll: [],
                            },
                            () => {
                                if (parseInt(this.props.filterType) > 0 && this.state.filterTypeFG != parseInt(this.props.filterType)) {
                                    this.applyFilterChanges(parseInt(this.props.filterType), '', 'Status', '', '');
                                    console.log('--applyFilterChanges1---> if', CurrentPage);
                                } else if (this.state.filterTypeFG > 0 && parseInt(this.props.filterType) == 0) {
                                    this.applyFilterChanges(0, '', 'Status', '', '');
                                    console.log('--applyFilterChanges1---> elseif', CurrentPage);
                                } else {
                                    this.getAuditlist();
                                    console.log('--getAuditlist---> else', CurrentPage);
                                }
                            },
                        );
                    } else {
                        if (parseInt(this.props.filterType) > 0 && this.state.filterTypeFG != parseInt(this.props.filterType)) {
                            console.log('--applyFilterChanges2---> if', CurrentPage);
                            this.applyFilterChanges(parseInt(this.props.filterType), '', 'Status', '', '');
                        } else if (this.state.filterTypeFG > 0 && parseInt(this.props.filterType) == 0) {
                            this.applyFilterChanges(0, '', 'Status', '', '');
                            console.log('--applyFilterChanges2---> elseif', CurrentPage);
                        }
                    }
                } else {
                    console.log('searchFlag is false -->', this.state.AuditSearch);
                    if (this.state.AuditSearch != '') {
                        this.setState(
                            {
                                AuditSearch: '',
                                page: 1,
                                loading: true,
                                isRefreshing: false,
                                isSearchFinished: true,
                                auditList: [],
                                auditListAll: [],
                            },
                            () => {
                                if (parseInt(this.props.filterType) > 0 && this.state.filterTypeFG != parseInt(this.props.filterType)) {
                                    this.applyFilterChanges(parseInt(this.props.filterType), '', 'Status', '', '');
                                    console.log('--applyFilterChanges3---> if', CurrentPage);
                                } else if (this.state.filterTypeFG > 0 && parseInt(this.props.filterType) == 0) {
                                    this.applyFilterChanges(0, '', 'Status', '', '');
                                    console.log('--applyFilterChanges1---> elseif', CurrentPage);
                                } else {
                                    this.getAuditlist();
                                    console.log('--getAuditlist---> else', CurrentPage);
                                }
                            },
                        );
                    } else {
                        this.setState(
                            {
                                auditList: this.props.data.audits.audits,
                                auditListAll: this.props.data.audits.audits,
                                loading: false,
                                isRefreshing: false,
                                isPageEmpty: false,
                                selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
                            },
                            () => {
                                if (parseInt(this.props.filterType) > 0 && this.state.filterTypeFG != parseInt(this.props.filterType)) {
                                    this.applyFilterChanges(parseInt(this.props.filterType), '', 'Status', '', '');
                                    console.log('--applyFilterChanges4---> if', CurrentPage);
                                } else if (this.state.filterTypeFG > 0 && parseInt(this.props.filterType) == 0) {
                                    this.applyFilterChanges(0, '', 'Status', '', '');
                                    console.log('--applyFilterChanges4---> elseif', CurrentPage);
                                }
                            },
                        );
                    }
                }
            }
        }
    }

    async searchResult() {
        // console.log('Audit entered',this.state.AuditSearch)
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex searchResult----->', smIndex);
        var Params = [];
        var SiteID = this.props.data.audits.siteId;
        var UserID = this.props.data.audits.userId;
        var Page = 1;
        var Size = 100;
        var FilterString = '';
        var GlobalFilter = this.state.AuditSearch;
        var TOKEN = this.props.data.audits.token;
        var StartDate = '';
        var EndDate = '';
        var SM = smIndex || this.props.data.audits.smdata;

        Params.push({
            SiteID: SiteID,
            UserID: UserID,
            Page: Page,
            Size: Size,
            FilterString: FilterString,
            GlobalFilter: GlobalFilter,
            StartDate: StartDate,
            EndDate: EndDate,
            SM: SM,
        });

        auth.getGlobalSearch(Params, TOKEN, (res, data) => {
            console.log('response', data);
            if (data.data.Message == 'Success') {
                this.setState(
                    {
                        auditList: data.data.Data,
                        auditListAll: data.data.Data,
                        loading: false,
                        isRefreshing: false,
                        isPageEmpty: false,
                        selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
                    },
                    () => {
                        // console.log('auditList',this.state.auditList);
                    },
                );
            }
        });
    }

    getSessionValues = () => {
        try {
            const USERID = this.props.data.audits.userId;
            const TOKEN = this.props.data.audits.token;
            const SITEID = this.props.data.audits.siteId;
            if (TOKEN !== null) {
                this.setState(
                    {
                        token: TOKEN,
                        userId: USERID,
                        siteId: SITEID,
                        loading: true,
                    },
                    () => {
                        if (this.props.data.audits.isOfflineMode) {
                            this.setState({
                                auditList: this.props.data.audits.audits,
                                auditListAll: this.props.data.audits.audits,
                                loading: false,
                                isRefreshing: false,
                                isPageEmpty: false,
                                isMounted: true,
                            });
                        } else {
                            NetInfo.fetch().then(netState => {
                                if (netState.isConnected) {
                                    this.getAuditlist();
                                } else {
                                    this.setState(
                                        {
                                            auditList: this.props.data.audits.audits,
                                            auditListAll: this.props.data.audits.audits,
                                            loading: false,
                                            isRefreshing: false,
                                            isPageEmpty: false,
                                            isMounted: true,
                                        },
                                        () => {
                                            // console.log('auditList',this.state.auditList);
                                            // console.log('AuditDashBody Props After State Changing...', this.props)
                                        },
                                    );
                                }
                            });
                        }
                    },
                );
            }
        } catch (error) {
            // Error retrieving data
            // console.log('Failed to retrive a login session!!!',error)
        }
    };

    getRecentAuditlist = async (startDate, endDate) => {
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex getRecentAuditlist----->', smIndex);
        if (this.props.data.audits.isOfflineMode) {
            this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
            this.setState({
                auditList: this.props.data.audits.audits,
                auditListAll: this.props.data.audits.audits,
                loading: false,
                isRefreshing: false,
                isLazyLoading: false,
                isLazyLoadingRequired: false,
                isPageEmpty: false,
                isMounted: true,
            });
        }
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                console.log('getAuditlist ------>222222',this?.props?.route?.params?.filter_Arr[0]?.startDate);
                console.log('getAuditlist ------>222222',this?.props?.route?.params?.filter_Arr[0]?.endDate);
                var pageNo = this.state.page;
                // var token = this.props.data.audits.token;
                // var userId = this.props.data.audits.userId;
                // var siteId = this.props.data.audits.siteId;
                const token = this.state.accessToken || this.props.data.audits.token;
                const siteId = this.state.siteId || this.props.data.audits.siteId;
                const userId = this.state.userId || this.props.data.audits.userId;
                var filterId = this.state.filterId;
                var pageSize = 10;
                var GlobalFilter = this.state.AuditSearch;
                var StartDate = this?.props?.route?.params?.filter_Arr[0]?.startDate == undefined ? '' : this?.props?.route?.params?.filter_Arr[0]?.startDate;
                var EndDate = this?.props?.route?.params?.filter_Arr[0]?.endDate == undefined ? '' : this?.props?.route?.params?.filter_Arr[0]?.endDate;
                // var SortBy = this.state.SortBy;
                var SortBy = '';
                var SortOrder = this.state.SortOrder;
                var Default = 0;
                var SM = smIndex || this.props.data.audits.smdata;
                console.log(
                    'api date',
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
                    SM,
                    Default,
                );

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
                    3,
                    Default,
                    (response, data) => {
                        console.log('AuditList list data', data);
                        console.log('AuditList list data', data?.data?.Data, '----', data.data.Message, '----', this.props);

                        if (data.data) {
                            if (data.data.Message == 'Success') {
                                var auditRecords = this.props.data.audits.auditRecords;
                                console.log('audit Records', auditRecords);
                                console.log('auditList API response', data.data);
                                console.log('auditList from props', this.props.data.audits.audits);
                                var auditList = [];
                                var auditListProps = this.props.data.audits.audits;

                                for (var i = 0; i < data.data.Data.length; i++) {
                                    var auditInfo = data.data.Data[i];
                                    auditInfo['color'] = '#1081de';
                                    auditInfo['cStatus'] = constant.StatusScheduled;
                                    auditInfo['key'] = this.keyVal + 1;

                                    // Set Audit Status
                                    if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === '7' || auditInfo.CloseOutStatus === '9')) {
                                        auditInfo['cStatus'] = constant.StatusCompleted;
                                    } else if (data.data.Data[i].AuditStatus == 3) {
                                        auditInfo['cStatus'] = constant.Completed;
                                    } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 0) {
                                        auditInfo['cStatus'] = constant.StatusScheduled;
                                    } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 1) {
                                        auditInfo['cStatus'] = constant.StatusProcessing;
                                    } else if (data.data.Data[i].AuditStatus == 4) {
                                        auditInfo['cStatus'] = constant.StatusDV;
                                    } else if (data.data.Data[i].AuditStatus == 5) {
                                        auditInfo['cStatus'] = constant.StatusDVC;
                                    }

                                    for (var j = 0; j < auditRecords.length; j++) {
                                        if (parseInt(auditRecords[j].AuditId) == parseInt(data.data.Data[i].ActualAuditId)) {
                                            // Update Audit Status
                                            console.log('auditRecords AuditRecordStatus', auditRecords[j].AuditRecordStatus);
                                            if (
                                                auditRecords[j].AuditRecordStatus == constant.StatusDownloaded ||
                                                auditRecords[j].AuditRecordStatus == constant.StatusNotSynced ||
                                                auditRecords[j].AuditRecordStatus == constant.StatusSynced
                                            ) {
                                                auditInfo['cStatus'] = auditRecords[j].AuditRecordStatus;
                                            }
                                            break;
                                        }
                                    }

                                    // Set Audit Card color by checking its Status
                                    auditInfo['color'] = this.getColorCode(auditInfo['cStatus']);

                                    auditList.push(auditInfo);
                                    this.keyVal = this.keyVal + 1;
                                }

                                try {
                                    console.log('this.state.auditList.concat(auditList)', this.state.auditList);

                                    var finalAuditListAll = this.state.auditListAll.concat(auditList);
                                    var finalAuditList = this.state.auditList.concat(auditList);

                                    let bufferList = Array.from(new Set(auditList));
                                    console.log('bufferList', bufferList);

                                    // Store audit list in redux store to set it in persistant storage
                                    this.props.storeAudits(bufferList);

                                    if (StartDate != '' && EndDate != '') {
                                        this.setState({
                                            auditList: finalAuditList.filter(item => {
                                                var isDateInRange = false;

                                                if (item && StartDate && EndDate) {
                                                    var sDateArr = StartDate.split('-');
                                                    var eDateArr = EndDate.split('-');
                                                    var sAuditDateArr = item.StartDate.split('T')[0].split('-');
                                                    var eAuditDateArr = item.EndDate.split('T')[0].split('-');

                                                    var startDateFilter = new Date(sDateArr[2], sDateArr[0] - 1, sDateArr[1]);
                                                    var endDateFilter = new Date(eDateArr[2], eDateArr[0] - 1, eDateArr[1]);
                                                    var startDateAudit = new Date(sAuditDateArr[0], sAuditDateArr[1] - 1, sAuditDateArr[2]);
                                                    var endDateAudit = new Date(eAuditDateArr[0], eAuditDateArr[1] - 1, eAuditDateArr[2]);

                                                    var range = moment.range(startDateFilter, endDateFilter);

                                                    if (range.contains(startDateAudit)) {
                                                        isDateInRange = true;
                                                    }

                                                    if (range.contains(endDateAudit)) {
                                                        isDateInRange = true;
                                                    }
                                                } else {
                                                    isDateInRange = true;
                                                }

                                                return isDateInRange;
                                            }),
                                            auditListAll: finalAuditListAll,
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isPageEmpty: false,
                                            isMounted: true,
                                            isErrorRefresh: false,
                                        });
                                    } else {
                                        this.setState({
                                            auditList: finalAuditList,
                                            auditListAll: finalAuditListAll,
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isPageEmpty: false,
                                            isMounted: true,
                                            isErrorRefresh: false,
                                        });
                                    }
                                } catch (e) {
                                    console.warn('Error', e);
                                    this.setState(
                                        {
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isMounted: true,
                                            isPageEmpty: true,
                                            isErrorRefresh: true,
                                            auditList: [],
                                            auditListAll: [],
                                            SortBy: 'StartDate',
                                        },
                                        () => {
                                            // this.getAuditlist()
                                            // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
                                        },
                                    );
                                }
                            } else {
                                console.log('Error in here fetching list');
                                this.setState(
                                    {
                                        loading: false,
                                        isRefreshing: false,
                                        isLazyLoading: false,
                                        isLazyLoadingRequired: true,
                                        isMounted: true,
                                        isPageEmpty: true,
                                        isErrorRefresh: false,
                                    },
                                    () => {
                                        console.log('auditList', this.state.auditList);
                                        console.log('AuditDashBody Props After State Changing1...', this.props);
                                        // this.props.onFilterChange(this.state.cFilterVal)
                                    },
                                );
                            }
                        } else {
                            console.log('Error in error fetching list');
                            this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
                            this.setState(
                                {
                                    loading: false,
                                    isRefreshing: false,
                                    isLazyLoading: false,
                                    isLazyLoadingRequired: true,
                                    isMounted: true,
                                    isPageEmpty: true,
                                    isErrorRefresh: false,
                                },
                                () => {
                                    console.log('auditList', this.state.auditList);
                                    console.log('AuditDashBody Props After State Changing2...', this.props);
                                    //this.props.onFilterChange(this.state.cFilterVal)
                                },
                            );
                        }
                    },
                );
            } else {
                this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
                this.setState(
                    {
                        auditList: this.props.data.audits.audits,
                        auditListAll: this.props.data.audits.audits,
                        loading: false,
                        isRefreshing: false,
                        isLazyLoading: false,
                        isLazyLoadingRequired: false,
                        isPageEmpty: false,
                        isMounted: true,
                        isErrorRefresh: false,
                    },
                    () => {
                        console.log('auditList', this.state.auditList);
                        console.log('AuditDashBody Props After State Changing3...', this.props);
                        //this.props.onFilterChange(this.state.cFilterVal)
                    },
                );
            }
        });

        /**

  else{


    this.setState({
      auditList: this.props.data.audits.audits, 
      auditListAll: this.props.data.audits.audits, 
      loading: false, 
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: false,
      isPageEmpty: false,
      isMounted: true
    }, () => {
      // console.log('auditList',this.state.auditList);
      // console.log('AuditDashBody Props After State Changing...', this.props)
      //this.props.onFilterChange(this.state.cFilterVal)             
    });



  }
  '      */
    };

    getAuditlist = async (startDate, endDate) => {
        var smIndex = await AsyncStorage.getItem('supplierIndex');
        console.log('smIndex getAuditLists----->', smIndex);
        if (this.props.data.audits.isOfflineMode) {
            this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
            this.setState({
                auditList: this.props.data.audits.audits,
                auditListAll: this.props.data.audits.audits,
                loading: false,
                isRefreshing: false,
                isLazyLoading: false,
                isLazyLoadingRequired: false,
                isPageEmpty: false,
                isMounted: true,
            });
        }
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                console.log('getAuditlist ------>3333');
                var pageNo = this.state.page;
                // var token = this.props.data.audits.token;
                // var userId = this.props.data.audits.userId;
                // var siteId = this.props.data.audits.siteId;
                const token = this.state.accessToken || this.props.data.audits.token;
                const siteId = this.state.siteId || this.props.data.audits.siteId;
                const userId = this.state.userId || this.props.data.audits.userId;
                var filterId = this.state.filterId;
                var pageSize = 10;
                var GlobalFilter = this.state.AuditSearch;
                var StartDate = this?.props?.route?.params?.filter_Arr[0]?.startDate == undefined ? '' : this?.props?.route?.params?.filter_Arr[0]?.startDate;
                var EndDate = this?.props?.route?.params?.filter_Arr[0]?.endDate == undefined ? '' : this?.props?.route?.params?.filter_Arr[0]?.endDate;
                // var SortBy = this.state.SortBy;
                var SortBy = '';
                var SortOrder = this.state.SortOrder;
                var Default = 1;
                var SM = smIndex || this.props.data.audits.smdata;
                console.log(
                    'api date',
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
                    SM,
                    Default,
                );

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
                    3,
                    Default,
                    (response, data) => {
                        console.log('AuditList list data', data);
                        console.log('AuditList list data', data?.data?.Data, '----', data.data.Message, '----', this.props);

                        if (data.data) {
                            if (data.data.Message == 'Success') {
                                var auditRecords = this.props.data.audits.auditRecords;
                                console.log('audit Records', auditRecords);
                                console.log('auditList API response', data.data);
                                console.log('auditList from props', this.props.data.audits.audits);
                                var auditList = [];
                                var auditListProps = this.props.data.audits.audits;

                                for (var i = 0; i < data.data.Data.length; i++) {
                                    var auditInfo = data.data.Data[i];
                                    auditInfo['color'] = '#1081de';
                                    auditInfo['cStatus'] = constant.StatusScheduled;
                                    auditInfo['key'] = this.keyVal + 1;

                                    // Set Audit Status
                                    if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === '7' || auditInfo.CloseOutStatus === '9')) {
                                        auditInfo['cStatus'] = constant.StatusCompleted;
                                    } else if (data.data.Data[i].AuditStatus == 3) {
                                        auditInfo['cStatus'] = constant.Completed;
                                    } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 0) {
                                        auditInfo['cStatus'] = constant.StatusScheduled;
                                    } else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 1) {
                                        auditInfo['cStatus'] = constant.StatusProcessing;
                                    } else if (data.data.Data[i].AuditStatus == 4) {
                                        auditInfo['cStatus'] = constant.StatusDV;
                                    } else if (data.data.Data[i].AuditStatus == 5) {
                                        auditInfo['cStatus'] = constant.StatusDVC;
                                    }

                                    for (var j = 0; j < auditRecords.length; j++) {
                                        if (parseInt(auditRecords[j].AuditId) == parseInt(data.data.Data[i].ActualAuditId)) {
                                            // Update Audit Status
                                            console.log('auditRecords AuditRecordStatus', auditRecords[j].AuditRecordStatus);
                                            if (
                                                auditRecords[j].AuditRecordStatus == constant.StatusDownloaded ||
                                                auditRecords[j].AuditRecordStatus == constant.StatusNotSynced ||
                                                auditRecords[j].AuditRecordStatus == constant.StatusSynced
                                            ) {
                                                auditInfo['cStatus'] = auditRecords[j].AuditRecordStatus;
                                            }
                                            break;
                                        }
                                    }

                                    // Set Audit Card color by checking its Status
                                    auditInfo['color'] = this.getColorCode(auditInfo['cStatus']);

                                    auditList.push(auditInfo);
                                    this.keyVal = this.keyVal + 1;
                                }

                                try {
                                    console.log('this.state.auditList.concat(auditList)', this.state.auditList);

                                    var finalAuditListAll = this.state.auditListAll.concat(auditList);
                                    var finalAuditList = this.state.auditList.concat(auditList);

                                    let bufferList = Array.from(new Set(auditList));
                                    console.log('bufferList', bufferList);

                                    // Store audit list in redux store to set it in persistant storage
                                    this.props.storeAudits(bufferList);

                                    if (StartDate != '' && EndDate != '') {
                                        this.setState({
                                            auditList: finalAuditList.filter(item => {
                                                var isDateInRange = false;

                                                if (item && StartDate && EndDate) {
                                                    var sDateArr = StartDate.split('-');
                                                    var eDateArr = EndDate.split('-');
                                                    var sAuditDateArr = item.StartDate.split('T')[0].split('-');
                                                    var eAuditDateArr = item.EndDate.split('T')[0].split('-');

                                                    var startDateFilter = new Date(sDateArr[2], sDateArr[0] - 1, sDateArr[1]);
                                                    var endDateFilter = new Date(eDateArr[2], eDateArr[0] - 1, eDateArr[1]);
                                                    var startDateAudit = new Date(sAuditDateArr[0], sAuditDateArr[1] - 1, sAuditDateArr[2]);
                                                    var endDateAudit = new Date(eAuditDateArr[0], eAuditDateArr[1] - 1, eAuditDateArr[2]);

                                                    var range = moment.range(startDateFilter, endDateFilter);

                                                    if (range.contains(startDateAudit)) {
                                                        isDateInRange = true;
                                                    }

                                                    if (range.contains(endDateAudit)) {
                                                        isDateInRange = true;
                                                    }
                                                } else {
                                                    isDateInRange = true;
                                                }

                                                return isDateInRange;
                                            }),
                                            auditListAll: finalAuditListAll,
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isPageEmpty: false,
                                            isMounted: true,
                                            isErrorRefresh: false,
                                        });
                                    } else {
                                        this.setState({
                                            auditList: finalAuditList,
                                            auditListAll: finalAuditListAll,
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isPageEmpty: false,
                                            isMounted: true,
                                            isErrorRefresh: false,
                                        });
                                    }
                                } catch (e) {
                                    console.warn('Error', e);
                                    this.setState(
                                        {
                                            loading: false,
                                            isRefreshing: false,
                                            isLazyLoading: false,
                                            isLazyLoadingRequired: true,
                                            isMounted: true,
                                            isPageEmpty: true,
                                            isErrorRefresh: true,
                                            auditList: [],
                                            auditListAll: [],
                                            SortBy: 'StartDate',
                                        },
                                        () => {
                                            // this.getAuditlist()
                                            // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
                                        },
                                    );
                                }
                            } else {
                                console.log('Error in here fetching list');
                                this.setState(
                                    {
                                        loading: false,
                                        isRefreshing: false,
                                        isLazyLoading: false,
                                        isLazyLoadingRequired: true,
                                        isMounted: true,
                                        isPageEmpty: true,
                                        isErrorRefresh: false,
                                    },
                                    () => {
                                        console.log('auditList', this.state.auditList);
                                        console.log('AuditDashBody Props After State Changing1...', this.props);
                                        // this.props.onFilterChange(this.state.cFilterVal)
                                    },
                                );
                            }
                        } else {
                            console.log('Error in error fetching list');
                            this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
                            this.setState(
                                {
                                    loading: false,
                                    isRefreshing: false,
                                    isLazyLoading: false,
                                    isLazyLoadingRequired: true,
                                    isMounted: true,
                                    isPageEmpty: true,
                                    isErrorRefresh: false,
                                },
                                () => {
                                    console.log('auditList', this.state.auditList);
                                    console.log('AuditDashBody Props After State Changing2...', this.props);
                                    //this.props.onFilterChange(this.state.cFilterVal)
                                },
                            );
                        }
                    },
                );
            } else {
                this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
                this.setState(
                    {
                        auditList: this.props.data.audits.audits,
                        auditListAll: this.props.data.audits.audits,
                        loading: false,
                        isRefreshing: false,
                        isLazyLoading: false,
                        isLazyLoadingRequired: false,
                        isPageEmpty: false,
                        isMounted: true,
                        isErrorRefresh: false,
                    },
                    () => {
                        console.log('auditList', this.state.auditList);
                        console.log('AuditDashBody Props After State Changing3...', this.props);
                        //this.props.onFilterChange(this.state.cFilterVal)
                    },
                );
            }
        });

        /**

  else{


    this.setState({
      auditList: this.props.data.audits.audits, 
      auditListAll: this.props.data.audits.audits, 
      loading: false, 
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: false,
      isPageEmpty: false,
      isMounted: true
    }, () => {
      // console.log('auditList',this.state.auditList);
      // console.log('AuditDashBody Props After State Changing...', this.props)
      //this.props.onFilterChange(this.state.cFilterVal)             
    });



  }
  '      */
    };

    listFooter() {
        console.log('footer enabled');
        return <View>{this.state.isLazyLoading ? <ActivityIndicator animating size="large" /> : <View></View>}</View>;
    }

    handleEnd() {
        // console.log('handle reach')
        if (!this.state.isPageEmpty && !this.state.isLocalFilterApplied && !this.state.isLazyLoading && this.state.isLazyLoadingRequired) {
            if (this.props.data.audits.isOfflineMode) {
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
            } else {
                NetInfo.fetch().then(netState => {
                    if (netState.isConnected) {
                        this.setState({ page: this.state.page + 1 }, () => {
                            console.log('page', this.state.page);
                            // if (this.props.navigation.getParam('filter_Arr')) {
                            if (this.props?.route?.params?.filter_Arr) {
                                // let filter_Arr = this.props.navigation.getParam('filter_Arr');
                                let filter_Arr = this.props?.route?.params?.filter_Arr;
                                let startDate = filter_Arr[0].startDate;
                                let endDate = filter_Arr[0].endDate;
                                if (startDate && endDate) {
                                    this.getAuditlist(startDate, endDate);
                                } else {
                                    this.getAuditlist();
                                }
                            } else {
                                this.getAuditlist();
                            }
                        });
                    } else {
                        this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
                    }
                });
            }
        }
    }

    openAuditPage(iAuditDetails) {
        var auditRecords = this.props.data.audits.auditRecords;
        var isDownloadedDone = false;

        //alert("MultiProcess:"+iAuditDetails.multiprocess);

        for (var i = 0; i < auditRecords.length; i++) {
            if (auditRecords[i].AuditId == iAuditDetails.ActualAuditId) {
                isDownloadedDone = true;
            }
        }

        console.log('AllTab:>To Audit Page :', iAuditDetails);

        if (isDownloadedDone) {
            this.props.navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                datapass: iAuditDetails,
            });
        } else {
            if (this.props.data.audits.isOfflineMode) {
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
            } else {
                NetInfo.fetch().then(netState => {
                    if (netState.isConnected) {
                        this.props.navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                            datapass: iAuditDetails,
                        });
                    } else {
                        this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
                    }
                });
            }
        }
    }

    loadRecentAudits() {
        if (this.props.data.audits.recentAudits && this.props.data.audits.audits) {
            var recent = this.props.data.audits.recentAudits;
            var AllauditList = this.props.data.audits.audits;
            var AllauditRecordList = this.props.data.audits.auditRecords;
            console.log('AllauditList:AllauditRecordList>', AllauditRecordList);
            var total_arr = [];
            console.log('AllauditList:>', AllauditList);
            for (var i = 0; i < recent.length; i++) {
                var flag = false;
                console.log('AllauditList:Recent>', i, recent[i]);
                for (var j = 0; j < AllauditList.length; j++) {
                    console.log('AllauditList-j:>', j, AllauditList[j]);
                    if (recent[i].ActualAuditId == AllauditList[j].ActualAuditId) {
                        var index = AllauditRecordList.findIndex(o => o.AuditId == AllauditList[j].ActualAuditId);
                        if (index != -1)
                            //AllauditList[j].cStatus = AllauditRecordList[index].AuditRecordStatus;
                            total_arr.push({ ...AllauditList[j], cStatus: AllauditRecordList[index].AuditRecordStatus });
                        flag = true;
                    }
                }
                if (!flag) {
                    total_arr.push(recent[i]);
                }
            }
            this.props.updateRecentAuditList(total_arr);
            this.setState(
                {
                    //   auditList: this.props.data.audits.recentAudits,
                    recentAudits: total_arr.reverse(),
                    //   loading: false,
                    //   isRefreshing: false,
                    //   isLazyLoading: false,
                    //   isPageEmpty: false,
                    //   isMounted: true,
                    //   isLazyLoadingRequired: false
                },
                () => {
                    // this.props.updateRecentAuditList(total_arr)
                    // console.log('auditList',this.state.auditList);
                },
            );
        }
    }

    handleRefresh() {
        /* if(this.props.data.audits.isAuditing) {
          this.refs.toast.show('Refresh restricted!!! Unsynced audit records found. Please sync it before refreshing!',DURATION.LENGTH_LONG)
        }
        else { */
        console.log('reach handlerefresh ======');
        if (this.props.data.audits.isOfflineMode) {
            this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
            this.setState({
                auditList: this.props.data.audits.audits,
                auditListAll: this.props.data.audits.audits,
                loading: false,
                isRefreshing: false,
                isLazyLoading: false,
                isLazyLoadingRequired: false,
                isPageEmpty: false,
                isMounted: true,
                isErrorRefresh: false,
            });
            console.log('reach handlerefresh if======');
        } else {
            NetInfo.fetch().then(netState => {
                if (netState.isConnected) {
                    this.setState(
                        {
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isPageEmpty: false,
                            //filterId: '',
                            auditList: [],
                            auditListAll: [],
                            isErrorRefresh: false,
                        },
                        () => {
                            this.getAuditlist();
                            console.log('reach handlerefresh else======');
                        },
                    );
                } else {
                    this.refs.toast.show(strings.No_refresh, DURATION.LENGTH_LONG);
                    this.setState({
                        auditList: this.props.data.audits.audits,
                        auditListAll: this.props.data.audits.audits,
                        loading: false,
                        isRefreshing: false,
                        isLazyLoading: false,
                        isLazyLoadingRequired: false,
                        isPageEmpty: false,
                        isMounted: true,
                        isErrorRefresh: false,
                    });
                    console.log('reach handlerefresh last else======');
                }
            });
        }
        /* } */
    }

    applyFilterChanges(sortype, droptext, filterType, startDate, endDate, AuditSearch) {
        console.log('sortype', sortype);
        console.log('droptext', droptext);
        console.log('filterType', filterType);
        console.log('startDate----->', startDate);
        console.log('endDate ---->', endDate);

        if (filterType == 'Forms' || filterType == 'Calendar') {
            this.setState({
                isLocalFilterApplied: true,
                SortBy: '',
                SortOrder: '',
                cFilterVal: 0,
            });
        } else {
            this.setState({
                isLocalFilterApplied: false,
            });
        }

        this.setState({ loading: true }, () => {
            switch (filterType) {
                case 'All':
                    this.setState(
                        {
                            filterId: '',
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isLazyLoadingRequired: true,
                            isErrorRefresh: false,
                            auditList: [],
                            auditListAll: [],
                            SortBy: '',
                            SortOrder: '',
                            cFilterVal: 0,
                        },
                        () => {
                            this.handleRefresh();
                        },
                    );
                    break;
                case 'Recent':
                    this.setState(
                        {
                            filterId: '',
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isLazyLoadingRequired: false,
                            isErrorRefresh: false,
                            auditList: [],
                            auditListAll: [],
                            SortBy: '',
                            SortOrder: '',
                            cFilterVal: 0,
                        },
                        () => {
                            this.loadRecentAudits();
                        },
                    );
                    break;
                case 'Forms':
                    if (sortype == 0) {
                        this.setState({
                            auditList: this.state.auditListAll.filter(item => item.cStatus == constant.StatusDownloaded),
                            loading: false,
                            isLazyLoadingRequired: false,
                        });
                    } else if (sortype == 1) {
                        this.setState({
                            auditList: this.state.auditListAll.filter(item => item.cStatus == constant.StatusNotSynced),
                            loading: false,
                            isLazyLoadingRequired: false,
                        });
                    } else if (sortype == 2) {
                        this.setState({
                            auditList: this.state.auditListAll.filter(item => item.cStatus == constant.StatusSynced),
                            loading: false,
                            isLazyLoadingRequired: false,
                        });
                    }
                    break;
                case 'Status':
                    this.setState(
                        {
                            filterId: '',
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isLazyLoadingRequired: true,
                            auditList: [],
                            auditListAll: [],
                            filterTypeFG: 0,
                            SortBy: '',
                            SortOrder: '',
                            cFilterVal: sortype,
                            AuditSearch: AuditSearch,
                        },
                        () => {
                            this.getAuditlist();
                            //this.props.onFilterChange(sortype)
                        },
                    );
                case 'Sort':
                    this.setState(
                        {
                            filterId: '',
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isLazyLoadingRequired: true,
                            auditList: [],
                            auditListAll: [],
                            filterTypeFG: 0,
                            SortBy: droptext,
                            SortOrder: sortype == 0 ? 'desc' : 'asc',
                            cFilterVal: 0,
                        },
                        () => {
                            this.getAuditlist();
                        },
                    );
                    // if(sortype == 0) {
                    //   var auditListSort = Immutable.asMutable(this.state.auditListAll).sort(this.GetSortOrder(droptext, 1))
                    //   this.setState({
                    //     auditList: auditListSort,
                    //     isLazyLoadingRequired: false,
                    //     loading: false
                    //   })
                    // }
                    // else if(sortype == 1) {
                    //   var auditListSort = Immutable.asMutable(this.state.auditListAll).sort(this.GetSortOrder(droptext, 2))
                    //   this.setState({
                    //     auditList: auditListSort,
                    //     isLazyLoadingRequired: false,
                    //     loading: false
                    //   })
                    // }
                    break;
                case 'Calendar':
                    // console.log('cal filter...')
                    // console.log('StartDate here',startDate)
                    // console.log('EndDate here',endDate)

                    this.setState(
                        {
                            filterId: '',
                            page: 1,
                            loading: true,
                            isRefreshing: true,
                            isLazyLoadingRequired: true,
                            isErrorRefresh: false,
                            auditList: [],
                            auditListAll: [],
                            SortBy: '',
                            SortOrder: '',
                            cFilterVal: 0,
                        },
                        () => {
                            this.getAuditlist(startDate, endDate);
                        },
                    );
                    break;
                default:
                    break;
            }
        });
    }

    //Comparer Function
    GetSortOrder(prop, type) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                if (type == 1) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (a[prop] < b[prop]) {
                if (type == 1) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return 0;
        };
    }

    getAuditStatus = status => {
        // console.warn('======',status)
        var percent = 0;
        // Set Audit Card color by checking its Status
        switch (status) {
            case constant.StatusScheduled:
                percent = 10;
                break;
            case constant.StatusDownloaded:
                percent = 30;
                break;
            case constant.StatusNotSynced:
                percent = 70;
                break;
            case constant.StatusProcessing:
                percent = 50;
                break;
            case constant.StatusSynced:
                percent = 90;
                break;
            case constant.StatusCompleted:
                percent = 100;
                break;
            case constant.StatusDV:
                percent = 60;
                break;
            case constant.StatusDVC:
                percent = 100;
                break;
            default:
                percent = 10;
                break;
        }

        return percent;
    };

    //Guru -- 26/09/2022 - cicle & statusbar color changed as per web dev shared..
    getAuditCircleColor = (status, status_or_circle) => {
        // console.warn('======',status)
        var circlecolor = 0;
        var statusbarcolor = 0;
        // Set Audit Card color by checking its Status
        switch (status) {
            case constant.StatusScheduled:
                circlecolor = '#0000FF';
                statusbarcolor = '#0000FF';
                break;
            case constant.StatusCompleted:
                circlecolor = '#00FF00';
                statusbarcolor = '#00FF00';
                break;
            case constant.StatusDV:
                circlecolor = '#FF0000';
                statusbarcolor = '#FF0000';
                break;
            case constant.StatusDVC:
                circlecolor = '#000000';
                statusbarcolor = '#000000';
                break;
            default:
                circlecolor = '';
                statusbarcolor = '';
                break;
        }
        if (status_or_circle == 0) {
            return circlecolor;
        } else if (status_or_circle == 1) {
            return statusbarcolor;
        }
        console.log('circelcolor' + circlecolor + ' statue bar color' + statusbarcolor);
    };

    changeDateFormatCard = inDate => {
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat; // + ' ' + 'HH:mm';
            var sDateArr = inDate.split('T');
            var sDateValArr = sDateArr[0].split('-');
            var sTimeValArr = sDateArr[1].split(':');
            var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2]);
            return Moment(outDate).format(DefaultFormatL);
        }
    };

    render() {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!ALLTABLIST', this.props?.route?.params);
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? (
                    <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }} />
                ) : (
                    <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }} />
                )}
                {/* <NavigationEvents onDidFocus={() =>  this.handleRefresh()} /> */}
                <OfflineNotice />
                <View style={styles.headerCont}>
                    <ImageBackground source={Images.DashboardBG} style={styles.bgCont}>
                        {this.renderHeader()}
                    </ImageBackground>
                </View>

                <View style={styles.bodyCont}>
                    <ScrollableTabView
                        initialPage={this.state.activeTab}
                        renderTabBar={() => (
                            <DefaultTabBar
                                backgroundColor="white"
                                activeTextColor="#2CB5FD"
                                inactiveTextColor="#747474"
                                underlineStyle={{
                                    backgroundColor: '#2CB5FD',
                                    borderBottomColor: '#2CB5FD',
                                    height: Platform.select({
                                        android: 0,
                                        ios: 5,
                                    }),
                                }}
                                textStyle={{
                                    fontSize: Fonts.size.medium,
                                    fontFamily: 'OpenSans-Regular',
                                }}
                            />
                        )}
                        tabBarPosition="overlayTop"
                        onChangeTab={() => this.loadRecentAudits()}>
                        {this.allAudits()}
                        {this.recentAudits()}
                        {this.todayAudits()}
                    </ScrollableTabView>
                </View>
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'black', margin: 20 }}
                    position="bottom"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state,
        siteId: state.siteId,
        isDeviceRegistered: state.isDeviceRegistered,
        notifications: state.notifications,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeAudits: audits => dispatch({ type: 'STORE_AUDITS', audits }),
        changeAuditState: isAuditing => dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
        updateRecentAuditList: recentAudits => dispatch({ type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits }),
        storeAuditRecords: auditRecords => dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
        storeSupplierData: smdata => dispatch({ type: 'STORE_SUPPLIER_DATA', smdata }),
        storeSiteId: siteId => dispatch({ type: 'STORE_SITE_ID', siteId }),
        //Static Login
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
        storeCameraCapture: cameraCapture => dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
        storeLanguage: language => dispatch({ type: 'STORE_LANGUAGE', language }),
        storeAuditStats: (scheduled, completed, DeadlineViolated, CompletedDeadlineViolated) =>
            dispatch({
                type: 'STORE_AUDIT_STATS',
                scheduled,
                completed,
                DeadlineViolated,
                CompletedDeadlineViolated,
            }),
        storeServerUrl: serverUrl => dispatch({ type: 'STORE_SERVER_URL', serverUrl }),
        changeConnectionState: isConnected => dispatch({ type: 'CHANGE_CONNECTION_STATE', isConnected }),
        storeDateFormat: userDateFormat => dispatch({ type: 'STORE_DATE_FORMAT', userDateFormat }),
        updateRecentAuditList: recentAudits => dispatch({ type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits }),
        storeUserName: loginuser => dispatch({ type: 'STORE_USER_NAME', loginuser }),
        storeLoginData: logindata => dispatch({ type: 'STORE_LOGIN_DATA', logindata }),
        storeSupplierManagement: suppliermanagementstatus => dispatch({ type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus }),
        updateAuditCount: auditCount => dispatch({ type: 'UPDATE_AUDIT_COUNT', auditCount }),
        updateDynamicAuditCount: data => dispatch({ type: 'UPDATE_DYNAMIC_AUDIT_COUNT', data }),
        registrationState: isDeviceRegistered => dispatch({ type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered }),
        storeDeviceid: deviceid => dispatch({ type: 'STORE_DEVICEID', deviceid }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTabAuditList);
