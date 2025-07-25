import { ButtonComponent } from 'components';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'helpers/utils';
import DeleteModal from '../Components/DeleteModal';
import NoDataFound from '../Components/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import ApiUrl from 'global/ApiUrl';
import { postAPI } from 'global/api-helpers';
import IcSkeleton from '../Components/IcSkeleton';

const OperatorWorksheet = () => {
    const { inspectList, icUserData, icSettings } = useSelector(state => state.inspection);
    const [showDelete, setShowDelete] = useState(false);
    const navigation = useNavigation();
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const handleCIbtnpress = () => {
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
    };
    const handleLaunchPress = item => {
        navigation.navigate(ROUTES.INPROCESS_INSPECTION, { inspectData: item });
    };
    useEffect(() => {
        getOverAllSettings();
    }, []);
    const getOverAllSettings = async () => {
        const settingsRes = await postAPI(`${ApiUrl.IC_SETTINGS}`);
        if (settingsRes?.Success) {
            dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
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
        if (!combined.some(item => 'status' in item)) {
            return {
                status: 'launch',
                colorCode: COLORS.apptheme,
            };
        }
        let hasInprogress = false;
        let hasCompleted = false;
        let hasMissingStatus = false;

        for (const item of combined) {
            if ('status' in item) {
                if (item.status === 'In Progress') {
                    hasInprogress = true;
                } else if (item.status === 'Completed') {
                    hasCompleted = true;
                }
            } else {
                hasMissingStatus = true;
            }
        }

        if (hasInprogress) return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        if (hasCompleted && hasMissingStatus) return { colorCode: COLORS.ipBgColor, status: 'In Progress' };
        if (hasCompleted && !hasMissingStatus) return { colorCode: COLORS.fiBgColor, status: 'Completed' };

        return {
            status: 'launch',
            colorCode: COLORS.apptheme,
        };
    };
    const renderItem = ({ item }) => {
        const { status, colorCode } = rendetBtnText(item);
        return (
            <View style={[styles.recordConatiner]}>
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
                    <TouchableOpacity
                        style={[styles.launchCard, { backgroundColor: colorCode }]}
                        onPress={() => {
                            handleLaunchPress(item);
                        }}>
                        <Text style={[styles.launchText]}>{status}</Text>
                    </TouchableOpacity>
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
            <View style={[styles.container]}>
                {Boolean(inspectList?.length) ? (
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
                    dispatch({
                        type: 'REMOVE_INSPECT_LIST',
                        inspectionToRemove: selectedValue,
                    });
                    setShowDelete(false);
                }}
            />
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
        backgroundColor: '#fff',
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
