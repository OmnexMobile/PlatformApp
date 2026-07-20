import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { ROUTES, STATUS, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import { IMAGES } from 'assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageComponent from './image-component';
import AuditActivityCardContent from './audit-activity-card-content';
import { enrichAuditItem } from 'helpers/audit-status';

const EMPTY_AUDITS = [];

const ListCardLogoSM = ({ item = {}, statusBooleans }) => {
    const { sites } = useAppContext();
    const elevation = getElevation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const localAudits = useSelector(state => state?.audits?.audits) || EMPTY_AUDITS;

    const getSupplierIndex = moduleName => {
        if (moduleName === 'Supplier Initial Assessment') {
            return 2;
        }
        if (moduleName === 'Supplier Routine Audit') {
            return 3;
        }
        return 1;
    };
console.log('statusBooleanslist',statusBooleans);

    const handleClickCard = async selectedItem => {
        const enrichedItem = enrichAuditItem(selectedItem, localAudits);

        if (selectedItem?.Module_name === 'Supplier Initial Assessment' || selectedItem?.Module_name === 'Supplier Routine Audit') {
            const smData = getSupplierIndex(selectedItem?.Module_name);
            const auditStatusPass = enrichedItem?.cStatus ?? selectedItem?.AuditStatus;

            dispatch({ type: 'STORE_SUPPLIER_DATA', smdata: smData });
            await AsyncStorage.setItem('supplierIndex', JSON.stringify(smData));

            navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                screenFrom: 'Dashboard',
                datapass: { ...enrichedItem, smData, cStatus: auditStatusPass },
                auditStatusPass,
                smData,
            });
        } else if (selectedItem?.Module_name === 'AuditPro') {
            navigation.navigate(ROUTES.AUDIT_PAGE, {
                screenFrom: 'Dashboard',
                datapass: enrichedItem,
            });
        } else {
            navigation.navigate(selectedItem?.Status === STATUS.CREATED ? ROUTES.CONCERN_INITIAL_EVALUATION : ROUTES.VIEW_CONCERN_PS, {
                ConcernID: selectedItem?.ConcernID,
                ...(selectedItem?.StatusID === STATUS_CODES.IN_PROGRESS.toString() && { FormTypeID: 3 }),
            });
        }
    };

    const isSupplierModule =
        item?.Module_name === 'Supplier Initial Assessment' || item?.Module_name === 'Supplier Routine Audit';

    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleClickCard?.(item)}
                style={[styles.card, elevation]}>
                {sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && (
                    <Ripple
                        rippleContainerBorderRadius={SPACING.SMALL}
                        activeOpacity={1}
                        style={styles.moduleLogo}>
                        <ImageComponent
                            resizeMode="contain"
                            source={isSupplierModule ? IMAGES.supplier_logo : IMAGES.auditpro_logo}
                        />
                    </Ripple>
                )}
                <AuditActivityCardContent
                    item={item}
                    title={item?.SiteName || sites?.selectedSite?.SiteName || ''}
                    localAudits={localAudits}
                    statusBooleans={statusBooleans}
                />
            </TouchableOpacity>
        </View>
    );
};

export default ListCardLogoSM;

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
