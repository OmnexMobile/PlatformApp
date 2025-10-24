
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextComponent, ListCard, PlaceHolders, NoRecordFound } from 'components';
import { APP_VARIABLES, FONT_TYPE, PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import RecentActivityCard from 'components/RecentActivityCard';

export const HomeListRecentActivity = ({ title, data, loading, statusCode, hideSeeAll }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    console.log('HomeListRecentActivity------------>>>>>>', data);
    const activityData = Array.isArray(data)
    ? data
    : data
    ? [data]
    : [];

    return (
    <View>
      {/* Header with title + See All */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: SPACING.SMALL,
        }}>
        <TextComponent
          fontSize={FONT_SIZE.LARGE}
          style={{ padding: SPACING.SMALL }}
          type={FONT_TYPE.BOLD}>
          {title}
        </TextComponent>

        {activityData.length > 0 && !hideSeeAll ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.HOME_LIST_PS, {
                [APP_VARIABLES.DASHBOARD_CONCERNS]: statusCode,
                title,
              })
            }>
            <TextComponent
              fontSize={FONT_SIZE.LARGE}
              style={{
                padding: SPACING.SMALL,
                textDecorationLine: 'underline',
                color: theme.colors.primaryThemeColor,
              }}
              textDecoration="underline"
              type={FONT_TYPE.BOLD}>
              See all
            </TextComponent>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Body */}
      {loading ? (
        <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
      ) : activityData.length > 0 ? (
          activityData.map((item, index) => (
            <RecentActivityCard
              key={index}
              item={item}
              handleRecentActivity={handleRecentActivity}
            />
        ))
      ) : (
        <NoRecordFound />
      )}
    </View>
  );
};
