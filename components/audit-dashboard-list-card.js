import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { COLORS, SPACING } from 'constants/theme-constants';
import { USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import { IMAGES } from 'assets/images';
import ImageComponent from './image-component';
import AuditActivityCardContent from './audit-activity-card-content';

const AuditDashboardListCard = ({
    item = {},
    localAudits = [],
    onPress,
    logo = IMAGES.auditpro_logo,
}) => {
    const { sites } = useAppContext();
    const elevation = getElevation();

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, elevation]}>
                {logo && sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && (
                    <Ripple rippleContainerBorderRadius={SPACING.SMALL} activeOpacity={1} style={styles.moduleLogo}>
                        <ImageComponent resizeMode="contain" source={logo} />
                    </Ripple>
                )}
                <AuditActivityCardContent
                    item={item}
                    title={item?.Auditee || item?.SiteName || ''}
                    localAudits={localAudits}
                    hideAuditeeInMeta
                />
            </TouchableOpacity>
        </View>
    );
};

export default AuditDashboardListCard;

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: SPACING.NORMAL,
    },
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
