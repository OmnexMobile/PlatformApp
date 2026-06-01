import React, { Component } from "react";
import {
  View,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/VideoCapture";
import Video from "react-native-video";
import Moment from "moment";
import { connect } from "react-redux";
import { Images } from "../Themes/index";
import Fonts from "../Themes/Fonts";
import { strings } from "../language/Language";
import { width, height } from "react-native-dimension";
import { Stopwatch } from "react-native-stopwatch-timer";

const FLASH_MODE = [
  RNCamera.Constants.FlashMode.on,
  RNCamera.Constants.FlashMode.off,
  RNCamera.Constants.FlashMode.auto,
];

var cameraCapture = [];

class VideoCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: true,
      cameraType: RNCamera.Constants.Type.back,
      flashMode: 1,
      isRecordStart: false,
      isBack: false,
      isPaused: false,
      videoResponse: "",
      title: "",
      location: "",
      description: "",
      videoUri: "",
      videoName: "video",
      videoType: "video/mp4",
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props.data.audits.userDateFormat,
      timestamp: new Date(),
      stopwatchStart: false,
      runvideoplayer: false,
    };
  }

  componentDidMount() {
    this.setState({ isModal: true, isBack: false });
  }

  recordVideo = () => {
    const { isRecordStart } = this.state;
    this.setState({
      isRecordStart: !this.state.isRecordStart,
      stopwatchStart: true,
    });

    if (!isRecordStart) {
      try {
        this.camera
          .recordAsync({
            maxDuration: 60
          })
          .then((video) => {
            let urlString = video.uri;
            if (Platform.OS === "android") {
              urlString = video.uri.replace("file://", "");
            }
            const videoDetails = {
              deviceOrientation: video.deviceOrientation,
              isRecordingInterrupted: video.isRecordingInterrupted,
              uri: urlString,
              videoOrientation: video.videoOrientation,
            };

            this.setState({
              videoUri: video.uri,
              videoName: "Capturedvideo_" + Moment().unix() + ".mp4",
              //isModal: false,
            });

            cameraCapture = [];
            cameraCapture.push({
              name: this.state.videoName,
              type: this.state.videoType,
              data: this.state.videoUri,
              uri: this.state.videoUri,
            });
            console.log("uri value:" + cameraCapture[0].uri);
            //this.onVideoUpload(videoDetails);
          })
          .catch((e) => {
            this.stopRecord();
          });
      } catch (e) {
        this.stopRecord();
        console.log(e, "ERRRR");
      }
    } else {
      // stop record
      console.log("stop recording");
      this.setState({ stopwatchStart: false });
      this.stopRecord();
    }
  };

  stopRecord = () => {
    this.camera.stopRecording();

    //    var cameraCapture = []
    //    cameraCapture.push({
    //      name: this.state.videoName,
    //      type: this.state.videoType,
    //      data: this.state.videoUri,
    //      uri: this.state.videoUri
    //    })
    //  console.log("uri value "+ cameraCapture[0].uri)
    //this.props.storeCameraCapture(cameraCapture);
    setTimeout(() => {
      //this.props.navigation.goBack()
      console.log("uri value " + cameraCapture[0]);

      if (this.state.videoUri !== "") {
        console.log("video uri state value not empty");
        this.setState({ runvideoplayer: true });
      }
    }, 500);
  };

  toggleCamera = async () => {
    this.setState((prevState) => ({
      cameraType:
        prevState.cameraType === RNCamera.Constants.Type.back
          ? RNCamera.Constants.Type.front
          : RNCamera.Constants.Type.back,
    }));
  };

  renderVideoPlayer = () => {
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: "stretch",
            width: "100%",
            height: 65,
          }}
        >
          <View
            style={{
              width: width(100),
              zIndex: 3000,
              flexDirection: "row",
              //backgroundColor: 'white',
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              height: 65,
              elevation: 4,
              shadowOffset: { width: 2, height: 10 },
              shadowColor: "lightgrey",
              shadowOpacity: 0.5,
              shadowRadius: 4,
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  width: width(15),
                  height: 65,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: width(70),
                height: 65,
              }}
            >
              <Text
                style={{
                  fontSize: Fonts.size.h4,
                  fontFamily: Fonts.type.base,
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "OpenSans-Bold",
                }}
              >
                Take a Video
              </Text>
            </View>
            <View
              style={{
                width: width(15),
                height: 65,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          </View>
        </ImageBackground>
        <View
          style={{
            height: "80%",
          }}
        >
          <Video
            source={{ uri: this.state.videoUri }}
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              bottom: 30,
              zIndex: -100,
            }}
            controls={true}
            resizeMode={"cover"}
            ref={(ref) => {
              this.player = ref;
            }}
            paused={this.state.isPaused}
            onVideoEnd={() => {
              this.setState({ isPaused: !this.state.isPaused });
            }}
          />
        </View>

        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 70,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: width(100),
                height: 70,
                position: "absolute",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: width(45),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: Fonts.size.h5,
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: width(10),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={Images.lineIcon} />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: width(45),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.props.storeCameraCapture(cameraCapture);
                    this.props.navigation.goBack()}}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: Fonts.size.h5,
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {strings.Save}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  renderRecordModel = () => {
    const { isModal, cameraType, isRecordStart } = this.state;

    const options = {
      container: {
        backgroundColor: "#000",
        padding: 5,
        borderRadius: 5,
        width: 120,
      },
      text: {
        fontSize: 24,
        color: "red",
        marginLeft: 7,
      },
    };

    return (
      <Modal isVisible={isModal} backdropOpacity={1} style={styles.container}>
        <SafeAreaView style={styles.flexView}>
          <View style={{ alignItems: "center", backgroundColor: "black" }}>
            <Stopwatch
              laps={false}
              start={this.state.stopwatchStart}
              startTime={0}
              msecs={false}
              options={options}
              //getTime={(time)=>()}
            />
          </View>

          <RNCamera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={styles.flexView}
            type={cameraType}
            flashMode={FLASH_MODE[this.state.flashMode]}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
            androidRecordAudioPermissionOptions={{
              title: "Permission to use audio recording",
              message: "We need your permission to use your audio",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
          />
          <View style={styles.buttonsView}>
            <TouchableOpacity
              style={styles.outerCircle}
              // onLongPress={this.recordVideo}
              onPress={this.recordVideo.bind(this)}
            >
              <View
                style={[
                  isRecordStart ? styles.innerCircle2 : styles.innerCircle,
                ]}
              />
            </TouchableOpacity>

            {!this.state.isRecordStart ? (
              <TouchableOpacity
                style={styles.rotateButton}
                onPress={this.toggleCamera}
              >
                <Image
                  source={require("../Images/rotate.png")}
                  style={styles.rotateImage}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    const { videoUri } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "black", height: "80%" }}>
        {!this.state.runvideoplayer
          ? this.renderRecordModel()
          : this.renderVideoPlayer()}
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
  return {
    storeCameraCapture: (cameraCapture) => {
      dispatch({ type: "STORE_CAMERA_CAPTURE", cameraCapture });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoCapture);
