import { COLORS } from 'constants/theme-constants';
import { FlatList, KeyboardAvoidingView, Modal, Platform, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import IconM from 'react-native-vector-icons/MaterialIcons';
import SingleDropDown from '../SingleDropDown';
import FilterWithMenu from '../FilterWithMenu';
import { useState } from 'react';
import InputWithSearch from '../InputWithSearch';
const listData = [
    {
        id: 1,
        originalInspectionMode: 'Normal 1',
        switchInspectionMode: 'Reduce 1',
        totalLot: '10',
        rejectLot: '2',
    },
    {
        id: 2,
        originalInspectionMode: 'Normal 2',
        switchInspectionMode: 'Reduce 2',
        totalLot: '11',
        rejectLot: '3',
    },
    {
        id: 3,
        originalInspectionMode: 'Normal 3',
        switchInspectionMode: 'Reduce 3',
        totalLot: '12',
        rejectLot: '4',
    },
    {
        id: 4,
        originalInspectionMode: 'Normal 4',
        switchInspectionMode: 'Reduce 4',
        totalLot: '13',
        rejectLot: '5',
    },
    {
        id: 5,
        originalInspectionMode: 'Normal 5',
        switchInspectionMode: 'Reduce 5',
        totalLot: '14',
        rejectLot: '6',
    },
    {
        id: 6,
        originalInspectionMode: 'Normal 6',
        switchInspectionMode: 'Reduce 6',
        totalLot: '15',
        rejectLot: '7',
    },
    {
        id: 7,
        originalInspectionMode: 'Normal 7',
        switchInspectionMode: 'Reduce 7',
        totalLot: '16',
        rejectLot: '8',
    },
    {
        id: 8,
        originalInspectionMode: 'Normal 8',
        switchInspectionMode: 'Reduce 8',
        totalLot: '17',
        rejectLot: '9',
    },
];
const searchFilterList = [
    {
        id: 1,
        title: 'Original Inspection Mode',
        label: 'Original Inspection Mode',
        value: 'Original Inspection Mode',
    },
    {
        id: 2,
        label: 'Switch Inspection Mode',
        title: 'Switch Inspection Mode',
        value: 'Switch Inspection Mode',
    },
    {
        id: 3,
        label: 'Total Lot',
        title: 'Total Lot',
        value: 'Total Lot',
    },
    {
        id: 4,
        label: 'Reject Lot',
        title: 'Reject Lot',
        value: 'Reject Lot',
    },
];
const SwitchInspection = ({ modalVisible, setModalVisible = () => {} }) => {
    const [searchFilter, setSearchFilter] = useState(searchFilterList);

    const handleSubmitBtnPress = () => {};
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.operationText]}>
                        Original Inspection Mode : <Text style={[styles.secondText]}>{item?.originalInspectionMode}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Switch Inspection Mode : <Text style={[styles.secondText]}>{item.switchInspectionMode}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Total Lot : <Text style={[styles.secondText]}>{item?.totalLot}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Reject Lot : <Text style={[styles.secondText]}>{item?.rejectLot}</Text>
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
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginHorizontal:5 }}>
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
                                onChange={val => {}}
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
                            height: 450,
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
                                    <Text style={styles.inputText}>
                                        Original Inspection Mode <Text style={[styles.rquired]}>*</Text>
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
                                        Switch Inspection Mode <Text style={[styles.rquired]}>*</Text>
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
                                <Text style={styles.inputText}>
                                    Total Lot <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <TextInput value={''} style={styles.inputBox} onChangeText={val => {}} />
                            </View>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.inputText}>
                                    Reject Lot <Text style={[styles.rquired]}>*</Text>
                                </Text>
                                <TextInput value={''} style={styles.inputBox} onChangeText={val => {}} />
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
export default SwitchInspection;
