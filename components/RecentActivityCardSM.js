import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from 'constants/theme-constants';
import { useSelector } from 'react-redux';
import { ROUTES, USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import { IMAGES } from 'assets/images';
import ImageComponent from './image-component';
import AuditActivityCardContent from './audit-activity-card-content';
import { enrichAuditItem } from 'helpers/audit-status';

const EMPTY_AUDITS = [];

const RecentActivityCardSM = ({ item = {} }) => {
    const { sites } = useAppContext();
    const elevation = getElevation();
    const navigation = useNavigation();
    const localAudits = useSelector(state => state?.audits?.audits) || EMPTY_AUDITS;

    const handleClickCard = selectedItem => {
        const enrichedItem = enrichAuditItem(selectedItem, localAudits);

        if (selectedItem?.recent_Module === 'AUDIT_PAGE_SM') {
            navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                screenFrom: 'Dashboard',
                datapass: enrichedItem,
            });
        } else {
            navigation.navigate(ROUTES.AUDIT_PAGE, {
                screenFrom: 'Dashboard',
                datapass: enrichedItem,
            });
        }
    };

    const isSupplierModule = item?.recent_Module === 'AUDIT_PAGE_SM';
    const isAuditPro = Number(item?.smData) === 1;

    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleClickCard?.(item)}
                style={[styles.card, elevation]}>
                {sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && (
                    <Ripple rippleContainerBorderRadius={SPACING.SMALL} activeOpacity={1} style={styles.moduleLogo}>
                        <ImageComponent
                            resizeMode="contain"
                            source={isAuditPro ? IMAGES.auditpro_logo : isSupplierModule ? IMAGES.supplier_logo : IMAGES.auditpro_logo}
                        />
                    </Ripple>
                )}
                <AuditActivityCardContent
                    item={item}
                    title={sites?.selectedSite?.SiteName || item?.SiteName || ''}
                    localAudits={localAudits}
                />
            </TouchableOpacity>
        </View>
    );
};

export default RecentActivityCardSM;

const styles = StyleSheet.create({
    card: {
        paddingVertical: SPACING.SMALL,
        paddingHorizontal: SPACING.SMALL,
        borderRadius: 12,
        marginBottom: SPACING.SMALL,
        marginTop: SPACING.X_SMALL,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#E8EDF3',
        overflow: 'hidden',
    },
    moduleLogo: {
        position: 'absolute',
        right: SPACING.SMALL,
        top: SPACING.SMALL,
        width: RFPercentage(5.5),
        height: RFPercentage(5.5),
        backgroundColor: COLORS.white,
        borderRadius: RFPercentage(2.75),
        borderWidth: 1,
        borderColor: '#E8EDF3',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
});
