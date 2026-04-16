import React, { Component } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
//styles
import styles from "./styles/CalandarListStyle";
//components
import OfflineNotice from "../components/OfflineNotice";
//library
import * as _ from "lodash";
import { DoubleBounce } from "react-native-loader";
import { Calendar } from "react-native-calendars";
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
//assets
import { Images, Fonts } from "../themes";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
//services
import auth from "../../../services/APQP-Auth";
//strings
import { strings } from "../language/Language";
import Moment from "moment";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
// import { height } from "react-native-dimension";

// const nodeColors = ["rgb(168,224,166)", "rgb(255,206,101)", "rgb(252,151,96)", "#138D75",
//     "#E59866", "#5D6D7E", "#9B59B6", "#E74C3C", "#48C9B0", "#FA8072", "#FF00FF", "#000080"]

const nodeOBJColors = {
  2: "#F1EB0E",
  3: "green",
  4: "red",
  5: "#AB8C32",
};

const { whitneyBook_18 } = Fonts.style;
const { blackGrey } = Fonts.colors;

class CalandarList extends Component {
  constructor(props) {
    super(props);
    console.log('get current props--->', props)
    this.multiperiods = {};
    this.state = {
      loader: true,
      error: false,
      apiData: [],
      dateWiseSplit: [],
      calendarPeriods: {},
      startDate: "",
      endDate: "",
      start: "",
      end: "",
      month_change: "",
      hasUpdated: false,
    };
  }

  componentDidMount() {
    console.log("<componentDidMount<><><><><>", this.state.loader);
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
        this.setState({});
      });
    }
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

  getAllProjectlist(res) {
    console.log("<getAllProjectlist<><><><><>", this.props.data.projects);
    const { SiteId, UserId, Token } = res;
    NetInfo.fetch().then((netStatus) => {
      if (netStatus.isConnected) {
        console.log(
          "@@@@@ calendarList calendarapi", SiteId
        );
        auth.calendarapi(UserId, SiteId, Token, 0, (response, data) => {
          if (data.data) {
            if (data.data.Message === "Success") {
              if (data.data.Data && data.data.Data.length > 0) {
                this.transformYearProjects(data.data.Data);
              } else {
                this.setState({ loader: false, error: false });
              }
            } else {
              this.setState({ loader: false, error: false });
            }
          } else {
            this.setState({ loader: false, error: false });
          }
        });
      }
    });
  }

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

  // componentWillReceiveProps() {
  componentDidUpdate() {
    console.log(
      "<componentWillReceiveProps<><><><><>", this.state.hasUpdated,
      this.props?.data?.projects?.loginuser
      // prevProps
    );

    // if ("CALANDAR_LIST_APQP" == prevProps?.route?.name) {
    if (!this.state.hasUpdated) {
      this.getData()
        .then((res) => {
          console.log("async", res);
          this.UserId = res.UserId;
          this.Token = res.Token;
          this.SiteId = res.SiteId;
          this.getAllProjectlist(res);
          this.setState({ hasUpdated: true });
        })
        .catch((e) => {
          console.log("Async aerror", e);
        });
    }
  }

  // /**
  //  * @param {*} yearprojects will be array of object yearprojects from API
  //  * [ {AuditID: "21", AuditNumber: "2018-MC-I9-2-2", StartDate: "2018-04-30T08:00:00", EndDate: "2018-05-01T17:00:00"} ]
  //  */


  transformYearProjects(yearprojects) {
    //console.log("$$$$$$$$", yearprojects);
    let index = 0;
    let self = this;
    let dateWiseSplit = [];
    let dateWiseSplitKeys = {};
    _.forEach(yearprojects, function (yearProject_res) {
      if (yearProject_res.StartDate && yearProject_res.FinishDate) {
        let dateS = new Date(yearProject_res.StartDate);
        let _s_month =
          dateS.getMonth() + 1 < 10
            ? "0" + (dateS.getMonth() + 1)
            : dateS.getMonth() + 1;
        let _s_datestr =
          dateS.getDate() < 10 ? "0" + dateS.getDate() : dateS.getDate();
        let start_key = dateS.getFullYear() + "-" + _s_month + "-" + _s_datestr;
        let dateE = new Date(yearProject_res.FinishDate);
        let _e_month =
          dateE.getMonth() + 1 < 10
            ? "0" + (dateE.getMonth() + 1)
            : dateE.getMonth() + 1;
        let _e_datestr =
          dateE.getDate() < 10 ? "0" + dateE.getDate() : dateE.getDate();
        let end_key = dateS.getFullYear() + "-" + _e_month + "-" + _e_datestr;

        /** caluclating between dates */
        let betweenDates = 1;
        if (parseInt(_s_datestr) < parseInt(_e_datestr)) {
          betweenDates = parseInt(_e_datestr) - parseInt(_s_datestr);
        } else {
          betweenDates = parseInt(_s_datestr) - parseInt(_e_datestr);
        }

        dateWiseSplitKeys[start_key] = {};
        dateWiseSplitKeys[end_key] = {};

        //nodeOBJColors[parseInt(yearProject_res.status)],

        /** retreiving insertion index of the particular audit */
        let indexIamInserting = self.multiPeriodMark(
          start_key,
          end_key,
          nodeOBJColors[4],
          "start",
          undefined
        );
        /** between dates wil lies in 1 example startDate: 2020-02-10, endDate: 2020-02-11 */
        if (betweenDates !== 1 && betweenDates !== 0) {
          let i = 1;
          /** loopin gour between dates */
          while (i < betweenDates) {
            const nextDate = new Date(dateS);
            nextDate.setDate(nextDate.getDate() + i);

            let _mid_month =
              nextDate.getMonth() + 1 < 10
                ? "0" + (nextDate.getMonth() + 1)
                : nextDate.getMonth() + 1;
            let _mid_datestr =
              nextDate.getDate() < 10
                ? "0" + nextDate.getDate()
                : nextDate.getDate();
            let mid_key =
              nextDate.getFullYear() + "-" + _mid_month + "-" + _mid_datestr;

            if (
              nextDate.getDate() === dateE.getDate() &&
              nextDate.getMonth() === dateE.getMonth() &&
              nextDate.getFullYear() === dateE.getFullYear()
            ) {
              i = betweenDates;
            } else {
              dateWiseSplitKeys[mid_key] = {};
              /** creating between dates keys and insert in calendar period */
              let ind = self.multiPeriodMark(
                mid_key,
                undefined,
                nodeOBJColors[4],
                "middle",
                indexIamInserting
              );
              i++;
            }
          }
        }
      }
      // if (nodeColors[(index + 1)]) {
      //     index = index + 1
      // } else {
      //     index = 0
      // }

      dateWiseSplitKeys = {};
      dateWiseSplit.push(dateWiseSplitKeys);
    });

    this.setState({
      dateWiseSplit,
      apiData: yearprojects,
      calendarPeriods: this.multiperiods,
      loader: false,
      error: false,
    });
  }

  /**
   *
   * @param {*} start_key - starting date
   * @param {*} end_key   - ending date
   * @param {*} color     - color for the audit line
   * @param {*} middle    - "middle" || "start"
   * @param {*} index     - (int) || undefined
   */
  multiPeriodMark(start_key, end_key, color, middle, index) {
    let indexIamInserting = 0;
    /** The Start date key is validated either already the date is avaliable or not */
    if (this.multiperiods[start_key]) {
      let start_periods = this.multiperiods[start_key].periods;
      /** if the given audit lies between many dates we need to create as transparent object */
      /** we need to insert before the our first object insertion */
      // if (middle === "middle" && index) {
      //     if (start_periods.length < index) {
      //         let i = start_periods.length;
      //         while (i < index) {
      //             start_periods.push({ color: 'transparent' })
      //             i++;
      //         }
      //     }
      // }
      /** inserting the object pair in to localized object */
      this.multiperiods[start_key] = {
        periods: [
          ...start_periods,
          {
            startingDay: middle === "middle" ? false : true,
            endingDay: start_key === end_key ? true : false,
            color,
          },
        ],
      };
      indexIamInserting = start_periods.length;
    } else {
      /** if the given audit lies between many dates we need to create as transparent object */
      /** we need to insert before the our first object insertion */
      // let dummyTrans = []
      // if (middle === "middle" && index) {
      //     let i = 0;
      //     while (i < index) {
      //         dummyTrans.push({ color: 'transparent' })
      //         i++;
      //     }
      // }
      /** inserting the object pair in to localized object */
      this.multiperiods[start_key] = {
        periods: [
          // ...dummyTrans,
          {
            startingDay: middle === "middle" ? false : true,
            endingDay: start_key === end_key ? true : false,
            color,
          },
        ],
      };
      /** if the date key ia not already in the object pair insertion index will kept as zero */
    }
    /** For creating the between dates end day will be sent as undefined */
    if (end_key && start_key !== end_key) {
      /** The End date key is validated either already the date is avaliable or not */
      if (this.multiperiods[end_key]) {
        let end_periods = this.multiperiods[end_key].periods;

        // if (middle !== "middle" && end_periods.length < indexIamInserting) {
        //     let i = end_periods.length;
        //     while (i < indexIamInserting) {
        //         end_periods.push({ color: 'transparent' })
        //         i++;
        //     }
        // }

        this.multiperiods[end_key] = {
          periods: [
            ...end_periods,
            {
              startingDay: false,
              endingDay: middle === "middle" ? false : true,
              color,
            },
          ],
        };
      } else {
        /** if the given audit lies between many dates we need to create as transparent object */
        /** we need to insert before the our first object insertion */
        // let dummyTrans = []
        // if (middle !== "middle") {
        //     let i = 0;
        //     while (i < indexIamInserting) {
        //         dummyTrans.push({ color: 'transparent' })
        //         i++;
        //     }
        // }
        this.multiperiods[end_key] = {
          periods: [
            // ...dummyTrans,
            {
              startingDay: false,
              endingDay: middle === "middle" ? false : true,
              color,
            },
          ],
        };
      }
    }

    return indexIamInserting;
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
            <Text style={styles.headingText}>{strings.Calendar}</Text>
          </View>
          {/* <View style={styles.headerDiv}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => this.props.navigation.navigate("DashboardScreen")}
            >
              <Icon name="home" size={35} color="white" />
            </TouchableOpacity>
          </View> */}
        </View>
      </ImageBackground>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        {/* Offline notification */}
        <OfflineNotice />
        {this.renderHeader()}
        {this.state.loader ? (
          <View style={styles.wrapper}>
            <View style={styles.loaderParent}>
              <DoubleBounce size={20} color="#1CAFF6" />
            </View>
          </View>
        ) : this.state.error ? (
          <View style={styles.errorWrapper}>
            <Text
              style={[
                whitneyBook_18,
                blackGrey,
                { fontFamily: "OpenSans-Regular" },
              ]}
            >
              {strings.No_records_found}
            </Text>
          </View>
        ) : (
          this.renderCalandar()
        )}
      </View>
    );
  }

  renderCalandar() {
    return (
      <View style={{ padding: 5 }}>
        <ScrollView style={{ height: "92%" }}>
          <Calendar
            style={styles.calendar}
            onDayPress={(day) => {
              this.OnCalenderFilter(day);
            }}
            markedDates={this.state.calendarPeriods}
            markingType="multi-period"
            hideArrows={false}
            onMonthChange={(month) => {
              console.log("month changed", month);
            }}
            theme={{
              textDayFontFamily: "OpenSans-Regular",
              textMonthFontFamily: "OpenSans-Regular",
              textDayHeaderFontFamily: "OpenSans-Regular",
            }}
          />
        </ScrollView>
      </View>
    );
  }

  OnCalenderFilter(date) {
    let _s_month = date.month < 10 ? "0" + date.month : date.month;
    let _s_datestr = date.day < 10 ? "0" + date.day : date.day;
    let myKey = _s_month + "-" + _s_datestr + "-" + date.year;
    let myKey2 = date.year + "-" + _s_month + "-" + _s_datestr;
    let start_key = date.year + "-" + _s_month + "-" + _s_datestr;
    let markedDates = {
      ...this.state.calendarPeriods,
      [start_key]: {
        periods: [
          {
            startingDay: this.state.startDate === "" ? true : false,
            endingDay: this.state.startDate === "" ? false : true,
            color: "#2DDFBF",
          },
        ],
      },
    };
    this.setState({ calendarPeriods: markedDates });
    if (this.state.startDate === "") {
      this.setState({ startDate: myKey2, start: myKey });
    } else if (this.state.endDate === "") {
      this.setState({ endDate: myKey2, end: myKey }, () => {
        if (this.state.startDate !== "" && this.state.endDate !== "") {
          var StartDateTimeStamp = Moment(this.state.startDate).unix();
          var EndDateTimeStamp = Moment(this.state.endDate).unix();
          let Filter_StartDate;
          let Filter_EndDate;

          // var StartDateTimeStamp = this.state.startDate
          // var EndDateTimeStamp = this.state.endDate

          console.log("========>start", StartDateTimeStamp);
          console.log("========>end", EndDateTimeStamp);

          if (StartDateTimeStamp > EndDateTimeStamp) {
            console.log(
              "reve correcrtStartDateTimeStamp < EndDateTimeStamp",
              StartDateTimeStamp,
              EndDateTimeStamp
            );
            Filter_StartDate = this.state.end;
            Filter_EndDate = this.state.start;
          } else {
            console.log(
              "correcrtStartDateTimeStamp < EndDateTimeStamp",
              StartDateTimeStamp,
              EndDateTimeStamp
            );
            Filter_StartDate = this.state.start;
            Filter_EndDate = this.state.end;
          }
          //ActionTabInterface

          this.props.navigation.push(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
            filter_Arr: [
              {
                filterType: "Calendar",
                sortype: "desc",
                startDate: Filter_StartDate,
                text: "",
                endDate: Filter_EndDate,
                globalSearch: null,
              },
            ],
       
            filterId: 2,
            title: strings.projects,
            todayn:1,
            allprojects:this.state.projects+this.state.risks+this.state.meetings,
          });
          this.setState({
            calendarPeriods: this.multiperiods,
            startDate: "",
            endDate: "",
            start: "",
            end: "",
          });
        }
      });
    }
  }

  /*
    checkForEndDate method is previous functionality selected Audit filter 
    */

  checkForEndDate(date) {
    let _s_month = date.month < 10 ? "0" + date.month : date.month;
    let _s_datestr = date.day < 10 ? "0" + date.day : date.day;
    let myKey = date.year + "-" + _s_month + "-" + _s_datestr;

    if (this.state.calendarPeriods[myKey]) {
      let matchedSet = {};
      _.forEach(this.state.dateWiseSplit, function (dateSplit) {
        let breakLoop = true;
        _.forEach(dateSplit, function (actDates, actKey) {
          if (actKey === myKey) {
            breakLoop = false;
            matchedSet = dateSplit;
            return false;
          }
        });
        return breakLoop;
      });

      // console.log("matchedSet",matchedSet)

      if (matchedSet) {
        let finalData = {};
        _.forEach(matchedSet, function (macthDate, matchKey) {
          let splitStr = matchKey.split("-");
          // console.log("splitStr",splitStr)
          let keyFormat = splitStr[1] + "-" + splitStr[2] + "-" + splitStr[0];
          // console.log("keyFormat",keyFormat)
          //o year 1 month 2 date
          let yearMon = parseInt(splitStr[0] + splitStr[1]);
          if (finalData[yearMon]) {
            let oldData = finalData[yearMon];
            finalData[yearMon] = {
              ...oldData,
              [parseInt(splitStr[2])]: keyFormat,
            };
          } else {
            finalData[yearMon] = {
              [parseInt(splitStr[2])]: keyFormat,
            };
          }
        });
        // console.log("finalData",finalData)
        let startDate = "";
        let yearKeys = Object.keys(finalData);

        // console.log("yearkeys", finalData)
        if (yearKeys.length > 1) {
          let startKeys = Object.keys(finalData[yearKeys[0]]);
          let endKeys = Object.keys(finalData[yearKeys[yearKeys.length - 1]]);

          startDate = finalData[yearKeys[0]][startKeys[0]];
          endDate =
            finalData[yearKeys[yearKeys.length - 1]][
              endKeys[endKeys.length - 1]
            ];

          // console.log("year diff startdtae is", startDate)
          // console.log("year diff endDate is", endDate)

          this.props.navigation.push("AllTabAuditList", {
            filter_Arr: [
              {
                filterType: "Calendar",
                sortype: "desc",
                startDate,
                text: "",
                endDate,
                globalSearch: null,
              },
            ],
          });
        } else {
          //one year
          let datekeys = Object.keys(finalData[yearKeys[0]]);
          // console.log("date keys", datekeys)
          startDate = finalData[yearKeys[0]][datekeys[0]];
          endDate = finalData[yearKeys[0]][datekeys[datekeys.length - 1]];

          // console.log("startdtae is", startDate)
          // console.log("endDate is", endDate)

          this.props.navigation.push("AllTabAuditList", {
            filter_Arr: [
              {
                filterType: "Calendar",
                sortype: "desc",
                startDate,
                text: "",
                endDate,
                globalSearch: null,
              },
            ],
          });
        }
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(CalandarList);
