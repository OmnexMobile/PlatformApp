import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Keyboard,
    ImageBackground,
    FlatList,
    InteractionManager,
    Platform,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    PermissionsAndroid,
    LayoutAnimation,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Images } from '../Themes/index';
import styles from '../styles/CreateNCStyle';
import { toast } from 'helpers/utils';
import { TOAST_STATUS } from 'constants/app-constant';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
// import auth from '../Services/Auth';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import OfflineNotice from '../components/OfflineNotice';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
// import Icon from 'react-native-vector-icons/Feather';
import { width } from 'react-native-dimension';
import ResponsiveImage from 'react-native-responsive-image';
import Moment from 'moment';
import Fonts from '../Themes/Fonts';
import { strings } from '../language/Language';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { debounce, once } from 'underscore';
// Voice packages
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileViewer from 'react-native-file-viewer';
import XLSX from 'xlsx'; // Import the xlsx library
import constant from '../constants/AppConstants';
// import ImagePicker from 'react-native-image-picker';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import GlobalHeader from 'components/GlobalHeader';
import NCFormInput from '../components/NCFormInput';
import Icon from 'react-native-vector-icons/Feather';
import DropdownComponent from 'components/dropdown';
import InputComponent from 'components/input-component';
import AttachmentSelectionModal from 'components/attachment-selection-modal';
import { showErrorMessage, successMessage } from 'helpers/utils';

let Window = Dimensions.get('window');
let timer = null;
var RNFS = require('react-native-fs');
const _ = require('underscore');
const getFileFormat = filename => {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
};
function generateUniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
const formatToIconMapping = {
    pdf: 'file',
    png: 'image',
    xls: '',
    xlsx: '',
    doc: '',
    docx: '',
    ppt: '',
    pptx: '',

    // Add more mappings as needed
};
class CreateNC extends Component {
    dimensionSubscription = null;

    categoryArr = [];
    departArr = [];
    RequestArr = [];
    UserArr = [];
    text1 = '';
    text2 = '';
    isCheck1 = '';
    isCheck2 = '';
    isCheck3 = '';
    isCheck4 = '';
    isCheck5 = '';
    isCheckCategory = '';
    isCheckDepart = '';
    isCheckUser = '';
    isCheckRequest = '';
    isCheckFailure = '';

    VoiceFill = false;
    VoicNCIdentifier = false;
    VoiceObjective = false;
    VoiceRecom = false;
    VoiceOfi = false;
    VoiceDocumentRef = false;
    AutoFillCatogory = false;
    AutoFillCDept = false;
    // VoiceClauseFill =  false
    VoiceRequesFill = false;
    VoiceResp = false;
    VoiceOFIcategory = false;

    constructor(props) {
        super(props);
        console.log('get this.props-->', this.props);
        this.state = {
            NCcategoryt: undefined,
            NCclause: undefined,
            NCuser: undefined,
            NCrequestby: undefined,
            NCdept: undefined,
            NCFailure: undefined,
            NCProcess: undefined,
            token: '',
            dropvalues: [],
            requirementText: undefined,
            nonconfirmityText: undefined,
            documentRef: undefined,
            NCresponsible: undefined,
            objEvidence: undefined,
            oppForImprovements: undefined,
            getDetails: [],
            AuditID: '',
            AuditOrder: '',
            ChecklistID: '',
            Formid: '',
            SiteID: '',
            auditstatus: '',
            title: '',
            auditnumber: '',
            RouteParam: '',
            ofitext: undefined,
            dummyOfitext: '',
            fileName: undefined,
            fileData: undefined,
            fileSize: undefined,
            Objective_Evidence: undefined,
            categoryArr: [],
            FailureCategory: [],
            departArr: [],
            RequestArr: [],
            UserArr: [],
            ProcessListAll: null,
            ProcessList: [],
            CategoryID: '',
            DeptID: '',
            UserID: '',
            RequestID: '',
            isContainValue0: true,
            isContainValue1: true,
            isContainValue2: true,
            isContainValue3: true,
            isContainValue4: true,
            isUpload: false,
            isSaved: false,
            isView: false,
            isVisible: false,
            isBrowse: false,

            selectedItems: [],
            selectedItemsProcess: [],
            clauseRecords: [],
            clausedata: [],
            processdata: [],
            displayData: undefined,
            MarkCat: false,
            MarkUser: false,
            MarkReq: false,
            MarkDept: false,
            MarkFailure: false,
            MarkClause: false,
            MarkProcess: false,
            MarkClausedrop: false,
            underline1: false,
            underline2: false,
            isSaving: false,
            type: '',
            ncData: null,
            templateId: 0,
            ncIdentifier: '',
            objEvidence: '',
            recommAction: '',
            breadCrumbText: undefined,
            dialogVisible: false,
            ProcessType: 1,
            startVoice: false,
            /** voice states */
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            PageLoader: true,
            AttachModal: false,
            modalDisplay: [],
            suggestionPopUp: false,
            flag1: false,
            txt: '',
            NCtxtFlag: false,
            isLPA: false,
            isSavebtn: false,
            isUploaded: false,
            missingfile: undefined,
            isBuffered: false,
            selectedItems: [],
            requestDropdown: [],
            clauseMandatory: 0,
            fileArrayList: [],
            selectedItemsProcessDumm: [],
            fileType: '', // 'pdf', 'txt', 'xls', 'png', or other values to indicate the file type
            fileContent: null,
            PrevNonConformity: '',
            screenWidth: Window.width,
            screenHeight: Window.height,
        };
        this.ensureVoiceHandlers();
    }

    isVoiceAvailable = () => {
        return Voice && typeof Voice === 'object';
    };

    safeRemoveVoiceListeners = async () => {
        if (!this.isVoiceAvailable() || typeof Voice.removeAllListeners !== 'function') {
            return;
        }

        if (Platform.OS === 'android') {
            return;
        }

        try {
            await Voice.removeAllListeners();
        } catch (error) {
            console.log('Voice listener cleanup failed', error);
        }
    };

    safeDestroyVoice = async () => {
        if (!this.isVoiceAvailable() || typeof Voice.destroy !== 'function') {
            return;
        }

        try {
            await Voice.destroy();
            await this.safeRemoveVoiceListeners();
        } catch (error) {
            console.log('Voice destroy failed', error);
        }
    };

    componentDidMount() {
        // InteractionManager.setDeadline(500);
        // InteractionManager.runAfterInteractions(() => {
        //   // ...long-running synchronous task...
        //   this.LongTask()
        // });
        var CurrentPage = this.props?.route?.name;
        console.log('--CurrentPage--->', CurrentPage);
        this.dimensionSubscription = Dimensions.addEventListener('change', this.handleDimensionChange);
        this.syncWindowDimensions();
        var routes = this.props.navigation.getState().routes;
        var getpreviouspage = routes[routes.length - 2]?.name;
        console.log('previous page' + getpreviouspage, 'routes', routes);

        this.ensureVoiceHandlers();

        // if (this.props.navigation.state.params.data != null) {
        if (this.props?.route?.params?.data != null) {
            console.log('this.props?.route?.params?.data', this.props?.route?.params?.data);
            this.setProcessList();
            const filenameArray = this.props?.route?.params?.data?.filename;
            console.log('checklist-filenameArray--------', filenameArray);
            const originalData = this.props?.route?.params?.data.filedata;
            console.log('checklist-originalData--------', originalData);

            if (originalData.length > 0) {
                console.log(
                    'XSDASDASDASD',
                    // this.props.navigation.state.params.data.filedata,
                    this.props?.route?.params?.data.filedata,
                );
                // const updatedData = originalData.map(item => 'file:/' + item);
                // const combinedData = filenameArray.map((fileName, index) => ({
                //   id: generateUniqueID(),
                //   fileName,
                //   fileData: originalData[index],
                // }));

                // Log the updated values
                console.log('Original Data:', this.state.fileArrayList);
                // console.log('Updated Data:', updatedData);
                // console.log('combinedData----------------------- Data:', combinedData);

                const selectedItems = Array.isArray(this.props?.route?.params?.data.selectedItemsProcess)
                    ? this.props?.route?.params?.data.selectedItemsProcess
                    : []; // ensure array

                // Filter out undefined elements
                const filteredItems = selectedItems.filter(item => item !== undefined);

                console.log('Filtered items:', filteredItems);
                //PROCESS   Selected items:----

                //SelectedArray--->
                const arr1 = this.props?.route?.params?.data.selectedItemsProcess;
                //Default array--->
                const arr2 = this.state.processdata;
                // console.log("this.state.processdatathis.state.processdata",arr1 );
                console.log('this.state.processdatathis.state.processdata123', this.state.selectedItemsProcessDumm);

                const matchingItems = [];

                for (let i = 0; i < arr1.length; i++) {
                    if (arr2.includes(arr1[i]?.id)) {
                        matchingItems.push(arr1[i]);
                    }
                }

                // Display the matching items
                console.log('Matching items:', matchingItems);
                this.setState({
                    fileArrayList: originalData,
                    selectedItemsProcess: filteredItems,
                });
                // Now you have an array without undefined elements (filteredItems)
            }
        }
        setTimeout(() => this.LongTask(), 1000);
        this.getUserDetails();
    }
    async getUserDetails() {
        // var userid = await AsyncStorage.getItem('userId');
        // var username = await AsyncStorage.getItem('userName');
        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = JSON.parse(stringifiedUserDetails);
        console.log('current userdata--->', value);
        console.log(value.userId, value.userFullName, 'Asyncusergetand set');
        var userDetails = [];
        userDetails.push({
            label: value.userFullName,
            value: value.userFullName,
            id: value.userId,
        });
        console.log(userDetails, 'userdetails');
        this.setState({
            requestDropdown: userDetails,
        });
    }

    // onSpeechResults = (e) => {this.setState({ nonconfirmityText: e.value[0] });};

    // handleInputChange = (text) => {     this.setState({ PrevNonConformity: this.state.nonconfirmityText, : text });   };

    componentWillMount() {
        if (Platform.OS === 'ios') {
            LayoutAnimation.easeInEaseOut();
        }
    }

    //Custom Icon for dropdown

    icon = ({ name, size = 18, style }) => {
        // flatten the styles
        const flat = StyleSheet.flatten(style);
        // remove out the keys that aren't accepted on View
        const { color, fontSize, ...styles } = flat;

        let iconComponent;

        const iconColor = color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '';

        const Down = <Icon name="chevron-down" size={20} color="grey" />;

        switch (name) {
            case 'keyboard-arrow-down':
                iconComponent = Down;
                break;
            default:
        }
        return <View style={styles}>{iconComponent}</View>;
    };

    LongTask() {
        this.setState({
            clauseMandatory:
                // this.props.navigation.state.params.NCOFIDetails.clauseMandatory,
                this.props?.route?.params?.NCOFIDetails?.clauseMandatory,
        });
        console.log(
            // this.props.navigation.state.params.NCOFIDetails.clauseMandatory,
            this.props?.route?.params?.NCOFIDetails?.clauseMandatory,
            'clausemandatory',
        );

        console.log(this.props.data, 'propsdataincoming');
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
        // console.log('CreateNCmounted', this.props.navigation.state.params);
        console.log('CreateNCmounted', this.props?.route?.params);
        // console.log('getting props',this.props.data.audits)

        var auditRecords = this.props.data.audits.auditRecords;
        var auditProcessListAll = null;
        var auditProgramId = null;
        var isLpa = false;
        console.log(
            'CreateNC auditRecords props',
            auditRecords,
            'AuditID',
            this.props.data.audits.auditRecords[0].AuditProcessList,
            // typeof this.props.navigation.state.params.NCOFIDetails == 'string'
            //   ? this.props.navigation.state.params.AuditID
            //   : this.props.navigation.state.params.NCOFIDetails.AuditID,
            typeof this.props?.route?.params?.NCOFIDetails == 'string'
                ? this.props?.route?.params?.AuditID
                : this.props?.route?.params?.NCOFIDetails?.AuditID,
        );

        for (var i = 0; i < auditRecords.length; i++) {
            var auid =
                // typeof this.props.navigation.state.params.NCOFIDetails == 'string'
                //   ? this.props.navigation.state.params.AuditID
                //   : this.props.navigation.state.params.NCOFIDetails.AuditID;
                typeof this.props?.route?.params?.NCOFIDetails == 'string'
                    ? this.props?.route?.params?.AuditID
                    : this.props?.route?.params?.NCOFIDetails?.AuditID;
            console.log('insideForauditRecords[i]', auditRecords[i].AuditId, 'porp', auid);
            if (auditRecords[i].AuditId == auid) {
                console.log('insideIFauditRecords[i]', auditRecords[i], auditRecords[i].AuditProcessList);
                auditProcessListAll = auditRecords[i].AuditProcessList;
                auditProgramId = auditRecords[i].AuditProgramId;
                break;
            }
        }

        if (auditProgramId) {
            if (auditProgramId == -1) {
                isLpa = true;
            }
        }

        console.log('auditProcessListAll', auditProcessListAll);
        console.log('isLpa', isLpa);

        if (this.props?.route?.params?.CheckpointRoute) {
            console.log('this.props?.route?.params', this.props?.route?.params);
            console.log('this.props?.route?.params?.CheckpointRoute', this.props?.route?.params?.NCOFIDetails);

            this.setState(
                {
                    isLPA: isLpa,
                    ProcessListAll: auditProcessListAll,
                    breadCrumbText: this.props?.route?.params?.NCOFIDetails?.breadCrumb,
                    // breadCrumbText: this.props?.route?.params?.NCOFIDetails?.breadCrumb.length > 30 ? this.props?.route?.params?.NCOFIDetails?.breadCrumb.slice(0, 30) + '...' : this.props?.route?.params?.NCOFIDetails?.breadCrumb,
                    RouteParam: this.props?.route?.params?.CheckpointRoute,
                    templateId: this.props?.route?.params?.templateId,
                    isUploaded: this.props?.route?.params?.isUploaded,
                    // dropvalues:this.props?.route?.params?.Drop,
                    AuditID:
                        typeof this.props?.route?.params?.NCOFIDetails == 'string'
                            ? this.props?.route?.params?.NCOFIDetails
                            : this.props?.route?.params?.NCOFIDetails?.AuditID,
                    AuditOrder: this.props?.route?.params?.NCOFIDetails?.AuditOrder,
                    ChecklistID: this.props?.route?.params?.NCOFIDetails?.ChecklistID,
                    Formid: this.props?.route?.params?.NCOFIDetails?.Formid,
                    SiteID: this.props?.route?.params?.NCOFIDetails?.SiteID,
                    auditstatus: this.props?.route?.params?.NCOFIDetails?.auditstatus,
                    title: this.props?.route?.params?.NCOFIDetails?.title,
                    auditnumber: this.props?.route?.params?.NCOFIDetails?.AUDIT_NO,
                    clauseRecords: this.props.data.audits.auditRecords,
                    type: this.props?.route?.params?.type,
                    ncData: this.props?.route?.params?.data,
                    selectedItems: Array.isArray(this.props?.route?.params?.data?.selectedItems) ? this.props?.route?.params?.data.selectedItems : [],
                    selectedItemsProcess: Array.isArray(this.props?.route?.params?.data?.selectedItemsProcess)
                        ? this.props?.route?.params?.data.selectedItemsProcess
                        : [],
                    displayData: this.props?.route?.params?.data ? this.props?.route?.params?.data.requiretext : undefined,
                    NCcategoryt: this.props?.route?.params?.data ? this.props?.route?.params?.data.categoryDrop : undefined,
                    NCrequestby: this.props?.route?.params?.data ? this.props?.route?.params?.data.userDrop : undefined,
                    NCdept: this.props?.route?.params?.data ? this.props?.route?.params?.data.deptDrop : undefined,
                    NCFailure: this.props?.route?.params?.data
                        ? this.props?.route?.params?.data.failureDrop == '0'
                            ? undefined
                            : this.props?.route?.params?.data.failureDrop
                        : undefined,
                    nonconfirmityText: this.props?.route?.params?.data ? this.props?.route?.params?.data.NonConfirmity : undefined,
                    NCresponsible: this.props?.route?.params?.data ? this.props?.route?.params?.data.requestDrop : undefined,
                    ofitext: this.props?.route?.params?.data ? this.props?.route?.params?.data.OFI : this.state.ofitext,
                    fileName: this.props?.route?.params?.data ? this.props?.route?.params?.data.filename : undefined,
                    fileData: this.props?.route?.params?.data ? this.props?.route?.params?.data.filedata : undefined,
                    ncIdentifier: this.props?.route?.params?.data ? this.props?.route?.params?.data.ncIdentifier : undefined,
                    objEvidence: this.props?.route?.params?.data ? this.props?.route?.params?.data.objEvidence : undefined,
                    recommAction: this.props?.route?.params?.data ? this.props?.route?.params?.data.recommAction : undefined,
                    documentRef: this.props?.route?.params?.data ? this.props?.route?.params?.data.documentRef : undefined,
                },
                () => {
                    this.getDropValue();
                    // this.readFile(this.state.fileData);
                    console.log('=selectedItemsProcess==>', this.state.selectedItemsProcess);
                    console.log(this.props?.route?.params, 'dataaa==>');
                },
            );
        } else {
            console.log('Audit props', this.props.data.audits);
            this.setState(
                {
                    isLPA: isLpa,
                    dropvalues: this.props?.route?.params?.DropDownval,
                    isUploaded: this.props?.route?.params?.isUploaded,
                    getDetails: this.props?.route?.params?.CreateNCdetails,
                    AuditID: this.props?.route?.params?.CreateNCdetails?.AuditID,
                    AuditOrder: this.props?.route?.params?.CreateNCdetails?.AuditOrder,
                    ChecklistID: this.props?.route?.params?.CreateNCdetails?.ChecklistID,
                    Formid: this.props?.route?.params?.CreateNCdetails?.Formid,
                    SiteID: this.props?.route?.params?.CreateNCdetails?.SiteID,
                    auditstatus: this.props?.route?.params?.CreateNCdetails?.auditstatus,
                    title: this.props?.route?.params?.CreateNCdetails?.title,
                    auditnumber: this.props?.route?.params?.CreateNCdetails?.AUDIT_NO,
                    RouteParam: this.props?.route?.params?.RouteValue,
                    clauseRecords: this.props.data.audits.auditRecords,
                    ofitext: this.props?.route?.params?.data?.OFI,
                    documentRef: this.props?.route?.params?.documentRef,
                },
                () => {
                    // console.log('Setting up dropdown values',this.state.dropvalues)
                    // console.log('Route value',this.state.RouteParam)
                    // console.log('this.state.dropvalues',this.state.dropvalues)
                    // console.log('fetching clause details...',this.state.clauseRecords)
                    // this.getDropDownData(this.state.dropvalues)
                    this.getDropValue();
                    // this.setProcessList()
                },
            );
        }
        console.log('auditstatus', this.state.auditstatus);
        console.log('AuditOrder', this.state.AuditOrder);
        var processautoid = this.props?.route?.params?.NCOFIDetails?.ProcessID;
        var type = this.props?.route?.params?.type;
        if (processautoid !== '' && processautoid !== null && processautoid !== undefined && type === 'ADD') {
            var processArray = [processautoid];
            this.setState({
                selectedItemsProcess: processArray,
                MarkProcess: false,
            });
        }
    }

    async componentWillReceiveProps(props) {
        console.log('test123this.props--> componentWillReceiveProps', this.props);
        const stringifiedCameraCapture = await AsyncStorage.getItem('cameraCapture');
        const value = JSON.parse(stringifiedCameraCapture);
        console.log('current cameraCapture async--->', value);
        // const {navigation} = this.props;
        // const cancelled = navigation.getParam('cancelpressed', 'empty');
        // const uri_details = navigation.getParam('Uri', 'empty');
        // const video_name = navigation.getParam('Name', 'empty');
        // const video_type = navigation.getParam('Type', 'empty');
        const cancelled = this.props?.route?.params?.cancelpressed || 'empty';
        const uri_details = this.props?.route?.params?.Uri || 'empty';
        const video_name = this.props?.route?.params?.Name || 'empty';
        const video_type = this.props?.route?.params?.Type || 'empty';
        console.log(cancelled + 'value');

        // need to fix
        // getCurrentPage = this.props?.data?.nav?.routes;
        // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
        var CurrentPage = this.props?.route?.name;
        console.log('--CurrentPage--->', CurrentPage);
        var routes = this.props.navigation.getState().routes;
        var getpreviouspage = routes[routes.length - 2]?.name;
        console.log('previous page' + getpreviouspage);

        if (CurrentPage == 'CREATE_NC') {
            this.InitVoice();
            console.log('exception1', this.props.data.audits.cameraCapture, this.state.fileName);
            if (this.props.data.audits.cameraCapture) {
                if (cancelled == 1) {
                    this.setState({
                        fileName: undefined,
                        fileData: undefined,
                        fileSize: undefined,
                    });
                    console.log('exception1 cancel', this.props.data.audits.cameraCapture);
                }

                if (cancelled == 0 && this.props.data.audits.cameraCapture.length == 0) {
                    console.log('inside save set state part..');
                    let FileArrayTemp = this.state.fileArrayList;
                    let FileArrayTempOne = [
                        {
                            id: Moment().unix(),
                            fileName: video_name,
                            fileData: uri_details,
                            fileSize: video_type,
                            filetype: 'video/mp4',
                        },
                    ];
                    console.log(FileArrayTemp, 'filearraytemp - will rcv pop');
                    let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                    // console.log(fileMergeResult, 'filearraytemp2xxxxxxxx11111');
                    this.setState(
                        {
                            fileArrayList: fileMergeResult,
                        },
                        () => {
                            console.log('fileName', this.state.fileName);
                        },
                    );
                }

                console.log('file name' + this.state.fileName);
                if (this.props.data.audits.cameraCapture.length > 0 && cancelled != 1) {
                    var res = this.props.data.audits.cameraCapture;
                    console.log('exception3', this.props.data.audits.cameraCapture);
                    let FileArrayTemp = this.state.fileArrayList;
                    let FileArrayTempOne = [
                        {
                            fileName: res[0].name,
                            fileData: res[0].uri,
                            fileSize: res[0].type,
                            id: Moment().unix(),
                        },
                    ];
                    console.log(FileArrayTemp, 'filearraytemp');
                    let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                    // console.log(fileMergeResult, 'filearraytemp2xxxxxxx22222');

                    const uniqueFiles = fileMergeResult.reduce((accumulator, currentFile) => {
                        if (!accumulator.find(file => file.fileData === currentFile.fileData)) {
                            accumulator.push(currentFile);
                        }
                        return accumulator;
                    }, []);
                    console.log('!!!!!!!!!!!!!!!!!@@@@@@@@@@@@', uniqueFiles);

                    this.setState(
                        {
                            fileArrayList: uniqueFiles,
                        },
                        () => {
                            console.log('fileName', this.state.fileName);
                        },
                    );
                } else {
                    console.log('no pic found');
                    console.log('inside file path' + this.state.fileData);
                    console.log('exception14', this.props.data.audits.cameraCapture);
                }
            } else {
                console.log('no pic found');
            }
        } else {
            console.log('CreateNC pass');
        }
    }
    StartVoicePress() {
        console.log('voice:StartVoicePressdebouncer activate');
        if (Platform.OS == 'ios') {
            this.safeRemoveVoiceListeners();
            this.InitVoice();
        }
        this._startRecognizing();
    }

    StopVoicePress() {
        console.log('voice:StopVoicePressdebouncer activate');
        this._stopRecognizing();
        this.safeRemoveVoiceListeners();
        this.InitVoice();
    }

    InitVoice() {
        console.log('voice:InitVoice');
        this.ensureVoiceHandlers();

        this.setState(
            {
                recognized: '',
                pitch: '',
                error: '',
                started: '',
                results: [],
                partialResults: [],
                end: '',
                startVoice: false,
            },
            () => {
                console.log('voice:setSTate called');
            },
        );
    }

    ensureVoiceHandlers = () => {
        if (!this.isVoiceAvailable()) {
            return;
        }

        try {
            Voice.onSpeechStart = this.onSpeechStart;
            Voice.onSpeechRecognized = this.onSpeechRecognized;
            Voice.onSpeechEnd = this.onSpeechEnd;
            Voice.onSpeechError = this.onSpeechError;
            Voice.onSpeechResults = this.onSpeechResults;
            Voice.onSpeechPartialResults = this.onSpeechPartialResults;
            Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
        } catch (error) {
            console.log('Voice listener setup failed', error);
        }
    };

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
        this.safeDestroyVoice();
        var cameraCapture = [];
        this.props.storeCameraCapture(cameraCapture);
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
        const stateWidth = screenWidth || liveWindow.width;
        const stateHeight = screenHeight || liveWindow.height;
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
            isLandscape,
            isTablet,
            maxContentWidth: isTablet ? (isLandscape ? 1100 : 860) : undefined,
            horizontalPadding: isTablet ? (isLandscape ? 28 : 24) : 16,
        };
    };

    cameraAction(type) {
        this.setState(
            {
                AttachModal: false,
            },
            () => {
                if (type == 'Camera') {
                    this.props.navigation.navigate(ROUTES.CAMERA_CAPTURE);
                } else if (type == 'Video') {
                    // this.props.navigation.navigate('VideoCapture');
                    this.props.navigation.navigate(ROUTES.VIDEO_CAPTURE);
                }
            },
        );
    }

    async readFile(arrpath) {
        if (arrpath) {
            return new Promise((resolve, reject) => {
                console.log('arrpath', arrpath);
                RNFS.readFile(arrpath, 'base64')
                    .then(res => {
                        if (res) {
                            // resolve(arrpath);
                            console.log(res, 'resvalue');
                            console.log('path found', arrpath);
                        }
                    })
                    .catch(err => {
                        // resolve(arrpath+'/'+404)
                        this.setState({
                            missingfile: strings.Filemaybebrokenorhasbeenremoved,
                            fileName: undefined,
                            fileData: undefined,
                        });
                        console.warn('path not found', this.state.fileName);
                        console.warn('file reseted', this.state.fileData);
                    });
            });
        }
    }

    onSpeechStart = e => {
        const started = e && e.value ? e.value : '√';
        this.setState({
            started,
        });
    };

    onSpeechRecognized = e => {
        const recognized = e && e.value ? e.value : '√';
        this.setState({
            recognized,
        });
    };

    onSpeechError = e => {
        // eslint-disable-next-line
        console.log('voice:onSpeechError: ', e);
        this.setState({
            error: JSON.stringify(e.error),
            startVoice: false,
            // isVisible:false
        });
        if (Platform.OS == 'ios') {
            this._startRecognizing();
        }
        // this.safeRemoveVoiceListeners()
        // this.InitVoice()
    };

    onSpeechResults = e => {
        // eslint-disable-next-line
        console.log('voice:onSpeechResults: ', e);
        if (Platform.OS == 'android') {
            this.setState(
                {
                    results: e.value[0],
                },
                () => {
                    this.VoiceLogic();
                },
            );
        } else {
            this.setState({ results: e.value });
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                this.stopRecording();
            }, 2000);
        }
    };

    onSpeechPartialResults = e => {
        // eslint-disable-next-line
        console.log('voice:onSpeechPartialResults: ', e);
        this.setState(
            {
                partialResults: e.value,
            },
            () => {
                console.log('_----_', this.state.partialResults);
            },
        );
    };

    onSpeechEnd = e => {
        // eslint-disable-next-line
        console.log('voice:onSpeechEnd: ', e);
        if (Platform.OS === 'ios') {
            timer = null;
            this.setState({ listening: false });
            if (this.state.results != null && this.state.results != '') {
                console.log('--------------------');
                this.VoiceLogic();
            }
        } else {
            console.log('onSpeechEnd: ', e);
            this.setState({
                end: '√',
                started: '',
            });
        }
    };

    async stopRecording() {
        if (!this.isVoiceAvailable() || typeof Voice.stop !== 'function') {
            return;
        }

        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    }

    onSpeechVolumeChanged = e => {
        // eslint-disable-next-line
        console.log('voice:onSpeechVolumeChanged: ', e);
        this.setState({
            pitch: e.value,
        });
    };

    _startRecognizing = async () => {
        console.log('voice:_startRecognizing');
        if (!this.isVoiceAvailable() || typeof Voice.start !== 'function') {
            this.setState({ startVoice: false });
            return;
        }

        this.setState(
            {
                recognized: '',
                pitch: '',
                error: '',
                started: '',
                results: [],
                partialResults: [],
                end: '',
                startVoice: true,
                flag1: false,
                // isVisible:true
            },
            () => {
                console.log('flag reset');
            },
        );
        this.ensureVoiceHandlers();
        try {
            if (this.props.data.audits.language === 'Chinese') {
                await Voice.start('zh');
            } else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
                await Voice.start('en-US');
            }
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        if (!this.isVoiceAvailable() || typeof Voice.stop !== 'function') {
            return;
        }

        try {
            console.log('voice:_stopRecognizing');
            await Voice.stop();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        if (!this.isVoiceAvailable() || typeof Voice.cancel !== 'function') {
            return;
        }

        try {
            console.log('voice:_cancelRecognizing');
            await Voice.cancel();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        await this.safeDestroyVoice();
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
        });
    };

    openAttachmentFile = path => {
        console.log(path, 'Attachment:path');
        if (path == null || typeof path == 'undefined' || path == '') return;
        // const fpath = FileViewer.open('file:/' + path) // absolute-path-to-my-local-file.
        //   .then(() => {
        //     console.log('Attachmentfile opened');
        //   })
        //   .catch(err => {
        //     console.log('Attachmentfile opened error', err);
        //   });

        FileViewer.open(path, { showOpenWithDialog: true })
            .then(() => {
                // success
                console.log('SUCESSSSSPATH-----------', path);
            })
            .catch(error => {
                console.log('failure----------', error);
            });
    };

    getFileIcon(filename, fileData) {
        console.log('XXXXXXXXXXXX-------', fileData, filename);
        let icon = 'file';
        if (filename == null || typeof filename == 'undefined' || filename == '') return null;
        let type = filename !== '' ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : 'file';
        switch (type) {
            case 'pdf': {
                icon = 'file';
                break;
            }
            case 'doc':
            case 'docx': {
                icon = 'file';
                break;
            }
            case 'ppt':
            case 'pptx':
            case 'pps': {
                icon = 'file';
                break;
            }
            case 'xls':
            case 'xlsx':
            case 'xlsm': {
                icon = 'file';
                break;
            }
            case 'mp4':
            case 'mpeg': {
                icon = 'play';
                break;
            }
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'heic':
            case 'gif': {
                icon = 'image';
                break;
            }
            default: {
                icon = 'file';
            }
        }

        return icon === 'image' ? (
            <Image
                source={{
                    uri: 'file:/' + fileData,
                }}
                style={styles.attachmentImageLarge}
            />
        ) : (
            <View style={styles.attachmentIconContainer}>
                <Icon name={icon} size={65} color="black" style={styles.attachmentIconLarge} />
            </View>
        );
    }

    VoiceLogic() {
        console.log('voice:VoiceLogic');

        if (Platform.OS == 'ios') {
            var txt = this.state.results[0];
        } else {
            var txt = this.state.results;
        }
        console.log('_---_results: ', this.state.results);
        console.log('_---txt: ', txt);

        if (this.VoiceDocumentRef === true) {
            this.setState(
                {
                    documentRef: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this.docRefTxtField?.blur?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceFill === true) {
            this.setState(
                {
                    PrevNonConformity: this.state.nonconfirmityText,
                    nonconfirmityText: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                // this.setState( ( {
                //   nonconfirmityText: txt.charAt(0).toUpperCase() + txt.slice(1)
                // })
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });

                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceOfi === true) {
            this.setState(
                {
                    ofitext: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;

                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoicNCIdentifier === true) {
            this.setState(
                {
                    ncIdentifier: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceObjective === true) {
            this.setState(
                {
                    objEvidence: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this.objEviTxtField?.blur?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceRecom === true) {
            this.setState(
                {
                    recommAction: txt.charAt(0).toUpperCase() + txt.slice(1),
                },
                () => {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.AutoFillCatogory === true) {
            var CategoryList = this.state.categoryArr;
            var AutoFillData = null;
            for (var i = 0; i < CategoryList.length; i++) {
                if (txt.toLowerCase() == CategoryList[i].value.toLowerCase()) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    AutoFillData = CategoryList[i];
                    break;
                }
            }
            this.setState(
                {
                    NCcategoryt: AutoFillData,
                },
                () => {
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this.categoryTxtField?.close?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceOFIcategory === true) {
            var CategoryList = this.state.categoryArr;
            var AutoFillData = null;
            for (var i = 0; i < CategoryList.length; i++) {
                if (txt.toLowerCase() == CategoryList[i].value.toLowerCase()) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    AutoFillData = CategoryList[i];
                    break;
                }
            }
            this.setState(
                {
                    NCcategoryt: AutoFillData,
                },
                () => {
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;

                    this.categoryTxtField?.close?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.AutoFillCDept === true) {
            var DeptList = this.state.departArr;
            var AutoFillData = null;
            for (var i = 0; i < DeptList.length; i++) {
                if (txt.toLowerCase() == DeptList[i].value.toLowerCase()) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    AutoFillData = DeptList[i];
                    break;
                }
            }
            this.setState(
                {
                    NCdept: AutoFillData,
                },
                () => {
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;

                    if (this.state.departArr.length > 0) {
                        this.departmentTxtField?.close?.();
                        this._stopRecognizing();
                        this.safeRemoveVoiceListeners();
                        this.InitVoice();
                    }
                },
            );
        } else if (this.VoiceResp === true) {
            var Request = this.state.UserArr;
            var AutoFillData = null;
            for (var i = 0; i < Request.length; i++) {
                if (txt.toLowerCase() == Request[i].value.toLowerCase()) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    AutoFillData = Request[i];
                    break;
                }
            }
            this.setState(
                {
                    NCresponsible: AutoFillData,
                },
                () => {
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this.responsibleTxtField?.close?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else if (this.VoiceRequesFill === true) {
            var UserArr = this.state.RequestArr;
            var AutoFillData = null;
            for (var i = 0; i < UserArr.length; i++) {
                if (txt.toLowerCase() == UserArr[i].value.toLowerCase()) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak(strings.cn_reply_03);
                    });
                    AutoFillData = UserArr[i];
                    break;
                }
            }
            this.setState(
                {
                    NCrequestby: AutoFillData,
                },
                () => {
                    this.VoiceFill = false;
                    this.VoicNCIdentifier = false;
                    this.VoiceObjective = false;
                    this.VoiceRecom = false;
                    this.VoiceOfi = false;
                    this.AutoFillCatogory = false;
                    this.AutoFillCDept = false;
                    this.VoiceDocumentRef = false;
                    this.VoiceRequesFill = false;
                    this.VoiceResp = false;
                    this.VoiceOFIcategory = false;
                    this.requestTxtField?.close?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                },
            );
        } else {
            /** Speech detect section yyyyy */
            if (txt.toLowerCase().includes(strings.va_hi) || txt.toLowerCase().includes(strings.va_hello)) {
                this._stopRecognizing();
            } else if (
                //Clauses
                txt.toLowerCase().includes(strings.va_cmd41) ||
                txt.toLowerCase().includes(strings.va_cmd42) ||
                txt.toLowerCase().includes(strings.va_cmd46) ||
                txt.toLowerCase().includes(strings.va_cmd47) ||
                txt.toLowerCase().includes(strings.va_cmd48)
            ) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep01);
                });
                this.clauseListField._toggleSelector();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
            } else if (
                //process
                txt.toLowerCase().includes(strings.va_cmd51) ||
                txt.toLowerCase().includes(strings.va_cmd52)
            ) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep02);
                });
                this.processListField._toggleSelector();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
            } else if (txt.toLowerCase().includes(strings.va_cmd61)) {
                //NC
                this.VoiceFill = true;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                this.ncTxtField?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep03);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (
                //Resposibility
                txt.toLowerCase().includes(strings.va_cmd71) ||
                txt.toLowerCase().includes(strings.va_cmd72)
            ) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep04);
                });
                this.responsibleTxtField?.focus?.();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
                // setTimeout(() => {
                //   this._startRecognizing();
                // }, 2500);
            } else if (
                //Requested by
                txt.toLowerCase().includes(strings.va_cmd81) ||
                txt.toLowerCase().includes(strings.va_cmd82) ||
                txt.toLowerCase().includes(strings.va_cmd83)
            ) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep05);
                });
                this.requestTxtField?.focus?.();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
                // setTimeout(() => {
                //   this._startRecognizing();
                // }, 2500);
            } else if (
                //NC Category
                txt.toLowerCase().includes(strings.va_cmd91) ||
                txt.toLowerCase().includes(strings.va_cmd92) ||
                txt.toLowerCase().includes('OFI CATEGORY') ||
                txt.toLowerCase().includes('ofi')
            ) {
                //NC Category
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep06);
                });
                this.categoryTxtField?.focus?.();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
                // setTimeout(() => {
                //   this._startRecognizing();
                // }, 3000);
            } else if (
                //ofi Category
                txt.toLowerCase().includes('OFI CATEGORY') ||
                txt.toLowerCase().includes('OFI') ||
                txt.toLowerCase().includes('WI-FI CATEGORY')
            ) {
                //OFI Category
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep06);
                });
                this.categoryTxtField?.focus?.();
                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
                // setTimeout(() => {
                //   this._startRecognizing();
                // }, 3000);
            } else if (
                txt.toLowerCase().includes('failure category') ||
                txt.toLowerCase().includes('failure') ||
                txt.toLowerCase().includes('fail')
            ) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;
                this.VoiceOFIcategory = false;

                if (this.state.FailureCategory.length > 0) {
                    Tts.setDucking(true).then(() => {
                        Tts.speak('Please selectd the Failure Category');
                    });
                    this.departmentTxtField?.focus?.();
                    this._stopRecognizing();
                    this.safeRemoveVoiceListeners();
                    this.InitVoice();
                    //   setTimeout(() => {
                    //     this._startRecognizing();
                    //   }, 2500);
                } else {
                    Tts.setDucking(true).then(() => {
                        Tts.speak('Currently there is no failure category available'); //strings.ap_reply_04);
                    });
                }
            } else if (txt.toLowerCase().includes(strings.va_cmd301)) {
                //OFI
                this.VoiceFill = false;
                this.VoicNCIdentifier = true;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                this.ncidentifierTxtField?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_Uni_rep08);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (txt.toLowerCase().includes(strings.va_cmd401)) {
                //Objective
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = true;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;
                this.objEviTxtField?.focus?.();
                //this.objEvidence?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_Uni_rep08);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (
                //Recomendation
                txt.toLowerCase().includes(strings.va_cmd501) ||
                txt.toLowerCase().includes(strings.va_cmd502) ||
                txt.toLowerCase().includes(strings.va_cmd506)
            ) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = true;
                this.VoiceOfi = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                this.recomTxtField?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_Uni_rep08);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (
                // OFI
                txt.toLowerCase().includes(strings.va_cmd601) ||
                txt.toLowerCase().includes(strings.va_cmd605)
            ) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = true;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceDocumentRef = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;

                this.ofiTxtField?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_Uni_rep08);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (txt.toLowerCase().includes('document') || txt.toLowerCase().includes('document reference')) {
                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.VoiceDocumentRef = true;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;
                this.docRefTxtField?.focus?.();
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_Uni_rep08);
                });
                setTimeout(() => {
                    this._startRecognizing();
                }, 1500);
            } else if (txt.toLowerCase().includes(strings.va_cmd701) || txt.toLowerCase().includes('attachment')) {
                //attach

                this.VoiceFill = false;
                this.VoicNCIdentifier = false;
                this.VoiceObjective = false;
                this.VoiceRecom = false;
                this.VoiceOfi = false;
                this.VoiceDocumentRef = false;
                this.AutoFillCatogory = false;
                this.AutoFillCDept = false;
                this.VoiceRequesFill = false;
                this.VoiceResp = false;
                this.VoiceOFIcategory = false;
                Tts.setDucking(true).then(() => {
                    Tts.speak('Click the attachment button to continue'); //Tts.speak(strings.va_rep09);
                });

                this._stopRecognizing();
                this.safeRemoveVoiceListeners();
                this.InitVoice();
                // setTimeout(() => {
                // console.log("open attachment");
                //this.evidenceField.focus()
                // }, 1000);
            } else if (txt.toLowerCase().includes(strings.va_cmd802)) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_rep10);
                });
                this.onSave();
            } else {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.v_Key_Invalid_Message);
                });
                this.safeRemoveVoiceListeners();
                this.InitVoice();
            }
        }
    }

    getDropValue() {
        var AuditID = this.state.AuditID;
        var Data = this.state.clauseRecords;
        if (Data) {
            console.log('Dropdata==>', Data);
            for (var i = 0; i < Data.length; i++) {
                if (AuditID === Data[i].AuditId) {
                    this.setState({ dropvalues: Data[i].DropDownProps }, () => {
                        // console.log('Drop down values getting from props',this.state.dropvalues)
                        this.getDropDownData(this.state.dropvalues);
                    });
                }
            }
        } else {
            this.getClauseList(this.state.clauseRecords);
        }
    }

    getClauseList = Records => {
        // console.log('getting records',Records)
        var RecordList = Records;
        var Clausedropdown = [];
        console.log('loDER==>');
        if (RecordList) {
            for (var i = 0; i < RecordList.length; i++) {
                if (RecordList[i].AuditId === this.state.AuditID) {
                    console.log('AuditID===>>', this.state.AuditID);
                    if (RecordList[i].DropDownProps.ClauseList) {
                        for (var j = 0; j < RecordList[i].DropDownProps.ClauseList.length; j++) {
                            Clausedropdown.push({
                                name:
                                    RecordList[i].DropDownProps.ClauseList[j].Element +
                                        ' ' +
                                        RecordList[i].DropDownProps.ClauseList[j].StandardDescription.length >
                                    40
                                        ? RecordList[i].DropDownProps.ClauseList[j].Element +
                                          ' ' +
                                          RecordList[i].DropDownProps.ClauseList[j].StandardDescription.substring(0, 40) +
                                          '...'
                                        : RecordList[i].DropDownProps.ClauseList[j].Element +
                                          ' ' +
                                          RecordList[i].DropDownProps.ClauseList[j].StandardDescription,
                                id: RecordList[i].DropDownProps.ClauseList[j].ElementId,
                                newid: parseFloat(RecordList[i].DropDownProps.ClauseList[j].Element),
                                Requirement: RecordList[i].DropDownProps.ClauseList[j].StandardRequirement,
                            });
                        }
                    }
                }
            }
        }

        Clausedropdown.sort(function (a, b) {
            const idA = a.newid;
            const idB = b.newid;
            let comparison = 0;
            if (idA > idB) {
                comparison = 1;
            } else if (idA < idB) {
                comparison = -1;
            }
            return comparison;
        });

        this.setState({ clausedata: Clausedropdown }, () => {
            console.log('Clause dropdown', this.state.clausedata);
            this.onSelectedItemsChange(this.state.selectedItems);
            // this.onSelectedItemsProcessChange(this.state.selectedItemsProcess)
            this.setProcessList();
        });
    };

    setProcessList = id => {
        const newProcessdata = this.props?.route?.params?.auditDetailsList;
        console.log(newProcessdata, 'newprocessdata');
        if (id == 0) {
            this.setState(
                {
                    selectedItemsProcess: [],
                },
                () => {
                    var processList = [];
                    console.log('processslistalldata', this.state.ProcessListAll);
                    console.log('processtype==>', this.state.ProcessType, this.state.ProcessListAll);
                    if (this.state.ProcessType !== 1 && this.state.ProcessListAll) {
                        if (this.state.ProcessListAll.lstProcessSelection) {
                            for (var i = 0; i < this.state.ProcessListAll.lstProcessSelection.length; i++) {
                                var pName =
                                    this.state.ProcessListAll.lstProcessSelection[i].ProcessName +
                                    ' - ' +
                                    this.state.ProcessListAll.lstProcessSelection[i].ProcessScope;
                                if (pName) {
                                    if (pName.length > 40) {
                                        pName = pName.substring(0, 40) + '...';
                                    }
                                }
                                processList.push({
                                    // id: this.state.ProcessListAll.lstProcessSelection[i]
                                    //   .KeyProcessId,
                                    id: newProcessdata[i].ProcessID,
                                    name: newProcessdata[i].ProcessName,
                                });
                                console.log(processList, 'processlistone');
                            }
                        }
                    } else {
                        if (this.state.ProcessListAll) {
                            if (this.state.ProcessListAll.lstProcessSelectionEmpty) {
                                for (var i = 0; i < this.state.ProcessListAll.lstProcessSelectionEmpty.length; i++) {
                                    processList.push({
                                        // id: this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                                        //   .KeyProcessId,
                                        // name:
                                        //   this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                                        //     .ProcessName +
                                        //   ' - ' +
                                        //   this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                                        //     .ProcessScope,
                                        id: newProcessdata[i].ProcessID,
                                        name: newProcessdata[i].ProcessName,
                                    });
                                    console.log(processList, 'processlistone');
                                }
                            }
                        }
                    }
                    console.log('Process type', this.state.ProcessType);
                    console.log('Process List:', processList);
                    console.log('this.state.selectedItemsProces123', this.state.selectedItemsProces);
                    this.setState(
                        {
                            processdata: processList,
                            PageLoader: false,
                        },
                        () => {
                            console.log('Prcessdta===>', this.state.processdata);
                            this.onSelectedItemsProcessChange(this.state.selectedItemsProcess);
                            // if (this.state.type == 'EDIT') {
                            //   // this.state.selectedItemsProcess
                            //   // this.setEditValues()
                            // }
                        },
                    );
                },
            );
        } else {
            var processList = [];
            console.log('ProcessType===>', this.state.ProcessType);
            console.log('ProcessTypeAll', this.state.ProcessListAll);
            if (this.state.ProcessType == 1 && this.state.ProcessListAll) {
                if (this.state.ProcessListAll.lstProcessSelection) {
                    for (var i = 0; i < this.state.ProcessListAll.lstProcessSelection.length; i++) {
                        var pName =
                            this.state.ProcessListAll.lstProcessSelection[i].ProcessName +
                            ' - ' +
                            this.state.ProcessListAll.lstProcessSelection[i].ProcessScope;
                        if (pName) {
                            if (pName.length > 40) {
                                pName = pName.substring(0, 40) + '...';
                            }
                        }
                        processList.push({
                            id: this.state.ProcessListAll.lstProcessSelection[i].KeyProcessId,
                            name: pName,
                        });
                    }
                }
            } else {
                if (this.state.ProcessListAll) {
                    if (this.state.ProcessListAll.lstProcessSelectionEmpty) {
                        for (var i = 0; i < this.state.ProcessListAll.lstProcessSelectionEmpty.length; i++) {
                            processList.push({
                                id: this.state.ProcessListAll.lstProcessSelectionEmpty[i].KeyProcessId,
                                name:
                                    this.state.ProcessListAll.lstProcessSelectionEmpty[i].ProcessName +
                                    ' - ' +
                                    this.state.ProcessListAll.lstProcessSelectionEmpty[i].ProcessScope,
                            });
                        }
                    }
                }
            }
            console.log('Process List:', processList);
            console.log('this.state.selectedItemsProces123', processList);
            this.setState({
                selectedItemsProcessDumm: processList,
            });
            this.setState(
                {
                    processdata: processList,
                    PageLoader: false,
                },
                () => {
                    this.onSelectedItemsProcessChange(this.state.selectedItemsProcess);
                    // if (this.state.type == 'EDIT') {
                    //   // this.state.selectedItemsProcess
                    //   // this.setEditValues()
                    // }
                },
            );
        }
    };

    setEditValues = () => {
        console.log('serteditval', this.state.ncData);
        var processListIntArr = [];
        for (var i = 0; i < this.state.ncData.selectedItemsProcess.length; i++) {
            processListIntArr.push(parseInt(this.state.ncData.selectedItemsProcess[i]));
        }
        this.setState(
            {
                selectedItems: this.state.ncData.selectedItems,
                selectedItemsProcess: processListIntArr,
                displayData: this.state.ncData.requiretext,
                NCcategoryt: this.state.ncData.categoryDrop,
                NCrequestby: this.state.ncData.requestDrop,
                NCdept: this.state.ncData.deptDrop,
                NCFailure: this.state.ncData.failureDrop,
                nonconfirmityText: this.state.ncData.NonConfirmity,
                // NCresponsible: this.state.ncData.userDrop,
                // NCresponsible: this.state.RequestArr[0],
                NCresponsible: this.state.requestDropdown[0].id,
                ofitext: this.state.ncData.ofitext,
                fileName: this.state.ncData.filename,
                fileData: this.state.ncData.filedata,
                ncIdentifier: this.state.ncData.ncIdentifier,
                objEvidence: this.state.ncData.objEvidence,
                documentRef: this.state.ncData.documentRef,
                recommAction: this.state.ncData.recommAction,
                // PageLoader:false
            },
            () => {
                console.log('setEditValues NCresponsible', this.state.ncData.userDrop);
                this.setProcessList();
            },
        );
    };

    onSelectedItemsProcessChange = selectedItems => {
        console.log('selectedItemsProcess selectedItems  ', selectedItems);
        const multiprocess = this.props?.route?.params?.NCOFIDetails?.multiprocess;
        let newArry = [];
        if (multiprocess == '1') {
            selectedItems.length > 0 && newArry.push(selectedItems[selectedItems.length - 1]);
            this.setState({ selectedItemsProcess: newArry, MarkProcess: false });
        } else {
            // const itemFilter = selectedItems.filter((data)=>data !== undefined)
            this.setState({ selectedItemsProcess: selectedItems, MarkProcess: false });
        }
        // console.log('selectedItemsProcess selectedItems --------- ', itemFilter);
    };

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        this.setState({
            MarkClausedrop: false,
        });

        //console.log('selectedItems',selectedItems)
        var data = this.state.clausedata;
        var TotalObject = [];
        var getRequireText = '';

        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (selectedItems) {
                    for (var j = 0; j < selectedItems.length; j++) {
                        if (selectedItems[j] === data[i].id) {
                            getRequireText = getRequireText + data[i].Requirement;
                            TotalObject.push(data[i]);
                        }
                    }
                }
            }
        }

        // console.log('TotalObject',TotalObject)

        this.setState(
            {
                displayData: getRequireText == '' || null || undefined ? '-' : getRequireText,
                modalDisplay: TotalObject,
            },
            () => {
                console.log('displayData--->', this.state.displayData);
            },
        );
    };

    getSessionValues = () => {
        try {
            const USERID = this.props.data.audits.userId;
            const TOKEN = this.props.data.audits.token;
            const SITEID = this.props.data.audits.siteId;
            if (TOKEN !== null) {
                this.setState(
                    {
                        token: TOKEN,
                        userId: USERID,
                        siteId: SITEID,
                        loading: true,
                    },
                    () => {
                        this.getDropDownData();
                    },
                );
            }
        } catch (error) {
            // Error retrieving data
            // console.log('Failed to retrive a login session!!!',error)
        }
    };

    getDropDownData(dropdata) {
        var Data = dropdata;
        console.log('Drop data', Data);
        var Category = [];
        var Department = [];
        var Request = [];
        var User = [];
        var categoryArr = [];
        var departArr = [];
        var UserArr = [];
        var RequestArr = [];
        var NCresponsible = undefined;
        var FailureCategory = [];

        console.log('requestDrop NCresponsible', this.state.NCresponsible);
        console.log('DropData///', this.state.RouteParam, Data.Category);
        if (Data.Category) {
            for (var i = 0; i < Data.Category.length; i++) {
                if (this.state.RouteParam == 'NC') {
                    if (Data.Category[i].Ofi == 0) {
                        Category.push(Data.Category[i]);
                    }
                }
                if (this.state.RouteParam == 'OFI') {
                    if (Data.Category[i].Ofi == 1) {
                        Category.push(Data.Category[i]);
                    }
                }
            }
        }

        if (Data.Department) {
            for (var i = 0; i < Data.Department.length; i++) {
                Department.push(Data.Department[i]);
            }
        }
        if (Data.FailureCategory) {
            for (var i = 0; i < Data.FailureCategory.length; i++) {
                const fc = Data.FailureCategory[i];
                FailureCategory.push({
                    ...fc,
                    label: fc.FailureCategoryName,
                    value: fc.FailureCategoryId,
                    id: fc.FailureCategoryId,
                });
            }
        }

        if (Data.RequestBy) {
            for (var i = 0; i < Data.RequestBy.length; i++) {
                Request.push(Data.RequestBy[i]);
            }
        }

        if (Data.Users) {
            for (var i = 0; i < Data.Users.length; i++) {
                console.log('User arr', User);
                User.push(Data.Users[i]);
                if (Data.Users[i].userid == this.props.data.audits.userId) {
                    NCresponsible = {
                        label: Data.Users[i].Name,
                        value: Data.Users[i].Name,
                        id: Data.Users[i].userid,
                    };
                }
            }
        }
        // console.log('Category arr',Category)
        // console.log('Department arr',Department)
        // console.log('Request arr',Request)
        // console.log('User arr',User)

        for (var i = 0; i < Category.length; i++) {
            categoryArr.push({
                label: Category[i].CategoryName,
                value: Category[i].CategoryName,
                id: Category[i].CategoryId,
            });
        }
        for (var i = 0; i < Department.length; i++) {
            departArr.push({
                label: Department[i].DepartmentName,
                value: Department[i].DepartmentName,
                id: Department[i].DepartmentId,
            });
        }
        for (var i = 0; i < User.length; i++) {
            UserArr.push({ label: User[i].Name, value: User[i].Name, id: User[i].userid });
        }
        for (var i = 0; i < Request.length; i++) {
            RequestArr.push({
                label: Request[i].AuditeeContactPersonName,
                value: Request[i].AuditeeContactPersonName,
                id: Request[i].AuditeeContactPersonId,
            });
        }

        this.setState(
            {
                categoryArr: categoryArr,
                departArr: departArr,
                UserArr: UserArr,
                RequestArr: RequestArr,
                FailureCategory: FailureCategory,
                // NCresponsible: (this.state.NCresponsible) ? this.state.NCresponsible : NCresponsible
                // PageLoader: false
            },
            () => {
                console.log('this.state.categoryArr', this.state.categoryArr);
                console.log('this.state.departArr', this.state.departArr);
                console.log('this.state.UserArr', this.state.UserArr);
                console.log('this.state.RequestArr', this.state.RequestArr);
                console.log('this.staet.FailureCat', this.state.FailureCategory);
                if (this.state.categoryArr.length === 0) {
                    this.setState({ isContainValue1: false }, function () {
                        this.isCheckCategory = true;
                    });
                } else if (this.state.departArr.length === 0) {
                    this.setState({ isContainValue2: false }, function () {
                        this.isCheckDepart = true;
                        // console.log('No departArr value found',this.state.isContainValue2)
                    });
                } else if (this.state.UserArr.length === 0) {
                    this.setState({ isContainValue3: false }, function () {
                        this.isCheckUser = true;
                        // console.log('No UserArr value found',this.state.isContainValue3)
                    });
                } else if (this.state.RequestArr.length === 0) {
                    this.setState({ isContainValue4: false }, function () {
                        // this.isCheck7 = true
                        this.isCheckRequest = true;
                        // console.log('No RequestArr value found',this.state.isContainValue4)
                    });
                } else if (this.state.FailureCategory.length === 0) {
                    this.setState({ isContainValue0: false }, function () {
                        // this.isCheck7 = true
                        this.isCheckFailure = true;
                        // console.log('No RequestArr value found',this.state.isContainValue4)
                    });
                }
                this.getClauseList(this.state.clauseRecords);
            },
        );
    }

    resetForm = () => {
        this.setState(
            {
                dialogVisible: false,
                selectedItems: [],
                selectedItemsProcess: [],
                selectedItemsProcessDumm: [],
                displayData: undefined,
                NCcategoryt: undefined,
                NCuser: undefined,
                NCrequestby: undefined,
                NCdept: undefined,
                NCFailure: undefined,
                NCclause: undefined,
                NCProcess: undefined,
                requirementText: undefined,
                nonconfirmityText: '',
                NCresponsible: undefined,
                ofitext: undefined,
                fileName: undefined,
                fileData: undefined,
                fileSize: undefined,
                fileType: '',
                fileContent: null,
                documentRef: '',
                ncIdentifier: '',
                objEvidence: '',
                Objective_Evidence: undefined,
                recommAction: '',
                fileArrayList: [],
                PrevNonConformity: '',
                missingfile: undefined,
                isUploaded: false,
                MarkCat: false,
                MarkUser: false,
                MarkReq: false,
                MarkDept: false,
                MarkFailure: false,
                MarkClause: false,
                MarkProcess: false,
                MarkClausedrop: false,
                underline1: false,
                underline2: false,
            },
            () => {
                // clear any pending camera captures tied to the form
                this.props.storeCameraCapture([]);
                successMessage({ message: '', description: strings.FormVal });
            },
        );
    };

    onBuffer(dupNCrecords) {
        console.log('once called', this.state.isBuffered, dupNCrecords);
        if (this.state.isBuffered == false) {
            this.setState(
                {
                    isSaved: true,
                    MarkCat: false,
                    MarkFailure: false,
                    MarkUser: false,
                    MarkReq: false,
                    MarkClause: false,
                    MarkDept: false,
                    PageLoader: false,
                    isSavebtn: false,
                    isBuffered: true,
                },
                () => {
                    // console.log('Loader off')
                    console.log(this.state.selectedItemsProcess.length, 'hellothreefour2');
                    this.updateAuditStatus(this.state.AuditID);
                    successMessage({ message: '', description: strings.Save_Message });
                    setTimeout(() => {
                        // console.log('AuditDashBody Props After Props Changing...', this.props)
                        this.props.storeNCRecords(dupNCrecords);
                        var cameraCapture = [];
                        this.props.storeCameraCapture(cameraCapture);
                        this.props.navigation.goBack();
                    }, 300);
                },
            );
            // }
        } else {
            console.warn('Skiping duplicate');
        }
    }

    onSave() {
        console.log('on click save');
        console.log('faliurecategory', this.state.FailureCategory);
        console.log(this.state.clausedata, 'marcclause');
        console.log('displayData--->', this.state.displayData);
        console.log(this.state.selectedItemsProcess.length, 'selecteditemprocess', this.state.selectedItemsProcess);

        // if(this.props.data.smdata !==2 && this.props.data.smdata !==3 ){
        //   this.setState({
        //     documentRef:true
        //   })
        // }
        if (this.state.selectedItemsProcess.length === 0 && this.state.RouteParam == 'NC') {
            this.setState({
                MarkProcess: true,
            });
        }
        if (this.state.clauseMandatory === 1 && this.state.selectedItems.length === 0 && this.state.RouteParam == 'NC') {
            this.setState({
                MarkClause: true,
            });
        }
        if (this.props.data.audits.smdata === 2 || this.props.data.audits.smdata === 3) {
            this.setState({
                documentRef: true,
                objEvidence: true,
                selectedItemsProcess: Array.isArray(this.state.selectedItemsProcess) ? this.state.selectedItemsProcess : [],
            });
        }

        if (this.props.data.audits.smdata === 3) {
            this.setState({ displayData: true });
        }

        console.log(this.state.MarkClausedrop, 'marsk');
        this.setState({ PageLoader: true, isSavebtn: true, isSaved: false }, () => {
            // InteractionManager.runAfterInteractions(() => {
            var NCrecords = this.props.data.audits.ncofiRecords;
            var dupNCrecords = [];
            console.log('NCrecords****', NCrecords);
            var BundleArr = null;
            console.log(this.state.MarkClause, 'marcclause');
            if (this.state.RouteParam === 'NC') {
                if (this.state.isContainValue1 === false) {
                    this.isCheckCategory = true;
                }
                if (this.state.isContainValue0 === false) {
                    this.isCheckFailure = true;
                }
                if (this.state.isContainValue2 === false) {
                    this.isCheckDepart = true;
                }
                if (this.state.isContainValue3 === false) {
                    this.isCheckUser = true;
                }
                if (this.state.isContainValue4 === false) {
                    this.isCheckRequest = true;
                }

                console.log('this.state.isLPA', this.state.isLPA, this.state.selectedItems);
                console.log('this.state.selectedItems.length', this.state.selectedItems.length);
                console.log('auditstatus', this.state.auditstatus);
                console.log('AuditOrder', this.state.AuditOrder);
                console.log('isUploaded', this.state.isUploaded);

                let bcontinue = true;
                let pcontinue = true;
                if (this.state.selectedItems.length == 0 && this.state.clauseMandatory === 1 && this.state.RouteParam == 'NC') {
                    bcontinue = false;
                }

                if (this.state.selectedItemsProcess.length == 0) {
                    pcontinue = false;
                }
                if (
                    this.state.NCcategoryt &&
                    // this.state.NCresponsible &&
                    this.state.NCrequestby &&
                    bcontinue &&
                    this.state.nonconfirmityText &&
                    this.state.objEvidence &&
                    this.state.documentRef &&
                    pcontinue &&
                    this.state.displayData
                ) {
                    if (this.state.selectedItems.length > 0 || this.state.selectedItems.length == 0 || this.state.isLPA == true) {
                        console.log('passes...', this.state.fileArrayList);
                        const fileNames = this.state.fileArrayList.map(file => file.fileName);
                        console.log('########fileNames', fileNames);
                        const fileDatas = this.state.fileArrayList;
                        console.log('checkkkkkkkkkkkkkkkk----------ncccccc------------', this.state.fileArrayList);

                        console.log('########fileNames', fileDatas);

                        BundleArr = {
                            requiretext: this.state.displayData === '' ? undefined : this.state.displayData,
                            NonConfirmity: this.state.nonconfirmityText === undefined ? undefined : this.state.nonconfirmityText,
                            categoryDrop: this.state.NCcategoryt,
                            userDrop: this.state.NCrequestby,
                            //  requestDrop: this.state.RequestArr,
                            // requestDrop: this.state.NCresponsible,
                            requestDrop: this.state.requestDropdown[0].id,
                            deptDrop: this.state.NCdept === undefined ? 0 : this.state.NCdept,
                            failureDrop: this.state.NCFailure === undefined ? 0 : this.state.NCFailure,
                            filename: fileNames?.length == 0 ? [] : fileNames,
                            filedata: fileDatas?.length == 0 ? [] : fileDatas,
                            AuditID: this.state.AuditID,
                            AuditOrder: this.state.AuditOrder,
                            ChecklistID: this.state.ChecklistID,
                            Formid: this.state.Formid,
                            SiteID: this.state.SiteID,
                            auditstatus: this.state.auditstatus,
                            title: this.state.title,
                            NCNumber: this.state.auditnumber,
                            Category: 'NC',
                            OFI: this.state.ofitext,
                            uniqueNCkey: Moment().unix(),
                            selectedItems: this.state.selectedItems,
                            selectedItemsProcess: this.state.selectedItemsProcess,
                            ChecklistTemplateId: this.state.templateId,
                            ncIdentifier: this.state.ncIdentifier === undefined ? '' : this.state.ncIdentifier,
                            objEvidence: this.state.objEvidence === undefined ? '' : this.state.objEvidence,
                            documentRef: this.state.documentRef === undefined ? '' : this.state.documentRef,
                            recommAction: this.state.recommAction === undefined ? '' : this.state.recommAction,
                            ProcessID: this.props?.route?.params?.NCOFIDetails?.ProcessID,
                            Conformance: this.props?.route?.params?.NCOFIDetails?.Conformance,
                        };
                        console.log('Information bundled', BundleArr);

                        for (var i = 0; i < NCrecords.length; i++) {
                            if (NCrecords[i].AuditID === this.state.AuditID) {
                                var Information = [];
                                if (NCrecords[i].Pending) {
                                    console.log('NCrecords[i].Pending', NCrecords[i].Pending);
                                    for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                                        if (this.state.type == 'EDIT' && this.state.ncData.uniqueNCkey == NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey) {
                                            console.log(
                                                'ncuniqkeycheck#####',
                                                this.state.ncData.uniqueNCkey,
                                                NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                                            );

                                            NCrecords?.[i]?.Pending?.[j], 'helloonetwo', Information.push(BundleArr);
                                        } else {
                                            console.log(NCrecords?.[i]?.Pending?.[j].filename, 'helloonetwo222222');
                                            console.log(NCrecords?.[i]?.Pending?.[j], 'helloonetwo11111112');

                                            Information.push({
                                                AuditID: NCrecords?.[i]?.Pending?.[j]?.AuditID,
                                                // AuditID:NCrecords?.[i]?.Pending?.[j]?.AuditID,
                                                AuditOrder: NCrecords?.[i]?.Pending?.[j]?.AuditOrder,
                                                ChecklistID: NCrecords?.[i]?.Pending?.[j]?.ChecklistID,
                                                Formid: NCrecords?.[i]?.Pending?.[j]?.Formid,
                                                SiteID: NCrecords?.[i]?.Pending?.[j]?.SiteID,
                                                title: NCrecords?.[i]?.Pending?.[j]?.title,
                                                requiretext: NCrecords?.[i]?.Pending?.[j]?.requiretext,
                                                OFI: NCrecords?.[i]?.Pending?.[j]?.OFI,
                                                categoryDrop: NCrecords?.[i]?.Pending?.[j]?.categoryDrop,
                                                userDrop: NCrecords?.[i]?.Pending?.[j]?.userDrop,
                                                requestDrop: NCrecords?.[i]?.Pending?.[j]?.requestDrop,
                                                deptDrop: NCrecords?.[i]?.Pending?.[j]?.deptDrop,
                                                failureDrop: NCrecords?.[i]?.Pending?.[j]?.failureDrop,
                                                NCNumber: NCrecords?.[i]?.Pending?.[j]?.NCNumber,
                                                Category: NCrecords?.[i]?.Pending?.[j]?.Category,
                                                // filename: NCrecords?.[i]?.Pending?.[j]?.filename,
                                                // filedata: NCrecords?.[i]?.Pending?.[j]?.filedata,
                                                filename: NCrecords?.[i]?.Pending?.[j].filename,
                                                filedata: NCrecords?.[i]?.Pending?.[j].filedata,
                                                auditstatus: NCrecords?.[i]?.Pending?.[j]?.auditstatus,
                                                NonConfirmity: NCrecords?.[i]?.Pending?.[j]?.NonConfirmity,
                                                uniqueNCkey: NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                                                selectedItems: NCrecords?.[i]?.Pending?.[j]?.selectedItems,
                                                selectedItemsProcess: NCrecords?.[i]?.Pending?.[j]?.selectedItemsProcess,
                                                ChecklistTemplateId: NCrecords?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                                                ncIdentifier: NCrecords?.[i]?.Pending?.[j]?.ncIdentifier,
                                                objEvidence: NCrecords?.[i]?.Pending?.[j]?.objEvidence,
                                                documentRef: NCrecords?.[i]?.Pending?.[j]?.documentRef,
                                                recommAction: NCrecords?.[i]?.Pending?.[j]?.recommAction,
                                            });
                                        }
                                    }
                                }

                                if (this.state.type == 'ADD' || this.state.isUploaded == true) {
                                    console.log('CHEKINGDETAILS------', BundleArr);
                                    console.log('CHEKINGDETAILS------2222222', Information);

                                    Information.push(BundleArr);
                                    console.log('CHEKINGDETAILS------', Information);
                                }

                                dupNCrecords.push({
                                    AuditID: NCrecords[i].AuditID,
                                    Uploaded: NCrecords[i].Uploaded,
                                    Pending: Information,
                                });
                            } else {
                                console.log('CHEKINGDETAILS--PENDING----', NCrecords[i].Pending);

                                dupNCrecords.push({
                                    AuditID: NCrecords[i]?.AuditID,
                                    Uploaded: NCrecords[i]?.Uploaded,
                                    Pending: NCrecords[i]?.Pending,
                                });
                            }
                        }
                        console.log(this.state.selectedItemsProcess.length, 'onetwothree');
                        if (this.state.selectedItemsProcess.length !== 0) {
                            this.onBuffer(dupNCrecords);
                        } else {
                            this.setState({
                                underline2: false,
                                isSaved: false,
                                PageLoader: false,
                                isSavebtn: false,
                            });
                            // toast(strings.mandate_message, '', TOAST_STATUS.ERROR, 5000, 'top');
                            showErrorMessage('Please fill the mandatory fields.');
                        }
                    } else {
                        this.setState({ isSaved: false }, () => {
                            // , MarkClause: true
                            // ---> this.refs.toast.show(strings.Clauses,DURATION.LENGTH_LONG)
                        });
                    }
                } else {
                    // console.log('-->',this.state.NCcategoryt,this.state.NCresponsible,this.state.NCrequestby)

                    this.setState({ isSaved: false, PageLoader: false }, () => {
                        if (this.state.NCrequestby === undefined) {
                            this.setState(
                                {
                                    MarkReq: true,
                                },
                                () => {
                                    // console.log('this.state.MarkReq',this.state.MarkReq)
                                    // --->     this.refs.toast.show(strings.Responsibility,DURATION.LENGTH_LONG)
                                },
                            );
                        } else {
                            this.setState(
                                {
                                    MarkReq: false,
                                },
                                () => {
                                    // console.log('this.state.MarkReq',this.state.MarkReq)
                                },
                            );
                        }
                        if (this.state.NCresponsible === undefined) {
                            this.setState(
                                {
                                    // MarkUser: true,
                                },
                                () => {
                                    // console.log('this.state.MarkUser',this.state.MarkUser)
                                    // --->   this.refs.toast.show(strings.Requested,DURATION.LENGTH_LONG)
                                },
                            );
                        } else {
                            this.setState(
                                {
                                    MarkUser: false,
                                },
                                () => {
                                    // console.log('this.state.MarkUser',this.state.MarkUser)
                                },
                            );
                        }
                        if (this.state.NCcategoryt === undefined) {
                            this.setState({
                                MarkCat: true,
                            });
                        } else {
                            this.setState({
                                MarkCat: false,
                            });
                        }
                        if (this.state.selectedItems.length === 0 && this.state.clauseMandatory === 1 && this.state.RouteParam == 'NC') {
                            this.setState({
                                MarkClause: true,
                            });
                        } else {
                            this.setState({
                                MarkClause: false,
                            });
                        }
                        if (this.state.NCFailure === undefined) {
                            this.setState({
                                MarkFailure: true,
                            });
                        } else {
                            this.setState({
                                MarkFailure: false,
                            });
                        }
                        if (this.state.nonconfirmityText === undefined) {
                            this.setState({ underline1: true }, () => {
                                // --->       this.refs.toast.show(strings.NCfill,DURATION.LENGTH_LONG)
                            });
                        } else {
                            this.setState(
                                {
                                    underline1: false,
                                },
                                () => {
                                    // console.log('this.state.underline1',this.state.underline1)
                                },
                            );
                        }
                        if (this.state.documentRef === undefined && this.props.data.audits.smdata != 2 && this.props.data.audits.smdata != 3) {
                            this.setState({ underline1: true }, () => {
                                // --->       this.refs.toast.show(strings.NCfill,DURATION.LENGTH_LONG)
                            });
                        } else {
                            this.setState(
                                {
                                    underline1: false,
                                },
                                () => {
                                    // console.log('this.state.underline1',this.state.underline1)
                                },
                            );
                        }
                        console.log(this.state.selectedItemsProcess.length, 'hellothreefour');
                        if ((this.state.selectedItems.length == 0 && !this.state.isLPA) || this.state.selectedItemsProcess.length == 0) {
                            /** disabling standard requirement field */
                            // this.setState({ underline2: true }, () => {
                            //this.refs.toast.show(strings.Clauses,3000)
                            // this.refs.toast.show("Please select all mandatory fields.", 4000);
                            // toast(strings.mandate_message, '', TOAST_STATUS.ERROR, 5000, 'top');
                            showErrorMessage('Please fill the mandatory fields.');

                            // })
                        } else {
                            this.setState(
                                {
                                    underline2: false,
                                },
                                () => {
                                    // console.log('this.state.underline2',this.state.underline2)
                                },
                            );
                        }
                    });
                }
            }

            if (this.state.RouteParam === 'OFI') {
                console.log('ofi--->');
                if (this.state.isContainValue1 === false) {
                    this.isCheckCategory = true;
                }
                if (this.state.isContainValue0 === false) {
                    this.isCheckFailure = true;
                }
                if (this.state.isContainValue2 === false) {
                    this.isCheckDepart = true;
                }
                if (this.state.isContainValue3 === false) {
                    this.isCheckUser = true;
                }
                if (this.state.isContainValue4 === false) {
                    this.isCheckRequest = true;
                }
                // console.log('this.state.fileData',this.state.fileData)
                // console.log('this.state.fileName',this.state.fileName)

                if (
                    /* this.state.NCdept &&  */ this.state.NCcategoryt &&
                    // this.state.NCresponsible &&
                    this.state.NCrequestby &&
                    this.state.selectedItems &&
                    this.state.ofitext &&
                    this.state.objEvidence
                ) {
                    console.log('this.state.NCcategoryt', this.state.NCcategoryt);
                    console.log('this.state.NCrequestby', this.state.NCrequestby);
                    console.log('this.state.NCresponsible ', this.state.NCresponsible);
                    console.log('this.state.selectedItems', this.state.selectedItems);
                    console.log('this.state.ofitext', this.state.ofitext);
                    console.log('this.state.AuditOrder', this.state.AuditOrder);
                    // if (this.state.selectedItems.length > 0) {
                    console.log('FileArrayPasses---------', this.state.fileArrayList);
                    const fileNames = this.state.fileArrayList.map(file => file.fileName);
                    console.log('########fileNames', fileNames);
                    console.log('checkkkkkkkkkkkkkkkk----------ncofi------------', this.state.fileArrayList);
                    const fileDatas = this.state.fileArrayList; //.map(file => file.fileData);
                    console.log('########fileNames', fileDatas);

                    BundleArr = {
                        requiretext: this.state.displayData === '' ? undefined : this.state.displayData,
                        OFI: this.state.ofitext === undefined ? '' : this.state.ofitext,
                        categoryDrop: this.state.NCcategoryt,
                        userDrop: this.state.NCrequestby,
                        // requestDrop: this.state.NCresponsible,
                        requestDrop: this.state.requestDropdown[0].id,
                        deptDrop: this.state.NCdept === undefined ? 0 : this.state.NCdept,
                        failureDrop: this.state.NCFailure === undefined ? 0 : this.state.NCFailure,

                        // filename:
                        //   this.state.fileName === undefined ? '' : this.state.fileName,
                        // filedata:
                        //   this.state.fileData === undefined ? '' : this.state.fileData,
                        filename: fileNames?.length == 0 ? [] : fileNames,
                        filedata: fileDatas?.length == 0 ? [] : fileDatas,
                        AuditID: this.state.AuditID,
                        AuditOrder: this.state.AuditOrder,
                        ChecklistID: this.state.ChecklistID,
                        Formid: this.state.Formid,
                        SiteID: this.state.SiteID,
                        auditstatus: this.state.auditstatus,
                        title: this.state.title,
                        NCNumber: this.state.auditnumber,
                        Category: 'OFI',
                        // OFI: this.state.ofitext,
                        NonConfirmity: this.state.nonconfirmityText === '' ? undefined : this.state.nonconfirmityText,
                        documentRef: this.state.documentRef === '' ? undefined : this.state.documentRef,

                        uniqueNCkey: Moment().unix(),
                        selectedItems: this.state.selectedItems,
                        selectedItemsProcess: this.state.selectedItemsProcess,
                        ChecklistTemplateId: this.state.templateId,
                        ncIdentifier: this.state.ncIdentifier === undefined ? '' : this.state.ncIdentifier,
                        objEvidence: this.state.objEvidence === undefined ? '' : this.state.objEvidence,
                        recommAction: this.state.recommAction === undefined ? '' : this.state.recommAction,
                    };
                    console.log('Information bundled one', BundleArr);

                    for (var i = 0; i < NCrecords.length; i++) {
                        if (NCrecords[i].AuditID === this.state.AuditID) {
                            var Information = [];
                            if (NCrecords[i].Pending) {
                                for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                                    if (this.state.type == 'EDIT' && this.state.ncData.uniqueNCkey == NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey) {
                                        Information.push(BundleArr);
                                    } else {
                                        Information.push({
                                            AuditID: NCrecords?.[i]?.Pending?.[j]?.AuditID,
                                            AuditOrder: NCrecords?.[i]?.Pending?.[j]?.AuditOrder,
                                            ChecklistID: NCrecords?.[i]?.Pending?.[j]?.ChecklistID,
                                            Formid: NCrecords?.[i]?.Pending?.[j]?.Formid,
                                            SiteID: NCrecords?.[i]?.Pending?.[j]?.SiteID,
                                            title: NCrecords?.[i]?.Pending?.[j]?.title,
                                            requiretext: NCrecords?.[i]?.Pending?.[j]?.requiretext,
                                            OFI: NCrecords?.[i]?.Pending?.[j]?.OFI,
                                            categoryDrop: NCrecords?.[i]?.Pending?.[j]?.categoryDrop,
                                            userDrop: NCrecords?.[i]?.Pending?.[j]?.userDrop,
                                            requestDrop: NCrecords?.[i]?.Pending?.[j]?.requestDrop,
                                            deptDrop: NCrecords?.[i]?.Pending?.[j]?.deptDrop,
                                            failureDrop: NCrecords?.[i]?.Pending?.[j]?.failureDrop,
                                            NCNumber: NCrecords?.[i]?.Pending?.[j]?.NCNumber,
                                            Category: NCrecords?.[i]?.Pending?.[j]?.Category,
                                            // filename: NCrecords?.[i]?.Pending?.[j]?.filename,
                                            // filedata: NCrecords?.[i]?.Pending?.[j]?.filedata,
                                            filename: NCrecords?.[i]?.Pending?.[j].filename,
                                            filedata: NCrecords?.[i]?.Pending?.[j].filedata,
                                            auditstatus: NCrecords?.[i]?.Pending?.[j]?.auditstatus,
                                            NonConfirmity: NCrecords?.[i]?.Pending?.[j]?.NonConfirmity,
                                            documentRef: NCrecords?.[i]?.Pending?.[j]?.documentRef,
                                            uniqueNCkey: NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                                            selectedItems: NCrecords?.[i]?.Pending?.[j]?.selectedItems,
                                            selectedItemsProcess: NCrecords?.[i]?.Pending?.[j]?.selectedItemsProcess,
                                            ChecklistTemplateId: NCrecords?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                                            ncIdentifier: NCrecords?.[i]?.Pending?.[j]?.ncIdentifier,
                                            objEvidence: NCrecords?.[i]?.Pending?.[j]?.objEvidence,
                                            recommAction: NCrecords?.[i]?.Pending?.[j]?.recommAction,
                                        });
                                    }
                                }
                            }

                            if (this.state.type == 'ADD' || this.state.isUploaded == true) {
                                console.log('helloconsle', BundleArr);
                                Information.push(BundleArr);
                            }

                            dupNCrecords.push({
                                AuditID: NCrecords[i]?.AuditID,
                                Uploaded: NCrecords[i]?.Uploaded,
                                Pending: Information,
                            });
                        } else {
                            dupNCrecords.push({
                                AuditID: NCrecords[i]?.AuditID,
                                Uploaded: NCrecords[i]?.Uploaded,
                                Pending: NCrecords[i]?.Pending,
                            });
                        }
                    }

                    console.log('dupNCrecords', dupNCrecords);

                    // Store audit list in redux store to set it in persistant storage

                    this.setState(
                        {
                            isSaved: true,
                            MarkCat: false,
                            MarkUser: false,
                            MarkReq: false,
                            MarkClause: false,
                            MarkDept: false,
                            MarkFailure: false,
                            PageLoader: false,
                            isSavebtn: false,
                            isBuffered: true,
                        },
                        () => {
                            console.log('Loader off');
                            console.log(this.state.selectedItemsProcess.length, 'hellothreefour1');
                            this.updateAuditStatus(this.state.AuditID);
                            successMessage({ message: '', description: strings.Save_Message });
                            setTimeout(() => {
                                // console.log('AuditDashBody Props After Props Changing...', this.props)
                                this.props.storeNCRecords(dupNCrecords);
                                var cameraCapture = [];
                                this.props.storeCameraCapture(cameraCapture);
                                this.props.navigation.goBack();
                            }, 300);
                        },
                    );
                } else {
                    // console.log('-->',this.state.NCcategoryt,this.state.NCresponsible,this.state.NCrequestby)

                    this.setState({ isSaved: false, PageLoader: false, isSavebtn: false }, () => {
                        alert('Please Fill Mandatory Fields');

                        if (this.state.NCrequestby === undefined) {
                            this.setState(
                                {
                                    MarkReq: true,
                                },
                                () => {
                                    // console.log('this.state.MarkReq',this.state.MarkReq)
                                    // this.refs.toast.show(strings.Responsibility,DURATION.LENGTH_LONG)
                                },
                            );
                        } else {
                            this.setState(
                                {
                                    MarkReq: false,
                                },
                                () => {
                                    // console.log('this.state.MarkReq',this.state.MarkReq)
                                },
                            );
                        }
                        if (this.state.NCresponsible === undefined) {
                            this.setState(
                                {
                                    // MarkUser: true,
                                },
                                () => {
                                    // console.log('this.state.MarkUser',this.state.MarkUser)
                                    // ---> this.refs.toast.show(strings.Requested,DURATION.LENGTH_LONG)
                                },
                            );
                        } else {
                            this.setState(
                                {
                                    MarkUser: false,
                                },
                                () => {
                                    // console.log('this.state.MarkUser',this.state.MarkUser)
                                },
                            );
                        }
                        if (this.state.NCcategoryt === undefined) {
                            this.setState({
                                MarkCat: true,
                            });
                        } else {
                            this.setState(
                                {
                                    MarkCat: false,
                                },
                                () => {
                                    // console.log('this.state.MarkCat',this.state.MarkCat)
                                },
                            );
                        }
                        if (this.state.NCclause === undefined) {
                            this.setState({
                                // MarkClause: true,
                            });
                        } else {
                            this.setState({
                                MarkClause: false,
                            });
                        }
                        if (this.state.NCFailure === undefined) {
                            this.setState({
                                MarkFailure: true,
                            });
                        } else {
                            this.setState({
                                MarkFailure: false,
                            });
                        }
                        if (this.state.ofitext === undefined) {
                            console.log('ofiundefined');
                            this.setState({ underline1: true }, () => {
                                // --->  this.refs.toast.show(strings.OFIfill,DURATION.LENGTH_LONG)
                            });
                        } else {
                            this.setState(
                                {
                                    underline1: false,
                                },
                                () => {
                                    // console.log('this.state.underline1',this.state.underline1)
                                },
                            );
                        }
                        if (this.state.displayData === undefined) {
                            // this.setState({ underline2 : true },() =>{
                            //   this.refs.toast.show(strings.Clauses,DURATION.LENGTH_LONG)
                            // })
                        } else {
                            this.setState(
                                {
                                    underline2: false,
                                },
                                () => {
                                    // console.log('this.state.underline2',this.state.underline2)
                                },
                            );
                        }
                    });
                }
            }
            // })
        });
    }

    goBack() {
        this.safeRemoveVoiceListeners();
        this.InitVoice();
        this.props.navigation.goBack();
    }

    attachFiles() {
        this.setState({ AttachModal: false }, () => {
            setTimeout(() => {
                console.log('attach pressed');
                this.openFileSystem();
            }, 500);
        });
    }
    attachFilesonly() {
        this.setState({ AttachModal: false }, () => {
            setTimeout(() => {
                console.log('attach pressed');
                this.openFileSystemFiles();
            }, 500);
        });
    }

    checkFileAlreadyExist = (AttachmentList, response) => {
        for (var i = 0; i < AttachmentList.length; i++) {
            console.log('one:third');
            console.log('one:thirdentering', AttachmentList);
            let filename = response.name.replace(/ /g, '_');
            var fileExist = AttachmentList.filter(item => item.fileName === filename);
            if (fileExist.length > 0) return true;
        }
        return false;
    };
    handleImagePick = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('File picked:', res.uri);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
            } else {
                console.log('DocumentPicker Error:', err);
            }
        }
    };
    handleFilePick = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.xls],
            });
            console.log('File picked:', res.uri);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
            } else {
                console.log('DocumentPicker Error:', err);
            }
        }
    };

    renderItem = ({ item }) => {
        return (
            <View style={styles.attachmentListItem}>
                {this.state.missingfile ? (
                    <Text numberOfLines={1} style={styles.missingFileText}>
                        {this.state.missingfile}
                    </Text>
                ) : (
                    <View style={styles.columnFlex}>
                        <View>
                            {item?.fileData !== '' && item?.fileData !== undefined && item?.fileData !== null ? (
                                <TouchableOpacity onPress={this.openAttachmentFile.bind(this, item?.fileData)}>
                                    {this.getFileIcon(item?.fileName, item?.fileData)}
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        <Text numberOfLines={1} style={styles.filenameText}>
                            {item?.fileName}
                        </Text>
                    </View>
                )}
                {item?.fileName ? (
                    <TouchableOpacity onPress={() => this.deleteAttachments(item.id)} style={styles.attachmentDeleteBtn}>
                        <Icon name="trash" size={20} color={'red'} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    getFileIcon2 = filename => {
        console.log('getfileicon2====', filename);
        const format = getFileFormat(filename);
        const iconName = formatToIconMapping[format] || 'file-o';
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', iconName);
        return iconName;
    };

    renderEdiitItem = ({ item }) => {
        console.log('FILETYPE:----------123', item?.fileName);
        console.log('FILETYPE:----------123', item);

        const filepath = 'file:/' + item?.fileData;

        const format = item.filetype;

        return (
            <View>
                <TouchableOpacity onPress={this.openAttachmentFile.bind(this, filepath)}>
                    {this.getFileIcon(item?.fileName, item?.fileData)}
                </TouchableOpacity>
            </View>
        );
    };

    openFileSystem = async () => {
        let newFilePath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
            });
            console.log(response, 'filedataresponse');
            var filename = response.name.trim();
            var newfileName = 'file_' + Moment().unix() + '.' + filename.substring(filename.lastIndexOf('.') + 1);
            newFilePath = newFilePath + '/' + newfileName; // + response.name.replace(/ /g,'_')

            if (response) {
                if (this.checkFileAlreadyExist(this.state.fileArrayList, response) === true) {
                    alert('File already Exist, Kindly add a different file');
                    return;
                }

                var fileuri = Platform.OS == 'ios' ? decodeURIComponent(response.uri.slice(6)) : response.uri;
                console.log('fileuri', fileuri);

                //const fileuri = decodeURIComponent(fileuri);
                console.log(fileuri, 'decoded path');
                filename = filename.replace(/ /g, '_');

                if (response.size > 5000000) {
                    alert(strings.alert);
                } else if (response.size < 1910485760456) {
                    console.log('helloenter', response.size);
                    //console.log('helll no', response.size);

                    var data = await RNFS.readFile(fileuri, 'base64')
                        .then(res => {
                            console.log('1:first');
                            RNFetchBlob.fs.writeFile(newFilePath, res, 'base64').then(res => {
                                console.log('1:second');
                                //fileArrayList
                                let FileArrayTemp = this.state.fileArrayList;
                                let FileArrayTempOne = [
                                    {
                                        id: Moment().unix(),
                                        fileName: filename,
                                        fileData: newFilePath,
                                        fileSize: response.size,
                                        filetype: response.type,
                                    },
                                ];
                                console.log(FileArrayTemp, 'filearraytemp');
                                var fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                                // console.log(fileMergeResult, 'filearraytemp2xxxxxxxxxxx333333');
                                this.setState(
                                    {
                                        fileArrayList: fileMergeResult,
                                    },

                                    () => {
                                        console.log(response, 'filedatabase', this.state.fileArrayList);
                                    },
                                );
                            });
                        })
                        .catch(err => {
                            console.log(err, 'Err in file catch');
                        });
                }
            }
        } catch (err) {
            console.log(err);
            if (DocumentPicker.isCancel(err)) return;
        }
    };
    openFileSystemFiles = async () => {
        let newFilePath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
            });
            console.log(response, 'filedataresponse');
            var filename = response.name.trim();
            var newfileName = 'file_' + Moment().unix() + '.' + filename.substring(filename.lastIndexOf('.') + 1);
            newFilePath = newFilePath + '/' + newfileName; // + response.name.replace(/ /g,'_')

            if (response) {
                if (this.checkFileAlreadyExist(this.state.fileArrayList, response) === true) {
                    alert('File already Exist, Kindly add a different file');
                    return;
                }
                var fileuri = Platform.OS == 'ios' ? decodeURIComponent(response.uri.slice(6)) : response.uri;
                console.log('fileuri', fileuri);

                //const fileuri = decodeURIComponent(fileuri);
                console.log(fileuri, 'decoded path');
                filename = filename.replace(/ /g, '_');

                if (response.size > 5000000) {
                    alert(strings.alert);
                } else if (response.size < 1910485760456) {
                    console.log('helloenter', response.size);
                    //console.log('helll no', response.size);

                    var data = await RNFS.readFile(fileuri, 'base64')
                        .then(res => {
                            console.log('1:first');
                            RNFetchBlob.fs.writeFile(newFilePath, res, 'base64').then(res => {
                                console.log('1:second');
                                //fileArrayList
                                let FileArrayTemp = this.state.fileArrayList;
                                let FileArrayTempOne = [
                                    {
                                        id: Moment().unix(),
                                        fileName: filename,
                                        fileData: newFilePath,
                                        fileSize: response.size,
                                        filetype: response.type,
                                    },
                                ];
                                console.log(FileArrayTemp, 'filearraytemp');
                                var fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                                // console.log(fileMergeResult, 'filearraytemp2xxxxxxxxxxx333333');
                                this.setState(
                                    {
                                        fileArrayList: fileMergeResult,
                                    },

                                    () => {
                                        console.log(response, 'filedatabase', this.state.fileArrayList);
                                    },
                                );
                            });
                        })
                        .catch(err => {
                            console.log(err, 'Err in file catch');
                        });
                }
            }
        } catch (err) {
            console.log(err);
            if (DocumentPicker.isCancel(err)) return;
        }
    };

    async deleteAttachments(value) {
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX', value);
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX this.state.fileArrayList', this.state.fileArrayList);

        const dummyArray = this.state.fileArrayList.filter(item => item.id !== value);
        console.log('dummyArray-----', dummyArray);
        this.setState(
            {
                fileName: '',
                fileData: '',
                fileSize: '',
                fileArrayList: dummyArray,
            },
            () => {
                console.log('fileName ', this.state.fileName);
                console.log('fileData ', this.state.fileData);
                console.log('fileSize ', this.state.fileSize);
                console.log('fileArrayList----xxxxx--', this.state.fileArrayList);

                var cameraCapture = [];
                this.props.storeCameraCapture(cameraCapture);
                const stringifiedCameraCapture = JSON.stringify(cameraCapture);
                AsyncStorage.setItem('cameraCapture', stringifiedCameraCapture);
            },
        );
    }

    render() {
        const layoutProfile = this.getLayoutProfile();
        const contentWidthStyle = layoutProfile.maxContentWidth ? { maxWidth: layoutProfile.maxContentWidth } : null;
        const responsiveAuditBodyStyle = [
            styles.auditPageBody,
            styles.auditPageBodyResponsive,
            contentWidthStyle,
            { paddingHorizontal: layoutProfile.horizontalPadding },
        ];
        const responsiveFooterContainerStyle = [styles.footerDiv, styles.footerResponsiveWrap];
        const standardRequirementModalStyle = [
            styles.ModalBox,
            layoutProfile.isTablet ? styles.ModalBoxTablet : null,
            layoutProfile.isLandscape ? styles.ModalBoxLandscape : null,
        ];
        const keyboardExtraHeight = layoutProfile.isLandscape ? 90 : 125;

        console.log('one:Navigation,PARAMS', this.props?.route?.params?.data);

        const multiprocess = this.props?.route?.params?.NCOFIDetails?.multiprocess;
        console.log(this.state.processdata, 'processautoone');
        console.log('userdetailsdropdown', this.state.requestDropdown);
        console.log('----------------smdata----------------', this.props.data.audits.smdata);
        console.log('CreateNC auditRecord===>', this.props.data.audits.auditRecords[0].AuditProcessList, this.props.data.audits.smdata);
        const myIcon = <Icon name="angle-down" size={20} color="grey" />;
        console.log('===>conformance/data', this.state.processdata);
        const suggestions = this.state.results;
        const category = this.state.categoryArr;
        const department = this.state.departArr;
        const request = this.state.UserArr;
        const user = this.state.RequestArr;
        const FailureCategory = this.state.FailureCategory;
        console.log('ncDATRA', this.state.ncData);
        console.log('ofidata', this.props.navigation);
        const array = this.state.FailureCategory?.map(obj => ({
            label: obj?.FailureCategoryName,

            value: obj?.FailureCategoryId,
        }));
        console.log('Failcat', array);
        console.log(this.state.clausedata, 'marcclause');
        const items = [
            {
                name: strings.ClausesL,
                id: 0,
                children: this.state.clausedata,
            },
        ];

        const itemsProcess = [
            {
                name: strings.ProcessL,
                id: 0,
                children: this.state.processdata,
                // children: this.props.navigation.state.params?.auditDetailsList,
            },
        ];

        console.log('this.state.processdata', this.state.processdata);
        console.log('param.auditDetailsList', this.props?.route?.params?.auditDetailsList);

        const radio_values = [
            { label: strings.no, value: 1 },
            { label: strings.yes, value: 0 },
        ];

        const headerTitle =
            this.state.PageLoader === false
                ? this.state.RouteParam === 'NC'
                    ? this.state.type == 'ADD'
                        ? strings.Upload + ' ' + 'NC'
                        : strings.Edit + ' ' + 'NC'
                    : this.state.type == 'ADD'
                    ? strings.Upload + ' ' + 'OFI'
                    : strings.Edit + ' ' + 'OFI'
                : '';

        return (
            <View style={styles.wrapper}>
                {Platform.OS === 'ios' ? <View style={styles.topSpacerIos} /> : <View style={styles.topSpacerAndroid} />}
                <OfflineNotice />
                <GlobalHeader
                    title={headerTitle}
                    subtitle={this.state.breadCrumbText}
                    onLeftPress={() => this.goBack()}
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                />
                {this.state.PageLoader === false ? (
                    <KeyboardAwareScrollView
                        key={`create-nc-${this.state.screenWidth}-${this.state.screenHeight}`}
                        style={styles.flexOne}
                        extraHeight={keyboardExtraHeight}
                        keyboardShouldPersistTaps="handled">
                        <View style={responsiveAuditBodyStyle}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.formBottomSpacer}>
                                    <View style={styles.formSection}>
                                        {this.state.RouteParam === 'NC' ? (
                                            <View style={styles.input02}>
                                                <InputComponent
                                                    label={strings.Non_confirmityL}
                                                    name="nonconfirmityText"
                                                    required
                                                    value={this.state.nonconfirmityText}
                                                    placeholder={strings.Non_confirmityL}
                                                    multiline
                                                    numberOfLines={3}
                                                    autoCapitalize="sentences"
                                                    inputRef={ref => (this.ncTxtField = ref)}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onChangeText={(field, value) => {
                                                        this.setState({ nonconfirmityText: value }, () => {
                                                            this.isCheck5 = true;
                                                        });
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <View style={styles.div1}>
                                                <View style={styles.input02}>
                                                    <InputComponent
                                                        label={strings.Opportunity_ApproachL}
                                                        name="ofitext"
                                                        required
                                                        value={this.state.ofitext}
                                                        placeholder={strings.Opportunity_ApproachL}
                                                        multiline
                                                        numberOfLines={3}
                                                        autoCapitalize="sentences"
                                                        inputRef={ref => (this.ofiTxtField = ref)}
                                                        containerStyle={styles.inputContainerNoPad}
                                                        onChangeText={(field, value) => {
                                                            this.setState({ ofitext: value }, () => {
                                                                this.isCheck3 = true;
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.div1}>
                                        {this.state.RouteParam === 'NC' ? (
                                            <View style={styles.input02}>
                                                <InputComponent
                                                    label={strings.Objective_Evidence}
                                                    name="objEvidence"
                                                    required
                                                    value={this.state.objEvidence}
                                                    placeholder={strings.Objective_Evidence}
                                                    multiline
                                                    numberOfLines={3}
                                                    autoCapitalize="sentences"
                                                    inputRef={ref => (this.objEviTxtField = ref)}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onChangeText={(field, value) => {
                                                        this.setState({ objEvidence: value }, () => {
                                                            this.isCheck5 = true;
                                                        });
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <View style={styles.input02}>
                                                <InputComponent
                                                    label={strings.Objective_Evidence}
                                                    name="objEvidence"
                                                    required
                                                    value={this.state.objEvidence}
                                                    placeholder={strings.Objective_Evidence}
                                                    multiline
                                                    numberOfLines={3}
                                                    autoCapitalize="sentences"
                                                    inputRef={ref => (this.objEviTxtField = ref)}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onChangeText={(field, value) => {
                                                        this.setState({ objEvidence: value }, () => {
                                                            this.isCheck5 = true;
                                                        });
                                                    }}
                                                />
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.formSection1}>
                                        <Text
                                            style={[
                                                styles.fieldLabel,
                                                this.state.clauseMandatory === 1 && this.state.RouteParam === 'NC' && this.state.MarkClause == false
                                                    ? { color: '#A6A6A6' }
                                                    : null,
                                            ]}>
                                            {strings.ClausesL}
                                        </Text>
                                        <View style={[styles.div2, { marginTop: 4 }]}>
                                            <View style={styles.inputhigh}>
                                                <SectionedMultiSelect
                                                    IconRenderer={this.icon}
                                                    ref={clauseListField => (this.clauseListField = clauseListField)}
                                                    items={items}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    single
                                                    selectText={strings.SelectClauses}
                                                    baseColor={this.state.MarkClause == false ? '#A6A6A6' : 'red'}
                                                    textColor={this.state.MarkClause == false ? '#A6A6A6' : 'red'}
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                                    selectedItems={Array.isArray(this.state.selectedItems) ? this.state.selectedItems : []}
                                                    expandDropDowns={true}
                                                    placeholderTextColor="#A6A6A6"
                                                    itemNumberOfLines={3}
                                                    selectLabelNumberOfLines={3}
                                                    styles={{
                                                        chipText: styles.multiSelectChipText,
                                                    }}
                                                    colors={{
                                                        text: '#A6A6A6',
                                                        subText: '#A6A6A6',
                                                        selectToggleTextColor: this.state.MarkClause == false ? '#A6A6A6' : 'red',
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.div01}>
                                        <View style={[styles.input002]}>
                                            {this.state.displayData ? (
                                                <Text style={styles.standardRequirementText}>{strings.StandardRequirementsL}</Text>
                                            ) : null}
                                            <View style={styles.eyeRow}>
                                                <InputComponent
                                                    label={strings.StandardRequirementsL}
                                                    name="standardRequirements"
                                                    value={
                                                        this.state.displayData
                                                            ? this.state.displayData.length > 40
                                                                ? this.state.displayData.substring(0, 40) + '...'
                                                                : this.state.displayData
                                                            : ''
                                                    }
                                                    placeholder={strings.StandardRequirementsL}
                                                    editable={false}
                                                    multiline
                                                    numberOfLines={1}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onTouchStart={() => this.setState({ isVisible: true })}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => this.setState({ NCtxtFlag: false, isVisible: true })}
                                                    style={styles.eyeIcon}>
                                                    <Icon name={'eye'} size={20} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={this.state.RouteParam == 'OFI' || this.state.isLPA ? styles.hidden : styles.check}></View>
                                    </View>
                                    <View style={styles.div1}>
                                        <View style={styles.input03}>
                                            <DropdownComponent
                                                data={category}
                                                label={
                                                    this.state.RouteParam === 'NC' ? 'NC' + ' ' + strings.CategoryL : 'OFI' + ' ' + strings.CategoryL
                                                }
                                                value={this.state.NCcategoryt ? this.state.NCcategoryt.value : ''}
                                                required
                                                editable={this.state.isContainValue1}
                                                dropdownRef={ref => (this.categoryTxtField = ref)}
                                                containerStyle={styles.inputContainerNoPad}
                                                onChange={value => {
                                                    console.log('*****', value);
                                                    const CategoryID = this.state.categoryArr.find(item => item.value === value);
                                                    if (CategoryID == null) {
                                                        this.isCheckCategory = false;
                                                    } else {
                                                        this.isCheckCategory = true;
                                                        this.setState({ NCcategoryt: CategoryID });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.div1}>
                                        <View style={styles.input05}>
                                            <DropdownComponent
                                                data={request}
                                                label={strings.ResponsibilityL}
                                                value={this.state.NCrequestby ? this.state.NCrequestby.value : ''}
                                                required
                                                editable={this.state.isContainValue4}
                                                dropdownRef={ref => (this.responsibleTxtField = ref)}
                                                containerStyle={styles.inputContainerNoPad}
                                                onChange={value => {
                                                    let RequestID = this.state.UserArr.find(item => item.value === value);
                                                    if (RequestID == null) {
                                                        this.isCheckRequest = false;
                                                    } else {
                                                        this.setState({ NCrequestby: RequestID }, () => {
                                                            this.isCheckRequest = true;
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.div1}>
                                        <View style={styles.input04}>
                                            <DropdownComponent
                                                data={user}
                                                label={strings.RequestedL}
                                                value={
                                                    this.state.NCresponsible
                                                        ? this.state.NCresponsible.value
                                                        : this.state.requestDropdown && this.state.requestDropdown.length >= 1
                                                        ? this.state.requestDropdown[0].value
                                                        : ''
                                                }
                                                required
                                                editable={this.state.isContainValue3}
                                                dropdownRef={ref => (this.requestTxtField = ref)}
                                                containerStyle={styles.inputContainerNoPad}
                                                onChange={value => {
                                                    let UserID =
                                                        this.state.UserArr.find(item => item.value === value) ||
                                                        this.state.RequestArr.find(item => item.value === value);

                                                    if (UserID == null) {
                                                        this.isCheckUser = false;
                                                    } else {
                                                        this.setState({ NCresponsible: UserID }, () => {
                                                            this.isCheckUser = true;
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.div1}>
                                        <View style={styles.input07}>
                                            {this.state.isContainValue4 === true ? (
                                                <View style={styles.failureDropdownWrapper}>
                                                    {this.state.NCFailure && (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    NCFailure: undefined,
                                                                });
                                                            }}
                                                            style={styles.failureClearButton}>
                                                            <View style={styles.failureClearIconWrapper}>
                                                                <Icon name="delete" size={20} color="black" />
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}

                                                    <DropdownComponent
                                                        data={array}
                                                        label={strings.FailureCategory}
                                                        value={this.state.NCFailure ? this.state.NCFailure.value : ''}
                                                        required
                                                        editable={this.state.isContainValue4}
                                                        dropdownRef={ref => (this.departmentTxtField = ref)}
                                                        containerStyle={styles.inputContainerNoPad}
                                                        onChange={value => {
                                                            let FailureID = array.find(item => item.value === value);
                                                            if (FailureID == null) {
                                                                this.isCheckFailure = false;
                                                            } else {
                                                                this.isCheckFailure = true;
                                                                this.setState({ NCFailure: FailureID });
                                                            }
                                                        }}
                                                    />
                                                </View>
                                            ) : (
                                                <View>
                                                    <DropdownComponent
                                                        data={FailureCategory}
                                                        label={strings.FailureCategory}
                                                        value={this.state.NCFailure ? this.state.NCFailure.value : ''}
                                                        required
                                                        editable={this.state.isContainValue4}
                                                        dropdownRef={ref => (this.departmentTxtField = ref)}
                                                        containerStyle={styles.inputContainerNoPad}
                                                        onChange={value => {
                                                            let FailureID = this.state.FailureCategory.find(item => item.value === value);
                                                            if (FailureID == null) {
                                                                this.isCheckFailure = false;
                                                            } else {
                                                                this.isCheckFailure = true;
                                                                this.setState({ NCFailure: FailureID });
                                                            }
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.formSection}>
                                        <View style={[styles.div2]}>
                                            <View style={styles.inputhigh}>
                                                {this.state.selectedItemsProcess ? (
                                                    <SectionedMultiSelect //single={multiprocess == "1" ? true : false}
                                                        IconRenderer={this.icon}
                                                        ref={processListField => (this.processListField = processListField)}
                                                        items={itemsProcess}
                                                        uniqueKey="id"
                                                        subKey="children"
                                                        selectText={this.state.processdata.length > 0 ? strings.ProcessL : 'No process(s) found'}
                                                        renderSelectText={() => strings.ProcessL}
                                                        baseColor={this.state.MarkProcess == false ? '#A6A6A6' : 'red'}
                                                        textColor={this.state.MarkProcess == false ? '#A6A6A6' : 'red'}
                                                        showDropDowns={true}
                                                        readOnlyHeadings={true}
                                                        selectedIconComponent={<Icon name="check" size={18} style={styles.selectedIconStyle} />}
                                                        onSelectedItemsChange={this.onSelectedItemsProcessChange}
                                                        selectedItems={
                                                            Array.isArray(this.state.selectedItemsProcess) ? this.state.selectedItemsProcess : []
                                                        }
                                                        expandDropDowns={true}
                                                        placeholderTextColor="#A6A6A6"
                                                        itemNumberOfLines={3}
                                                        selectLabelNumberOfLines={3}
                                                        styles={{
                                                            chipText: styles.multiSelectChipText,
                                                        }}
                                                        colors={{
                                                            text: '#A6A6A6',
                                                            subText: '#A6A6A6',
                                                            selectToggleTextColor: this.state.MarkProcess == false ? '#A6A6A6' : 'red',
                                                        }}
                                                    />
                                                ) : null}

                                                <View
                                                    style={this.state.RouteParam == 'OFI' || this.state.isLPA ? styles.hidden : styles.check}></View>
                                                <View style={styles.columnPadLeft}>
                                                    <Text ref="dummyFocus" style={styles.processLabel}>
                                                        {strings.ProcessAll}
                                                    </Text>
                                                    <RadioForm
                                                        ref={processRadioField => (this.processRadioField = processRadioField)}
                                                        radio_props={radio_values}
                                                        initial={0}
                                                        onPress={(value, index) => {
                                                            console.log(index, 'valueindex');
                                                            this.setState(
                                                                {
                                                                    ProcessType: value,
                                                                },
                                                                () => {
                                                                    this.setProcessList(1);
                                                                },
                                                            );
                                                        }}
                                                        formHorizontal={true}
                                                        labelHorizontal={true}
                                                        buttonSize={15}
                                                        labelStyle={{ color: 'black', paddingRight: 12 }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.div1, { display: 'none' }]}>
                                        <View style={styles.input07}>
                                            <DropdownComponent
                                                data={[]}
                                                label={strings.Auditee_Approach}
                                                value={''}
                                                editable={false}
                                                containerStyle={styles.inputContainerNoPad}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.div1}>
                                        {this.state.RouteParam === 'NC' ? (
                                            <View style={styles.input02}>
                                                <InputComponent
                                                    label={strings.Document_reference}
                                                    name="documentRef"
                                                    required={this.props.data.audits.smdata != 2 && this.props.data.audits.smdata != 3}
                                                    value={this.state.documentRef}
                                                    placeholder={strings.Document_reference}
                                                    multiline
                                                    numberOfLines={3}
                                                    autoCapitalize="sentences"
                                                    inputRef={ref => (this.docRefTxtField = ref)}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onChangeText={(field, value) => {
                                                        this.setState({ documentRef: value }, () => {
                                                            this.isCheck5 = true;
                                                        });
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <View style={styles.input02}>
                                                <InputComponent
                                                    label={strings.Document_reference}
                                                    name="documentRef"
                                                    value={this.state.documentRef}
                                                    placeholder={strings.Document_reference}
                                                    multiline
                                                    numberOfLines={3}
                                                    autoCapitalize="sentences"
                                                    inputRef={ref => (this.docRefTxtField = ref)}
                                                    containerStyle={styles.inputContainerNoPad}
                                                    onChangeText={(field, value) => {
                                                        this.setState({ documentRef: value }, () => {});
                                                    }}
                                                />
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.div1}>
                                        <Text style={styles.fieldLabel}>{strings.Attach_EvidenceL}</Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState({ AttachModal: true }, () => {
                                                    console.log('opoened');
                                                })
                                            }
                                            ref={evidenceField => (this.evidenceField = evidenceField)}
                                            style={styles.check}>
                                            <ResponsiveImage initWidth="24" initHeight="22" source={Images.AttachIcon} />
                                        </TouchableOpacity>
                                    </View>

                                    {this.state.fileArrayList != null && this.state.fileArrayList.length > 0 ? (
                                        <View style={styles.flexOne}>
                                            <FlatList
                                                data={this.state.fileArrayList}
                                                renderItem={this.renderItem}
                                                keyExtractor={item => item.id}
                                                horizontal={true} // Display images horizontally
                                                style={styles.listMarginTopSmall}
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAwareScrollView>
                ) : (
                    <View style={styles.contentLoaderContainer}>
                        {/* <Bars size={20} color='#48BCF7'/> */}
                        <ResponsiveImage source={Images.ContentLoader} initHeight={100} initWidth={100} />
                        <Text style={styles.contentLoaderTitle}>{strings.nc_01}</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    {this.state.isSaving === false ? (
                        <View style={responsiveFooterContainerStyle}>
                            <View style={styles.footerButtonsRow}>
                                <View style={styles.footerButtonWrapper}>
                                    <TouchableOpacity onPress={() => this.setState({ dialogVisible: true })} style={styles.footerButton}>
                                        <Icon name="rotate-ccw" size={20} color="#ffffff" />
                                        <Text style={styles.footerActionText}>{strings.Reset}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.footerButtonWrapper}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.state.startVoice === false
                                                ? debounce(this.StartVoicePress(), 800)
                                                : debounce(this.StopVoicePress(), 800);
                                        }}
                                        style={[styles.footerButton, this.state.startVoice === true]}>
                                        <Icon name="mic" size={20} color="#fff" />
                                        <Text style={[styles.footerActionText, this.state.startVoice === true]}>{'Voice'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.footerButtonWrapper}>
                                    <TouchableOpacity onPress={debounce(this.onSave.bind(this), 600)} style={styles.footerButton}>
                                        <Icon name="save" size={20} color="white" />
                                        <Text style={styles.footerActionText}>{strings.Save}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pulseWrapper}>
                            <Pulse size={20} color="white" />
                        </View>
                    )}
                    {/* </ImageBackground> */}
                </View>

                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    style={styles.modalOuterBox}
                    propagateSwipe>
                    <View style={standardRequirementModalStyle}>
                        <View style={styles.modalheader}>
                            <Text style={styles.modalHeaderTitle}>
                                {this.state.NCtxtFlag == false
                                    ? strings.StandardRequirementsL
                                    : this.state.RouteParam === 'NC'
                                    ? 'Non conformance'
                                    : 'Opportunity for improvements'}
                            </Text>
                        </View>
                        <ScrollView style={styles.modalbody} contentContainerStyle={styles.modalbodyContent} showsVerticalScrollIndicator>
                            <View>
                                {this.state.NCtxtFlag === false ? (
                                    <View style={styles.modalSection}>
                                        {this.state.modalDisplay.length > 0 ? (
                                            this.state.modalDisplay.map((item, key) => (
                                                <View key={key}>
                                                    <Text selectable={true} style={styles.modalSectionTitle}>
                                                        {item.name}
                                                    </Text>
                                                    <Text selectable={true} style={styles.modalContentText}>
                                                        {item.Requirement == null ? 'No content found for this clause' : item.Requirement}
                                                    </Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.modalEmptyText}>No content found for this clause</Text>
                                        )}
                                    </View>
                                ) : (
                                    <View style={styles.modalSection}>
                                        <Text selectable={true} style={styles.modalContentText}>
                                            {this.state.RouteParam === 'NC' ? this.state.nonconfirmityText : this.state.ofitext}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                        <View style={styles.modalfooter}>
                            <TouchableOpacity onPress={() => this.setState({ NCtxtFlag: false, isVisible: false })}>
                                <Text style={styles.closeModalText}>{strings.Close}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.dialogVisible}
                    onBackdropPress={() => this.setState({ dialogVisible: false })}
                    // animationIn="slideInUp"
                    // animationOut="slideOutDown"
                    // transparent={true}
                    backdropColor="rgba(0,0,0,0.5)"
                    style={styles.modalOuterBox}>
                    <View style={styles.ncModal}>
                        <View>
                            <View style={styles.modalheading}>
                                <View style={styles.centerAlignedRow}>
                                    <Text style={styles.confirmTitle}>{strings.Confirm}</Text>
                                </View>
                            </View>

                            <View style={styles.sectionTop}>
                                <View style={styles.sectionContent}>
                                    <Text style={styles.boxContent}>{strings.ResetField}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    this.resetForm();
                                }}>
                                <View style={styles.sectionBtn}>
                                    <Text style={styles.boxContent}>{strings.yes}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ dialogVisible: false })}>
                                <View style={styles.sectionTopCancel}>
                                    <View style={styles.sectionContent}>
                                        <Text style={styles.boxContentClose}>{strings.no}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <AttachmentSelectionModal
                    visible={this.state.AttachModal}
                    title={strings.Make_your_selection}
                    takePhotoText={strings.Camera_Capture_Head}
                    browseText={strings.Camera_Browse_Files}
                    cancelText={strings.Cancel}
                    onTakePhoto={() => this.cameraAction('Camera')}
                    onBrowseFiles={() => this.attachFiles()}
                    onCancel={() => this.setState({ AttachModal: false })}
                />

                <Modal
                    isVisible={this.state.suggestionPopUp}
                    onBackdropPress={() => this.setState({ suggestionPopUp: false })}
                    style={styles.modalOuterBox}>
                    <View style={styles.suggestionModal}>
                        <View style={styles.suggestionHeader}>
                            <View style={styles.suggestionIconCol}>
                                <ActivityIndicator size={20} color="#1CAFF6" />
                            </View>
                            <View style={styles.suggestionTextCol}>
                                <Text style={styles.suggestionTitle}>Voice assistant</Text>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={suggestions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this._suggestionPress(item.id);
                                        }}
                                        style={styles.suggestionbox}>
                                        <View>
                                            <Text style={styles.suggestionItemText}>{item.id}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    updateAuditStatus = auditid => {
        let bcontinue = false;
        var auditRecordsOrg = this.props.data.audits.auditRecords;
        var auditRecords = [];
        for (var p = 0; p < auditRecordsOrg.length; p++) {
            if (auditRecordsOrg[p].AuditId == auditid && auditRecordsOrg[p].AuditRecordStatus == constant.StatusDownloaded) {
                bcontinue = true;
                auditRecords.push({
                    ...auditRecordsOrg[p],
                    AuditRecordStatus: constant.StatusProcessing,
                });
            } else auditRecords.push(auditRecordsOrg[p]);
        }
        if (bcontinue) this.props.storeAuditRecords(auditRecords);
    };
}

const mapStateToProps = state => {
    console.log(state, 'propsdataincoming');
    return {
        data: state,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        storeAuditRecords: auditRecords => dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        storeCameraCapture: cameraCapture => dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateNC);
