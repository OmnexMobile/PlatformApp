import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  LogBox,
} from 'react-native';
//styles
import styles from '../styles/AuditDashboardListingStyle';
//components
import OfflineNotice from '../components/OfflineNotice';  
import AuditCard from '../components/AuditCard';
//library
import * as _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import {DoubleBounce} from 'react-native-loader';
import {connect} from 'react-redux';
//assets
import {Fonts, Images} from '../../auditPro/Themes';
import Icon from 'react-native-vector-icons/FontAwesome';
//services
import auth from '../../../services/Auditpro-Auth';
//strings
import {strings} from '../../auditPro/language/Language';
//const
import constant from '../../auditPro/constants/AppConstants';
// import { NavigationEvents } from 'react-navigation';
import CryptoJS from 'react-native-crypto-js'
import AsyncStorage from '@react-native-community/async-storage';
import { SPACING } from 'constants/theme-constants';
import DeviceInfo from 'react-native-device-info';
import { ROUTES } from 'constants/app-constant';
// import firebase from 'react-native-firebase';
var RNFS = require('react-native-fs');

const {whitneyBook_18} = Fonts.style;
const {blackGrey} = Fonts.colors;

class AuditDashboardListing extends Component {
  constructor(props) {
    super(props);
    console.log('get props---->', props)
    this.pageSize = 10;
    this.pageNo = 1;
    this.onEndReachedCalledDuringMomentum = false;
    // this.filterId = this.props.navigation.getParam('filterId');
    this.filterId = this.props?.route?.params?.filterId
    this.state = {
      listEndReached: false,
      loader: true,
      error: false,
      subLoader: false,
      auditList: [],
      auditListAll: [],
      userFullName: '',
      userId: '',
      siteId: '',
      accessToken: '',
      fcmToken: '',
      deviceId: '',
      currentAuditList: [],
      currentLoginDetails: null,
      projectData: null,
      currentUserData: null,
    };
  }

  componentDidMount() {
    LogBox.ignoreLogs(["componentWillReceiveProps has been renamed"])
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
      });
    }
    this.focusListener = this.props.navigation.addListener('focus', () => {
      console.log('AuditDashboardListing focused');
      this.loginCall()
      this.getAudits();
    });
    // this.getAudits()
  }

  componentWillUnmount() {
    this.focusListener();
  }

  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   if (fcmToken) {
  //     this.setState(
  //       {
  //         fcmToken: fcmToken,
  //       },
  //       () => {
  //         console.log('login fcmToken',this.state.fcmToken)
  //       },
  //     );
  //   }
  //   if (!fcmToken) {
  //     fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       // user has a device token
  //       await AsyncStorage.setItem('fcmToken', fcmToken);
  //       this.setState(
  //         {
  //           fcmToken: fcmToken,
  //         },
  //         () => {
  //           // console.log('login fcmToken',this.state.fcmToken)
  //         },
  //       );
  //     }
  //   }
  // }

  async getDeviceId() {
    let deviceId = await AsyncStorage.getItem('deviceid')
    this.setState({
      deviceId,
    });
    console.log('tret1 getDeviceId get--', deviceId)
    return deviceId
  }

  async getLoginDetails(){
    try {
      const stringifiedLoginDetails = await AsyncStorage.getItem('loginDetails');
      const value = JSON.parse(stringifiedLoginDetails);
      console.log('current loginDetails--->', value)
      if (value !== null) {
        this.setState({ currentLoginDetails: value },()=>{
          console.log('Token set')
        })
      }
    } catch (e) {
      // error reading value
      console.log('error--->', e)
    }
  };

  async getUserDetails(){
    try {
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = JSON.parse(stringifiedUserDetails);
      console.log('current userDetails--->', value)
      if (value !== null) {
        this.setState({ currentUserData: value },()=>{
          console.log('Token set')
        })
      }
    } catch (e) {
      // error reading value
      console.log('error--->', e)
    }
  };

  // handleLoginCall = async () => {
  //   await this.getUserDetails()
  //   console.log('currentUserData--->', this.state.currentUserData)
  //   console.log("nR===>",this.props.data.audits.isDeviceRegistered)
  //   const isDeviceRegisteredLog = await AsyncStorage.getItem('isdeviceregistered');
  //   console.log('loginscreenisDeviceRegisteredLog:::::=====',isDeviceRegisteredLog);
  //   if(isDeviceRegisteredLog == "no"){
  //     console.log('checking the device Registered or not-----------',this.props.data.audits.isDeviceRegistered);
  //     alert('Register the device before login..')
  //   } else {
  //     let usrfield = this.state.currentUserData;
  //     let pwdfield = this.state.currentUserData;
  //     this.setState({
  //       loginFlag: 1
  //     })
  //     console.log('username and password', usrfield, pwdfield)
  //     if (this.props?.data?.audits?.isOfflineMode) {
  //       this.refs.toast.show(strings.Offline_Notice);
  //     } else {
  //       await AsyncStorage.setItem('ssologinstatusbool', "false");
  //       NetInfo.fetch().then(netState => {
  //         if (netState.isConnected) {
  //           this.setState(
  //             {
  //               progressVisible: true,
  //             },
  //             () => {
  //               // check active directoery
  //               if (
  //                 this.state.isActiveDirectory == true &&
  //                 this.state.isAdvalue == true
  //               ) {
  //                 this.callActiveDirectory(usrfield, pwdfield);
  //                 //commented on 06-01-2023 to avoid login failure issue..
  //                 //this.loginCall(usrfield, pwdfield);
  //               } else {
  //                 this.loginCall(usrfield, pwdfield, this.state.loginFlag);
  //               }
  //             },
  //           );
  //         } else {
  //           this.refs.toast.show(strings.NoInternet);
  //         }
  //       });
  //     }  
  //   }
  // }

  storeData = async (key, value) => {
    console.log('checking assync details----------',key , value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };


  loginCall = async () => {
    await this.getUserDetails()
    console.log('currentUserData---get', this.state.currentUserData)
    await this.getDeviceId()
    console.log('deviceId--->', this.state.deviceId)
    const loginDetails = this.state.currentUserData
    if (loginDetails?.success == true) {
      console.log('data value checking' + loginDetails?.data);
      this.props.storeLoginData(loginDetails?.data);
      this.props.storeSupplierManagement(
        loginDetails?.data[0]?.SupplierManagementAccess,
      );
      console.log('tret1 data.data', loginDetails?.data);
      console.log('default---siteId', this.props?.data?.audits?.siteId?.length, this.props?.data?.audits?.siteId, loginDetails?.data[0].Siteid)

      this.props.storeUserName(loginDetails?.data[0]?.FullName);
      // this.checkUsers(data.data.Data[0].UserId.toString(), data.data.Token)
      this.storeData('loginDeviceId', this.state.deviceId);
      this.storeData('loginFcmToken', this.state.fcmToken);
      this.storeData('loginEmail', loginDetails?.data[0]?.FullName);
      this.setState(
        {
          userId: loginDetails?.data[0]?.UserId.toString(),
          siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : loginDetails?.data[0]?.Siteid,
          // siteId: data.data.Data[397].Siteid,
          // siteId: data.data.Data[0].Siteid,
          accessToken: loginDetails?.accessToken,
          userFullName: loginDetails?.data[0]?.FullName,
        },
        () => {
          this.getProfileCall(this.state.accessToken);
          this.checkUsers(this.state.userId, this.state.accessToken);
          this.getAudits();
          console.log('tret1 reached login data stored');
        },
      );
      // const userDetails = {
      //   userId: loginDetails?.data[0]?.UserId.toString(),
      //   siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : loginDetails?.data[0]?.Siteid,
      //   // siteId: data.data.Data[0].Siteid,
      //   accessToken: loginDetails?.accessToken,
      //   userFullName: loginDetails?.data[0]?.FullName,
      // };
      // const stringifiedUserDetails = JSON.stringify(userDetails);
      // AsyncStorage.setItem('userDetails', stringifiedUserDetails);
      // console.log('Set Async userDetails ', stringifiedUserDetails)
    } else {
      console.log(loginDetails?.message, 'tret1 //////loginmessage////////');
    }
  };

  // loginCall = async (email, password, isSso) => {
  //   await this.getDeviceId()
  //   console.log('deviceId--->', this.state.deviceId)
  //   // await this.getToken()
  //   // console.log('deviceId--->', this.state.fcmToken)
  //   // let fcmToken1 = await firebase.messaging().getToken();
  //   // console.log('tret1 fcmToken1:' + fcmToken1)
  //   // let deviceId = await AsyncStorage.getItem('deviceid')
  //   // console.log('tret1 Device ID:' + deviceId)
  //   var key = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
  //   var encryptedpassword = CryptoJS.AES.encrypt(
  //     CryptoJS.enc.Utf8.parse(password),
  //     key,
  //     {
  //       keySize: 128 / 8,
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7,
  //     },
  //   );

  //   // console.log('login submit fcmToken',this.state.fcmToken)
  //   // console.log('hi', auth.loginUser);
  //   // console.log('tret1 Device ID:' + this.state.deviceId);
  //   // console.log('tret1 Device ID----:', this.getDeviceId());
  //   // console.log('Device ID:' + this.props.data.audits.deviceregisterdetails);
  //   // let fcmToken = this.state.fcmToken
  //   // let deviceId = this.state.deviceId || '21a552b5372b89be'
  //   let fcmToken = ''
  //   // let deviceId = '21a552b5372b89be'

  //   // let deviceId = await DeviceInfo.getUniqueId();
  //   // console.log('deviceId1', deviceId1)
  //   let deviceId = 'bbf71267186ba22b'
  //   auth.loginUser(
  //     email,
  //     encryptedpassword.toString(),
  //     fcmToken,
  //     // this.state.deviceId,
  //     deviceId,
  //     isSso,
  //     (res, data) => {
  //       console.log('tret1 loginUser', data, res);
  //       //this.props.storeSupplierManagement("true");
  //       if (data.data.Success == true) {
  //         // console.log(
  //         //   'data value checking' + data.data.Data[0].SupplierManagementAccess,
  //         // );
  //         this.props.storeLoginData(data.data.Data);
  //         this.props.storeSupplierManagement(
  //           data.data.Data[0].SupplierManagementAccess,
  //         );
  //         console.log('tret1 data.data1', data.data.Data[397]);
  //         console.log('tret1 data.data', data.data);
  //         console.log('default---siteId', this.props?.data?.audits?.siteId?.length, this.props?.data?.audits?.siteId, data.data.Data[397].Siteid)

  //         this.props.storeUserName(email);
  //         // this.checkUsers(data.data.Data[0].UserId.toString(), data.data.Token)
  //         this.setState(
  //           {
  //             userId: data.data.Data[0].UserId.toString(),
  //             siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : data.data.Data[397].Siteid,
  //             // siteId: data.data.Data[397].Siteid,
  //             // siteId: data.data.Data[0].Siteid,
  //             accessToken: data.data.Token,
  //             userFullName: data.data.Data[0].FullName,
  //           },
  //           () => {
  //             this.getProfileCall(this.state.accessToken);
  //             this.checkUsers(this.state.userId, this.state.accessToken);
  //             this.getAudits();
  //             console.log('tret1 reached login data stored');
  //           },
  //         );
  //         const userDetails = {
  //           userId: data.data.Data[0].UserId.toString(),
  //           siteId: this.props?.data?.audits?.siteId?.length ? this.props.data.audits.siteId : data.data.Data[397].Siteid,
  //           // siteId: data.data.Data[0].Siteid,
  //           accessToken: data.data.Token,
  //           userFullName: data.data.Data[0].FullName
  //         };
  //         const stringifiedUserDetails = JSON.stringify(userDetails);
  //         AsyncStorage.setItem('userDetails', stringifiedUserDetails);
  //         console.log('Set Async userDetails ', stringifiedUserDetails)
  //       } else {
  //         console.log(data.data.Message, 'tret1 //////loginmessage////////');
  //         // this.setState(
  //         //   {
  //         //     progressVisible: false,
  //         //   },
  //         //   () => {
  //         //     this.toast.show(data.data.Message, DURATION.LENGTH_LONG);
  //         //     console.log(data.data.Message, '//////loginmessage////////');
  //         //   },
  //         // );
  //       }
  //     },
  //   );
  // };

  getProfileCall(token) {
    var Token = token;
    console.log('Profile getting details...',Token)
    //alert('profile called --login')
    auth.getProfile(Token, (res, data) => {
      console.log('--->',data)
      if (data?.data) {
        if (data?.data?.Message === 'Success') {
          console.log('getting into if',data)
          // alert('Profile data get --login')
          this.setState(
            {
              Address: data?.data?.Data?.Address,
              CompanyName: data?.data?.Data?.CompanyName,
              CompanyUrl: data?.data?.Data?.CompanyUrl,
              Logo: data?.data?.Data?.Logo,
              Phone: data?.data?.Data?.Phone,
            },
            () => {
              // console.log('settings address...',this.state.Address)
              // console.log('setting companyname...',this.state.CompanyName)
              // console.log('setting CompanyUrl',this.state.CompanyUrl)
              // console.log(' setting Logo...',this.state.Logo)
              // console.log('setting Phone...',this.state.Phone)
              this._storeToken();
            },
          );
        } else {
          // this.toast.show(
          //   strings.ProfileFetchFailed,
          //   DURATION.LENGTH_LONG,
          // );
        }
      } else {
        this.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
      }
    });
  }

  _storeToken = () => {
    console.log('*********','_storeToken', this.props)
    try {
      // Store audit list in redux store to set it in persistant storage
      this.props.storeSiteId(this.props?.data?.audits?.siteId);
      this.props.storeUserSession(
        this.state.userFullName,
        this.state.userId,
        this.state.accessToken,
        this.state.siteId,
        this.state.Address,
        this.state.CompanyName,
        this.state.CompanyUrl,
        this.state.Logo,
        this.state.Phone,
      );
      this.storelogindetails(
        this.state.userFullName,
        this.state.userId,
        this.state.accessToken,
        this.state.siteId,
        this.state.Address,
        this.state.CompanyName,
        this.state.CompanyUrl,
        this.state.Logo,
        this.state.Phone,
      );
      this.props.storeLoginSession(true);
      // console.log('LoginUIScreen Props After Props Changing...', this.props)
      // console.log('Session created and stored the values.')
      this.setState(
        {
          progressVisible: false,
        },
        () => {
          //this.props.navigation.navigate('SupplyManage')
          //this.props.navigation.navigate("AllTabAuditList");
          console.log(
            'supplier management value' +
              this.props?.data?.audits?.suppliermanagementstatus,
          );
          if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
            this.props.navigation.navigate(ROUTES?.SUPPLY_MANAGE);
          } else {
            // this.props.navigation.navigate('AllTabAuditList');
          }
        },
      );
    } catch (error) {
      // Error saving data
      // console.log('Failed to create a login session!!!')
    }
  };

  checkUsers(ID, token) {
    console.log('tret3 reached checkUser', ID, token);
    var UserStatus = '';
    console.log('Getting last user session',this.props?.data)
    console.log('User trying to log in',ID)
    var currentID = this.props?.data?.audits?.userId;
    auth.getCheckUser(ID, token, (res, data) => {
      console.log('tret3 LoginUI:User information', data);

      if (data?.data?.Message == 'Success') {
        if (data?.data?.Data?.ActiveStatus)
          UserStatus = data?.data?.Data?.ActiveStatus;
        else {
          //alert('Active Status not getting..:'+data.data.Data.ActiveStatus)
        }
        console.log(" tret3LoginUI:Currnt:",currentID, "--", "id:",ID);
        if (UserStatus == 2) {
          // if (currentID != ID) {
          //   console.log('LoginUI:multipleAuditUser');
          //   this.multipleAuditUser(ID);
          //   // this.refillStoreValues(ID);
          // } else {
            console.log('tret3 LoginUI:Same user detected');
            this.refillStoreValues(ID);
          // }
        } else {
          console.log('tret3 checkuser API userStatus is not 2')
          // this.setState(
          //   {
          //     progressVisible: false,
          //   },
          //   () => {
          //     this.toast.show(
          //       strings.not_permitted,
          //       DURATION.LENGTH_SHORT,
          //     );
          //   },
          // );
        }
      } else {
        console.log('tret3 CheckUser API Error')
        // this.setState(
        //   {
        //     progressVisible: false,
        //   },
        //   () => {
        //     this.toast.show(
        //       strings.error_connecting,
        //       DURATION.LENGTH_SHORT,
        //     );
        //   },
        // );
      }
    });
  }

  refillStoreValues(UserId){
    // var propsServerUrl = 'https://omn-qa-forvia.ewqims.com/auditproapi/api/';
    var propsServerUrl = 'https://saasmobile.ewqims.net/AuditproApi/api/';
    var cleanURL = propsServerUrl?.replace(/^https?:\/\//, '');

    var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    this.propsServerUrl = formatURL;
    console.log('tret4 cleanURL', this.propsServerUrl);
    if (Platform.OS == 'android') {
      var path =
        // '/data/user/0/com.omnex.auditpro/cache/AuditUser' +
        // '/data/com.reactnativeboilerplatev70/cache' +
        // '/data/user/0/com.reactnativeboilerplatev70/cache/AuditUser' +
        // '/data/user/0/com.omnex.auditpro/cache/AuditUser' +
        '/storage/emulated/0/Android/data/com.reactnativeboilerplatev70/cache/AuditUser' +
        '/' +
        this.propsServerUrl +
        UserId;
      console.log('tret4 path-->', path);
      console.log('tret4 path1-->', RNFS.ExternalCachesDirectoryPath);
      RNFS.readFile(path).then(res => {
        console.log('tret4 reading from the User file', JSON.parse(res))
        var LoggedUserDetails = JSON.parse(res);
        console.log(LoggedUserDetails[0]?.audits?.userName + 'tret4 user name');
      })
      .catch(err => {
        console.log('tret4 refillStoreValues error', err)
      })
    }
  }

  render() {
    console.log('this.props', this.props)
    console.log('this.props?.route?.params?.category', this.props?.route?.params?.category)
    console.log('projectData---async', this.state.projectData)
    // console.log('CURRENT PAGE------->', 'AuditDashboardListing')
    // console.log('reached this.state', this.state)
    // console.log('reached this.state.auditList', this.state.auditList)
    // console.log('this.state.loader---', this.state.loader)
    // console.log('tret1 login data render', this.state.userFullName, this.state.userId, this.state.siteId, this.state.accessToken)
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
        {/* // Trigger getAudits method when initial render */}
        {/* <NavigationEvents onDidFocus={() => this.getAudits()} /> */}
        {/* Offline notification */}
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW)}
              onPress={() => this.props.navigation.navigate(ROUTES.AUDITPRODASHBOARD) }
              style={styles.backlogo}>
              <Icon name="angle-left" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {/* {this.props.navigation.getParam('title')} */}
                {/* {this.props?.route?.params?.category} */}
                {/* {this.state?.projectData?.projectCategory} */}
                {this.props?.route?.params?.title || this.state.projectData?.auditTitle}
              </Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() =>
                  // this.props.navigation.navigate('Home')
                  this.props.navigation.navigate(ROUTES.AUDITPRODASHBOARD)
                }
                >
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.auditPageBody}>
          {/* {
            (
              this.renderFlatList()
            )
          } */}
          {this.state.loader ? (
            <View style={styles.loaderParent}>
              <DoubleBounce size={20} color="#1CAFF6" />
            </View>
          ) : this.state.error ?
          (
            <View style={styles.errorWrapper}>
              <Text
                style={[
                  whitneyBook_18,
                  blackGrey,
                  {fontFamily: 'OpenSans-Regular'},
                ]}>
                {strings.No_records_found}
              </Text>
            </View>
          ) 
          : (
            this.renderFlatList()
          )}
        </View>
      </View>
    );
  }

  renderFlatList() {
    console.log('final this.state.auditList', this.state.auditList)
    console.log('this.props---renderFlatlist', this.props)
    return (
      this.state.auditList?.length ? 
      <FlatList
        contentContainerStyle={styles.listPadding}
        data={this.state.auditList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <AuditCard
            dateFormat={this.props.data.audits.userDateFormat}
            item={item}
            index={index}
            length={this.state.auditList.length + 1}
            naviData={this.props.navigation}
          />
        )}
        onEndReached={({distanceFromEnd}) => {
          /** we use this condition because will receive too many events after scroll end */
          if (!this.onEndReachedCalledDuringMomentum) {
            /** settng true user keep on dragging will elimintae unnecessary call */
            this.onEndReachedCalledDuringMomentum = true;
            this.setState({subLoader: true});
            this.getAudits();
          }
        }}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.listFooter.bind(this)}
        // ListFooterComponent={this.listFooter.bind(this)}
        // ListEmptyComponent={ <ActivityIndicator /> }
      /> 
      : 
      // this.state.subLoader ? <ActivityIndicator /> : 
      <View style={{marginTop: 60, justifyContent:'center', alignItems:'center'}}>
        <Text style={{ fontSize: Fonts.size.h5, color: 'grey', fontFamily:'OpenSans-Regular'}}>
          {strings.No_records_found}
        </Text>
      </View>
    )
  }

  listFooter() {
    if (this.state.subLoader) {
      return (
        <View style={styles.subLoaderWrap}>
          <DoubleBounce size={16} color="#1CAFF6" />
        </View>
      );
    } else {
      return null;
    }
  }

   async setAccessToken(accessToken) {
    if(accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
    }
  }

  async getProjectDetails() {
    try {
      const stringifiedProjectDetails = await AsyncStorage.getItem('projectDetails');
      const value = JSON.parse(stringifiedProjectDetails);
      console.log('current projectDetails--->', value)
      if (value !== null) {
        // value previously stored
        this.setState({
          projectData: value,
        });
      }
    } catch (e) {
      // error reading value
      console.log('projectDetails error--->', e)
    }
  }

  // getAudits() {
  //   console.log('trets getAudits-----', this.state.auditList, this.state.userFullName, this.state.userId, this.state.siteId, this.state.accessToken)
  //   this.setAccessToken(this.state.accessToken)
  //   NetInfo.fetch().then(netState => {
  //     if (netState.isConnected) {
  //       // const {userId, token} = this.props.data.audits;
  //       // const siteId = this.props.data.audits.siteId;

  //       var SM = this.props.data.audits.smdata;
  //       var GlobalFilter = '',
  //         StartDate = '',
  //         EndDate = '';
  //       var SortBy = '',
  //         SortOrder = '',
  //         Default = 1;
  //       let filterStr = '';

  //       if (this.filterId === 2) {
  //         filterStr = 'AuditStatus IN (2)';
  //       } else if (this.filterId === 3) {
  //         filterStr = 'AuditStatus IN (3)';
  //       } else if (this.filterId === 4) {
  //         filterStr = 'AuditStatus IN (4)';
  //       } else if (this.filterId === 5) {
  //         filterStr = 'AuditStatus IN (5)';
  //       }

  //       auth.getauditlist(
  //         // token,
  //         // userId,
  //         // siteId,
  //         this.state.accessToken,
  //         this.state.userId,
  //         this.state.siteId,
  //         this.pageNo,
  //         this.pageSize,
  //         filterStr,
  //         GlobalFilter,
  //         StartDate,
  //         EndDate,
  //         SortBy,
  //         SortOrder,
  //         SM,
  //         Default,
  //         (response, data) => {
  //           console.log('trets get audit list', data, 'response', response);
  //           if (data.data) {
  //             if (data.data.Message === 'Success') {
  //               console.log('trets get audit Data', data.data.Data);
  //               this.setState({
  //                 auditList: data.data.Data
  //               });
  //             }
  //             // (data?.data?.Data?.length) ? this.transformAudits(data.data.Data) : null
  //           }
  //         }
  //       )
  //     }
  //   })
  // }

  async getAudits() {
    console.log('trets getAudits', this.state.auditList, this.state.userFullName, this.state.userId, this.state.siteId, this.state.accessToken)
    console.log('current trets siteId--->', this.props.data.audits.siteId)
    this.setAccessToken(this.state.accessToken)
    await this.getProjectDetails()
    await this.getUserDetails()
    console.log('currentUserData---get', this.state.currentUserData)
    console.log('projectData---get', this.state.projectData)
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        const {userId, token} = this.props?.data?.audits;
        const siteId = this.props?.data?.audits?.siteId;

        var SM = this.props?.data?.audits?.smdata;
        var GlobalFilter = '',
          StartDate = '',
          EndDate = '';
        var SortBy = '',
          SortOrder = '',
          Default = 1;
        let filterStr = '';
        console.log('test props---->',this.props?.route?.params?.fromHome,'---' ,this.props?.route?.params?.filterId, '----', this.state.projectData?.projectStatus)
        

        if (this.props?.route?.params?.fromHome === false) {
          console.log('test props---->iffffff', typeof this.props?.route?.params?.filterId)
          if (this.props?.route?.params?.filterId === 2) {
            filterStr = 'AuditStatus IN (2)';
          } else if (this.props?.route?.params?.filterId === 3) {
            filterStr = 'AuditStatus IN (3)';
          } else if (this.props?.route?.params?.filterId === 4) {
            filterStr = 'AuditStatus IN (4)';
          } else if (this.props?.route?.params?.filterId === 5) {
            filterStr = 'AuditStatus IN (5)';
          }
        } 
        else {
          console.log('test props---->else', this.state.projectData?.projectStatus)
            if (this.state.projectData?.projectStatus === 2) {
              filterStr = 'AuditStatus IN (2)';
            } else if (this.state.projectData?.projectStatus === 3) {
              filterStr = 'AuditStatus IN (3)';
            } else if (this.state.projectData?.projectStatus === 4) {
              filterStr = 'AuditStatus IN (4)';
            } else if (this.state.projectData?.projectStatus === 5) {
              filterStr = 'AuditStatus IN (5)';
            }
        }
          

        // console.log('trets', auth.getauditlist);
        console.log('trets data', token,userId,siteId, this.state.currentUserData);
        auth.getauditlist(
          // this.state.accessToken,
          // this.state.userId,
          // this.state.siteId,
          this.state.currentUserData?.accessToken || token ,
          this.state.currentUserData?.userId || userId,
          this.state.currentUserData?.siteId || siteId,
          this.pageNo,
          this.pageSize,
          filterStr,
          GlobalFilter,
          StartDate,
          EndDate,
          SortBy,
          SortOrder,
          SM,
          Default,
          (response, data) => {
            console.log('trets get audit list', data, 'response', response);
            if (data?.data) {
              if (data?.data?.Message === 'Success') {
                console.log('trets get audit Success', data?.data?.Message);
                console.log('trets get audit Success', data?.data?.Data);
                if (data?.data?.Data && data?.data?.Data?.length === 0) {
                  if (this.state?.auditList?.length === 0) {
                    console.log('trets this.state.auditList.length', this.state.auditList?.length);
                    this.setState({
                      loader: false,
                      error: true,
                      subLoader: false,
                      listEndReached: false,
                    });
                  } else {
                    console.log('trets this.state.auditList.length', this.state.auditList?.length);
                    this.setState({
                      loader: false,
                      error: false,
                      subLoader: false,
                      listEndReached: false,
                    });
                  }
                  this.onEndReachedCalledDuringMomentum = true;
                } else {
                  /** Validating api returns same amount of data */
                  if (this.state.auditList?.length === data?.data?.Data?.length) {
                    this.onEndReachedCalledDuringMomentum = true;
                    this.setState({
                      loader: false,
                      error: false,
                      subLoader: false,
                      listEndReached: true,
                    });
                  } else {
                    //we are incrementing the next request form data
                    this.pageSize = this.pageSize + 10;
                    /** We have succes api repsonse we need to populate in UI */
                    this.transformAudits(data?.data?.Data);
                    this.onEndReachedCalledDuringMomentum = false;
                  }
                }
              } else {
                /**
                 * Failure response checking the list already having data
                 * If list having data we just hide the loader
                 * else there is no data for first request we have to show error
                 */
                if (this.state.auditList.length === 0) {
                  this.setState({
                    loader: false,
                    error: true,
                    subLoader: false,
                    listEndReached: true,
                  });
                } else {
                  /** Api error but we have data in the list */
                  this.onEndReachedCalledDuringMomentum = false;
                  this.setState({
                    loader: false,
                    error: false,
                    subLoader: false,
                    listEndReached: false,
                  });
                }
              }
            } else {
              /**
               * Failure response checking the list already having data
               * If list having data we just hide the loader
               * else there is no data for first request we have to show error
               */
              if (this.state.auditList.length === 0) {
                this.setState({
                  loader: false,
                  error: true,
                  subLoader: false,
                  listEndReached: true,
                });
              } else {
                /** Api error but we have data in the list */
                this.onEndReachedCalledDuringMomentum = false;
                this.setState({
                  loader: false,
                  error: false,
                  subLoader: false,
                  listEndReached: false,
                });
              }
            }
          },
        )
      } else {
        /** Users is offline */
        this.setState({
          loader: false,
          error: true,
        });
      }
    });
  }

  // transformAudits(audits) {
  //   var auditList = [];
  //   var auditListProps = this.props.data.audits.auditRecords;
  //   var filteredAuditList = [];
  //   console.log("AuditListProps11111", this.props)
  //   console.log("AuditListProps2222", audits)
  //   console.log("AuditListProps", auditListProps)
  //   console.log('this.state.userId--->', this.state.userId)

  //   for (var i = 0; i < audits.length; i++) {
  //     var auditInfo = audits[i];
  //     auditInfo['color'] = '#1081de';
  //     auditInfo['cStatus'] = constant.StatusScheduled;
  //     auditInfo['key'] = this.keyVal + 1;
  //     auditInfo['userId'] = this.state.userId;
  //     // audits.userId = this.state.userId;


  //     // Set Audit Status
  //     if (audits[i].CloseOutStatus == 9 || audits[i].CloseOutStatus == 7) {
  //       auditInfo['cStatus'] = constant.StatusCompleted;
  //     } else 
  //     {
  //     if (audits[i].AuditStatus == 3) {
  //       auditInfo['cStatus'] = constant.Completed;
  //       // auditInfo['cStatus'] = constant.StatusScheduled;
  //     } else if (
  //       audits[i].AuditStatus == 2 &&
  //       audits[i].PerformStarted == 0
  //     ) {
  //       auditInfo['cStatus'] = constant.StatusScheduled;
  //     } else if (
  //       audits[i].AuditStatus == 2 &&
  //       audits[i].PerformStarted == 1
  //     ) {
  //       auditInfo['cStatus'] = constant.StatusProcessing;
  //     } else if (audits[i].AuditStatus == 4) {
  //       auditInfo['cStatus'] = constant.StatusDV;
  //     } else if (audits[i].AuditStatus == 5) {
  //       auditInfo['cStatus'] = constant.StatusDVC;
  //     }
  //   }
  //     for (var j = 0; j < auditListProps.length; j++) {
  //       if (
  //         parseInt(auditListProps[j].AuditId) ==
  //         parseInt(audits[i].ActualAuditId)
  //       ) {
  //         // Update Audit Status
  //         if (
  //           auditListProps[j].AuditRecordStatus == constant.StatusDownloaded ||
  //           auditListProps[j].AuditRecordStatus == constant.StatusNotSynced ||
  //           auditListProps[j].AuditRecordStatus == constant.StatusSynced
  //         ) {
  //           auditInfo['cStatus'] = auditListProps[j].AuditRecordStatus;
  //         }
  //         break;
  //       }
  //     }

  //     // Set Audit Card color by checking its Status
  //     switch (auditInfo['cStatus']) {
  //       case constant.StatusScheduled:
  //         auditInfo['color'] = '#1081de';
  //         break;
  //       case constant.StatusDownloaded:
  //         auditInfo['color'] = '#cd8cff';
  //         break;
  //       case constant.StatusNotSynced:
  //         auditInfo['color'] = '#2ec3c7';
  //         break;
  //       case constant.StatusProcessing:
  //         auditInfo['color'] = '#e88316';
  //         break;
  //       case constant.StatusSynced:
  //         auditInfo['color'] = '#48bcf7';
  //         break;
  //       case constant.Completed:
  //         auditInfo['color'] = 'green';
  //         break;
  //       case constant.StatusDV:
  //         auditInfo['color'] = 'red';
  //         break;
  //       case constant.StatusDVC:
  //         auditInfo['color'] = 'green';
  //         break;
  //       default:
  //         auditInfo['color'] = '#000';
  //         break;
  //     }

  //     auditList.push(auditInfo);
  //     this.keyVal = this.keyVal + 1;

  //     // Filter Audit based on status
  //     // console.log("current get auditListProps", auditListProps)
  //     console.log("current this.props--->", audits[i].AuditStatus, this.props.route.params.projectTitle, this.props.route.params.status)
  //     console.log('current audits[i]---->', parseInt(audits[i].AuditStatus) ==
  //     parseInt(this.state?.projectData?.projectStatus) )
  //     console.log('current this.state?.projectData?.projectStatus---->', this.state?.projectData?.projectStatus, audits[i].AuditStatus )
  //     // for (var j = 0; j < auditListProps.length; j++) {
  //     //   console.log("current get auditListProps[j].AuditStatus", auditListProps[j].Status)
  //       if (
  //         parseInt(audits[i].AuditStatus) ==
  //         parseInt(this.state?.projectData?.projectStatus)
  //         // parseInt(this.props.route.params.status)
  //       ) {
  //         // console.log('current filter auditList--->', audits)
  //         filteredAuditList.push(audits[i])
  //       }
  //     // }
  //   }
  //   console.log('current get AuditList---', auditList)
  //   console.log('current get filteredAuditList---', filteredAuditList)

  //   this.setState({
  //     // auditList: auditList,
  //     auditList: filteredAuditList,
  //     // auditListAll: auditList,
  //     auditListAll: filteredAuditList,
  //     loader: false,
  //     error: false,
  //     subLoader: false,
  //     listEndReached: false,
  //   });
  // }


  transformAudits(audits) {
    var auditList = [];
    var auditListProps = this.props.data.audits.auditRecords;
    console.log('AuditListProps', auditListProps);

    for (var i = 0; i < audits.length; i++) {
      var auditInfo = audits[i];
      auditInfo['color'] = '#1081de';
      auditInfo['cStatus'] = constant.StatusScheduled;
      auditInfo['key'] = this.keyVal + 1;

      // Set Audit Status

      if (audits[i].AuditStatus == 3 && (audits[i].CloseOutStatus == "9" || audits[i].CloseOutStatus == "7")) {
        auditInfo['cStatus'] = constant.StatusCompleted;
      } else {
        if (audits[i].AuditStatus == 3 && audits[i].CloseOutStatus !== "9" && audits[i].CloseOutStatus !== "7") {
          auditInfo['cStatus'] = constant.Completed;
        } else if (
          audits[i].AuditStatus == 2 &&
          audits[i].PerformStarted == 0
        ) {
          auditInfo['cStatus'] = constant.StatusScheduled;
        } else if (
          audits[i].AuditStatus == 2 &&
          audits[i].PerformStarted == 1
        ) {
          auditInfo['cStatus'] = constant.StatusProcessing;
        } else if (audits[i].AuditStatus == 4) {
          auditInfo['cStatus'] = constant.StatusDV;
        } else if (audits[i].AuditStatus == 5) {
          auditInfo['cStatus'] = constant.StatusDVC;
        }
      }
      for (var j = 0; j < auditListProps.length; j++) {
        if (
          parseInt(auditListProps[j].AuditId) ==
          parseInt(audits[i].ActualAuditId)
        ) {
          // Update Audit Status
          if (
            auditListProps[j].AuditRecordStatus == constant.StatusDownloaded ||
            auditListProps[j].AuditRecordStatus == constant.StatusNotSynced ||
            auditListProps[j].AuditRecordStatus == constant.StatusSynced
          ) {
            auditInfo['cStatus'] = auditListProps[j].AuditRecordStatus;
          }
          break;
        }
      }

      // Set Audit Card color by checking its Status
      switch (auditInfo['cStatus']) {
        case constant.StatusScheduled:
          auditInfo['color'] = '#1081de';
          break;
        case constant.StatusDownloaded:
          auditInfo['color'] = '#cd8cff';
          break;
        case constant.StatusNotSynced:
          auditInfo['color'] = '#2ec3c7';
          break;
        case constant.StatusProcessing:
          auditInfo['color'] = '#e88316';
          break;
        case constant.StatusSynced:
          auditInfo['color'] = '#48bcf7';
          break;
        case constant.StatusCompleted:
          auditInfo['color'] = '#000';
          break;
        case constant.Completed:
          auditInfo['color'] = 'green';
          break;
        case constant.StatusDV:
          auditInfo['color'] = 'red';
          break;
        case constant.StatusDVC:
          auditInfo['color'] = 'green';
          break;
        default:
          auditInfo['color'] = '#000';
          break;
      }

      auditList.push(auditInfo);
      this.keyVal = this.keyVal + 1;
    }

    this.setState({
      auditList: auditList,
      auditListAll: auditList,
      loader: false,
      error: false,
      subLoader: false,
      listEndReached: false,
    });
  }


}

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

export default connect(mapStateToProps, mapDispatchToProps)(AuditDashboardListing);
