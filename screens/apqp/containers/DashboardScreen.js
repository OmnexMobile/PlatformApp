import React, { Component } from "react";
import {
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  Image,
  View,
  Alert,
  Linking,
  TextInput,
  TouchableOpacity,
  LogBox,
} from "react-native";
import Images from "../themes/Images";
import Moment from "moment";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
import Icon from "react-native-vector-icons/FontAwesome";
// import { width, height } from "react-native-dimension";
import { connect } from "react-redux";
import OfflineNotice from "../components/OfflineNotice";
// import AppHeader from "../Components/AppHeader";
import ApqpDashboardFooter from "../components/ApqpDashboardFooter";
// import { ConfirmDialog } from "react-native-simple-dialogs";
import AsyncStorage from "@react-native-community/async-storage";
import { strings } from "../language/Language";
import NetInfo from "@react-native-community/netinfo";
// import DeviceInfo from "react-native-device-info";
import { getUniqueId } from "react-native-device-info";
import { DoubleBounce, Pulse } from "react-native-loader";
import Toast, { DURATION } from "react-native-easy-toast";
// import Modal from "react-native-modal";
import Fonts from "../themes/Fonts";
let Window = Dimensions.get("window");
const window_width = Dimensions.get("window").width;
import Card from "../components/Card";
import TodayCard from "../components/TodayCard";
// import ProjectListScreen from "./ProjectListScreen";
// Styles
import auth from "../../../services/APQP-Auth";
import styles from "./styles/DashboardStyles";
// import { Header } from "react-navigation";
import PendingCard from "../components/PendingCard";
import VersionCheck from 'react-native-version-check';
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";

class DashboardScreen extends Component {
  UserId = "";
  Token = "";
  SiteId = "";
  userfullname = "";

  loadrtask = true;
  constructor(props) {
    super(props);
    console.log('get current props--->', props, 'this.props.data.projects.recentActivity', this.props.data.projects.recentActivity)
    this.firstRequest = true;

    this.state = {
      loader: true,
      // new
      dialogVisible: false,
      errorDialogVisible: false,
      progressVisible: false,
      errorMsg: "",
      sortOrder: "asc",
      completecount: 0,
      searchFlag: false,
      deviceId: getUniqueId,
      Username: "",
      StartDate: "",
      EndDate: "",
      recent_activity: this.props.data.projects.recentActivity
        ? this.props.data.projects.recentActivity.length > 0
          ? this.props.data.projects.recentActivity.asMutable().reverse()
          : []
        : [],
      // recent_activity: [],
      todaystask: [],
      upcomingtask: [],
      pendingApqpList: [],
      selectedIndex: 0,
      projects: 0,
      risks: 4, //completed: '',
      meetings: 2, //deadlineviolated: '',
      documents: 1, //deadlineviolatedandcompleted: '',
      loading: true,
      todayLoading: true,
      pendingLoading: true,
      recentLoading: false,
      apqpDashboarddata: [],
      MaxRow: 200,
      UserId: "",
      Token: "",
      SiteId: "",
      selectedFormat:
        this.props.data.projects.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props.data.projects.userDateFormat,

      page: 1,

      filterId: "",
      isMounted: false,
      isPageEmpty: false,
      Sorttype: "",
      ProjectSearch: "",
      ProjectColumn: "",
      SortBy: "",
      SortOrder: "",
      EndDate: "",
      default: 0, //todays activity

      //hardcode need to remove
      noactions: 0,
      showMyAllActions: false,
      showMyAllActions1: false,
      notifybadge: [],
      ShowNotifyBadge: 0,
    };

    this.willFocusSubscription = props.navigation.addListener(
      "willFocus",
      () => {
        /** first request as it will be called in component did mount */
        if (!this.firstRequest) {
          //this.getAuditLists()
          // Today's activity and Status api Added in Listener
          //this.getAuditStatusDetails()
          //this.getAuditlist()
        }
        this.firstRequest = false;
      }
    );
    console.log("dashboard called");
  }

  getUserFullName = async () => {
    const userfullname = await AsyncStorage.getItem("UserFullName");
    return userfullname;
  };

  componentDidMount() {
    console.log("props recieved did mount", this.props);
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    LogBox.ignoreLogs(['componentWillMount has been renamed']); 
    // console.log("DashboardScreen mounted");
    if (this.props.data.projects.language === "Chinese") {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage("zh");
        this.setState({});
        console.log("Chinese script on", this.state.ChineseScript);
      });
    } else if (
      this.props.data.projects.language === null ||
      this.props.data.projects.language === "English"
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage("en-US");
        this.setState({});
        console.log("Chinese script off", this.state.ChineseScript);
      });
    }
    console.log(
      "getting App header props",
      this.props?.data?.projects?.recentActivity
    );
    this.setState(
      {
        dialogVisible: false,
        Username: this.props?.data?.projects?.userName,
      },
      () => {}
    );
    console.log('reach didFocus outer----');
    this.props?.navigation?.addListener("focus", () => {
      console.log("reach didfocus inside", this.getData());
      this.getData()
        .then((res) => {
          console.log("async getdata", res);
          this.storeDetails(res);
          this.getapqpDashboarddata(res);
          this.getTodaysTask(res);
          this.getRecentTask(res);
          this.getUpcomingTask(res);
          this.getAPQPPendingTask(res);
        })
        .catch((e) => {
          console.log("Async aerror", e);
        });
    });
    this.checkAppVersion1();
  }

  storeDetails = async (res) => {
    console.log('get response from getData', res)
    this.props.registrationState(res?.isDeviceRegistered);
    this.props.storeServerUrl(res?.currentServerUrl);
    this.props.storeUserSession(
      res?.userfullname,
      res?.UserId,
      res?.Token,
      res?.SiteId,
      res?.Address,
      res?.CompanyName,
      res?.CompanyUrl,
      res?.Logo,
      res?.Phone,
      res?.webToken,
      res?.docattachurl,
    );
    this.props.storeLoginSession(true);
    this.props.storeUserName(res?.loginuser);
    this.renderCategory(res?.category, res?.title);

  }

  async renderCategory(category, title) {
    console.log('reach renderCategory-0----->', category, title)
    if(category === 'Actions') {
      console.log('reach Actions')
      this.props.navigation.navigate(ROUTES.TODAYS_TASK, {
        isFilterApplied: false,
      });
    } else if(category === 'APQP/PPAP') {
      console.log('reach APQP/PPAP')
      this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
        filterId: 2,
        title: strings.projects,
        todayn: 1,
        allprojects:
          this.state.projects + this.state.risks + this.state.meetings,
      })
    } else if(category === 'Risk') {
      console.log('reach Risk')
      this.props.navigation.navigate(ROUTES.RISK_SCREEN, {
        filterId: 3,
        title: strings.risks,
      })
    } else if(category === 'Meeting') {
      console.log('reach Meeting')
      this.props.navigation.navigate(ROUTES.MEETING_SCREEN, {
        filterId: 4,
        title: strings.meetings,
        recentActivity: this.props.data.projects.recentActivity,
      })
    } else if(category === 'Today Task') {
      console.log('reach Today Task')
      this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
        filterId: 1,
        title: strings.projects,
        todayn: 2,
        taskHide: true,
      });
    } else if(category === 'Daily Task') {
      console.log('reach Daily Task')
      this.props.navigation.navigate(ROUTES.TODAYS_TASK, {
        isFilterApplied: false,
      })
    } else {

    }
    const stringifiedUserDetails = await AsyncStorage.getItem('userDataApqp');
    const userDataApqp = JSON.parse(stringifiedUserDetails);
    userDataApqp.category = null;
    await AsyncStorage.setItem('userDataApqp', JSON.stringify(userDataApqp));
  }

  componentWillReceiveProps() {
    // componentDidUpdate() {
      console.log(" receive props recieved", this.props);
      console.log("props recieved1", this.props?.route?.params);
      var getCurrentPage = [];
      // getCurrentPage = this.props.data.nav.routes;
      // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
      var CurrentPage = this.props?.route?.name
      console.log('--CurrentPage--->', CurrentPage);
  
      if (CurrentPage == "DASHBOARD_APQP") {
        console.log("calling asyn getapqplist2data");
        this.getData()
          .then((res) => {
            console.log("async", res);
            this.UserId = res.UserId;
            this.Token = res.Token;
            this.SiteId = res.SiteId;
            this.userfullname = res.userfullname;
            this.getapqplistdata(); //Calling APQPLanding/List API
            // this.getapqpDashboarddata(res);
            this.setState({ Username: this.userfullname });
          })
          .catch((e) => {
            console.log("Async aerror", e);
          });
      } else {
        console.log("DashboardScreen pass");
      }
    }

  

  checkAppVersion1 = async () => {
    try {
      // console.log("====>checkAppVersion====>1")
      const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=org.omnex.auditpro`)
              .then(r => r.json())
              .then((res) => { return res?.results[0]?.version })
              : await VersionCheck.getLatestVersion({
                  provider: 'playStore',
                  packageName: 'com.apqp',
                  ignoreErrors: true,
              });
      
      const currentVersion = VersionCheck.getCurrentVersion();
      // console.log("====>checkAppVersion====>2==========>currentVersion=====>",currentVersion)
      // console.log("====>checkAppVersion====>3==========>latestVersion=====>",latestVersion)
      if (latestVersion > currentVersion) {
        // console.log("====>checkAppVersion====>4==========>IF=====>")
          const url = Platform.OS === 'android'
          ? await  VersionCheck.getPlayStoreUrl({ packageName: 'com.apqp' })
          :await VersionCheck.getAppStoreUrl({ appID: '1613335822' })
          // console.log("====>checkAppVersion====>4==========>URL========>",url)
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => Linking.openURL(url)
                ,
              },
              {
                text: 'Later',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              ],
              { cancelable: false }
            );
          } else {
            // App is up-to-date; proceed with the app
            // console.log("====>checkAppVersion====>4==========>Else=====>")
          }
        } catch (error) {
          // Handle error while checking app version
          // console.log("====>checkAppVersion====>5==========>Catch=====>")
          console.error('Error checking app version:', error);
        }
};

  getRecentTask() {
    console.log("API_Calls------------------>3");
    if (this.props.data.projects.recentActivity) {
      console.log("recent_activity:::::::out", this.state.recent_activity);
      this.setState(
        {
          recent_activity: this.props?.data?.projects?.recentActivity
            ? this.props?.data?.projects?.recentActivity?.length > 0
              ? this.props?.data?.projects?.recentActivity?.asMutable().reverse()
              : []
            : [],
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
  getUpcomingTask(res) {
    console.log("API_Calls------------------>4");
    var UserID = res.UserId;
    var Token = res.Token;
    var Siteid = res.SiteId;
    // var TodayTask = 1;
    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        auth.getUpcomingTaskapi(UserID, Siteid, Token, (res, data) => {
          if (data.data.Message == "Success") {
            console.log(this.state.upcomingtask);
            // console.log("API_Calls------------------>UpcomingResponse------>",this.state.upcomingtask);
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
    console.log("API_Calls------------------>2");
    var UserID = res.UserId;
    var Token = res.Token;
    var Siteid = res.SiteId;
    var TodayTask = 1;
    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        console.log(
          "@@@@@ DashboardScreen calendarapi", Siteid
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

  formatDate(fulldate) {
    const date = fulldate;
    const [year, month, day] = date.split("-");
    let newDate = `${month}-${day}-${year}`;
    return newDate;
  }

  getAPQPPendingTask(res) {
    //ListType 1-->Pending 0-->To do
    console.log("API_Calls------------------>5");

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    var fulldate = new Date(year + 10, month, day);

    var formatedDate1 = fulldate.toISOString().slice(0, 10);

    var UserID = res.UserId;
    var Token = res.Token;
    var SiteId = res.SiteId;

    const Index = 0;
    // const maxRow = this.state.MaxRow;
    const maxRow = 10;
    const ListType = 1;
    // this.state.selectedIndex === 0
    //   ? 0
    //   : this.state.selectedIndex === 1
    //   ? 2
    //   : 1;
    // const projectView = 1;
    const projectView = 0;
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
    // const OrderBy = this.state.OrderBy;
    const OrderBy = "StartDate";
    const Sorttype = "desc";
    // this.state.sortOrder === "" || this.state.sortOrder == null
    //   ? "desc"
    //   : this.state.sortOrder;
    const StartDate = this.state.StartDate;
    // const EndDate = this.state.EndDate;
    const EndDate =
      this.state.StartDate == ""
        ? this.formatDate(formatedDate1)
        : this.state.EndDate;

    console.log("calling");
    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        console.log("API_Calls------------------>getapqplist========>", SiteId);
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

            // if (data.data.Message == "Success") {
            //   console.log("API_Calls------------------>7");
            //   // var PendingGetList = [];
            //   // PendingGetList = data.data.Data;
            //   // console.log("PendingGetList_printed");
            //   // console.log(PendingGetList);
            //   // this.setState(
            //   //   {
            //   //     pendingApqpList: PendingGetList,
            //   //     // completecount: data.data.Data.length,
            //   //     // showMyAllActions1: true,
            //   //     loader: false,
            //   //     isRefreshing: false,
            //   //   },
            //   //   () => {
            //   //     console.log("APQP_Pending_list--->", this.state.pendingApqpList);
            //   //     // console.log("completecount", this.state.completecount);
            //   //     // this.someMethod()
            //   //     // this.somethingMethod()});
            //   console.log("API_Calls------------------>8--------->"+data.data.Data);

            //   console.log(this.state.pendingApqpList);
            //   this.setState(
            //     {
            //       pendingApqpList: data.data.Data,
            //       pendingLoading: false,
            //       loader: false,
            //       isRefreshing: false,
            //     },
            //     () => {
            //       console.log(
            //         "PENDING_Task------->" + this.state.pendingApqpList
            //       );
            //       //this.RenderFlashList(this.state.todaystask);
            //     }
            //   );
            // }

            if (data.data.Message == "Success") {
              var getList = [];
              getList = data.data.Data;              
            // console.log("API_Calls------------------>PendingTaskResponse========>",getList);
              this.setState(
                {
                  // apqpList: getList,
                  // completecount: data.data.Data.length,
                  // showMyAllActions1: true,
                  // loader: false,
                  // isRefreshing: false,

                  pendingApqpList: getList,
                  // completecount: data.data.Data.length,
                  pendingLoading: false,
                  loader: false,
                  isRefreshing: false,
                },
                () => {
                  console.log("setting up the list...", this.state.apqpList);
                  console.log("completecount", this.state.completecount);
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
                },
                () => {
                  console.log("error fetching");
                }
              );
            }
          }
        );
      }
    });
  }

  changeDateFormatCard = (inDate) => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat + " " + "HH:mm";
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
  getapqplistdata(from) {
    //ListType 1-->Pending 0-->To do
    console.log("calling apqp api", this.state.selectedIndex);

    const UserID = this.UserId;
    const SiteId = this.SiteId;
    const Index = 0;
    const maxRow = this.state.MaxRow;
    const ListType = 1;
    // this.state.selectedIndex === 0
    //   ? 0
    //   : this.state.selectedIndex === 1
    //   ? 2
    //   : 1;
    const projectView = 1;
    const Token = this.Token;
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
    const OrderBy = this.state.OrderBy;
    const Sorttype =
      this.state.sortOrder === "" || this.state.sortOrder == null
        ? "desc"
        : this.state.sortOrder;
    const StartDate = this.state.StartDate;
    const EndDate = this.state.EndDate;

    console.log("calling");
    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        console.log("API_Calls------------------>getapqplist2========>", SiteId);
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
            // console.log("API_Calls------------------>Projects========Response=====>",data);
            if (data.data.Message == "Success") {
              var getList = [];
              getList = data.data.Data;
              console.log("getList printed");
              console.log(getList);
              this.setState(
                {
                  apqpList: getList,
                  completecount: data.data.Data.length,
                  showMyAllActions1: true,
                  loader: false,
                  isRefreshing: false,
                },
                () => {
                  
        // console.log("API_Calls------------------>Projects========Response==========>this.state.apqpList=====>",this.state.apqpList);
        // console.log("API_Calls------------------>Projects========Response==========>this.state.completecount=====>",this.state.completecount);
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
                },
                () => {
                  console.log("error fetching");
                }
              );
            }
          }
        );
      }
    });
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
            // console.log("apqpDashboarddata=======>Meetings==========>"+apqpDashboarddata.Meetings);
            // console.log("apqpDashboarddata=======>TotalActions==========>"+apqpDashboarddata.TotalActions);
            // console.log("apqpDashboarddata=======>Risks==========>"+apqpDashboarddata.Risk);
            // console.log("apqpDashboarddata=======>APQPPPAP==========>"+apqpDashboarddata.APQPPPAP);
            //console.log(apqpDashboarddata);
            this.setState(
              {
                // apqpList: apqpDashboarddata,
                //projects: apqpDashboarddata.APQPAction,
                //totalActions: apqpDashboarddata.TotalAction,
                //inProgressActions: apqpDashboarddata.Inprogress,
                //totalTobeCompletedProjects: apqpDashboarddata.TobeCompleted,
                //totalPendingProjects: apqpDashboarddata.PendingTask,
                risks: apqpDashboarddata.Risk,
                documents: apqpDashboarddata.Documents,
                meetings: apqpDashboarddata.Meetings,
                noactions: apqpDashboarddata.TotalActions,
                projects: apqpDashboarddata.APQPPPAP,
                loading: false,
                showMyAllActions: true,
              },
              () => {
                this.props.storeCounts(apqpDashboarddata);

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
            loading: false,
            isMounted: true,
          },
          () => {}
        );
      }
    });
  }

  onPressProjects() {
    this.props.navigation.navigate(ROUTES.OPEN_SCREEN);
  }

  onPressDocuments() {
    this.props.navigation.navigate(ROUTES.INPROGRESS_SCREEN);
  }

  onPressMeeting() {
    this.props.navigation.navigate(ROUTES.MEETING_SCREEN, {
      recentActionsFromDashboard: true,
    });
  }

  onPressRisk() {
    this.props.navigation.navigate(ROUTES.RISK_SCREEN);
  }

  getData = async () => {
    try {

      var userdata = [];
      const stringifiedUserDetails = await AsyncStorage.getItem('userDataApqp');
      const value = JSON.parse(stringifiedUserDetails);
      console.log('current userdata--->', value)
      // const userdata = [];
      var userdata = {
          UserId: value?.userId,
          SiteId: value?.siteId,
          Token: value?.accessToken,
          userfullname: value?.userFullName,
          docattachurl: value?.docattachurl,
          isDeviceRegistered: value?.isDeviceRegistered,
          currentServerUrl: value?.currentServerUrl,
          Address: value?.Address,
          CompanyName: value?.CompanyName,
          CompanyUrl: value?.CompanyUrl,
          Logo: value?.Logo,
          Phone: value?.Phone,
          loginuser: value?.loginuser,
          webToken: value?.webToken,
          category: value?.category,
          title: value?.title,
        };
      console.log("userdata aync", userdata);
      return userdata;
      // return userdata;
    } catch (e) {
      console.log("No user session");
    }
  };

  renderMyCardSplit(myLists, errorMsg) {
    console.log("Recent_item_Dashboard::", myLists[0]);
    return (
      <View style={styles.bgWhite}>
        {myLists.length > 0 ? (
          myLists.slice(0, 10).map((item, index) => {
            return (
              <Card
                dateFormat={this.props.data.projects.userDateFormat}
                item={item[0]}
                index={index}
                // key={index}
                length={myLists.slice(0, 10).length}
                currentProps={this.props}
              />
            );
          })
        ) : (
          <Text style={styles.noActivityTxt}>{errorMsg}</Text>
        )}
      </View>
    );
  }

  renderTodayCardSplit(myLists, errorMsg) {
    return (
      <View style={styles.bgWhite}>
        {myLists.length > 0 ? (
          myLists.slice(0, 2).map((item, index) => {
            console.log("item::", item);
            return (
              <TodayCard
                dateFormat={this.props.data.projects.userDateFormat}
                item={item}
                index={index}
                length={myLists.slice(0, 2).length}
                currentProps={this.props}
              />
            );
          })
        ) : (
          <Text style={styles.noActivityTxt}>{errorMsg}</Text>
        )}
      </View>
    );
  }

  renderUpcomingTaskSplit(myLists, errorMsg) {
    console.log("--------->Upcoming_Lists------>" + myLists.length);
    return (
      <View style={styles.bgWhite}>
        {myLists.length > 0 ? (
          myLists.slice(0, 5).map((item, index) => {
            console.log("item::", item);
            return (
              <TodayCard
                dateFormat={this.props.data.projects.userDateFormat}
                item={item}
                index={index}
                length={myLists.slice(0, 5).length}
                currentProps={this.props}
              />
            );
          })
        ) : (
          <Text style={styles.noActivityTxt}>{errorMsg}</Text>
        )}
      </View>
    );
  }

  renderPendingTaskSplit(myLists, errorMsg) {
    console.log("--------->renderPendingTaskSplit------>" + myLists.length);
    return (
      <View style={styles.bgWhite}>
        {myLists.length > 0 ? (
          myLists.slice(0, 10).map((item, index) => {
            console.log("item::", item);
            return (
              <PendingCard
                dateFormat={this.props.data.projects.userDateFormat}
                item={item}
                index={index}
                length={myLists.slice(0, 10).length}
                currentProps={this.props}
              />
            );
          })
        ) : (
          <Text style={styles.noActivityTxt}>{errorMsg}</Text>
        )}
      </View>
    );
  }

  NoRecordsFound() {
    return (
      <Text
        style={{
          //width: window_width,
          //height: height(5),
          // flex: 1,
          // flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontSize: Fonts.size.h5,
          padding: 40,
          //marginTop: 50,
          fontFamily: "OpenSans-Regular",
        }}
      >
        {strings.No_records_found}
      </Text>
    );
  }

  goToNotification() {}

  render() {
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.render_header()}
        {this.state.loading ? this.render_loader() : this.render_statusBar()}

        {this.state.showMyAllActions && this.state.showMyAllActions1 ? (
          <View style={styles.showMyAll}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(ROUTES.PROJECT_LIST_APQP, {
                  apqpNew: this.state.apqpNew,
                  apqpTobecompleted: this.state.apqpTobecompleted,
                  apqpPending: this.state.apqpPending,
                  todayn: 1,
                })
              }
            >
              <Text style={styles.actionNotifyTxt}>
                {strings.youhave +
                  " " +
                  this.state.completecount +
                  " " +
                  "projects"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.showMyAll}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: null,
                backgroundColor: "white",
                padding: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                this.props.navigation.navigate(ROUTES.PROJECT_LIST_APQP, {
                  apqpNew: this.state.apqpNew,
                  apqpTobecompleted: this.state.apqpTobecompleted,
                  apqpPending: this.state.apqpPending,
                  todayn: 1,
                })
              }
            >
              <Pulse size={20} color="#1CAFF6" />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={{ backgroundColor: "lightgrey" }}>
          {/* Today's Task */}
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.todaystask}</Text>
              {this.state.todaystask.length > 2 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                      //ActiveTab: "today",
                      //TaskListScreen
                      filterId: 2,
                      title: strings.projects,
                      todayn: 2,
                    })
                  }
                >
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.state.todayLoading
              ? this.render_loader()
              : this.renderTodayCardSplit(
                  this.state.todaystask,
                  strings.noactions
                )}

            {/* {this.state.todayLoading
              ? this.render_loader()
              : this.state.todaystask.length > 0
              ? this.RenderFlashList(this.state.todaystask)
              : this.NoRecordsFound()} */}
          </View>

          {/* Upcoming Task */}
          <View style={{ backgroundColor: "white", marginTop: 6 }}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.upcoming_task}</Text>
              {this.state.upcomingtask.length > 3 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                      // ActiveTab: "today",
                      filterId: 2,
                      title: strings.projects,
                      todayn: 5,
                      isUpcomingTask: 2,
                    })
                  }
                >
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.state.todayLoading
              ? this.render_loader()
              : this.renderUpcomingTaskSplit(
                  this.state.upcomingtask,
                  strings.noactions
                )}
          </View>

          {/* Pending Task */}
          <View style={{ backgroundColor: "white", marginTop: 6 }}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.pending_task}</Text>
              {this.state.pendingApqpList.length > 3 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                      // ActiveTab: "today",
                      selectedIndex: 2,
                      filterId: 2,
                      title: strings.projects,
                      todayn: 1,
                      isPendingTask: 1,
                    })
                  }
                >
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.state.pendingLoading
              ? this.render_loader()
              : this.renderPendingTaskSplit(
                  this.state.pendingApqpList,
                  strings.noactions
                )}
          </View>

          {/* Recent Action(s) */}
          <View style={{ backgroundColor: "white", marginTop: 6 }}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.recenttask}</Text>
              {/* To be updated */}
              {this.state.recent_activity.length > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    //this.props.navigation.push("ActionTabInterface", {
                    //  ActiveTab: "recent",
                    //  })
                    this.props.navigation.navigate(ROUTES.TODAYS_TASK, {
                      isFilterApplied: false,
                    })
                  }
                >
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.renderMyCardSplit(
              this.state.recent_activity,
              strings.norecentactivity
            )}
          </View>
        </ScrollView>
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
        <ApqpDashboardFooter
          navigation={this.props.navigation}
        ></ApqpDashboardFooter>
      </View>
    );
  }

  toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) rv[i] = arr[i];
    return rv;
  }

  render_header() {

    {console.log('this.state.Username', this.state.Username)}
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW) }
          style={{left: 10}}
          hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
          >
          <Icon name="angle-left" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.welcomeTxtView}>
          <Text style={styles.welcomeTxt}>
            {strings.welcome + " "}
            {this.state.Username ? (
              <Text style={[styles.welcomeTxt]} numberOfLines={1}>
                {(
                  this.state.Username.charAt(0).toUpperCase() +
                  this.state.Username.slice(1)
                ).length > 20
                  ? (
                      this.state.Username.charAt(0).toUpperCase() +
                      this.state.Username.slice(1)
                    ).slice(0, 20) + "..."
                  : this.state.Username.charAt(0).toUpperCase() +
                    this.state.Username.slice(1)}
              </Text>
            ) : null}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          {/* <TouchableOpacity
            style={styles.bellIcon}
            onPress={
              () => {
                this.goToNotification();
              }
              // this.state.notifybadge.length === 0 ? this.refs.toast.show(strings.nonewnotificationfound, DURATION.LENGTH_LONG)
              // : this.props.navigation.navigate('AuditNotifications', { notifications: this.state.notifybadge })
            }
          >
            <Icon name={"bell"} size={25} color={"white"} />
            {this.state.ShowNotifyBadge > 0 ? (
              <View style={styles.bellBadge}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {this.state.ShowNotifyBadge}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clockIcon}
            onPress={() => {
              this.goToNotification();
            }}
          >
            <Icon name={"clock-o"} size={25} color="white" />
          </TouchableOpacity> */}
          <TouchableOpacity
           style={styles.bellIcon}
            onPress={() =>
              this.props.navigation.navigate(ROUTES.FILTER_SCREEN_APQP, {
                fromDashBoard: true,
              })
            }
          >
            <Icon name="search" size={25} color="white"/>
            <Text style={{color: "#FFFFFF",
                textAlign: "center"
                }}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push(ROUTES.GLOBAL_DASHBOARD, {
                // fromDashBoard: true,
              })
            }
            style={{
              justifyContent: "center",
              alignItems: "center",}}>
              <Icon name="refresh" size={25} color="white" alignItems="center" justifyContent="center" />

              <Text style={{color: "#FFFFFF",
                textAlign: "center"
                }}>Refresh</Text>
          
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  render_loader() {
    return (
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DoubleBounce size={20} color="#1CAFF6" />
      </View>
    );
  }

  render_statusBar() {
    return (
      <View style={styles.statusOuterView}>
        <TouchableOpacity
          style={[styles.statusView]}
          onPress={() =>
            this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
              filterId: 2,
              title: strings.projects,
              todayn: 1,
              allprojects:
                this.state.projects + this.state.risks + this.state.meetings,
            })
          }
        >
          <Text style={styles.statusheaderTxt}>{this.state.projects}</Text>
          <Text style={styles.statusTxt}>{strings.APQPManager}</Text>
        </TouchableOpacity>
        <Text style={styles.vertBorder} />
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate(ROUTES.RISK_SCREEN, {
              filterId: 3,
              title: strings.risks,
            })
          }
        >
          <Text style={styles.statusheaderTxt}>{this.state.risks}</Text>
          <Text style={styles.statusTxt}>{strings.risks}</Text>
        </TouchableOpacity>
        <Text style={styles.vertBorder} />
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate(ROUTES.MEETING_SCREEN, {
              filterId: 4,
              title: strings.meetings,
              recentActivity: this.props.data.projects.recentActivity,
            })
          }
        >
          <Text style={styles.statusheaderTxt}>{this.state.meetings}</Text>
          <Text style={styles.statusTxt}>{strings.meetings}</Text>
        </TouchableOpacity>
        {/* <Text style={styles.vertBorder} />
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate("ActionTabInterface", {
              filterId: 5,
              title: strings.documents,
            })
          }
        >
          <Text style={styles.statusheaderTxt}>{this.state.documents}</Text>
          <Text style={styles.statusTxt}>{strings.documents}</Text>
        </TouchableOpacity> */}
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
    registrationState: (isDeviceRegistered) =>
      dispatch({ type: "STORE_DEVICE_REG_STATUS", isDeviceRegistered }),
    storeServerUrl: (serverUrl) =>
      dispatch({ type: "STORE_SERVER_URL", serverUrl }),
    storeCounts: (counts) => 
      dispatch({ type: "STORE_COUNTS", counts }),

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
    storeDateFormat: (userDateFormat) =>
      dispatch({ type: "STORE_DATE_FORMAT", userDateFormat }),
    // registrationState: (isDeviceRegistered) =>
    //   dispatch({ type: "STORE_DEVICE_REG_STATUS", isDeviceRegistered }),
    storeUserName: (loginuser) =>
      dispatch({ type: "STORE_USER_NAME", loginuser }),
    storeLoginSession: (isActive) =>
      dispatch({ type: "STORE_LOGIN_SESSION", isActive }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
