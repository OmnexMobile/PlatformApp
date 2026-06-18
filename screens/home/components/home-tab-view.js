import strings from 'config/localization';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TabsCard from './home-tab-card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditColors, AuditLayout, AuditShadows, AuditTypography, InterFont } from 'constants/audit-hub-design';

const TabsView = ({ countDetails, currentName }) => {
    const [index, setIndex] = React.useState(0);
    const [isSupplier, setSupplier] = React.useState(false);
    const [isValue, setIsValue] = React.useState(0);
    const [routes, setRoutes] = React.useState([]);

    const loadTabRoutes = React.useCallback(async () => {
        setIsValue(0);
        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
        setSupplier(value?.smAccess || 'false');
        if (value?.smAccess == 'true') {
            setRoutes([
                { key: 'first', title: strings.internal },
                { key: 'second', title: strings.supplier },
            ]);
        } else {
            setRoutes([{ key: 'first', title: strings.internal }]);
            setIndex(0);
        }
        setIsValue(1);
    }, []);

    React.useEffect(() => {
        loadTabRoutes();
    }, [loadTabRoutes]);

    useFocusEffect(
        React.useCallback(() => {
            loadTabRoutes();
        }, [loadTabRoutes]),
    );

    if (isValue !== 1) {
        return null;
    }

    return (
        <View style={styles.container}>
            {routes.length > 1 ? (
                <View style={styles.tabsContainer}>
                    {routes.map((route, routeIndex) => {
                        const focused = routeIndex === index;
                        return (
                            <TouchableOpacity
                                key={route.key}
                                activeOpacity={0.85}
                                style={focused ? styles.activeTab : styles.inactiveTab}
                                onPress={() => setIndex(routeIndex)}>
                                <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>{route.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}

            <View style={styles.content}>
                <TabsCard {...{ countDetails }} tabIndex={index} currentUser={currentName} isSupplier={isSupplier} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AuditColors.background,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: AuditColors.white,
        borderRadius: AuditLayout.tabContainerRadius,
        padding: 4,
        marginHorizontal: AuditLayout.screenHorizontal,
        marginTop: AuditLayout.sectionGap,
        ...AuditShadows.search,
    },
    activeTab: {
        flex: 1,
        backgroundColor: AuditColors.primary,
        borderRadius: AuditLayout.tabActiveRadius,
        alignItems: 'center',
        justifyContent: 'center',
        height: AuditLayout.tabHeight,
    },
    inactiveTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: AuditLayout.tabHeight,
    },
    activeTabText: {
        color: AuditColors.white,
        ...AuditTypography.caption,
        fontFamily: InterFont.semiBold,
    },
    inactiveTabText: {
        color: AuditColors.textSecondary,
        ...AuditTypography.caption,
        fontFamily: InterFont.medium,
    },
    content: {
        flex: 1,
    },
});

export default TabsView;
