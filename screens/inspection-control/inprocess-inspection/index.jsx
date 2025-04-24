import React, { useEffect, useLayoutEffect, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from 'constants/theme-constants';
import { ButtonComponent } from 'components';
import FilterWithMenu from '../Components/FilterWithMenu';
import { RFPercentage } from 'helpers/utils';
import SignatureComponent from '../Components/SignatureComponent';
import CharacteristicsInfo from '../Components/inprocess-inspection/CharacteristicsInfo';
import GeneralInfo from '../Components/inprocess-inspection/GeneralInfo';
import { showMessage } from 'react-native-flash-message';
import ModalFilePickerWithList from '../Components/inprocess-inspection/ModalFilePickerWithList';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const moreList = [
    {
        id: 1,
        title: 'Supervisor Signature',
        iconName: 'user-check',
        iconFrom: 'Feather',
    },
    {
        id: 2,
        title: 'Inspector Signature',
        iconName: 'user-tie',
        iconFrom: 'FontAwesome5',
    },
];


const varData = [
    {
        id: 1,
        count: '1',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
        editvalue: '',
    },
    {
        id: 2,
        count: '2',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
        editvalue: '',
    },
    {
        id: 3,
        count: '3',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
        editvalue: '',
    },
    {
        id: 4,
        count: '4',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
        editvalue: '',
    },
];

const InprocessInspection = ({ route }) => {
    const { inspectData } = route.params;
    const { inspectList } = useSelector(state => state.inspection);
    const [showGeneral, setShowGeneral] = useState(false);
    const [showChar, setShowChar] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    const [formType, setFormType] = useState('number');
    const [showFilePage, setShowFilePage] = useState(false);
    const [infoData, setInfoData] = useState({});
    const navigation = useNavigation();
    console.log(inspectData, '*********************************inspectList');
    useLayoutEffect(() => {
        setInfoData(inspectData);
    }, [inspectData]);

    const handleGenOpen = () => {
        setShowGeneral(!showGeneral);
        setShowChar(false);
    };
    const handleCharOpen = () => {
        setShowChar(!showChar);
        setShowGeneral(false);
    };
    const handleMenuPress = value => {
        setShowSignModal(true);
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.recordConatiner]} key={index+1}>
                <View style={[styles.iconBox]}>
                    <IconM name="information-variant" size={25} color={COLORS.moreIcon} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle]}>{item.strCharacteristicName}</Text>
                    <Text style={[styles.headerName]}>{item.strOperationName}</Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity
                        style={[styles.inspectBox]}
                        onPress={() => {
                            console.log(index % 2 == 0, 'index%2==0');
                            handleCharOpen();
                            if (index % 2 == 0) {
                                setFormType('char');
                            } else {
                                setFormType('number');
                            }
                        }}>
                        <Text style={[styles.iText]}>Inspect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader
            title="Inprocess Inspection"
            activeTabId={2}
            showIcons={false}
            showFileIcon={showChar}
            handleFileIconPress={() => {
                setShowFilePage(true);
            }}
            customBackHandler={true}
            customHandleGoBack={() => {
                if (!showChar) {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ROUTES.HOME_FAB_VIEW }],
                        });
                    }
                } else {
                    setShowChar(false);
                }
            }}>
            <View style={[styles.conatiner]}>
                {!showChar && (
                    <View style={{ flex: showGeneral ? 1 : 0 }}>
                        <TouchableOpacity
                            style={[styles.tabStyle, { borderBottomLeftRadius: showGeneral ? 0 : 10, borderBottomRightRadius: showGeneral ? 0 : 10 }]}
                            onPress={() => {
                                handleGenOpen();
                            }}>
                            <Text style={[styles.headerText]}>General Info</Text>
                            <Icon name={showGeneral ? 'down' : 'right'} size={20} color={COLORS.moreIcon} />
                        </TouchableOpacity>
                        {showGeneral && (
                            <View style={[styles.tabBox]}>
                                <GeneralInfo infoData={infoData} setInfoData={setInfoData} />
                            </View>
                        )}
                    </View>
                )}
                {!showChar && !showGeneral && (
                    <View style={[styles.centerBox]}>
                        <FlatList
                            data={infoData?.VariableCharacteristics || []}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={[styles.btnContainer]}>
                            <ButtonComponent style={{ height: 40, width: '87%' }} onPress={() => {}}>
                                Save
                            </ButtonComponent>
                            <View style={[styles.iconFilter]}>
                                <FilterWithMenu
                                    dataList={moreList}
                                    type="IconFilter"
                                    onSelectedPress={value => {
                                        handleMenuPress(value);
                                    }}
                                    anchorPosition="top"
                                />
                            </View>
                        </View>
                    </View>
                )}
                <View style={{ flex: showChar ? 1 : 0 }}>
                    <TouchableOpacity
                        style={[styles.tabStyle, { borderBottomLeftRadius: showChar ? 0 : 10, borderBottomRightRadius: showChar ? 0 : 10 }]}
                        onPress={() => {
                            if (showChar) {
                                handleCharOpen();
                            } else {
                                showMessage({
                                    message: 'Please press the "Inspect" button.',
                                    backgroundColor: COLORS.WARNING,
                                    color: COLORS.white,
                                    duration: 1500,
                                    statusBarHeight: 40,
                                    // style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
                                    position: 'bottom',
                                });
                            }
                        }}>
                        <Text style={[styles.headerText]}>Characteristics Info</Text>
                        <Icon name={showChar ? 'down' : 'right'} size={20} color={COLORS.moreIcon} />
                    </TouchableOpacity>
                    {showChar && (
                        <View style={[styles.tabBox]}>
                            <CharacteristicsInfo listData={varData} type={formType} setShowChar={setShowChar} />
                        </View>
                    )}
                </View>
            </View>
            <SignatureComponent
                modalVisible={showSignModal}
                hideModal={() => {
                    setShowSignModal(false);
                }}
            />
            <ModalFilePickerWithList
                visible={showFilePage}
                onDismiss={() => {
                    setShowFilePage(false);
                }}
            />
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    tabStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
    },
    centerBox: {
        flex: 1,
        marginVertical: 10,
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    btnContainer: {
        paddingTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconFilter: {
        width: RFPercentage(5),
    },
    tabBox: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 10,
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
        backgroundColor: COLORS.icborder,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastBox: {
        alignSelf: 'center',
    },
    inspectBox: {
        backgroundColor: COLORS.apptheme,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
    },
    iText: {
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.white,
    },
    headerTitle: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    headerName: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color: '#000',
    },
});

export default InprocessInspection;
