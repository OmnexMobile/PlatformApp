import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { BottomTab } from './bottom-tab';
import { StyleSheet } from 'react-native';
import { Colors } from 'constants/theme-constants';
import { CustomDrawerContent } from './drawer-content';
import { SalonDetailStack } from './stack';
import SalonServices from 'screens/salon-services';
import SalonTimings from 'screens/salon-timings';

const Drawer = createDrawerNavigator();

export function AppDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            initialRouteName="Home"
            screenOptions={{
                drawerStyle: styles.drawerStyles,
                drawerType: 'slide',
                overlayColor: 'rgba(0, 0, 0, 0.35)',
            }}>
            <Drawer.Screen name="Home" component={BottomTab} />
            <Drawer.Screen name="SalonDetails" component={SalonDetailStack} />
            <Drawer.Screen name="SalonServices" component={SalonServices} />
            <Drawer.Screen name="SalonTimings" component={SalonTimings} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerStyles: { flex: 1, width: '60%', backgroundColor: Colors.white },
    drawerItem: { marginVertical: 0, backgroundColor: 'red', flex: 1, height: 60, alignItems: 'center' },
    drawerLabel: {
        color: Colors.themeBlack,
        fontFamily: 'OpenSans-Regular',
        fontSize: 25,
    },
    drawerContent: {
        flex: 1,
    },
});
