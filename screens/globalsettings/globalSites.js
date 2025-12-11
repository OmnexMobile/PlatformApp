import React, { useEffect, useMemo, useState } from 'react';
import Ripple from 'react-native-material-ripple';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { TextComponent, NoRecordFound, Avatar } from 'components';
import { getAvatarInitials, RFPercentage, formReq } from 'helpers/utils';
import { Content, Header } from 'components';
import { COLORS, SPACING } from 'constants/theme-constants';
import { toast } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import { LOCAL_STORAGE_VARIABLES, STATUS_CODES, TOAST_STATUS } from 'constants/app-constant';
import { getDashboardConcernCounts, getPendingConcernList, getTodayConcernList, getUpcomingConcernList } from '../home/home.action';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const GlobalSites = () => {
    const [searchKey, setSearchKey] = useState('');
    const { theme } = useTheme();
    const { sites, handleSite } = useAppContext();
    const dispatch = useDispatch();
    const { icUserData } = useSelector(state => state.inspection);

    useEffect(() => {
        if (sites?.selectedSite) {
            console.log('🚀 ~ useEffect ~ sites?.selectedSite', sites?.selectedSite);
            // getListData(sites?.selectedSite);
        }
    }, [sites?.selectedSite?.Siteid]);

    const getListData = async res => {
        console.log('getListData res--->', res.UserId, res.Siteid);
        const defaultObj = {
            [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
            [LOCAL_STORAGE_VARIABLES.SiteId]: parseInt(res.Siteid, 10),
            [LOCAL_STORAGE_VARIABLES.MaxRow]: 3,
        };
        console.log('getListData defaultObj--->', defaultObj);
        dispatch(
            getDashboardConcernCounts(
                formReq({
                    [LOCAL_STORAGE_VARIABLES.UserId]: res.UserId,
                    // [LOCAL_STORAGE_VARIABLES.SiteId]: res.Siteid,
                    [LOCAL_STORAGE_VARIABLES.SiteId]: parseInt(res.Siteid, 10),
                }),
            ),
        );
        dispatch(
            getTodayConcernList(
                formReq({
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.TODAY_CONCERN,
                }),
            ),
        );
        dispatch(
            getUpcomingConcernList(
                formReq({
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.UPCOMING_CONCERN,
                }),
            ),
        );
        dispatch(
            getPendingConcernList(
                formReq({
                    ...defaultObj,
                    [LOCAL_STORAGE_VARIABLES.Filterstring]: STATUS_CODES.PENDING_CONCERN,
                }),
            ),
        );
    };

    const filteredSites = useMemo(
        () => sites?.siteList?.filter(site => site?.SiteName?.toLowerCase()?.includes(searchKey?.toLowerCase())),
        [sites?.siteList, searchKey],
    );

    useEffect(() => {
      const updateSiteId = async () => {
        try {
          const storedDetails = await AsyncStorage.getItem('userDetails');
          if (storedDetails) {
            let parsedDetails = JSON.parse(storedDetails);
            // Update only siteId
            parsedDetails.siteId = sites?.selectedSite?.Siteid;
            // Save back to storage
            await AsyncStorage.setItem('userDetails', JSON.stringify(parsedDetails));
            console.log('Updated userDetails:', parsedDetails);
          } else {
            console.log("No userDetails found in storage");
          }
        } catch (error) {
            console.log("Error updating userDetails:", error);
        }
      };
      if (sites?.selectedSite?.Siteid) {
          updateSiteId();
      }
    }, [sites]);


    console.log('current sites--->', sites);
    console.log('current filteredSites', sites?.selectedSite, '--', sites?.selectedSite?.Siteid, '--', filteredSites);

    return (
        // <View style={[styles.container, { backgroundColor: theme.mode.backgroundColor }]}>
        <Content noPadding>
            <Header title="Choose Site" />
            {/* <View
        style={[
          styles.header,a
          {
            backgroundColor: theme.mode.backgroundColor,
            borderColor: COLORS.accDividerColor,
          },
        ]}
      >
        <TextComponent>
          Choose site ({filteredSites?.length || 0})
        </TextComponent>
      </View> */}

            {/* Content */}
            <ScrollView style={{ paddingBottom: SPACING.LARGE }} contentContainerStyle={{ paddingTop: SPACING.SMALL, flexGrow: 1 }}>
                {!!filteredSites?.length ? (
                    filteredSites.map(({ EntityNode, FullName, Siteid, SiteName, SupplierManagementAccess, UserId, UserType, img = null }, index) => (
                        <Ripple
                            onPress={() => {
                                let newIcUserData = {
                                    userData: filteredSites[index] || {},
                                    token: icUserData?.token || '',
                                };
                                dispatch({
                                    type: 'IC_USER_DATA',
                                    icUserData: newIcUserData,
                                });
                                handleSite({
                                    EntityNode,
                                    FullName,
                                    Siteid,
                                    SiteName,
                                    SupplierManagementAccess,
                                    UserId,
                                    UserType,
                                });
                                toast('Loading...', 'setting up site details...', TOAST_STATUS.SUCCESS, 100);
                            }}
                            activeOpacity={0.8}
                            key={index}
                            style={styles.itemContainer}>
                            <View
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 100,
                                    padding: 2,
                                    borderColor: sites?.selectedSite?.Siteid === Siteid ? theme.colors.primaryThemeColor : COLORS.lightGrey,
                                }}>
                                <Avatar
                                    img={img}
                                    placeholder={getAvatarInitials(SiteName)}
                                    width={RFPercentage(5)}
                                    height={RFPercentage(5)}
                                    selected={sites?.selectedSite?.Siteid === Siteid}
                                    theme={theme}
                                />
                            </View>
                            <TextComponent style={{ paddingLeft: SPACING.NORMAL }}>{SiteName}</TextComponent>
                        </Ripple>
                    ))
                ) : (
                    <NoRecordFound />
                )}
            </ScrollView>
            {/* </View> */}
        </Content>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Platform.OS === 'android' ? '80%' : '50%',
        borderTopLeftRadius: SPACING.NORMAL,
        borderTopRightRadius: SPACING.NORMAL,
        overflow: 'hidden',
    },
    header: {
        padding: SPACING.NORMAL,
        borderBottomWidth: 1,
    },
    itemContainer: {
        paddingVertical: SPACING.X_SMALL,
        flexDirection: 'row',
        paddingHorizontal: SPACING.NORMAL,
        alignItems: 'center',
    },
});

export default GlobalSites;

// import React from 'react';
// import Ripple from 'react-native-material-ripple';
// import { Platform, ScrollView, StatusBar, View } from 'react-native';
// import { TextComponent, NoRecordFound, Avatar } from 'components';
// import { Modalize } from 'react-native-modalize';
// import { getAvatarInitials, RFPercentage } from 'helpers/utils';
// import { TOAST_STATUS } from 'constants/app-constant';
// import { COLORS, SPACING } from 'constants/theme-constants';
// import { toast } from 'helpers/utils';
// import useTheme from 'theme/useTheme';

// const GlobalSites = ({ modalizeRef, filteredSites, sites, handleSite }) => {
//     console.log('current sites--->', sites)
//     console.log('current filteredSites', sites?.selectedSite, sites?.selectedSite?.[0]?.Siteid, filteredSites)
//     // const finalSiteId = (sites?.selectedSite?.Siteid === undefined) ? sites?.selectedSite?.[0]?.Siteid : sites?.selectedSite?.Siteid
//     const { theme } = useTheme();

//     return (
//         <Modalize
//             onOpen={() => {
//                 if (Platform.OS === 'android') {
//                     StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.65)', true);
//                     StatusBar.setBarStyle('light-content');
//                 }
//             }}
//             onClose={() => {
//                 if (Platform.OS === 'android') {
//                     StatusBar.setBackgroundColor(COLORS.white, true);
//                     StatusBar.setBarStyle('dark-content');
//                 }
//             }}
//             ref={modalizeRef}
//             // adjustToContentHeight
//             scrollViewProps={{
//                 // scrollEnabled: false,
//                 style: {
//                     flex: 1,
//                     flexGrow: 1,
//                 },
//             }}
//             modalStyle={{
//                 backgroundColor: theme.mode.backgroundColor,
//             }}
//             modalHeight={RFPercentage(Platform.OS === 'android' ? 80 : 50)}
//             HeaderComponent={
//                 <View
//                     style={{
//                         padding: SPACING.NORMAL,
//                         borderBottomWidth: 1,
//                         borderColor: COLORS.accDividerColor,
//                         backgroundColor: theme.mode.backgroundColor,
//                         borderTopLeftRadius: SPACING.SMALL,
//                         borderTopRightRadius: SPACING.SMALL,
//                     }}>
//                     <TextComponent>Choose site ({filteredSites?.length || 0})</TextComponent>
//                 </View>
//             }>
//             <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
//                 <ScrollView
//                     style={{ flex: 1, backgroundColor: theme.mode.backgroundColor, paddingBottom: SPACING.LARGE }}
//                     contentContainerStyle={{ flexGrow: 1, flex: 1, backgroundColor: theme.mode.backgroundColor }}>
//                     <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor, paddingTop: SPACING.SMALL }}>
//                         {!!filteredSites?.length ? (

//                             <>

//                                 {filteredSites.map(
//                                     // ({ EntityNode, FullName, SiteId, SiteName, SupplierAccess, UserId, UserType, img = null }, index) => (
//                                         // console.log('sites?.selectedSite?.SiteId === Siteid', sites?.selectedSite?.SiteId ,Siteid)
//                                         ({ EntityNode, FullName, Siteid, SiteName, SupplierManagementAccess, UserId, UserType, img = null }, index) => (

//                                         <Ripple
//                                             onPress={() => {
//                                                 setTimeout(() => {
//                                                     modalizeRef.current?.close();
//                                                 }, 1000);
//                                                 // handleSite({ EntityNode, FullName, SiteId, SiteName, SupplierAccess, UserId, UserType });
//                                                 handleSite({ EntityNode, FullName, Siteid, SiteName, SupplierManagementAccess, UserId, UserType });
//                                                 toast('Loading...', 'setting up site details...', TOAST_STATUS.SUCCESS, 100);
//                                             }}
//                                             activeOpacity={0.8}
//                                             key={index}
//                                             style={{
//                                                 paddingVertical: SPACING.X_SMALL,
//                                                 flexDirection: 'row',
//                                                 paddingHorizontal: SPACING.NORMAL,
//                                                 alignItems: 'center',
//                                             }}>
//                                             <View
//                                                 style={{
//                                                     borderWidth: 2,
//                                                     borderRadius: 100,
//                                                     padding: 2,
//                                                     borderColor:
//                                                         sites?.selectedSite?.Siteid === Siteid ? theme.colors.primaryThemeColor : COLORS.lightGrey,
//                                                 }}>
//                                                 <Avatar
//                                                     img={img}
//                                                     placeholder={getAvatarInitials(SiteName)}
//                                                     width={RFPercentage(5)}
//                                                     height={RFPercentage(5)}
//                                                     selected={sites?.selectedSite?.Siteid === Siteid}
//                                                     theme={theme}
//                                                 />
//                                             </View>
//                                             <TextComponent style={{ paddingLeft: SPACING.NORMAL }}>{SiteName}</TextComponent>
//                                             {console.log('sites?.selectedSite?.Siteid === Siteid', sites?.selectedSite?.Siteid ,Siteid)}
//                                         </Ripple>
//                                     ),
//                                 )}
//                             </>
//                         ) : (
//                             <NoRecordFound />
//                         )}
//                     </View>
//                 </ScrollView>
//             </View>
//         </Modalize>
//     );
// };

// export default GlobalSites;
