import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
// import { Dialog, ProgressDialog } from 'react-native-simple-dialogs';
import {Images} from '../Themes';
import styles from '../styles/AuditAttachStyle';
import {width} from 'react-native-dimension';
import Moment from 'moment';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Pulse} from 'react-native-loader';
import auth from '../../../services/Auditpro-Auth';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import {strings} from '../language/Language';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from 'xlsx'; // Import the xlsx library
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLottieView from 'lottie-react-native';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import GlobalHeader from 'components/GlobalHeader';

let Window = Dimensions.get('window');

class AuditAttach extends React.Component {
  constructor(props) {
    super(props);
    console.log('get this.props', this.props)
    this.state = {
      isVisible : false,
      pageLoad: true,
      ChineseScript: false,
      History: [],
      AuditID: '',
      NetInfo: false,
      breadCrumbText: '',
      currentUserData: [],
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
    };
  }

  componentDidMount() {
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    this.setState(
      {
        breadCrumbText: this.props?.route?.params?.breadCrumb,
        AuditID: this.props?.route?.params?.AuditID,
      },
      () => {
        // console.log('Bobby', this.props.navigation.state.params);
        if (this.props?.route?.params?.isDeleted == 1) {
          this.showToast(strings.AttachDelSuccess, DURATION.LENGTH_SHORT);
          this.getHistory();
        } else if (this.props?.route?.params?.isDeleted == 2) {
          this.showToast(strings.AttachUpload, DURATION.LENGTH_SHORT);
          this.getHistory();
        } else {
          console.log('No toast');
          this.getHistory();
        }
      },
    );
  }

  async getAccessToken(){
    try {
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
      console.log('current userdata--->', value?.accessToken)
      if (value !== null) {
        // value previously stored
        console.log('current token2--->', value)
        this.setState({ currentUserData: value },()=>{
          console.log('Token set')
        })
      }
      return value;
    } catch (e) {
      // error reading value
      console.log('error--->', e)
      return null;
    }
  };

  showToast = (...args) => {
    if (this.toast && this.toast.show) {
      this.toast.show(...args);
    }
  };

  componentWillReceiveProps() {
    // var getCurrentPage = [] 
    // getCurrentPage = this.props.data.nav.routes
    // var CurrentPage = getCurrentPage[getCurrentPage.length-1].routeName
    var CurrentPage = this.props.route.name;
    console.log('--CurrentPage--->', CurrentPage)
    if (CurrentPage == 'AUDIT_ATTACH') {
      this.getHistory();
    }
  }

  Refresh() {
    console.log('Refresh pressed');
    this.getHistory();
  }

  async getHistory() {
    const storedUserData = await this.getAccessToken()
    if (this.props.data.audits.isOfflineMode) {
      this.setState({pageLoad: false, NetInfo: true}, () => {
        console.log('Page load is off');
        this.showToast(strings.Offline_Notice, DURATION.LENGTH_SHORT);
      });
    } else {
      NetInfo.fetch().then(isConnected => {
        if (isConnected.isConnected) {
          var auditRecords = this.props.data.audits.auditRecords;
          //   var Token = this.props.data.audits.token;
          console.log('this.state.currentUserData-->', this.state.currentUserData)
          var Token = storedUserData?.accessToken || storedUserData?.token || this.state.currentUserData?.accessToken || this.props.data.audits.token
          // var SiteId = this.props.data.audits.siteId;
          var SiteId = storedUserData?.siteId || this.state.currentUserData?.siteId || this.props.data.audits.siteId;
          var ObjectiveEvidence = this.props.data.audits;
          console.log('objEvi==>', this.props.data.audits, ObjectiveEvidence);
          var RequestParam = [];

          var auditRecords = this.props.data.audits.auditRecords;
          for (var i = 0; i < auditRecords.length; i++) {
            if (this.state.AuditID === auditRecords?.[i]?.AuditId) {
              console.log(
                'hello',
                auditRecords?.[i]?.AuditId,
                this.state.AuditID,
              );
              RequestParam.push({
                AuditId: auditRecords?.[i]?.AuditId,
                AuditProgramId: auditRecords?.[i]?.AuditProgramId,
                AuditProgramOrder: auditRecords?.[i]?.AuditProgOrder,
                AuditTypeOrder: auditRecords?.[i]?.AuditTypeOrder,
                AuditTypeId: auditRecords?.[i]?.AuditTypeId,
                AuditOrder: auditRecords?.[i]?.AuditOrderId,
              });
            }
          }
          console.log('RequestParam-->', RequestParam);

          var Request =
            RequestParam[0].AuditId +
            '_' +
            RequestParam[0].AuditProgramId +
            '_' +
            RequestParam[0].AuditProgramOrder +
            '_' +
            RequestParam[0].AuditTypeId +
            '_' +
            RequestParam[0].AuditOrder;
          var param = [];
          param.push({
            Request: Request,
            SiteId: SiteId,
          });
          console.log('Param-->', param);

          auth.getStatusHistory(param, Token, (res, data) => {
            console.log('response', data, param, Token);
            if (data.data) {
              if (data.data.Message === 'Success') {
                var HistoryArr = data.data.Data;
                var HistoryForm = [];
                for (var i = 0; i < HistoryArr.length; i++) {
                  HistoryForm.push({
                    Type: HistoryArr?.[i]?.AttachmentType,
                    UncontrolledLink:
                      HistoryArr?.[i]?.RefPath === null
                        ? '-'
                        : HistoryArr?.[i]?.RefPath,
                    FileName:
                      HistoryArr?.[i]?.ObjectiveEvidence === null
                        ? ''
                        : HistoryArr?.[i]?.ObjectiveEvidence,
                    Comments: HistoryArr?.[i]?.Comments,
                    key: HistoryArr?.[i]?.Id,
                    filedata: HistoryArr?.[i]?.File,
                    fileName: HistoryArr?.[i]?.FileName,
                    UploadedBy: HistoryArr?.[i]?.UploadedBy,
                    Uploadedon: HistoryArr?.[i]?.UploadedOn,
                  });
                } 

                HistoryForm =  HistoryForm.sort(
                  (p1, p2) => 
                  (p1.key < p2.key) ? 1 : (p1.key > p2.key) ? -1 : 0);
                this.setState(
                  {History: HistoryForm, pageLoad: false, NetInfo: false},
                  () => {
                    console.log('demo data', this.state.History);
                  },
                );
              } else {
                this.setState({pageLoad: false}, () => {
                  this.showToast(strings.ErrFetch, DURATION.LENGTH_SHORT);
                });
              }
            } else {
              this.setState({pageLoad: false}, () => {
                this.showToast(strings.ErrFetch, DURATION.LENGTH_SHORT);
              });
            }
          });
        } else {
          this.setState({pageLoad: false, NetInfo: true}, () => {
            console.log('Page load is off');
            this.showToast(strings.NoInternet, DURATION.LENGTH_SHORT);
          });
        }
      });
    }
  }

  onPress(item) {
    console.log('Pressed', item);

    this.props.navigation.navigate(ROUTES.CREATE_ATTACH, {
      AuditID: this.state.AuditID,
      Type: 'Edit',
      EditDetails: item,
      breadCrumb: this.state.breadCrumbText,
    });
  }

  changeDateFormat = inDate => {
    console.log('--->', this.state.selectedFormat);
    var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
    var sDateArr = inDate.split('T');
    var sDateValArr = sDateArr[0].split('-');
    var sTimeValArr = sDateArr[1].split(':');
    var outDate = new Date(
      sDateValArr[0],
      sDateValArr[1] - 1,
      sDateValArr[2],
      sTimeValArr[0],
      sTimeValArr[1],
    );
    return Moment(outDate).format(DefaultFormatL);
  };

  addOfflineMode() {
    console.log('offline');
    this.showToast(strings.Offline_Notice, DURATION.LENGTH_SHORT);
  }

  initiateDownload(docid){ 
    if (docid === 0 || docid.trim() === "0" || docid === null || docid === undefined ){
      this.setState({
        isVisible : false
      }, () => {
      this.showToast('File is not synced with server yet, please try after sometime.', DURATION.LENGTH_LONG);
      });
      return false;
    }

    var Token = this.props.data.audits.token;
    auth.downloadFile(docid, Token, (res, data) => {
      console.log('getFiles File download response', data);
      if (data.data.Message == 'Success') {
          this.WriteAttachments(data.data.Data);    
      } else {
        this.showToast(strings.server_error, DURATION.LENGTH_LONG);
      }
    });    
  }

  async WriteAttachments(data) {  
   
    let newFilePath =
        '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles'); 

    var newfileName = 'file_' + data.DocId + '.' + data.FileName.substring(data.FileName.lastIndexOf('.') + 1);
    newFilePath = newFilePath + '/' + newfileName;

    await  RNFetchBlob.fs.exists(newFilePath).then(exist => {
      if (!exist || exist == '') {
          RNFetchBlob.fs
          .writeFile(newFilePath,data.FileData,'base64',)
        .then(res => {
          console.log('Attachment:File Written', res);          
          this.openFile(newFilePath);          
        })
        .catch(err => {
          console.log('Attachment:Err:' + err);                
        });
      }
      else {        
        this.setState({
          isVisible : false
        }, () => {
          setTimeout( () => {
          this.openFile(newFilePath);
          },10);
        })
      }
    });   
  }

  openFile = async filePath => {
    var extension = filePath;
    const parts = extension.split('.');
    const fileType = parts[parts.length - 1];
    console.log('File pathchecking-------: ', filePath);
    console.log('File extension: ', fileType, filePath);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
        FileViewer.open(filePath, {showOpenWithDialog: true })
        
        .catch((error) => {
          this.setState({isVisible : false})
        });
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

  render() {
    const {History} = this.state;
    console.log('Hist', History);
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
          <GlobalHeader
            title={strings.AuditAttach}
            subtitle={this.state.breadCrumbText}
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={() =>
              this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)
            }
            containerStyle={{backgroundColor: 'transparent'}}
          />
     
        <View style={styles.simpleTabContainer}>
          <View style={styles.simpleTabBar}>
            <Text style={styles.simpleTabText}>{strings.History}</Text>
          </View>
          {this.state.History.length > 0 ? (
            <View style={styles.scrollViewBody}>
              {this.state.NetInfo === true ? (
                <View
                  style={{
                    marginTop: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    styles={{
                      fontSize: Fonts.size.h3,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.NoInternet}
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 50}}>
                  {this.state.pageLoad === true ? (
                    <View
                      style={{
                        width: Window.width,
                        height: null,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Pulse size={30} color={'#48BCF7'} />
                    </View>
                  ) : (
                    <FlatList
                      data={History}
                      keyExtractor={item => item.key}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => {
                            this.onPress(item);
                          }}
                          style={styles.card}>
                          <View style={styles.card1}>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachType}
                              </Text>
                              <Text style={styles.detailContent}>
                                {item.Type === 'Controlled' || item.Type === 'Attachment'
                                  ? 'Attachment'
                                  : item.Type}
                              </Text>
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachName}
                              </Text>
                              <TouchableOpacity onPress={(index) => {
                                let url = item.UncontrolledLink;
                                url = url.indexOf("http") !== 0 ? 'https://' + url : url;
                                if (item.Type === 'Link') { Linking.openURL(url);} else if (item.Type === 'Attachment'){
                                  this.setState({
                                    isVisible : true
                                  }, () => {
                                    this.initiateDownload(item.UncontrolledLink);
                                  })
                                }
                              }}>
                              <View>
                              <Text 
                                style={[styles.detailContent,{color:'blue',
                                 textDecorationLine:item.Type === 'Link' ?'underline' : ''}]}
                                numberOfLines={1}>
                                {item.Type === 'UnControlled' || item.Type === 'Link'
                                  ? item.UncontrolledLink
                                  : item.FileName}
                              </Text> 
                              
                              </View>
                              </TouchableOpacity>                
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachCom}
                              </Text>
                              <Text
                                style={styles.detailContent}
                                numberOfLines={1}>
                                {item.Comments === 'null' ||
                                item.Comments === null
                                  ? '-'
                                  : item.Comments}
                              </Text>
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.UploadedOn}
                              </Text>
                              <Text style={styles.detailContent}>
                                {this.changeDateFormat(item.Uploadedon)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.scrollViewBody}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: SPACING.NORMAL,
                }}>
                <AnimatedLottieView
                  source={require('../../../assets/lottie/norecords.json')}
                  autoPlay
                  loop
                  style={{
                    width: Window.width * 0.5,
                    height: Window.width * 0.5,
                  }}
                />
                <Text style={styles.noRecordsText}>
                  {strings.No_records_found}
                </Text>
              </View>
            </View>
          )}

        </View>
        {/** Floating add button */}
        <TouchableOpacity
          onPress={
            this.state.NetInfo === true
              ? () => this.addOfflineMode()
              : () =>
                  this.props.navigation.navigate(ROUTES.CREATE_ATTACH, {
                    AuditID: this.state.AuditID,
                    Type: 'Add',
                    EditDetails: [],
                    breadCrumb: this.state.breadCrumbText,
                  })
          }
          style={styles.floatingButton}>
          <Icon name="plus" size={25} color="white" />
          {/* <Text style={styles.floatingLabel}>{strings.AddIcon}</Text> */}
        </TouchableOpacity>
        <Toast
          // ref="toast"
          ref={(toast) => this.toast = toast}
          style={{backgroundColor: 'black', margin: 20}}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
      <View>
        {/* <ProgressDialog
              titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
              messageStyle={{fontFamily: 'OpenSans-Regular'}}
              visible={this.state.isVisible}
              message={'File is loading, Please Wait!!'}
              onTouchOutside={() => this.setState({isVisible: false})} 
            /> */}
      </View>
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
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditAttach);
