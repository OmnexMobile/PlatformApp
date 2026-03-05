import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ModalComponent from './modal-component';

const AttachmentSelectionModal = ({
    visible = false,
    title = 'Make your selection',
    takePhotoText = 'Take a photo',
    browseText = 'Browse files',
    cancelText = 'Cancel',
    onTakePhoto = () => {},
    onBrowseFiles = () => {},
    onCancel = () => {},
    firstOptionText,
    secondOptionText,
    onFirstOptionPress,
    onSecondOptionPress,
    showFirstOption = true,
    showSecondOption = true,
    showFirstOptionIcon = true,
    showSecondOptionIcon = true,
    firstOptionIcon = 'camera',
    secondOptionIcon = 'folder',
    actionTextColor = '#000000',
}) => {
    const firstText = firstOptionText || takePhotoText;
    const secondText = secondOptionText || browseText;
    const handleFirstOptionPress = onFirstOptionPress || onTakePhoto;
    const handleSecondOptionPress = onSecondOptionPress || onBrowseFiles;

    const options = [];
    if (showFirstOption) {
        options.push({
            key: 'first',
            text: firstText,
            onPress: handleFirstOptionPress,
            showIcon: showFirstOptionIcon,
            iconName: firstOptionIcon,
        });
    }
    if (showSecondOption) {
        options.push({
            key: 'second',
            text: secondText,
            onPress: handleSecondOptionPress,
            showIcon: showSecondOptionIcon,
            iconName: secondOptionIcon,
        });
    }

    return (
        <ModalComponent modalVisible={visible} onRequestClose={onCancel} onBackdropPress={onCancel} modalBackgroundColor="rgba(0,0,0,0.55)">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{title}</Text>
                    </View>

                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option.key}
                            onPress={option.onPress}
                            style={[styles.actionButton, index === options.length - 1 && styles.lastOption]}>
                            <View style={[styles.actionContent, !option.showIcon && styles.actionContentCentered]}>
                                {option.showIcon ? <Icon name={option.iconName} size={22} color="#000000" /> : null}
                                <Text style={[styles.actionText, { color: actionTextColor }, !option.showIcon && styles.actionTextNoIcon]}>
                                    {option.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>{cancelText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalComponent>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '86%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#123C95',
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'OpenSans-SemiBold',
    },
    actionButton: {
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    lastOption: {
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionContentCentered: {
        justifyContent: 'center',
    },
    actionText: {
        color: '#000000',
        fontSize: 15,
        marginLeft: 14,
        fontFamily: 'OpenSans-Regular',
    },
    actionTextNoIcon: {
        marginLeft: 0,
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelText: {
        color: '#FF0000',
        fontSize: 16,
        fontFamily: 'OpenSans-SemiBold',
    },
});

export default AttachmentSelectionModal;
