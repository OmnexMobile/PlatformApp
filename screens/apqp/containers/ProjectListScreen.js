import React, { Component } from "react";
import {
  ScrollView,
  Text,
  ImageBackground,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import { Images, Fonts } from "../themes";
// import ResponsiveImage from "react-native-responsive-image";
// import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
// import DropdownMenu from "react-native-dropdown-menu";
import auth from "../../../services/APQP-Auth";
import ProgressCircle from "react-native-progress-circle";
import Moment from "moment";
import Modal from "react-native-modal";
// import CalendarPicker from "react-native-calendar-picker";
// import { width, height } from "react-native-dimension";
import { extendMoment } from "moment-range";
import { strings } from "../language/Language";
import NetInfo from "@react-native-community/netinfo";
const moment = extendMoment(Moment);
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
// import { Dropdown } from "react-native-material-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import styles from "./styles/ProjectListScreenStyles";
import OfflineNotice from "../components/OfflineNotice";
import { DoubleBounce } from "react-native-loader";
import Toast, { DURATION } from "react-native-easy-toast";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
// import Reactotron from "reactotron-react-native";

const window_width = Dimensions.get("window").width;
const Reset = "Reset";
class ProjectListScreen extends Component {
  UserId = "";
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
      text: "DueDate",
      value: strings.SortByEndDate,
    },
    {
      text: "Actions",
      value: strings.Actions,
    },
  ];

  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    // this.navigate = this.props.navigation.navigate;
    this.state = {
      selectedIndex: 0,
      selectedViewIndex: 1,
      apqpList: undefined,
      loader: true,
      completecount: "",
      activeFilterColor: "lightgrey",
      apqpNew: 0,
      apqpTobecompleted: 0,
      apqpPending: 0,
      MaxRow: 10,
      isRefreshing: false,
      statusRadio: 0,
      sortOrder: 0,
      searchText: "",
      searchFlag: false,
      isFilterApplied: false,
      sortOrder: "asc",
      sortBy: 0,
      activeFilter: 1,
      OrderBy: "Actions",
      Sorttype: "",
      auditDatesStyles: [],
      isDateVisible: false,
      StartDate: "",
      EndDate: "",
      radioParam: "0",
      isVisible: false,
      quickModal: false,
      quickpercentage: "",
      recentActivity: "",
      filterArrSplit: [],
      project_sort: 1, // Desc
      isFilterApplied: false,
      selectedStartDate: null,
      selectedEndDate: null,
      project_sortText: "",
      project_filterType: "",

      ProjectSearch: "",
      ProjectColumn: "",
      showDropdown: false,
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    // Reactotron.log(this.props.navigation.state, "navigation params one");
    console.log("Project List Screen mounted", this.state.selectedIndex);
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteId = res.SiteId;
        this.setState({ recentActivity: this.props?.navigation?.recentActivity });
        this.getapqplistdata("did");
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

  getapqplistdata(from) {
    //ListType 1-->Pending 0-->To do
    console.log("calling_apqp_api===>", this.state.selectedIndex, from);

    const UserID = this.UserId;
    const SiteId = this.SiteId;
    const Index = 0;
    const maxRow = this.state.MaxRow;
    // const ListType = 2;
    const ListType =
      this.state.selectedIndex === 0
        ? 0
        : this.state.selectedIndex === 1
        ? 2
        : 1;
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
    // const OrderBy = "StartDate";
    const Sorttype =
      this.state.sortOrder === "" || this.state.sortOrder == null
        ? "desc"
        : this.state.sortOrder;
    const StartDate = this.state.StartDate;
    const EndDate = this.state.EndDate;

    console.log("calling");
    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
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
            console.log("getting responses here", data);
            if (data.data.Message == "Success") {
              var getList = [];
              getList = data.data.Data;
            //   Reactotron.log(getList, "hello this is a getlist");
              console.log("getList printed");
              console.log(getList);
              this.setState(
                {
                  apqpList: getList,
                  completecount: data.data.Data.length,
                  apqpNew: this.props?.route?.params?.apqpNew,
                  apqpTobecompleted:
                  this.props?.route?.params?.apqpTobecompleted,
                  apqpPending: this.props?.route?.params?.apqpPending,
                  // apqpList:data.data.Data,
                  loader: false,
                  isLazyLoading: false,
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

  onPress() {
    console.log("onPress pressed");
    this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
  }

  listFooter() {
    console.log(
      "footer enabled--->ProjectList------------>" + this.state.isLazyLoading
    );
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
   
    this.setState(
      {
        //  loader: true,
        isRefreshing: true,
        isLazyLoading: true,
        MaxRow: this.state.MaxRow + 10,
      },
      () => {
        // this.getapqplistdata("handleend");
        console.log("handle reached");
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
        this.getapqplistdata("handle refresh");
      }
    );
  }

  onPressed(item) {
    console.log("onPress pressed");
    this.props.navigation.navigate("ApqpDeliveryScreen", {
      itemData: item,
    });
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
        this.getapqplistdata("index change");
      }
    );
  };

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
        loader: true,
        OrderBy: droptext,
        sortOrder: sortype,
        isErrorRefresh: false,
        apqpList: [],
        isMounted: false,
        StartDate: filter[0].startDate,
        EndDate: filter[0].endDate,
      },
      () => {
        this.getapqplistdata("filter");
      }
    );
  }

  handleViewIndexChange = (index) => {
    console.log("changing View index", index);

    this.setState(
      {
        selectedViewIndex: 1,
        //loader: true
      },
      () => {
        this.props.navigation.navigate(ROUTES.APQP_MANAGER_SCREEN, {});
        console.log("---->", this.state.selectedViewIndex);
      }
    );
  };

  toggleModal(item) {
    console.log("pressed", item);
    this.setState({ quickModal: true }, () => {
      this.passquickParameter = item;
      console.log("passquickParameter", this.passquickParameter);
    });
  }

  openProjectPage(item) {
    console.log("HI ActionPage is newwww", item);

    this.props.navigation.navigate(ROUTES.TASK_LIST_SCREEN, {
      itemData: item,
      // projectName: item.Actions,
    });
    // Reactotron.log(item);
    console.log(item);
    // this.props.navigation.navigate("PeriodicUpdateScreen", {
    //   RouteParam: "Project",
    //   itemData: item,
    //   // ProjectId: this.ProjectId,
    //   // recentActivity: this.state.recentActivity,
    // });

    // this.updateRecentActionList(item);
  }

  RenderFlashList(tasklist) {
    return (
      <View style={styles.flatListStyle}>
        <FlatList
          data={tasklist}
          //data={tasklist.sort((a, b) => a.Actions.localeCompare(b.Actions))}
          keyExtractor={(item, index) => {
            return index;
          }}
          // keyExtractor={(item) => item.key}
          extraData={this.state}
          onEndReached={this.handleEnd.bind(this)}
          onEndReachedThreshold={0.01}
          ListFooterComponent={this.listFooter.bind(this)}
          renderItem={({ item }) => (
            <View style={styles.flatListTouchableView}>
              <TouchableOpacity
                onPress={() => this.openProjectPage(item)}
                style={{ width: "80%", backgroundColor: "white" }}
              >
                <View>
                  <Image
                    source={Images.apqpModuleIcon}
                    style={styles.apqpTypeIcon}
                    s
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 25,
                    padding: 3,
                    fontSize: Fonts.size.regular,
                    color: "#485B9E",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {item.Actions}
                </Text>
                <View style={styles.flatListInsideView}>
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
                </View>
                <View style={styles.flatListInsideView}>
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
                </View>
                <View style={styles.flatListInsideView}>
                  <Text style={styles.listText}>Due by Days :</Text>
                  <Text
                    // style={{
                    //   marginLeft: 5,
                    //   padding: 3,
                    //   fontSize: Fonts.size.regular,
                    //   color: "#545454",
                    //   fontFamily: "OpenSans-Regular",
                    // }}

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
                <View style={styles.flatListInsideView}>
                  <Text style={styles.listText}>Project Owner:</Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      padding: 3,
                      fontSize: Fonts.size.medium,
                      color: "#545454",
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {" " + item.ProjectOwner}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {} /*this.toggleModal(item)*/}
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
                    <Text style={{ fontSize: 12, color: "grey" }}>
                      {item.ResourcePercent + "%"}
                    </Text>
                  </ProgressCircle>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 5,
                  }}
                >
                  {/* <Text style={styles.dullTextOverall, {fontSize: 11}}> */}
                  {/* <Text
                    style={{
                      fontSize: 11,
                      width: "85%",
                      height: 20,
                      color: "grey",
                    }}
                  >
                    Overall {" " + item.Percentage + "%"}
                  </Text> */}
                </View>
              </TouchableOpacity>
            </View>
          )}
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
            <Text style={styles.headingText}>{strings.projects}</Text>
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
        {/* <DoubleBounce size={20} color="#1CAFF6" /> */}
        <ActivityIndicator size={20} color="#1CAFF6" />
      </View>
    );
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
              console.log("-->", data);
              if (data.data.Message == "Success") {
                this.setState(
                  {
                    quickModal: false,
                    quickpercentage: "",
                    modalErrortxt: "",
                  },
                  () => {
                    this.toast?.show(
                      data.data.Data == ""
                        ? "Saved successfully"
                        : data.data.Data,
                      DURATION.LENGTH_SHORT
                    );
                    this.getapqplistdata("update");
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
                    this.toast?.show(data.data.Data, DURATION.LENGTH_SHORT);
                  }
                );
              }
            }
          );
        }
      }
    }
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
        project_sortText: dropText == Reset ? "Actions" : dropText,
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
              loader: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              apqpList: [],
              filterTypeFG: 0,
              OrderBy: droptext, //Sort Column
              sortOrder: sortype == 0 ? "desc" : "asc", // ASC
              cFilterVal: 0,
            },
            () => {
              this.getapqplistdata("Sort");
            }
          );
          break;
        default:
          break;
      }
    });
  }

  changeProjectSort(value) {
    this.setState(
      {
        isFilterApplied: true,
        project_filterType: "Sort",
        project_sort: value,
        project_sortText:
          this.state.project_sortText === ""
            ? "Actions"
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

  filterSection() {
    const { showDropdown } = this.state;
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
              style={[styles.dropdown, showDropdown && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={this.dropdata}
              search={false}
              maxHeight={300}
              labelField={"text"}
              valueField="value"
              placeholder={
                !showDropdown ? strings.Actions : this.state.project_sortText
              }
              searchPlaceholder=" "
              value={this.state.project_sortText}
              onFocus={() => {
                this.setState({
                  showDropdown: true,
                });
              }}
              onBlur={() => {
                this.setState({
                  showDropdown: false,
                });
              }}
              onChange={(item) => {
                this.setState({
                  showDropdown: false,
                  project_sortText: item.value,
                });
                this.onChangeText(item.value);
              }}
            />
            {/* <Dropdown
              value={strings.Actions}
              onChangeText={this.onChangeText.bind(this)}
              data={this.dropdata}
              containerStyle={{ flex: 1 }}
              itemPadding={3}
              dropdownOffset={{ top: 14, left: 0 }}
              width={300}
              baseColor="grey"
              itemTextStyle={{ fontFamily: "OpenSans-Regular" }}
            /> */}
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
          this.getapqplistdata("filter");
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
  render() {
    const datas = this.state.apqpList;
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}
        <View style={styles.flatList}>
          {this.filterSection()}
          {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
          {this.state.loader === true
            ? this.render_loader()
            : this.RenderFlashList(datas)}
        </View>
        {/* <View style={styles.flatList}>
          {this.filterSection()}
          {this.state.filterArrSplit.length > 0 ? this.renderFilter() : null}
          {this.state.loader === true
            ? this.render_loader()
            : this.RenderFlashList(datas)}
        </View>      

        */}
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
                  keyboardType={"number-pad"}
                  style={{ fontSize: 18 }}
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
          ref={(toast) => {
            this.toast = toast;
          }}
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

  renderFooter() {
    return (
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
              onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            >
              <Icon name="home" size={32} color="#00BAC8" />
              <Text style={{ color: "#00BAC8" }}>{strings.home}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorSection}>
            {/* <Image source={Images.lineIcon} /> */}
          </View>
          <View style={styles.footerButton1}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 50,
                height: 25,
              }}
              onPress={() =>
                this.props.navigation.navigate(ROUTES.ACTION_TAB_INTERFACE)
              }
            >
              <Icon name="envelope-open" size={26} color="#00BAC8" />
              <Text style={{ color: "#00BAC8" }}>{strings.Actions}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  endReached() {
    console.log("handle reached");
    this.setState(
      {
        maxRow: this.state.maxRow + 10,
      },
      () => {
        this.getapqplistdata(this.state.selectedIndex);
        s;
      }
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
    // storeActions: (actions) => dispatch({ type: "STORE_ACTIONS", actions }),
    // updateRecentActivityList: (recentActivity) =>
    // dispatch({ type: "UPDATE_RECENT_ACTIVITY_LIST", recentActivity }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectListScreen);
