import { ButtonComponent } from 'components';
import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';

const InputFilePicker = ({ ListData = [], maxLimit = 10, isEditable = false, title = '', handleInputChange = () => {} }) => {
    const navigation = useNavigation();
    const [fileList, setFileList] = useState([]);
    const [disableBtn, setDisableBtn] = useState(false);

    useEffect(() => {
        setFileList(ListData?.length ? ListData : []);
    }, [ListData]);

    useLayoutEffect(() => {
        setDisableBtn(fileList?.length >= maxLimit);
    }, [fileList, maxLimit]);

    const handleFilePress = () => {
        navigation.navigate(ROUTES.FILE_UPLOAD_SCREEN, {
            fileList,
            maxLimit,
            title,
            onSave: (updatedList) => {
                setFileList(updatedList);
                handleInputChange(updatedList);
            },
        });
    };

    return (
        <TouchableOpacity
            style={[styles.fileBox, { backgroundColor: isEditable ? COLORS.inputBG : COLORS.whiteGrey, justifyContent: 'center' }]}
            activeOpacity={isEditable ? 0.5 : 1}
            onPress={() => {
                if (isEditable) {
                    handleFilePress();
                }
            }}>
            <View>
                <Text style={[styles.fileText]}>{fileList.length ? `${fileList.length} Files Uploaded` : 'Upload File'}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fileBox: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
    },
    fileText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: COLORS.headerText,
    },
});

export default InputFilePicker;