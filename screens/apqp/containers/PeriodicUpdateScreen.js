import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import OfflineNotice from "../components/OfflineNotice";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
import AsyncStorage from "@react-native-community/async-storage";
import { strings } from "../language/Language";
// Styles
import styles from "./styles/PeriodicUpdateStyles";
import Moment from "moment";
import { ICON_TYPE, ROUTES } from "constants/app-constant";
// import Reactotron from "reactotron-react-native";
import GlobalHeader from "components/GlobalHeader";
import { FAB, NoRecordFound } from "components";
import IconComponent from "components/icon-component";
import CardProgress from "../components/CardProgress";
import { successMessage } from "helpers/utils";

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
        // this.refs.toast.show(
        //   strings.Save_Message_update +
        //   strings.mail_sent_to +
        //   "\n" +
        //   this.props?.route?.params?.mailIDD,
        //   DURATION.LENGH_LONG
        // );
        successMessage({message: '', description: strings.Save_Message_update +
          strings.mail_sent_to + "\n" + this.props?.route?.params?.mailIDD
        })
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
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
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

  formatRemarksText = (remarks) => {
    if (!remarks) return "";
    return remarks
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  };

  getRemarksLines = (remarks) => {
    const formatted = this.formatRemarksText(remarks);
    return formatted ? formatted.split("\n").filter(Boolean) : [];
  };

  renderBounce() {
    return (
      <View style={styles.bounceContainer}>
        <ActivityIndicator size="small" color="#1CAFF6" />
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
      <>
        <GlobalHeader
          title={strings.Progress_Update}
          onLeftPress={() => this.props.navigation.goBack()}
          hideRight={true}
          extraRightIcon="upload"
          onExtraRightPress={() => this.openDeliveryInfo()}
          showBackButton={true}
        />
      </>
    );
  }

  NoRecordsFound() {
    return (
      // <Text style={styles.noRecordsText}>
      //   {strings.No_records_found}
      // </Text>
      <View style={styles.emptyStateContainer1}>
        <NoRecordFound />
      </View>
    );
  }

  renderTopSpacer() {
    return (
      <View
        style={Platform.OS === "ios" ? styles.topSpacerIos : styles.topSpacerAndroid}
      />
    );
  }

  render() {
    const { apqpPeriodicList } = this.state;
    const isRefreshing = this.state.isRefreshing;

    return (
      <View style={styles.mainContainer}>
        {this.renderTopSpacer()}
        <OfflineNotice />
        {this.renderHeader()}
        {this.state.isLoading ? (
          this.renderBounce()
        ) : (
          <View style={styles.flatListWholeViewWithTopMargin}>
            <CardProgress
              ProjectName={this.ProjectName}
              TaskName={this.TaskName}
              StartDate={this.StartDate}
              EndDate={this.EndDate}
              completedPercent={this.ResourcePercent}
              updatesCount={apqpPeriodicList?.length || 0}
            />

            {this.state.apqpPeriodicList.length > 0 ? (
              <FlatList
                data={apqpPeriodicList}
                //keyExtractor={item => item.key}
                refreshing={isRefreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReachedThreshold={0.01}
                onEndReached={this.handleEnd.bind(this)}
                renderItem={({ item }) => (
                  <View style={styles.sectionHeaderContainer}>
                    <View style={styles.sectionArrowSlot}>
                      <IconComponent
                        name="arrow-right"
                        type={ICON_TYPE.Feather}
                        size={18}
                        color="#1FBFD0"
                      />
                    </View>
                    <View style={styles.sectionHeader}>
                      <TouchableOpacity
                        onPress={this.onPressedit.bind(this, item, "Edit")}
                        activeOpacity={0.8}
                        style={styles.childCardTouchable}
                      >
                        {/* <View style={styles.childBadgeRow}>
                          <View style={styles.childDot} />
                          <Text style={styles.childBadgeText}>Periodic Update</Text>
                        </View> */}
                        <View style={[styles.flatListInsideView, styles.compactRow]}>
                          <Text style={styles.listText}>Completed % :</Text>
                          <Text style={styles.deliveryTypeTextStylePercent}>
                            {item.Percentage}
                          </Text>
                        </View>
                        <View style={[styles.flatListInsideView, styles.compactRow]}>
                          <Text style={styles.listText}>Period :</Text>
                          <Text
                            style={styles.dateTextStyle}
                            numberOfLines={1}
                          >
                            {this.changeDateFormatCard(item.StartDate)} -{" "}
                            {this.changeDateFormatCard(item.Enddate)}
                          </Text>
                        </View>
                        <View style={styles.flatListInsideView}>
                          <Text style={styles.listText}>{strings.Hours} :</Text>
                          <Text style={styles.deliveryTypeTextStyleHours}>
                            {item.Hours}
                          </Text>
                        </View>
                        <View style={styles.flatListInsideView}>
                          <Text style={styles.listText}>{strings.Remarks}:</Text>
                        </View>
                        <View style={styles.flatListInsideView1}>
                          <View style={styles.remarksText}>
                            {this.getRemarksLines(item.Remarks).map((remark, idx) => (
                              <Text key={`${item.Id || "remarks"}-${idx}`} style={styles.remarksLineText}>
                                {remark}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

            ) : (
              this.NoRecordsFound()
            )}
            <View style={styles.listBottomSpacer} />
          </View>
        )}
        <View style={styles.footerDiv}>
          <FAB iconName="plus" iconType={ICON_TYPE.Feather} onPress={() => this.onPressedit(this, "Add")} />
        </View>
        <Toast
          ref="toast"
          style={styles.toastStyle}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toastText}
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
