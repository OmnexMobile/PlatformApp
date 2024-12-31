import React, { useEffect, useState, useRef } from 'react';
import { PermissionsAndroid, Platform, TouchableOpacity, View, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import { Modalize } from 'react-native-modalize';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import useTheme from 'theme/useTheme';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, INPUTS_CONSTANTS } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { useAppContext } from 'contexts/app-context';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import ModalComponent from './modal-component';
import TextComponent from './text';
import IconComponent from './icon-component';
import DropdownComponent from './dropdown';
import DatePickerComponent from './date-picker';
import InputWithLabel from './input-with-label';
import ButtonComponent from './button-component';
import ImageGallery from './image-gallery';

// Function to check if the value is a Moment object and then change its format
const formatMomentObject = value => {
    // Check if the value is a Moment object
    if (moment.isMoment(value)) {
        // Convert the Moment object to the desired format
        return value.format('YYYY-MM-DDTHH:mm:ssZ');
    } else {
        // If it's not a Moment object, return the original value or handle it as needed
        return value;
    }
};

const ADD_CAPABILITIES = ['InterimAction_ActionDescription'];
const STATUS_DROPDOWNS = [
    {
        ColumnDefinition: 'StatusName',
        Value: 'ActionStatus',
        Field1: 'StatusName',
        Field2: 'StatusId',
    },
    {
        Key: 'InterimAction_Responsibility',
        Value: 'ResponsibilityMember',
        Field1: 'ResponsibilityMemberName',
        Field2: 'ResponsibilityMemberId',
    },
    {
        ColumnDefinition: 'PreventReocurrance_Responsibility',
        Value: 'ResponsibilityMember',
        Field1: 'ResponsibilityMemberName',
        Field2: 'ResponsibilityMemberId',
    },
    {
        ColumnDefinition: 'PermanentCorrective_Responsibility',
        Value: 'ResponsibilityMember',
        Field1: 'ResponsibilityMemberName',
        Field2: 'ResponsibilityMemberId',
    },
    {
        ColumnDefinition: 'InterimAction_Status',
        Value: 'ActionStatus',
        Field1: 'StatusName',
        Field2: 'StatusId',
    },
    {
        ColumnDefinition: 'PreventReocurrance_Status',
        Value: 'ActionStatus',
        Field1: 'StatusName',
        Field2: 'StatusId',
    },
    {
        ColumnDefinition: 'PermanentCorrective_Status',
        Value: 'ActionStatus',
        Field1: 'StatusName',
        Field2: 'StatusId',
    },
];

const WrapperDropDown = ({ input, onChange, dropdownData, setSelectedData, selectedData }) => {
    const [data, setData] = useState([]);
    const [newValue, setNewValue] = useState('');
    const [addingValue, setAddingValue] = useState(false);
    const [addNewValueModal, setAddNewValueModal] = useState(false);
    const { sites } = useAppContext();
    // const addNewDropdownValueRef = useRef();
    const { theme } = useTheme();

    // const TypeId = 'Interim_ActionDescription';
    const TypeId = selectedData?.Key;

    const getData = async newValueId => {
        const isStatus = dropdownData?.Key === 'InterimAction_Status';
        try {
            const isDefaultDD = STATUS_DROPDOWNS.find(dd => dd?.Key === dropdownData?.Key);
            console.log('🚀 ~ getData ~ isDefaultDD:', isDefaultDD);

            const URL = isDefaultDD ? API_URL.DROPDOWN_LIST : `${API_URL.GET_ACTION_DESCRIPTION}?TypeId=${TypeId}&ClassificationId=1`;

            const formData = new FormData();
            formData.append(APP_VARIABLES.SITE_ID, sites?.selectedSite?.SiteId);

            const res = isDefaultDD ? await postAPI(URL, formData) : await postAPI(URL);
            const data = isDefaultDD ? res?.Data?.[isDefaultDD?.Value] || [] : res?.Data || [];
            const dropdownDD = data.map(data => ({
                label: isDefaultDD ? data?.[isDefaultDD?.Field1] : data?.ActionName,
                value: isDefaultDD ? data?.[isDefaultDD?.Field2] : data?.ActionID,
            }));

            await setData([...dropdownDD]);
            if (newValueId) {
                // setTimeout(() => {
                onChange(newValueId);
                setSelectedData({ ...selectedData, Value: newValueId });
                // }, 1000);
            }
        } catch (err) {
            console.log('🚀 ~ file: radio-button.js:22 ~ getData ~ err', err);
        }
    };

    useEffect(() => {
        getData();
    }, [sites?.selectedSite?.SiteId]);

    const handleSaveNewValue = async () => {
        // const isStatus = data?.Key === 'InterimAction_Status';
        try {
            setAddingValue(true);
            const URL = API_URL.SAVE_NEW_ACTION_DESCRIPTION;
            const formData = new FormData();
            formData.append('ActionUsageId', dropdownData?.UsageId);
            formData.append('ActionType', dropdownData?.PhaseId);
            formData.append('ActionDescription', newValue);
            const res = await postAPI(URL, formData);
            const data = res?.Data || [];
            if (res?.Success) {
                getData(data);
                setNewValue('');
                setAddNewValueModal(false);
            }
            setAddingValue(false);
            // setData(
            //     data.map(data => ({
            //         label: isStatus ? data?.StatusCode : data?.ActionName,
            //         value: isStatus ? data?.StatusID : data?.ActionID,
            //     })),
            // );
        } catch (err) {
            setAddingValue(false);
            console.log('🚀 ~ file: radio-button.js:22 ~ getData ~ err', err);
        }
    };

    return (
        <View
            style={{
                flex: 1,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                }}>
                <View
                    style={{
                        flex: 1,
                    }}>
                    <DropdownComponent
                        containerStyle={{ padding: 0 }}
                        {...{
                            label: input?.label,
                            value: selectedData?.Value,
                            onChange: value => {
                                setSelectedData({ ...selectedData, Value: value });
                                onChange(value);
                            },
                            data,
                            ...input,
                            search: true,
                        }}
                    />
                </View>
                {ADD_CAPABILITIES.includes(dropdownData?.Key) && (
                    <TouchableOpacity
                        style={{
                            borderRadius: SPACING.SMALL,
                            alignItems: 'center',
                            padding: SPACING.SMALL,
                            justifyContent: 'center',
                            backgroundColor: theme.colors.primaryThemeColor,
                            marginLeft: SPACING.SMALL,
                            alignSelf: 'center',
                        }}
                        // onPress={() => setSelectedData({ ...selectedData, Value: 158 })}
                        onPress={() => {
                            // addNewDropdownValueRef?.current?.open();
                            setAddNewValueModal(true);
                        }}>
                        <IconComponent type={ICON_TYPE.AntDesign} name="plus" style={{ fontSize: 20, color: COLORS.white }} />
                    </TouchableOpacity>
                )}
            </View>

            <ModalComponent
                modalVisible={addNewValueModal}
                onRequestClose={() => setAddNewValueModal(false)}
                modalBackgroundColor={COLORS.transparentGrey}
                transparent>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.transparentGrey,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={{ padding: SPACING.NORMAL, backgroundColor: COLORS.white, width: '90%', borderRadius: SPACING.SMALL }}>
                        <TextInput
                            placeholder="Enter new value"
                            onChangeText={text => setNewValue(text)}
                            value={newValue}
                            style={{
                                fontSize: FONT_SIZE.LARGE,
                                fontFamily: 'ProximaNova-Regular',
                                color: theme.mode.textColor,
                                borderWidth: 1,
                                borderColor: theme.mode.borderColor,
                                borderRadius: SPACING.SMALL,
                                padding: SPACING.SMALL,
                            }}
                            // returnKeyType="done"
                            // onSubmitEditing={handleSaveNewValue}
                        />
                        <View style={{ paddingTop: SPACING.NORMAL }}>
                            <ButtonComponent loading={addingValue} disabled={!!!newValue} onPress={handleSaveNewValue}>
                                Add
                            </ButtonComponent>
                        </View>
                    </View>
                </View>
            </ModalComponent>

            {/* <Modalize
                ref={addNewDropdownValueRef}
                withHandle={false}
                adjustToContentHeight
                avoidKeyboardLikeIOS={Platform.select({ ios: true, android: true })}
                keyboardAvoidingOffset={SPACING.LARGE}
                HeaderComponent={() => (
                    <View
                        style={{
                            padding: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity onPress={() => addNewDropdownValueRef?.current?.close()}>
                            <IconComponent
                                type={ICON_TYPE.AntDesign}
                                name="closecircleo"
                                style={{ fontSize: 25, color: COLORS.themeBlack, marginRight: SPACING.X_SMALL }}
                            />
                        </TouchableOpacity>
                        <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                            Add New Value
                        </TextComponent>
                        <View />
                    </View>
                )}>
                <View
                    style={{
                        flex: 1,
                    }}>
                    <View style={{ padding: SPACING.NORMAL, paddingBottom: 0 }}>
                        <TextInput
                            autoFocus
                            placeholder="Enter new value"
                            onChangeText={text => setNewValue(text)}
                            value={newValue}
                            style={{
                                fontSize: FONT_SIZE.LARGE,
                                fontFamily: 'ProximaNova-Regular',
                                color: theme.mode.textColor,
                                borderWidth: 1,
                                borderColor: theme.mode.borderColor,
                                borderRadius: SPACING.SMALL,
                                padding: SPACING.SMALL,
                            }}
                        />
                    </View>
                    <View style={{ padding: SPACING.NORMAL }}>
                        <ButtonComponent onPress={handleSubmitFormData}>Submit</ButtonComponent>
                    </View>
                </View>
            </Modalize> */}
        </View>
    );
};

const TITLE_API_KEY_MAPPING = {
    'Implement and Verify Interim Action': 'SaveInterimAction',
    'Find and Verify Root Cause': 'SaveRootCauseAction',
    'Select Permanent Corrective Actions': 'SaveCorrectiveAction',
    'Implement Permanent Corrective Actions': 'SavePermanentCorrectiveAction',
    'Prevent System Problems': 'SavePreventReocurranceAction',
};

const TITLE_FIELD_MAPPING = {
    'Implement and Verify Interim Action': {
        InterimAction_DueDate: null,
        InterimAction_ActualDate: null,
        InterimAction_Status: null,
        InterimAction_Responsibility: null,
        InterimAction_Responsibility: null,
    },
    'Find and Verify Root Cause': {
        RootCause_RootCauseDescription: null,
        RootCause_VerificationDate: null,
        RootCause_RootCauseDescription: null,
        RootCause_RootCauseCategory: null,
        RootCauseAction_Responsibility: null,
    },
    'Select Permanent Corrective Actions': {
        CorrectiveAction_Contribution: null,
        CorrectiveAction_VerificationDate: null,
        CorrectiveAction_ActionDescription: null,
        // CorrectiveAction_CorrectiveActionCategory: null,
        // CorrectiveAction_Responsibility: null,
    },
    'Implement Permanent Corrective Actions': 'ActionName',
    'Prevent System Problems': 'ActionName',
};

const EightDDynamicInputModal = ({ selectedData, setSelectedData, ConcernID, getDynamicFormData }) => {
    console.log('🚀 ~ EightDDynamicInputModal ~ allFields:', selectedData);
    const { theme } = useTheme();
    const [data, setData] = useState(selectedData);
    const [updatingValue, setUpdatingValue] = useState(false);
    const [fixedImages, setFixedImages] = useState([]);
    const cameraPickerRef = useRef();
    const { sites } = useAppContext();

    useEffect(() => {
        setData(selectedData);
    }, [selectedData]);

    if (!selectedData) return null;

    const closeModal = () => setSelectedData(null);

    const handleSubmitFormData = async () => {
        // console.log('🚀 ~ handleSubmitFormData ~ request:', selectedData?.rowData?.DeleteAPIEndPoint, selectedData?.rowData?.SaveAPIEndPoint);

        try {
            setUpdatingValue(true);
            if (data?.Type === INPUTS_CONSTANTS.FILE_UPLOAD) {
                const URL = API_URL.SAVE_EIGHTD_ATTACHMENT;
                const request = {
                    UsageID: selectedData?.UsageId,
                    FileContent: selectedData?.Value?.base64,
                    ConcernID: ConcernID,
                    SiteId: sites?.selectedSite?.SiteId,
                    CreatedBy: sites?.selectedSite?.UserId,
                    Filename: selectedData?.Value?.fileName || uuid.v4(),
                    AttachmentActionType: selectedData?.Key,

                    ...(selectedData?.WhysID && {
                        WhysID: selectedData?.WhysID,
                        PSActionID: selectedData?.PSActionID,
                        RootCauseID: selectedData?.RootCauseID,
                    }),
                };
                // console.log('🚀 ~ handleSubmitFormData ~ request:', selectedData?.Value?.base64);
                const res = await postAPI(URL, request);
                if (res?.Success) {
                    getDynamicFormData();
                    closeModal();
                }
            } else {
                const URL = selectedData?.rowData?.SaveAPIEndPoint || '';
                const formData = new FormData();
                formData.append('UsageId', selectedData?.UsageID);
                formData.append('ConcernID', ConcernID);
                if (selectedData?.WhysID) {
                    formData.append('WhysID', selectedData?.WhysID);
                    formData.append('PSActionID', selectedData?.PSActionID);
                    formData.append('RootCauseID', selectedData?.RootCauseID);
                }

                (selectedData?.ColumnNames).filter(column => column?.ColumnDefinition !== selectedData?.ColumnDefinition).forEach(column => {
                    formData.append(column?.ColumnDefinition, null);
                });

                formData.append(selectedData?.ColumnDefinition, formatMomentObject(selectedData?.Value));
                console.log('🚀 ~ handleSubmitFormData ~ selectedData?.rowData:', selectedData?.ColumnDefinition);

                const formRequest = formData;
                const res = await postAPI(URL, formRequest);
                if (res.Success) {
                    getDynamicFormData();
                    closeModal();
                }
            }
            setUpdatingValue(false);
        } catch (err) {
            console.log('🚀 ~ handleSubmitFormData ~ err:', err);
            setUpdatingValue(false);
            err && ToastAndroid.show(err, ToastAndroid.SHORT);
        }
    };

    const renderInputComponent = () => {
        switch (data?.Type) {
            case INPUTS_CONSTANTS.DROPDOWN:
                return (
                    <WrapperDropDown
                        input={{
                            label: data.Label,
                            name: data.ColumnDefinition,
                        }}
                        dropdownData={data}
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        onChange={(name, value) => setData({ ...data, Value: value })}
                    />
                );
            case INPUTS_CONSTANTS.DATE_PICKER:
                return (
                    <DatePickerComponent
                        containerStyle={{ padding: 0 }}
                        label={data.Label}
                        value={data?.Value}
                        onChange={(name, value) => {
                            setData({ ...data, Value: value });
                            setSelectedData({ ...selectedData, Value: value });
                        }}
                    />
                );
            case INPUTS_CONSTANTS.INPUT:
                return (
                    <InputWithLabel
                        noPadding
                        label={data.Label}
                        onChange={(name, value) => {
                            setData({ ...data, Value: value });
                            setSelectedData({ ...selectedData, Value: value });
                        }}
                        returnKeyType="done"
                        autoFocus
                        onSubmitEditing={handleSubmitFormData}
                    />
                );
            case INPUTS_CONSTANTS.FILE_UPLOAD:
                return (
                    <View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                borderRadius: SPACING.SMALL,
                                alignItems: 'center',
                                padding: SPACING.NORMAL,
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: COLORS.lightGrey,
                            }}
                            onPress={() => cameraPickerRef?.current?.open()}>
                            <IconComponent
                                type={ICON_TYPE.AntDesign}
                                name="upload"
                                style={{ fontSize: 25, color: COLORS.themeBlack, marginRight: SPACING.X_SMALL }}
                            />
                            <TextComponent fontSize={FONT_SIZE.SMALL}>Upload</TextComponent>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    const selectPhotoTapped = async type => {
        const options = {
            quality: 1.0,
            // maxWidth: 200,
            // maxHeight: 200,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                privateDirectory: true,
            },
        };
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'App Camera Permission',
                    message: 'App needs access to your camera ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission given');

                    if (type === 'camera') {
                        launchCamera(options, response => {
                            const file = response?.assets?.[0] || {};
                            if (!!!response?.didCancel) {
                                const tempFixedImages = [
                                    // ...(fixedImages || []),
                                    {
                                        image_id: uuid.v4(),
                                        type: 'LOCAL',
                                        base64: `data:${file?.type};base64,${file?.base64}`,
                                        uri: response.assets[0]?.uri,
                                    },
                                ];
                                setSelectedData({
                                    ...selectedData,
                                    Value: {
                                        base64: file?.base64,
                                        // base64: `data:${file?.type};base64,${file?.base64}`,
                                        fileName: file?.fileName,
                                    },
                                });
                                setFixedImages(tempFixedImages);
                            }
                        });
                    } else {
                        launchImageLibrary(options, response => {
                            const file = response?.assets?.[0] || {};
                            if (!!!response?.didCancel) {
                                const tempFixedImages = [
                                    // ...(fixedImages || []),
                                    {
                                        image_id: uuid.v4(),
                                        type: 'LOCAL',
                                        base64: `data:${file?.type};base64,${file?.base64}`,
                                        uri: response?.assets[0]?.uri,
                                    },
                                ];
                                // const tempFixedImages = fixedImages;
                                // tempFixedImages.push({
                                //     image_id: uuid.v4(),
                                //     type: 'LOCAL',
                                //     base64: `data:${response?.assets?.[0]?.type};base64,${response?.assets?.[0]?.base64}`,
                                //     uri: response?.assets[0]?.uri,
                                // })
                                setSelectedData({
                                    ...selectedData,
                                    Value: {
                                        base64: file?.base64,
                                        fileName: file?.fileName,
                                    },
                                });
                                setFixedImages(tempFixedImages);
                            }
                        });
                    }
                } else {
                    console.log('Camera permission denied');
                }
            } else {
                if (type === 'camera') {
                    launchCamera(options, response => {
                        if (!!!response?.didCancel) {
                            const tempFixedImages = [
                                // ...fixedImages,
                                {
                                    image_id: uuid.v4(),
                                    type: 'LOCAL',
                                    base64: `data:${response?.assets?.[0]?.type};base64,${response?.assets?.[0]?.base64}`,
                                    uri: response.assets[0]?.uri,
                                },
                            ];
                            setSelectedData({
                                ...selectedData,
                                Value: `data:${response?.assets?.[0]?.type};base64,${response?.assets?.[0]?.base64}`,
                            });
                            setFixedImages(tempFixedImages);
                        }
                    });
                } else {
                    launchImageLibrary(options, response => {
                        if (!!!response?.didCancel) {
                            const tempFixedImages = [
                                // ...fixedImages,
                                {
                                    image_id: uuid.v4(),
                                    type: 'LOCAL',
                                    base64: `data:${response?.assets?.[0]?.type};base64,${response?.assets?.[0]?.base64}`,
                                    uri: response?.assets[0]?.uri,
                                },
                            ];
                            setSelectedData({
                                ...selectedData,
                                Value: `data:${response?.assets?.[0]?.type};base64,${response?.assets?.[0]?.base64}`,
                            });
                            setFixedImages(tempFixedImages);
                        }
                    });
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleClickDeleteImage = (id, type = '', image) => {
        // let deleteImageIDs = [...this.state.deleteImageIDs];
        // if (image?.type !== 'LOCAL') {
        // 	deleteImageIDs = [...deleteImageIDs, id];
        // }
        // if (type !== 'Issue') {
        // 	const fixedImages = this.state.fixedImages?.filter((image) => image?.image_id !== id);
        // 	console.log('🚀 ~ file: closedOrderDeatils.js:456 ~ ClosedOrderDetails ~ handleClickDeleteImage ~ fixedImages:', fixedImages);
        // 	this.setState({ fixedImages, deleteImageIDs });
        // } else {
        // 	const issueImages = this.state.issueImages?.filter((image) => image?.image_id !== id);
        // 	this.setState({ issueImages, deleteImageIDs });
        // }
        const tempFixedImages = fixedImages?.filter(image => image?.image_id !== id);
        setFixedImages(tempFixedImages);
    };

    return (
        <ModalComponent modalVisible={true} onRequestClose={closeModal} modalBackgroundColor={COLORS.transparentGrey} transparent>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 2, backgroundColor: COLORS.transparentGrey }}></View>
                <View
                    style={{
                        flex: 8,
                        backgroundColor: theme.mode.backgroundColor,
                        borderTopLeftRadius: SPACING.NORMAL,
                        borderTopRightRadius: SPACING.NORMAL,
                        width: '100%',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: SPACING.NORMAL,
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderColor: theme.mode.borderColor,
                        }}>
                        <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                            Select Data
                        </TextComponent>
                        <TouchableOpacity onPress={closeModal}>
                            <IconComponent size={FONT_SIZE.X_LARGE} type={ICON_TYPE.Ionicons} name="close" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: SPACING.NORMAL, flex: 1 }}>
                        {renderInputComponent()}
                        {data?.Type === INPUTS_CONSTANTS.FILE_UPLOAD && (
                            <View style={styles.issueimageConatiner}>
                                <ImageGallery
                                    images={(fixedImages || []).map(image => ({
                                        ...image,
                                        uri: image?.type === 'LOCAL' ? image?.uri : ``,
                                    }))}
                                    title="Images"
                                    text="No images Found"
                                    handleDelete={(id, image) => handleClickDeleteImage(id, null, image)}
                                    onPress={() => {
                                        cameraPickerRef?.current?.open();
                                    }}
                                />
                            </View>
                        )}
                    </View>
                    <View style={{ padding: SPACING.NORMAL }}>
                        <ButtonComponent disabled={!!!selectedData?.Value} loading={updatingValue} onPress={handleSubmitFormData}>
                            Submit
                        </ButtonComponent>
                    </View>
                </View>
            </View>
            <Modalize
                ref={cameraPickerRef}
                withHandle={false}
                adjustToContentHeight
                HeaderComponent={() => (
                    <View
                        style={{
                            padding: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity onPress={() => cameraPickerRef?.current?.close()}>
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
                )}>
                <View
                    style={{
                        padding: SPACING.SMALL,
                        flex: 1,
                    }}>
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
                                cameraPickerRef?.current?.close();
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
                                cameraPickerRef?.current?.close();
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
            </Modalize>
        </ModalComponent>
    );
};

export default EightDDynamicInputModal;

const styles = StyleSheet.create({
    issueimageConatiner: {},
});
