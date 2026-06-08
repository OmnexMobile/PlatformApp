import React, { Component } from 'react';
import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import { ROUTES } from 'constants/app-constant';
import { IMAGES } from 'assets/images';
import AuditDashboardListCard from 'components/audit-dashboard-list-card';
import { strings } from '../language/Language';

class AuditCard extends Component {
    openAuditPage(iAuditDetails) {
        const smData = this.props?.smData;
        const auditDetailsWithSmData =
            smData !== null && typeof smData !== 'undefined' ? { ...iAuditDetails, smData } : iAuditDetails;

        const auditRecords = this.props?.data?.audits?.auditRecords || [];
        const isDownloadedDone = auditRecords.some(
            record => record.AuditId == iAuditDetails.ActualAuditId,
        );

        const navigateToAudit = () => {
            this.props.naviData.navigate(ROUTES.AUDIT_PAGE_SM, {
                datapass: auditDetailsWithSmData,
                auditStatusPass: this.props?.item?.cStatus,
                smData,
            });
        };

        if (isDownloadedDone) {
            navigateToAudit();
            return;
        }

        if (this.props.data.audits.isOfflineMode) {
            this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
            return;
        }

        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                navigateToAudit();
            } else {
                this.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
            }
        });
    }

    render() {
        const { item } = this.props;
        const localAudits = this.props.data?.audits?.audits || [];

        return (
            <View>
                <AuditDashboardListCard
                    item={item}
                    localAudits={localAudits}
                    onPress={() => this.openAuditPage(item)}
                    logo={IMAGES.supplier_logo}
                />
                <Toast
                    ref={toast => (this.toast = toast)}
                    style={{ backgroundColor: 'black', margin: 20 }}
                    position="top"
                    positionValue={0}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    data: state,
});

export default connect(mapStateToProps)(AuditCard);
