import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  ImageBackground,
} from "react-native";
import { Images } from "../themes";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
import Modal from "react-native-modal";
import ProgressCircle from "react-native-progress-circle";
import Icon2 from "react-native-vector-icons/Feather";
// import * as Animatable from "react-native-animatable";
import Toast, { DURATION } from "react-native-easy-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { strings } from "../language/Language";
// import Reactotron from "reactotron-react-native";

// Styles
import styles from "./styles/TaskListScreenStyles";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
const moment = extendMoment(Moment);
let Window = Dimensions.get("window");

class TaskListScreen extends Component {
  UserId = "";
  Token = "";
  ProjectId = 0;
  actionProjectTiltle = "";
  passquickParameter = "";

  constructor(props) {
    super(props);
    console.log('get Current Props-->', props);
    // this.params = this.props.navigation.state.params;
    this.state = {
      selectedIndex: 0,
      apqpList2: [],
      loader: true,
      quickModal: false,
      quickpercentage: "",
      modalErrortxt: "",
      recentActivity: "",
    };
  }

  componentDidMount() {
    console.log(
      "TaskListScreen params coming",
      this.props?.route?.params
    );
    if (this.props?.route?.params.itemData) {
      console.log("dsf");

      this.ProjectId = this.props?.route?.params.itemData?.ProjectID;
      this.actionProjectTiltle =
        this.props?.route?.params.itemData?.Task_Desc;
    }
    console.log("TaskListScreen mounted", this.state.selectedIndex);
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.setState({ recentActivity: this.props?.navigation?.recentActivity });
        this.getapqplist2data();
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
    console.log("--CurrentPage--->", CurrentPage);

    if (CurrentPage == ROUTES.TASK_LIST_SCREEN) {
      console.log("calling asyn getapqplist2data");
      this.getapqplist2data();
    } else {
      console.log("TaskListScreen pass");
    }
  }

//   getData = async (userdata) => {
//     try {
//       var UserId = await AsyncStorage.getItem("UserId");
//       var Token = await AsyncStorage.getItem("Token");
//       var Siteid = await AsyncStorage.getItem("SiteId");
//       var userdata = [];

//       console.log("Siteid aync", Siteid);

//       console.log("UserId asyc", UserId.toString());
//       console.log("Token asyns", Token.toString());
//       var userdata = {
//         UserId: UserId,
//         SiteId: Siteid,
//         Token: Token,
//       };
//       return userdata;
//     } catch (e) {
//       console.log("No user session", e);
//     }
//   };

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

  getapqplist2data() {
    console.log("calling apqp2 api");
    const UserID = this.UserId;
    const Token = this.Token;
    const ProjectId = this.ProjectId;
    const TaskId = 0; //
    const MaxRow = 100; //
    const ListType = this.state.selectedIndex; //
    const ProjectView = 0; //

    console.log(
      "get response from apqp2 ",
      UserID,
      ProjectId,
      TaskId,
      MaxRow,
      ListType,
      ProjectView
    );

    auth.getapqplist2data(
      UserID,
      ProjectId,
      TaskId,
      MaxRow,
      ListType,
      ProjectView,
      Token,
      (res, data) => {
        console.log("getting responses", data);
        if (data.data.Message == "Success") {
          var getList = [];
          var apqpList = [];
          var isParent = false;
          var parentlevel = 0;
          getList = data.data.Data;

          for (var i = 0; i < getList.length; i++) {
            if (getList[i].HasChild == "T") {
              if (!isParent) {
                parentlevel = 0;
              }
              parentlevel = parentlevel + 1;
              getList[i].parentlevel = parentlevel;
              isParent = true;
            } else {
              parentlevel = 0;
              getList[i].parentlevel = 0;
              isParent = false;
            }
            apqpList.push(getList[i]);
          }

          this.setState(
            {
              apqpList2: apqpList,
              loader: false,
            },
            () => {
              console.log("setting up the list...", this.state.apqpList2);
            }
          );
        }
      }
    );
  }

  onPress() {
    console.log("onPress pressed");
    this.props.navigation.navigate(ROUTES.APQP_MANAGER_SCREEN);
  }

  onPressPerodic(item) {
    console.log("onPress pressed", item);
    this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
      RouteParam: "Task",
      itemData: item,
      ProjectId: this.ProjectId,
      recentActivity: this.state.recentActivity,
    });

    this.updateRecentActionList(item);
  }

  updateRecentActionList(item) {
    var list = [];
    list.push(item);

    if (list[0].length === 2) {
      list[0].push("Projects");
    } else {
      list[0]["Modules"] = "Projects";
    }

    var recentActionListProps = this.props.data.projects.recentActivity;
    //.data.projects
    var recentActions = [];
    if (recentActionListProps && recentActionListProps.length > 0) {
      var isProjectExistsInRecentList = false;
      for (var i = 0; i < recentActionListProps.length; i++) {
        recentActions.push(recentActionListProps[i]);
        if (recentActionListProps[i][0].TaskID == list[0].TaskID) {
          isProjectExistsInRecentList = true;
        }
      }
      if (!isProjectExistsInRecentList) {
        recentActions.push(list);
        this.props.updateRecentActivityList(recentActions);
      }
    } else {
      recentActions.push(list);
      this.props.updateRecentActivityList(recentActions);
    }
  }

  changeDateFormat = (inDate) => {
    // console.log('==-->', inDate)
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

  onUpdatePress() {
    console.log("pressed");
    var passData = this.passquickParameter;
    const Id = -1;
    const UserID = this.UserId;
    const TaskId = passData.TaskID;
    const FromPercent = passData.percentage;
    const Percent = this.state.quickpercentage;
    const ResourceID = this.UserId; //user id
    const StartDate = passData.TStartDate;
    const Hours = "";
    const Remark = "quick update";
    const UpdateType = "update";
    const EndTime = passData.TFinishDate;
    const Token = this.Token;

    if (Percent == "") {
      this.setState({
        modalErrortxt: "Please fill the field",
      });
    } else if (Percent != "") {
      var text = this.state.quickpercentage;
      console.log("text", text);
      if (this.state.quickpercentage != "") {
        var letters = /^\d+(\.\d{1,2})?$/;
        if (!letters.test(text)) {
          console.log("active");
          this.setState({
            quickpercentage: "",
            modalErrortxt: "Invalid format!",
          });
        } else if (parseInt(FromPercent) > parseInt(text)) {
          this.setState({
            quickpercentage: "",
            modalErrortxt: strings.err_percentage,
          });
        } else {
          auth.saveperiodicupdate(
            Id,
            UserID,
            TaskId,
            FromPercent,
            Percent,
            ResourceID,
            StartDate,
            Hours,
            Remark,
            UpdateType,
            EndTime,
            Token,
            (res, data) => {
              console.log("-->", data);
              if (data.data.Message == "Success") {
                this.setState(
                  {
                    quickModal: false,
                    quickpercentage: "",
                    modalErrortxt: "",
                  },
                  () => {
                    this.refs.toast.show(
                      data.data.Data == ""
                        ? "Saved successfully"
                        : data.data.Data,
                      DURATION.LENGTH_SHORT
                    );
                    this.getapqplist2data();
                  }
                );
              } else {
                this.setState(
                  {
                    quickModal: false,
                    quickpercentage: "",
                    modalErrortxt: "",
                  },
                  () => {
                    this.refs.toast.show(data.data.Data, DURATION.LENGTH_SHORT);
                  }
                );
              }
            }
          );
        }
      }
    }
  }

  handleIndexChange = (index) => {
    console.log("changing index", index);
    this.setState(
      {
        selectedIndex: index,
        loader: true,
      },
      () => {
        console.log("---->", this.state.selectedIndex);
        this.getapqplist2data();
      }
    );
  };

  toggleModal(item) {
    console.log("-->", item);
    if (item.HasChild == "F") {
      this.setState(
        {
          quickModal: true,
        },
        () => {
          this.passquickParameter = item;
          console.log("passquickParameter", this.passquickParameter);
        }
      );
    }
  }

  renderProjectTitle() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 65,
          width: "90%",
          marginLeft: 20,
          marginRight: 20,
          paddingBottom: 15,
          // backgroundColor: 'red'
        }}
      >
        <Image source={Images.apqpModuleIcon} style={styles.projectIcon} />

        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            color: "#00bec1",
            fontSize: 18,
          }}
        >
          {this.state.actionProjectTiltle}
        </Text>
      </View>
    );
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
            <Text style={styles.headingText}>{strings.Deliverables}</Text>
          </View>
          <View style={(styles.headerDiv, { backgroundColor: "transparent" })}>
            <TouchableOpacity
              style={{ paddingRight: 10, backgroundColor: "transparent" }}
              onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            >
              <Icon name="home" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  render() {
    const data = this.state.apqpList2;

    this.state.actionProjectTiltle =
      this.props?.route?.params.itemData?.Actions;

    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        {this.renderHeader()}

        {this.renderProjectTitle()}
        <View style={[styles.flatList, { marginTop: Platform.OS === 'ios' ? 80 : 60 }]}>
          <View style={{ marginBottom: 50, marginTop: 50 }}>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <View style={styles.flatListView}>
                  {item.parentlevel == 1 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={styles.flatListTouchableView}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          {/* <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTextNameStyle}
                              numberOfLines={1}>
                              {this.state.actionProjectTiltle}
                            </Text>
                          </View> */}

                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.percentage}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.percentage + "%"}
                                {/* 100% */}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 2 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorTwo,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.percentage}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.percentage + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 3 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorThree,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 4 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorFour,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 5 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorFive,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 6 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorSix,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : item.parentlevel == 7 ? (
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#00aed0", "#00bec1"]}
                      style={[
                        styles.flatListTouchableView,
                        styles.parentBGColorSeven,
                      ]}
                    >
                      <View style={styles.buttonDiv}>
                        <View style={styles.roundView}>
                          <Text style={{ color: "#00bec1" }} numberOfLines={1}>
                            {parseInt(item.Indent) + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "70%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTextNameStyle}
                            >
                              {item.Task_Desc}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.deliveryTypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          // onPress={()=>this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: undefined,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: "10%",
                          height: undefined,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <Icon2
                            name="arrow-right"
                            size={20}
                            color={"#00aed2"}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          width: "90%",
                          flex: 4,
                          borderRadius: 5,
                          borderWidth: 0.5,
                          elevation: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 6,
                          borderLeftWidth: 5,
                          borderLeftColor: "#00bcc2",
                          flexDirection: "row",
                          backgroundColor: "white",
                        }}
                        // alignItems: "flex-start",
                      >
                        <TouchableOpacity
                          onPress={this.onPressPerodic.bind(this, item)}
                          style={{
                            width: "80%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.TextNameStyle}
                            >
                              {item.Task_Desc}

                              {/* Task_Desc_8 */}
                            </Text>
                          </View>
                          <View style={styles.flatListInsideView}>
                            <Text
                              style={styles.TypeTextStyle}
                              numberOfLines={1}
                            >
                              {this.changeDateFormat(item.TStartDate)} -{" "}
                              {this.changeDateFormat(item.TFinishDate)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.toggleModal(item)}
                          style={{
                            width: "20%",
                            backgroundColor: "transparent",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {item.HasAttachment != 0 && (
                              <View style={{ marginRight: 10 }}>
                                <Icon name="paperclip" size={20} color="grey" />
                              </View>
                            )}

                            <ProgressCircle
                              percent={item.ResourcePercent}
                              radius={22}
                              borderWidth={2}
                              color="#5192EA"
                              shadowColor="lightgrey"
                              bgColor="#fff"
                            >
                              {/*  Percentage_Circle_1 */}
                              <Text style={styles.fontText}>
                                {item.ResourcePercent + "%"}
                              </Text>
                            </ProgressCircle>
                            {/* <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              margin:10
                            }}> */}

                            {/* <View style={styles.flatListInsideView}>
                            <Text
                              numberOfLines={1}
                              style={styles.deliveryTypeTextStyle}
                            >
                              {"Overall "+item.percentage +"%"}
                            </Text>
                        </View> */}

                            {/* <View style={styles.line1}>
                              <Text
                                style={{
                                  fontSize: 10.5,
                                  width: "90%",
                                  height: 20,
                                  color: "grey",
                                }}
                              >
                                {"Overall " + item.percentage + "%"}
                              </Text>
                            </View> */}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
        <Modal
          isVisible={this.state.quickModal}
          onBackdropPress={() => this.setState({ quickModal: true })}
        >
          <View style={styles.quickModaldiv}>
            <View style={styles.quickheader}>
              <Text style={{ fontSize: 22, color: "#61BAD0" }}>
                Quick percentage update
              </Text>
            </View>
            <View style={styles.quickBody}>
              <View>
                {this.state.quickpercentage == "" ? null : (
                  <Text style={{ paddingLeft: 5 }}>Percentage update</Text>
                )}
              </View>
              <View style={styles.textDiv}>
                <TextInput
                  placeholder={"Enter percentage"}
                  style={{ fontSize: 18 }}
                  keyboardType={"number-pad"}
                  value={this.state.quickpercentage}
                  onChangeText={(text) => {
                    this.setState({ quickpercentage: text });
                  }}
                />
              </View>
              {this.state.modalErrortxt == "" ? null : (
                <View>
                  <Text style={{ color: "red" }}>
                    {this.state.modalErrortxt}
                  </Text>
                </View>
              )}
              <View>
                <Text style={{ fontSize: 16, color: "#31899F" }}>
                  * Enter the cumulative progress percentage
                </Text>
              </View>
            </View>

            <View style={styles.quickFooter}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ modalErrortxt: "", quickModal: false })
                }
                style={styles.btnDiv}
              >
                <Text style={{ color: "red", fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onUpdatePress();
                }}
                style={styles.btnDiv2}
              >
                <Text style={{ color: "green", fontSize: 18 }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  return {
    storeActions: (actions) => dispatch({ type: "STORE_ACTIONS", actions }),
    updateRecentActivityList: (recentActivity) =>
      dispatch({ type: "UPDATE_RECENT_ACTIVITY_LIST", recentActivity }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen);
