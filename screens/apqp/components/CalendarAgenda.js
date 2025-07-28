import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
//styles
import { Fonts } from "../themes";
//library
import * as _ from "lodash";
// import NetInfo from "@react-native-community/netinfo";
import { DoubleBounce } from "react-native-loader";
import { Agenda } from "react-native-calendars";
import Toast, { DURATION } from "react-native-easy-toast";
// import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import Moment from "moment";
//services
// import auth from "../Services/Auth";
//strings
import { strings } from "../language/Language";
// import constant from "../Constant/AppConstants";

// import Reactotron from "reactotron-react-native";

const {
  whitneyBook_10,
  whitneyBook_12,
  whitneyBook_14,
  whitneyBook_18,
  whitneyBook_20,
  whitneyBook_17,
} = Fonts.style;
const {
  viley,
  thickGrey,
  slideGrey,
  mildGrey,
  indicGrey,
  blackGrey,
  headBlue,
} = Fonts.colors;

const shortWeekText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class CalendarAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loader: true,
      // error: false,
      agendaData: this.props.agendaData,
      selectedFormat:
        this.props.dateFormat === null ? "DD-MM-YYYY" : this.props.dateFormat,
      startDate: undefined,
      endDate: undefined,
    };
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

  componentDidMount() {
    console.log("<<><>", this.state.agendaData);
  }

  /**
   * @param {*} actions will be Array of object
   * we need to transform as object to render in calendar agenda
   * [ { StartDate: '2020-01-18T08:00:00' }]
   */
  transformActionsForAgenda(actions) {
    let agendaObj = {};
    _.forEach(actions, function (action_res) {
      if (action_res.StartDate) {
        const dateT = new Date(action_res.StartDate);
        /** Adding prefix zero if not calendar will not shown any data */
        let month =
          dateT.getMonth() + 1 < 10
            ? "0" + (dateT.getMonth() + 1)
            : dateT.getMonth() + 1;
        let datestr =
          dateT.getDate() < 10 ? "0" + dateT.getDate() : dateT.getDate();
        let key = dateT.getFullYear() + "-" + month + "-" + datestr;
        /** Mapping the actions based on the start date */
        if (agendaObj[key]) {
          agendaObj[key] = [{ ...agendaObj[key] }, { ...action_res }];
        } else {
          agendaObj[key] = [{ ...action_res }];
        }
      }
    });
    /**
     * Finally we have a structure like
     * { 2020-02-10: [{},{}], 2020-01-28: [{}] }
     */
    this.setState({ agendaData: agendaObj, loader: false, error: false });
  }
  // startDate:undefined,
  // endDate:undefined
  selectedDays(days) {
    console.log("---Onday pressed->", days);
  }

  render() {
    if (this.state.loader) {
      return (
        <View style={styles.wrapper}>
          <View style={styles.loaderParent}>
            <DoubleBounce size={20} color="#1CAFF6" />
          </View>
        </View>
      );
    } else if (this.state.error) {
      return (
        <View style={styles.errorWrapper}>
          <Text
            style={{
              fontSize: Fonts.size.h5,
              fontFamily: "OpenSans-Regular",
            }}
          >
            {strings.noactivity}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, height: "90%" }}>
          <Agenda
            // The list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key has to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={this.state.agendaData}
            // items={{
            //   "2020-11-22": [{ name: "item 1 - any js object" }],
            //   "2020-11-23": [{ name: "item 2 - any js object", height: 80 }],
            //   "2020-11-24": [],
            //   "2020-11-25": [
            //     { name: "item 3 - any js object" },
            //     { name: "any js object" },
            //   ],
            // }}
            // Callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => {
              console.log("trigger items loading");
            }}
            // Callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => {
              console.log("calendarOpened", calendarOpened);
            }}
            // Callback that gets called on day press
            onDayPress={(day) => {
              this.selectedDays(day);
            }}
            // Callback that gets called when day changes while scrolling agenda list
            // onDayChange={(day)=>{console.log('day changed')}}
            // Initially selected day
            // selected={'2012-05-16'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={'2012-05-30'}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // Specify how each item should be rendered in agenda
            renderItem={(item, firstItemInDay) => {
              return (
                <AgendaItem
                  item={item}
                  itemTouchCallBack={(itemT) => {
                    this.openProjectPage(itemT);
                  }}
                  changeDateFormatCard={(str) => this.changeDateFormatCard(str)}
                />
              );
            }}
            // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
            // renderDay={(day, item) => {return (<View />);}}
            // Specify how empty date content with no items should be rendered
            // renderEmptyDate={() => {return (<View style={{width:'96%',height:1,backgroundColor:'lightgrey',marginTop:30}}/>);}}
            // Specify how agenda knob should look like
            // renderKnob={() => {return (<View />);}}
            // Specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => {
              return <NoAgendaItem />;
            }}
            // Specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
            // Hide knob button. Default = false
            // hideKnob={true}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            // markedDates={{
            //     '2012-05-16': {selected: true, marked: true},
            //     '2012-05-17': {marked: true},
            //     '2012-05-18': {disabled: true}
            // }}
            // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
            disabledByDefault={false}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
            onRefresh={() => console.log("refreshing...")}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
            refreshControl={null}
            // Agenda theme
            theme={{
              ...calendarTheme,
              agendaDayTextColor: "#313131",
              agendaKnobColor: "lightgrey",
            }}
            // Agenda container style
            style={{ backgroundColor: "#F5F4F6" }}
          ></Agenda>
          <Toast
            ref="toast"
            style={{ backgroundColor: "black", margin: 20 }}
            position="bottom"
            positionValue={300}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: "white" }}
          />
        </View>
      );
    }
  }

  openProjectPage(item) {
    // Reactotron.log("onclickpressesonclickpresses2", item.ProjectId);
    console.log("onclickpressesonclickpresses2", item.ProjectId);
    this.props.navigation.navigate("PeriodicUpdateScreen", {
      itemData: item,
      ProjectId: item.ProjectId,
      TaskID: item.TaskId,
      RouteParam: "Project",
    });
  }
}

const calendarTheme = {
  backgroundColor: "#F5F4F6",
  calendarBackground: "#F5F4F6",
  textSectionTitleColor: "#313131",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#313131",
  textDisabledColor: "#d9e1e8",
  monthTextColor: "#00BAC8",
  indicatorColor: "blue",
  textDayFontWeight: "300",
  // textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: "300",
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
  textDayFontFamily: "OpenSans-Regular",
  textMonthFontFamily: "OpenSans-Bold",
  textDayHeaderFontFamily: "OpenSans-Regular",
};

const AgendaItem = (props) => {
  console.log("agendaitem", props.item);
  return (
    <View style={styles.agendaWrapper}>
      {/* <View style={styles.agendaDater}>
                <Text style={[whitneyBook_18, indicGrey]}>{props.item.dateText}</Text>
                <Text style={[whitneyBook_20, indicGrey]}>{props.item.weekText}</Text>
            </View> */}
      <TouchableOpacity
        style={styles.agendaBody}
        onPress={() => props.itemTouchCallBack(props.item)}
      >
        <View style={styles.agendaBodyContent}>
          <Text
            style={[
              styles.agendaBodyLeftIndicator,
              props.item.ColorCode
                ? { backgroundColor: props.item.ColorCode }
                : { backgroundColor: "#faed27" },
            ]}
          />
          <View style={styles.flexer}>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_17,
                viley,
                { fontFamily: "OpenSans-Regular" },
              ]}
            >
              {props.item.TaskDesc}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_12,
                slideGrey,
                { fontFamily: "OpenSans-Regular" },
                styles.marginT2,
              ]}
            >
              {props.changeDateFormatCard(props.item.StartDate) +
                " - " +
                props.changeDateFormatCard(props.item.FinishDate)}
            </Text>
            {/* <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                thickGrey,
                { fontFamily: "OpenSans-Regular" },
                styles.marginT4,
              ]}
            >
              {props.item.TaskDesc}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                { fontFamily: "OpenSans-Regular" },
                thickGrey,
              ]}
            >
              {props.item.TaskDesc}
            </Text> */}
            {/* <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                thickGrey,
                { fontFamily: "OpenSans-Regular" },
              ]}
            >
              {props.item.TaskDesc}
            </Text> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NoAgendaItem = (props) => {
  return (
    <View style={styles.agendaWrapper}>
      <View style={styles.norecord_agendaBody}>
        <View style={styles.agendaBodyContent}>
          <Text style={styles.agendaBodyLeftIndicator} />
          <Text
            style={[
              whitneyBook_18,
              //blackGrey,
              { fontFamily: "OpenSans-Regular" },
            ]}
          >
            {strings.noactivity}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexer: { flex: 1, paddingRight: 4 },
  flex_one: {
    flex: 1,
    paddingRight: 2,
    backgroundColor: "grey",
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  loaderParent: {
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  agendaWrapper: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  agendaDater: {
    alignItems: "center",
    justifyContent: "center",
  },
  agendaBody: {
    flex: 1,
    // marginLeft: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 4,
  },
  norecord_agendaBody: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 4,
  },
  agendaBodyContent: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
  },
  agendaBodyLeftIndicator: {
    height: "100%",
    width: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  agendaDateText: {
    fontSize: Fonts.size.h5,
    color: "grey",
  },
  agendaWeekText: {
    fontSize: Fonts.size.h4,
    color: "grey",
  },
  marginT2: {
    marginTop: 2,
  },
  marginT4: {
    marginTop: 4,
  },
});

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

// export default connect(mapStateToProps)(withNavigation(CalendarAgenda));

export default connect(mapStateToProps)(CalendarAgenda);
