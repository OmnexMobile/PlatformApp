import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';
import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';

const ContainmentActionsForm = ({ type = '', masterData, handleSubmit = () => {}, inspectionType = '' }) => {
    const [pageData, setPageData] = useState({});
    useEffect(() => {
        setPageData(masterData);
    }, [masterData]);
    const handleInputChage = (val, id, key) => {
        const updatedData = pageData?.map(item => (item?.id === id ? { ...item, [key]: val } : item));
        setPageData(updatedData);
    };

    const handleSubmitPress = value => {
        const temp = JSON.parse(JSON.stringify(pageData));

        if (value.id === 1 || value.id === 2) {
            temp[0] = {
                ...temp[0],
                showBtn: false,
                isEditable: false,
                actualValue: value?.value,
                isCommentsEditable: false,
            };

            temp[1] = {
                ...temp[1],
                showBtn: true,
                isEditable: true,
                actualValue: value?.value,
                isCommentsEditable: true,
            };
        }

        setPageData([...temp]);
        handleSubmit(temp, value?.value, value.id);
    };
    const handleInputBlur = id => {
        const updatedData = pageData.map(item => (item?.id === id ? { ...item, showBtn: true } : { ...item, showBtn: false }));
        setPageData(updatedData);
    };
    const renderItem = ({ item, index }) => {
        // let tolleranceValue = item?.finalValue + item?.diffValue;
        const renderBackGroundColor = (value, type) => {
            if (value === '') {
                return COLORS.inputBG;
            }
            // if (type === 'number') {
            //     return Number(value) >= Number(item.lowValue) && Number(value) <= Number(item.highValue) ? COLORS.SUCCESS : COLORS.ERROR;
            // }
            // return value?.toLowerCase() === 'ok' ? COLORS.SUCCESS : COLORS.ERROR;

            if (type === 'number') {
                let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
                let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
                return Number(value) >= Number(lowValue) && Number(value) <= Number(highValue) ? COLORS.SUCCESS : COLORS.ERROR;
            }
            return value.toLowerCase() === 'ok' ? COLORS.SUCCESS : COLORS.ERROR;
        };
        return (
            <View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="Sample No" value={`${item?.count}`} editable={false} />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader
                            title="Actual Value"
                            value={item.actualValue}
                            editable={false}
                            backgroundColor={renderBackGroundColor(item.actualValue, type)}
                            color="#fff"
                        />
                    </View>
                </View>
                <View style={[styles.mainBox]}>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader title="No" value={`${index + 1}`} editable={false} />
                    </View>
                    <View style={[styles.subBox]}>
                        <InputBoxWithHeader
                            backgroundColor={renderBackGroundColor(item.value, type)}
                            value={item.value}
                            title="Value"
                            onChangeText={val => {
                                handleInputChage(val, item?.id, 'value');
                            }}
                            color="#fff"
                            onFocus={() => handleInputBlur(item?.id)}
                            editable={item?.isEditable}
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
                            value={item.comments}
                            numberOfLines={4}
                            textAlignVertical="top"
                            onChangeText={val => {
                                handleInputChage(val, item.id, 'comments');
                            }}
                            editable={item?.isCommentsEditable}
                        />
                    </View>
                </View>
                {Boolean(item?.showBtn) && (
                    <ButtonComponent
                        textStyle={{ fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}
                        style={{ height: 40, marginBottom: 10 }}
                        onPress={() => {
                            handleSubmitPress(item);
                        }}>
                        Submit
                    </ButtonComponent>
                )}
            </View>
        );
    };
    return (
        <View style={[styles.container]}>
            <FlatList data={pageData} renderItem={renderItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} />
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
