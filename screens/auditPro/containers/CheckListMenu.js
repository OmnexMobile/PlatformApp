import React, {Component} from 'react';
import {
  View,
  InteractionManager,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  LogBox,
} from 'react-native';
import {Images} from '../Themes/index';
import styles from '../styles/CheckListMenuStyle';
import {connect} from 'react-redux';
import OfflineNotice from '../components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts';
import {strings} from '../language/Language';
import {debounce, once} from 'underscore';
import LinearGradient from 'react-native-linear-gradient';
import { stat } from 'react-native-fs';
import { ROUTES } from 'constants/app-constant';
import { SPACING} from 'constants/theme-constants';

import localStorage from 'global/localStorage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isTablet = Math.min(screenWidth, screenHeight) >= 768;
const circleSize = isTablet
  ? Math.min(screenWidth, screenHeight) * 0.05  // Smaller scale for iPad
  : Math.min(screenWidth, screenHeight) * 0.08; // Normal for phones
const fontSize = circleSize * 0.28;
class CheckListMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayData: [],
      checkListdata: [],
      token: '',
      CheckLogic: [],
      CheckpointP: [],
      DropDown: [],
      AuditID: '',
      CheckPointname: [],
      breadCrumbText: undefined,
      Heading: '',
      FormId: 0,
      pageLoader: true,
      optionalCheck: 0,
      totalCheck: 0,
      TemplateID: 0,
      mandatoryCheck: 0,
      AuditOrder: undefined,
      AuditProgramId: undefined,
    };
  }
  componentDidMount() {
    // ...long-running synchronous task...
    const myData = this.props;
    console.log(myData, 'vparam');

    this.LongTask();
    const { filledPercentage } = this.props.route?.params || { filledPercentage: 0 };
    console.log("Received filledPercentage:", filledPercentage);
    this.setState({ filledPercentage });

    this.props.navigation.addListener('didFocus', () => {
      this.LongTask();
    });
  }

  componentWillReceiveProps() {
    //console.log('consolenavigationparams1', this.props.navigation.state.params);
  }
  

  LongTask() {
    // console.log('consolenavigationparams', this.props.navigation.state.params);
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

    var allData = this.props.data.audits.auditRecords;
    console.log('alDataConsole', allData);
    var AuditID =
      this.props?.route?.params?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditId;
    var PropsData = [];
    var checklistData = [];
    var parentData = [];
    var displayData = [];
    var formId = this.props?.route?.params?.ChecklistHeading?.FormId
      ? this.props?.route?.params?.ChecklistHeading?.FormId
      : 0;
    var AuditOrder = undefined;
    var AuditProgramId = undefined;
    console.log('CheckListMenu>-AuditID', AuditID);
    var ListData = undefined;
    if (allData) {
      for (var i = 0; i < allData.length; i++) {
        if (AuditID === allData[i].AuditId) {
          console.log('CheckListMenu>-allData[i]', AuditID, allData[i]);
          PropsData = [...allData[i].CheckListPropData];
          ListData = allData[i].Listdata;
          AuditOrder = allData[i].AuditOrderId;
          AuditProgramId = allData[i].AuditProgramId;
        }
      }
    }
    this.countStatistics(ListData);

    if (PropsData.length > 0) {
      for (var i = 0; i < PropsData.length; i++) {
        if (parseInt(PropsData[i].FormId) == parseInt(formId)) {
          if (
            PropsData[i].CompLevelId === 2 ||
            PropsData[i].CompLevelId === 1
          ) {
            parentData.push(PropsData[i]);
          } else if (PropsData[i].CompLevelId === 3) {
            checklistData.push(PropsData[i]);
          }
        }
      }
    }

    if (parentData.length > 0) {
      const addedParentIds = new Set();
      const seriesProductionItem = parentData.find(
        item =>
          item.ChecklistName &&
          item.ChecklistName.toLowerCase() === 'series production',
      );
      const seriesProductionId = seriesProductionItem
        ? seriesProductionItem.ChecklistTemplateId
        : null;
      const p6Item = parentData.find(
        item =>
          item.ChecklistName &&
          item.ChecklistName.toLowerCase().startsWith('p6.'),
      );

      // Helper to push a parent and its checklist children once
      const appendParentWithChildren = parentItem => {
        displayData.push(parentItem);
        addedParentIds.add(parentItem.ChecklistTemplateId);
        const checklistParentId = parentItem.ChecklistTemplateId;
        for (var j = 0; j < checklistData.length; j++) {
          if (checklistData[j].ParentId == checklistParentId) {
            displayData.push(checklistData[j]);
          }
        }
      };

      for (var i = 0; i < parentData.length; i++) {
        const parentItem = parentData[i];

        // Skip if already injected (prevents duplicates when nesting)
        if (addedParentIds.has(parentItem.ChecklistTemplateId)) {
          continue;
        }

        const isSeriesProduction =
          parentItem.ChecklistName &&
          parentItem.ChecklistName.toLowerCase() === 'series production';

        // Handle Series production separately to place P6 under P5
        if (isSeriesProduction) {
          displayData.push(parentItem);
          addedParentIds.add(parentItem.ChecklistTemplateId);

          const seriesChildren = checklistData.filter(
            child => child.ParentId == parentItem.ChecklistTemplateId,
          );

          let p6Inserted = false;
          for (var sc = 0; sc < seriesChildren.length; sc++) {
            const child = seriesChildren[sc];
            displayData.push(child);

            const isP5Child =
              child.ChecklistName &&
              child.ChecklistName.toLowerCase().startsWith('p5.');

            if (!p6Inserted && p6Item && isP5Child) {
              appendParentWithChildren(p6Item);
              p6Inserted = true;
            }
          }

          // Fallback: if P5 not found, still show P6 after other series children
          if (!p6Inserted && p6Item) {
            appendParentWithChildren(p6Item);
          }

          continue;
        }

        // Skip P6 here; it is injected under P5 within Series production
        if (p6Item && parentItem.ChecklistTemplateId == p6Item.ChecklistTemplateId) {
          continue;
        }

        appendParentWithChildren(parentItem);
      }
    } else {
      for (var j = 0; j < checklistData.length; j++) {
        displayData.push(checklistData[j]);
      }
    }
    console.log(displayData, 'DisplayData===>');
    this.setState(
      {
        CheckpointP: this.props?.route?.params?.Checkpass,
        breadCrumbText: this.props?.route?.params?.Checkpass.breadCrumb,
        Heading: this.props.route.params.ChecklistHeading.FormName,
        FormId: this.props.route.params.FormId,
        ChecklistTemplateId:
          this.props?.route?.params?.ChecklistHeading?.ChecklistTemplateId,
        ParentId: this.props?.route?.params?.ChecklistHeading?.ParentId,
        AuditID: this.props?.route?.params?.AuditID,
        checkListdata: PropsData,
        displayData: displayData,
        pageLoader: false,
        AuditOrder: AuditOrder,
        AuditProgramId: AuditProgramId,
      },
      () => {
        console.log('display data', this.state.CheckpointP);
      },
    );
  }

  onCheckListPress(ChecklistTemplateId, CheckPointname) {
    this.props.navigation.navigate(ROUTES.CHECKPOINT_DEMO, {
      AuditID: this.state.AuditID,
      ChecklistTemplateId: ChecklistTemplateId,
      Check: this.state.CheckpointP,
      FormId: this.state.FormId,
      CheckPointname: CheckPointname,
      breadCrumbText: this.state.breadCrumbText,
      AuditOrder: this.state.AuditOrder,
      AuditProgramId: this.state.AuditProgramId,
      TemplateID: this.state.displayData[0].TemplateID,
      FormIdNavigate:
      this.props?.route?.params?.ChecklistHeading?.FormId,
      notifyRed: this.props?.route?.params?.notifyRed,
    });
  }
  countStatistics = checkPointsDetails => {
    console.log('---', checkPointsDetails);
    var data = checkPointsDetails;
    var pendingCheck = [];
    var completed = [];
    var mandatoryCheck = 0;
    console.log('***', checkPointsDetails);

    for (var i = 0; i < data.length; i++) {
      if (data[i].RemarkforNc === 1 && data[i].AttachforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1;
        if (
          checkPointsDetails[i].Remark === '' &&
          checkPointsDetails[i].Attachment === ''
        ) {
          pendingCheck.push(data[i]);
        } else if (
          checkPointsDetails[i].Remark === '' ||
          checkPointsDetails[i].Attachment === ''
        ) {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].RemarkforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Remark === '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].AttachforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Attachment === '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else {
        completed.push(data[i]);
      }
    }

    console.log('data length', data.length);
    console.log('completed arr-->', completed);
    console.log('pendingCheck', pendingCheck);
    console.log('mandatoryCheck', mandatoryCheck);
    console.log('Executed ---<>');

    this.setState(
      {
        optionalCheck: data.length - mandatoryCheck,
        totalCheck: data.length,
        mandatoryCheck: mandatoryCheck,
      },
      () => {},
    );
  };
  countMandate(items) {
    console.log('Checking mandate counts', items);
    console.log('displayData', this.state.displayData);
    return items.MandatoryCount;
  }
  showStatus = (checkList) => {
    var auditRecords = this.props.data.audits.auditRecords;
    // Use the same AuditID resolution logic as LongTask
    // so that percentage works regardless of how we arrived here.
    var AuditID =
      this.props?.route?.params?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditId;
    let listData = [];
    let status = checkList.MandatoryCount;
    let filledPercentage = 0; // Initialize percentage variable
  
    console.log('showStatus:checkList', checkList);
  
    for (var i = 0; i < auditRecords.length; i++) {
      if (AuditID === auditRecords[i].AuditId) {
        let audit = auditRecords[i];
        listData = audit.Listdata;
  
        const checkPoints = listData.filter((item) => {
          const matches =
            String(item.ParentId) === String(checkList.ChecklistTemplateId) &&
            String(item.FormId) === String(checkList.FormId);
        
          if (matches) {
            console.log("Matched Item:", item);
          }
        
          return matches;
        });
        
        console.log("Filtered checkPoints:", checkPoints);
        console.log('showStatus:checkPoints', checkPoints);
        const totalCheckPoint = checkPoints.length;
        
        if (totalCheckPoint > 0) {
          const filledData = checkPoints.filter(checkPoint => {
            const score = checkPoint.Score;
            const hasScore =
              score !== null &&
              score !== undefined &&
              score.toString() !== '-1' &&
              score.toString() !== '-2';

            const hasSelection =
              checkPoint.RadioValue === 9 ||
              checkPoint.RadioValue === 10 ||
              checkPoint.RadioValue === 11 ||
              checkPoint.RadioValue === 12 ||
              checkPoint.RadioValue === 13 ||
              checkPoint.RadioValue === 14 ||
              checkPoint.RadioValue === 15 ||
              checkPoint.Status === 0 ||
              checkPoint.Status === 1 ||
              checkPoint.Status === 2 ||
              checkPoint.Status === 3 ||
              checkPoint.Status === 4;

            return hasScore || hasSelection;
          });
          console.log('showStatus:filledData', filledData);
          const filledCount = filledData.length;
          filledPercentage = Math.floor((filledCount / totalCheckPoint) * 100);
          console.log('Filled Percentage:', filledPercentage);
          console.log('Filled Count:', filledCount);
        }
      }
    }
  
    console.log('showStatus:STATUS', status);
  
    return (
      <View
        style={{
          flex: 0.8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 1,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#00bec1',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: fontSize, fontWeight: 'bold' }}>
                {filledPercentage}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  

  render() {
    console.log(
      this.props?.route?.params?.ChecklistHeading?.FormId
      ? this.props?.route?.params?.ChecklistHeading?.FormId
      : 0,
      'SerisProduction',
    );

    console.log(
      this.props?.route?.params,
      '====>btn1',
    );

    return (
      <View style={styles.wrapper}>
        <OfflineNotice />
        <ImageBackground source={Images.DashboardBG} style={{ resizeMode: 'stretch', width: '100%', height: 60, }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text numberOfLines={1} style={styles.headingText}> {this.state.Heading} </Text>
              <Text numberOfLines={1} style={{ fontSize: 15, color: 'white', fontFamily: 'OpenSans-Regular', }}> {this.state.breadCrumbText} </Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => this.props.navigation.navigate(ROUTES.AUDIT_DASHBOARD_LISTING) }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.auditPageBody, {padding: 0}]}>
          <ImageBackground
            source={Images.BGlayerFooter}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: '100%',
            }}>
            {this.state.displayData ? (
              this.state.displayData.length > 0 ? (
                <ScrollView
                  style={styles.scrollViewBody}
                  contentContainerStyle={{flexGrow: 1}}>
                  <View style={{marginTop: 10}}>
                    {this.state.displayData.map((items, i) =>
                      items.CompLevelId == 1 ? (
                        <TouchableOpacity style={styles.parentcardBox}>
                          {items.ChecklistName.toLowerCase() ===
                          'series production' ? null : (
                            <LinearGradient
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              colors={['#00aed0', '#1FBFD0', '#00bec1']}
                              style={styles.LG}>
                              <View
                                style={{
                                  width: '100%',
                                  height: 50,
                                  justifyContent: 'center',
                                }}>
                                <View style={styles.checkText01}>
                                  <Text
                                    numberOfLines={2} style={{ color: 'white', fontFamily: 'OpenSans-Bold', fontSize: Fonts.size.mediump, }}> {items.ChecklistName} </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : items.CompLevelId == 2 ? (
                        <TouchableOpacity style={styles.parentcardBox}>
                          <View style={{ width: '5%', height: 50, justifyContent: 'center', alignItems: 'center', }}></View>
                          {items.ChecklistName.toUpperCase() ===
                          'series production' ? null : (
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00aed0', '#1FBFD0', '#00bec1']} style={styles.LG2}>
                              <View style={{ width: '100%', height: 50, justifyContent: 'center', }}>
                                <View style={styles.checkText01}>
                                  <Text numberOfLines={2} style={{ color: 'white', fontFamily: 'OpenSans-Bold', fontSize: Fonts.size.mediump, }}>
                                    {items.ChecklistName}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={once( this.onCheckListPress.bind( this, items.ChecklistTemplateId, items.ChecklistName, ), )} style={styles.parentcardBox}>
                          <View style={{ width: '10%', height: 50, justifyContent: 'center', alignItems: 'center', }}>
                            <Icon name={'arrow-right'} size={15} color={'#00bec1'} />
                          </View>
                          <View style={styles.LG3}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                              {this.props.data.audits.smdata !== 2 &&
                              this.props.data.audits.smdata !== 3 ? null : (
                                <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}></View>
                              )}
                              <View style={{flex: 5, flexDirection: 'row'}}>
                                <Text numberOfLines={2} style={{ color: '#00bec1', fontSize: Fonts.size.small, fontFamily: 'OpenSans-Regular'}}>
                                  {items.ChecklistName}
                                </Text>
                              </View>
                              {this.showStatus(items)}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </ScrollView>
              ) : !this.state.pageLoader ? (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    backgroundColor: 'white',
                    opacity: 0.5,
                    // width: Window.width,
                    // height: Window.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Text style={{fontFamily: 'OpenSans-Regular'}}>
                    No checklists found!
                  </Text>
                </View>
              ) : null
            ) : !this.state.pageLoader ? (
              <View style={{ paddingVertical: 20, borderTopWidth: 1, backgroundColor: 'white', opacity: 0.5, width: Window.width, height: Window.height, justifyContent: 'center', alignItems: 'center', position: 'absolute', }}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  {strings.No_checklists_found}
                </Text>
              </View>
            ) : null}
            {this.state.pageLoader ? (
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', }}>
                <ResponsiveImage source={Images.ContentLoader} initHeight={100} initWidth={100} />
                <Text style={{ fontSize: Fonts.size.regular, fontFamily: 'OpenSans-Regular', }}>
                  {strings.cp_01}
                </Text>
              </View>
            ) : null}
          </ImageBackground>
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
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(CheckListMenu);
