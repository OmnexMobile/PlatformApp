import { useNavigation } from '@react-navigation/native';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import { COLORS } from 'constants/theme-constants';
import { useAppContext } from 'contexts/app-context';
import { getAvatarInitials, showErrorMessage, successMessage } from 'helpers/utils';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTER_TYPES, registerDevice } from 'screens/globalAuth/register/register-functional';
import localStorage from 'global/localStorage';
import { getUniqueId } from 'react-native-device-info';
import { Avatar, Divider, Modal } from 'react-native-paper';
import { ButtonComponent } from 'components';
import { Bubbles } from 'react-native-loader';

const IcSettings = () => {
    const navigation = useNavigation();
    const [showLoader, setShowLoader] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSiteList, setShowSiteList] = useState(false);
    const { sites, handleLogout, handleLogin, handleSite } = useAppContext();
    const { inspectList, icUserData } = useSelector(state => state.inspection);
    const dispatch = useDispatch();
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
    const renderSites = ({ item, index }) => (
        <TouchableOpacity
            style={styles.siteBox}
            onPress={() => {
                if (sites?.selectedSite.Siteid != item.Siteid) {
                    handleSelectedSite(item);
                }else {
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
            <Text style={[styles.siteText,{color: sites?.selectedSite.Siteid == item.Siteid ? COLORS.apptheme : COLORS.black}]}>{item.SiteName}</Text>
        </TouchableOpacity>
    );

    const handleClose = () => {
        setShowLogoutModal(false);
    };
    return (
        <View style={styles.container}>
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
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.lightGrey,
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
                {Boolean(showSiteList) && (
                    <View style={styles.siteListContainer}>
                        <FlatList
                            data={sites.siteList}
                            renderItem={renderSites}
                            keyExtractor={(item, index) => index.toString()}
                            nestedScrollEnabled
                        />
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
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
        </View>
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
        maxHeight: 300,
    },
});
export default IcSettings;
