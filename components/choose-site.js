import React from 'react';
import Ripple from 'react-native-material-ripple';
import { Platform, ScrollView, StatusBar, View } from 'react-native';
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
            onOpen={() => {
                // if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.65)', true);
                StatusBar.setBarStyle('light-content');
                // }
            }}
            onClose={() => {
                // if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(COLORS.white, true);
                StatusBar.setBarStyle('dark-content');
                // }
            }}
            ref={modalizeRef}
            // adjustToContentHeight
            scrollViewProps={{
                // scrollEnabled: false,
                style: {
                    flex: 1,
                    flexGrow: 1,
                },
            }}
            modalStyle={{
                backgroundColor: theme.mode.backgroundColor,
            }}
            modalHeight={RFPercentage(Platform.OS === 'android' ? 80 : 50)}
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
                </View>
            }>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <ScrollView
                    style={{ flex: 1, backgroundColor: theme.mode.backgroundColor, paddingBottom: SPACING.LARGE }}
                    contentContainerStyle={{ flexGrow: 1, flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                    <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor, paddingTop: SPACING.SMALL }}>
                        {!!filteredSites?.length ? (
                            <>
                                {filteredSites.map(
                                    ({ EntityNode, FullName, SiteId, SiteName, SupplierAccess, UserId, UserType, img = null }, index) => (
                                        <Ripple
                                            onPress={() => {
                                                setTimeout(() => {
                                                    modalizeRef.current?.close();
                                                }, 1000);
                                                handleSite({ EntityNode, FullName, SiteId, SiteName, SupplierAccess, UserId, UserType });
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
                                                    borderColor:
                                                        sites?.selectedSite?.SiteId === SiteId ? theme.colors.primaryThemeColor : COLORS.lightGrey,
                                                }}>
                                                <Avatar
                                                    img={img}
                                                    placeholder={getAvatarInitials(SiteName)}
                                                    width={RFPercentage(5)}
                                                    height={RFPercentage(5)}
                                                    selected={sites?.selectedSite?.SiteId === SiteId}
                                                    theme={theme}
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
