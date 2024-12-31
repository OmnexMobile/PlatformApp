import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import TextComponent from '../../../components/text';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocProActionView from './DocProActionView';
import ApproveRequest from './RequestReply/ApproveRequest';
const DATE_FORMAT = {
    MM_DD_YYYY: 'MM/DD/YYYY',
};

const DocproList = ({ pendingList, setpendingListStatus, ListStatus }) => {
    const placeholderCount = 5;
    console.log('check pendinglist_-------', pendingList);
    console.log('check ListStatus-------', ListStatus);

    const [isLoading, setIsLoading] = useState(true);
    const [isActionDetailsOn, setisActionDetailsOn] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading for 3 seconds
        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);

    const Placeholder = () => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View>
                    <View style={styles.placeholderBox} />
                    <View style={styles.placeholderBox} />
                    <View style={styles.placeholderBox} />
                    <View style={styles.placeholderBox} />
                </View>
                <View style={styles.rightSection}>
                    <View style={styles.placeholderBoxSmall} />
                    <View style={styles.placeholderStatus} />
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }) => {
        // const [title1, title2, title3] = item.split('-');
        console.log('iteeeeemmmmm-----', item);
        if (isLoading) {
            return <Placeholder />;
        }
        console.log('reqdate:', item?.reqdate);
        console.log('revdate:', item?.revdate);
        const formattedDate = moment(item?.revdate, 'MM/DD/YYYY').format(DATE_FORMAT.MM_DD_YYYY);

        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.leftSection}>
                        <View style={styles.row}>
                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD} style={styles.label}>
                                Doc Num :{' '}
                            </TextComponent>

                            <TextComponent fontSize={FONT_SIZE.NORMAL} numberOfLines={1} type={FONT_TYPE.BOLD} style={{ width: 140 }}>
                                {item.number}
                            </TextComponent>
                        </View>
                        <View style={styles.row}>
                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD} style={styles.label}>
                                Doc Name :{' '}
                            </TextComponent>

                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD} numberOfLines={1} style={{ width: 200 }}>
                                {item.name}
                            </TextComponent>
                        </View>
                        <View style={styles.row}>
                            <TextComponent style={styles.label} fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                                Revision :
                            </TextComponent>

                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                                {item.rev}
                            </TextComponent>
                        </View>
                        {ListStatus == 'RequestsNeedingApproval' ? (
                            <View style={styles.row}>
                                <TextComponent style={styles.label} fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                                    Keyword :
                                </TextComponent>

                                <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                                    {item.keyword}
                                </TextComponent>
                            </View>
                        ) : null}

                        <View style={styles.row}>
                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD} style={styles.label}>
                                Site :{' '}
                            </TextComponent>
                            <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD} style={{ width: 140 }}>
                                {item.sitename}
                            </TextComponent>
                        </View>
                    </View>
                    <View style={styles.rightSection}>
                        {/* <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                            
                            {moment(item?.revdate).format(DATE_FORMAT.MM_DD_YYYY) || 'No Date Provided'}
                            // {/* {formattedDate !== 'Invalid date' ? formattedDate : 'Invalid Date'} */}
                        {/* </TextComponent> */}
                        <TextComponent fontSize={FONT_SIZE.NORMAL} type={FONT_TYPE.BOLD}>
                            {(() => {
                                if (ListStatus == 'PendingDocumentDrafts' && item?.reqdate) {
                                    return moment(item?.reqdate).format(DATE_FORMAT.MM_DD_YYYY);
                                } else if (ListStatus == 'PendingRequestList' && item?.reqdate) {
                                    return moment(item?.reqdate).format(DATE_FORMAT.MM_DD_YYYY);
                                } else if (ListStatus == 'RequestsNeedingApproval' && item?.indate) {
                                    return moment(item?.reqdate).format(DATE_FORMAT.MM_DD_YYYY);
                                } else if (ListStatus == 'DrafRequestsNeedingViewing' && item?.reqdate) {
                                    return moment(item?.reqdate).format(DATE_FORMAT.MM_DD_YYYY);
                                } else {
                                    return 'No Date Provided';
                                }
                            })()}
                        </TextComponent>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                setisActionDetailsOn(true);
                            }}>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isActionDetailsOn ? (
                <>
                    {ListStatus == 'RequestsNeedingApproval' ? (
                        <ApproveRequest
                            setisActionDetailsOn={setisActionDetailsOn}
                            setpendingListStatus={setpendingListStatus}
                            ListStatus={ListStatus}
                        />
                    ) : (
                        <View style={{ flex: 1 }}>
                            <DocProActionView
                                setisActionDetailsOn={setisActionDetailsOn}
                                setpendingListStatus={setpendingListStatus}
                                ListStatus={ListStatus}
                            />
                        </View>
                    )}
                </>
            ) : (
                <>
                    <View style={{ marginTop: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setpendingListStatus(false);
                            }}>
                            <Icon name="home" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
                        </TouchableOpacity>

                        <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>
                        <TextComponent
                            type={FONT_TYPE.BOLD}
                            color={COLORS.black}
                            fontSize={FONT_SIZE.LARGE}
                            numberOfLines={1}
                            style={{ marginLeft: 10 }}>
                            ActionList
                        </TextComponent>
                    </View>
                    <FlatList
                        data={isLoading ? Array(placeholderCount).fill(null) : pendingList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: '#edf2f6',
        borderRadius: 10,
        paddingVertical: 20, // Increased padding for vertical space
        paddingHorizontal: 15, // Left-right padding
        marginVertical: 10, // Space between cards
        elevation: 5,
        // shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        width: '96%',
        alignSelf: 'center',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftSection: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5, // Space between each text row
    },
    label: {
        width: 120,
    },
    value: {
        fontSize: 14,
        color: '#333',
    },
    rightSection: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    statusContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginTop: 10,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    placeholderBox: {
        width: 180,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginBottom: 8,
        borderRadius: 4,
    },
    placeholderBoxSmall: {
        width: 100,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginBottom: 8,
        borderRadius: 4,
    },
    placeholderStatus: {
        width: 120,
        height: 30,
        backgroundColor: '#e0e0e0',
        marginTop: 10,
        borderRadius: 20,
    },
});

export default DocproList;
