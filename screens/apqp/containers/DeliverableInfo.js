import React, { Component } from "react";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from "../../../services/APQP-Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { DURATION } from "react-native-easy-toast";
// import Reactotron from "reactotron-react-native";
import RenderHtml from "react-native-render-html";
import RNFetchBlob from "react-native-fetch-blob";
import DocumentPicker from "react-native-document-picker";
import styles from "./styles/DeliverableInfoStyles";
import { ICON_TYPE, ROUTES } from "constants/app-constant";
import { strings } from "../language/Language";
import GlobalHeader from "components/GlobalHeader";
import { FAB } from "components";
// import { OpenDocument } from "./OpenDocumentScreen";
export class DeliverableInfoScreen extends Component {
  TaskId = "";
  UserId = "";
  ProjectId = "";
  Token = "";
  SiteId = "";
  DeliverableName = "";
  ResourcePercent = "";

  constructor() {
    super();
    this.state = {
      apqpDeliverableInfoList: [],
    };
  }

  componentDidMount() {
    console.log("Params received..", this.props?.route?.params);
    console.log(
      "getting params",
      this.props?.route?.params?.itemData
    );
    this.ProjectId = this.props?.route?.params?.ProjectId;
    this.TaskId = this.props?.route?.params?.TaskId;
    this.DeliverableName = this.props?.route?.params?.DeliverableName;
    this.ResourcePercent = this.props?.route?.params?.ResourcePercent;

    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.getapqpDeliverableInfoList();
      })
      .catch((e) => {
        console.log("Async error", e);
      });
  }

  componentWillReceiveProps() {
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    var CurrentPage = this.props?.route?.name;
    console.log("--CurrentPage--->", CurrentPage);

    if (CurrentPage == ROUTES.DELIVERABLE_INFO_SCREEN) {
      console.log("calling asynchronous call action");
      this.getapqpDeliverableInfoList();
    } else {
      console.log("DeliverableInfoScreen pass");
    }
  }

  onPressRevision() {
    this.props.navigation.navigate(ROUTES.REVISION_HISTORY_SCREEN);
  }

  onPressAttach(type, item) {
    if (type == "OPD" && item.OPDocName != "" && item.OPDocId == 0) {
      this.refs.toast.show(
        "Sorry! This output document is currently waiting for the approval.",
        DURATION.LENGTH_SHORT
      );
    } else {
      if (this.ResourcePercent == 100) {
        this.refs.toast.show(
          "Cant able to attach document after completing the task",
          DURATION.LENGTH_SHORT
        );
      } else {
        this.props.navigation.navigate(ROUTES.ATTACH_ADDITIONAL_DOC_SCREEN, {
          type: type,
          item: item,
          projectId: this.ProjectId,
          taskId: this.TaskId,
        });
      }
    }
  }

//   getData = async () => {
//     try {
//       var UserId = await AsyncStorage.getItem("UserId");
//       var Token = await AsyncStorage.getItem("Token");
//       var Siteid = await AsyncStorage.getItem("SiteId");
//       console.log("Siteid aync", Siteid);
//       console.log("UserId asyc", UserId.toString());
//       console.log("Token asyns", Token.toString());

//       var userdata = {
//         UserId: UserId,
//         SiteId: Siteid,
//         Token: Token,
//       };
//       return userdata;
//     } catch (e) {
//       console.log("No user session");
//     }
//   };

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

  getapqpDeliverableInfoList() {
    console.log("calling apqp2 api");

    const Token = this.Token;
    const ProjectId = this.ProjectId;
    const TaskId = this.TaskId;
    const ResourceId = this.UserId;
    const AccessType = 2;

    console.log(
      "get response from apqp2 ",
      ProjectId,
      TaskId,
      ResourceId,
      AccessType
    );

    auth.getapqpDeliverableInfoList(
      ProjectId,
      TaskId,
      ResourceId,
      AccessType,
      Token,
      (res, data) => {
        console.log("getting responses", data);
        console.log("getting responses .data.Messagee", data.data.Message);
        if (data.data.Message == "Success") {
          console.log("apqpHistoryList", this.state.apqpHistoryList);
          this.setState(
            {
              apqpDeliverableInfoList: data.data.Data,
              loader: false,
            },
            () => {
              console.log("apqpHistoryList", this.state.apqpHistoryList);
            }
          );
        }
      }
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View
          style={Platform.OS === "ios" ? styles.topSpacerIos : styles.topSpacerAndroid}
        />
        <View style={styles.apqpTextView}>
          <GlobalHeader
            title={'Deliverable Info'}
            onLeftPress={() => this.props.navigation.goBack()}
            hideRight={true}
            showBackButton={false}
           />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.listViewTop}>
                <Text style={styles.listText}>Deliverable Name :</Text>
                <Text style={styles.listNextText}>{this.DeliverableName}</Text>
              </View>
              <View style={styles.listViewTop}>
                <Text style={styles.listText}>Completed % :</Text>
                <Text style={styles.listNextText}>{this.ResourcePercent}</Text>
              </View>
            
           
              <View style={styles.attachmentsTitleContainer}>
                <Text style={styles.attachmentsTitleText}>
                  Attachments
                </Text>
              </View>

               </View>
          </View>
            
          {this.state.apqpDeliverableInfoList &&
            this.state.apqpDeliverableInfoList.length > 0 ? (
            <FlatList
              style={styles.deliverablesList}
              data={this.state.apqpDeliverableInfoList}

              renderItem={({ item }) => {
                console.log("=====>Doc_Fetch==========>" + item.toString);
                const comments = { html: item.OPComments };
                return (
                  <View style={styles.flatListFullSideView}>
                    <TouchableOpacity
                      onPress={this.onPressAttach.bind(this, "OPD", item)}
                      // onPress={this.onPressBack.bind(this)}
                    >
                      <View style={styles.listView}>
                        <Text style={styles.listText1}>Doc Status : </Text>
                        <Text style={styles.deliveryTypeTextHeaderStyle}>
                          {item.OPStatus}
                        </Text>
                      </View>
                      <View style={styles.listView}>
                        <Text style={styles.listText1}>Input Doc : </Text>
                        <Text style={styles.deliveryTypeTextStyle}>
                          {item.IPDocName ? item.IPDocName : "NA"}
                        </Text>
                      </View>
                      <View style={styles.listView}>
                        <Text style={styles.listText1}>Output Doc : </Text>
                        {item.OPDocName == "" ? (
                          <View style={styles.outputDocAttachRow}>
                            <Icon name="paperclip" size={20} color="grey" />

                            <Text style={styles.outputDocAttachText}>
                              Attach Output Doc
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.outputDocNameRow}>
                            <Text style={styles.outputDocNameText}>
                              {item.OPDocName}
                            </Text>
                            <Icon name="edit" size={20} color="#1FBFD0" />
                          </View>
                        )}
                      </View>
                      <View style={styles.listView}>
                        <Text style={styles.listText1}>Comments:</Text>
                        <Text style={styles.commentsTextStyle}>
                          {item.OPComments == "" && " - "}
                        </Text>
                      </View>
                      {item.OPComments != "" && (
                        <View style={styles.commentsHtmlContainer}>
                          <RenderHtml baseStyle={styles.renderHtmlBaseStyle} source={comments} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }} />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No records found!</Text>
            </View>
          )}
        </View>

        <View style={styles.footerDiv}>
          <>
            <FAB iconName="paperclip" iconType={ICON_TYPE.Feather}  onPress={this.onPressAttach.bind(this, "ADL", null)} />
          </>
        </View>

        <Toast
          ref="toast"
          style={styles.toastStyle}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toastText} />
      </View>
    );
  }

  onPressBack() {
    this.props.navigation.navigate(ROUTES.OPEN_DOCUMENT_SCREEN);
  }
  handleDocumentSelection = async () => {
    try {
      console.log("Document_Reading---->CLICKED====>");
      const response = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
      });
      if (response) {
        RNFetchBlob.fs.readFile(response.uri, "base64").then(
          (data) => {
            response.data = data;
            console.log("xdx", response.name, response.uri);
            console.log("Document_Reading---->Response.name====>" + response.name + "=====response.uri======>" + response.uri);
            return response.readFile("base64");
          },
          // () =>
          this.setState({
            attachedDocName: response.name,
            attachedDoc: response.uri,
            attachfilebyte: response,
          })
        );
        var data = await RNFS.readFile(response.uri, "base64").then((res) => {
          this.setState({ attachedfilebyteArray: res });
        });
        // this.setState({
        //     attachedfilebyteArray:data
        // })
      }
    } catch (err) {
      console.log("Document_Reading---->======Error=====>" + err);
    }

    // DocumentPicker.pick({
    //   allowMultiSelection: true,
    // //   type: [types.doc, types.docx],
    // })
    //   .then()
    //   .catch(handleError)
  };
}
