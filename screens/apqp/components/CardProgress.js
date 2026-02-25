import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE } from 'constants/app-constant';
import { getElevation } from 'helpers/utils';
import TextComponent from 'components/text';
import Moment from "moment";

const CardProgress = ({ item = {}, ProjectName, TaskName, StartDate, EndDate }) => {
    console.log('item in list card logo apqp', item);
    const elevation = getElevation();

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

        return Moment (outDate).format(DefaultFormatL);
    }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                // onPress={() => handleClickCard?.(item)}
                style={[
                    styles.cardTouchable,
                    elevation,
                ]}>
                <View style={styles.cardOuterView}>
                    <View style={styles.projectBoxContent}>
                        {ProjectName ? (
                            <View style={styles.rowSectionSmallGap}>
                                <TextComponent style={styles.labelText} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} numberOfLines={1}>
                                   Project Name :  <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={styles.valueText}>
                                        {ProjectName}
                                    </TextComponent>
                                </TextComponent>
                            </View>
                        ) : null}
                        {TaskName ? (
                            <View style={styles.rowSectionSmallGap}>
                                <TextComponent style={styles.labelText} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} numberOfLines={1}>
                                   Task Name :  <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={styles.valueText}>
                                        {TaskName}
                                    </TextComponent>
                                </TextComponent>
                            </View>
                        ) : null}
                        {StartDate ? (
                            <View style={styles.rowSection}>
                                <TextComponent style={styles.labelText} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} numberOfLines={1}>
                                   Period : <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={styles.valueText}>
                                        {changeDateFormatCard(StartDate)} -{" "}
                                        {changeDateFormatCard(EndDate)}
                                    </TextComponent>
                                </TextComponent>
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        {/* //  ) : null} */}
        </View>
    );
};

export default CardProgress;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.X_SMALL,
    },
    cardTouchable: {
        padding: SPACING.SMALL,
        borderRadius: SPACING.SMALL,
        marginBottom: 0,
        marginTop: SPACING.SMALL,
        width: '93%',
        borderColor: '#1FBFD0',
        borderWidth: 1,
        borderLeftWidth: 4,
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    projectBoxContent: {
        flexDirection: 'column',
    },
    rowSectionSmallGap: {
        width: '100%',
        paddingBottom: SPACING.XX_SMALL,
    },
    rowSection: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
    },
    labelText: {
        paddingTop: SPACING.SMALL,
        paddingLeft: SPACING.X_SMALL,
        color: COLORS.black,
    },
    valueText: {
        color: COLORS.black,
    },
    borderEnabled: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    detailsView: {
        flex: 3,
        borderLeftWidth: 4,
        paddingLeft: 8,
    },
    progressRound: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'lightgrey',
        borderWidth: 4,
    },
    floatingDiv: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    apqpTypeIcon: {
        width: 30,
        height: 17,
    },
});
