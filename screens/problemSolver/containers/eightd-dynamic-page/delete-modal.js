import { ButtonComponent, IconComponent, TextComponent } from 'components';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import useTheme from 'theme/useTheme';

const DeleteModal = ({ modalizeRef, deleting, handleDelete }) => {
    const { theme } = useTheme();
    return (
        <Modalize
            withHandle={false}
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
            modalHeight={RFPercentage(20)}
            HeaderComponent={
                <View
                    style={{
                        paddingHorizontal: SPACING.NORMAL,
                        borderBottomWidth: 1,
                        borderColor: COLORS.accDividerColor,
                        backgroundColor: theme.mode.backgroundColor,
                        borderTopLeftRadius: SPACING.SMALL,
                        borderTopRightRadius: SPACING.SMALL,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                            Are you want to delete? (This can't be revert)
                        </TextComponent>
                    </View>
                    <View
                        style={{
                            padding: SPACING.NORMAL,
                            paddingRight: 0,
                        }}>
                        <TouchableOpacity
                            onPress={() => modalizeRef?.current?.close()}
                            style={{
                                padding: SPACING.SMALL,
                                alignSelf: 'flex-end',
                                borderRadius: SPACING.SMALL,
                                backgroundColor: theme.colors.primaryThemeColor,
                            }}>
                            <IconComponent color={COLORS.white} name="close" type={ICON_TYPE.AntDesign} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>
            }>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View style={{ padding: SPACING.SMALL, alignItems: 'center', flex: 1 }}>
                    <ButtonComponent
                        loading={deleting}
                        disabled={deleting}
                        onPress={handleDelete}
                        style={{
                            backgroundColor: COLORS.red,
                        }}>
                        Proceed to Delete
                    </ButtonComponent>
                </View>
            </View>
        </Modalize>
    );
};

export default DeleteModal;
