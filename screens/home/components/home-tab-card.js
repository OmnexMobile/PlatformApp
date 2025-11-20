import React, { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, View, FlatList, StyleSheet, Text, Linking, Dimensions, Modal, Platform, RefreshControl } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import strings from 'config/localization';
import { IconComponent, ImageComponent } from 'components';
import { IMAGES } from 'assets/images';
import FastImage from 'react-native-fast-image';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { APP_VARIABLES, ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import { RFPercentage, showWarningMessage } from 'helpers/utils';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { useAppContext } from 'contexts/app-context';
import localStorage from 'global/localStorage';
import globalAuth from '../../../services/Auditpro-Auth';
import auth from '../../../services/APQP-Auth';
import CryptoJS from 'react-native-crypto-js';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Bubbles } from 'react-native-loader';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';

const screenWidth = Dimensions.get('window').width;
const TabsCard = ({ countDetails, tabIndex, noTab, navigation }) => {
    console.log('tabIndex--------', tabIndex, noTab);
    const { icUserData, icSettings } = useSelector(state => state.inspection);

    // console.log('CURRENT_PAGE---->', 'home-tab-card')
    const navigations = useNavigation();
    const [currentUserData, setCurrentUserData] = useState([]);
    const [currentUserDataPS, setCurrentUserDataPS] = useState([]);
    // This hook returns `true` if the screen is focused, `false` otherwise
    const isFocused = useIsFocused();
    const [isRegister, setIsRegister] = useState(null);
    const [isRegisterPS, setIsRegisterPS] = useState(null);
    const { handleGlobalURL, globalDeviceDetails } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [tabList, setTabList] = useState([]);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    
    const getICsettings = async () => {
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        formData.append('SiteID', parseInt(icUserData?.userData?.Siteid));
        const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`, formData);
        if (settingsRes.Success) {
            const settings = {
                ...settingsRes?.Data[0],
            };
            dispatch({ type: 'IC_SETTINGS', icSettings: settings || {} });
        }
        setRefreshing(false);
    };
    useLayoutEffect(() => {
        if (icUserData?.userData && isFocused) {
            getICsettings();
        }
    }, [icUserData, isFocused]);
    useEffect(() => {
        // const data = [
        //     {
        //         id: 5,
        //         title: tabIndex === 0 ? strings.inspectionControl : null,
        //         detail:
        //             tabIndex === 0
        //                 ? [
        //                       { images: IMAGES.ICIS, category: strings.inspectionSchedule, status: 1, routeName: ROUTES.INSPECTION_SCHEDULE },
        //                       { images: IMAGES.ICOS, category: strings.operatorWorksheet, status: 2, routeName: ROUTES.OPERATOR_WORKSHEET },
        //                       { images: IMAGES.ICCI, category: strings.completedInspection, status: 3, routeName: ROUTES.COMPLETED_INSPECTION },
        //                       { images: IMAGES.ICSS, category: strings.supervisorSchedule, status: 4, routeName: ROUTES.SUPERVISOR_SCHEDULE },
        //                   ].filter(
        //                       item =>
        //                           icSettings?.TabReceivingSupervisorNeeded ||
        //                           icSettings?.TabInprocessSupervisorNeeded ||
        //                           icSettings?.TabFinalSupervisorNeeded ||
        //                           item.status !== 4,
        //                   )
        //                 : [],
        //     },
        // ];
        const data = [
            {
                id: 5,
                title: tabIndex === 0 ? strings.inspectionControl : null,
                detail:
                    tabIndex === 0
                        ? [
                              { images: IMAGES.ICIS, category: strings.inspectionSchedule, status: 1, routeName: ROUTES.INSPECTION_SCHEDULE },
                              { images: IMAGES.ICOS, category: strings.operatorWorksheet, status: 2, routeName: ROUTES.OPERATOR_WORKSHEET },
                              { images: IMAGES.ICCI, category: strings.completedInspection, status: 3, routeName: ROUTES.COMPLETED_INSPECTION },
                              { images: IMAGES.ICSS, category: strings.supervisorSchedule, status: 4, routeName: ROUTES.SUPERVISOR_SCHEDULE },
                          ].filter(item => {
                              // Hide Supervisor Schedule if all supervisor flags false
                              if (
                                  item.status === 4 &&
                                  !icSettings?.TabReceivingSupervisorNeeded &&
                                  !icSettings?.TabInprocessSupervisorNeeded &&
                                  !icSettings?.TabFinalSupervisorNeeded
                              ) {
                                  return false;
                              }

                              // Hide Inspection Schedule if receiving/inprocess both false
                                if (
                                    item.status === 1 &&
                                    !icSettings?.TabReceivingLotScheduleNeeded &&
                                    !icSettings?.TabInprocessLotScheduleNeeded &&
                                    !icSettings?.TabFinalLotScheduleNeeded
                                ) {
                                    return false;
                                }
                              return true;
                          })
                        : [],
            },
        ];

        // Step 2: Modify only if SearchInspectionNeeded is TRUE
        if (icSettings?.SearchInspectionNeeded && icSettings?.TabSearchInspectionNeeded && tabIndex === 0) {
            const inspectionIndex = data.findIndex(item => item.id === 5);

            if (inspectionIndex !== -1) {
                const detail = data[inspectionIndex].detail;

                const indexOfStatus1 = detail.findIndex(d => d.status === 1 || d.category === strings.inspectionSchedule);

                const newItem = {
                    images: IMAGES.ICIS,
                    category: strings.searchInspection,
                    status: 1,
                    routeName: ROUTES.SEARCH_INSPECTION,
                };

                if (indexOfStatus1 !== -1) {
                    // Replace existing inspectionSchedule
                    detail[indexOfStatus1] = newItem;
                } else {
                    // Add searchInspection if not present
                    detail.unshift(newItem); // add at the top
                }
            }
        }

        setTabList([...data]);
    }, [tabIndex, icSettings]);

    const redirectToPage = (title, status, category) => {
        status > 0 && title === strings.auditPro
            ? navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING, { projectTitle: title, status: status, category: category.replace(/\n/g, ' ') })
            : null;
    };

    const navigateToSettings = () => {
        console.log('click settings');
        navigations.navigate(ROUTES.USER_PREFERENCE);
    };

    // console.log('currentUserData---', isFocused, currentUserData, currentUserData?.siteId?.length)

    useEffect(() => {
        async function getUserDetails() {
            try {
                const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
                const value = JSON.parse(stringifiedUserDetails);
                // console.log('current userdata--->', value)
                if (value !== null) {
                    // value previously stored
                    console.log('current token2 Auditpro--->', value?.accessToken);
                    setCurrentUserData(value);
                } else {
                    console.log('current token3 Auditpro--->', value?.accessToken);
                    setCurrentUserData('');
                }
            } catch (e) {
                // error reading value
                console.log('currentUserData error--->', e);
            }
        }
        getUserDetails();
    }, [currentUserData?.siteId, isFocused]);

    useEffect(() => {
        async function getUserDetailsPS() {
            try {
                const stringifiedUserDetailsPS = await AsyncStorage.getItem('userDetailsPS');
                const value = JSON.parse(stringifiedUserDetailsPS);
                // console.log('current userdata ps--->', value)
                if (value !== null) {
                    // value previously stored
                    console.log('current token2 ps--->', value);
                    setCurrentUserDataPS(value);
                } else {
                    console.log('current token3 ps--->', value);
                    setCurrentUserDataPS('');
                }
            } catch (e) {
                // error reading value
                console.log('currentUserData ps error--->', e);
            }
        }
        getUserDetailsPS();
    }, [isFocused]);
    // }, [currentUserDataPS, isFocused]);

    useEffect(() => {
        async function getdeviceRegisterStatus() {
            try {
                const value = await AsyncStorage.getItem('isdeviceregistered');
                if (value !== null) {
                    // value previously stored
                    console.log('current isRegister auditpro--->', value);
                    setIsRegister(value);
                }
            } catch (e) {
                // error reading value
                console.log('isRegister error--->', e);
            }
        }
        getdeviceRegisterStatus();
    }, [isRegister, isFocused]);

    useEffect(() => {
        async function getdeviceRegisterStatusPS() {
            try {
                const value = await AsyncStorage.getItem('isRegisterPS');
                if (value !== null) {
                    // value previously stored
                    console.log('current isRegister PS--->', value);
                    setIsRegisterPS(value);
                }
            } catch (e) {
                // error reading value
                console.log('isRegister PS error--->', e);
            }
        }
        getdeviceRegisterStatusPS();
    }, [isFocused]);

    const showToast = () => {
        // Toast.show("This is a toast message!", Toast.SHORT);
        Toast.showWithGravity('No Settings Data!', Toast.LONG, Toast.TOP);
    };

    const handleNavigation = async (title, status, category, auditTitle, routeName) => {
        // console.log('handleNavigation params--->', title, status, category, auditTitle)
        console.log('handleNavigation currentUserData?.accessToken--->', currentUserData, globalDeviceDetails?.deviceDetails, category);
        // console.log('checkingNavigation',category);
        console.log('checkingNavigationcategory', category);

        if (title === strings.auditPro) {
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.AuditProURL);
            handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.AuditProURL);
            globalAuth.setServerUrl(globalDeviceDetails?.deviceDetails?.AuditProURL);
            await AsyncStorage.setItem('storedserverrul', globalDeviceDetails?.deviceDetails?.AuditProURL);
            console.log('current click--->', strings.auditPro);
            const projectDetails = {
                projectTitle: title,
                projectStatus: status,
                projectCategory: category.replace(/\n/g, ' '),
                auditTitle: auditTitle,
            };
            const stringifiedProjectDetails = JSON.stringify(projectDetails);
            AsyncStorage.setItem('projectDetails', stringifiedProjectDetails);
            console.log('Set Async projectDetails ', stringifiedProjectDetails);
            // redirectToPage(title, status, category)
            if (currentUserData?.accessToken?.length && currentUserData?.accessToken) {
                console.log('auditPro handleNavigation 1--->', title, status, category);
                redirectToPage(title, status, category);
            } else {
                localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ServerUrl);
                handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.ServerUrl);
                globalAuth.setServerUrl(globalDeviceDetails?.deviceDetails?.ServerUrl);
                await AsyncStorage.setItem('storedserverrul', globalDeviceDetails?.deviceDetails?.ServerUrl);
                console.log('isRegister--->', isRegister);
                if (isRegister === 'yes') {
                    console.log('auditPro handleNavigation 2--->', title, status, category);
                    // navigations.navigate(ROUTES.LOGINUISCREEN, { title: title, projectStatus: status, category: category.replace(/\n/g, ' ')} )
                    navigations.navigate(ROUTES.GLOBAL_LOGIN);
                } else {
                    console.log('auditPro handleNavigation 3--->', title, status, category);
                    // navigations.navigate(ROUTES.REGISTRATION, { title: title, projectStatus: status, category: category.replace(/\n/g, ' ')} )
                    navigations.navigate(ROUTES.GLOBAL_REGISTER);
                }
            }
        } else if (title === strings.problemSolver) {
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.PSApiURL);
            handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.PSApiURL);
            console.log('current click--->', strings.problemSolver, '--', category.replace(/\n/g, ' '), '--', category, '--');
            await AsyncStorage.setItem('concerns', category.replace(/\n/g, ' '));
            if (currentUserData?.accessToken?.length && currentUserData?.accessToken) {
                navigations.navigate(ROUTES.HOME_PS);
            } else {
                localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ServerUrl);
                handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.ServerUrl);
                console.log('isRegister--->PS', isRegisterPS);
                if (isRegisterPS === 'yes') {
                    console.log('PS handleNavigation 1--->');
                    navigations.navigate(ROUTES.GLOBAL_LOGIN);
                } else {
                    console.log('PS handleNavigation 2--->');
                    navigations.navigate(ROUTES.GLOBAL_REGISTER);
                }
            }
        } else if (title === strings.documentPro) {
            if (category == 'Document\nLevels') {
                navigations.navigate(ROUTES.DOCPRO_DOCUMENTFOLDER);
            } else if (category == 'Actions\nList') {
                navigations.navigate(ROUTES.DOCPRO_ACTION);
            }
            console.log('current click--->', strings.documentPro);
        } else if (title === strings.inspectionControl) {
            console.log(globalDeviceDetails, 'globalDeviceDetails?.deviceDetails?.ICURL');
            localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ICApiURL);
            setLoading(true);
            // const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`);
            // if (settingsRes.Success) {
            //     dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
            navigations.navigate(routeName);
            // }
            setLoading(false);
        } else {
            // console.log('current click--->')
        }
    };
    const onRefresh = () => {
        setRefreshing(true);
        getICsettings();
    };
    const Item = ({ title, detail, images }) => (
        <View style={styles.eachItemStyle}>
            <View style={styles.titleHeader}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.item}>
                {detail.map(
                    (items, index) =>
                        items.category?.length && (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                key={index}
                                onPress={() => handleNavigation(title, items?.status, items?.category, items?.auditTitle, items?.routeName)}>
                                <Card key={index} style={styles.card}>
                                    <View style={styles.cardContent}>
                                        <ImageComponent style={styles.imageView} source={items.images} resizeMode={FastImage.resizeMode.contain} />
                                    </View>
                                    <Text style={styles.cardTitle}>{items.category}</Text>
                                </Card>
                            </TouchableOpacity>
                        ),
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loading}
                    onRequestClose={() => {
                        console.log('close modal');
                    }}>
                    <View style={styles.modalBackground}>
                        <Bubbles size={10} color="#12C0CF" />
                    </View>
                </Modal>
            ) : null}
            <FlatList
                data={tabList}
                renderItem={({ item }) => (item.title === null ? null : <Item detail={item.detail} title={item.title} images={item.images} />)}
                keyExtractor={item => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    //test

    container1: {
        alignItems: 'flex-start',
        paddingHorizontal: 10, // Adjust padding as needed
    },
    item1: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        margin: 5,
        width: screenWidth - 60, // Adjust based on screen width
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        flex: 1,
        marginTop: 0,
        // backgroundColor: '#F1F9FE',
        // padding: 10
    },
    item: {
        backgroundColor: '#F1F9FE',
        paddingBottom: 20,
        // paddingVertical: RFPercentage(3),
        marginTop: 0,
        marginBottom: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5,
        // shadowRadius: 2,
        // elevation: 2,
        // paddingLeft: 5,
    },
    headerTitle: {
        fontFamily: 'OpenSans-Bold',
        fontSize: FONT_SIZE.NORMAL,
        color: COLORS.black,
        paddingVertical: SPACING.SMALL,
        marginHorizontal: 16,
        marginBottom: 0,
        width: '85%',
    },
    card: {
        backgroundColor: COLORS.white,
        elevation: 10,
        marginVertical: 10,
        marginHorizontal: 17,
        // marginTop: 20,
        // marginRight: 16,
        // marginLeft: 17,
        padding: 6,
        // padding: RFPercentage(1),
        // paddingHorizontal: RFPercentage(1),
        // paddingVertical: RFPercentage(1.5),
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: FONT_SIZE.XXXX_SMALL,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.black,
    },
    titleHeader: {
        backgroundColor: '#F1F9FE',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 15,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgrey',
    },
    imageView: {
        height: 40,
        width: 36,
        marginVertical: 4,
        marginHorizontal: 8,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: '50%',
    },
    eachItemStyle: {
        paddingTop: 10,
        paddingHorizontal: 7,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default TabsCard;
