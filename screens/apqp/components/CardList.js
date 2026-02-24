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
                        color="#1FBFD0"
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
                                <TextComponent numberOfLines={1} fontSize={FONT_SIZE.NORMAL} style={themedStyles.descriptionText}>
                                    {item?.Description}
                                 </TextComponent>
                            </View>
                        ) : null}
                        <View style={styles.dateRow}>
                            <View style={styles.dateInnerRow}>
                                <View style={styles.calendarIconBox}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.X_SMALL} />
                                </View>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    {moment(item?.StartDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} -{' '}
                                </TextComponent>
                            </View>
                            <View style={styles.dateInnerRow}>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    
                                    {moment(item?.DueDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])}
                                </TextComponent>
                            </View>
                        </View>
                        {item?.site ? (<TextComponent style={styles.siteText} numberOfLines={1}>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>{item?.site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.DueByDays ? (<TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} style={styles.dueByDaysText} numberOfLines={1}>
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
        paddingHorizontal: SPACING.NORMAL,
    },
    cardRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.X_NORMAL,
    },
    cardTouchable: {
        padding: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
        marginLeft: RFPercentage(0.7),
        width: '85%',
        borderLeftWidth: 4,
        borderLeftColor: '#1FBFD0',
        borderColor: '#1FBFD0',
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
        width: RFPercentage(2.5),
        height: RFPercentage(2.5),
        backgroundColor: COLORS.WARNING,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SPACING.X_SMALL,
        marginRight: SPACING.X_SMALL,
    },
    siteText: {
        paddingLeft: SPACING.X_SMALL,
    },
    dueByDaysText: {
        paddingTop: SPACING.SMALL,
        paddingLeft: SPACING.X_SMALL,
    },
    dueByDaysValueBase: {
        fontSize: FONT_SIZE.SMALL,
    },
    dueByDaysValueOverdue: {
        fontSize: FONT_SIZE.SMALL,
        color: 'red',
    },
    iconSlot: {
        width: '12%',
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
