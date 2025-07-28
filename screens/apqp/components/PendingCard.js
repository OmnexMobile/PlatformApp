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

// import Reactotron from "reactotron-react-native";

const { whitneyBook_14, whitneyBook_12, whitneyBook_17 } = Fonts.style;
const { viley, thickGrey, slideGrey, headBlue } = Fonts.colors;

class TodayCard extends Component {
  constructor(props) {
    super(props);
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

  openProjectPage(ActionItem, currentProps) {
    // ActionItem.Actions =
    //   ActionItem.TaskDesc && ActionItem.TaskDesc.indexOf(":-") >= 0
    //     ? ActionItem.TaskDesc.split(":-")[0]
    //     : "";
    // (ActionItem.Description =
    //   ActionItem.TaskDesc && ActionItem.TaskDesc.indexOf(":-") >= 0
    //     ? ActionItem.TaskDesc.split(":-")[1]
    //     : ""),
    ActionItem.Description = ActionItem.Description;
    ActionItem.Actions = ActionItem.Actions;
    console.log("PendingCardValue=======>", ActionItem, currentProps);

    currentProps.navigation.navigate(ROUTES.PERIODIC_UPDATE_SCREEN, {
      itemData: ActionItem,
      ProjectId: ActionItem.ProjectID,
      TaskID: ActionItem.ActionId,
      RouteParam: "Project",
    });
  }
  

  render() {
    const { item, index, length, currentProps } = this.props;
    // Reactotron.log(item, "getting item as props");
    console.log("PendingCardValue=======1======>", item);
    iconStatus: "risk"
    return (
      <View>
        <TouchableOpacity onPress={() => this.openProjectPage(item, currentProps)}>
          <View
            style={[
              styles.cardOuterView,
              length - 1 === index ? [] : styles.borderEnabled,
            ]}
          >
            <View style={styles.projectBoxContent}>
              <View>
                <Image
                  source={Images.apqpModuleIcon}
                  style={styles.apqpTypeIcon}
                />
              </View>

  {/* Once API ready,Command the above View tag and uncommand the below */}

              {/* <View>
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
              </View> */}



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
                {item.Actions}
              </Text>

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

// const Root = withNavigation(TodayCard);

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

// export default connect(mapStateToProps)(Root);
export default connect(mapStateToProps)(TodayCard);

