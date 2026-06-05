import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconO from 'react-native-vector-icons/Octicons';
import InputWithSearch from './InputWithSearch';
import InspectionInspectionSvg from '../../../assets/images/svg/inspection-scedule.svg';
import OperatorWorksheetSvg from '../../../assets/images/svg/operator-worksheet.svg';
import CompletedInspectionnSvg from '../../../assets/images/svg/completed-inspection.svg';
import SupervisorScheduleSvg from '../../../assets/images/svg/supervisor-schedule.svg';
import { ROUTES } from 'constants/app-constant';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Menu, Tooltip } from 'react-native-paper';
import { useAppContext } from 'contexts/app-context';

const footerList = [
    {
        id: 1,
        title: 'Inspection\nSchedule',
        svg: InspectionInspectionSvg,
        routeName: ROUTES.INSPECTION_SCHEDULE,
    },
    {
        id: 2,
        title: 'Operator\nWorksheet',
        svg: OperatorWorksheetSvg,
        routeName: ROUTES.OPERATOR_WORKSHEET,
    },
    {
        id: 3,
        title: 'Completed\nInspection',
        svg: CompletedInspectionnSvg,
        routeName: ROUTES.COMPLETED_INSPECTION,
    },
    // {
    //     id: 4,
    //     title: 'Supervisor\nSchedule',
    //     svg: SupervisorScheduleSvg,
    //     routeName: ROUTES.SUPERVISOR_SCHEDULE,
    // },
];

const CustomHeader = ({
    children,
    title = '',
    activeTabId,
    showIcons = true,
    showFileIcon = false,
    handleSyncPress = () => {},
    handleFilterPress = () => {},
    handleQRPress = () => {},
    handleFileIconPress = () => {},
    handleSearch = () => {},
    searchValue = '',
    handleClosePress = () => {},
    customBackHandler = false,
    customHandleGoBack = () => {},
}) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {  sites } = useAppContext();
    const widthAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (searchValue?.length) {
            setIsExpanded(true);
            Animated.timing(widthAnim, {
                toValue: activeTabId !== 4 ? width / 1.5 : width / 2.2,
                duration: 0,
                useNativeDriver: false,
            }).start();
        }
    }, [searchValue]);

    const toggleSearchBar = () => {
        if (isExpanded) {
            Animated.timing(widthAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsExpanded(false));
        } else {
            setIsExpanded(true);
            Animated.timing(widthAnim, {
                toValue: activeTabId !== 4 ? width / 1.5 : width / 2.2,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleTabPress = value => {
        if (value) {
            navigation.navigate(value);
        }
    };
    const renderTab = ({ item }) => {
        let RenderSvg = item.svg;
        return (
            <TouchableOpacity
                style={[styles.tabBox]}
                onPress={() => {
                    handleTabPress(item?.routeName);
                }}>
                <View style={[styles.activeTabBox, { backgroundColor: activeTabId == item.id ? COLORS.tabtheme : null }]}>
                    <RenderSvg height={25} width={25} fill={activeTabId == item.id ? COLORS.apptheme : COLORS.grey} />
                </View>
                <Text style={[styles.tabTitle, { color: activeTabId == item.id ? COLORS.apptheme : COLORS.headerText }]}>{item?.title}</Text>
            </TouchableOpacity>
        );
    };
    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.HOME_FAB_VIEW }],
            });
        }
    };
    return (
        <SafeAreaView style={[styles.container]}>
            <View style={[styles.headerBox]}>
                <TouchableOpacity
                    onPress={() => {
                        !customBackHandler ? handleGoBack() : customHandleGoBack();
                    }}>
                    <Icon name="arrowleft" size={25} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    {!isExpanded ? (
                        <Text style={[styles.headerText]} numberOfLines={1}>{title} <Text style={{fontSize:15}}>{`(${sites?.selectedSite.SiteName})`}</Text></Text>
                    ) : (
                        <Animated.View style={[{ width: widthAnim }]}>
                            <InputWithSearch
                                onSearch={val => {
                                    handleSearch(val);
                                }}
                                searchValue={searchValue}
                            />
                        </Animated.View>
                        // <View>
                        //     <TextInput onChangeText={()=>{}} placeholder='Search......'  placeholderTextColor={COLORS.white} style={styles.inputBox}/>
                        // </View>
                    )}
                </View>
                <View style={[styles.rightIconList]}>
                    {showIcons && (
                        <>
                            {(activeTabId == 1 || activeTabId == 4) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        toggleSearchBar();
                                        if (isExpanded) {
                                            handleClosePress();
                                        }
                                    }}>
                                    <Icon name={!isExpanded ? 'search1' : 'close'} size={25} style={styles.iconButton} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                            {/* {activeTabId == 1 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleQRPress();
                                    }}>
                                    <IconF name="qrcode" size={25} style={styles.iconButton} color={COLORS.white} />
                                </TouchableOpacity>
                            )} */}
                            {/* {activeTabId == 2 && (
                                <TouchableOpacity>
                                    <IconI name="settings-outline" size={25} style={styles.iconButton} color={COLORS.white} />
                                </TouchableOpacity>
                            )} */}
                            {activeTabId == 4 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleFilterPress();
                                    }}>
                                    <Icon name="filter" size={25} style={styles.iconButton} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                            {/* {(activeTabId == 3 || activeTabId == 4) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleSyncPress();
                                    }}>
                                    <IconO name="sync" size={25} style={styles.iconButton} color={COLORS.white} />
                                </TouchableOpacity>
                            )} */}
                            {/* <TouchableOpacity
                                onPress={() => {
                                    // navigation.goBack();
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: ROUTES.HOME_FAB_VIEW }],
                                    });
                                }}>
                                <IconI name="exit-outline" size={31} style={styles.iconButton} color={COLORS.white} />
                            </TouchableOpacity> */}
                            {/* <Tooltip title="Selected Camera" enterTouchDelay={0} leaveTouchDelay={2000}>
                                <IconI name="information-circle-outline" size={28} style={styles.iconButton} color={COLORS.white} />
                            </Tooltip> */}
                            {/* <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <TouchableOpacity onPress={openMenu}>
                                        <IconI name="information-circle-outline" size={28} style={styles.iconButton} color={COLORS.white} />
                                    </TouchableOpacity>
                                }
                                contentStyle={{
                                    backgroundColor: '#000',
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                }}
                                anchorPosition="bottom">
                                <Text style={{ color: COLORS.white }}>Site : {sites?.selectedSite?.SiteName}</Text>
                            </Menu> */}
                        </>
                    )}
                    {showFileIcon && (
                        <TouchableOpacity
                            onPress={() => {
                                handleFileIconPress();
                            }}>
                            <IconI name="images" size={25} style={styles.iconButton} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.contentContainer}>{children}</View>
            <View style={[styles.footerBox]}>
                <FlatList
                    data={footerList}
                    renderItem={renderTab}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 10 }}
                />
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COLORS.icBackground,
        padding: 10,
    },
    headerBox: {
        backgroundColor: COLORS.apptheme,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    rightIconList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 10,
    },
    headerText: {
        color: COLORS.white,
        fontSize: 20,
    },
    footerBox: {
        backgroundColor: COLORS.white,
        height: 80,
        paddingHorizontal: 15,
    },
    tabBox: {
        alignItems: 'center',
    },
    tabTitle: {
        textAlign: 'center',
    },
    activeTabBox: {
        paddingHorizontal: 14,
        paddingVertical: 3,
        borderRadius: 100,
    },
    animatedContainer: {
        flex: 1,
    },
    inputBox: {
        color: COLORS.white,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
    },
});
export default CustomHeader;