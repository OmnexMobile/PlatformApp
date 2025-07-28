import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Images } from "../themes";
import OfflineNotice from "../components/OfflineNotice";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { height } from "react-native-dimension";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
import AsyncStorage from "@react-native-community/async-storage";
import Fonts from "../themes/Fonts";
import { strings } from "../language/Language";
// Styles
import styles from "./styles/PeriodicUpdateStyles";
import { DoubleBounce } from "react-native-loader";
import Moment from "moment";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
// import Reactotron from "reactotron-react-native";
import { NavigationEvents } from 'react-navigation';

const window_width = Dimensions.get("window").width;

class PeriodicUpdateScreen extends Component {
  TaskId = "";
  ProjectId = "";
  ResourceId = "";
  UserId = "";
  Token = "";
  SiteId = "";
  ResourcePercent = "";
  DeliverableName = "";
  ProjectName = "";
  TaskName = "";
  StartDate = "";
  EndDate = "";
  ProjectOwnerCheck = 0;
  TaskOwnerCheck = 0;

  constructor() {
    super();
    this.state = {
      apqpPeriodicList: [],
      MaxIndex: 10,
      isRefreshing: false,
      isLoading: true,
      totalProgess: 0,
      FullData: [],
      Details: [],
    };
  }

  componentDidMount() {
    console.log(this.props?.route?.params, "navigation params");
    if (this.props?.route?.params) {
      if (this.props?.route?.params?.RouteParam == "Action") {
        if (this.props?.route?.params?.itemData) {
          this.ProjectOwnerCheck =
            this.props?.route?.params?.itemData?.ProjectOwnerCheck;
          this.TaskOwnerCheck =
            this.props?.route?.params.itemData?.TaskOwnerCheck;
          this.TaskId = this.props?.route?.params?.itemData?.ActionId;
          // this.ResourcePercent =
          //   this.props.navigation.state.params.itemData.ResourcePercent;
          // this.DeliverableName =
          //   this.props.navigation.state.params.itemData.Description;
        }
      } else if (this.props?.route?.params?.RouteParam == "Project") {
        console.log(
          "hellothisistaskid",
          this.props?.route?.params.ProjectId
        );
        // this.TaskId = this.props.navigation.state.params.itemData?.TaskId
        //   ? this.props.navigation.state.params.itemData?.TaskID
        //   : this.props.navigation.state.params.itemData?.ActionId;
        // this.TaskId = this.TaskId
        //   ? this.props.navigation.state.params.itemData?.TaskID
        //   : this.props.navigation.state.params.itemData?.ActionId
        //   ? this.props.navigation.state.params.itemData?.TaskId
        //   : this.props.navigation.state.params?.TaskID;
        this.TaskId = this.props?.route?.params?.TaskID;

        // this.DeliverableName = this.props.navigation.state.params.itemData
        //   .Description
        //   ? this.props.navigation.state.params.itemData.Description
        //   : this.props.navigation.state.params.itemData.ProjectDescription
        //   ? this.props.navigation.state.params.ProjectDescription
        //   : this.props.navigation.state.params.itemData.TaskDesc;

        // this.ResourcePercent =
        //   this.props.navigation.state.params.itemData.ResourcePercent;

        this.ProjectOwnerCheck =
          this.props?.route?.params?.itemData?.ProjectOwnerCheck;
        this.TaskOwnerCheck =
          this.props?.route?.params?.itemData?.TaskOwnerCheck;

        // this.ProjectId = this.props.navigation.state.params.itemData?.ProjectId
        //   ? this.props.navigation.state.params.itemData?.ProjectId
        //   : this.props.navigation.state.params.itemData?.ProjectID;
        this.ProjectId = this.props?.route?.params?.ProjectId;
        // this.ProjectId = this.ProjectId
        //   ? this.props.navigation.state.params?.Projectid
        //   : this.props.navigation.state.params.itemData?.ProjectId
        //   ? this.props.navigation.state.params.itemData?.ProjectID
        //   : this.props.navigation.state.params.itemData?.Project_id;
        console.log(this.ProjectId, "hellothisisoneof");
      } else {
        if (this.props?.route?.params.itemData) {
          this.TaskId = this.TaskId
            ? this.props?.route?.params?.TaskID
            : this.props?.route?.params?.itemData?.ActionId
            ? this.props?.route?.params?.itemData?.TaksId
            : this.props?.route?.params?.itemData?.TaskID;

          // this.DeliverableName = this.DeliverableName
          //   ? this.DeliverableName
          //   : this.props.navigation.state.params.itemData.Description
          //   ? this.props.navigation.state.params.itemData.Description
          //   : this.props.navigation.state.params.itemData.Task_Desc;

          // this.ResourcePercent =
          //   this.props.navigation.state.params.itemData.ResourcePercent;

          this.ProjectOwnerCheck =
            this.props?.route?.params?.itemData?.ProjectOwnerCheck;
          this.TaskOwnerCheck =
            this.props?.route?.params?.itemData?.TaskOwnerCheck;

          this.ProjectId = this.ProjectId
            ? this.props?.route?.params.itemData?.Project_id
            : this.props?.route?.params.itemData?.ProjectId
            ? this.props?.route?.params.itemData?.ProjectID
            : this.props?.route?.params?.ProjectId;
        } else {
          console.log(
            "onPress pressed_Project_RecentActions------ActionItem.TaskID---1--ELSE-->"
          );
        }
      }

      console.log(this.ProjectId, "projectid");
    }

    this.getData()
      .then((res) => {
        console.log("async", res, this.TaskId);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.getapqpPeriodicList();
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
  }

  componentWillReceiveProps() {
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    var CurrentPage = this.props?.route?.name
    console.log('--CurrentPage--->', CurrentPage);

    if (
      CurrentPage == ROUTES.APQP_MANAGER_SCREEN ||
      CurrentPage == ROUTES.GLOBAL_DASHBOARD ||
      CurrentPage == ROUTES.PERIODIC_UPDATE_SCREEN
    ) {
      console.log(
        "------------>Update_Status-------PeriodicUpdate----1----->" +
          this.props?.route?.params?.mailIDD
      );
      if (
        this.props?.route?.params?.mailIDD !== "" &&
        this.props?.route?.params?.mailIDD != null
      ) {
        this.refs.toast.show(
          strings.Save_Message_update +
            strings.mail_sent_to +
            "\n" +
            this.props?.route?.params?.mailIDD,
          DURATION.LENGH_LONG
        );
      }

      console.log(
        "------------>Update_Status-------PeriodicUpdate----->" +
          this.props?.route?.params?.mailIDD
      );

      this.getapqpPeriodicList("will");
    } else {
      console.log("PeriodicUpdateScreen pass");
    }
  }

  // getData = async (userdata) => {
  //   try {
  //     var UserId = await AsyncStorage.getItem("UserId");
  //     var Token = await AsyncStorage.getItem("Token");
  //     var Siteid = await AsyncStorage.getItem("SiteId");
  //     var userdata = [];

  //     console.log("Siteid aync", Siteid);

  //     console.log("UserId asyc", UserId.toString());
  //     console.log("Token asyns", Token.toString());
  //     var userdata = {
  //       UserId: UserId,
  //       SiteId: Siteid,
  //       Token: Token,
  //     };
  //     return userdata;
  //   } catch (e) {
  //     console.log("No user session");
  //   }
  // };

  getData = async () => {
    try {
      var userdata = [];
      const stringifiedUserDetails = await AsyncStorage.getItem('userDataApqp');
      const value = JSON.parse(stringifiedUserDetails);
      console.log('current userdata--->', value)
      var userdata = {
          UserId: value?.userId,
          SiteId: value?.siteId,
          Token: value?.accessToken,
        };
      console.log("userdata aync", userdata);
      return userdata;
    } catch (e) {
      console.log("No user session");
    }
  };

  handleEnd() {
    console.log("handle reached");
    this.setState(
      {
        MaxRow: this.state.MaxRow + 10,
      },
      () => {
        // this.getapqpPeriodicList();//Edited_by_Sudha_July_30_2021
      }
    );
  }

  handleRefresh() {
    this.setState(
      {
        isRefreshing: true,
        MaxRow: 10,
      },
      () => {
        this.getapqpPeriodicList();
      }
    );
  }

  onPressHist() {
    console.log("History Opened");
    this.props.navigation.navigate(ROUTES.PERIODIC_HISTORY_SCREEN, {
      TaskId: this.TaskId,
    });
  }

  onPressedit(item, id) {
    console.log("onPress pressed", this.ProjectOwnerCheck);

    if (id == "Edit") {
      this.props.navigation.navigate(ROUTES.PERIODIC_EDIT_SCREEN, {
        RouteParam: "Edit",
        apqpPeriodicList: item,
        itemData: this.props?.route?.params?.itemData,
        totalProgess: this.state.totalProgess,
        ProjectName: this.ProjectName,
        TaskName: this.TaskName,
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        ProjectOwnerCheck: this.ProjectOwnerCheck,
        TaskOwnerCheck: this.TaskOwnerCheck,
      });
    } else {
      this.props.navigation.navigate(ROUTES.PERIODIC_EDIT_SCREEN, {
        RouteParam: "Add",
        apqpPeriodicList: this.state.apqpPeriodicList[0],
        TaskId: this.TaskId,
        ResourceId: this.ResourceId,
        // itemData: this.state.Details[0], //this.props.navigation.state.params.itemData,
        itemData: this.props?.route?.params?.itemData,
        totalProgess: this.state.totalProgess,
        ProjectName: this.ProjectName,
        TaskName: this.TaskName,
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        ProjectOwnerCheck: this.ProjectOwnerCheck,
        TaskOwnerCheck: this.TaskOwnerCheck,
      });
    }
  }

  renderBounce() {
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
          width: window_width,
          height: height(100) - 213,
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DoubleBounce size={20} color="#1CAFF6" />
      </View>
    );
  }

  getapqpPeriodicList(frm) {
    console.log("Asynchronous call getapqpPeriodicList", frm);
    console.log("calling apqp2 api");
    const Token = this.Token;
    const SiteId = this.SiteId;
    const UserID = this.UserId;
    const TaskId = this.TaskId;
    console.log("thisisataskid", TaskId);
    const Index = 1;
    const MaxIndex = 100;

    console.log("get response from apqp2 ", UserID, TaskId, Index, MaxIndex);
    console.log("getting token periodic update api", Token);

    auth.getapqpPeriodicList(
      UserID,
      TaskId,
      Index,
      MaxIndex,
      Token,
      (res, data) => {
        console.log("getting responses", data);
        if (data.data.Message == "Success") {
          var getList = [];
          getList = data.data.Data;
          this.ResourceId = this.UserId;
          console.log(getList, "helloone"),
            this.setState(
              {
                FullData: getList,
                apqpPeriodicList: getList["PeriodicUpdate"],
                isRefreshing: false,
                isLoading: true,
                Details: getList["Details"],
              },
              () => {
                console.log(
                  "setting up the list...",
                  this.state.Details,
                  this.state.Details[0]?.ProjectName
                );

                this.ProjectName = this.state.Details[0]?.ProjectName;
                this.TaskName = this.state.Details[0]?.TaskName;
                this.StartDate = this.state.Details[0]?.StartDate;
                this.EndDate = this.state.Details[0]?.EndDate;
                // this.ResourcePercent =
                //   this.state.apqpPeriodicList[0]?.Percentage;

                this.DeliverableName = this.state.Details[0]?.TaskName;
                console.log(this.ResourcePercent, "percentagehello");

                this.setState({
                  isLoading: false,
                  totalProgess: this.state.apqpPeriodicList.reduce(function (
                    cnt,
                    o
                  ) {
                    return cnt + o.Percentage;
                  },
                  0),
                });
                let sum = 0;
                for (
                  let i = 0;
                  i < this.state.apqpPeriodicList.length;
                  i += 1
                ) {
                  sum += parseInt(this.state.apqpPeriodicList[i]?.Percentage);
                }
                this.ResourcePercent = sum;
                // return sum;
              }
            );
        }
      }
    );
  }

  changeDateFormatCard = (inDate) => {
    // console.log('changeDateFormatCard', inDate)
    if (inDate) {
      var DefaultFormatL = "MM/DD/YYYY";
      var sDateArr = inDate.split("T");
      var sDateValArr = sDateArr[0].split("-");
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2]
      );
      // console.log('outDate', outDate)

      return Moment(outDate).format(DefaultFormatL);
    }
  };

  changeDateFormat = (inDate) => {
    // console.log('==-->',inDate)
    if (inDate) {
      var DefaultFormatL = "MM/DD/YYYY";
      var sDateArr = inDate.split("T");
      if (sDateArr.length === 1) {
        sDateArr = inDate.split(" ");
      }
      var sDateValArr = sDateArr[0].split("-");
      var sTimeValArr = sDateArr[1].split(":");
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
        sTimeValArr[0],
        sTimeValArr[1]
      );
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  openDeliveryInfo() {
    console.log("DeliveryInfoScreen called. ");
    console.log(
      "ResourcePercent",
      this.ResourcePercent,
      this.ProjectId,
      this.ResourcePercent,
      this.DeliverableName
    );
    this.props.navigation.navigate(ROUTES.DELIVERABLE_INFO_SCREEN, {
      ProjectId: this.ProjectId,
      TaskId: this.TaskId,
      ResourcePercent: this.ResourcePercent,
      DeliverableName: this.DeliverableName,
    });
  }

  goBack() {
    if (this.props?.route?.params) {
      if (this.props?.route?.params?.RouteParam == "Action") {
        this.props.navigation.navigate(ROUTES.ACTION_TAB_INTERFACE, {
          activeTab: this.props?.route?.params?.activeTab,
        });
      } else {
        this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
          activeTab: this.props?.route?.params?.activeTab,
        });
      }
    }
  }

  renderHeader() {
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={styles.backLogo}>
              <View style={styles.headerDiv}>
                <Icon name="angle-left" size={40} color="white" />
                <Text style={styles.LabelText}>{strings.Back}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.heading}>
            <Text style={styles.headingText}>{strings.Progress_Update}</Text>
          </View>

          <View style={(styles.headerDiv, { backgroundColor: "transparent" })}>
          <View style={styles.container2}>
            <TouchableOpacity
              style={{ backgroundColor: "transparent" ,
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",}}
          
              onPress={() => this.openDeliveryInfo()}
            >
              <Icon name="upload" size={25} color="white" alignItems="center" justifyContent="center" />
              <Text style={{color: "#FFFFFF",
                            textAlign: "center"
                           }}>Attach</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </ImageBackground>
    );
  }

  NoRecordsFound() {
    return (
      <Text
        style={{
          width: window_width,
          height: height(100) - 213,
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontSize: Fonts.size.h5,
          paddingTop: 40,
          fontFamily: "OpenSans-Regular",
        }}
      >
        {strings.No_records_found}
      </Text>
    );
  }

  render() {
    const { apqpPeriodicList } = this.state;
    const isRefreshing = this.state.isRefreshing;

    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        {/* <NavigationEvents onWillFocus={this.onFocus} /> */}
         {/* <NavigationEvents onDidFocus={() => this.getapqpPeriodicList()} /> */}
        <OfflineNotice />
        {this.renderHeader()}
        {this.state.isLoading ? (
          this.renderBounce()
        ) : (
          <View style={[styles.flatListWholeView, {marginTop: Platform.OS === 'ios' ? 100 : 100}]}>
            <View>
              <View style={styles.textHeader}>
                <Text style={styles.listText}>Project Name :</Text>
                <Text
                  style={{
                    marginLeft: 5,
                    flex: 1,
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                >
                  {this.ProjectName}
                </Text>
              </View>
              <View style={styles.textHeader}>
                <Text style={styles.listText}>Task Name :</Text>
                <Text
                  style={(styles.listText, { flexWrap: "wrap", width: "69%" })}
                >
                  {this.TaskName}
                </Text>
              </View>
              <View style={styles.textHeader}>
                <Text style={styles.listText}>Period :</Text>
                <Text
                  style={
                    (styles.listText, { flexWrap: "wrap", color: "#4C8048" })
                  }
                >
                  {this.changeDateFormatCard(this.StartDate)} -{" "}
                  {this.changeDateFormatCard(this.EndDate)}
                </Text>
              </View>
            </View>

            {this.state.apqpPeriodicList.length > 0 ? (
              <FlatList
                data={apqpPeriodicList}
                //keyExtractor={item => item.key}
                refreshing={isRefreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReachedThreshold={0.01}
                onEndReached={this.handleEnd.bind(this)}
                renderItem={({ item }) => (
                  <View style={styles.flatListFullSideView}>
                    <TouchableOpacity
                      onPress={this.onPressedit.bind(this, item, "Edit")}
                    >
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Completed % :</Text>
                        <Text
                          numberOfLines={1}
                          style={styles.deliveryTypeTextStylePercent}
                        >
                          {item.Percentage}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Period :</Text>
                        <Text
                          style={[styles.dateTextStyle, { color: "#4C8048" }]}
                          numberOfLines={1}
                        >
                          {this.changeDateFormatCard(item.StartDate)} -{" "}
                          {this.changeDateFormatCard(item.Enddate)}
                        </Text>
                      </View>

                      {/* //------------------------------------Modified_for_Commercial_Use--------- lock------// */}

                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>{strings.Hours} :</Text>
                        <Text style={styles.deliveryTypeTextStyleHours}>
                          {item.Hours}
                        </Text>
                      </View>
                      {/* //------------------------------------Modified_for_Commercial_Use------- lock--------// */}
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>{strings.Remarks}:</Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text
                          style={
                            (styles.deliveryTypeTextStyle,
                            {
                              paddingLeft: 8,
                              marginRight: 25,
                              fontSize: 16,
                              flexWrap: "wrap",
                              width: "80%",
                            })
                            //  style={{width: "70%",borderBottomWidth: 0.5,fontSize: 18,}}
                            //marginLeft:5,flex:1,flexDirection:'column', flexWrap:'wrap'
                          }
                        >
                          {item.Remarks}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              this.NoRecordsFound()
            )}
          </View>
        )}
        <View style={styles.footerDiv}>
          {/* <View style={styles.footerMenuItem}> */}
          <View style={styles.footerContainer}>
            <View style={styles.footerButton1}>
              {/* {this.ProjectOwnerCheck == 0 ||
              this.ProjectOwnerCheck == undefined ||
              this.ProjectOwnerCheck == null ? ( */}

              {/* ||this.TaskOwnerCheck != null  */}
              {this.TaskOwnerCheck == 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    this.onPressedit(this, "Add");
                  }}
                  style={{
                    width: "100%",
                    height: 70,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="plus-circle" size={30} color="#00BAC8" />
                  <Text style={{ color: "#00BAC8" }}>ADD</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 70,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="plus-circle" size={30} color="lightgrey" />
                  <Text style={{ color: "lightgrey" }}>ADD</Text>
                </View>
              )}
            </View>
            {/* <View style={styles.separatorSection}>
              
              </View> */}
            {/* <View style={styles.footerButton1}>
                <TouchableOpacity onPress={this.onPressHist.bind(this)}>
                  <Icon name="history" size={30} color="#00BAC8" />
                </TouchableOpacity>
                <Text style={{ color: "#00BAC8" }}>History</Text>
              </View> */}
          </View>
          {/* </View> */}
        </View>
        <Toast
          ref="toast"
          style={{ backgroundColor: "black", margin: 20 }}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeriodicUpdateScreen);
