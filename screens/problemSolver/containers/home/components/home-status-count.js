import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { TextComponent } from 'components';
import { APP_VARIABLES, FONT_TYPE, ROUTES, STATUS_CODES, USER_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';

const Button = ({ title = '', value = 0, color = COLORS.themeBlack, navigation, field, loading, index }) => {
    if (loading)
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', width: RFPercentage(10), paddingVertical: SPACING.SMALL }}>
                <SkeletonPlaceholder>
                    <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginTop: SPACING.SMALL }}>
                            <View style={{ width: 30, height: 10, borderRadius: 4 }} />
                        </View>
                        <View style={{ marginTop: SPACING.SMALL }}>
                            <View style={{ width: 60, height: 10, borderRadius: 4 }} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
            </View>
        );
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{ alignItems: 'center', justifyContent: 'center', width: RFPercentage(10) }}
            onPress={
                () =>
                    navigation.navigate(ROUTES.LIST_SCREEN_PS, {
                        [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                        title,
                    })
                // field !== "TotalConcern" && navigation.navigate(ROUTES.LIST_SCREEN, {
                //     [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                //     title,
                // })
            }>
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
                {value}
            </TextComponent>
            <TextComponent fontSize={FONT_SIZE.SMALL} color={color}>
                {title}
            </TextComponent>
        </TouchableOpacity>
    );
};

const HomeStatusbar = ({ countDetails, countDetailsLoading, sites }) => {
    console.log('countDetails, countDetailsLoading, sites--->reach', countDetails, '--', countDetailsLoading, '--', sites)
    const { theme } = useTheme();
    const navigation = useNavigation();
    const Divider = () => (
        <View
            style={{
                width: 2,
                marginVertical: SPACING.SMALL,
                backgroundColor: theme.mode.borderColor,
            }}
        />
    );

    if (sites?.selectedSite?.UserType === USER_TYPE.SUPPLIER) {
        return (
            <View
                style={{
                    paddingTop: SPACING.SMALL,
                    paddingBottom: SPACING.NORMAL,
                    borderBottomWidth: 2,
                    borderColor: theme.mode.borderColor,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        paddingHorizontal: SPACING.SMALL,
                    }}>
                    <Button
                        loading={countDetailsLoading}
                        navigation={navigation}
                        title="All"
                        value={countDetails?.TotalConcern || 0}
                        field={'TotalConcern'}
                    />
                    <Divider />
                    <Button
                        loading={countDetailsLoading}
                        navigation={navigation}
                        title="In-Progress"
                        color="#00a1e2"
                        value={countDetails?.InprogressConcern || 0}
                        field={'InprogressConcern'}
                    />
                    <Divider />
                    <Button
                        loading={countDetailsLoading}
                        navigation={navigation}
                        title="Closed"
                        color="#e64884"
                        value={countDetails?.CloseConcern || 0}
                        field={'CloseConcern'}
                    />
                </View>
            </View>
        );
    }

    return (
        <View
            style={{
                paddingTop: SPACING.SMALL,
                paddingBottom: SPACING.NORMAL,
                borderBottomWidth: 2,
                borderColor: theme.mode.borderColor,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    paddingHorizontal: SPACING.SMALL,
                }}>
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="All"
                    color="#00a1e2"
                    value={countDetails?.TotalConcern || 0}
                    field={'TotalConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Open"
                    color="#06c16f"
                    value={countDetails?.OpenConcern || 0}
                    field={'OpenConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="In-Progress"
                    color="#00a1e2"
                    value={countDetails?.InprogressConcern || 0}
                    field={'InprogressConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Closed"
                    color="#e64884"
                    value={countDetails?.CloseConcern || 0}
                    field={'CloseConcern'}
                />
            </View>
            <View
                style={{
                    height: 2,
                    marginVertical: SPACING.SMALL,
                    backgroundColor: theme.mode.borderColor,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    paddingHorizontal: SPACING.SMALL,
                }}>
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Rejected"
                    color={COLORS.ERROR}
                    value={countDetails?.RejectConcern || 0}
                    field={'RejectConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Draft"
                    color="#a450a8"
                    value={countDetails?.DraftConcern || 0}
                    field={'DraftConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Rework"
                    color={COLORS.ALERT}
                    value={countDetails?.ReworkConcern || 0}
                    field={'ReworkConcern'}
                />
                <Divider />
                <Button
                    loading={countDetailsLoading}
                    navigation={navigation}
                    title="Cancelled"
                    color={COLORS.warningRed}
                    value={countDetails?.CancelledConcern || 0}
                    field={'CancelledConcern'}
                />
            </View>
        </View>
    );
};

export default HomeStatusbar;
