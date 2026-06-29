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
import styles from './CheckListMenuStyleSM';
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
import localStorage from 'global/localStorage';
import GlobalHeader from 'components/GlobalHeader';

let Window = Dimensions.get('window');

class CheckListMenu extends Component {
  constructor(props) {
    super(props);
    console.log('get props---->', props)
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
  //  AuditOrder AuditProgramId
  componentDidMount() {
    LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.'])
    // ...long-running synchronous task...
    this.LongTask();
    this.props.navigation.addListener(
        'didFocus',
        () => {
          this.LongTask();
        }
      );

    const currentSupplier = this.props.data.audits.smdata;

    console.log('consolenavigationparamscheccklistmemu', this.props);
  }

  componentWillReceiveProps() {
    console.log('consolenavigationparams1', this.props?.route?.params);
  }

  LongTask() {
    console.log('consolenavigationparams', this.props?.route?.params);
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
      const p6Item = parentData.find(
        item =>
          item.ChecklistName &&
          item.ChecklistName.toLowerCase().startsWith('p6.'),
      );

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

        if (addedParentIds.has(parentItem.ChecklistTemplateId)) {
          continue;
        }

        const isSeriesProduction =
          parentItem.ChecklistName &&
          parentItem.ChecklistName.toLowerCase() === 'series production';

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

          if (!p6Inserted && p6Item) {
            appendParentWithChildren(p6Item);
          }

          continue;
        }

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
        breadCrumbText: this.props?.route?.params?.Checkpass?.breadCrumb,
        // breadCrumbText: this.props.navigation.state.params.Checkpass.breadCrumb.length>30 ? this.props.navigation.state.params.Checkpass.breadCrumb.slice(0,30) + '...' : this.props.navigation.state.params.Checkpass.breadCrumb,
        Heading: this.props?.route?.params?.ChecklistHeading?.FormName,
        FormId: this.props?.route?.params?.FormId,
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

  async onCheckListPress(ChecklistTemplateId, CheckPointname) {
    const CurrentApp = await localStorage.getData('CurrentApp');
    console.log('current app--->', CurrentApp)
    if(CurrentApp == 'Supplier Management') {
      console.log('Reach if case--->')
      this.props.navigation.navigate(ROUTES.CHECKPOINT_DEMO_SM, {
        AuditID: this.state.AuditID,
        ChecklistTemplateId: ChecklistTemplateId,
        Check: this.state.CheckpointP,
        FormId : this.state.FormId,
        CheckPointname: CheckPointname,
        breadCrumbText: this.state.breadCrumbText,
        AuditOrder: this.state.AuditOrder,
        AuditProgramId: this.state.AuditProgramId,
        TemplateID: this.state.displayData[0].TemplateID,
        FormIdNavigate:
          this.props?.route?.params?.ChecklistHeading?.FormId,
        notifyRed: this.props?.route?.params?.notifyRed,
      });
    } else {
      console.log('Reach else case--->')
      this.props.navigation.navigate(ROUTES.CHECKPOINT_DEMO, {
        AuditID: this.state.AuditID,
        ChecklistTemplateId: ChecklistTemplateId,
        Check: this.state.CheckpointP,
        FormId : this.state.FormId,
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
        //   mandateCheckpoints: pendingCheck.length,
        //   totalfilled: completed.length,
        optionalCheck: data.length - mandatoryCheck,
        totalCheck: data.length,
        mandatoryCheck: mandatoryCheck,
      },
      () => {
        //   console.log('total checkpoints filled', this.state.totalfilled)
        //   console.log('total pending checkpoints', this.state.mandateCheckpoints)
        //   console.log('total manadatory checkpoints', this.state.mandatoryCheck)
      },
    );
  };
  countMandate(items) {
    console.log('Checking mandate counts', items);
    console.log('displayData', this.state.displayData);
    return items.MandatoryCount;
  }

  showStatus = checkList => {
    var auditRecords = this.props.data.audits.auditRecords;
    var AuditID =
      this.props?.route?.params?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditID ||
      this.props?.route?.params?.Checkpass?.AuditId;
    let listData = [];

    let filledPercentage = 0;
    console.log("showStatus:checkList", checkList);

    for (var i = 0; i < auditRecords.length; i++) {
      if (AuditID === auditRecords[i].AuditId) {
        let audit = auditRecords[i];
        listData = audit.Listdata;
        const checkPoints = listData.filter(item => {
          return (
            String(item.ParentId) === String(checkList.ChecklistTemplateId) &&
            String(item.FormId) === String(checkList.FormId)
          );
        });

        console.log("showStatus:checkPoints", checkPoints);

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

          console.log("showStatus:filledData", filledData);
          const filledCount = filledData.length;
          filledPercentage = Math.floor((filledCount / totalCheckPoint) * 100);
        }
      }
    }

    return (
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <View style={styles.statusBadgeInner}>
            <View style={styles.statusCircle}>
              <Text style={styles.statusCircleText}>
                {filledPercentage}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  render() {
    console.log('CURRENT_PAGE', 'CheckListMenu')
    console.log(
      //this.props.data.audits.auditRecords[0].CheckListPropData,
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
        
          <GlobalHeader
            title={this.state.Heading}
            subtitle={this.state.breadCrumbText}
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={() =>
              this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)
            }
            containerStyle={{backgroundColor: 'transparent'}}
            // titleStyle={{color: '#fff'}}
            // subtitleStyle={{color: '#fff', fontSize: 15}}
            // leftIconColor="#fff"
            // rightIconColor="#fff"
          />

        <View style={[styles.auditPageBody, {padding: 0}]}>
          <ImageBackground
            source={Images.checklist_bg}
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
               
                  <View style={styles.listWrapper}>
                    {this.state.displayData.map((items, i) =>
                      items.CompLevelId == 1 ? (
                        <TouchableOpacity
                          key={`${items.ChecklistTemplateId}-${i}`}
                          //onPress={once(this.onCheckListPress.bind(this,items.ChecklistTemplateId , items.ChecklistName))}
                          style={styles.parentcardBox}>
                          {items.ChecklistName.toLowerCase() ===
                          'series production' ? null : (
                            <LinearGradient
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              colors={['#123C95', '#1B5FDB', '#6A35D8']}
                              style={styles.LG}>
                              <View
                                style={{
                                  width: '100%',
                                  height: 50,
                                  justifyContent: 'center',
                                }}>
                                <View style={styles.checkText01}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      color: 'white',
                                      fontFamily: 'OpenSans-Bold',
                                      fontSize: Fonts.size.mediump,
                                    }}>
                                    {items.ChecklistName}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : items.CompLevelId == 2 ? (
                        <TouchableOpacity
                          key={`${items.ChecklistTemplateId}-${i}`}
                          style={styles.parentcardBox}
                          // onPress={once(
                          //   this.onCheckListPress.bind(
                          //     this,
                          //     items.ChecklistTemplateId,
                          //     items.ChecklistName
                          //   )
                          // )}
                        >
                          <View style={styles.childSpacer}></View>
                          {items.ChecklistName.toLowerCase() ===
                          'series production' ? null : (
                            <LinearGradient
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              colors={['#123C95', '#1B5FDB', '#6A35D8']}
                              style={styles.LG2}>
                              <View
                                style={{
                                  width: '100%',
                                  height: 50,
                                  justifyContent: 'center',
                                }}>
                                <View style={styles.checkText01}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      color: 'white',
                                      fontFamily: 'OpenSans-Bold',
                                      fontSize: Fonts.size.mediump,
                                    }}>
                                    {items.ChecklistName}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          key={`${items.ChecklistTemplateId}-${i}`}
                          onPress={once(
                            this.onCheckListPress.bind(
                              this,
                              items.ChecklistTemplateId,
                              items.ChecklistName,
                            ),
                          )}
                          style={styles.parentcardBox}>
                          <View style={styles.itemIconWrapper}>
                            <Icon
                              name={'arrow-right'}
                              size={15}
                              color={'#123C95'}
                            />
                          </View>
                          <View style={styles.LG3}>
                            <View style={styles.itemRow}>
                              {this.props.data.audits.smdata !== 2 &&
                              this.props.data.audits.smdata !== 3 ? // <View
                              //   style={{
                              //     flex: 0.8,
                              //     flexDirection: 'row',
                              //     justifyContent: 'center',
                              //     alignItems: 'center',
                              //   }}>
                              //   <View
                              //     style={{
                              //       width: 30,
                              //       height: 30,
                              //       borderRadius: 15,
                              //       backgroundColor: '#00bec1',
                              //       justifyContent: 'center',
                              //       alignItems: 'center',
                              //     }}>
                              //     <Text
                              //       style={{
                              //         color: '#fff',
                              //         fontSize: Fonts.size.regular,
                              //         fontFamily: 'OpenSans-Bold',
                              //       }}>
                              //       {this.countMandate(items)}
                              //     </Text>
                              //   </View>
                              // </View>
                              null : (
                                <View style={styles.statusSpacer}></View>
                              )}

                              <View style={styles.itemTextWrapper}>
                                <Text numberOfLines={2} style={styles.itemText}>
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
                    width: Window.width,
                    height: Window.height,
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
              <View
                style={{
                  paddingVertical: 20,
                  borderTopWidth: 1,
                  backgroundColor: 'white',
                  opacity: 0.5,
                  width: Window.width,
                  height: Window.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                }}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  {strings.No_checklists_found}
                </Text>
              </View>
            ) : null}
            {this.state.pageLoader ? (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                {/* <Bars size={20} color='#48BCF7'/> */}
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
                  {strings.cp_01}
                </Text>
                {/* <Text style={{fontSize:Fonts.size.small}}>We are loading checkpoint!</Text> */}
              </View>
            ) : null}
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  // console.log('mapStateToProps',state)
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckListMenu);
