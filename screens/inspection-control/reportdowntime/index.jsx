import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import NoDataFound from '../Components/NoDataFound';
import IcSkeleton from '../Components/IcSkeleton';
import { PLACEHOLDERS } from 'constants/app-constant';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAPICall } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { useSelector } from 'react-redux';

const ReportDowntime = () => {
    const { icUserData } = useSelector(state => state.inspection);
    const [refreshing, setRefreshing] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(true);
    useEffect(() => {
        if (icUserData?.userData?.UserId) {
            handleGetReportData();
        }
    }, [icUserData]);
    const handleGetReportData = async () => {
        setShowSkeleton(true);
        const data = await getAPICall(`${ApiUrl.IC_REPORT_DOWNTIME_LIST}?userId=${icUserData.userData.UserId}&siteId=${icUserData.userData.Siteid}`);
        console.log('Report Downtime Data:', data);
        if (data?.success == true) {
            setReportData(data?.reportDowntime || []);
        }
        // Simulating API call to fetch report data
        // In a real application, you would make an API request here
        setShowSkeleton(false);
        return null;
    };
    useEffect(() => {
        handleGetReportData();
    }, []);
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const onRefresh= async()=>{
        setRefreshing(true);
        await handleGetReportData();
        setRefreshing(false);
    }
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.typeOfInspection) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.productionItemName}</Text>
                    <Text style={[styles.operationText]}>
                        Operation Name : <Text style={[styles.secondText]}>{item?.operationName}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Lot Number : <Text style={[styles.secondText]}>{item?.lotNumber}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Downtime Reason : <Text style={[styles.secondText]}>{item?.downtimeReason}</Text>
                    </Text>
                    <Text style={[styles.operationText]}>
                        Comment : <Text style={[styles.secondText]}>{item?.comment}</Text>
                    </Text>
                </View>
            </View>
        );
    };
    return (
        <CustomHeader title="Report Downtime" activeTabId={6} showIcons={false}>
            {showSkeleton ? (
                <IcSkeleton type={PLACEHOLDERS.INSPECTION_CARD} />
            ) : Boolean(reportData?.length) ? (
                <FlatList
                    data={reportData}
                    renderItem={renderData}
                    keyExtractor={(item, index) => index + 1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            ) : (
                <NoDataFound />
            )}
        </CustomHeader>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.icBackground,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contentContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    recordConatiner: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.icborder,
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
});
export default ReportDowntime;
