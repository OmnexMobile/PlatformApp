import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from 'components/icon-component';
import TextComponent from 'components/text';

const RiskCard = ({ item = {}, handleClickCard }) => {
    console.log('item in list card logo apqp', item);
    const { theme } = useTheme();
    const elevation = getElevation();
    const themedStyles = React.useMemo(
        () =>
            StyleSheet.create({
                actionTypeText: {
                    color: theme.colors.primaryThemeColor,
                    fontSize: 17,
                    fontFamily: 'OpenSans-SemiBold',
                },
                dateText: {
                    color: '#000',
                    fontSize: 15,
                    fontFamily: 'OpenSans-Regular',
                },
                siteText: {
                    color: '#000',
                    fontSize: 15,
                    fontFamily: 'OpenSans-Regular',
                },
                dueText: {
                    color: '#000',
                    fontSize: 15,
                    fontFamily: 'OpenSans-Regular',
                },
                dueByDaysValuePositive: {
                    color: theme.colors.primaryThemeColor,
                },
            }),
        [theme],
    );
    console.log('item apqp', item?.Description || item?.TaskDescription);

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
                onPress={() => handleClickCard?.(item)}
                style={[
                    styles.cardTouchable,
                    // elevation,
                ]}>
                <View style={styles.cardOuterView}>
                    <View style={styles.projectBoxContent}>
                        {item?.ActionType ? ( <View style={styles.actionTypeContainer}>
                            <TextComponent numberOfLines={1} style={themedStyles.actionTypeText}>
                                {item.ActionType == "" || item.ActionType == null
                                    ? " - "
                                    : item.ActionType.replace("&apos;", "'")}
                            </TextComponent>
                        </View>
                        ) : null}
                        {item?.ActionCreatedDate ? (<View style={styles.dateRow}>
                            <View style={styles.dateIconWrap}>
                                <View style={styles.calendarIconBox}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXX_SMALL} />
                                </View>
                            </View>
                            <View style={styles.dateTextWrap}>
                                <TextComponent numberOfLines={1} style={themedStyles.dateText}>
                                    {changeDateFormatCard(item.ActionCreatedDate)} -{" "}
                                    {changeDateFormatCard(item.DueDate)}
                                </TextComponent>
                            </View>
                        </View>
                        ) : null}
                        {item?.Site ? (<TextComponent style={styles.siteText} numberOfLines={1}>
                            <TextComponent style={themedStyles.siteText}>{item?.Site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.DueByDays ? (<TextComponent style={themedStyles.dueText} numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}
                            style={item.DueByDays > 0 ? styles.dueByDaysPositive : styles.dueByDaysNegative}
                            >{item?.DueByDays}</TextComponent>
                        </TextComponent>) : null}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default RiskCard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.NORMAL,
    },
    cardTouchable: {
        padding: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
        marginBottom: SPACING.X_SMALL,
        marginTop: SPACING.X_SMALL,
        width: '100%',
        borderLeftColor:'#123C95',
        borderColor:'#123C95',
        borderWidth: 0.5,
        borderLeftWidth: 4,
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    projectBoxContent: {
        flexDirection: 'column',
    },
    actionTypeContainer: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
    },
    dateRow: {
        flexDirection: 'row',
        paddingBottom: SPACING.SMALL,
    },
    dateIconWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIconBox: {
        width: RFPercentage(2),
        height: RFPercentage(2),
        backgroundColor: COLORS.WARNING,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SPACING.X_SMALL,
        marginRight: SPACING.X_SMALL,
    },
    dateTextWrap: {
        width: '100%',
    },
    dateText: {
        color: 'black',
    },
    siteText: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
    },
    dueByDaysPositive: {
        fontSize: 15,
        color: '#123C95',
        fontFamily: 'OpenSans-SemiBold',
    },
    dueByDaysNegative: {
        fontSize: 15,
        color: 'red',
        fontFamily: 'OpenSans-SemiBold',
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
