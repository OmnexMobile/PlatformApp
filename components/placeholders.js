import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { SPACING } from 'constants/theme-constants';
import { PLACEHOLDERS } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { getElevation } from 'helpers/utils';

const PlaceHolders = ({ type, noPadding = false }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const renderLoader = type => {
        switch (type) {
            case PLACEHOLDERS.USER_CARD:
            case PLACEHOLDERS.TODAY_CARD:
                return (
                    <View
                        style={{
                            flex: 1,
                            paddingTop: SPACING.NORMAL,
                        }}>
                        {Array(10)
                            .fill('')
                            .map((data, index) => (
                                <View key={index} style={{ padding: SPACING.NORMAL, paddingTop: 0 }}>
                                    <View
                                        style={[
                                            {
                                                padding: SPACING.NORMAL,
                                                borderRadius: SPACING.SMALL,
                                                // borderBottomWidth: 2,
                                                // borderColor: theme.mode.borderColor,
                                                // hei
                                            },
                                            elevation,
                                        ]}>
                                        <SkeletonPlaceholder>
                                            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                                {/* <View
                                                        style={{
                                                            width: RFPercentage(3),
                                                            height: RFPercentage(3),
                                                            borderRadius: SPACING.XX_SMALL,
                                                        }}
                                                    /> */}
                                                <View style={{ width: 200, height: 8, borderRadius: 4 }} />
                                                <View style={{ width: 200, height: 8, borderRadius: 4, marginTop: SPACING.SMALL }} />
                                                <View style={{ width: 150, height: 8, borderRadius: 4, marginTop: SPACING.SMALL }} />
                                                <View style={{ width: 150, height: 8, borderRadius: 4, marginTop: SPACING.SMALL }} />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.SMALL }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View
                                                        style={{
                                                            width: RFPercentage(3),
                                                            height: RFPercentage(3),
                                                            borderRadius: SPACING.SMALL,
                                                        }}
                                                    />
                                                    <View style={{ width: 50, height: 10, borderRadius: 4, marginLeft: SPACING.SMALL }} />
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginLeft: SPACING.SMALL,
                                                    }}>
                                                    <View
                                                        style={{
                                                            width: RFPercentage(3),
                                                            height: RFPercentage(3),
                                                            borderRadius: SPACING.SMALL,
                                                        }}
                                                    />
                                                    <View style={{ width: 50, height: 8, borderRadius: 4, marginLeft: SPACING.SMALL }} />
                                                </View>
                                            </View>
                                            <View style={{ width: 200, height: 8, borderRadius: 4, marginTop: SPACING.SMALL }} />
                                        </SkeletonPlaceholder>
                                    </View>
                                </View>
                            ))}
                    </View>
                );
            case PLACEHOLDERS.TEAM_CARD:
                return (
                    <View
                        style={{
                            flex: 1,
                        }}>
                        {Array(3)
                            .fill('')
                            .map((data, index) => (
                                <View key={index}>
                                    <SkeletonPlaceholder>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.NORMAL }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View
                                                    style={{
                                                        width: RFPercentage(2.5),
                                                        height: RFPercentage(2.5),
                                                        borderRadius: 4,
                                                    }}
                                                />
                                                <View style={{ width: 100, height: 10, borderRadius: 4, marginLeft: SPACING.NORMAL }} />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', height: 1, borderRadius: 4 }} />
                                    </SkeletonPlaceholder>
                                </View>
                            ))}
                    </View>
                );
            default:
                return null;
        }
    };
    return renderLoader(type);
};

export default PlaceHolders;
