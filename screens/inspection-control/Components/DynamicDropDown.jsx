import { CheckBox } from 'components';
import { COLORS } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Menu } from 'react-native-paper';
import IconA from 'react-native-vector-icons/AntDesign';
import ICCheckBox from './ICCheckBox';

const DynamicDropDown = ({
    list = [],
    height = 40,
    anchorPosition = 'top',
    handleSelectedList = () => {},
    isMultiSelect = true,
    isDisable = false,
}) => {
    console.log(isDisable, 'isDisable');
    const width = useWindowDimensions().width;
    const [multiValue, setMultiValue] = useState([]);
    const [visible, setVisible] = useState(false);
    const [listData, setListData] = useState([]);

    useEffect(() => {
        if (list.length) {
            let temp = JSON.parse(JSON.stringify(list));
            let updatedtemp = temp.map(item => ({ ...item, isChecked: false }));
            setListData([...updatedtemp]);
        } else {
            setListData([]);
        }
    }, [list]);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.itemBox]} activeOpacity={1} key={index + 1}>
                <Text style={[styles.selectedText]}>{item.label}</Text>
                <TouchableOpacity
                    onPress={() => {
                        if (!isDisable) {
                            isMultiSelect ? handleCheckPress(item) : handleRemove(item);
                        }
                    }} activeOpacity={!isDisable ? 0.5 : 1}>
                    <IconA name="close" size={15} color={COLORS.white} style={{ paddingHorizontal: 5 }} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const handleCheckPress = val => {
        let temp = JSON.parse(JSON.stringify(listData));
        const updatedData = temp.map(item => (item.value === val.value ? { ...item, isChecked: !item.isChecked } : item));
        const filterList = updatedData.filter(item => item.isChecked);
        handleSelectedList(filterList);
        setMultiValue(filterList);
        setListData([...updatedData]);
    };
    const handleSingleSelected = val => {
        let temp = JSON.parse(JSON.stringify(listData));
        const updatedData = temp.map(item => ({ ...item, isChecked: item.value === val.value ? true : false }));
        const filterList = updatedData.filter(item => item.isChecked);
        handleSelectedList(filterList);
        setListData([...updatedData]);
        setMultiValue([val]);
        handleSelectedList([val]);
        closeMenu();
    };
    const handleRemove = () => {
        let temp = JSON.parse(JSON.stringify(list));
        let updatedtemp = temp.map(item => ({ ...item, isChecked: false }));
        setListData([...updatedtemp]);
        setMultiValue([]);
        handleSelectedList([]);
    };
    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <TouchableOpacity
                    style={[styles.container, { height: height, zIndex: 10 }]}
                    onPress={() => {
                        if (!isDisable) {
                            openMenu();
                        }
                    }}
                    activeOpacity={!isDisable ? 0.5 : 1}>
                    <View style={[styles.mainBox]}>
                        <FlatList
                            nestedScrollEnabled
                            data={multiValue}
                            renderItem={renderItem}
                            horizontal
                            style={{ zIndex: 10000, elevation: 10 }}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                                if (!isDisable) {
                                    openMenu();
                                }
                            }}
                            activeOpacity={!isDisable ? 0.5 : 1}>
                            <IconA name="down" color={COLORS.charcoal} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            }
            contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 10,
                width: width / 1.2,
                height: 200,
                marginTop: height + 10,
            }}
            anchorPosition={anchorPosition}>
            <ScrollView>
                {listData.length &&
                    listData.map((item, index) => {
                        return (
                            <View key={index + 1}>
                                {isMultiSelect ? (
                                    <View key={index + 1} style={[styles.listItem]}>
                                        <ICCheckBox
                                            label={item?.label}
                                            isChecked={item.isChecked}
                                            fontSize={14}
                                            fontFamily={'OpenSans-SemiBold'}
                                            onChange={() => {
                                                handleCheckPress(item);
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleSingleSelected(item);
                                        }}
                                        style={[
                                            {
                                                backgroundColor: item.isChecked ? COLORS.cloud : '#fff',
                                                paddingVertical: 10,
                                                paddingLeft: 5,
                                                borderRadius: 2,
                                            },
                                        ]}>
                                        <Text style={[styles.listText]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
            </ScrollView>
        </Menu>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 10,
        justifyContent: 'center',
    },
    itemBox: {
        padding: 5,
        backgroundColor: COLORS.apptheme,
        marginLeft: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 13,
        color: COLORS.white,
    },
    mainBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItem: {
        marginBottom: 20,
    },
    listText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: COLORS.black,
    },
});
export default DynamicDropDown;
