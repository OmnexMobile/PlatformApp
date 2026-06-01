import React, {Component, createRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
//import {Camera} from 'react-native-vision-camera'; //Android
import { RNCamera } from 'react-native-camera'; // IOS
import {Images} from '../Themes/index';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../language/Language';
import {width, height} from 'react-native-dimension';
import Moment from 'moment';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
// import {Bars, Pulse} from 'react-native-loader';
import RNPhotoEditor from 'react-native-photo-editor';
// import ImageMarker from 'react-native-image-marker';
import { Image as compressImage, Video, getVideoMetaData} from 'react-native-compressor';
import ImageView from "react-native-image-viewing";

// Styles
import styles from '../styles/CameraCaptureStyle';
import { SPACING } from 'constants/theme-constants';

class CameraCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      captureState: 'CameraMode',
      imageData: '',
      imageName: '',
      imageType: '',
      capturedImagePath: '',
      imageURI: '',
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      timestamp: new Date(),
      devices: [],
      //cameraType: 'back',
      cameraType: RNCamera.Constants.Type.back,
      mirrorMode: false
    };
    this.camera = createRef();
    this.capturePhoto = this.capturePhoto.bind(this);
  }
  componentDidMount = async () => {
    console.log('camera:capture mounted');
    let Files = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    console.log('camera:Ios-Android-Path', Files);
    RNFetchBlob.fs.exists(Files).then(exist => {
      if (!exist || exist == '') {
        RNFetchBlob.fs
          .mkdir(Files)
          .then(data => {
            console.log('camera:data directory created', data);
          })
          .catch(err => {
            console.log('err', err);
          });
      } else if (RNFetchBlob.fs.isDir(Files)) {
        RNFetchBlob.fs.ls(Files).then(data => {
          console.log('camera:All files', data);
        });
      }
    });

    // const newCameraPermission = await RNCamera.requestCameraPermission();
    // const cameraPermission = await RNCamera.getCameraPermissionStatus();
    // console.log(cameraPermission, 'camerapermission');
    // if (cameraPermission !== 'authorized') {
    //   Alert.alert(
    //     'Permission denied',
    //     'Please grant access to camera to capture and upload',
    //   );
    // } else {
      const devices = [1];//await RNCamera.getAvailableCameraDevices();
      console.log(devices, 'camerapermission');
      this.setState({
        devices,
      });
    //}
  };

  timestamp() {
    var date = new Date();
    var hours = date.getHours();
    // var min = date.getMinutes() == '0' ? '00' : date.getMinutes()
    var min = this.minuteChange(date.getMinutes());

    console.log('hours,min', hours + ':' + min);
    var time = hours + ':' + min;

    var getDate = new Date();
    var ISOdate = getDate.toISOString();

    var DefaultFormatL = this.state.selectedFormat;
    var sDateArr = ISOdate.split('T');
    var sDateValArr = sDateArr[0].split('-');
    var sTimeValArr = sDateArr[1].split(':');
    var outDate = new Date(
      sDateValArr[0],
      sDateValArr[1] - 1,
      sDateValArr[2],
      sTimeValArr[0],
      sTimeValArr[1],
    );
    var finaldate = Moment(outDate).format(DefaultFormatL);

    var finalFormat = finaldate + ' ' + time;

    return finalFormat.toString();
  }

  minuteChange(min) {
    console.log('min --', min);
    if (min > 9) {
      return min;
    } else {
      switch (min) {
        case 0:
          return '00';

        case 1:
          return '01';

        case 2:
          return '02';

        case 3:
          return '03';

        case 4:
          return '04';

        case 5:
          return '05';

        case 6:
          return '06';

        case 7:
          return '07';

        case 8:
          return '08';

        case 9:
          return '09';

        default:
          return '00';
      }
    }
  }

//   storePhotoEdited = () => {
//     console.log('Camera:storePhotoEdited', this.state.capturedImagePath);
//     // console.log('Date ==>', this.state.timestamp)
//     console.log('Camera:CAptured time', this.timestamp());
//     var filepath = undefined;
//     var newImgPath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
//    {
//       console.log(this.state.capturedImagePath, 'capturedilepat');
//       filepath = (Platform.OS == 'android' ? 'file:/'+this.state.capturedImagePath : this.state.capturedImagePath);
//       console.log(filepath, 'camera:filepath');
//     }

//     ImageMarker.markText({
//       src: filepath,
//       text: this.timestamp(),
//       position: 'bottomRight',
//       color: '#00ADD4',
//       fontName: 'Arial-BoldItalicMT',
//       fontSize: Platform.OS == 'ios' ? 50 : 38,
//       scale: 1,
//       quality: 90,
//       saveFormat: 'base64'
//     }).then(res =>
//     {
//       if (res.startsWith("data:")){

//         res = res.split(',')[1];

//       }
//       console.log('Camera:theÂ pathÂ is ' + res);
//           //res = Platform.OS == 'ios' ? '/'+res : res;
//           console.log('Camera: modified path ' + res);
//       this.doCompressImage(res).then(data => {   
//         let timeStamp = Moment().unix();
//           console.log('Camera:fetch data', data);
//           console.log('Camera:newImgPath--->', newImgPath);
//           const uripath =
//             newImgPath + '/' + 'CapturedImage_' + timeStamp + '.jpg';
//           RNFetchBlob.fs.writeFile(uripath, data, 'base64').then(data => {
//             console.log('Camera:File added sucessfully');
//           }).then((res)=> {
//             this.setState(
//               {
//                 captureState: 'Captured',
//                 imageData: 'Camera photo added',//data,
//                 imageName: 'CapturedImage_' + timeStamp + '.jpg',
//                 imageType: 'image/jpg',
//                 imageURI: uripath,
//                 capturedImagePath: uripath
//               },
//               () => {
//                 console.log('Camera:Capture Success URI.', this.state.imageURI);
//                   //Deleting the Captured image after edit operation performed, 
//                 this.deleteImageAfterEdit(filepath);
//               },
//             );
          
//           });         
//         });
//     }).catch(err => {
//       console.log('camera: Error', err);
//     });
//   };

  doCompressImage = async (fileRes) => {
    console.log('one:first-6',fileRes);
    return new Promise((resolve,reject) => {
      try{
          const result =  compressImage.compress(fileRes, {
            input: 'base64',
            maxWidth: 1000,
            quality: 0.8,
            returnableOutputType: 'base64',
          }).then(res => {            
              console.log("one: Method - Compressed Image response")
               res == "" ? resolve(fileRes) :
              resolve(res);           
          }).catch(err => {
            console.log(err, 'one:doCompressImage');
            resolve(fileRes);
        });
      } catch (err) {
        console.log("one:compres Image Method Error",err)
        resolve(fileRes);
      }
    });
  }
  changeCameraType() {
    if (this.state.cameraType === 'back') {
      console.log("back")
      this.setState({
        cameraType: 'front',
        mirrorMode: true
      });
    } else {
      console.log("Front")
      this.setState({
        cameraType: 'back',
        mirrorMode: false
      });
    }
  }
  capturePhoto = async () => {
    var ImgPath = '';
    var newImgPath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    if (this.camera) {
      console.log('ccenter');
      const options = { quality: 0.4, base64: false, height: 600 };
      const photo = await this.camera.takePictureAsync(options);
      console.log(photo, 'camera:photoconsole');
      let filename = photo.uri.substring(photo.uri.lastIndexOf('/')+1);
      let extn = filename.substring(filename.lastIndexOf('.')+1);
      var newfileName = 'CapturedImage_' + Moment().unix() + '.' + extn;
      try {
        ImgPath = '/' + photo.uri.replace('file:/', '');
        var data = await RNFS.readFile(
          ImgPath,
          'base64',
        ).then(res => {
          console.log('camera: ImgPath res', ImgPath, res)
          newImgPath = newImgPath + '/' + newfileName;
          console.log('camera:New ImgPath', newImgPath)
            RNFetchBlob.fs.writeFile(
              newImgPath,
              res,
              'base64',
            )
            .then(res => {
              console.log('camera: New ImgPath', newImgPath,res)
              this.setState({
                captureState: 'Capturing',
                capturedImagePath: newImgPath,
                imageName: 'photo',
              });
          // if (Platform.OS == 'ios') {
          //   this.storePhotoEdited();
          // } else 
          {
          RNPhotoEditor.Edit({
            path: this.state.capturedImagePath,
            // onDone: this.storePhotoEdited,
            onCancel: this.retakePhoto,

            //onClear: this.retakePhoto,
            hiddenControls: ['save'],
            colors: [
              '#ff0000',
              '#000000',
              '#808080',
              '#a9a9a9',
              '#FFFFFF',
              '#0000ff',
              '#00ff00',
              '#ffff00',
              '#ffa500',
              '#800080',
              '#00ffff',
              '#a52a2a',
              '#ff00ff',
            ],
          });
        }
        });
      }); 

      }catch (err) {
          console.log("camera:Error in Capture Image:",err);
      }
    }
  };

  async deleteImageAfterEdit(filepath){
    console.log("Camera: Delete file path",filepath);
  if(RNFetchBlob.fs.isDir(filepath)){
    await RNFetchBlob.fs.unlink(filepath).then(() => {
      console.log('Camera:Captured old Deleted!!');
    })
    .catch ((err) => {
      console.log('Camera:Captured old NOT Deleted!!',err);
    });
  }
  }

  retakePhoto = () => {
    this.setState({
      captureState: 'CameraMode',
      imageData: '',
      imageName: '',
      imageType: 'image/jpg',
      capturedImagePath: '',
    });
  };

  IosPath(path) {
    console.log(path, 'pathvariable');
     let IosFiles = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
     let arr = path.split('/');
     let iosPath = IosFiles + '/' + arr[arr.length - 1];
    let iosPathfile = decodeURIComponent(iosPath);
    console.log(iosPathfile, 'pathvariable1');
    return iosPath;
  }

  saveCapturedImage = () => {
    var cameraCapture = [];

    cameraCapture.push({
      name: this.state.imageName,
      type: this.state.imageType,
      data: this.state.imageData,
      uri: this.state.capturedImagePath,
    });
    console.log('cameraCapture get-->', cameraCapture)

    this.props.storeCameraCapture(cameraCapture);

    setTimeout(() => {
      this.props.navigation.goBack();
    }, 500);
  };

  flipCamera = () => {
    this.setState((prevState) => ({
      cameraType:
        prevState.cameraType === RNCamera.Constants.Type.back
          ? RNCamera.Constants.Type.front
          : RNCamera.Constants.Type.back,
    },() => {

    }));
  };

  render() {
    console.log(this.state.devices, 'devices');
    //console.log(this.state.devices.position,"Pose")
    console.log(this.state.captureState, 'devices');
    console.log(this.state.capturedImagePath, 'capturedimagepath');
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.Camera_Capture_Head}
              </Text>
            </View>
            <View style={styles.headerDiv}>
            <View style={styles.backlogo}>
              
            <TouchableOpacity onPress={this.flipCamera.bind(this)}>
            <Icon name="rotate-right" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
            </View>
          </View>
         
        </ImageBackground>

        <View style={styles.auditPageBody}>
          {this.state.captureState == 'CameraMode' &&
          this.state.devices.length > 0 ? (
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
             // photo={true}
            // flashMode={RNCamera.Constants.FlashMode.on}
              style={styles.detailsCard}
              //device={this.state.cameraType}
              //zoom={1}
             // captureAudio={false}
              autoFocus="on"
              //isActive={true}
               type={this.state.cameraType}
              // mirrorImage={this.state.mirrorMode}
              // type={RNCamera.Constants.Type.back}
              // flashMode={RNCamera.Constants.FlashMode.on}
              // permissionDialogTitle={strings.Camera_Permission_Head}
              // permissionDialogMessage={strings.Camera_Permission_Content}
              // onGoogleVisionBarcodesDetected={({ barcodes }) => {
              //   console.log(barcodes);
              // }}
            />
            // <Camera
            //   ref={ref => {
            //     this.camera = ref;
            //   }}
            //   photo={true}
            //   style={styles.detailsCard}
            //   device={this.state.cameraType == 'back' ? this.state.devices[0] : this.state.devices[1]  }
            //   zoom={1}
            //   captureAudio={false}
            //   autoFocus="on"
            //   isActive={true}
            //   type={this.state.cameraType}
            //   mirrorImage={this.state.mirrorMode}
            //   // type={RNCamera.Constants.Type.back}
            //   // flashMode={RNCamera.Constants.FlashMode.on}
            //   // permissionDialogTitle={strings.Camera_Permission_Head}
            //   // permissionDialogMessage={strings.Camera_Permission_Content}
            //   // onGoogleVisionBarcodesDetected={({ barcodes }) => {
            //   //   console.log(barcodes);
            //   // }}
            // />
          ) : this.state.captureState == 'Capturing' ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Text
                style={{
                  fontSize: Fonts.size.regular,
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Capturing_Message}
              </Text>
              {/* <Bars size={20} color="#48BCF7" /> */}
            </View>
          ) : (            
            <View style={[styles.detailsCard, {padding: 10}]}>
              <Text
                style={{
                  fontSize: Fonts.size.regular,
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Preview_Head}
              </Text>
              <TouchableOpacity onPress={() => {this.renderImageViewer()}}>                  
                <Image
                  source={{uri: 'file:/' + this.state.capturedImagePath}}                 
                  style={{
                    width: width(90),
                    height: height(65),
                   resizeMode: 'stretch',
                  }}
                />
                <Icon name='expand' size={20} color="grey" style={{
                  position: 'absolute', padding:5, bottom: 15, right: 10, backgroundColor: '#FFFFFF'
                }} />
              </TouchableOpacity>  
              <ImageView
                images={[{uri: 'file:/' + this.state.capturedImagePath}]}
                imageIndex={0}
                presentationStyle='fullScreen'
                visible={this.state.visible}
                onRequestClose={() => {this.setState({visible : false },() => {})}}
              />
      
            </View>
          )}
        </View>     
        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 70,
            }}>
            {this.state.captureState == 'Captured' ? (
              <View style={styles.footerDiv}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.retakePhoto.bind(this)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.h5,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Camera_Retake}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.saveCapturedImage.bind(this)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.h5,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Save}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.footerDiv}>
                {this.state.captureState == 'CameraMode' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: width(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={this.capturePhoto}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: Fonts.size.h5,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.Camera_Capture}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.footerLoader}>
                    {/* <Pulse size={20} color="white" /> */}
                  </View>
                )}
              </View>
            )}
          </ImageBackground>
        </View>
      </View>
    );
  }

  renderImageViewer(){
    this.setState({
      visible : true
    },() => {})    
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeCameraCapture: cameraCapture =>
      dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraCapture);