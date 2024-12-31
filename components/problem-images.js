import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import ImageView from 'react-native-image-viewing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, STATUS_CODES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import API_URL from 'global/api-urls';
import TextComponent from './text';
import ImageComponent from './image-component';
import ModalComponent from './modal-component';
import IconComponent from './icon-component';
import { postAPI } from 'global/api-helpers';
import Loader from './loader';

const ProblemImages = ({
    images = [],
    title = '',
    label = '',
    text = '',
    deleteEnabled = true,
    handleDelete = null,
    allowAdd = false,
    handleProblemImages,
    ConcernID,
    isEditPage,
    required = false,
    concernDetails,
}) => {
    const [imageIndex, setImageIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [fixedImages, setFixedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const getProblemImages = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
            const { Data } = await postAPI(`${API_URL.GET_PROBLEM_IMAGES}`, formData);
            const formattedImages = Data?.map(image => ({
                FileName: image?.FileName || '',
                FileContent: image?.FileContent,
                FileId: image?.FileId,
                ConcernId: image?.ConcernId,
                uri: image?.FileContent,
            }));
            setLoading(false);
            setFixedImages(formattedImages);
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    const handleDeleteProblemImages = async FileId => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.FileId, FileId);
            const { Data, Success } = await postAPI(`${API_URL.DELETE_PROBLEM_IMAGES}`, formData);
            if (Success) {
                setLoading(false);
                getProblemImages();
            }
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    useEffect(() => {
        if (ConcernID) {
            console.log('🚀 ~ useEffect ~ ConcernID111:', ConcernID);
            getProblemImages();
        }
    }, [ConcernID]);

    const handleClickDeleteImage = item => {
        console.log('🚀 ~ handleClickDeleteImage ~ item:', item?.FileId);
        if (item?.FileId) {
            handleDeleteProblemImages(item?.FileId);
        } else {
            const tempFixedImages = fixedImages?.filter(image => image?.image_id !== item?.image_id);
            setFixedImages(tempFixedImages);
        }
    };

    useEffect(() => {
        if (!Boolean(ConcernID) || isEditPage || concernDetails?.StatusID === STATUS_CODES.DraftConcern) {
            const formattedImages = (fixedImages || []).map(image => ({
                FileName: image?.FileName || '',
                FileContent: image?.FileContent,
            }));
            handleProblemImages?.(formattedImages);
        }
    }, [fixedImages]);

    useEffect(() => {
        if (isEditPage) {
            const formattedImages = (fixedImages || [])
                .filter(image => !image?.FileId)
                .map(image => ({
                    FileName: image?.FileName || '',
                    FileContent: image?.FileContent,
                }));
            console.log('🚀 ~ useEffect ~ formattedImages:', formattedImages?.length);
            handleProblemImages?.(formattedImages);
        }
    }, [fixedImages]);

    const selectPhotoTapped = async type => {
        const options = {
            quality: 1.0,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                privateDirectory: true,
            },
        };

        const handleResponse = response => {
            const file = response?.assets?.[0] || {};
            if (!response?.didCancel) {
                const newImage = {
                    image_id: uuid.v4(),
                    uri: file.uri,
                    FileName: file.fileName || '',
                    FileContent: file.base64,
                };
                setFixedImages(prevImages => [...prevImages, newImage]);
                setModalVisible(false);
            }
        };

        const requestCameraPermission = async () => {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: 'App Camera Permission',
                message: 'App needs access to your camera',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        };

        try {
            if (Platform.OS === 'android' && !(await requestCameraPermission())) {
                console.log('Camera permission denied');
                return;
            }
            if (type === 'camera') {
                launchCamera(options, handleResponse);
            } else {
                launchImageLibrary(options, handleResponse);
            }
        } catch (err) {
            console.warn('Error selecting photo:', err);
        }
    };
    return (
        <>
            <ImageView
                images={fixedImages}
                imageIndex={imageIndex}
                visible={imageIndex !== null}
                onRequestClose={() => setImageIndex(null)}
                backgroundColor="#fff"
                onImageIndexChange={index => console.log('onImageIndexChange', index)}
            />
            <View style={styles.issueimageConatiner}>
                {(label || title) && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL, marginBottom: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                        {label || title}
                        {required && (
                            <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        )}
                    </TextComponent>
                )}
                {loading ? (
                    <View style={styles.orderImage}>
                        <Loader />
                    </View>
                ) : (
                    <ScrollView horizontal style={styles.imageHeader}>
                        {(isEditPage || !ConcernID) && allowAdd ? (
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[
                                    {
                                        backgroundColor: theme.mode.backgroundColor,
                                        borderWidth: 1,
                                        borderColor: theme.mode.borderColor,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: SPACING.SMALL,
                                    },
                                    styles.orderImage,
                                ]}>
                                <Ionicons size={FONT_SIZE.X_LARGE} name="camera-outline" color={COLORS.primaryThemeColor} />
                            </TouchableOpacity>
                        ) : null}
                        {fixedImages.length > 0 ? (
                            fixedImages.map((item, index) => (
                                <View key={index} style={{ marginRight: SPACING.SMALL }}>
                                    <TouchableOpacity onPress={() => setImageIndex(index)}>
                                        <ImageComponent
                                            style={styles.orderImage}
                                            key={index}
                                            source={{
                                                uri: item?.uri,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    {(isEditPage || !ConcernID) && deleteEnabled ? (
                                        <TouchableOpacity onPress={() => handleClickDeleteImage?.(item)}>
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
                )}
            </View>
            <ModalComponent modalVisible={modalVisible} noStatusBarHeight onRequestClose={() => setModalVisible(false)}>
                <View
                    style={{
                        flex: 8,
                        backgroundColor: COLORS.transparentGrey,
                    }}
                />
                <View
                    style={{
                        padding: SPACING.SMALL,
                        flex: 2,
                        backgroundColor: theme.mode.backgroundColor,
                    }}>
                    <View
                        style={{
                            padding: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <IconComponent
                                type={ICON_TYPE.AntDesign}
                                name="closecircleo"
                                style={{ fontSize: 25, color: COLORS.themeBlack, marginRight: SPACING.X_SMALL }}
                            />
                        </TouchableOpacity>
                        <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                            Choose Type
                        </TextComponent>
                        <View />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            padding: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                width: '48%',
                                borderRadius: SPACING.SMALL,
                                alignItems: 'center',
                                padding: SPACING.NORMAL,
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: COLORS.lightGrey,
                            }}
                            onPress={() => {
                                selectPhotoTapped('camera');
                            }}>
                            <IconComponent
                                type={ICON_TYPE.AntDesign}
                                name="camera"
                                style={{ fontSize: 20, color: COLORS.themeBlack, marginRight: SPACING.X_SMALL }}
                            />
                            <TextComponent style={{ marginLeft: SPACING.SMALL }} fontSize={FONT_SIZE.SMALL}>
                                Camera
                            </TextComponent>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                width: '48%',
                                borderRadius: SPACING.SMALL,
                                alignItems: 'center',
                                padding: SPACING.NORMAL,
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: COLORS.lightGrey,
                            }}
                            onPress={() => {
                                selectPhotoTapped('gallery');
                            }}>
                            <IconComponent
                                type={ICON_TYPE.AntDesign}
                                name="upload"
                                style={{ fontSize: 20, color: COLORS.themeBlack, marginRight: SPACING.X_SMALL }}
                            />
                            <TextComponent style={{ marginLeft: SPACING.SMALL }} fontSize={FONT_SIZE.SMALL}>
                                Upload
                            </TextComponent>
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalComponent>
        </>
    );
};

export default ProblemImages;

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
        padding: SPACING.NORMAL,
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
