import React, { useState } from 'react';
import { Pressable, ToastAndroid } from 'react-native';
import { IconComponent } from 'components';
import { ICON_TYPE, TOAST_STATUS } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { toast } from 'helpers/utils';
import { postAPI } from 'global/api-helpers';

const NotifyUser = ({ StaticFormDataValue, staticObj, setSelectedData, getDynamicFormData }) => {
    const { theme } = useTheme();
    const [updatingValue, setUpdatingValue] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);

    const handleSubmitFormData = async () => {
        try {
            setUpdatingValue(true);
            const URL = selectedData?.rowData?.SaveAPIEndPoint || '';
            const formData = new FormData();
            formData.append('UpdateColumn', selectedData?.ColumnDefinition);
            formData.append('UpdateValue', data?.Value);
            formData.append('ConcernID', ConcernID);

            const formRequest = formData;
            const res = await postAPI(URL, formRequest);
            if (res.Success) {
                getDynamicFormData();
            }
            setUpdatingValue(false);
        } catch (err) {
            setUpdatingValue(false);
            err && ToastAndroid.show(err, ToastAndroid.SHORT);
            console.log('🚀 ~ handleSubmitFormData ~ err:', err);
        }
    };

    const handlePress = () => {
        if (!notificationSent) {
            toast('Success', 'Notification sent to user...', TOAST_STATUS.SUCCESS, 1500);
            setNotificationSent(true);
        }
    };

    return (
        <Pressable onPress={handlePress}>
            <IconComponent
                name={notificationSent ? 'check-square' : 'square'}
                size={20}
                color={notificationSent ? theme.colors.primaryThemeColor : theme.colors.defaultIconColor}
                type={ICON_TYPE.Feather}
            />
        </Pressable>
    );
};

export default NotifyUser;
