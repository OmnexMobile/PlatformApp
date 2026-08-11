import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import NoDataFound from '../Components/NoDataFound';
import IcSkeleton from '../Components/IcSkeleton';
import { PLACEHOLDERS } from 'constants/app-constant';
import { COLORS } from 'constants/theme-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const data = [
    {
        id: 1,
        productName: 'Product 1',
        operationName: 'Operation 1',
        lotNumber: 'Lot 1',
        downtimeReason: 'Reason 1',
        comment: 'Comment 1 note: This is a sample comment for Product 1. It can be quite long and may span multiple lines in the UI.',
        typeOfInspection: 1,
    },
    {
        id: 2,
        productName: 'Product 2',
        operationName: 'Operation 2',
        lotNumber: 'Lot 2',
        downtimeReason: 'Reason 2',
        comment: 'Comment 2 note: This is a sample comment for Product 2. It can be quite long and may span multiple lines in the UI.',
        typeOfInspection: 2,
    },
    {
        id: 3,
        productName: 'Product 3',
        operationName: 'Operation 3',
        lotNumber: 'Lot 3',
        downtimeReason: 'Reason 3',
        comment: 'Comment 3',
        typeOfInspection: 3,
    },
    {
        id: 4,
        productName: 'Product 4',
        operationName: 'Operation 4',
        lotNumber: 'Lot 4',
        downtimeReason: 'Reason 4',
        comment: 'Comment 4',
        typeOfInspection: 1,
    },
    {
        id: 5,
        productName: 'Product 5',
        operationName: 'Operation 5',
        lotNumber: 'Lot 5',
        downtimeReason: 'Reason 5',
        comment: 'Comment 5',
        typeOfInspection: 2,
    },
    {
        id: 6,
        productName: 'Product 6',
        operationName: 'Operation 6',
        lotNumber: 'Lot 6',
        downtimeReason: 'Reason 6',
        comment: 'Comment 6 note: This is a sample comment for Product 6. It can be quite long and may span multiple lines in the UI.',
        typeOfInspection: 3,
    },
    {
        id: 7,
        productName: 'Product 7',
        operationName: 'Operation 7',
        lotNumber: 'Lot 7',
        downtimeReason: 'Reason 7',
        comment: 'Comment 7',
        typeOfInspection: 1,
    },
    {
        id: 8,
        productName: 'Product 8',
        operationName: 'Operation 8',
        lotNumber: 'Lot 8',
        downtimeReason: 'Reason 8',
        comment: 'Comment 8',
        typeOfInspection: 2,
    },
    {
        id: 9,
        productName: 'Product 9',
        operationName: 'Operation 9',
        lotNumber: 'Lot 9',
        downtimeReason: 'Reason 9',
        comment: 'Comment 9',
        typeOfInspection: 3,
    },
    {
        id: 10,
        productName: 'Product 10',
        operationName: 'Operation 10',
        lotNumber: 'Lot 10',
        downtimeReason: 'Reason 10',
        comment: 'Comment 10',
        typeOfInspection: 1,
    },
];
const ReportDowntime = () => {
    const [reportData, setReportData] = useState([]);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const handleGetReportData = async () => {
        setShowSkeleton(true);

        // Simulating API call to fetch report data
        // In a real application, you would make an API request here
        setReportData(data);
        setShowSkeleton(false);
    };
    useEffect(() => {
        handleGetReportData();
        setReportData(data);
    }, []);
    const renderIconBgColor = value => {
        return value == '1' ? COLORS.apptheme : value == '2' ? COLORS.ipBgColor : COLORS.fiBgColor;
    };
    const renderData = ({ item }) => {
        return (
            <View style={[styles.recordConatiner]}>
                <View style={[styles.iconBox, { backgroundColor: renderIconBgColor(item?.typeOfInspection) }]}>
                    <Icon name="layers-outline" size={25} color={COLORS.white} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.cardText]}>{item?.productName}</Text>
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
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
