import React, { useState, useEffect } from 'react';
import { Pressable, ToastAndroid } from 'react-native';
import { IconComponent } from 'components';
import { ICON_TYPE, TOAST_STATUS } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { postAPI } from 'global/api-helpers';
import { useAppContext } from 'contexts/app-context';

const Notifier = ({ StaticFormDataValue, staticObj, getDynamicFormData, ConcernID }) => {
    const { theme } = useTheme();
    const [updatingValue, setUpdatingValue] = useState(false);
    const { sites } = useAppContext();
    const [checked, setChecked] = useState(StaticFormDataValue?.[staticObj?.ColumnDefinition] === 'Accept');
    
    // useEffect(() => {
    //     setChecked(StaticFormDataValue?.[staticObj?.ColumnDefinition] === 'Accept');
    // }, [StaticFormDataValue?.[staticObj?.ColumnDefinition]]);

    const handleSubmitFormData = async value => {
        try {
            setUpdatingValue(true);
            const URL = '/PhaseAction/Update8DMichelinStaticFields';
            const formData = new FormData();
            formData.append('UpdateColumn', staticObj?.ColumnDefinition);
            formData.append('UpdateValue', value ? 1 : 0);
            formData.append('ConcernID', ConcernID);
            formData.append('UserId', sites?.selectedSite?.UserId);

            const formRequest = formData;
            const res = await postAPI(URL, formRequest);
            // toast('Success', 'Notification sent to user...', TOAST_STATUS.SUCCESS, 1500);
            if (res.Success) {
                getDynamicFormData();
            }
            setUpdatingValue(false);
        } catch (err) {
            setUpdatingValue(false);
            err && ToastAndroid.show(err?.toString(), ToastAndroid.SHORT);
            console.log('🚀 ~ handleSubmitFormData ~ err:', err?.toString());
        }
    };

    const handlePress = value => {
        // if (!notificationSent) {
        //     toast('Success', 'Notification sent to user...', TOAST_STATUS.SUCCESS, 1500);
        //     setNotificationSent(true);
        // }
        setChecked(value);
        handleSubmitFormData(value);
    };

    return (
        <Pressable onPress={() => handlePress(!checked)}>
            <IconComponent
                name={checked ? 'check-square' : 'square'}
                size={20}
                color={checked ? theme.colors.primaryThemeColor : theme.colors.defaultIconColor}
                type={ICON_TYPE.Feather}
            />
        </Pressable>
    );
};

export default Notifier;
