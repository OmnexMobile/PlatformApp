import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Button,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Images } from "../themes";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { height } from "react-native-dimension";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import { strings } from "../language/Language";
import OfflineNotice from "../components/OfflineNotice";
import Fonts from "../themes/Fonts";
// Styles
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles/PeriodicHistoryStyles";
const window_width = Dimensions.get("window").width;
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";

class PeriodicHistoryScreen extends Component {
  TaskId = "";
  UserId = "";
  Token = "";
  SiteId = "";
  ProjectId = "";
  constructor() {
    super();
    this.state = {
      apqpHistoryList: [],
      loader: true,
      MaxIndex: 10,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    console.log("getting params", this.props?.route?.params);
    if (this.props?.route?.params?.TaskId) {
      this.TaskId = this.props?.route?.params?.TaskId;
      this.ProjectId = this.props?.route?.params?.ProjectId;
    }
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.getapqpHistoryList();
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
  }

  onPressBack() {
    this.props.navigation.navigate("ApqpDeliveryScreen");
  }

  handleEnd() {
    console.log("handle reached");
    this.setState(
      {
        MaxRow: this.state.MaxRow + 10,
      },
      () => {
        this.getapqpHistoryList();
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
        this.getapqpHistoryList();
      }
    );
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

  getapqpHistoryList() {
    console.log("calling apqp2 api");
    const Token = this.Token;
    const UserID = this.UserId;
    const TaskId = this.TaskId;
    const Index = 1;
    const MaxIndex = 100;

    console.log("get response from apqp2 ", UserID, TaskId, Index, MaxIndex);

    auth.getapqpHistoryList(
      UserID,
      TaskId,
      Index,
      MaxIndex,
      Token,
      (res, data) => {
        console.log("getting responses", data);
        console.log("getting responses .data.Message", data.data.Message);
        if (data.data.Message == "Success") {
          this.setState(
            {
              apqpHistoryList: data.data.Data,
              loader: false,
              isRefreshing: false,
            },
            () => {
              // console.log('apqpHistoryList', this.state.apqpHistoryList)
            }
          );
        }
      }
    );
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

  renderBounce() {
    <View
      style={{
        paddingVertical: 20,
        // borderTopWidth: 1,
        // borderColor: "#CED0CE",
        width: window_width,
        height: height(100) - 213,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <DoubleBounce size={20} color="#1CAFF6" /> */}
      <ActivityIndicator size="small" color="#1CAFF6" />
      
    </View>;
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
            <Text style={styles.headingText}> {strings.Periodic_History}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  render() {
    const { apqpHistoryList } = this.state.apqpHistoryList;
    const isRefreshing = this.state.isRefreshing;

    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}
        {this.state.loader ? (
          this.renderBounce()
        ) : (
          <View style={styles.flatListWholeView}>
            {this.state.apqpHistoryList.length > 0 ? (
              <FlatList
                data={this.state.apqpHistoryList}
                refreshing={isRefreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReached={this.handleEnd.bind(this)}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                  //<View style={styles.flatListFullSideView}>
                  <TouchableOpacity style={styles.flatListFullView}>
                    <View
                      style={{
                        width: "80%",
                        backgroundColor: "transparent",
                        //height: 175,
                        //justifyContent: "center",
                        //alignItems: "flex-end",
                        paddingLeft: 0,
                        paddingTop: 0,
                      }}
                    >
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Action:</Text>
                        <Text style={styles.deliveryTypeTextStyleAdd}>
                          {item.Action
                            ? parseInt(item.Action) == 1
                              ? strings.Add
                              : strings.Update
                            : strings.Update}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>
                          {strings.Hours + ":"}
                        </Text>
                        <Text style={styles.deliveryTypeTextStyleHours}>
                          {item.Hours}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>
                          {strings.From + ":"}
                        </Text>
                        <Text style={styles.deliveryTypeTextStyle}>
                          {item.FromPercentage}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>
                          {strings.Updated_By} :
                        </Text>
                        <Text style={styles.deliveryTypeTextStyle}>
                          {item.UpdatedBy == null ? "N/A" : item.UpdatedBy}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>
                          {strings.Updated_On + ":"}
                        </Text>
                        <Text style={styles.deliveryTypeTextStyle}>
                          {this.changeDateFormat(item.UpdatedOn)}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listTextRemark}>
                          {strings.Remarks + ":"}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text
                          style={
                            (styles.deliveryTypeTextStyleRemark,
                            { paddingLeft: 11, fontSize: 16 })
                          }
                        >
                          {item.Remarks}
                        </Text>
                      </View>
                    </View>

                    {/* <View
                      style={{
                        width: "15%",
                        backgroundColor: "transparent",
                        height: 160,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ProgressCircle
                        percent={item.Percentage}
                        radius={33}
                        borderWidth={5}
                        color="#48BCF7"
                        shadowColor="lightgrey"
                        bgColor="#fff"
                      >
                        <Text style={{ fontSize: 20 }}>
                          {item.Percentage + "%"}
                        </Text>
                      </ProgressCircle>
                    </View> */}
                  </TouchableOpacity>
                  //</View>
                )}
              />
            ) : (
              this.NoRecordsFound()
            )}
          </View>
        )}
        <View style={styles.footerDiv}>
          <View style={styles.footerDiv}>
            <View style={styles.footerContainer}>
              <View style={styles.footerButton2}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)
                  }
                >
                  <Icon name="home" size={32} color="#00BAC8" />
                  <Text style={{ color: "#00BAC8" }}>{strings.home}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <View
                style={[
                  styles.footerButton1,
                  { borderLeftWidth: 0.5, borderLeftColor: "white" },
                ]}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    height: 25,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate(ROUTES.PROJECT_LIST_APQP, {
                      apqpNew: this.state.apqpNew,
                      apqpTobecompleted: this.state.apqpTobecompleted,
                      apqpPending: this.state.apqpPending,
                      todayn:1,
                    })
                  }
                >
                  <Icon name="clone" size={30} color="#00BAC8" />
                </TouchableOpacity>
                <Text style={{ color: "#00BAC8" }}>Project</Text>
              </View>
            </View>
          </View>
        </View>
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
)(PeriodicHistoryScreen);
