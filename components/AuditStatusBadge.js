import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FONT_TYPE } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { formatAuditStatusLabel, getAuditStatusColor } from 'helpers/audit-status';
import TextComponent from './text';

const tintColor = hex => {
    if (!hex || typeof hex !== 'string') {
        return '#F8FAFC';
    }
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) {
        return '#F8FAFC';
    }
    return `#${normalized}22`;
};

const AuditStatusBadge = ({ cStatus, color, size = 'normal' }) => {
    const resolvedColor = color || getAuditStatusColor(cStatus);
    const label = formatAuditStatusLabel(cStatus);
    const isSmall = size === 'small';

    return (
        <View
            style={[
                styles.badge,
                isSmall && styles.badgeSmall,
                { borderColor: resolvedColor, backgroundColor: tintColor(resolvedColor) },
            ]}>
            <View style={[styles.dot, isSmall && styles.dotSmall, { backgroundColor: resolvedColor }]} />
            <TextComponent
                fontSize={isSmall ? FONT_SIZE.X_SMALL : FONT_SIZE.SMALL}
                type={FONT_TYPE.BOLD}
                style={{ color: resolvedColor }}>
                {label}
            </TextComponent>
        </View>
    );
};

export default AuditStatusBadge;

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: SPACING.X_SMALL,
        paddingHorizontal: SPACING.SMALL,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeSmall: {
        paddingVertical: 3,
        paddingHorizontal: SPACING.X_SMALL,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    dotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
});
