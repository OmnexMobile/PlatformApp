import React, { Component } from "react";
import {
  Platform,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Images } from "../themes";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
import AsyncStorage from "@react-native-community/async-storage";
import auth from "../../../services/APQP-Auth";
// import DeviceInfo from "react-native-device-info";
import Moment from "moment";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
// import Reactotron from "reactotron-react-native";

// Styles
import styles from "./styles/AttachAdditionalDocStyles";
import { DeviceUniqueId } from "../config/Utils";
import RNFS from "react-native-fs";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";

// import RNBlobUtil from "react-native-blob-util";

class AttachAdditionalDocScreen extends Component {
  UserId = "";
  Token = "";
  SiteId = "";
  ProjectId = "";
  TaskId = "";
  isAdditional = "";
  comType = "";
  attItem = null;
  revision = 1;
  WebToken = "";
  weburl = "";

  constructor() {
    super();
    this.state = {
      docProRequest: null,
      isLoading: false,
      docName: "",
      comments: "",
      attachedDocName: "",
      attachedDoc: "",
      attachedfilebyteArray: "",
      newpathurl: "",
      attachfilebyte: [],
      loader: true,
      formobjectdp: [],
    };
  }

  componentDidMount() {
    console.log(
      "AttachAdditionalDocScreen params ...",
      this.props?.route?.params?.item
    );

    this.comType = this.props?.route?.params?.type;
    this.attItem = this.props?.route?.params?.item;
    console.log(this.props?.route?.params?.ProjectId, "projectid");
    if (this.comType == "ADL") {
      this.isAdditional = "1";
      this.revision = 1;
      this.ProjectId = this.props?.route?.params?.projectId;
      this.TaskId = this.props?.route?.params?.taskId;
    } else if (this.comType == "OPD") {
      this.ProjectId = this.attItem.ProjectId;
      this.TaskId = this.attItem.TaskId;
      this.isAdditional = "0";
      if (this.attItem?.OPDocName == "" || this.attItem?.OPRevId == 0) {
        this.revision = 1;
      } else {
        this.revision = this.attItem.OPRevId + 1;
      }
    }

    this.getData()
      .then((res) => {
        console.log("async", res);
        this.UserId = res.UserId;
        this.Token = res.Token;
        this.SiteId = res.SiteId;
        this.WebToken = res.WebToken;
        this.weburl = res.weburl;
        // Read docpro request details
        this.getDocProRequestDetails();
      })
      .catch((e) => {
        console.log("Async error", e);
      });
      console.log(this.WebToken, "webtoken");
      console.log(this.UserId, "userid");
  }

  getDocProRequestDetails() {
    console.log("calling getDocProRequestDetails api");

    const ProjectId = this.ProjectId;
    const TaskId = this.TaskId;
    const isAdditional = this.isAdditional;
    const UserId = this.UserId;
    const Token = this.Token;

    console.log(
      "getDocProRequestDetails request",
      ProjectId,
      TaskId,
      isAdditional,
      UserId,
      Token
    );

    auth.getDocProRequestDetails(
      ProjectId,
      TaskId,
      isAdditional,
      UserId,
      Token,
      (res, data) => {
        console.log("getDocProRequestDetails response", data);
        console.log("getting responses data.Message", data.data.Message);
        if (data.data.Message == "Success") {
          this.setState(
            {
              docProRequest: data.data.Data,
              docName: this.attItem ? this.attItem.OPDocName : "",
              comments: this.attItem ? this.attItem.OPComments : "",
              loader: false,
            },
            () => {
              console.log("docProRequest", this.state.docProRequest);
            }
          );
        } else {
          this.setState(
            {
              loader: false,
            },
            () => {
              this.refs.toast.show(
                "Failed to initialize the attachment component!",
                DURATION.LENGTH_SHORT
              );
            }
          );
        }
      }
    );
  }

  // getData = async (userdata) => {
  //   try {
  //     var UserId = await AsyncStorage.getItem("UserId");
  //     var Token = await AsyncStorage.getItem("Token");
  //     var Siteid = await AsyncStorage.getItem("SiteId");
  //     var WebToken = await AsyncStorage.getItem("WebToken");
  //     var weburl = await AsyncStorage.getItem("WebURL");
  //     console.log(WebToken, "234token");
  //     var userdata = [];
  //     console.log("Siteid aync", Siteid);
  //     console.log("UserId asyc", UserId.toString());
  //     console.log("Token asyns", Token.toString());
  //     var userdata = {
  //       UserId: UserId,
  //       SiteId: Siteid,
  //       Token: Token,
  //       WebToken: WebToken,
  //       weburl: weburl,
  //     };
  //     return userdata;
  //   } catch (e) {
  //     console.log("No user session");
  //   }
  // };

  /// NEED TO WORK

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
          WebToken: value?.webToken,
          weburl: value?.docattachurl,
        };
      console.log("userdata aync", userdata);
      return userdata;
    } catch (e) {
      console.log("No user session");
    }
  };

  onPressBack() {
    this.props.navigation.navigate(ROUTES.DELIVERABLE_INFO_SCREEN, {
      callAPI: true,
    });
  }
  uploadattachments = async () => {
    console.log('reach uploadattach-->')
    this.setState({
      loader: true,
    });
    // const Token = await AsyncStorage.getItem("Token");
    const Token = this.Token;
    console.log("AttachDoc==========>Token--------->",Token);
    const filename = this.state.attachedDocName;
    const filecontent = this.state.attachedfilebyteArray;
    console.log('filename, filecontent, Token', filename,'--', filecontent,'--', Token)
    if (
      this.state.attachedDoc == "" ||
      this.state.attachedDocName == "" ||
      this.state.docName == "" ||
      this.state.comments == ""
    ) {
      this.refs.toast.show("Please fill all the fields", DURATION.LENGTH_SHORT);
      this.setState({
        loader: false,
      });
    } else {
    
      auth.postimage(filename, filecontent, Token, (res, data) => {
        // this.refs.toast.show("hello1", DURATION.LENGTH_SHORT);
        console.log("AttachDoc==========>data========>"+data)
        if (data.data.Success == true) {
          console.log("AttachDoc==========>data===========Status========>"+data.data.Success)
          this.setState(
            {
              loader: false,
              newpathurl: data.data.Data,
            },
            () => {
              console.log("hellohellohello");
              this.refs.toast.show("Attachment done.", 5000);
              this.senduploadAttachments();
            }
          );
        } else {
          console.log("AttachDoc==========>data===========Status========>"+data.data.Success)
          console.log("AttachDoc==========>data===========Status========>"+data.data.Error)
          this.setState(
            {
              loader: false,
            },
            () => {
              this.refs.toast.show(
                "Failed to attach / Access denied",
                DURATION.LENGTH_SHORT
              );
            }
          );
        }
      });
    }
  };

  senduploadAttachments = async () => {
    this.setState({
      loader: true,
    });
    console.log("attachment moced to nexrs");
    this.refs.toast.show("Attachment moved to next.", DURATION.LENGTH_SHORT);
    // const WebToken = await AsyncStorage.getItem("WebToken");
    const WebToken = this.WebToken;
    // const weburl = await AsyncStorage.getItem("weburl");
    const weburl = this.weburl
    const FilePath = this.state.newpathurl;
    const ProjectId = this.ProjectId.toString();
    const TaskId = this.TaskId.toString();
    const InputDocId = this.attItem ? this.attItem.IPDocId.toString() : "0";
    const DocId = this.attItem ? this.attItem.OPDocId.toString() : "0";
    const DocRevision = this.revision.toString();
    const DocName = this.state.docName;
    const IPIdentity = this.attItem ? this.attItem.IPIdentity.toString() : "0";
    const ObjId = this.state.docProRequest[0].ObjId.toString();
    const comments = this.state.comments;
    const isAdditional = this.isAdditional;
    const UserDocName = this.state.docName;
    const FileName = this.state.attachedDocName;
    const OPIdentity = this.attItem ? this.attItem.OPIdentity.toString() : "0";
    var UserId = this.UserId;
    var siteid = this.SiteId;
    const RevId = this.revision;
    console.log(weburl, "weburlindocument");
    console.log("=========>WebToken=======>"+WebToken, '--', weburl)
    console.log("datas", TaskId, ProjectId);
    const ext = this.state.attachedDocName.substr(
      this.state.attachedDocName.lastIndexOf(".") + 1
    );
    auth.outputAttachments(
      InputDocId,
      IPIdentity,
      DocId,
      OPIdentity,
      ProjectId,
      RevId,
      TaskId,
      UserDocName,
      FileName,
      FilePath,
      ext,
      UserId,
      siteid,
      WebToken,
      weburl,
      comments,
      isAdditional,
      (res, data) => {
        console.log(data, "datadata");
        if (data.data.Status == 1) {
          this.setState(
            {
              loader: false,
            },
            () => {
              this.refs.toast.show("Attachment done.", DURATION.LENGTH_SHORT);
              this.props.navigation.navigate(ROUTES.DELIVERABLE_INFO_SCREEN);
            }
          );
        } else {
          console.log("hellodatatwo");
          this.setState(
            {
              loader: false,
              isLoading: false,
            },
            () => {
              this.refs.toast.show(
                "Failed to sync attachment to server!",
                DURATION.LENGTH_SHORT
              );
            }
          );
        }
      }
    );
  };

  outputattachmentconsole() {
    const InputDocId = this.attItem ? this.attItem.IPDocId.toString() : "0";
    console.log(InputDocId, "att item");
  }
  saveAttachments() {
    console.log("calling saveAttachments api");

    const Token = this.Token;
    const ProjectId = this.ProjectId.toString();
    const TaskId = this.TaskId.toString();
    const InputDocId = this.attItem ? this.attItem.IPDocId.toString() : "0";
    const DocId = this.attItem ? this.attItem.OPDocId.toString() : "0";
    const DocRevision = this.revision.toString();
    const DocName = this.state.docName;
    const IPIdentity = this.attItem ? this.attItem.IPIdentity.toString() : "0";
    const ObjId = this.state.docProRequest[0].ObjId.toString();
    const Comments = this.state.comments;
    const isAdditional = this.isAdditional;

    console.log(
      "saveAttachments requests",
      ProjectId,
      TaskId,
      InputDocId,
      DocId,
      DocRevision,
      DocName,
      IPIdentity,
      ObjId,
      Comments,
      isAdditional
    );

    auth.saveAttachments(
      ProjectId,
      TaskId,
      InputDocId,
      DocId,
      DocRevision,
      DocName,
      IPIdentity,
      ObjId,
      Comments,
      isAdditional,
      Token,
      (res, data) => {
        console.log("saveAttachments responses", data);
        console.log("getting responses .data.Message", data.data.Message);

        if (data.data.Success == true) {
          this.setState(
            {
              loader: false,
            },
            () => {
              this.refs.toast.show(
                "Attachment saved successfully.",
                DURATION.LENGTH_SHORT
              );
              setTimeout(() => {
                this.onPressBack();
              }, 500);
            }
          );
        } else {
          this.setState(
            {
              loader: false,
            },
            () => {
              this.refs.toast.show(
                "Failed to sync attachment to server!",
                DURATION.LENGTH_SHORT
              );
            }
          );
        }
      }
    );
  }

  // uriToBase64 = async (uri) => {
  //   try {
  //     const response = await fetch(uri);
  //     const blob = await response.blob();
  
  //     return await new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         // Remove the `data:[<mediatype>][;base64],` prefix
  //         const base64 = reader.result.split(',')[1];
  //         resolve(base64);
  //       };
  //       reader.onerror = reject;
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (err) {
  //     console.error('Error converting file to base64:', err);
  //     return null;
  //   }
  // };

  handleDocumentSelection = async () => {
    try {
      console.log('reach handleDocumentSelection--->')
      const response = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
      });
      if (response) {
        console.log('handleDocumentSelect response if--->', response, '--', response?.uri)
        

        RNFetchBlob.fs.readFile(response?.uri, "base64").then(
          (data) => {
            console.log("data fetchblob", data);
            response.data = data;
            console.log("xdx", response.name, response.uri);
            console.log("Base64Conversion---->"+response.name+"===========>"+response.uri)
            return response.readFile("base64");
          },
          // () =>
          this.setState({
            attachedDocName: response.name,
            attachedDoc: response.uri,
            attachfilebyte: response,
          })
        );

    //   const response = await DocumentPicker.pickSingle({
    //     presentationStyle: 'fullScreen',
    //   });
    //  if (response) {
    //   console.log('Picked file URI:', response?.uri);
  
    //   // Convert content:// URI to file path
    //   const fileStat = await RNBlobUtil.stat(response.uri);
    //   const filePath = fileStat.path;
  
    //   // Read file as base64
    //   const base64Data = await RNBlobUtil.fs.readFile(filePath, 'base64');
  
    //   console.log('Base64Conversion---->', response.name, '===========>', filePath);
  
    //   // You can now store or upload this data
    //   this.setState({
    //     attachedDocName: response.name,
    //     attachedDoc: response.uri,
    //     attachfilebyte: base64Data,
    //   });

      
        var data = await RNFS.readFile(response.uri, "base64").then((res) => {
          this.setState({ attachedfilebyteArray: res });
        });
        var data1 = await RNFS.readFile(response.uri, "base64")
        console.log("data reach-->", data, '--', data1);

        // this.setState({
        //     attachedfilebyteArray:data
        // })
      }
    } catch (err) {
      console.log("Base64Conversion----======Error=====>"+err);
    }

    // DocumentPicker.pick({
    //   allowMultiSelection: true,
    // //   type: [types.doc, types.docx],
    // })
    //   .then()
    //   .catch(handleError)
  };

  docProRequest = async () => {
    // Dynamic parameters
    var dnum = this.state.docProRequest[0].DocNum;
    var objId = this.state.docProRequest[0].ObjId;
    var sitelevelid = this.state.docProRequest[0].Sitelevelid;
    var doctypeid = this.state.docProRequest[0].Doctypeid;
    var routeId = this.state.docProRequest[0].RouteId;
    var routeXML = this.state.docProRequest[0].RouteXML;
    var userdtfmt = this.state.docProRequest[0].UserDateFormat;
    var UserDtFmtDlm = "/";
    var UserId = this.UserId;
    var siteid = "sit" + this.SiteId;
    var effectivedate = Moment(new Date()).format(
      this.state.docProRequest[0].UserDateFormat
    );
    var revdate = Moment(new Date()).format(
      this.state.docProRequest[0].UserDateFormat
    );

    var deviceId = await DeviceUniqueId();
    var rev = this.revision;
    var filepath = this.state.attachedDoc;

    // Static parameters
    var langid = 1;
    // var filepath = ''
    var fromdocpro = 0;
    var frommod = "mod2";
    var mod = "mod2";
    var link = "";
    var keyword = "APQP";
    var reason = "";
    var paginate = "";
    var chgs_reqd = "";
    var spublic = 0;
    var ModEmailConFig = 0;

    // Request object
    var formRequestObj = [];

    formRequestObj.push({
      dnum: dnum,
      dname: this.state.docName,
      filename: this.state.attachedDocName,
      ext: this.state.attachedDocName.substr(
        this.state.attachedDocName.lastIndexOf(".") + 1
      ),
      filepath: filepath,
      obj: objId,
      fromdocpro: fromdocpro,
      frommod: frommod,
      doctypeid: doctypeid,
      siteid: siteid,
      mod: mod,
      sitelevelid: sitelevelid,
      link: link,
      keyword: keyword,
      reason: reason,
      rev: rev,
      effectivedate: effectivedate,
      revdate: revdate,
      paginate: paginate,
      chgs_reqd: chgs_reqd,
      spublic: spublic,
      ModEmailConFig: ModEmailConFig,
      deviceId: deviceId,
      filecontent: this.state.attachedDoc,
      RouteId: routeId,
      RouteXML: routeXML,
      lstUserPrefModel: [
        {
          siteid: this.SiteId,
          UserId: UserId,
          langid: langid,
          userdtfmt: userdtfmt,
          UserDtFmtDlm: UserDtFmtDlm,
        },
      ],
    });

    console.log("Request array formed", formRequestObj);
    this.setState(
      {
        formobjectdp: formRequestObj,
      },
      () => this.saveDocs()
    );
    return formRequestObj;
  };
  saveDocs() {
    console.log("Save button pressed.");
    // var dpRequest = formRequestObj;
    // Reactotron.log(dpRequest);
    if (
      this.state.attachedDoc == "" ||
      this.state.attachedDocName == "" ||
      this.state.docName == "" ||
      this.state.comments == ""
    ) {
      this.refs.toast.show("Please fill all the fields", DURATION.LENGTH_SHORT);
    } else {
      this.setState(
        {
          loader: true,
        },
        () => {
          // var dpRequest = this.docProRequest();
          var dpRequest = this.state.formobjectdp;
          console.log(this.state.formobjectdp);
          var token = this.Token;

          if (dpRequest.length > 0) {
            auth.getdocProAttachment(dpRequest, token, (res, data) => {
              console.log("syncFilesToDocPro response", data);

              if (data.data) {
                if (data.data.Message === "Success") {
                  console.log("syncFilesToDocPro Success!");
                  this.saveAttachments();
                } else {
                  this.setState(
                    {
                      loader: false,
                    },
                    () => {
                      this.refs.toast.show(
                        "Failed to sync attachment to server!",
                        DURATION.LENGTH_SHORT
                      );
                    }
                  );
                }
              } else {
                this.setState(
                  {
                    loader: false,
                  },
                  () => {
                    this.refs.toast.show(
                      "Failed to sync attachment to server!",
                      DURATION.LENGTH_SHORT
                    );
                  }
                );
              }
            });
          } else {
            this.setState(
              {
                loader: false,
              },
              () => {
                this.refs.toast.show(
                  "Failed to sync attachment to server!",
                  DURATION.LENGTH_SHORT
                );
              }
            );
          }
        }
      );
    }
  }

  validatefield() {
    var text = this.state.docName;
    console.log("text", text);
    if (this.state.docName != "") {
      var letters = /^\d+(\.\d{1,2})?$/;
      if (!letters.test(text)) {
        console.log("active");
        this.setState(
          {
            docName: "",
          },
          () => {
            this.refs.toast.show("Invalid format!", DURATION.LENGTH_SHORT);
          }
        );
      }
    }
  }

  render() {
    console.log( "this.state.attachedDoc,this.state.attachedDocName", this.state.attachedDoc,'--', this.state.attachedDocName);
    const regex = /(<([^>]+)>)/gi;

    return (
      <>
      {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
      <View style={styles.mainContainer}>
        <Image source={Images.apqpmanagerbg} style={styles.bgImage} />

        <View style={styles.apqpTextView}>
          <ImageBackground
            source={Images.headerBG}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 73,
              flexDirection: "column",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.backLogo}>
                <TouchableOpacity onPress={this.onPressBack.bind(this)}>
                  <Icon name="angle-left" size={48} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.headerTextDiv}>
                <Text style={styles.apqpTextStyle}>
                  {this.comType == "ADL"
                    ? "Attach Additional Doc"
                    : this.attItem?.OPDocName == ""
                    ? "Attach Output Document"
                    : "Revise Output Document"}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {this.state.loader === true ? (
          <View style={styles.loaderView}>
            <Bubbles size={10} color="#8CE7DC" />
          </View>
        ) : (
          <View style={styles.flatListWholeView}>
            <View style={styles.sec1}>
              {this.state.docName != "" ? (
                <Text style={styles.completedTextStyle}>Doc Name</Text>
              ) : null}
              <TextInput
                placeholder={"Doc Name"}
                style={styles.textInputStyle}
                value={this.state.docName}
                onChangeText={(text) => {
                  this.setState({ docName: text });
                }}
              />
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            </View>

            <View style={styles.sec1}>
              {this.state.comments != "" ? (
                <Text style={styles.completedTextStyle}>Comments</Text>
              ) : null}
              <TextInput
                placeholder={"Comments"}
                style={styles.textInputStyle}
                value={this.state.comments.replace(regex, "")}
                onChangeText={(text) => {
                  this.setState({ comments: text });
                }}
              />
              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            </View>
            <View style={styles.sec1}>
              <Text style={styles.completedTextStyle}>Attach File</Text>
              <TouchableOpacity
                onPress={this.handleDocumentSelection.bind(this)}
              >
                <Text numberOfLines={1} style={styles.boxContent}>
                  {this.state.attachedDocName}
                </Text>
                <Icon name="paperclip" size={20} color="grey" />
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => {
                   // iPhone/Android
                   if (Platform.OS == 'android') {
                       DocumentPicker.show({
                           // filetype: [DocumentPickerUtil.allFiles()],
                       }, (error, res) => {
                           console.log('File upload error:', error)
                           console.log('Document response:', res)
                           if (res) {
                               RNFetchBlob.fs.readFile(res.uri, 'base64')
                                   .then((data) => {
                                       // handle the data ..
                                       res.data = data
                                       // Android
                                       console.log(
                                           res.uri,
                                           res.type, // mime type
                                           res.fileName,
                                           res.fileSize,
                                           res.data
                                       );

                                       this.setState({
                                           attachedDocName: res.fileName,
                                           attachedDoc: res.data
                                       })
                                   })
                           }
                       });
                   } else {
                       DocumentPicker.show({
                           filetype: ['public.content'],
                       }, (error, res) => {
                           console.log('File upload error:', error)
                           console.log('Document response:', res)
                           if (res) {
                               var getURI = res.uri
                               var uridata = getURI.slice(7)
                               console.log('uridata', uridata)
                               RNFetchBlob.fs.readFile(uridata, 'base64')
                                   .then((data) => {
                                       // handle the data ..
                                       res.data = data
                                       // Android
                                       console.log(
                                           res.uri,
                                           res.type, // mime type
                                           res.fileName,
                                           res.fileSize,
                                           res.data
                                       );
                                       this.setState({
                                           attachedDocName: res.fileName,
                                           attachedDoc: res.data
                                       })
                                   })
                           }
                       });
                   }
               }}>
                   <Text numberOfLines={1} style={styles.boxContent}>
                       {this.state.attachedDocName}
                   </Text>
                   <Icon name="paperclip" size={20} color="grey" />
               </TouchableOpacity> */}

              <View style={styles.check}>
                <Icon
                  style={{ left: 10 }}
                  name="asterisk"
                  size={8}
                  color="red"
                />
              </View>
            </View>
          </View>
        )}

        {this.state.loader === true ? null : (
          <View style={styles.footerDiv}>
            <ImageBackground
              source={Images.headerBG}
              style={{
                resizeMode: "stretch",
                width: "100%",
                height: 80,
              }}
            >
              <View style={styles.footerContainer}>
                <View style={styles.footerButton1}>
                  <TouchableOpacity
                    onPress={this.uploadattachments.bind(this)}
                    // onPress={this.outputattachmentconsole}
                    style={{
                      width: "100%",
                      height: 70,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="save" size={30} color="white" />
                    <Text style={{ color: "white" }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}

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
      </>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachAdditionalDocScreen);
