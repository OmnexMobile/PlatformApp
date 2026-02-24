import React, { Component } from "react";
import {
  Text,
  Dimensions,
  Keyboard,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import Moment from "moment";
import Modal from "react-native-modal";
import { width, height } from "react-native-dimension";
import CalendarPicker from "react-native-calendar-picker";
import { extendMoment } from "moment-range";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles/RiskScreenStyles";
// import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import { Dropdown } from "react-native-material-dropdown";
const moment = extendMoment(Moment);
import { strings } from "../language/Language";
import { DoubleBounce } from "react-native-loader";
import OfflineNotice from "../components/OfflineNotice";
import { ROUTES } from "constants/app-constant";
import NetInfo from "@react-native-community/netinfo";
import GlobalHeader from "components/GlobalHeader";
import RiskCard from "../components/RiskCard";
const dropdownOffset = { top: 20, left: 0 };

const Reset = "Reset";
class RiskScreen extends Component {
  UserId = "";
  Token = "";
  SiteID = "";

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
      text: "RiskAction",
      value: strings.Risk_Action,
    },
  ];

  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    this.state = {
      selectedViewIndex: 1,
      apqpRiskListdata: "",
      completecount: "",
      search: "",
      MaxRow: 10,
      isRefreshing: false,
      statusRadio: 0,
      searchText: "",
      searchFlag: false,
      isFilterApplied: false,
      sortOrder: "",
      sortBy: 0,
      activeFilter: 1,
      OrderBy: "StartDate",
      Sorttype: "",
      projectDatesStyles: [],
      isDateVisible: false,
      StartDate: "",
      EndDate: "",

      activeFilterColor: "lightgrey",
      isLoading: true,
      filterArrSplit: [],
      project_sort: 0, // Desc
      isFilterApplied: false,
      selectedStartDate: null,
      selectedEndDate: null,
      project_sortText: "StartDate",
      project_filterType: "",

      ProjectSearch: "",
      ProjectColumn: "",

      projects: 0,
      risks: 4, //completed: '',
      meetings: 2, //deadlineviolated: '',
      documents: 1, //deadlineviolatedandcompleted: '',
      // loading: true,
      noactions: 0,
      showMyAllActions: false,
      // apqpList: undefined,
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("RiskScreen mounted", this.state.apqpRiskListdata);
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteID = res.SiteId;
        if (this.state.isFilterApplied === false) {
          this.setState({ isLoading: true }, () => {
            this.storeDetails();
            this.getapqpDashboarddata(res);
            this.getapqpRiskListdata("willrecieve");
          });
        }
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });

    this.props.navigation.addListener("didFocus", () => {
      // console.log('Action List Component Focussed!')

      if (this.props.navigation.getParam("filter_Arr")) {
        console.log(
          "Filter Applied",
          this.props.navigation.getParam("filter_Arr")
        );
        this.filterApplied(this.props.navigation.getParam("filter_Arr"));
        // this.loadRecentAudits()
      } else {
        if (this.state.isMounted) {
          this.setState(
            {
              loading: false,
              isRefreshing: false,
              isFileterApplied: true,
              isPageEmpty: false,
              isErrorRefresh: false,
            },
            () => {}
          );

          this.setState(
            {
              isLoading: true,
            },
            () => {
              this.getapqpRiskListdata("did");
            }
          );
        }

        if (this.state.token == "") {
          this.getSessionValues();
        }
      }
    });
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
        isloading: true,
        // OrderBy: droptext,
        OrderBy: droptext == "EndDate" ? "DueDate": droptext, 
        sortOrder: sortype,
        isErrorRefresh: false,
        isMounted: false,
        StartDate: filter[0].startDate,
        EndDate: filter[0].endDate,
      },
      () => {
        this.getapqpRiskListdata("filter");
      }
    );
  }

  deleteFilter() {
    // this.props.navigation.state.params = undefined;
    this.props.route.params = undefined;
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
      },
      () => {
        this.getapqpRiskListdata("delete");
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

    this.setState({ isLoading: true }, () => {
      switch (filterType) {
        case "Sort":
          this.setState(
            {
              filterId: "",
              page: 1,
              isLoading: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              apqpRiskListdata: [],
              // OrderBy: droptext, //Sort Column
              OrderBy: droptext == "EndDate" ? "DueDate": droptext, 
              sortOrder: sortype == 0 ? "desc" : "asc", // ASC
              cFilterVal: 0,
            },
            () => {
              console.log("from filter sortoreder ", this.state.sortOrder);
              this.getapqpRiskListdata("filter");
            }
          );
          break;
        default:
          break;
      }
    });
  }

  filterSection() {
    return (
      <>
      {/* <View style={styles.filterCont}>
        <TouchableOpacity
          style={styles.filterBox}
          // onPress={() =>
          //   this.props.navigation.navigate(ROUTES.FILTER_SCREEN_APQP, {
          //     callback_flag:
          //       this.state.filterArrSplit.length == 0 ? false : true,
          // })}
        >
          <Icon name="filter" size={20} color="#89888A" />
          <Text style={styles.filterLabelText}>
            {strings.filter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBox}>
          <View style={styles.dropdownContainer}>
            <Dropdown
              // value={strings.SortByStartDate}
              value={this.state.project_sortText} 
              onChangeText={this.onChangeText.bind(this)}
              data={this.dropdata}
              containerStyle={styles.dropdownInnerContainer}
              itemPadding={5}
              dropdownOffset={dropdownOffset}
              width={300}
              baseColor="grey"
              itemTextStyle={styles.dropdownItemText}
            />
          </View>
          {this.state.project_sort == 0 ? (
            <TouchableOpacity
              onPress={() => this.changeRiskSort(1)}
              style={styles.sortToggleButton}
            >
              <Icon name="long-arrow-down" size={20} color="#19BFC1" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.changeRiskSort(0)}
              style={styles.sortToggleButton}
            >
              <Icon name="long-arrow-up" size={20} color="#19BFC1" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View> */}
      </>
    );
  }

  renderFilter() {
    return (
      <View style={styles.renderFilterContainer}>
        {this.state.filterArrSplit.map((item, index) => (
          <View key={index} style={styles.renderFilterView}>
            <Text style={styles.renderFilterText}>
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

  onFilteDateChange(date, type) {
    console.log("onFilteDateChange", date, type);
    var date = Moment(date).format("MM/DD/YYYY");
    console.log("date", date);
    if (type === "END_DATE") {
      this.setState(
        {
          EndDate: date,
          isDateVisible: false,
          isLoading: true,
        },
        () => {
          console.log("--end date--->", this.state.EndDate);
          this.getapqpMeetingListdata("calendar");
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
  //End Filter

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

  getapqpRiskListdata(from) {
    //ListType 1-->InProgress 0-->Open
    console.log("calling apqp api", from, this.state.sortOrder);

    const UserID = this.UserId;
    const SiteID = this.SiteID;
    const Index = 0;
    const Max = this.state.MaxRow;
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
    auth.getapqpRiskListdata(
      UserID,
      SiteID,
      Index,
      Max,
      Token,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      (res, data) => {
        console.log("getting responses here", data);
        if (data?.data?.Message == "Success") {
          var getList = [];
          getList = data.data.Data;
          console.log("getList printed");
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
              //apqpRiskListdata: sectionedList,
              apqpRiskListdata: getList,
              completecount: data.data.Data.length,
              //apqpList:data.data.Data,
              isLoading: false,
              isRefreshing: false,
            },
            () => {
              console.log("setting up the list...");
              //   this.state.apqpRiskListdata
              // );
              console.log("completecount", this.state.completecount);
              // this.someMethod()
              // this.somethingMethod()
            }
          );
        } else {
          this.setState(
            {
              apqpRiskListdata: [],
              isLoading: false,
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
  updateRecentActionList(item) {
    var list = [];
    list.push(item);
    if(list[0].length === 2){
      list[0].push("Risk");  
    } else {
      list[0]['Modules'] = ('Risk');  
    }
    console.log("HI ActionPage old", list[0].ActionId, list);
    var recentActionListProps = this.props.data.projects.recentActivity;
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
        console.log(recentActions);
        this.props.updateRecentActivityList(recentActions);

      }
    } else {
      recentActions.push(list);
      this.props.updateRecentActivityList(recentActions);
    }
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
  onPressRiskAction(item) {
    this.props.navigation.navigate(ROUTES.RISK_ACTION_SCREEN, {
      item: item,
    });
    console.log("HI ActionPage is new", item);
    this.updateRecentActionList(item);
  }

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

  changeRiskSort(value) {
    console.log("Value::::", value);
    this.setState(
      {
        isFilterApplied: true,
        project_filterType: "Sort",
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

  onsearchPress() {
    Keyboard.dismiss();
  }

  handleEnd() {
    console.log("handle reached");
    this.setState(
      {
        MaxRow: this.state.MaxRow + 10,
      },
      () => {
        this.getapqpRiskListdata("handleend");
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
        this.getapqpRiskListdata("handle refresh");
      }
    );
  }

  handleBack() {
    // this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
    this.props.navigation.goBack();
  }

  renderHeader() {
    return (
      <>
        <GlobalHeader
          title={strings.risks}
          onLeftPress={() => this.handleBack()}
          onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
          showBackButton={false}
        />
      </>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footerDiv}>
        <View style={styles.footerDiv}>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.footerHomeButton}
              onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            >
              <Icon name="home" size={32} color="#00BAC8" />
              <Text style={styles.footerHomeText}>{strings.home}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  NoRecordsFound() {
    return (
      <Text style={styles.noRecordsText}>
        {strings.No_records_found}
      </Text>
    );
  }

  renderBounce() {
    return (
      <View style={styles.bounceContainer}>
        <DoubleBounce size={20} color="#1CAFF6" />
      </View>
    );
  }

  render() {
    const datas = this.state.apqpRiskListdata;
    const isRefreshing = this.state.isRefreshing;

    return (
      <View style={styles.mainContainer}>
        <View style={Platform.OS === "ios" ? styles.topSpacerIos : styles.topSpacerAndroid} />
        <OfflineNotice />
        {this.renderHeader()}
        <View style={styles.flatList}>
          {datas.length > 0 ? this.filterSection() : null}
          {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
          {!this.state.isLoading ? (
            datas.length > 0 ? (
              <FlatList
                data={datas}
                keyExtractor={(item) => item.ActionId}
                showsVerticalScrollIndicator={true}
                refreshing={isRefreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReached={this.handleEnd.bind(this)}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                  <RiskCard item={item} handleClickCard={this.onPressRiskAction.bind(this, item)}  />
                )}
              />
            ) : (
              this.NoRecordsFound()
            )
          ) : (
            this.renderBounce()
          )}
        </View>
        {/* {this.renderFooter()} */}
        <Modal
          isVisible={this.state.isDateVisible}
          onBackdropPress={() => this.setState({ isDateVisible: false })}
        >
          <View style={styles.calendarDiv2}>
            <View style={styles.header}>
              <Text style={styles.calendarTitleText}>
                Select Date Range
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
              customDatesStyles={this.state.projectDatesStyles}
              width={width(90)}
              height={height(70)}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ isDateVisible: false });
              }}
              style={styles.footer}
            >
              <Text style={styles.calendarTitleText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(RiskScreen);
