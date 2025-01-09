import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import {  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterWithMenu from '../FilterWithMenu';
import { ButtonComponent } from 'components';
import { RFPercentage } from 'helpers/utils';
const moreList = [
    {
        id: 1,
        title: 'Next Sample',
        iconName: 'play-skip-forward-outline',
        iconFrom: 'Ionicons',
    },
    {
        id: 2,
        title: 'Add Sample',
        iconName: 'plus',
        iconFrom: 'AntDesign',
    },
];
const listData = [
    {
        id: 1,
        count: '1',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
    },
    {
        id: 2,
        count: '2',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
    },
    {
        id: 3,
        count: '3',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
    },
    {
        id: 4,
        count: '4',
        actualValue: '',
        finalValue: 4,
        diffValue: 1,
    },
];
const BorderContent = ({ title = 'Title', count = 0, color = '#000' }) => {
    return (
        <View style={[styles.borderContainer]}>
            <View style={[styles.borderBox, { backgroundColor: color }]} />
            <View>
                <Text style={[styles.borderText]}>{title}</Text>
                <Text style={[styles.borderText, { color: color, fontFamily: 'OpenSans-SemiBold' }]}>{count}</Text>
            </View>
        </View>
    );
};
const CharacteristicsIfo = () => {
    const [masterData, setMasterData] = useState([...listData]);
    const handleInputChange = (val, id) => {
        const updatedData = masterData.map(item => (item.id === id ? { ...item, actualValue: val, } : item));
        setMasterData(updatedData);
    };
    const renderItem = (item, index) => {
        let tolleranceValue = item.finalValue + item.diffValue;
        const renderBackGroundColor = (value, fValue) => {
            if (value == '') {
                return COLORS.white;
            } else if (value >= fValue && value <= tolleranceValue) {
                return COLORS.SUCCESS;
            } else {
                return COLORS.ERROR;
            }
        };
        return (
            <View style={[styles.contentBox]} key={item?.id}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        marginRight: 5,
                    }}>
                    <Text style={[styles.headerText]}>{item.count}</Text>
                    {masterData.length == index + 1 && (
                        <TouchableOpacity style={[styles.iconContainer]}>
                            <IconF name="send" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        style={[styles.inputBox, { backgroundColor: renderBackGroundColor(item.actualValue, item.finalValue) }]}
                        value={item.actualValue}
                        onChangeText={val => {
                            handleInputChange(val, item.id);
                        }}
                    />
                    <TouchableOpacity style={[styles.deleteIcon]} onPress={()=>{handleDeletePress(item,index)}}>
                            <IconM name="delete-outline" size={25} color={COLORS.ALERT} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const handleDeletePress=(item,index)=>{
        console.log(item,index,'index')
        let temp = JSON.parse(JSON.stringify(masterData));
        temp.splice(index,1)
        setMasterData(temp);
    }
    const handleMenuPress = value => {
        if (value.id == 2) {
            let temp = JSON.parse(JSON.stringify(masterData));
            temp.push({
                id: temp?.length + 1,
                count: `${temp?.length + 1}`,
                actualValue: '',
                finalValue: temp[0]?.finalValue,
                diffValue: temp[0]?.diffValue,
            });
            setMasterData(temp);
        }
    };
    const renderOkCount=(value=[])=>{
        let tolleranceValue = value[0]?.finalValue + value[0]?.diffValue;
        let temp=value?.filter((x)=>x?.actualValue!=''&&(x?.actualValue >= x?.finalValue && x?.actualValue <= tolleranceValue))
        return temp.length || 0
    }
    const renderNotOkCount=(value=[])=>{
        let tolleranceValue = value[0]?.finalValue + value[0]?.diffValue;
        let temp=value.filter((x)=>x?.actualValue!=''&& !(x?.actualValue >= x?.finalValue && x?.actualValue <= tolleranceValue))
        return temp?.length || 0
    }
    return (
        <View style={[styles.container]}>
            <ScrollView style={[styles.overallBox]} showsVerticalScrollIndicator={false}>
                <View style={[styles.tableBox]}>
                    <View style={[styles.headerBox]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.headerText, { marginLeft: 15 }]}>No</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={[styles.headerText]}>Actual Value</Text>
                        </View>
                    </View>
                    {Boolean(masterData?.length) &&
                        masterData.map((item, index) => {
                            return renderItem(item, index);
                        })}
                </View>
                <View>
                    <BorderContent title="Total Samples Tested" color={COLORS.apptheme} count={masterData?.length} />
                    <BorderContent title="Sample(s) OK " color={COLORS.SUCCESS} count={renderOkCount(masterData)} />
                    <BorderContent title="Sample(s) Not OK " color={COLORS.ERROR} count={renderNotOkCount(masterData)}/>
                </View>
            </ScrollView>
            <View style={[styles.btnContainer]}>
                <ButtonComponent style={{ height: 40, width: '89%' }} onPress={() => {}}>
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
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    tableBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.icBottomBox,
        borderTopColor: COLORS.cloud,
        borderLeftColor: COLORS.icBottomBox,
        borderRightColor: COLORS.icBottomBox,
        borderRadius: 5,
    },
    overallBox: {
        flex: 1,
    },
    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: COLORS.appthemeShadow,
    },
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 15,
        color: '#000',
    },
    contentBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.icBottomBox,
    },
    iconContainer: {
        backgroundColor: COLORS.icborder,
        padding: 10,
        borderRadius: 100,
    },
    inputBox: {
        height: 37,
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 0,
        paddingHorizontal: 10,
        borderColor: COLORS.icBottomBox,
        textAlign: 'center',
        color:COLORS.white,
        fontFamily:'OpenSans-SemiBold',
        fontSize:16
    },
    btnContainer: {
        paddingTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconFilter: {
        width: RFPercentage(4.5),
    },
    mainBox: {
        flex: 1,
    },
    borderBox: {
        height: 40,
        width: 5,
        borderRadius: 10,
        backgroundColor: 'red',
        marginRight: 10,
    },
    borderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    borderText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: '#000',
    },
    deleteIcon:{
        marginLeft:10,
        alignSelf:'center'
    }
});

export default CharacteristicsIfo;
