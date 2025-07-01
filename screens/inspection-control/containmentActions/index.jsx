import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from 'constants/theme-constants';
import CharGenInfo from '../Components/inprocess-inspection/CharGenInfo';
import ContainmentActionsForm from '../Components/inprocess-inspection/ContainmentActionsForm';
import { useNavigation } from '@react-navigation/native';

const ContainmentActions = ({ route }) => {
    const navigation = useNavigation();
    const [showGeneral, setShowGeneral] = useState(false);
    const [showAction, setShowAction] = useState(true);
    const [masterData, setMasterData] = useState([]);
    const [genType, setGenType] = useState('');
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);
    useLayoutEffect(() => {
        if (route?.params?.selectedData?.ContainmentActions) {
            let temp = route?.params?.selectedData?.ContainmentActions.map((item, index) => {
                return {
                    ...item,
                    isEditable: index + 1 == 1 ? true : false,
                    isCommentsEditable: index + 1 == 1 ? true : false,
                    showBtn: index + 1 == 1 ? true : false,
                    actualValue: route?.params?.selectedData?.value,
                };
            });
            setMasterData(temp);
        } else {
            const { lowValue, highValue, value, count, tolerance } = route?.params?.selectedData;
            const temp = Array.from({ length: 2 }, (_, index) => ({
                count: count,
                highValue: highValue,
                id: index + 1,
                lowValue: lowValue,
                ContainmentValue: '',
                actualValue: value,
                tolerance: tolerance,
                ContainmentComment: '',
                isEditable: index + 1 == 1 ? true : false,
                isCommentsEditable: index + 1 == 1 ? true : false,
                showBtn: index + 1 == 1 ? true : false,
                ContainmentID: index + 1,
                ContainmentNumber: index + 1,
                Type: 'Value',
                BackColorForContainment: '',
                FontColorForContainment: '#FFFFFF',
            }));
            setMasterData(temp);
        }
        setGenType(route?.params?.type);
    }, [route?.params]);
    const handleGenOpen = () => {
        setShowGeneral(!showGeneral);
        setShowAction(false);
    };
    const handleActionOpen = () => {
        setShowAction(!showAction);
        setShowGeneral(false);
        // navigation.goBack();
    };
    const handleSubmit = (value, changedValue, id) => {
        setMasterData(value);
        if (route.params?.onSave) {
            let finalValue = { ...route?.params?.selectedData, value: changedValue, ContainmentActions: value };
            route.params.onSave(finalValue); // send data back
        }
        if (id == 2) {
            navigation.goBack();
        }
    };
    const renderHeader = value => {
        return value == '1' ? 'Receiving Inspection' : value == '2' ? 'Inprocess Inspection' : 'Final Inspection';
    };
    return (
        <CustomHeader title={renderHeader(route?.params?.inspectionType)} activeTabId={2} showIcons={false}>
            <View style={[styles.conatiner]}>
                {/* <View style={{ flex: showGeneral ? 1 : 0 }}>
                    <TouchableOpacity
                        style={[styles.tabStyle, { borderBottomLeftRadius: showGeneral ? 0 : 10, borderBottomRightRadius: showGeneral ? 0 : 10 }]}
                        onPress={() => {
                            handleGenOpen();
                        }}>
                        <Text style={[styles.headerText]}>General Info</Text>
                        <Icon name={showGeneral ? 'down' : 'right'} size={20} />
                    </TouchableOpacity>
                    {showGeneral && (
                        <View style={[styles.tabBox]}>
                            <CharGenInfo />
                        </View>
                    )}
                </View> */}
                <View style={{ flex: showAction ? 1 : 0, marginTop: 10 }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.tabStyle, { borderBottomLeftRadius: showAction ? 0 : 10, borderBottomRightRadius: showAction ? 0 : 10 }]}
                        onPress={() => {
                            // handleActionOpen();
                        }}>
                        <Text style={[styles.headerText]}>Containment Actions</Text>
                        {/* <Icon name={showAction ? 'down' : 'right'} size={20} /> */}
                    </TouchableOpacity>
                    <View style={[styles.tabBox]}>
                        <ContainmentActionsForm
                            type={genType}
                            masterData={masterData}
                            setMasterData={setMasterData}
                            handleSubmit={handleSubmit}
                            inspectionType={route?.params?.inspectionType}
                        />
                    </View>
                </View>
            </View>
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
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
    headerText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    tabBox: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 10,
    },
});
export default ContainmentActions;
