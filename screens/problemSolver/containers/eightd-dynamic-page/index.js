import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator, Platform, StatusBar } from 'react-native';
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { ButtonComponent, FAB, IconComponent, TextComponent, EightDDynamicInputModal, Content, Header } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage, formReq, getDisplayValue, showErrorMessage } from 'helpers/utils';
import {
    APP_VARIABLES,
    DATE_FORMAT,
    EIGHTD_FORM_VALUE_TYPE,
    FOLLOWUP_PICKER_STATUS,
    FONT_TYPE,
    ICON_TYPE,
    IMAGE_UPLOAD_STATUS,
    INPUTS_CONSTANTS,
    ROUTES,
} from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/ApiUrl';
import ApproveRejectComponent from './approve-reject';
import { MOCK_RESPONSE } from './data';
import DeleteModal from './delete-modal';
import RenderStaticValues from './render-static-values';
import RenderConcernDetails from './render-concern-details';
import { useAppContext } from 'contexts/app-context';

const EightDDynamicPage = ({}) => {
    const { timeSettings } = useAppContext();
    const navigation = useNavigation();
    const { ConcernID, formName } = useRoute().params;
    const modalizeRef = React.useRef(null);
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
        setEightDData(eightDData => ({
            ...eightDData,
            loading: true,
        }));
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
                // data: MOCK_RESPONSE,
                sections: response.Data.FormData.filter(phase => phase.ResponseByPhaseName.Dynamic !== null),
            });
        } catch (err) {
            showErrorMessage('Sorry, Error while loading the form');
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
                    ...(selectedDataForDelete?.Typeid && {
                        Typeid: selectedDataForDelete?.Typeid,
                    }),
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

    const handleAddRow = async (DynamicNodeName, AddRowAPIEndPoint) => {
        try {
            setAdding(true);
            const response = await postAPI(
                AddRowAPIEndPoint || API_URL.ADD_EIGHTD_FORM_ROW,
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
        getDynamicFormData();
    }, []);

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
            const AddRowAPIEndPoint = data?.AddRowAPIEndPoint;
            const FormDataValueIndex = (eightDData?.data?.Data.FormValueData || [])?.findIndex(x => x.Title === data?.Title);
            const FormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex]?.[FieldName];
            const StaticFormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex];
            const ColumnNames = data?.ResponseByPhaseName?.Dynamic?.map(dynamic => ({
                Label: dynamic?.Label,
                ColumnDefinition: dynamic?.ColumnDefinition,
                DynamicNodeName: dynamic?.DynamicNodeName,
                NodeName: dynamic?.NodeName,
                Type: dynamic?.Type,
            }));
            const CanAdd = data?.CanAdd;
            const CanDelete = data?.CanDelete;

            console.log(
                '🚀 ~ returneightDData?.data?.Data?.FormData.map ~ FormDataValue:',
                data?.CanAdd,
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
                            {data?.ResponseByPhaseName?.Static?.map((staticObj, index, rowData) => {
                                // const isHTMLContent = staticObj?.ColumnDefinition === 'ContainmentActions';
                                const isHTMLContent = staticObj?.ColumnDefinition === INPUTS_CONSTANTS.RICH_EDITOR;
                                // console.log(
                                //     '🚀 ~ {data?.ResponseByPhaseName?.Static?.map ~ staticObj:',
                                //     staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER,
                                //     FOLLOWUP_PICKER_STATUS.PASS,
                                //     StaticFormDataValue?.[staticObj?.ColumnDefinition],
                                // );

                                return (
                                    <RenderStaticValues
                                        {...{
                                            isHTMLContent,
                                            StaticFormDataValue,
                                            staticObj,
                                            loading: eightDData?.loading,
                                            setSelectedData,
                                            getDynamicFormData,
                                            selectedData,
                                            ConcernID,
                                        }}
                                    />
                                );
                            })}
                        </View>
                        {FieldName && CanAdd && (
                            <View
                                style={{
                                    paddingHorizontal: SPACING.NORMAL,
                                    alignItems: 'flex-start',
                                    backgroundColor: theme.mode.backgroundColor,
                                }}>
                                <TouchableOpacity
                                    disabled={adding}
                                    onPress={() => handleAddRow(FieldName, AddRowAPIEndPoint)}
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
                                    console.log('🚀 ~ {FormDataValue?.map ~ rowData:', parentIndex);
                                    return (
                                        <>
                                            {parentIndex === 0 && (
                                                <View
                                                    key={parentIndex}
                                                    style={{
                                                        padding: SPACING.NORMAL,
                                                        paddingTop: SPACING.SMALL,
                                                        paddingBottom: 0,
                                                        flexDirection: 'row',
                                                    }}>
                                                    {CanDelete && (
                                                        <View
                                                            style={{
                                                                paddingRight: SPACING.SMALL,
                                                                borderBottomWidth: 1,
                                                                paddingBottom: SPACING.X_SMALL,
                                                                borderColor: COLORS.accordionBorderColor,
                                                                justifyContent: 'flex-end',
                                                                alignItems: 'center',
                                                                width: 30,
                                                            }}></View>
                                                    )}

                                                    {ColumnNames?.map((columnData, index) => (
                                                        <View
                                                            key={index}
                                                            style={{
                                                                paddingRight: SPACING.SMALL,
                                                                borderBottomWidth: 1,
                                                                paddingBottom: SPACING.X_SMALL,
                                                                borderColor: COLORS.accordionBorderColor,
                                                                maxWidth: RFPercentage(40),
                                                                width: RFPercentage(20),
                                                                justifyContent: 'space-between',
                                                                flex: 1,
                                                                backgroundColor: theme.mode.backgroundColor,
                                                            }}>
                                                            <TextComponent
                                                                style={
                                                                    {
                                                                        // marginBottom: SPACING.X_SMALL,
                                                                    }
                                                                }
                                                                type={FONT_TYPE.BOLD}
                                                                fontSize={FONT_SIZE.X_SMALL}>
                                                                {columnData.Label}
                                                            </TextComponent>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                            <View
                                                key={parentIndex}
                                                style={{
                                                    padding: SPACING.NORMAL,
                                                    paddingTop: SPACING.SMALL,
                                                    paddingBottom: 0,
                                                    flexDirection: 'row',
                                                    minHeight: RFPercentage(5),
                                                }}>
                                                {CanDelete && (
                                                    <View
                                                        style={{
                                                            paddingRight: SPACING.SMALL,
                                                            borderBottomWidth: 1,
                                                            paddingBottom: SPACING.X_SMALL,
                                                            borderColor: COLORS.accordionBorderColor,
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center',
                                                            width: 30,
                                                        }}>
                                                        <TouchableOpacity
                                                            disabled={rowData?.UploadStatus === IMAGE_UPLOAD_STATUS.InProgress}
                                                            style={{
                                                                paddingVertical: SPACING.SMALL,
                                                            }}
                                                            onPress={() => {
                                                                setSelectedDataForDelete(rowData);
                                                            }}>
                                                            <IconComponent name="delete" type={ICON_TYPE.AntDesign} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                                    {ColumnNames?.map((columnData, index) => {

                                                    columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER &&
                                                    console.log('🚀 ~ {ColumnNames?.map ~ columnData:', columnData?.Type, columnData, rowData);

                                                    const columnValue = rowData[columnData?.ColumnDefinition];
                                                    return (
                                                        <View
                                                            key={index}
                                                            style={{
                                                                paddingRight: SPACING.SMALL,
                                                                borderBottomWidth: 1,
                                                                paddingBottom: SPACING.X_SMALL,
                                                                borderColor: COLORS.accordionBorderColor,
                                                                maxWidth: RFPercentage(40),
                                                                width: RFPercentage(20),
                                                                justifyContent: 'space-between',
                                                                flex: 1,
                                                                backgroundColor: theme.mode.backgroundColor,
                                                            }}>
                                                            <TouchableOpacity
                                                                disabled={
                                                                    rowData?.UploadStatus === IMAGE_UPLOAD_STATUS.InProgress ||
                                                                    columnData?.Type === INPUTS_CONSTANTS.LABEL
                                                                }
                                                                style={{
                                                                    paddingVertical: SPACING.SMALL,
                                                                    maxWidth: RFPercentage(25),
                                                                    flex: 1,
                                                                }}
                                                                onPress={() => {
                                                                    setSelectedData({
                                                                        Value: rowData[columnData?.ColumnDefinition]?.toString(),
                                                                        ...(columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                                            Value: rowData[columnData?.ColumnDefinition]
                                                                                ? moment(
                                                                                      rowData[columnData?.ColumnDefinition],
                                                                                      DATE_FORMAT.MM_DD_YYYY,
                                                                                  )
                                                                                : moment(),
                                                                        }),
                                                                        ...(columnData?.Type === INPUTS_CONSTANTS.INPUT && {
                                                                            Value: rowData[columnData?.ColumnDefinition]?.toString(),
                                                                        }),
                                                                        title: data?.Title,
                                                                        Type: columnData?.Type,
                                                                        UsageID: rowData?.UsageID,
                                                                        PhaseId: rowData?.PhaseId,
                                                                        WhysID: rowData?.WhysID,
                                                                        PSActionID: rowData?.PSActionID,
                                                                        RootCauseID: rowData?.RootCauseID,
                                                                        DynamicNodeName: columnData,
                                                                        rowData,
                                                                        ColumnNames,
                                                                        NodeName: columnData?.NodeName,
                                                                        ...columnData,
                                                                    });
                                                                }}>
                                                                <TextComponent
                                                                    numberOfLines={3}
                                                                    style={{
                                                                        maxWidth: RFPercentage(25),
                                                                        minWidth: RFPercentage(15),
                                                                    }}>
                                                                      {getDisplayValue(columnValue, columnData, rowData, timeSettings)}
                                                                </TextComponent>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ),
            };
        });
    }, [eightDData]);

    const CARApprovalStatus = eightDData?.data?.Data?.CARApprovalStatus;
    const CARPhaseDetails = eightDData?.data?.Data?.CARPhaseDetails;
    const StatusId = eightDData?.data?.Data?.CARApprovalStatus?.StatusId;
    const ViewLogCount = eightDData?.data?.Data?.CARApprovalStatus?.ViewLogCount;

    return (
        <Content noPadding>
            <EightDDynamicInputModal
                {...{
                    selectedData,
                    setSelectedData,
                    ConcernID: ConcernID,
                    getDynamicFormData,
                }}
            />
            <Header title={formName} />
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
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
                            backgroundColor: COLORS.transparentGrey,
                        }}>
                        <View
                            style={{
                                backgroundColor: COLORS.white,
                                padding: SPACING.X_LARGE,
                                borderRadius: SPACING.SMALL,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}>
                            <ActivityIndicator size="large" color={theme.colors.primaryThemeColor} />
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} style={{ paddingTop: SPACING.NORMAL }}>
                                Loading form data...
                            </TextComponent>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                                Please Wait...
                            </TextComponent>
                        </View>
                    </View>
                )}
                <ScrollView
                    style={{
                        backgroundColor: theme.mode.backgroundColor,
                    }}
                    contentContainerStyle={{ backgroundColor: theme.mode.backgroundColor }}>
                    {(eightDData?.data?.Data?.FormConcernDetails || []).length ? (
                        <RenderConcernDetails formConcernDetails={eightDData?.data?.Data?.FormConcernDetails} />
                    ) : null}
                    {eightDData?.sections?.length > 0 && (
                        <Accordion
                            touchableComponent={Pressable}
                            sections={SECTIONS}
                            {...{ activeSections, renderHeader, renderContent, onChange: updateSections }}
                        />
                    )}
                </ScrollView>

                {ViewLogCount > 0 && (
                    <FAB
                        onPress={() => {
                            navigation.navigate(ROUTES.VIEW_LOGS, {
                                ConcernID,
                            });
                        }}
                        iconName="document-text-outline"
                        iconType={ICON_TYPE.Ionicons}
                        text="Logs"
                        bottom={RFPercentage(12)}
                    />
                )}
                {!eightDData?.loading && <FAB onPress={getDynamicFormData} iconName="sync" />}
                {StatusId === 1 || StatusId === 4 || StatusId === 7 || StatusId === 10 || StatusId === 13 ? (
                    <ApproveRejectComponent
                        ApproveButtonId={CARApprovalStatus?.ApproveButtonId}
                        RejectButtonId={CARApprovalStatus?.RejectButtonId}
                        CARPhaseDetails={CARPhaseDetails}
                        ConcernID={ConcernID}
                        refreshData={getDynamicFormData}
                    />
                ) : null}
            </View>
            <DeleteModal
                {...{
                    modalizeRef,
                    deleting,
                    handleDelete,
                }}
            />
        </Content>
    );
};

export default EightDDynamicPage;

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
