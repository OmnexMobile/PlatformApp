import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
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

class AuditScreenSM extends Component {
    static contextType = ThemeContext;

    state = { audits: [], loading: true, error: false };

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
        const audits = [];

        for (const supplierIndex of supplierIndexes) {
            const responseAudits = await this.getAuditsForSupplier(
                token, userId, siteId, pageNo, pageSize, filterId, globalFilter,
                startDate, endDate, sortBy, sortOrder, supplierIndex, defaultValue,
            );
            responseAudits.forEach((audit, index) => {
                audits.push({
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
        apqpRecords.forEach((record, index) => {
            audits.push({
                ...record,
                key: `apqp-${record.TaskID || record.TaskId || record.ProjectID || index}`,
                recordType: 'apqp',
            });
        });

        this.setState({ audits, loading: false, error: audits.length === 0, smData: 1 });
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

    renderListItem = ({ item, index }) => {
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
        const { audits, loading, error } = this.state;
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
                        <FlatList
                            contentContainerStyle={styles.listPadding}
                            data={audits}
                            keyExtractor={item => item.key}
                            renderItem={this.renderListItem}
                        />
                    )}
                </View>
            </View>
        );
    }
}

export default connect(state => ({ data: state }))(AuditScreenSM);
