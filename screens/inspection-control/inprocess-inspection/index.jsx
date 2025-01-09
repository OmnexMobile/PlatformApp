import React, { useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from 'constants/theme-constants';
import { ButtonComponent } from 'components';
import FilterWithMenu from '../Components/FilterWithMenu';
import { RFPercentage } from 'helpers/utils';
import SignatureComponent from '../Components/SignatureComponent';
import CharacteristicsIfo from '../Components/inprocess-inspection/CharacteristicsIfo';
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

const listData = [
    {
        id: 1,
        title: `PCGR00`,
        name: 'Machine Speeds add feeds',
    },
    {
        id: 2,
        title: `WERRCGR00`,
        name: 'Machine Speeds add feeds',
    },
    {
        id: 3,
        title: `PCGWEDFRR00`,
        name: 'Machine Speeds add feeds',
    },
];

const InprocessInspection = () => {
    const [showGeneral, setShowGeneral] = useState(false);
    const [showChar, setShowChar] = useState(false);
    const [showSignModal,setShowSignModal]=useState(false)
    const handleGenOpen = () => {
        setShowGeneral(!showGeneral);
        setShowChar(false);
    };
    const handleCharOpen = () => {
        setShowChar(!showChar);
        setShowGeneral(false);
    };
    const handleMenuPress = value => {
        setShowSignModal(true)
        
    };
    const renderItem = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox]}>
                    <IconM name="information-variant" size={25} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle]}>{item.title}</Text>
                    <Text style={[styles.headerName]}>{item.name}</Text>
                </View>
                <View style={[styles.lastBox]}>
                    <TouchableOpacity style={[styles.inspectBox]} onPress={()=>{handleCharOpen()}}>
                        <Text style={[styles.iText]}>Inspect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader title="Inprocess Inspection" activeTabId={2} showIcons={false}>
            <View style={[styles.conatiner]}>
                {!showChar && (
                    <View style={{ flex: showGeneral ? 1 : 0 }}>
                        <TouchableOpacity
                            style={[styles.tabStyle, { borderBottomLeftRadius: showGeneral ? 0 : 10, borderBottomRightRadius: showGeneral ? 0 : 10 }]}
                            onPress={() => {
                                handleGenOpen();
                            }}>
                            <Text style={[styles.headerText]}>General Info</Text>
                            <Icon name={showGeneral ? 'down' : 'right'} size={20} />
                        </TouchableOpacity>
                        {showGeneral && <View style={[styles.tabBox]}></View>}
                    </View>
                )}
                {!showChar && !showGeneral && (
                    <View style={[styles.centerBox]}>
                        <FlatList data={listData} renderItem={renderItem} keyExtractor={item => item.id} />
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
                            handleCharOpen();
                        }}>
                        <Text style={[styles.headerText]}>Characteristics Info</Text>
                        <Icon name={showChar ? 'down' : 'right'} size={20} />
                    </TouchableOpacity>
                    {showChar && <View style={[styles.tabBox]}>
                            <CharacteristicsIfo/>
                        </View>}
                </View>
            </View>
            <SignatureComponent modalVisible={showSignModal}  hideModal={()=>{setShowSignModal(false)}}/>
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
        width: RFPercentage(4.2),
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
      alignSelf:'center'
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
    headerTitle:{
      fontFamily:'OpenSans-SemiBold',
      fontSize:16,
      color: '#000',
    },
    headerName:{
      fontFamily:'OpenSans-Regular',
      fontSize:14,
      color: '#000'
    }
});

export default InprocessInspection;
