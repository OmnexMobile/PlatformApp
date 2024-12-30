import React, { useState } from 'react';
import uuid from 'react-native-uuid';
import ImageCropPicker from 'react-native-image-crop-picker';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import TextComponent from './text';
import ImageComponent from './image-component';
import IconComponent from './icon-component';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ImagePicker = ({ name, label, required, value, onChange }) => {
    const { theme } = useTheme();
    const [images, setImages] = useState([]);

    const handleUpload = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            multiple: true,
            includeBase64: true,
        })
            .then(image => {
                if (image?.length) {
                    const temp = image.map(image => ({
                        imageURL: image?.path,
                        type: image?.mime || '',
                        name: image?.filename || '',
                        id: uuid.v4(),
                        // imageURL: image?.sourceURL || image?.path || '',
                        // data: image?.data,
                    }));
                    setImages([...images, ...temp]);
                } else {
                    const temp = {
                        imageURL: image.path,
                        type: image?.mime || '',
                        name: image?.filename || '',
                        id: uuid.v4(),
                    };
                    setImages([...images, temp]);
                }
            })
            .catch(e => console.log('🚀 ~ file: index.js ~ line 90 ~ UploadImages ~ e', e));
    };

    const handleRemoveImage = id => {
        const temp = images.filter(item => item.id !== id);
        setImages([...temp]);
    };
    
    const renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View key={index} style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View
                key={index}
                style={{
                    width: RFPercentage(14),
                    height: RFPercentage(14),
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
                }}>
                <ImageComponent source={{ uri: item?.imageURL }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                {/* {item?.uploaded && ( */}
                <TouchableOpacity
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                        item?._id ? deleteItem(item?._id) : handleRemoveImage(item?.id);
                    }}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: COLORS.ERROR,
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        right: 0,
                        top: 0,
                    }}>
                    <IconComponent name="delete" color={COLORS.white} type={ICON_TYPE.AntDesign} />
                </TouchableOpacity>
                {/* )} */}
            </View>
        );
    };

    return (
        <View style={{ paddingTop: SPACING.NORMAL, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
                <TouchableOpacity
                    onPress={handleUpload}
                    style={{
                        borderRadius: SPACING.SMALL,
                        padding: SPACING.SMALL,
                        marginLeft: SPACING.SMALL,
                        backgroundColor: theme.colors.primaryThemeColor,
                    }}>
                    <IconComponent color={COLORS.white} type={ICON_TYPE.AntDesign} name="plus" />
                </TouchableOpacity>
            </View>
            {!!images?.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SPACING.NORMAL, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {images?.map((image, index) => renderItem({ item: image, index }))}
                </View>
            ) : null}
        </View>
    );
};

export default ImagePicker;

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
