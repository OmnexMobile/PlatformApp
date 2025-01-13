import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';

const GeneralInfo = () => {
    return (
        <View style={[styles.container]}>
            <ScrollView style={[styles.overallBox]} showsVerticalScrollIndicator={false}>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Supplier Name" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Part Name" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Inspected Date" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title=" " />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Lot Quantity" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Approver" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Supplier Code" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Part Number" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Shift" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Invoice No." />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Inspector" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Quality Level State" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="GRN Date" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Invoice Date" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Lot No" />
                    </View>
                    <View style={[styles.subBox]}>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    overallBox: {
        flex: 1,
    },
    mainBox:{
        flex:1,
        flexDirection:'row',
        marginBottom:10,
    },
    subBox:{
        flex:1,
        marginHorizontal:5
    }
});
export default GeneralInfo;
