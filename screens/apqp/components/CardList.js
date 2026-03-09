import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import IconComponent from 'components/icon-component';
import TextComponent from 'components/text';

const CardList = ({ item = {}, handleClickCard }) => {
    console.log('item in list card logo apqp', item);
    const { timeSettings } = useAppContext();
    const { theme } = useTheme();
    const themedStyles = React.useMemo(
        () =>
            StyleSheet.create({
                descriptionText: {
                    color: theme.colors.primaryThemeColor,
                    fontSize: 16,
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
                    paddingTop: SPACING.SMALL,
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

    return (
        <View style={styles.container}>
        {item?.Description || item?.TaskDescription ? (
            <View style={styles.cardRow}>
                <View style={styles.iconSlot}>
                    <IconComponent
                        name="arrow-right"
                        type={ICON_TYPE.Feather}
                        size={FONT_SIZE.X_LARGE}
                        // color="#1FBFD0"
                        color='#123C95'
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleClickCard?.(item)}
                    style={styles.cardTouchable}>
                    <View style={styles.cardOuterView}>
                        <View style={styles.projectBoxContent}>
                        {item?.Description ? (
                            <View style={styles.descriptionContainer}>
                                <TextComponent numberOfLines={1} style={themedStyles.descriptionText}>
                                    {item?.Description}
                                 </TextComponent>
                            </View>
                        ) : null}
                        <View style={styles.dateRow}>
                            <View style={styles.dateInnerRow}>
                                <View style={styles.calendarIconBox}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXX_SMALL} />
                                </View>
                                <TextComponent style={themedStyles.dateText} >
                                    {moment(item?.StartDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} -{' '}
                                </TextComponent>
                            </View>
                            <View style={styles.dateInnerRow}>
                                <TextComponent style={themedStyles.dateText}>
                                    
                                    {moment(item?.DueDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])}
                                </TextComponent>
                            </View>
                        </View>
                        {item?.site ? (<TextComponent numberOfLines={1}>
                            <TextComponent style={themedStyles.siteText}>{item?.site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.DueByDays ? (<TextComponent fontSize={FONT_SIZE.SMALL} style={themedStyles.dueText} numberOfLines={1}>
                            Due by days: <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}
                            style={item.DueByDays > 0 ? [styles.dueByDaysValueBase, themedStyles.dueByDaysValuePositive] : styles.dueByDaysValueOverdue}
                            >{item?.DueByDays ? item?.DueByDays : 0}</TextComponent>
                        </TextComponent>) : null}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
         ) : null}
        </View>
    );
};

export default CardList;

const styles = StyleSheet.create({
    container: {
        width: '98%',
        alignSelf: 'center',
        paddingHorizontal: SPACING.NORMAL,
    },
    cardRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '2%',
    },
    cardTouchable: {
        padding: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
        width: '88%',
        borderLeftWidth: 4,
        // borderLeftColor: '#1FBFD0',
        // borderColor: '#1FBFD0',
        borderLeftColor:'#123C95',
        borderColor:'#123C95',
        borderWidth: 0.5,
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    descriptionContainer: {
        width: '100%',
        paddingBottom: SPACING.SMALL,
    },
    dateRow: {
        flexDirection: 'row',
        paddingBottom: SPACING.SMALL,
    },
    dateInnerRow: {
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
    dueByDaysText: {
        paddingTop: SPACING.SMALL,
    },
    dueByDaysValueBase: {
        fontSize: FONT_SIZE.X_SMALL,
        color: 'red',
    },
    dueByDaysValueOverdue: {
        fontSize: FONT_SIZE.X_SMALL,
        color: 'red',
    },
    iconSlot: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectBoxContent: {
        flexDirection: 'column',
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
