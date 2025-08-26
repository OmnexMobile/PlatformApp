import React, { useEffect, useState } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from 'constants/theme-constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import DataPickerWithIcon from '../Components/DataPickerWithIcon';
import FilterWithMenu from '../Components/FilterWithMenu';
import ICFileIcon from '../../../assets/images/svg/icFile.svg';
import { useAppContext } from 'contexts/app-context';
import moment from 'moment';
import FileViewModal from '../Components/supervisor-schedule/FileViewModal';
import IcSkeleton from '../Components/IcSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import NoDataFound from '../Components/NoDataFound';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Divider, Modal } from 'react-native-paper';
import { Bubbles } from 'react-native-loader';
import RadioButtonComponent from '../Components/RadioButtonComponent';
import PartDetails from '../Components/supervisor-schedule/PartDetails';

const filterList = [
    {
        id: 0,
        title: 'All',
    },
    {
        id: 1,
        title: 'Receiving Inspection',
    },
    {
        id: 2,
        title: 'In-process Inspection',
    },
    {
        id: 3,
        title: 'Final Inspection',
    },
];
const searchFilterList = [
    {
        id: 1,
        label: 'Production Item',
        isSelected: true,
    },
    // {
    //     id: 2,
    //     label: 'Refrence No',
    //     isSelected: false,
    // },
    {
        id: 3,
        isSelected: false,
        label: 'Operation',
    },
    {
        id: 4,
        isSelected: false,
        label: 'Lot No',
    },
    // {
    //     id: 5,
    //     isSelected: false,
    //     label: 'Lot Size',
    // },
    // {
    //     id: 6,
    //     isSelected: false,
    //     label: 'Sample Frequency',
    // },
    // {
    //     id: 7,
    //     isSelected: false,
    //     label: 'Inspector(s)',
    // },
    {
        id: 8,
        isSelected: false,
        label: 'Status',
    },
];
const SearchInspection = () => {
    const { height } = useWindowDimensions();
    const { icUserData } = useSelector(state => state.inspection);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const {
        profile,
        sites: { selectedSite },
    } = useAppContext();
    const navigation = useNavigation();
    const [showSearchFilter, setShowSearchFilter] = useState(false);
    const [filterData, setFilterData] = useState({
        startDate: moment().subtract(7, 'days').toDate(),
        endDate: new Date(),
        type: 0,
    });
    const [searchFilter, setSearchFilter] = useState({
        searchBy: 'Production Item',
        searchText: '',
    });
    const [showFileModal, setShowFileModal] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [masterData, setMasterData] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [showBubble, setShowBubble] = useState(false);
    const [searchList, setSearchList] = useState([...searchFilterList]);
    const [refreshing, setRefreshing] = useState(false);
    const [showEye, setShowEye] = useState(false);
    const handleEyePress = value => {
        setSelectedData(value);
        setShowEye(true);
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
    useEffect(() => {
        if (isFocused && icUserData) {
            handleListFetch(true);
        }
    }, [filterData, isFocused, icUserData]);
    const handleListFetch = async (showSktn = true, notRefresh = true) => {
        showSktn && setShowSkeleton(true);
        const { startDate, endDate, type } = filterData;
        let dateFlag = startDate !== '' && endDate !== '';
        const formData = new FormData();
        formData.append('UserId', icUserData?.userData?.UserId);
        formData.append('siteId', parseInt(icUserData?.userData?.Siteid));
        formData.append('InspectionType', type == 0 ? '' : type);
        formData.append('StartDate', dateFlag ? moment(startDate).format('YYYY/MM/DD') : '');
        formData.append('EndDate', dateFlag ? moment(endDate).format('YYYY/MM/DD') : '');
        const response = await postAPI(`${ApiUrl.IC_GET_SEARCH_INSPECTIONLIST}`, formData);
        if (response.Success && response?.Data?.length) {
            if (searchFilter.searchText !== '' && notRefresh) {
                let temp = response?.Data.filter(x =>
                    x[getSearchKey(searchFilter.searchBy)].toLowerCase().includes(searchFilter.searchText.toLowerCase()),
                );
                setMasterData([...temp]);
            } else {
                setMasterData([...response?.Data]);
            }
            setOverAllData([...response?.Data]);
        } else {
            setMasterData([]); // no more data
            setOverAllData([]);
        }
        setShowSkeleton(false);
        setRefreshing(false);
    };

    const handleDownloadPress = async item => {
        setSelectedData(item);
    };
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderBackgroundColor = value => {
        switch (value) {
            case 'In Progress':
                return COLORS.ipBgColor;
            case 'Accepted':
                return COLORS.fiBgColor;
            case 'Rejected':
                return COLORS.red;
            default:
                return COLORS.apptheme;
        }
    };
    const handleSearchFilterSubmit = () => {
        setShowSearchFilter(false);
        const tempFilter = searchList.filter(x => x.isSelected)[0];
        setSearchFilter(pre => ({ ...pre, searchBy: tempFilter?.label }));
    };
    useEffect(() => {
        var handler;
        if (searchFilter.searchText && searchFilter.searchBy) {
            handler = setTimeout(() => {
                handleSearchList(searchFilter.searchText, searchFilter.searchBy);
            }, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [searchFilter]);
    const getSearchKey = (searchBy = '') => {
        switch (searchBy) {
            case 'Production Item':
                return 'ProductionItemName';
            case 'Operation':
                return 'OperationName';
            case 'Lot No':
                return 'LotNo';
            case 'Status':
                return 'LotStatus';
            default:
                return 'ProductionItemName';
        }
    };
    const handleSearchList = (search = '', searchBy = '') => {
        let temp = overAllData.filter(x => x[getSearchKey(searchBy)].toLowerCase().includes(search.toLowerCase()));
        setMasterData([...temp]);
    };
    const onRefresh = () => {
        setRefreshing(true);
        setSearchFilter({
            searchBy: 'Production Item',
            searchText: '',
        });
        handleListFetch(false, false);
    };
    const handleOuterRefersh=()=>{
        handleListFetch(true);
    }
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.InspectionType) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 2, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.ProductionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.OperationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot No : <Text style={[styles.secondText]}>{item?.LotNo ? item?.LotNo : '-'}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Inspected Date : <Text style={[styles.secondText]}>{moment(new Date(item.EnteredDate)).format('DD/MM/YYYY')}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <Text style={[styles.statusText, { backgroundColor: renderBackgroundColor(item?.LotStatus) }]}>{item?.LotStatus}</Text>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleEyePress(item);
                            }}>
                            <IconI name="eye-outline" size={25} color={COLORS.grey} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                handleFilePress(item);
                            }}>
                            <ICFileIcon />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                if (item?.canDownload) {
                                    handleDownloadPress(item);
                                } else {
                                    showMessage({
                                        message: 'Template or operation mapping not done for this Production item, please do the mapping',
                                        backgroundColor: COLORS.WARNING,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 45,
                                        icon: 'danger',
                                        position: 'right',
                                        style: Platform.OS === 'ios' ? { height: 100, alignItems: 'flex-end' } : {},
                                    });
                                }
                            }}>
                            <IconF name="download" size={25} color={item.isDownloaded ? '#66BB6B' : '#666666'} />
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader
            title="Search Inspection"
            activeTabId={0}
            hideSearch={isFocused}
            handleSearch={value => {
                setSearchFilter(pre => ({ ...pre, searchText: value }));
                if (value?.length == 0) {
                    handleSearchList('', searchFilter.searchBy);
                }
            }}
            searchValue={searchFilter.searchText}
            handleClosePress={() => {
                setSearchFilter(pre => ({ ...pre, searchText: '' }));
                handleSearchList('', searchFilter.searchBy);
            }}
            handleFilterPress={() => {
                setShowSearchFilter(true);
            }}>
            <View style={[styles.mainContainer]}>
                <View style={[styles.overAllBox]}>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.startDate || null}
                            onSelectedDate={val => {
                                const { endDate } = filterData;
                                const tempStart = moment(val);
                                const tempEnd = moment(endDate);
                                if (tempStart.isBefore(tempEnd)) {
                                    setFilterData(pre => ({ ...pre, startDate: val }));
                                } else {
                                    showMessage({
                                        message: 'Start Date must be less than End Date',
                                        backgroundColor: COLORS.ERROR,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 40,
                                        icon: 'danger',
                                        position: 'right',
                                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                                    });
                                }
                            }}
                        />
                    </View>
                    <View style={[styles.filterBox]}>
                        <DataPickerWithIcon
                            value={filterData?.endDate || null}
                            placeHolder="End Date"
                            onSelectedDate={val => {
                                const { startDate } = filterData;
                                const tempStart = moment(startDate);
                                const tempEnd = moment(val);
                                if (tempStart.isBefore(tempEnd)) {
                                    setFilterData(pre => ({ ...pre, endDate: val }));
                                } else {
                                    showMessage({
                                        message: 'Start Date must be less than End Date',
                                        backgroundColor: COLORS.ERROR,
                                        color: COLORS.white,
                                        duration: 1500,
                                        statusBarHeight: 40,
                                        icon: 'danger',
                                        position: 'right',
                                        style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                                    });
                                }
                            }}
                        />
                    </View>
                    <View style={[styles.filterList]}>
                        <FilterWithMenu
                            dataList={filterList}
                            type="BtnFilter"
                            onSelectedPress={val => {
                                setFilterData(pre => ({ ...pre, type: val.id }));
                            }}
                        />
                    </View>
                    <View style={[styles.iconFilter]}>
                        <TouchableOpacity
                            style={styles.getDataBox}
                            onPress={() => {
                                handleOuterRefersh();
                            }}>
                            <IconI name="sync-sharp" size={22} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>
                {showSkeleton ? (
                    <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
                ) : Boolean(masterData?.length) ? (
                    <FlatList
                        data={masterData}
                        renderItem={renderData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <NoDataFound />
                )}
            </View>
            {Boolean(showFileModal) && (
                <FileViewModal
                    selectedValue={selectedData}
                    visible={showFileModal}
                    onDismiss={() => {
                        setShowFileModal(false);
                    }}
                    userData={icUserData?.userData}
                />
            )}
            {Boolean(showBubble) && (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={showBubble}
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
            {Boolean(showSearchFilter) && (
                <Modal
                    visible={showSearchFilter}
                    onDismiss={() => {
                        setShowSearchFilter(false);
                    }}
                    contentContainerStyle={{
                        backgroundColor: '#fff',
                        width: '90%',
                        alignSelf: 'center',
                        maxHeight: 500,
                    }}>
                    <View style={[styles.containerOne]}>
                        <Text style={styles.headertext}>Choose Sync Options</Text>
                        <Divider />
                        <View style={[styles.contentBox]}>
                            {searchList.map((item, index) => {
                                return (
                                    <View style={{ marginVertical: 10 }} key={item.id}>
                                        <RadioButtonComponent
                                            lable={item.label}
                                            value={item.isSelected ? item.label : ''}
                                            onChange={val => {
                                                setSearchList(pre => {
                                                    let temp = pre.map(item =>
                                                        item.id === val.id ? { ...item, isSelected: true } : { ...item, isSelected: false },
                                                    );
                                                    return temp;
                                                });
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
                            <TouchableOpacity style={styles.cancelConatiner} onPress={() => setShowSearchFilter(false)}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    handleSearchFilterSubmit();
                                }}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {Boolean(showEye) && (
                <PartDetails
                    visible={showEye}
                    onDismiss={() => {
                        setShowEye(false);
                    }}
                    selectedData={selectedData}
                />
            )}
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    btnContainer: {
        paddingTop: 10,
    },
    recordConatiner: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.icborder,
        flexDirection: 'row',
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
    statusText: {
        color: COLORS.white,
        fontFamily: 'OpenSans-Regular',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        textAlign: 'center',
    },
    iconlist: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    lastBox: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bottombox: {
        flexDirection: 'row',
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.icBottomBox,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
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
    filterBox: {
        width: '32%',
    },
    filterList: {
        width: '23%',
    },
    iconFilter: {
        width: '10%',
        alignItems: 'center',
    },
    overAllBox: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    getDataBox: {
        height: 35,
        width: 35,
        backgroundColor: COLORS.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    containerOne: {
        padding: 20,
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        paddingBottom: 12,
        color: COLORS.ictextBlack,
    },
    contentBox: {
        paddingVertical: 15,
    },
    btnConatiner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 10,
    },
    cancelConatiner: {
        marginRight: 20,
    },
    btnStyle: {
        color: COLORS.apptheme,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
    },
});

export default SearchInspection;
