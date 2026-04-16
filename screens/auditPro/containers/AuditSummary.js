import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import {Images} from '../Themes';
import styles from '../styles/AuditSummaryStyle';
import {width, height} from 'react-native-dimension';

import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import auth from '../../../services/Auditpro-Auth';
import OfflineNotice from '../components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../language/Language';
import * as Animatable from 'react-native-animatable';
import FS from '../../../services/ReactNativeFS';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import { log } from 'ramdasauce';
import GlobalHeader from 'components/GlobalHeader';

let Window = Dimensions.get('window');

class AuditSummary extends Component {
  constructor(props) {
    super(props);
    console.log('get this.props', this.props)
    this.state = {
      AuditID: this.props?.route?.params?.AuditID,
      CheckList: [],
      CheckPoint: [],
      Online: 0,
      Reference: 0,
      Templates: 0,
      dCheckList: 0,
      dTotalNC: 0,
      displayData: [],
      dTotalNC: 0,
      dProcessNC: 0,
      dMajorNC: 0,
      dMinorNC: 0,
      dTotalOFI: 0,
      dProcessOFI: 0,
      dMajorOFI: 0,
      dMinorOFI: 0,
      breadCrumbText: '',
      FileStorage: [],
    };
  }

  getFSData() {
    FS.ReadFile(res => {
      console.log('Getting callback for', res);
    });
  }

  componentDidMount() {
    this.getFSData();
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
    console.log('AuditSummary mounted', this.props);
    console.log(
      'Coming from params',
    //   this.props.navigation.state.params.AuditID,
      this.props?.route?.params?.AuditID
    );
    this.setState(
      {
        // breadCrumbText: this.props.navigation.state.params.breadCrumbText,
        breadCrumbText: this.props?.route?.params?.breadCrumbText,
        // breadCrumbText:this.props.navigation.state.params.breadCrumbText.length>30?this.props.navigation.state.params.breadCrumbText.slice(0,30)+'...':this.props.navigation.state.params.breadCrumbText
      },
      () => {
        console.log('breadCrumbText:', this.state.breadCrumbText);
        this.getCheckListDetails();
        this.getNCs();
      },
    );
  }

  getCheckListDetails() {
    var AuditOrg = this.props.data.audits.auditRecords;
    var CheckList = [];
    var CheckPoints = [];
    for (var i = 0; i < AuditOrg.length; i++) {
      if (this.state.AuditID == AuditOrg[i].AuditId) {
        for (var j = 0; j < AuditOrg[i].CheckListPropData.length; j++) {
          if (
            AuditOrg[i].CheckListPropData[j].CompLevelId == 3
            //|| AuditOrg[i].CheckListPropData[j].CompLevelId == 2
          ) {
            //|| AuditOrg[i].CheckListPropData[j].CompLevelId == 1) {
            CheckList.push(AuditOrg[i].CheckListPropData[j]);
          }
        }
      }
    }

    for (var i = 0; i < AuditOrg.length; i++) {
      if (this.state.AuditID == AuditOrg[i].AuditId) {
        for (var j = 0; j < AuditOrg[i].Listdata.length; j++) {
          if (AuditOrg[i].Listdata[j].CompLevelId == 4) {
            CheckPoints.push(AuditOrg[i].Listdata[j]);
          }
        }
      }
    }

    this.setState(
      {
        dCheckList: CheckList.length > 0 ? CheckList.length : 0,
        CheckList: CheckList,
        CheckPoint: CheckPoints,
      },
      () => {
        console.log('Total CheckList', this.state.CheckList);
        console.log('Total CheckPoints', this.state.CheckPoint);
        this.getcalculateForm();
      },
    );
  }

  getcalculateForm() {
    var AuditOrg = this.props.data.audits.auditRecords;
    var Online = [];
    var Reference = [];
    var Templates = [];
    for (var i = 0; i < AuditOrg.length; i++) {
      if (this.state.AuditID == AuditOrg[i].AuditId) {
        if (AuditOrg[i].Formdata) {
          for (var j = 0; j < AuditOrg[i].Formdata.length; j++) {
            if (AuditOrg[i].Formdata[j].FormType == 1) {
              Online.push(AuditOrg[i].Formdata[j]);
            } else if (AuditOrg[i].Formdata[j].FormType == 0) {
              Templates.push(AuditOrg[i].Formdata[j]);
            } else if (AuditOrg[i].Formdata[j].FormType == 2) {
              Reference.push(AuditOrg[i].Formdata[j]);
            }
          }
        } else {
          console.log('No forms detected');
        }
      }
    }
    console.log('Online form', Online);
    console.log('Templates form', Templates);
    console.log('Reference form', Reference);

    this.setState(
      {
        Online: Online.length > 0 ? Online.length : 0,
        Templates: Templates.length > 0 ? Templates.length : 0,
        Reference: Reference.length > 0 ? Reference.length : 0,
      },
      () => {
        console.log('Online form', this.state.Online);
        console.log('Templates form', this.state.Templates);
        console.log('Reference form', this.state.Reference);
        if (this.state.dCheckList > 0) {
          this.getCheckStatistic();
        } else {
          console.log('No checklist');
        }
      },
    );
  }

  getCheckStatistic() {
    var CheckListData = this.state.CheckList;
    var CheckpointData = this.state.CheckPoint;
    var CheckDetailObj = [];

    if (CheckListData) {
      if (CheckListData.length > 0) {
        for (var i = 0; i < CheckListData.length; i++) {
          var TotalCheckPoint = 0;
          var MandateCheck = 0;
          var Completed = 0;

          for (var j = 0; j < CheckpointData.length; j++) {
            if (
              CheckListData[i].ChecklistTemplateId == CheckpointData[j].ParentId
            ) {
              TotalCheckPoint++;
              if (
                CheckpointData[j].AttachforNc == 1 &&
                CheckpointData[j].RemarkforNc == 0
              ) {
                if (CheckpointData[j].Attachment != '') {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else if (
                CheckpointData[j].AttachforOfi == 1 &&
                CheckpointData[j].RemarkforOfi == 0
              ) {
                if (CheckpointData[j].Attachment != '') {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else if (
                CheckpointData[j].AttachforOfi == 0 &&
                CheckpointData[j].RemarkforOfi == 1
              ) {
                if (CheckpointData[j].Remark != '') {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else if (
                CheckpointData[j].AttachforNc == 0 &&
                CheckpointData[j].RemarkforNc == 1
              ) {
                if (CheckpointData[j].Remark != '') {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else if (
                CheckpointData[j].AttachforNc == 1 &&
                CheckpointData[j].RemarkforNc == 1
              ) {
                if (
                  CheckpointData[j].Remark != '' &&
                  CheckpointData[j].Attachment != ''
                ) {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else if (
                CheckpointData[j].AttachforOfi == 1 &&
                CheckpointData[j].RemarkforOfi == 1
              ) {
                if (
                  CheckpointData[j].Remark != '' &&
                  CheckpointData[j].Attachment != ''
                ) {
                  Completed++;
                } else {
                  MandateCheck++;
                }
              } else {
                Completed++;
              }
            }
          }
          CheckDetailObj.push({
            CheckListName: CheckListData[i].ChecklistName,
            TotalCheckPoint: TotalCheckPoint,
            MandateCheck: MandateCheck,
            Completed: Completed,
          });
        }
        console.log('CheckDetailObj--->', CheckDetailObj);
      } else {
        console.log('No checklist found');
      }
    }

    this.setState(
      {
        displayData: CheckDetailObj,
      },
      () => {
        console.log('CheckDetailObj', this.state.displayData);
      },
    );
  }

  getNCs() {
    var NCdata = this.props.data.audits.ncofiRecords;
    console.log('NCdata', NCdata);

    if (NCdata.length > 0) {
      for (var i = 0; i < NCdata.length; i++) {
        var TotalNC = 0;
        var ProcessNC = 0;
        var MajorNC = 0;
        var MinorNC = 0;
        var TotalOFI = 0;
        var ProcessOFI = 0;
        var MajorOFI = 0;
        var MinorOFI = 0;
        console.log('heckconditionn,',this.state.AuditID);
        console.log('heckconditionn,2',NCdata[0].AuditID);

        
        if (this.state.AuditID == NCdata[i].AuditID) {
            console.log('NCs found for this audit');

          for (var j = 0; j < NCdata[i].Uploaded.length; j++) {
            // define all the OFI
            if (
              NCdata[i].Uploaded[j].Category == 'Minor' &&
              NCdata[i].Uploaded[j].CheckNC == 1
            ) {
              MinorOFI++;
            } else if (
              NCdata[i].Uploaded[j].Category == 'Major' &&
              NCdata[i].Uploaded[j].CheckNC == 1
            ) {
              MajorOFI++;
            }
            if (NCdata[i].Uploaded[j].CheckNC == 1) {
              TotalOFI++;
            }
            if (
              NCdata[i].Uploaded[j].ProcessName != '' &&
              NCdata[i].Uploaded[j].CheckNC == 1
            ) {
              ProcessOFI++;
            }
            // define all NCs
            if (NCdata[i].Uploaded[j].CheckNC == 0) {
              TotalNC++;
            }
            if (
              NCdata[i].Uploaded[j].ProcessName != '' &&
              NCdata[i].Uploaded[j].CheckNC == 0
            ) {
              ProcessNC++;
            }
            if (
              NCdata[i].Uploaded[j].Category == 'Minor' &&
              NCdata[i].Uploaded[j].CheckNC == 0
            ) {
              MinorNC++;
            } else if (
              NCdata[i].Uploaded[j].Category == 'Major' &&
              NCdata[i].Uploaded[j].CheckNC == 0
            ) {
              MajorNC++;
            }
          }
          for (var k = 0; k < NCdata[i].Pending.length; k++) {
            // define pending NCs
            if (NCdata[i].Pending[k].Category == 'NC') {
              TotalNC++;
            }
            if (
              NCdata[i].Pending[k].Category == 'NC' &&
              NCdata[i].Pending[k].selectedItemsProcess.length > 0
            ) {
              ProcessNC++;
            }
            if (
              NCdata[i].Pending[k].Category == 'NC' &&
              NCdata[i].Pending[k].categoryDrop.value == 'Major'
            ) {
              MajorNC++;
            } else if (
              NCdata[i].Pending[k].Category == 'NC' &&
              NCdata[i].Pending[k].categoryDrop.value == 'Minor'
            ) {
              MinorNC++;
            }
            // defining OFI
            if (NCdata[i].Pending[k].Category == 'OFI') {
              TotalOFI++;
            }
            if (
              NCdata[i].Pending[k].Category == 'OFI' &&
              NCdata[i].Pending[k].selectedItemsProcess.length > 0
            ) {
              ProcessOFI++;
            }
            if (
              NCdata[i].Pending[k].Category == 'OFI' &&
              NCdata[i].Pending[k].categoryDrop.value == 'Major'
            ) {
              MajorOFI++;
            } else if (
              NCdata[i].Pending[k].Category == 'OFI' &&
              NCdata[i].Pending[k].categoryDrop.value == 'Minor'
            ) {
              MinorOFI++;
            }
          }
        }else{
          console.log('No NCs found for this audit');
        }
        this.setState(
          {
            dTotalNC: TotalNC,
            dProcessNC: ProcessNC,
            dMajorNC: MajorNC,
            dMinorNC: MinorNC,
            dTotalOFI: TotalOFI,
            dProcessOFI: ProcessOFI,
            dMajorOFI: MajorOFI,
            dMinorOFI: MinorOFI,
          },
          () => {
            AsyncStorage.setItem('TotalNCValues', JSON.stringify(TotalNC));
            console.log('MajorOFI', this.state.dMajorOFI);
            console.log('MinorOFI', this.state.dMinorOFI);
            console.log('TotalOFI', this.state.dTotalOFI);
            console.log('ProcessOFI', this.state.dProcessOFI);

            console.log('TotalNC', this.state.dTotalNC);
            console.log('ProcessNC', this.state.dProcessNC);
            console.log('MajorNC', this.state.dMajorNC);
            console.log('MinorNC', this.state.dMinorNC);
          },
        );
      }
    } else {
      console.log('No logs');
    }
  }

  render() {
    console.log('CURRENT_PAGE--->', 'AuditSummary')
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        <GlobalHeader
          title={strings.AudiSummary}
          subtitle={this.state.breadCrumbText}
          onLeftPress={() => this.props.navigation.goBack()}
          onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
          containerStyle={{backgroundColor: 'transparent'}}
        />
    
        <View style={styles.subHeading}>
          <Text style={styles.subText}>{strings.audit}</Text>
        </View>
        <ScrollView style={styles.scrollViewBody}>
          <View style={styles.Carddiv1}>
            <View style={styles.box1}>
              <TouchableOpacity style={styles.boxcard}>
                <Text style={styles.TextStyle}>
                  {strings.Total_Online_forms}
                </Text>
                  <View>
                    <Text style={styles.TextStyle1}>{this.state.Online}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boxcard1}>
                <Text style={styles.TextStyle}>{strings.Total_References}</Text>
                  <View>
                    <Text style={styles.TextStyle1}>
                      {this.state.Reference}
                    </Text>
                  </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box1}>
              <TouchableOpacity style={styles.boxcard2}>
                <Text style={styles.TextStyle}>{strings.Total_Templates}</Text>
              
                  <View>
                    <Text style={styles.TextStyle1}>
                      {this.state.Templates}
                    </Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boxcard3}>
                <Text style={styles.TextStyle}>{strings.Total_CheckLists}</Text>
               
                  <View>
                    <Text style={styles.TextStyle1}>
                      {this.state.dCheckList}
                    </Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.Carddiv1}>
            <View style={styles.box1}>
              <TouchableOpacity style={styles.boxcard}>
                <Text style={styles.TextStyle}>{strings.Total_NC}</Text>
              
                  <View>
                    <Text style={styles.TextStyle1}>{this.state.dTotalNC}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boxcard}>
                <Text style={styles.TextStyle}>{strings.Total_OFI}</Text>
              
                  <View>
                    <Text style={styles.TextStyle1}>
                      {this.state.dTotalOFI}
                    </Text>
                  </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.box1, {justifyContent: 'center'}]}>
              <TouchableOpacity style={styles.boxcard31}>
                <Text style={styles.TextStyle}>
                  {strings.Total_CheckPoints}
                </Text>
              
                  <View>
                    <Text style={styles.TextStyle1}>
                      {this.state.CheckPoint.length}
                    </Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditSummary);
