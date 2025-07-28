import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Content, TextComponent, ExitModal, ChooseSite, FAB, Avatar } from 'components';
import { APP_VARIABLES, FONT_TYPE, ROUTES, USER_TYPE, ICON_TYPE, STATUS_CODES, LOCAL_STORAGE_VARIABLES,  } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import strings from 'config/localization';
import IconComponent from 'components/icon-component';
import { useAppContext } from 'contexts/app-context';
import { getAvatarInitials, RFPercentage } from 'helpers/utils';
// import HomeStatusbar from './home-status-count';
import { useSelector } from 'react-redux';
import ProjectCount from './ProjectCount';
import { ScrollView } from 'react-native-gesture-handler';
import localStorage from 'global/localStorage';
import { HomeListComponent } from './home-list';

const HomeDashboard = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const { sites, recentActivities } = useAppContext();
    const [currentName, setCurrentName] = useState("");
	const {
			todayList,
			upcomingList,
			pendingList,
			countDetails = {},
			loading: countDetailsLoading,
	} = useSelector (
			({
					homeRedux: {
							dashboardConcernList: { todayList, upcomingList, pendingList },
							dashboardConcernCounts: { countDetails, loading },
					},
			}) => ({ todayList, upcomingList, pendingList, countDetails, loading }),
	);

  useEffect(() => {
    async function fetchData() {
      const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
      console.log('UserFullName------------', UserFullName)
      setCurrentName(UserFullName)
    }
    fetchData()
  },[currentName])

  console.log('sites?.selectedSite?.FullName || currentName---->', sites?.selectedSite?.FullName, '---', currentName, '---', sites)
  console.log('handleAddRecentActivities ~ recentActivities', recentActivities)
	// const Button = ({ title = '', value = 0, color = COLORS.themeBlack, navigation, field, loading, index }) => {
	//   if (loading)
	// 	return (
	// 		<View style={{ justifyContent: 'center', alignItems: 'center', width: RFPercentage(10), paddingVertical: SPACING.SMALL }}>
	// 			<SkeletonPlaceholder>
	// 				<View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
	// 					<View style={{ marginTop: SPACING.SMALL }}>
	// 							<View style={{ width: 30, height: 10, borderRadius: 4 }} />
	// 					</View>
	// 					<View style={{ marginTop: SPACING.SMALL }}>
	// 							<View style={{ width: 60, height: 10, borderRadius: 4 }} />
	// 					</View>
	// 				</View>
	// 			</SkeletonPlaceholder>
	// 		</View>
	// 	);
	// 	return (
	// 		<TouchableOpacity
	// 				activeOpacity={0.8}
	// 				style={{ alignItems: 'center', justifyContent: 'center', width: RFPercentage(10) }}
	// 				onPress={ () =>
	// 					navigation.navigate(ROUTES.LIST_SCREEN_PS, {
	// 							[APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
	// 							title,
	// 					})
	// 				}>
	// 				<TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
	// 						{value}
	// 				</TextComponent>
	// 				<TextComponent fontSize={FONT_SIZE.SMALL} color={color}>
	// 						{title}
	// 				</TextComponent>
	// 		</TouchableOpacity>
	// 	);
	// };

	// const Divider = () => (
	// 	<View
	// 			style={{
	// 					width: 2,
	// 					marginVertical: SPACING.SMALL,
	// 					backgroundColor: theme.mode.borderColor,
	// 			}}
	// 	/>
  // );

  const navigateToSettings = () => {
    console.log('click settings')
    navigation.navigate(ROUTES.GLOBAL_SETTINGS);
  }

	return (
		<Content noPadding>
			<View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}>
					{/* <TouchableOpacity 
							onPress={() => navigation.navigate(ROUTES.HOME_FAB_VIEW) }
							hitSlop={{top: 20, bottom: 20, left: 100, right: 100}}
							style={{right: SPACING.SMALL}}
							>
							<IconComponent
									name={'arrowleft'}
									type={ICON_TYPE.AntDesign}
									color={theme.colors.primaryThemeColor}
									size={25}
							/>
					</TouchableOpacity> */}
					<View style={{ flex: 9}}>
							<TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
									{strings.welcome}!
							</TextComponent>
							<TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
                  {sites?.selectedSite?.FullName || currentName}
							</TextComponent>
					</View>
					<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
							<TouchableOpacity activeOpacity={0.8} onPress={() => navigateToSettings()}>
									<Avatar
											// img={activeOrganization?.img}
											placeholder={getAvatarInitials(sites?.selectedSite?.SiteName)}
											width={RFPercentage(7)}
											height={RFPercentage(7)}
											style={{
													backgroundColor: theme.colors.primaryThemeColor,
													borderRadius: 100,
											}}
									/>
							</TouchableOpacity>
					</View>
			</View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

      {/* APQP/PPAP */}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
          <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
            {'APQP/PPAP'}
          </TextComponent>
        </View>
        <View style={{
          paddingTop: SPACING.SMALL,
          paddingBottom: SPACING.SMALL,
          borderBottomWidth: 2,
          borderColor: theme.mode.borderColor,
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.SMALL,
          }}>
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Projects"
              color="#00a1e2"
              value={0}
              field={'Projects'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Risk"
              color="#e64884"
              value={0}
              field={'Risk'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Meeting"
              color="#06c16f"
              value={0}
              field={'Meeting'}
            />
          </View>
        </View> */}
        {/* <ProjectCount {...{ countDetails, projectCategory :'Projects', title: 'APQP' }}  /> */}

        {/*  Audit Pro */}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
          <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
            {'Audit Pro'}
          </TextComponent>
        </View>
        <View style={{
          paddingTop: SPACING.SMALL,
          paddingBottom: SPACING.SMALL,
          borderBottomWidth: 2,
          borderColor: theme.mode.borderColor,
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.SMALL,
          }}>
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Scheduled"
              color="#00a1e2"
              value={0}
              field={'Scheduled'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Completed"
              color="#06c16f"
              value={0}
              field={'Completed'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Deadline Violated"
              color={COLORS.ALERT}
              value={0}
              field={'DViolated'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Closed Out"
              color="#e64884"
              value={0}
              field={'ClosedOut'}
            />
          </View>
        </View>
        <ProjectCount {...{ countDetails, projectCategory :'Audits', title: 'AP' }}  /> */}

        {/* Problem Solver */}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
          <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
            {'Problem Solver'}
          </TextComponent>
        </View>
        <View style={{
          paddingTop: SPACING.SMALL,
          paddingBottom: SPACING.SMALL,
          borderBottomWidth: 2,
          borderColor: theme.mode.borderColor,
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.SMALL,
          }}>
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="All"
              color="#00a1e2"
              value={countDetails?.TotalConcern || 0}
              field={'TotalConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Open"
              color="#06c16f"
              value={countDetails?.OpenConcern || 0}
              field={'OpenConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="In-Progress"
              color="#00a1e2"
              value={countDetails?.InprogressConcern || 0}
              field={'InprogressConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Closed"
              color="#e64884"
              value={countDetails?.CloseConcern || 0}
              field={'CloseConcern'}
            />
          </View>
          <View style={{
            height: 2,
            marginVertical: SPACING.SMALL,
            backgroundColor: theme.mode.borderColor,
          }}/>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.SMALL,
          }}>
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Rejected"
              color={COLORS.ERROR}
              value={countDetails?.RejectConcern || 0}
              field={'RejectConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Draft"
              color="#a450a8"
              value={countDetails?.DraftConcern || 0}
              field={'DraftConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Rework"
              color={COLORS.ALERT}
              value={countDetails?.ReworkConcern || 0}
              field={'ReworkConcern'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Cancelled"
              color={COLORS.warningRed}
              value={countDetails?.CancelledConcern || 0}
              field={'CancelledConcern'}
            />
          </View>
        </View>
        <ProjectCount {...{ countDetails, projectCategory :'Concerns', title: 'PS' }}  /> */}

        {/*  Audit Pro */}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
          <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
            {'Supplier Management'}
          </TextComponent>
        </View>
        <View style={{
          paddingTop: SPACING.SMALL,
          paddingBottom: SPACING.SMALL,
          borderBottomWidth: 2,
          borderColor: theme.mode.borderColor,
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.SMALL,
          }}>
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Scheduled"
              color="#00a1e2"
              value={0}
              field={'Scheduled'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Completed"
              color="#06c16f"
              value={0}
              field={'Completed'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Deadline Violated"
              color={COLORS.ALERT}
              value={0}
              field={'DViolated'}
            />
            <Divider />
            <Button
              // loading={countDetailsLoading}
              navigation={navigation}
              title="Closed Out"
              color="#e64884"
              value={0}
              field={'ClosedOut'}
            />
          </View>
        </View>
        <ProjectCount {...{ countDetails, projectCategory :'Audits', title: 'SM' }}  /> */}

        {/* Recent, Today & Other Activity */}
        <HomeListComponent
          {...{
            statusCode: STATUS_CODES.TODAY_CONCERN,
            title: 'Today’s Activity/Concern',
            data: todayList?.data,
            // loading: todayList?.loading,
            loading: false,
          }}
        />
        {/* <HomeListComponent
        {...{
          statusCode: STATUS_CODES.UPCOMING_CONCERN,
          // title: APP_VARIABLES.UPCOMING_CONCERN,
          title: 'Upcoming concern',
          data: upcomingList?.data,
          loading: upcomingList?.loading,
          }}
        /> */}
        <HomeListComponent
          {...{
            statusCode: STATUS_CODES.PENDING_CONCERN,
            // title: APP_VARIABLES.PENDING_CONCERN,
            title: 'Recently Viewed',
            data: recentActivities,
            loading: false,
            hideSeeAll: true,
          }}
        />
      </ScrollView>
      <FAB iconName="tasks" iconType={ICON_TYPE.FontAwesome5} onPress={() => navigation.navigate(ROUTES.HOME_FAB_VIEW)} />
        
		</Content>
	);
};

export default HomeDashboard;