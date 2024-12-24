import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { StyleSheet, View } from 'react-native';
import { Colors } from 'constants/theme-constants';

export function CustomDrawerContent({ progress, navigation, ...rest }) {
	const routes = [
		{
			name: 'Home',
			icon: 'account-outline',
			onPress: () => navigation.navigate('Home'),
		},
		{
			name: 'Salon Details',
			icon: 'tune',
			onPress: () => navigation.navigate('SalonDetails'),
		},
		{
			name: 'Salon Services',
			icon: 'tune',
			onPress: () => navigation.navigate('SalonServices'),
		},
		{
			name: 'Salon Timings',
			icon: 'tune',
			onPress: () => navigation.navigate('SalonTimings'),
		},
	];
	const translateX = Animated.interpolate(progress, {
		inputRange: [0, 1],
		outputRange: [-100, 0],
	});
	const opacity = Animated.interpolate(progress, {
		inputRange: [0, 0.6, 1],
		outputRange: [0, 0, 1],
	});

	const { state: { index } = {} } = rest;

	return (
		<DrawerContentScrollView {...rest}>
			<Animated.View
				style={{
					opacity,
					transform: [
						{
							translateX,
						},
					],
				}}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<Avatar.Image
							source={{
								uri: 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
							}}
							size={50}
						/>
						<Title style={styles.title}>Sathish Saminathan</Title>
						<Caption style={styles.caption}>@sachu</Caption>
					</View>
					<Drawer.Section style={styles.drawerSection}>
						{routes.map(({ name, icon, onPress }, i) => {
							const selected = index === i;
							return (
								<DrawerItem
									key={i}
									{...{
										labelStyle: {
											color: selected ? Colors.primaryThemeColor : Colors.lightGrey,
											...(selected && { fontWeight: 'bold' }),
										},
										onPress,
										label: name,
										icon: ({ color, size }) => (
											<MaterialCommunityIcons name={icon} color={selected ? Colors.primaryThemeColor : color} size={size} />
										),
									}}
								/>
							);
						})}
						{/* <DrawerItem
							icon={({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} />}
							label="Home"
							onPress={() => navigation.navigate('Home')}
						/>
						<DrawerItem
							icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
							label="Salon Details"
							onPress={() => navigation.navigate('SalonDetails')}
						/>
						<DrawerItem
							icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
							label="Staffs"
							onPress={() => {}}
						/>
						<DrawerItem
							icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
							label="Services"
							onPress={() => {}}
						/>
						<DrawerItem
							icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
							label="Preferences"
							onPress={() => {}}
						/> */}
					</Drawer.Section>
				</View>
			</Animated.View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	drawerStyles: { flex: 1, width: '60%', backgroundColor: Colors.red },
	drawerItem: { marginVertical: 0, flex: 1, height: 60, alignItems: 'center' },
	drawerLabel: {
		color: Colors.themeBlack,
		fontFamily: 'ProximaNova-Regular',
		fontSize: 25,
	},
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
	},
	title: {
		marginTop: 20,
		fontWeight: 'bold',
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
	},
	row: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15,
	},
});
