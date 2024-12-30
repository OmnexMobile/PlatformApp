import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextComponent } from 'components';
import { APP_VARIABLES, FONT_TYPE, ROUTES, STATUS_CODES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { RFPercentage } from 'helpers/utils';
import { useNavigation } from '@react-navigation/native';

const Button = ({ title = '', value = 0, color = COLORS.themeBlack, navigation, field }) => (
    
    <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', width: RFPercentage(10) }} 
        onPress={() =>
        field !== "TotalConcern" && navigation.navigate(ROUTES.LIST_SCREEN, {
            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
            title,
        })
        // handleClick(title, ROUTES.LIST_SCREEN, STATUS_CODES[field])
        // console.log('click options----------', value, title)
    }>
        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XX_LARGE}>
            {value}
        </TextComponent>
        <TextComponent fontSize={FONT_SIZE.SMALL} color={color}>
            {title}
        </TextComponent>
    </TouchableOpacity>
);

const handleClick = (title, routes, statusCode) => {
    console.log('click options----------', title, routes, statusCode)
}

const HomeStatusbar = ({ countDetails }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    console.log('click options1111----------', navigation, ROUTES.LIST_SCREEN)
    console.log('CURRENT_PAGE---->', 'HomeStatusBar')
    const Divider = () => (
        <View
            style={{
                width: 2,
                marginVertical: SPACING.SMALL,
                backgroundColor: theme.mode.borderColor,
            }}
        />
    );

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
                <Button navigation={navigation} title="Scheduled" color="#06c16f" value={countDetails?.RejectConcern || 0} field={"RejectConcern"} />
                <Divider />
                <Button navigation={navigation} title="Completed" color="#06c16f" value={countDetails?.OpenConcern || 0} field={"OpenConcern"} />
                <Divider />
                <Button navigation={navigation} title="D-Violated" color="#00a1e2" value={countDetails?.InprogressConcern || 0} field={"InprogressConcern"} />
                <Divider />
                <Button navigation={navigation} title="Closed-Out" color="#e64884" value={countDetails?.CloseConcern || 0} field={"CloseConcern"} />
            </View>
            {/* <View
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
                    <Button navigation={navigation} title="Rejected" color={COLORS.ERROR} value={countDetails?.RejectConcern || 0} field={"RejectConcern"} />
                    <Divider />
                    <Button navigation={navigation} title="Draft" color="#a450a8" value={countDetails?.DraftConcern || 0} field={"DraftConcern"} />
                    <Divider />
                    <Button navigation={navigation} title="Rework" color={COLORS.ALERT} value={countDetails?.ReworkConcern || 0} field={"ReworkConcern"} />
                    <Divider />
                    <Button navigation={navigation} title="Cancelled" color={COLORS.warningRed} value={countDetails?.CancelledConcern || 0} field={"CancelledConcern"} />
                </View> */}
        </View>
    );
};

export default HomeStatusbar;
