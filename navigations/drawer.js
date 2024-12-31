import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

import { BottomTab } from './bottom-tab';
import { StyleSheet } from 'react-native';
import { Colors } from 'constants/theme-constants';
import { CustomDrawerContent } from './drawer-content';
import { SalonDetailStack } from './stack';
import SalonServices from 'screens/salon-services';
import SalonTimings from 'screens/salon-timings';

const Drawer = createDrawerNavigator();

export function AppDrawer() {
	const [Progress, setProgress] = useState(new Animated.Value(0));
	const scale = Animated.interpolate(Progress, {
		inputRange: [0, 1],
		outputRange: [1, 0.8],
	});
	const borderRadius = Animated.interpolate(Progress, {
		inputRange: [0, 1],
		outputRange: [0, 16],
	});
	const animatedStyle = { borderRadius, transform: [{ scale }] };
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			initialRouteName="Home"
			// overlayColor="transparent"
			drawerStyle={styles.drawerStyles}
			drawerType="slide">
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
		fontFamily: 'ProximaNova-Regular',
		fontSize: 25,
	},
	drawerContent: {
		flex: 1,
	},
});
