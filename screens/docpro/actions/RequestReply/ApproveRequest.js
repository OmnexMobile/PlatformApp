import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextComponent from '../../../../components/text';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';

const ApproveRequest = ({ setpendingListStatus, setisActionDetailsOn, ListStatus }) => {
    const [checked, setChecked] = useState('reject');
    const [text, setText] = useState('');

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', height: 50 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setpendingListStatus(false);
                        }}>
                        <Icon name="home" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
                    </TouchableOpacity>

                    <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>
                    <TouchableOpacity
                        onPress={() => {
                            setisActionDetailsOn(false);
                        }}>
                        <Icon name="list" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
                    </TouchableOpacity>
                    <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>

                    <TextComponent type={FONT_TYPE.BOLD} color={COLORS.black} fontSize={FONT_SIZE.LARGE} numberOfLines={1} style={{ marginLeft: 10 }}>
                        Approve Request
                    </TextComponent>
                </View>
                <View style={styles.container}>
                    {/* Site Info */}
                    <Text style={styles.header}>Site</Text>
                    <Text style={styles.subHeader}>Corporate</Text>

                    {/* Radio Buttons */}
                    <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={styles.radioItem}>
                                <RadioButton value="approve" color="#00c3d2" />
                                <Text style={styles.radioText}>Approve</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton value="reject" color="#00c3d2" />
                                <Text style={styles.radioText}>Reject</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                    {/* Comments Input */}
                    <TextInput style={styles.textInput} multiline placeholder="Enter your comments here..." value={text} onChangeText={setText} />

                    {/* Reference Attachments */}
                    <Text style={styles.referenceAttachments}>Reference Attachments: No Reference Attachments</Text>
                </View>
                {ListStatus == 'RequestsNeedingApproval'? <View style={styles.footerView}>
                    {ListStatus == 'PendingRequestList' ? null : (
                        <TouchableOpacity style={styles.footerOpacity}>
                            <Icon name="save" size={24} color="white" style={{ marginLeft: 15 }}></Icon>
                            <TextComponent
                                type={FONT_TYPE.BOLD}
                                color={COLORS.white}
                                fontSize={FONT_SIZE.NORMAL}
                                numberOfLines={1}
                                style={{ marginLeft: 10 }}>
                                Submit
                            </TextComponent>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.footerOpacity}
                        onPress={() => {
                            // setalertVisible(true);
                        }}>
                        <Icon name="file-pdf-o" size={24} color="white" style={{ marginLeft: 15 }}></Icon>
                        <TextComponent
                            type={FONT_TYPE.BOLD}
                            color={COLORS.white}
                            fontSize={FONT_SIZE.NORMAL}
                            numberOfLines={1}
                            style={{ marginLeft: 10 }}>
                            Preview
                        </TextComponent>
                    </TouchableOpacity>
                </View> : null }
               
            </>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginBottom: 8,
        color: 'black',
    },
    subHeader: {
        fontSize: 18,
        // marginVertical: 8,
        color: 'black',
        marginBottom: 10,
    },

    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    radioText: {
        fontSize: 20,
    },
    textInput: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    referenceAttachments: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
    },
    footerView: {
        height: 100,
        backgroundColor: 'rgba(237,242,246,255)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerOpacity: {
        flex: 1,
        height: 50,
        backgroundColor: '#00c3d2',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
});

export default ApproveRequest;
