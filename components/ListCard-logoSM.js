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
import IconComponent from './icon-component';
import TextComponent from './text';
import { IMAGES } from 'assets/images';
import ImageComponent from './image-component';
import AsyncStorage from '@react-native-async-storage/async-storage';  
// import Tag from './tag';

const ListCardLogoSM = ({ item = {} }) => {
    const { sites, handleRecentActivity, timeSettings } = useAppContext();
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();
    console.log('ListCardLogoSMitem in list card logo------->>>', item);

    const handleClickCard = async item => {
        console.log('checckitemmmmm',item);

        if(item?.Module_name==='Supplier Initial Assessment' || item?.Module_name==='Supplier Routine Audit'){
            if(item?.Module_name==='Supplier Initial Assessment'){
            await AsyncStorage.setItem('supplierIndex', JSON.stringify(2));
            }else if(item?.Module_name==='Supplier Routine Audit'){
            await AsyncStorage.setItem('supplierIndex', JSON.stringify(3));
            }
             navigation.navigate(ROUTES.AUDIT_PAGE_SM, {
                screenFrom: 'Dashboard',
                datapass: item,
            });
        }else if(item?.Module_name === 'Audit Pro') {
            navigation.navigate(ROUTES.AUDIT_PAGE, {
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
    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
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
                    },
                    elevation,
                ]}>
                {sites?.selectedSite?.UserType !== USER_TYPE.SUPPLIER && (
                    <>
                        <Ripple
                            rippleContainerBorderRadius={SPACING.SMALL}
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
                            {item?.Module_name === 'Supplier Initial Assessment' || item?.Module_name === 'Supplier Routine Audit' ? (
                                <ImageComponent resizeMode="contain" source={IMAGES.supplier_logo} />
                            ) : (
                                <ImageComponent resizeMode="contain" source={IMAGES.auditpro_logo} />
                            )}
                        </Ripple>
                    </>
                )}
                <View style={[styles.cardOuterView]}>
                    <View style={styles.projectBoxContent}>
                        <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL, flex: 1 }}>
                            <View style={{ width: '100%', paddingRight: RFPercentage(5.5) }}>
                                <TextComponent
                                    numberOfLines={2}
                                    fontSize={FONT_SIZE.LARGE}
                                    style={{
                                        color: theme.colors.primaryThemeColor,
                                    }}>
                                    {item?.SiteName}
                                </TextComponent>
                            </View>
                        </View>
                        {item?.Type ? (
                            <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                <TextComponent numberOfLines={1}>Type: {item?.Type}</TextComponent>
                            </View>
                        ) : null}
                        <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1}> {item?.AuditTypeName}</TextComponent>
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
                                    {moment(item?.StartDate).format(DATE_FORMAT[timeSettings || 'DD_MM_YYYY'])} -{' '}
                                </TextComponent>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    {moment(item?.EndDate).format(DATE_FORMAT[timeSettings || 'DD_MM_YYYY'])}
                                </TextComponent>
                            </View>
                        </View>
                        <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                            {' '}
                            <TextComponent type={FONT_TYPE.BOLD}>{item?.AuditNumber}</TextComponent>
                        </TextComponent>
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
        </View>
    );
};

export default ListCardLogoSM;

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
