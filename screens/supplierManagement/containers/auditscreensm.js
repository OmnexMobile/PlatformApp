import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '../../../services/SupplierMgnt-Auth';
import apqpAuth from '../../../services/APQP-Auth';
import constant from '../../../constants/SupplierMgnt/AppConstants';
import styles from '../../auditPro/styles/AuditDashboardListingStyle';
import AuditCardSM from '../../auditPro/components/AuditCardSM';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import { NoRecordFound } from 'components';
import GlobalHeader from 'components/GlobalHeader';
import { ROUTES } from 'constants/app-constant';
import { ThemeContext } from 'theme/ThemeProvider';
import Icon from 'react-native-vector-icons/Feather';
import API_URL from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import { IMAGES } from 'assets/images';

class AuditScreenSM extends Component {
    static contextType = ThemeContext;

    state = { audits: [], loading: true, error: false, selectedModule: null };

    componentDidMount() {
        this.loadAudits();
    }

    componentDidUpdate(prevProps) {
        const previousFilter = prevProps?.route?.params?.filter_Arr;
        const currentFilter = this.props?.route?.params?.filter_Arr;

        // React Navigation reuses this screen after Filter apply, so reload when
        // its filter payload changes instead of waiting for a new mount.
        if (previousFilter !== currentFilter) {
            this.loadAudits();
        }
    }

    normalizeSupplierIndex = value => {
        let parsed = value;
        try {
            parsed = typeof value === 'string' ? JSON.parse(value) : value;
        } catch (error) {
            parsed = value;
        }
        const number = Number(parsed);
        return Number.isFinite(number) && number > 0 ? number : 3;
    };

    loadAudits = async (clearDateFilter = false) => {
        console.log('checkingthedatesss----->',this.props);
        
        const filter = this.props?.route?.params?.filter_Arr?.[0] || {};
        const startDate = clearDateFilter ? '' : filter.startDate || '';
        const endDate = clearDateFilter ? '' : filter.endDate || '';
        const storedUser = await AsyncStorage.getItem('userDetails');
        const storedApqpUser = await AsyncStorage.getItem('userDataApqp');
        const pageNo = 1;
        const pageSize = 1000;
        const filterId = '';
        const globalFilter = clearDateFilter ? '' : filter.globalSearch || '';
        const sortBy = '';
        const sortOrder = 'desc';
        const defaultValue = 1;
        let user = {};
        let apqpUser = {};
        try {
            user = storedUser ? JSON.parse(storedUser) : {};
        } catch (error) {
            user = {};
        }
        try {
            apqpUser = storedApqpUser ? JSON.parse(storedApqpUser) : {};
        } catch (error) {
            apqpUser = {};
        }
        const token = user.accessToken || this.props?.data?.audits?.token;
        const userId = user.userId || this.props?.data?.audits?.userId;
        const siteId = user.siteId || this.props?.data?.audits?.siteId;
        const apqpToken = apqpUser.accessToken || token;
        const apqpUserId = apqpUser.userId || userId;
        const apqpSiteId = apqpUser.siteId || siteId;

        if (!token || !userId || !siteId) {
            this.setState({ loading: false, error: true });
            return;
        }

        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            this.setState({ loading: false, error: true });
            return;
        }

        this.setState({ loading: true, error: false });
        const supplierIndexes = [1, 2, 3];
        const auditRecords = [];

        for (const supplierIndex of supplierIndexes) {
            const responseAudits = await this.getAuditsForSupplier(
                token, userId, siteId, pageNo, pageSize, filterId, globalFilter,
                startDate, endDate, sortBy, sortOrder, supplierIndex, defaultValue,
            );
            responseAudits.forEach((audit, index) => {
                auditRecords.push({
                    ...audit,
                    key: `${supplierIndex}-${audit.ActualAuditId || audit.AuditId || index}`,
                    AuditId: audit.ActualAuditId || audit.AuditId,
                    smData: supplierIndex,
                    color: '#1081de',
                    cStatus: this.getStatus(audit),
                });
            });
        }

        const apqpRecords = await this.getApqpList(
            apqpUserId,
            apqpSiteId,
            pageSize,
            globalFilter,
            this.formatApqpDate(startDate),
            this.formatApqpDate(endDate),
            apqpToken,
        );
        const apqpListRecords = apqpRecords.map((record, index) => ({
                ...record,
                key: `apqp-${record.TaskID || record.TaskId || record.ProjectID || index}`,
                recordType: 'apqp',
            }));

        const concernRecords = await this.getConcernList(userId, siteId, startDate, endDate);
        const concernListRecords = concernRecords.map((record, index) => ({
                ...record,
                key: `concern-${record.ConcernID || record.ConcernId || record.ConcernNo || index}`,
                recordType: 'concern',
            }));

        // FlatList renders one combined data array, preserving all source lists.
        const supplierRecords = auditRecords.filter(record => record.smData === 2 || record.smData === 3);
        const auditProRecords = auditRecords.filter(record => record.smData === 1);
        const audits = [...auditProRecords, ...supplierRecords, ...apqpListRecords, ...concernListRecords];
        this.setState({
            audits,
            auditRecords,
            auditProRecords,
            supplierRecords,
            apqpRecords: apqpListRecords,
            concernRecords: concernListRecords,
            selectedModule: null,
            loading: false,
            error: audits.length === 0,
            smData: 1,
        });
    };

    getConcernList = async (userId, siteId, startDate, endDate) => {
        const formData = new FormData();
        formData.append('UserId', userId);
        formData.append('SiteId', siteId);
        formData.append('maxrow', 500);
        // The date endpoint requires a complete range. With no active date
        // filter, use today's date for both bounds (same behavior as the
        // Problem Solver daily list).
        const today = new Date();
        const concernDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        formData.append('fromdate', startDate || endDate || concernDate);
        formData.append('todate', endDate || startDate || concernDate);

        try {
            const response = await postAPI(API_URL.CONCERN_LIST_FILTERED_BY_DATE, formData);
            const payload = response?.data || response;
            const data = payload?.Data || payload?.data?.Data || payload?.response?.Data;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    };

    getAuditsForSupplier = (token, userId, siteId, pageNo, pageSize, filterId, globalFilter, startDate, endDate, sortBy, sortOrder, supplierIndex, defaultValue) =>
        new Promise(resolve => {
            auth.getauditlist(
                token, userId, siteId, pageNo, pageSize, filterId, globalFilter,
                startDate, endDate, sortBy, sortOrder, supplierIndex, defaultValue,
                (response, result) => {
                    const payload = result?.data;
                    resolve(payload?.Message === 'Success' && Array.isArray(payload.Data) ? payload.Data : []);
                },
            );
        });

    getApqpList = (userId, siteId, maxRow, filterValue, startDate, endDate, token) =>
        new Promise(resolve => {
            apqpAuth.getapqplist(
                userId,
                siteId,
                0,
                maxRow,
                2,
                0,
                filterValue,
                '',
                'Actions',
                'desc',
                startDate,
                endDate,
                token,
                (response, result) => {
                    const payload = result?.data;
                    resolve(payload?.Message === 'Success' && Array.isArray(payload.Data) ? payload.Data : []);
                },
            );
        });

    formatApqpDate = date => {
        if (!date) return '';

        const parts = String(date).split(/[-/]/);
        if (parts.length !== 3) return date;

        // Calendar dates arrive as MM-DD-YYYY; APQP expects MM/DD/YYYY.
        if (parts[0].length === 4) {
            return `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[0]}`;
        }
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    };

    getStatus = audit => {
        if (audit.AuditStatus == 3 && (audit.CloseOutStatus == '7' || audit.CloseOutStatus == '9')) return constant.StatusCompleted;
        if (audit.AuditStatus == 3) return constant.Completed;
        if (audit.AuditStatus == 2 && audit.PerformStarted == 1) return constant.StatusProcessing;
        return constant.StatusScheduled;
    };

    openFilterScreen = () => {
        this.props.navigation.navigate(ROUTES.FILTER_SCREEN, {
            fromDashBoard: true,
            smData: this.state.smData,
            PreviousPage: ROUTES.AUDIT_SCREEN_SM,
        });
    };

    clearFilters = () => this.loadAudits(true);

    getModuleCards = () => [
        { id: 'auditpro', title: 'Audit Pro', subtitle: 'Total Audits', data: this.state.auditProRecords || [], image: IMAGES.auditpro_logo },
        { id: 'supplier', title: 'Supplier', subtitle: 'Total Audits', data: this.state.supplierRecords || [], image: IMAGES.supplier_logo },
        { id: 'apqp', title: 'APQP', subtitle: 'Total Items', data: this.state.apqpRecords || [], image: IMAGES.apqp_logo },
        { id: 'problemSolver', title: 'Problem Solver', subtitle: 'Total Concerns', data: this.state.concernRecords || [], image: IMAGES.ps_logo },
    ];

    renderModuleCard = ({ item }) => (
        <View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.setState(state => ({ selectedModule: state.selectedModule === item.id ? null : item.id }))}
                style={{ marginHorizontal: 12, marginVertical: 10, minHeight: 132, paddingHorizontal: 24, paddingVertical: 20, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E9EC', elevation: 4, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 24 }}>
                    <Image source={item.image} resizeMode="contain" style={{ width: 48, height: 48 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#171923', fontSize: 25, fontWeight: '500' }}>{item.title}</Text>
                    <Text style={{ color: '#123C95', fontSize: 20, fontWeight: '600', marginTop: 8 }}>{item.data.length} {item.subtitle}</Text>
                </View>
                <Icon name={this.state.selectedModule === item.id ? 'chevron-up' : 'chevron-down'} size={32} color="#64748B" />
            </TouchableOpacity>
            {this.state.selectedModule === item.id && (
                <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
                    {item.data.length ? item.data.map((record, index) => (
                        <View key={record.key || `${item.id}-${index}`}>{this.renderListItem({ item: record, index })}</View>
                    )) : <NoRecordFound />}
                </View>
            )}
        </View>
    );

    renderListItem = ({ item, index }) => {
        if (item.recordType === 'concern') {
            return (
                <View style={{ marginHorizontal: 12, marginVertical: 6, padding: 14, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7F3', flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={IMAGES.ps_logo} resizeMode="contain" style={{ width: 44, height: 44, marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#123C95', fontSize: 13, fontWeight: '600' }}>{item.ConcernNo || 'Problem Solver Concern'}</Text>
                        <Text style={{ color: '#1F2937', fontSize: 16, marginTop: 4 }}>{item.Title || item.ConcernTitle || 'Concern'}</Text>
                        {!!(item.Status || item.CreatedDate) && (
                            <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
                                {[item.Status, item.CreatedDate].filter(Boolean).join(' · ')}
                            </Text>
                        )}
                    </View>
                </View>
            );
        }

        if (item.recordType === 'apqp') {
            return (
                <View style={{ marginHorizontal: 12, marginVertical: 6, padding: 14, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7F3' }}>
                    <Text style={{ color: '#123C95', fontSize: 13, fontWeight: '600' }}>APQP</Text>
                    <Text style={{ color: '#1F2937', fontSize: 16, marginTop: 4 }}>{item.TaskDescription || item.Actions || item.ProjectName || 'APQP Action'}</Text>
                    {!!(item.ProjectDescription || item.StartDate || item.FinishDate) && (
                        <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
                            {item.ProjectDescription || `${item.StartDate || ''}${item.FinishDate ? ` - ${item.FinishDate}` : ''}`}
                        </Text>
                    )}
                </View>
            );
        }

        return <AuditCardSM dateFormat={this.props?.data?.audits?.userDateFormat} item={item} index={index} length={this.state.audits.length} naviData={this.props.navigation} smData={item.smData || this.state.smData} />;
    };

    render() {
        const { theme } = this.context || {};
        const { loading, error } = this.state;
        const modules = this.getModuleCards();
        return (
            <View style={styles.wrapper}>
                <OfflineNotice />
                <GlobalHeader
                    title="Audits"
                    onLeftPress={() => this.props.navigation.goBack()}
                    rightComponent={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.clearFilters} style={{ padding: 6 }}>
                                <Icon name="x-circle" size={24} color="#123C95" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.openFilterScreen} style={{ padding: 6 }}>
                                <Icon name="filter" size={24} color="#123C95" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)} style={{ padding: 6 }}>
                                <Icon name="home" size={24} color="#123C95" />
                            </TouchableOpacity>
                        </View>
                    }
                    containerStyle={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: '#000' }}
                    leftIconColor={theme?.colors?.primaryThemeColor}
                />
                <View style={styles.auditPageBody}>
                    {loading ? <View style={styles.loaderParent}><ActivityIndicator size={20} color={theme?.colors?.primaryThemeColor} /></View> : error ? <NoRecordFound /> : (
                        <>
                        <FlatList
                            contentContainerStyle={styles.listPadding}
                            data={modules}
                            keyExtractor={item => item.id}
                            renderItem={this.renderModuleCard}
                        />
                        </>
                    )}
                </View>
            </View>
        );
    }
}

export default connect(state => ({ data: state }))(AuditScreenSM);
