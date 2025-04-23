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
    const { inspectList, icUserData } = useSelector(state => state.inspection);
    const [showDelete, setShowDelete] = useState(false);
    const navigation = useNavigation();
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const getOperatorListData = async (showSkt = true) => {
        showSkt && setShowSkeleton(true);
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        formData.append('StartDate', '2025-3-20');
        formData.append('EndDate', '2025-3-27');
        formData.append('SiteID', '1');
        formData.append('LanguageID', '1');
        const response = await postAPI(`${ApiUrl.IC_OPERATOR_LIST}`, formData);
        if (response.Success) {
            setMasterData(response?.Data || []);
        } else {
            setMasterData([]);
        }
        setShowSkeleton(false);
        setRefreshing(false);
    };
    const onRefresh = () => {
        setRefreshing(true);
        getOperatorListData(false);
    };
    useEffect(() => {
        if (icUserData && isFocused) {
            getOperatorListData();
        }
    }, [icUserData, isFocused]);
    const handleCIbtnpress = () => {
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
    };
    const handleLaunchPress = () => {
        navigation.navigate(ROUTES.INPROCESS_INSPECTION);
    };
    const handleDeletePress = (item) => {
        setSelectedValue(item)
        setShowDelete(true);
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderItem = ({ item }) => {
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
                        style={styles.launchCard}
                        onPress={() => {
                            handleLaunchPress();
                        }}>
                        <Text style={[styles.launchText]}>Launch</Text>
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
                {Boolean(showSkeleton) ? (
                    <IcSkeleton type={PLACEHOLDERS.OPERATOR_CARD} />
                ) : Boolean(inspectList?.length) ? (
                    <FlatList
                        data={inspectList}
                        renderItem={renderItem}
                        keyExtractor={item => item.intInspectionID}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    style={{ height: 40 }}
                    onPress={() => {
                        handleCIbtnpress();
                    }}>
                    Completed Inspections
                </ButtonComponent>
            </View>
            <DeleteModal
                visible={showDelete}
                handleClose={() => {
                    setShowDelete(false);
                }}
                handleYesPress={ () => {
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
        fontFamily: 'ProximaNova-Bold',
        color: COLORS.ictextBlack,
    },
    operationText: {
        fontSize: 14,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.ictextBlack,
        lineHeight: 22,
    },
    secondText: {
        color: COLORS.textDark,
        fontFamily: 'ProximaNova-Regular',
    },
    launchCard: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 13,
        paddingVertical: 4,
        borderRadius: 5,
    },
    launchText: {
        color: '#fff',
        fontFamily: 'ProximaNova-Bold',
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
