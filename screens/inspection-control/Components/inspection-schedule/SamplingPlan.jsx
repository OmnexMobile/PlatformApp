import { COLORS } from 'constants/theme-constants';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import IconM from 'react-native-vector-icons/MaterialIcons';
import SingleDropDown from '../SingleDropDown';
import InputWithSearch from '../InputWithSearch';

const listData = [
    {
        id: 1,
        productionItem: 'Production Item 1',
        inspectionLevel: 'I',
        inspectionMode: 'Inspection Mode 1',
        qualityLevel: '0.65',
        aql: 'Single Plan 1',
        supplier: 'Supplier 1',
    },
    {
        id: 2,
        productionItem: 'Production Item 2',
        inspectionLevel: 'II',
        inspectionMode: 'Inspection Mode 2',
        qualityLevel: '0.75',
        aql: 'Single Plan 2',
        supplier: 'Supplier 2',
    },
    {
        id: 3,
        productionItem: 'Production Item 3',
        inspectionLevel: 'III',
        inspectionMode: 'Inspection Mode 3',
        qualityLevel: '0.85',
        aql: 'Single Plan 3',
        supplier: 'Supplier 3',
    },
    {
        id: 4,
        productionItem: 'Production Item 4',
        inspectionLevel: 'IV',
        inspectionMode: 'Inspection Mode 4',
        qualityLevel: '0.95',
        aql: 'Single Plan 4',
        supplier: 'Supplier 4',
    },
    {
        id: 5,
        productionItem: 'Production Item 5',
        inspectionLevel: 'V',
        inspectionMode: 'Inspection Mode 5',
        qualityLevel: '1.05',
        aql: 'Single Plan 5',
        supplier: 'Supplier 5',
    },
    {
        id: 6,
        productionItem: 'Production Item 6',
        inspectionLevel: 'VI',
        inspectionMode: 'Inspection Mode 6',
        qualityLevel: '1.15',
        aql: 'Single Plan 6',
        supplier: 'Supplier 6',
    },
    {
        id: 7,
        productionItem: 'Production Item 7',
        inspectionLevel: 'VII',
        inspectionMode: 'Inspection Mode 7',
        qualityLevel: '1.25',
        aql: 'Single Plan 7',
        supplier: 'Supplier 7',
    },
    {
        id: 8,
        productionItem: 'Production Item 8',
        inspectionLevel: 'VIII',
        inspectionMode: 'Inspection Mode 8',
        qualityLevel: '1.35',
        aql: 'Single Plan 8',
        supplier: 'Supplier 8',
    },
];
const searchFilterList = [
    {
        id: 1,
        title: 'Production Item',
        label: 'Production Item',
        value: 'Production Item',
    },
    {
        id: 2,
        label: 'Inspection Level',
        title: 'Inspection Level',
        value: 'Inspection Level',
    },
    {
        id: 3,
        label: 'Inspection Mode',
        title: 'Inspection Mode',
        value: 'Inspection Mode',
    },
    {
        id: 4,
        label: 'Quality Level Standard',
        title: 'Quality Level Standard',
        value: 'Quality Level Standard',
    },
    {
        id: 5,
        label: 'Accetance Quality Limit',
        title: 'Accetance Quality Limit',
        value: 'Accetance Quality Limit',
    },
    {
        id: 6,
        label: 'Supplier',
        title: 'Supplier',
        value: 'Supplier',
    },
];
const SamplingPlan = ({ modalVisible, setModalVisible = () => {} }) => {
    const [searchFilter, setSearchFilter] = useState(searchFilterList);
    const [filters, setFilters] = useState({
        searchBy: {
            id: 1,
            title: 'Production Item',
            label: 'Production Item',
            value: 'Production Item',
        },
        searchText: '',
    });
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cardText]}>{item?.productionItem}</Text>
                    <Text style={[styles.operationText]}>
                        Inspection Level : <Text style={[styles.secondText]}>{item?.inspectionLevel}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Inspection Mode : <Text style={[styles.secondText]}>{item.inspectionMode}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Quality Level Standard : <Text style={[styles.secondText]}>{item?.qualityLevel}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Acceptane Quality Limit : <Text style={[styles.secondText]}>{item?.inspectionLevel}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Supplier(s) : <Text style={[styles.secondText]}>{item?.inspectionLevel}</Text>
                    </Text>
                </View>
                <View style={[styles.lastBox]}>
                    <View style={[styles.iconlist]}>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                setModalVisible(true);
                            }}>
                            <IconM name="edit" size={20} color={COLORS.black} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 15 }}>
                            <IconM name="delete" size={20} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <View style={styles.container}>
                <View style={[styles.filterBox]}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' ,marginHorizontal:5}}>
                        <View style={[styles.filterList]}>
                            <SingleDropDown
                                data={searchFilter}
                                placeholder={'Filter'}
                                showSearch={false}
                                backgroundColor={COLORS.white}
                                borderWidth={1}
                                title=""
                                borderRadius={7}
                                borderColor={COLORS.icBottomBox}
                                maxHeight={200}
                                onChange={val => {
                                    setFilters(prev => ({ ...prev, searchBy: val }));
                                }}
                                value={filters.searchBy}
                            />
                        </View>
                        <View style={[styles.searchBox]}>
                            <InputWithSearch placeholder={'Search...'} onSearch={val => {}} />
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={[styles.addBtn]}
                            onPress={() => {
                                setModalVisible(true);
                            }}>
                            <IconM name="add" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={listData}
                        renderItem={renderData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </View>
            <Modal
                visible={modalVisible}
                onDismiss={() => {
                    setModalVisible(false);
                }}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                transparent={true}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:COLORS.windowTint,
                    }}>
                    <View
                        style={{
                            padding: 10,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 10,
                            height: '70%',
                            width: '90%',
                        }}>
                        <Text style={styles.headertext}>Add</Text>
                        <Divider />
                        <ScrollView
                            style={{ flex: 1, width: '100%', backgroundColor: '#fff', borderRadius: 3 }}
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>Production Item</Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>
                                        Inspection Mode <Text style={[styles.rquired]}>*</Text>
                                    </Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>
                                        Inspection Level <Text style={[styles.rquired]}>*</Text>
                                    </Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>
                                        Quality Level Standrd <Text style={[styles.rquired]}>*</Text>
                                    </Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>
                                        Acceptane Quality Limit <Text style={[styles.rquired]}>*</Text>
                                    </Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <View style={[styles.row]}>
                                    <Text style={styles.inputText}>Supplier(s)</Text>
                                </View>
                                <SingleDropDown
                                    data={[]}
                                    backgroundColor={COLORS.white}
                                    borderWidth={1}
                                    marginTop={10}
                                    title=""
                                    borderRadius={4}
                                    borderColor={COLORS.icBottomBox}
                                    showSearch={false}
                                    maxHeight={200}
                                    onChange={async val => {}}
                                />
                            </View>
                        </ScrollView>
                        <View style={styles.btnConatiner}>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    setModalVisible(false);
                                }}>
                                <Text style={styles.btnStyle}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelConatiner}
                                onPress={() => {
                                    handleSubmitBtnPress();
                                }}>
                                <Text style={styles.btnStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    filterBox: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    addBtn: {
        backgroundColor: COLORS.apptheme,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 50,
        marginTop: 3,
    },
    addBtnText: {
        color: COLORS.white,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 15,
    },
    recordConatiner: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        margin: 5,

        // ✅ Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

        // ✅ Elevation for Android
        elevation: 4,
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 4,
    },
    iconlist: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    lastBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headertext: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
        paddingBottom: 12,
        color: '#000',
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
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
    },
    inputContainer: {
        paddingVertical: 7,
    },
    inputBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 3,
        borderColor: COLORS.icBottomBox,
        marginTop: 10,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    rquired: {
        color: COLORS.ERROR,
    },
    inputText: {
        color: '#000',
        fontFamily: 'OpenSans-Regular',
    },
    errorStyle: {
        color: COLORS.ERROR,
        marginBottom: -5,
    },
    modalContainer: {
        width: '90%',
        backgroundColor: COLORS.white,
        borderRadius: 3,
        height: '30%',
    },
    filterList: {
        width: '40%',
    },
    searchBox: {
        marginTop: 8,
        width: '58%',
    },
});

export default SamplingPlan;
