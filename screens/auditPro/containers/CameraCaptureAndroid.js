import React, {Component, createRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
  LogBox,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {launchCamera} from 'react-native-image-picker';
import {Images} from '../Themes/index';
import OfflineNotice from '../components/OfflineNotice';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import {strings} from '../language/Language';
import {width, height} from 'react-native-dimension';
import Moment from 'moment';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import RNPhotoEditor from 'react-native-photo-editor';
import ImageMarker from 'react-native-image-marker';
import { Image as compressImage, Video, getVideoMetaData} from 'react-native-compressor';
 
// Styles
import styles from '../styles/CameraCaptureStyle';
import { ROUTES } from 'constants/app-constant';
import { COLORS, SPACING } from 'constants/theme-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalHeader from 'components/GlobalHeader';
 
class CameraCapture extends Component {
  constructor(props) {
    super(props);
    console.log('get this.props--->', props)
    this.state = {
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
      cameraType: 'back',
      mirrorMode: false,
      isCameraLaunching: false,
    };
    this.camera = createRef();
    this.capturePhoto = this.capturePhoto.bind(this);
  }

  normalizeFsPath(path) {
    if (!path) {
      return '';
    }

    let normalizedPath = path;

    if (path.startsWith('file://')) {
      normalizedPath = path.replace('file://', '');
    } else if (path.startsWith('file:/')) {
      normalizedPath = path.replace('file:/', '/');
    }

    return normalizedPath.replace(/^\/+/, '/');
  }

  getCaptureDirectory() {
    return `${this.normalizeFsPath(RNFetchBlob.fs.dirs.DocumentDir)}/${Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles'}`;
  }

  async ensureCaptureDirectory() {
    const directory = this.getCaptureDirectory();
    const exists = await RNFetchBlob.fs.exists(directory);

    if (!exists) {
      await RNFetchBlob.fs.mkdir(directory);
    }

    return directory;
  }

  toFileUri(path) {
    const normalizedPath = this.normalizeFsPath(path);

    if (!normalizedPath) {
      return '';
    }

    return normalizedPath.startsWith('/')
      ? `file://${normalizedPath}`
      : `file:///${normalizedPath}`;
  }

  withTimeout(promise, timeoutMs, errorMessage) {
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });
  }

  getCameraDevice() {
    const {devices, cameraType} = this.state;

    if (!Array.isArray(devices) || devices.length === 0) {
      return null;
    }

    return (
      devices.find(device => device?.position === cameraType) ||
      devices.find(device => device?.position === 'back') ||
      devices[0]
    );
  }

  componentDidMount = async () => {
    console.log('camera:capture mounted');
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    LogBox.ignoreLogs(['Frame Processors are disabled'])
    let Files = this.getCaptureDirectory();
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
 
    const hasCameraPermission = await this.requestCameraPermission();
    if (!hasCameraPermission) {
      Alert.alert(
        'Permission denied',
        'Please grant access to camera to capture and upload',
      );
    } else {
      this.capturePhoto();
    }
  };

  requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('camera: permission error', err);
      return false;
    }
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
 
  storePhotoEdited = async () => {
    console.log('Camera:storePhotoEdited', this.state.capturedImagePath);
    // console.log('Date ==>', this.state.timestamp)
    console.log('Camera:CAptured time', this.timestamp());
    var filepath = undefined;
    var newImgPath = '';
    try {
      newImgPath = await this.ensureCaptureDirectory();
    } catch (err) {
      console.log('camera: directory error', err);
      Alert.alert('Camera error', 'Unable to access image storage.');
      this.setState({captureState: 'CameraMode', isCameraLaunching: false});
      return;
    }
   {
      console.log(this.state.capturedImagePath, 'capturedilepat');
      filepath = (Platform.OS == 'android' ? this.toFileUri(this.state.capturedImagePath) : this.state.capturedImagePath);
      console.log(filepath, 'camera:filepath');
    }
 
    const markerOptions = {
      backgroundImage: {
        src: filepath,
        scale: 1,
      },
      watermarkTexts: [
        {
          text: this.timestamp(),
          position: {
            position: 'bottomRight',
          },
          style: {
            color: '#00ADD4',
            fontName: 'Arial-BoldItalicMT',
            fontSize: Platform.OS == 'ios' ? 50 : 38,
          },
        },
      ],
      quality: 90,
      saveFormat: 'base64',
    };

    return this.withTimeout(
      Promise.resolve().then(() => ImageMarker.markText(markerOptions)),
      15000,
      'Image watermark timed out',
    ).then(res => {
      if (res.startsWith("data:")){

        res = res.split(',')[1];
 
      }
      console.log('Camera:theÂ pathÂ is ' + res);
          //res = Platform.OS == 'ios' ? '/'+res : res;
          console.log('Camera: modified path ' + res);
      return this.withTimeout(
        this.doCompressImage(res),
        15000,
        'Image compression timed out',
      ).then(data => {
        let timeStamp = Moment().unix();
          console.log('Camera:fetch data', data);
          console.log('Camera:newImgPath--->', newImgPath);
          const uripath =
            newImgPath + '/' + 'CapturedImage_' + timeStamp + '.jpg';
          return RNFetchBlob.fs.writeFile(uripath, data, 'base64').then(data => {
            console.log('Camera:File added sucessfully');
          }).then((res)=> {
            this.setState(
              {
                captureState: 'Captured',
                imageData: 'Camera photo added',//data,
                imageName: 'CapturedImage_' + timeStamp + '.jpg',
                imageType: 'image/jpg',
                imageURI: uripath,
                capturedImagePath: uripath
              },
              () => {
                console.log('Camera:Capture Success URI.', this.state.imageURI);
                  //Deleting the Captured image after edit operation performed,
                this.deleteImageAfterEdit(filepath);
              },
            );
          
          });         
        });
    }).catch(err => {
      console.log('camera: Error', err);
      Alert.alert('Camera error', 'Unable to process captured image.');
      this.setState({captureState: 'CameraMode', isCameraLaunching: false});
    });
  };
 
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
    if (this.state.isCameraLaunching) {
      return;
    }

    this.setState({isCameraLaunching: true});

    var newImgPath = '';
    try {
      newImgPath = await this.ensureCaptureDirectory();
      const response = await new Promise(resolve => {
        launchCamera(
          {
            mediaType: 'photo',
            cameraType: this.state.cameraType,
            includeBase64: true,
            saveToPhotos: false,
            quality: 0.9,
          },
          resolve,
        );
      });

      if (response?.didCancel) {
        this.setState({isCameraLaunching: false});
        return;
      }

      if (response?.errorCode || response?.errorMessage) {
        console.log('camera: launch error', response?.errorCode, response?.errorMessage);
        const message =
          response?.errorCode === 'camera_unavailable'
            ? Platform.OS === 'ios'
              ? 'Camera is not available in the iOS Simulator. Please test camera capture on a physical iPhone.'
              : 'Camera is not available on this device.'
            : response?.errorMessage || 'Unable to open camera.';
        Alert.alert('Camera error', message);
        this.setState({isCameraLaunching: false});
        return;
      }

      const asset = response?.assets?.[0];
      const ImgPath = this.normalizeFsPath(asset?.uri);
      if (!ImgPath) {
        Alert.alert('Camera error', 'Unable to read captured image.');
        this.setState({isCameraLaunching: false});
        return;
      }

      let filename = asset?.fileName || ImgPath.substring(ImgPath.lastIndexOf('/')+1);
      let extn = filename.substring(filename.lastIndexOf('.')+1);
      if (!extn || extn === filename) {
        extn = 'jpg';
      }
      var newfileName = 'CapturedImage_' + Moment().unix() + '.' + extn;

      const data = asset?.base64 || await RNFS.readFile(ImgPath, 'base64');
      console.log('camera: ImgPath res', ImgPath);
      newImgPath = newImgPath + '/' + newfileName;
      console.log('camera:New ImgPath', newImgPath)
      await RNFetchBlob.fs.writeFile(newImgPath, data, 'base64');
      console.log('camera: New ImgPath', newImgPath)
      this.setState({
        captureState: 'Capturing',
        capturedImagePath: newImgPath,
        imageName: 'photo',
        isCameraLaunching: false,
      }, () => {
        if (Platform.OS === 'ios') {
          this.storePhotoEdited();
          return;
        }

        console.log('Reach RNPhotoEditor-->')
        RNPhotoEditor.Edit({
          path: newImgPath,
          onDone: this.storePhotoEdited,
          onCancel: this.retakePhoto,
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
      });
    } catch (err) {
      console.log("camera:Error in Capture Image:",err);
      Alert.alert('Camera error', 'Unable to save captured image.');
      this.setState({isCameraLaunching: false, captureState: 'CameraMode'});
    }
  };
 
  async deleteImageAfterEdit(filepath){
    console.log("Camera: Delete file path",filepath);
  const deletePath = this.normalizeFsPath(filepath);
  if(deletePath && await RNFetchBlob.fs.exists(deletePath)){
    await RNFetchBlob.fs.unlink(deletePath).then(() => {
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
      isCameraLaunching: false,
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
 
  saveCapturedImage = async () => {
    var cameraCapture = [];
 
    cameraCapture.push({
      name: this.state.imageName,
      type: this.state.imageType,
      data: this.state.imageData,
      uri: this.state.capturedImagePath,
    });
    console.log('cameraCapture---saveCapturedImage', cameraCapture)
    this.props.storeCameraCapture(cameraCapture);
    
    const stringifiedCameraCapture = JSON.stringify(cameraCapture);
    console.log('stringifiedCameraCapture---saveCapturedImage', stringifiedCameraCapture)
    AsyncStorage.setItem('cameraCapture', stringifiedCameraCapture);
 
    setTimeout(() => {
      this.props.navigation.goBack();
      // this.props.navigation.navigate(ROUTES.CREATE_NC)

      console.log('cameraCaptureList---saveCapturedImage reach')
    }, 500);
  };
 
  render() {
    const previewUri = this.toFileUri(this.state.capturedImagePath);
    console.log(this.state.devices, 'devices');
    //console.log(this.state.devices.position,"Pose")
    console.log(this.state.captureState, 'devices');
    console.log(this.state.capturedImagePath, 'capturedimagepath');
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        <GlobalHeader
          title={strings.Camera_Capture_Head}
          onLeftPress={() => this.props.navigation.goBack()}
          rightComponent={
            <TouchableOpacity onPress={this.changeCameraType.bind(this)}>
              <Icon name="refresh-ccw" size={25} color={COLORS.primaryDarkThemeColor} />
            </TouchableOpacity>
          }
          containerStyle={{backgroundColor: 'transparent'}}
          hideRight={false}
        />
         
 
        <View style={styles.auditPageBody}>
          {console.log('this.state.captureState--->', this.state.captureState)}
          {this.state.captureState == 'Capturing' || this.state.isCameraLaunching ? (
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
              <ActivityIndicator size="large" color="#48BCF7" />
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
           
                <Image
                  source={{uri: previewUri}}
                  style={{
                    width: width(90),
                    height: height(65),
                    resizeMode: 'stretch',
                  }}
                  onError={err => console.log('camera:preview image error', err.nativeEvent)}
                />
            </View>
          )}
        </View>
 
       
        <View style={styles.footer}>
            {this.state.captureState == 'Captured' ? (
              <View style={styles.footerDiv}>
                <View style={styles.splitButtonRow}>
                  <TouchableOpacity
                    style={styles.splitButton}
                    onPress={this.retakePhoto.bind(this)}>
                    <Text style={styles.splitButtonText}>
                      {strings.Camera_Retake}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.splitButton}
                    onPress={this.saveCapturedImage.bind(this)}>
                    <Text style={styles.splitButtonText}>{strings.Save}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.footerDiv}>
                {this.state.captureState == 'CameraMode' ? (
                  <View style={styles.floatingCapture}>
                    <TouchableOpacity
                      style={styles.captureBtn}
                      onPress={this.capturePhoto}>
                      <Icon name="camera" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                )}
              </View>
            )}
        </View>
      </View>
    );
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
