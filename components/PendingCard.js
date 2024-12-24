import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
// import moment from 'moment';
import { IMAGES } from 'assets/images';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import TextComponent from './text';

const PendingCard = ({ item = {} }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
            <Ripple
                rippleContainerBorderRadius={SPACING.SMALL}
                style={[
                    {
                        padding: SPACING.NORMAL,
                        borderRadius: SPACING.SMALL,
                        padding: SPACING.NORMAL,
                        marginBottom: SPACING.NORMAL,
                    },
                    elevation,
                ]}>
                <View style={[styles.cardOuterView]}>
                    <View style={styles.projectBoxContent}>
                        <View style={{ flexDirection: 'row', paddingVertical: SPACING.SMALL, flex: 1 }}>
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
                                    {item?.TaskDescription}
                                </TextComponent>
                            </View>
                        </View>
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
                                    {item?.StartDate} -{' '}
                                </TextComponent>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <View
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
                                </View> */}
                                <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                    {item?.FinishDate}
                                </TextComponent>
                            </View>
                        </View>
                        <TextComponent style={{ paddingLeft: SPACING.X_SMALL, paddingBottom: SPACING.X_SMALL }} numberOfLines={1}>
                            {item?.site}
                        </TextComponent>
                        <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                            Due by days: <TextComponent type={FONT_TYPE.BOLD}>{item?.DueByDays}</TextComponent>
                        </TextComponent>
                    </View>
                </View>
            </Ripple>
        </View>
    );
};

export default PendingCard;

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
