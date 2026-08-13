// components/UpdateModal.js
import { COLORS } from 'constants/theme-constants';
import React from 'react';
import { Alert } from 'react-native';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';
import IconF from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { showErrorMessage } from 'helpers/utils';
import { showMessage } from 'react-native-flash-message';

const NotificationModal = ({ visible, data, setNotificationData = () => {} }) => {
    console.log(data, 'data in modal');
    const navigation = useNavigation();
    const onClose = () => {
        setNotificationData({
            showModal: false,
            remoteMessage: null,
        });
    };
    const handleSnooze = async () => {
        const payload = {
            InspectionId: data?.data?.ICInspectionScheduleID,
        };
        const APIData = await postAPI(`${ApiUrl.IC_NOTIFICATION_SNOOZE}`, payload);
        if (APIData?.Success) {
            showMessage({
                message: `${APIData?.Message}`,
                backgroundColor: COLORS.SUCCESS,
                color: COLORS.white,
                duration: 1500,
            });
            onClose();
        } else {
            showMessage({
                message: `${APIData?.Message}`,
                backgroundColor: COLORS.ERROR,
                color: COLORS.white,
                duration: 1500,
            });
        }
    };
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                        <View style={styles.titleContainer}>
                            <IconF name="alert-triangle" size={25} color={COLORS.WARNING} />
                            {/* <Text style={styles.title}>Inspection Alert !</Text> */}
                            <Text style={styles.title}> {data?.notification?.title} !</Text>
                        </View>
                        <TouchableOpacity style={styles.iconContainer} onPress={onClose}>
                            <IconF name="x" size={25} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: COLORS.notificationShadow, marginBottom: 10, padding: 10, borderRadius: 10 }}>
                        {/* <Text style={styles.message}>Time for Inspection</Text>
                        <View style={{}}>
                            <Text style={styles.content}>
                                <Text style={styles.keystyle}>Line 3 :</Text> Injection Molding{' '}
                            </Text>
                            <Text style={styles.content}>
                                <Text style={styles.keystyle}>Lot Number :</Text> 87849{' '}
                            </Text>
                        </View> */}
                        <View
                            style={{
                                marginVertical: 10,
                                borderBottomColor: '#5d5c5c',
                                borderBottomWidth: 1,
                                width: '100%',
                                borderTopColor: '#5d5c5c',
                                borderTopWidth: 1,
                                paddingVertical: 10,
                            }}>
                            {/* <Text style={styles.content}>
                                <Text style={styles.keystyle}> Next Inspection Due : </Text>
                                <Text>Inspect 5 samples now</Text>{' '}
                            </Text> */}
                            <Text style={styles.message}>Time for Inspection</Text>
                            <Text style={styles.lastMessage}>{`${data?.notification?.body?.split('|')[0]}`}</Text>
                            <Text style={styles.lastMessage}>{`${data?.notification?.body?.split('|')[1]}`}</Text>
                            <Text style={styles.lastMessage}>Complete All Measurements for Each sample </Text>
                        </View>
                    </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.buttonUpdate}
                            onPress={() => {
                                navigation.navigate(ROUTES.NOTIFICATION_SCREEN, {
                                    payload: {
                                        ScheduleId: data?.data?.ICInspectionScheduleID,
                                        UserId: data?.data?.UserId,
                                        SiteId: data?.data?.SiteId,
                                        ProcessId: data?.data?.ProcessId,
                                        DeviceId: data?.data?.DeviceId,
                                    },
                                    FrequencyId: data?.data?.FrequencyId,
                                });
                                onClose();
                            }}>
                            <Text style={styles.textUpdate}>Start Inspection</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonLater}
                            onPress={() => {
                                handleSnooze();
                            }}>
                            <Text style={styles.textLater}>Snooze 10 Min</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 10,
        color: COLORS.black,
    },
    message: {
        fontSize: 17,
        textAlign: 'center',
        color: '#000',
        borderBottomColor: '#5d5c5c',
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingBottom: 5,
        alignSelf: 'center',
    },
    keystyle: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: '#000',
    },
    content: {
        fontSize: 16,
        textAlign: 'center',
        color: '#504d4d',
    },
    lastMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#504d4d',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonLater: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
    },
    buttonUpdate: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.apptheme,
        alignItems: 'center',
    },
    textLater: { color: '#555', fontWeight: '600' },
    textUpdate: { color: '#fff', fontWeight: '600' },
    titleContainer: {
        flex: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        flex: 1,
    },
});
