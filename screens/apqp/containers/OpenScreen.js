import React, { Component } from "react";
import {
  ScrollView,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
} from "react-native";
import { Images, Fonts } from "../themes";
// import ResponsiveImage from "react-native-responsive-image";
// import InputField from "../Components/Shared/InputField";
// import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
// import SegmentedControlTab from "react-native-segmented-control-tab";
import auth from "../../../services/APQP-Auth";
// import ProgressCircle from "react-native-progress-circle";
import Moment from "moment";
import Modal from "react-native-modal";
import { width, height } from "react-native-dimension";
import CalendarPicker from "react-native-calendar-picker";
import { extendMoment } from "moment-range";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import { Dropdown } from "react-native-material-dropdown";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";

let Window = Dimensions.get("window");

const moment = extendMoment(Moment);

import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-community/async-storage";

// ApqpProjectScreenStyle
// Styles
import styles from "./styles/OpenScreenStyles";
import { SPACING } from "constants/theme-constants";

class OpenScreen extends Component {
  UserId = "";
  Token = "";
  SiteId = "";

  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    this.state = {
      selectedViewIndex: 1,
      apqpOpenListdata: [],
      completecount: "",
      search: "",
      MaxRow: 10,
      isRefreshing: false,
      searchText: "",
      searchFlag: false,
      isFilterApplied: false,
      sortypeForms: "",
      meetingRadio: 0,
      sortOrder: "asc",
      sortBy: 0,
      activeFilter: 1,
      OrderBy: "Actions",
      Sorttype: "",
      auditDatesStyles: [],
      isDateVisible: false,
      StartDate: "",
      EndDate: "",
      activeFilterColor: "lightgrey",
      isLoading: false,
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteId = res.SiteId;
        this.setState(
          {
            isLoading: true,
          },
          () => {
            this.getapqpOpenListdata();
          }
        );
      })
      .catch((e) => {
        console.log("Async aerror", e);
      });
  }

  getData = async (userdata) => {
    try {
      var UserId = await AsyncStorage.getItem("UserId");
      var Token = await AsyncStorage.getItem("Token");
      var Siteid = await AsyncStorage.getItem("SiteId");
      var userdata = [];

      console.log("Siteid aync", Siteid);

      console.log("UserId asyc", UserId.toString());
      console.log("Token asyns", Token.toString());
      var userdata = {
        UserId: UserId,
        SiteId: Siteid,
        Token: Token,
      };
      return userdata;
    } catch (e) {
      console.log("No user session");
    }
  };

  getapqpOpenListdata() {
    const UserID = this.UserId;
    const SiteID = this.SiteId;
    const Index = 1;
    const MaxRow = this.state.MaxRow;
    const ListType = 0;
    const Token = this.Token;
    const OrderBy = this.state.OrderBy;
    const Sorttype = this.state.sortOrder;
    const StartDate = this.state.StartDate;
    const EndDate = this.state.EndDate;

    var FilterValue = "%" + "" + "%";
    var FilterColumn = "0";

    if (this.state.searchFlag === true) {
      FilterValue = "%" + this.state.searchText + "%";
    } else {
      if (parseInt(this.state.meetingRadio) > 0) {
        FilterColumn = "modules";
        if (parseInt(this.state.meetingRadio) == 1) {
          FilterValue = "%apqp%";
        } else if (parseInt(this.state.meetingRadio) == 2) {
          FilterValue = "%risk%";
        } else if (parseInt(this.state.meetingRadio) == 3) {
          FilterValue = "%meeting%";
        }
      }
    }

    console.log("calling");
    console.log("MaxRow", MaxRow);

    auth.getapqpOpenListdata(
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
        console.log("getting responses here", data);
        if (data.data.Message == "Success") {
          var getList = [];
          getList = data.data.Data;
          console.log("getList printed");
          console.log(getList);

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
              //apqpOpenListdata: sectionedList,
              apqpOpenListdata: getList,
              completecount: data.data.Data.length,
              //apqpList:data.data.Data,
              isLoading: false,
              isRefreshing: false,
            },
            () => {
              console.log(
                "setting up the list...",
                this.state.apqpOpenListdata
              );
              console.log("completecount", this.state.completecount);
              // this.someMethod()
              // this.somethingMethod()
            }
          );
        } else {
          this.setState(
            {
              apqpOpenListdata: [],
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

  onFilterPress(item) {
    console.log("Filter pressed", item);
    this.setState({ activeFilter: item.id }, () => {
      console.log("Active filter is now", this.state.activeFilter);
      console.log("Active statusRadio is now", this.state.statusRadio);
      console.log("Active sortOrder is now", this.state.sortOrder);
      console.log("Active sortBy is now", this.state.sortBy);
      if (this.state.activeFilter == 5) {
        this.setState(
          {
            OrderBy: "Actions",
            radioParam: "0",
            isLoading: true,
          },
          () => {
            this.getapqpOpenListdata();
          }
        );
      } else if (this.state.activeFilter == 2) {
        this.setState(
          {
            isDateVisible: true,
            radioParam: "0",
          },
          () => {
            console.log("calendar");
          }
        );
      } else if (this.state.activeFilter == 4) {
        this.setState(
          {
            radioParam: "0",
            meetingRadio: 0,
            isLoading: true,
          },
          () => {
            console.log("status");
            this.getapqpOpenListdata();
          }
        );
      } else {
        this.setState(
          {
            StartDate: "",
            EndDate: "",
            radioParam: "0",
            OrderBy: "",
            searchText: "",
            meetingRadio: 0,
            isLoading: true,
          },
          () => {
            console.log("all");
            this.getapqpOpenListdata();
          }
        );
      }
    });
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
        this.getapqpOpenListdata();
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
        this.getapqpOpenListdata();
      }
    );
  }

  onSearchPress() {
    Keyboard.dismiss();
    this.setState({ isLoading: true }, () => {
      this.getapqpOpenListdata();
    });
  }

  onClearSearch() {
    Keyboard.dismiss();
    this.setState(
      {
        searchFlag: !this.state.searchFlag,
        isLoading: true,
      },
      () => {
        this.getapqpOpenListdata();
      }
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
          this.getapqpOpenListdata();
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

  getsortype = (status, value) => {
    console.log("status", status);
    console.log("value", value);
    if (status == "Sort") {
      if (value == 0) {
        this.setState(
          {
            sortOrder: "asc",
            sortBy: 0,
            isLoading: true,
          },
          () => {
            console.log("sortOrder now", this.state.sortOrder);
            this.getapqpOpenListdata();
          }
        );
      } else {
        this.setState(
          {
            sortOrder: "desc",
            sortBy: 1,
            isLoading: true,
          },
          () => {
            console.log("sortOrder now", this.state.sortOrder);
            this.getapqpOpenListdata();
          }
        );
      }
    } else {
      this.setState(
        {
          meetingRadio: value,
          isLoading: true,
        },
        () => {
          console.log("meetingRadio now", this.state.meetingRadio);
          this.getapqpOpenListdata();
        }
      );
    }
  };

  render() {
    const Filterdata = [
      {
        name: "All",
        id: 1,
      },
      {
        name: "Calendar",
        id: 2,
      },
      {
        name: "Module",
        id: 4,
      },
      {
        name: "Sort",
        id: 5,
      },
    ];

    const datas = this.state.apqpOpenListdata;
    const isRefreshing = this.state.isRefreshing;

    var radio_props_forms = [
      { label: "All", value: 0 },
      { label: "APQP", value: 1 },
      { label: "Risk", value: 2 },
      { label: "Meeting", value: 3 },
    ];
    var radio_props_forms_1 = [
      { label: "Ascending", value: 0 },
      { label: "Descending", value: 1 },
    ];
    // Action Site Owner Status

    let sortList = [
      {
        id: 1,
        value: "Actions",
      },
      {
        id: 2,
        value: "ActionType",
      },
      {
        id: 3,
        value: "Site",
      },
      {
        id: 4,
        value: "StartDate",
      },
      {
        id: 5,
        value: "DueDate",
      },
      {
        id: 6,
        value: "DueByDays",
      },
    ];

    return (
      <View style={styles.mainContainer}>
         {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <Image source={Images.apqpmanagerbg} style={styles.bgImage} />
        <View style={styles.apqpTextView}>
          <ImageBackground
            source={Images.headerBG}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 75,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.backLogo}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon name="angle-left" size={48} color="white" />
                </TouchableOpacity>
              </View>
              {/*  */}
              <View style={styles.headerTextDiv}>
                {this.state.searchFlag ? (
                  <View style={styles.searchDiv}>
                    <TextInput
                      style={{ width: "90%" }}
                      placeholder={"I am looking for..."}
                      value={this.state.searchText}
                      onChangeText={(Text) =>
                        this.setState({ searchText: Text })
                      }
                      onBlur={() => Keyboard.dismiss()}
                      autoFocus={true}
                    />
                    <TouchableOpacity onPress={() => this.onSearchPress()}>
                      <Icon name="search" size={20} color="#00aed0" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.apqpTextStyle}>Open</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => this.onClearSearch()}
                style={styles.calendarDiv}
              >
                {this.state.searchFlag ? (
                  <Icon
                    style={{ top: 5 }}
                    name="times-circle"
                    size={28}
                    color="white"
                  />
                ) : (
                  <Icon
                    style={{ top: 5 }}
                    name="search"
                    size={28}
                    color="white"
                  />
                )}
              </TouchableOpacity>
              {/*  */}
            </View>
          </ImageBackground>
        </View>

        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "80%",
            top: 80,
            position: "absolute",
          }}
        >
          <View style={styles.buttonStyles}>
            <FlatList
              data={Filterdata}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    onPress={this.onFilterPress.bind(this, item)}
                    style={
                      item.id == this.state.activeFilter
                        ? [
                            styles.buttonTouchableStyle,
                            { backgroundColor: this.state.activeFilterColor },
                          ]
                        : [
                            styles.buttonTouchableStyle,
                            { backgroundColor: "white" },
                          ]
                    }
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {this.state.activeFilter == 4 ? (
              <View>
                <RadioGroup
                  horizontal={true}
                  size={24}
                  thickness={2}
                  color="#2EA5E2"
                  highlightColor="transparent"
                  selectedIndex={this.state.meetingRadio}
                  onSelect={this.getsortype.bind(this, "Module")}
                  style={{ flexDirection: "row", paddingTop: 0, marginTop: 0 }}
                >
                  {radio_props_forms.map((item, key) => (
                    <RadioButton value={item.value}>
                      <Text>{item.label}</Text>
                    </RadioButton>
                  ))}
                </RadioGroup>
              </View>
            ) : this.state.activeFilter == 5 ? (
              <View style={{ width: "100%", height: 40, flexDirection: "row" }}>
                <View style={{ width: "60%", flexDirection: "row" }}>
                  <RadioGroup
                    horizontal={true}
                    size={24}
                    thickness={2}
                    color="#2EA5E2"
                    highlightColor="transparent"
                    selectedIndex={this.state.sortBy}
                    onSelect={this.getsortype.bind(this, "Sort")}
                    style={{
                      flexDirection: "row",
                      paddingTop: 0,
                      marginTop: 0,
                    }}
                  >
                    {radio_props_forms_1.map((item, key) => (
                      <RadioButton value={item.value}>
                        <Text>{item.label}</Text>
                      </RadioButton>
                    ))}
                  </RadioGroup>
                </View>
                <View style={styles.dropdowndiv}>
                  <Dropdown
                    containerStyle={{ width: "100%", marginBottom: 20 }}
                    data={sortList}
                    value={sortList[0].value}
                    onChangeText={(value) => {
                      console.log("value", value);
                      for (var i = 0; i < sortList.length; i++) {
                        if (value == sortList[i].value) {
                          this.setState(
                            {
                              OrderBy: sortList[i].value,
                              isLoading: true,
                            },
                            () => {
                              console.log("OrderBy", this.state.OrderBy);
                              this.getapqpOpenListdata();
                            }
                          );
                        }
                      }
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 20,
                }}
              >
                {this.state.activeFilter == 2 ? (
                  <View>
                    {this.state.StartDate != "" && this.state.EndDate != "" ? (
                      <View style={{ flexDirection: "row", padding: 5 }}>
                        <Text>Start date :- {this.state.StartDate}</Text>
                        <Text style={{ paddingLeft: 5 }}>
                          End date :- {this.state.EndDate}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              {
                                StartDate: "",
                                EndDate: "",
                                isLoading: true,
                              },
                              () => {
                                this.getapqpOpenListdata();
                              }
                            )
                          }
                        >
                          <Icon
                            style={{ paddingLeft: 10 }}
                            name={"times-circle"}
                            size={18}
                            color="grey"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>
            )}
          </View>
          {/*  */}
          <View style={[styles.flatList]}>
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
                  renderSectionHeader={({ section: { title } }) => (
                    <Text
                      style={{ padding: 12, fontSize: 18, fontWeight: "bold" }}
                    >
                      {title}
                    </Text>
                  )}
                  renderItem={({ item, index, section }) => (
                    <TouchableOpacity
                      style={[
                        styles.flatListWholeView,
                        { borderLeftColor: item.ColorCode },
                      ]}
                    >
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Action :</Text>
                        <Text
                          style={styles.actionTypeTextStylecb}
                          numberOfLines={1}
                        >
                          {item.Actions}
                        </Text>
                        {item.Modules == "APQP" ? (
                          <Image
                            source={Images.apqpModuleIcon}
                            style={styles.apqpTypeIcon}
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
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Action Type :</Text>
                        <Text
                          style={styles.actionTypeTextStyle}
                          numberOfLines={1}
                        >
                          {item.ActionType}
                        </Text>
                      </View>
                      <View style={styles.flatListInsideView}>
                        <Text style={styles.listText}>Site :</Text>
                        <Text
                          style={styles.actionTypeTextStyle}
                          numberOfLines={1}
                        >
                          {item.site}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.flatListInsideView}>
                          <Text style={styles.listText}>Period :</Text>
                          <Text
                            style={[styles.dateTextStyle, { color: "#4C8048" }]}
                            numberOfLines={1}
                          >
                            {this.changeDateFormatCard(item.StartDate)} -{" "}
                            {this.changeDateFormatCard(item.DueDate)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.flatListInsideView,
                            { flexDirection: "column", bottom: 25 },
                          ]}
                        >
                          <Text
                            style={
                              item.DueByDays > 0
                                ? [
                                    styles.actionTypeTextStyle,
                                    { fontSize: 22, color: "green" },
                                  ]
                                : [
                                    styles.actionTypeTextStyle,
                                    { fontSize: 22, color: "red" },
                                  ]
                            }
                            numberOfLines={1}
                          >
                            {item.DueByDays}
                          </Text>
                          <Text style={styles.listText}>Due by Days</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.recordStyle}>No records found!</Text>
                </View>
              )
            ) : (
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Bubbles size={10} color="#8CE7DC" />
              </View>
            )}
          </View>
        </View>
        <Modal
          isVisible={this.state.isDateVisible}
          onBackdropPress={() => this.setState({ isDateVisible: false })}
        >
          <View style={styles.calendarDiv2}>
            <View style={styles.header}>
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>
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
              <Text style={{ fontSize: 20, color: "#61BAD0" }}>Close</Text>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenScreen);
