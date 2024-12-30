
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextComponent, ListCard, PlaceHolders, NoRecordFound } from 'components';
import { APP_VARIABLES, FONT_TYPE, PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';

export const HomeListComponent = ({ title, data, loading, statusCode, hideSeeAll }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
                <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                    {title}
                </TextComponent>
                {data?.length && !hideSeeAll ? (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(ROUTES.LIST_SCREEN_PS, {
                                [APP_VARIABLES.DASHBOARD_CONCERNS]: statusCode,
                                title,
                            })
                        }>
                        <TextComponent
                            fontSize={FONT_SIZE.LARGE}
                            style={{ padding: SPACING.SMALL, textDecorationLine: 'underline', color: theme.colors.primaryThemeColor }}
                            textDecoration="underline"
                            type={FONT_TYPE.BOLD}>
                            See all
                        </TextComponent>
                    </TouchableOpacity>
                ) : null}
            </View>
            {loading ? (
                <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
            ) : data?.length > 0 ? (
                data?.map((item, index) => <ListCard key={index} item={item} handleRecentActivity={handleRecentActivity} />)
            ) : (
                <NoRecordFound />
            )}
        </View>
    );
};
