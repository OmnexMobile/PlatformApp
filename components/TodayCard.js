import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
// import moment from 'moment';
import { IMAGES } from 'assets/images';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';
import IconComponent from './icon-component';
import TextComponent from './text';
import ImageComponent from './image-component';

const TodayCard = ({ item = {} }) => {
    const { theme } = useTheme();
    return (
        <Ripple style={{ padding: SPACING.NORMAL, borderBottomWidth: 2, borderColor: theme.mode.borderColor }}>
            <View style={[styles.cardOuterView]}>
                <View style={styles.projectBoxContent}>
                    <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
                        <View style={{ paddingRight: SPACING.SMALL }}>
                            <ImageComponent resizeMode="contain" source={IMAGES.apqpModuleIcon} style={styles.apqpTypeIcon} />
                        </View>
                        <TextComponent
                            numberOfLines={1}
                            fontSize={FONT_SIZE.LARGE}
                            type={FONT_TYPE.BOLD}
                            style={{
                                color: theme.colors.primaryThemeColor,
                            }}>
                            {item?.TaskDescription}
                        </TextComponent>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    width: RFPercentage(3),
                                    height: RFPercentage(3),
                                    backgroundColor: COLORS.INFO,
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
                            <View
                                style={{
                                    width: RFPercentage(3),
                                    height: RFPercentage(3),
                                    backgroundColor: COLORS.INFO,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: SPACING.SMALL,
                                    marginRight: SPACING.X_SMALL,
                                }}>
                                <IconComponent name="calendar" color={COLORS.white} type={ICON_TYPE.AntDesign} size={FONT_SIZE.SMALL} />
                            </View>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                {item?.FinishDate}
                            </TextComponent>
                        </View>
                    </View>
                    <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                        {item?.ProjectDescription}
                    </TextComponent>
                </View>
            </View>
        </Ripple>
    );
};

export default TodayCard;

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
        // borderLeftColor:'green',
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
        width: 20,
        height: 17,
    },
});
