import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, FlatList, ScrollView, CheckBox, BackHandler } from 'react-native'
import AuditPageStyle from '../../auditPro/styles/AuditDashboardStyle'

import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../auditPro/Themes/Fonts'
import { strings } from '../../auditPro/language/Language'
import Modal from "react-native-modal"
import CalendarPicker from 'react-native-calendar-picker'
import { width, height } from 'react-native-dimension'
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle'
import { extendMoment } from 'moment-range';

import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import auth from "../../../services/Auditpro-Auth";
import OfflineNotice from '../../auditPro/components/OfflineNotice'
import constant from '../../auditPro/constants/AppConstants'
// import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { ROUTES } from 'constants/app-constant';
import GlobalHeader from 'components/GlobalHeader';

const moment = extendMoment(Moment);
const window_width = Dimensions.get('window').width
class SyncStatus extends Component {

    constructor(props) {
        super(props);
        console.log('get props--->', props);
        this.state = {
            auditList: [],
            auditListAll: [],
            token: '',
            userId: '',
            siteId: '',
            page: 1,
            loading: false,
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
            SortBy: '',
            SortOrder: '',
            cFilterVal: 0,
            isSynced: true,
            isNotSynced: false,
            notSynced_auditList: [],
            synced_auditList: [],
            sync_History: [],
            activeTabIndex: 0,
            tabRoutes: [
                { key: 'notSynced', title: strings.Not_Synced, icon: 'history' },
                { key: 'synced', title: strings.Synced, icon: 'check-circle' },
                { key: 'history', title: strings.History, icon: 'clock-o' },
            ],
        }
        this.focusSubscription = props.navigation.addListener('focus', () => {
            this.applyFilterChanges("Forms", 'StartDate', 1, null, null)
            this.applyFilterChanges("Forms", 'StartDate', 2, null, null)
        })
    }

    componentWillUnmount() {
        if (this.focusSubscription) {
            this.focusSubscription()
        }
    }

    componentDidMount() {
        console.log('AuditDashboardBody mountedSyncDetails', this.props.data.audits)
        if (this.props.data.audits.language === 'Chinese') {
            this.setState({ ChineseScript: true }, () => {
                strings.setLanguage('zh')
                this.setState({})
                // console.log('Chinese script on',this.state.ChineseScript) 
            })
        }
        else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
            this.setState({ ChineseScript: false }, () => {
                strings.setLanguage('en-US')
                this.setState({})
            })
        }
        this.applyFilterChanges("Forms", 'StartDate', 1, null, null)
        this.applyFilterChanges("Forms", 'StartDate', 2, null, null)
        this.getHistory()
        // this.setState({
        //     auditList: this.props.data.audits.audits,
        //     auditListAll: this.props.data.audits.audits,
        //     loading: false,
        //     isRefreshing: false,
        //     isPageEmpty: false
        // }, () => {
        //     // console.warn('auditList',this.state.auditList);     
        // });
    }

    getHistory() {
        const UserId = this.props?.route?.params?.userDetails?.userId;
        const token = this.props?.route?.params?.userDetails?.accessToken;
        console.log('checkhistoryval------>', UserId, token);
        
        auth.getSyncHistory(UserId, token, (res, data) => {
            if (data.data) {
                if (data.data.Success === true) {
                    this.setState({ sync_History: data.data.Data, loading: false })
                } else {
                    this.setState({ sync_History: [], loading: false })
                }
            } else {
                this.setState({ sync_History: [], loading: false })
            }
        })
    }

    getNormalizedAuditId = item => {
        return String(
            item?.ActualAuditId ??
            item?.AuditId ??
            ''
        )
    }

    getAuditIdAliases = item => {
        return [
            item?.ActualAuditId,
            item?.AuditId,
        ]
            .filter(value => value !== null && typeof value !== 'undefined' && `${value}` !== '')
            .map(value => String(value))
    }

    getStatusPriority = status => {
        switch (status) {
            case constant.StatusSynced:
                return 4
            case constant.StatusNotSynced:
                return 3
            case constant.StatusDownloaded:
                return 2
            case constant.StatusProcessing:
                return 1
            default:
                return 0
        }
    }

    getResolvedAuditRecord = (records = []) => {
        if (!Array.isArray(records) || records.length === 0) {
            return null
        }

        return records.reduce((bestRecord, currentRecord) => {
            if (!bestRecord) {
                return currentRecord
            }

            const bestPriority = this.getStatusPriority(bestRecord?.AuditRecordStatus)
            const currentPriority = this.getStatusPriority(currentRecord?.AuditRecordStatus)

            return currentPriority >= bestPriority ? currentRecord : bestRecord
        }, null)
    }

    applyFilterChanges(sortype, droptext, filterType, startDate, endDate) {
        console.log('sortype', sortype)
        console.log('droptext', droptext)
        console.log('filterType', filterType)
        console.log('startDate----->', startDate)
        console.log('endDate ---->', endDate)

        const selectedAuditIds = this.props?.route?.params?.auditIds || []
        const isSelectedAudit = item => {
            if (selectedAuditIds.length === 0) {
                return true
            }

            return this.getAuditIdAliases(item).some(id => selectedAuditIds.includes(id))
        }
        const auditsList = (this.props?.data?.audits?.audits || []).filter(isSelectedAudit)
        const auditRecords = (this.props?.data?.audits?.auditRecords || []).filter(isSelectedAudit)
        const notsync = []
        const sync = []
        const auditRecordMap = new Map()
        const mergedAudits = []
        const seenIds = new Set()

        console.log('auditsList------>', auditsList)
        console.log('auditRecords------>', auditRecords)

        auditRecords.forEach(item => {
            this.getAuditIdAliases(item).forEach(recordId => {
                const existingRecords = auditRecordMap.get(recordId) || []
                auditRecordMap.set(recordId, [...existingRecords, item])
            })
        })

        auditsList.forEach(item => {
            const itemAliases = this.getAuditIdAliases(item)
            const itemId = itemAliases[0]
            const matchingRecords = itemAliases.flatMap(alias => auditRecordMap.get(alias) || [])
            const matchingRecord = this.getResolvedAuditRecord(matchingRecords)
            const mergedItem = {
                ...item,
                AuditId: item?.AuditId ?? item?.ActualAuditId,
                ActualAuditId: item?.ActualAuditId ?? item?.AuditId,
                AuditRecordStatus: matchingRecord?.AuditRecordStatus ?? item?.AuditRecordStatus,
                cStatus: matchingRecord?.AuditRecordStatus ?? item?.cStatus ?? item?.AuditRecordStatus,
            }

            mergedAudits.push(mergedItem)
            itemAliases.forEach(alias => seenIds.add(alias))
        })

        auditRecords.forEach(item => {
            const itemAliases = this.getAuditIdAliases(item)
            const itemId = itemAliases[0]
            const isSeen = itemAliases.some(alias => seenIds.has(alias))

            if (!itemId || isSeen) {
                return
            }

            mergedAudits.push({
                ...item,
                AuditId: item?.AuditId ?? item?.ActualAuditId,
                ActualAuditId: item?.ActualAuditId ?? item?.AuditId,
                cStatus: item?.AuditRecordStatus ?? item?.cStatus,
            })
            itemAliases.forEach(alias => seenIds.add(alias))
        })

        mergedAudits.forEach((item) => {
            const auditRecordStatus = item?.AuditRecordStatus
            const auditStatus = item?.cStatus ?? item?.AuditRecordStatus

            if (typeof auditRecordStatus === 'undefined' || auditRecordStatus === null) {
                return
            }

            if (auditStatus == constant.StatusNotSynced) {
                notsync.push(item)
            }
            if (auditStatus == constant.StatusSynced) {
                sync.push(item)
            }
        })

        this.setState({
            notSynced_auditList: notsync,
            loading: false,
            synced_auditList: sync,
            isLazyLoadingRequired: false
        }, () => {
            console.log('notSynced_auditList', this.state.notSynced_auditList)
            console.log('synced_auditList', this.state.synced_auditList)
        })
    }

    getAuditListKey = (item, index) => {
        return String(
            item?.AuditRecordId ??
            item?.AuditId ??
            item?.AuditNumber ??
            item?.Id ??
            index
        )
    }

    getHistoryKey = (item, index) => {
        return String(
            item?.SyncHistoryId ??
            item?.AuditId ??
            `${item?.AuditNumber ?? 'history'}-${item?.DateTimeStamp ?? index}`
        )
    }

    

    formatHistoryTimestamp = inDate => {
        if (!inDate) {
            return ''
        }

        return Moment(inDate).format('DD MMM YYYY • hh:mm A')
    }

    onTabPress = index => {
        this.setState({ activeTabIndex: index })
    }

    renderTabBar = () => {
        return (
            <View
                style={{
                    marginHorizontal: 8,
                    marginTop: 10,
                    marginBottom: 8,
                    padding: 6,
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 34,
                    shadowColor: '#183153',
                    shadowOpacity: 0.14,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 6,
                }}
            >
                {this.state.tabRoutes.map((route, index) => {
                    const isActive = this.state.activeTabIndex === index

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 18,
                                borderRadius: 28,
                                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                                shadowColor: isActive ? '#183153' : 'transparent',
                                shadowOpacity: isActive ? 0.12 : 0,
                                shadowRadius: isActive ? 14 : 0,
                                shadowOffset: isActive ? { width: 0, height: 6 } : { width: 0, height: 0 },
                                elevation: isActive ? 5 : 0,
                                position: 'relative',
                            }}
                            activeOpacity={0.8}
                            onPress={() => this.onTabPress(index)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                    name={route.icon}
                                    size={24}
                                    color={isActive ? '#0E4FD4' : '#747474'}
                                />
                                <Text
                                    style={{
                                        marginLeft: 12,
                                        fontSize: Fonts.size.mediump,
                                        fontFamily: isActive ? 'OpenSans-Bold' : 'OpenSans-Regular',
                                        color: isActive ? '#0E4FD4' : '#747474',
                                    }}
                                >
                                    {route.title}
                                </Text>
                            </View>
                            {isActive ? (
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: 18,
                                        right: 18,
                                        bottom: -6,
                                        height: 4,
                                        borderRadius: 4,
                                        backgroundColor: '#0E4FD4',
                                    }}
                                />
                            ) : null}
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    renderActiveTabContent = () => {
        switch (this.state.activeTabIndex) {
            case 0:
                return this.notSynced()
            case 1:
                return this.synced()
            case 2:
                return this.renderHistory()
            default:
                return this.notSynced()
        }
    }


    openAuditPage(iAuditDetails) {
        console.log('iAuditDetails', iAuditDetails)
        const auditRecords = this.props.data.audits.auditRecords || []
        const smData =
            this.props?.route?.params?.smData ??
            iAuditDetails?.smData ??
            this.props?.data?.audits?.smdata

        const actualAuditId =
            iAuditDetails?.ActualAuditId ?? iAuditDetails?.AuditId
        const normalizedAuditStatus =
            iAuditDetails?.AuditStatus ?? parseInt(iAuditDetails?.Status, 10)
        const normalizedStatus =
            iAuditDetails?.cStatus ?? iAuditDetails?.AuditRecordStatus ?? constant.StatusDownloaded

        const isDownloadedDone = auditRecords.some(
            record =>
                record?.AuditId == actualAuditId ||
                record?.ActualAuditId == actualAuditId,
        )

        const datapass = {
            ...iAuditDetails,
            ActualAuditId: actualAuditId,
            AuditStatus: normalizedAuditStatus,
            cStatus: normalizedStatus,
            ...(smData !== null && typeof smData !== 'undefined' ? { smData } : {}),
        }

        const navigateToAudit = () =>
            this.props.navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                datapass,
                auditStatusPass: normalizedStatus,
                ...(smData !== null && typeof smData !== 'undefined' ? { smData } : {}),
            })

        if (isDownloadedDone) {
            navigateToAudit()
        }
        else {
            if (this.props.data.audits.isOfflineMode) {
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
            }
            else {
                NetInfo.fetch().then(netState => {
                    if (netState.isConnected) {
                        navigateToAudit()
                    }
                    else {
                        this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG)
                    }
                })
            }
        }
    }

    changeDateFormatCardWithTime = (inDate) => {
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat + ' ' + 'HH:mm'
            var sDateArr = inDate.split('T')
            var sDateValArr = sDateArr[0].split('-')
            var sTimeValArr = sDateArr[1].split(':')
            var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])
            return Moment(outDate).format(DefaultFormatL)
        }
    }

    changeDateFormatCard = (inDate) => {
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat
            var sDateArr = inDate.split('T')
            var sDateValArr = sDateArr[0].split('-')
            var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2])

            return Moment(outDate).format(DefaultFormatL)
        }
    }
    getAuditStatus = (status) => {
        // console.warn('======',status)
        var percent = 0
        // Set Audit Card color by checking its Status
        switch (status.AuditRecordStatus) {
            case constant.StatusScheduled:
                percent = 10
                break
            case constant.StatusDownloaded:
                percent = 30
                break
            case constant.StatusNotSynced:
                percent = 70
                break
            case constant.StatusProcessing:
                percent = 50
                break
            case constant.StatusSynced:
                percent = 90
                break
            case constant.StatusCompleted:
                percent = 100
                break
            case constant.StatusDV:
                percent = 60
                break
            case constant.StatusDVC:
                percent = 100
                break
            default:
                percent = 10
                break
        }

        return percent
    }

    getCardColor(id) {
        var color = '#fff'
        switch (id.AuditRecordStatus) {
            case constant.StatusScheduled:
                color = '#F1EB0E'
                break
            case constant.StatusDownloaded:
                color = '#cd8cff'
                break
            case constant.StatusNotSynced:
                color = '#2ec3c7'
                break
            case constant.StatusProcessing:
                color = '#e88316'
                break
            case constant.StatusSynced:
                color = '#48bcf7'
                break
            case constant.StatusCompleted:
                color = 'black'
                break
            case constant.Completed:
                color = 'green'
                break
            case constant.StatusDV:
                color = 'red'
                break
            case constant.StatusDVC:
                color = 'green'
                break
            default:
                color = '#F1EB0E'
                break
        }

        return color
    }

    onSync(id, val) {
        this.setState({
            isSynced: !this.state.isSynced,
        })
    }
    onNotSync() {
        this.setState({
            isNotSynced: !this.state.isNotSynced,
        })
    }
    render() {
        const { theme } = this.context || {};
        return (
            <View style={AuditPageStyle.container}>
                <OfflineNotice />
                {/* <View style={AuditPageStyle.headerCont}>
                    <ImageBackground
                        source={Images.DashboardBG}
                        style={AuditPageStyle.bgCont}>
                        {this.renderHeader()}
                    </ImageBackground>
                </View> */}
                <GlobalHeader
                    title={'Audits'}
                    onLeftPress={() => this.props.navigation.goBack()}
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: '#000' }}
                    leftIconColor={theme?.colors?.primaryThemeColor}
                />
                <View style={{ flex: 1 }}>

                    {this.renderTabBar()}
                    <View style={{ flex: 1 }}>
                        {this.renderActiveTabContent()}
                    </View>
                </View>
            </View>
        )
    }
    synced() {
        return (
            <View key="synced-tab" tabLabel={strings.Synced} style={AuditPageStyle.scrollViewBody}>
                {this.state.synced_auditList.length > 0 ?
                    <FlatList
                        data={this.state.synced_auditList}
                        extraData={this.state}
                        // onEndReached={this.handleEnd.bind(this)}
                        // onEndReachedThreshold={0.01}
                        // refreshing={this.state.isRefreshing}
                        // onRefresh={debounce(this.handleRefresh.bind(this), 800)}
                        // ListFooterComponent={this.listFooter.bind(this)}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                <View style={AuditPageStyle.auditBox}>
                                    <View style={[AuditPageStyle.auditBoxStatusBar, { backgroundColor: this.getCardColor(item) }]}></View>
                                    <View style={AuditPageStyle.auditBoxContent}>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.regular, color: '#204AA9', fontFamily: 'OpenSans-Bold', }}>{item.Auditee}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.mediump, color: '#000000', fontFamily: 'OpenSans-Bold' }}>{this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.medium, color: 'grey', fontFamily: 'OpenSans-Bold' }}>{item.AuditCycleName}</Text>
                                        <View style={{
                                            backgroundColor: '#EFF4FA',
                                            borderRadius: 12,
                                            paddingHorizontal: 14,
                                            paddingVertical: 11,
                                        }}>
                                            <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: Fonts.size.mediump, color: '#000000', fontFamily: 'OpenSans-Bold' }}>{item.AuditNumber}</Text>
                                        </View>
                                    </View>
                                    <View style={AuditPageStyle.auditBoxStatus}>
                                        {/* {(item.cStatus == 'Scheduled') ?
                        <ResponsiveImage source={Images.downloadIconImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : 
                        (item.cStatus == 'Not-synced') ? 
                        <ResponsiveImage source={Images.syncCardImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : */}
                                        {/* <View style={AuditPageStyle.circle}>
                                                <ProgressCircle
                                                    percent={this.getAuditStatus(item)}
                                                    radius={28}
                                                    borderWidth={5}
                                                    color="#48BCF7"
                                                    shadowColor="lightgrey"
                                                    bgColor="#fff"
                                                >
                                                    <Text style={AuditPageStyle.progressVal}>{this.getAuditStatus(item)}%</Text>
                                                </ProgressCircle>
                                            </View> */}
                                        {/* } */}
                                        {/* <Text style={AuditPageStyle.statusText}>{item.AuditRecordStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.AuditRecordStatus}</Text> */}
                                    </View>
                                </View>
                            </TouchableOpacity>}
                        keyExtractor={this.getAuditListKey}
                        ItemSeparatorComponent={() =>
                            <View style={{ width: window_width, height: 1, backgroundColor: 'transparent' }} />
                        }
                    />
                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: Fonts.size.h5, fontFamily: 'OpenSans-Regular'
                        }}>{strings.No_records_found}</Text>
                    </View>
                }
            </View>
        )
    }

    notSynced() {
        return (
            <View key="not-synced-tab" tabLabel={strings.Not_Synced} style={AuditPageStyle.scrollViewBody}>
                {this.state.notSynced_auditList.length > 0 ?
                    <FlatList
                        data={this.state.notSynced_auditList}
                        extraData={this.state}
                        // onEndReached={this.handleEnd.bind(this)}
                        // onEndReachedThreshold={0.01}
                        // refreshing={this.state.isRefreshing}
                        // onRefresh={debounce(this.handleRefresh.bind(this), 800)}
                        // ListFooterComponent={this.listFooter.bind(this)}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                <View style={AuditPageStyle.auditBox}>
                                    <View style={[AuditPageStyle.auditBoxStatusBar, { backgroundColor: this.getCardColor(item) }]}></View>
                                    <View style={AuditPageStyle.auditBoxContent}>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.regular, color: '#204AA9', fontFamily: 'OpenSans-Bold', }}>{item.Auditee}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.mediump, color: '#000000', fontFamily: 'OpenSans-Bold' }}>{this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: Fonts.size.medium, color: 'grey', fontFamily: 'OpenSans-Bold' }}>{item.AuditCycleName}</Text>
                                        <View style={{
                                            backgroundColor: '#EFF4FA',
                                            borderRadius: 12,
                                            paddingHorizontal: 14,
                                            paddingVertical: 11,
                                        }}>
                                            <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: Fonts.size.mediump, color: '#000000', fontFamily: 'OpenSans-Bold' }}>{item.AuditNumber}</Text>
                                        </View>
                                    </View>
                                    <View style={AuditPageStyle.auditBoxStatus}>
                                        {/* {(item.cStatus == 'Scheduled') ?
                        <ResponsiveImage source={Images.downloadIconImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : 
                        (item.cStatus == 'Not-synced') ? 
                        <ResponsiveImage source={Images.syncCardImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : */}
                                        {/* <View style={AuditPageStyle.circle}>
                                                <ProgressCircle
                                                    percent={this.getAuditStatus(item)}
                                                    radius={28}
                                                    borderWidth={5}
                                                    color="#48BCF7"
                                                    shadowColor="lightgrey"
                                                    bgColor="#fff"
                                                >
                                                    <Text style={AuditPageStyle.progressVal}>{this.getAuditStatus(item)}%</Text>
                                                </ProgressCircle>
                                            </View> */}
                                        {/* } */}
                                        {/* <Text style={AuditPageStyle.statusText}>{item.AuditRecordStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.AuditRecordStatus}</Text> */}
                                    </View>
                                </View>
                            </TouchableOpacity>}
                        keyExtractor={this.getAuditListKey}
                        ItemSeparatorComponent={() =>
                            <View style={{ width: window_width, height: 1, backgroundColor: 'transparent' }} />
                        }
                    />

                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: Fonts.size.h5, fontFamily: 'OpenSans-Regular'
                        }}>{strings.No_records_found}</Text>
                    </View>}
            </View>
        )
    }
    renderHistory() {
        return (
            <View key="history-tab" tabLabel={strings.History} style={AuditPageStyle.scrollViewBody}>
                {
                    this.state.sync_History.length > 0 ?
                        <FlatList
                            data={this.state.sync_History}
                            style={{ paddingTop: 14, paddingHorizontal: 14 }}
                            keyExtractor={this.getHistoryKey}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {

                                return (
                                    <View
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 22,
                                            marginBottom: 18,
                                            overflow: 'hidden',
                                            shadowColor: '#183153',
                                            shadowOpacity: 0.12,
                                            shadowRadius: 16,
                                            shadowOffset: { width: 0, height: 8 },
                                            elevation: 4,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', minHeight: 100 }}>
                                            <View style={{ flex: 1, paddingHorizontal: 18, paddingVertical: 20 }}>
                                                

                                                <Text
                                                    style={{
                                                        color: '#8B909B',
                                                        fontSize: Fonts.size.medium,
                                                        fontFamily: 'OpenSans-Bold',
                                                    }}
                                                >
                                                    {strings.auditnumber}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginTop: 5,
                                                        color: '#1D2540',
                                                        fontSize: Fonts.size.input,
                                                        fontFamily: 'OpenSans-Bold',
                                                    }}
                                                >
                                                    {item.AuditNumber}
                                                </Text>

                                                <View
                                                    style={{
                                                        height: 1,
                                                        backgroundColor: '#E6E8EF',
                                                        marginTop: 10,
                                                        marginBottom: 10,
                                                    }}
                                                />

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name="calendar-o" size={22} color="#0E4FD4" />
                                                    <Text
                                                        style={{
                                                            marginLeft: 16,
                                                            color: '#6E7482',
                                                            fontSize: Fonts.size.medium,
                                                            fontFamily: 'OpenSans-Bold',
                                                        }}
                                                    >
                                                        Synced on
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            marginLeft: 14,
                                                            color: '#1D2540',
                                                            fontSize: Fonts.size.mediump,
                                                            fontFamily: 'OpenSans-Bold',
                                                        }}
                                                    >
                                                        {this.formatHistoryTimestamp(item.DateTimeStamp)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: Fonts.size.h5, fontFamily: 'OpenSans-Regular'
                            }}>{strings.No_records_found}</Text>
                        </View>
                }
            </View>
        )

    }

    renderCard() {
        return (
            <View>

            </View>
        )
    }
    renderHeader() {
        return (
            <View style={AuditPageStyle.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={AuditPageStyle.backlogo}>
                        <Icon name="angle-left" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={AuditPageStyle.heading}>
                    <Text style={AuditPageStyle.headingText}>{strings.syncstatus}</Text>
                </View>
                <View style={AuditPageStyle.headerDiv}>
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}>
                        <Icon name="home" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        data: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus)
