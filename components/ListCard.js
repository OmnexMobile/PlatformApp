import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import TextComponent from './text';
// import Tag from './tag';

const ListCard = ({ item = {}, handleRecentActivity }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();

    const handleClickCard = item => {
        // navigation.navigate(ROUTES.CONCERN_SCREEN, { ConcernID: item?.ConcernID });
        navigation.navigate(ROUTES.CONCERN_INITIAL_EVALUATION, { ConcernID: item?.ConcernID });
        handleRecentActivity?.(item);
    };
    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
            <Ripple
                onPress={() => handleClickCard?.(item)}
                rippleContainerBorderRadius={SPACING.SMALL}
                style={[
                    {
                        padding: SPACING.NORMAL,
                        borderRadius: SPACING.SMALL,
                        padding: SPACING.NORMAL,
                        marginBottom: SPACING.NORMAL,
                        marginTop: SPACING.XX_SMALL,
                    },
                    elevation,
                ]}>
                <View style={[styles.cardOuterView]}>
                    <View style={styles.projectBoxContent}>
                        <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL, flex: 1 }}>
                            {/* <View style={[{ paddingRight: SPACING.SMALL }, styles.apqpTypeIcon]}>
                                    <ImageComponent resizeMode="contain" source={IMAGES.apqpModuleIcon} />
                                </View> */}
                            <View style={{ width: '100%' }}>
                                <TextComponent
                                    numberOfLines={1}
                                    fontSize={FONT_SIZE.LARGE}
                                    // type={FONT_TYPE.BOLD}
                                    style={{
                                        color: theme.colors.primaryThemeColor,
                                    }}>
                                    {item?.Title}
                                </TextComponent>
                            </View>
                        </View>
                        {item?.Type ? (
                            <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                <TextComponent numberOfLines={1}>Type: {item?.Type}</TextComponent>
                            </View>
                        ) : null}
                        <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1}>Concern No: {item?.ConcernNo}</TextComponent>
                        </View>
                        {/* <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1}>Status: {item?.Status}</TextComponent>
                            <Tag text="open" />
                        </View> */}
                        <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: RFPercentage(3),
                                        height: RFPercentage(3),
                                        backgroundColor: COLORS.WARNING,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: SPACING.SMALL,
                                        marginRight: SPACING.X_SMALL,
                                    }}>
                                    <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.SMALL} />
                                </View>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                {console.log('listCard--->1', item?.CreatedDate)}
                                    {moment(item?.CreatedDate).format(DATE_FORMAT.DD_MM_YYYY)} - {' '}
                                </TextComponent>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    {console.log('listCard--->', item?.DueDate, '---', moment(item?.DueDate).format(DATE_FORMAT.DD_MM_YYYY))}
                                    {moment(item?.DueDate).format(DATE_FORMAT.DD_MM_YYYY)}
                                </TextComponent>
                            </View>
                        </View>
                        <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}>{item?.DuebyDays}</TextComponent>
                        </TextComponent>
                        <TextComponent style={{ color: COLORS.searchText, paddingLeft: SPACING.X_SMALL, paddingTop: SPACING.X_SMALL }} fontSize={FONT_SIZE.X_SMALL} numberOfLines={1}>
                            created {moment(item?.CreatedDate)?.fromNow()}
                        </TextComponent>
                        {item?.lastOpened ? (
                            <View style={{ paddingTop: SPACING.SMALL, paddingLeft: SPACING.X_SMALL }}>
                                <TextComponent type={FONT_TYPE.BOLD} style={{ color: COLORS.green, fontSize: FONT_SIZE.XX_SMALL }}>
                                    Last opened: {moment(item?.lastOpened).fromNow()}
                                </TextComponent>
                            </View>
                        ) : null}
                    </View>
                </View>
            </Ripple>
        </View>
    );
};

export default ListCard;

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
