/**
 * Audits hub design tokens — Inter 18pt static font family.
 * iOS resolves by PostScript name; Android resolves by font filename (Inter18pt-*.ttf).
 */
import { Dimensions, Platform } from 'react-native';

export const InterFont = {
    regular: 'Inter18pt-Regular',
    medium: 'Inter18pt-Medium',
    semiBold: 'Inter18pt-SemiBold',
    bold: 'Inter18pt-Bold',
};

/** Android ignores fontWeight when a custom fontFamily is set — use the matching Inter file instead. */
export const interText = (fontFamily, style = {}) => ({
    ...style,
    fontFamily,
    ...(Platform.OS === 'android' ? { fontWeight: 'normal' } : {}),
});

export const AuditTypography = {
    h1: interText(InterFont.bold, { fontSize: 30, letterSpacing: -0.5 }),
    h2: interText(InterFont.bold, { fontSize: 24 }),
    title: interText(InterFont.semiBold, { fontSize: 18 }),
    body: interText(InterFont.regular, { fontSize: 16 }),
    caption: interText(InterFont.regular, { fontSize: 14 }),
    tabLabel: interText(InterFont.semiBold, { fontSize: 16, lineHeight: 20 }),
    tabLabelInactive: interText(InterFont.medium, { fontSize: 16, lineHeight: 20 }),
    metricTitle: interText(InterFont.semiBold, {
        fontSize: 13,
        lineHeight: 17,
        letterSpacing: -0.1,
    }),
    metricValue: interText(InterFont.bold, { fontSize: 30, lineHeight: 34 }),
    metricSubtitle: interText(InterFont.medium, {
        fontSize: 12,
        lineHeight: 16,
    }),
};

export const AuditColors = {
    primary: '#1D4ED8',
    scheduled: '#2563EB',
    success: '#10B981',
    danger: '#EF4444',
    purple: '#8B5CF6',
    background: '#F8FAFC',
    white: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
};

export const AuditLayout = {
    screenHorizontal: 20,
    sectionGap: 24,
    cardGap: 12,
    moduleCardRadius: 24,
    moduleCardPadding: 16,
    metricCardRadius: 20,
    metricCardPadding: 10,
    metricCardMinHeight: 148,
    metricCardBottomBorder: 4,
    metricIconCircle: 32,
    searchHeight: 56,
    searchRadius: 16,
    tabHeight: 48,
    tabContainerRadius: 16,
    tabActiveRadius: 12,
};

export const AuditShadows = {
    card: Platform.select({
        ios: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
        },
        android: { elevation: 3 },
    }),
    metric: Platform.select({
        ios: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
        },
        android: { elevation: 2 },
    }),
    search: Platform.select({
        ios: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
        },
        android: { elevation: 2 },
    }),
};

export const getAuditMetricTheme = (category = '') => {
    const key = category.toLowerCase();
    if (key.includes('scheduled')) {
        return { accent: AuditColors.scheduled, borderColor: AuditColors.scheduled, iconBg: '#EFF6FF' };
    }
    if (key.includes('completed') && !key.includes('deadline')) {
        return { accent: AuditColors.success, borderColor: AuditColors.success, iconBg: '#ECFDF5' };
    }
    if (key.includes('deadline') || key.includes('violated')) {
        return { accent: AuditColors.danger, borderColor: AuditColors.danger, iconBg: '#FEF2F2' };
    }
    if (key.includes('closed')) {
        return { accent: AuditColors.purple, borderColor: AuditColors.purple, iconBg: '#F5F3FF' };
    }
    if (key.includes('open')) {
        return { accent: '#0891B2', borderColor: '#0891B2', iconBg: '#ECFEFF' };
    }
    if (key.includes('progress')) {
        return { accent: '#D97706', borderColor: '#D97706', iconBg: '#FFFBEB' };
    }
    if (key.includes('concern')) {
        return { accent: AuditColors.scheduled, borderColor: AuditColors.scheduled, iconBg: '#EFF6FF' };
    }
    if (key.includes('inspection') || key.includes('operator') || key.includes('worksheet')) {
        return { accent: '#0E7490', borderColor: '#0E7490', iconBg: '#ECFEFF' };
    }
    return { accent: AuditColors.scheduled, borderColor: AuditColors.scheduled, iconBg: '#EFF6FF' };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Estimate metric card width and return font sizes that scale with available card space. */
export const getAuditMetricFontSizes = (screenWidth = Dimensions.get('window').width, columns = 2) => {
    const horizontalInset = AuditLayout.screenHorizontal * 2 + AuditLayout.moduleCardPadding * 2;
    const gridGutter = AuditLayout.cardGap * Math.max(columns - 1, 0);
    const cardWidth = (screenWidth - horizontalInset - gridGutter) / columns;
    const scale = clamp(cardWidth / 165, 0.92, 1.35);

    return {
        title: {
            fontSize: clamp(Math.round(13 * scale), 12, 16),
            lineHeight: clamp(Math.round(17 * scale), 15, 20),
        },
        value: {
            fontSize: clamp(Math.round(28 * scale), 24, 36),
            lineHeight: clamp(Math.round(32 * scale), 28, 40),
        },
        subtitle: {
            fontSize: clamp(Math.round(12 * scale), 11, 15),
            lineHeight: clamp(Math.round(16 * scale), 14, 19),
        },
        iconCircle: clamp(Math.round(AuditLayout.metricIconCircle * scale), 30, 40),
    };
};

export const getAuditGridColumns = (screenWidth = Dimensions.get('window').width) => (screenWidth < 360 ? 1 : 2);
