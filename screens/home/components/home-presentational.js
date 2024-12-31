import React from 'react';
import { ScrollView, TouchableOpacity, View, TextInput, Pressable, Platform } from 'react-native';
import { Content, TextComponent, ExitModal, ListCard, PlaceHolders, NoRecordFound, FAB, Avatar, IconComponent } from 'components';
import { Modalize } from 'react-native-modalize';
import { getAvatarInitials, RFPercentage, RFValue } from 'helpers/utils';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, PLACEHOLDERS, ROUTES, STATUS_CODES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import HomeStatusbar from './HomeStatusBar';
import ProjectCount from './ProjectCount';
import { useState } from 'react';
import { useEffect } from 'react';
// import Pending from 'screens/task-status/pending';
// import InProgress from '../in-progress';
import localStorage from 'global/localStorage';
import VoiceAssist from 'screens/auditPro/components/VoiceAssist';

const HomeListComponent = ({ title, data, loading, statusCode, hideSeeAll }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    console.log('CURRENT_PAGE---->', 'home-presentational')
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
                <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                    {title}
                </TextComponent>
                {data?.length && !hideSeeAll ? (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(ROUTES.LIST_SCREEN, {
                                [APP_VARIABLES.DASHBOARD_CONCERNS]: statusCode,
                                title,
                            })
                        }>
                        <TextComponent
                            fontSize={FONT_SIZE.LARGE}
                            style={{ padding: SPACING.SMALL, textDecorationLine: 'underline', color: theme.colors.primaryThemeColor }}
                            textDecoration="underline"
                            type={FONT_TYPE.BOLD}>
                            See all
                        </TextComponent>
                    </TouchableOpacity>
                ) : null}
            </View>
            {loading ? (
                <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
            ) : data?.length > 0 ? (
                data?.map((item, index) => <ListCard key={index} item={item} handleRecentActivity={handleRecentActivity} />)
            ) : (
                <NoRecordFound />
            )}
        </View>
    );
};

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
  todayList, upcomingList, pendingList
}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { recentActivities } = useAppContext();
    const [name, setName] = useState("")
    console.log('countDetails', countDetails)
    useEffect(() => {
      async function fetchData() {
        const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
        console.log('UserFullName------------', UserFullName)
        setName(UserFullName)
      }
      fetchData()
    },[name])

    const navigateToSettings = () => {
        console.log('click settings')
        navigation.navigate(ROUTES.USER_PREFERENCE);
    }

    const navigateToRegister = () => {
        console.log('click navigateToGLOBAL_LOGIN')
        // navigation.navigate(ROUTES.REGISTRATION);
        navigation.navigate(ROUTES.GLOBAL_LOGIN);
    }

    const navigateToVoice = () => {
        console.log('click Voice')
        navigation.navigate(ROUTES.VOICE_ASSIST);
    }

    return (
        <Content noPadding>
            {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
                {/* <View style={{ flex: 9 }}>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                        {strings.welcome}!
                    </TextComponent>
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
                        {profile?.FullName || ''}
                    </TextComponent>
              </View> */}

            <View style={{ padding: SPACING.NORMAL, flexDirection: 'row', maxHeight: '9%', backgroundColor: '#05BFDB' }}>
              <View style={{ flex: 1, flexDirection:'row' }}>
                <TextComponent style={{ width: '90%' }}type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XLARGE} color={COLORS.white}>
                  {'Welcome '}&nbsp;{profile?.FullName || name}
                </TextComponent>
                <Pressable style={{ width: '10%' }} onPress={() => console.log('Click Search')}>
                  <IconComponent name="search" type={ICON_TYPE.FontAwesome} size={FONT_SIZE.XXLARGE} color={COLORS.white} />
                </Pressable>
              </View>
                {/* </View> */}
                
                {/* <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
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
                </View> */}
            </View>
            <HomeStatusbar {...{ countDetails }} />
            <ProjectCount {...{ countDetails }} />
            <Pressable style={{ width: '10%' }} 
                onPress={() => navigateToRegister()}
            >
                <IconComponent name="setting" type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXLARGE} color={COLORS.gold} />
            </Pressable>
             {/* <Pressable style={{ width: '10%' }} 
                onPress={() => navigateToVoice()}
            >
                <IconComponent name="setting" type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXLARGE} color={COLORS.gold} />
            </Pressable> */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <HomeListComponent
                    {...{
                        statusCode: STATUS_CODES.TODAY_CONCERN,
                        // title: APP_VARIABLES.TODAY_CONCERN,
                        title: 'Today’s Concern',
                        data: todayList?.data,
                        loading: todayList?.loading,
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
                />
                <HomeListComponent
                    {...{
                        statusCode: STATUS_CODES.PENDING_CONCERN,
                        // title: APP_VARIABLES.PENDING_CONCERN,
                        title: 'Pending Concern',
                        data: pendingList?.data,
                        loading: pendingList?.loading,
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
            <Modalize
                ref={modalizeRef}
                // adjustToContentHeight
                scrollViewProps={{
                    // scrollEnabled: false,
                    style: {
                        flex: 1,
                        flexGrow: 1,
                    },
                }}
                modalHeight={RFPercentage(85)}
                // HeaderComponent={
                //     <View
                //         style={{
                //             padding: SPACING.NORMAL,
                //             borderBottomWidth: 1,
                //             borderColor: COLORS.accDividerColor,
                //             backgroundColor: theme.mode.backgroundColor,
                //             borderTopLeftRadius: SPACING.SMALL,
                //             borderTopRightRadius: SPACING.SMALL,
                //         }}>
                //         <TextComponent>Choose site ({filteredSites?.length || 0})</TextComponent>
                //         {/* <TextComponent>Organizations ({organizations?.length})</TextComponent> */}
                //         <View
                //             style={{
                //                 width: '100%',
                //                 padding: SPACING.NORMAL,
                //                 paddingHorizontal: 0,
                //                 paddingBottom: 0,
                //             }}>
                //             <View>
                //                 <TextInput
                //                     value={searchKey}
                //                     onChangeText={searchKey => setSearchKey(searchKey)}
                //                     style={{ fontFamily: 'ProximaNova-Regular', fontSize: FONT_SIZE.LARGE }}
                //                     placeholder="search site"
                //                 />
                //             </View>
                //         </View>
                //     </View>
                // }
                >
                <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                    <ScrollView style={{ flex: 1, paddingBottom: SPACING.LARGE }} contentContainerStyle={{ flexGrow: 1, flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            {!!filteredSites?.length ? (
                                <>
                                    {filteredSites.map(({ SiteName = 'sample', img = null, SiteId = '1', _id = '' }, index) => (
                                        <TouchableOpacity
                                            // onPress={() => handleToggleOrganization({ orgName, img, orgNumber, _id })}
                                            activeOpacity={0.8}
                                            key={index}
                                            style={{
                                                paddingTop: SPACING.NORMAL,
                                                flexDirection: 'row',
                                                paddingHorizontal: SPACING.NORMAL,
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    borderWidth: 2,
                                                    borderRadius: 100,
                                                    padding: 2,
                                                    borderColor: sites?.selectedSite?.SiteId === SiteId ? COLORS.primaryThemeColor : COLORS.white,
                                                }}>
                                                <Avatar
                                                    img={img}
                                                    placeholder={getAvatarInitials(SiteName)}
                                                    width={RFPercentage(5)}
                                                    height={RFPercentage(5)}
                                                />
                                            </View>
                                            <TextComponent style={{ paddingLeft: SPACING.NORMAL }}>{SiteName}</TextComponent>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : (
                                <NoRecordFound />
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modalize>
            <ExitModal {...{ exitModalVisible, setExitModalVisible }} />
            <FAB onPress={() => navigation.navigate(ROUTES.HOME_FAB_VIEW)} />
        </Content>
    );
};

export default HomePresentational;
