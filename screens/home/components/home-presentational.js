import React from 'react';
import { ScrollView, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Content, TextComponent, ExitModal, ChooseSite, FAB, Avatar } from 'components';
import { getAvatarInitials, RFPercentage } from 'helpers/utils';
import { FONT_TYPE, ROUTES, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import HomeStatusbar from './home-status-count';
import { HomeListComponent } from './home-list';

const HomePresentational = ({
    profile,
    exitModalVisible,
    setExitModalVisible,
    countDetails,
    modalizeRef,
    openModal,
    sites,
    searchKey,
    setSearchKey,
    filteredSites,
    todayList,
    upcomingList,
    pendingList,
    countDetailsLoading,
    handleRefresh,
}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { recentActivities, handleSite } = useAppContext();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 10);
    }, [sites?.selectedSite?.SiteId]);

    return (
        <Content noPadding>
            <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}>
                <View style={{ flex: 9 }}>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                        {strings.welcome}!
                    </TextComponent>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
                        {profile?.FullName || ''}
                    </TextComponent>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={openModal}>
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
            <HomeStatusbar {...{ countDetails, countDetailsLoading, sites }} />
            {/* <ProjectCount {...{ countDetails }} /> */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={[theme.colors.primaryThemeColor, theme.colors.primaryLightThemeColor]}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}>
                <HomeListComponent
                    {...{
                        statusCode: STATUS_CODES.TODAY_CONCERN,
                        title: 'Today’s Concern',
                        data: todayList?.data,
                        loading: todayList?.loading,
                    }}
                />
                {/* <HomeListComponent
                    {...{
                        statusCode: STATUS_CODES.UPCOMING_CONCERN,
                        title: 'Upcoming concern',
                        data: upcomingList?.data,
                        loading: upcomingList?.loading,
                    }}
                /> */}
                {sites?.selectedSite?.UserType === USER_TYPE.SUPPLIER ? null : (
                    <>
                        <HomeListComponent
                            {...{
                                statusCode: STATUS_CODES.PENDING_CONCERN,
                                // title: APP_VARIABLES.PENDING_CONCERN,
                                title: 'Pending Concern',
                                data: pendingList?.data,
                                loading: pendingList?.loading,
                            }}
                        />
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
                    </>
                )}
            </ScrollView>
            <ChooseSite {...{ modalizeRef, sites, handleSite, filteredSites, searchKey, setSearchKey }} />
            <ExitModal {...{ exitModalVisible, setExitModalVisible }} />
            {sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER ? <FAB onPress={() => navigation.navigate(ROUTES.CONCERN_SCREEN)} /> : null}
        </Content>
    );
};

export default HomePresentational;
