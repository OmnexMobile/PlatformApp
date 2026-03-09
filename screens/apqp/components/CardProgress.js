import React from "react";
import { StyleSheet, View } from "react-native";
import TextComponent from "components/text";
import Fonts from "constants/Fonts";
import Moment from "moment";


const CardProgress = ({ item = {}, ProjectName, TaskName, StartDate, EndDate, completedPercent = 0, updatesCount = 0 }) => {
    console.log("item in list card logo apqp", item);
    const changeDateFormatCard = (inDate) => {
        if (inDate) {
            var DefaultFormatL = "MM/DD/YYYY";
            var sDateArr = inDate.split("T");
            var sDateValArr = sDateArr[0].split("-");
            var outDate = new Date(
                sDateValArr[0],
                sDateValArr[1] - 1,
                sDateValArr[2]
            );
            // console.log('outDate', outDate)

            return Moment(outDate).format(DefaultFormatL);
        }
    };

    return (
        <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionHeader}>
                <TextComponent style={styles.summaryDeliverableName}>
                    {ProjectName}
                </TextComponent>

                <TextComponent style={styles.summaryTitle} numberOfLines={2}>
                    {TaskName}
                </TextComponent>

                <TextComponent style={styles.summaryTitle} numberOfLines={2}>
                    {changeDateFormatCard(StartDate)} -{" "}
                    {changeDateFormatCard(EndDate)}
                </TextComponent>

                <View style={styles.summaryStatsRow}>
                    <View style={styles.summaryStatCard}>
                        <TextComponent style={styles.summaryStatLabel}>Completed</TextComponent>
                        <TextComponent style={styles.summaryStatValue}>
                            {completedPercent || "0"}%
                        </TextComponent>
                    </View>

                    <View style={[styles.summaryStatCard, styles.summaryStatCardLast]}>
                        <TextComponent style={styles.summaryStatLabel}>Updates</TextComponent>
                        <TextComponent style={styles.summaryStatValue}>{updatesCount || 0}</TextComponent>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CardProgress;

const styles = StyleSheet.create({
    sectionHeaderContainer: {
        paddingTop: 10,
        paddingHorizontal: '2%',
        width: "100%",
        // marginLeft: "4%",
    },
    sectionHeader: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#123C95",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: "#123C95",
    },
    summaryDeliverableName: {
        fontSize: 16,
        color: "#000",
        fontFamily: 'OpenSans-SemiBold',
        // fontWeight: "700",
        marginBottom: 2,
    },
    summaryTitle: {
        // fontWeight: "600",
        marginTop: 2,
        marginBottom: 4,
        fontSize: 16,
        color: '#5b5b5b',
        fontFamily: 'OpenSans-Regular',
    },
    summaryStatsRow: {
        marginTop: 12,
        flexDirection: "row",
    },
    summaryStatCard: {
        flex: 1,
        backgroundColor: "#F8FBFD",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E4EEF2",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    summaryStatCardLast: {
        marginRight: 0,
    },
    summaryStatLabel: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'OpenSans-SemiBold',
        marginBottom: 2,
    },
    summaryStatValue: {
        fontSize: 16,
        color: "#123C95",
        // fontWeight: "700",
        fontFamily: 'OpenSans-SemiBold',
    },
});
