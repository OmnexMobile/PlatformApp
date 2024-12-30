import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet, Keyboard, KeyboardAvoidingView, Dimensions } from 'react-native';
import { height, width } from 'react-native-dimension';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from 'screens/auditPro/Themes';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'constants/app-constant';
import { SafeAreaView } from 'react-native';
import InputField from './InputField';
import strings from 'config/localization';import Toast from "react-native-simple-toast";
import NetInfo from '@react-native-community/netinfo';
import CryptoJS from 'crypto-js';
import auth from '../../../../services/Auditpro-Auth';
import { connect, useDispatch } from 'react-redux';
import { storeLoginData, storeSupplierManagement, storeUserName } from 'store/AuditPro/auditRedux';
import AsyncStorage from '@react-native-community/async-storage';
import { showErrorMessage, showWarningMessage } from 'helpers/utils';


let Window = Dimensions.get('window');


const LoginPopup = ( { route, navigation }) => {
  // const [isLoginVisible, setLoginVisible] = useState(false);

  // const handleLogin = (username, password) => {
  //   // Perform login logic here
  //   console.log('Logging in with:', username, password);
  //   // Close the login popup
  //   setLoginVisible(false);
  // };
  const {isLoginVisible, onClose, onLogin, currentUserData, title, projectStatus, category} = route.params;
  // console.log('isLoginVisible--->', isLoginVisible)
  const navigations = useNavigation();
  const [usersInfo, setUsersInfo] = useState({
    username: '',
    password: '',
    progressVisible: false,
    isActiveDirectory: false,
    isAdvalue: true,
    userFullName: '',
    userId: '',
    siteId: '',
    accessToken: '',
    fcmToken: '',
    deviceId: '',
    loginDetails: null,
  })

  const dispatch = useDispatch();

  useEffect(() => {
    if(usersInfo.progressVisible === true) {
      let usrfield = usersInfo.username;
      let pwdfield = usersInfo.password;
      if (usersInfo.isActiveDirectory == true && usersInfo.isAdvalue == true) {
        // console.log('usrfield, pwdfield--1', usrfield, pwdfield);
          // this.callActiveDirectory(usrfield, pwdfield);
          //commented on 06-01-2023 to avoid login failure issue..
          //this.loginCall(usrfield, pwdfield);
      } else {
        // console.log('usrfield, pwdfield--2', usrfield, pwdfield);
        handleLoginCall(usrfield, pwdfield);
      }
    }
    // console.log('progressVisible:', progressVisible);
  }, [usersInfo.progressVisible]);

  // useEffect(() => {
  //   // Call storeUserSession with appropriate arguments
  //   console.log('reach here', usersInfo?.loginDetail, usersInfo?.isLogin)
  //   if(usersInfo?.loginDetail && usersInfo?.isLogin){
      
  //     storeLoginData(usersInfo?.loginDetail?.data?.Data);
     
  //   }
  // }, [usersInfo?.loginDetail, usersInfo?.isLogin]); 


  const showToast = (msg) => {
    // Toast.show("This is a toast message!", Toast.SHORT);
    Toast.showWithGravity(
      msg,
      Toast.LONG,
      Toast.TOP,
    );
  };

//  console.log("get username, password", usersInfo.username, usersInfo.password, usersInfo?.loginDetail)

  const handleLogin = () => {
    Keyboard.dismiss();
    let usrfield = usersInfo.username;
    let pwdfield = usersInfo.password;
    console.log('handleLogin', usersInfo.username, usersInfo.password)
    if (pwdfield === '' || usrfield === '') {
      // showToast(strings.LoginCred)
      showWarningMessage(strings.LoginCred);
    } else {
      // console.log('Email and password', usrfield, pwdfield)
      // if (this.props.data.audits.isOfflineMode) {
      //   // this.refs.toast.show(strings.Offline_Notice);
      //   showToast(strings.Offline_Notice)
      // } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            setUsersInfo({ ...usersInfo, progressVisible: true})
          } else {
            // showToast(strings.NoInternet)
            showWarningMessage(strings.NoInternet);
          }
        });
      // }
    }
  };

  const handleLoginCall = async (email, password, isSso) => {
    // await this.getDeviceId()
    // console.log('deviceId--->', this.state.deviceId)
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    var encryptedpassword = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    let fcmToken = ''
    // let deviceId = '21a552b5372b89be'
    // let deviceId = await DeviceInfo.getUniqueId();
    // console.log('deviceId1', deviceId1)
    let deviceId = 'bbf71267186ba22b'
    try {
      auth.loginUser(
        email,
        encryptedpassword.toString(),
        // this.state.fcmToken,
        // this.state.deviceId,
        fcmToken,
        deviceId,
        isSso,
        (res, data) => {
          console.log('loginUser', data);
          //this.props.storeSupplierManagement("true");
          if (data.data.Success == true) {
            console.log(
              'data success checking', data.data.Success,
            );
            const stringifiedLoginDetails = JSON.stringify(data);
            AsyncStorage.setItem('loginDetails', stringifiedLoginDetails);
            console.log('Set Async loginDetails ', stringifiedLoginDetails)
            setUsersInfo({ ...usersInfo, loginDetails: data })
            navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING, { projectTitle: title, status: projectStatus, category: category }) 
            
          } else {
            setUsersInfo({ ...usersInfo, progressVisible: false });
            // showToast(data.data.Message)
            showWarningMessage(data.data.Message);
            console.log(data.data.Message, '//////loginmessage////////');
          }
        },
      );
    } catch (err) {
      console.log('login err', err);
      showErrorMessage('Network Error!!');
    }
  };

  // console.log('usersInfo values outer', usersInfo)

  // const handleLogin = () => {
  //   // Validate username and password
  //   if (username.trim() === '' || password.trim() === '') {
  //     alert('Please enter username and password');
  //     return;
  //   }
  //   // Call login function passed from parent component
  //   onLogin(username, password);
  // };

  const handleClose = () => {
    Keyboard.dismiss()
    onClose()
    console.log('click close modal')
    navigations.navigate(ROUTES.HOME_FAB_VIEW)
  };

  const usrFieldVal = () => {
    let usrfield = usersInfo.username;
    console.log('usrFieldVal', usersInfo.username)
    if (usrfield === '') {
      showToast(strings.NullUnm)
    } else if (usrfield !== '') {
      let lastAtPos = usrfield.lastIndexOf('@');
      let lastDotPos = usrfield.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          usrfield.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          usrfield.length - lastDotPos > 2
        )
      ) {
        showToast(strings.EmailInvalid)
      } else {
        return true;
      }
    }
    return false;
  };

  const pwdFieldVal = () => {
    let pwdfield = usersInfo.password;
    if (pwdfield === '') {
      showToast(strings.PwdNull)
    } else if (pwdfield !== '') {
      if (pwdfield.length < 8) {
        showToast(strings.Passwordlengthcannotbelessthan)
      } else if (!pwdfield.match(/^[a-zA-Z]+$/)) {
        showToast(strings.Passwordshouldnotcontainspecialcharacters)
      } else {
        return true;
      }
    }
    return false;
  };

  // const callActiveDirectory(username, password) = () => {
  //   var activeURL = this.props.data.audits.serverUrl;
  //   var filterURL1 = activeURL.replace('AuditPro', 'EwQIMS');
  //   var filterURL2 = filterURL1.replace('api', 'common');
  //   var ADdomain =
  //     'ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=' +
  //     username +
  //     '&Password=' +
  //     password;
  //   // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=svibu&Password=P@ssw0rd
  //   const check = create({
  //     baseURL: filterURL2 + ADdomain,
  //   });
  //   check
  //     .post()
  //     .then(res => {
  //       // console.log('AD response',res)
  //       if (res.data == 'False') {
  //         this.setState(
  //           {
  //             progressVisible: false,
  //           },
  //           () => {
  //             alert(strings.usernotallowed);
  //           },
  //         );
  //       } else {
  //         this.loginCall(username, password);
  //       }
  //     })
  //     .catch(err => console.warn(err));
  // }



  return (
    <View style={styles.container}>
      <Modal
        visible={isLoginVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onClose={() => handleClose()}
        >
        <TouchableWithoutFeedback onPressOut={() => handleClose()}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '100%' }}>
            <KeyboardAvoidingView behavior="padding" style={styles.boxView}>
            {/* , maxHeight: '55%', height: 'auto', paddingTop: '5%' */}
            <View>
              <View>
                <View style={styles.inputBox1}>
                  <InputField
                    placeholder={strings.Username}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    // value={this.state.username}
                    // onChangeText={username => this.setState({username})}
                    // onBlur={this.usrFieldVal}
                    value={usersInfo.username}
                    onChangeText={(username) => {
                      console.log('username---onchange', username, usersInfo.username)
                      setUsersInfo({...usersInfo, username})
                    }}
                    onBlur={usrFieldVal}
                    type={'Username'}
                  />
                </View>
                <View style={styles.inputBox1}>
                  <InputField
                    placeholder={strings.Password}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    // value={this.state.password}
                    // onChangeText={password => this.setState({password})}
                    value={usersInfo.password}
                    onChangeText={(password )=> setUsersInfo({...usersInfo, password})}
                    secureTextEntry
                    type={'Password'}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.LoginBox01]}>
              <TouchableOpacity
                onPress={() =>
                //   if (
                //     this.state.checkboxSelection === 'ewqims' ||
                //     this.state.ssoEnabled === false
                //   ) {
                //     this.onPress();
                //   } else {
                //     this.ssoOnPress();
                //   }
                handleLogin()
                }
                >
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
                  style={styles.LoginBtn01}>
                  <Text style={styles.LoginText}>{strings.Login}</Text>
                </LinearGradient>
              </TouchableOpacity>
               <TouchableOpacity
               
                >
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
                  style={styles.LoginBtn01}>
                  <Text style={styles.LoginText}>{strings.Register}</Text>
                </LinearGradient>
              </TouchableOpacity> 
            </View>


              {/* <TextInput
                autoFocus={true}
                placeholder="Username"
                value={username}
                onChangeText={text => setUsername(text)}
                style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, borderRadius: 25, }}
                // style={styles.inputBox}
              /> */}

              {/* <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, borderRadius: 25, }}
                // style={styles.inputBox}
              /> */}

              {/* <TouchableOpacity style={styles.ButtonBox}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
                    style={styles.LoginBtn}
                    >
                      <Text 
                      style={styles.buttonText}
                      >Login</Text>
                  </LinearGradient>
              </TouchableOpacity> */}

            </KeyboardAvoidingView>
          </SafeAreaView>
          {/* </ScrollView> */}
          {/* </KeyboardAvoidingView> */}
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'relative',
    // zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  boxView: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    height: '30%',
    justifyContent: 'center',
  },
  inputBox: {
    width: '100%',
    top: 0,
    // marginTop: 5,
    // height: height(8),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ButtonBox: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'white',
    width: '100%',
    maxHeight:'25%',
    height: 'auto',
    marginBottom: 0,
    marginTop: '5%'
  },
  LoginBtn: {
    width: '60%',
    height: '80%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    // top: '25%',
    // bottom: '25%'
  },
  buttonText: {
    textAlign: 'center',
    //margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: Fonts.size.mediuml,
    fontFamily: 'OpenSans-Bold',
  },
  inputBox1: {
    // width: '100%',
    //height:height(9),
    backgroundColor: 'transparent',
    // margin: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  LoginBox01: {
    // width: Window.width,
    top: 0,
    // marginTop: 10,
    marginTop: 10,
    height: height(8),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  LoginBtn01: {
    width: width(30),
    height: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    // marginRight: '4%'
  },
  LoginText: {
    textAlign: 'center',
    //margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: Fonts.size.input,
    fontFamily: 'OpenSans-Bold',
  },
  RegisterText: {
    textAlign: 'center',
    //margin: 10,
    color: 'black',
    backgroundColor: 'transparent',
    fontSize: Fonts.size.input,
    fontFamily: 'OpenSans-Bold',
  },
  // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%' }}>
});

// export default LoginPopup;

const mapStateToProps = state => {
  return {
    data: state,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    storeUserSession: (
      userName,
      userId,
      token,
      siteId,
      address,
      companyname,
      companyurl,
      logo,
      phone,
    ) =>
      dispatch({
        type: 'STORE_USER_SESSION',
        userName,
        userId,
        token,
        siteId,
        address,
        companyname,
        companyurl,
        logo,
        phone,
      }),
    storeYearAudits: yearAudits =>
      dispatch({type: 'STORE_YEAR_AUDITS', yearAudits}),
    storeLoginSession: isActive =>
      dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
    storeAuditRecords: auditRecords =>
      dispatch({type: 'STORE_AUDIT_RECORDS', auditRecords}),
    storeCameraCapture: cameraCapture =>
      dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    storeLanguage: language => dispatch({type: 'STORE_LANGUAGE', language}),
    storeAuditStats: (
      scheduled,
      completed,
      DeadlineViolated,
      CompletedDeadlineViolated,
    ) =>
      dispatch({
        type: 'STORE_AUDIT_STATS',
        scheduled,
        completed,
        DeadlineViolated,
        CompletedDeadlineViolated,
      }),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
    changeConnectionState: isConnected =>
      dispatch({type: 'CHANGE_CONNECTION_STATE', isConnected}),
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeDateFormat: userDateFormat =>
      dispatch({type: 'STORE_DATE_FORMAT', userDateFormat}),
    registrationState: isDeviceRegistered =>
      dispatch({type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered}),
    updateRecentAuditList: recentAudits =>
      dispatch({type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits}),
    storeUserName: loginuser => dispatch({type: 'STORE_USER_NAME', loginuser}),
    storeLoginData: logindata =>
      dispatch({type: 'STORE_LOGIN_DATA', logindata}),

    storeSupplierManagement: suppliermanagementstatus =>
      dispatch({type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus}),
    updateAuditCount: auditCount =>
      dispatch({type: 'UPDATE_AUDIT_COUNT', auditCount}),
    updateDynamicAuditCount: data =>
      dispatch({type: 'UPDATE_DYNAMIC_AUDIT_COUNT', data}),
    storeSiteId: siteId =>
      dispatch({type: 'STORE_SITE_ID', siteId}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);



