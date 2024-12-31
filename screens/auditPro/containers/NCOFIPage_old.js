import React, { Component } from 'react'
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
  Platform
} from 'react-native'
import { Images } from '../Themes/index'
import styles from '../styles/NCOFIPageStyle'
import {connect} from "react-redux";
import Modal from "react-native-modal"
// import FooterButton from '../Components/Shared/FooterButton'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import auth from '../../../services/Auditpro-Auth'
import Toast, { DURATION } from "react-native-easy-toast";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Moment from 'moment';
import { width, height } from 'react-native-dimension'
// import OfflineNotice from '../Components/OfflineNotice'
import ResponsiveImage from 'react-native-responsive-image';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../language/Language';
import { debounce, once } from "underscore";
import NetInfo from "@react-native-community/netinfo";
import { create } from 'apisauce'
import * as constant from '../constants/AppConstants'
import DeviceInfo from 'react-native-device-info'
import RNFetchBlob from 'react-native-fetch-blob'
import CryptoJS from 'crypto-js'
import { ROUTES } from 'constants/app-constant';
import AsyncStorage from '@react-native-community/async-storage';
import { SPACING } from 'constants/theme-constants';

var RNFS = require('react-native-fs')

let Window = Dimensions.get('window')

class NCOFIPage extends Component {

  isAttachmentPresent = false
  attatchedFindings = []
  formRequestObj = []
  count = []
  brokenPath = undefined
  pathDetails = []

  constructor(props) {
    super(props);
    console.log('get this.props--->', this.props)
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
      missingFindings:[],
      isMissingFindings:false,
      confirmpwd:false,
      pwdentry:undefined,
      deviceId: DeviceInfo.getUniqueId(),
      isEmptyPwd:undefined,
      AuditOrder:undefined,
      currentUserData: [],

    }
  }

  componentDidMount() {
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh')
        this.setState({})
        console.log('Chinese script on', this.state.ChineseScript)
      })
    }
    else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US')
        this.setState({})
        console.log('Chinese script off', this.state.ChineseScript)
      })
    }
    console.log('Redux store...', this.props.data.audits)
    console.log('NCOFI mounted', this.props?.navigation?.state?.params)
    console.log('NCOFI mounted new', this.props?.route?.params)
    this.setState({
      // Update this.props?.navigation?.state?.params? -----> this.props?.route?.params?

      // dropdownprops:this.props?.navigation?.state?.params?.DropDownVal,
      CreateNCpass: this.props?.route?.params?.CreateNCdataBundle,
      AUDIT_ID: this.props?.route?.params?.CreateNCdataBundle?.AuditID,
      SITEID: this.props?.route?.params?.CreateNCdataBundle?.SiteID,
      breadCrumbText: this.props?.route?.params?.CreateNCdataBundle?.breadCrumb,
      // breadCrumbText: this.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb.length > 30 ? this.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb.slice(0, 30) + '...' : this.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb,
      NCdetails: this.props?.data?.audits?.ncofiRecords,
      AuditOrder:this.props?.route?.params?.CreateNCdataBundle?.AuditOrder,
      isMounted: true
    }, () => {
      console.log('AuditOrder', this.state.AuditOrder)
      this.getDetails()
      // this.setUpload()
      this.refreshList()
    })
  }


  componentWillReceiveProps() {

    // var getCurrentPage = []
    // getCurrentPage = this.props?.data?.nav?.routes
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName
    // console.log('--CurrentPage--->', CurrentPage)
    var CurrentPage;
    if (CurrentPage == 'NCOFIPage') {
      console.log('NCOFI Component Focussed!')
      if (this.state.isMounted) {
        this.setState({
          NCdetails: this.props.data.audits.ncofiRecords
        }, () => {
          console.log('NCdetails', this.state.NCdetails);
          this.getDetails()
          this.setUpload()
        });
      }
    }
    else {
      console.log('NCOFIPage pass')
    }
  }

  // async getAccessToken(){
  //   try {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     console.log('current token1--->', token)
  //     if (token !== null) {
  //       // value previously stored
  //       console.log('current token2--->', token)
  //       this.setState({ currentAccessToken: token },()=>{
  //         console.log('Token set')
  //       })
  //     }
  //   } catch (e) {
  //     // error reading value
  //     console.log('error--->', e)
  //   }
  // };

  async getAccessToken(){
    try {
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = JSON.parse(stringifiedUserDetails);
      console.log('current userdata--->', value)
      if (value !== null) {
        // value previously stored
        console.log('current token2--->', value.accessToken)
        this.setState({ currentUserData: value },()=>{
          console.log('Token set')
        })
      }
    } catch (e) {
      // error reading value
      console.log('error--->', e)
    }
  };

  getDetails = () => {
    setTimeout(() => {
      var compArr = []
      var Data = this.props.data.audits.ncofiRecords
      console.log('NC Data', Data)

      for (var i = 0; i < Data.length; i++) {
        if (this.state.AUDIT_ID === Data[i].AuditID) {
          for (var j = 0; j < Data[i].Pending.length; j++) {
            if (Data[i].Pending[j].ChecklistTemplateId == 0) {
              if (Data[i].Pending[j].Category === 'NC') {
                compArr.push({
                  AuditID: Data[i].Pending[j].AuditID,
                  AuditOrder: Data[i].Pending[j].AuditOrder,
                  ChecklistID: Data[i].Pending[j].ChecklistID,
                  Formid: Data[i].Pending[j].Formid,
                  SiteID: Data[i].Pending[j].SiteID,
                  title: Data[i].Pending[j].NCNumber,
                  requiretext: Data[i].Pending[j].requiretext,
                  OFI: Data[i].Pending[j].OFI,
                  categoryDrop: Data[i].Pending[j].categoryDrop,
                  userDrop: Data[i].Pending[j].userDrop,
                  requestDrop: Data[i].Pending[j].requestDrop,
                  deptDrop: Data[i].Pending[j].deptDrop,
                  NCNumber: Data[i].Pending[j].NCNumber + '-' + 'NC',
                  Category: Data[i].Pending[j].Category,
                  filename: Data[i].Pending[j].filename,
                  filedata: Data[i].Pending[j].filedata,
                  documentRef: Data[i].Pending[j].documentRef,
                  auditstatus: Data[i].Pending[j].auditstatus,
                  NonConfirmity: Data[i].Pending[j].NonConfirmity,
                  uniqueNCkey: Data[i].Pending[j].uniqueNCkey,
                  selectedItems: Data[i].Pending[j].selectedItems,
                  selectedItemsProcess: Data[i].Pending[j].selectedItemsProcess,
                  ChecklistTemplateId: Data[i].Pending[j].ChecklistTemplateId,
                  ncIdentifier: Data[i].Pending[j].ncIdentifier,
                  objEvidence: Data[i].Pending[j].objEvidence,
                  recommAction: Data[i].Pending[j].recommAction,
                  data: [Data[i].Pending[j].NonConfirmity === undefined ? 'N/a' : Data[i].Pending[j].NonConfirmity]
                })
              }
              else if (Data[i].Pending[j].Category === 'OFI') {
                compArr.push({
                  AuditID: Data[i].Pending[j].AuditID,
                  AuditOrder: Data[i].Pending[j].AuditOrder,
                  Category: Data[i].Pending[j].Category,
                  ChecklistID: Data[i].Pending[j].ChecklistID,
                  Formid: Data[i].Pending[j].Formid,
                  NCNumber: Data[i].Pending[j].NCNumber + '-' + 'OFI',
                  NonConfirmity: Data[i].Pending[j].NonConfirmity,
                  OFI: Data[i].Pending[j].OFI,
                  SiteID: Data[i].Pending[j].SiteID,
                  auditstatus: Data[i].Pending[j].auditstatus,
                  categoryDrop: Data[i].Pending[j].categoryDrop,
                  deptDrop: Data[i].Pending[j].deptDrop,
                  filedata: Data[i].Pending[j].filedata,
                  filename: Data[i].Pending[j].filename,
                  documentRef: Data[i].Pending[j].documentRef,
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
                  data: [Data[i].Pending[j].OFI === undefined ? 'N/a' : Data[i].Pending[j].OFI]
                })
              }
            }
          }
        }
      }
      
      console.log('compArr', compArr)

      let abc = Array.from(new Set(compArr));

      console.log('Checking for duplicate',abc)


      this.setState({ NCdisplay: compArr, isMounted: true }, () => {
        console.log('this.state.NCdisplay', this.state.NCdisplay)
      })
    }, 500)
  }

  setUpload = () => {
    setTimeout(() => {
      var Data = this.props.data.audits.ncofiRecords
      console.log('NC Data', Data)
      var compArr2 = []

      for (var i = 0; i < Data.length; i++) {
        if (this.state.AUDIT_ID === Data[i].AuditID) {
          for (var j = 0; j < Data[i].Uploaded.length; j++) {
            compArr2.push({
              title: Data[i].Uploaded[j].NCNumber,
              CorrectiveOrder: Data[i].Uploaded[j].CorrectiveOrder,
              data: [
                Data[i].Uploaded[j].NonConfirmity === undefined ? 'N/a' : Data[i].Uploaded[j].NonConfirmity
              ]
            })
          }
        }
      }
      console.log('compArr2', compArr2)
      this.setState({ NCUpload: compArr2, isMounted: true, isLoaderVisible: false }, () => {
        console.log('this.state.NCUpload', this.state.NCUpload)
      })
    }, 500)

  }

  openEditBox = (item) => {
    console.log('values---NC/OFI', item)
    console.log('NCOFIDetails---NC/OFI', this.state.CreateNCpass)
    this.props.navigation.navigate(ROUTES.CREATE_NC, {
      CheckpointRoute: item.Category,
      AuditID: this.state.AUDIT_ID,
      NCOFIDetails: this.state.CreateNCpass,
      templateId: 0,
      type: 'EDIT',
      data: item,
      isUploaded: false
    })
  }

  getSectionListItem = (item) => {
    console.log('Item opened', item)
    this.setState({
      NCmodalheader: item.title,
      CorrectiveOrder: item.CorrectiveOrder
    }, () => {
      console.log('modal set', this.state.NCmodalheader, this.state.NCtext)
      this.setState({ isVisible: true }, () => { console.log('Modal opened!') })

      if (this.props.data.audits.isOfflineMode) {
        console.log('Offline mode')
      }
      else {
        // NetInfo.isConnected.fetch().then(isConnected => {
        //   if (isConnected) {
        //     // call NC details here
        //     this.fetchNCdetails()
        //   }
        // })
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            // call NC details here
            this.fetchNCdetails()
          }
        });
      }
    })
  }

  fetchNCdetails() {

    // var token = this.props.data.audits.token
    var token = this.state.currentUserData?.accessToken
    // var Data = this.props.data.audits.audits
    var Data = this.props.data.audits.auditRecords
    console.log('forming   sds' , this.state.AUDIT_ID, Data)

    for (var i = 0; i < Data.length; i++) {
      if (this.state.AUDIT_ID == Data[i].AuditId) {
        var AuditOrder = Data[i].AuditOrderId
      }
    }

    console.log('forming', this.state.AUDIT_ID, this.state.AuditOrder)

    const CorrectiveId = this.state.AUDIT_ID 
    const CorrectiveOrder = this.state.CorrectiveOrder
    console.log('corrective id', CorrectiveId, CorrectiveOrder)

    auth.getAllNCDetails(CorrectiveId, CorrectiveOrder, token, (res, data) => {
      this.setState({ loadingData: false }, () => {
        console.log('---->', data)
      })
      if (data.data) {
        if (data.data.Message === 'Success') {
          console.log('response', data.data.Message)
          console.log('all nc details', data)
          if (data.data.Data.ResponseDate && data.data.Data.NcDetails) {
            var UploadDate = (data.data.Data.NcDetails) ? data.data.Data.NcDetails.length == 0 ? '-' : data.data.Data.NcDetails[0].DateofUpload : '-'
            var Responsible = (data.data.Data.Responsibility) ? data.data.Data.Responsibility.length == 0 ? '-' : data.data.Data.Responsibility[0].ResponsibilityPerson : '-'
            var Request = (data.data.Data.RequestedBy) ? data.data.Data.RequestedBy.length == 0 ? '-' : data.data.Data.RequestedBy[0].RequestedByUsers : '-'
            var Category = (data.data.Data.CategoryDetail) ? data.data.Data.CategoryDetail.length == 0 ? '-' : data.data.Data.CategoryDetail[0].Category : '-'
            var Response = (data.data.Data.ResponseDate) ? data.data.Data.ResponseDate.length == 0 ? '-' : data.data.Data.ResponseDate[0].ResponseExtDate : '-'
            var Standard = (data.data.Data.StandardRequirement) === null ? '-' : data.data.Data.StandardRequirement
            var NCtext = data.data.Data.NcDetails ? data.data.Data.NcDetails.length >0 ? data.data.Data.NcDetails[0].Nonconformity: '-':'-'
            this.setState({
              UploadDate: UploadDate,
              Responsible: Responsible,
              Request: Request,
              Category: Category,
              Response: Response,
              Standard: Standard,
              loadingData: false,
              NCtext : NCtext
            }, () => {
              var standText = ''
              console.log('fetched...')
              if (this.state.Standard !== '-') {
                for (var i = 0; i < Standard.length; i++) {
                  standText = standText.concat(Standard[i].StdRequirement)
                }
                this.setState({ StandText: standText }, () => {
                  console.log('StandText', this.state.StandText)
                })
              }
              else {
                this.setState({ StandText: '-', loadingData: false }, () => {
                  console.log('this.state.StandText', this.state.StandText, this.state.loadingData)
                })
              }
            })
          }
        }
        else {
          /* this.setState({ miniLoading : true },() =>{
            console.log('cant reach server',this.state.miniLoading)
          }) */
          this.toast.show(strings.Audit_NCOFI_Failed, DURATION.LENGTH_LONG)
        }
      }
      else {
        this.toast.show(strings.Audit_NCOFI_Failed, DURATION.LENGTH_LONG)
      }
    })
  }

  onNavigaTo(id) {
    console.log('called')
    if (id === 1) {
      this.props.navigation.navigate(ROUTES.CREATE_NC, {
        CheckpointRoute: 'NC',
        AuditID: this.state.AUDIT_ID,
        NCOFIDetails: this.state.CreateNCpass,
        templateId: 0,
        type: 'ADD',
        data: null,
        isUploaded: false
      })
    }
    if (id === 2) {
      this.props.navigation.navigate(ROUTES.CREATE_NC, {
        CheckpointRoute: 'OFI',
        AuditID: this.state.AUDIT_ID,
        NCOFIDetails: this.state.CreateNCpass,
        templateId: 0,
        type: 'ADD',
        data: null,
        isUploaded: false
      })
    }
  }

  RefreshUpload() {
    if (this.props.data.audits.isOfflineMode) {
      this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
    }
    else {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.refreshList()
        }
        else {
          this.toast.show(strings.No_sync, DURATION.LENGTH_LONG)
        }
      })
    }
  }

  CheckInternetConnectivityNCOFI() {
    this.setState({
      isLoaderVisible: true, dialogVisible: false ,confirmpwd : false
    }, () => {
      var baseURL = this.props.data.audits.serverUrl
      const check = create({
        baseURL: baseURL + 'CheckConnection',
      })
      check.post()
        .then((response) => {
          if (response.duration > constant.ThresholdSpeed) {
            this.setState({
              isLowConnection: true
            }, () => {
              // this.syncNCOFIToServer()
              this.checkUser()
              console.log('Download response', response)
              console.log('Low network', this.state.isLowConnection)
            })
          }
          else {
            // this.syncNCOFIToServer()
            this.checkUser()
            console.log('Download response', response)
            console.log('Low network', this.state.isLowConnection)
          }
        })
    })

  }

  checkUser() {
    console.log('user id', this.props.data.audits.userId)
    var userid = this.props.data.audits.userId
    // var token = this.props.data.audits.token
    var token = this.state.currentUserData?.accessToken
    var UserStatus = ''
    var serverUrl = this.props.data.audits.serverUrl
    var ID = this.props.data.audits.userId
    var type = 3
    var path = ''
    console.log(userid, token)

    auth.getCheckUser(userid, token, (res, data) => {
      console.log('User information', data)
      if (data.data.Message == 'Success') {
        UserStatus = data.data.Data.ActiveStatus
        if (UserStatus == 2) {
          console.log('User active')

          /** add one more layer for detecting deleted files. */

          this.checkFilePath()


        }
        else if (UserStatus == 1) {
          console.log('deleting user details')

          var cleanURL = serverUrl.replace(/^https?:\/\//,'')
          var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          this.propsServerUrl = formatURL

          console.log('cleanURL', this.propsServerUrl)
          // var ID = this.props.data.audits.userId
          console.log('path', this.propsServerUrl + ID)

          if (Platform.OS == 'android') {
            path = '/data/user/0/com.auditpro/cache/AuditUser' + '/' + this.propsServerUrl + ID
            console.log('path storing-->', path)
          }
          else {
            var iOSpath = RNFS.DocumentDirectoryPath
            path = iOSpath + '/' + this.propsServerUrl + ID
          }
          console.log('*** path', path)
          // this.deleteUserFile(path)
          this.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT)
          this.props.navigation.navigate('LoginUIScreen')
        }
        else if (UserStatus == 0) {
          this.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT)
          this.props.navigation.navigate('LoginUIScreen')
        }
      }
    })
  }

  async checkFilePath(){
    try{
      console.log('Checking file path')

      var AUDIT_ID = this.state.AUDIT_ID
      var ncofiRecords = this.props.data.audits.ncofiRecords
      var pushPath = []
  
      console.log('Checking file path',AUDIT_ID)
      console.log('Checking file path',ncofiRecords)
  
  
      if (ncofiRecords) {
        for (var i = 0; i < ncofiRecords.length; i++) {
          if (AUDIT_ID == ncofiRecords[i].AuditID) {
            for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
              console.log('Loop running',j)
              if (ncofiRecords[i].Pending[j].filedata != '') {
  
                let res = await this.isPathExist(ncofiRecords[i].Pending[j].filedata)
  
                var check404 = res.slice(-4)
                if(check404 == '/404'){
                  console.log('Error path found',res)
                  pushPath.push(ncofiRecords[i].Pending[j].filedata)
                }
                else{
                  console.log('URL path is ok',res)
                }
              }
            }
            console.log('pushPath ==>',pushPath)
            if(pushPath.length > 0){
              this.alertUser(pushPath)
            }
            else{
              // the file path are ok. continue to sync
              this.syncNCOFIToServer()
            }
          }
        }
      }  
    }
    catch(e){
      console.log('checkFilePath',e)
    }
  }
  
  alertUser(pushPath){
    console.log('getting broken path',pushPath)

    var AUDIT_ID = this.state.AUDIT_ID
    var ncofiRecords = this.props.data.audits.ncofiRecords
    var missingFindings = [] 

    for (var i = 0; i < ncofiRecords.length; i++) {
      if (AUDIT_ID == ncofiRecords[i].AuditID) {
        for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
          for(var p =0 ; p < pushPath.length ; p++){
            if(pushPath[p] == ncofiRecords[i].Pending[j].filedata){
              // this nc is missing filename
              // make the filedata as empty field
              console.log(ncofiRecords[i].Pending[j])
              var findings = {
                NCNumber : ncofiRecords[i].Pending[j].NCNumber,
                NonConfirmity : ncofiRecords[i].Pending[j].NonConfirmity
              }
              missingFindings.push(findings)

            }
          }
        }
      }
    }
    this.setState({
      missingFindings : missingFindings,
      isMissingFindings:true
    },()=>{
      console.log('missingFindings',this.state.missingFindings)
    })
  }


  async isPathExist(arrpath){
    try{
      return new Promise((resolve, reject) => {
        // console.log('arrpath',arrpath)
          RNFS.readFile(arrpath,'base64').then((res)=>{
            if(res){
              resolve(arrpath) 
              // console.log('path found',arrpath)
            }
          }).catch((err)=>{
            resolve(arrpath+'/'+404) 
            // console.warn('path not found',arrpath)
          })
      })
    }
    catch(e){
      console.warn('isPathExist',e)
    }
  }

  deleteUserFile(path) {
    console.log('RNFS.DocumentDirectoryPath', path)
    var serURL = this.props.data.audits.serverUrl
    RNFS.exists(path)
      .then((result) => {
        console.log('path result', result)
        if (result) {
          RNFetchBlob.fs.unlink(path)
            .then(() => {
              console.log('deleted success');
              setTimeout(() => {
                RNFS.exists(path).then((res) => {
                  console.log('path', res)
                  this.setState({
                    dialogVisible: false
                  }, () => {
                    this.props.clearAudits()
                    setTimeout(() => {
                      this.props.storeServerUrl(serURL)
                      console.log('FILE DELETED!');
                      this.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT)
                      this.props.navigation.navigate('LoginUIScreen')
                      console.log('Check server url', this.props.data)
                    }, 600)
                  })
                }, 1500)
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
        else {
          console.log('Patha not found')
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  syncNCOFIToServer() {
    if (this.state.isLowConnection === false) {
      if (this.props.data.audits.isOfflineMode) {
        this.setState({ isLoaderVisible: false, dialogVisible: false })
        this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
      }
      else {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
            this.setState({  dialogVisible: false }, function () {
              console.log('Processing...', this.state.dialogVisible)
            })
            console.log('getting local unsaved data', this.props.data.audits.ncofiRecords)
            // var token = this.props.data.audits.token
            var token = this.state.currentUserData?.accessToken
            var formRequest = []
            var dataArr = this.props.data.audits.ncofiRecords
            for (var i = 0; i < dataArr.length; i++) {
              if (dataArr[i].AuditID === this.state.AUDIT_ID) {
                for (var j = 0; j < dataArr[i].Pending.length; j++) {
                  if (dataArr[i].Pending[j].ChecklistTemplateId == 0) {
                    if (dataArr[i].Pending[j].Category == 'NC') {
                      console.log('into NC targeted arr', [i], dataArr[i].Pending[j])
                      formRequest.push({
                        strProcess: (dataArr[i].Pending[j].selectedItemsProcess.length > 0) ? dataArr[i].Pending[j].selectedItemsProcess.join(',') : '',
                        CorrectiveId: dataArr[i].Pending[j].AuditID,
                        CategoryId: dataArr[i].Pending[j].categoryDrop.id,
                        Title: dataArr[i].Pending[j].NCNumber,
                        FileName: dataArr[i].Pending[j].filename,
                        ElementID: (dataArr[i].Pending[j].selectedItems) ? dataArr[i].Pending[j].selectedItems.join(',') : 0,
                        Department: dataArr[i].Pending[j].deptDrop.id === undefined ? 0 : dataArr[i].Pending[j].deptDrop.id,
                        AuditStatus: (dataArr[i].Pending[j].auditstatus == '') ? 0 : parseInt(dataArr[i].Pending[j].auditstatus),
                        NonConformity: dataArr[i].Pending[j].NonConfirmity,
                        ResponsibilityUser: dataArr[i].Pending[j].userDrop.id,
                        SiteId: dataArr[i].Pending[j].SiteID,
                        RequestedBy: dataArr[i].Pending[j].requestDrop.id,
                        FormId: (dataArr[i].Pending[j].Formid === '') ? 0 : parseInt(dataArr[i].Pending[j].Formid),
                        ChecklistId: (dataArr[i].Pending[j].ChecklistTemplateId === '') ? 0 : parseInt(dataArr[i].Pending[j].ChecklistTemplateId),
                        RecommendedAction: dataArr[i].Pending[j].recommAction === undefined ? '' : dataArr[i].Pending[j].recommAction,
                        NCIdentifier: dataArr[i].Pending[j].ncIdentifier === undefined ? '' : dataArr[i].Pending[j].ncIdentifier,
                        ObjectiveEvidence: dataArr[i].Pending[j].objEvidence === undefined ? '' : dataArr[i].Pending[j].objEvidence,
                        uniqueNCkey: dataArr[i].Pending[j].uniqueNCkey
                        // AttachEvidence:dataArr[i].Pending[j].filedata,
                      })
                    }
                    else if (dataArr[i].Pending[j].Category == 'OFI') {
                      console.log('into OFI targeted arr', [i], dataArr[i].Pending[j])
                      formRequest.push({
                        strProcess: (dataArr[i].Pending[j].selectedItemsProcess.length > 0) ? dataArr[i].Pending[j].selectedItemsProcess.join(',') : '',
                        CorrectiveId: dataArr[i].Pending[j].AuditID,
                        CategoryId: dataArr[i].Pending[j].categoryDrop.id,
                        Title: dataArr[i].Pending[j].NCNumber,
                        FileName: dataArr[i].Pending[j].filename,
                        Department: dataArr[i].Pending[j].deptDrop.id === undefined ? 0 : dataArr[i].Pending[j].deptDrop.id,
                        AuditStatus: (dataArr[i].Pending[j].auditstatus == '') ? 0 : parseInt(dataArr[i].Pending[j].auditstatus),
                        RequestedBy: dataArr[i].Pending[j].requestDrop.id,
                        NonConformity: dataArr[i].Pending[j].OFI,
                        FormId: (dataArr[i].Pending[j].Formid === '') ? 0 : parseInt(dataArr[i].Pending[j].Formid),
                        SiteId: dataArr[i].Pending[j].SiteID,
                        ChecklistId: (dataArr[i].Pending[j].ChecklistTemplateId === '') ? 0 : parseInt(dataArr[i].Pending[j].ChecklistTemplateId),
                        ElementID: (dataArr[i].Pending[j].selectedItems) ? dataArr[i].Pending[j].selectedItems.join(',') : 0,
                        ResponsibilityUser: dataArr[i].Pending[j].userDrop.id,
                        NCIdentifier: dataArr[i].Pending[j].ncIdentifier === undefined ? '' : dataArr[i].Pending[j].ncIdentifier,
                        ObjectiveEvidence: dataArr[i].Pending[j].objEvidence === undefined ? '' : dataArr[i].Pending[j].objEvidence,
                        RecommendedAction: dataArr[i].Pending[j].recommAction === undefined ? '' : dataArr[i].Pending[j].recommAction,
                        uniqueNCkey: dataArr[i].Pending[j].uniqueNCkey
                        // AttachEvidence:dataArr[i].Pending[j].filedata,
                      })
                    }
                  }
                }
              }
            }
            console.log('Request array pushed', formRequest, token)
            if (formRequest.length > 0) {
              this.formRequestArr(formRequest, token)
            }
            else {
              this.setState({ isLoaderVisible: false, dialogVisible: false }, () => {
                this.toast.show(strings.noncofitosync, DURATION.LENGTH_LONG)
              })
            }
          }
          else {
            this.setState({ isLoaderVisible: false, dialogVisible: false })
            this.toast.show(strings.No_sync, DURATION.LENGTH_LONG)
          }
        })
      }
    }
    else {
      this.setState({ isLoaderVisible: false, dialogVisible: false }, () => {
        Alert.alert(strings.nc_reply_06)
      })
      console.log('hitting here')
    }
  }

  formRequestArr(formRequest, token) {
    var datapass = formRequest
    var TOKEN = token

    console.log('keypass', datapass)

    auth.syncNCOFIToServer(datapass, TOKEN, (res, data) => {
      console.log('syncNCToServer data', data)
      if (data.data) {
        if (data.data.Message === 'Success') {
          // this.setState({ isLoaderVisible: false }, function () {
            this.toast.show(strings.NCSuccess, DURATION.LENGTH_LONG)
            var responseData = data.data.Data
            this.checkFindingAttachment(responseData)
            this.AfterSyncdone()
            // this.upLoadList()
          // })
        }
        else {
          this.setState({ isLoaderVisible: false }, function () {
            this.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG)
          })
        }
      }
      else {
        this.setState({ isLoaderVisible: false }, function () {
          this.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG)
        })
      }
    })
  }
  async checkFindingAttachment(responseData) {
    try{
      var token = this.props.data.audits.token
      var AUDIT_ID = this.state.AUDIT_ID
      var ncofiRecords = this.props.data.audits.ncofiRecords
      if (ncofiRecords) {
        for (var i = 0; i < ncofiRecords.length; i++) {
          if (AUDIT_ID == ncofiRecords[i].AuditID) {
            for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
              if (ncofiRecords[i].Pending[j].filedata != '') {
                this.attatchedFindings.push(ncofiRecords[i].Pending[j])
              }
            }
          }
        }
      }
      console.log('Total number of attached Findings', this.attatchedFindings)
      if (this.attatchedFindings.length > 0) {
        this.formDocProObject(this.attatchedFindings, responseData)
        // console.log('Promise for docpro', docproForm)
        // this.callDocProAPI(docproForm, token)
  
        // this.formDocProObject(this.attatchedFindings, responseData).then((res) => {
        //   console.log('Promise for docpro', res)
        // })
      }
      else {
        this.setState({
          isLoaderVisible : false
        },()=>{
          this.refreshList()
        })
      }
    }
    catch(e){
      console.log('checkFindingAttachment',e)
    }
    
  }


  formDocProObject(attatchedFindings, responseData) {
    return new Promise((resolve, reject) => {
      var resData = responseData
      // this.attatchedFindings = attatchedFindings
      // var formRequestObj = []
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var getDate = mm + '/' + dd + '/' + yyyy;


      //dynamic value

      var AuditID = this.state.AUDIT_ID
      var token = this.props.data.audits.token

      var siteId = this.props.data.audits.siteId
      var UserId = this.props.data.audits.userId
      var auditRecords = this.props.data.audits.auditRecords
      var siteid = 'sit' + siteId
      var effectivedate = getDate
      var revdate = getDate
      var dnum = ''
      var deviceId = DeviceInfo.getUniqueId()
      for (var i = 0; i < auditRecords.length; i++) {
        if (AuditID == auditRecords[i].AuditId) {
          dnum = auditRecords[i].AuditNumber
        }
      }


      // static value
      var langid = 1
      var userdtfmt = 'MM/DD/YYYY'
      var UserDtFmtDlm = '/'
      var filepath = ''
      var fromdocpro = 0
      var frommod = 'mod2'
      var doctypeid = 0
      var mod = 'mod2'
      var link = ''
      var keyword = 'AuditPro'
      var reason = ''
      var rev = 1
      var paginate = ''
      var chgs_reqd = ''
      var spublic = 0
      var ModEmailConFig = 0
      // var token = this.props.data.audits.token
      var token = this.state.currentUserData?.accessToken

      if (this.attatchedFindings) {
        for (var j = 0; j < resData.length; j++) {
          for (var i = 0; i < this.attatchedFindings.length; i++) {
            if (this.attatchedFindings[i].uniqueNCkey == resData[j].UniqueNCkey) {
              console.log('==-->', this.attatchedFindings[i])

              let getdname = this.attatchedFindings[i].filename
              let getfname = this.attatchedFindings[i].filename
              let getext = this.attatchedFindings[i].filename.substr(this.attatchedFindings[i].filename.lastIndexOf('.') + 1)
              let getobj = resData[j].DocProParameter
              let getSitId = resData[j].SiteLevelId

              /** Below we are converting file URI to base 64 data and sending to docpro API */

              this.convertFile(this.attatchedFindings[i].filedata)
                .then((res) => {
                  var filecontent = res ? res : ''
                  var formobj = ''
                  var dname = getdname
                  var filename = getfname

                  var obj = getobj
                  var sitelevelid = getSitId
                  formobj = {
                    dnum: dnum,
                    dname: dname,
                    filename: filename,
                    ext: getext,
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
                    filecontent: filecontent,
                    "lstUserPrefModel": [{
                      siteid: siteId,
                      UserId: UserId,
                      langid: langid,
                      userdtfmt: userdtfmt,
                      UserDtFmtDlm: UserDtFmtDlm
                    }]
                  }
                  // console.log('formobj formobj formobj', formobj)
                  this.formRequestObj.push(formobj)
                  var arr = this.formRequestObj
                  resolve(arr)

                  if(this.formRequestObj.length == this.attatchedFindings.length){
                    this.callDocProAPI(arr, token)
                  }
                })
            }
            else {
              console.log('withoute nc')
            }
          }
        }
      }
    })
  }

  callDocProAPI(formRequestObj, token) {
    auth.getdocProAttachment(formRequestObj, token, (res, data) => {
      console.log('uploading data', data)
      if (data.data.Success == true) {
        this.setState({
          isLoaderVisible : false
        },()=>{
          this.refreshList()
        })
      }
      else {
        this.setState({ saveLoader: false }, () => {
          this.toast.show(strings.ErrUploading, DURATION.LENGTH_LONG)
        })
      }
    })
  }

  convertFile = (path) => {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs.readFile(path, 'base64')
        .then((data) => {
          resolve(data)
        }).catch((err) => {
          resolve(undefined)
          console.log('Error in converting', err)
        })
    })
  }

   refreshList = async () => {
    await this.getAccessToken()
    var AuditID = this.state.AUDIT_ID
    var Data = this.props.data.audits.auditRecords
    var iAudProgId = undefined
    var AuditTypeId = undefined

    console.log('****', Data)
    console.log('AuditID', AuditID)
    console.log('this.state.currentUserData?.accessToken', this.state.currentUserData?.accessToken)

    var SiteID = this.props.data.audits.siteId
    // var TOKEN = this.props.data.audits.token
    var TOKEN = this.state.currentUserData?.accessToken

    for (var i = 0; i < Data.length; i++) {
      if (this.state.AUDIT_ID == Data[i].AuditId) {
          iAudProgId = Data[i].AuditProgramId
          AuditTypeId = Data[i].AuditTypeId
      }
    }

    for (var j = 0; j < this.props.data.audits.auditRecords.length; j++) {
      if (this.state.AUDIT_ID === this.props.data.audits.auditRecords[j].AuditId) {
        var iAudTypeOrder = this.props.data.audits.auditRecords[j].AuditTypeOrder
        var iAudProgOrder = this.props.data.audits.auditRecords[j].AuditProgOrder
      }
    }


    this.setState({
      token: TOKEN,
      AUDITPROG_ID: iAudProgId,
      AUDITYPE_ORDER: iAudTypeOrder,
      AUDITYPE_ID: AuditTypeId,
      SITEID: SiteID,
      AUDITPROGORDER: iAudProgOrder,
    }, () => {
      const strSortBy = 'order by Title asc'
      const strFunction = 'AuditNCOFI'

      console.log('Site ID ==>',this.state.SITEID)
      console.log('AUDITPROG_ID,AUDITYPE_ID',this.state.AUDITPROG_ID,this.state.AUDITYPE_ID)
      console.log('get NC Formdata', this.state.SITEID, strSortBy, this.state.AUDIT_ID, this.state.AUDITPROG_ID, this.state.AUDITPROGORDER, this.state.AUDITYPE_ORDER, this.state.AUDITYPE_ID, strFunction, TOKEN)

      auth.getNCdetails(this.state.SITEID, strSortBy, this.state.AUDIT_ID, this.state.AUDITPROG_ID, this.state.AUDITPROGORDER, this.state.AUDITYPE_ORDER, this.state.AUDITYPE_ID, strFunction, TOKEN, (res, data) => {
        console.log('getNC data', data)
        console.log('response', res)

        if (data.data) {
          this.upLoadList(data.data.Data)
        }
        else {
          //this.toast.show(strings.NCFAiled,DURATION.LENGTH_LONG)
        }

      })
    })
  }

  AfterSyncdone(){
    // remove pending list after sync
    var dupNCrecords = []
    var NCrecords = this.props.data.audits.ncofiRecords
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = []
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        // delete synced pending Nc/ofi
        if (this.state.AUDIT_ID !== NCrecords[i].AuditID) {
          pendingList.push(NCrecords[i].Pending[j] )
        }else{
          // save check point Nc/ofi
          if(NCrecords[i].Pending[j].ChecklistTemplateId != 0){
            pendingList.push(NCrecords[i].Pending[j] )
          }
        }
      }
      dupNCrecords.push({
        AuditID: NCrecords[i].AuditID,
        Uploaded: NCrecords[i].Uploaded,
        Pending: pendingList
      })
    }
    this.props.storeNCRecords(dupNCrecords)
    //  to get updated uploaded  and pending list
    this.refreshList()
  }

  upLoadList(list) {
    var Uploaded = list
    console.log('getting props details...', this.props.data.audits)
    var dupNCrecords = []
    var NCrecords = this.props.data.audits.ncofiRecords
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = []
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
          pendingList.push(NCrecords[i].Pending[j])
        }
      }
      if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: (Uploaded) ? Uploaded : [],
          Pending: pendingList
        })
      }
      else {
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: NCrecords[i].Uploaded,
          Pending:  NCrecords[i].Pending ? NCrecords[i].Pending : []
        })
      }
    }
    this.props.storeNCRecords(dupNCrecords)

    this.getDetails()
    this.setUpload()
  }

  changeDateFormatCard = (inDate) => {
    console.log('==-->', inDate)
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat + ' ' + 'HH:mm'
      var sDateArr = inDate.split('T')
      var sDateValArr = sDateArr[0].split('-')
      var sTimeValArr = sDateArr[1].split(':')
      var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])

      var test = Moment(outDate).format(DefaultFormatL)
      console.log('Moment',test)

      return Moment(outDate).format(DefaultFormatL)
    }
  }
  changeDateFormat = (inDate) => {
    console.log('==-->', inDate)
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat + ' ' + 'HH:mm'
      var sDateArr = inDate.split('T')
      var sDateValArr = sDateArr[0].split('-')
      var sTimeValArr = sDateArr[1].split(':')
      var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])

      return Moment(outDate).format(DefaultFormatL)
    }
  }

  closeReset(){
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
    })
  }

  checkOffline(){
    if (this.props.data.audits.isOfflineMode) {
      this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
    } 
    else{
      this.setState({ dialogVisible: true })
    } 
  }
  onConfirmPwdPress(){
    if(!this.state.pwdentry){
      this.setState({
        isEmptyPwd:strings.enter_password
        
      },()=>{
        // this.toast.show('Empty password attempt', DURATION.LENGTH_SHORT)
      })
    }
    else{
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
      Keyboard.dismiss()
      var username = this.props.data.audits.loginuser
      var pwd = this.state.pwdentry
      var ncofiRecords = this.props.data.audits.ncofiRecords
      var auditid =  this.state.AUDIT_ID
  
      var isEmpty = false

      if(ncofiRecords){
        ncofiRecords.forEach((item)=>{
          if(item.AuditID == auditid){
            if(item.Pending.length == 0){
              isEmpty = true
            }
          }
        })
      }
    
  
      var key = CryptoJS.enc.Utf8.parse('8080808080808080');
      var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  
      var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(pwd), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
  
  
      auth.loginUser(username, encryptedpassword.toString(), '', this.state.deviceId, (res,data) => {
        if(data.data.Success == true){
          if(isEmpty){
            this.setState({
              confirmpwd : false,
              pwdentry:undefined,
            },()=>{
              this.toast.show(strings.noncofitosync, DURATION.LENGTH_SHORT)
            })
          }
          else{
            this.setState({
              // confirmpwd : false,
              pwdentry:undefined,
            },()=>{
              this.CheckInternetConnectivityNCOFI()
            })
          }
        }
        else{
          this.setState({
            pwdentry:undefined,
            isEmptyPwd:data.data.Message
          },()=>{
          })
        }
      })
    }
    else{
      this.toast.show(strings.No_sync, DURATION.LENGTH_LONG)
    }
  })
    }
  }

  render() {
    console.log('CURRENT_PAGE--->', 'NCOFIPage')
    console.log('this.state.currentUserData?.accessToken--->', this.state.currentUserData?.accessToken)
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
        {/* <OfflineNotice /> */}

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: "stretch",
            width: "100%",
            height: 60,
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.NC}/{strings.OFI}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  color: "white",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {this.state.breadCrumbText}
              </Text>
            </View>

            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              {/* <TouchableOpacity onPress={debounce(this.RefreshUpload.bind(this), 1000)} >
                <Icon name="refresh" size={25} color="white" />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Icon name="home" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.auditPageBody, { paddingTop: 10 }]}>
          {this.state.isLoaderVisible === false ? (
            <ScrollableTabView
              renderTabBar={() => (
                <DefaultTabBar
                  backgroundColor="white"
                  activeTextColor="#2CB5FD"
                  inactiveTextColor="#747474"
                  underlineStyle={{
                    backgroundColor: "#2CB5FD",
                    borderBottomColor: "#2CB5FD",
                  }}
                  textStyle={{
                    fontSize: Fonts.size.h5,
                    fontFamily: "OpenSans-Regular",
                  }}
                />
              )}
              tabBarPosition="overlayTop"
            >
              <ScrollView
                tabLabel={strings.Pending}
                style={styles.scrollViewBody}
              >
                {this.state.NCdisplay.length > 0 ? (
                  <View style={{ marginTop: 55 }}>
                    {this.state.NCdisplay.map((item, key) => (
                      <TouchableOpacity
                        onPress={this.openEditBox.bind(this, item)}
                        key={key}
                        style={styles.cardBox}
                      >
                        <View style={styles.sectionTop}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              NC {strings.Number}
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
                              {/* {item.ncIdentifier} */}
                              {console.log('NC/OFI item', item)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={{ marginTop: 55 }}>
                    <Text style={styles.norecordefound}>
                      {strings.No_records_found}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <ScrollView
                tabLabel={strings.Uploaded}
                style={styles.scrollViewBody}
              >
                {this.state.NCUpload.length > 0 ? (
                  <View style={{ marginTop: 55 }}>
                    {this.state.NCUpload.map((item, key) => (
                      
                      <TouchableOpacity
                        onPress={this.getSectionListItem.bind(this, item)}
                        key={key}
                        style={styles.cardBox}
                      >
                        <View style={styles.sectionTop}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              {strings.ncnumber}
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
                    ))}
                  </View>
                ) : (
                  <View style={{ marginTop: 55 }}>
                    <Text style={styles.norecordefound}>
                      {strings.No_records_found}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </ScrollableTabView>
          ) : (
            <View
              style={{
                backgroundColor: "transparent",
                position: "absolute",
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: Window.width,
                  height: Window.height,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Bars size={20} color="#1CB8CA" />
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  {strings.Syncing_NC}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 65,
            }}
          >
            {/* <Image source={Images.Footer}/> */}
            <View style={styles.footerDiv}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ width: width(34), justifyContent: "center" }}>
                  <TouchableOpacity
                    onPress={once(this.onNavigaTo.bind(this, 1))}
                    style={{ alignItems: "center" }}
                  >
                    <ResponsiveImage
                      source={Images.uploadToServerIcon}
                      initWidth="50"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: Fonts.size.medium,
                        fontFamily: "OpenSans-Regular",
                      }}
                    >
                      {strings.Create_NC}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: width(34) }}>
                  <TouchableOpacity
                    onPress={() => this.checkOffline()}
                    style={{ alignItems: "center" }}
                  >
                    <ResponsiveImage
                      source={Images.syncImg}
                      initWidth="40"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: Fonts.size.medium,
                        fontFamily: "OpenSans-Regular",
                      }}
                    >
                      {strings.Upload_to_server}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: width(34) }}>
                  <TouchableOpacity
                    onPress={once(this.onNavigaTo.bind(this, 2))}
                    style={{ alignItems: "center" }}
                  >
                    <ResponsiveImage
                      source={Images.uploadToServerIcon}
                      initWidth="50"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: Fonts.size.medium,
                        fontFamily: "OpenSans-Regular",
                      }}
                    >
                      {strings.Create_OFI}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <Toast ref={(toast) => this.toast = toast} position="top" opacity={0.8} />

        <ConfirmDialog
          title={strings.NC_title}
          message={strings.NC_title_message}
          titleStyle={{ fontFamily: "OpenSans-SemiBold" }}
          messageStyle={{ fontFamily: "OpenSans-Regular" }}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: strings.yes,
            // onPress: this.CheckInternetConnectivityNCOFI.bind(this)
            onPress: () =>
              this.setState({ confirmpwd: true, dialogVisible: false }),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({ dialogVisible: false }),
          }}
        />

        <Modal
          isVisible={this.state.isMissingFindings}
          onBackdropPress={() => this.setState({ isMissingFindings: false })}
        >
          <View style={styles.missingModal}>
            <View style={styles.missingMContainer}>
              <Text
                style={{
                  fontSize: 22,
                  color: "#2EA4E2",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {strings.Missingattachmentalert}
              </Text>
            </View>

            {/* body */}
            <View style={styles.missingBody}>
              <View style={styles.missingBodyHeader}>
                <Text style={styles.bodyText1}>
                  {
                    strings.ThefollowingNCOFIsaredetectedwithmissingattachmentfiles
                  }
                </Text>
                <Text style={styles.bodyText2}>
                  {strings.Doyouwishtocontinuethesyncprocess}
                </Text>
              </View>
              <ScrollView style={styles.scrollBody}>
                {this.state.missingFindings.map((items, i) => (
                  <View key={i} style={styles.carddivMissing}>
                    <View style={styles.cardContMissing}>
                      <View style={styles.cardSecMissing}>
                        <Text style={{ fontFamily: "OpenSans-Regular" }}>
                          {strings.ncnumber}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#37057E",
                            fontFamily: "OpenSans-Regular",
                          }}
                        >
                          {"items.NCNumber"}
                        </Text>
                      </View>
                      <View style={styles.cardsec2Missing}>
                        <Text style={{ fontFamily: "OpenSans-Regular" }}>
                          {strings.nonconfirmity}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 15,
                            color: "#070F6E",
                            fontFamily: "OpenSans-Regular",
                          }}
                        >
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
                style={styles.cardBtnDiv}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "red",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.goBack}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ isMissingFindings: false }, () => {
                    this.syncNCOFIToServer();
                  })
                }
                style={styles.cardBtn2Div}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "green",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.skipandcontinue}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal */}
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <View style={styles.ncModal}>
            <View style={styles.modalheader}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 23,
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.NC_OFI_Detail}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.scrollview}>
              <View style={{ marginTop: 10 }}>
                <View style={styles.firstCard}>
                  <Text style={styles.boxHeader}>{strings.ncnumber}</Text>
                  <Text style={styles.boxContent}>
                    {this.state.NCmodalheader}
                  </Text>
                </View>

                <View style={styles.commoncard}>
                  <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                    {strings.Non_confirmityL}
                  </Text>
                  <Text style={styles.boxContent}>{this.state.NCtext}</Text>
                </View>

                {this.state.miniLoading === false ? (
                  <View>
                    {this.state.loadingData === false ? (
                      <View>
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                            {strings.Date_of_upload}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.UploadDate
                              ? this.changeDateFormatCard(
                                  this.state.UploadDate
                                ) != ""
                                ? this.changeDateFormatCard(
                                    this.state.UploadDate
                                  )
                                : "-"
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                            {strings.ResponsibilityL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Responsible === ""
                              ? "-"
                              : this.state.Responsible}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                            {strings.RequestedL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Request === ""
                              ? "-"
                              : this.state.Request}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                            {strings.CategoryL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Category === ""
                              ? "-"
                              : this.state.Category}
                          </Text>
                        </View>
                        {/*
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>{strings.ResponseLD}</Text>
                          <Text style={styles.boxContent}>{this.state.Response != "-"  && this.state.Response? this.changeDateFormat(this.state.Response) != '' ? this.changeDateFormat(this.state.Response) : '-' : '-'}</Text>
                        </View>
                    */}

                        <View style={styles.lastcard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>
                            {strings.StandardRequirementsL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.StandText === ""
                              ? "-"
                              : this.state.StandText}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: "100%",
                          height: 200,
                          justifyContent: "center",
                          alignContent: "center",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Icon name="hourglass" size={20} color="black" />
                          <Text style={{ fontFamily: "OpenSans-Regular" }}>
                            {strings.Loading}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      top: 90,
                      height: 200,
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {/* <Icon  name="spinner" size={20} color="black"/>
          <Text>{strings.failed}</Text>  */}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => this.closeReset()}
              style={styles.closeDiv}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: Fonts.size.regular,
                    color: "#00a1e2",
                    top: 20,
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.Close}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.confirmpwd}
          // onBackdropPress={()=>this.setState({confirmpwd:false})}
        >
          <View
            style={{
              width: "100%",
              height: 350,
              backgroundColor: "white",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ confirmpwd: false })}
            >
              <Icon
                name="times-circle"
                style={{ alignSelf: "flex-end" }}
                size={30}
                color="#2EA4E2"
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: "#2EA4E2",
                    fontFamily: "OpenSans-Bold",
                  }}
                >
                  {strings.enterthepasswordtocontinuesyncprocess}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "grey",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.Username}
                </Text>
                <TextInput
                  value={this.props.data.audits.loginuser}
                  editable={false}
                  style={{
                    fontSize: 20,
                    color: "lightgrey",
                    fontFamily: "OpenSans-Bold",
                    borderBottomColor: "lightgrey",
                    borderBottomWidth: 0.7,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "grey",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.Password}
                </Text>
                <TextInput
                  value={this.state.pwdentry}
                  style={{
                    fontSize: 20,
                    color: "black",
                    fontFamily: "OpenSans-Bold",
                    borderBottomColor: "lightgrey",
                    borderBottomWidth: 0.7,
                  }}
                  secureTextEntry={true}
                  onChangeText={(text) =>
                    this.setState({ pwdentry: text, isEmptyPwd: undefined })
                  }
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: "red",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {this.state.isEmptyPwd ? this.state.isEmptyPwd : null}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.onConfirmPwdPress()}
                  style={{
                    width: null,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#2EA4E2",
                    borderRadius: 30,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "OpenSans-Bold",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    {strings.continue}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    data: state
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    storeNCRecords: (ncofiRecords) => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
    clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
    storeServerUrl: (serverUrl) => dispatch({ type: 'STORE_SERVER_URL', serverUrl }),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NCOFIPage)