import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import IconComponent from './icon-component';
import useTheme from 'theme/useTheme';

const ListSearch = ({ searchKey, setSearchKey, placeholder = 'search here' }) => {
    const { theme } = useTheme();
    return(
    <View style={{ padding: SPACING.NORMAL, paddingHorizontal: SPACING.NORMAL }}>
        <View style={{ padding: SPACING.NORMAL, paddingHorizontal: 0, backgroundColor: theme.mode.searchInputBackgroundColor, borderRadius: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={FONT_SIZE.X_LARGE} type={ICON_TYPE.Ionicons} name="search" />
                </View>
                <View style={{ flex: 8 }}>
                    <TextInput
                        value={searchKey}
                        {...{ placeholder }}
                        placeholderTextColor={COLORS.searchText}
                        style={{ fontFamily: 'ProximaNova-Bold', fontSize: FONT_SIZE.REGULAR, padding: 0, color: theme.mode.textColor }}
                        onChangeText={searchKey => setSearchKey(searchKey)}
                    />
                </View>
                <TouchableOpacity
                    disabled={!!!setSearchKey}
                    onPress={() => setSearchKey('')}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {!!searchKey ? <IconComponent size={FONT_SIZE.X_LARGE} type={ICON_TYPE.Ionicons} name="close" /> : null}
                </TouchableOpacity>
            </View>
        </View>
    </View>
);}

export default ListSearch;
