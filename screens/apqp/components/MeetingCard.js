import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from 'components/icon-component';
import TextComponent from 'components/text';

const MeetingCard = ({ item = {}, handleClickCard }) => {
    console.log('item in list card logo apqp', item);
    const { theme } = useTheme();
    const themedStyles = dynamicStyles(theme);
    const elevation = getElevation();
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
        <View style={styles.listContainer}>
        {/* {item?.Description || item?.TaskDescription ? ( */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleClickCard?.(item)}
                style={[
                    styles.cardContainer,
                    elevation,
                ]}>
                <View style={styles.cardOuterView}>
                    <View style={styles.projectBoxContent}>
                        {item?.Actions ? ( <View style={styles.fullWidthRow}>
                            <TextComponent style={styles.primaryLabelText}  type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                Action : <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={themedStyles.actionPrimaryValueText}>
                                    {item.Actions}
                                </TextComponent>
                            </TextComponent>
                        </View>) : null}
                        {item?.ActionType ? ( <View style={styles.fullWidthRow}>
                            <TextComponent style={styles.primaryLabelText}  type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                Action Type : <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} style={styles.secondaryValueText}>
                                {item.ActionType}
                            </TextComponent>
                            </TextComponent>
                        </View>) : null}
                        {item?.Site ? (<TextComponent style={styles.primaryRowText}   type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} numberOfLines={1}>
                            Site : <TextComponent fontSize={FONT_SIZE.SMALL} style={styles.secondaryValueText}>{item?.Site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.Description ? (<TextComponent style={styles.primaryRowText}   type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} numberOfLines={1}>
                            Description : <TextComponent fontSize={FONT_SIZE.SMALL} style={styles.secondaryValueText}>{item?.Description}</TextComponent>
                        </TextComponent>) : null}
                        {item?.ActionCreatedDate ? (<View style={styles.dateRow}>
                            <View style={styles.dateIconWrapper}>
                                <View
                                    style={styles.dateIconBox}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.X_SMALL} />
                                </View>
                            </View>
                            <View style={styles.dateValueWrapper}>
                                <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}  style={styles.primaryLabelText}>
                                    {changeDateFormatCard(item.ActionCreatedDate)} -{" "}
                                    {changeDateFormatCard(item.DueDate)}
                                </TextComponent>
                            </View>
                        </View>
                        ) : null}
                        {item?.Status ? (<TextComponent style={styles.primaryRowText} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}  numberOfLines={1}>
                            Status : <TextComponent fontSize={FONT_SIZE.SMALL} style={styles.secondaryValueText}>{item?.Status}</TextComponent>
                        </TextComponent>) : null}
                        {item?.DueByDays ? (<TextComponent style={styles.primaryRowText} type={FONT_TYPE.BOLD}   fontSize={FONT_SIZE.SMALL}   numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}
                            style={
                                item.DueByDays > 0
                                ? themedStyles.dueByPositiveText
                                : styles.dueByNegativeText
                            }
                            >{item?.DueByDays}</TextComponent>
                        </TextComponent>) : null}
                    </View>
                </View>
            </TouchableOpacity>
         {/* ) : null} */}
        </View>
    );
};

export default MeetingCard;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: SPACING.MEDIUM,
    },
    cardContainer: {
        padding: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
        marginBottom: SPACING.SMALL,
        marginTop: SPACING.NORMAL,
        width: '100%',
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    projectBoxContent: {
        width: '100%',
    },
    fullWidthRow: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
    },
    primaryLabelText: {
        color: COLORS.black,
    },
    secondaryValueText: {
        color: COLORS.black,
    },
    primaryRowText: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
        color: COLORS.black,
    },
    dateRow: {
        flexDirection: 'row',
        paddingBottom: SPACING.SMALL,
    },
    dateIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIconBox: {
        width: RFPercentage(2.5),
        height: RFPercentage(2.5),
        backgroundColor: COLORS.WARNING,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SPACING.X_SMALL,
        marginRight: SPACING.X_SMALL,
    },
    dateValueWrapper: {
        width: '100%',
    },
    dueByNegativeText: {
        fontSize: FONT_SIZE.SMALL,
        color: 'red',
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

const dynamicStyles = (theme) =>
    StyleSheet.create({
        actionPrimaryValueText: {
            color: theme.colors.primaryThemeColor,
        },
        dueByPositiveText: {
            fontSize: FONT_SIZE.SMALL,
            color: theme.colors.primaryThemeColor,
        },
    });
