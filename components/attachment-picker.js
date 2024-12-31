import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, STATUS_CODES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import TextComponent from './text';
import IconComponent from './icon-component';
import Loader from './loader';
import ImageComponent from './image-component';

const IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];

const TYPE_ICON = {
    jpeg: 'file-photo-o',
    png: 'file-photo-o',
    pdf: 'file-pdf-o',
    msword: 'file-word-o',
    docx: 'file-word-o',
    doc: 'file-word-o',
    xls: 'file-excel-o',
    xlsx: 'file-excel-o',
    ppt: 'file-powerpoint-o',
    pptx: 'file-powerpoint-o',
    txt: 'file-text-o',
    zip: 'file-archive-o',
    rar: 'file-archive-o',
    csv: 'file-excel-o',
    json: 'file-code-o',
    mp3: 'file-audio-o',
    mp4: 'file-video-o',
    mov: 'file-video-o',
    wav: 'file-audio-o',
    avi: 'file-video-o',
    flv: 'file-video-o',
    mkv: 'file-video-o',
    webm: 'file-video-o',
    ogg: 'file-audio-o',
    wmv: 'file-video-o',
    wma: 'file-audio-o',
    mpeg: 'file-audio-o',
    aac: 'file-audio-o',
    m4a: 'file-audio-o',
    jpg: 'file-photo-o',
    gif: 'file-photo-o',
    bmp: 'file-photo-o',
    webp: 'file-photo-o',
    svg: 'file-photo-o',
    ico: 'file-photo-o',
    tiff: 'file-photo-o',
    psd: 'file-photo-o',
    ai: 'file-photo-o',
    eps: 'file-photo-o',
    sketch: 'file-photo-o',
};

function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() : '';
}

const AttachmentPicker = ({ title = '', label = '', handleAttachments, required, ConcernID, isEditPage = false, concernDetails }) => {
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const downloadAndOpenFile = async (base64Data, filename) => {
        try {
            const base64FilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

            // Cleaning the base64 data to remove any metadata
            const cleanedBase64Data = base64Data?.replace(/^data:.*?;base64,/, '');

            // Writing the file to the local file system
            await RNFS.writeFile(base64FilePath, cleanedBase64Data, 'base64');

            // Opening the file with FileViewer
            await FileViewer.open(base64FilePath);
        } catch (error) {
            console.error('🚀 ~ downloadAndOpenFile ~ error:', error);
        }
    };

    const getAttachments = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
            formData.append(APP_VARIABLES.Type, 3);
            const { Data } = await postAPI(`${API_URL.GET_ATTACHMENT_PICKER}`, formData);
            const formattedImages = Data?.map(attachment => ({
                FileName: attachment?.FileName || '',
                FileContent: attachment?.FileData,
                FileId: attachment?.FileId,
                ConcernId: ConcernID,
                uri: attachment?.FileData,
                extension: getFileExtension(attachment?.FileName),
            }));
            const formattedAttachments = (Data || []).map(attachment => ({
                FileName: attachment?.FileName || '',
                FileContent: attachment?.FileData,
            }));
            if (formattedImages?.length > 0) {
                handleAttachments?.(formattedAttachments);
            }
            setLoading(false);
            setAttachments(formattedImages);
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    const handleDeleteAttachments = async FileId => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append(APP_VARIABLES.FileId, FileId);
            const { Data } = await postAPI(`${API_URL.DELETE_PROBLEM_IMAGES}`, formData);
            if (Data?.Success) {
                console.log('🚀 ~ handleDeleteAttachments ~ Data:', Data);
                setLoading(false);
                getAttachments();
            }
        } catch (err) {
            setLoading(false);
            console.log('🚀 ~ CustomerPickerComponent ~ err:', err);
        }
    };

    useEffect(() => {
        if (ConcernID) {
            getAttachments();
        }
    }, [ConcernID]);

    const handleClickDeleteAttachment = (item, id) => {
        if (item?.FileId) {
            handleDeleteAttachments(item?.FileId);
        } else {
            const tempAttachments = attachments?.filter(attachment => attachment?.file_id !== item?.file_id);
            setAttachments(tempAttachments);
        }
    };

    useEffect(() => {
        if (!Boolean(ConcernID) || isEditPage || concernDetails?.StatusID === STATUS_CODES.DraftConcern) {
            const formattedAttachments = (attachments || []).map(attachment => ({
                FileName: attachment?.FileName || '',
                FileContent: attachment?.FileContent,
            }));
            handleAttachments?.(formattedAttachments);
        }
    }, [attachments]);

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                fileType: [DocumentPicker.types.images, DocumentPicker.types.pdf, DocumentPicker.types.docx],
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
            });
            const base64 = await RNFS.readFile(decodeURIComponent(response[0]?.fileCopyUri), 'base64');

            const file = {
                file_id: uuid.v4(),
                uri: response[0]?.uri,
                FileName: response[0]?.name || '',
                FileContent: base64,
                extension: response[0]?.type?.split('/')[1],
                type: 'LOCAL',
            };
            setAttachments([...attachments, file]);
        } catch (err) {
            console.warn(err);
        }
    }, [attachments]);

    const renderItem = ({ item, index }) => {
        console.log('🚀 ~ renderItem ~ item:', item?.extension);
        if (item.empty) {
            return <View key={index} style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    item.type === 'LOCAL' ? FileViewer.open(item?.uri) : downloadAndOpenFile(item?.FileData || item.FileContent, item?.FileName);
                }}
                activeOpacity={0.7}
                key={index}
                style={{
                    width: '100%',
                    margin: SPACING.X_SMALL,
                    borderWidth: 1,
                    borderColor: theme.mode.borderColor,
                    backgroundColor: COLORS.white,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: SPACING.SMALL,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {IMAGE_TYPES.includes(item?.extension) ? (
                        <ImageComponent
                            source={{ uri: item?.uri || item?.FileContent }}
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 3,
                                marginRight: SPACING.SMALL,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ccc', // Placeholder background color for non-image files
                                marginRight: SPACING.SMALL,
                            }}>
                            <IconComponent name={TYPE_ICON[item?.extension]} type={ICON_TYPE.FontAwesome} size={20} />
                        </View>
                    )}
                    <TextComponent>{item?.FileName}</TextComponent>
                </View>

                {!item?.ConcernId && (
                    <TouchableOpacity
                        onPress={() => {
                            handleClickDeleteAttachment(item, index);
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
                )}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.issueimageConatiner}>
                {(label || title) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                            {label || title}
                            {required && (
                                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                                    *
                                </TextComponent>
                            )}
                        </TextComponent>
                        {(isEditPage || !ConcernID) && (
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
                        )}
                    </View>
                )}
                {loading ? (
                    <View style={styles.orderImage}>
                        <Loader />
                    </View>
                ) : !!attachments?.length ? (
                    <View>{attachments?.map((image, index) => renderItem({ item: image, index }))}</View>
                ) : (
                    <View style={{ paddingTop: SPACING.X_SMALL }}>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} color={COLORS.searchText}>
                            No attachment found
                        </TextComponent>
                    </View>
                )}
            </View>
        </>
    );
};

export default AttachmentPicker;

const styles = StyleSheet.create({
    title: {
        marginTop: 5,
    },
    issueimageConatiner: {
        padding: SPACING.NORMAL,
    },
    orderImage: {
        width: '100%',
        height: 55,
        borderRadius: 10,
        overflow: 'hidden',
    },
    item: {
        margin: SPACING.SMALL,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
});
