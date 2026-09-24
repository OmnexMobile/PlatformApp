import React, { useEffect, useState } from 'react';
import { Content, IconComponent } from 'components';
import { ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import TabsView from './home-tab-view';
import localStorage from 'global/localStorage';
import { Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'helpers/utils';
import { AuditColors, AuditLayout, AuditTypography } from 'constants/audit-hub-design';

const HomeFabFunctional = ({ countDetails }) => {
    const [currentName, setCurrentName] = useState('');
    const navigations = useNavigation();
    const insets = useSafeAreaInsets();
    const topSafePadding = Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);

    useEffect(() => {
        async function fetchData() {
            const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
            setCurrentName(UserFullName);
        }
        fetchData();
    }, [currentName]);

    const handleDashboard = () => {
        navigations.navigate(ROUTES.GLOBAL_DASHBOARD);
    };

    const handleCalendar = () => {
        navigations.navigate(ROUTES.CALENDER_LIST);
    };

    return (
        <Content noPadding>
            <View style={[styles.headerContainer, { paddingTop: topSafePadding + 10 }]}>
                <View style={styles.headerTopRow}>
                    <Pressable
                        accessibilityLabel="Go to dashboard"
                        style={styles.backButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        onPress={handleDashboard}>
                        <IconComponent name="arrowleft" type={ICON_TYPE.AntDesign} size={RFPercentage(2.6)} color={AuditColors.primary} />
                    </Pressable>
                    {/* need to comment while giving the build for phase 1 */}
                    <Pressable
                        accessibilityLabel="Open calendar"
                        style={styles.calendarButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        onPress={handleCalendar}>
                        <IconComponent name="calendar" type={ICON_TYPE.AntDesign} size={RFPercentage(2.6)} color={AuditColors.primary} />
                    </Pressable>
                </View>
            </View>
            <TabsView countDetails={countDetails} currentName={currentName} />
        </Content>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: AuditLayout.screenHorizontal,
        paddingBottom: 16,
        backgroundColor: AuditColors.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: AuditColors.border,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBlock: {},
    title: {
        ...AuditTypography.h1,
        color: AuditColors.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        marginTop: 4,
        fontSize: 15,
        fontFamily: AuditTypography.body.fontFamily,
        color: AuditColors.textSecondary,
    },
});

export default HomeFabFunctional;
