import React, { useState } from 'react';
import uuid from 'react-native-uuid';
import DocumentPicker from 'react-native-document-picker';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import IconComponent from './icon-component';
import ImageComponent from './image-component';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilePicker = ({ name, label, required, value, onChange }) => {
    const { theme } = useTheme();
    const [files, setFiles] = useState([]);

    const hasFile = !!files?.length;

    const handleDocumentSelection = React.useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
            });
            const file = {
                ...response[0],
                id: uuid.v4(),
            };
            console.log('🚀 ~ file: file-picker.js:28 ~ handleDocumentSelection ~ file', files);
            setFiles([...files, file]);
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const handleRemoveFile = id => {
        const temp = files.filter(item => item.id !== id);
        setFiles([...temp]);
    };

    const renderItem = ({ item, index }) => {
        if (item.empty) {
            return <View key={index} style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View
                key={index}
                style={{
                    width: '100%',
                    // height: RFPercentage(14),
                    margin: SPACING.X_SMALL,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: COLORS.white,
                    borderRadius: 10,
                    elevation: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: SPACING.SMALL,
                }}>
                <TextComponent>{item?.name}</TextComponent>
                <TouchableOpacity
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                        item?._id ? deleteItem(item?._id) : handleRemoveFile(item?.id);
                    }}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: COLORS.ERROR,
                        alignItems: 'center',
                        justifyContent: 'center',
                        right: 0,
                        top: 0,
                    }}>
                    <IconComponent name="delete" color={COLORS.white} type={ICON_TYPE.AntDesign} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ padding: SPACING.NORMAL }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {/* {label} */}
                    Attach
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
                {!hasFile ? (
                    <View>
                        <TouchableOpacity
                            onPress={handleDocumentSelection}
                            style={{
                                borderRadius: SPACING.SMALL,
                                padding: SPACING.SMALL,
                                marginLeft: SPACING.SMALL,
                                backgroundColor: theme.colors.primaryThemeColor,
                            }}>
                            <IconComponent color={COLORS.white} type={ICON_TYPE.AntDesign} name="plus" />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
            {!!files?.length ? (
                <View
                    style={{
                        paddingVertical: SPACING.NORMAL,
                        flex: 1,
                    }}>
                    {files?.map((image, index) => renderItem({ item: image, index }))}
                </View>
            ) : null}
        </View>
    );
};

export default FilePicker;

const styles = StyleSheet.create({
    dropdown: {
        // margin: 16,
        height: 50,
        // borderBottomColor: 'gray',
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        padding: SPACING.NORMAL,
        borderRadius: SPACING.SMALL,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.black,
    },
    selectedTextStyle: {
        fontSize: FONT_SIZE.LARGE,
        fontFamily: 'ProximaNova-Regular',
        color: COLORS.black,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    container: {
        flex: 1,
        paddingHorizontal: SPACING.SMALL,
    },
    item: {
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    actionButtonIcon: {
        fontSize: FONT_SIZE.X_LARGE,
        height: 22,
        color: 'white',
    },
});
