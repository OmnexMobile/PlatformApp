import { ButtonComponent, CheckBox, RadioButton, TextComponent } from 'components';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import IconO from 'react-native-vector-icons/Octicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { Divider, Modal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import ICCheckBox from '../Components/ICCheckBox';
import DeleteModal from '../Components/DeleteModal';
import IcSkeleton from '../Components/IcSkeleton';
import NoDataFound from '../Components/NoDataFound';
import { useSelector } from 'react-redux';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';

const optionsList = [
    {
        id: 1,
        value: 'Sync',
        label: 'Sync',
    },
    {
        id: 2,
        value: 'Accept Lot',
        label: 'Accept Lot',
    },
    {
        id: 3,
        value: 'Reject Lot',
        label: 'Reject Lot',
    },
    {
        id: 4,
        value: 'Accept Lot / Submit Inspection',
        label: 'Accept Lot / Submit Inspection',
    },
    {
        id: 5,
        value: 'Reject Lot / Submit Inspection',
        label: 'Reject Lot / Submit Inspection',
    },
];

const CompletedInspection = () => {
    const { icUserData } = useSelector(state => state.inspection);

    const [syncModal, setSyncModal] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Sync');
    const [checkBox, setCheckBox] = useState(false);
    const navigation = useNavigation();
    const [showDelete, setShowDelete] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const getAllCompletedData = async (showSkt = true) => {
        showSkt && setShowSkeleton(true);
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        formData.append('siteId', '1');
        formData.append('Condition', `LotStatus like N''%Completed%''`);
        formData.append('strStartDate', '2024-3-1');
        formData.append('strEndDate', '2025-3-26');
        formData.append('strInspectionType', '');
        const response = await postAPI(`${ApiUrl.IC_COMPLETED_LIST}`, formData);
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
        getAllCompletedData(false);
    };
    useEffect(() => {
        if (icUserData && isFocused) {
            getAllCompletedData();
        }
    }, [icUserData, isFocused]);

    const handleISbtnpress = () => {
        navigation.navigate(ROUTES.INSPECTION_SCHEDULE);
    };
    const handleSyncPress = () => {
        setSyncModal(true);
    };
    const hideModal = () => {
        setSyncModal(false);
    };
    const handleDeletePress = () => {
        setShowDelete(true);
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderItem = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.TypeOfInspection) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.strProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.strOperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Frequency : <Text style={[styles.secondText]}>{item?.strSampleFrequency}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item?.strLotNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity style={styles.launchCard}>
                        <Text style={[styles.launchText]}>{item?.strLotStatus}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                handleSyncPress();
                            }}>
                            <IconO name="sync" size={20} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePress}>
                            <Icon name="delete-outline" size={25} color={COLORS.ERROR} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader title="Completed Inspection" activeTabId={3} handleSyncPress={handleSyncPress}>
            <View style={[styles.container]}>
                {Boolean(showSkeleton) ? (
                    <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
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
                        handleISbtnpress();
                    }}>
                    Inspection Schedule
                </ButtonComponent>
            </View>
            <Modal visible={syncModal} onDismiss={hideModal} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.containerOne]}>
                        <Text style={styles.headertext}>Choose Sync Options</Text>
                        <Divider />
                        <View style={[styles.contentBox]}>
                            {optionsList.map(item => {
                                return (
                                    <View style={{ marginVertical: 10 }} key={item.id}>
                                        <RadioButtonComponent
                                            lable={item.label}
                                            value={selectedRadio}
                                            onChange={val => {
                                                setSelectedRadio(val);
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                        <View>
                            <ICCheckBox
                                isChecked={checkBox}
                                label="Supervisor Approved"
                                onChange={() => {
                                    setCheckBox(!checkBox);
                                }}
                            />
                        </View>
                    </View>
                    <View>
                        <Divider />
                        <View style={styles.btnConatiner}>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={() => {}}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <DeleteModal
                visible={showDelete}
                handleClose={() => {
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
        fontFamily: 'OpenSans-SemiBold',
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
        backgroundColor: COLORS.SUCCESS,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
    launchText: {
        color: '#fff',
        fontFamily: 'OpenSans-SemiBold',
    },
    lastBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    btnContainer: {
        paddingTop: 10,
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    containerOne: {
        padding: 20,
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2.2),
        paddingBottom: 12,
        color: COLORS.ictextBlack,
    },
    contentBox: {
        paddingVertical: 15,
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(1.8),
    },
});

export default CompletedInspection;
