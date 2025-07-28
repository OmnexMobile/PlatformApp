import { useNavigation } from '@react-navigation/native';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import { COLORS } from 'constants/theme-constants';
import { useAppContext } from 'contexts/app-context';
import { getAvatarInitials, showErrorMessage, successMessage } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTER_TYPES, registerDevice } from 'screens/globalAuth/register/register-functional';
import localStorage from 'global/localStorage';
import { getUniqueId } from 'react-native-device-info';
import { Avatar, Divider, Modal } from 'react-native-paper';
import { ButtonComponent } from 'components';
import { Bubbles } from 'react-native-loader';
import InputWithSearch from '../Components/InputWithSearch';
import NoDataFound from '../Components/NoDataFound';
let sitesData = {
    selectedSite: {
        EntityNode: 'Corporate',
        FullName: 'Dhanapal Cwetha   ',
        InspectionControlAccess: 'true',
        IsSupervisor: false,
        LoginAccess: '1',
        SiteName: 'Corporate',
        Siteid: '4',
        UserId: 6,
    },
    siteList: [
        {
            EntityNode: 'Corporate 1',
            FullName: 'Dhanapal Swetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate',
            Siteid: '1',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 1',
            FullName: 'Dhanapal Awetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 1',
            Siteid: '2',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 2',
            FullName: 'Dhanapal Bwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 2',
            Siteid: '3',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 3',
            FullName: 'Dhanapal Cwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 3',
            Siteid: '4',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 4',
            FullName: 'Dhanapal Dwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 4',
            Siteid: '5',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 5',
            FullName: 'Dhanapal Ewetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 5',
            Siteid: '6',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 6',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 6',
            Siteid: '7',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 7',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 7',
            Siteid: '8',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate 8',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 8',
            Siteid: '9',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 9',
            Siteid: '10',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 10',
            Siteid: '11',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 11',
            Siteid: '12',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate 12',
            Siteid: '13',
            UserId: 6,
        },
        {
            EntityNode: 'Corporate',
            FullName: 'Dhanapal Fwetha   ',
            InspectionControlAccess: 'true',
            IsSupervisor: false,
            LoginAccess: '1',
            SiteName: 'Corporate last 13',
            Siteid: '14',
            UserId: 6,
        },
    ],
};
const IcSettings = () => {
    const navigation = useNavigation();
    const [showLoader, setShowLoader] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSiteList, setShowSiteList] = useState(false);
    const { sites, handleLogout, handleLogin, handleSite } = useAppContext();
    const { inspectList, icUserData } = useSelector(state => state.inspection);

    const [siteList, setSiteList] = useState([]);
    const [filteredSite, setFilteredSite] = useState([]);
    const [searchText, setSearchText] = useState('');
    console.log(sites.siteList, 'sites.siteList');
    const dispatch = useDispatch();
    useEffect(() => {
        if (sites?.siteList?.length > 0) {
            setSiteList(sitesData.siteList);
            setFilteredSite(sitesData.siteList);
        } else {
            setSiteList([]);
        }
    }, [sites.siteList]);
    const handleLogoutCall = async () => {
        setShowLogoutModal(false);
        setShowLoader(true);
        const currentServerUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister);
        await registerDevice(
            currentServerUrl,
            {
                RegisteredDeviceId: await getUniqueId(),
                serverUrl: currentServerUrl,
            },
            REGISTER_TYPES.LOGOUT,
        )
            .then(data => {
                if (data?.Success) {
                    handleLogout();
                    successMessage({ message: 'Success', description: 'Successfully Logged Out' });
                    localStorage.storeData('appLogged', false);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentServerUrl);
                    dispatch({
                        type: 'DELETE_ALL_INSPECT_LIST',
                        inspectList: [],
                    });
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ROUTES.GLOBAL_LOGIN }],
                    });
                    localStorage.removeItem(LOCAL_STORAGE_VARIABLES.SiteId);
                    handleSite(null);
                } else {
                    showErrorMessage(data?.Error || 'Something went wrong while Logout');
                    setShowLoader(false);
                }
            })
            .catch(data => {
                setShowLoader(false);

                showErrorMessage(data?.Error || 'Something went wrong while Logout');
            });
    };
    const handleOptionActions = () => {
        setShowSiteList(!showSiteList);
    };
    const handleSelectedSite = item => {
        setProfileCall(item);
        let newIcUserData = {
            userData: item || {},
            token: icUserData?.Token || '',
        };
        dispatch({ type: 'IC_USER_DATA', icUserData: newIcUserData });
        successMessage({ message: 'Success', description: `You have successfully selected the site: ${item.SiteName}`, position: 'bottom' });
        setSearchText('');
        handleSearch('');
    };
    const setProfileCall = async item => {
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, item?.UserId);
        await localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, item?.FullName);
        await handleLogin({
            Token: icUserData?.Token,
            UserId: item?.UserId?.toString(),
            SiteId: item?.SiteId?.toString(),
            UserFullName: item?.FullName,
            CurrentApp: 'IC',
        });
        await handleSite(item);
    };
    const renderSites = ({ item, index }) =>
        sites?.selectedSite.Siteid != item.Siteid && (
            <TouchableOpacity
                style={styles.siteBox}
                onPress={() => {
                    if (sites?.selectedSite.Siteid != item.Siteid) {
                        handleSelectedSite(item);
                    } else {
                        showErrorMessage('Site already selected');
                    }
                }}
                key={index + 1}>
                <Avatar.Text
                    size={40}
                    label={getAvatarInitials(`${item?.FullName || ''}`)}
                    maxFontSizeMultiplier={1}
                    style={{ backgroundColor: sites?.selectedSite.Siteid == item.Siteid ? COLORS.apptheme : COLORS.lightGrey }}
                    color={COLORS.white}
                    labelStyle={{ fontFamily: 'OpenSans-Bold', fontSize: 15 }}
                />
                <Text style={[styles.siteText, { color: sites?.selectedSite.Siteid == item.Siteid ? COLORS.apptheme : COLORS.black }]}>
                    {item.SiteName}
                </Text>
            </TouchableOpacity>
        );

    const handleClose = () => {
        setShowLogoutModal(false);
    };

    const handleSearch = value => {
        let temp = JSON.parse(JSON.stringify(siteList));
        if (value?.length) {
            const tempSearch = temp.filter(item => item?.SiteName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSite(tempSearch);
        } else {
            setFilteredSite(siteList);
        }
    };
    useEffect(() => {
        var handler;
        if (searchText?.length) {
            handler = setTimeout(() => {
                handleSearch(searchText);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [searchText]);
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.headerBox}>
                <View style={styles.iconBox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="keyboard-backspace" size={30} color={COLORS.apptheme} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerTextBox}>
                    <Text style={styles.htext}>Settings</Text>
                </View>
            </View>
            <TouchableOpacity
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                }}
                onPress={() => {
                    handleOptionActions();
                }}>
                <View style={[styles.optionBox]}>
                    <Text style={[styles.optiontext, { color: COLORS.black }]}>Choose Site</Text>
                    <Icon name="arrow-drop-down" size={25} color={COLORS.black} />
                </View>
            </TouchableOpacity>
            {Boolean(showSiteList) && (
                <View style={styles.siteListContainer}>
                    <TouchableOpacity style={styles.siteBox} activeOpacity={1}>
                        <Avatar.Text
                            size={40}
                            label={getAvatarInitials(`${sites?.selectedSite?.FullName || ''}`)}
                            maxFontSizeMultiplier={1}
                            style={{ backgroundColor: COLORS.apptheme }}
                            color={COLORS.white}
                            labelStyle={{ fontFamily: 'OpenSans-Bold', fontSize: 15 }}
                        />
                        <Text style={[styles.siteText, { color: COLORS.apptheme }]}>{sites?.selectedSite?.SiteName}</Text>
                    </TouchableOpacity>
                    {siteList.length > 5 && (
                        <InputWithSearch
                            onSearch={val => {
                                setSearchText(val);
                                if (!val?.length) {
                                    handleSearch('');
                                }
                            }}
                            searchValue={searchText}
                        />
                    )}
                    {Boolean(filteredSite?.length) ? (
                        <FlatList
                            data={filteredSite}
                            renderItem={renderSites}
                            keyExtractor={(item, index) => index.toString()}
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <NoDataFound />
                        </View>
                    )}
                </View>
            )}
            <TouchableOpacity
                style={{
                    borderTopWidth: 1,
                    borderTopColor: COLORS.lightGrey,
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                }}
                onPress={() => {
                    setShowLogoutModal(true);
                }}>
                <View style={[styles.optionBox]}>
                    <Text style={[styles.optiontext, { color: COLORS.apptheme }]}>Logout</Text>
                    <Icon name="logout" size={25} color={COLORS.apptheme} />
                </View>
            </TouchableOpacity>
            {Boolean(showLogoutModal) && (
                <Modal
                    visible={showLogoutModal}
                    onDismiss={() => {
                        handleClose();
                    }}
                    contentContainerStyle={[styles.modalConatiner]}
                    style={{ backgroundColor: 'transparent' }}>
                    <View style={[styles.modalcontainer]}>
                        <Text style={[styles.deleteHeader]}>Logout</Text>
                        <View style={[styles.contentContainer]}>
                            <Divider />
                            <Text style={[styles.contentText]}>Are you sure you want to log out? </Text>
                        </View>
                        <View style={[styles.btnStyle]}>
                            <ButtonComponent
                                style={{ height: 30, width: 100, marginRight: 10 }}
                                onPress={() => {
                                    handleClose();
                                }}
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                                No
                            </ButtonComponent>
                            <ButtonComponent
                                style={{ height: 30, width: 100 }}
                                onPress={() => {
                                    handleLogoutCall();
                                }}
                                textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                                Yes
                            </ButtonComponent>
                        </View>
                    </View>
                </Modal>
            )}
            {Boolean(showLoader) && (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={showLoader}
                    onRequestClose={() => {
                        console.log('close modal');
                    }}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        height: '100%',
                    }}>
                    <Bubbles size={10} color="#12C0CF" />
                </Modal>
            )}
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey,
    },
    iconBox: {
        width: '8%',
    },
    headerTextBox: {
        width: '90%',
        alignItems: 'center',
    },
    htext: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: COLORS.black,
    },
    optiontext: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        color: COLORS.black,
    },
    optionBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteHeader: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 24,
        padding: 10,
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    contentText: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18,
        paddingVertical: 15,
    },
    btnStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    siteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    siteText: {
        color: COLORS.black,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        marginLeft: 10,
    },
    siteListContainer: {
        maxHeight: '75%',
    },
});
export default IcSettings;
