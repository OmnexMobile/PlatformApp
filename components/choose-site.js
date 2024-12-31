import React from 'react';
import Ripple from 'react-native-material-ripple';
import { ScrollView, View } from 'react-native';
import { TextComponent, NoRecordFound, Avatar } from 'components';
import { Modalize } from 'react-native-modalize';
import { getAvatarInitials, RFPercentage } from 'helpers/utils';
import { TOAST_STATUS } from 'constants/app-constant';
import { COLORS, SPACING } from 'constants/theme-constants';
import { toast } from 'helpers/utils';
import useTheme from 'theme/useTheme';

const ChooseSite = ({ modalizeRef, filteredSites, sites, handleSite, searchKey, setSearchKey }) => {
    const { theme } = useTheme();
    return (
        <Modalize
            ref={modalizeRef}
            // adjustToContentHeight
            scrollViewProps={{
                // scrollEnabled: false,
                style: {
                    flex: 1,
                    flexGrow: 1,
                },
            }}
            modalHeight={RFPercentage(80)}
            HeaderComponent={
                <View
                    style={{
                        padding: SPACING.NORMAL,
                        borderBottomWidth: 1,
                        borderColor: COLORS.accDividerColor,
                        backgroundColor: theme.mode.backgroundColor,
                        borderTopLeftRadius: SPACING.SMALL,
                        borderTopRightRadius: SPACING.SMALL,
                    }}>
                    <TextComponent>Choose site ({filteredSites?.length || 0})</TextComponent>
                    {/* <TextComponent>Organizations ({organizations?.length})</TextComponent> */}
                    {/* <View
                            style={{
                                width: '100%',
                                padding: SPACING.NORMAL,
                                paddingHorizontal: 0,
                                paddingBottom: 0,
                            }}>
                            <View>
                                <TextInput
                                    value={searchKey}
                                    onChangeText={searchKey => setSearchKey(searchKey)}
                                    style={{ fontFamily: 'ProximaNova-Regular', fontSize: FONT_SIZE.LARGE }}
                                    placeholder="search site"
                                />
                            </View>
                        </View> */}
                </View>
            }>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <ScrollView style={{ flex: 1, paddingBottom: SPACING.LARGE }} contentContainerStyle={{ flexGrow: 1, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {!!filteredSites?.length ? (
                            <>
                            {console.log('filteredSites--->', filteredSites)}
                                {filteredSites.map(
                                    ({ EntityNode, FullName, Siteid, SiteName, SupplierAccess, UserId, UserType, img = null }, index) => (
                                        <Ripple
                                            onPress={() => {
                                                setTimeout(() => {
                                                    modalizeRef.current?.close();
                                                }, 1000);
                                                // handleSite({ EntityNode, FullName, SiteId, SiteName, SupplierAccess, UserId, UserType });
                                                handleSite({ EntityNode, FullName, Siteid, SiteName, SupplierAccess, UserId, UserType });
                                                toast('Loading...', 'setting up site details...', TOAST_STATUS.SUCCESS, 100);
                                            }}
                                            activeOpacity={0.8}
                                            key={index}
                                            style={{
                                                paddingVertical: SPACING.X_SMALL,
                                                flexDirection: 'row',
                                                paddingHorizontal: SPACING.NORMAL,
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    borderWidth: 2,
                                                    borderRadius: 100,
                                                    padding: 2,
                                                    // borderColor: sites?.selectedSite?.SiteId === SiteId ? COLORS.primaryThemeColor : COLORS.white,
                                                    borderColor: sites?.selectedSite?.Siteid === Siteid ? COLORS.primaryThemeColor : COLORS.white,
                                                }}>
                                                <Avatar
                                                    img={img}
                                                    placeholder={getAvatarInitials(SiteName)}
                                                    width={RFPercentage(5)}
                                                    height={RFPercentage(5)}
                                                />
                                            </View>
                                            <TextComponent style={{ paddingLeft: SPACING.NORMAL }}>{SiteName}</TextComponent>
                                        </Ripple>
                                    ),
                                )}
                            </>
                        ) : (
                            <NoRecordFound />
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modalize>
    );
};

export default ChooseSite;
