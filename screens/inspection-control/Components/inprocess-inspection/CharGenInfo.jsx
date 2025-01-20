import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';

const CharGenInfo = () => {
    return (
        <View style={[styles.container]}>
            <ScrollView style={[styles.overallBox]} showsVerticalScrollIndicator={false}>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Operation" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Operation No" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Char. No" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Characteristics" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Specification" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Low" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="High" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Evaluation/Means..." />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Sample Size" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Result Of Product" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Engineer" />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Production Supervisor" />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="RFC. No." />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Evidence 1" />
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
export default CharGenInfo;
