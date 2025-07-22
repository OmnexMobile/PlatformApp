// import React, { useEffect, useState } from 'react';
// import { Content, Header, TextComponent, IconComponent, ButtonComponent } from 'components';
// import { FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
// import TabsView from './home-tab-view';
// import TabsCard from './home-tab-card';
// import localStorage from 'global/localStorage';
// import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';

// import { useAppContext } from 'contexts/app-context';
// import { REGISTER_TYPES, registerDevice } from 'screens/globalAuth/register/register-functional';
// import { showErrorMessage, successMessage } from 'helpers/utils';
// import { getUniqueId } from 'react-native-device-info';
// import { useNavigation } from '@react-navigation/native';
// import { Divider, Modal } from 'react-native-paper';
// import { Bubbles } from 'react-native-loader';
// import { useDispatch } from 'react-redux';

// const HomeFabFunctional = ({ countDetails }) => {
//     const internal = true;
//     const supplier = true;
//     // const internal = false
//     // const supplier = false
//     const isTab = (internal && supplier) === true ? true : false;
//     const tabIndex = internal === true ? 0 : 1;
//     const [name, setName] = useState('');
//     const { sites } = useAppContext();
//     const navigation = useNavigation();
//     const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails } = useAppContext();
//     const [showLoader, setShowLoader] = useState(false);
//     const [showLogoutModal, setShowLogoutModal] = useState(false);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         async function fetchData() {
//             const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
//             setName(UserFullName);
//         }
//         fetchData();
//     }, [name]);

//     const handleLogoutCall = async () => {
//         setShowLogoutModal(false)
//         setShowLoader(true);
//         const currentServerUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister);
//         await registerDevice(
//             currentServerUrl,
//             {
//                 RegisteredDeviceId: await getUniqueId(),
//                 serverUrl: currentServerUrl,
//             },
//             REGISTER_TYPES.LOGOUT,
//         )
//             .then(data => {
//                 console.log('🚀 ~ file: profile-home-functional.js:100 ~ handleLogoutFun ~ data:', data);
//                 if (data?.Success) {
                    
//                     handleLogout();
//                     successMessage({ message: 'Success', description: 'Successfully Logged Out' });
//                     localStorage.storeData('appLogged', false);
//                     localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentServerUrl);
//                     dispatch({
//                         type: 'DELETE_ALL_INSPECT_LIST',
//                         inspectList: [],
//                     });
//                     navigation.navigate(ROUTES.GLOBAL_LOGIN);
//                 } else {
//                     showErrorMessage(data?.Error || 'Something went wrong while Logout');
//                     setShowLoader(false);
                    
//                 }
//             })
//             .catch(data => {
//                 setShowLoader(false);
                
//                 showErrorMessage(data?.Error || 'Something went wrong while Logout');
//             });
//     };
//     const handleClose = () => {
//         setShowLogoutModal(false);
//     };
//     return (
//         <Content noPadding>
//             {Platform.OS === 'ios' ? <View style={{ padding: 10, flexDirection: 'row' }} /> : null}
//             {/* <Header title={name} backState={true} /> */}
//             <View style={{ padding: 10, flexDirection: 'row', maxHeight: '9%', backgroundColor: '#05BFDB' }}>
//                 <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
//                     <TextComponent style={{ width: '90%' }} type={FONT_TYPE.BOLD} fontSize={25} color={COLORS.white}>
//                         {'Welcome '}&nbsp;{sites?.selectedSite?.FullName || name}
//                     </TextComponent>
//                     <Pressable style={{ width: '10%', alignItems: 'center' }} onPress={() => setShowLogoutModal(true)}>
//                         <IconComponent name="exit-outline" type={ICON_TYPE.Ionicons} size={35} color={COLORS.white} />
//                     </Pressable>
//                 </View>
//             </View>
//             {/* {(isTab) ? <TabsView countDetails={countDetails}/> : */}
//             <TabsCard {...{ countDetails }} tabIndex={tabIndex} />
//             {Boolean(showLoader) && (
//                 <Modal
//                     transparent={true}
//                     animationType={'none'}
//                     visible={showLoader}
//                     onRequestClose={() => {
//                         console.log('close modal');
//                     }}
//                     contentContainerStyle={{
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         flex: 1,
//                         height: '100%',
//                     }}>
//                     <Bubbles size={10} color="#12C0CF" />
//                 </Modal>
//             )}
//             {Boolean(showLogoutModal) && (
//                 <Modal
//                     visible={showLogoutModal}
//                     onDismiss={() => {
//                         handleClose();
//                     }}
//                     contentContainerStyle={[styles.modalConatiner]}
//                     style={{ backgroundColor: 'transparent' }}>
//                     <View style={[styles.modalcontainer]}>
//                         <Text style={[styles.deleteHeader]}>Logout</Text>
//                         <View style={[styles.contentContainer]}>
//                             <Divider />
//                             <Text style={[styles.contentText]}>Are you sure you want to log out? </Text>
//                         </View>
//                         <View style={[styles.btnStyle]}>
//                             <ButtonComponent
//                                 style={{ height: 30, width: 100, marginRight: 10 }}
//                                 onPress={() => {
//                                     handleClose();
//                                 }}
//                                 textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
//                                 No
//                             </ButtonComponent>
//                             <ButtonComponent
//                                 style={{ height: 30, width: 100 }}
//                                 onPress={() => {
//                                     handleLogoutCall();
//                                 }}
//                                 textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
//                                 Yes
//                             </ButtonComponent>
//                         </View>
//                     </View>
//                 </Modal>
//             )}
//         </Content>
//     );
// };
// const styles = StyleSheet.create({
//     modalcontainer: {
//         width: '90%',
//         backgroundColor: '#fff',
//         borderRadius: 5,
//     },
//     modalConatiner: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     deleteHeader: {
//         color: COLORS.black,
//         fontFamily: 'OpenSans-SemiBold',
//         fontSize: 24,
//         padding: 10,
//     },
//     contentContainer: {
//         paddingHorizontal: 10,
//     },
//     contentText: {
//         color: COLORS.black,
//         fontFamily: 'OpenSans-SemiBold',
//         fontSize: 18,
//         paddingVertical: 15,
//     },
//     btnStyle: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         padding: 10,
//     },
// });
// export default HomeFabFunctional;


import React, { useEffect, useState } from 'react';
import { Content, Header, TextComponent, IconComponent, ButtonComponent } from 'components';
import { FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import TabsView from './home-tab-view';
import TabsCard from './home-tab-card';
import localStorage from 'global/localStorage';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';

import { useAppContext } from 'contexts/app-context';
import { REGISTER_TYPES, registerDevice } from 'screens/globalAuth/register/register-functional';
import { showErrorMessage, successMessage } from 'helpers/utils';
import { getUniqueId } from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Divider, Modal } from 'react-native-paper';
import { Bubbles } from 'react-native-loader';
import { useDispatch } from 'react-redux';

const HomeFabFunctional = ({ countDetails }) => {
    const internal = true;
    const supplier = true;
    // const internal = false
    // const supplier = false
    const isTab = (internal && supplier) === true ? true : false;
    const tabIndex = internal === true ? 0 : 1;
    const [name, setName] = useState('');
    const { sites } = useAppContext();
    const navigation = useNavigation();
    const { profile, appSettings, handleLogout, globalURL, handleGlobalURL, globalDeviceDetails } = useAppContext();
    const [showLoader, setShowLoader] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
            setName(UserFullName);
        }
        fetchData();
    }, [name]);

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
                console.log('🚀 ~ file: profile-home-functional.js:100 ~ handleLogoutFun ~ data:', data);
                if (data?.Success) {
                    handleLogout();
                    successMessage({ message: 'Success', description: 'Successfully Logged Out' });
                    localStorage.storeData('appLogged', false);
                    localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentServerUrl);
                    dispatch({
                        type: 'DELETE_ALL_INSPECT_LIST',
                        inspectList: [],
                    });
                    navigation.navigate(ROUTES.GLOBAL_LOGIN);
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
    const handleClose = () => {
        setShowLogoutModal(false);
    };
    return (
        <Content noPadding>
            {Platform.OS === 'ios' ? <View style={{ padding: 10, flexDirection: 'row' }} /> : null}
            {/* <Header title={name} backState={true} /> */}
            <View style={{ padding: 10, flexDirection: 'row', maxHeight: '9%' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '85%' }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={20} color={COLORS.black}>
                            {'Welcome !'}
                        </TextComponent>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={25} color={COLORS.black} numberOfLines={1}>
                        {sites?.selectedSite?.FullName || name}
                        </TextComponent>
                    </View>

                    <Pressable style={{ width: '15%', alignItems: 'center' }} onPress={() => navigation.navigate(ROUTES.INSPECTION_SETTINGS)}>
                        {/* <IconComponent name="exit-outline" type={ICON_TYPE.Ionicons} size={35} color={COLORS.white} /> */}
                        <Avatar.Text
                            size={50}
                            label={sites?.selectedSite?.FullName?.split('')[0] || name?.split('')[0]}
                            maxFontSizeMultiplier={1}
                            style={{ backgroundColor: COLORS.apptheme  }}
                            color={COLORS.white}
                            labelStyle={{fontFamily:'OpenSans-Bold',fontSize:20}}
                        />
                    </Pressable>
                </View>
            </View>
            {/* {(isTab) ? <TabsView countDetails={countDetails}/> : */}
            <TabsCard {...{ countDetails }} tabIndex={tabIndex} />
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
        </Content>
    );
};
const styles = StyleSheet.create({
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
});
export default HomeFabFunctional;

