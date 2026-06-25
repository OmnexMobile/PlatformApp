import React, { Component } from 'react';
import { View, ImageBackground, TouchableOpacity, Text, FlatList, Platform, ActivityIndicator, Image, LogBox, Modal, Pressable, StyleSheet } from 'react-native';
//styles
import styles from '../../auditPro/styles/AuditDashboardListingStyle';
//components
import OfflineNotice from '../../auditPro/components/OfflineNotice';
//library
import * as _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { DoubleBounce } from 'react-native-loader';
import { connect } from 'react-redux';
//assets
import { Fonts, Images } from '../../auditPro/Themes';
import { IMAGES } from 'assets/images';

import Icon from 'react-native-vector-icons/Feather';
//services
import auth from '../../../services/SupplierMgnt-Auth';
//strings
import { strings } from '../../auditPro/language/Language';
//const
import constant from '../../../constants/SupplierMgnt/AppConstants';
import { ROUTES } from 'constants/app-constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuditCardSM from 'screens/auditPro/components/AuditCardSM';
import { Content, Header, ListSearch, NoRecordFound } from 'components';
import GlobalHeader from 'components/GlobalHeader';
import { ThemeContext } from 'theme/ThemeProvider';
const { whitneyBook_18 } = Fonts.style;
const { blackGrey } = Fonts.colors;
const ACTION_DROPDOWN_OPTIONS = [
    // { key: 'filter', label: strings.filter || 'Filter', icon: 'filter' },
    // { key: 'calendar', label: strings.calendar || 'Calendar', icon: 'calendar' },
    { key: 'download', label: strings.downloads || 'Downloads', icon: 'download' },
    { key: 'syncDetails', label: strings.Sync_Details || 'Sync Details', icon: 'refresh-cw' },
];

const actionMenuStyles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    searchArea: {
        flex: 1,
    },
    wrapper: {
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DFE7F3',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dismissLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    dropdownContainer: {
        position: 'absolute',
        top: Platform.select({ ios: 146, android: 126, default: 126 }),
        right: 14,
        alignItems: 'flex-end',
        zIndex: 41,
        elevation: 41,
    },
    arrow: {
        width: 14,
        height: 14,
        marginRight: 17,
        marginBottom: -7,
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: '#E6ECF5',
        transform: [{ rotate: '45deg' }],
        zIndex: 2,
    },
    box: {
        width: 190,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E6ECF5',
        paddingVertical: 6,
        shadowColor: '#123C95',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 44,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEF2F8',
    },
    itemLast: {
        borderBottomWidth: 0,
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF4FF',
        marginRight: 10,
    },
    label: {
        fontSize: 14,
        color: '#334155',
        fontFamily: 'OpenSans-SemiBold',
    },
});

class AuditDashboardListing extends Component {
    static contextType = ThemeContext;
    constructor(props) {
        super(props);
        console.log('get props---->', props);
        this.pageSize = 10;
        this.pageNo = 1;
        this.onEndReachedCalledDuringMomentum = false;
        // this.filterId = this.props.navigation.getParam('filterId');
        this.currentUserData = this.props?.route?.params?.currentUserData;
        console.log('Received User Data --->', this.props);

        this.state = {
            listEndReached: false,
            loader: true,
            error: false,
            subLoader: false,
            auditList: [],
            auditListAll: [],
            filterID: 0,
            SM: 0,
            actionDropdownVisible: false,
        };
    }

    async componentDidMount() {
        LogBox.ignoreLogs(['componentWillReceiveProps has been renamed']);
        // this.currentUserData = this.props?.route?.params?.currentUserData;
        console.log('checkfilterID--------------------', this.props?.route?.params?.filterId);
        console.log('checkfilterID--------------------smmdata', this.props);

        var filterIDasync = await AsyncStorage.getItem('FILTERIDLIST');
        var SMDATAraw = await AsyncStorage.getItem('supplierIndex');

        const SMDATA = this.normalizeSupplierIndex(SMDATAraw || this.props?.route?.params?.smData || this.props?.data?.audits?.smdata);
        await AsyncStorage.setItem('supplierIndex', JSON.stringify(SMDATA));
        console.log('checkingsmdatvalllll', SMDATA);

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
        this.setState(
            {
                filterID: filterIDasync,
                SM: SMDATA,
            },
            () => {
                // Keep Redux copy in sync so consumers reading smdata from props get the latest selection
                if (SMDATA !== null && typeof SMDATA !== 'undefined') {
                    this.props.dispatch({ type: 'STORE_SUPPLIER_DATA', smdata: SMDATA });
                }
                console.log('FILTERIDCHECK*****************smmmm', this.state.filterID, this.state.SM);
                this.refreshAudits();
            },
        );
        this.focusListener = this.props.navigation.addListener('focus', () => {
            console.log('AuditDashboardListing focused');
            this.refreshAudits();
        });
    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }

    normalizeSupplierIndex = value => {
        if (value === undefined || value === null || value === '') {
            return 3;
        }

        try {
            const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
            const numericValue = Number(parsedValue);
            return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 3;
        } catch (error) {
            const numericValue = Number(value);
            return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 3;
        }
    };

    getSelectedSupplierIndex = async () => {
        const storedSupplierIndex = await AsyncStorage.getItem('supplierIndex');
        const routeSupplierIndex = this.props?.route?.params?.smData;
        const reduxSupplierIndex = this.props?.data?.audits?.smdata;
        const SM = this.normalizeSupplierIndex(this.state.SM || storedSupplierIndex || routeSupplierIndex || reduxSupplierIndex);
        await AsyncStorage.setItem('supplierIndex', JSON.stringify(SM));
        this.setState({ SM });
        return SM;
    };

    toggleActionDropdown = () => {
        this.setState(prevState => ({ actionDropdownVisible: !prevState.actionDropdownVisible }));
    };

    closeActionDropdown = () => {
        this.setState({ actionDropdownVisible: false });
    };

    openFilterScreen = async () => {
        const SM = await this.getSelectedSupplierIndex();
        this.props.navigation.navigate(ROUTES.FILTER_SCREEN, {
            fromDashBoard: true,
            smData: SM,
            PreviousPage: ROUTES.AUDIT_DASHBOARD_LISTING_SM,
        });
    };

    openCalendarScreen = async () => {
        const SM = await this.getSelectedSupplierIndex();
        this.props.navigation.navigate(ROUTES.CALENDER_LIST, {
            fromDashBoard: true,
            smData: SM,
            PreviousPage: ROUTES.AUDIT_DASHBOARD_LISTING_SM,
        });
    };

    handleActionDropdownPress = async optionKey => {
        this.closeActionDropdown();

        if (optionKey === 'filter') {
            await this.openFilterScreen();
            return;
        }
        if (optionKey === 'calendar') {
            await this.openCalendarScreen();
            return;
        }
        if (optionKey === 'download') {
            this.props.navigation.navigate(ROUTES.DOWNLOAD_SM);
            return;
        }
        if (optionKey === 'syncDetails') {
            this.props.navigation.navigate(ROUTES.SYNC_DETAILSSM);
        }
    };

    renderActionDropdown = () => (
        <>
            <View style={actionMenuStyles.wrapper}>
                <TouchableOpacity activeOpacity={0.8} style={actionMenuStyles.button} onPress={this.toggleActionDropdown}>
                    <Icon name="more-vertical" size={22} color="#123C95" />
                </TouchableOpacity>
            </View>
            <Modal transparent visible={this.state.actionDropdownVisible} animationType="fade" onRequestClose={this.closeActionDropdown}>
                <View style={actionMenuStyles.modalBackdrop}>
                    <Pressable style={actionMenuStyles.dismissLayer} onPress={this.closeActionDropdown} />
                    <View style={actionMenuStyles.dropdownContainer}>
                        <View style={actionMenuStyles.arrow} />
                        <View style={actionMenuStyles.box}>
                            {ACTION_DROPDOWN_OPTIONS.map((option, index) => (
                                <TouchableOpacity
                                    key={option.key}
                                    activeOpacity={0.75}
                                    style={[actionMenuStyles.item, index === ACTION_DROPDOWN_OPTIONS.length - 1 && actionMenuStyles.itemLast]}
                                    onPress={() => this.handleActionDropdownPress(option.key)}>
                                    <View style={actionMenuStyles.icon}>
                                        <Icon name={option.icon} size={17} color="#123C95" />
                                    </View>
                                    <Text style={actionMenuStyles.label}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );

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

    render() {
        const { theme } = this.context || {};
        return (
            <View style={styles.wrapper}>
                {/* Offline notification */}
                <OfflineNotice />

                {/* <View style={styles.header}>
                   <TouchableOpacity
                     onPress={() => this.props.navigation.goBack()}
                     style={styles.backlogo}>
                     <Icon name="arrow-left" size={25} color="#00b3d6" />
                   </TouchableOpacity>
                   <View style={styles.heading}>
                     <Text numberOfLines={1} style={styles.headingText}>
                       {'Audits'}
                     </Text>
                   </View>
                   <View style={styles.headerDiv}>
                     <TouchableOpacity
                       style={{paddingRight: 10}}
                       onPress={() =>
                         this.props.navigation.navigate('AuditDashboard')
                       }>
                       <Icon name="home" size={25} color="#00b3d6" />
                     </TouchableOpacity>
                   </View>
                 </View> */}
                <GlobalHeader
                    title={'Audits'}
                    onLeftPress={() => this.props.navigation.goBack()}
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: '#000' }}
                    leftIconColor={theme?.colors?.primaryThemeColor}
                />
                <View style={styles.auditPageBody}>
                    <View style={actionMenuStyles.searchRow}>
                        <View style={actionMenuStyles.searchArea}>
                            <ListSearch
                                searchKey={this.state.searchKey}
                                setSearchKey={searchKey =>
                                    this.setState({ searchKey, AuditSearch: searchKey }, () => {
                                        this.applyAuditFilter();
                                    })
                                }
                                placeholder="Search by audit no, auditee"
                            />
                        </View>
                        {this.renderActionDropdown()}
                    </View>
                    {this.state.loader ? (
                        <View style={styles.loaderParent}>
                            <ActivityIndicator size={20} color={theme?.colors?.primaryThemeColor} />
                        </View>
                    ) : this.state.error ? (
                        <NoRecordFound />
                    ) : (
                        this.renderFlatList()
                    )}
                </View>
            </View>
        );
    }

    renderFlatList() {
        return (
            <FlatList
                contentContainerStyle={styles.listPadding}
                data={this.state.auditList}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <AuditCardSM
                        dateFormat={this.props.data.audits.userDateFormat}
                        item={item}
                        index={index}
                        length={this.state.auditList.length + 1}
                        naviData={this.props.navigation}
                        smData={this.state.SM}
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
                ListFooterComponent={this.listFooter.bind(this)}
            />
        );
    }

    listFooter() {
        if (this.state.subLoader) {
            return (
                <View style={styles.subLoaderWrap}>
                    <ActivityIndicator size={20} color="#1CAFF6" />
                </View>
            );
        } else {
            return null;
        }
    }

    refreshAudits = () => {
        this.pageSize = 10;
        this.pageNo = 1;
        this.onEndReachedCalledDuringMomentum = false;

        this.setState(
            {
                auditList: [],
                auditListAll: [],
                loader: true,
                error: false,
                subLoader: false,
                listEndReached: false,
            },
            () => this.getAudits(),
        );
    };

    getAudits(startDate, endDate) {
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
                const { userId, token } = this.props.data.audits;
                const siteId = this.props.data.audits.siteId;

                var SM = this.props.data.audits.smdata;
                var GlobalFilter = '',
                    StartDate = '',
                    EndDate = '';
                var SortBy = '',
                    SortOrder = '',
                    Default = 1;
                let filterStr = '';

                if (this.state.filterID === '2') {
                    filterStr = 'AuditStatus IN (2)';
                } else if (this.state.filterID === '3') {
                    filterStr = 'AuditStatus IN (3)';
                } else if (this.state.filterID === '4') {
                    filterStr = 'AuditStatus IN (4)';
                } else if (this.state.filterID === '5') {
                    filterStr = 'AuditStatus IN (5)';
                }
                console.log('tret', auth.getauditlist);
                console.log(
                    'paramcheckkkk',
                    this.currentUserData.accessToken,
                    this.currentUserData.userId,
                    this.currentUserData.siteId,
                    this.pageNo,
                    this.pageSize,
                    filterStr,
                    GlobalFilter,
                    StartDate,
                    EndDate,
                    SortBy,
                    SortOrder,
                    this.state.SM,
                );

                auth.getauditlist(
                    this.currentUserData.accessToken,
                    this.currentUserData.userId,
                    this.currentUserData.siteId,
                    this.pageNo,
                    this.pageSize,
                    filterStr,
                    GlobalFilter,
                    StartDate,
                    EndDate,
                    SortBy,
                    SortOrder,
                    this.state.SM,
                    Default,
                    (response, data) => {
                        console.log('get audit list', data);
                        if (data.data) {
                            if (data.data.Message === 'Success') {
                                if (data.data.Data && data.data.Data.length === 0) {
                                    if (this.state.auditList.length === 0) {
                                        this.setState({
                                            loader: false,
                                            error: true,
                                            subLoader: false,
                                            listEndReached: false,
                                        });
                                    } else {
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
                                    if (this.state.auditList.length === data.data.Data.length) {
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
                                        this.transformAudits(data.data.Data);
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

    transformAudits(audits) {
        var auditList = [];
        var auditListProps = this.props.data.audits.auditRecords;
        console.log('AuditListProps', auditListProps);

        for (var i = 0; i < audits.length; i++) {
            var auditInfo = audits[i];
            auditInfo['color'] = '#1081de';
            auditInfo['cStatus'] = constant.StatusScheduled;
            auditInfo['key'] = this.keyVal + 1;
            // ensure downstream screens receive consistent id shape
            auditInfo['AuditId'] = audits[i]?.ActualAuditId || audits[i]?.AuditId;

            // Set Audit Status

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
                auditList: auditList,
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

export default connect(mapStateToProps)(AuditDashboardListing);
