import { ButtonComponent, TextComponent } from 'components';
import React, { useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useState } from 'react';
import { Divider, Modal } from 'react-native-paper';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import { RFPercentage } from 'helpers/utils';
import PartDetails from '../Components/supervisor-schedule/PartDetails';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
import IcSkeleton from '../Components/IcSkeleton';
import NoDataFound from '../Components/NoDataFound';
import { useSelector } from 'react-redux';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import moment from 'moment';

const optionsList = [
    {
        id: 0,
        value: 'All',
        label: 'All',
    },
    {
        id: 1,
        value: 'Recieving Inspections',
        label: 'Recieving Inspections',
    },
    {
        id: 2,
        value: 'In-process Inspections',
        label: 'In-process Inspections',
    },
    {
        id: 3,
        value: 'Final Inspections',
        label: 'Final Inspections',
    },
];
const SupervisorSchedule = () => {
    const navigation = useNavigation();
    const { inspectList, icUserData, icSettings } = useSelector(state => state.inspection);
    const isFocused = useIsFocused();
    const [showFilterList, setShowFilterList] = useState(false);
    const [showEye, setShowEye] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        inspectionType: {
            id: 0,
            value: 'All',
            label: 'All',
        },
    });
    const [selectedData, setSelectedData] = useState({});

    const onRefresh = () => {
        setRefreshing(true);
        handleGetAllData(false);
    };

    const handleEyePress = value => {
        setSelectedData(value);
        setShowEye(true);
    };
    const hideModal = () => {
        setShowFilterList(false);
    };
    const handleFilePress = item => {
        let temp = {
            ProductionItem: item.ProductionItemName,
            OperationID: item.OperationID,
            ProductionItemId: item.ProductionItemId,
        };
        setSelectedData(temp);
        setShowFileModal(true);
    };
    const handleGetAllData = async (showSKT = true) => {
        showSKT && setShowSkeleton(true);
        const formData = new FormData();
        formData.append('UserID', icUserData?.userData?.UserId);
        const response = await postAPI(ApiUrl.IC_SUPERVISOR_LIST, formData);
        if (response.Success) {
            setMasterData(response?.Data || []);
            setOverAllData(response?.Data || []);
        } else {
            setMasterData([]);
            setOverAllData([]);
        }
        setShowSkeleton(false);
        setRefreshing(false);
    };
    useEffect(() => {
        if (icUserData) {
            handleGetAllData();
        }
    }, [icUserData]);
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderItem = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.InspectionType) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Inspection Date : <Text style={[styles.secondText]}>{moment(item.EnteredDate).format('DD/MM/YYYY')}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item.LotNo}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity style={styles.launchCard}>
                        <Text style={[styles.launchText]}>Awaiting</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleEyePress(item)}>
                            <IconI name="eye-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleFilePress(item)}>
                            <IconI name="document-attach-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(ROUTES.INPROCESS_INSPECTION);
                            }}>
                            <IconM name="battery-plus-variant" size={27} color="#666666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    useEffect(() => {
        var handler;
        if (filters?.search?.length && isFocused) {
            handler = setTimeout(() => {
                handleTypeFilter(filters.inspectionType.id, filters.search);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [filters?.search, isFocused]);
    const handleTypeFilter = (value, search = '') => {
        let temp = JSON.parse(JSON.stringify(overAllData));
        let tempSearch = [];
        if (value !== 0) {
            tempSearch = temp.filter(item => item.InspectionType == value);
        } else {
            tempSearch = temp;
        }
        if (search?.length) {
            tempSearch = tempSearch.filter(
                item =>
                    item.ProductionItemName.toLowerCase().includes(search.toLowerCase()) ||
                    item.OperationName.toLowerCase().includes(search.toLowerCase()),
            );
        }
        setMasterData(tempSearch);
        hideModal();
    };

    return (
        <CustomHeader
            title="Supervisor Schedule"
            activeTabId={4}
            handleFilterPress={() => {
                setShowFilterList(true);
            }}
            hideSearch={isFocused}
            searchValue={filters?.search}
            handleSearch={value => {
                setFilters(pre => ({ ...pre, search: value }));
                if (!value?.length) {
                    setMasterData(overAllData);
                }
            }}>
            <View style={[styles.container]}>
                {Boolean(showSkeleton) ? (
                    <IcSkeleton type={PLACEHOLDERS.SUPERVISOR_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderItem}
                        keyExtractor={item => item.ProductionItemId}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            <View style={[styles.bottombox]}>
                <Text style={[styles.bottomText]}>Total Inspections </Text>
                <View style={[styles.totalBox]}>
                    <Text style={[styles.bottomText, { color: COLORS.white }]}>{masterData?.length}</Text>
                </View>
            </View>
            <View style={[styles.btnContainer]}>
                <ButtonComponent
                    textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                    style={{ height: 40 }}
                    onPress={() => {
                        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
                    }}>
                    Completed Inspections
                </ButtonComponent>
            </View>
            <Modal visible={showFilterList} onDismiss={hideModal} contentContainerStyle={[styles.modalConatiner]}>
                <View style={[styles.modalcontainer]}>
                    <View style={[styles.modalBoxOne]}>
                        <Text style={[styles.headerText]}>Supervisor Schedule</Text>
                        <Divider />
                        <View style={[styles.contentBox]}>
                            {optionsList.map(item => {
                                return (
                                    <View style={{ marginVertical: 10 }} key={item.id}>
                                        <RadioButtonComponent
                                            lable={item.label}
                                            value={filters.inspectionType.label}
                                            onChange={val => {
                                                setFilters(pre => ({ ...pre, inspectionType: val }));
                                            }}
                                            obj={item}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View>
                        <Divider />
                        <View style={styles.btnConatiner}>
                            <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    handleTypeFilter(filters.inspectionType.id, filters.search);
                                }}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {Boolean(showEye) && (
                <PartDetails
                    visible={showEye}
                    onDismiss={() => {
                        setShowEye(false);
                    }}
                    selectedData={selectedData}
                />
            )}
            <FileViewModal
                selectedValue={selectedData}
                visible={showFileModal}
                onDismiss={() => {
                    setShowFileModal(false);
                }}
                userData={icUserData?.userData}
            />
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    modalConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginBottom: 7,
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
        paddingTop: 7,
    },
    totalBox: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 4,
    },
    bottomText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.headerText,
    },
    bottombox: {
        flexDirection: 'row',
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.icBottomBox,
        borderRadius: 10,
    },
    modalBoxOne: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modalcontainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: RFPercentage(2.1),
        marginBottom: 13,
        color: COLORS.ictextBlack,
    },
    contentBox: {
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
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
    },
});

export default SupervisorSchedule;
