import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ImageView from 'react-native-image-viewing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextComponent from './text';
import { COLORS, Colors, FONT_SIZE, SPACING } from 'constants/theme-constants';
import ImageComponent from './image-component';
import { FONT_TYPE } from 'constants/app-constant';

const ImageGallery = ({ images, title = '', text = '', deleteEnabled = true, handleDelete = null, allowAdd = false, onPress }) => {
    const [imageIndex, setImageIndex] = useState(null);

    return (
        <>
            <ImageView
                images={images}
                imageIndex={imageIndex}
                visible={imageIndex !== null}
                onRequestClose={() => setImageIndex(null)}
                backgroundColor="#fff"
                onImageIndexChange={index => console.log('onImageIndexChange', index)}
            />
            <View style={styles.issueimageConatiner}>
                {title && (
                    <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} style={styles.issueTitle}>
                        {title}
                    </TextComponent>
                )}
                <ScrollView horizontal style={styles.imageHeader}>
                    {allowAdd ? (
                        <TouchableOpacity
                            onPress={onPress}
                            style={[
                                {
                                    backgroundColor: '#F9FAFB',
                                    borderWidth: 1,
                                    borderColor: '#D1D5DB',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                styles.orderImage,
                            ]}>
                            <Ionicons size={FONT_SIZE.X_LARGE} name="camera-outline" color={Colors.primaryThemeColor} />
                        </TouchableOpacity>
                    ) : null}
                    {images.length > 0 ? (
                        images.map((item, index) => (
                            <View style={{ marginRight: SPACING.SMALL }}>
                                <TouchableOpacity onPress={() => setImageIndex(index)}>
                                    <ImageComponent
                                        style={styles.orderImage}
                                        key={index}
                                        source={{
                                            uri: item?.uri,
                                        }}
                                    />
                                </TouchableOpacity>
                                {deleteEnabled ? (
                                    <TouchableOpacity onPress={() => handleDelete?.(item.image_id, item)}>
                                        <TextComponent type={FONT_TYPE.BOLD} style={styles.trash}>
                                            Delete
                                        </TextComponent>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ))
                    ) : (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}>
                            <TextComponent>{text}</TextComponent>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

export default ImageGallery;

const styles = StyleSheet.create({
    title: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    issueimageConatiner: {
        paddingTop: 15,
    },
    issueTitle: {
        // fontSize: 15,
        paddingBottom: SPACING.SMALL,
    },
    imageHeader: {
        flexDirection: 'row',
        // marginTop: 10,
    },
    orderImage: {
        width: 70,
        height: 70,
        borderRadius: 6,
    },
    trash: {
        paddingTop: SPACING.X_SMALL,
        color: COLORS.red,
        textAlign: 'center',
    },
});
