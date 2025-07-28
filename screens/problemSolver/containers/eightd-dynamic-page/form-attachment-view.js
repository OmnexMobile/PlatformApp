import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { TextComponent } from 'components';
import { APP_VARIABLES, FONT_TYPE } from 'constants/app-constant';
import { FONT_SIZE } from 'constants/theme-constants';
import { postAPI } from 'global/api-helpers';
import API_URL from'global/ApiUrl';

const FormAttachmentView = ({ style, text, ConcernID, formAttachmentId }) => {
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    const downloadAndOpenFile = async (base64Data, filename) => {
        try {
            const base64FilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
            const cleanedBase64Data = base64Data?.replace(/^data:.*?;base64,/, '');
            await RNFS.writeFile(base64FilePath, cleanedBase64Data, 'base64');
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
            formData.append(APP_VARIABLES.FileId, formAttachmentId);
            formData.append(APP_VARIABLES.Type, 4);
            const { Data } = await postAPI(`${API_URL.GET_PROBLEM_DESCRIPTION_ATTACHMENT}`, formData);
            console.log('🚀 ~ getAttachments ~ Data:', Data);
            const formattedImages = Data?.map(attachment => ({
                FileName: attachment?.FileName || '',
                FileContent: attachment?.FileData,
            }));
            setLoading(false);
            setAttachments(formattedImages);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        formAttachmentId && getAttachments();
    }, []);
    console.log('🚀 ~ useEffect ~ formAttachmentId:attachments?.[0]?.FileData', attachments?.[0]?.FileData, formAttachmentId);

    return (
        <Pressable disabled={loading || !attachments?.length} onPress={() => formAttachmentId && downloadAndOpenFile(attachments?.[0]?.FileContent, attachments?.[0]?.FileName)}>
            <TextComponent style={style} numberOfLines={8} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                {text}
            </TextComponent>
        </Pressable>
    );
};

export default FormAttachmentView;
