import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
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
  Button,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Images } from '../Themes/index';
import styles from '../styles/CreateNCStyle';
// import {Dropdown} from 'react-native-element-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
import Toast, { DURATION } from 'react-native-easy-toast';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import OfflineNotice from '../components/OfflineNotice';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import { width } from 'react-native-dimension';
import ResponsiveImage from 'react-native-responsive-image';
import Moment from 'moment';
import Fonts from '../Themes/Fonts';
import {strings} from '../language/Language';
import { ConfirmDialog } from 'react-native-simple-dialogs';
// import GlobalHeader from '../Components/Shared/GlobalHeader';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { debounce, once, select } from 'underscore';
// Voice packages
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';
import FileViewer from 'react-native-file-viewer';
// import XLSX from 'xlsx'; // Import the xlsx library
import constant from '../constants/AppConstants';
// import ImagePicker from 'react-native-image-picker';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';

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
  pdf: 'file-pdf-o',
  png: 'file-image-o',
  xls: '',
  xlsx: '',
  doc: '',
  docx: '',
  ppt: '',
  pptx: '',

  // Add more mappings as needed
};
class CreateNC extends Component {
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
    console.log('get this.props-->', this.props)

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
      nonconfirmityText: '',
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
      selectedItemsResponse: [],
      checklistName: '',
      editnclpa: false,
      ncDetails: { ...this.props.navigationParams },
     // };
    };

    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentDidMount() {
    
    Voice.onSpeechResults = this.onSpeechResults;

    const routes = this.props.navigation.getState().routes;

    // const checklistName = this.props?.route?.name?.find(
    const checklistName = routes.find(
      route => route.routeName === ROUTES.CREATE_NCLPA,
    )?.params?.checklistName;
    // const radioVal = this.props?.route?.name?.find(
    const radioVal = routes.find(
      route => route.routeName === ROUTES.CREATE_NCLPA,
    )?.params?.radiovalue;

    // Debugging logs
    ////console.log('checklistdataaaalogggg********', checklistName);
    ////console.log('radioValdataaaalogggg********', radioVal);

    if (radioVal === 15) {
      ////console.log('looooggggtrue');
      this.setState(
        {
          editnclpa: true,
          nonconfirmityText: checklistName + ":No" || '',
          //  NCresponsible: responsibiltyField

          // Ensure it falls back to an empty string if checklistName is undefined
        },
        () => {
          // Debugging the updated state
          ////console.log('nonconfirmityTextvalll', this.state.nonconfirmityText);
        },
      );
    } else {
      ////console.log('looooggggfalse');
      this.setState({
        editnclpa: false,
        nonconfirmityText: '',
      });
    }

    const { data } = this.props;
    if (
      data &&
      data.audits?.auditRecords?.[0]?.CheckListPropData?.[4]?.ChecklistName
    ) {
      this.setState({
        checklistName:
          data.audits.auditRecords[0].CheckListPropData[4].ChecklistName,
      });
    }
    // this.setState({
    //   selectedItemsResponse: this.state.UserArr?.filter((data) => data?.selection === "True").map((data) => data?.id),
    // });
    // //console.log(this.state.selectedItemsResponse,this.state.UserArr,"responsibbu");
    

    if (this.props?.route?.params?.data != null) {
      console.log(
        'this.props?.route?.params?.data++++',
        this.props?.route?.params?.data,
      );
      this.setProcessList();
      const filenameArray = this.props?.route?.params?.data?.filename;
      ////console.log('checklist-filenameArray--------', filenameArray);
      const originalData = this.props?.route?.params?.data?.filedata;
      ////console.log('checklist-originalData--------', originalData);

      if (originalData.length > 0) {
        console.log(
          'XSDASDASDASD',
          this.props?.route?.params?.data?.filedata,
        );
        ////console.log('Original Data:', this.state.fileArrayList);
        const selectedItems =
        this.props?.route?.params?.data?.selectedItemsProcess || []; // Example array with undefined elements

        // Filter out undefined elements
        const filteredItems = selectedItems.filter(item => item !== undefined);

        //console.log('Filtered items:', filteredItems);
        //PROCESS   Selected items:----

        //SelectedArray--->
        const arr1 =
        this.props?.route?.params?.data?.selectedItemsProcess || [];
        //Default array--->
        const arr2 = this.state.processdata;
        // //console.log("this.state.processdatathis.state.processdata",arr1 );
        console.log(
          'this.state.processdatathis.state.processdata123',
          this.state.selectedItemsProcessDumm,
        );

        const matchingItems = [];

        for (let i = 0; i < arr1.length; i++) {
          if (arr2.includes(arr1[i]?.id)) {
            matchingItems.push(arr1[i]);
          }
        }

        // Display the matching items
        //console.log('Matching items:', matchingItems);
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

  // onSelectedItemsResponseChange = (selectedItems) => {
  //   this.setState({ selectedItemsResponse: selectedItems });
  // };
  async getUserDetails() {
    var userid = await AsyncStorage.getItem('userId');
    var username = await AsyncStorage.getItem('userName');
    //console.log(userid, username, 'Asyncusergetand set');
    var userDetails = [];
    userDetails.push({
      value: username,
      id: userid,
    });
    //console.log(userDetails, 'userdetails');
    this.setState({
      requestDropdown: userDetails,
    });
  }
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

    const iconColor =
      color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '';

    const Down = <Icon name="caret-down" size={20} color="grey" />;

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
      this.props?.route?.params?.NCOFIDetails?.clauseMandatory,
    });
    console.log(
      this.props?.route?.params?.NCOFIDetails?.clauseMandatory,
      'clausemandatory',
    );
    //console.log('LongTask',this.props?.route?.params);
    

    //console.log(this.props.data, 'propsdataincoming');
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh');
        this.setState({});
        //console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US');
        this.setState({});
        //console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    //console.log('CreateNCmounted', this.props?.route?.params?);
    // //console.log('getting props',this.props.data.audits)
    var auditRecords = this.props.data.audits.auditRecords;
    var auditProcessListAll = null;
    var auditProgramId = null;
    var isLpa = false;
    console.log(
      'Load:NC:CreateNC auditRecords props',
      auditRecords,
      'AuditID',
      this.props.data.audits.auditRecords[0].AuditProcessList,
      typeof this.props?.route?.params?.NCOFIDetails == 'string'
        ? this.props?.route?.params?.AuditID
        : this.props?.route?.params?.NCOFIDetails?.AuditID,
    );

    for (var i = 0; i < auditRecords.length; i++) {
      var auid =
        typeof this.props?.route?.params?.NCOFIDetails == 'string'
          ? this.props?.route?.params?.AuditID
          : this.props?.route?.params?.NCOFIDetails?.AuditID;
      console.log(
        'insideForauditRecords[i]',
        auditRecords[i].AuditId,
        'porp',
        auid,
      );
      if (auditRecords[i].AuditId == auid) {
        console.log(
          'insideIFauditRecords[i]',
          auditRecords[i],
          auditRecords[i].AuditProcessList,
        );
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

    //console.log('auditProcessListAll', auditProcessListAll);
    //console.log('isLpa', isLpa);

    if (this.props?.route?.params?.CheckpointRoute) {
      console.log(
        'Load:NC:this.props?.route?.params?',
        this.props?.route?.params,
      );
      console.log(
        'this.props?.route?.params?.CheckpointRoute',
        this.props?.route?.params?.NCOFIDetails,
      );
      //console.log('logvalllllll', this.state.nonconfirmityText);

      this.setState(
        {
          isLPA: isLpa,
          ProcessListAll: auditProcessListAll,
          breadCrumbText:
            this.props?.route?.params?.NCOFIDetails?.breadCrumb,
          RouteParam: this.props?.route?.params?.CheckpointRoute,
          templateId: this.props?.route?.params?.templateId,
          isUploaded: this.props?.route?.params?.isUploaded,
          AuditID:
            typeof this.props?.route?.params?.NCOFIDetails == 'string'
              ? this.props?.route?.params?.NCOFIDetails
              : this.props?.route?.params?.NCOFIDetails?.AuditID,
          AuditOrder:
            this.props?.route?.params?.NCOFIDetails?.AuditOrder,
          ChecklistID:
            this.props?.route?.params?.NCOFIDetails?.ChecklistID,
          Formid: this.props?.route?.params?.NCOFIDetails?.Formid,
          SiteID: this.props?.route?.params?.NCOFIDetails?.SiteID,
          auditstatus:
            this.props?.route?.params?.NCOFIDetails?.auditstatus,
          title: this.props?.route?.params?.NCOFIDetails?.title,
          auditnumber: this.props?.route?.params?.NCOFIDetails?.AUDIT_NO,
          clauseRecords: this.props.data.audits?.auditRecords,
          type: this.props?.route?.params?.type,
          ncData: this.props?.route?.params?.data,
          selectedItems: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.selectedItems
            : [],
          selectedItemsProcess: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.selectedItemsProcess
            : [],
          displayData: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.requiretext
            : undefined,
          NCcategoryt: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.categoryDrop
            : undefined,
          NCrequestby: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.userDrop
            : undefined,
          NCdept: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.deptDrop
            : undefined,
          NCFailure: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.failureDrop == '0'
              ? undefined
              : this.props?.route?.params?.data?.failureDrop
            : undefined,
          nonconfirmityText: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.NonConfirmity
            : this.state.nonconfirmityText,
          NCresponsible: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.requestDrop
            : undefined,
          ofitext: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.OFI
            : this.state.ofitext,
          fileName: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.filename
            : undefined,
          fileData: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.filedata
            : undefined,
          ncIdentifier: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.ncIdentifier
            : undefined,
          objEvidence: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.objEvidence
            : undefined,
          recommAction: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.recommAction
            : undefined,
          documentRef: this.props?.route?.params?.data
            ? this.props?.route?.params?.data?.documentRef
            : undefined,
          selectedItemsResponse: this.props?.route?.params?.data && this.props?.route?.params?.data?.ResponsibilityUser ?
            this.props?.route?.params?.data?.ResponsibilityUser 
            :undefined,
        },
        () => {
          this.getDropValue();
          // console.log(
          //   'Load:NC:ResponsibilityUser',
          //   this.props?.route?.params?.data,this.props?.route?.params?.data.ResponsibilityUser,
          //   this.state.selectedItemsProcess,
          // );
          //console.log(this.props?.route?.params, 'dataaa==>');
          //console.log('checklistamevalue1', this.state.nonconfirmityText);

        },
      );
    } else {
      //console.log('Audit props', this.props.data.audits);
      this.setState(
        {
          isLPA: isLpa,
          dropvalues: this.props?.route?.params?.DropDownval,
          isUploaded: this.props?.route?.params?.isUploaded,
          getDetails: this.props?.route?.params?.CreateNCdetails,
          AuditID: this.props?.route?.params?.CreateNCdetails?.AuditID,
          AuditOrder:
            this.props?.route?.params?.CreateNCdetails?.AuditOrder,
          ChecklistID:
            this.props?.route?.params?.CreateNCdetails?.ChecklistID,
          Formid: this.props?.route?.params?.CreateNCdetails?.Formid,
          SiteID: this.props?.route?.params?.CreateNCdetails?.SiteID,
          auditstatus:
            this.props?.route?.params?.CreateNCdetails?.auditstatus,
          title: this.props?.route?.params?.CreateNCdetails?.title,
          auditnumber:
            this.props?.route?.params?.CreateNCdetails?.AUDIT_NO,
          RouteParam: this.props?.route?.params?.RouteValue,
          clauseRecords: this.props.data.audits?.auditRecords,
          ofitext: this.props?.route?.params?.data?.OFI,
          documentRef: this.props?.route?.params?.documentRef,
        },
        () => {
          this.getDropValue();
        },
      );
    }
    //console.log('auditstatus', this.state.auditstatus);
    //console.log('AuditOrder', this.state.AuditOrder);
    var processautoid =
      this.props?.route?.params?.NCOFIDetails?.ProcessID;
    var type = this.props?.route?.params?.type;
    if (
      processautoid !== '' &&
      processautoid !== null &&
      processautoid !== undefined &&
      type === 'ADD'
    ) {
      var processArray = [processautoid];
      this.setState({
        selectedItemsProcess: processArray,
        MarkProcess: false,
      });
    }
  }

  componentWillReceiveProps(props) {
    const { navigation } = this.props;
    const cancelled = navigation.getParam('cancelpressed', 'empty');
    const uri_details = navigation.getParam('Uri', 'empty');
    const video_name = navigation.getParam('Name', 'empty');
    const video_type = navigation.getParam('Type', 'empty');

    //console.log(cancelled + 'value');

    var CurrentPage = this.props?.route?.name;
    console.log("--CurrentPage--->", CurrentPage);
    var routes = this.props.navigation.getState().routes;
    var getpreviouspage = routes[routes.length - 2]?.name;
    console.log('previous page' + getpreviouspage);

    if (CurrentPage == ROUTES.CREATE_NC) {
      this.InitVoice();
      console.log(
        'exception1',
        props.data.audits.cameraCapture,
        this.state.fileName,
      );
      if (props.data.audits.cameraCapture) {
        if (cancelled == 1) {
          this.setState({
            fileName: undefined,
            fileData: undefined,
            fileSize: undefined,
          });
          //console.log('exception1 cancel', props.data.audits.cameraCapture);
        }

        if (cancelled == 0 && props.data.audits.cameraCapture.length == 0) {
          //console.log('inside save set state part..');
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
          //console.log(FileArrayTemp, 'filearraytemp - will rcv pop');
          let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
          // //console.log(fileMergeResult, 'filearraytemp2xxxxxxxx11111');
          this.setState(
            {
              fileArrayList: fileMergeResult,
            },
            () => {
              //console.log('fileName', this.state.fileName);
            },
          );
        }

        //console.log('file name' + this.state.fileName);
        if (props.data.audits.cameraCapture.length > 0 && cancelled != 1) {
          var res = props.data.audits.cameraCapture;
          //console.log('exception3', props.data.audits.cameraCapture);
          let FileArrayTemp = this.state.fileArrayList;
          let FileArrayTempOne = [
            {
              fileName: res[0].name,
              fileData: res[0].uri,
              fileSize: res[0].type,
              id: Moment().unix(),
            },
          ];
          //console.log(FileArrayTemp, 'filearraytemp');
          let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
          // //console.log(fileMergeResult, 'filearraytemp2xxxxxxx22222');

          const uniqueFiles = fileMergeResult.reduce(
            (accumulator, currentFile) => {
              if (
                !accumulator.find(
                  file => file.fileData === currentFile.fileData,
                )
              ) {
                accumulator.push(currentFile);
              }
              return accumulator;
            },
            [],
          );
          //console.log('!!!!!!!!!!!!!!!!!@@@@@@@@@@@@', uniqueFiles);

          this.setState(
            {
              fileArrayList: uniqueFiles,
            },
            () => {
              //console.log('fileName', this.state.fileName);
            },
          );
        } else {
          //console.log('no pic found');
          //console.log('inside file path' + this.state.fileData);
          //console.log('exception14', props.data.audits.cameraCapture);
        }
      } else {
        //console.log('no pic found');
      }
    } else {
      //console.log('CreateNC pass');
    }
  }
  StartVoicePress() {
    //console.log('voice:StartVoicePressdebouncer activate');
    if (Platform.OS == 'ios') {
      Voice.removeAllListeners();
      this.InitVoice();
    }
    this._startRecognizing();
  }

  StopVoicePress() {
    //console.log('voice:StopVoicePressdebouncer activate');
    this._stopRecognizing();
    Voice.removeAllListeners();
    this.InitVoice();
  }

  InitVoice() {
    //console.log('voice:InitVoice');
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

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
        //console.log('voice:setSTate called');
      },
    );
  }

  componentWillUnmount() {
    if (Voice.isAvailable) Voice.destroy().then(Voice.removeAllListeners);
    var cameraCapture = [];
    this.props.storeCameraCapture(cameraCapture);
  }

  cameraAction(type) {
    this.setState(
      {
        AttachModal: false,
      },
      () => {
        if (type == 'Camera') {
          this.props.navigation.navigate(ROUTES.CAMERA_CAPTURE);
        } else if (type == 'Video') {
          this.props.navigation.navigate(ROUTES.VIDEO_CAPTURE);
        }
      },
    );
  }

  async readFile(arrpath) {
    if (arrpath) {
      return new Promise((resolve, reject) => {
        //console.log('arrpath', arrpath);
        RNFS.readFile(arrpath, 'base64')
          .then(res => {
            if (res) {
              // resolve(arrpath);
              //console.log(res, 'resvalue');
              //console.log('path found', arrpath);
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

  onSpeechError = e => {
    // eslint-disable-next-line
    //console.log('voice:onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
      startVoice: false,
      // isVisible:false
    });
    if (Platform.OS == 'ios') {
      this._startRecognizing();
    }
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    //console.log('voice:onSpeechResults: ', e);
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
    //console.log('voice:onSpeechPartialResults: ', e);
    this.setState(
      {
        partialResults: e.value,
      },
      () => {
        //console.log('_----_', this.state.partialResults);
      },
    );
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    //console.log('voice:onSpeechEnd: ', e);
    if (Platform.OS === 'ios') {
      timer = null;
      this.setState({ listening: false });
      if (this.state.results != null && this.state.results != '') {
        //console.log('--------------------');
        this.VoiceLogic();
      }
    } else {
      //console.log('onSpeechEnd: ', e);
      this.setState({
        end: '√',
        started: '',
      });
    }
  };

  async stopRecording() {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
    //console.log('voice:onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    //console.log('voice:_startRecognizing');
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
        //console.log('flag reset');
      },
    );
    try {
      if (this.props.data.audits.language === 'Chinese') {
        await Voice.start('zh');
      } else if (
        this.props.data.audits.language === null ||
        this.props.data.audits.language === 'English'
      ) {
        await Voice.start('en-US');
      }
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      //console.log('voice:_stopRecognizing');
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      //console.log('voice:_cancelRecognizing');
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      //console.log('voice:_destroyRecognizer');
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
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
    //console.log(path, 'Attachment:path');
    if (path == null || typeof path == 'undefined' || path == '') return;
    // const fpath = FileViewer.open('file:/' + path) // absolute-path-to-my-local-file.
    //   .then(() => {
    //     //console.log('Attachmentfile opened');
    //   })
    //   .catch(err => {
    //     //console.log('Attachmentfile opened error', err);
    //   });

    FileViewer.open(path, { showOpenWithDialog: true })
      .then(() => {
        // success
        //console.log('SUCESSSSSPATH-----------', path);
      })
      .catch(error => {
        //console.log('failure----------', error);
      });
  };

  getFileIcon(filename, fileData) {
    //console.log('XXXXXXXXXXXX-------', fileData, filename);
    let icon = 'file';
    if (filename == null || typeof filename == 'undefined' || filename == '')
      return null;
    let type =
      filename !== ''
        ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
        : 'file';
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
      case 'xlsm': {
        icon = 'file-excel-o';
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
        style={{
          width: width(70),
          height: 200,
          resizeMode: 'cover',
          alignSelf: 'center',
        }}
      />
    ) : (
      <View style={{ width: width(70), height: 200 }}>
        <Icon
          name={icon}
          size={65}
          color="black"
          style={{
            flex: 1,
            alignSelf: 'center',
            marginTop: 70,
          }}
        />
      </View>
    );
  }

  VoiceLogic() {
    //console.log('voice:VoiceLogic');
    //console.log('isOfflineMode', this.props.data.audits.isOfflineMode);

    if (Platform.OS == 'ios') {
      var txt = this.state.results[0];
    } else {
      var txt = this.state.results;
    }
    //console.log('_---_results: ', this.state.results);
    //console.log('_---txt: ', txt);

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
          this.refs.docRefTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
          this.InitVoice();
        },
      );
    } else if (this.VoiceFill === true) {
      this.setState(
        {
          PrevNonConformity: this.state.nonconfirmityText,
          nonconfirmityText: txt.charAt(0).toUpperCase() + txt.slice(1),
        },
        () => {
          //console.log('checklistamevalue2', this.state.nonconfirmityText);

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
          Voice.removeAllListeners();
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
          Voice.removeAllListeners();
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
          Voice.removeAllListeners();
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
          this.refs.objEviTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
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
          Voice.removeAllListeners();
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
          this.refs.categoryTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
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
          this.refs.categoryTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
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
            this.refs.departmentTxtField.blur();
            this._stopRecognizing();
            Voice.removeAllListeners();
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
          this.refs.responsibleTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
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
          this.refs.requestTxtField.blur();
          this._stopRecognizing();
          Voice.removeAllListeners();
          this.InitVoice();
        },
      );
    } else {
      /** Speech detect section yyyyy */
      if (
        txt.toLowerCase().includes(strings.va_hi) ||
        txt.toLowerCase().includes(strings.va_hello)
      ) {
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
        Voice.removeAllListeners();
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
        Voice.removeAllListeners();
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
        this.refs.ncTxtField.focus();
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
        this.refs.responsibleTxtField.focus();
        this._stopRecognizing();
        Voice.removeAllListeners();
        this.InitVoice();
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
        this.refs.requestTxtField.focus();
        this._stopRecognizing();
        Voice.removeAllListeners();
        this.InitVoice();
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
        this.refs.categoryTxtField.focus();
        this._stopRecognizing();
        Voice.removeAllListeners();
        this.InitVoice();
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
        this.refs.categoryTxtField.focus();
        this._stopRecognizing();
        Voice.removeAllListeners();
        this.InitVoice();
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
          this.refs.departmentTxtField.focus();
          this._stopRecognizing();
          Voice.removeAllListeners();
          this.InitVoice();
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
        this.refs.ncidentifierTxtField.focus();
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

        this.refs.objEviTxtField.focus();
        //this.refs.objEvidence.focus();
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

        this.refs.recomTxtField.focus();
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
        this.refs.ofiTxtField.focus();
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.va_Uni_rep08);
        });
        setTimeout(() => {
          this._startRecognizing();
        }, 1500);
      } else if (
        txt.toLowerCase().includes('document') ||
        txt.toLowerCase().includes('document reference')
      ) {
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
        this.refs.docRefTxtField.focus();
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.va_Uni_rep08);
        });
        setTimeout(() => {
          this._startRecognizing();
        }, 1500);
      } else if (
        txt.toLowerCase().includes(strings.va_cmd701) ||
        txt.toLowerCase().includes('attachment')
      ) {
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
        Voice.removeAllListeners();
        this.InitVoice();
      } else if (txt.toLowerCase().includes(strings.va_cmd802)) {
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.va_rep10);
        });
        this.onSave();
      } else {
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.v_Key_Invalid_Message);
        });
        Voice.removeAllListeners();
        this.InitVoice();
      }
    }
  }

  getDropValue() {
    var AuditID = this.state.AuditID;
    var Data = this.state.clauseRecords;
    if (Data) {
      //console.log('Dropdata==>', Data);
      for (var i = 0; i < Data.length; i++) {
        if (AuditID === Data[i].AuditId) {
          this.setState({ dropvalues: Data[i].DropDownProps }, () => {
            // //console.log('Drop down values getting from props',this.state.dropvalues)
            this.getDropDownData(this.state.dropvalues);
          });
        }
      }
    } else {
      this.getClauseList(this.state.clauseRecords);
    }
  }

  getClauseList = Records => {
    // //console.log('getting records',Records)
    var RecordList = Records;
    var Clausedropdown = [];
    //console.log('loDER==>');
    if (RecordList) {
      for (var i = 0; i < RecordList.length; i++) {
        if (RecordList[i].AuditId === this.state.AuditID) {
          //console.log('AuditID===>>', this.state.AuditID);
          if (RecordList[i].DropDownProps.ClauseList) {
            for (
              var j = 0;
              j < RecordList[i].DropDownProps.ClauseList.length;
              j++
            ) {
              Clausedropdown.push({
                name:
                  RecordList[i].DropDownProps.ClauseList[j].Element +
                    ' ' +
                    RecordList[i].DropDownProps.ClauseList[j]
                      .StandardDescription.length >
                    40
                    ? RecordList[i].DropDownProps.ClauseList[j].Element +
                    ' ' +
                    RecordList[i].DropDownProps.ClauseList[
                      j
                    ].StandardDescription.substring(0, 40) +
                    '...'
                    : RecordList[i].DropDownProps.ClauseList[j].Element +
                    ' ' +
                    RecordList[i].DropDownProps.ClauseList[j]
                      .StandardDescription,
                id: RecordList[i].DropDownProps.ClauseList[j].ElementId,
                newid: parseFloat(
                  RecordList[i].DropDownProps.ClauseList[j].Element,
                ),
                Requirement:
                  RecordList[i].DropDownProps.ClauseList[j].StandardRequirement,
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
      //console.log('Clause dropdown', this.state.clausedata);
      this.onSelectedItemsChange(this.state.selectedItems);
      this.setProcessList();
    });
  };

  setProcessList = id => {
    const newProcessdata = this.props?.route?.params?.auditDetailsList;
    //console.log(newProcessdata, 'newprocessdata');
    if (id == 0) {
      this.setState(
        {
          selectedItemsProcess: [],
        },
        () => {
          var processList = [];
          //console.log('processslistalldata', this.state.ProcessListAll);
          console.log(
            'processtype==>',
            this.state.ProcessType,
            this.state.ProcessListAll,
          );
          if (this.state.ProcessType !== 1 && this.state.ProcessListAll) {
            if (this.state.ProcessListAll.lstProcessSelection) {
              for (
                var i = 0;
                i < this.state.ProcessListAll.lstProcessSelection.length;
                i++
              ) {
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
                  id: newProcessdata[i].ProcessID,
                  name: newProcessdata[i].ProcessName,
                });
                //console.log(processList, 'processlistone');
              }
            }
          } else {
            if (this.state.ProcessListAll) {
              if (this.state.ProcessListAll.lstProcessSelectionEmpty) {
                for (
                  var i = 0;
                  i < this.state.ProcessListAll.lstProcessSelectionEmpty.length;
                  i++
                ) {
                  processList.push({
                    id: newProcessdata[i].ProcessID,
                    name: newProcessdata[i].ProcessName,
                  });
                  //console.log(processList, 'processlistone');
                }
              }
            }
          }
          //console.log('Process type', this.state.ProcessType);
          //console.log('Process List:', processList);
          console.log(
            'this.state.selectedItemsProces123',
            this.state.selectedItemsProces,
          );
          this.setState(
            {
              processdata: processList,
              PageLoader: false,
            },
            () => {
              //console.log('Prcessdta===>', this.state.processdata);
              this.onSelectedItemsProcessChange(
                this.state.selectedItemsProcess,
              );
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
      //console.log('ProcessType===>', this.state.ProcessType);
      //console.log('ProcessTypeAll', this.state.ProcessListAll);
      if (this.state.ProcessType == 1 && this.state.ProcessListAll) {
        if (this.state.ProcessListAll.lstProcessSelection) {
          for (
            var i = 0;
            i < this.state.ProcessListAll.lstProcessSelection.length;
            i++
          ) {
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
            for (
              var i = 0;
              i < this.state.ProcessListAll.lstProcessSelectionEmpty.length;
              i++
            ) {
              processList.push({
                id: this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                  .KeyProcessId,
                name:
                  this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                    .ProcessName +
                  ' - ' +
                  this.state.ProcessListAll.lstProcessSelectionEmpty[i]
                    .ProcessScope,
              });
            }
          }
        }
      }
      //console.log('Process List:', processList);
      //console.log('this.state.selectedItemsProces123', processList);
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
    //console.log('serteditval', this.state.ncData);
    var processListIntArr = [];
    for (var i = 0; i < this.state.ncData.selectedItemsProcess.length; i++) {
      processListIntArr.push(
        parseInt(this.state.ncData.selectedItemsProcess[i]),
      );
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
        ResponsibilityUser: this.state.ncData.selectedItemsResponse,
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
        //console.log('checklistamevalue3', this.state.nonconfirmityText);

        //console.log('setEditValues NCresponsible', this.state.ncData.userDrop);
        this.setProcessList();
      },
    );
  };

  onSelectedItemsProcessChange = selectedItems => {
    //console.log('selectedItemsProcess selectedItems  ', selectedItems);
    const multiprocess =
      this.props?.route?.params?.NCOFIDetails?.multiprocess;
    let newArry = [];
    if (multiprocess == '1') {
      selectedItems.length > 0 &&
        newArry.push(selectedItems[selectedItems.length - 1]);
      this.setState({ selectedItemsProcess: newArry, MarkProcess: false });
    } else {
      // const itemFilter = selectedItems.filter((data)=>data !== undefined)
      this.setState({ selectedItemsProcess: selectedItems, MarkProcess: false });
    }
    // //console.log('selectedItemsProcess selectedItems --------- ', itemFilter);
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.setState({
      MarkClausedrop: false,
    });

    ////console.log('selectedItems',selectedItems)
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

    // //console.log('TotalObject',TotalObject)

    this.setState(
      {
        displayData:
          getRequireText == '' || null || undefined ? '-' : getRequireText,
        modalDisplay: TotalObject,
      },
      () => {
        //console.log('displayData--->', this.state.displayData);
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
      // //console.log('Failed to retrive a login session!!!',error)
    }
  };

  getDropDownData(dropdata) {
    var Data = dropdata;
    //console.log('Drop data', Data);
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

    //console.log('requestDrop NCresponsible', this.state.NCresponsible);
    //console.log('DropData///', this.state.RouteParam, Data.Category);
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
        FailureCategory.push(Data.FailureCategory[i]);
      }
    }

    if (Data.RequestBy) {
      for (var i = 0; i < Data.RequestBy.length; i++) {
        Request.push(Data.RequestBy[i]);
      }
    }

    if (Data.Users) {
      for (var i = 0; i < Data.Users.length; i++) {        
        const respuserid = this.props?.route?.params?.data?.ResponsibilityUser ? this.props?.route?.params?.data?.ResponsibilityUser[0] : 0
        User.push({...Data.Users[i],ISSelection : Data.Users[i].userid === respuserid ? "True" : Data.Users[i].ISSelection
        });
        //User.push(Data.Users[i])
        if (Data.Users[i].userid == this.props.data.audits.userId) {
          NCresponsible = {
            value: Data.Users[i].Name,
            id: Data.Users[i].userid,
            selection: Data.Users[i].selection
          };
        }
        console.log('Load:NC:User arr', Data.Users[i],User[i]);
      }
    }

    for (var i = 0; i < Category.length; i++) {
      categoryArr.push({
        value: Category[i].CategoryName,
        id: Category[i].CategoryId,
      });
    }
    for (var i = 0; i < Department.length; i++) {
      departArr.push({
        value: Department[i].DepartmentName,
        id: Department[i].DepartmentId,
      });
    }
    for (var i = 0; i < User.length; i++) {
      UserArr.push({ value: User[i].Name, id: User[i].userid, selection: User[i].ISSelection });
    }
    for (var i = 0; i < Request.length; i++) {
      RequestArr.push({
        value: Request[i].AuditeeContactPersonName,
        id: Request[i].AuditeeContactPersonId,
      });
    }

    this.setState(
      {
        categoryArr: categoryArr,
        departArr: departArr,
        UserArr: UserArr,
        selectedItemsResponse: UserArr?.filter((data) => data?.selection === "True").map((data) => data?.id),
      // selectedItemsResponse:this.state.selectedItemsResponse,
        RequestArr: RequestArr,
        FailureCategory: FailureCategory,
      },
      
      () => {
        console.log(this.state.selectedItemsResponse, 'Load:NC:selectedItemsResponse1');
        
        //console.log('this.state.categoryArr', this.state.categoryArr);
        //console.log('this.state.departArr', this.state.departArr);
        console.log('Load:NC:User:Arr001', this.state.UserArr);
        //console.log('this.state.RequestArr', this.state.RequestArr);
        //console.log('this.staet.FailureCat', this.state.FailureCategory);
        if (this.state.categoryArr.length === 0) {
          this.setState({ isContainValue1: false }, function () {
            this.isCheckCategory = true;
          });
        } else if (this.state.departArr.length === 0) {
          this.setState({ isContainValue2: false }, function () {
            this.isCheckDepart = true;
          });
        } else if (this.state.UserArr.length === 0) {
          this.setState({ isContainValue3: false }, function () {
            this.isCheckUser = true;
          });
        } else if (this.state.RequestArr.length === 0) {
          this.setState({ isContainValue4: false }, function () {
            this.isCheckRequest = true;
          });
        } else if (this.state.FailureCategory.length === 0) {
          this.setState({ isContainValue0: false }, function () {
            this.isCheckFailure = true;
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
        displayData: undefined,
        NCcategoryt: undefined,
        NCuser: undefined,
        NCrequestby: undefined,
        NCdept: undefined,
        NCFailure: undefined,
        requirementText: undefined,
        nonconfirmityText: undefined,
        NCresponsible: undefined,
        ofitext: undefined,
        fileName: undefined,
        fileData: undefined,
        documentRef: undefined,
        ncIdentifier: '',
        objEvidence: undefined,
        recommAction: '',
        fileArrayList: [],
      },
      () => {
        //console.log('checklistamevalue4', this.state.nonconfirmityText);

        this.refs.toast.show(strings.FormVal, 6000);
      },
    );
  };

  onBuffer(dupNCrecords) {
    //console.log('once called', this.state.isBuffered, dupNCrecords);
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
          // //console.log('Loader off')
          console.log(
            this.state.selectedItemsProcess.length,
            'hellothreefour2',
          );
          this.updateAuditStatus(this.state.AuditID);
          this.refs.toast.show(strings.Save_Message, DURATION.LENGTH_LONG);
          setTimeout(() => {
            // //console.log('AuditDashBody Props After Props Changing...', this.props)
            this.props.storeNCRecords(dupNCrecords);
            //console.log(this.props.storeNCRecords,"store redux1");
            
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
    //console.log('on click save');
    //console.log('faliurecategory', this.state.FailureCategory);
    //console.log(this.state.clausedata, 'marcclause');
    //console.log('displayData--->', this.state.displayData);
    //console.log('res=ponse', this.state.selectedItemsResponse);
    console.log(
      this.state.selectedItemsProcess.length,
      'selecteditemprocess',
      this.state.selectedItemsProcess,
    );
    if (
      this.state.selectedItemsProcess.length === 0 &&
      this.state.RouteParam == 'NC'
    ) {
      this.setState({
        MarkProcess: true,
      });
    }
    if (
      this.state.clauseMandatory === 1 &&
      this.state.selectedItems.length === 0 &&
      this.state.RouteParam == 'NC'
    ) {
      this.setState({
        MarkClause: true,
      });
    }
    if (
      this.props.data.audits.smdata === 2 ||
      this.props.data.audits.smdata === 3
    ) {
      this.setState({
        documentRef: true,
        objEvidence: true,
        selectedItemsProcess: true,
      });
    }

    if (this.props.data.audits.smdata === 3) {
      this.setState({ displayData: true });
    }

    //console.log(this.state.MarkClausedrop, 'marsk');
    this.setState({ PageLoader: true, isSavebtn: true, isSaved: false }, () => {
      var NCrecords = this.props.data.audits.ncofiRecords;
      var dupNCrecords = [];
      //console.log('NCrecords****', NCrecords);
      //console.log(this.state.isLPA, 'checklpa');
      var BundleArr = null;
      //console.log(this.state.MarkClause, 'marcclause');
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
        if (
          this.state.categoryArr &&
          // this.state.NCresponsible &&
          this.state.selectedItemsResponse &&
          this.state.nonconfirmityText &&
          // this.state.objEvidence &&
          // this.state.documentRef &&
          this.state.displayData
        )
        //console.log(this.state.NCcategoryt,"catenter")
          //console.log('entering here to nc');
        {
          if (
            // this.state.selectedItems.length > 0 ||
            // this.state.selectedItems.length == 0 ||
            this.state.isLPA == true
          ) {
            //console.log('passes...', this.state.fileArrayList);
            const fileNames = this.state.fileArrayList.map(
              file => file.fileName,
            );
            //console.log('########fileNames', fileNames);
            const fileDatas = this.state.fileArrayList;
            console.log(
              'checkkkkkkkkkkkkkkkk----------ncccccc------------',
              this.state.fileArrayList,
            );
            //console.log('stateres', this.state.selectedItemsResponse);
            //console.log('########fileNames', fileDatas);
            //console.log("enter here as 1")
            BundleArr = {
              requiretext:
                this.state.displayData === ''
                  ? undefined
                  : this.state.displayData,
              // radioValue === 15 || 13 || 10  ? checklistName : this.state.nonconfirmityText
              NonConfirmity:
                this.state.nonconfirmityText === undefined
                  ? undefined
                  : this.state.nonconfirmityText,
              categoryDrop: this.state.categoryArr[0].id,
              ResponsibilityUser: this.state.selectedItemsResponse,
              requestDrop: this.state.requestDropdown[0].id,
              deptDrop: this.state.NCdept === undefined ? 0 : this.state.NCdept,
              failureDrop:
                this.state.NCFailure === undefined ? 0 : this.state.NCFailure,
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
              ncIdentifier:
                this.state.ncIdentifier === undefined
                  ? ''
                  : this.state.ncIdentifier,
              objEvidence:
                this.state.objEvidence === undefined
                  ? ''
                  : this.state.objEvidence,
              documentRef:
                this.state.documentRef === undefined
                  ? ''
                  : this.state.documentRef,
              recommAction:
                this.state.recommAction === undefined
                  ? ''
                  : this.state.recommAction,
              ProcessID:
                this.props?.route?.params?.NCOFIDetails?.ProcessID,
              Conformance:
                this.props?.route?.params?.NCOFIDetails?.Conformance,
            };
            //console.log('Information bundled', BundleArr);

            for (var i = 0; i < NCrecords.length; i++) {
              if (NCrecords[i].AuditID === this.state.AuditID) {
                var Information = [];
                if (NCrecords[i].Pending) {
                  //console.log('NCrecords[i].Pending', NCrecords[i].Pending);
                  for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                    if (
                      this.state.type == 'EDIT' &&
                      this.state.ncData.uniqueNCkey ==
                      NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey &&  NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey != undefined
                    ) {
                      console.log(
                        'ncuniqkeycheck#####',
                        this.state.ncData.uniqueNCkey,
                        NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                      );

                      NCrecords?.[i]?.Pending?.[j],
                        'helloonetwo',
                        Information.push(BundleArr);
                    } else {
                      console.log(
                        NCrecords?.[i]?.Pending?.[j].filename,
                        'helloonetwo222222',
                      );
                      console.log(
                        NCrecords?.[i]?.Pending?.[j],
                        'helloonetwo11111112',
                      );
//console.log("enter here as 2")
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
                        categoryDrop:
                          NCrecords?.[i]?.Pending?.[j]?.categoryDrop,
                        ResponsibilityUser:
                          NCrecords?.[i]?.Pending?.[j]?.ResponsibilityUser,
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
                        NonConfirmity:
                          NCrecords?.[i]?.Pending?.[j]?.NonConfirmity,
                        uniqueNCkey: NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                        selectedItems:
                          NCrecords?.[i]?.Pending?.[j]?.selectedItems,
                        selectedItemsProcess:
                          NCrecords?.[i]?.Pending?.[j]?.selectedItemsProcess,
                        ChecklistTemplateId:
                          NCrecords?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                        ncIdentifier:
                          NCrecords?.[i]?.Pending?.[j]?.ncIdentifier,
                        objEvidence: NCrecords?.[i]?.Pending?.[j]?.objEvidence,
                        documentRef: NCrecords?.[i]?.Pending?.[j]?.documentRef,
                        recommAction:
                          NCrecords?.[i]?.Pending?.[j]?.recommAction,
                      });
                    }
                  }
                }

                if (this.state.type == 'ADD' || this.state.isUploaded == true) {
                  //console.log('CHEKINGDETAILS------', BundleArr);
                  //console.log('CHEKINGDETAILS------2222222', Information);

                  Information.push(BundleArr);
                  //console.log('CHEKINGDETAILS------', Information);
                }

                dupNCrecords.push({
                  AuditID: NCrecords[i].AuditID,
                  Uploaded: NCrecords[i].Uploaded,
                  Pending: Information,
                });
              } else {
                console.log(
                  'CHEKINGDETAILS--PENDING----',
                  NCrecords[i].Pending,
                );

                dupNCrecords.push({
                  AuditID: NCrecords[i].AuditID,
                  Uploaded: NCrecords[i].Uploaded,
                  Pending: NCrecords[i].Pending,
                });
              }
            }

            //console.log('dupNCrecords', dupNCrecords);

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
                //console.log('Loader off');
                console.log(
                  this.state.selectedItemsProcess.length,
                  'hellothreefour1',
                );
                this.updateAuditStatus(this.state.AuditID);
                this.refs.toast.show(
                  strings.Save_Message,
                  DURATION.LENGTH_LONG,
                );
                setTimeout(() => {
                  // //console.log('AuditDashBody Props After Props Changing...', this.props)
                  this.props.storeNCRecords(dupNCrecords);
                  //console.log(this.props.storeNCRecords,"store redux 3");
                  
                  var cameraCapture = [];
                  this.props.storeCameraCapture(cameraCapture);
                  this.props.navigation.goBack();
                }, 300);
              },
            );
          } else {
            // //console.log('-->',this.state.NCcategoryt,this.state.NCresponsible,this.state.NCrequestby)

            this.setState(
              { isSaved: false, PageLoader: false, isSavebtn: false },
              () => {
                alert('Please Fill Mandatory Fields');

                if (this.state.NCrequestby === undefined) {
                  this.setState(
                    {
                      MarkReq: true,
                    },
                    () => {
                      // //console.log('this.state.MarkReq',this.state.MarkReq)
                      // this.refs.toast.show(strings.Responsibility,DURATION.LENGTH_LONG)
                    },
                  );
                } else {
                  this.setState(
                    {
                      MarkReq: false,
                    },
                    () => {
                      // //console.log('this.state.MarkReq',this.state.MarkReq)
                    },
                  );
                }
                if (this.state.NCresponsible === undefined) {
                  this.setState(
                    {
                      // MarkUser: true,
                    },
                    () => {
                      // //console.log('this.state.MarkUser',this.state.MarkUser)
                      // ---> this.refs.toast.show(strings.Requested,DURATION.LENGTH_LONG)
                    },
                  );
                } else {
                  this.setState(
                    {
                      MarkUser: false,
                    },
                    () => {
                      // //console.log('this.state.MarkUser',this.state.MarkUser)
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
                      // //console.log('this.state.MarkCat',this.state.MarkCat)
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
                  //console.log('ofiundefined');
                  this.setState({ underline1: true }, () => {
                    // --->  this.refs.toast.show(strings.OFIfill,DURATION.LENGTH_LONG)
                  });
                } else {
                  this.setState(
                    {
                      underline1: false,
                    },
                    () => {
                      // //console.log('this.state.underline1',this.state.underline1)
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
                      // //console.log('this.state.underline2',this.state.underline2)
                    },
                  );
                }
              },
            );
          }
        }
      }

      if (this.state.RouteParam === 'OFI') {
        //console.log('ofi--->');
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
        // //console.log('this.state.fileData',this.state.fileData)
        // //console.log('this.state.fileName',this.state.fileName)

        if (
          /* this.state.NCdept &&  */ this.state.NCcategoryt &&
          // this.state.NCresponsible &&
          // this.state.NCrequestby &&
          this.state.selectedItemsResponse &&
          this.state.selectedItems &&
          this.state.ofitext
        ) {
          //console.log('this.state.NCcategoryt', this.state.NCcategoryt);
          //console.log('this.state.NCrequestby', this.state.NCrequestby);
          //console.log('this.state.NCresponsible ', this.state.NCresponsible);
          //console.log('this.state.selectedItems', this.state.selectedItems);
          //console.log('this.state.ofitext', this.state.ofitext);
          //console.log('this.state.AuditOrder', this.state.AuditOrder);
          // if (this.state.selectedItems.length > 0) {
          //console.log('FileArrayPasses---------', this.state.fileArrayList);
          const fileNames = this.state.fileArrayList.map(file => file.fileName);
          //console.log('########fileNames', fileNames);
          console.log(
            'checkkkkkkkkkkkkkkkk----------ncofi------------',
            this.state.fileArrayList,
          );
          const fileDatas = this.state.fileArrayList; //.map(file => file.fileData);
          //console.log('########fileNames', fileDatas);

          BundleArr = {
            requiretext:
              this.state.displayData === ''
                ? undefined
                : this.state.displayData,
            OFI: this.state.ofitext === undefined ? '' : this.state.ofitext,
            categoryDrop: this.state.NCcategoryt,
            userDrop: this.state.NCrequestby,
            ResponsibilityUser: this.state.selectedItemsResponse,
            // requestDrop: this.state.NCresponsible,
            requestDrop: this.state.requestDropdown[0].id,
            deptDrop: this.state.NCdept === undefined ? 0 : this.state.NCdept,
            failureDrop:
              this.state.NCFailure === undefined ? 0 : this.state.NCFailure,

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
            NonConfirmity:
              this.state.nonconfirmityText === ''
                ? undefined
                : this.state.nonconfirmityText,
            documentRef:
              this.state.documentRef === ''
                ? undefined
                : this.state.documentRef,

            uniqueNCkey: Moment().unix(),
            selectedItems: this.state.selectedItems,
            selectedItemsProcess: this.state.selectedItemsProcess,
            ChecklistTemplateId: this.state.templateId,
            ncIdentifier:
              this.state.ncIdentifier === undefined
                ? ''
                : this.state.ncIdentifier,
            objEvidence:
              this.state.objEvidence === undefined
                ? ''
                : this.state.objEvidence,
            recommAction:
              this.state.recommAction === undefined
                ? ''
                : this.state.recommAction,
          };
          //console.log('Information bundled one', BundleArr);
          //console.log("enter here as 3")


          for (var i = 0; i < NCrecords.length; i++) {
            if (NCrecords[i].AuditID === this.state.AuditID) {
              var Information = [];
              if (NCrecords[i].Pending) {
                for (var j = 0; j < NCrecords[i].Pending.length; j++) {
                  if (
                    this.state.type == 'EDIT' &&
                    this.state.ncData.uniqueNCkey ==
                    NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey
                  ) {
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
                      ResponsibilityUser:
                        NCrecords?.[i]?.Pending?.[j]?.ResponsibilityUser,
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
                      NonConfirmity:
                        NCrecords?.[i]?.Pending?.[j]?.NonConfirmity,
                      documentRef: NCrecords?.[i]?.Pending?.[j]?.documentRef,
                      uniqueNCkey: NCrecords?.[i]?.Pending?.[j]?.uniqueNCkey,
                      selectedItems:
                        NCrecords?.[i]?.Pending?.[j]?.selectedItems,
                      selectedItemsProcess:
                        NCrecords?.[i]?.Pending?.[j]?.selectedItemsProcess,
                      ChecklistTemplateId:
                        NCrecords?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                      ncIdentifier: NCrecords?.[i]?.Pending?.[j]?.ncIdentifier,
                      objEvidence: NCrecords?.[i]?.Pending?.[j]?.objEvidence,
                      recommAction: NCrecords?.[i]?.Pending?.[j]?.recommAction,
                    });
                  }
                }
              }

              if (this.state.type == 'ADD' || this.state.isUploaded == true) {
                //console.log('helloconsle', BundleArr);
                //console.log("enter here as 4")

                Information.push(BundleArr);
              }

              dupNCrecords.push({
                AuditID: NCrecords[i].AuditID,
                Uploaded: NCrecords[i].Uploaded,
                Pending: Information,
              });
            } else {
              dupNCrecords.push({
                AuditID: NCrecords[i].AuditID,
                Uploaded: NCrecords[i].Uploaded,
                Pending: NCrecords[i].Pending,
              });
            }
          }

          //console.log('dupNCrecords', dupNCrecords);

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
              //console.log('Loader off');
              console.log(
                this.state.selectedItemsProcess.length,
                'hellothreefour1',
              );
              this.updateAuditStatus(this.state.AuditID);
              this.refs.toast.show(strings.Save_Message, DURATION.LENGTH_LONG);
              setTimeout(() => {
                // //console.log('AuditDashBody Props After Props Changing...', this.props)
                this.props.storeNCRecords(dupNCrecords);
                //console.log(this.props.storeNCRecords,"store redux 2");
                
                var cameraCapture = [];
                this.props.storeCameraCapture(cameraCapture);
                this.props.navigation.goBack();
              }, 300);
            },
          );
        } else {
          // //console.log('-->',this.state.NCcategoryt,this.state.NCresponsible,this.state.NCrequestby)

          this.setState(
            { isSaved: false, PageLoader: false, isSavebtn: false },
            () => {
              alert('Please Fill Mandatory Fields');

              if (this.state.NCrequestby === undefined) {
                this.setState(
                  {
                    MarkReq: true,
                  },
                  () => {
                    // //console.log('this.state.MarkReq',this.state.MarkReq)
                    // this.refs.toast.show(strings.Responsibility,DURATION.LENGTH_LONG)
                  },
                );
              } else {
                this.setState(
                  {
                    MarkReq: false,
                  },
                  () => {
                    // //console.log('this.state.MarkReq',this.state.MarkReq)
                  },
                );
              }
              if (this.state.NCresponsible === undefined) {
                this.setState(
                  {
                    // MarkUser: true,
                  },
                  () => {
                    // //console.log('this.state.MarkUser',this.state.MarkUser)
                    // ---> this.refs.toast.show(strings.Requested,DURATION.LENGTH_LONG)
                  },
                );
              } else {
                this.setState(
                  {
                    MarkUser: false,
                  },
                  () => {
                    // //console.log('this.state.MarkUser',this.state.MarkUser)
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
                    // //console.log('this.state.MarkCat',this.state.MarkCat)
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
                //console.log('ofiundefined');
                this.setState({ underline1: true }, () => {
                  // --->  this.refs.toast.show(strings.OFIfill,DURATION.LENGTH_LONG)
                });
              } else {
                this.setState(
                  {
                    underline1: false,
                  },
                  () => {
                    // //console.log('this.state.underline1',this.state.underline1)
                  },
                );
              }
              if (this.state.displayData === undefined) {
              } else {
                this.setState(
                  {
                    underline2: false,
                  },
                  () => { },
                );
              }
            },
          );
        }
      }
      // })
    });
  }

  goBack() {
    Voice.removeAllListeners();
    this.InitVoice();
    this.props.navigation.goBack();
  }

  attachFiles() {
    this.setState({ AttachModal: false }, () => {
      setTimeout(() => {
        //console.log('attach pressed');
        this.openFileSystem();
      }, 500);
    });
  }
  attachFilesonly() {
    this.setState({ AttachModal: false }, () => {
      setTimeout(() => {
        //console.log('attach pressed');
        this.openFileSystemFiles();
      }, 500);
    });
  }

  checkFileAlreadyExist = (AttachmentList, response) => {
    for (var i = 0; i < AttachmentList.length; i++) {
      //console.log('one:third');
      //console.log('one:thirdentering', AttachmentList);
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
      //console.log('File picked:', res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //console.log('User cancelled file picker');
      } else {
        //console.log('DocumentPicker Error:', err);
      }
    }
  };
  handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.xls],
      });
      //console.log('File picked:', res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //console.log('User cancelled file picker');
      } else {
        //console.log('DocumentPicker Error:', err);
      }
    }
  };

  renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          margin: 2,
          borderColor: '#2a4944',
          borderWidth: 1,
          height: '90%',
        }}>
        {this.state.missingfile ? (
          <Text
            numberOfLines={1}
            style={{
              left: 10,
              color: 'red',
              fontFamily: 'OpenSans-Regular',
            }}>
            {this.state.missingfile}
          </Text>
        ) : (
          <View style={{ flexDirection: 'column' }}>
            <View>
              {item.fileData !== '' &&
                item.fileData !== undefined &&
                item.fileData !== null ? (
                <TouchableOpacity
                  onPress={this.openAttachmentFile.bind(this, item.fileData)}>
                  {this.getFileIcon(item.fileName, item.fileData)}
                </TouchableOpacity>
              ) : null}
            </View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'OpenSans-Regular',
                alignSelf: 'center',
              }}>
              {item.fileName}
            </Text>
          </View>
        )}
        {item.fileName ? (
          <TouchableOpacity
            onPress={() => this.deleteAttachments(item.id)}
            style={{
              width: '10%',
              right: 10,
              top: 10,
              position: 'absolute',
            }}>
            <Icon name="trash" size={20} color={'red'} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  getFileIcon2 = filename => {
    //console.log('getfileicon2====', filename);
    const format = getFileFormat(filename);
    const iconName = formatToIconMapping[format] || 'file-o';
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', iconName);
    return iconName;
  };

  renderEdiitItem = ({ item }) => {
    //console.log('FILETYPE:----------123', item.fileName);
    //console.log('FILETYPE:----------123', item);

    const filepath = 'file:/' + item.fileData;

    const format = item.filetype;

    return (
      <View>
        <TouchableOpacity
          onPress={this.openAttachmentFile.bind(this, filepath)}>
          {this.getFileIcon(item.fileName, item.fileData)}
        </TouchableOpacity>
      </View>
    );
  };
  openFileSystem = async () => {
    let newFilePath =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      //console.log(response, 'filedataresponse');
      var filename = response.name.trim();
      var newfileName =
        'file_' +
        Moment().unix() +
        '.' +
        filename.substring(filename.lastIndexOf('.') + 1);
      newFilePath = newFilePath + '/' + newfileName; // + response.name.replace(/ /g,'_')

      if (response) {
        if (
          this.checkFileAlreadyExist(this.state.fileArrayList, response) ===
          true
        ) {
          alert('File already Exist, Kindly add a different file');
          return;
        }

        var fileuri =
          Platform.OS == 'ios'
            ? decodeURIComponent(response.uri.slice(6))
            : response.uri;
        //console.log('fileuri', fileuri);

        //const fileuri = decodeURIComponent(fileuri);
        //console.log(fileuri, 'decoded path');
        filename = filename.replace(/ /g, '_');

        if (response.size > 5000000) {
          alert(strings.alert);
        } else if (response.size < 1910485760456) {
          //console.log('helloenter', response.size);
          ////console.log('helll no', response.size);

          var data = await RNFS.readFile(fileuri, 'base64')
            .then(res => {
              //console.log('1:first');
              RNFetchBlob.fs.writeFile(newFilePath, res, 'base64').then(res => {
                //console.log('1:second');
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
                //console.log(FileArrayTemp, 'filearraytemp');
                var fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                this.setState(
                  {
                    fileArrayList: fileMergeResult,
                  },

                  () => {
                    console.log(
                      response,
                      'filedatabase',
                      this.state.fileArrayList,
                    );
                  },
                );
              });
            })
            .catch(err => {
              //console.log(err, 'Err in file catch');
            });
        }
      }
    } catch (err) {
      //console.log(err);
      if (DocumentPicker.isCancel(err)) return;
    }
  };
  openFileSystemFiles = async () => {
    let newFilePath =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      //console.log(response, 'filedataresponse');
      var filename = response.name.trim();
      var newfileName =
        'file_' +
        Moment().unix() +
        '.' +
        filename.substring(filename.lastIndexOf('.') + 1);
      newFilePath = newFilePath + '/' + newfileName; // + response.name.replace(/ /g,'_')

      if (response) {
        if (
          this.checkFileAlreadyExist(this.state.fileArrayList, response) ===
          true
        ) {
          alert('File already Exist, Kindly add a different file');
          return;
        }
        var fileuri =
          Platform.OS == 'ios'
            ? decodeURIComponent(response.uri.slice(6))
            : response.uri;
        //console.log('fileuri', fileuri);
        //console.log(fileuri, 'decoded path');
        filename = filename.replace(/ /g, '_');

        if (response.size > 5000000) {
          alert(strings.alert);
        } else if (response.size < 1910485760456) {
          //console.log('helloenter', response.size);
          var data = await RNFS.readFile(fileuri, 'base64')
            .then(res => {
              //console.log('1:first');
              RNFetchBlob.fs.writeFile(newFilePath, res, 'base64').then(res => {
                //console.log('1:second');
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
                //console.log(FileArrayTemp, 'filearraytemp');
                var fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                this.setState(
                  {
                    fileArrayList: fileMergeResult,
                  },

                  () => {
                    console.log(
                      response,
                      'filedatabase',
                      this.state.fileArrayList,
                    );
                  },
                );
              });
            })
            .catch(err => {
              //console.log(err, 'Err in file catch');
            });
        }
      }
    } catch (err) {
      //console.log(err);
      if (DocumentPicker.isCancel(err)) return;
    }
  };

  deleteAttachments(value) {
    //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX', value);
    console.log(
      'XXXXXXXXXXXXXXXXXXXXXXXXXXX this.state.fileArrayList',
      this.state.fileArrayList,
    );

    const dummyArray = this.state.fileArrayList.filter(
      item => item.id !== value,
    );
    //console.log('dummyArray-----', dummyArray);
    this.setState(
      {
        fileName: '',
        fileData: '',
        fileSize: '',
        fileArrayList: dummyArray,
      },
      () => {
        //console.log('fileName ', this.state.fileName);
        //console.log('fileData ', this.state.fileData);
        //console.log('fileSize ', this.state.fileSize);
        //console.log('fileArrayList----xxxxx--', this.state.fileArrayList);

        var cameraCapture = [];
        this.props.storeCameraCapture(cameraCapture);
      },
    );
  }

  saveData = () => {
    const { checklistName } = this.state;
    //console.log('Saving data:', checklistName);
    if (this.props.onSave) {
      this.props.onSave(checklistName);
    }
  };
  handleInputChange = text => {
    // Update state with new TextInput value
    this.setState({ nonconfirmityText: text });
  };

  render() {
    // const { checklistName } = this.state;
    //console.log(this.state.radioValue, 'vlrad');
    //console.log(this.state.NCcategoryt,this.state.categoryArr, 'categoryt');
    //console.log(this.props.data, 'rrvalue');
    const routes = this.props.navigation.getState().routes;
    console.log(
      // this.props.data.nav.routes.find(
      routes.find(
        route => route.routeName === ROUTES.CREATE_NCLPA,
      )?.params?.checklistName,
      'tonclpa',
    );
    // //console.log(this.props.data.nav.routes.find(route => route.routeName === "CreatencLPA"), "demotolpa");
    // const radioValue = this.props.data.nav.routes.find(
    const radioValue = routes.find(
      route => route.routeName === ROUTES.CREATE_NCLPA,
    )?.params?.radiovalue;

    //console.log(radioValue, 'radiofromdemo'); // Output: 15
    // const checklistName = this.props?.route?.name?.find(
    const checklistName = routes.find(
      route => route.routeName === ROUTES.CREATE_NCLPA,
    )?.params?.checklistName;

    const multiprocess =
      this.props?.route?.params?.NCOFIDetails?.multiprocess;
    //console.log(this.state.processdata, 'processautoone');
    //console.log('userdetailsdropdown', this.state.requestDropdown);
    console.log(
      '----------------smdata----------------',
      this.props.data.audits.smdata,
    );
    console.log(
      'CreateNC auditRecord===>',
      this.props.data.audits.auditRecords[0].AuditProcessList,
      this.props.data.audits.smdata,
    );
    const myIcon = <Icon name="angle-down" size={20} color="grey" />;
    //console.log('===>conformance/data', this.state.processdata);
    const suggestions = this.state.results;
    const category = this.state.categoryArr;
    const department = this.state.departArr;
    const request = this.state.UserArr;
    const user = this.state.RequestArr;
    const FailureCategory = this.state.FailureCategory;
    //console.log('ncDATRA', this.state.ncData);
    //console.log('ofidata', this.props.navigation);
    const array = this.state.FailureCategory?.map(obj => ({
      label: obj?.FailureCategoryName,

      value: obj?.FailureCategoryId,
    }));
    //console.log('Failcat', array);
    //console.log(this.state.clausedata, 'marcclause');
    const items = [
      {
        name: strings.ClausesL,
        id: 0,
        children: this.state.clausedata,
      },
    ];
    //console.log('UserArr002', this.state.UserArr);




    const itemsResponse = [
      {
        name: strings.ResponsibilityL,
        id: 0,
        children: this.state.UserArr

      },
    ];
    //console.log(itemsResponse[0].children, "selectedValue");
    //console.log(itemsResponse[0].children.filter((child) => child.selection === "True")
    //  .map((child) => child.value), "selectedValue1")

    // const responsibiltyField = itemsResponse[0].children.filter((child) => child.selection === "True")
    // .map((child) => child.value)


    const itemsProcess = [
      {
        name: strings.ProcessL,
        id: 0,
        children: this.state.processdata,
      },
    ];
    //console.log(itemsProcess, 'items==>');
    //console.log('this.state.processdata', this.state.processdata);
    console.log(
      'param.auditDetailsList',
      this.props?.route?.params?.auditDetailsList,
    );

    const radio_values = [
      { label: strings.no, value: 1 },
      { label: strings.yes, value: 0 },
    ];
    const { editnclpa, nonconfirmityText } = this.state;

    return (
      <View style={styles.wrapper}>
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              {this.state.PageLoader === false ? (
                <Text style={styles.headingText}>
                  {this.state.RouteParam === 'NC'
                    ? this.state.type == 'ADD'
                      ? strings.Upload + ' ' + 'NC'
                      : strings.Edit + ' ' + 'NC'
                    : this.state.type == 'ADD'
                      ? strings.Upload + ' ' + 'OFI'
                      : strings.Edit + ' ' + 'OFI'}
                </Text>
              ) : null}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  color: 'white',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {this.state.breadCrumbText}
              </Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() =>
                  this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {this.state.PageLoader === false ? (
          <KeyboardAwareScrollView extraHeight={125}>
            <View style={styles.auditPageBody}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 50 }}>
                  <View style={styles.div1}>
                    {this.state.RouteParam === 'NC' ? (
                      <View style={styles.input02}>
                        {this.state.nonconfirmityText ? (
                          <Text
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: Fonts.size.small,
                              color: '#A6A6A6',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.Non_confirmityL}
                          </Text>
                        ) : null}

                        <TextInput
                          ref="ncTxtField"
                          value={this.state.nonconfirmityText} // Controlled component
                          multiline={true}
                          autoCapitalize="sentences"
                          style={
                            this.state.nonconfirmityText
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Non_confirmityL}
                          placeholderTextColor={
                            this.state.underline1 === true ? 'red' : '#A9A9A9'
                          }
                          baseColor={
                            this.state.underline1 === false ? '#A6A6A6' : 'red'
                          }
                          textColor="#747474"
                          onChangeText={text =>
                            this.setState({ nonconfirmityText: text })
                          }

                        // onChangeText={this.handleInputChange()}
                        />
                      </View>
                    ) : (
                      <View style={styles.input02}>
                        <View style={styles.check}>
                          <Icon
                            style={{ left: 10, display: 'none' }}
                            name="asterisk"
                            size={8}
                            color="red"
                          />
                        </View>
                        {this.state.ofitext ? (
                          <Text
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: Fonts.size.small,
                              color: '#A6A6A6',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.Opportunity_ApproachL}
                          </Text>
                        ) : null}
                        <TextInput
                          ref="ofiTxtField"
                          multiline={true}
                          value={
                            this.state.ofitext
                          }
                          style={
                            this.state.ofitext
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Opportunity_ApproachL}
                          placeholderTextColor={
                            this.state.underline1 === true ? 'red' : '#A9A9A9'
                          }
                          baseColor={
                            this.state.underline1 === false ? '#A6A6A6' : 'red'
                          }
                          textColor="#747474"
                          onChangeText={text => {
                            this.setState(
                              {
                                ofitext:
                                  text +
                                  this.props.data.audits.auditRecords[0]
                                    .CheckListPropData[5].ChecklistName,
                              },
                              () => {
                                this.isCheck3 = true;
                              },
                            );
                          }}
                        />
                      </View>
                    )}
                    <View style={styles.check}>
                      <Icon
                        style={{ left: 6, top: 5 }}
                        name="asterisk"
                        size={8}
                        color="red"
                      />
                    </View>
                  </View>
                  <View style={styles.div1}>
                    {this.state.RouteParam === 'NC' ? (
                      <View style={styles.input02}>

                        <Text
                          style={{
                            padding: 0,
                            margin: 0,
                            fontSize: Fonts.size.small,
                            color: '#A6A6A6',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {strings.Objective_Evidence}
                        </Text>
                        {/* ) : null} */}
                        <TextInput
                          ref="objEviTxtField"
                          value={radioValue === 15 ? "N/A" : this.state.objEvidence}
                          multiline={true}
                          autoCapitalize="sentences"
                          style={
                            this.state.objEvidence
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Objective_Evidence}
                          placeholderTextColor={
                            this.state.underline1 === true ? 'red' : '#A9A9A9'
                          }
                          baseColor={
                            this.state.underline1 === false ? '#A6A6A6' : 'red'
                          }
                          textColor="#747474"
                          onChangeText={text => {
                            this.setState({ objEvidence: text }, () => {
                              this.isCheck5 = true;
                            });
                          }}
                        />
                      </View>
                    ) : (
                      <View style={styles.input02}>
                        <View style={styles.check}>
                          <Icon
                            style={{ left: 10, display: 'none' }}
                            name="asterisk"
                            size={8}
                            color="red"
                          />
                        </View>
                        {this.state.objEvidence ? (
                          <Text
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: Fonts.size.small,
                              color: '#A6A6A6',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.Objective_Evidence}
                          </Text>
                        ) : null}
                        <TextInput
                          ref="objEviTxtField"
                          multiline={true}
                          value={this.state.objEvidence}
                          style={
                            this.state.objEvidence
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Objective_Evidence}
                          placeholderTextColor={
                            this.state.underline1 === true ? 'red' : '#A9A9A9'
                          }
                          baseColor={
                            this.state.underline1 === false ? '#A6A6A6' : 'red'
                          }
                          textColor="#747474"
                          onChangeText={text => {
                            this.setState({ objEvidence: text }, () => { });
                          }}
                        />
                      </View>
                    )}

                    <View style={styles.check}>
                      {this.props.data.audits.smdata !== 2 &&
                        this.props.data.audits.smdata !== 3 ? (
                        <Icon
                          style={{ left: 6, top: 5 }}
                          name="asterisk"
                          size={8}
                          color="red"
                        />
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.input02}>
                    <Text
                      style={{
                        color:
                          this.state.clauseMandatory === 1 &&
                            this.state.RouteParam === 'NC' &&
                            this.state.MarkClause == false
                            ? '#A6A6A6'
                            : '#000000',
                      }}>
                      {strings.ClausesL}
                    </Text>
                  </View>
                  <View style={styles.div2}>
                    <View style={styles.inputhigh}>
                      <View>
                        <SectionedMultiSelect
                          IconRenderer={this.icon}
                          ref={clauseListField =>
                            (this.clauseListField = clauseListField)
                          }
                          items={items}
                          uniqueKey="id"
                          subKey="children"
                          single
                          selectText={strings.SelectClauses}
                          baseColor={
                            this.state.MarkClause == false ? '#A6A6A6' : 'red'
                          }
                          textColor={
                            this.state.MarkClause == false ? '#A6A6A6' : 'red'
                          }
                          showDropDowns={true}
                          readOnlyHeadings={true}
                          onSelectedItemsChange={this.onSelectedItemsChange}
                          selectedItems={this.state.selectedItems}
                          expandDropDowns={true}
                          // alwaysShowSelectText={true}
                          placeholderTextColor="#A6A6A6"
                          itemNumberOfLines={3}
                          selectLabelNumberOfLines={3}
                          styles={{
                            chipText: {
                              maxWidth: Dimensions.get('screen').width - 90,
                            },
                          }}
                          colors={{
                            text: '#A6A6A6',
                            subText: '#A6A6A6',
                            selectToggleTextColor:
                              this.state.MarkClause == false
                                ? '#A6A6A6'
                                : 'red',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={
                        this.state.isLPA ? { display: 'none' } : styles.check
                      }>
                      {this.props.data.audits.smdata !== 3 &&
                        this.state.RouteParam !== 'OFI' &&
                        this.state.clauseMandatory === 1 ? (
                        <Icon
                          style={{ left: 10 }}
                          name="asterisk"
                          size={8}
                          color="red"
                        />
                      ) : null}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignContent: 'space-between',
                    }}>
                    <Text>{''}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ NCtxtFlag: false, isVisible: true })
                      }>
                      <Icon name={'eye'} size={20} style={{ marginRight: 35 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.div01}>
                    <View
                      style={[styles.input002]}
                      onPress={() => this.setState({ isVisible: true })}>
                      {this.state.displayData ? (
                        <Text
                          style={{
                            padding: 0,
                            margin: 0,
                            color: '#A6A6A6',
                            width: '80%',
                            fontSize: Fonts.size.regular,
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {strings.StandardRequirementsL}
                        </Text>
                      ) : null}
                      <View style={{ flexDirection: 'row' }}>
                        <TextInput
                          multiline={true}
                          placeholder={strings.StandardRequirementsL}
                          placeholderTextColor={
                            this.state.underline2 == true ? 'red' : '#A6A6A6'
                          }
                          textColor="#747474"
                          numberOfLines={1}
                          value={
                            this.state.displayData
                              ? this.state.displayData.length > 40
                                ? this.state.displayData.substring(0, 40) +
                                '...'
                                : this.state.displayData
                              : ''
                          }
                          editable={false}
                          onFocus={() => this.setState({ isVisible: true })}
                        />
                      </View>
                    </View>
                    <View
                      style={
                        this.state.RouteParam == 'OFI' || this.state.isLPA
                          ? { display: 'none' }
                          : styles.check
                      }></View>
                  </View>
                  <View style={styles.div1}>
                    <View style={styles.input03}>
                      {this.state.isContainValue1 === true ? (
                        <Dropdown
                          ref="categoryTxtField"
                          value={
                            this.state.NCcategoryt && this.state.NCcategoryt.value
                              ? this.state.NCcategoryt.value
                              : this.state.categoryArr &&
                                this.state.categoryArr.length >= 1
                              ? this.state.categoryArr[0].value
                              : ''
                          }
                          baseColor={
                            this.state.MarkCat === false ? '#A6A6A6' : 'red'
                          }
                          selectedItemColor="black"
                          textColor="black"
                          itemColor="black"
                          //
                          data={category}
                          label={
                            this.state.RouteParam === 'NC'
                              ? 'NC' + ' ' + strings.CategoryL
                              : 'OFI' + ' ' + strings.CategoryL
                          }
                          fontSize={Fonts.size.regular}
                          labelFontSize={Fonts.size.small}
                          itemPadding={5}
                          dropdownOffset={{ top: 10, left: 0 }}
                          itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                          onChangeText={value => {
                            //console.log('*****', value);
                            var CategoryID = null;
                            for (
                              var i = 0;
                              i < this.state.categoryArr.length;
                              i++
                            ) {
                              if (value === this.state.categoryArr[i].value) {
                                CategoryID = this.state.categoryArr[i];
                              }
                            }
                            if (CategoryID == null) {
                              this.isCheckCategory = false;
                            } else if (CategoryID) {
                              this.isCheckCategory = true;
                              this.setState(
                                { NCcategoryt: CategoryID },
                                () => { },
                              );
                            }
                          }}
                        />
                      ) : (
                        <Dropdown
                          ref="categoryTxtField"
                          label={
                            this.state.RouteParam === 'NC'
                              ? 'NC' + ' ' + strings.CategoryL
                              : 'OFI' + ' ' + strings.CategoryL
                          }
                          baseColor={
                            this.state.MarkCat === false ? '#A6A6A6' : 'red'
                          }
                          selectedItemColor="black"
                          textColor="black"
                          itemColor="black"
                          fontSize={Fonts.size.regular}
                          labelFontSize={Fonts.size.small}
                          itemPadding={5}
                          dropdownOffset={{ top: 10, left: 0 }}
                          itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                        />
                      )}
                    </View>
                    <View style={styles.check}>
                      <Icon
                        style={{ left: 5 }}
                        name="asterisk"
                        size={8}
                        color="red"
                      />
                    </View>
                  </View>
                  <View style={styles.div1}>
                    <View style={styles.input04}>
                      {this.state.isContainValue3 === true ? (
                        <Dropdown
                          ref="requestTxtField"
                          value={
                            this.state.requestDropdown &&
                              this.state.requestDropdown.length >= 1
                              ? this.state.requestDropdown[0].value
                              : ''
                          }
                          label={strings.RequestedL}
                          data={user}
                          baseColor={
                            this.state.MarkUser === false ? '#A6A6A6' : 'red'
                          }
                          selectedItemColor="black"
                          textColor="black"
                          itemColor="black"
                          fontSize={Fonts.size.regular}
                          labelFontSize={Fonts.size.small}
                          itemPadding={5}
                          dropdownOffset={{ top: 10, left: 0 }}
                          itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                          onChangeText={value => {
                            var UserID = null;
                            for (
                              var i = 0;
                              i < this.state.UserArr.length;
                              i++
                            ) {
                              if (value === this.state.UserArr[i].value) {
                                UserID = this.state.UserArr[i];
                              }
                            }

                            for (
                              var i = 0;
                              i < this.state.RequestArr.length;
                              i++
                            ) {
                              if (value === this.state.RequestArr[i].value) {
                                UserID = this.state.RequestArr[i];
                              }
                            }

                            if (UserID == null) {
                              this.isCheckUser = false;
                            } else if (UserID) {
                              this.setState({ NCresponsible: UserID }, () => {
                                console.log(
                                  'ncc---->',
                                  this.state.NCresponsible,
                                );
                                this.isCheckUser = true;
                              });
                            }
                          }}
                        />
                      ) : (
                        <Dropdown
                          label={strings.RequestedL}
                          baseColor={
                            this.state.MarkUser === false ? '#A6A6A6' : 'red'
                          }
                          selectedItemColor="black"
                          textColor="black"
                          itemColor="black"
                          fontSize={Fonts.size.regular}
                          labelFontSize={Fonts.size.small}
                          itemPadding={5}
                          dropdownOffset={{ top: 10, left: 0 }}
                          itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                        />
                      )}
                    </View>
                    <View style={styles.check}>
                      <Icon
                        style={{ left: 5 }}
                        name="asterisk"
                        size={8}
                        color="red"
                      />
                    </View>
                  </View>
                  <View style={styles.div1}>
                    <View style={styles.input07}>
                      {this.state.isContainValue4 === true ? (
                        <View style={{ position: 'relative' }}>
                          {this.state.NCFailure && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  NCFailure: undefined,
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: -10,
                                right: 35,
                                height: 20,
                                width: 20,
                                zIndex: 9,
                                borderColor: '#A6A6A6',
                              }}>
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  top: 18,
                                }}>
                                <Icon
                                  name="times-circle"
                                  size={20}
                                  color="black"
                                />
                              </View>
                            </TouchableOpacity>
                          )}

                          <Dropdown
                            ref="departmentTxtField"
                            value={
                              this.state.NCFailure
                                ? this.state.NCFailure.value
                                : ''
                            }
                            label={strings.FailureCategory}
                            data={array}
                            fontSize={Fonts.size.regular}
                            labelFontSize={Fonts.size.small}
                            baseColor={'#A6A6A6'}
                            selectedItemColor="black"
                            textColor="black"
                            itemColor="black"
                            itemPadding={5}
                            dropdownOffset={{ top: 10, left: 0 }}
                            itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                            onChangeText={value => {
                              var FailureID = null;
                              for (var i = 0; i < array.length; i++) {
                                console.log(
                                  'faliurecategoryone',
                                  this.state.FailureCategory[i],
                                  value,
                                );
                                if (value === array[i].value) {
                                  FailureID = array[i];
                                }
                              }
                              if (FailureID == null) {
                                this.isCheckFailure = false;
                              } else if (FailureID) {
                                this.isCheckFailure = false;
                                this.setState({ NCFailure: FailureID }, () => {
                                  this.isCheckFailure = true;
                                });
                              }
                            }}
                          />
                        </View>
                      ) : (
                        <View>
                          <Dropdown
                            label={strings.FailureCategory}
                            value={
                              this.state.NCFailure
                                ? this.state.NCFailure.value
                                : ''
                            }
                            fontSize={Fonts.size.regular}
                            data={FailureCategory}
                            labelFontSize={Fonts.size.small}
                            baseColor={
                              this.state.MarkFailure === false
                                ? '#A6A6A6'
                                : 'red'
                            }
                            selectedItemColor="black"
                            textColor="black"
                            itemColor="black"
                            itemPadding={5}
                            dropdownOffset={{ top: 10, left: 0 }}
                            itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                            onChangeText={value => {
                              var FailureID = null;
                              for (
                                var i = 0;
                                i < this.state.FailureCategory.length;
                                i++
                              ) {
                                console.log(
                                  'faliurecategoryone',
                                  this.state.FailureCategory[i].value,
                                  value,
                                );
                                if (value === FailureCategory[i].value) {
                                  FailureID = FailureCategory[i];
                                }
                              }
                              if (FailureID == null) {
                                this.isCheckFailure = false;
                              } else if (FailureID) {
                                this.isCheckFailure = false;
                                this.setState({ NCFailure: FailureID }, () => {
                                  this.isCheckFailure = true;
                                });
                              }
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.div2}>
                    <View style={styles.inputhigh}>
                      <View>
                        <Text style={{ marginLeft: 5 }}>{'Responsiblity'}</Text>
                        <SectionedMultiSelect
                          IconRenderer={this.icon}
                          items={itemsResponse}
                          uniqueKey="id"
                          subKey="children"
                          displayKey="value"
                          showDropDowns={true}
                          readOnlyHeadings={true}
                          onSelectedItemsChange={(selectedItems) => {
                            const { UserArr } = this.state;
                            const updatedUserArr = UserArr.map((user) => ({
                              ...user,
                              selection: selectedItems.includes(user.id) ? selectedItems.includes(user.id) : "False",
                            }));

                            // Update the state when items are selected
                            this.setState({ selectedItemsResponse: selectedItems,
                              UserArr: updatedUserArr,

                             }, () => {
                              //console.log('Updated selectedItemsResponse:', this.state.selectedItemsResponse);
                            });
                          }}
                          selectedItems={this.state.selectedItemsResponse}
                        
                          expandDropDowns={true}
                          single={true}
                          styles={{
                            selectedItem: {
                              backgroundColor: '#f0f8ff',
                              padding: 5,
                            },
                            chipText: {
                              maxWidth: '80%',
                            },
                          }}
                        />
                      </View>
                      <View style={styles.check}>
                        <Icon
                          style={{ left: 5 }}
                          name="asterisk"
                          size={8}
                          color="red"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.div2}>
                    <View style={styles.inputhigh}>
                      <View>
                        {this.state.selectedItemsProcess ? (
                          <SectionedMultiSelect //single={multiprocess == "1" ? true : false}
                            IconRenderer={this.icon}
                            ref={processListField =>
                              (this.processListField = processListField)
                            }
                            items={itemsProcess}
                            uniqueKey="id"
                            subKey="children"
                            selectText={
                              this.state.processdata.length > 0
                                ? strings.ProcessL
                                : 'No process(s) found'
                            }
                            //alwaysShowSelectText={multiprocess == "1" ? false : true}
                            renderSelectText={() => strings.ProcessL}
                            baseColor={
                              this.state.MarkProcess == false
                                ? '#A6A6A6'
                                : 'red'
                            }
                            textColor={
                              this.state.MarkProcess == false
                                ? '#A6A6A6'
                                : 'red'
                            }
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            selectedIconComponent={
                              <Icon
                                name="check"
                                size={18}
                                style={{
                                  color: '#4caf50',
                                  paddingLeft: 10,
                                }}
                              />
                            }
                            onSelectedItemsChange={
                              this.onSelectedItemsProcessChange
                            }
                            selectedItems={this.state.selectedItemsProcess}
                            expandDropDowns={true}
                            //  alwaysShowSelectText={true}
                            placeholderTextColor="#A6A6A6"
                            itemNumberOfLines={3}
                            selectLabelNumberOfLines={3}
                            styles={{
                              chipText: {
                                maxWidth: Dimensions.get('screen').width - 90,
                              },
                            }}
                            colors={{
                              text: '#A6A6A6',
                              subText: '#A6A6A6',
                              selectToggleTextColor:
                                this.state.MarkProcess == false
                                  ? '#A6A6A6'
                                  : '#A6A6A6',
                            }}
                          />
                        ) : null}

                        <View
                          style={
                            this.state.RouteParam == 'OFI' || this.state.isLPA
                              ? { display: 'none' }
                              : styles.check
                          }>
                          {this.props.data.audits.smdata !== 2 &&
                            this.props.data.audits.smdata !== 3 ? (
                            <Icon
                              style={{ right: 10 }}
                              name="asterisk"
                              size={8}
                              color="red"
                            />
                          ) : null}
                        </View>
                        <View
                          style={{ paddingLeft: 10, flexDirection: 'column' }}>
                          <Text
                            ref="dummyFocus"
                            style={{
                              paddingBottom: 5,
                              margin: 0,
                              marginTop: 20,
                              fontSize: Fonts.size.medium,
                              color: '#A6A6A6',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.ProcessAll}
                          </Text>
                          <RadioForm
                            ref={processRadioField =>
                              (this.processRadioField = processRadioField)
                            }
                            radio_props={radio_values}
                            initial={0}
                            onPress={(value, index) => {
                              //console.log(index, 'valueindex');
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
                      <Dropdown
                        label={strings.Auditee_Approach}
                        fontSize={Fonts.size.regular}
                        labelFontSize={Fonts.size.small}
                        baseColor={'#A6A6A6'}
                        selectedItemColor="black"
                        textColor="black"
                        itemColor="black"
                        itemPadding={5}
                        dropdownOffset={{ top: 10, left: 0 }}
                        itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                      />
                    </View>
                  </View>
                  <View style={styles.div1}>
                    {this.state.RouteParam === 'NC' ? (
                      <View style={styles.input02}>
                        {/* {this.state.documentRef &&
                        this.props.data.audits.smdata != 2 &&
                        this.props.data.audits.smdata != 3 ? ( */}
                        <Text
                          style={{
                            padding: 0,
                            margin: 0,
                            fontSize: Fonts.size.small,
                            color: '#A6A6A6',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {strings.Document_reference}
                        </Text>
                        {/* ) : null} */}

                        <TextInput
                          ref="docRefTxtField"
                          value={radioValue === 15 ? "N/A" : this.state.documentRef}
                          multiline={true}
                          autoCapitalize="sentences"
                          // onBlur={() => Keyboard.dismiss()}
                          style={
                            this.state.documentRef && radioValue
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Document_reference}
                          placeholderTextColor={
                            this.state.underline1 === true ? 'red' : '#A9A9A9'
                          }
                          baseColor={
                            this.state.underline1 === false ? '#A6A6A6' : 'red'
                          }
                          textColor="#747474"
                          // underlineColorAndroid={this.state.underline1 === true ? 'red': '#A9A9A9'}
                          onChangeText={text => {
                            this.setState({ documentRef: text }, () => {
                              // //console.log('---->',this.state.nonconfirmityText)
                              this.isCheck5 = true;
                            });
                          }}
                        />
                      </View>
                    ) : (
                      <View style={styles.input02}>
                        <View style={styles.check}>
                          {this.props.data.audits.smdata != 2 &&
                            this.props.data.audits.smdata != 3 ? (
                            <Icon
                              style={{ left: 10, display: 'none' }}
                              name="asterisk"
                              size={8}
                              color="red"
                            />
                          ) : null}
                        </View>

                        {this.state.documentRef ? (
                          <Text
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: Fonts.size.small,
                              color: '#A6A6A6',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.Document_reference}
                          </Text>
                        ) : null}
                        <TextInput
                          ref="docRefTxtField"
                          multiline={true}
                          value={this.state.documentRef}
                          style={
                            this.state.documentRef
                              ? styles.placeholderT1Label
                              : styles.placeholderT1
                          }
                          placeholder={strings.Document_reference}
                          placeholderTextColor={'#A9A9A9'}
                          textColor="#747474"
                          // underlineColorAndroid={this.state.underline1 === true ? 'red': '#A9A9A9'}
                          onChangeText={text => {
                            this.setState({ documentRef: text }, () => {
                              // this.isCheck3 = true;
                            });
                          }}
                        />
                      </View>
                    )}

                    <View style={styles.check}>
                      {this.state.RouteParam === 'NC' &&
                        this.props.data.audits.smdata != 2 &&
                        this.props.data.audits.smdata != 3 ? (
                        <Icon
                          style={{ left: 6, top: 5 }}
                          name="asterisk"
                          size={8}
                          color="red"
                        />
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.div1}>
                    <Text
                      style={{
                        fontSize: Fonts.size.regular,
                        color: '#A6A6A6',
                        left: 10,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Attach_EvidenceL}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ AttachModal: true }, () => {
                          //console.log('opoened');
                        })
                      }
                      ref={evidenceField =>
                        (this.evidenceField = evidenceField)
                      }
                      style={styles.check}>
                      <ResponsiveImage
                        initWidth="24"
                        initHeight="22"
                        source={Images.AttachIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.fileArrayList != null &&
                    this.state.fileArrayList.length > 0 ? (
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={this.state.fileArrayList}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        horizontal={true} // Display images horizontally
                        style={{ marginTop: 10 }}
                      />
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <ResponsiveImage
              source={Images.ContentLoader}
              initHeight={100}
              initWidth={100}
            />
            <Text
              style={{
                fontSize: Fonts.size.regular,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.nc_01}
            </Text>
          </View>
        )}
        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
            }}>
            {/* <Image source={Images.Footer}/> */}
            {this.state.isSaving === false ? (
              <View style={styles.footerDiv}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      paddingRight: 30,
                      flexDirection: 'column',
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        debounce(this.setState({ dialogVisible: true }), 700)
                      }
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon name="undo" size={25} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: Fonts.size.regular,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.Reset}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/** zzzzzzz */}
                <View style={styles.floatingDiv}>
                  <TouchableOpacity
                    onPress={() => {
                      this.state.startVoice === false
                        ? debounce(this.StartVoicePress(), 800)
                        : debounce(this.StopVoicePress(), 800);
                    }}
                    style={
                      this.state.startVoice === true
                        ? [styles.floatinBtn, { backgroundColor: '#14D0AE' }]
                        : [styles.floatinBtn, { backgroundColor: 'white' }]
                    }>
                    {this.state.startVoice === true ? (
                      <Icon
                        name="assistive-listening-systems"
                        size={25}
                        color="white"
                      />
                    ) : (
                      <Icon name="microphone" size={25} color="#2EA4E2" />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      paddingLeft: 30,
                      flexDirection: 'column',
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={debounce(this.onSave.bind(this), 600)}
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon name="save" size={25} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: Fonts.size.regular,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.Save}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ right: 70, position: 'absolute' }}>
                <Pulse size={20} color="white" />
              </View>
            )}
          </ImageBackground>
        </View>

        <Toast ref="toast" position="top" opacity={1} />

        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}
          style={styles.modalOuterBox}>
          <View>
            <View style={styles.ModalBox}>
              <View style={styles.modalheader}>
                <Text
                  style={{
                    fontSize: Fonts.size.h5,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {this.state.NCtxtFlag == false
                    ? strings.StandardRequirementsL
                    : this.state.RouteParam === 'NC'
                      ? 'Non conformance'
                      : 'Opportunity for improvements'}
                </Text>
              </View>
              <ScrollView style={styles.modalbody}>
                <View>
                  {this.state.NCtxtFlag === false ? (
                    <View style={{ paddingBottom: 20 }}>
                      {this.state.modalDisplay.map((item, key) => (
                        <View key={key}>
                          <Text
                            selectable={true}
                            style={{
                              fontSize: Fonts.size.regular,
                              fontFamily: 'OpenSans-Bold',
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            selectable={true}
                            style={{
                              fontSize: Fonts.size.regular,
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {item.Requirement == null
                              ? 'No content found for this clause'
                              : item.Requirement}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={{ paddingBottom: 20 }}>
                      <Text
                        selectable={true}
                        style={{
                          fontSize: Fonts.size.regular,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {this.state.RouteParam === 'NC'
                          ? this.state.nonconfirmityText
                          : this.state.ofitext}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              <View style={styles.modalfooter}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ NCtxtFlag: false, isVisible: false })
                  }>
                  <Text
                    style={{
                      fontSize: Fonts.size.regular,
                      color: '#00a1e2',
                      top: 1,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Close}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.dialogVisible}
          onBackdropPress={() => this.setState({ dialogVisible: false })}
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View>
              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Confirm}
                  </Text>
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

              <TouchableOpacity
                onPress={() => this.setState({ dialogVisible: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {this.renderModel(
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>
              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Make_your_selection}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={this.cameraAction.bind(this, 'Camera')}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                    <View style={{ width: '12%', height: null }}>
                      <Icon name="camera" size={25} color="grey" />
                    </View>
                    <View
                      style={{
                        width: '88%',
                        height: null,
                        justifyContent: 'flex-start',
                      }}>
                      <Text style={styles.boxContentCam}>
                        {strings.Camera_Capture_Head}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.attachFiles()}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                    <View style={{ width: '12%', height: null }}>
                      <Icon name="file-image-o" size={25} color="grey" />
                    </View>
                    <View style={{ width: '88%', height: null }}>
                      <Text style={styles.boxContentCam}>
                        {strings.Camera_Browse_Files}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({ AttachModal: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.Cancel}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>,
        )}

        <Modal
          isVisible={this.state.suggestionPopUp}
          onBackdropPress={() => this.setState({ suggestionPopUp: false })}
          style={styles.modalOuterBox}>
          <View
            style={{
              width: '90%',
              height: 200,
              backgroundColor: 'white',
              borderRadius: 5,
              padding: 10,
            }}>
            <View
              style={{
                width: '100%',
                height: '25%',
                backgroundColor: 'white',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'lightgrey',
                flexDirection: 'row',
              }}>
              <View style={{ width: '20%' }}>
                <ActivityIndicator size={20} color="#1CAFF6" />
              </View>
              <View
                style={{
                  width: '80%',
                  justifyContent: 'center',
                  paddingLeft: '13%',
                }}>
                <Text style={{ fontSize: 18, fontFamily: 'OpenSans-Regular' }}>
                  Voice assistant
                </Text>
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
                      <Text style={{ fontFamily: 'OpenSans-Regular' }}>
                        {item.id}
                      </Text>
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

  renderModel(children) {
    return Platform.OS == 'ios' ? (
      <Modal
        transparent="false"
        isVisible={this.state.AttachModal}
        onBackdropPress={() =>
          this.setState({ AttachModal: false }, () => {
            //console.log('modal closed');
          })
        }
        style={styles.modalOuterBox}>
        {children}
      </Modal>
    ) : (
      <Modal
        isVisible={this.state.AttachModal}
        onBackdropPress={() =>
          this.setState({ AttachModal: false }, () => {
            //console.log('modal closed');
          })
        }
        style={styles.modalOuterBox}>
        {children}
      </Modal>
    );
  }
  updateAuditStatus = auditid => {
    let bcontinue = false;
    var auditRecordsOrg = this.props.data.audits.auditRecords;
    var auditRecords = [];
    for (var p = 0; p < auditRecordsOrg.length; p++) {
      if (
        auditRecordsOrg[p].AuditId == auditid &&
        auditRecordsOrg[p].AuditRecordStatus == constant.StatusDownloaded
      ) {
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
  //console.log(state, 'propsdataincoming');
  return {
    data: state,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    storeAuditRecords: auditRecords =>
      dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
    storeNCRecords: ncofiRecords =>
      dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
    storeCameraCapture: cameraCapture =>
      dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateNC);
