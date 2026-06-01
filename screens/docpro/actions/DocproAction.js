import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, FlatList, Text, Alert, StatusBar, SafeAreaView } from 'react-native';
import CustomHeader from '../CustomHeader';
// import BottomView from './BottomView';
import { useNavigation } from '@react-navigation/native';
// import ActionListCount from '../ActionListCount';
import TextComponent from '../../../components/text';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import DocproListCard from '../DocproListCard';
import DocproList from './DocproList';
import PendingRequest from '../json/PendingRequest';
import PendingDocumetDrafts from '../json/PendingDocumetDrafts'
import DrafRequestsNeedingViewing from '../json/DrafRequestsNeedingViewing';
import PendingRecordRequest from '../json/PendingRecordRequest';
import RequestNeedingApproval from '../json/RequestNeedingApproval'
const DocproAction = () => {
    const navigation = useNavigation();
    const [pendingListStatus, setpendingListStatus] = useState(false);
    const [ListStatus, setListStatus] = useState(false);
    const [pendingList, setpendingList] = useState('');

    useEffect(() => {
        const PendingRequestList = PendingRequest.response.loaded.records.record;
        const PendingDraftList = PendingDocumetDrafts.response.loaded.drafts.draft;
        const RequestNeedingApprovalList = RequestNeedingApproval.response.loaded.requests.request
        const DrafRequestsNeedingViewingList = DrafRequestsNeedingViewing.response.loaded.drafts.draft;

        console.log(
            'DPLEVELLISTINNGDATA*******321321PendingRequestList',
            PendingRequestList,
            PendingDraftList,
            DrafRequestsNeedingViewingList,
            RequestNeedingApprovalList
        );

        if (ListStatus == 'PendingRequestList') {
            setpendingList(PendingRequestList);
        } else if (ListStatus == 'PendingDocumentDrafts') {
            setpendingList(PendingDraftList);
        } else if (ListStatus == 'RequestsNeedingApproval') {
            setpendingList(RequestNeedingApprovalList);
        } else if (ListStatus == 'DrafRequestsNeedingViewing') {
            setpendingList(DrafRequestsNeedingViewingList);
        } else if (ListStatus == '') {
            // setpendingList(PendingRequestList);
        } else if (ListStatus == '') {
            // setpendingList(PendingRequestList);
        }
    }, [ListStatus]);

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={'Actions'} />
            <StatusBar hidden={true} />
            {pendingListStatus == false ? (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setpendingListStatus(true);
                            setListStatus('PendingRequestList');
                        }}>
                        <Text style={styles.number}>5</Text>
                        <Text style={styles.label}>Pending Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setpendingListStatus(true);
                            setListStatus('PendingDocumentDrafts');
                        }}>
                        <Text style={styles.number}>2</Text>
                        <Text style={styles.label}>Pending Document Drafts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setpendingListStatus(true);
                            setListStatus('RequestsNeedingApproval');
                        }}>
                        <Text style={styles.number}>6</Text>
                        <Text style={styles.label}>Request Needing Approval</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setpendingListStatus(true);
                            setListStatus('DrafRequestsNeedingViewing');
                        }}>
                        <Text style={styles.number}>5</Text>
                        <Text style={styles.label}>Drafts Viewing</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <DocproList pendingList={pendingList} setpendingListStatus={setpendingListStatus} ListStatus={ListStatus} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#F4F8FC',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    number: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#059BE5',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    // container: {
    //     flex:1
    // },
    // item: {
    //     width: '45%', // Set each item to take half the screen width minus spacing
    //     backgroundColor: '#ffff',
    //     margin: 5,
    //     padding: 15,
    //     borderRadius: 8,
    //     alignItems: 'center',
    // },
    // title: {
    //     // fontSize: 16,
    //     // fontWeight: 'bold',
    //     marginBottom: 8,
    // },
    // count: {
    //     // fontSize: 14,
    //     // color: '#666',
    //     alignItems: 'center',
    //     alignContent: 'center',
    // },
    // gridContainer: {

    //     flexDirection: 'row',
    //     height: '18%',
    //     width: '100%',
    //     // backgroundColor: 'f2f2f2',
    //     alignSelf: 'center',
    //     marginTop: 20,
    //     justifyContent: 'space-around',
    //     // flex:1
    // },
});

export default DocproAction;
