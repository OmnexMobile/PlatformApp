import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';
import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';

const ContainmentActionsForm = ({ listData = [], type = '' }) => {
    const [masterData, setMasterData] = useState([]);
    useEffect(() => {
        if (listData?.length) {
            setMasterData(listData);
        }
    }, [listData]);
    const handleInputChage = (val, id) => {
        const updatedData = masterData?.map(item => (item?.id === id ? { ...item, editvalue: val } : item));
        setMasterData(updatedData)
    };
    const renderItem = ({ item, index }) => {
        let tolleranceValue = item?.finalValue + item?.diffValue;
        const renderBackGroundColor = (value, fValue, type) => {
            if (value === '') {
                return COLORS.inputBG;
            }
            if (type === 'number') {
                return value >= fValue && value <= tolleranceValue ? COLORS.SUCCESS : COLORS.ERROR;
            }
            return value?.toLowerCase() === 'ok' ? COLORS.SUCCESS : COLORS.ERROR;
        };
        return (
            <View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Sample No" value="1" editable={false} />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader
                            title="Actual Value"
                            value={item.actualValue}
                            editable={false}
                            backgroundColor={renderBackGroundColor(item.actualValue, item.finalValue, type)}
                            color="#fff"
                        />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="No" value={item.count} editable={false} />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader
                            backgroundColor={renderBackGroundColor(item.editvalue, item.finalValue, type)}
                            value={item.editvalue}
                            title="Value"
                            onChangeText={val => {
                                handleInputChage(val,item.id);
                            }}
                            color="#fff"
                        />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader
                            padding={5}
                            multiline={true}
                            title="Comments"
                            height={80}
                            value=""
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>
                <ButtonComponent style={{ height: 40, marginBottom: 10 }} onPress={() => {}}>
                    Submit
                </ButtonComponent>
            </View>
        );
    };
    return (
        <View style={[styles.container]}>
            <FlatList data={masterData} renderItem={renderItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} />
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
    mainBox: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    subBox: {
        flex: 1,
        marginHorizontal: 5,
    },
});
export default ContainmentActionsForm;
