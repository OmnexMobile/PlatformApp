import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RFPercentage } from '../../../helpers/responsiveFont';
import { COLORS, SPACING } from 'constants/theme-constants';
import { PLACEHOLDERS } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { getElevation } from 'helpers/utils';

const IcSkeleton = ({ type, noPadding = false }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const renderLoader = type => {
        switch (type) {
            case PLACEHOLDERS.INSPECTION_CARD:
                return (
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                        showsVerticalScrollIndicator={false}>
                        {Array(10)
                            .fill('')
                            .map((data, index) => (
                                <View key={index} style={{ padding: SPACING.NORMAL, paddingBottom: 0 }}>
                                    <View
                                        style={{
                                            paddingBottom: SPACING.NORMAL,
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomColor: COLORS.icborder,
                                        }}>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10, backgroundColor: COLORS.icBottomBox }} />
                                                <View style={{ flex: 3 }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                </View>
                                                <View style={{ flex: 1.2, marginLeft: 20, flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, marginRight: 10, backgroundColor: COLORS.icBottomBox }} />
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                    </ScrollView>
                );
            case PLACEHOLDERS.SUPERVISOR_CARD:
                return (
                    <ScrollView
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.icBackground,
                        }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{}}>
                        {Array(10)
                            .fill('')
                            .map((data, index) => (
                                <View
                                    key={index}
                                    style={{ paddingHorizontal: 5, paddingVertical: 20, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 }}>
                                    <View style={{}}>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10 ,backgroundColor: COLORS.icBottomBox }} />
                                                <View style={{ flex: 3 }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4 ,backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL ,backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL ,backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL ,backgroundColor: COLORS.icBottomBox }} />
                                                </View>
                                                <View style={{ flex: 1.2, marginLeft: 20, flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4 ,backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, marginRight: 10 ,backgroundColor: COLORS.icBottomBox }} />
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, marginRight: 10 ,backgroundColor: COLORS.icBottomBox }} />
                                                        <View style={{ width: 20, height: 20, borderRadius: 4 ,backgroundColor: COLORS.icBottomBox }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                    </ScrollView>
                );
            case PLACEHOLDERS.OPERATOR_CARD:
                return (
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                        showsVerticalScrollIndicator={false}>
                        {Array(10)
                            .fill('')
                            .map((data, index) => (
                                <View key={index} style={{ padding: SPACING.NORMAL, paddingBottom: 0 }}>
                                    <View
                                        style={{
                                            paddingBottom: SPACING.NORMAL,
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomColor: COLORS.icborder,
                                        }}>
                                       <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10, backgroundColor: COLORS.icBottomBox }} />
                                                <View style={{ flex: 3 }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, marginTop: SPACING.SMALL, backgroundColor: COLORS.icBottomBox }} />
                                                </View>
                                                <View style={{ flex: 1.2, marginLeft: 20, flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <View style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, marginRight: 10, backgroundColor: COLORS.icBottomBox }} />
                                                        <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: COLORS.icBottomBox }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                    </ScrollView>
                );
            default:
                return null;
        }
    };
    return renderLoader(type);
};

export default IcSkeleton;
