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

export const HomeListComponent = ({ title, data, loading, statusCode, hideSeeAll, currentName, moduleLicenses, hasAPQPToday, hasPSToday }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    // const [moduleLicenses, setModuleLicenses] = useState(null);
    console.log('checkdTodayList------------>>>>>>', data, 'hasAPQPToday:', hasAPQPToday, 'hasPSToday:', hasPSToday);

    // useEffect(() => {
    //   const loadLicenses = async () => {
    //     const stored = await AsyncStorage.getItem('moduleLicenses');
    //     console.log('stored licenses', stored);
    //     if (stored) {
    //       setModuleLicenses(JSON.parse(stored));
    //     }
    //   };
    //   loadLicenses();
    // }, []);

    console.log('moduleLicenses in home list', moduleLicenses, 'hasApqpPpapLicense:', moduleLicenses?.hasApqpPpapLicense, (moduleLicenses?.hasProblemSolverLicense || moduleLicenses?.hasAuditProLicense
                                || moduleLicenses?.hasSupplierManagementLicense) && !hasAPQPToday);

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.SMALL }}>
                <TextComponent fontSize={FONT_SIZE.LARGE} style={{ padding: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                    {title}
                </TextComponent>
                {data?.length && !hideSeeAll ? (
                    <TouchableOpacity
                        onPress={() => {
                            const showSM = data.some(item =>
                                ['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit']
                                .includes(item?.Module_name)
                            );
                            const showAPQP = moduleLicenses?.hasApqpPpapLicense && hasAPQPToday;
                            const showPS =  moduleLicenses?.hasProblemSolverLicense && hasPSToday;

                            console.log('showSM onPress------->>>', showSM, 'showSM || showPS:', (showSM || showPS));
                            console.log('showAPQP onPress------->>>', showAPQP);
                            console.log('showPS onPress------->>>', showPS);

                            if ((showSM && moduleLicenses?.hasSupplierManagementLicense) || showPS) {
                                navigation.navigate(ROUTES.HOME_LIST_PS, {
                                    [APP_VARIABLES.DASHBOARD_CONCERNS]: statusCode,
                                    title,
                                    data,
                                });
                            } else if(showAPQP) {
                                console.log('navigating to APQP home list');
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
                    {/* {data.map((item, index) =>
                        ['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit'].includes(item.Module_name) ? (
                            <ListCardLogoSM key={index} item={item} handleRecentActivity={handleRecentActivity} />
                        ) :
                        (moduleLicenses?.hasApqpPpapLicense && hasAPQPToday) ? (
                            <ListCardLogoApqp key={index} item={item} handleRecentActivity={handleRecentActivity} statusCode={statusCode} />
                        ) : !moduleLicenses?.hasApqpPpapLicense ? (
                            <ListCardLogo key={index} item={item} handleRecentActivity={handleRecentActivity} statusCode={statusCode} />
                        ) : null

                    )} */}
                    {data.map((item, index) => {
                    const showSM = ['AuditPro', 'Supplier Initial Assessment', 'Supplier Routine Audit']
                        .includes(item.Module_name);
                        // console.log('showSM1 check------->>>', showSM, item.Module_name);

                    const showAPQP = moduleLicenses?.hasApqpPpapLicense && hasAPQPToday;
                        // console.log('showAPQP1 check------->>>', showAPQP);

                    const showPS =  moduleLicenses?.hasProblemSolverLicense && hasPSToday;
                        // console.log('showPS1 check------->>>', showPS, moduleLicenses?.hasProblemSolverLicense, hasPSToday);

                    return (
                        <React.Fragment key={index}>
                        {/* 1️⃣ Supplier Management */}
                        {(showSM && moduleLicenses?.hasSupplierManagementLicense) && (
                            <ListCardLogoSM
                            item={item}
                            handleRecentActivity={handleRecentActivity}
                            />
                        )}

                        {/* 2️⃣ APQP */}
                        {showAPQP && (
                            <ListCardLogoApqp
                            item={item}
                            handleRecentActivity={handleRecentActivity}
                            statusCode={statusCode}
                            />
                        )}

                        {/* 3️⃣ Problem Solver / Default */}
                        {showPS && (
                            <ListCardLogo
                            item={item}
                            handleRecentActivity={handleRecentActivity}
                            statusCode={statusCode}
                            />
                        )}
                        </React.Fragment>
                    );
                    })}

                </>
            ) : (
                <NoRecordFound />
            )}
        </View>
    );
};