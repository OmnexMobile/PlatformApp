import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./styles/FilterSectionStyle";
import CalendarPicker from "react-native-calendar-picker";
import Moment from "moment";
import { connect } from "react-redux";
import Modal from "react-native-modal";
// import Accordion from "react-native-collapsible/Accordion";
import Collapsible from "react-native-collapsible";
import { width, height } from "react-native-dimension";
import Fonts from "../themes/Fonts";
import { Images } from "../themes";
import { strings } from "../language/Language";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast, { DURATION } from "react-native-easy-toast";
import OfflineNotice from "../components/OfflineNotice";
import { CheckBox } from "react-native-elements";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";

let PreviousPage = "";
class FilterSection extends Component {
  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    this.state = {
      globalSearchColumn: "",
      globalSearchText: "",
      selectedStartDate: null,
      selectedEndDate: null,
      isModalVisible: false,
      auditDatesStyles: [],
      showRadioAdv: false,
      selectedFormat:
        this.props.data.projects.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props.data.projects.userDateFormat,
      token: this.props.data.projects.token,
      userId: this.props.data.projects.userId,
      siteId: this.props.data.projects.siteId,
      page: 1,
      filterType: "",
      sortype: "",
      filterId: "",
      projectsearch: "",
      SortBy: "",
      SortOrder: "",
      default: 1,
      callback_flag: true,

      //CheckBox
      // allCheckBox: false,
      // scheduledBox: false,
      // completedBox: false,
      // deadlineBox: false,
      // deadlineCompleteBox: false,

      //all: "",
      Module: "",
      Actions: "",
      ActionDesc: "",
      ActionType: "",
      Site: "",
      DueDays: "",

      selectedEndDate: "",
      selectedStartDate: "",
      checked: false,
      activeSection: "",
      //fromDashBoard: this.props.navigation.getParam("fromDashBoard"),
    };
    this.byActions = this.byActions.bind(this);
    this.bySite = this.bySite.bind(this);
    this.byActionDesc = this.byActionDesc.bind(this);
    this.byActionType = this.byActionType.bind(this);
    this.byDueDays = this.byDueDays.bind(this);
    this.byStatus = this.byStatus.bind(this);

    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //     this.onBackHandle(); // works best when the goBack is async
    //     return true;
    // });
  }
  onPressBack() {
    this.props.navigation.goBack();
    // !this.props.navigation.state.params.callback_flag
    //   ? this.props.navigation.goBack()
    //   : this.ApplyFilter();
  }

  renderHeader() {
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onPressBack.bind(this)}>
            <View style={styles.backLogo}>
              <View style={styles.headerDiv}>
                <Icon name="angle-left" size={40} color="white" />
                <Text style={styles.LabelText}>{strings.Back}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{strings.filter}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  componentDidMount() {
    if (this.props.data.projects.language === "Chinese") {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage("zh");
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props.data.projects.language === null ||
      this.props.data.projects.language === "English"
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage("en-US");
        //this.setState({});
      });
    }

    //Get Previuos Page
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    getCurrentPage = this.props?.route?.name;
    // PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    // console.log("Previous---->", PreviousPage);

    const { routes, index } = this.props.navigation.getState();
    if (index > 0) {
      console.log("previousRoute---->", routes[index - 1].name);
      PreviousPage = routes[index - 1].name;
      console.log("Previous---->", PreviousPage);
      return routes[index - 1].name;
    }

    !this.props?.route?.params?.callback_flag ? this.resetAll() : null;
  }

  resetAll() {
    this.setState({
      //allCheckBox: false,
      //checkBox: false,
      showRadioAdv: false,
      all: "",
      globalSearchText: "",
      selectedEndDate: "",
      selectedStartDate: "",
      callback_flag: false,
      Module: "",
      Actions: "",
      ActionDesc: "",
      ActionType: "",
      Site: "",
      DueDays: "",
      globalSearchColumn: "",
      globalSearchText: "",
      // deadlineCompleteBox: false,
    });
  }

  onDateChange(date, type) {
    if (type === "END_DATE") {
      this.setState({
        selectedEndDate: Moment(date).format("MM-DD-YYYY"),
        isModalVisible: false,
      });
    } else {
      this.setState({
        selectedStartDate: Moment(date).format("MM-DD-YYYY"),
        selectedEndDate: null,
      });
    }
  }

  changeDateFormatCard = (inDate) => {
    if (inDate) {
      console.log("inDate ---->", inDate);
      var DefaultFormatL = this.state.selectedFormat;
      var sDateArr = inDate.split("-");
      var outDate = new Date(sDateArr[2], sDateArr[0] - 1, sDateArr[1]);
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  // byModule() {
  //   return (
  //     <View style={styles.collapseView}>
  //       <View
  //         style={{
  //           width: "90%",
  //           height: 40,
  //           borderColor: "lightgrey",
  //           borderWidth: 1,
  //           marginLeft: 20,
  //           marginBottom: 5,
  //           flexDirection: "row",
  //         }}
  //       >
  //         <TextInput
  //           style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
  //           value={this.state.Module}
  //           onChangeText={(text) => this.setState({ Module: text })}
  //         />
  //         <TouchableOpacity
  //           style={{
  //             width: "20%",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //           onPress={() => this.setState({ Module: "" })}
  //         >
  //           <Icon name="close" size={18} color="grey" />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  byActions() {
    return (
      <View style={styles.collapseView}>
        <View
          style={{
            width: "90%",
            height: 40,
            borderColor: "lightgrey",
            borderWidth: 1,
            marginLeft: 20,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
            value={this.state.Actions}
            onChangeText={(text) => this.setState({ Actions: text })}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.setState({ Actions: "" })}
          >
            <Icon name="close" size={18} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  byActionDesc() {
    return (
      <View style={styles.collapseView}>
        <View
          style={{
            width: "90%",
            height: 40,
            borderColor: "lightgrey",
            borderWidth: 1,
            marginLeft: 20,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
            value={this.state.ActionDesc}
            onChangeText={(text) => this.setState({ ActionDesc: text })}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.setState({ ActionDesc: "" })}
          >
            <Icon name="close" size={18} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  byActionType() {
    return (
      <View style={styles.collapseView}>
        <View
          style={{
            width: "90%",
            height: 40,
            borderColor: "lightgrey",
            borderWidth: 1,
            marginLeft: 20,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
            value={this.state.ActionType}
            onChangeText={(text) => this.setState({ ActionType: text })}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.setState({ ActionType: "" })}
          >
            <Icon name="close" size={18} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  bySite() {
    return (
      <View style={styles.collapseView}>
        <View
          style={{
            width: "90%",
            height: 40,
            borderColor: "lightgrey",
            borderWidth: 1,
            marginLeft: 20,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
            value={this.state.Site}
            onChangeText={(text) => this.setState({ Site: text })}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.setState({ Site: "" })}
          >
            <Icon name="close" size={18} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  byDueDays() {
    return (
      <View style={styles.collapseView}>
        <View
          style={{
            width: "90%",
            height: 40,
            borderColor: "lightgrey",
            borderWidth: 1,
            marginLeft: 20,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{ width: "80%", fontFamily: "OpenSans-Regular" }}
            value={this.state.DueDays}
            onChangeText={(text) => this.setState({ DueDays: text })}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.setState({ DueDays: "" })}
          >
            <Icon name="close" size={18} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  byStatus() {
    return (
      <View style={{ marginLeft: 40 }}>
        <View style={styles.flexDirection}>
          <CheckBox
            //Android
            // value={this.state.allCheckBox}
            // onValueChange={() => this.setState({ allCheckBox: !this.state.allCheckBox, all: 'All' })}
            containerStyle={{ color: "red" }}
            checked={this.state.allCheckBox}
            onPress={() =>
              this.setState({ allCheckBox: !this.state.allCheckBox })
            }
            checkedColor="green"
          />
          <Text style={styles.checkBoxText}>All</Text>
        </View>
        <View style={styles.flexDirection}>
          <CheckBox
            checkedColor={
              this.state.allCheckBox === true ? "lightgrey" : "green"
            }
            disabled={this.state.allCheckBox}
            // value={this.state.scheduledBox}
            // onValueChange={() => this.setState({ scheduledBox: !this.state.scheduledBox })}
            checked={this.state.scheduledBox}
            onPress={() =>
              this.setState({ scheduledBox: !this.state.scheduledBox })
            }
          />
          <Text
            style={[
              styles.checkBoxText,
              {
                color: this.state.allCheckBox === true ? "lightgrey" : "grey",
              },
            ]}
          >
            Scheduled
          </Text>
        </View>
        <View style={styles.flexDirection}>
          <CheckBox
            disabled={this.state.allCheckBox}
            // value={this.state.completedBox}
            // onValueChange={() => this.setState({ completedBox: !this.state.completedBox })}

            checked={this.state.completedBox}
            onPress={() =>
              this.setState({ completedBox: !this.state.completedBox })
            }
            checkedColor={
              this.state.allCheckBox === true ? "lightgrey" : "green"
            }
          />
          <Text
            style={[
              styles.checkBoxText,
              {
                color: this.state.allCheckBox === true ? "lightgrey" : "grey",
              },
            ]}
          >
            Completed
          </Text>
        </View>
        <View style={styles.flexDirection}>
          <CheckBox
            disabled={this.state.allCheckBox}
            // value={this.state.deadlineBox}
            // onValueChange={() => this.setState({ deadlineBox: !this.state.deadlineBox })}

            checked={this.state.deadlineBox}
            onPress={() =>
              this.setState({ deadlineBox: !this.state.deadlineBox })
            }
            checkedColor={
              this.state.allCheckBox === true ? "lightgrey" : "green"
            }
          />
          <Text
            style={[
              styles.checkBoxText,
              {
                color: this.state.allCheckBox === true ? "lightgrey" : "grey",
              },
            ]}
          >
            Deadline Violated
          </Text>
        </View>
        <View style={styles.flexDirection}>
          <CheckBox
            disabled={this.state.allCheckBox}
            // value={this.state.deadlineCompleteBox}
            // onValueChange={() => this.setState({ deadlineCompleteBox: !this.state.deadlineCompleteBox })}
            checked={this.state.deadlineCompleteBox}
            onPress={() =>
              this.setState({
                deadlineCompleteBox: !this.state.deadlineCompleteBox,
              })
            }
            checkedColor={
              this.state.allCheckBox === true ? "lightgrey" : "green"
            }
          />
          <Text
            numberOfLines={1}
            style={[
              styles.checkBoxText,
              {
                color: this.state.allCheckBox === true ? "lightgrey" : "grey",
              },
            ]}
          >
            Deadline Violated and Completed
          </Text>
        </View>
      </View>
    );
  }

  ApplyFilter() {
    var Modules = this.state.Module;
    var Actions = this.state.Actions; // Action / RiskName
    var ActionDesc = this.state.ActionDesc;
    var ActionType = this.state.ActionType;
    var Site = this.state.Site;
    var DueDays = this.state.DueDays;

    var selectedStartDate = this.state.selectedStartDate;
    var selectedEndDate = this.state.selectedEndDate;

    console.log("Previous---->", PreviousPage);
    console.log(
      "selectedStartDate , selectedStartDate ",
      selectedStartDate,
      selectedEndDate
    );

    let filterArr = [];
    var formCheckArr = [];

    if (this.state.globalSearchText) {
      filterArr.push({
        filterType: "GlobalFilter",
        sortype: "desc",
        startDate: "",
        text: { globalSearchText: this.state.globalSearchText },
        endDate: "",
        globalSearch: this.state.globalSearchText,
      });
    } else if (
      /** Global filter if user choosed any value from the text box */
      Modules ||
      Actions ||
      ActionDesc ||
      ActionType ||
      Site ||
      DueDays
    ) {
      var finalString = "";
      var globalSearchString = Modules
        ? Modules
        : Actions
        ? Actions
        : ActionDesc
        ? ActionDesc
        : ActionType
        ? ActionType
        : Site
        ? Site
        : DueDays
        ? DueDays
        : "";

      var globalSearchColumn = Modules
        ? "Modules"
        : Actions
        // ? PreviousPage == "RiskScreen"
        ? PreviousPage == ROUTES.RISK_SCREEN
          ? "RiskName"
          // : PreviousPage == "ActionTabInterface"
          : PreviousPage == ROUTES.ACTION_TAB_INTERFACE
          ? "Description"
          : "Actions"
        : ActionDesc
        ? "ActionDesc"
        : ActionType
        ? "ActionType"
        : Site
        ? "Site"
        : DueDays
        ? "DueDays"
        : "";
      console.log("globalSearchString", globalSearchString);
      finalString = globalSearchString;

      filterArr.push({
        filterType: "GlobalFilter",
        sortype: "desc",
        startDate: selectedStartDate,
        // text: {
        //   SearchColumn: globalSearchColumn,
        // },
        endDate: selectedEndDate,
        globalSearch: finalString,
        globalSearchCol: globalSearchColumn,
      });
    } else if (selectedStartDate) {
      /** STATUS filter Client Side   */
      /** CAlender */
      filterArr.push({
        filterType: "Calendar",
        sortype: "desc",
        startDate: selectedStartDate,
        text: selectedStartDate,
        endDate: selectedEndDate,
        globalSearch: null,
        globalSearchCol: null,
      });
    } else {
      // var getText = text.toString();
      // var getTextName = getText.replace(/,/g, " and ");
      // console.log("formStatusQuery_001", formStatusQuery_001);
      // console.log("getTextName", getTextName);
      // filterArr.push({
      //   filterType: "Status",
      //   sortype: 0,
      //   startDate: selectedStartDate,
      //   text: getTextName,
      //   endDate: selectedEndDate,
      //   globalSearch: formStatusQuery_001,
      //   globalSearchCol: globalSearchColumn,
      // });
      // //}
    }
    //ApqpPpapManagerScreen
    console.log("Filteer Screen filterArr-->", filterArr.length);
    if (filterArr.length > 0) {
      if (
        PreviousPage == ROUTES.ACTION_TAB_INTERFACE || //"ActionTabInterface" ||
        PreviousPage == ROUTES.GLOBAL_DASHBOARD
      ) {
        this.props.navigation.navigate(ROUTES.ACTION_TAB_INTERFACE, {
          filter_Arr: filterArr,
        });
      } else if (PreviousPage == ROUTES.RISK_SCREEN) {
        this.props.navigation.navigate(ROUTES.RISK_SCREEN, {
          filter_Arr: filterArr,
        });
      } else if (PreviousPage == ROUTES.MEETING_SCREEN) {
        this.props.navigation.navigate(ROUTES.MEETING_SCREEN, {
          filter_Arr: filterArr,
        });
      } else if (PreviousPage == ROUTES.APQP_PPAP_MANAGER_SCREEN) {
        this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
          filter_Arr: filterArr,
        });
      } else if (PreviousPage == ROUTES.GLOBAL_DASHBOARD) {
        this.props.navigation.navigate(ROUTES.ACTION_TAB_INTERFACE, {
          filter_Arr: filterArr,
        });
      } else {
        console.log("Condition is Invalid--->" + PreviousPage);
      }
      // this.resetAll()
    } else {
      this.refs.toast.show(strings.nofilterapply, DURATION.LENGTH_LONG);
    }
  }

  _updateSections = (activeSection) => {
    this.setState({ activeSection });
  };

  render() {
    const { selectedStartDate, selectedEndDate, activeSection } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";
    const endDate = selectedEndDate ? selectedEndDate.toString() : "";
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}
        {/* Search */}
        <View style={styles.searchView}>
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <Icon name="search" size={18} color="grey" />
          </TouchableOpacity>
          <TextInput
            placeholder={strings.search}
            style={{
              fontSize: 16,
              marginLeft: 5,
              width: "85%",
              fontFamily: "OpenSans-Regular",
            }}
            value={this.state.globalSearchText}
            onChangeText={(Text) => this.setState({ globalSearchText: Text })}
          />
        </View>

        {/* Apply */}
        <TouchableOpacity
          onPress={() => this.ApplyFilter()}
          style={styles.applyView}
        >
          <Text style={styles.applyText}>{strings.apply}</Text>
        </TouchableOpacity>

        {this.state.showRadioAdv ? (
          <View style={styles.checkBox}>
            {startDate && endDate ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.dateRange}>
                  {strings.SortByStartDate}:{" "}
                  {this.changeDateFormatCard(startDate) + " "}
                  {strings.SortByEndDate}:{" "}
                  {this.changeDateFormatCard(endDate) + " "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      selectedStartDate: "",
                      selectedEndDate: "",
                    });
                  }}
                >
                  <Icon
                    style={{ marginTop: 8 }}
                    name="times-circle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "grey",
                    textAlign: "center",
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.PleasechoosestartDateandEndDatefromcalendar}
                </Text>
              </View>
            )}
          </View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, bottom: 5 }}
        >
          <View style={styles.date}>
            <View style={{ width: "55%" }}>
              <Text style={{ fontFamily: "OpenSans-Regular" }}>Date</Text>
            </View>
            <TouchableOpacity
              style={styles.dateview}
              onPress={() =>
                this.setState({ isModalVisible: true, showRadioAdv: true })
              }
            >
              <Icon name="plus" size={18} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            {this._renderIconView2(activeSection !== "byActions")}
            <Collapsible collapsed={activeSection !== "byActions"}>
              {this.byActions()}
            </Collapsible>
          </View>

          {/* {PreviousPage == "ActionTabInterface" ? ( */}
          {PreviousPage == ROUTES.ACTION_TAB_INTERFACE ? (
            <View style={styles.container}>
              {this._renderIconView4(activeSection !== "byActionType")}
              <Collapsible collapsed={activeSection !== "byActionType"}>
                {this.byActionType()}
              </Collapsible>
            </View>
          ) : null}
          <View style={styles.container}>
            {this._renderIconView5(activeSection !== "bySite")}
            <Collapsible collapsed={activeSection !== "bySite"}>
              {this.bySite()}
            </Collapsible>
          </View>
          {/* {PreviousPage == "ActionTabInterface" ||
          PreviousPage == "ApqpPpapManagerScreen" ? ( */}
          {PreviousPage == ROUTES.ACTION_TAB_INTERFACE ||
          PreviousPage == ROUTES.APQP_PPAP_MANAGER_SCREEN ? (
            <View style={styles.container}>
              {this._renderIconView7(activeSection !== "byDueDays")}
              <Collapsible collapsed={activeSection !== "byDueDays"}>
                {this.byDueDays()}
              </Collapsible>
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.cancelView}
          onPress={() => this.resetAll()}
        >
          <Text style={styles.applyText}>{strings.clearall}</Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={styles.calendarModal}>
            <View style={styles.modalBody}>
              <View style={styles.modalheading}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontSize: Fonts.size.regular,
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {strings.DateRangeHeading}
                  </Text>
                </View>
              </View>
              <ScrollView style={styles.scrollView}>
                <View style={{ padding: 20 }}>
                  <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    todayBackgroundColor="#1CB3D0"
                    selectedDayColor="#15D0AE"
                    selectedDayTextColor="#000000"
                    previousTitle="<<"
                    nextTitle=">>"
                    onDateChange={this.onDateChange.bind(this)}
                    // customDatesStyles={this.state.auditDatesStyles}
                    width={width(90)}
                    height={height(70)}
                  />
                </View>
              </ScrollView>
            </View>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <TouchableOpacity
                style={{ padding: "5%" }}
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Text
                  style={{
                    color: "#00a1e2",
                    fontSize: Fonts.size.regular,
                    fontFamily: "OpenSans-Regular",
                  }}
                >
                  {strings.Close}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Toast
          ref="toast"
          style={{ backgroundColor: "grey", margin: 20 }}
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

  _renderIconView1 = (collapse) => {
    return (
      <View style={styles.iconView}>
        <Text style={{ fontFamily: "OpenSans-Regular" }}>Module</Text>
        <View>
          {collapse ? (
            <Icon name="minus" size={18} color="grey" />
          ) : (
            <Icon name="plus" size={18} color="grey" />
          )}
        </View>
      </View>
    );
  };

  _renderIconView2 = (collapse) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            activeSection:
              this.state.activeSection === "byActions" ? "" : "byActions",
          });
        }}
      >
        <View style={styles.iconView}>
          {/* {PreviousPage == "RiskScreen" ? ( */}
          {PreviousPage == ROUTES.RISK_SCREEN ? (
            <Text style={{ fontFamily: "OpenSans-Regular" }}>Risk Name</Text>
          // ) : PreviousPage == "ActionTabInterface" ? (
          ) : PreviousPage == ROUTES.ACTION_TAB_INTERFACE ? (
            <Text style={{ fontFamily: "OpenSans-Regular" }}>Actions</Text>
          // ) : PreviousPage == "MeetingScreen" ? (
          ) : PreviousPage == ROUTES.MEETING_SCREEN ? (
            <Text style={{ fontFamily: "OpenSans-Regular" }}>Meeting Name</Text>
          ) : (
            <Text style={{ fontFamily: "OpenSans-Regular" }}>Actions</Text>
          )}

          <View>
            {!collapse ? (
              <Icon name="minus" size={18} color="grey" />
            ) : (
              <Icon name="plus" size={18} color="grey" />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderIconView3 = (collapse) => {
    return (
      <View style={styles.iconView}>
        <Text style={{ fontFamily: "OpenSans-Regular" }}>Description</Text>
        <View>
          {collapse ? (
            <Icon name="minus" size={18} color="grey" />
          ) : (
            <Icon name="plus" size={18} color="grey" />
          )}
        </View>
      </View>
    );
  };

  _renderIconView4 = (collapse) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            activeSection:
              this.state.activeSection === "byActionType" ? "" : "byActionType",
          });
        }}
      >
        <View style={styles.iconView}>
          <Text style={{ fontFamily: "OpenSans-Regular" }}>Action Type</Text>
          <View>
            {!collapse ? (
              <Icon name="minus" size={18} color="grey" />
            ) : (
              <Icon name="plus" size={18} color="grey" />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderIconView5 = (collapse) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            activeSection:
              this.state.activeSection === "bySite" ? "" : "bySite",
          });
        }}
      >
        <View style={styles.iconView}>
          <Text style={{ fontFamily: "OpenSans-Regular" }}>Site</Text>
          <View>
            {!collapse ? (
              <Icon name="minus" size={18} color="grey" />
            ) : (
              <Icon name="plus" size={18} color="grey" />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderIconView7 = (collapse) => {
    return (
      <TouchableWithoutFeedback
      onPress={() => {
        this.setState({
          activeSection:
            this.state.activeSection === "byDueDays" ? "" : "byDueDays",
        });
      }}
    >
      <View style={styles.iconView}>
        <Text style={{ fontFamily: "OpenSans-Regular" }}>Due by Days</Text>
        <View>
          {!collapse ? (
            <Icon name="minus" size={18} color="grey" />
          ) : (
            <Icon name="plus" size={18} color="grey" />
          )}
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderIconView9 = (collapse) => {
    return (
      <View style={styles.iconView}>
        <Text style={{ fontFamily: "OpenSans-Regular" }}>Status</Text>
        <View>
          {collapse ? (
            <Icon name="minus" size={18} color="grey" />
          ) : (
            <Icon name="plus" size={18} color="grey" />
          )}
        </View>
      </View>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterSection);
