import React, { Component } from "react";
import {
  ScrollView,
  Platform,
  Text,
  View,
} from "react-native";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
import { Dropdown } from "react-native-material-dropdown";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import { ConfirmDialog } from "react-native-simple-dialogs";
import Toast, { DURATION } from "react-native-easy-toast";
import { strings } from "../language/Language";
// Styles
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles/MeetingPlanStyles";

import Moment from "moment";
import { FONT_TYPE, ICON_TYPE, ROUTES } from "constants/app-constant";
import GlobalHeader from "components/GlobalHeader";
import { FAB, TextComponent } from "components";
import { FONT_SIZE } from "constants/theme-constants";
import { showErrorMessage, showWarningMessage, successMessage } from "helpers/utils";

class MeetingPlanScreen extends Component {
  UserId = "";
  Token = "";
  ProjectId = "";
  ActionId = "";
  Status = 2;
  StatusVal = "Completed";
  constructor() {
    super();
    this.state = {
      apqpMeetingPlanList: [],
      loader: true,
      dialogVisible: false,
      text: "",
    };
  }

  componentDidMount() {
    console.log("getting params", this.props?.route?.params);
    if (this.props?.route?.params?.MeetingDetails) {
      this.ActionId = this.props?.route?.params?.MeetingDetails?.ActionId;
      this.ActionId =
        this.ActionId == undefined
          ? this.props?.route?.params?.MeetingDetails?.ActionID
          : this.ActionId;
    }
    this.getData()
      .then((res) => {
        console.log("async--->", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.getapqpMeetingPlanList();
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
  }

  onPressBack() {
    this.props.navigation.navigate((ROUTES.MEETING_SCREEN));
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

  getapqpMeetingPlanList() {
    console.log("getapqpMeetingPlanList");
    var ActionId = this.ActionId;
    var token = this.Token;

    console.log("ActionId", ActionId);

    auth.getapqpMeetingPlanList(ActionId, token, (res, data) => {
      console.log("getting responses", data);
      if (data.data.Message == "Success") {
        const meetingItem = data?.data?.Data?.[0];
        if (
          meetingItem?.StatusCode !== undefined &&
          meetingItem?.Status !== undefined
        ) {
          this.Status = meetingItem.StatusCode;
          this.StatusVal = meetingItem.Status;
        }

        this.setState(
          {
            apqpMeetingPlanList: data.data.Data,
            loader: false,
          },
          () => {
            console.log("apqpMeetingPlanList", this.state.apqpMeetingPlanList);
          }
        );
      } else {
        console.log("apqpMeetingPlanList", this.state.apqpMeetingPlanList);
      }
    });
  }

  onSavePress() {
    console.log("this.Status", this.Status);
    if (this.Status != undefined) {
      var ActionId = this.ActionId;
      var token = this.Token;
      var Status = this.Status;

      auth.getapqpMeetingPlanSave(ActionId, Status, token, (res, data) => {
        console.log(" getapqpMeetingPlanSave");

        console.log("-->", data);

        if (data.data.Message == "Success") {
          // this.refs.toast.show(
          //   "Meetings status updated successfully.",
          //   DURATION.LENGTH_SHORT
          // );
        successMessage({ message: '', description: "Meetings Status Updated Successfully."});
		  
         this.updateRecentActionList();
          this.onPressBack();

        } else {
          // this.refs.toast.show(
          //   "Failed to Save Meeting!",
          //   DURATION.LENGTH_SHORT
          // );
        showErrorMessage('Failed to Save Meeting!')
        }
      });
    } else {
      // this.refs.toast.show("Please select Status!", DURATION.LENGTH_SHORT);
      showWarningMessage({ message: 'Please Select Status!'})
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

  onPressComplete() {
    this.setState(
      {
        dialogVisible: false,
      },
      () => {
        var ActionId = this.state.apqpMeetingPlanList[0].ActionID;
        var Status = 2;
        var Token = this.Token;
        auth.getonCompMeetingPlan(ActionId, Status, Token, (res, data) => {
          console.log("save response", data);
          if (data.data.Message == "Success") {
            // this.refs.toast.show(data.data.Data, DURATION.LENGTH_SHORT);
          successMessage({ message: '', description: data.data.Data})
          }
        });
      }
    );
  }

  renderHeader() {
    return (
      <>
        <GlobalHeader
          title={strings.meetings}
          onLeftPress={() => this.props.navigation.goBack()}
          onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
          showBackButton={true}
        /> 
      </>
    );
  }


  // updateRecentActionList() {
  //   var list = [];
  //   list.push(this.state.apqpMeetingPlanList);
  //   console.log("HI ActionPage old", list[0], list);
  //   var recentActionListProps = this.props.data.projects.recentActivity;
  //   var recentActions = [];
  //   var Array =[];
  //   for (let i = 0; i < recentActionListProps.length; i++) {
  //    const Arr =recentActionListProps[i].filter((item) => item.ActionID !== this.state.apqpMeetingPlanList[0].ActionID);
  //     Array.push(Arr)
  //   }
  //   recentActions.push(Array);
  //   this.props.SetRecentActivityList(recentActions);
  //   console.log("HI old", recentActions);
  // }


  updateRecentActionList() {	
    var list = [];	
    list.push(this.state.apqpMeetingPlanList);	
    console.log("HI ActionPage old", list[0], list);	
    var recentActionListProps = this.props.data.projects.recentActivity;	
    console.log("HI ActionPage old", recentActionListProps.length, recentActionListProps);	
    var recentActions = [];	
    var Array =[];	
    var Array1 =[];	
    for (let i = 0; i < recentActionListProps.length; i++) {	
     	
    Arr =recentActionListProps[i].filter((item) => item.ActionID !== this.state.apqpMeetingPlanList[0].ActionID);		
    if(Arr.length!= 0)	
{	
Array.push(Arr)	
}	
}	

console.log("HI old", Array);	
this.props.SetRecentActivityList(Array);	
console.log("HI old", Array);	   	
}	
   
   


  render() {
    let data = [
      {
        id: 2,
        value: "Completed",
      },
    ];

    return (
      <View style={styles.mainContainer}>
        <View style={Platform.OS === "ios" ? styles.topSpacerIos : styles.topSpacerAndroid} />
        {this.renderHeader()}

        <ScrollView style={styles.flatListWholeView} contentContainerStyle={styles.flatListWholeContent}>
          {this.state.apqpMeetingPlanList.length > 0 ? (
            <View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Action Created Date</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.changeDateFormat(
                    this.state.apqpMeetingPlanList[0].ActionCreatedDate
                  )}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Action Created Date</Text>
                <Text style={styles.flatListContent1}>
                  {this.changeDateFormat(
                    this.state.apqpMeetingPlanList[0].ActionCreatedDate
                  )}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>ActionType</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.state.apqpMeetingPlanList[0].ActionType}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>ActionType</Text>
                <Text style={styles.flatListContent1}>
                  {this.state.apqpMeetingPlanList[0].ActionType}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Action</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.state.apqpMeetingPlanList[0].Actions}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Action</Text>
                <Text style={styles.flatListContent1}>
                  {this.state.apqpMeetingPlanList[0].Actions}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Description</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.state.apqpMeetingPlanList[0].Description}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Description</Text>
                <Text style={styles.flatListContent1}>
                  {this.state.apqpMeetingPlanList[0].Description}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Due By Days</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.props?.route?.params?.MeetingDetails?.DueByDays
                    ? this.props?.route?.params?.MeetingDetails?.DueByDays
                    : "-"}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Due By Days</Text>
                <Text style={styles.flatListContent1}>
                  {this.props?.route?.params?.MeetingDetails?.DueByDays
                    ? this.props?.route?.params?.MeetingDetails?.DueByDays
                    : "-"}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Due Date</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.changeDateFormat(
                    this.state.apqpMeetingPlanList[0].DueDate
                  )}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Due Date</Text>
                <Text style={styles.flatListContent1}>
                  {this.changeDateFormat(
                    this.state.apqpMeetingPlanList[0].DueDate
                  )}
                </Text> */}
              </View>
              <View style={styles.line1}>
                <TextComponent fontSize={FONT_SIZE.SMALL} type={FONT_TYPE.BOLD}>Site</TextComponent>
                <TextComponent fontSize={FONT_SIZE.SMALL}>
                  {this.state.apqpMeetingPlanList[0].Site}
                </TextComponent>
                {/* <Text style={styles.flatListContent}>Site</Text>
                <Text style={styles.siteText}>
                  {this.state.apqpMeetingPlanList[0].Site}
                </Text> */}
              </View>
              <View style={styles.line2}>
                  <Dropdown
                    label="Status"
                    data={data}
                    baseColor="#484848"
                    textColor="#484848"
                    labelFontSize={FONT_SIZE.SMALL}
                    value={this.StatusVal}
                    valueTextStyle={styles.statusDropdownLabel}
                    labelTextStyle={styles.statusDropdownLabel}
                    onChangeText={(value) => {
                      for (var i = 0; i < data.length; i++) {
                        if (value == data[i].value) {
                          this.Status = data[i].id;
                          this.StatusVal = data[i].value;
                        }
                      }
                      console.log("Status is now", this.Status);
                    }}
                  />
                </View>
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>

        <View style={styles.footerDiv}>
          <>
            <FAB iconName="save" iconType={ICON_TYPE.Feather} onPress={() => this.onSavePress()} />
          </>
        </View>

        <ConfirmDialog
          title="Are you sure?"
          // message='You'
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: "Yes",
            onPress: this.onPressComplete.bind(this),
          }}
          negativeButton={{
            title: "No",
            onPress: () => this.setState({ dialogVisible: false }),
          }}
        />
        <Toast
          ref="toast"
          style={styles.toastStyle}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toastTextStyle}
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
// const mapDispatchToProps = (dispatch) => {
 
//     return {
//      storeActions: (actions) => dispatch({ type: "STORE_ACTIONS", actions }),
//      SetRecentActivityList: (recentActivity) =>
//      dispatch({ type: "SET_RECENT_ACTIVITY_LIST", recentActivity }),
//     };
//  //UPDATE_RECENT_ACTIVITY_LIST
//  //SET_RECENT_ACTIVITY_LIST

// };


const mapDispatchToProps = (dispatch) => {	
	
    return {	
     storeActions: (actions) => dispatch({ type: "STORE_ACTIONS", actions }),	
      SetRecentActivityList: (recentActivity) =>	
        dispatch({ type: "SET_RECENT_ACTIVITY_LIST", recentActivity }),	
    };	
  
};	
export default connect(mapStateToProps, mapDispatchToProps)(MeetingPlanScreen);
