import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import styles from "./styles/ApqpDashboardHeaderStyle";
// import Images from "../themes/Images";
import auth from "../../../services/APQP-Auth";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
// import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
// import ResponsiveImage from "react-native-responsive-image";
import Fonts from "../themes/Fonts";
import { strings } from "../language/Language";
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from "@react-native-community/netinfo";

// import Modal from "react-native-modal";
// import { create } from "apisauce";
// import Moment from "moment";
import { DeviceUniqueId } from "../config/Utils";
var RNFS = require("react-native-fs");
// import RNFetchBlob from "react-native-fetch-blob";
import ActionSheet from "react-native-actionsheet";
import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from "react-native-simple-dialogs";
import { LOCAL_STORAGE_VARIABLES, ROUTES } from "constants/app-constant";
// import CryptoJS from "react-native-crypto-js";
import localStorage from 'global/localStorage';
import { GLOBALSERVER_URL } from "screens/globalConstant/globalURL";

class ApqpDashboardFooter extends Component {
  propsServerUrl = "";
  isDocsAvail = false;
  checkListObjects = [];
  formObjects = [];
  // globalServerURL = 'https://saasmobile.ewqims.net/EwQIMSAPI/api/';
  globalServerURL = GLOBALSERVER_URL;
  constructor(props) {
    super(props);
    console.log('get current Props --->', props)
    this.state = {
      isSyncing: false,
      dialogVisible_logout: false,
      dialogVisible: false,
      statusPopUp: false,
      syncPopUp: false,
      errorMsg: "",
      missingFileArr: [],
      isLowConnection: false,
      isMissingFindings: false,
      errorDialogVisible: false,
      syncResults: [],
      progressVisible: false,
      deviceId: "",
      isMissingFindings: false,
      confirmpwd: false,
      pwdentry: undefined,
      isEmptyPwd: undefined,
      isDeviceRegistered: this.props.data.projects.isDeviceRegistered,
    };
  }

  componentDidMount() {
    DeviceUniqueId().then((deviceId) => {
      this.setState({
        deviceId,
      });
    });
    console.log("Project Header mounted.");
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
  }

  checkUser() {
    console.log("user id", this.props.data.projects.userId);
    var userid = this.props.data.projects.userId;
    var token = this.props.data.projects.token;
    var UserStatus = "";
    var serverUrl = this.props.data.projects.serverUrl;
    var ID = this.props.data.projects.userId;
    var type = 3;
    var path = "";
    console.log(userid, token);

    auth.getCheckUser(userid, token, (res, data) => {
      console.log("User information", data);

      if (data.data.Message == "Success") {
        console.log("Checking User status", data.data.Data.ActiveStatus);
        UserStatus = data.data.Data.ActiveStatus;

        if (UserStatus == 2) {
          console.log("User active");
          // this.syncAuditsToServerMethod()
          this.checkFilePath();
        } else if (UserStatus == 1) {
          console.log("deleting user details");

          var cleanURL = serverUrl.replace(/^https?:\/\//, "");
          var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
          this.propsServerUrl = formatURL;

          console.log("cleanURL", this.propsServerUrl);
          // var ID = this.props.data.projects.userId
          console.log("path", this.propsServerUrl + ID);

          if (Platform.OS == "android") {
            path =
              "/data/user/0/com.apqp/cache/ApqpUser" +
              "/" +
              this.propsServerUrl +
              ID;
            console.log("path storing-->", path);
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            path = iOSpath + "/" + this.propsServerUrl + ID;
          }
          console.log("*** path", path);
          // this.deleteUserFile(path)
          this.refs.toast.show(
            strings.user_disabled_text,
            DURATION.LENGTH_SHORT
          );
          this.props.navigation.navigate("LoginUIScreen");
        } else if (UserStatus == 0) {
          this.refs.toast.show(
            strings.user_inactive_text,
            DURATION.LENGTH_SHORT
          );
          this.props.navigation.navigate("LoginUIScreen");
        }
      }
    });
  }

  async checkFilePath() {}

  async isPathExist(arrpath) {}

  deleteUserFile(path) {}

  docProRequest() {
    return new Promise((resolve, reject) => {});
  }

  convertFile = (path) => {
    return new Promise((resolve, reject) => {
      // if (Platform.OS == "ios") {
      //   let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + "/" + "IosFiles";
      //   console.log("IosFilesPath--->", IosFilesPath);
      //   const arr = path.split("/");
      //   var uripathIos = IosFilesPath + "/" + arr[arr.length - 1];
      //   RNFetchBlob.fs
      //     .readFile(uripathIos, "base64")
      //     .then((data) => {
      //       if (data) {
      //         resolve(data);
      //         // console.log('path found',arrpath)
      //       }
      //     })
      //     .catch((err) => {
      //       resolve(undefined);
      //       // console.log('path not found',arrpath)
      //     });
      // } else {
      //   RNFetchBlob.fs
      //     .readFile(path, "base64")
      //     .then((data) => {
      //       resolve(data);
      //     })
      //     .catch((err) => {
      //       resolve(undefined);
      //       console.log("Error in converting", err);
      //     });
      // }
    });
  };

  parseObj(objStr, objType) {
    var refId = 0;
    if (objType == "CL") {
      var objArr = objStr.split("-");
      if (objArr.length == 6) {
        refId = parseInt(objArr[4]);
      }
    } else if (objType == "AR") {
      var objArr = objStr.split("-");
      if (objArr.length == 4) {
        refId = parseInt(objArr[2]);
      }
    }
    return refId;
  }

  refreshList() {}

  renderRow(data) {
    return <Text>{`\u2022 ${data}`}</Text>;
  }
  // Sudha_Recently_Completed
  chooseAction(index) {
    console.log("chooseAction", index);
    if (index == 0) {
      this.props.navigation.navigate(ROUTES.PROFILE_APQP);
    }
    if (index == 1) {
      this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
        filterId: 1,
        title: strings.projects,
        todayn: 2,
        taskHide: true,
      });
    }
    if (index == 2) {
      this.props.navigation.navigate(ROUTES.TODAYS_TASK, {
        isFilterApplied: false,
      });
    }
    if (index == 3) {
      this.props.navigation.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
        filterId: 2,
        title: strings.projects,
        todayn: 1,
        isPendingTask: 1,
      });
    }
    if (index == 4) {
      this.props.navigation.navigate(ROUTES.HELP_APQP);
    }
    if (index == 5) {
      this.setState({ dialogVisible_logout: true });
    }
  }
  // Sudha_Recently_Completed

  doLogout() {
    console.log("props------>", this.props);
    if (this.props.data.projects.isOfflineMode) {
      this.setState({
        dialogVisible_logout: false,
        errorDialogVisible: true,
        errorMsg: strings.Offline_Notice,
      });
    } else {
      this.props.clearProjects();
      var serverUrl = this.props.data.projects.serverUrl;
      var ID = this.props.data.projects.userId;
      var type = 3;
      var path = "";
      var cleanURL = serverUrl.replace(/^https?:\/\//, "");
      var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
      this.propsServerUrl = formatURL;
      var emptyRecentProjects = [];
      console.log("cleanURL", this.propsServerUrl);

      var SaveDetails = this.props.data.projects;
      var ID = this.props.data.projects.userId;
      var UserDetails = [];
      UserDetails.push({
        UserId: this.props.data.projects.userId,
        projects: SaveDetails,
      });
      console.log("SaveDetails", SaveDetails);
      console.log("UserDetails", UserDetails);
      var stringify = JSON.stringify(UserDetails);
      if (Platform.OS == "android") {
        path =
          "/data/user/0/com.apqp/cache/ApqpUser/" + this.propsServerUrl + ID;
        console.log("path storing-->", path);
      } else {
        var iOSpath = RNFS.DocumentDirectoryPath;
        path = iOSpath + "/" + this.propsServerUrl + ID;
      }
      // write the file
      console.log("*** path", path);
      RNFS.writeFile(path, stringify, "utf8")
        .then((success) => {
          console.log("FILE WRITTEN!", success);
          this.props.storeServerUrl(serverUrl);
          this.props.storeLoginSession(false);
          this.props.updateRecentProjectList(emptyRecentProjects);
          this.props.registrationState(this.state.isDeviceRegistered);
          this.setState({ progressVisible: false });
        })
        .catch((err) => {
          console.log("Logout error!", err.message);
          // this.setState({
          //   progressVisible: false,
          //   errorDialogVisible: true,
          //   errorMsg: strings.LogoutFailed,
          // });
        });
      NetInfo.fetch().then((netStatus) => {
        if (netStatus.isConnected) {
          this.setState(
            {
              dialogVisible_logout: false,
              progressVisible: true,
            },
            () => {
              auth.registerDevice(
                this.state.deviceId,
                this.props.data.projects.serverUrl,
                type,
                (res, data) => {
                  console.log("Logout response", data);
                  if (data.data) {
                    if (data.data.Success == true) {
                      // localStorage.storeData('appLogged', false);
                      console.log('globalDeviceDetails--->APQP', this.globalServerURL)
                      localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, this.globalServerURL)
                      auth.setServerUrl(this.globalServerURL);
                      // console.log('globalDeviceDetails--->APQP', this.globalServerURL)
                      localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, '');
                      // this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW);
                      this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN)
                    }
                  } else {
                    console.log("Logout service failure here!");
                    this.setState({
                      progressVisible: false,
                      errorDialogVisible: true,
                      errorMsg: strings.LogoutFailed,
                    });
                  }
                }
              );
            }
          );
        } else {
          this.setState({
            dialogVisible_logout: false,
            errorDialogVisible: true,
            errorMsg: strings.NoInternet,
          });
        }
      });
    }
  }

  onConfirmPwdPress() {
    // if (!this.state.pwdentry) {
    //   this.setState(
    //     {
    //       isEmptyPwd: strings.enter_password,
    //     },
    //     () => {
    //       // this.refs.toast.show('Empty password attempt', DURATION.LENGTH_SHORT)
    //     }
    //   );
    // } else {
    //   NetInfo.fetch().then((netStatus) => {
    //     if (netStatus.isConnected) {
    //       Keyboard.dismiss();
    //       var username = this.props.data.projects.loginuser;
    //       var pwd = this.state.pwdentry;
    //       var key = CryptoJS.enc.Utf8.parse("8080808080808080");
    //       var iv = CryptoJS.enc.Utf8.parse("8080808080808080");
    //       var encryptedpassword = CryptoJS.AES.encrypt(
    //         CryptoJS.enc.Utf8.parse(pwd),
    //         key,
    //         {
    //           keySize: 128 / 8,
    //           iv: iv,
    //           mode: CryptoJS.mode.CBC,
    //           padding: CryptoJS.pad.Pkcs7,
    //         }
    //       );
    //       auth.loginUser(
    //         username,
    //         encryptedpassword.toString(),
    //         "",
    //         this.state.deviceId,
    //         (res, data) => {
    //           if (data.data.Success == true) {
    //             this.setState(
    //               {
    //                 confirmpwd: false,
    //                 pwdentry: undefined,
    //               },
    //               () => {
    //                 // this.refs.toast.show('No NC/OFI found to sync', DURATION.LENGTH_SHORT)
    //                 this.StartGlobalSyncProcess();
    //               }
    //             );
    //           } else {
    //             this.setState(
    //               {
    //                 // confirmpwd : false,
    //                 pwdentry: undefined,
    //                 isEmptyPwd: strings.invalidpassword,
    //               },
    //               () => {
    //                 // this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG)
    //               }
    //             );
    //           }
    //         }
    //       );
    //     } else {
    //       this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
    //     }
    //   });
    // }
  }

  render() {
    return (
      <View style={styles.wrapperFoot}>
        {/* <ImageBackground source={Images.dashFooter} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}> */}
        <View style={{ flexDirection: "row", padding: 10 }}>
          <View style={styles.footerMenuItem}>
            <Icon name="home" size={32} color="#00BAC8" />
            <Text
              style={{
                color: "#00BAC8",
                fontSize: Fonts.size.medium,
                fontFamily: "OpenSans-Regular",
              }}
            >
              {strings.home}
            </Text>
          </View>
          <View style={styles.separatorSection}>
            {/* <Image source={Images.lineIcon} /> */}
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(ROUTES.CALANDAR_LIST_APQP)}
            style={styles.footerMenuItem}
          >
            <Icon name="calendar" size={30} color="lightgrey" />
            <Text
              style={{
                color: "#848484",
                fontSize: Fonts.size.medium,
                fontFamily: "OpenSans-Regular",
              }}
            >
              {strings.Calendar}
            </Text>
          </TouchableOpacity>
          <View style={styles.separatorSection}>
            {/* <Image source={Images.lineIcon} /> */}
          </View>
          <TouchableOpacity
            onPress={() =>
              // this.props.navigation.navigate('UserPreference')
              this.ActionSheet.show()
            }
            style={styles.footerMenuItem}
          >
            <Icon name="ellipsis-h" size={30} color="lightgrey" />
            <Text
              style={{
                color: "#848484",
                fontSize: Fonts.size.medium,
                fontFamily: "OpenSans-Regular",
              }}
            >
              {strings.More}
            </Text>
          </TouchableOpacity>
        </View>

        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          // title={'Which one do you like ?'}
          options={
            Platform.OS == "android"
              ? [
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.Profile}
                  </Text>,
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.todaystask}
                  </Text>,
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.recenttask}
                  </Text>,
                  // Sudha_Recently_Completed
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.pending_task}
                  </Text>,
                  // Sudha_Recently_Completed
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.help}
                  </Text>,
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#FF3B30",
                    }}
                  >
                    {strings.logout}
                  </Text>,
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontSize: Fonts.size.regular,
                      color: "#007AFF",
                    }}
                  >
                    {strings.Cancel}
                  </Text>,
                ]
              : [
                  strings.Profile,
                  strings.todaystask,
                  strings.recenttask,
                  strings.pending_task,
                  strings.help,
                  strings.logout,
                  strings.Cancel,
                ]
          }
          cancelButtonIndex={5}
          destructiveButtonIndex={6}
          onPress={(index) => this.chooseAction(index)}
        />

        <View style={{ flexDirection: "column" }}>
          <Toast
            ref="toast"
            style={{ backgroundColor: "black", margin: 20 }}
            position="top"
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: "white" }}
          />
        </View>

        <ConfirmDialog
          title={strings.title_logout}
          message={strings.title_logout_message}
          titleStyle={{ fontFamily: "OpenSans-SemiBold" }}
          messageStyle={{ fontFamily: "OpenSans-Regular" }}
          visible={this.state.dialogVisible_logout}
          onTouchOutside={() => this.setState({ dialogVisible_logout: false })}
          positiveButton={{
            title: strings.yes,
            onPress: this.doLogout.bind(this),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({ dialogVisible_logout: false }),
          }}
        />
        <Dialog
          visible={this.state.errorDialogVisible}
          title={strings.LogoutFailed}
          titleStyle={{ fontFamily: "OpenSans-SemiBold" }}
          messageStyle={{ fontFamily: "OpenSans-Regular" }}
          onTouchOutside={() => this.setState({ errorDialogVisible: false })}
        >
          <View>
            <Text style={{ height: 50, fontFamily: "OpenSans-Regular" }}>
              {this.state.errorMsg}
            </Text>
            <Button
              onPress={() => this.setState({ errorDialogVisible: false })}
              style={{ width: 50, marginTop: 10 }}
              title="OK"
            />
          </View>
        </Dialog>
        <ProgressDialog
          visible={this.state.progressVisible}
          title={strings.LoggingOut}
          message={strings.PleaseWait}
          titleStyle={{ fontFamily: "OpenSans-SemiBold" }}
          messageStyle={{ fontFamily: "OpenSans-Regular" }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
    // notifications: state.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeProjects: (projects) => dispatch({ type: "STORE_PROJECTS", projects }),
    storeServerUrl: (serverUrl) =>
      dispatch({ type: "STORE_SERVER_URL", serverUrl }),
    storeLoginSession: (isActive) =>
      dispatch({ type: "STORE_LOGIN_SESSION", isActive }),
    clearProjects: () => dispatch({ type: "CLEAR_PROJECTS" }),
    registrationState: (isDeviceRegistered) =>
      dispatch({ type: "STORE_DEVICE_REG_STATUS", isDeviceRegistered }),
    updateRecentProjectList: (recentProjects) =>
      dispatch({ type: "UPDATE_RECENT_ACTIVITY_LIST", recentProjects }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApqpDashboardFooter);
