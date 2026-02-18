import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES, STATUS, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import IconComponent from 'components/icon-component';
import TextComponent from 'components/text';
import { IMAGES } from 'assets/images';
import ImageComponent from 'components/image-component';

const RiskCard = ({ item = {}, handleClickCard }) => {
    console.log('item in list card logo apqp', item);
    const { sites, handleRecentActivity, timeSettings } = useAppContext();
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();
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
        <View style={{ paddingHorizontal: SPACING.MEDIUM }}>
        {/* {item?.Description || item?.TaskDescription ? ( */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleClickCard?.(item)}
                style={[
                    {
                        padding: SPACING.NORMAL,
                        borderRadius: SPACING.SMALL,
                        marginBottom: SPACING.SMALL,
                        marginTop: SPACING.NORMAL,
                        // marginLeft: SPACING.SMALL,
                        width: '100%',
                    },
                    elevation,
                ]}>
                <View style={[styles.cardOuterView]}>
                    <View style={styles.projectBoxContent}>
                        {item?.ActionType ? ( <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1} fontSize={FONT_SIZE.LARGE} style={{ color: theme.colors.primaryThemeColor }}>
                                {item.ActionType == "" || item.ActionType == null
                                    ? " - "
                                    : item.ActionType.replace("&apos;", "'")}
                            </TextComponent>
                            {/* </TextComponent> */}
                        </View>
                        ) : null}
                        {item?.ActionCreatedDate ? (<View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
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
                            </View>
                            <View style={{ width: '100%' }}>
                                <TextComponent numberOfLines={1} fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}  style={{ color: 'black' }}>
                                    {changeDateFormatCard(item.ActionCreatedDate)} -{" "}
                                    {changeDateFormatCard(item.DueDate)}
                                </TextComponent>
                            </View>
                        </View>
                        ) : null}
                        {item?.Site ? (<TextComponent style={{ width: '100%', paddingBottom: SPACING.SMALL  }} numberOfLines={1}>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>{item?.Site}</TextComponent>
                        </TextComponent>) : null}
                        {item?.DueByDays ? (<TextComponent fontSize={FONT_SIZE.SMALL}   numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}
                            style={
                                item.DueByDays > 0
                                ? [
                                    { fontSize: FONT_SIZE.SMALL, color: "green" },
                                    ]
                                : [
                                    { fontSize: FONT_SIZE.SMALL, color: "red" },
                                    ]
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

export default RiskCard;

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