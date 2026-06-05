import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import InputBoxWithHeader from '../InputBoxWithHeader';
import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import { showMessage } from 'react-native-flash-message';

const ContainmentActionsForm = ({ type = '', masterData, handleSubmit = () => {}, inspectionType = '' }) => {
    const [pageData, setPageData] = useState({});
    const inputRefs = useRef({});
    useEffect(() => {
        setPageData(masterData);
    }, [masterData]);
    const handleInputChage = (val, id, key) => {
        const updatedData = pageData?.map(item => (item?.id === id ? { ...item, [key]: val } : item));
        setPageData(updatedData);
    };
    const getBackColor = (value, type, item) => {
        if (value === '') {
            return COLORS.white;
        }
        if (type === 'number') {
            let lowValue = inspectionType == 2 ? Number(item?.tolerance) - Number(item?.lowValue) : item?.lowValue;
            let highValue = inspectionType == 2 ? Number(item?.tolerance) + Number(item?.highValue) : item?.highValue;
            return Number(value) >= Number(lowValue) && Number(value) <= Number(highValue) ? '#00FF00' : '#FF0100';
        }
        return value.toLowerCase() === 'ok' ? '#00FF00' : '#FF0100';
    };

    const handleSubmitPress = value => {
        if (value.ContainmentValue !== '') {
            const temp = JSON.parse(JSON.stringify(pageData));
            if (value.id === 1 || value.id === 2) {
                temp[0] = {
                    ...temp[0],
                    showBtn: false,
                    isEditable: false,
                    actualValue: value?.ContainmentValue,
                    isCommentsEditable: false,
                    BackColorForContainment: value.id == 1 ? getBackColor(value?.ContainmentValue, type, value) : temp[0].BackColorForContainment,
                };

                temp[1] = {
                    ...temp[1],
                    showBtn: true,
                    isEditable: true,
                    actualValue: value?.ContainmentValue,
                    isCommentsEditable: true,
                    BackColorForContainment: value.id == 2 ? getBackColor(value?.ContainmentValue, type, value) : temp[1].BackColorForContainment,
                };
            }
            setPageData([...temp]);
            handleSubmit(temp, value?.ContainmentValue, value.id);
        } else {
            showMessage({
                message: 'Please Enter Containment Value',
                backgroundColor: COLORS.ERROR,
                color: COLORS.white,
                duration: 1500,
                statusBarHeight: 40,
                icon: 'warning',
                position: 'right',
                 style: { height: 150, alignItems: 'flex-end' },
            });
        }
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
                        <Text style={[styles.headerText]}>Value</Text>
                        <TextInput
                            ref={ref => {
                                inputRefs.current[item?.id] = ref;
                            }}
                            style={[
                                styles.inputBox,
                                {
                                    height: 40,
                                    padding: 0,
                                    backgroundColor: renderBackGroundColor(item.ContainmentValue, type),
                                    color: '#fff',
                                },
                            ]}
                            onChangeText={val => {
                                let cleaned = val;
                                if (type === 'number') {
                                    cleaned = val
                                        .replace(/[^0-9.-]/g, '') // Remove invalid characters
                                        .replace(/(?!^)-/g, '') // Remove all '-' except at the start
                                        .replace(/(\..*)\./g, '$1'); // Allow only the first dot

                                    // 2. Allow only one dot
                                    const parts = cleaned.split('.');
                                    if (parts.length > 2) {
                                        cleaned = parts[0] + '.' + parts[1]; // keep only first two parts
                                    }
                                    // Optional: prevent starting with a dot (e.g., ".5" => "0.5")
                                    if (cleaned.startsWith('.')) {
                                        cleaned = '0' + cleaned;
                                    }
                                } else {
                                    // 1. Remove leading spaces
                                    cleaned = val.replace(/^\s+/, '');

                                    // 2. Remove all characters except letters and spaces
                                    cleaned = cleaned.replace(/[^a-zA-Z\s]/g, '');
                                }
                                handleInputChage(cleaned, item?.id, 'ContainmentValue');
                            }}
                            value={item.ContainmentValue}
                            editable={item?.isEditable}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical={'center'}
                            onFocus={() => handleInputBlur(item?.id)}
                            onSubmitEditing={() => {
                                inputRefs.current[item?.id]?.blur();
                            }}
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
                            value={item.ContainmentComment}
                            numberOfLines={4}
                            textAlignVertical="top"
                            onChangeText={val => {
                                handleInputChage(val, item.id, 'ContainmentComment');
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
            <FlatList data={pageData} renderItem={renderItem} keyExtractor={(item, index) => index + 1} showsVerticalScrollIndicator={false} />
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
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color: COLORS.headerText,
    },
    inputBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        borderColor: COLORS.inputBorder,
        padding: 0,
        paddingHorizontal: 10,
        marginTop: 8,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
    },
});
export default ContainmentActionsForm;
