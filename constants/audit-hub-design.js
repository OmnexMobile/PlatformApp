/**
 * Audits hub design tokens — Inter font family.
 * iOS uses PostScript names from the bundled TTF files; Android uses filenames.
 */
import { Platform } from 'react-native';

export const InterFont = {
    regular: Platform.select({ ios: 'Inter18pt-Regular', android: 'Inter-Regular' }),
    medium: Platform.select({ ios: 'Inter18pt-Medium', android: 'Inter-Medium' }),
    semiBold: Platform.select({ ios: 'Inter18pt-SemiBold', android: 'Inter-SemiBold' }),
    bold: Platform.select({ ios: 'Inter18pt-Bold', android: 'Inter-Bold' }),
};

export const AuditTypography = {
    h1: { fontSize: 30, fontFamily: InterFont.bold, letterSpacing: -0.5 },
    h2: { fontSize: 24, fontFamily: InterFont.bold },
    title: { fontSize: 18, fontFamily: InterFont.semiBold },
    body: { fontSize: 16, fontFamily: InterFont.regular },
    caption: { fontSize: 14, fontFamily: InterFont.regular },
    metricTitle: {
        fontSize: 11,
        fontFamily: InterFont.semiBold,
        lineHeight: 14,
        letterSpacing: -0.2,
    },
    metricValue: { fontSize: 30, fontFamily: InterFont.bold, lineHeight: 34 },
    metricSubtitle: {
        fontSize: 10,
        fontFamily: InterFont.regular,
        lineHeight: 13,
    },
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
    metricCardMinHeight: 136,
    metricCardBottomBorder: 4,
    metricIconCircle: 32,
    searchHeight: 56,
    searchRadius: 16,
    tabHeight: 44,
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
