import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator, Platform, StatusBar } from 'react-native';
import moment from 'moment';
import { RichEditor } from 'react-native-pell-rich-editor';
import Accordion from 'react-native-collapsible/Accordion';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modalize } from 'react-native-modalize';
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ButtonComponent, FAB, IconComponent, ModalComponent, TextComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage, formReq, showErrorMessage } from 'helpers/utils';
import { APP_VARIABLES, DATE_FORMAT, FONT_TYPE, ICON_TYPE, INPUTS_CONSTANTS, Modes, ROUTES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { IMAGES } from 'assets/images';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import EightDDynamicInputModal from './eightd-dynamic-input-modal';

// const ConcernID = 493;

const DISABLED_FIELDS = [INPUTS_CONSTANTS.TREE_PICKER, INPUTS_CONSTANTS.ROOT_CAUSE_CATEGORY_PICKER];

const EightDDynamicForm = ({
    modalVisible,
    onRequestClose,
    formName,
    ConcernID,
    url = 'https://cloudqa3.ewqims.com//Common/ProblemSolver/PSShowForm/Index?ConcernID=16&modeid=2&ApproachID=1&Documenttype=13&ConcernAnalysis=1&PrimaryLangID=1&SecondaryLangID=1',
}) => {
    const navigation = useNavigation();
    const modalizeRef = React.useRef(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { theme } = useTheme();
    const [selectedData, setSelectedData] = useState(null);
    const [selectedDataForDelete, setSelectedDataForDelete] = useState(null);
    const [activeSections, setActiveSections] = useState([]);
    const [eightDData, setEightDData] = useState({
        loading: true,
        data: null,
        sections: [],
    });
    const bottomSheetRef = useRef(null);

    const getDynamicFormData = async SiteId => {
        setEightDData({
            loading: true,
            data: null,
        });
        try {
            const response = await postAPI(
                `${API_URL.GET_EIGHTD_FORM_DATA}`,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                }),
            );
            setEightDData({
                loading: false,
                data: response,
                // data: MACHELIN_RESPONSE,
                sections: response.Data.FormData.filter(phase => phase.ResponseByPhaseName.Dynamic !== null),
            });
            console.log('🚀 ~ getDynamicFormData ~ RESPONSE.Data.FormData:', response.Data.FormData);
            // console.log(
            //     '🚀 ~ file: eightd-dynamic-form.js:318 ~ getDynamicFormData ~ response:',
            //     MACHELIN_RESPONSE.Data.FormData.filter(phase => phase.ResponseByPhaseName.Dynamic !== null),
            // );
        } catch (err) {
            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
            setEightDData({
                loading: false,
                data: null,
            });
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const response = await postAPI(
                `${selectedDataForDelete?.DeleteAPIEndPoint}`,
                formReq({
                    ActionUsageID: selectedDataForDelete?.UsageID,
                    ConcernID,
                }),
            );
            if (response?.Success) {
                getDynamicFormData();
                setSelectedDataForDelete(null);
            }
            setDeleting(false);
        } catch (error) {
            setDeleting(false);
        }
    };

    const handleAddRow = async DynamicNodeName => {
        try {
            setAdding(true);
            const response = await postAPI(
                API_URL.ADD_EIGHTD_FORM_ROW,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                    UsageType: DynamicNodeName,
                }),
            );
            if (response?.Success) {
                getDynamicFormData();
                setSelectedDataForDelete(null);
            }
            setAdding(false);
        } catch (error) {
            setAdding(false);
        }
    };

    useEffect(() => {
        modalVisible && getDynamicFormData();
    }, [modalVisible]);

    useEffect(() => {
        selectedDataForDelete ? modalizeRef.current?.open() : modalizeRef.current?.close();
    }, [modalizeRef, selectedDataForDelete]);

    const renderHeader = (section, index) => {
        const isSelected = activeSections?.[0] === index;
        return (
            <View style={{ paddingBottom: SPACING.SMALL, backgroundColor: theme.mode.backgroundColor }}>
                <View
                    style={[
                        styles.header,
                        {
                            backgroundColor: theme.mode.backgroundColor,
                            borderBottomWidth: 1,
                            borderColor: theme.mode.borderColor,
                        },
                    ]}>
                    <TextComponent type={FONT_TYPE.BOLD}>{section?.title}</TextComponent>
                    <TouchableOpacity
                        activeOpacity={1}
                        // onPress={() => handleSelectionChange(section.name)}
                        style={{
                            width: RFPercentage(3),
                            height: RFPercentage(3),
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <IconComponent size={FONT_SIZE.NORMAL} name={isSelected ? 'down' : 'right'} type={ICON_TYPE.AntDesign} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderContent = ({ Component }) => {
        const ViewComponent = Component || null;
        return (
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: theme.mode.backgroundColor,
                    },
                ]}>
                {ViewComponent}
            </View>
        );
    };
    const updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    const SECTIONS = useMemo(() => {
        return eightDData?.sections?.map((data, parentIndex) => {
            const FieldName = data?.ResponseByPhaseName?.Dynamic?.[0]?.DynamicNodeName;
            const FormDataValueIndex = (eightDData?.data?.Data.FormValueData || [])?.findIndex(x => x.Title === data?.Title);
            const FormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex]?.[FieldName];
            const StaticFormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex];
            const ColumnNames = data?.ResponseByPhaseName?.Dynamic?.map(dynamic => ({
                Label: dynamic?.Label,
                ColumnDefinition: dynamic?.ColumnDefinition,
                Type: dynamic?.Type,
            }));

            console.log(
                '🚀 ~ returneightDData?.data?.Data?.FormData.map ~ FormDataValue:',
                // eightDData?.data?.Data.FormValueData?.[parentIndex],
                // FieldName,
                // parentIndex,
                // FormDataValueIndex,
            );

            if (parentIndex < 0) {
                return null;
            }
            return {
                title: data?.Title,
                name: data?.Title,
                Component: (
                    <View
                        key={parentIndex}
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                paddingHorizontal: SPACING.NORMAL,
                                marginBottom: SPACING.SMALL,
                            }}>
                            {data?.ResponseByPhaseName?.Static?.map((staticObj, index) => {
                                const isHTMLContent = staticObj?.ColumnDefinition === 'ContainmentActions';
                                // isHTMLContent &&
                                //     console.log(
                                //         '🚀 ~ {data?.ResponseByPhaseName?.Static?.map ~ isHTMLContent:',
                                //         isHTMLContent,
                                //         StaticFormDataValue?.[staticObj?.ColumnDefinition],
                                //     );

                                return (
                                    <View
                                        key={index}
                                        style={{
                                            // alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end',
                                            width: isHTMLContent ? '100%' : '50%',
                                            paddingBottom: SPACING.SMALL,
                                            backgroundColor: theme.mode.backgroundColor,
                                        }}>
                                        <TextComponent
                                            numberOfLines={5}
                                            fontSize={FONT_SIZE.SMALL}
                                            color={COLORS.textDark}
                                            // style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}
                                        >
                                            {staticObj?.Label}
                                        </TextComponent>
                                        <TouchableOpacity
                                        // onPress={() => setSelectedData(staticObj)}
                                        >
                                            <ScrollView
                                                scrollEnabled={false}
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}>
                                                {isHTMLContent ? (
                                                    <RichEditor
                                                        disabled
                                                        initialContentHTML={StaticFormDataValue?.[staticObj?.ColumnDefinition]}
                                                        // initialContentHTML={convertStringToHTML(StaticFormDataValue?.[staticObj?.ColumnDefinition])}
                                                    />
                                                ) : null}
                                            </ScrollView>
                                            <View>
                                                {!isHTMLContent ? (
                                                    <TextComponent style={{}} numberOfLines={8} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                                                        {StaticFormDataValue?.[staticObj?.ColumnDefinition]?.replace(/(<([^>]+)>)/gi, '') ||
                                                            'No Data'}
                                                    </TextComponent>
                                                ) : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                        {FieldName && (
                            <View
                                style={{
                                    paddingHorizontal: SPACING.NORMAL,
                                    alignItems: 'flex-start',
                                    backgroundColor: theme.mode.backgroundColor,
                                }}>
                                <TouchableOpacity
                                    disabled={adding}
                                    onPress={() => handleAddRow(FieldName)}
                                    style={{
                                        padding: SPACING.NORMAL,
                                        paddingVertical: SPACING.X_SMALL,
                                        borderRadius: 8,
                                        marginBottom: SPACING.NORMAL,
                                        backgroundColor: theme.colors.primaryThemeColor,
                                    }}>
                                    <TextComponent color={COLORS.white}>Add</TextComponent>
                                </TouchableOpacity>
                            </View>
                        )}
                        <ScrollView
                            horizontal
                            style={{
                                borderBottomWidth: 1,
                                borderColor: theme.mode.borderColor,
                                paddingBottom: SPACING.NORMAL,
                            }}>
                            <View
                                style={{
                                    backgroundColor: theme.mode.backgroundColor,
                                }}>
                                {FormDataValue?.map((rowData, parentIndex) => {
                                    return (
                                        <View
                                            key={parentIndex}
                                            style={{ padding: SPACING.NORMAL, paddingTop: 0, paddingBottom: SPACING.SMALL, flexDirection: 'row' }}>
                                            <View
                                                style={{
                                                    paddingRight: SPACING.SMALL,
                                                    borderBottomWidth: 1,
                                                    paddingBottom: SPACING.X_SMALL,
                                                    borderColor: COLORS.accordionBorderColor,
                                                    // maxWidth: RFPercentage(25),
                                                    // minWidth: RFPercentage(10),
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                }}>
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: SPACING.SMALL,
                                                    }}
                                                    onPress={() => {
                                                        // modalizeRef.current?.open();
                                                        setSelectedDataForDelete(rowData);
                                                    }}
                                                    // onPress={() =>
                                                    //     setSelectedData({
                                                    //         ...(columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                    //             Value: rowData[columnData?.ColumnDefinition]
                                                    //                 ? moment(rowData[columnData?.ColumnDefinition])
                                                    //                 : moment(),
                                                    //         }),
                                                    //         title: data?.Title,
                                                    //         Type: columnData?.Type,
                                                    //         UsageID: rowData?.UsageID,
                                                    //         PhaseId: rowData?.PhaseId,
                                                    //         rowData,
                                                    //         ColumnNames,
                                                    //         ...columnData,
                                                    //     })
                                                    // }
                                                >
                                                    <IconComponent name="delete" type={ICON_TYPE.AntDesign} />
                                                </TouchableOpacity>
                                            </View>
                                            {ColumnNames?.map((columnData, index) => (
                                                <View
                                                    key={index}
                                                    style={{
                                                        paddingRight: SPACING.SMALL,
                                                        borderBottomWidth: 1,
                                                        paddingBottom: SPACING.X_SMALL,
                                                        borderColor: COLORS.accordionBorderColor,
                                                        maxWidth: RFPercentage(40),
                                                        minWidth: RFPercentage(10),
                                                        overflow: 'hidden',
                                                        justifyContent: 'space-between',
                                                        flex: 1,
                                                        backgroundColor: theme.mode.backgroundColor,
                                                    }}>
                                                    <TextComponent
                                                        style={{
                                                            marginBottom: SPACING.X_SMALL,
                                                            ...(parentIndex !== 0 && {
                                                                height: 0,
                                                                opacity: 0,
                                                                marginBottom: 0,
                                                            }),
                                                        }}
                                                        type={FONT_TYPE.BOLD}
                                                        fontSize={FONT_SIZE.X_SMALL}>
                                                        {columnData.Label}
                                                    </TextComponent>
                                                    <TouchableOpacity
                                                        style={{
                                                            paddingVertical: SPACING.SMALL,
                                                            maxWidth: RFPercentage(25),
                                                            flex: 1,
                                                        }}
                                                        onPress={() =>
                                                            setSelectedData({
                                                                // rowData,
                                                                // ...data,
                                                                // ...columnData,
                                                                ...(columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                                    Value: rowData[columnData?.ColumnDefinition]
                                                                        ? moment(rowData[columnData?.ColumnDefinition], DATE_FORMAT.MM_DD_YYYY)
                                                                        : moment(),
                                                                }),
                                                                title: data?.Title,
                                                                Type: columnData?.Type,
                                                                UsageID: rowData?.UsageID,
                                                                PhaseId: rowData?.PhaseId,
                                                                WhysID: rowData?.WhysID,
                                                                PSActionID: rowData?.PSActionID,
                                                                RootCauseID: rowData?.RootCauseID,
                                                                rowData,
                                                                ColumnNames,
                                                                ...columnData,
                                                                // allFields,
                                                            })
                                                        }>
                                                        <TextComponent
                                                            numberOfLines={3}
                                                            style={{
                                                                maxWidth: RFPercentage(25),
                                                                minWidth: RFPercentage(15),
                                                            }}>
                                                            {columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER
                                                                ? rowData[columnData?.ColumnDefinition]
                                                                    ? rowData[columnData?.ColumnDefinition]
                                                                    : '---'
                                                                : rowData[columnData?.ColumnDefinition] || '---'}
                                                            {/* {columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER
                                                                ? rowData[columnData?.ColumnDefinition]
                                                                    ? moment(rowData[columnData?.ColumnDefinition]).format('DD-MM-YYYY')
                                                                    : '---'
                                                                : rowData[columnData?.ColumnDefinition] || '---'} */}
                                                        </TextComponent>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ),
            };
        });
    }, [eightDData]);

    return (
        <ModalComponent
            {...{
                modalVisible,
                onRequestClose,
                modalBackgroundColor: theme.mode.backgroundColor,
                // style: {
                //     backgroundColor: theme.mode.backgroundColor,
                // },
            }}>
            <EightDDynamicInputModal
                {...{
                    selectedData,
                    setSelectedData,
                    ConcernID: ConcernID,
                    getDynamicFormData,
                }}
            />
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: SPACING.SMALL,
                        paddingTop: Platform.OS === 'android' ? useSafeAreaInsets().top + 20 : 10,
                    }}>
                    <View style={{ width: 1 }} />
                    <View>
                        <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                            {formName} Form
                        </TextComponent>
                    </View>
                    <TouchableOpacity
                        onPress={onRequestClose}
                        // onPress={() => bottomSheetRef?.current?.open()}
                        style={{
                            padding: SPACING.SMALL,
                            alignSelf: 'flex-end',
                            borderRadius: SPACING.SMALL,
                            backgroundColor: theme.colors.primaryThemeColor,
                            marginBottom: SPACING.NORMAL,
                        }}>
                        <IconComponent
                            color={COLORS.white}
                            name="close"
                            type={ICON_TYPE.AntDesign}
                            resizeMode="contain"
                            source={IMAGES.apqpModuleIcon}
                        />
                    </TouchableOpacity>
                </View>
                {eightDData?.loading && (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: -SPACING.XX_LARGE,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            zIndex: 100,
                        }}>
                        <ActivityIndicator size="large" color={theme.colors.primaryThemeColor} />
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} style={{ paddingTop: SPACING.NORMAL }}>
                            Loading form data...
                        </TextComponent>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                            Please Wait...
                        </TextComponent>
                    </View>
                )}
                <ScrollView
                    style={{
                        backgroundColor: theme.mode.backgroundColor,
                    }}
                    contentContainerStyle={{ backgroundColor: theme.mode.backgroundColor }}>
                    <View
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                            padding: SPACING.NORMAL,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: SPACING.NORMAL,
                                flexWrap: 'wrap',
                                flex: 1,
                            }}>
                            {eightDData?.data?.Data?.FormConcernDetails?.map((formConcern, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end',
                                            width: '50%',
                                            paddingBottom: SPACING.SMALL,
                                        }}>
                                        <TextComponent
                                            numberOfLines={5}
                                            fontSize={FONT_SIZE.SMALL}
                                            color={COLORS.textDark}
                                            style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}>
                                            {formConcern?.Label}
                                        </TextComponent>
                                        <TextComponent type={FONT_TYPE.BOLD}>
                                            {(formConcern?.Value || '')?.replace(/(<([^>]+)>)/gi, '') || 'No Data'}
                                        </TextComponent>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {eightDData?.sections?.length > 0 && (
                        <Accordion
                            touchableComponent={Pressable}
                            sections={SECTIONS}
                            {...{ activeSections, renderHeader, renderContent, onChange: updateSections }}
                        />
                    )}
                </ScrollView>
                <FAB
                    onPress={() => {
                        onRequestClose();
                        navigation.navigate(ROUTES.VIEW_LOGS);
                    }}
                    iconName="document-text-outline"
                    iconType={ICON_TYPE.Ionicons}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: SPACING.NORMAL,
                        elevation: 5,
                        backgroundColor: theme.mode.backgroundColor,
                        borderTopWidth: 1,
                        borderColor: theme.mode.borderColor,
                        shadowColor: COLORS.black,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}>
                    <ButtonComponent
                        style={{
                            width: '49%',
                        }}>
                        Approve
                    </ButtonComponent>
                    <ButtonComponent
                        style={{
                            width: '49%',
                        }}
                        danger>
                        Reject
                    </ButtonComponent>
                </View>
            </View>
            <Modalize
                withHandle={false}
                onOpen={() => {
                    // if (Platform.OS === 'android') {
                    StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.65)', true);
                    StatusBar.setBarStyle('light-content');
                    // }
                }}
                onClose={() => {
                    // if (Platform.OS === 'android') {
                    StatusBar.setBackgroundColor(COLORS.white, true);
                    StatusBar.setBarStyle('dark-content');
                    // }
                }}
                ref={modalizeRef}
                // adjustToContentHeight
                scrollViewProps={{
                    // scrollEnabled: false,
                    style: {
                        flex: 1,
                        flexGrow: 1,
                    },
                }}
                modalHeight={RFPercentage(20)}
                HeaderComponent={
                    <View
                        style={{
                            paddingHorizontal: SPACING.NORMAL,
                            borderBottomWidth: 1,
                            borderColor: COLORS.accDividerColor,
                            backgroundColor: theme.mode.backgroundColor,
                            borderTopLeftRadius: SPACING.SMALL,
                            borderTopRightRadius: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                                Are you want to delete? (This can't be revert)
                            </TextComponent>
                        </View>
                        <View
                            style={{
                                padding: SPACING.NORMAL,
                                paddingRight: 0,
                            }}>
                            <TouchableOpacity
                                onPress={() => modalizeRef?.current?.close()}
                                style={{
                                    padding: SPACING.SMALL,
                                    alignSelf: 'flex-end',
                                    borderRadius: SPACING.SMALL,
                                    backgroundColor: theme.colors.primaryThemeColor,
                                }}>
                                <IconComponent color={COLORS.white} name="close" type={ICON_TYPE.AntDesign} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }>
                <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                    <View style={{ padding: SPACING.SMALL, alignItems: 'center', flex: 1 }}>
                        <ButtonComponent
                            loading={deleting}
                            disabled={deleting}
                            onPress={handleDelete}
                            style={{
                                backgroundColor: COLORS.red,
                            }}>
                            Proceed to Delete
                        </ButtonComponent>
                    </View>
                </View>
            </Modalize>
        </ModalComponent>
    );
};

export default EightDDynamicForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: COLORS.whiteGrey,
        padding: RFPercentage(3),
        paddingHorizontal: SPACING.NORMAL,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        // textAlign: 'center',
    },
    content: {
        borderRadius: SPACING.SMALL,
        // marginBottom: SPACING.SMALL,
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
    },
});
