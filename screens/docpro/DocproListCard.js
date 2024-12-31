import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from '../../components/icon-component';
import TextComponent from '../../components/text';
// import Tag from './tag';
import { IMAGES } from 'assets/images';

const DocproListCard = ({ item = {}, handleRecentActivity }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();

    const handleClickCard = item => {
        // navigation.navigate(ROUTES.CONCERN_SCREEN, { ConcernID: item?.ConcernID });
        navigation.navigate(ROUTES.CONCERN_INITIAL_EVALUATION, { ConcernID: item?.ConcernID });
        handleRecentActivity?.(item);
    };
    return (
        <View style={{ paddingHorizontal: SPACING.X_SMALL }}>
            <Ripple
                // onPress={() => handleClickCard?.(item)}
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
                    <View style={{}}>
                        <Image
                            // source={IMAGES.document}
                            resizeMode="cover"
                            style={{ height: 35, width: 35, borderWidth: 10, borderRadius: 100, backgroundColor: '#24c5d9' }}
                        />
                    </View>
                    <View style={styles.projectBoxContent}>
                        {item?.Type ? (
                            <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                                <TextComponent numberOfLines={1}>Type: {item?.Type}</TextComponent>
                            </View>
                        ) : null}
                        <View style={{ width: '100%', paddingBottom: SPACING.SMALL }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.title} fontSize={FONT_SIZE.NORMAL}>
                                IFSA-Printed Circuit Board-1
                            </TextComponent>
                        </View>
                        <View style={{ width: '100%', paddingBottom: SPACING.NORMAL,flexDirection:'row' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                                Document Name :
                            </TextComponent>
                            <TextComponent numberOfLines={2} fontSize={FONT_SIZE.SMALL} style={{marginTop: 2}}> Inspection Form  
                            </TextComponent>
                        </View>
                        <View style={{ width: '100%', paddingBottom: SPACING.NORMAL ,flexDirection:'row'}}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                                Revision :
                            </TextComponent>
                            <TextComponent numberOfLines={2} fontSize={FONT_SIZE.SMALL} style={{marginTop: 2}}> 1
                            </TextComponent>
                        </View>
                        

                        <View style={{ flexDirection: 'row', paddingBottom: SPACING.SMALL ,}}>
                        <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                            Last Revision Date :
                        </TextComponent>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
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

                                <TextComponent fontSize={FONT_SIZE.SMALL} style={{marginTop: 2}}> {moment(item?.CreatedDate).format(DATE_FORMAT.DD_MM_YYYY)  }</TextComponent>
                            {/* </View> */}
                        </View>
                    </View>
                </View>
            </Ripple>
        </View>
    );
};

export default DocproListCard;

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
    projectBoxContent:{marginLeft:'2%'}
});
