import React from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import { enrichAuditItem } from 'helpers/audit-status';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import AuditStatusBadge from './AuditStatusBadge';
import IconComponent from './icon-component';
import TextComponent from './text';

const LOGO_RESERVE = RFPercentage(7.5);

const AuditActivityCardContent = ({ item = {}, title, localAudits = [], hideAuditeeInMeta = false }) => {
    const { timeSettings } = useAppContext();
    const { theme } = useTheme();
    const enriched = enrichAuditItem(item, localAudits);
    const dateFormat = DATE_FORMAT[timeSettings || 'DD_MM_YYYY'];

    const metaParts = [
        ...(hideAuditeeInMeta ? [] : [item?.Auditee]),
        item?.AuditTypeName,
    ].filter(Boolean);
    const metaLine = metaParts.join(' · ');

    return (
        <View style={styles.content}>
            <View style={[styles.accentBar, { backgroundColor: enriched.color }]} />
            <View style={styles.body}>
                <View style={styles.headerRow}>
                    <TextComponent
                        numberOfLines={2}
                        fontSize={FONT_SIZE.NORMAL}
                        type={FONT_TYPE.BOLD}
                        style={[styles.title, { color: theme.colors.primaryThemeColor }]}>
                        {title}
                    </TextComponent>
                </View>

                <View style={styles.statusRow}>
                    <AuditStatusBadge cStatus={enriched.cStatus} color={enriched.color} size="small" />
                </View>

                {metaLine ? (
                    <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={styles.metaText}>
                        {metaLine}
                    </TextComponent>
                ) : null}

                <View style={styles.dateRow}>
                    <View style={styles.calendarIcon}>
                        <IconComponent
                            name="calendar"
                            color={COLORS.white}
                            type={ICON_TYPE.AntDesign}
                            size={FONT_SIZE.X_SMALL}
                        />
                    </View>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} style={styles.dateText}>
                        {moment(item?.StartDate).format(dateFormat)} – {moment(item?.EndDate).format(dateFormat)}
                    </TextComponent>
                </View>

                {item?.AuditNumber ? (
                    <View style={styles.auditNumberWrap}>
                        <TextComponent
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.72}
                            fontSize={FONT_SIZE.SMALL}
                            type={FONT_TYPE.BOLD}
                            style={styles.auditNumber}>
                            {item.AuditNumber}
                        </TextComponent>
                    </View>
                ) : null}

                {item?.lastOpened ? (
                    <TextComponent style={styles.lastOpened} fontSize={FONT_SIZE.X_SMALL} type={FONT_TYPE.BOLD}>
                        Last opened: {moment(item.lastOpened).fromNow()}
                    </TextComponent>
                ) : null}
            </View>
        </View>
    );
};

export default AuditActivityCardContent;

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
    },
    accentBar: {
        width: 5,
        borderRadius: 3,
        marginRight: SPACING.SMALL,
        alignSelf: 'stretch',
    },
    body: {
        flex: 1,
        minWidth: 0,
        paddingRight: LOGO_RESERVE,
    },
    headerRow: {
        marginBottom: SPACING.XX_SMALL,
    },
    title: {
        lineHeight: FONT_SIZE.NORMAL * 1.25,
        paddingRight: SPACING.XX_SMALL,
    },
    statusRow: {
        alignSelf: 'flex-start',
        marginBottom: SPACING.X_SMALL,
    },
    metaText: {
        color: COLORS.themeBlack,
        marginBottom: SPACING.X_SMALL,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.X_SMALL,
    },
    calendarIcon: {
        width: RFPercentage(2.2),
        height: RFPercentage(2.2),
        backgroundColor: COLORS.WARNING,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginRight: SPACING.X_SMALL,
    },
    dateText: {
        color: COLORS.themeBlack,
        flex: 1,
    },
    auditNumberWrap: {
        width: '100%',
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
        paddingHorizontal: SPACING.SMALL,
        paddingVertical: SPACING.X_SMALL,
        marginTop: SPACING.XX_SMALL,
    },
    auditNumber: {
        color: '#1E293B',
        width: '100%',
    },
    lastOpened: {
        color: COLORS.green,
        marginTop: SPACING.X_SMALL,
    },
});
