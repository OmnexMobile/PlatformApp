import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, TextInput } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
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
import InputWithLabel from './input-with-label';

const OKPicker = ({
    title = '',
    label = '',
    handleOKPicker,
    ConcernID,
    required = false,
    text = '',
    deleteEnabled = true,
    handleDelete = null,
    allowAdd = false,
    onPress,
    formelementID,
    isEditPage = false,
    concernDetails,
    editable = true,
    ...rest
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState({
        file_id: '',
        uri: '',
        FileName: '',
        FileContent: '',
    });
    const [comments, setComments] = useState('');
    const [fixedImages, setFixedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    console.log('🚀 ~ image?.uri || image?.FileData || image.FileContent:', image?.uri || image?.FileData || image.FileContent);

    const getOKPicker = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
            formData.append(APP_VARIABLES.Type, 1);
            formData.append(APP_VARIABLES.FileId, concernDetails?.OkId);
            const { Data } = await postAPI(`${API_URL.GET_OK_PICKER}`, formData);
            const formattedImages = Data?.map(image => ({
                FileName: image?.FileName || '',
                FileContent: image?.FileData,
                FileId: image?.FileId,
                ConcernId: image?.ConcernId,
                uri: image?.FileData,
            }));
            const image = {
                uri: `data:image/png;base64${formattedImages?.[0]?.FileContent}`,
                FileName: formattedImages?.[0]?.FileName,
                FileContent: formattedImages?.[0]?.FileContent,
            };
            setImage(image);
            setComments(concernDetails?.OkComments);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    const handleDeleteOKPicker = async FileId => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.FileId, FileId);
            const { Data } = await postAPI(`${API_URL.DELETE_PROBLEM_IMAGES}`, formData);
            if (Data?.Success) {
                console.log('🚀 ~ handleDeleteOKPicker ~ Data:', Data);
                setLoading(false);
                getOKPicker();
            }
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    useEffect(() => {
        if (ConcernID) {
            console.log('🚀 ~ useEffect ~ ConcernID111:', ConcernID);
            getOKPicker();
        }
    }, [ConcernID]);

    const handleClickDeleteImage = (item, id) => {
        if (item?.FileId) {
            handleDeleteOKPicker(item?.FileId);
        } else {
            const tempFixedImages = fixedImages?.filter(image => image?.image_id !== item?.image_id);
            setFixedImages(tempFixedImages);
        }
    };

    useEffect(() => {
        if (!Boolean(ConcernID) || isEditPage || concernDetails?.StatusID === STATUS_CODES.DraftConcern) {
            const formattedContent = {
                FileName: image?.FileName || '',
                FileContent: image?.FileContent?.replace(/^data:.*?;base64,/, ''),
                Comments: comments,
            };
            handleOKPicker?.(formattedContent);
        }
    }, [image?.FileName, comments]);

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
                    file_id: uuid.v4(),
                    uri: file.uri,
                    FileName: file.fileName || '',
                    FileContent: file.base64,
                };
                // setFixedImages(prevImages => [...prevImages, newImage]);
                setImage(newImage);
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

    const downloadAndOpenFile = async (base64Data, filename) => {
        try {
            const base64FilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

            // Cleaning the base64 data to remove any metadata
            const cleanedBase64Data = base64Data.replace(/^data:.*?;base64,/, '');

            // Writing the file to the local file system
            await RNFS.writeFile(base64FilePath, cleanedBase64Data, 'base64');

            // Opening the file with FileViewer
            await FileViewer.open(base64FilePath);
        } catch (error) {
            console.error('🚀 ~ downloadAndOpenFile ~ error:', error);
        }
    };
    return (
        <>
            <View style={[styles.issueimageConatiner, !editable && { backgroundColor: theme.mode.disabledBackgroundColor }]}>
                {(label || title) && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL, marginBottom: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                        {label || title}
                        <TextComponent style={{ fontSize: FONT_SIZE.X_SMALL, marginBottom: SPACING.SMALL }} type={FONT_TYPE.BOLD}>
                            {' '}
                            (click to update the image)
                        </TextComponent>
                        {required && (
                            <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        )}
                        {/* {isEditPage ||
                            (!ConcernID && required && (
                                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                                    *
                                </TextComponent>
                            ))} */}
                    </TextComponent>
                )}
                {loading ? (
                    <View style={styles.orderImage}>
                        <Loader />
                    </View>
                ) : (
                    <View style={styles.imageHeader}>
                        <View
                            style={{
                                width: '100%',
                            }}>
                            <TouchableOpacity
                                disabled={!editable}
                                onPress={() => {
                                    setModalVisible(true);
                                }}
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
                                {image?.uri ? (
                                    <ImageComponent
                                        style={styles.orderImage}
                                        source={{
                                            uri: image?.uri,
                                        }}
                                    />
                                ) : (
                                    <Ionicons size={FONT_SIZE.X_LARGE} name="camera-outline" color={COLORS.primaryThemeColor} />
                                )}
                            </TouchableOpacity>
                            {(image?.uri || image?.FileData || image.FileContent) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        image?.uri
                                            ? FileViewer.open(image?.uri)
                                            : downloadAndOpenFile(image?.FileData || image.FileContent, image?.FileName);
                                    }}
                                    style={{
                                        marginTop: SPACING.SMALL,
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: SPACING.X_SMALL,
                                        }}>
                                        <IconComponent
                                            type={ICON_TYPE.AntDesign}
                                            name="eye"
                                            style={{ fontSize: 20, color: theme.colors.primaryThemeColor }}
                                        />
                                        <TextComponent
                                            type={FONT_TYPE.BOLD}
                                            style={{
                                                marginLeft: SPACING.X_SMALL,
                                            }}
                                            color={theme.colors.primaryThemeColor}>
                                            View Image
                                        </TextComponent>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <View
                                style={{
                                    paddingTop: SPACING.NORMAL,
                                }}>
                                <InputWithLabel
                                    name={'comments'}
                                    onChange={(key, value) => {
                                        setComments(value);
                                    }}
                                    noPadding
                                    label={'Comments'}
                                    placeholder="Enter Comments"
                                    editable={editable}
                                    value={comments}
                                    style={{
                                        ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                                    }}
                                />
                            </View>
                        </View>
                        {/* ) : null} */}
                    </View>
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

export default OKPicker;

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
