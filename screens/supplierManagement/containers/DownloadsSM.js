import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import AuditPageStyle from '../../auditPro/styles/AuditDashboardStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../auditPro/Themes/Fonts';
import { strings } from '../../auditPro/language/Language';
import Moment from 'moment';

import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import constant from '../../auditPro/constants/AppConstants';

import { ROUTES } from 'constants/app-constant';
import GlobalHeader from 'components/GlobalHeader';
import NoRecordsFound from '../../../components/NoRecordFound';
const window_width = Dimensions.get('window').width;
class Download extends Component {
  constructor(props) {
    super(props);
    console.log('get props--->', props)
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
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      filterTypeFG: 0,
      SortBy: '',
      SortOrder: '',
      cFilterVal: 0,
    };
    this.focusSubscription = props.navigation.addListener(
      'focus',
      () => {
        console.log('focus----');
        this.applyFilterChanges('Forms', 'StartDate', 0, null, null);
      },
    );
  }
  componentDidMount() {
    console.log('AuditDashboardBody mounted', this.props.data.audits);
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh');
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US');
        this.setState({});
      });
    }
    // this.applyFilterChanges("Forms",'StartDate',0,null,null)

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

  componentWillUnmount() {
    if (this.focusSubscription) {
      this.focusSubscription();
    }
  }

  applyFilterChanges(sortype, droptext, filterType, startDate, endDate) {
    console.log('sortype', sortype);
    console.log('droptext', droptext);
    console.log('filterType', filterType);
    console.log('startDate----->', startDate);
    console.log('endDate ---->', endDate);

    const selectedAuditIds = this.props.route?.params?.auditIds || [];
    const sourceAudits = (this.props.data.audits.auditRecords || []).filter(item => {
      if (selectedAuditIds.length === 0) {
        return true;
      }

      return [item?.ActualAuditId, item?.AuditId]
        .filter(id => id !== null && typeof id !== 'undefined' && `${id}` !== '')
        .map(String)
        .some(id => selectedAuditIds.includes(id));
    });

    if (filterType == 0) {
      this.setState({
        auditList: sourceAudits,
        auditListAll: sourceAudits,
        // auditList: this.props.data.audits.audits.filter((item) => item.cStatus == constant.StatusDownloaded),
        loading: false,
        isLazyLoadingRequired: false,
      });
    } else if (filterType == 1) {
      const filteredAudits = (this.props.data.audits.audits || []).filter(
        item => item.cStatus == constant.StatusNotSynced,
      );
      this.setState({
        auditList: filteredAudits,
        auditListAll: filteredAudits,
        loading: false,
        isLazyLoadingRequired: false,
      });
    } else if (filterType == 2) {
      const filteredAudits = (this.props.data.audits.audits || []).filter(
        item => item.cStatus == constant.StatusSynced,
      );
      this.setState({
        auditList: filteredAudits,
        auditListAll: filteredAudits,
        loading: false,
        isLazyLoadingRequired: false,
      });
    }
  }

  openAuditPage(iAuditDetails) {
    console.log('iAuditDetails', iAuditDetails);
    const auditRecords = this.props.data.audits.auditRecords || [];
    const smData =
      this.props?.route?.params?.smData ??
      iAuditDetails?.smData ??
      this.props?.data?.audits?.smdata;

    const actualAuditId =
      iAuditDetails?.ActualAuditId ?? iAuditDetails?.AuditId;
    const normalizedAuditStatus =
      iAuditDetails?.AuditStatus ?? parseInt(iAuditDetails?.Status, 10);
    const normalizedStatus =
      iAuditDetails?.cStatus ?? iAuditDetails?.AuditRecordStatus ?? constant.StatusDownloaded;

    const isDownloadedDone = auditRecords.some(
      record =>
        record?.AuditId == actualAuditId ||
        record?.ActualAuditId == actualAuditId,
    );

    const datapass = {
      ...iAuditDetails,
      ActualAuditId: actualAuditId,
      AuditStatus: normalizedAuditStatus,
      cStatus: normalizedStatus,
      ...(smData !== null && typeof smData !== 'undefined' ? { smData } : {}),
    };

    const navigateToAudit = () =>
      this.props.navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
        datapass,
        auditStatusPass: normalizedStatus,
        ...(smData !== null && typeof smData !== 'undefined' ? { smData } : {}),
      });

    if (isDownloadedDone) {
      navigateToAudit();
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            navigateToAudit();
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }

  changeDateFormatCard = inDate => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
      );

      return Moment(outDate).format(DefaultFormatL);
    }
  };
  getAuditStatus = status => {
    console.warn('======', status);
    var percent = 0;
    // Set Audit Card color by checking its Status
    switch (status.AuditRecordStatus) {
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

  getCardColor(id) {
    var color = '#fff';
    switch (id.AuditRecordStatus) {
      case constant.StatusScheduled:
        color = '#F1EB0E';
        break;
      case constant.StatusDownloaded:
        color = '#cd8cff';
        break;
      case constant.StatusNotSynced:
        color = '#2ec3c7';
        break;
      case constant.StatusProcessing:
        color = '#e88316';
        break;
      case constant.StatusSynced:
        color = '#48bcf7';
        break;
      case constant.StatusCompleted:
        color = 'black';
        break;
      case constant.Completed:
        color = 'green';
        break;
      case constant.StatusDV:
        color = 'red';
        break;
      case constant.StatusDVC:
        color = 'green';
        break;
      default:
        color = '#F1EB0E';
        break;
    }

    return color;
  }

  renderAuditCard = item => {
    const accentColor = this.getCardColor(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardTouch}
        onPress={() => this.openAuditPage(item)}>
        <View style={styles.card}>
          <View
            style={[
              styles.accentBar,
              { backgroundColor: accentColor },
            ]}
          />
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.Auditee}
                </Text>
              </View>
              
            </View>

            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.AuditCycleName}
            </Text>

            <View style={styles.dateRow}>
              <View style={styles.calendarIcon}>
                <Icon name="calendar-o" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.dateText} numberOfLines={1}>
                {this.changeDateFormatCard(item.StartDate)} -{' '}
                {this.changeDateFormatCard(item.EndDate)}
              </Text>
            </View>

            <View style={styles.auditNumberWrap}>
              <Text style={styles.auditNumber} numberOfLines={1}>
                {item.AuditNumber}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log('auditList--------', this.state.auditList);
    return (
      <View style={styles.screen}>
        <OfflineNotice />
        <GlobalHeader
          title={strings.downloads || 'Downloads'}
          subtitle={this.state.breadCrumb}
          onLeftPress={() => {
            if (!this.state.isLoading && !this.state.isDownloading) {
              this.props.route?.params?.PreviousPage == ROUTES.ALLTABAUDITLIST_SM
                ? this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM, { smData: this.props.route?.params?.smData })
                : this.props.navigation.goBack();
            } else {
              console.log('Component is not ready to goBack..');
            }
          }}
          onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.contentContainer}>
          {this.state.auditList.length > 0 ? (
            <FlatList
              data={this.state.auditList}
              extraData={this.state}
              keyExtractor={item => item.ActualAuditId}
              renderItem={({ item }) => this.renderAuditCard(item)}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <NoRecordsFound
                title={strings.No_Audits_Found}
                subtitle={strings.No_Audits_Found_Subtitle}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
  renderHeader() {
    return (
      <View style={AuditPageStyle.header}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <View style={AuditPageStyle.backlogo}>
            <Icon name="angle-left" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <View style={AuditPageStyle.heading}>
          <Text style={AuditPageStyle.headingText}>{strings.downloads}</Text>
        </View>
        <View style={AuditPageStyle.headerDiv}>
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}>
            <Icon name="home" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Download);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFD',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5EAF2',
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#111111',
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  listSeparator: {
    height: 16,
  },
  cardTouch: {
    borderRadius: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 16,
    shadowColor: '#8FA6C3',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 4,
  },
  accentBar: {
    width: 5,
    borderRadius: 8,
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardHeaderContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: Fonts.size.h5,
    lineHeight: 28,
    color: '#204AA9',
    fontFamily: 'OpenSans-Bold',
    marginBottom: 2,
  },
  cardIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D8E5F5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6F737C',
    fontFamily: 'OpenSans-Bold',
    // marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    color: '#2F3440',
    fontSize: 17,
    fontFamily: 'OpenSans-Bold',
  },
  auditNumberWrap: {
    backgroundColor: '#EFF4FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  auditNumber: {
    color: '#23334D',
    fontSize: 17,
    fontFamily: 'OpenSans-Bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
