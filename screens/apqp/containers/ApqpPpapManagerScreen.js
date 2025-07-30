import React, { Component } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { Images, Fonts } from "../themes";
import { connect } from "react-redux";
import auth from "../../../services/APQP-Auth";
import ProgressCircle from "react-native-progress-circle";
import Icon from "react-native-vector-icons/FontAwesome";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import Modal from "react-native-modal";
import CalendarPicker from "react-native-calendar-picker";
import Toast, { DURATION } from "react-native-easy-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { width, height } from "react-native-dimension";
import styles from "./styles/ApqpPpapManagerScreenStyles";
import styles1 from "./styles/ApqpDashboardHeaderStyle";
import NetInfo from "@react-native-community/netinfo";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { Dropdown } from "react-native-material-dropdown";
import { strings } from "../language/Language";
import OfflineNotice from "../components/OfflineNotice";
import ScrollableTabView, {
  DefaultTabBar,
} from "react-native-scrollable-tab-view";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
// import Reactotron from "reactotron-react-native";
const moment = extendMoment(Moment);
const window_width = Dimensions.get("window").width;
const Reset = "Reset";
class ApqpPpapManagerScreen extends Component {
  calendarData = [];
  passquickParameter = "";
  UserId = "";
  ProjectId = "";
  Token = "";
  SiteId = "";

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
    this.state = {
      currentTabIndex: 0,
      selectedIndex: 0,
      todayn: 1,
      isPendingTask: 0,
      selectedViewIndex: 1,
      apqpList: undefined,
      loader: true,
      completecount: "",
      activeFilterColor: "lightgrey",
      apqpAll: 0,
      apqpTobecompleted: 0,
      apqpOpen: 0,
      apqpPending: 0,
      isVisible: false,
      quickModal: false,
      quickpercentage: "",
      modalErrortxt: "",
      todaystask: [],
      upcomingtask: [],
      maxRow: 10,
      isRefreshing: false,
      searchFlag: false,
      searchText: "",
      //statusRadio: 0,
      //sortBy: 0,
      activeFilter: 1,
      OrderBy: "StartDate",
      //Sorttype: "asc",
      sortOrder: "desc",
      isDateVisible: false,
      StartDate: "",
      EndDate: "",

      activeTab: 0,
      isLazyLoading: false,
      isLazyLoadingRequired: false,
      isPageEmpty: false,
      isMounted: false,
      isErrorRefresh: false,

      project_sort: 0, // Desc
      isFilterApplied: false,
      selectedStartDate: null,
      selectedEndDate: null,

      ProjectSearch: "",
      ProjectColumn: "",
      filterArrSplit: [],

      project_sortText: "StartDate",
      project_filterType: "",
      hasUpdated: false,

      projects: 0,
      risks: 4, //completed: '',
      meetings: 2, //deadlineviolated: '',
      documents: 1, //deadlineviolatedandcompleted: '',
      loading: true,
      noactions: 0,
      showMyAllActions: false,
      // apqpList: [],
    };
    this.animatedIndicatorPosition = new Animated.Value(0);
  }
  setting = () => {
    // this.setState({ todayn: this.props.navigation.state.params.todayn });
    this.setState({ todayn: this.props?.route?.params?.todayn });
    
    this.setState({
      // isPendingTask: this.props.navigation.state.params.isPendingTask,
      // selectedIndex: this.props.navigation.state.params.selectedIndex || 0,
      isPendingTask: this.props?.route?.params?.isPendingTask,
      selectedIndex: this.props?.route?.params?.selectedIndex || 0,
    });
  };
  componentDidMount() {
    console.log(this.props?.route?.params, "navigationparamsapqp");
    this.setting();
    this.getData()
      .then(async(res) => {
        console.log("componentDidMount async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteId = res.SiteId;
        this.storeDetails();
        this.getCalendarList();
        this.getTodaysTask(res);
        this.getUpcomingTask(res);
        this.getapqplistdata()
        this.getapqpDashboarddata(res);
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });

    console.log("ApqpPpapManagerScreen mounted", this.state.selectedIndex);

    this.props.navigation.addListener("didFocus", () => {
      // console.log('Action List Component Focussed!')

      // if (this.props.navigation.getParam("filter_Arr")) {
      if (this.props?.route?.params?.filter_Arr){
        console.log(
          "Filter Applied from Filter Screen from props- did mount",
          this.props?.route?.params?.filter_Arr
        );
        this.filterApplied(this.props?.route?.params?.filter_Arr);
        // this.loadRecentAudits()
      } else {
        if (this.state.isMounted) {
          this.setState(
            {
              loader: false,
              isRefreshing: false,
              isFileterApplied: true,
              isPageEmpty: false,
              isErrorRefresh: false,
            },
            () => {}
          );
        }
        if (this.state.token == "") {
          this.getSessionValues();
        }
      }
    });
  }

  componentWillMount() {
    console.log('this.props-->', this.props);
    console.log(
      "this.props?.route?.params",
      this.props?.route?.params
    );
    console.log("-------PendingTask-------->" + this.state.isPendingTask);
    if (this.props?.route?.params) {
      if (this.props?.route?.params?.ActiveTab) {
        if (this.props?.route?.params?.ActiveTab == "today") {
          this.setState({ activeTab: 3 });
        }
      }
      if (this.props?.route?.params?.isPendingTask == 1) {
        this.setState({ activeTab: 2 });
        this.state.selectedIndex = 2;
      }
    }
  }

  storeDetails = async () => {
    const stringifiedUserDetails = await AsyncStorage.getItem('userDataApqp');
    const value = JSON.parse(stringifiedUserDetails);
    console.log('current userdata--->', value)
    // console.log('get response from getData', value)
    this.props.registrationState(value?.isDeviceRegistered);
    this.props.storeServerUrl(value?.currentServerUrl);
    this.props.storeUserSession(
      value?.userFullName,
      value?.userId,
      value?.accessToken,
      value?.siteId,
      value?.Address,
      value?.CompanyName,
      value?.CompanyUrl,
      value?.Logo,
      value?.Phone,
      value?.webToken,
      value?.docattachurl,
    );
    this.props.storeLoginSession(true);
    this.props.storeUserName(value?.loginuser);
    // this.renderCategory(res?.category, res?.title);
  }

  getapqpDashboarddata(res) {
    console.log("API_Calls------------------>1");
    console.log("calling dashboard api");
    var UserID = res.UserId;
    var Siteid = res.SiteId;
    var token = res.Token;
    console.log(UserID, Siteid, token);

    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        auth.getapqpDashboarddata(UserID, Siteid, token, (res, data) => {
          //console.log("getting responses", data);
          if (data.data.Message == "Success") {
            var apqpDashboarddata = [];
            apqpDashboarddata = data.data.Data;
            this.setState(
              {
                // apqpList: apqpDashboarddata,
                //projects: apqpDashboarddata.APQPAction,
                //totalActions: apqpDashboarddata.TotalAction,
                //inProgressActions: apqpDashboarddata.Inprogress,
                risks: apqpDashboarddata.Risk,
                documents: apqpDashboarddata.Documents,
                meetings: apqpDashboarddata.Meetings,
                noactions: apqpDashboarddata.TotalActions,
                projects: apqpDashboarddata.APQPPPAP,
                //totalTobeCompletedProjects: apqpDashboarddata.TobeCompleted,
                //totalPendingProjects: apqpDashboarddata.PendingTask,
                loading: false,
                showMyAllActions: true,
              },
              () => {
                this.props.storeCounts(apqpDashboarddata);
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
            loading: false,
            isMounted: true,
          },
          () => {}
        );
      }
    });
  }

  openProjectPage(ActionItem) {
    this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
      itemData: ActionItem,
      RouteParam: "Project",
      ProjectId: ActionItem.ProjectId,
      TaskID: ActionItem.TaskId,
      //activeTab: this.state.activeTab,
    });
  }
  updateRecentActionList(item) {
    var list = [];
    list.push(item);

    if (list[0].length === 2) {
      list[0].push("APQP");
    } else {
      list[0]["Modules"] = "APQP";
    }

    var recentActionListProps = this.props?.data?.projects?.recentActivity;
    var recentActions = [];

    if (recentActionListProps && recentActionListProps.length > 0) {
      var isActionExistsInRecentList = false;
      for (var i = 0; i < recentActionListProps.length; i++) {
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

  //Filter
  filterApplied(filter) {
    console.log("filterApplied inside ");
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
    console.log("FilterArray after array pushed from props ", FilterArray);
    this.setState(
      {
        ProjectSearch: filter[0].globalSearch,
        ProjectColumn: filter[0].globalSearchCol,
        isFileterApplied: true,
        filterArrSplit: FilterArray,
        loader: true,
        // OrderBy: droptext,
        OrderBy: droptext == "EndDate" ? "DueDate" : droptext,
        sortOrder: sortype,
        isErrorRefresh: false,
        isMounted: false,
        StartDate: filter[0].startDate,
        apqpList: [],
        EndDate: filter[0].endDate,
      },
      () => {
        //this.getapqplistdata("filter");
      }
    );
  }

  // componentWillReceiveProps() {
  componentDidUpdate() {
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    var CurrentPage = this.props?.route?.name;
    console.log("--CurrentPage--->", CurrentPage);
    console.log(
      "componentWillReceiveProps*************************", this.state.hasUpdated,
      this.props?.data?.projects?.counts?.APQPPPAP
    );
    if (!this.state.hasUpdated) {
      if (CurrentPage == ROUTES.APQP_PPAP_MANAGER_SCREEN) {
        console.log("calling asynchronous call action");
        this.getData().then((res) => { //test change
          this.setState(
            {
              // apqpAll: this.props.navigation.getParam("allprojects"),
              apqpAll: this.props?.route?.params?.allprojects,
              apqpTobecompleted: this.props?.data?.projects?.counts?.TobeCompleted,
              apqpPending: this.props?.data?.projects?.counts?.PendingTask,
              apqpOpen: this.props?.data?.projects?.counts?.Open,
              selectedIndex: 2,
              // activeTab: this.props.navigation.state.params.activeTab
              activeTab: this.props?.route?.params?.activeTab
                ? this.props?.route?.params?.activeTab
                : 0,
              loader: true,
            },
            () => {
              console.log(
                "loadProjects---------->1--------->",
                this.state.activeTab
              );
              this.loadProjects(this.state.activeTab);
              // this.getapqplistdata();
            }
          );
        })
        .catch((e) => {
          console.log("Async aerror", e);
        });
          this.setState({ hasUpdated: true });
      } else {
        console.log("ApqpPpapManagerScreen pass");
      }
    }
  }

  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
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

  componentToHex(c) {
    var hex = Number(c).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  }

  rgbToHex(r, g, b) {
    return (
      "#" +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
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
    return (
      <FlatList
        // contentContainerStyle={{ paddingBottom: 30 }}
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
                  {item[0].Modules == "Meeting"
                    ? "Meeting"
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
                  {this.changeDateFormatCard(item[0].StartDate)} -{" "}
                  {this.changeDateFormatCard(item[0].DueDate)}
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
                  {item[0].Actions}
                </Text>
                {/* <Text
                numberOfLines={1}
                style={{
                  padding: 3,
                  fontSize: Fonts.size.medium,
                  color: "#545454",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {item.site}
              </Text> */}
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
  getCalendarList() {
    var Token = this.Token;
    var UserID = this.UserId;
    var FromDate = "01/01/2019";
    var ToDate = "12/31/2019";
    var result = [];
    var ProjectId = 0;
    var SiteID = 1;
    var TodayTask = 0;
    console.log(
      "@@@@@ APQPPpapManagerScreen calendarapi", SiteID
    );
    auth.calendarapi(UserID, SiteID, Token, TodayTask, (res, data) => {
      //console.log("calendar response", data);
      result = data?.data?.Data;
      console.log("result", result);

      var calendarData = [];
      for (var i = 0; i < result.length; i++) {
        calendarData.push({
          StartDate: result[i].StartDate,
          FinishDate: result[i].FinishDate,
          ColorCode: result[i].ColorCode,
        });
      }
      console.log("calendar data"); //, calendarData);

      var auditDatesStyles = [];

      for (var i = 0; i < calendarData.length; i++) {
        // Start date
        var sDate = calendarData[i].StartDate;
        var sDateArr = sDate.split("T");
        var sDateValArr = sDateArr[0].split("-");
        var sDateObj = new Date(
          sDateValArr[0],
          sDateValArr[1] - 1,
          sDateValArr[2]
        );

        // End date
        var eDate = calendarData[i].FinishDate;
        var eDateArr = eDate.split("T");
        var eDateValArr = eDateArr[0].split("-");
        var eDateObj = new Date(
          eDateValArr[0],
          eDateValArr[1] - 1,
          eDateValArr[2]
        );

        var dates = this.getDates(sDateObj, eDateObj);

        for (var j = 0; j < dates.length; j++) {
          var rDateArr = dates[j].split("-");
          var rDateObj = new Date(rDateArr[0], rDateArr[1] - 1, rDateArr[2]);
          var colorCode = "";

          if (calendarData[i].ColorCode.includes("#")) {
            colorCode = calendarData[i].ColorCode;
          } else {
            var rgbArr = calendarData[i].ColorCode.replace("rgb(", "")
              .replace(")", "")
              .split(",");
            if (rgbArr.length == 3) {
              colorCode = this.rgbToHex(
                rgbArr[0].trim(),
                rgbArr[1].trim(),
                rgbArr[2].trim()
              );
            } else {
              colorCode = "#ffffff";
            }
          }

          auditDatesStyles.push({
            date: rDateObj,
            style: { backgroundColor: colorCode },
            textStyle: { color: "black" }, // sets the font color
            containerStyle: [], // extra styling for day container
          });
        }
      }
    });
  }

  formatDate(fulldate) {
    const date = fulldate;
    const [year, month, day] = date.split("-");
    let newDate = `${month}-${day}-${year}`;
    return newDate;
  }

  getapqplistdata(from) {
    console.log(
      "-------PendingTask-------->" +
        this.state.isPendingTask +
        "-------selectedIndex--------->",
      this.state.selectedIndex,
      'params---', this.props?.route?.params
    );
    console.log("this.SiteId", this.SiteId);
    //ListType 1-->Pending 0-->To do
    //console.log("calling apqp api", this.state.selectedIndex);
    const UserID = this.UserId;
    const SiteId = this.SiteId;
    const Token = this.Token;
    const Index = 0;
    const maxRow = this.state.maxRow;
    // const ListType = this.state.selectedIndex; //Sudha_Feb_15

    const ListType = 
      this.state.isPendingTask == 1 ? 1 : this.state.selectedIndex;
    const projectView = 0;
    const FilterValue =
      this.state.ProjectSearch != "" &&
      this.state.ProjectSearch != null &&
      this.state.ProjectSearch != undefined
        ? this.state.ProjectSearch
        : "";
    const FilterColumn =
      this.state.ProjectColumn != "" &&
      this.state.ProjectColumn != null &&
      this.state.ProjectColumn != undefined
        ? this.state.ProjectColumn
        : "";
    const OrderBy = this.state.OrderBy;
    const Sorttype = this.state.sortOrder;
    const StartDate = this.state.StartDate;
    // const EndDate = this.state.EndDate;

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    var fulldate = new Date(year + 10, month, day);

    var formatedDate1 = fulldate.toISOString().slice(0, 10);

    var EndDate =
      this.state.StartDate == ""
        ? this.formatDate(formatedDate1)
        : this.state.EndDate;

    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        console.log("this.SiteId1", this.SiteId);
        auth.getapqplist(
          UserID,
          SiteId,
          Index,
          maxRow,
          ListType,
          projectView,
          FilterValue,
          FilterColumn,
          OrderBy,
          Sorttype,
          StartDate,
          EndDate,
          Token,
          (res, data) => {
            //console.log("getting responses", data);
            if (data.data.Message == "Success") {
              var getList = [];
              getList = data.data.Data;
              console.log("getList printed");
              console.log("getList--->" + getList);
              var sectionedList = [];

              for (var i = 0; i < getList.length; i++) {
                if (sectionedList.length == 0) {
                  var dataArr = [];
                  dataArr.push(getList[i]);
                  sectionedList.push({
                    title: getList[i].Actions,
                    data: dataArr,
                  });
                } else {
                  var isExists = false;
                  for (var j = 0; j < sectionedList.length; j++) {
                    if (sectionedList[j].title == getList[i].Actions) {
                      sectionedList[j].data.push(getList[i]);
                      isExists = true;
                    }
                  }
                  if (!isExists) {
                    var dataArr = [];
                    dataArr.push(getList[i]);
                    sectionedList.push({
                      title: getList[i].Actions,
                      data: dataArr,
                    });
                  }
                }
              }

              this.setState(
                {
                  apqpList: sectionedList,
                  completecount: data.data.Data.length,
                  loader: false,
                  isRefreshing: false,
                  isLazyLoading: false,
                },
                () => {
                  // console.log("setting up the list...", this.state.apqpList);
                  console.log(
                    "APQP_PPAP_Manager_completecount",
                    this.state.completecount
                  );
                  // this.someMethod()
                  // this.somethingMethod()
                }
              );
            } else {
              this.setState(
                {
                  apqpList: [],
                  loader: false,
                  isRefreshing: false,
                  isErrorRefresh: true,
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
            // auditList: this.props.data.audits.audits,
            // auditListAll: this.props.data.audits.audits,
            loader: false,
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

  onPress() {
    console.log("onPress pressed");
    this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
  }

  handleEnd() {
    console.log("handle reached");
    this.setState(
      {
        maxRow: this.state.maxRow + 10,
      },
      () => {
        this.getapqplistdata(this.state.selectedIndex);
      }
    );
  }

  handleRefresh() {
    this.setState(
      {
        isRefreshing: true,
        maxRow: 10,
      },
      () => {
        this.getapqplistdata(this.state.selectedIndex);
      }
    );
  }

  //RenderUpcomingFlashList

  RenderUpcomingFlashList() {
    return (
      <FlatList
        // contentContainerStyle={{ paddingBottom: 30 }}
        data={this.state.upcomingtask}
        extraData={this.state}
        onEndReachedThreshold={0.01}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.openProjectPage(item)}
            style={{ width: "95%" }}
          >
            <View style={styles.projectBox}>
              <View style={styles.projectBoxContent}>
                <View>
                  {/* {item.Modules == "APQP" ? ( */}
                  <Image
                    source={Images.apqpModuleIcon}
                    style={styles.apqpTypeIcon}
                  />
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
                  {item.Modules == "Meeting" ? "Meeting" : item.TaskDescription}
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
                  {this.changeDateFormatCard(item.FinishDate)}
                </Text>

                <Text
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                  numberOfLines={1}
                >
                  {item.ProjectDescription}
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

  //RenderRecentlyCompletedProjects
  RenderRecentlyCompletedProjects() {
    return (
      <FlatList
        // contentContainerStyle={{ paddingBottom: 30 }}
        data={this.state.upcomingtask}
        extraData={this.state}
        onEndReachedThreshold={0.01}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.openProjectPage(item)}
            style={{ width: "95%" }}
          >
            <View style={styles.projectBox}>
              <View style={styles.projectBoxContent}>
                <View>
                  {/* {item.Modules == "APQP" ? ( */}
                  <Image
                    source={Images.apqpModuleIcon}
                    style={styles.apqpTypeIcon}
                  />
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
                  {item.Modules == "Meeting" ? "Meeting" : item.TaskDescription}
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
                  {this.changeDateFormatCard(item.FinishDate)}
                </Text>

                <Text
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                  numberOfLines={1}
                >
                  {item.ProjectDescription}
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

  RenderTodayFlashList() {
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={this.state.todaystask}
        extraData={this.state}
        onEndReachedThreshold={0.01}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.openProjectPage(item)}
            style={{ width: "95%" }}
          >
            <View style={styles.projectBox}>
              <View style={styles.projectBoxContent}>
                <View>
                  {/* {item.Modules == "APQP" ? ( */}
                  <Image
                    source={Images.apqpModuleIcon}
                    style={styles.apqpTypeIcon}
                  />
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
                  {item.Modules == "Meeting" ? "Meeting" : item.TaskDescription}
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
                  {this.changeDateFormatCard(item.FinishDate)}
                </Text>

                <Text
                  style={{
                    padding: 3,
                    fontSize: Fonts.size.medium,
                    color: "#545454",
                    fontFamily: "OpenSans-Regular",
                  }}
                  numberOfLines={1}
                >
                  {item.ProjectDescription}
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

  getUpcomingTask(res) {
    console.log('getUpcomingTask res-->', res)
    var UserID = res.UserId;
    var Token = res.Token;
    var Siteid = res.SiteId;
    // var TodayTask = 1;
    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        auth.getUpcomingTaskapi(UserID, Siteid, Token, (res, data) => {
          if (data.data.Message == "Success") {
            console.log(this.state.upcomingtask);
            this.setState(
              {
                upcomingtask: data.data.Data,
                todayLoading: false,
              },
              () => {
                console.log(
                  "Upcominggggggggg  task %%%%sa" + this.state.upcomingtask
                );
                //this.RenderFlashList(this.state.todaystask);
              }
            );
          }
        });
      }
    });
  }

  getTodaysTask(res) {
    var UserID = res.UserId;
    var Token = res.Token;
    var Siteid = res.SiteId;
    var TodayTask = 1;
    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
      console.log(
        "@@@@@ APQPPpapManagerScreen1 calendarapi", Siteid
      );
        auth.calendarapi(UserID, Siteid, Token, TodayTask, (res, data) => {
          if (data.data.Message == "Success") {
            console.log(this.state.todaystask);
            this.setState(
              {
                todaystask: data.data.Data,
                todayLoading: false,
              },
              () => {
                console.log(
                  "Todadddddddddddayas  task %%%%sa" + this.state.todaystask
                );
                //this.RenderFlashList(this.state.todaystask);
              }
            );
          }
        });
      }
    });
  }

  onPressed(item) {
    console.log("onPress pressed", item);
    // this.props.navigation.navigate("PeriodicUpdateScreen", {
    //   itemData: item,
    //   RouteParam: "Project",
    // });
    this.props.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
      itemData: item,
      RouteParam: "Project",
      ProjectId: item.ProjectID,
      TaskID: item.ActionId,
      //activeTab: this.state.activeTab,
    });
    console.log("------->APQP/PPAP--->Length------>", item);
    this.updateRecentActionList(item);
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
        this.getapqplistdata("handleindex");
      }
    );
  };

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

  handleViewIndexChange = (index) => {
    console.log("changing View index", index);

    this.setState(
      {
        selectedViewIndex: 0,
        //loader: true
      },
      () => {
        this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN);
        console.log("---->", this.state.selectedViewIndex);
      }
    );
  };

  onDateChange(date, type) {
    if (type === "END_DATE") {
      this.setState(
        {
          selectedEndDate: Moment(date).format("MM/DD/YYYY"),
          isVisible: false,
          loader: true,
          isFilterApplied: true,
        },
        () => {
          this.filterActionsCal();
        }
      );
    } else {
      this.setState({
        selectedStartDate: Moment(date).format("MM/DD/YYYY"),
        selectedEndDate: null,
      });
    }
  }

  openCalender() {
    this.setState({
      isVisible: true,
    });
  }

  onUpdatePress() {
    console.log("pressed");
    var passData = this.passquickParameter;
    const Id = -1;
    const TaskId = passData.ActionId;
    const FromPercent = passData.Percentage;
    const Percent = this.state.quickpercentage;
    const ResourceID = this.UserId; //user id
    const StartDate = this.changeDateFormat(passData.StartDate);
    const Hours = "";
    const Remark = "quick update";
    const UpdateType = "update";
    const EndTime = this.changeDateFormat(passData.DueDate);

    const UserID = this.UserId;
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
              //console.log("-->", data);
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
                    this.getapqplistdata(this.state.selectedIndex);
                  }
                );
              } else {
                this.setState(
                  {
                    quickModal: true,
                    quickpercentage: "",
                    modalErrortxt: data.data.Data,
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

  toggleModal(item) {
    console.log("pressed", item);
    this.setState({ quickModal: true }, () => {
      this.passquickParameter = item;
      console.log("passquickParameter", this.passquickParameter);
    });
  }

  endReached() {
    console.log("handle reached");
    this.setState(
      {
        isLazyLoading: true,
        maxRow: this.state.maxRow + 10,
      },
      () => {
        this.getapqplistdata(this.state.selectedIndex);
      }
    );
  }

  onSearchPress() {
    this.getapqplistdata(this.state.selectedIndex);
  }

  onFilteDateChange(date, type) {
    console.log("onFilteDateChange", date, type);
    var date = Moment(date).format("MM/DD/YYYY");
    console.log("date", date);
    if (type === "END_DATE") {
      this.setState(
        {
          EndDate: date,
          isDateVisible: false,
        },
        () => {
          console.log("--end date--->", this.state.EndDate);
          this.getapqplistdata(this.state.selectedIndex);
        }
      );
    } else {
      this.setState(
        {
          StartDate: date,
        },
        () => {
          console.log("--start date--->", this.state.StartDate);
        }
      );
    }
  }

  renderHeader() {
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
          >
            <View style={styles.backlogo}>
              {!this.state.loader ? (
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
          {/* <View style={styles.headerDiv}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => this.props.navigation.navigate("DashboardScreen")}
            >
              <Icon name="home" size={35} color="white" />
            </TouchableOpacity>
          </View> */}
          {/* <View style={(styles.headerDiv, { backgroundColor: "transparent" })}>
            <TouchableOpacity
              style={{ paddingRight: 10, backgroundColor: "transparent" }}
              onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            >
              <Icon name="home" size={35} color="white" />
            </TouchableOpacity>
          </View> */}
        </View>
      </ImageBackground>
    );
  }

  onChangeText(value) {
    console.log("onChangeText---> value--->", value);
    console.log("droptext::::", this.state.project_sortText);

    var dropText = "";
    var dropvalue = value;
    for (var i = 0; i < this.dropdata.length; i++) {
      if (this.dropdata[i].value == dropvalue) {
        dropText = this.dropdata[i].text;
        console.log("Inside_If--->dropText--->" + dropText);
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

  changeProjectSort(value) {
    this.setState(
      {
        project_filterType: "Sort",
        project_sort: value,
        project_sortText:
          this.state.project_sortText === ""
            ? "StartDate"
            : this.state.project_sortText,
      },
      () => {
        console.log("Filter_Selection_Check--->" + this.state.project_sort);
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

    this.setState({ loader: true }, () => {
      switch (filterType) {
        case "Sort":
          this.setState(
            {
              filterId: "",
              page: 1,
              loader: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              apqpList: [],
              filterTypeFG: 0,
              // OrderBy: droptext, //Sort Column
              OrderBy: droptext == "EndDate" ? "DueDate" : droptext,
              sortOrder: sortype == 0 ? "desc" : "asc", // ASC
              cFilterVal: 0,
            },
            () => {
              this.getapqplistdata("sorting");
            }
          );
          break;
        default:
          break;
      }
    });
  }

  filterSection() {
    var value = this.state.project_sortText;
    return (
      <View style={styles.filterCont}>
        <TouchableOpacity
          style={styles.filterBox}
          // onPress={() =>
          //   this.props.navigation.navigate(ROUTES.FILTER_SCREEN_APQP, {
          //     callback_flag:
          //       this.state.filterArrSplit.length == 0 ? false : true,
          //   })
          // }
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
              // value={strings.SortByStartDate}
              // label={strings.SortByStartDate}
              value={this.state.project_sortText}
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

  deleteFilter() {
    // this.props.navigation.state.params.filter_Arr = undefined;
    this.props.route.params.filter_Arr = undefined;
    this.setState(
      {
        isFileterApplied: false,
        filterArrSplit: [],
        ProjectSearch: "",
        ProjectColumn: "",
        page: 1,
        loader: true,
        isErrorRefresh: false,
        StartDate: "",
        EndDate: "",
        apqpList: [],
        project_sort: 0,
        OrderBy: "StartDate",
        sortOrder: "desc",
        //ListType: 2,
        //activeTab: 0
      },
      () => {
        this.getapqplistdata("delete");
      }
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
    // const EndDate = this.state.EndDate;

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    var fulldate = new Date(year + 10, month, day);

    var formatedDate1 = fulldate.toISOString().slice(0, 10);

    var EndDate =
      this.state.StartDate == ""
        ? this.formatDate(formatedDate1)
        : this.state.EndDate;
    // var EndDate =  this.state.StartDate == "" ?  fulldate.toISOString().slice(0, 10):this.state.EndDate;

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
            this.setState({ loader: true }, () => this.getActionlist())
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

  allProjects() {
    // var v1 = this.state.apqpTobecompleted;
    // var v2 = this.state.apqpPending ;
    // const result =  v2 + v1;

    // console.log("----->APQP_All_---->"+result)
    // console.log("----->APQP_Completed_---->"+v1)
    // console.log("----->APQP_Pending_---->"+v2)

    // var tabText = strings.All + " (" + result+ ")";

    // var tabText = strings.All + " ("+
    // this.state.apqpAll=="undefined"?(this.state.apqpTobecompleted +
    // this.state.apqpPending):this.state.apqpAll
    //   + ")";

    return (
      <View style={styles.scrollViewBody}>
        {this.state.apqpList && this.state.apqpList.length > 0
          ? this.filterSection()
          : null}

        {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
        {!this.state.loader
          ? this.state.apqpList.length > 0
            ? this.RenderProjectSectionList()
            : this.state.isErrorRefresh
            ? this.RefreshOnError()
            : this.NoRecordsFound()
          : this.Bounce()}
      </View>
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
        <DoubleBounce size={20} color="#1CAFF6" />
      </View>
    );
  }

  allToBeCompletedProjects() {
    var tabText =
      strings.To_Be_Completed + " (" + this.state.apqpTobecompleted + ")";
    return (
      <View tabLabel={tabText} style={styles.scrollViewBody}>
        {this.state.apqpList && this.state.apqpList.length > 0
          ? this.filterSection()
          : null}
        {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
        {!this.state.loader
          ? this.state.apqpList.length > 0
            ? this.RenderProjectSectionList()
            : this.state.isErrorRefresh
            ? this.RefreshOnError()
            : this.NoRecordsFound()
          : this.Bounce()}
      </View>
    );
  }

  allPendingProjects() {
    var tabText = strings.Pending + " (" + this.state.apqpPending + ")";
    return (
      <View tabLabel={tabText} style={styles.scrollViewBody}>
        {this.state.apqpList && this.state.apqpList.length > 0
          ? this.filterSection()
          : null}
        {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
        {!this.state.loader
          ? this.state.apqpList.length > 0
            ? this.RenderProjectSectionList()
            : this.state.isErrorRefresh
            ? this.RefreshOnError()
            : this.NoRecordsFound()
          : this.Bounce()}
      </View>
    );
  }

  allTodaysProjects() {
    var tabText = strings.todaystask;
    return (
      <View
        tabLabel={tabText}
        style={(styles.scrollViewBody, { marginTop: 50 })}
      >
        {/* {this.state.todaystask && this.state.todaystask.length > 0
          ? this.filterSection()
          : null}
        {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null} */}
        {!this.state.loader
          ? this.state.todaystask.length > 0
            ? this.RenderTodayFlashList()
            : this.state.isErrorRefresh
            ? this.RefreshOnError()
            : this.NoRecordsFound()
          : this.Bounce()}
      </View>
    );
  }

  allUpcomingProjects() {
    var tabText = strings.upcoming_task;
    return (
      <View
        tabLabel={tabText}
        style={(styles.scrollViewBody, { marginTop: 50 })}
      >
        {/* {this.state.todaystask && this.state.todaystask.length > 0
          ? this.filterSection()
          : null}
        {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null} */}
        {!this.state.loader
          ? this.state.upcomingtask.length > 0
            ? this.RenderUpcomingFlashList()
            : this.state.isErrorRefresh
            ? this.RefreshOnError()
            : this.NoRecordsFound()
          : this.Bounce()}
      </View>
    );
  }

  listFooter() {
    // console.log("footer enabled--->" + this.state.isLazyLoading);
    return (
      <View>
        {this.state.isLazyLoading && this.state.apqpList.length > 4 ? (
          <ActivityIndicator animating size="small" />
        ) : (
          <View></View>
        )}
      </View>
    );
  }

  RenderProjectSectionList() {
    const isRefreshing = this.state.isRefreshing;
    console.log("this.state.apqpList--->" + this.state.apqpList);

    return (
      <SectionList
        sections={this.state.apqpList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        refreshing={isRefreshing}
        onRefresh={this.handleRefresh.bind(this)}
        onEndReached={this.endReached.bind(this)}
        onEndReachedThreshold={0.01}
        ListFooterComponent={this.listFooter.bind(this)}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.projectBoxContent}>
            <View>
              <Image
                source={Images.apqpModuleIcon}
                style={styles.apqpTypeIcon}
              />
            </View>
            <Text
              style={{
                marginLeft: 30,
                //padding: 3,
                fontSize: Fonts.size.regular,
                color: "grey",
                fontFamily: "OpenSans-Regular",
              }}
            >
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View key={index} style={styles.flatListView}>
            <View style={styles.flatListTouchableView}>
              <TouchableOpacity
                onPress={this.onPressed.bind(this, item)}
                style={{ width: "80%", backgroundColor: "white" }}
              >
                <View style={styles.flatListInsideView}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      padding: 3,
                      fontSize: Fonts.size.regular,
                      color: "#485B9E",
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {item.Description}
                  </Text>
                </View>
                <View style={styles.flatListInsideView}>
                  <Text
                    style={{
                      marginLeft: 20,
                      padding: 3,
                      fontSize: Fonts.size.small,
                      color: "#A6A6A6",
                      fontFamily: "OpenSans-Regular",
                    }}
                    numberOfLines={1}
                  >
                    {this.changeDateFormatCard(item.StartDate)} -{" "}
                    {this.changeDateFormatCard(item.DueDate)}
                  </Text>
                </View>
                <View style={styles.flatListInsideView}>
                  <Text
                    style={{
                      marginLeft: 20,
                      padding: 3,
                      fontSize: Fonts.size.medium,
                      color: "#545454",
                      fontFamily: "OpenSans-Regular",
                    }}
                    numberOfLines={1}
                  >
                    {item.site}
                  </Text>
                </View>
                <View style={styles.flatListInsideView}>
                  <Text
                    style={
                      (styles.listText, { color: "#545454", marginLeft: 23 })
                    }
                  >
                    Due by Days :
                  </Text>
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
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleModal(item)}
                style={{
                  width: "20%",
                  backgroundColor: "white",
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
                    radius={25}
                    borderWidth={4}
                    color="#48BCF7"
                    shadowColor="lightgrey"
                    bgColor="#fff"
                  >
                    <Text style={{ fontSize: 14 }}>
                      {item.ResourcePercent + "%"}
                    </Text>
                  </ProgressCircle>
                </View>
                <View
                  style={{
                    // width: '100%',
                    //  height: '100%',
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 5,
                  }}
                >
                  <Text
                    style={
                      (styles.dullTextOverall,
                      { color: "#545454", fontSize: 11 })
                    }
                  >
                    Overall
                    {/* {item.Percentage + " %"} */}
                    {" " + item.Percentage + "%"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  loadProjects(index) {
    console.log("index of tab " + index);
    switch (index) {
      case 0: // All
        this.setState(
          { apqpList: [], selectedIndex: 2, loader: true, activeTab: 0 },
          () => {
            this.getapqplistdata("load0");
            this.state.isPendingTask = 0;
          }
        );

        break;
      case 1: // To be Completed
        this.setState(
          { apqpList: [], selectedIndex: 0, loader: true, activeTab: 1 },
          () => {
            this.getapqplistdata("load1");
            this.state.isPendingTask = 0;
          }
        );

        break;
      case 2: // Pending
        this.setState(
          { apqpList: [], selectedIndex: 1, loader: true, activeTab: 2 },
          () => {
            this.getapqplistdata("load2");
            this.state.isPendingTask = 0;
          }
        );
        //console.log("Data of tab " + this.state.apqpList);

        break;
      case 3:
        console.log("Data of tab 3 " + this.props?.data?.projects?.userDateFormat);
        //console.log("Data of tab 3 ", this.props?.data?.projects?.actions);

        break;
      default:
        break;
    }
  }
  //renderFooterUpcoming
  renderFooterUpcoming() {
    console.log("---->Checking_Footer--->6");
    return (
      //  {/* <ImageBackground source={Images.dashFooter} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}> */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "lightgrey",
          marginBottom: 5,
        }}
      >
        <View style={styles1.wrapperFoot}>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View style={styles1.footerMenuItem}>
              <Icon name="clone" size={32} color="#00BAC8" />
              <Text
                style={{
                  color: "#00BAC8",
                  fontSize: Fonts.size.medium,
                  fontFamily: "OpenSans-Regular",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {strings.upcoming_task}
              </Text>
            </View>
            <View style={styles1.separatorSection}>
              {/* <Image source={Images.lineIcon} /> */}
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(ROUTES.TODAYS_TASK)}
              style={styles1.footerMenuItem}
            >
              <Icon name="folder" size={30} color="lightgrey" />
              <Text
                style={{
                  color: "#848484",
                  fontSize: Fonts.size.medium,
                  fontFamily: "OpenSans-Regular",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {strings.dailyTask}
              </Text>
            </TouchableOpacity>
            <View style={styles1.separatorSection}>
              {/* <Image source={Images.lineIcon} /> */}
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(ROUTES.CALENDER_VIEW)}
              style={styles1.footerMenuItem}
            >
              <Icon name="calendar" size={30} color="lightgrey" />
              <Text
                style={{
                  color: "#848484",
                  fontSize: Fonts.size.medium,
                  fontFamily: "OpenSans-Regular",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {strings.Calendar}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  updateCalenderState() {
    console.log('current calandar state--->', this.state.hasUpdated)
    this.props.navigation.navigate(ROUTES.CALENDER_VIEW)
    this.setState({ hasUpdated: false });
  }

  renderFooter1() {
    console.log("---->Checking_Footer--->5");

    if (this.state.todayn == 2) {
      return (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "lightgrey",
            marginBottom: 5,
          }}
        >
          <View style={styles1.wrapperFoot}>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <View style={styles1.footerMenuItem}>
                <Icon name="clone" size={30} color="#00BAC8" />
                <Text
                  numberOfLines={2}
                  style={{
                    color: "#00BAC8",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.todaystask}
                </Text>
              </View>
              <View style={styles1.separatorSection}></View>
              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate("TodayTask")}
                onPress={() =>
                  this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                    // ActiveTab: "today",
                    filterId: 2,
                    title: strings.projects,
                    todayn: 3,
                  })
                }
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="lightgrey" />
                <Text
                  numberOfLines={2}
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.upcoming_task}
                </Text>
              </TouchableOpacity>

              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(ROUTES.TODAYS_TASK)}
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.dailyTask}
                </Text>
              </TouchableOpacity>
              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate(ROUTES.CALENDER_VIEW)}
                onPress={() => this.updateCalenderState()}
                style={styles1.footerMenuItem}
              >
                <Icon name="calendar" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.Calendar}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.todayn == 3) {
      console.log("---->Checking_Footer--->4");
      return (
        //  {/* <ImageBackground source={Images.dashFooter} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}> */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "lightgrey",
            marginBottom: 5,
          }}
        >
          <View style={styles1.wrapperFoot}>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                    // ActiveTab: "today",
                    filterId: 2,
                    title: strings.projects,
                    todayn: 2,
                  })
                }
                style={styles1.footerMenuItem}
              >
                <Icon name="clone" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.todaystask}
                </Text>
              </TouchableOpacity>

              <View style={styles1.separatorSection}></View>

              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate("TodayTask")}
                onPress={() =>
                  this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                    // ActiveTab: "today",
                    filterId: 2,
                    title: strings.projects,
                    todayn: 3,
                  })
                }
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="#00BAC8" />
                <Text
                  numberOfLines={2}
                  style={{
                    color: "#00BAC8",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.upcoming_task}
                </Text>
              </TouchableOpacity>

              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(ROUTES.TODAYS_TASK)}
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.dailyTask}
                </Text>
              </TouchableOpacity>
              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(ROUTES.CALENDER_VIEW)}
                style={styles1.footerMenuItem}
              >
                <Icon name="calendar" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.Calendar}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.todayn == 4) {
      console.log("---->Recently_Completed_Task_Screen--->");
      return (
        //  {/* <ImageBackground source={Images.dashFooter} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}> */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "lightgrey",
            marginBottom: 5,
          }}
        >
          <View style={styles1.wrapperFoot}>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                    // ActiveTab: "today",
                    filterId: 2,
                    title: strings.projects,
                    todayn: 2,
                  })
                }
                style={styles1.footerMenuItem}
              >
                <Icon name="clone" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.todaystask}
                </Text>
              </TouchableOpacity>

              <View style={styles1.separatorSection}></View>

              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate("TodayTask")}
                onPress={() =>
                  this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                    // ActiveTab: "today",
                    filterId: 2,
                    title: strings.projects,
                    todayn: 3,
                  })
                }
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="#00BAC8" />
                <Text
                  numberOfLines={2}
                  style={{
                    color: "#00BAC8",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.upcoming_task}
                </Text>
              </TouchableOpacity>

              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(ROUTES.TODAYS_TASK)}
                style={styles1.footerMenuItem}
              >
                <Icon name="folder" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.dailyTask}
                </Text>
              </TouchableOpacity>
              <View style={styles1.separatorSection}>
                {/* <Image source={Images.lineIcon} /> */}
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(ROUTES.CALENDER_VIEW)}
                style={styles1.footerMenuItem}
              >
                <Icon name="calendar" size={30} color="lightgrey" />
                <Text
                  style={{
                    color: "#848484",
                    // fontSize: Fonts.size.medium,
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {strings.Calendar}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
  renderFooter() {
    return (
      <View style={styles.footerDiv}>
        <View style={styles.footerDiv}>
          <View style={styles.footerContainer}>
            <View style={styles.footerButton2}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 25,
                }}
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
                    apqpOpen: this.state.apqpOpen,
                    todayn: 1,
                  })
                }
              >
                <Icon name="clone" size={30} color="#00BAC8" />
                <Text style={{ color: "#00BAC8" }}>Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    // const showHide = this.props.navigation.state.params?.taskHide;
    const showHide = this.props?.route?.params?.taskHide;
    console.log("Tab changed this.props", this.props);
    // Reactotron.log("Tab changed", showHide);
    console.log("Tab changed", showHide);
    console.log("Tab changed this.state.apqpPending", this.state.apqpPending, '--', this.props?.data?.projects?.counts?.PendingTask);
    console.log("Tab changed this.state.apqpTobecompleted", this.state.apqpTobecompleted, '--', this.props?.data?.projects?.counts?.TobeCompleted);
    console.log("Tab changed this.state.apqpOpen", this.state.apqpOpen, '--', this.props?.data?.projects?.counts?.Open);
    const datas = this.state.apqpList;

    const isRefreshing = this.state.isRefreshing;
    console.log("Tab changed result apqpTobecompleted", this.state.apqpTobecompleted, this.state.apqpPending);
    // var v1 = (this.state.apqpTobecompleted == undefined) ? 0 : this.state?.apqpTobecompleted;
    // var v2 = (this.state.apqpPending == undefined) ? 0 : this.state?.apqpPending;
    var v1 = (this.state.apqpTobecompleted ?? this.props?.data?.projects?.counts?.TobeCompleted) ?? 0;
    var v2 = (this.state.apqpPending ?? this.props?.data?.projects?.counts?.PendingTask) ?? 0;
    const result = Number.isNaN(v2 + v1) ? 0 : v2 + v1;
    const result1 = v2 + v1;
    console.log("Tab changed result", v1, v2, result, result1);
    const onScrollHandler = Animated.event(
      [
        {
          nativeEvent: { contentOffset: { x: this.animatedIndicatorPosition } },
        },
      ],
      { useNativeDriver: false }
    );
    const translateX = this.animatedIndicatorPosition.interpolate({
      inputRange: [0, window_width * 3],
      outputRange: [0, window_width],
    });
    if (this.state.todayn == 1) {
      // console.log("----------->PendingTask_Status----this.state.todayn---->"+this.state.todayn)

      // console.log("-------->this.state.activeTab------>"+this.state.activeTab)
      // console.log("loadProjects---------->2--------->");
      return (
        <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
          <OfflineNotice />
          {this.renderHeader()}
          {showHide !== true ? (
            <View
              style={{
                width: window_width,
                flexDirection: "row",
                height: 50,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    currentTabIndex: 0,
                  });
                  this.animatedIndicatorPosition.setValue(0);
                  this.loadProjects(0);
                }}
              >
                <View
                  style={{
                    width: window_width / 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        this.state.currentTabIndex === 0 ? "700" : "400",
                      color:
                        this.state.currentTabIndex === 0 ? "#4ACECD" : "#888",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    All {`(${result})`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    currentTabIndex: 1,
                  });
                  this.animatedIndicatorPosition.setValue(window_width * 1);
                  this.loadProjects(1);
                }}
              >
                <View
                  style={{
                    width: window_width / 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        this.state.currentTabIndex === 1 ? "700" : "400",
                      color:
                        this.state.currentTabIndex === 1 ? "#4ACECD" : "#888",
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  >
                    To be Completed {`(${v1})`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    currentTabIndex: 2,
                  });
                  this.animatedIndicatorPosition.setValue(window_width * 2);
                  this.loadProjects(2);
                }}
              >
                <View
                  style={{
                    width: window_width / 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        this.state.currentTabIndex === 2 ? "700" : "400",
                      color:
                        this.state.currentTabIndex === 2 ? "#4ACECD" : "#888",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    Pending {`(${v2})`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}

          <View
            style={{
              width: window_width,
              height: 2,
              backgroundColor: "#fff",
              flexDirection: "row",
            }}
          >
            <Animated.View
              style={{
                backgroundColor: "#0000",
                width: translateX, //(this.state.currentTabIndex * window_width) / 3,
                height: 2,
              }}
            />
            <Animated.View
              style={{
                backgroundColor: "#4ACECD",
                width: window_width / 3,
                height: 4,
              }}
            />
          </View>
          <Animated.ScrollView
            onMomentumScrollEnd={(evt) => {
              const { x } = evt.nativeEvent.contentOffset;
              const i = Math.round(x / window_width);
              this.loadProjects(i);
              this.setState({
                currentTabIndex: i,
              });
            }}
            onScroll={onScrollHandler}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          >
            <View
              style={{
                width: window_width,
              }}
            >
              {this.allProjects()}
            </View>
            <View
              style={{
                width: window_width,
              }}
            >
              {this.allToBeCompletedProjects()}
            </View>
            <View
              style={{
                width: window_width,
              }}
            >
              {this.allPendingProjects()}
            </View>
          </Animated.ScrollView>
          <Modal
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.isDateVisible}
            onBackdropPress={() => this.setState({ isDateVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onFilteDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isDateVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.quickModal}
            onBackdropPress={() => this.setState({ quickModal: true })}
          >
            <View style={styles.quickModaldiv}>
              <View style={styles.quickheader}>
                <Text style={{ fontSize: 22, color: "#61BAD0" }}>
                  {strings.Quick_percentage_update}
                </Text>
              </View>
              <View style={styles.quickBody}>
                <View>
                  {this.state.quickpercentage == "" ? null : (
                    <Text style={{ paddingLeft: 5 }}>
                      {strings.Percentage_update}
                    </Text>
                  )}
                </View>
                <View style={styles.textDiv}>
                  <TextInput
                    placeholder={"Enter percentage"}
                    keyboardType={"number-pad"}
                    style={{ fontSize: 18 }}
                    value={this.state.quickpercentage}
                    onChangeText={(text) => {
                      this.setState({
                        quickpercentage: text,
                        modalErrortxt: "",
                      });
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
                    {strings.Enter_Progress}
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
                  <Text style={{ color: "red", fontSize: 18 }}>
                    {strings.Cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.onUpdatePress();
                  }}
                  style={styles.btnDiv2}
                >
                  <Text style={{ color: "green", fontSize: 18 }}>
                    {strings.Update}
                  </Text>
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
    } else if (this.state.todayn == 2) {
      console.log("loadProjects---------->3--------->");
      return (
        <View style={styles.mainContainer}>
          {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
          <OfflineNotice />
          {this.renderHeader()}
          <View style={styles.bodyCont1}>
            <ScrollableTabView
              initialPage={this.state.activeTab}
              tabBarTextStyle={{ fontSize: 17, textAlign: "center" }}
              renderTabBar={() => (
                <DefaultTabBar
                  backgroundColor="white"
                  activeTextColor="#2CB5FD"
                  inactiveTextColor="#747474"
                  underlineStyle={{
                    // backgroundColor: "#2CB5FD",
                    // borderBottomColor: "#2CB5FD",
                    backgroundColor: "#FFFFFF",
                    borderBottomColor: "#FFFFFF",
                    // borderWidth:0.2,
                  }}
                  textStyle={{
                    fontSize: Fonts.size.medium,
                    fontFamily: "OpenSans-Regular",
                  }}
                />
              )}
              tabBarPosition="overlayTop"
              onChangeTab={(o) => this.loadProjects(o.i)}
            >
              {this.allTodaysProjects()}
            </ScrollableTabView>
          </View>
          <View style={{ marginTop: 70 }}>{this.renderFooter1()}</View>
          <Modal
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.isDateVisible}
            onBackdropPress={() => this.setState({ isDateVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onFilteDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isDateVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.quickModal}
            onBackdropPress={() => this.setState({ quickModal: true })}
          >
            <View style={styles.quickModaldiv}>
              <View style={styles.quickheader}>
                <Text style={{ fontSize: 22, color: "#61BAD0" }}>
                  {strings.Quick_percentage_update}
                </Text>
              </View>
              <View style={styles.quickBody}>
                <View>
                  {this.state.quickpercentage == "" ? null : (
                    <Text style={{ paddingLeft: 5 }}>
                      {strings.Percentage_update}
                    </Text>
                  )}
                </View>
                <View style={styles.textDiv}>
                  <TextInput
                    placeholder={"Enter percentage"}
                    keyboardType={"number-pad"}
                    style={{ fontSize: 18 }}
                    value={this.state.quickpercentage}
                    onChangeText={(text) => {
                      this.setState({
                        quickpercentage: text,
                        modalErrortxt: "",
                      });
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
                    {strings.Enter_Progress}
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
                  <Text style={{ color: "red", fontSize: 18 }}>
                    {strings.Cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.onUpdatePress();
                  }}
                  style={styles.btnDiv2}
                >
                  <Text style={{ color: "green", fontSize: 18 }}>
                    {strings.Update}
                  </Text>
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
    } else {
      return (
        <View style={styles.mainContainer}>
          {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
          <OfflineNotice />
          {this.renderHeader()}
          <View style={styles.bodyCont1}>
            <ScrollableTabView
              initialPage={this.state.activeTab}
              tabBarTextStyle={{ fontSize: 17, textAlign: "center" }}
              renderTabBar={() => (
                <DefaultTabBar
                  backgroundColor="white"
                  activeTextColor="#2CB5FD"
                  inactiveTextColor="#747474"
                  underlineStyle={{
                    // backgroundColor: "#2CB5FD",
                    // borderBottomColor: "#2CB5FD",
                    backgroundColor: "#FFFFFF",
                    borderBottomColor: "#FFFFFF",
                    // borderWidth:0.2,
                  }}
                  textStyle={{
                    fontSize: Fonts.size.medium,
                    fontFamily: "OpenSans-Regular",
                  }}
                />
              )}
              tabBarPosition="overlayTop"
              onChangeTab={(o) => this.loadProjects(o.i)}
            >
              {/*this.allProjects()}
            {this.allToBeCompletedProjects()}
              {this.allPendingProjects()*/}
              {this.allUpcomingProjects()}
            </ScrollableTabView>
          </View>
          <View style={{ marginTop: 70 }}>{this.renderFooter1()}</View>
          <Modal
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.isDateVisible}
            onBackdropPress={() => this.setState({ isDateVisible: false })}
          >
            <View style={styles.calendarDiv}>
              <View style={styles.header}>
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.DateRangeHeading}
                </Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor="#1CB3D0"
                selectedDayColor="#15D0AE"
                selectedDayTextColor="#000000"
                previousTitle="<<"
                nextTitle=">>"
                onDateChange={this.onFilteDateChange.bind(this)}
                customDatesStyles={this.state.auditDatesStyles}
                width={width(90)}
                height={height(70)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isDateVisible: false });
                }}
                style={styles.footer}
              >
                <Text style={{ fontSize: 20, color: "#61BAD0" }}>
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.quickModal}
            onBackdropPress={() => this.setState({ quickModal: true })}
          >
            <View style={styles.quickModaldiv}>
              <View style={styles.quickheader}>
                <Text style={{ fontSize: 22, color: "#61BAD0" }}>
                  {strings.Quick_percentage_update}
                </Text>
              </View>
              <View style={styles.quickBody}>
                <View>
                  {this.state.quickpercentage == "" ? null : (
                    <Text style={{ paddingLeft: 5 }}>
                      {strings.Percentage_update}
                    </Text>
                  )}
                </View>
                <View style={styles.textDiv}>
                  <TextInput
                    placeholder={"Enter percentage"}
                    keyboardType={"number-pad"}
                    style={{ fontSize: 18 }}
                    value={this.state.quickpercentage}
                    onChangeText={(text) => {
                      this.setState({
                        quickpercentage: text,
                        modalErrortxt: "",
                      });
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
                    {strings.Enter_Progress}
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
                  <Text style={{ color: "red", fontSize: 18 }}>
                    {strings.Cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.onUpdatePress();
                  }}
                  style={styles.btnDiv2}
                >
                  <Text style={{ color: "green", fontSize: 18 }}>
                    {strings.Update}
                  </Text>
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
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registrationState: (isDeviceRegistered) =>
      dispatch({ type: "STORE_DEVICE_REG_STATUS", isDeviceRegistered }),
    storeServerUrl: (serverUrl) =>
      dispatch({ type: "STORE_SERVER_URL", serverUrl }),
    storeUserSession: (
      userName,
      userId,
      token,
      siteId,
      address,
      companyname,
      companyurl,
      logo,
      phone,
      webaccessToken,
      docattachurl,
    ) =>
      dispatch({
        type: "STORE_USER_SESSION",
        userName,
        userId,
        token,
        siteId,
        address,
        companyname,
        companyurl,
        logo,
        phone,
        webaccessToken,
        docattachurl,
      }),
    storeUserName: (loginuser) =>
      dispatch({ type: "STORE_USER_NAME", loginuser }),
    storeLoginSession: (isActive) =>
      dispatch({ type: "STORE_LOGIN_SESSION", isActive }),
    storeActions: (actions) => dispatch({ type: "STORE_ACTIONS", actions }),
    storeCounts: (counts) => 
      dispatch({ type: "STORE_COUNTS", counts }),
    updateRecentActivityList: (recentActivity) =>
      dispatch({ type: "UPDATE_RECENT_ACTIVITY_LIST", recentActivity }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)
(ApqpPpapManagerScreen);