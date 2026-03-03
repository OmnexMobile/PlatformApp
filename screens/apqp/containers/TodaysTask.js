import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import styles from "./styles/DashboardStyles";
import Images from "../themes/Images";
import { connect } from "react-redux";
// import FilterSection from "./FilterSection";
import { DoubleBounce } from "react-native-loader";
import Toast from "react-native-easy-toast";
import Moment from "moment";
// import { extendMoment } from "moment-range";
import { height } from "react-native-dimension";
// import ProgressCircle from "react-native-progress-circle";
import Fonts from "../themes/Fonts";
import { strings } from "../language/Language";
import NetInfo from "@react-native-community/netinfo";
import { debounce } from "underscore";
import OfflineNotice from "../components/OfflineNotice";
import ScrollableTabView, {
  DefaultTabBar,
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
//component
import CalendarAgenda from "../components/CalendarAgenda";
import { Dropdown } from "react-native-material-dropdown";
import * as _ from "lodash";
import AsyncStorage from "@react-native-community/async-storage";
import auth from "../../../services/APQP-Auth";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
// import Reactotron from "reactotron-react-native";
// import PagerView from "react-native-pager-view";

const window_width = Dimensions.get("window").width;
const Reset = "Reset";
class ActionTabInterface extends Component {
  keyVal = 0;
  sortType = 0;
  isCalender = undefined;

  dropdata = [
    {
      text: "Reset",
      value: strings.reset,
    },
    {
      text: "StartDate",
      value: strings.SortByStartDate,
    },

    {
      text: "EndDate",
      value: strings.SortByEndDate,
    },
    {
      text: "Actions",
      value: strings.Actions,
    },
    {
      text: "Site",
      value: strings.site,
    },
  ];

  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    UserId = "";
    Token = "";
    SiteId = "";

    this.state = {
      isFileterApplied: false,
      token: "",
      userId: "",
      siteId: "",
      ListType: "",
      //Actions Count
      totalActions: 0,
      openActions: 0,
      inProgressActions: 0,
      dailyActions: 0,

      //Actions Data
      actionsList: [],
      openActionList: [],
      inprogressActions: [],

      //Projects Count
      totalProjectsNew: 0,
      totalProjects: 0,
      totalTobeCompletedProjects: 0,
      totalPendingProjects: 0,
      isFilterApplied: false,
      //Risk Count
      totalRisks: 0,

      //Meetings Count
      totalMeeting: 0,
      totalMeetingsNew: 0,
      //Document Counts
      totalDocuments: 0,
      totalDocumentsNew: 0,

      selectedStartDate: null,
      selectedEndDate: null,

      MaxRow: 10,
      sortOrder: "desc",
      OrderBy: "StartDate",
      StartDate: "",
      EndDate: "",
      completecount: 0,
      page: 1,
      loading: true,
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: true,
      filterType: "",
      sortype: "",
      filterId: "",
      isMounted: false,
      isPageEmpty: false,
      isLocalFilterApplied: false,
      isSearchFinished: false,
      enableScrollViewScroll: true,
      selectedFormat:
        this.props?.data?.projects?.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props?.data?.projects?.userDateFormat,

      ProjectSearch: "",
      ProjectColumn: "",
      filterTypeFG: 0,
      SortBy: "StartDate",
      sortOrder: "",
      cFilterVal: 0,
      default: 1, // existing workf
      // default: 0 // existing workf
      // recent_activity: this.props?.data?.projects?.recentActivity
      //   ? this.props?.data?.projects?.recentActivity.length > 0
      //     ? this.props?.data?.projects?.recentActivity.asMutable().reverse()
      //     : []
      //   : [],
      recent_activity: this.props?.data?.projects?.recentActivity
      ? this.props?.data?.projects?.recentActivity.length > 0
        ? [...this.props.data.projects.recentActivity].reverse()
        : []
      : [],
      filterArrSplit: [],
      activeTab: 0,
      // default for SORT
      project_sort: 0,
      project_sortText: "",
      project_filterType: "Sort",
      agendaData: {},
      todayLoader: true,
      isErrorRefresh: false,
    };
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.backHandle();
      return true;
    });
  }

  backHandle() {
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    getCurrentPage = this.props.route.name;
    // var PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    var routes = this.props.navigation.getState().routes;
    var PreviousPage = routes[routes.length - 2]?.name;
    console.log("Previous---->", PreviousPage);
    console.log("Page------->"+getCurrentPage)
    if (PreviousPage == ROUTES.ACTION_TAB_INTERFACE) {
      this.props.navigation.navigate(ROUTES.ACTION_TAB_INTERFACE);
    } else {
      this.backHandler.remove();
    }
  }

  componentWillMount() {
    console.log(
      "this.props.route.params",
      this.props.route.params
    );
    if (this.props?.route?.params) {
      if (this.props?.route?.params?.ActiveTab) {
        if (this.props?.route?.params?.ActiveTab == "recent") {
          this.setState({ activeTab: 4 });
        } else if (this.props?.route?.params?.ActiveTab == "today") {
          this.setState({ activeTab: 3 });
        }
      }
    }
  }

  componentDidMount() {
    console.log("this.state.activetab", this.state.activeTab);

    if (this.props?.data?.projects?.language === "Chinese") {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage("zh");
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props?.data?.projects?.language === null ||
      this.props?.data?.projects?.language === "English"
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage("en-US");
        //this.setState({});
      });
    }

    // this.setState({
    //   isFilterApplied: this.props.state.params.isFileterApplied,
    // });
    this.props.navigation.addListener("didFocus", () => {
      // console.log('Action List Component Focussed!')

      if (this.props.navigation.getParam("filter_Arr")) {
        console.log(
          "Filter Applied",
          this.props.navigation.getParam("filter_Arr")
        );
        this.setState({ isFilterApplied: false }, () => {
          this.filterApplied(this.props.navigation.getParam("filter_Arr"));
        });

        // this.loadRecentAudits()
      } else {
        console.log("$$#$#$#$###$#$ into -->");
        //if (this.state.isMounted) {
        this.setState(
          {
            loading: false,
            isRefreshing: false,
            isFileterApplied:
              this.props?.route?.params &&
              this.props?.route?.params?.filterType == "Calendar"
                ? true
                : false,
            isPageEmpty: false,
            isErrorRefresh: false,
            activeTab: this.props?.route?.params
              ? this.props?.route?.params?.activeTab
              : 0,
          },
          () => {
            this.getActionlist("load");
          }
        );
        // }
        if (this.state.token == "") {
          this.getSessionValues();
        }
      }
      this.getData()
        .then((res) => {
          console.log("async", res);
          this.setState(
            {
              userId: res.UserId,
              siteId: res.SiteId,
              token: res.Token,
              isFileterApplied:
                this.props?.route?.params &&
                this.props?.route?.params?.filterType == "Calendar"
                  ? true
                  : false,
            },
            () => {
              // this.getActionlist("didmount"); //on Load get All Actions
            }
          );
          this.UserId = res.UserId;
          this.Token = res.Token;
          this.SiteId = res.SiteId;
          this.getapqpDashboarddata(res);
          //this.getRecentTask();
        })
        .catch((e) => {
          console.log("Async aerror", e);
        });
      this.componentWhenReceiveProps();
    });
  }

  componentWhenReceiveProps() {
    // var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    // // console.log('--CurrentPage--->',CurrentPage)
    // if (CurrentPage == "AllTabAuditList") {
    // }
  }

  componentWillReceiveProps() {
    console.log("props recieved1", this.props?.data?.projects?.counts);
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteId = res.SiteId;
        this.getAllProjectlist(res);
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
  }

  getSessionValues = () => {
    try {
      const USERID = this.props?.data?.projects?.userId;
      const TOKEN = this.props?.data?.projects?.token;
      const SITEID = this.props?.data?.projects?.siteId;
      if (TOKEN !== null) {
        this.setState(
          {
            token: TOKEN,
            userId: USERID,
            siteId: SITEID,
            loading: true,
          },
          () => {
            if (this.props?.data?.projects?.isOfflineMode) {
              this.setState({
                //projectList: this.props?.data?.projects?.projects,
                //projectListAll: this.props?.data?.projects?.projects,
                loading: false,
                isRefreshing: false,
                isPageEmpty: false,
                isMounted: true,
              });
            } else {
              NetInfo.fetch().then((netStatus) => {
                if (netStatus.isConnected) {
                  //this.getAllProjectlist();
                } else {
                  this.setState(
                    {
                      // projectList: this.props?.data?.projects?.projects,
                      // projectListAll: this.props?.data?.projects?.projects,
                      loading: false,
                      isRefreshing: false,
                      isPageEmpty: false,
                      isMounted: true,
                    },
                    () => {
                      // console.log('projectList',this.state.projectList);
                      // console.log('AuditDashBody Props After State Changing...', this.props)
                    }
                  );
                }
              });
            }
          }
        );
      }
    } catch (error) {
      // Error retrieving data
      // console.log('Failed to retrive a login session!!!',error)
    }
  };

  // getData = async () => {
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

  listFooter() {
    console.log("footer enabled");
    return (
      <View>
        {this.state.isLazyLoading ? (
          <ActivityIndicator animating size="large" />
        ) : (
          <View></View>
        )}
      </View>
    );
  }

  handleEnd() {
    console.log("handle reached");
    this.setState(
      {
        MaxRow: this.state.MaxRow + 10,
      },
      () => {
        this.getActionlist("handleend");
      }
    );
  }

  updateRecentActionList(item) {
    var list = [];
    list.push(item);
    console.log("HI ActionPage old", list[0].ActionId, list);
    var recentActionListProps = this.props?.data?.projects?.recentActivity;
    var recentActions = [];

    if (recentActionListProps && recentActionListProps.length > 0) {
      var isActionExistsInRecentList = false;
      for (var i = 0; i < recentActionListProps.length; i++) {
        console.log(
          "HI ActionPage new",
          recentActionListProps[i][0].ActionId,
          list[0].ActionId,
          recentActionListProps[i]
        );

        recentActions.push(recentActionListProps[i]);
        if (recentActionListProps[i][0].ActionId == list[0].ActionId) {
          isActionExistsInRecentList = true;
        }
      }
      if (!isActionExistsInRecentList) {
        recentActions.push(list);
        this.props.updateRecentActivityList(recentActions);
      }
    } else {
      recentActions.push(list);
      this.props.updateRecentActivityList(recentActions);
    }
  }

  openActionPage(ActionItem) {
    console.log("HI ActionPage is new", ActionItem);
    this.updateRecentActionList(ActionItem);
    ActionItem.Modules === "Meeting"
      ? this.props.navigation.navigate(ROUTES.MEETING_PLAN_SCREEN, {
          MeetingDetails: ActionItem,
          //activeTab: this.state.activeTab,
        })
      : ActionItem.Modules === "Risk"
      ? this.props.navigation.navigate(ROUTES.RISK_ACTION_SCREEN, {
          item: ActionItem,
          //activeTab: this.state.activeTab,
        })
      : this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
          itemData: ActionItem,
          ProjectId: ActionItem.Project_id,
          TaskID: ActionItem.TaskID,
          RouteParam: "Project",
          //activeTab: this.state.activeTab,
        });
  }

  handleRefresh() {
    this.setState(
      {
        isRefreshing: true,
        MaxRow: 10,
      },
      () => {
        this.getActionlist("handle refresh");
      }
    );
  }

  applyFilterChanges(
    sortype,
    droptext,
    filterType,
    startDate,
    endDate,
    ProjectSearch
  ) {
    console.log("sortype", sortype);
    console.log("droptext", droptext);
    console.log("filterType", filterType);
    console.log("startDate----->", startDate);
    console.log("endDate ---->", endDate);

    if (filterType == "Calendar") {
      this.setState({
        isLocalFilterApplied: true,
        SortBy: "",
        sortOrder: "",
        cFilterVal: 0,
      });
    } else {
      this.setState({
        isLocalFilterApplied: false,
      });
    }

    this.setState({ loading: true }, () => {
      switch (filterType) {
        // case "Recent":
        //   this.setState(
        //     {
        //       filterId: "",
        //       page: 1,
        //       loading: true,
        //       isRefreshing: true,
        //       isLazyLoadingRequired: false,
        //       isErrorRefresh: false,
        //       SortBy: "",
        //       sortOrder: "",
        //       cFilterVal: 0,
        //     },
        //     () => {
        //       this.loadRecentProjects();
        //     }
        //   );
        //   break;
        case "Sort":
          this.setState(
            {
              filterId: "",
              page: 1,
              loading: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              actionsList: [],
              filterTypeFG: 0,
              OrderBy: droptext, //Sort Column
              sortOrder: sortype == 0 ? "desc" : "asc", // ASC
              cFilterVal: 0,
            },
            () => {
              this.getActionlist("sorting");
            }
          );
          break;
        default:
          break;
      }
    });
  }

  changeDateFormatCard = (inDate) => {
    if (inDate) {
      // var DefaultFormatL = this.state.selectedFormat + " " + "HH:mm";
      var DefaultFormatL = this.state.selectedFormat + " ";
      var sDateArr = inDate.split("T");
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

  onChangeText(value) {
    console.log("onChangeText", value);
    console.log("droptext::::", this.state.project_sortText);
    var dropvalue = value;
    var dropText = "";
    for (var i = 0; i < this.dropdata.length; i++) {
      if (this.dropdata[i].value == dropvalue) {
        dropText = this.dropdata[i].text;
      }
    }

    console.log("droptextPPPPPPP", dropText);
    this.setState(
      {
        isFilterApplied: true,
        project_sortText: dropText == Reset ? "StartDate" : dropText,
        project_filterType: "Sort",
      },
      () => {
        this.applyFilterChanges(
          this.state.project_sort,
          this.state.project_sortText,
          this.state.project_filterType,
          null,
          null,
          null
        );
      }
    );
  }

  // loadRecentProjects() {
  //   if (
  //     this.props?.data?.projects?.recentActivity &&
  //     this.props?.data?.projects?.actions
  //   ) {
  //     var recent = this.props?.data?.projects?.recentActivity;
  //     var AllactionsList = this.props?.data?.projects?.actions;
  //     var total_arr = [];

  //     for (var i = 0; i < recent.length; i++) {
  //       var flag = false;
  //       for (var j = 0; j < AllactionsList.length; j++) {
  //         if (recent[i].ActionId == AllactionsList[j].ActionId) {
  //           total_arr.push(AllactionsList[j]);
  //           flag = true;
  //         }
  //       }
  //       if (!flag) {
  //         total_arr.push(recent[i]);
  //       }
  //     }
  //     this.props.updateRecentActivityList(total_arr);
  //     this.setState(
  //       {
  //         recent_activity: total_arr.reverse(),
  //       },
  //       () => {}
  //     );
  //   }
  // }

  changeProjectSort(value) {
    this.setState(
      {
        project_sort: value,
        project_sortText:
          this.state.project_sortText === ""
            ? "StartDate"
            : this.state.project_sortText,
      },
      () => {
        console.log(this.state.project_sort);
        this.applyFilterChanges(
          this.state.project_sort,
          this.state.project_sortText,
          this.state.project_filterType,
          null,
          null,
          null
        );
      }
    );
  }

  openProjectPage(ActionItem) {
    console.log("----------->Recent Actions--->ActionItem---->", ActionItem);
    console.log("log captured");

    ActionItem.Modules === "Meeting"
      ? this.props.navigation.navigate(ROUTES.MEETING_PLAN_SCREEN, {
          MeetingDetails: ActionItem,
          //activeTab: this.state.activeTab,
        })
      : ActionItem.Modules === "Risk"
      ? this.props.navigation.navigate(ROUTES.RISK_ACTION_SCREEN, {
          itemData: ActionItem,
          //activeTab: this.state.activeTab,
        })
      : ActionItem.Modules === "Projects"
      ? this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
          itemData: ActionItem,
          ProjectId: ActionItem.Actions,
          TaskID: ActionItem.ActionType,
          RouteParam: "Project",
          //activeTab: this.state.activeTab,
        })
      : this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
          itemData: ActionItem,
          ProjectId: ActionItem.Actions,
          TaskID: ActionItem.ActionType,
          RouteParam: "Project",
          //activeTab: this.state.activeTab,
        });
  }

  //Main Render Method
  render() {
    console.log("=========>Today's====Recent====DailyTask=========>"+"allTodayprojects")
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}
        <View style={styles.flatList}>
          <ScrollableTabView
            initialPage={this.state.activeTab}
            tabBarTextStyle={{ fontSize: 18 }}
            renderTabBar={() => (
              <DefaultTabBar
                backgroundColor="white"
                activeTextColor="#2CB5FD"
                inactiveTextColor="#747474"
                underlineStyle={{
                  // backgroundColor: "#00bec3",
                  // borderBottomColor: "#00bec3",
                  backgroundColor: "#ffffff",
                  borderBottomColor: "#ffffff",
                  borderBottomWidth: 0.2,
                }}
                textStyle={{
                  fontSize: Fonts.size.h6,
                  fontFamily: "OpenSans-Regular",
                }}
              />
            )}
            tabBarPosition="overlayTop"
            onChangeTab={(o) => {
              if (this.state.isFilterApplied === false) {
                this.loadActions(o.i);
              }
            }}
          >
            {/*this.allActions()}
            {this.openActions()}
            {this.inProgressActions()}
          {this.dailyActions()*/}
            {this.recentActions()}
          </ScrollableTabView>
        </View>
        <View></View>
        {/* <View style={styles.footerDiv}>
          <View style={styles.footerDiv}>
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 25,
                }}
                onPress={() =>
                  this.props.navigation.navigate("DashboardScreen")
                }
              >
                <Icon name="home" size={32} color="#00BAC8" />
                <Text style={{ color: "#00BAC8" }}>{strings.home}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

        <Toast
          ref="toast"
          style={{ backgroundColor: "black", margin: 20 }}
          position="bottom"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }

  //Filter
  filterApplied(filter) {
    console.log("filterApplied inside ", filter);
    var sortype = this.state.project_sort;
    var droptext = this.state.project_sortText;
    var FilterArray = [];
    if (filter[0].filterType === "GlobalFilter") {
      filter[0].startDate !== "" && filter[0].endDate !== ""
        ? FilterArray.push(
            filter[0].startDate + " " + strings.to + " " + filter[0].endDate
          )
        : null;
      // filter[0].globalSearchCol !== ""
      //   ? FilterArray.push(filter[0].globalSearchCol)
      //   : null;
      filter[0].globalSearch && filter[0].globalSearch !== ""
        ? FilterArray.push(
            //filter[0].globalSearchCol + " : " + filter[0].globalSearch
            filter[0].globalSearch
          )
        : null;
    } else if (filter[0].filterType === "Calendar") {
      FilterArray = [
        filter[0].startDate + " " + strings.to + " " + filter[0].endDate,
      ];
    }
    console.log("FilterArray", FilterArray);
    this.setState(
      {
        ProjectSearch: filter[0].globalSearch,
        ProjectColumn: filter[0].globalSearchCol,
        isFileterApplied: true,
        filterArrSplit: FilterArray,
        loading: true,
        OrderBy: droptext,
        sortOrder: sortype,
        isErrorRefresh: false,
        isMounted: false,
        StartDate: filter[0].startDate,
        EndDate: filter[0].endDate,
      },
      () => {
        this.getActionlist("filter");
      }
    );
  }

  deleteFilter() {
    this.props.route.params.filter_Arr = undefined;
    this.setState(
      {
        filterArrSplit: [],
        ProjectSearch: "",
        ProjectColumn: "",
        page: 1,
        loading: true,
        isErrorRefresh: false,
        StartDate: "",
        EndDate: "",
        //ListType: 2,
        actionsList: [],
        //activeTab: 0
      },
      () => {
        this.getActionlist("delete");
      }
    );
  }

  renderFilter() {
    return (
      <View
        style={{
          width: "100%",
          height: null,
          flexDirection: "row",
          padding: 8,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {this.state.filterArrSplit.map((item, index) => (
          <View key={index} style={styles.renderFilterView}>
            <Text
              style={{
                fontSize: Fonts.size.medium,
                fontFamily: "OpenSans-Regular",
              }}
            >
              {item}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => this.deleteFilter()}
          style={styles.renderFilterView}
        >
          <View>
            <Icon name="close" size={20} color={"black"} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  filterSection() {
    return (
      <View style={styles.filterCont}>
        <TouchableOpacity
          style={styles.filterBox}
          onPress={() =>
            this.props.navigation.navigate(ROUTES.FILTER_SCREEN_APQP, {
              callback_flag:
                this.state.filterArrSplit.length == 0 ? false : true,
            })
          }
        >
          <Icon name="filter" size={20} color="#89888A" />
          <Text
            style={{
              fontSize: Fonts.size.medium,
              color: "#89888A",
              paddingLeft: 5,
              fontFamily: "OpenSans-Regular",
            }}
          >
            {strings.filter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBox}>
          <View style={{ flex: 2 }}>
            <Dropdown
              value={strings.SortByStartDate}
              onChangeText={this.onChangeText.bind(this)}
              data={this.dropdata}
              containerStyle={{ flex: 1 }}
              itemPadding={5}
              dropdownOffset={{ top: 14, left: 0 }}
              width={300}
              baseColor="lightgrey"
              itemTextStyle={{ fontFamily: "OpenSans-Regular" }}
            />
          </View>
          {this.state.project_sort == 0 ? (
            <TouchableOpacity
              onPress={() => this.changeProjectSort(1)}
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Icon name="long-arrow-down" size={20} color="#19BFC1" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.changeProjectSort(0)}
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Icon name="long-arrow-up" size={20} color="#19BFC1" />
            </TouchableOpacity>
          )}

          {/* <Text style={{ fontSize: Fonts.size.medium, color: "#89888A", paddingLeft: 5}}>Sort</Text> */}
        </TouchableOpacity>
      </View>
    );
  }
  //End Filter

  //START ACTTION METHODS
  loadActions(index) {
    console.log(
      "index of tab " + index + "^^loadaction " + this.state.isFileterApplied
    );
    switch (index) {
      case 0: // All Actions
        this.setState(
          {
            ListType: 2,
            actionsList: [],
            loading: true,
            activeTab: 0,
          },
          () => {
            this.state.isFileterApplied == false
              ? this.getActionlist("all")
              : null;
          }
        );

        break;
      case 1: // Open Actions
        this.setState(
          {
            ListType: 0,
            actionsList: [],
            loading: true,
            activeTab: 1,
            isFileterApplied: false,
          },
          () => {
            this.getActionlist("open");
          }
        );

        break;
      case 2: // In Progress Actions
        this.setState(
          {
            ListType: 1,
            actionsList: [],
            loading: true,
            activeTab: 2,
            isFileterApplied: false,
          },
          () => {
            this.getActionlist("inprogress");
          }
        );
        console.log(
          "Data of tab " + this.state.ListType + "---" + this.state.actionsList
        );

        break;
      case 3:
        console.log("Data of tab 3 " + this.props?.data?.projects?.userDateFormat);
        console.log("Data of tab 333 ", this.state.agendaData);
        this.setState({ todayLoader: false });
        break;
      case 4:
        console.log("Data of tab 4 ");
        if (this.props?.data?.projects?.recentActivity) {
          console.log("recent_activity:::::::out", this.state.recent_activity);
          this.setState(
            {
              recent_activity: this.props?.data?.projects?.recentActivity
                ? this.props?.data?.projects?.recentActivity.length > 0
                  ? this.props?.data?.projects?.recentActivity
                      .asMutable()
                      .reverse()
                  : []
                : [],
              recentLoading: false,
            },
            () => {
              console.log(
                "recent_activity:::::::in",
                this.state.recent_activity
              );
            }
          );
        } else {
          this.setState(
            {
              recent_activity: [],
              recentLoading: false,
            },
            () => {}
          );
        }
        break;
      default:
        break;
    }
  }

  //Get Action Tab Count Data
  getapqpDashboarddata(res) {
    console.log("calling dashboard api");
    var UserID = res.UserId;
    var Siteid = res.SiteId;
    var token = res.Token;
    console.log(UserID, Siteid, token);

    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        auth.getapqpDashboarddata(UserID, Siteid, token, (res, data) => {
          //console.log("getting responses", data);
          if (data.data.Message == "Success") {
            var apqpDashboarddata = [];
            apqpDashboarddata = data.data.Data;
            console.log("apqpDashboarddata printed");
            //console.log(apqpDashboarddata);
            this.setState(
              {
                // apqpList: apqpDashboarddata,
                totalProjects: apqpDashboarddata.APQPPPAP,
                totalDocuments: apqpDashboarddata.Documents,
                totalMeeting: apqpDashboarddata.Meetings,
                totalRisks: apqpDashboarddata.Risk,
                totalActions: apqpDashboarddata.TotalActions,
                openActions: apqpDashboarddata.Open,
                inProgressActions: apqpDashboarddata.Inprogress,
                totalMeetingsNew: apqpDashboarddata.MeetingsNew,
                totalDocumentsNew: apqpDashboarddata.DocProNew,
                totalProjectsNew: apqpDashboarddata.NewAPQP,
                totalTobeCompletedProjects: apqpDashboarddata.TobeCompleted,
                totalPendingProjects: apqpDashboarddata.PendingTask,
              },
              () => {
                //console.log("setting up the list...", apqpDashboarddata);
                //console.log("completecount", this.state.completecount);
              }
            );
          } else {
            this.setState(
              {
                apqpList: [],
              },
              () => {
                console.log("error fetching");
              }
            );
          }
        });
      } else {
        this.refs.toast.show(strings.Project_List_Failed, DURATION.LENGTH_LONG);
        this.setState(
          {
            // projectList: this.props?.data?.projects?.projects,
            // projectListAll: this.props?.data?.projects?.projects,
            loading: false,
            isRefreshing: false,
            isLazyLoading: false,
            isLazyLoadingRequired: false,
            isPageEmpty: false,
            isMounted: true,
            isErrorRefresh: false,
          },
          () => {}
        );
      }
    });
  }

  RenderActionFlashList() {
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={this.state.actionsList}
        extraData={this.state}
        onEndReached={this.handleEnd.bind(this)}
        onEndReachedThreshold={0.01}
        refreshing={this.state.isRefreshing}
        onRefresh={debounce(this.handleRefresh.bind(this), 800)}
        ListFooterComponent={this.listFooter.bind(this)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this.openActionPage(item)}>
            <View style={styles.projectBox}>
              <View style={styles.projectBoxContent}>
                <View>
                  {item.Modules == "APQP" ? (
                    <Image
                      source={Images.apqpModuleIcon}
                      style={styles.apqpTypeIcon}
                    />
                  ) : null}

                  {item.Modules == null ? (
                    <Image
                      source={Images.apqpModuleIcon}
                      style={styles.apqpRecentIcon}
                    />
                  ) : null}
                  {item.Modules == "Risk" ? (
                    <Image
                      source={Images.riskModuleIcon}
                      style={styles.riskTypeIcon}
                    />
                  ) : null}
                  {item.Modules == "Meeting" ? (
                    <Image
                      source={Images.meetingModuleIcon}
                      style={styles.meetingTypeIcon}
                    />
                  ) : null}
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 30,
                    padding: 3,
                    fontSize: Fonts.size.regular,
                    color: "#485B9E",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {item.Modules == "Meeting" ? "Meeting" : item.Description}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.small,
                    color: "#A6A6A6",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {this.changeDateFormatCard(item.StartDate)} -{" "}
                  {this.changeDateFormatCard(item.DueDate)}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {item.site}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {item.ActionType}
                </Text>
              </View>
              <View style={styles.projectBoxStatus}>
                <View style={styles.circle}>
                  <Text
                    style={
                      item.DueByDays > 0
                        ? [
                            styles.actionTypeTextStyle,
                            { fontSize: 15, color: "green" },
                          ]
                        : [
                            styles.actionTypeTextStyle,
                            { fontSize: 15, color: "red" },
                          ]
                    }
                  >
                    {item.DueByDays}
                  </Text>
                </View>
                {/* } */}
                <Text style={(fontSize = 16)}>{strings.DueByDays}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: window_width,
              height: 1,
              backgroundColor: "transparent",
            }}
          />
        )}
      />
    );
  }

  RefreshOnError() {
    return (
      <View
        style={{
          paddingVertical: 20,
          width: window_width,
          height: height(100) - 213,
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            this.setState({ loading: true }, () => this.getActionlist("ref"))
          }
          style={{
            width: "100%",
            height: null,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="retweet" color="#21AFD5" size={30} />
          <Text
            style={{
              textAlign: "center",
              fontSize: Fonts.size.h5,
              color: "#21AFD5",
              fontFamily: "OpenSans-Regular",
            }}
          >
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
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
          marginTop: 50,
          fontFamily: "OpenSans-Regular",
        }}
      >
        {strings.No_records_found}
      </Text>
    );
  }

  //Action Header
  renderHeader() {
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={
              !this.state.isLoading
                ? () => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)
                : () => console.log("Component is not ready to goBack..")
            }
          >
            <View style={styles.backlogo}>
              {!this.state.isLoading ? (
                // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" />
                <View style={styles.headerDiv}>
                  <Icon name="angle-left" size={40} color="white" />
                  <Text style={styles.LabelText}>{strings.Back}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{strings.APQPManager}</Text>
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

  Bounce() {
    return (
      <View
        style={{
          paddingVertical: 20,
          // borderTopWidth: 1,
          // borderColor: "#CED0CE",
          width: window_width,
          height: height(100) - 213,
          flex: 1,
          marginTop: 50,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <DoubleBounce size={20} color="#1CAFF6" /> */}
        <ActivityIndicator size={20} color="#1CAFF6" />
      </View>
    );
  }
  //Show All Actions in All Tab
  allActions() {
    var tabText = strings.All + " (" + this.state.totalActions + ")";
    return (
      <View tabLabel={tabText} style={styles.scrollViewBody}>
        {!this.state.loading ? (
          this.state.actionsList.length > 0 ? (
            <View style={styles.flatList}>
              {this.filterSection()}
              {this.state.filterArrSplit.length > 0
                ? this.renderFilter()
                : null}
              {this.RenderActionFlashList()}
            </View>
          ) : this.state.isErrorRefresh ? (
            this.RefreshOnError()
          ) : (
            this.NoRecordsFound()
          )
        ) : (
          this.Bounce()
        )}
      </View>
    );
  }

  inProgressActions() {
    //this.setState({ ListType: 1 });
    //this.getActionlist();
    var tabText =
      strings.inprogress + " (" + this.state.inProgressActions + ")";
    return (
      <View tabLabel={tabText} style={styles.scrollViewBody}>
        {!this.state.loading ? (
          this.state.actionsList.length > 0 ? (
            <View style={styles.flatList}>
              {this.filterSection()}
              {this.state.filterArrSplit.length > 0
                ? this.renderFilter()
                : null}
              {this.RenderActionFlashList()}
            </View>
          ) : this.state.isErrorRefresh ? (
            this.RefreshOnError()
          ) : (
            this.NoRecordsFound()
          )
        ) : (
          this.Bounce()
        )}
      </View>
    );
  }

  openActions() {
    var tabText = strings.open + " (" + this.state.openActions + ")";
    return (
      <View tabLabel={tabText} style={styles.scrollViewBody}>
        {!this.state.loading ? (
          this.state.actionsList.length > 0 ? (
            <View style={styles.flatList}>
              {this.filterSection()}
              {this.state.filterArrSplit.length > 0
                ? this.renderFilter()
                : null}
              {this.RenderActionFlashList()}
            </View>
          ) : this.state.isErrorRefresh ? (
            this.RefreshOnError()
          ) : (
            this.NoRecordsFound()
          )
        ) : (
          this.Bounce()
        )}
      </View>
    );
  }

  dailyActions() {
    console.log("---->Checking_Footer--->1");
    return (
      <View tabLabel={strings.dailyTask} style={styles.scrollTodayViewBody}>
        {this.state.todayLoader ? (
          this.Bounce()
        ) : (
          <CalendarAgenda
            dateFormat={this.props?.data?.projects?.userDateFormat}
            agendaData={this.state.agendaData}
          />
        )}
      </View>
    );
  }

  recentActions() {
    return (
      <View tabLabel={strings.recenttask} style={styles.scrollTodayViewBody}>
        {this.state.recent_activity && this.state.recent_activity.length > 0
          ? this.RenderFlashList(this.state.recent_activity)
          : this.NoRecordsFound()}
      </View>
    );
  }

  RenderFlashList(tasklist) {
    console.log(tasklist, "tasklist");
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={tasklist}
        extraData={this.state}
        onEndReachedThreshold={0.01}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.openProjectPage(item[0])}
            style={{ width: "95%" }}
          >
            <View style={styles.projectBox}>
              <View style={styles.projectBoxContent}>
                <View>
                  {item[0].Modules == "APQP" ? (
                    <Image
                      source={Images.apqpModuleIcon}
                      style={styles.apqpTypeIcon}
                    />
                  ) : null}

                  {item[0].Modules == "Projects" ? (
                    <Image
                      source={Images.apqpModuleIcon}
                      style={styles.apqpRecentIcon}
                    />
                  ) : null}

                  {item[0].Modules == "Risk" ? (
                    <Image
                      source={Images.riskModuleIcon}
                      style={styles.riskTypeIcon}
                    />
                  ) : null}
                  {item[0].Modules == "Meeting" ? (
                    <Image
                      source={Images.meetingModuleIcon}
                      style={styles.meetingTypeIcon}
                    />
                  ) : null}
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 30,
                    padding: 3,
                    fontSize: Fonts.size.regular,
                    color: "#485B9E",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {/* {item[0].Modules == "Meeting"
                    ? "Meeting"
                    : item[0].Description} */}

                  {item[0].Modules == "Meeting"
                    ? "Meeting"
                    : item[0].Modules == "Projects"
                    ? item[0].Task_Desc
                    : item[0].Description}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.small,
                    color: "#A6A6A6",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {/* ActionCreatedDate */}
                  {/* {this.changeDateFormatCard(item[0].StartDate)} -{" "}
                  {this.changeDateFormatCard(item[0].DueDate)} */}
                  {item[0].Modules == "Projects"
                    ? this.changeDateFormatCard(item[0].TStartDate)
                    : item[0].Modules == "Meeting"
                    ? this.changeDateFormatCard(item[0].ActionCreatedDate)
                    : this.changeDateFormatCard(item[0].StartDate)}
                  -{" "}
                  {item[0].Modules == "Projects"
                    ? this.changeDateFormatCard(item[0].TFinishDate)
                    : this.changeDateFormatCard(item[0].DueDate)}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {/* {item[0].Actions} */}
                  {item[0].Modules == "Projects"
                    ? item[0].ProjectDescription
                    : item[0].Actions}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: window_width,
              height: 1,
              backgroundColor: "transparent",
            }}
          />
        )}
      />
    );
  }

  getActionlist(from) {
    console.log("@@@@@@@@@@@@@@@", from);
    console.log(
      "inside getactionlist : " +
        this.props?.data?.projects?.loginuser?.UserId +
        "=====" +
        this.state.userId
    );
    const UserID = this.props?.data?.projects?.loginuser?.UserId;
    const SiteID = this.props?.data?.projects?.loginuser?.Siteid;
    const Index = 1;
    const MaxRow = this.state.MaxRow;
    const ListType = this.state.ListType === "" ? 2 : this.state.ListType;
    const Token = this.props?.data?.projects?.token;
    var FilterValue =
      this.state.ProjectSearch != "" &&
      this.state.ProjectSearch != null &&
      this.state.ProjectSearch != undefined
        ? this.state.ProjectSearch
        : "";
    var FilterColumn =
      this.state.ProjectColumn != "" &&
      this.state.ProjectColumn != null &&
      this.state.ProjectColumn != undefined
        ? this.state.ProjectColumn
        : "";
    const OrderBy = this.state.OrderBy; //Sorting: Column name
    const Sorttype =
      this.state.sortOrder === "" || this.state.sortOrder == null
        ? "desc"
        : this.state.sortOrder; //Sorting: Asc / Desc
    const StartDate = this.state.StartDate;
    const EndDate = this.state.EndDate;

    console.log("calling:;", ListType);
    if (UserID == undefined || UserID == "" || UserID == null) {
      console.log("userid cannot be empty.....");
      return;
    }

    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        auth.getapqpInprogressListdata(
          UserID,
          SiteID,
          Index,
          MaxRow,
          ListType,
          Token,
          FilterValue,
          FilterColumn,
          OrderBy,
          Sorttype,
          StartDate,
          EndDate,
          (res, data) => {
            console.log("innnnnnnnnnnn", from);
            console.log("getting responses here getActionlist", data);
            if (data.data.Message == "Success") {
              var getList = [];
              getList = data.data.Data;
              //console.log("getList printed");
              //console.log(getList);
              var sectionedList = [];

              for (var i = 0; i < getList.length; i++) {
                if (sectionedList.length == 0) {
                  var dataArr = [];
                  dataArr.push(getList[i]);
                  sectionedList.push({
                    title: getList[i].Description,
                    data: dataArr,
                  });
                } else {
                  var isExists = false;
                  for (var j = 0; j < sectionedList.length; j++) {
                    if (sectionedList[j].title == getList[i].Description) {
                      sectionedList[j].data.push(getList[i]);
                      isExists = true;
                    }
                  }
                  if (!isExists) {
                    var dataArr = [];
                    dataArr.push(getList[i]);
                    sectionedList.push({
                      title: getList[i].Description,
                      data: dataArr,
                    });
                  }
                }
              }

              this.setState(
                {
                  actionsList: getList,
                  completecount: data.data.Data.length,
                  // apqpList:data.data.Data,
                  loading: false,
                  isRefreshing: false,
                },
                () => {
                  // console.log("setting up the list...", this.state.actionsList);
                  //console.log("completecount", this.state.completecount);
                  console.log(
                    "==============================================++"
                  );
                  let bufferList = Array.from(new Set(getList));
                  this.props.storeActions(bufferList);
                  console.log(
                    "==============================================##"
                  );

                  // this.someMethod()
                  // this.somethingMethod()
                }
              );
            } else {
              this.setState(
                {
                  actionsList: [],
                  loading: false,
                  isRefreshing: false,
                },
                () => {
                  console.log("error fetching");
                }
              );
            }
          }
        );
      } else {
        this.refs.toast.show(strings.Project_List_Failed, DURATION.LENGTH_LONG);
        this.setState(
          {
            //actionsList: this.props.data.actions,
            loading: false,
            isRefreshing: false,
            isLazyLoading: false,
            isLazyLoadingRequired: false,
            isPageEmpty: false,
            isMounted: true,
            isErrorRefresh: false,
          },
          () => {}
        );
      }
    });
  }
  //END ACTTION METHODS

  // Project Related Methods
  getAllProjectlist(res) {
    const { SiteId, UserId, Token } = res;
    console.log(
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    );
    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        console.log(
          "@@@@@ TodayTask calendarapi", SiteId
        );
        auth.calendarapi(UserId, SiteId, Token, 0, (response, data) => {
          console.log("@@@@@@@@@@@", data);
          if (data.data) {
            if (data.data.Message === "Success") {
              if (data.data.Data && data.data.Data.length > 0) {
                var TaskList = data.data.Data;
                let agendaObj = {};
                _.forEach(TaskList, function (Task_res) {
                  var taskInfo = Task_res;
                  taskInfo["key"] = this.keyVal + 1;

                  if (taskInfo.StartDate) {
                    const dateT = new Date(taskInfo.StartDate);
                    /** Adding prefix zero if not calendar will not shown any data */
                    let month =
                      dateT.getMonth() + 1 < 10
                        ? "0" + (dateT.getMonth() + 1)
                        : dateT.getMonth() + 1;
                    let datestr =
                      dateT.getDate() < 10
                        ? "0" + dateT.getDate()
                        : dateT.getDate();
                    let key = dateT.getFullYear() + "-" + month + "-" + datestr;
                    /** Mapping the projects based on the start date */
                    if (agendaObj[key]) {
                      agendaObj[key] = [...agendaObj[key], { ...taskInfo }];
                    } else {
                      agendaObj[key] = [{ ...taskInfo }];
                    }
                  }
                  this.keyVal = this.keyVal + 1;
                });
                this.setState({ agendaData: agendaObj, todayLoader: false });
                console.log(
                  "<><><><><><><><> inside ActionTabInterface GetAllProjectList"
                );
              } else {
                this.setState({ todayLoader: false });
              }
            } else {
              this.setState({ todayLoader: false });
            }
          } else {
            this.setState({ todayLoader: false });
          }
        });
      }
    });
  }

  recentProjects() {
    return (
      <View tabLabel={strings.recentProjects} style={styles.scrollViewBody}>
        <View style={{ marginTop: 60 }}></View>
        <Text style={styles.welcomeTxt}>{strings.recentProjects} </Text>
      </View>
    );
  }

  todayProjects() {
    return (
      <View
        tabLabel={strings.todaysprojects}
        style={styles.calendarScrollViewBody}
      >
        <Text style={styles.welcomeTxt}>{strings.todaysprojects} </Text>
      </View>
    );
  }

  getRecentTask() {
    if (this.props?.data?.projects?.recentActivity) {
      console.log("recent_activity:::::::out", this.state.recent_activity);
      this.setState(
        {
          recent_activity: this.props?.data?.projects?.recentActivity,
          recentLoading: false,
        },
        () => {
          console.log("recent_activity:::::::in", this.state.recent_activity);
        }
      );
    } else {
      this.setState(
        {
          recent_activity: [],
          recentLoading: false,
        },
        () => {}
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ActionTabInterface);
