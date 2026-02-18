import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES, STATUS, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import IconComponent from 'components/icon-component';
import TextComponent from 'components/text';
import { IMAGES } from 'assets/images';
import ImageComponent from 'components/image-component';

const CardList = ({ item = {}, handleClickCard }) => {
    console.log('item in list card logo apqp', item);
    const { sites, handleRecentActivity, timeSettings } = useAppContext();
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();
    console.log('item apqp', item?.Description || item?.TaskDescription);

    return (
        <View style={{ paddingHorizontal: SPACING.MEDIUM }}>
        {item?.Description || item?.TaskDescription ? (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleClickCard?.(item)}
                style={[
                    {
                        padding: SPACING.NORMAL,
                        borderRadius: SPACING.SMALL,
                        marginBottom: SPACING.NORMAL,
                        marginTop: SPACING.X_SMALL,
                        // marginLeft: SPACING.SMALL,
                        width: '100%',
                    },
                    elevation,
                ]}>
                <View style={[styles.cardOuterView]}>
                    <View style={styles.projectBoxContent}>
                        {/* <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL, flex: 1 }}>
                            <View style={{ width: '100%', paddingRight: RFPercentage(5.5) }}>
                                <TextComponent
                                    numberOfLines={2}
                                    fontSize={FONT_SIZE.LARGE}
                                    style={{
                                        color: theme.colors.primaryThemeColor,
                                    }}>
                                    {item?.ProjectDescription ? item?.ProjectDescription : item?.Actions}
                                </TextComponent>
                            </View>
                        </View> */}
                        {item?.Description ? (
                            <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                <TextComponent numberOfLines={1} fontSize={FONT_SIZE.NORMAL} style={{ color: theme.colors.primaryThemeColor, }}>
                                    {item?.Description}
                                 </TextComponent>
                            </View>
                        ) : null}
                        <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: RFPercentage(2.5),
                                        height: RFPercentage(2.5),
                                        backgroundColor: COLORS.WARNING,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: SPACING.X_SMALL,
                                        marginRight: SPACING.X_SMALL,
                                    }}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.X_SMALL} />
                                </View>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    {moment(item?.StartDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} -{' '}
                                </TextComponent>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    
                                    {moment(item?.DueDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])}
                                </TextComponent>
                            </View>
                        </View>
                        {item?.site ? (<TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>{item?.site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.Description ? (<TextComponent style={{ paddingTop: SPACING.SMALL, paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}>{item?.DueByDays}</TextComponent>
                        </TextComponent>) : null}
                        {item?.lastOpened ? (
                            <View style={{ paddingTop: SPACING.SMALL, paddingLeft: SPACING.X_SMALL }}>
                                <TextComponent type={FONT_TYPE.BOLD} style={{ color: COLORS.green, fontSize: FONT_SIZE.X_SMALL }}>
                                    Last opened: {moment(item?.lastOpened).fromNow()}
                                </TextComponent>
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
         ) : null}
        </View>
    );
};

export default CardList;

const styles = StyleSheet.create({
    cardOuterView: {
        flexDirection: 'row',
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