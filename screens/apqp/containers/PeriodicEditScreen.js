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
} from "react-native";
import { Images } from "../themes";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import CalendarPicker from "react-native-calendar-picker";
import Modal from "react-native-modal";
import Toast, { DURATION } from "react-native-easy-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { strings } from "../language/Language";
import OfflineNotice from "../components/OfflineNotice";

// import Reactotron from "reactotron-react-native";
// Styles

import styles from "./styles/PeriodicEditStyles";
import Moment from "moment";
import { extendMoment } from "moment-range";

import SwitchToggle from "../components/SwitchToggle";
import { ICON_TYPE, ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
import { FAB } from "components";
import GlobalHeader from "components/GlobalHeader";

const moment = extendMoment(Moment);
// import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
//import console = require('console');

class PeriodicEditScreen extends Component {
  getTodaydate = "";
  UserId = "";
  Token = "";
  SiteId = "";
  ProjectName = "";
  TaskName = "";
  StartDate = "";
  EndDate = "";
  percentage = "";
  ProjectOwnerCheck = 0;
  TaskOwnerCheck = 0;

  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    this.state = {
      completedtext: "",
      startdate: "",
      endate: "",
      hourstext: "",
      ClientName: "",
      TypeofWorkConducted: "",
      AnyOpportunities: "",
      IssueFaced: "",
      remarktext: "",
      RouteParam: "",
      AddFlag: false,
      isstartDateVisible: false,
      isendDateVisible: false,
      id: "",
      TaskId: "",
      FromPercent: "",
      ResourceId: "",
      UpdatedBy: "",
      timePassed: false,
      switch1Value: false,
      defaultText: "",
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
  }
  componentDidMount() {
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
    this.showTodayDate();
    console.log("Props coming", this.props?.route?.params);

    var paramsData = this.props?.route?.params?.apqpPeriodicList;
    var TaskId = this.props?.route?.params?.TaskId;
    var ResourceId = this.props?.route?.params?.ResourceId;

    this.ProjectName = this.props?.route?.params?.ProjectName;
    this.TaskName = this.props?.route?.params?.TaskName;
    this.StartDate = this.props?.route?.params?.StartDate;
    this.EndDate = this.props?.route?.params?.EndDate;
    this.percentage = this.props?.route?.params?.totalProgess;
    this.ProjectOwnerCheck =
      this.props?.route?.params?.ProjectOwnerCheck;
    this.TaskOwnerCheck = this.props?.route?.params?.TaskOwnerCheck;

    if (this.props?.route?.params?.RouteParam == "Edit") {
      this.setState({
        RouteParam: this.props?.route?.params?.RouteParam,
        completedtext: paramsData.Percentage.toString(),
        startdate: this.changeDateFormat(paramsData.StartDate),
        endate: this.changeDateFormat(paramsData.Enddate),
        hourstext: paramsData.Hours.toString(),
        remarktext: paramsData.Remarks,
        id: paramsData.Id,
        TaskId: paramsData.TaskId,
        FromPercent: paramsData.Percentage.toString(),
        ResourceId: paramsData.ResourceId,
        UpdatedBy: paramsData.UpdatedBy,
      });
    } else {
      this.setState(
        {
          RouteParam: this.props?.route?.params?.RouteParam,
          completedtext: "",
          startdate: this.getTodaydate,
          endate: "",
          hourstext: "",
          ClientName: "",
          TypeofWorkConducted: "",
          AnyOpportunities: "",
          IssueFaced: "",
          remarktext: "",
          id: 0,
          TaskId: TaskId,
          FromPercent: 0,
          ResourceId: ResourceId,
          UpdatedBy: "", //paramsData.UpdatedBy,
        },
        () => {}
      );
    }
  }

  toggleSwitch1 = (value) => {
    this.setState({ switch1Value: value });
    console.log("Switch 1 is: " + value);
    var defaultText = "";
    if (value) {
      defaultText = "N/A";
    } else {
      defaultText = "";
    }
    console.log("defaultText", defaultText);
    this.setState({ remarktext: defaultText });
    this.setState({ ClientName: defaultText });
    this.setState({ TypeofWorkConducted: defaultText });
    this.setState({ AnyOpportunities: defaultText });
    this.setState({ IssueFaced: defaultText });
  };

  showTodayDate() {
    var today = new Date();
    var date =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    console.log("get date", date);
    this.getTodaydate = date;
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
//       console.log("No user session");
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

  onPressBack() {
    const strSplit = "";
    var splitArr = [];
    var msg = "";
    var mailID = "";

    // msg= strSplit[0];
    // mailID=strSplit[1];

    msg = "";
    mailID = "";
    // this.props.navigation.navigate("PeriodicUpdateScreen");
    this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
      msgg: msg,
      mailIDD: mailID,
      saved: true,
    });
  }

  onDateChange = (date) => {
    console.log('onStartDateChange date-->', date)
    //Start Date Change
    var dt = new Date(date).setHours(0, 0, 0, 0);
    var sdate = new Date().setHours(0, 0, 0, 0);

    // var ddate = new Date(
    //   this.props.navigation.state.params.itemData.DueDate
    // ).setHours(0, 0, 0, 0);
    console.log('dt,sdate', dt,'--',sdate,'--', dt <= sdate)
    if (dt <= sdate) {
      this.setState({ isValid: true }, () => {});
    } else {
      this.setState({ isValid: false, startdate: "" }, () => {});
      return;
    }

    this.setState(
      {
        startdate: Moment(date).format("MM/DD/YYYY"),
        isstartDateVisible: false,
      },
      () => {
        console.log("StartDate selected", this.state.startdate);
      }
    );
  }

  handleCalenderDate = (date, type) => {
    if (type === 'START_DATE') {
      console.log('reach here start date')
      this.onDateChange(date)
    } else {
      console.log('reach here ending date')
      this.onEndDateChange(date)
    }
  };

  onEndDateChange = (date) => {
    ////End Date Change
    console.log('onEndDateChange date-->', date)
    var dt = new Date(date).setHours(0, 0, 0, 0);
    var startdate = new Date(this.state.startdate).setHours(0, 0, 0, 0);
    var today = new Date().setHours(0, 0, 0, 0);
    console.log('startdate-->', startdate, 'dt-->', dt, 'dt >= startdate-->', dt >= startdate, 'today-->', today, 'dt <= today-->', dt <= today)
    // if (dt <= today && dt >= startdate) {
    if (dt >= startdate) {
      console.log('reach if--->')
      this.setState({ isValid: true }, () => {});
    } else {
      console.log('reach else--->')
      this.setState({ isValid: false }, () => {});
      // this.setState({ isValid: false, endate: "" }, () => {});
      return;
    }

    this.setState(
      {
        endate: Moment(date).format("MM/DD/YYYY"),
        isendDateVisible: false,
        
      },
      () => {
        console.log("EndDate selected", this.state.endate);
      }
    );
  }

  onSavePress() {
    console.log("onSavePress called", this.props, 'this.state.remarktext', this.state.remarktext);
    // Reactotron.log(
    //   parseInt(
    //     this.props.navigation.state.params.itemData.ResourcePercent ||
    //       this.props.navigation.state.params.itemData.percentage
    //   ) + parseInt(this.state.completedtext),
    //   "percent"
    // );
    // if (
    //   this.props.navigation.state.params.itemData.IsOutputMandatory == 0 &&
    //   this.props.navigation.state.params.itemData.HasAttachment != 0 &&
    //   parseInt(
    //     this.props.navigation.state.params.itemData.ResourcePercent ||
    //       this.props.navigation.state.params.itemData.percentage
    //   ) +
    //     parseInt(this.state.completedtext) ==
    //     100
    // ) {
    //   this.refs.toast.show(
    //     "Output Document is madatory to complete the task",
    //     DURATION.LENGTH_SHORT
    //   );
    // } else {
    if (
      this.state.completedtext.trim() == "" ||
      this.state.startdate.trim() == "" ||
      this.state.endate.trim() == "" ||
      //----------------Modified_for_Commercial use - Unlock
      this.state.hourstext.trim() == "" ||
      //----------------Modified_for_Commercial use - Unlock
      this.state.remarktext.trim() == ""
    ) {
      this.refs.toast.show(strings.mandate_message, DURATION.LENGTH_SHORT);
    } else {
      const Id = this.state.RouteParam == "Add" ? 0 : this.state.id;
      const UserID = this.UserId;
      const TaskId = this.state.TaskId;
      const FromPercent = this.state.FromPercent;
      const Percent = this.state.completedtext;
      const ResourceID = this.UserId; //user id
      const StartDate = this.state.startdate;
      const Hours = this.state.hourstext;

      const Remark =
        this.props?.route?.params?.RouteParam == "Edit"
        ? this.state.remarktext
        : "From : " +
            // this.props.data.projects.loginuser.FullName +
            this.props.data.projects.loginuser.userFullName +
            (this.props.data.projects.loginuser?.Email
              ? " (" + this.props.data.projects.loginuser.Email + ")"
              : "") +
            "\n\n" +
            //------------------------------------Modified_for_Commercial_Use-------- lock-------//
            "Client Name : " +
            this.state.ClientName +
            "\n\n" +
            "Type of Work Conducted : " +
            this.state.TypeofWorkConducted +
            "\n\n" +
            "Opportunities : " +
            this.state.AnyOpportunities +
            "\n\n" +
            "Issue Faced : " +
            this.state.IssueFaced +
            "\n\n" +
            // ------------------------------------Modified_for_Commercial_Use-------- lock-------//
            "Remark : " +
            // this.strCompareResult(this.state.remarktext);

            this.state.remarktext;
      const UpdateType = this.state.RouteParam == "Add" ? "add" : "update";
      const EndTime = this.state.endate;
      const Token = this.Token;

      console.log("onSavePress saveperiodicupdate req-->",  
        Id,
        'UserID', UserID,
        'TaskId', TaskId,
        'FromPercent', FromPercent,
       'Percent', Percent,
       'ResourceID', ResourceID,
       'StartDate', StartDate,
       'Hours', Hours,
       'Remark', Remark,
       'UpdateType', UpdateType,
       'EndTime', EndTime,
       'Token', Token);

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
          console.log("saveperiodicupdate -->", data);
          if (data.data.Message == "Success") {
            // this.refs.toast.show(
            //   data.data.Data == "" ? strings.Save_Message : data.data.Data,
            //   DURATION.LENGH_LONG
            // );
            const strSplit = data.data.Data.split(/##/);
            var splitArr = [];
            var msgg = "";
            var mailIDD = "";

            msgg = strSplit[0];
            mailIDD = strSplit[1];

            this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
              msgg: msgg,
              mailIDD: mailIDD,
              saved: true,
            });

            console.log(
              "------------>Update_Status-------PeriodicEdit--------->" +
                msgg +
                "---------->" +
                mailIDD
            );
            // this.refs.toast.show(data.data.Data, DURATION.LENGH_LONG);
          } else {
            this.refs.toast.show(data.data.Data, DURATION.LENGH_LONG);
          }
        }
      );
    }
    // }
  }

  validatefield() {
    var text = this.state.completedtext;
    console.log("text", text);
    if (this.state.completedtext != "") {
      var letters = /^\d+(\.\d{1,2})?$/;
      // var letters = /[!@#$%^&*()_+-=[]{};':"\|,.<>?]+/;
      if (!letters.test(text)) {
        console.log("active");
        this.setState(
          {
            completedtext: "",
          },
          () => {
            this.refs.toast.show(
              strings.Invalid_Percentage,
              DURATION.LENGTH_SHORT
            );
          }
        );
      }
    }
  }

  // strCompareResult(remarktext) {
  //   return this.state.remarktext == "."
  //     ? this.state.remarktext.replace(/[. ]/g, "N/A")
  //     : this.state.remarktext.replace(/[. ]/g, "");
  // }

  validateHours() {
    var text = this.state.hourstext;
    console.log("text", text);
    if (this.state.hourstext != "") {
      var letters = /^\d+(\.\d{1,2})?$/;
      if (!letters.test(text)) {
        console.log("active");
        this.setState(
          {
            hourstext: "",
          },
          () => {
            this.refs.toast.show(strings.Invalid_Hours, DURATION.LENGTH_SHORT);
          }
        );
      }
    }
  }

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

  renderHeader() {
    return (
      // <ImageBackground source={Images.headerBG} style={styles.header}>
      //   <View style={styles.header}>
      //     <TouchableOpacity onPress={this.onPressBack.bind(this)}>
      //       <View style={styles.backLogo}>
      //         <View style={styles.headerDiv}>
      //           <Icon name="angle-left" size={40} color="white" />
      //           <Text style={styles.LabelText}>{strings.Back}</Text>
      //         </View>
      //       </View>
      //     </TouchableOpacity>

      //     <View style={styles.heading}>
      //       <Text style={styles.headingText}>
      //         {this.state.RouteParam == "Edit"
      //           ? strings.Title_Periodic_Edit
      //           : strings.Title_Periodic_Add}
      //       </Text>
      //     </View>
      //   </View>
      // </ImageBackground>
      <>
        <GlobalHeader
          title={this.state.RouteParam == "Edit" ? strings.Title_Periodic_Edit : strings.Title_Periodic_Add}
          onLeftPress={() => this.onPressBack()}
          hideRight={true}
          showBackButton={true}
        />
      </>
    );
  }

  render() {
    const today = new Date();
    console.log('today--->', today)
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}

        <ScrollView style={[styles.flatListWholeView, {marginTop: Platform.OS === 'ios' ? 100 : 100}]}>
          <View>
            <View style={styles.textHeader}>
              <Text style={styles.listText}>Project Name :</Text>
              <Text
                style={{
                  marginLeft: 5,
                  flex: 1,
                  flexDirection: "column",
                  flexWrap: "wrap",
                  color: "black",
                  fontSize: 17,
                }}
              >
                {this.ProjectName ? this.ProjectName : "  -  "}
              </Text>
              {/* <View style={styles.roundView}>
                <Text
                  style={{ color: "#fff", fontWeight: "bold" }}
                  numberOfLines={1}
                >
                  {this.percentage ? this.percentage + "%" : "0"}
                </Text>
              </View> */}
            </View>
            <View style={styles.textHeader}>
              <Text style={styles.listText}>Task Name :</Text>
              <Text
                style={(styles.listText, { flexWrap: "wrap", width: "69%", 
                  color: "black",
                  fontSize: 17, })}
              >
                {this.TaskName ? this.TaskName : "  -  "}
              </Text>
            </View>
            <View style={styles.textHeader}>
              <Text style={styles.listText}>Period :</Text>
              <Text
                style={
                  (styles.listText, { flexWrap: "wrap", color: "#1FBFD0", fontSize: 16 })
                }
              >
                {this.StartDate
                  ? this.changeDateFormatCard(this.StartDate)
                  : "  -  "}{" "}
                -{" "}
                {this.EndDate
                  ? this.changeDateFormatCard(this.EndDate)
                  : "  -  "}
              </Text>

              <View style={styles.roundView}>
                <Text
                  style={{ color: "#fff", fontWeight: "bold" }}
                  numberOfLines={1}
                >
                  {this.percentage ? this.percentage + "%" : "0"}
                </Text>
              </View>
            </View>
          </View>
          {/* ) : (
          <View style={styles.roundView}>
            <Text
              style={{ color: "#fff", fontWeight: "bold" }}
              numberOfLines={1}
            >
              {this.percentage ? this.percentage + "%" : "oo"}
            </Text>
          </View>
          )} */}
          <View style={styles.sec1}>
            {this.state.completedtext != "" ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.completedTextStyle}>
                  {strings.completed + "%"}
                </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
            ) : null}
            <TextInput
              placeholder={strings.completed + "%"}
              keyboardType="numeric"
              style={styles.textInputStyle}
              value={this.state.completedtext}
              onChangeText={(text) => {
                this.setState({
                  completedtext: text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ""),
                });
              }}
              onBlur={() => {
                this.validatefield();
              }}
              // this.setState({ number: value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') });
            />
            {this.state.completedtext == "" ? (
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() =>
              this.setState({ isstartDateVisible: true, isValid: true })
            }
            style={styles.sec1}
          >
            {this.state.startdate != "" ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.completedTextStyle}>
                  {strings.StartDate}
                </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
            ) : null}
            <TextInput
              placeholder={strings.StartDate}
              style={(styles.textInputStyle, { color: "#000000" })}
              value={this.state.startdate}
              onChangeText={(text) => {
                this.setState({ startdate: text });
              }}
              editable={false}
            />
            {this.state.startdate == "" ? (
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ isendDateVisible: true, isValid: true });
            }}
            style={styles.sec1}
          >
            {this.state.endate != "" ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.completedTextStyle}>{strings.EndDate}</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
            ) : null}
            <TextInput
              placeholder={strings.EndDate}
              style={(styles.textInputStyle, { color: "#000000" })}
              value={this.state.endate}
              onChangeText={(text) => {
                this.setState({ endate: text });
              }}
              editable={false}
            />
            {this.state.endate == "" ? (
              <View style={styles.endDatecheck}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            ) : null}
          </TouchableOpacity>
          {/* //------------------------------------Modified_For_Commericial_Use--------- lock------// */}
          <View style={styles.sec1}>
            {this.state.hourstext != "" ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.completedTextStyle}>{strings.Hours}</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
            ) : null}
            <TextInput
              placeholder={strings.Hours}
              keyboardType="numeric"
              style={styles.textInputStyle}
              value={this.state.hourstext}
              onChangeText={(text) => {
                this.setState({ hourstext: text });
              }}
              onBlur={() => {
                this.validateHours();
              }}
            />
            {this.state.hourstext == "" ? (
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            ) : null}
          </View>

          <View style={styles.textHeader}>
            <Text style={styles.listText}>Default Remarks :</Text>
            <SwitchToggle
              toggleSwitch1={this.toggleSwitch1}
              switch1Value={this.state.switch1Value}
            />
          </View>

          {/* //------------------------------------Modified_For_Commericial_Use--------- lock------// */}
          {this.props?.route?.params?.RouteParam != "Edit" ? (
            <View>
              <View style={styles.sec1}>
                {this.state.remarktext != "" ? (
                  <Text style={styles.completedTextStyle}>
                    {strings.ClientName}
                  </Text>
                ) : null}
                <TextInput
                  placeholder={strings.ClientName}
                  style={styles.textInputStyle}
                  value={this.state.ClientName}
                  onChangeText={(text) => {
                    this.setState({ ClientName: text });
                  }}
                />
              </View>

              <View style={styles.remark}>
                {this.state.remarktext != "" ? (
                  <Text style={styles.completedTextStyle}>
                    {strings.TypeofWorkConducted}
                  </Text>
                ) : null}
                <TextInput
                  placeholder={strings.TypeofWorkConducted}
                  style={styles.textInputStyle}
                  value={this.state.TypeofWorkConducted}
                  numberOfLines={4}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({ TypeofWorkConducted: text });
                  }}
                />
              </View>
              <View style={styles.remark}>
                {this.state.remarktext != "" ? (
                  <Text style={styles.completedTextStyle}>
                    {strings.AnyOpportunities}
                  </Text>
                ) : null}
                <TextInput
                  placeholder={strings.AnyOpportunities}
                  style={styles.textInputStyle}
                  value={this.state.AnyOpportunities}
                  numberOfLines={4}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({ AnyOpportunities: text });
                  }}
                />
              </View>
              <View style={styles.remark}>
                {this.state.remarktext != "" ? (
                  <Text style={styles.completedTextStyle}>
                    {strings.IssueFaced}
                  </Text>
                ) : null}
                <TextInput
                  placeholder={strings.IssueFaced}
                  style={styles.textInputStyle}
                  value={this.state.IssueFaced}
                  numberOfLines={4}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({ IssueFaced: text });
                  }}
                />
              </View>
            </View>
          ) : null}
          {/* //------------------------------------Modified_For_Commericial_Use-------- lock-------// */}

          <View style={styles.remark}>
            {this.state.remarktext != "" ? (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.completedTextStyle}>
                    {strings.Remarks}
                  </Text>
                  <Text style={{ color: "red" }}>*</Text>
                </View>
                {this.state.remarktext == "" ? (
                  <View style={styles.check}>
                    <Icon
                      style={{ left: 10 }}
                      name="asterisk"
                      size={8}
                      color="red"
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
            <TextInput
              placeholder={strings.Remarks}
              style={styles.textInputStyle}
              value={this.state.remarktext}
              numberOfLines={4}
              multiline={true}
              onChangeText={(text) => {
                this.setState({ remarktext: text });
              }}
            />
            {this.state.remarktext == "" ? (
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            ) : // this.setState({ remarktext: "." })
            null}
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.isstartDateVisible}
          onBackdropPress={() => this.setState({ isstartDateVisible: false })}
          transparent={true}
          animationType="none" 
        >
          <View style={styles.calendarDiv}>
            <View style={styles.header}>
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                {strings.Please_Choose_Start_Date}
              </Text>
            </View>
            <CalendarPicker
              onDateChange={this.handleCalenderDate}
              previousTitle={"  <<" + strings.previous}
              nextTitle={strings.next + ">>  "}
              todayBackgroundColor="#61BAD0"
              selectedStartDate={this.state.startdate}
              allowRangeSelection={false}
            />
            {this.state.isValid === false ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                    textAlign: "center",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.err_startdate}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                this.setState({ isstartDateVisible: false });
              }}
              style={styles.footer}
            >
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.isendDateVisible}
          onBackdropPress={() =>
            this.setState({ isendDateVisible: false, isValid: true })
          }
          transparent={true}
          animationType="none" 
        >
          <View style={styles.calendarDiv}>
            <View style={styles.header}>
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                {strings.Please_Choose_End_Date}
              </Text>
            </View>
            <View style={{ margin: 5 }}>
              <CalendarPicker
                // onDateChange={this.onEndDateChange}
                onDateChange={(date) => this.handleCalenderDate(date, 'END_DATE')}
                previousTitle={"  <<" + strings.previous}
                nextTitle={strings.next + ">>  "}
                todayBackgroundColor="#61BAD0"
                selectedStartDate={this.state.startdate}
                selectedEndDate={this.state.endate}
                minDate={this.state.startdate}
                // maxDate={this.state?.RouteParam == "Edit" ? today : null}
                allowRangeSelection={false}
              />
            </View>
            {this.state.isValid === false ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                    textAlign: "center",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {/* {strings.err_enddate} */}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                this.setState({ isendDateVisible: false, isValid: true });
              }}
              style={styles.footer}
            >
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                {strings.Close}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* <View style={styles.footerDiv}>
          <View style={styles.footerContainer}>
            <View style={styles.footerButton11}>

              {this.TaskOwnerCheck == 1 ? (
                <TouchableOpacity
                  onPress={() => this.onSavePress()}
                  style={{
                    width: "100%",
                    height: 70,
                    justifyContent: "center",
                    flexDirection:"column",
                    marginEnd:20,
                    alignItems: "center",
                  }}
                >
                  <Icon name="save" size={30} color="#00BAC8" />
                  <Text style={{ color: "#00BAC8" ,margin:1}}>{strings.Save}</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 70,
                    flexDirection:"row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="save" size={30} color="lightgrey" />
                  <Text style={{ color: "lightgrey" }}>{strings.Save}</Text>
                </View>
              )}
            </View>
          </View>
        </View> */}

        <View style={styles.footerDiv}>
          {this.TaskOwnerCheck == 1 ? (
            <>
              <FAB iconName="save" iconType={ICON_TYPE.Feather} onPress={() => this.onSavePress()} />
            </>
          ) : (
          <>
            <FAB iconName="save" iconType={ICON_TYPE.Feather} />
          </>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicEditScreen);
