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
import { Dropdown } from "react-native-material-dropdown";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import { ConfirmDialog } from "react-native-simple-dialogs";
import Toast, { DURATION } from "react-native-easy-toast";
import { strings } from "../language/Language";
// Styles
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles/RiskActionStyles";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
const moment = extendMoment(Moment);
// import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";

class RiskActionScreen extends Component {
  UserId = "";
  Token = "";
  ProjectId = "";
  ActionId = "";
  Status = 0;
  StatusVal = "-- Please select --";

  constructor() {
    super();
    this.state = {
      apqpRiskActionList: [],
      loader: true,
      dialogVisible: false,
    };
  }

  componentDidMount() {
    console.log("getting params", this.props?.route?.params);
    if (this.props?.route?.params) {
      let actionid = this.props?.route?.params?.item?.ActionID;
      this.ActionId =
        actionid == undefined
          ? this.props?.route?.params?.item?.ActionId
          : actionid;
      this.getData()
        .then((res) => {
          console.log("async--->", res);
          this.UserId = res.UserId;
          this.Token = res.Token;
          this.getapqpRiskActionList();
        })
        .catch((e) => {
          console.log("Async aerror", e);
        });
    }
  }

  onPressBack() {
    this.props.navigation.navigate(ROUTES.RISK_SCREEN);
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

getData = async (userdata) => {
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

  getapqpRiskActionList() {
    console.log("getapqpRiskActionList");
    var ActionId = this.ActionId;
    var token = this.Token;
    var Status = 0;

    console.log("ActionId", ActionId);

    auth.getapqpRiskActionList(ActionId, Status, token, (res, data) => {
      console.log("getting responses", data);
      if (data.data.Message == "Success") {
        this.Status = data.data.Data
          ? data.data.Data.length > 0
            ? data.data.Data[0].StatusCode
            : -1
          : -1;
        this.StatusVal = data.data.Data
          ? data.data.Data.length > 0
            ? data.data.Data[0].Status
            : -1
          : -1;
        this.setState(
          {
            apqpRiskActionList: data.data.Data,
            loader: false,
          },
          () => {
            console.log("apqpRiskActionList", this.state.apqpRiskActionList);
          }
        );
      } else {
        console.log("apqpRiskActionList", this.state.apqpRiskActionList);
      }
    });
  }

  onSavePress() {
    console.log("this.Status", this.Status);
    if (this.Status != undefined) {
      var ActionId = this.ActionId;
      var token = this.Token;
      var Status = this.Status;

      auth.getapqpRiskActionSave(ActionId, Status, token, (res, data) => {
        console.log("getapqpRiskActionSave");

        console.log("-->", data);
        if (data.data.Message == "Success") {
          this.refs.toast.show(
            "Risk status updated successfully.",
            DURATION.LENGTH_SHORT
          );
          this.onPressBack();
        } else {
          this.refs.toast.show(
            "Failed to update the risk status!",
            DURATION.LENGTH_SHORT
          );
        }
      });
    } else {
      this.refs.toast.show("Please select Status!", DURATION.LENGTH_SHORT);
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
        var ActionId = this.state.apqpRiskActionList[0].ActionID;
        var Status = 2;
        var Token = this.Token;
        auth.getapqpRiskActionList(ActionId, Status, Token, (res, data) => {
          console.log("save response", data);
          if (data.data.Message == "Success") {
            this.refs.toast.show(data.data.Data, DURATION.LENGTH_SHORT);
          }
        });
      }
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
            <Text style={styles.headingText}>{strings.Risk_Action}</Text>
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
    let data = [
      {
        id: 0,
        value: "Not Started",
      },
      {
        id: 1,
        value: "In-Progress",
      },
      {
        id: 2,
        value: "Completed",
      },
    ];

    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        {this.renderHeader()}

        <ScrollView style={styles.flatListWholeView}>
          {this.state.apqpRiskActionList.length > 0 ? (
            <View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Risk Number </Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].RiskNumber}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Risk Name </Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].RiskName}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Mitigation Action</Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].ActionType}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>DeadLine Date</Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].DeadlineDate}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Phase Deadline</Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].PhaseDeadline}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Implementation Date</Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].ImplementationDate}
                </Text>
              </View>
              <View style={styles.line1}>
                <Text style={{ color: "grey" }}>Verification Date</Text>
                <Text style={{ fontSize: 18, color: "#000" }}>
                  {this.state.apqpRiskActionList[0].VerificationDate}
                </Text>
              </View>

              <View style={styles.line2}>
                <View style={{ bottom: 10 }}>
                  <Dropdown
                    label="Status"
                    data={data}
                    value={this.StatusVal}
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
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>

        <View style={styles.footerDiv}>
          <View style={styles.footerContainer}>
            <View style={styles.footerButton1}>
              <TouchableOpacity
                onPress={() => this.onSavePress()}
                style={{
                  width: "100%",
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="save" size={30} color="#00BAC8" />
                <Text style={{ color: "#00BAC8" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RiskActionScreen);
