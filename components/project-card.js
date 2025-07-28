import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from './icon-component';
import TextComponent from './text';
import Tag from './tag';

const CircularProgressComponent = ({ duration, radius, valueSuffix, value, inActiveStrokeWidth, activeStrokeWidth }) => {
    const progressRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loaded && progressRef?.current?.reAnimate();
    }, [loaded]);

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 100);
    }, []);

    return (
        <CircularProgress
            {...{
                ref: progressRef,
                // duration:10000,
                duration,
                radius,
                valueSuffix,
                value,
                inActiveStrokeWidth,
                activeStrokeWidth,
            }}
        />
    );
};

const ProjectCard = ({ item = {}, onClick }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();

    const handleClickCard = item => {
        console.log('🚀 ~ file: ProjectCard.js:20 ~ handleClickCard ~ item:', item?.title);
        // navigation.navigate(ROUTES.CONCERN_SCREEN, { ConcernID: item?.ConcernID });
        // navigation.navigate(ROUTES.CONCERN_INITIAL_EVALUATION, { ConcernID: item?.ConcernID });
        // handleRecentActivity?.(item);
    };
    return (
        <View style={{ paddingHorizontal: SPACING.NORMAL }}>
            <View style={{ paddingBottom: SPACING.SMALL, flexDirection: 'row' }}>
                <IconComponent
                    size={FONT_SIZE.X_LARGE}
                    type={ICON_TYPE.Ionicons}
                    name="document-text"
                    color={theme?.colors.primaryThemeColor}
                    style={{ marginRight: SPACING.X_SMALL }}
                />
                <TextComponent style={{ width: '95%' }} fontSize={FONT_SIZE.LARGE} numberOfLines={2} type={FONT_TYPE.BOLD}>
                    Project: {item?.title}
                </TextComponent>
            </View>
            <View style={{ paddingLeft: SPACING.NORMAL }}>
                {item?.list?.map(data => (
                    <View
                        key={data?.ActionId}
                        onPress={() => handleClickCard?.(data)}
                        rippleContainerBorderRadius={SPACING.SMALL}
                        style={[
                            {
                                padding: SPACING.NORMAL,
                                borderRadius: SPACING.SMALL,
                                padding: SPACING.NORMAL,
                                marginBottom: SPACING.NORMAL,
                                marginTop: SPACING.X_SMALL,
                                flexDirection: 'row',
                            },
                            elevation,
                        ]}>
                        <View style={[styles.cardOuterView]}>
                            <View style={styles.projectBoxContent}>
                                <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL, flex: 1 }}>
                                    <View style={{ width: '100%' }}>
                                        <TextComponent
                                            numberOfLines={1}
                                            fontSize={FONT_SIZE.LARGE}
                                            style={{
                                                color: theme.colors.primaryThemeColor,
                                            }}>
                                            {data?.Description || ''}
                                        </TextComponent>
                                    </View>
                                </View>
                                <View style={{ paddingBottom: SPACING.SMALL }}>
                                    {/* <Tag text={data?.site} /> */}
                                    <TextComponent numberOfLines={1}>Site: {data?.site}</TextComponent>
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
                                            {moment(data?.StartDate).format(DATE_FORMAT.DD_MM_YYYY)} -{' '}
                                        </TextComponent>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                            {moment(data?.DueDate).format(DATE_FORMAT.DD_MM_YYYY)}
                                        </TextComponent>
                                    </View>
                                </View>
                                <TextComponent style={{ paddingLeft: SPACING.X_SMALL }} numberOfLines={1}>
                                    Due by days: <TextComponent type={FONT_TYPE.BOLD}>{data?.DueByDays}</TextComponent>
                                </TextComponent>
                                {/* <TextComponent
                                    style={{ color: COLORS.searchText, paddingLeft: SPACING.X_SMALL, paddingTop: SPACING.X_SMALL }}
                                    fontSize={FONT_SIZE.X_SMALL}
                                    numberOfLines={1}>
                                    created {moment(data?.CreatedDate)?.fromNow()}
                                </TextComponent> */}
                            </View>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => onClick(data)}>
                                <CircularProgressComponent
                                    duration={100}
                                    radius={30}
                                    valueSuffix={'%'}
                                    value={data?.Percentage}
                                    inActiveStrokeWidth={5}
                                    activeStrokeWidth={5}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ProjectCard;

const styles = StyleSheet.create({
    cardOuterView: {
        flexDirection: 'row',
        flex: 7,
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
