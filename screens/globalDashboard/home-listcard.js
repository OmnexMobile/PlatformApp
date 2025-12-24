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
// import Tag from './tag';

const HomeListCard = ({ item = {}, route }) => {
    const { sites, handleRecentActivity, timeSettings } = useAppContext();
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();
    console.log('item in home list card', item);
    const { title, data } = route.params;
    // const statusCode = route.params[APP_VARIABLES.DASHBOARD_CONCERNS];

    console.log('Title:', title);
    console.log('Data:', data);
    // console.log('StatusCode:', statusCode);

    const handleClickCard = item => {
        if (['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name)) {
            navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                screenFrom: 'Dashboard',
                datapass: item,
            });
        } else {
            navigation.navigate(item?.Status === STATUS.CREATED ? ROUTES.CONCERN_INITIAL_EVALUATION : ROUTES.VIEW_CONCERN_PS, {
                ConcernID: item?.ConcernID,
                ...(item?.StatusID === STATUS_CODES.IN_PROGRESS.toString() && { FormTypeID: 3 }),
        });
            handleRecentActivity?.(item);
        }
    };

    console.log('item in home list card', data);

    return (
        <Content noPadding>
            <Header title={title} />
            {data?.length > 0 ? (
                data?.map((item, index) =>
                    (['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) || item.ConcernID) ?
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
                                        navigation.navigate(ROUTES.EDIT_CONCERN, {
                                            ConcernID: item?.ConcernID,
                                            FormTypeID: 3,
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
                                        source={['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) ? IMAGES.supplier_logo : IMAGES.ps_logo_round}
                                        // source={IMAGES.ps_logo_round}
                                    // source={IMAGES.apqpModuleIcon}
                                    />
                                </Ripple>
                                {['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) ? null :
                                <Ripple
                                    rippleContainerBorderRadius={SPACING.SMALL}
                                    onPress={() =>
                                        navigation.navigate(ROUTES.EDIT_CONCERN, {
                                            ConcernID: item?.ConcernID,
                                            FormTypeID: 3,
                                        })
                                    }
                                    activeOpacity={1}
                                    style={{
                                        position: 'absolute',
                                        right: SPACING.SMALL,
                                        bottom: SPACING.SMALL,
                                        width: RFPercentage(5),
                                        height: RFPercentage(5),
                                        backgroundColor: theme.colors.primaryThemeColor,
                                        borderRadius: SPACING.SMALL,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 100,
                                    }}>

                                    <IconComponent name="edit" size={FONT_SIZE.LARGE} type={ICON_TYPE.AntDesign} color={COLORS.white} />
                                </Ripple>}
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
                                        {/* {item?.Title} */}
                                        {['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) ? sites?.selectedSite?.SiteName : item?.Title}
                                        {console.log('item?.Title', item?.Title)}
                                    </TextComponent>
                                </View>
                                {item?.Type ? (
                                    <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                        <TextComponent numberOfLines={1}>Type: {item?.Type}</TextComponent>
                                    </View>
                                ) : null}
                               {item?.ConcernNo && <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                    <TextComponent numberOfLines={1}>Concern No: {item?.ConcernNo}</TextComponent>
                                </View>}
                                {item?.AuditTypeName && 
                                <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                    <TextComponent numberOfLines={1}>
                                        {item?.AuditTypeName}
                                    </TextComponent>
                                </View>}
                                {/* <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1}>Status: {item?.Status}</TextComponent>
                            <Tag text="open" />
                        </View> */}
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
                                            {['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name)
                                            ? `${moment(item?.StartDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} - `
                                            : `${moment(item?.CreatedDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} - `}
                                            {/* {moment(item?.CreatedDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} -{' '} */}
                                        </TextComponent>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                            {['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name)
                                                ? moment(item?.EndDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])
                                                : moment(item?.DueDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])
                                            }
                                            {/* {moment(item?.DueDate).format(DATE_FORMAT[timeSettings || "DD_MM_YYYY"])} */}
                                            {/* {moment(item?.DueDate).format(DATE_FORMAT.DD_MM_YYYY)} */}
                                        </TextComponent>
                                    </View>
                                </View>
                                {item?.AuditNumber && <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}> <TextComponent type={FONT_TYPE.BOLD}>{item?.AuditNumber}</TextComponent>
                                </TextComponent>}
                               {item?.DuebyDays && <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                                    Due by days: <TextComponent type={FONT_TYPE.BOLD}>{item?.DuebyDays}</TextComponent>
                                </TextComponent>}
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
                    </TouchableOpacity> : null
                )) : <NoRecordFound/>}
        </Content>
    );
};

export default HomeListCard;

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
