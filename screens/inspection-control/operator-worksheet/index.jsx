import { ButtonComponent } from 'components';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage, showErrorMessage } from 'helpers/utils';
import DeleteModal from '../Components/DeleteModal';
import NoDataFound from '../Components/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import ApiUrl from 'global/ApiUrl';
import { getAPI, getAPICall, postAPI } from 'global/api-helpers';
import IcSkeleton from '../Components/IcSkeleton';
import { deleteInspectionByUniqueId, getDatabaseSize, getInspectionDataByUserAndSite } from 'store/database/inspectStorage';
import ICScrollTab from '../Components/ICScrollTab';
import ReportShutdownModal from '../Components/ReportShutdownModal';

const OperatorWorksheet = () => {
    const { icUserData } = useSelector(state => state.inspection);
    const [inspectList, setInspectionList] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const navigation = useNavigation();
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [downTimeData, setDownTimeData] = useState([]);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    // getting a data from SQLite
    const handleGetSQliteList = async () => {
        // await getDatabaseSize()
        const list = await getInspectionDataByUserAndSite(icUserData?.userData?.UserId, icUserData?.userData?.Siteid);
        let filtered = [];
        let superVisorData = [];
        if (list?.length > 0) {
            filtered = list
                .filter(item => item?.userType != 'SupervisorSchedule')
                .sort((a, b) => new Date(b.downloadedDate) - new Date(a.downloadedDate));
            superVisorData = list
                .filter(item => item?.userType === 'SupervisorSchedule')
                .sort((a, b) => new Date(b.downloadedDate) - new Date(a.downloadedDate));
        }
        setInspectionList([...filtered, ...superVisorData]);
        setShowSkeleton(false);
    };
    const handleCIbtnpress = () => {
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
    };
    useEffect(() => {
        if (isFocused) {
            setShowSkeleton(true);
            handleGetSQliteList();
        }
    }, [icUserData, isFocused]);

    const handleLaunchPress = item => {
        navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: item });
    };
    useEffect(() => {
        icUserData.userData && getOverAllSettings();
    }, [icUserData]);
    const getOverAllSettings = async () => {
        const formDate = new FormData();
        formDate.append('UserID', parseInt(icUserData?.userData?.UserId));
        formDate.append('SiteID', parseInt(icUserData?.userData?.Siteid));
        const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`, formDate);
        if (settingsRes?.Success) {
            const settings = {
                ...settingsRes?.Data[0],
            };
            dispatch({ type: 'IC_SETTINGS', icSettings: settings || {} });
        }
    };
    const handleDeletePress = item => {
        setSelectedValue(item);
        setShowDelete(true);
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };

    const rendetBtnText = item => {
        const combined = [...item?.VariableCharacteristics, ...item?.AttributeCharacteristics];

        if (!combined.some(c => 'status' in c)) {
            return {
                status: 'launch',
                colorCode: COLORS.apptheme,
            };
        }
        let allCompleted = combined.every(c => c.status === 'Completed');

        let hasInprogress = false;
        let hasCompleted = false;
        let hasMissingStatus = false;
        let hasLaunchStatus = false;

        for (const c of combined) {
            if ('status' in c) {
                if (c.status === 'Launch' || c.status === undefined || c.status === 'Inspect') {
                    hasLaunchStatus = true;
                } else if (c.status === 'In Progress') {
                    hasInprogress = true;
                } else if (c.status === 'Completed') {
                    hasCompleted = true;
                }
            } else {
                hasMissingStatus = true;
            }
        }

        // 🔑 Priority Logic
        if (hasInprogress) {
            return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        }
        if (hasCompleted && hasLaunchStatus) {
            return { colorCode: COLORS.ipBgColor, status: 'In Progress' }; // ✅ Completed + Launch = In Progress
        }
        if (hasCompleted && hasMissingStatus) {
            return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        }
        if (hasCompleted && allCompleted) {
            return { colorCode: COLORS.fiBgColor, status: 'Completed' };
        }
        if (hasLaunchStatus) {
            return { colorCode: COLORS.apptheme, status: 'Launch' };
        }

        return { status: 'launch', colorCode: COLORS.apptheme };
    };
    const handleSingleDeletePress = async value => {
        const flag = await deleteInspectionByUniqueId(value.uniqueId);
        if (flag) {
            handleGetSQliteList();
            setShowDelete(false);
        } else {
            showErrorMessage('Error deleting inspection');
        }
    };
    const handleReportPress = async item => {
        setSelectedValue(item);
        const response = await getAPICall(`${ApiUrl.IC_GETDOWNTIME}`);
        if (response.length > 0) {
            let downTimeData = [];
            downTimeData = response.map(item => ({
                label: item.description,
                value: item.description,
                ...item,
            }))
            setDownTimeData(downTimeData);
        } else {
            setDownTimeData([]);
        }

        setShowReportModal(true);
    }
    const renderItem = ({ item }) => {
        const { status, colorCode } = rendetBtnText(item);
        return (
            <View style={[styles.recordConatiner, { backgroundColor: item?.backgroundColor ? item?.backgroundColor : '#fff' }]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.intInspectionTypeID) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.strProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item.strOperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Frequency : <Text style={[styles.secondText]}>{item.strFrequencyName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.strLotNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <View>
                        <TouchableOpacity
                            style={[styles.launchCard, { backgroundColor: colorCode }]}
                            onPress={() => {
                                handleLaunchPress(item);
                            }}>
                            <Text style={[styles.launchText]}>{status}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.launchCard, { backgroundColor: COLORS.apptheme, marginTop: 10 }]}
                            onPress={() => {
                                handleReportPress(item);
                            }}>
                            <Text style={[styles.launchText]}>Report</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            handleDeletePress(item);
                        }}>
                        <Icon name="delete-outline" size={25} color={COLORS.ERROR} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader title="Operator Worksheet" activeTabId={2}>
            {/* <ICScrollTab /> */}
            <View style={[styles.container]}>
                {showSkeleton ? (
                    <IcSkeleton type={PLACEHOLDERS.OPERATOR_CARD} />
                ) : Boolean(inspectList?.length) ? (
                    <FlatList
                        data={inspectList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index + 1}
                        showsVerticalScrollIndicator={false}
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            {/* <View style={[styles.btnContainer]}>
                <ButtonComponent
                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                    style={{ height: 40 }}
                    onPress={() => {
                        handleCIbtnpress();
                    }}>
                    Completed Inspections
                </ButtonComponent>
            </View> */}
            <DeleteModal
                visible={showDelete}
                handleClose={() => {
                    setShowDelete(false);
                }}
                handleYesPress={() => {
                    handleSingleDeletePress(selectedValue);
                    // dispatch({
                    //     type: 'REMOVE_INSPECT_LIST',
                    //     inspectionToRemove: selectedValue,
                    // });
                    // setShowDelete(false);
                }}
            />
            <ReportShutdownModal data={selectedValue} visible={showReportModal} handleClose={() => setShowReportModal(false)} dropDownList={downTimeData}/>
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recordConatiner: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10,
    },
    iconBox: {
        borderRadius: 40,
        backgroundColor: COLORS.apptheme,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        color: COLORS.ictextBlack,
    },
    operationText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.ictextBlack,
        lineHeight: 22,
    },
    secondText: {
        color: COLORS.textDark,
        fontFamily: 'OpenSans-Regular',
    },
    launchCard: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 13,
        paddingVertical: 4,
        borderRadius: 5,
        alignItems: 'center',
    },
    launchText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
    },
    lastBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    btnContainer: {
        paddingTop: 10,
    },
});

export default OperatorWorksheet;
