import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextComponent, ListCard, PlaceHolders, NoRecordFound } from 'components';
import { APP_VARIABLES, FONT_TYPE, PLACEHOLDERS, ROUTES, STATUS_CODES } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import ListCardLogo from 'components/ListCard-logo';
import ListCardLogoSM from 'components/ListCard-logoSM';
import ListCardLogoApqp from 'components/ListCard-logo-apqp';
import AsyncStorage from '@react-native-community/async-storage';

export const HomeListComponentApqp = ({ title, data, loading, statusCode, hideSeeAll, currentName }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    const [moduleLicenses, setModuleLicenses] = useState(null);
    console.log('checkdTodayList------------>>>>>>', data, 'hideSeeAll', hideSeeAll);

    useEffect(() => {
      const loadLicenses = async () => {
        const stored = await AsyncStorage.getItem('moduleLicenses');
        console.log('stored licenses', stored);
        if (stored) {
          setModuleLicenses(JSON.parse(stored));
        }
      };
      loadLicenses();
    }, []);
    console.log('moduleLicenses', moduleLicenses);

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
               {/* <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                    {title}
                </TextComponent> */}
                {data?.length && !hideSeeAll ? (
                    <TouchableOpacity
                        onPress={() => {
                            if (moduleLicenses?.hasProblemSolverLicense || moduleLicenses?.hasAuditProLicense
                                || moduleLicenses?.hasSupplierManagementLicense) {
                                    console.log('navigating to ps , auditpro, sm list');
                                    navigation.navigate(ROUTES.HOME_LIST_PS, {
                                        [APP_VARIABLES.DASHBOARD_CONCERNS]: statusCode,
                                        title,
                                        data,
                                    });
                            } else if (moduleLicenses?.hasApqpPpapLicense) {
                                console.log('navigating to apqp list');
                                navigation.navigate(ROUTES.HOME_LIST_APQP, {
                                    statusCode,
                                    title,
                                    data,
                                });
                            }
                        }}>
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
            {loading ? (
                <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
            ) : data?.length > 0 ? (
                <>
                    {data.map((item, index) =>
                        // ['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) ? (
                        //     <ListCardLogoSM key={index} item={item} handleRecentActivity={handleRecentActivity} />
                        // ) :
                       
                        moduleLicenses?.hasApqpPpapLicense ? (
                            <ListCardLogoApqp key={index} item={item} handleRecentActivity={handleRecentActivity} statusCode={statusCode} />
                        // ) : currentName !== moduleLicenses?.hasApqpPpapLicense ? (
                        //     <ListCardLogo key={index} item={item} handleRecentActivity={handleRecentActivity} statusCode={statusCode} />
                        ) : null

                    )}
                </>
            ) : null
            // (
            //     <NoRecordFound />
            // )
            }
        </View>
    );
};