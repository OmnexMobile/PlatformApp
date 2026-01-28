import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES, STATUS, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';
import useTheme from 'theme/useTheme';
import IconComponent from '../../components/icon-component';
import TextComponent from '../../components/text';
import { IMAGES } from 'assets/images';
import ImageComponent from '../../components/image-component';
import { Content, Header, NoRecordFound } from 'components';
import strings from 'config/localization';
// import Tag from './tag';

const HomeListCardApqp = ({ item = {}, route }) => {
    const { sites, handleRecentActivity, timeSettings } = useAppContext();
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();
    console.log('item in home list card', item);
    const { statusCode, title, data } = route.params;

    console.log('Title:', title, statusCode);
    console.log('Data:', data);

    const handleClickCard = item => {
        console.log('Clicked Item:TaskId-->', item.TaskId,'item.ActionId---',item.ActionId, 'item-->', item);
        // navigation.navigate(ROUTES.CONCERN_SCREEN, { ConcernID: item?.ConcernID });
        statusCode === STATUS_CODES.TODAY_CONCERN ?
            navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
                itemData: item,
                RouteParam: "Project",
                ProjectId: item.ProjectId,
                TaskID: item.TaskId,
                //activeTab: this.state.activeTab,
            }) :
            navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
                itemData: item,
                RouteParam: "Project",
                ProjectId: item.ProjectID,
                TaskID: item.ActionId,
                //activeTab: this.state.activeTab,
            });
        handleRecentActivity?.(item);
    };
    console.log('item in home list card apqp', data);

    return (
        <Content noPadding>
            <Header title={title} />
            {data?.length > 0 ? (
                data?.map((item, index) =>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleClickCard?.(item)}
                        style={[
                            {
                                padding: SPACING.NORMAL,
                                borderRadius: SPACING.SMALL,
                                padding: SPACING.NORMAL,
                                marginBottom: SPACING.NORMAL,
                                marginTop: SPACING.X_SMALL,
                                margin: SPACING.SMALL
                            },
                            elevation,
                        ]}>
                        {sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && (
                            <>
                                <Ripple
                                    rippleContainerBorderRadius={SPACING.SMALL}
                                    onPress={() =>
                                        statusCode === STATUS_CODES.TODAY_CONCERN ?
                                        navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
                                            itemData: item,
                                            RouteParam: "Project",
                                            ProjectId: item.ProjectId,
                                            TaskID: item.TaskId,
                                            //activeTab: this.state.activeTab,
                                        }) :
                                        navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
                                            itemData: item,
                                            RouteParam: "Project",
                                            ProjectId: item.ProjectID,
                                            TaskID: item.ActionId,
                                            //activeTab: this.state.activeTab,
                                        })
                                    }
                                    activeOpacity={1}
                                    style={{
                                        position: 'absolute',
                                        right: SPACING.X_SMALL,
                                        top: SPACING.SMALL,
                                        width: RFPercentage(6),
                                        height: RFPercentage(6),
                                        backgroundColor: 'transparent',
                                        borderRadius: SPACING.SMALL,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 100,
                                    }}>
                                    <ImageComponent
                                        resizeMode="contain"
                                        // source={IMAGES.ps_logo_round}
                                        source={IMAGES.apqp_logo}
                                        // style={{ width: '80%', height: '80%' }}
                                    />
                                </Ripple>
                            </>
                        )}
                        <View style={[styles.cardOuterView]}>
                            <View style={styles.projectBoxContent}>
                                <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
                                    <TextComponent
                                        numberOfLines={2}
                                        fontSize={FONT_SIZE.LARGE}
                                        style={{
                                            color: theme.colors.primaryThemeColor,
                                        }}>
                                        {item?.ProjectDescription}
                                        {/* {console.log('item?.Title', item?.Title)} */}
                                    </TextComponent>
                                </View>
                                {item?.Type ? (
                                    <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                        <TextComponent numberOfLines={1}>Type: {item?.Type}</TextComponent>
                                    </View>
                                ) : null}
                                <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                    <TextComponent numberOfLines={1}>{item?.TaskDescription}</TextComponent>
                                </View>
                                <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                    {/* <TextComponent numberOfLines={1}>Status: {item?.Status}</TextComponent> */}
                                    {/* <Tag text="open" /> */}
                                </View>
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
                                            {moment(item?.FinishDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])}
                                            {/* {moment(item?.DueDate).format(DATE_FORMAT.DD_MM_YYYY)} */}
                                        </TextComponent>
                                    </View>
                                </View>
                                {item?.DueByDays ? (<TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                                    Due by days: <TextComponent type={FONT_TYPE.BOLD}>{item?.DuebyDays}</TextComponent>
                                </TextComponent>) : null}
                                {/* <TextComponent
                            style={{ color: COLORS.searchText, paddingLeft: SPACING.X_SMALL, paddingTop: SPACING.X_SMALL }}
                            fontSize={FONT_SIZE.X_SMALL}
                            numberOfLines={1}>
                            {moment(item?.CreatedDate, DATE_FORMAT.DD_MM_YYYY_HH_MM_SS).fromNow()}
                        </TextComponent> */}
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
                )) : <NoRecordFound />}
        </Content>
    );
};

export default HomeListCardApqp;

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
