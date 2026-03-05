import React, { Component } from 'react';
import {
    View,
    Text,
    Keyboard,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    ImageBackground,
    Alert,
    Platform,
    ActivityIndicator,
    Image,
    FlatList,
} from 'react-native';
import { Images } from '../../auditPro/Themes/index';
import styles from '../../supplierManagement/containers/NCOFIPageStyle_SM';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
// import FooterButton from '../Components/Shared/FooterButton';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import auth from '../../../services/Auditpro-Auth';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Moment from 'moment';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import LinearGradient from 'react-native-linear-gradient';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Feather';
import { strings } from '../../auditPro/language/Language';
import { debounce, once } from 'underscore';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'apisauce';
import * as constant from '../../auditPro/constants/AppConstants';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-fetch-blob';
import CryptoJS from 'crypto-js';
import FileViewer from 'react-native-file-viewer';
import { ROUTES } from 'constants/app-constant';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalHeader from 'components/GlobalHeader';
import CommonAlertModal from 'components/common_alert_modal';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import { showErrorMessage, successMessage } from 'helpers/utils';
import { Content, Header, ListSearch, NoRecordFound } from 'components';
var RNFS = require('react-native-fs');

let Window = Dimensions.get('window');
// const getFileFormat = filename => {
//   const parts = filename.split('.');
//   return parts[parts.length - 1].toLowerCase();
// };

const fileFormatToIcon = {
    txt: 'file-text-o',
    xls: 'file-excel-o',
    pdf: 'file-pdf-o',
    png: 'file-image-o',
};

const getFileFormat = fileName => {
    const splitFileName = fileName.split('.');
    return splitFileName[splitFileName.length - 1];
};

const NCOFI_BUTTON_GRADIENT = ['#123C95', '#1B5FDB', '#6A35D8'];

class NCOFIPage extends Component {
    dimensionSubscription = null;

    // isAttachmentPresent = false;
    attatchedFindings = [];
    formRequestObj = [];
    count = [];
    brokenPath = undefined;
    pathDetails = [];

    constructor(props) {
        super(props);
        console.log('get this.props-->', this.props);
        this.state = {
            token: '',
            NCdisplay: [],
            isModalVisible: false,
            NCtext: '',
            AUDIT_ID: '',
            AUDITPROG_ID: '',
            AUDITYPE_ORDER: '',
            AUDITYPE_ID: '',
            SITEID: '',
            AUDITPROGORDER: '',
            dropdownprops: [],
            NCdetails: [],
            CreateNCpass: [],
            localdata: [],
            NCmodalheader: '',
            isMounted: false,
            NCUpload: [],
            isLoaderVisible: true,
            isLoaderUploader: false,
            dialogVisible: false,
            deleteDialogVisible: false,
            isVisible: false,
            UploadDate: '',
            Responsible: '',
            Request: '',
            Category: '',
            Response: '',
            Standard: '',
            StandText: '',
            miniLoading: false,
            CorrectiveOrder: null,
            loadingData: true,
            breadCrumbText: undefined,
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            isLowConnection: false,
            missingFindings: [],
            isMissingFindings: false,
            confirmpwd: false,
            pwdentry: undefined,
            deviceId: '',
            isEmptyPwd: undefined,
            AuditOrder: undefined,
            CheckNC: 0,
            objectiveEvidence: '',
            Clause: '',
            FailureCategory: '',
            Process: '',
            DocumentReference: '',
            AttachEvidence: '',
            fileData: undefined,
            filepath: '',
            filepathArray: [],
            ncLoader: false,
            coombinedArray: [],
            fileName: '',
            lengthCheck: [],
            allParamsArr: [],
            AttachmentList: [],
            isAttachmentLoaded: false,
            isAttachmentPresent: false,
            deleteNCkey: '',
            uploadIndex: 0,
            totalFiles: 0,
            AuditAttachments: [],
            FailedAttachments: [],
            syncStatusLabel: '',
            syncMode: 0,
            currentUserData: [],
            CorrectiveId: null,
            screenWidth: Window.width,
            screenHeight: Window.height,
        };
    }

    componentDidMount() {
        console.log('navigationprops', this.props?.route?.params);
        console.log('ncrecordsconsole', this.props.data.audits.ncofiRecords);
        this.dimensionSubscription = Dimensions.addEventListener('change', this.handleDimensionChange);
        this.syncWindowDimensions();
        DeviceInfo.getUniqueId().then(deviceId => {
            this.setState({
                deviceId,
            });
        });
        if (this.props.data.audits.language === 'Chinese') {
            this.setState({ ChineseScript: true }, () => {
                strings.setLanguage('zh');
                this.setState({});
                console.log('Chinese script on', this.state.ChineseScript);
            });
        } else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
            this.setState({ ChineseScript: false }, () => {
                strings.setLanguage('en-US');
                this.setState({});
                console.log('Chinese script off', this.state.ChineseScript);
            });
        }
        console.log('Redux store...', this.props.data.audits);
        console.log('NCOFI mounted', this.props?.route?.params);
        this.setState(
            {
                // dropdownprops:this?.props?.route?.params?.DropDownVal,
                CreateNCpass: this?.props?.route?.params?.CreateNCdataBundle,
                AUDIT_ID: this?.props?.route?.params?.CreateNCdataBundle?.AuditID,
                SITEID: this?.props?.route?.params?.CreateNCdataBundle?.SiteID,
                breadCrumbText: this?.props?.route?.params?.CreateNCdataBundle?.breadCrumb,
                // breadCrumbText: this?.props?.route?.params?.CreateNCdataBundle.breadCrumb.length > 30 ? this?.props?.route?.params?.CreateNCdataBundle.breadCrumb.slice(0, 30) + '...' : this?.props?.route?.params?.CreateNCdataBundle.breadCrumb,
                NCdetails: this.props.data.audits?.ncofiRecords,
                AuditOrder: this?.props?.route?.params?.CreateNCdataBundle?.AuditOrder,
                RouteParam: this?.props?.route?.params?.RouteValue,
                isMounted: true,
            },
            () => {
                console.log('NCDTA', this?.props?.route?.params?.CreateNCdataBundle?.AuditID);
                console.log('AuditOrder', this.state.AuditOrder);
                console.log('Mohan---->', this.state.NCdetails);
                this.getDetails();
                // this.setUpload()
                this.refreshList();
            },
        );
    }

    async getAccessToken() {
        try {
            const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
            const value = JSON.parse(stringifiedUserDetails);
            console.log('current userdata--->', value);
            if (value !== null) {
                // value previously stored
                console.log('current token2--->', value.accessToken);
                this.setState({ currentUserData: value }, () => {
                    console.log('Token set');
                });
            }
        } catch (e) {
            // error reading value
            console.log('error--->', e);
        }
    }

    componentWillReceiveProps() {
        // var getCurrentPage = [];
        // getCurrentPage = this.props.data.nav.routes;
        // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
        // console.log('--CurrentPage--->', CurrentPage);
        var CurrentPage = this.props.route.name;
        console.log('--CurrentPage--->', CurrentPage);
        if (CurrentPage == 'NC_OFI_PAGE_SM') {
            console.log('NCOFI Component Focussed!');
            if (this.state.isMounted) {
                this.setState(
                    {
                        NCdetails: this.props.data.audits.ncofiRecords,
                    },
                    () => {
                        console.log('NCdetails', this.state.NCdetails);
                        this.getDetails();
                        this.setUpload();
                    },
                );
            }
        } else {
            console.log('NCOFIPage pass');
        }
    }

    componentWillUnmount() {
        if (this.dimensionSyncTimeout) {
            clearTimeout(this.dimensionSyncTimeout);
            this.dimensionSyncTimeout = null;
        }
        if (this.dimensionSubscription && this.dimensionSubscription.remove) {
            this.dimensionSubscription.remove();
        } else if (Dimensions.removeEventListener) {
            Dimensions.removeEventListener('change', this.handleDimensionChange);
        }
    }

    syncWindowDimensions = () => {
        const liveWindow = Dimensions.get('window');
        if (!liveWindow || !liveWindow.width || !liveWindow.height) {
            return;
        }
        this.setState(prevState => {
            if (prevState.screenWidth === liveWindow.width && prevState.screenHeight === liveWindow.height) {
                return null;
            }
            return {
                screenWidth: liveWindow.width,
                screenHeight: liveWindow.height,
            };
        });
    };

    handleDimensionChange = () => {
        this.syncWindowDimensions();
        if (this.dimensionSyncTimeout) {
            clearTimeout(this.dimensionSyncTimeout);
        }
        this.dimensionSyncTimeout = setTimeout(() => {
            this.syncWindowDimensions();
            this.dimensionSyncTimeout = null;
        }, 140);
    };

    getLayoutProfile = () => {
        const { screenWidth, screenHeight } = this.state;
        const liveWindow = Dimensions.get('window');
        const stateWidth = screenWidth || Window.width;
        const stateHeight = screenHeight || Window.height;
        const liveWidth = liveWindow.width || stateWidth;
        const liveHeight = liveWindow.height || stateHeight;
        const stateIsLandscape = stateWidth > stateHeight;
        const liveIsLandscape = liveWidth > liveHeight;
        const shouldUseLiveDimensions = stateIsLandscape !== liveIsLandscape;
        const width = shouldUseLiveDimensions ? liveWidth : stateWidth;
        const height = shouldUseLiveDimensions ? liveHeight : stateHeight;
        const isLandscape = width > height;
        const isTablet = Math.min(width, height) >= 768;
        return {
            width,
            height,
            isLandscape,
            isTablet,
            showGridCards: isLandscape || isTablet,
            maxContentWidth: isTablet ? (isLandscape ? 1180 : 920) : undefined,
            horizontalPadding: isTablet ? 12 : 5,
        };
    };

    getDetails = () => {
        setTimeout(() => {
            var compArr = [];
            var Data = this.props.data.audits.ncofiRecords;
            console.log('NC Data', Data);

            for (var i = 0; i < Data.length; i++) {
                if (this.state.AUDIT_ID === Data[i].AuditID) {
                    for (var j = 0; j < Data[i].Pending.length; j++) {
                        if (Data[i].Pending[j].ChecklistTemplateId == 0) {
                            if (Data[i].Pending[j].Category === 'NC') {
                                console.log(Data[i].Pending[j], 'OFI===>');
                                compArr.push({
                                    AuditID: Data[i].Pending[j].AuditID,
                                    AuditOrder: Data[i].Pending[j].AuditOrder,
                                    ChecklistID: Data[i].Pending[j].ChecklistID,
                                    Formid: Data[i].Pending[j].Formid,
                                    SiteID: Data[i].Pending[j].SiteID,
                                    title: Data[i].Pending[j].NCNumber,
                                    failureDrop: Data[i].Pending[j].failureDrop,
                                    requiretext: Data[i].Pending[j].requiretext,
                                    OFI: Data[i].Pending[j].ofitext || Data[i].Pending[j].OFI,
                                    categoryDrop: Data[i].Pending[j].categoryDrop,
                                    userDrop: Data[i].Pending[j].userDrop,
                                    requestDrop: Data[i].Pending[j].requestDrop,
                                    deptDrop: Data[i].Pending[j].deptDrop,
                                    // NCNumber: Data[i].Pending[j].NCNumber + '-' + 'NC',
                                    NCNumber: Data[i].Pending[j].NCNumber,
                                    Category: Data[i].Pending[j].Category,
                                    filename: Data[i].Pending[j].filename,
                                    filedata: Data[i].Pending[j].filedata,
                                    auditstatus: Data[i].Pending[j].auditstatus,
                                    NonConfirmity: Data[i].Pending[j].NonConfirmity,
                                    uniqueNCkey: Data[i].Pending[j].uniqueNCkey,
                                    selectedItems: Data[i].Pending[j].selectedItems,
                                    selectedItemsProcess: Data[i].Pending[j].selectedItemsProcess,
                                    ChecklistTemplateId: Data[i].Pending[j].ChecklistTemplateId,
                                    ncIdentifier: Data[i].Pending[j].ncIdentifier,
                                    objEvidence: Data[i].Pending[j].objEvidence,
                                    recommAction: Data[i].Pending[j].recommAction,
                                    documentRef: Data[i].Pending[j].documentRef,
                                    Conformance: this?.props?.route?.params?.CreateNCdataBundle?.Conformance,
                                    ProcessID: this?.props?.route?.params?.CreateNCdataBundle?.ProcessID,
                                    data: [Data[i].Pending[j].NonConfirmity === undefined ? 'N/a' : Data[i].Pending[j].NonConfirmity],
                                });
                            } else if (Data[i].Pending[j].Category === 'OFI') {
                                console.log(Data[i].Pending[j], 'OFI===>');
                                compArr.push({
                                    AuditID: Data[i].Pending[j].AuditID,
                                    AuditOrder: Data[i].Pending[j].AuditOrder,
                                    Category: Data[i].Pending[j].Category,
                                    ChecklistID: Data[i].Pending[j].ChecklistID,
                                    Formid: Data[i].Pending[j].Formid,
                                    // NCNumber: Data[i].Pending[j].NCNumber + '-' + 'OFI',
                                    NCNumber: Data[i].Pending[j].NCNumber,
                                    NonConfirmity: Data[i].Pending[j].NonConfirmity,
                                    failureDrop: Data[i].Pending[j].failureDrop,
                                    OFI: Data[i].Pending[j].ofitext || Data[i].Pending[j].OFI,
                                    SiteID: Data[i].Pending[j].SiteID,
                                    auditstatus: Data[i].Pending[j].auditstatus,
                                    categoryDrop: Data[i].Pending[j].categoryDrop,
                                    deptDrop: Data[i].Pending[j].deptDrop,
                                    filedata: Data[i].Pending[j].filedata,
                                    filename: Data[i].Pending[j].filename,
                                    requestDrop: Data[i].Pending[j].requestDrop,
                                    requiretext: Data[i].Pending[j].requiretext,
                                    title: Data[i].Pending[j].NCNumber,
                                    uniqueNCkey: Data[i].Pending[j].uniqueNCkey,
                                    userDrop: Data[i].Pending[j].userDrop,
                                    selectedItems: Data[i].Pending[j].selectedItems,
                                    selectedItemsProcess: Data[i].Pending[j].selectedItemsProcess,
                                    ChecklistTemplateId: Data[i].Pending[j].ChecklistTemplateId,
                                    ncIdentifier: Data[i].Pending[j].ncIdentifier,
                                    objEvidence: Data[i].Pending[j].objEvidence,
                                    recommAction: Data[i].Pending[j].recommAction,
                                    documentRef: Data[i].Pending[j].documentRef,
                                    Conformance: this?.props?.navigation?.state?.params?.CreateNCdataBundle?.Conformance,
                                    ProcessID: this?.props?.navigation?.state?.params?.CreateNCdataBundle?.ProcessID,
                                    data: [Data[i].Pending[j].OFI === undefined ? 'N/a' : Data[i].Pending[j].OFI],
                                });
                            }
                        }
                    }
                }
            }

            console.log('compArr', compArr);

            let abc = Array.from(new Set(compArr));

            console.log('Checking for duplicate', abc);

            this.setState({ NCdisplay: compArr, isMounted: true }, () => {
                console.log('this.state.NCdisplay2', this.state.NCdisplay);
            });
        }, 500);
    };

    setUpload = () => {
        console.log('this.props.data.audits.ncofiRecords', this.props.data.audits.ncofiRecords);
        setTimeout(() => {
            var Data = this.props.data.audits.ncofiRecords;
            console.log('NC Data', Data);
            var compArr2 = [];

            for (var i = 0; i < Data.length; i++) {
                if (this.state.AUDIT_ID === Data[i].AuditID) {
                    for (var j = 0; j < Data[i].Uploaded.length; j++) {
                        compArr2.push({
                            title: Data[i].Uploaded[j].NCNumber,
                            CorrectiveOrder: Data[i].Uploaded[j].CorrectiveOrder,
                            CheckNC: Data[i].Uploaded[j].CheckNC,
                            data: [Data[i].Uploaded[j].NonConfirmity === undefined ? 'N/a' : Data[i].Uploaded[j].NonConfirmity],
                        });
                    }
                }
            }
            console.log('compArr2', compArr2);
            this.setState({ NCUpload: compArr2, isMounted: true, isLoaderVisible: false }, () => {
                console.log('this.state.NCUpload', this.state.NCUpload);
            });
        }, 500);
    };

    openEditBox = item => {
        console.log('111111111');
        console.log('ncpass==>', this.state.CreateNCpass);
        console.log('ncpasses', item);
        console.log('Process:pm', this.props?.route?.params);

        this.setState({
            AttachmentList: [],
            isAttachmentLoaded: false,
        });

        console.log('this?.props?.route?.params?.CreateNCdataBundle?.AuditID1', this?.props?.route?.params?.CreateNCdataBundle?.AuditID);

        this.props.navigation.navigate(ROUTES.CREATE_NC_SM, {
            auditDetailsList: this.props?.route?.params?.auditDetailsList,
            clauseMandatory: this.props?.route?.params?.clauseMandatory,
            CheckpointRoute: item.Category,
            AuditID: this?.props?.route?.params?.CreateNCdataBundle?.AuditID || this.state.AUDIT_ID,
            NCOFIDetails: this.state.CreateNCpass,
            templateId: 0,
            type: 'EDIT',
            data: item,
            isUploaded: false,
            Conformance: this?.props?.route?.params?.CreateNCdataBundle.Conformance,
            ProcessID: this?.props?.route?.params?.CreateNCdataBundle.ProcessID,
        });
        console.log(this?.props?.route?.params?.CreateNCdataBundle, 'Conformance==>');
    };

    getSectionListItem = item => {
        console.log('Item opened:fetchnc', item);

        this.setState(
            {
                NCmodalheader: item.title,
                CorrectiveOrder: item.CorrectiveOrder,
                CheckNC: item.CheckNC,
                isVisible: false,
                AttachmentList: [],
            },
            () => {
                console.log('modal set:fetchnc', this.state.NCmodalheader, this.state.NCtext);
                this.setState({ isVisible: true }, () => {
                    console.log('Modal opened:fetchnc!');
                });

                if (this.props.data.audits.isOfflineMode) {
                    console.log('Offline mode:fetchnc');
                } else {
                    NetInfo.fetch().then(isConnected => {
                        if (isConnected.isConnected) {
                            // call NC details here
                            this.fetchNCdetails();
                        }
                    });
                }
            },
        );
    };

    fetchNCdetails() {
        // var token = this.props.data.audits.token;
        var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
        // var Data = this.props.data.audits.audits
        var Data = this.props.data.audits.auditRecords;
        console.log('forming sds:fetchnc', token, this.state.AUDIT_ID, Data);

        for (var i = 0; i < Data.length; i++) {
            if (this.state.AUDIT_ID == Data[i].AuditId) {
                var AuditOrder = Data[i].AuditOrderId;
            }
        }

        console.log('forming:fetchnc', this.state.AUDIT_ID, this.state.AuditOrder);

        const CorrectiveId = this.state.AUDIT_ID;
        const CorrectiveOrder = this.state.CorrectiveOrder;
        console.log('corrective id:fetchnc', CorrectiveId, CorrectiveOrder);

        auth.getAllNCDetails(CorrectiveId, CorrectiveOrder, token, (res, data) => {
            console.log('incoming:fetchnc', res, data);
            // if (!res.ok) {
            //   throw new Error('Something went wrong!');
            // }

            if (data?.data) {
                console.log('entering:fetchnc', data.data);
                if (data?.data?.Message === 'Success') {
                    console.log('response:fetchnc', data.data.Message);
                    console.log('all nc details:fetchnc', data);
                    // console.log(
                    //   'data?.data?.Data?.NcDetails:fetchnc',
                    //   data?.data?.Data?.FailureCategory[0]?.FailureCategoryName,
                    //   data?.data?.Data?.NcDetails[0],
                    // );
                    // console.log("attachment:fetchnc",data?.data?.Data?.NCAttachment[0].Attachment,data?.data?.Data?.RequestedBy[0].RequestedBy)
                    console.log(':fetchnc', data.data.Message);
                    console.log(':fetchncsss reach1', data?.data?.Data?.ResponseDate?.length, data?.data?.Data?.NcDetails?.length);
                    if (data?.data?.Data?.ResponseDate && data?.data?.Data?.NcDetails) {
                        console.log(':fetchnc reach2', data?.data?.Data?.ResponseDate?.length, data?.data?.Data?.NcDetails?.length);
                        var UploadDate = data?.data?.Data?.NcDetails
                            ? data?.data?.Data?.NcDetails?.length == 0
                                ? '-'
                                : data?.data?.Data?.NcDetails[0]?.DateofUpload
                            : '-';
                        var Responsible = data?.data?.Data?.Responsibility
                            ? data?.data?.Data?.Responsibility?.length == 0
                                ? '-'
                                : data?.data?.Data?.Responsibility[0]?.ResponsibilityPerson
                            : '-';
                        var FailureCategory = data?.data?.Data?.FailureCategory
                            ? data?.data?.Data?.FailureCategory?.length == 0
                                ? '-'
                                : data?.data?.Data?.FailureCategory[0]?.FailureCategoryName
                            : '-';
                        var objectiveEvidence = data?.data?.Data?.NcDetails[0]?.ObjectiveEvidence;

                        var Request = data?.data?.Data?.RequestedBy
                            ? data?.data?.Data?.RequestedBy?.length == 0
                                ? '-'
                                : data?.data?.Data?.RequestedBy[0]?.RequestedByUsers
                            : '-';
                        var Category = data?.data?.Data?.CategoryDetail
                            ? data?.data?.Data?.CategoryDetail?.length == 0
                                ? '-'
                                : data?.data?.Data?.CategoryDetail[0]?.Category
                            : '-';
                        var Response = data?.data?.Data?.ResponseDate
                            ? data?.data?.Data?.ResponseDate?.length == 0
                                ? '-'
                                : data?.data?.Data?.ResponseDate[0]?.ResponseExtDate
                            : '-';
                        var Standard = data?.data?.Data?.StandardRequirement === null ? '-' : data?.data?.Data?.StandardRequirement;
                        var FileName = data?.data?.Data?.NcDetails[0]?.FileName === null ? '-' : data?.data?.Data?.NcDetails[0]?.FileName;
                        var Clause = data?.data?.Data?.StandardRequirement === null ? '-' : data?.data?.Data?.StandardRequirement[0]?.Element;

                        var NCtext = data?.data?.Data?.NcDetails[0]?.Nonconformity;

                        var DocumentReference = data?.data?.Data?.NcDetails
                            ? data?.data?.Data?.NcDetails?.length > 0
                                ? data?.data?.Data?.NcDetails[0]?.DocumentProcedure
                                : '-'
                            : '-';
                        var Process = data?.data?.Data?.NCProcess
                            ? data?.data?.Data?.NCProcess?.length == 0
                                ? '-'
                                : data?.data?.Data?.NCProcess[0]?.ProcessName
                            : '-';
                        var fileData = data?.data?.Data?.NCAttachment
                            ? data?.data?.Data?.NCAttachment?.length == 0
                                ? []
                                : data?.data?.Data?.NCAttachment
                            : [];

                        this.setState(
                            {
                                isAttachmentPresent: fileData.length > 0,
                            },
                            () => {
                                console.log('Attachment: Present:', this.state.isAttachmentPresent);
                            },
                        );

                        this.WriteAttachments(fileData);
                        // console.log("filepath",filepath)
                        // console.log('ncdetails:nc text reah set', NCtext)
                        this.setState(
                            {
                                UploadDate: UploadDate,
                                Responsible: Responsible,
                                Request: Request,
                                Category: Category,
                                Response: Response,
                                Standard: Standard,
                                loadingData: false,
                                NCtext: NCtext,
                                objectiveEvidence: objectiveEvidence,
                                FileName: FileName,
                                fileName: FileName,
                                FailureCategory: FailureCategory,
                                Clause: Clause,
                                Process: Process,
                                DocumentReference: DocumentReference,
                                fileData: fileData,
                                filepath: '',
                                filepathArray: '',
                                miniLoading: false,
                            },
                            () => {
                                var standText = '';
                                if (this.state.Standard !== '-') {
                                    for (var i = 0; i < Standard.length; i++) {
                                        standText = standText.concat(Standard[i].StdRequirement);
                                    }
                                    this.setState({ StandText: standText }, () => {
                                        console.log('StandText', this.state.StandText);
                                    });
                                } else {
                                    this.setState({ StandText: '-', loadingData: false }, () => {
                                        console.log('this.state.StandText', this.state.StandText, this.state.loadingData);
                                    });
                                }
                            },
                        );
                    }
                } else {
                    /* this.setState({ miniLoading : true },() =>{
            console.log('cant reach server',this.state.miniLoading)
          }) */
                    this.toast.show(strings.Audit_NCOFI_Failed, DURATION.LENGTH_LONG);
                }
            } else {
                console.log();
                this.toast.show(strings.Audit_NCOFI_Failed, DURATION.LENGTH_LONG);
            }
        });
    }

    getImageType(extn) {
        console.log(extn, ':Extension');

        switch (extn) {
            case 'image':
            case 'jpg':
            case 'png':
            case 'jpeg':
            case 'heic':
            case 'gif':
                return 'image/' + extn;
            case 'pdf':
                return 'application/pdf';
            case 'doc':
            case 'docx':
                return 'application/msword';
            case 'xls':
            case 'xlsx':
            case 'numbers':
            case 'xlsm':
                return 'application/vnd.ms-excel';
            case 'mp4':
            case 'mpeg':
            case 'mpg':
                return 'video/' + extn;
            default:
                return 'application/octet-stream';
        }
    }

    onNavigaTo(id) {
        //this.CheckSync();
        if (id === 1) {
            console.log('this?.props?.route?.params?.CreateNCdataBundle?.AuditID2', this?.props?.route?.params?.CreateNCdataBundle?.AuditID);
            this.props.navigation.navigate(ROUTES.CREATE_NC_SM, {
                auditDetailsList: this.props?.route?.params?.auditDetailsList,
                CheckpointRoute: 'NC',
                AuditID: this?.props?.route?.params?.CreateNCdataBundle?.AuditID || this.state.AUDIT_ID,
                // AuditID: this.state.AUDIT_ID,
                NCOFIDetails: this.state.CreateNCpass,
                templateId: 0,
                type: 'ADD',
                data: null,
                isUploaded: false,
            });
        }
        if (id === 2) {
            console.log('this?.props?.route?.params?.CreateNCdataBundle?.AuditID3', this?.props?.route?.params?.CreateNCdataBundle?.AuditID);
            this.props.navigation.navigate(ROUTES.CREATE_NC_SM, {
                auditDetailsList: this.props?.route?.params?.auditDetailsList,
                CheckpointRoute: 'OFI',
                AuditID: this?.props?.route?.params?.CreateNCdataBundle?.AuditID || this.state.AUDIT_ID,
                NCOFIDetails: this.state.CreateNCpass,
                templateId: 0,
                type: 'ADD',
                data: null,
                isUploaded: false,
            });
        }
    }

    RefreshUpload() {
        if (this.props.data.audits.isOfflineMode) {
            this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        } else {
            NetInfo.fetch().then(isConnected => {
                if (isConnected.isConnected) {
                    this.refreshList();
                } else {
                    this.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
                }
            });
        }
    }

    CheckInternetConnectivityNCOFI() {
        this.setState(
            {
                isLoaderVisible: true,
                dialogVisible: false,
                confirmpwd: false,
            },
            () => {
                var baseURL = this.props.data.audits.serverUrl;
                const check = create({
                    baseURL: baseURL + 'CheckConnection',
                });
                check.post().then(response => {
                    if (response.duration > constant.ThresholdSpeed) {
                        this.setState(
                            {
                                isLowConnection: true,
                            },
                            () => {
                                this.syncNCOFIToServer();
                                this.checkUser();
                                console.log('Download response', response);
                                console.log('Low network', this.state.isLowConnection);
                            },
                        );
                    } else {
                        this.syncNCOFIToServer();
                        this.checkUser();
                        console.log('Download response', response);
                        console.log('Low network', this.state.isLowConnection);
                    }
                });
            },
        );
    }

    checkUser = async () => {
        console.log('user id', this.props.data.audits.userId);
        var userid = this.state.currentUserData?.userId || this.props.data.audits.userId;
        var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
        var UserStatus = '';
        var serverUrl = this.props.data.audits.serverUrl;
        var ID = this.state.currentUserData?.userId || this.props.data.audits.userId;
        var type = 3;
        var path = '';
        const deviceId = await AsyncStorage.getItem('loginDeviceId');

        var RegisterDevice = this.props.data.audits.deviceid;
        console.log(userid, token, deviceId, RegisterDevice);

        auth.getCheckUser(userid, deviceId, token, (res, data) => {
            console.log('User information', data);
            if (data.data.Message == 'Success') {
                UserStatus = data.data.Data.ActiveStatus;
                if (UserStatus == 2) {
                    console.log('User active');

                    /** add one more layer for detecting deleted files. */

                    this.checkFilePath();
                } else if (UserStatus == 1) {
                    console.log('deleting user details');

                    var cleanURL = serverUrl.replace(/^https?:\/\//, '');
                    var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                    this.propsServerUrl = formatURL;

                    console.log('cleanURL', this.propsServerUrl);
                    // var ID = this.props.data.audits.userId
                    console.log('path', this.propsServerUrl + ID);

                    if (Platform.OS == 'android') {
                        path =
                            //   '/data/user/0/com.omnex.auditpro/cache/AuditUser' +
                            '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + ID;
                        console.log('path storing-->', path);
                    } else {
                        var iOSpath = RNFS.DocumentDirectoryPath;
                        path = iOSpath + '/' + this.propsServerUrl + ID;
                    }
                    console.log('*** path', path);
                    // this.deleteUserFile(path)
                    this.refs.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT);
                    // this.props.navigation.navigate('LoginUIScreen');
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                } else if (UserStatus == 0) {
                    Alert.alert('Your session has expired,Please login again.');

                    this.refs.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT);
                    // this.props.navigation.navigate(ROUTES.AUDIT_PAGE);
                    // this.props.navigation.navigate('LoginUIScreen');
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                }
            }
        });
    };

    async checkFilePath() {
        try {
            console.log('Checking file path');

            var AUDIT_ID = this.state.AUDIT_ID;
            var ncofiRecords = this.props.data.audits.ncofiRecords;
            var pushPath = [];

            console.log('Checking file path', AUDIT_ID);
            console.log('Checking file path', ncofiRecords);

            if (ncofiRecords) {
                for (var i = 0; i < ncofiRecords.length; i++) {
                    if (AUDIT_ID == ncofiRecords[i].AuditID) {
                        for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
                            console.log('Loop running', j);
                            const filedata = ncofiRecords[i].Pending[j].filedata;
                            if (filedata.length > 0) {
                                for (var k = 0; k < filedata.length; k++) {
                                    let filePath = filedata[k].fileData;

                                    let res = await this.isPathExist(filePath);
                                    console.log(res, 'resconsole===>');
                                    var check404 = res.slice(-4);
                                    console.log(check404, 'resconsole');
                                    if (check404 == '/404') {
                                        console.log('Error path found', res);
                                        pushPath.push(filedata[k]);
                                    } else {
                                        console.log('URL path is ok', res);
                                    }
                                }
                            }
                            console.log('pushPath ==>', pushPath);
                            if (pushPath.length > 0) {
                                this.alertUser(pushPath);
                            } else {
                                // the file path are ok. continue to sync
                                // this.syncNCOFIToServer();
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('checkFilePath', e);
        }
    }

    alertUser(pushPath) {
        console.log('getting broken path', pushPath);

        var AUDIT_ID = this.state.AUDIT_ID;
        var ncofiRecords = this.props.data.audits.ncofiRecords;
        var missingFindings = [];

        for (var i = 0; i < ncofiRecords.length; i++) {
            if (AUDIT_ID == ncofiRecords[i].AuditID) {
                for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
                    for (var p = 0; p < pushPath.length; p++) {
                        if (pushPath[p] == ncofiRecords[i].Pending[j].filedata) {
                            // this nc is missing filename
                            // make the filedata as empty field
                            console.log(ncofiRecords[i].Pending[j]);
                            var findings = {
                                NCNumber: ncofiRecords[i].Pending[j].NCNumber,
                                NonConfirmity: ncofiRecords[i].Pending[j].NonConfirmity,
                            };
                            missingFindings.push(findings);
                        }
                    }
                }
            }
        }
        this.setState(
            {
                missingFindings: missingFindings,
                isMissingFindings: false,
            },
            () => {
                console.log('missingFindings', this.state.missingFindings);
            },
        );
    }

    async isPathExist(arrpath) {
        try {
            return new Promise((resolve, reject) => {
                console.log('arrpath', arrpath);
                RNFS.readFile(arrpath, 'base64')
                    .then(res => {
                        if (res) {
                            // resolve(arrpath);
                            console.log(res, 'helloresconsole');
                            console.log('path found', arrpath);
                        }
                    })
                    .catch(err => {
                        // resolve(arrpath + '/' + 404);
                        console.warn('path not found', arrpath);
                    });
            });
        } catch (e) {
            console.warn('isPathExist', e);
        }
    }

    deleteUserFile(path) {
        console.log('RNFS.DocumentDirectoryPath', path);
        var serURL = this.props.data.audits.serverUrl;
        RNFS.exists(path)
            .then(result => {
                console.log('path result', result);
                if (result) {
                    RNFetchBlob.fs
                        .unlink(path)
                        .then(() => {
                            console.log('deleted success');
                            setTimeout(() => {
                                RNFS.exists(path).then(res => {
                                    console.log('path', res);
                                    this.setState(
                                        {
                                            dialogVisible: false,
                                        },
                                        () => {
                                            this.props.clearAudits();
                                            setTimeout(() => {
                                                this.props.storeServerUrl(serURL);
                                                console.log('FILE DELETED!');
                                                this.refs.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT);
                                                this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                                                console.log('Check server url', this.props.data);
                                            }, 600);
                                        },
                                    );
                                }, 1500);
                            });
                        })
                        .catch(err => {
                            console.log('err', err);
                        });
                } else {
                    console.log('Patha not found');
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    syncNCOFIToServer() {
        console.log('one:helloenter1');
        if (this.state.isLowConnection === false) {
            console.log('one:helloenter');
            if (this.props.data.audits.isOfflineMode) {
                this.setState({
                    isLoaderVisible: false,
                    dialogVisible: false,
                    syncMode: 0,
                });
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
            } else {
                NetInfo.fetch().then(isConnected => {
                    if (isConnected.isConnected) {
                        this.setState({ dialogVisible: false, syncMode: 3 }, function () {
                            console.log('Processing...', this.state.dialogVisible);
                        });
                        console.log('one:getting local unsaved data', this.props.data.audits.ncofiRecords);
                        var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
                        var formRequest = [];
                        var dataArr = this.props.data.audits.ncofiRecords;
                        for (var i = 0; i < dataArr.length; i++) {
                            if (dataArr[i].AuditID === this.state.AUDIT_ID) {
                                for (var j = 0; j < dataArr[i].Pending.length; j++) {
                                    if (dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId == 0) {
                                        if (dataArr?.[i]?.Pending?.[j]?.Category == 'NC') {
                                            const finalFileName = [...dataArr?.[i]?.Pending?.[j]?.filename].join(', ');
                                            // // dataArr?.[i]?.Pending?.[j]?.filename.concat(); // Concatenate the array
                                            const finalFileData = [...dataArr?.[i]?.Pending?.[j]?.filedata.map(item => item.fileData)].join(', ');
                                            console.log(finalFileName, '----one:concatenatedData1');
                                            // , dataArr?.[i]?.Pending?.[j]?.filename, dataArr?.[i]?.Pending?.[j]?.filename[0])
                                            console.log(finalFileData, dataArr?.[i]?.Pending?.[j]?.filedata, '----one:concatenatedData2');
                                            console.log('one:into NC targeted arr', [i], dataArr[i].Pending[j]);
                                            let reqBy = dataArr?.[i]?.Pending?.[j]?.requestDrop;
                                            formRequest.push({
                                                strProcess:
                                                    dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess.length > 0
                                                        ? dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess.join(',')
                                                        : '',
                                                CorrectiveId: dataArr?.[i]?.Pending?.[j]?.AuditID,
                                                CategoryId: dataArr?.[i]?.Pending?.[j]?.categoryDrop.id,
                                                Title: dataArr?.[i]?.Pending?.[j]?.NCNumber,
                                                FileName: finalFileName, //dataArr?.[i]?.Pending?.[j]?.filename,
                                                ElementID: dataArr?.[i]?.Pending?.[j]?.selectedItems
                                                    ? dataArr?.[i]?.Pending?.[j]?.selectedItems.join(',')
                                                    : 0,
                                                Department:
                                                    dataArr?.[i]?.Pending?.[j]?.deptDrop.id === undefined
                                                        ? 0
                                                        : dataArr?.[i]?.Pending?.[j]?.deptDrop.id,
                                                AuditStatus:
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == '' ||
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == undefined ||
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == null
                                                        ? 0
                                                        : parseInt(dataArr?.[i]?.Pending?.[j]?.auditstatus),
                                                NonConformity: dataArr?.[i]?.Pending?.[j]?.NonConfirmity,
                                                ResponsibilityUser: dataArr?.[i]?.Pending?.[j]?.userDrop.id,
                                                SiteId: dataArr?.[i]?.Pending?.[j]?.SiteID,
                                                RequestedBy: reqBy !== '' ? parseInt(reqBy) : reqBy,
                                                FormId: dataArr?.[i]?.Pending?.[j]?.Formid === '' ? 0 : parseInt(dataArr?.[i]?.Pending?.[j]?.Formid),
                                                ChecklistId:
                                                    dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId === ''
                                                        ? 0
                                                        : parseInt(dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId),
                                                RecommendedAction:
                                                    dataArr?.[i]?.Pending?.[j]?.recommAction === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.recommAction,
                                                FailureCategoryId: dataArr?.[i]?.Pending[j]?.failureDrop?.value,

                                                NCIdentifier:
                                                    dataArr?.[i]?.Pending?.[j]?.ncIdentifier === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.ncIdentifier,
                                                ObjectiveEvidence:
                                                    dataArr?.[i]?.Pending?.[j]?.objEvidence === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.objEvidence,
                                                uniqueNCkey: dataArr?.[i]?.Pending?.[j]?.uniqueNCkey,
                                                AttachEvidence: finalFileData, //dataArr?.[i]?.Pending?.[j]?.fileData,
                                                DocumentRef:
                                                    dataArr?.[i]?.Pending?.[j]?.documentRef === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.documentRef,
                                                Conformance: this?.props?.route?.params?.CreateNCdataBundle?.Conformance,
                                                ProcessID: this?.props?.route?.params?.CreateNCdataBundle?.ProcessID,
                                                // AttachEvidence:dataArr?.[i]?.Pending?.[j]?.filedata,
                                            });
                                        } else if (dataArr?.[i]?.Pending?.[j]?.Category == 'OFI') {
                                            const finalFileName = [...dataArr?.[i]?.Pending?.[j]?.filename].join(', ');
                                            const finalFileData = [...dataArr?.[i]?.Pending?.[j]?.filedata.map(item => item.fileData)].join(', ');
                                            console.log('one:into OFI targeted arr', [i], dataArr[i].Pending[j]);
                                            formRequest.push({
                                                strProcess:
                                                    dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess.length > 0
                                                        ? dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess.join(',')
                                                        : '',
                                                CorrectiveId: dataArr?.[i]?.Pending?.[j]?.AuditID,
                                                CategoryId: dataArr?.[i]?.Pending?.[j]?.categoryDrop.id,
                                                Title: dataArr?.[i]?.Pending?.[j]?.NCNumber,
                                                FileName: finalFileName, //dataArr?.[i]?.Pending?.[j]?.filename,
                                                Department:
                                                    dataArr?.[i]?.Pending?.[j]?.deptDrop.id === undefined
                                                        ? 0
                                                        : dataArr?.[i]?.Pending?.[j]?.deptDrop.id,
                                                AuditStatus:
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == '' ||
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == undefined ||
                                                    dataArr?.[i]?.Pending?.[j]?.auditstatus == null
                                                        ? 0
                                                        : parseInt(dataArr?.[i]?.Pending?.[j]?.auditstatus),
                                                RequestedBy: dataArr?.[i]?.Pending?.[j]?.requestDrop,
                                                NonConformity: dataArr?.[i]?.Pending?.[j]?.OFI,
                                                FormId: dataArr?.[i]?.Pending?.[j]?.Formid === '' ? 0 : parseInt(dataArr?.[i]?.Pending?.[j]?.Formid),
                                                SiteId: dataArr?.[i]?.Pending?.[j]?.SiteID,
                                                ChecklistId:
                                                    dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId === ''
                                                        ? 0
                                                        : parseInt(dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId),
                                                ElementID: dataArr?.[i]?.Pending?.[j]?.selectedItems
                                                    ? dataArr?.[i]?.Pending?.[j]?.selectedItems.join(',')
                                                    : 0,
                                                ResponsibilityUser: dataArr?.[i]?.Pending?.[j]?.userDrop.id,
                                                NCIdentifier:
                                                    dataArr?.[i]?.Pending?.[j]?.ncIdentifier === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.ncIdentifier,
                                                ObjectiveEvidence:
                                                    dataArr?.[i]?.Pending?.[j]?.objEvidence === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.objEvidence,
                                                FailureCategoryId: dataArr?.[i]?.Pending[j]?.failureDrop.value,
                                                RecommendedAction:
                                                    dataArr?.[i]?.Pending?.[j]?.recommAction === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.recommAction,
                                                uniqueNCkey: dataArr?.[i]?.Pending?.[j]?.uniqueNCkey,
                                                // Need to Add (Filedata array list)
                                                AttachEvidence: finalFileData, //dataArr?.[i]?.Pending?.[j]?.fileData,
                                                DocumentRef:
                                                    dataArr?.[i]?.Pending?.[j]?.documentRef === undefined
                                                        ? ''
                                                        : dataArr?.[i]?.Pending?.[j]?.documentRef,
                                                Conformance: this?.props?.route?.params?.CreateNCdataBundle?.Conformance,
                                                ProcessID: this?.props?.route?.params?.CreateNCdataBundle?.ProcessID,
                                                // AttachEvidence:dataArr?.[i]?.Pending?.[j]?.filedata,
                                            });
                                            console.log(formRequest, 'one:formrqstarrayone');
                                        }
                                    }
                                }
                            }
                        }
                        console.log('one:Request array pushed', formRequest, token);
                        if (formRequest.length > 0) {
                            this.formRequestArr(formRequest, token);
                        } else {
                            this.setState({ isLoaderVisible: false, dialogVisible: false, syncMode: 0 }, () => {
                                showErrorMessage(strings.noncofitosync);
                            });
                        }
                    } else {
                        this.setState({ isLoaderVisible: false, dialogVisible: false });
                        this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
                    }
                });
            }
        } else {
            this.setState({ isLoaderVisible: false, dialogVisible: false }, () => {
                Alert.alert(strings.nc_reply_06);
            });
            console.log('hitting here');
        }
    }

    formRequestArr(formRequest, token) {
        var datapass = formRequest;
        var TOKEN = token;

        console.log('one:keypass', datapass);

        auth.syncNCOFIToServer(datapass, TOKEN, (res, data) => {
            console.log('one:syncNCToServer data', data);
            if (data.data) {
                if (data.data.Message === 'Success') {
                    // this.setState({ isLoaderVisible: false }, function () {
                    //this.refs.toast.show(strings.NCSuccess, DURATION.LENGTH_LONG);
                    var responseData = data.data.Data;
                    this.checkFindingAttachment(responseData);
                    //this.AfterSyncdone();
                    // this.upLoadList()
                    // })
                } else {
                    this.setState({ isLoaderVisible: false, syncMode: 0, syncStatusLabel: '' }, function () {
                        this.refs.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG);
                    });
                }
            } else {
                this.setState({ isLoaderVisible: false, syncMode: 0, syncStatusLabel: '' }, function () {
                    this.refs.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG);
                });
            }
        });
    }

    async checkFindingAttachment(responseData) {
        try {
            var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
            var AUDIT_ID = this.state.AUDIT_ID;
            var ncofiRecords = this.props.data.audits.ncofiRecords;
            console.log(ncofiRecords, 'one:pending');
            if (ncofiRecords) {
                for (var i = 0; i < ncofiRecords.length; i++) {
                    if (AUDIT_ID == ncofiRecords[i].AuditID) {
                        for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
                            if (ncofiRecords[i].Pending[j].filedata.length > 0) {
                                this.attatchedFindings.push(ncofiRecords[i].Pending[j]);
                                let respdata = responseData.filter(m => m.UniqueNCkey == ncofiRecords[i].Pending[j].uniqueNCkey);
                                console.log('one:docparam:docpro Parameter', respdata, respdata[0].DocProParameter);
                            }
                        }
                    }
                }
            }
            console.log('one:Total number of attached Findings', this.attatchedFindings);
            if (this.attatchedFindings.length > 0) {
                this.setState(
                    {
                        syncStatusLabel: 'Syncing Attachments',
                        syncMode: 1,
                    },
                    () => {
                        console.log('two: Sync Initiated', this.state.syncMode);
                        this.formDocProObject(this.attatchedFindings, responseData);
                    },
                );
            } else {
                this.setState(
                    {
                        isLoaderVisible: false,
                    },
                    () => {
                        this.attatchedFindings = [];
                        this.formRequestObj = [];
                        successMessage({ message: '', description: strings.NCSuccess });
                        this.CompleteSync();
                    },
                );
            }
        } catch (e) {
            console.log('one:checkFindingAttachment', e);
        }
    }

    formDocProObject(attatchedFindings, responseData) {
        return new Promise(async (resolve, reject) => {
            var resData = responseData;
            console.log('one:resdata', resData);
            console.log('one:resdataattatchedFindings', attatchedFindings);
            const filedata = attatchedFindings.map(item => item.filedata);
            const fileArray = filedata.map(item => item.fileData).join(',');
            this.setState({
                filepathArray: fileArray,
            });

            // this.attatchedFindings = attatchedFindings
            // var formRequestObj = []
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var getDate = mm + '/' + dd + '/' + yyyy;
            let loopCount = 0;

            //dynamic value

            var AuditID = this.state.AUDIT_ID;
            var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
            var siteId = this.state.currentUserData?.siteId || this.props.data.audits.siteId;
            var UserId = this.state.currentUserData?.userId || this.props.data.audits.userId;
            var auditRecords = this.props.data.audits.auditRecords;
            var siteid = 'sit' + siteId;
            var effectivedate = getDate;
            var revdate = getDate;
            var dnum = '';
            var deviceId = await DeviceInfo.getUniqueId();
            for (var i = 0; i < auditRecords.length; i++) {
                if (AuditID == auditRecords[i].AuditId) {
                    dnum = auditRecords[i].AuditNumber;
                }
            }

            // static value
            var langid = 1;
            var userdtfmt = 'MM/DD/YYYY';
            var UserDtFmtDlm = '/';
            var filepath = '';
            var fromdocpro = 0;
            var frommod = 'mod2';
            var doctypeid = 0;
            var mod = 'mod2';
            var link = '';
            var keyword = 'AuditPro';
            var reason = '';
            var rev = 1;
            var paginate = '';
            var chgs_reqd = '';
            var spublic = 0;
            var ModEmailConFig = 0;
            var token = this.state.currentUserData?.accessToken || this.props.data.audits.token;
            let allattachments = [];
            if (attatchedFindings) {
                console.log('!!!!!!!!!!!!!!!@@@@@@@@@@#############', attatchedFindings);
                for (var j = 0; j < resData.length; j++) {
                    for (var i = 0; i < attatchedFindings.length; i++) {
                        if (attatchedFindings[i].uniqueNCkey.toString() == resData[j].UniqueNCkey) {
                            for (var k = 0; k < attatchedFindings[i].filedata.length; k++) {
                                console.log('one:==-->attachfindings.filename', attatchedFindings[i].filedata[k]);
                                let fileContents = '';
                                // for (let l = 0;l < attatchedFindings[i]?.filedata?.length;l++) {
                                try {
                                    const filePath = 'file:/' + attatchedFindings[i]?.filedata[k].fileData;
                                    fileContents = await RNFS.readFile(filePath, 'base64');
                                    //base64Array.push(fileContents);
                                } catch (error) {
                                    console.error('Error reading file:', error);
                                    fileContents = '';
                                    // Handle errors if needed
                                }
                                //}
                                loopCount++;

                                //console.log('Base64-encoded files:', base64Array);

                                console.log('one:==-->', attatchedFindings[i]);

                                let combinedString = attatchedFindings[i].filename;
                                const getdname = combinedString.join(',');
                                console.log('#####################filename', attatchedFindings[i].filedata[k]);
                                console.log('#####################filedata', attatchedFindings[i]?.filedata[k].fileData);
                                // console.log('#####################base64Array', base64Array[i]);
                                // console.log(
                                //   '#####################base64Array12333',
                                //   base64Array[k],
                                // );

                                let getfilename = attatchedFindings[i].filename;

                                const extensions = getfilename.map(fileName => {
                                    const parts = fileName.split('.');
                                    return parts[parts.length - 1];
                                });
                                console.log('#####################extenstiion', extensions[k]);

                                const dataString = resData[j].DocProParameter;

                                // Split the string based on the delimiter (',')

                                if (dataString === '') continue;
                                const splitItems = dataString.split(',');

                                // Push the split items into the array
                                var objArray = splitItems;
                                const objfinalArray = objArray[k].split('|')[0];
                                console.log('SPLITOBJARRAY', objfinalArray);
                                const allextentions = extensions.join(',');

                                console.log('attatchedFindings[i].filedata', resData[j].DocProParameter);

                                let getobj = resData[j].DocProParameter;
                                let getSitId = resData[j].SiteLevelId;
                                //var filecontent = base64Array[k] ? base64Array[k] : '';
                                var formobj = '';
                                var dname = attatchedFindings[i].filename[k];
                                var filename = attatchedFindings[i].filename[k];
                                var filepath = attatchedFindings[i]?.filedata[k].fileData;
                                var obj = objfinalArray;
                                var sitelevelid = getSitId;
                                formobj = {
                                    dnum: dnum,
                                    dname: dname,
                                    filename: filename,
                                    ext: extensions[k],
                                    filepath: filepath,
                                    obj: obj,
                                    fromdocpro: fromdocpro,
                                    frommod: frommod,
                                    doctypeid: doctypeid,
                                    siteid: siteid,
                                    mod: mod,
                                    sitelevelid: sitelevelid,
                                    link: link,
                                    keyword: keyword,
                                    reason: reason,
                                    rev: rev,
                                    effectivedate: effectivedate,
                                    revdate: revdate,
                                    paginate: paginate,
                                    chgs_reqd: chgs_reqd,
                                    spublic: spublic,
                                    ModEmailConFig: ModEmailConFig,
                                    deviceId: deviceId,
                                    filecontent: fileContents,
                                    lstUserPrefModel: [
                                        {
                                            siteid: siteId,
                                            UserId: UserId,
                                            langid: langid,
                                            userdtfmt: userdtfmt,
                                            UserDtFmtDlm: UserDtFmtDlm,
                                        },
                                    ],
                                };
                                console.log('one:formobj===>', formobj);

                                this.formRequestObj.push(formobj);
                                allattachments.push({
                                    filename: filename,
                                    obj: obj,
                                    status: null,
                                    path: filepath,
                                    exist: true,
                                });
                                var arr = this.formRequestObj;
                                resolve(arr);

                                this.setState({
                                    lengthCheck: this.formRequestObj,
                                });
                                // });
                            }
                            console.log(
                                'one:formobj===>length',
                                this.state.lengthCheck.length,
                                this.formRequestObj.length,
                                attatchedFindings.length,
                                attatchedFindings[i].filename.length,
                            );
                            console.log('one:formobj===>arraylength check---------', this.formRequestObj.length, loopCount);

                            //  if (this.formRequestObj.length == loopCount) {
                            //   console.log('one:formobj===>arr', arr);
                            //   this.callDocProAPI(this.state.allParamsArr, token);

                            //   }
                            this.setState({
                                allParamsArr: arr,
                            });
                        } else {
                            console.log('one:withoute nc');
                        }
                    }
                }
                console.log('!!!!!!!!!!!!!!!!!!!AllArray-------', this.state.allParamsArr);

                this.setState(
                    {
                        syncStatusLabel: 'Syncing Attachments',
                        syncMode: 1,
                        AuditAttachments: allattachments,
                        uploadIndex: 0,
                        totalFiles: this.formRequestObj.length,
                        FailedAttachments: [],
                    },
                    () => {
                        console.log('two: AudtAttachments', this.state.AuditAttachments);
                        this.callDocProAPI(this.state.allParamsArr, token);
                    },
                );

                console.log('!!!!!!!!!!!!!!!!!!!AllArray-------222222222', this.state.allParamsArr);
            }
        });
    }

    setSyncCompleted() {
        this.syncStatus = parseInt(this.syncStatus) + 1;
        this.setState(
            {
                syncStatusLabel:
                    this.state.FailedAttachments.length === 0 ? 'Sync to Server Completed.' : 'Sync to Server Completed with failed Attachment(s)',
                syncMode: this.state.FailedAttachments.length === 0 ? 4 : 2,
                //isLoaderVisible: false,
                lengthCheck: [],
            },
            () => {
                console.log('Document Successfully Sequence Completed');
                //this.AfterSyncdone();
                //this.refreshList();
            },
        );
    }

    async callDocProAPI(formRequestArrPush, token) {
        console.log('formRequestObjy-------222222222', formRequestArrPush);

        let index = this.state.uploadIndex;
        const formRequestObj = formRequestArrPush[index];
        const attachmentsArr = [];
        let failedAttachments = this.state.FailedAttachments;
        attachmentsArr.push(formRequestObj);

        // if (index <= formRequestArrPush.length -1){
        //   this.checkFileExist(formRequestObj.filepath).then((exist) => {
        //     if (exist){
        //       this.updateAttachmentStatus(true,index);
        //       if (this.state.uploadIndex > formRequestArrPush.length -1) {
        //         this.setSyncCompleted();
        //       } else {
        //         //failedAttachments.push(formRequestObj);
        //         this.setState({
        //           //FailedAttachments: failedAttachments,
        //           uploadIndex : parseInt(this.state.uploadIndex)+1,
        //           syncStatusLabel : "Syncing Attachment "  + (this.state.uploadIndex+1) + ' of ' + this.state.totalFiles,
        //           //saveLoader: false
        //         }, () => {
        //           this.callDocProAPI(formRequestArrPush,token)
        //         });
        //       }
        //     } else {
        //       console.log('syncFilesToDocPro File Not Exist!');
        //       this.updateAttachmentStatus(false,index,false);
        //       failedAttachments.push(formRequestObj);
        //       this.setState({
        //         FailedAttachments: failedAttachments,
        //         uploadIndex : parseInt(this.state.uploadIndex)+1
        //       }, () => {
        //         this.callDocProAPI(formRequestArrPush,token)
        //       });
        //     }
        //   });
        // }
        // else {
        //   this.setSyncCompleted()
        // }
        //   return;

        if (index <= formRequestArrPush.length - 1) {
            this.checkFileExist(formRequestObj.filepath).then(exist => {
                if (exist) {
                    auth.getdocProAttachment(attachmentsArr, token, (res, data) => {
                        console.log('one:uploading data', data, formRequestObj);
                        if (data.data != null && data.data.Success == true) {
                            this.updateAttachmentStatus(true, index);
                            if (this.state.uploadIndex >= formRequestArrPush.length - 1) {
                                this.setSyncCompleted();
                            } else {
                                this.setState(
                                    {
                                        uploadIndex: parseInt(this.state.uploadIndex) + 1,
                                    },
                                    () => {
                                        this.callDocProAPI(formRequestArrPush, token);
                                    },
                                );
                            }
                        } else {
                            //Api Returns false
                            this.AddFaileAttachments(formRequestObj, index);
                            this.callDocProAPI(formRequestArrPush, token);
                        }
                    });
                } else {
                    //File Not Exist
                    this.AddFaileAttachments(formRequestObj, index, false);
                    this.callDocProAPI(formRequestArrPush, token);
                }
            });
        } else {
            this.setSyncCompleted();
        }
    }

    async AddFaileAttachments(formRequestObj, index, exist = true) {
        let failedAttachments = this.state.FailedAttachments;
        failedAttachments.push(formRequestObj);
        this.updateAttachmentStatus(false, index, exist);
        this.setState(
            {
                FailedAttachments: failedAttachments,
                uploadIndex: parseInt(this.state.uploadIndex) + 1,
            },
            () => {},
        );
    }

    checkFileExist(path) {
        console.log('Attachment:>path', path);
        return new Promise((resolve, reject) => {
            RNFetchBlob.fs
                .exists(path)
                .then(exist => {
                    resolve(exist);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    updateAttachmentStatus = (status, index, exist = true) => {
        let updateAttach = [];
        for (var z = 0; z < this.state.AuditAttachments.length; z++) {
            let file = this.state.AuditAttachments[z];
            if (index === z) updateAttach.push({ ...file, status: status, exist: exist });
            else {
                updateAttach.push(file);
            }
        }
        this.setState(
            {
                AuditAttachments: updateAttach,
            },
            () => {
                console.log('update this.state.AuditAttachment', this.state.AuditAttachments);
            },
        );
    };

    convertFile = path => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!', path);
        return new Promise((resolve, reject) => {
            RNFS.readFile(path, 'base64')
                .then(data => {
                    console.log('one:pathres', path);
                    console.log('one:data', data);
                    resolve(data);
                })
                .catch(err => {
                    resolve(undefined);
                    console.log('one:Error in converting', err);
                });
        });
    };

    refreshList = async () => {
        await this.getAccessToken();
        var AuditID = this.state.AUDIT_ID;
        var Data = this.props.data.audits.auditRecords;
        var iAudProgId = undefined;
        var AuditTypeId = undefined;

        console.log('****', Data);
        console.log('AuditID', AuditID);

        var SiteID = this.state.currentUserData?.siteId || this.props.data.audits.siteId;
        var TOKEN = this.state.currentUserData?.accessToken || this.props.data.audits.token;
        let progID = await AsyncStorage.getItem('AUDITPROG_ID');
        console.log('checkDetailsss--------', progID);

        for (var i = 0; i < Data.length; i++) {
            if (this.state.AUDIT_ID == Data[i].AuditId) {
                if (this.props.data.audits.smdata == 2) {
                    console.log('innsideifprogid', Data[i]);
                    iAudProgId = -2;
                } else {
                    console.log('innsideelseprogid', Data[i].AuditTemplateId);
                    iAudProgId = progID;
                }
                AuditTypeId = Data[i].AuditTypeId;
            }
        }

        for (var j = 0; j < this.props.data.audits.auditRecords.length; j++) {
            if (this.state.AUDIT_ID === this.props.data.audits.auditRecords[j].AuditId) {
                var iAudTypeOrder = this.props.data.audits.auditRecords[j].AuditTypeOrder;
                var iAudProgOrder = this.props.data.audits.auditRecords[j].AuditProgOrder;
            }
        }
        console.log('heckdata--------,', this.props);

        this.setState(
            {
                token: TOKEN,
                AUDITPROG_ID: iAudProgId,
                AUDITYPE_ORDER: iAudTypeOrder,
                AUDITYPE_ID: AuditTypeId,
                SITEID: SiteID,
                AUDITPROGORDER: iAudTypeOrder,
            },
            () => {
                const strSortBy = 'order by Title asc';
                const strFunction = 'AuditNCOFI';

                console.log('Site ID ==>', this.state.SITEID);
                console.log('AUDITPROG_ID,AUDITYPE_ID', this.state.AUDITPROG_ID, this.state.AUDITYPE_ID);

                auth.getNCdetails(
                    this.state.SITEID,
                    strSortBy,
                    this.state.AUDIT_ID,
                    this.state.AUDITPROG_ID,
                    this.state.AUDITPROGORDER,
                    this.state.AUDITYPE_ORDER,
                    this.state.AUDITYPE_ID,
                    strFunction,
                    TOKEN,
                    (res, data) => {
                        console.log('getNC data', data);
                        console.log('response', res);

                        if (data.data) {
                            this.upLoadList(data.data.Data);
                        } else {
                            //this.refs.toast.show(strings.NCFAiled,DURATION.LENGTH_LONG)
                        }
                    },
                );
            },
        );
    };

    AfterSyncdone() {
        // remove pending list after sync
        var dupNCrecords = [];
        var NCrecords = this.props.data.audits.ncofiRecords;
        for (var i = 0; i < NCrecords.length; i++) {
            var pendingList = [];
            for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                // delete synced pending Nc/ofi
                if (this.state.AUDIT_ID !== NCrecords[i].AuditID) {
                    pendingList.push(NCrecords[i].Pending[j]);
                } else {
                    // save check point Nc/ofi
                    if (NCrecords[i].Pending[j].ChecklistTemplateId != 0) {
                        pendingList.push(NCrecords[i].Pending[j]);
                    }
                }
            }
            dupNCrecords.push({
                AuditID: NCrecords[i].AuditID,
                Uploaded: NCrecords[i].Uploaded,
                Pending: pendingList,
            });
        }
        this.props.storeNCRecords(dupNCrecords);
        //  to get updated uploaded  and pending list
        //this.refreshList();
    }

    upLoadList(list) {
        var Uploaded = list;
        console.log('getting props details...', this.props.data.audits);
        var dupNCrecords = [];
        var NCrecords = this.props.data.audits.ncofiRecords;
        for (var i = 0; i < NCrecords.length; i++) {
            var pendingList = [];
            for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
                    pendingList.push(NCrecords[i].Pending[j]);
                }
            }
            if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
                dupNCrecords.push({
                    AuditID: NCrecords[i].AuditID,
                    Uploaded: Uploaded ? Uploaded : [],
                    Pending: pendingList,
                });
            } else {
                dupNCrecords.push({
                    AuditID: NCrecords[i].AuditID,
                    Uploaded: NCrecords[i].Uploaded,
                    Pending: NCrecords[i].Pending ? NCrecords[i].Pending : [],
                });
            }
        }
        this.props.storeNCRecords(dupNCrecords);

        this.getDetails();
        this.setUpload();
    }

    changeDateFormatCard = inDate => {
        console.log('==-->', inDate);
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat; // + ' ' + 'HH:mm';
            var sDateArr = inDate.split('T');
            var sDateValArr = sDateArr[0].split('-');
            var sTimeValArr = sDateArr[1].split(':');
            var outDate = new Date(
                sDateValArr[0],
                sDateValArr[1] - 1,
                sDateValArr[2],
                // sTimeValArr[0],
                // sTimeValArr[1],
            );

            var test = Moment(outDate).format(DefaultFormatL);
            console.log('Moment', test);

            return Moment(outDate).format(DefaultFormatL);
        }
    };

    changeDateFormat = inDate => {
        console.log('==-->', inDate);
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat; // + ' ' + 'HH:mm';
            var sDateArr = inDate.split('T');
            var sDateValArr = sDateArr[0].split('-');
            var sTimeValArr = sDateArr[1].split(':');
            var outDate = new Date(
                sDateValArr[0],
                sDateValArr[1] - 1,
                sDateValArr[2],
                // sTimeValArr[0],
                // sTimeValArr[1],
            );

            return Moment(outDate).format(DefaultFormatL);
        }
    };

    closeReset() {
        this.setState({
            isVisible: false,
            miniLoading: false,
            CorrectiveOrder: null,
            loadingData: true,
            UploadDate: '',
            Responsible: '',
            Request: '',
            Category: '',
            Response: '',
            Standard: '',
            StandText: '',
            NCtext: '',
            objectiveEvidence: '',
            Clause: '',
            FailureCategory: '',
            Process: '',
            DocumentReference: '',
            filepath: '',
            FileName: '',
        });
    }

    checkOffline() {
        if (this.props.data.audits.isOfflineMode) {
            this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        } else {
            // this.setState({dialogVisible: true});
            // confirmpwd;
            this.setState({ confirmpwd: true });
        }
    }

    onConfirmPwdPress() {
        if (!this.state.pwdentry) {
            this.setState(
                {
                    isEmptyPwd: strings.enter_password,
                },
                () => {
                    // this.refs.toast.show('Empty password attempt', DURATION.LENGTH_SHORT)
                },
            );
        } else {
            NetInfo.fetch().then(isConnected => {
                if (isConnected.isConnected) {
                    Keyboard.dismiss();
                    var username = this.props?.data?.audits?.loginuser;
                    // var username = 'burakova'
                    var pwd = this.state.pwdentry;
                    var ncofiRecords = this.props.data.audits.ncofiRecords;
                    var auditid = this.state.AUDIT_ID;

                    var isEmpty = false;

                    if (ncofiRecords) {
                        ncofiRecords.forEach(item => {
                            if (item.AuditID == auditid) {
                                if (item.Pending.length == 0) {
                                    isEmpty = true;
                                }
                            }
                        });
                    }

                    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
                    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

                    var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(pwd), key, {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7,
                    });

                    auth.loginUser(username, encryptedpassword.toString(), '', this.state.deviceId, undefined, (res, data) => {
                        if (data.data.Success == true) {
                            if (isEmpty) {
                                this.setState(
                                    {
                                        confirmpwd: false,
                                        pwdentry: undefined,
                                        syncMode: 0,
                                    },
                                    () => {
                                        showErrorMessage(strings.noncofitosync);
                                    },
                                );
                            } else {
                                this.setState(
                                    {
                                        // confirmpwd : false,
                                        pwdentry: undefined,
                                    },
                                    () => {
                                        this.CheckInternetConnectivityNCOFI();
                                    },
                                );
                            }
                        } else {
                            this.setState(
                                {
                                    pwdentry: undefined,
                                    isEmptyPwd: data.data.Message,
                                },
                                () => {},
                            );
                        }
                    });
                } else {
                    this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
                }
            });
        }
    }

    getFileIcon(filename, filepath) {
        try {
            let icon = 'file';
            if (filename == null || typeof filename == 'undefined' || filename == '') return null;
            let type = filename !== '' ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : 'file';
            switch (type) {
                case 'pdf': {
                    icon = 'file-pdf-o';
                    break;
                }
                case 'doc':
                case 'docx': {
                    icon = 'file-word-o';
                    break;
                }
                case 'ppt':
                case 'pptx':
                case 'pps': {
                    icon = 'file-powerpoint-o';
                    break;
                }
                case 'xls':
                case 'xlsx':
                case 'numbers':
                case 'xlsm': {
                    icon = 'file-excel-o';
                    break;
                }
                case 'mp4':
                case 'mpg':
                case 'mpeg': {
                    icon = 'play';
                    break;
                }
                case 'jpg':
                case 'png':
                case 'gif': {
                    icon = 'image';
                    break;
                }
                default: {
                    icon = 'file';
                }
            }
            console.log('icon', icon);
            return icon === 'image' ? (
                <Image
                    source={{
                        uri: 'file:/' + filepath,
                    }}
                    style={styles.attachmentImagePreview}
                />
            ) : (
                <Icon name={icon} style={styles.attachmentIconPreview} size={65} color="#000" />
            );
        } catch (ex) {
            console.log('Error in getFile icon', ex);
        }
    }

    async WriteAttachments(Attachments) {
        console.log('Attachment:loadingData', this.state.loadingData, this.state.miniLoading);
        const path = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles') + '/';
        let AttachmentList = [];
        const count = Attachments.length;
        for (let i = 0; i < Attachments.length; i++) {
            const Attachment = Attachments[i];
            const filename = Attachment.FileName;
            const filecontent = Attachment.Attachment;
            const docId = Attachment.DocId;

            const extn = filename.substring(filename.lastIndexOf('.') + 1);
            let filepath = path + 'file_' + docId + '.' + extn;
            let docAttach = AttachmentList.filter(item => item.docid === docId);
            docAttach.length == 0 &&
                (await RNFetchBlob.fs.exists(filepath).then(exist => {
                    if (!exist || exist == '') {
                        RNFetchBlob.fs
                            .writeFile(filepath, filecontent, 'base64')
                            .then(res => {
                                console.log('Attachment:File Written' + i);
                                AttachmentList.push({
                                    docid: docId,
                                    filepath: filepath,
                                    filename: filename,
                                });

                                if (i == count - 1) {
                                    this.setState(
                                        {
                                            AttachmentList: AttachmentList,
                                            isAttachmentLoaded: true,
                                        },
                                        () => {
                                            console.log('Attachment Fully Loaded', this.state.AttachmentList);
                                        },
                                    );
                                }
                            })
                            .catch(err => {
                                console.log('Attachment:Err:' + i + ':Error:' + err);
                                AttachmentList.push({
                                    docid: docId,
                                    filepath: 'error',
                                    filename: filename,
                                });
                            });
                    } else {
                        console.log('Attachment:File Written' + i);
                        AttachmentList.push({
                            docid: docId,
                            filepath: filepath,
                            filename: filename,
                        });

                        if (i == count - 1) {
                            this.setState(
                                {
                                    AttachmentList: AttachmentList,
                                    isAttachmentLoaded: true,
                                },
                                () => {
                                    console.log('Attachment Fully Loaded', this.state.AttachmentList);
                                },
                            );
                        }
                    }
                }));
        }
    }

    openAttachmentFile = filepath => {
        console.log(filepath, 'Attachment:path');
        if (filepath == null || typeof filepath == 'undefined' || filepath == '') return;
        const fpath = FileViewer.open('file:/' + filepath) // absolute-path-to-my-local-file.
            .then(() => {
                console.log('Attachmentfile opened');
            })
            .catch(err => {
                console.log('Attachmentfile opened error', err);
            });
    };

    splitString = inputString => {
        // Split the input string based on the dot (.)
        const substrings = inputString.split('.');

        return substrings;
    };

    getFileFormat = fileName => {
        const splitFileName = fileName.split('.');
        return splitFileName.length > 1 ? splitFileName[splitFileName.length - 1] : null;
    };

    renderAttachment = () => {
        return this.state.isAttachmentPresent ? (
            <View style={styles.commoncard}>
                <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.Attach_EvidenceL}</Text>
                {this.state.isAttachmentLoaded && this.state.AttachmentList.length > 0 ? (
                    <View style={styles.attachmentListContainer}>
                        <FlatList
                            data={this.state.AttachmentList}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            style={styles.attachmentFlatList}
                        />
                    </View>
                ) : (
                    <View style={styles.attachmentLoadingRow}>
                        <Icon name="hourglass" size={15} color="#A6A6A6" style={styles.attachmentLoadingIcon} />
                        <Text numberOfLines={1} style={styles.attachmentLoadingText}>
                            Loading Attachments...
                        </Text>
                    </View>
                )}
            </View>
        ) : (
            <View></View>
        );
    };

    removeNC = () => {
        var dupNCrecords = [];
        var NCrecords = this.props.data.audits.ncofiRecords;
        for (var i = 0; i < NCrecords.length; i++) {
            var pendingList = [];
            for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                // remove the deleted NC
                const objNC = NCrecords[i].Pending[j];
                if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
                    if (objNC.uniqueNCkey !== this.state.deleteNCkey) {
                        pendingList.push(objNC);
                    }
                } else if (this.state.AUDIT_ID !== NCrecords[i].AuditID) {
                    pendingList.push(NCrecords[i].Pending[j]);
                }
            }
            dupNCrecords.push({
                AuditID: NCrecords[i].AuditID,
                Uploaded: NCrecords[i].Uploaded,
                Pending: pendingList,
            });
        }
        this.props.storeNCRecords(dupNCrecords);
        //  to get updated uploaded  and pending list
        this.setState(
            {
                deleteDialogVisible: false,
                deleteNCkey: '',
            },
            () => {
                console.log('delete dialog closed', this.state.deleteNCkey);
            },
        );
        this.refreshList();
    };

    renderItem = ({ item }) => {
        console.log('Attachment:Render Item', item);
        const filename = item.filename;
        return (
            <View style={styles.attachmentItemRow}>
                <View style={styles.attachmentItemContentColumn}>
                    <View>
                        {item.filepath !== '' && item.filepath !== 'error' && item.filepath !== null ? (
                            <TouchableOpacity onPress={this.openAttachmentFile.bind(this, item.filepath)}>
                                {this.getFileIcon(item.filename, item.filepath)}
                                <View style={styles.attachmentFilenameWrap}>
                                    <Text>{item.filename}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };

    OpenFile = path => {
        const fpath = FileViewer.open('file:/' + path) // absolute-path-to-my-local-file.
            .then(() => {
                console.log('Attachmentfile opened');
            })
            .catch(err => {
                console.log('Attachmentfile opened error', err);
            });
    };

    getSyncFileIcon(attach) {
        let icon = 'file';
        const filename = attach.filename;
        if (filename == null || typeof filename == 'undefined' || filename == '') return null;
        let type = filename !== '' ? filename.substring(filename.lastIndexOf('.') + 1) : 'file';
        switch (type) {
            case 'pdf': {
                icon = 'file-pdf-o';
                break;
            }
            case 'doc':
            case 'docx': {
                icon = 'file-word-o';
                break;
            }
            case 'ppt':
            case 'pps': {
                icon = 'file-powerpoint-o';
                break;
            }
            case 'xls':
            case 'xlsx':
            case 'numbers':
            case 'xlsm': {
                icon = 'file-excel-o';
                break;
            }
            case 'video':
            case 'mp4':
            case 'mpeg': {
                icon = 'play';
                break;
            }
            case 'image':
            case 'jpg':
            case 'png':
            case 'gif': {
                icon = 'image';
                break;
            }
            default: {
                icon = 'file';
            }
        }

        return (
            <View>
                <Icon name={icon} size={15} color="black" style={styles.syncFileIcon} />
            </View>
        );
    }

    retryFailedAttachments = attach => {
        const failedAttachments = this.state.FailedAttachments;
        const index = failedAttachments.findIndex(item => item.obj === attach.obj);

        if (index != -1) {
            const attachment = failedAttachments[index];
            const filename = attachment.filename;
            this.updateAttachmentStatus(null, index);
            this.setState(
                {
                    syncStatusLabel: 'Resyncing Attachments ' + filename,
                    syncMode: 1,
                },
                () => {
                    this.uploadFailedFileSync(attachment);
                },
            );
        } else {
            this.refs.toast.show('Attachment retry attempt failed!.', DURATION.LENGTH_LONG);
        }
    };

    uploadFailedFileSync = formRequestObj => {
        const token = this.props.data.audits.token;
        console.log(this.props.data.audits.token, 'TOKEN===>');

        const attachmentsArr = [];
        attachmentsArr.push(formRequestObj);
        auth.getdocProAttachment(attachmentsArr, token, (res, data) => {
            console.log('120 formRequestArr response', data);
            let updateAttachment = this.state.AuditAttachments;
            let failedAttachments = this.state.FailedAttachments;
            let index = updateAttachment.findIndex(item => item.obj === formRequestObj.obj);
            let rindex = failedAttachments.findIndex(item => item.obj === formRequestObj.obj);

            if (data.data != null && data.data.Message === 'Success') {
                this.updateAttachmentStatus(true, index);
                this.removeFromFailedAttachment(rindex);
            } else {
                this.updateAttachmentStatus(false, index);
                this.setState(
                    {
                        syncMode: 2,
                        syncStatusLabel: 'Sync to Server Completed with failed Attachment(s)',
                    },
                    () => {
                        this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
                    },
                );
            }
        });
    };

    renderFileUploadStatus = () => {
        console.log('this.state.AuditAttachments', this.state.AuditAttachments);

        return (
            <FlatList
                data={this.state.AuditAttachments}
                ListHeaderComponent={() => <Text style={styles.uploadStatusHeader}>Attachment Status</Text>}
                extraData={this.state}
                renderItem={(
                    { item, index }, //times-circle //check-circle
                ) => (
                    <TouchableOpacity style={styles.uploadStatusRow} onPress={() => this.OpenFile(item.path)}>
                        <View style={styles.uploadStatusIconCell}>{this.getSyncFileIcon(item)}</View>
                        <View style={styles.uploadStatusNameCell}>
                            <Text
                                multiline={true}
                                style={[styles.uploadStatusNameText, item.exist === false ? styles.uploadStatusNameMissing : null]}>
                                {item.filename}
                            </Text>
                        </View>
                        <View style={styles.uploadStatusActionCell}>
                            {item.status === null ? (
                                <Bars size={5} color="#1CB8CA" />
                            ) : item.status === true ? (
                                <View>
                                    <Icon name="check-circle" size={20} color="green" />
                                </View>
                            ) : item.status === false ? (
                                item.exist === false ? (
                                    <Icon name="times-circle" color="red" size={15} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.retryFailedAttachments(item);
                                        }}>
                                        <View style={styles.uploadStatusRetryWrap}>
                                            <Icon name="refresh" title="Retry" size={15} />
                                            <Text style={styles.uploadStatusRetryText}>{'Retry'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <View></View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        );
    };

    FailedAttachmentAlert = () => {
        Alert.alert(
            'Warning!',
            'There are some failed attachments, do you want to skip',
            [
                {
                    text: 'Skip',
                    onPress: () => {
                        this.CompleteSync();
                    },
                },
                {
                    text: 'Close',
                    style: 'cancel',
                    onPress: () => {
                        console.log('cancel clicked');
                    },
                },
            ],
            { cancelable: false },
        );
    };

    CheckSync = () => {
        this.setState(
            {
                syncStatusLabel: '',
            },
            () => {
                this.state.syncMode === 2 && this.FailedAttachmentAlert();
                this.state.syncMode === 4 && this.CompleteSync();
            },
        );
    };

    CompleteSync = () => {
        this.setState(
            {
                syncMode: 0,
                AuditAttachments: [],
            },
            () => {
                this.AfterSyncdone();
                this.refreshList();
            },
        );
    };

    removeFromFailedAttachment = index => {
        let FailedAttachments = this.state.FailedAttachments;
        let newFailedAttachment = [];
        for (let i = 0; i < FailedAttachments.length; i++) {
            if (i !== index) {
                newFailedAttachment.push(FailedAttachments[i]);
            }
        }
        this.setState(
            {
                FailedAttachments: newFailedAttachment,
                syncMode: newFailedAttachment.length === 0 ? 4 : 2,
                syncStatusLabel: newFailedAttachment.length === 0 ? 'Sync to Server Completed' : 'Sync to Server Completed with failed Attachment(s)',
            },
            () => {
                console.log('Retry Attachment Removed', this.state.FailedAttachments);
                //this.state.syncMode === 4 && this.reDirect()
            },
        );
    };

    render() {
        console.log('offf', this.props.data.audits.isOfflineMode);
        const layoutProfile = this.getLayoutProfile();
        const { height, showGridCards } = layoutProfile;
        const middle = height / 2 - 200;
        const attachmentHeight = middle + 100;
        const gridCardWidth = showGridCards ? '49%' : '100%';
        const contentWidthStyle = layoutProfile.maxContentWidth ? { maxWidth: layoutProfile.maxContentWidth } : null;
        const bodyResponsiveStyle = [
            styles.auditPageBody,
            styles.auditPageBodyTopPadding,
            styles.auditPageBodyResponsive,
            contentWidthStyle,
            { paddingHorizontal: layoutProfile.horizontalPadding },
        ];
        const cardsGridStyle = [styles.tabContentTopMargin, showGridCards ? styles.cardsGridContainer : null];
        const cardWrapperStyle = [styles.pendingItemRow, showGridCards ? styles.cardGridItem : null, { width: gridCardWidth }];
        const cardBoxResponsiveStyle = [styles.cardBox, showGridCards ? styles.cardBoxGrid : null];
        const footerContainerStyle = [styles.footerDiv, styles.footerDivContainer, styles.footerResponsiveWrap, contentWidthStyle];
        const footerActionColumnStyle = [styles.footerActionColumn, styles.footerActionColumnResponsive];
        const footerActionButtonStyle = [styles.footerActionButton, layoutProfile.isTablet ? styles.footerActionButtonTablet : null];
        const footerActionGradientStyle = [styles.footerActionButtonGradient, layoutProfile.isTablet ? styles.footerActionButtonGradientTablet : null];
        console.log(
            // this.getFileIcon(this.props.navigation.params),
            'fileextension-------',
        );
        //console.log(filesArray2, 'fileextensionthis.state.FILEPATH----');
        // console.log('router', this.props.navigation.state.params);
        console.log('this.state.NCdisplay1', this.state.NCUpload);
        console.log('ncdetailsconsole', this.state.NCdetails);
        console.log('ncdetails:date', this.state.UploadDate);
        console.log('ncdetails:nc text', this.state.NCtext);
        console.log('ncdetails:responsible', this.state.Responsible);
        console.log('ncdetails:obj', this.state.objectiveEvidence);
        console.log('ncdetails:req', this.state.Request);
        console.log('ncdetails:Cat', this.state.Category);
        console.log('ncdetails:CLa', this.state.Clause);
        console.log('ncdetails:fc', this.state.FailureCategory);
        console.log('ncdetails:Process', this.state.Process);
        console.log('ncdetails:DC', this.state.DocumentReference);
        console.log('this.state.CreateNCpass----', this.props.data.audits.ncofiRecords);
        const encodedBase64 = this.state.fileData;
        return (
            <View style={styles.wrapper}>
                {Platform.OS === 'ios' ? <View style={styles.iosTopSpacer} /> : <View style={styles.androidTopSpacer} />}
                <OfflineNotice />
                <GlobalHeader
                    title={`${strings.NC}/${strings.OFI}`}
                    subtitle={this.state.breadCrumbText}
                    onLeftPress={() => {
                        this.state.syncMode === 0 && this.props.navigation.goBack();
                    }}
                    onRightPress={() => {
                        this.CheckSync();
                        this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
                    }}
                />
                <View style={bodyResponsiveStyle}>
                    {this.state.isLoaderVisible === false ? (
                        <ScrollableTabView
                            renderTabBar={() => (
                                <DefaultTabBar
                                    backgroundColor="white"
                                    activeTextColor="#123C95"
                                    inactiveTextColor="#747474"
                                    underlineStyle={styles.tabUnderline}
                                    textStyle={styles.tabText}
                                />
                            )}
                            tabBarPosition="overlayTop">
                            <ScrollView tabLabel={strings.Pending} style={styles.scrollViewBody}>
                                {this.state.NCdisplay.length > 0 ? (
                                    <View style={cardsGridStyle}>
                                        {this.state.NCdisplay.map((item, key) => (
                                            <View key={item.uniqueNCkey || key} style={cardWrapperStyle}>
                                                <TouchableOpacity onPress={this.openEditBox.bind(this, item)} style={cardBoxResponsiveStyle}>
                                                    <View style={styles.sectionTop}>
                                                        <View style={styles.cardTopActionRow}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.setState(
                                                                        {
                                                                            deleteDialogVisible: true,
                                                                            deleteNCkey: item.uniqueNCkey,
                                                                        },
                                                                        () => {
                                                                            console.log('delete dialog opened', this.state.deleteNCkey);
                                                                        },
                                                                    );
                                                                }}>
                                                                <Icon name="trash" size={25} color="red" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxHeader}>
                                                                Findings {strings.Number}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxContent}>
                                                                {item.NCNumber}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.sectionBottom}>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxHeader}>
                                                                {strings.Non_confirmityL}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxContent}>
                                                                {item.data[0]}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    // {/* ui check */}
                                    <View style={styles.tabContentTopMargin}>
                                        <NoRecordFound />
                                    </View>
                                )}
                            </ScrollView>

                            <ScrollView tabLabel={strings.Uploaded} style={styles.scrollViewBody}>
                                {this.state.NCUpload.length > 0 ? (
                                    <View style={cardsGridStyle}>
                                        {this.state.NCUpload.map((item, key) => (
                                            <View key={item.uniqueNCkey || item.title || key} style={cardWrapperStyle}>
                                                <TouchableOpacity onPress={this.getSectionListItem.bind(this, item)} style={cardBoxResponsiveStyle}>
                                                    <View style={styles.sectionTop}>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxHeader}>
                                                                Findings {strings.Number}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxContent}>
                                                                {item.title}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.sectionBottom}>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxHeader}>
                                                                {/* {strings.Non_confirmityL} */}
                                                                {item.CheckNC === 0 ? 'Non conformity' : 'OFI'}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.sectionContent}>
                                                            <Text numberOfLines={1} style={styles.boxContent}>
                                                                {item.data[0]}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.tabContentTopMargin}>
                                        <NoRecordFound />
                                    </View>
                                )}
                            </ScrollView>
                        </ScrollableTabView>
                    ) : (
                        <View>
                            <View style={[styles.syncModeStatusContainer, { marginTop: middle }]}>
                                {this.state.syncMode === 2 ? (
                                    <Icon name="times-circle" color="red" size={50} />
                                ) : this.state.syncMode === 1 || this.state.syncMode === 3 || this.state.syncMode === 0 ? (
                                    <Bars size={20} color="#1CB8CA" />
                                ) : this.state.syncMode === 4 ? (
                                    <Icon name="check-circle" color="green" size={60} />
                                ) : null}
                                <Text style={styles.syncModeStatusText}>
                                    {this.state.syncStatusLabel === ''
                                        ? this.state.syncMode === 0
                                            ? 'Loading data....'
                                            : strings.Syncing_Audits
                                        : this.state.syncStatusLabel}
                                </Text>
                            </View>
                            <View style={[styles.syncAttachmentContainer, { height: attachmentHeight }]}>
                                {this.state.AuditAttachments.length > 0 && this.state.syncMode > 0 && this.renderFileUploadStatus()}
                            </View>
                        </View>
                    )}
                </View>

                <View style={[styles.footer, styles.footerContainer]}>
                    <View style={footerContainerStyle}>
                        <View style={styles.footerActionsRow}>
                            <View style={footerActionColumnStyle}>
                                {this.state.syncMode === 0 && (
                                    <TouchableOpacity onPress={once(this.onNavigaTo.bind(this, 1))} style={footerActionButtonStyle}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={NCOFI_BUTTON_GRADIENT}
                                            style={footerActionGradientStyle}>
                                            <Icon name="upload-cloud" size={25} color="white" />
                                            <Text style={styles.footerActionButtonText}>{strings.Create_NC}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {this.state.syncMode === 0 ? (
                                <View style={footerActionColumnStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState(
                                                {
                                                    dialogVisible: true,
                                                },
                                                () => {
                                                    console.log('Sync Dialog');
                                                },
                                            );
                                        }}
                                        style={footerActionButtonStyle}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={NCOFI_BUTTON_GRADIENT}
                                            style={footerActionGradientStyle}>
                                            <Icon name="refresh-ccw" size={25} color="white" />
                                            <Text style={styles.footerActionButtonText}>{strings.Upload_to_server}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ) : this.state.syncMode === 2 || this.state.syncMode === 4 ? (
                                <View style={footerActionColumnStyle}>
                                    <TouchableOpacity onPress={this.CheckSync.bind(this)} style={footerActionButtonStyle}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={NCOFI_BUTTON_GRADIENT}
                                            style={footerActionGradientStyle}>
                                            <Icon name="check-square" size={30} color="white" />
                                            <Text style={styles.footerActionButtonText}>{'Proceed'}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={footerActionColumnStyle}>
                                    <View style={footerActionButtonStyle}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={NCOFI_BUTTON_GRADIENT}
                                            style={footerActionGradientStyle}>
                                            <ActivityIndicator size={20} color="white" />
                                            <Text style={styles.footerActionButtonText}>{strings.Upload_to_server}</Text>
                                        </LinearGradient>
                                    </View>
                                </View>
                            )}

                            <View style={footerActionColumnStyle}>
                                {this.state.syncMode === 0 && (
                                    <TouchableOpacity onPress={once(this.onNavigaTo.bind(this, 2))} style={footerActionButtonStyle}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={NCOFI_BUTTON_GRADIENT}
                                            style={footerActionGradientStyle}>
                                            <Icon name="upload-cloud" size={25} color="white" />
                                            <Text style={styles.footerActionButtonText}>{strings.Create_OFI}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <Toast ref="toast" position="top" opacity={0.8} />

                <CommonAlertModal
                    visible={this.state.dialogVisible}
                    title={strings.NC_title}
                    message={strings.NC_title_message}
                    showCancel
                    confirmText={strings.yes}
                    cancelText={strings.no}
                    onConfirm={() => {
                        this.setState({ syncMode: 1 }, () => {
                            this.CheckInternetConnectivityNCOFI();
                        });
                    }}
                    onCancel={() => this.setState({ dialogVisible: false, syncMode: 0 })}
                />
                <CommonAlertModal
                    visible={this.state.deleteDialogVisible}
                    title={strings.ConfirmDelete}
                    showCancel
                    confirmText={strings.yes}
                    cancelText={strings.no}
                    onConfirm={this.removeNC.bind(this)}
                    onCancel={() => this.setState({ deleteDialogVisible: false })}
                />

                <Modal isVisible={this.state.isMissingFindings} onBackdropPress={() => this.setState({ isMissingFindings: false })}>
                    <View style={styles.missingModal}>
                        <View style={styles.missingMContainer}>
                            <Text style={styles.missingAlertTitle}>{strings.Missingattachmentalert}</Text>
                        </View>

                        {/* body */}
                        <View style={styles.missingBody}>
                            <View style={styles.missingBodyHeader}>
                                <Text style={styles.bodyText1}>{strings.ThefollowingNCOFIsaredetectedwithmissingattachmentfiles}</Text>
                                <Text style={styles.bodyText2}>{strings.Doyouwishtocontinuethesyncprocess}</Text>
                            </View>
                            <ScrollView style={styles.scrollBody}>
                                {this.state.missingFindings.map((items, i) => (
                                    <View key={i} style={styles.carddivMissing}>
                                        <View style={styles.cardContMissing}>
                                            <View style={styles.cardSecMissing}>
                                                <Text style={styles.missingLabelText}>{strings.ncnumber}</Text>
                                                <Text style={styles.missingNcNumberText}>{'items.NCNumber'}</Text>
                                            </View>
                                            <View style={styles.cardsec2Missing}>
                                                <Text style={styles.missingLabelText}>{strings.nonconfirmity}</Text>
                                                <Text numberOfLines={1} style={styles.missingNonconformityText}>
                                                    {items.NonConfirmity}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.cardFooterMissing}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({
                                        isLoaderVisible: false,
                                        isMissingFindings: false,
                                    })
                                }
                                style={styles.cardBtnDiv}>
                                <Text style={styles.missingGoBackText}>{strings.goBack}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({ isMissingFindings: false }, () => {
                                        this.syncNCOFIToServer();
                                    })
                                }
                                style={styles.cardBtn2Div}>
                                <Text style={styles.missingSkipContinueText}>{strings.skipandcontinue}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal */}
                <Modal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.ncModal}>
                        <View style={styles.modalheader}>
                            <View style={styles.modalTitleContainer}>
                                <Text style={styles.modalTitleText}>
                                    {/* {strings.NC_OFI_Detail} */}
                                    {this.state.CheckNC === 0 ? 'NC Detail' : 'OFI Detail'}
                                </Text>
                            </View>
                        </View>

                        <ScrollView style={styles.scrollview}>
                            <View style={styles.modalContentTopMargin}>
                                <View style={styles.firstCard}>
                                    <Text style={styles.boxHeader}>{strings.ncnumber}</Text>
                                    <Text style={styles.boxContent}>{this.state.NCmodalheader}</Text>
                                </View>
                                {this.state.miniLoading === false ? (
                                    <View>
                                        {this.state.loadingData === false ? (
                                            <View>
                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.Date_of_upload}</Text>
                                                    <Text style={styles.boxContent}>
                                                        {this.state.UploadDate
                                                            ? this.changeDateFormatCard(this.state.UploadDate) != ''
                                                                ? this.changeDateFormatCard(this.state.UploadDate)
                                                                : '-'
                                                            : '-'}
                                                    </Text>
                                                </View>

                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>
                                                        {/* {strings.Non_confirmityL} */}
                                                        {this.state.CheckNC === 0 ? 'Non conformity' : 'OFI'}
                                                    </Text>
                                                    <Text style={styles.boxContent}>{this.state.NCtext}</Text>
                                                </View>
                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.Objective_Evidence}</Text>
                                                    <Text style={styles.boxContent}>
                                                        {this.state.objectiveEvidence === '' ? '-' : this.state.objectiveEvidence}
                                                    </Text>
                                                </View>

                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.CategoryL}</Text>
                                                    <Text style={styles.boxContent}>{this.state.Category === '' ? '-' : this.state.Category}</Text>
                                                </View>

                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.ResponsibilityL}</Text>
                                                    <Text style={styles.boxContent}>
                                                        {this.state.Responsible === '' ? '-' : this.state.Responsible}
                                                    </Text>
                                                </View>

                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.RequestedL}</Text>
                                                    <Text style={styles.boxContent}>{this.state.Request === '' ? '-' : this.state.Request}</Text>
                                                </View>

                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.FailureCategory}</Text>
                                                    <Text style={styles.boxContent}>{this.state.FailureCategory}</Text>
                                                </View>
                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.ProcessL}</Text>
                                                    <Text style={styles.boxContent}>{this.state.Process}</Text>
                                                </View>
                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.Document_reference}</Text>
                                                    <Text style={styles.boxContent}>{this.state.DocumentReference}</Text>
                                                </View>
                                                {this.renderAttachment()}
                                                <View style={styles.commoncard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.ClausesL}</Text>
                                                    <Text style={styles.boxContent}>{this.state.Clause}</Text>
                                                </View>

                                                <View style={styles.lastcard}>
                                                    <Text style={[styles.boxHeader, styles.boxHeaderMarginTop]}>{strings.StandardRequirementsL}</Text>
                                                    <Text style={styles.boxContent}>{this.state.StandText === '' ? '-' : this.state.StandText}</Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.modalLoadingContainer}>
                                                <View style={styles.modalLoaderInner}>
                                                    <IconAwesome name="hourglass" size={20} color="black" />
                                                    <Text style={styles.modalLoadingText}>{strings.Loading}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View style={styles.modalFailureContainer}>
                                        <View style={styles.modalLoaderInner}>
                                            <IconAwesome name="spinner" size={20} color="black" />
                                            <Text>{strings.failed}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        <TouchableOpacity onPress={() => this.closeReset()} style={styles.closeDiv}>
                            <View style={styles.closeActionContainer}>
                                <Text style={styles.closeActionText}>{strings.Close}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.confirmpwd}
                    // onBackdropPress={()=>this.setState({confirmpwd:false})}
                >
                    <View style={styles.passwordModalContainer}>
                        <TouchableOpacity onPress={() => this.setState({ confirmpwd: false })}>
                            <Icon name="times-circle" style={styles.passwordModalCloseIcon} size={30} color="#2EA4E2" />
                        </TouchableOpacity>
                        <View style={styles.passwordModalContent}>
                            <View style={styles.passwordModalHeaderSection}>
                                <Text style={styles.passwordModalHeaderText}>{strings.enterthepasswordtocontinuesyncprocess}</Text>
                            </View>
                            <View style={styles.passwordModalFieldSection}>
                                <Text style={styles.passwordModalLabel}>{strings.Username}</Text>
                                <TextInput value={this.props.data.audits.loginuser} editable={false} style={styles.passwordModalUserInput} />
                            </View>
                            <View style={styles.passwordModalFieldSection}>
                                <Text style={styles.passwordModalLabel}>{strings.Password}</Text>
                                <TextInput
                                    value={this.state.pwdentry}
                                    style={styles.passwordModalPasswordInput}
                                    secureTextEntry={true}
                                    onChangeText={text => this.setState({ pwdentry: text, isEmptyPwd: undefined })}
                                />
                                <Text style={styles.passwordModalErrorText}>{this.state.isEmptyPwd ? this.state.isEmptyPwd : null}</Text>
                            </View>
                            <View style={styles.passwordModalActionSection}>
                                <TouchableOpacity onPress={() => this.onConfirmPwdPress()} style={styles.passwordModalContinueButton}>
                                    <Text style={styles.passwordModalContinueText}>{strings.continue}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
        storeServerUrl: serverUrl => dispatch({ type: 'STORE_SERVER_URL', serverUrl }),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NCOFIPage);
