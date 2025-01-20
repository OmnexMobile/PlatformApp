import React, { useState } from 'react';
import CustomHeader from '../Components/CustomHeader';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from 'constants/theme-constants';
import GeneralInfo from '../Components/inprocess-inspection/GeneralInfo';
import CharGenInfo from '../Components/inprocess-inspection/CharGenInfo';

const ContainmentActions = () => {
    const [showGeneral, setShowGeneral] = useState(false);
    const [showAction, setShowAction] = useState(true);
    const handleGenOpen = () => {
        setShowGeneral(!showGeneral);
        setShowAction(false)
    };
    const handleActionOpen=()=>{
        setShowAction(!showAction)
        setShowGeneral(false)
    }
    return (
        <CustomHeader title="Inprocess Inspection" activeTabId={2} showIcons={false}>
            <View style={[styles.conatiner]}>
                <View style={{ flex: showGeneral ? 1 : 0 }}>
                    <TouchableOpacity
                        style={[styles.tabStyle, { borderBottomLeftRadius: showGeneral ? 0 : 10, borderBottomRightRadius: showGeneral ? 0 : 10 }]}
                        onPress={() => {
                            handleGenOpen();
                        }}>
                        <Text style={[styles.headerText]}>General Info</Text>
                        <Icon name={showGeneral ? 'down' : 'right'} size={20} />
                    </TouchableOpacity>
                    {showGeneral && <View style={[styles.tabBox]}>
                        <CharGenInfo/>
                        </View>}
                </View>

                <View style={{ flex: showAction ? 1 : 0 ,marginTop:10}}>
                    <TouchableOpacity
                        style={[styles.tabStyle, { borderBottomLeftRadius: showAction ? 0 : 10, borderBottomRightRadius: showAction ? 0 : 10 }]}
                        onPress={() => {
                            handleActionOpen();
                        }}>
                        <Text style={[styles.headerText]}>Containment Actions</Text>
                        <Icon name={showAction ? 'down' : 'right'} size={20} />
                    </TouchableOpacity>
                    {showAction && <View style={[styles.tabBox]}></View>}
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
