import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
//styles
import styles from "../containers/styles/DashboardStyles";
//Lib
// import NetInfo from "@react-native-community/netinfo";
// import ProgressCircle from "react-native-progress-circle";
// import { withNavigation } from "react-navigation";
import Toast, { DURATION } from "react-native-easy-toast";
import { connect } from "react-redux";
import Moment from "moment";
//assets
import Images from "../themes/Images";
import Fonts from "../themes/Fonts";
import { ROUTES } from "constants/app-constant";
// import constant from "../../../constants/Apqp/AppConstants";
// import { strings } from "../language/Language";

const { whitneyBook_14, whitneyBook_12, whitneyBook_17 } = Fonts.style;
const { viley, thickGrey, slideGrey, headBlue } = Fonts.colors;

class Card extends Component {
  constructor(props) {
    super(props);
    console.log('props get--->', props)
    this.state = {
      selectedFormat:
        this.props.dateFormat === null ? "DD-MM-YYYY" : this.props.dateFormat,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selectedFormat !== nextProps.dateFormat) {
      this.setState({
        dateFormat: nextProps.dateFormat,
        selectedFormat:
          nextProps.dateFormat === null ? "DD-MM-YYYY" : nextProps.dateFormat,
      });
    }
  }
  // {this.changeDateFormatCard(item.TStartDate)} -{" "}
  //               {this.changeDateFormatCard(item.TFinishDate)}

  renderConditionDate = (item) => {
    item.Modules == "Projects"
      ? this.changeDateFormatCard(item.TStartDate)
      : item.Modules == "Meeting"
      ? this.changeDateFormatCard(item.ActionCreatedDate)
      : this.changeDateFormatCard(item.StartDate);

    item.Modules == "Projects"
      ? this.changeDateFormatCard(item.TFinishDate)
      : item.Modules == "Meeting"
      ? this.changeDateFormatCard(item.TFinishDate)
      : this.changeDateFormatCard(item.DueDate);
  };

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

  openActionPage(ActionItem, currentProps) {
    console.log("HI ActionPage is new", ActionItem);
    console.log("this.props", this.props, currentProps);

    ActionItem.Modules === "Meeting"
      ? currentProps.navigation.navigate(ROUTES.MEETING_PLAN_SCREEN, {
          MeetingDetails: ActionItem,
          recentActivity: this.props.data.projects.recentActivity,
          //activeTab: this.state.activeTab,
        })
      : ActionItem.Modules === "Risk"
      ? currentProps.navigation.navigate(ROUTES.RISK_ACTION_SCREEN, {
          item: ActionItem,
          //activeTab: this.state.activeTab,
        })
      : ActionItem.Modules === "Projects"
      ? currentProps.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
          itemData: ActionItem,
          // ProjectId: ActionItem.ProjectID,
          ProjectId: ActionItem.Project_id,
          TaskID: ActionItem.TaskID,
          RouteParam: "Task",
        })
      : currentProps.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
          itemData: ActionItem,
          RouteParam: "Action",
          ProjectId: ActionItem.ProjectID,
          // TaskID:ActionItem.TaskID
        });
    console.log(
      "onPress pressed_Project_RecentActions------ActionItem.TaskID---->",
      ActionItem.TaskID
    );
  }

  render() { 
    const { item, index, length, currentProps } = this.props;
    console.log("this.props render", currentProps); 
    console.log(
      "------------Recent_item----------->" + item.ProjectDescription
    );  
    return (
      <View>
        <TouchableOpacity key={index} onPress={() => this.openActionPage(item, currentProps)}>
          <View
            style={[
              styles.cardOuterView,
              length - 1 === index ? [] : styles.borderEnabled,
            ]}
          >
            <View style={styles.projectBoxContent}>
              <View>
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
                {item.Modules == "Projects" ? (
                  <Image
                    source={Images.apqpModuleIcon}
                    style={styles.apqpRecentIcon}
                  />
                ) : null}
              </View>
              <Text
                numberOfLines={1}
                style={{
                  paddingLeft: 30,
                  padding: 3,
                  fontSize: Fonts.size.regular,
                  color: "#485B9E",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {/* {item.Modules == "Meeting" ? "Meeting" : item.Description}
                {item.Modules == "Projects" ? item.Task_Desc:null} */}

                {item.Modules == "Meeting"
                  ? "Meeting"
                  : item.Modules == "Projects"
                  ? item.Task_Desc
                  : item.Description}
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
                {item.Modules == "Projects"
                  ? this.changeDateFormatCard(item.TStartDate)
                  : item.Modules == "Meeting"
                  ? this.changeDateFormatCard(item.ActionCreatedDate)
                  : this.changeDateFormatCard(item.StartDate)}
                -{" "}
                {item.Modules == "Projects"
                  ? this.changeDateFormatCard(item.TFinishDate)
                  : this.changeDateFormatCard(item.DueDate)}
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
                {item.Modules == "Projects"
                  ? item.ProjectDescription
                  : item.Actions}
                {/* {item.Actions} */}
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
        <Toast
          ref="toast"
          style={{ backgroundColor: "black", margin: 20 }}
          position="top"
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }
}

// const Root = withNavigation(Card);

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

// export default connect(mapStateToProps)(Root);
export default connect(mapStateToProps)(Card);

