import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  CheckBox,
  Dimensions,
  Keyboard,
  Platform,
  BackHandler,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import CryptoJS from "crypto-js";
import styles from "../../auditPro/styles/LoginUIScreenStyle";
import InputField from "../../auditPro/components/shared/InputField";
import Images from "../../auditPro/Themes/Images";

import Toast, {DURATION} from 'react-native-easy-toast';
import auth from "../../../services/SupplierMgnt-Auth";
import { connect } from "react-redux";
import OfflineNotice from "../../auditPro/components/OfflineNotice";
import ResponsiveImage from "react-native-responsive-image";
import Fonts from "../../auditPro/Themes/Fonts";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome'
import { strings } from "../../auditPro/language/Language";
import { width, height } from "react-native-dimension";
import DeviceInfo from "react-native-device-info";
// import firebase from "react-native-firebase";
import NetInfo from "@react-native-community/netinfo";

// Static register nd login //

import {API_URL} from '../../../constants/SupplierMgnt/APIConstants';
import {isRegExp} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckBox as CheckedElement} from 'react-native-elements';
import {authorize, logout} from 'react-native-app-auth';
var RNFS = require("react-native-fs");

import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from "react-native-simple-dialogs";
import { create } from "apisauce";
import { add } from "lodash";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";
import { Bubbles } from "react-native-loader";

let Window = Dimensions.get("window");


// Form type -1- Online
// Form type -2- Reference
// Form type -0- Template

class SupplyManage extends Component {
  syncStatus = 0;
  isDocsAvail = false;
  auditAttachments = [];
  checkListObjects = [];
  formObjects = [];
  ncOfiObjects = [];
  TotalFile = [];
  FileArray = [];
  auditRecords = '';
  propsServerUrl = '';

  constructor(props) {
    super(props);
    console.log('current props--->', props)
    this.state = {
      token: "",
      CheckListbtn: false,
      isSyncing: false,
      Formname: "",
      ChecklistProp: [],
      Checkpointlogic: [],
      formDetails: [],
      TempList: [],
      RefList: [],
      OnlineList: [],
      Checkpointpass: [],
      dropvalue: [],
      AuditID: "",
      dialogVisible: false,
      isLoaderVisible: false,
      OnlineName: undefined,
      notifyRed: undefined,
      breadCrumbText: undefined,
      ActiveTab: 0,
      MandateCheck: false,
      isLowConnection: false,
      AuditOrderId: "",
      missingFileArr: [],
      isMissingFindings: false,
      mandatoryCheck: 0,
      confirmpwd: false,
      pwdentry: undefined,
      deviceId: '',
      isEmptyPwd: undefined,
      siteID: "",
      SupplierManagementAccess: "",
      // Static register //
      isLoading: true,
      isDeviceRegistered: '',
      deviceRegistration: '',
      serverUrl:
          this.props.data.audits.serverUrl == null ||
          this.props.data.audits.serverUrl == undefined ||
          this.props.data.audits.serverUrl == ''
              ? API_URL
              : this.props.data.audits.serverUrl,
      type: 1,
      screenWidth: Dimensions.get('window').width,
      // login //
      username: '',
      password: '',
      userId: '',
      siteId: '',
      accessToken: '',
      Address: '',
      CompanyName: '',
      CompanyUrl: '',
      Logo: '',
      Phone: '',
      ChineseScript: false,
      fcmToken: '',
      existingFile: [],
      progressVisible: false,
      userFullName: '',
      isActiveDirectory: false,
      isAdvalue: true,
      loginFlag: parseInt(''),
      loading: false,
    };
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.backAction();
      return true;
    });
  }

  backAction = () => {
    var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    var CurrentPage = this.props?.route?.name
    console.log("--CurrentPage--->", CurrentPage);

    if (PreviousPage == ROUTES.LOGINUISCREEN) {
      /*
      Alert.alert("Hold on!", "You must to select any one option", [
        {
          text: "Ok",
          onPress: () => null,
          style: "cancel",
        },
      ]);
      */
     alert("Please select one option to proceed.")
    } else {
      this.backHandler.remove();
    }
  };

    // Static register nd login //

  RestoringLoginData = async () => {
    try {
      const active = await AsyncStorage.getItem('isActive');
      console.log('isActive status:' + active);
      if (active !== null && active == 'yes') {
        this.setState({isDeviceRegistered: true});
        console.log('isdeviceregister status:' + this.isDeviceRegistered);
        await AsyncStorage.setItem('isdeviceregistered', 'yes');
        this.props.registrationState(this.state.isDeviceRegistered);
        this.props.storeDeviceid(this.state.deviceId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.setState({loading: true});
    console.log('logpropssssssssss',this.props);
    
    Dimensions.addEventListener('change', this.handleDimensionChange);

    async () =>{
      AsyncStorage.setItem('NCSettingvalue', JSON.stringify(data?.data?.Data?.ncofisetting));

    }
    console.log('unregisterlog5');

    // this.setState({serverUrl: 'https://cloudqa1.ewqims.com/auditproapi/api/'})
    this.getdeviceRegisterStatus();
    console.log('******************* printing here *********************');
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setState(
        {
          deviceId,
        },
        async () => {
          console.log('Registration screen mounted successfully!');
          this.RestoringLoginData();
          console.log('Registration screen url--->', this.state.serverUrl);
          var smIndex = await AsyncStorage.getItem('supplierIndex');
          console.log('smIndex componentDidMount----->', smIndex);
          auth.setServerUrl(this.state.serverUrl);
          if (this.props.data.audits.language === 'Chinese') {
            this.setState({ChineseScript: true}, () => {
              strings.setLanguage('zh');
              this.setState({});
              console.log('Chinese script on', this.state.ChineseScript);
            });
          } else if (
            this.props.data.audits.language === null ||
            this.props.data.audits.language === 'English'
          ) {
            this.setState({ChineseScript: false}, () => {
              strings.setLanguage('en-US');
              this.setState({});
              console.log('Chinese script off', this.state.ChineseScript);
            });
          }
          // console.log('this.props', this.props)
          // console.log('Received params',this.props.navigation.state.params)

        //   if (this.props.navigation.state.params) {
          if (this.props?.route?.params) {
            this.isRedirectFromLogin = true;
            console.log('checking navigation state params');
          }

          console.log(
            'isredirectfromlogin ',
            this.isRedirectFromLogin,
            this.props.data.audits.isOfflineMode,
          );

          if (this.props.data.audits.isOfflineMode) {
            if (this.props.data.audits.isDeviceRegistered) {
              if (!this.isRedirectFromLogin) {
                // Forward to landing page
                // this.props.navigation.navigate('LaunchScreen');
                console.log('LAUNCH_SCREENn 1111111')
                // this.props.navigation.navigate(ROUTES.LOGIN_SM)
                this.loginHandler()
                
              } else {
                this.setState(
                  {
                    isDeviceRegistered: true,
                    isLoading: false,
                  },
                  async () => {
                    await AsyncStorage.setItem('isdeviceregistered', 'yes');
                    this.props.registrationState(this.state.isDeviceRegistered);
                    await AsyncStorage.setItem('deviceid', this.state.deviceId);
                    this.props.storeDeviceid(this.state.deviceId);
                    console.log('isDeviceRegistered => 1',this.state.isDeviceRegistered)
                  },
                );
              }
            }
            console.log('Offline mode!');
            // this.refs.toast.show(strings.Offline_Notice, 2000);
          } else {
            console.log(
              'this.state.deviceId',
              this.state.deviceId,
              this.state.serverUrl,
            );
            //this.checkRegistrationStatus(this.state.deviceId)
            if (this.state.serverUrl !== '') {
              this.checkRegistrationStatus(this.state.deviceId);
            } else {
              console.log('Hitting here 1 else component');
              this.setState(
                {
                  isDeviceRegistered: false,
                  isLoading: false,
                  deviceRegistration: 'no',
                },
                async () => {
                  await AsyncStorage.setItem('isdeviceregistered', 'no');
                  console.log('registere2');
                  this.props.registrationState(this.state.isDeviceRegistered);
                  await AsyncStorage.setItem('deviceid', this.state.deviceId);
                  this.props.storeDeviceid(this.state.deviceId);
                },
              );
              console.log('Server url is empty');
            }
          }
          smIndex == 2 ? this.registerCall(2) : this.registerCall(3);
        },
      );
    });
  }

  componentWillUnmount() {
    // Dimensions.removeEventListener('change', this.handleDimensionChange);
  }

    async checkRegistrationStatus(deviceId) {
        NetInfo.fetch().then(netState => {
            console.log('netstate is', netState.isConnected);
            if (netState.isConnected) {
                console.log('this.state.deviceId', deviceId);
                //console.log('data value '+ data)
                auth.checkRegistrationStatus(
                    deviceId, //this.state.deviceId,
                    async (res, data) => {
                        if (data.data) {
                            let isRegistered = false;
                            console.log('data.data checkRegistrationStatus===>', data);
                            if (data.data.Data) {
                                if (
                                    data.data.Data.SSOActive !== null &&
                                    data.data.Data.SSOActive !== undefined
                                ) {
                                    isRegistered = data.data.Data.SSOActive;
                                    this.storeSSoCreds(isRegistered);
                                    //1q1this.storeSSoCreds(true);
                                }
                                console.log('isRegistered::::----', isRegistered.toString());
                                await AsyncStorage.setItem('isRegistered', isRegistered.toString())
                                if (
                                    data.data.Data.SSOFlags !== null &&
                                    data.data.Data.SSOFlags !== undefined &&
                                    Object.keys(data.data.Data.SSOFlags).length > 0 &&
                                    isRegistered === true
                                ) {
                                    this.storeSSoConfig(data.data.Data.SSOFlags);
                                } else {
                                    //this.storeSSoConfig({});
                                }
                                console.log('data.data.Data', data.data.Data);
                                console.log(
                                    'checking props' +
                                        this.props.data.audits.userFullName +
                                        this.props.data.audits.siteId +
                                        'user id:' +
                                        this.props.data.audits.userId +
                                        'token:' +
                                        this.props.data.audits.token +
                                        'isactive' +
                                        this.props.data.audits.isActive +
                                        'device registration status:' +
                                        this.props.data.audits.isDeviceRegistered,
                                );
                                //if (data.data.Data.Active || data.data.Data.ServerUrl || data.data.Data.ServerUrl != '') {
                                if (
                                    data.data.Data.Active ||
                                    this.props.data.audits.isDeviceRegistered == true
                                ) {
                                    console.log('if serverurl not empty then allowed!');
                                    if (
                                        data.data.Data.ServerUrl &&
                                        data.data.Data.ServerUrl != ''
                                    ) {
                                        this.props.storeServerUrl(data.data.Data.ServerUrl);
                                        await AsyncStorage.setItem(
                                            'storedserverrul',
                                            this.state.serverUrl,
                                        );
                                        auth.setServerUrl(data.data.Data.ServerUrl);
                                    }

                                    if (!this.isRedirectFromLogin) {
                                        this.props.registrationState(true);
                                        await AsyncStorage.setItem('isdeviceregistered', 'yes');
                                        await AsyncStorage.setItem('deviceid', this.state.deviceId);
                                        this.props.storeDeviceid(this.state.deviceId);
                                        // Forward to landing page
                                        // this.props.navigation.navigate('LaunchScreen');
                                        console.log(
                                            'LAUNCH_SCREENn 222222 ')
                                          // Static Changes for AM API
                                        // this.props.navigation.navigate(ROUTES.LOGIN_SM)
                                    } else {
                                        this.setState(
                                            {
                                                isDeviceRegistered: true,
                                                isLoading: false,
                                            },
                                            async () => {
                                                await AsyncStorage.setItem('isdeviceregistered', 'yes');
                                                await AsyncStorage.setItem('isRegistered', 'true')

                                                this.props.registrationState(
                                                    this.state.isDeviceRegistered,
                                                );
                                                await AsyncStorage.setItem(
                                                    'deviceid',
                                                    this.state.deviceId,
                                                );
                                                this.props.storeDeviceid(this.state.deviceId);
                                                console.log('isDeviceRegistered => 2',this.state.isDeviceRegistered)
                                            },
                                        );
                                    }
                                } else {
                                    console.log('Device is not registered with us!');
                                    this.setState(
                                        {
                                            isDeviceRegistered: false,
                                            isLoading: false,
                                            deviceRegistration: 'no',
                                        },
                                        async () => {
                                            await AsyncStorage.setItem('isdeviceregistered', 'no');

                                            console.log('registere1');
                                            this.props.registrationState(
                                                this.state.isDeviceRegistered,
                                            );
                                            await AsyncStorage.setItem(
                                                'deviceid',
                                                this.state.deviceId,
                                            );
                                            this.props.storeDeviceid(this.state.deviceId);
                                            // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                            // this.refs.toast.show(strings.NotReg, 2000);
                                        },
                                    );
                                }
                            } else {
                                console.log('Hitting here 1');
                                this.setState(
                                    {
                                        isDeviceRegistered: false,
                                        isLoading: false,
                                        deviceRegistration: 'no',
                                    },
                                    async () => {
                                        await AsyncStorage.setItem('isdeviceregistered', 'no');
                                        console.log('registere2');
                                        this.props.registrationState(this.state.isDeviceRegistered);
                                        await AsyncStorage.setItem('deviceid', this.state.deviceId);
                                        this.props.storeDeviceid(this.state.deviceId);
                                        // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                        // this.refs.toast.show(strings.server_reach_error, 2000);
                                    },
                                );
                            }
                        }
                    },
                );
            } else {
                if (this.props.data.audits.isDeviceRegistered) {
                    if (!this.isRedirectFromLogin) {
                        // Forward to landing page
                        // this.props.navigation.navigate('LaunchScreen');
                        console.log(
                            'LAUNCH_SCREENn 333333 ')
                        // this.props.navigation.navigate(ROUTES.LOGIN_SM)
                        this.loginHandler()
                    } else {
                        this.setState(
                            {
                                isDeviceRegistered: true,
                                isLoading: false,
                            },
                            async () => {
                                await AsyncStorage.setItem('isdeviceregistered', 'yes');
                                this.props.registrationState(this.state.isDeviceRegistered);
                                await AsyncStorage.setItem('deviceid', this.state.deviceId);
                                this.props.storeDeviceid(this.state.deviceId);
                                console.log('isDeviceRegistered => 3',this.state.isDeviceRegistered)
                            },
                        );
                    }
                }
                console.log('No Internet Connection found!');
                // this.refs.toast.show(strings.NoInternet, 2000);
            }
        });
    }
    
    async getdeviceRegisterStatus() {
        this.setState({
            deviceRegistration: await AsyncStorage.getItem('isdeviceregistered'),
        });
        console.log(this.state.deviceRegistration, 'deviceregistrationstatus');
    }
    
    storeSSoCreds = async sso => {
        console.log('Registration:SSO_Status', sso);
        sso =
            sso === undefined ||
            sso === null ||
            sso === '' ||
            sso === false ||
            sso === 'false'
                ? 'false'
                : 'true';
        await AsyncStorage.setItem('sso_login_state', sso.toString());
    };
    
    storeSSoConfig = async ssoConfig => {
        console.log('in', ssoConfig);
        await AsyncStorage.setItem('sso_config_flags', JSON.stringify(ssoConfig));
        await AsyncStorage.setItem('sso_issuer', JSON.stringify(ssoConfig.issuer));
        await AsyncStorage.setItem(
            'sso_clientid',
            JSON.stringify(ssoConfig.clientId),
        );
        await AsyncStorage.setItem(
            'sso_redirecturl',
            JSON.stringify(ssoConfig?.redirectUrl),
        );
    };
    
    //onPress
    
    handleRegister = type => {
        console.log('typereg', type);
        var re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
        if (this.state.serverUrl === '') {
            // this.refs.toast.show(strings.EmptyURL);
        } else if (!re.test(this.state.serverUrl)) {
            // this.refs.toast.show(strings.InvURL);
        } else {
            console.log('serverUrl', this.state.serverUrl);
            if (this.props.data.audits.isOfflineMode) {
                // this.refs.toast.show(strings.Offline_Notice, 2000);
            } else {
                NetInfo.fetch().then(netState => {
                    if (netState.isConnected) {
                        this.setState(
                            {
                                type: type,
                                isLoading: true,
                            },
                            async () => {
                                if (
                                    this.state.serverUrl != null &&
                                    this.state.serverUrl != ''
                                ) {
                                    this.props.storeServerUrl(this.state.serverUrl);
                                    await AsyncStorage.setItem(
                                        'storedserverrul',
                                        this.state.serverUrl,
                                    );
                                    auth.setServerUrl(this.state.serverUrl);
                                }

                                auth.registerDevice(
                                    this.state.deviceId,
                                    this.state.serverUrl,
                                    type,
                                    (res, data) => {
                                        console.log('Response data', data.data);

                                        if (data.data) {
                                            if (data.data.Success === true) {
                                                if (data.data.Data == 'Already 5 Device Registered!') {
                                                    // console.log('Device registration failed!')
                                                    this.setState(
                                                        {
                                                            isDeviceRegistered: false,
                                                            isLoading: false,
                                                            deviceRegistration: 'no',
                                                        },
                                                        async () => {
                                                            await AsyncStorage.setItem(
                                                                'isdeviceregistered',
                                                                'no',
                                                            );
                                                            console.log('registere3');
                                                            this.props.registrationState(
                                                                this.state.isDeviceRegistered,
                                                            );
                                                            await AsyncStorage.setItem(
                                                                'deviceid',
                                                                this.state.deviceId,
                                                            );
                                                            this.props.storeDeviceid(this.state.deviceId);
                                                            this.checkRegistrationStatus(this.state.deviceId);
                                                            // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                                            // this.refs.toast.show(strings.MaxCon, 2000);
                                                        },
                                                    );
                                                } else {
                                                  console.log('type--->else', type);
                                                    if (type == 1) {
                                                        console.log('Device is registered.');
                                                        // this.refs.toast.show(strings.DeviceRed);
                                                        this.setState(
                                                            {
                                                                isDeviceRegistered: true,
                                                                isLoading: false,
                                                            },
                                                            async () => {
                                                                await AsyncStorage.setItem(
                                                                    'isdeviceregistered',
                                                                    'yes',
                                                                );
                                                                console.log(
                                                                    'isDeviceRegistered =>',
                                                                    this.state.isDeviceRegistered,
                                                                );
                                                                this.props.registrationState(
                                                                    this.state.isDeviceRegistered,
                                                                );
                                                                this.checkRegistrationStatus(
                                                                    this.state.deviceId,
                                                                );
                                                                this.props.storeDeviceid(this.state.deviceId);
                                                                // Forward to landing page
                                                                // this.props.navigation.navigate('LaunchScreen');
                                                                console.log('LAUNCH_SCREENn 444444 ')
                                                                // this.props.navigation.navigate(ROUTES.LOGIN_SM)
                                                                this.loginHandler()
                                                            },
                                                        );
                                                    } else {
                                                      console.log('Device type is 2');
                                                      // this.props.navigation.navigate(ROUTES.LOGIN_SM)
                                                      this.loginHandler()
                                                      console.log('LAUNCH_SCREENn 555555 ')
                                                      //Static Changes for SM API
                                                    //     console.log('Device is unregistered.');
                                                    //     this.setState(
                                                    //         {
                                                    //             isDeviceRegistered: false,
                                                    //             isLoading: false,
                                                    //             deviceRegistration: 'no',
                                                    //         },
                                                    //         async () => {
                                                    //             await AsyncStorage.setItem(
                                                    //                 'isdeviceregistered',
                                                    //                 'no',
                                                    //             );
                                                    //             console.log('registere4');
                                                    //             // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                                    //             this.props.registrationState(
                                                    //                 this.state.isDeviceRegistered,
                                                    //             );
                                                    //             await AsyncStorage.setItem(
                                                    //                 'deviceid',
                                                    //                 this.state.deviceId,
                                                    //             );
                                                    //             console.log('helloenteringreg');
                                                    //             this.props.storeDeviceid(this.state.deviceId);
                                                    //             // Forward to landing page
                                                    //             // this.refs.toast.show(strings.Unreg, 2000);
                                                    //         },
                                                    //     );
                                                    }
                                                }
                                            } else {
                                                // console.log('Device registration failed!')
                                                this.setState(
                                                    {
                                                        isDeviceRegistered: false,
                                                        isLoading: false,
                                                        deviceRegistration: 'no',
                                                    },
                                                    async () => {
                                                        await AsyncStorage.setItem(
                                                            'isdeviceregistered',
                                                            'no',
                                                        );
                                                        console.log('registere5');
                                                        // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                                        // this.refs.toast.show(strings.DevRegFail, 2000);
                                                    },
                                                );
                                            }
                                        } else {
                                            console.log('Error connecting to server!');
                                            // this.refs.toast.show(strings.DevError, 2000);
                                            this.setState(
                                                {
                                                    isDeviceRegistered: false,
                                                    isLoading: false,
                                                    deviceRegistration: 'no',
                                                },
                                                async () => {
                                                    await AsyncStorage.setItem(
                                                        'isdeviceregistered',
                                                        'no',
                                                    );
                                                    console.log('registere6');
                                                    this.props.registrationState(
                                                        this.state.isDeviceRegistered,
                                                    );
                                                    await AsyncStorage.setItem(
                                                        'deviceid',
                                                        this.state.deviceId,
                                                    );
                                                    this.props.storeDeviceid(this.state.deviceId);
                                                    // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                                    // this.refs.toast.show(strings.NotReg, 2000)
                                                },
                                            );
                                        }
                                    },
                                );
                            },
                        );
                    } else {
                        this.refs.toast.show(strings.NoInternet, 2000);
                    }
                });
            }
        }
    };

    serverUrlVal = () => {
        let serverUrl = this.state.serverUrl;

        if (serverUrl === '') {
            // this.refs.toast.show(strings.EmptyURL);
            console.log('empty url')
        } else if (serverUrl !== '') {
            var re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
            if (!re.test(serverUrl)) {
                // this.refs.toast.show(strings.InvURL, 2000);
                console.log('invalid url')
                return false;
            }
        }
        return false;
    };

    // registerCall = () => {
    // 	(
    // 		(this.state.deviceRegistration == 'no') ||
    // 		(this.state.deviceRegistration == false) ||
    // 		(this.state.deviceRegistration == undefined) ||
    // 		(this.state.deviceRegistration == null)
    // 	) ? 
    // 		this.handleRegister(1) : this.handleRegister(2)
    // }

  registerCall = async (supplierIndex) => {
    await AsyncStorage.setItem('supplierIndex', JSON.stringify(supplierIndex));
    // this.setState({serverUrl: 'https://cloudqa1.ewqims.com/auditproapi/api/'})
    this.setState({serverUrl: 'https://training-michelin.ewqims.com/auditproapi/api/'}) // Training Server SM
    const { deviceRegistration } = this.state;
    const deviceReg = (deviceRegistration === 'no' || !deviceRegistration);
    console.log('deviceReg--->', deviceReg, this.state.serverUrl)
    this.handleRegister(deviceReg ? 1 : 2);
  }
  
  // backFromReg = () => {
  // 	if (this.state.isDeviceRegistered) {
  // 			this.props.navigation.navigate(ROUTES.LAUNCH_SCREEN);
  // 	}
  // };

  // goToRegister() {
  // 		this.props.navigation.navigate(ROUTES.REGISTRATION_SM);
  // }
  
  handleDimensionChange = ({window}) => {
      this.setState({screenWidth: window.width});
  };

  // Static login //

  async getDeviceId() {
    this.setState({
      deviceId: await AsyncStorage.getItem('deviceid'),
    });
  }

  getSsoCreds = async () => {
    try {
      let sso = await AsyncStorage.getItem('sso_login_state');
      console.log('sso_login_state', sso);
      //sso = true;
      if (
        sso !== null &&
        sso !== undefined &&
        (sso === 'true' || sso === true)
      ) {
        let ss_configs = await AsyncStorage.getItem('sso_config_flags');
        if (ss_configs && Object.keys(JSON.parse(ss_configs)).length > 0) {
          this.setState({
            ssoConfigObj: JSON.parse(ss_configs),
            ssoEnabled: true,
            checkboxSelection: 'sso',
          });

        console.log(this.state.ssoEnabled, 'this.state.ssoEnabled_ sso');
        AsyncStorage.setItem('ssoenableflag', "true");
        }
      } else {
        //} if (sso === 'false' || sso === false) {
        this.setState({
          ssoEnabled: false,
          checkboxSelection: 'ewqims',
        });

        console.log(this.state.ssoEnabled, 'this.state.ssoEnabled_ ewqims');
        AsyncStorage.setItem('ssoenableflag', "false");
      }
    } catch (err) {
      console.log('<==JS==>  getSsoCreds catch', err);
    }
  };

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      this.setState(
        {
          fcmToken: fcmToken,
        },
        () => {
          // console.log('login fcmToken',this.state.fcmToken)
        },
      );
    }
    if (!fcmToken) {
    //   fcmToken = await firebase.messaging().getToken();
    fcmToken = ''
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        this.setState(
          {
            fcmToken: fcmToken,
          },
          () => {
            // console.log('login fcmToken',this.state.fcmToken)
          },
        );
      }
    }
  }

  getYearAudit() {
    const token = this.state.accessToken;
    const siteid = this.state.siteId;
    const userid = this.state.userId;

    auth.getYearAudit(siteid, userid, token, (res, data) => {
      // console.log('Calender filter api is called',data)
      if (data?.data?.Message == 'Success') {
        var GrossAudits = data.data.Data;
        var getRawStartDate = [];
        for (var i = 0; i < GrossAudits.length; i++) {
          getRawStartDate.push({
            StartDate: GrossAudits[i].StartDate,
          });
        }
        // console.log('getRawStartDate',getRawStartDate)
        // this.props.yearAudits(getStartDate)
        // storing the yearly audits in the store
        this.props.storeYearAudits(getRawStartDate);
      }
    });
  }

  async WriteFile(id) {
    //alert('write file id:'+id)
    console.log('getting from store', id);
    var smIndex = await AsyncStorage.getItem('supplierIndex');
    console.log('smIndex----->', smIndex);

    var UserId = id;
    if (Platform.OS == 'android') {
      var path =
        '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
        '/' +
        this.propsServerUrl +
        UserId;
      console.log('path-->', path);
      // console.log('Before clearing props',this.props.data)
      this.getProfileCall(this.state.accessToken);
      this.getYearAudit();

      setTimeout(() => {
        // console.log('Checking the props after refilling',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);

        // console.log('Writing new file',stringify)

        // write the file
        RNFS.writeFile(path, stringify, 'utf8')
          .then(success => {
            // console.log('FILE WRITTEN!');

            this.setState(
              {
                progressVisible: false,
              },
              () => {
                //this.props.navigation.navigate('SupplyManage')
                // this.props.navigation.navigate("AllTabAuditList");
                console.log(
                  'supplier management value' +
                  this.props?.data?.audits?.suppliermanagementstatus,
                );
                if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                  // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                  console.log('current smIndex1----->', smIndex, smIndex == 2);
                  smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                  this.backHandler.remove();
                  setTimeout(() => {
                    this.setState({loading: false});
                    this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                  }, 2000);
                  
                } else {
                  this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                }
              },
            );
          })
          .catch(err => {
            // console.log(err.message);
          });
      }, 500);
    } else {
      var iOSpath = RNFS.DocumentDirectoryPath;
      var path = iOSpath + '/' + this.propsServerUrl + UserId;
      // console.log('path-->',path)
      // console.log('Before clearing props',this.props.data)
      this.getProfileCall(this.state.accessToken);
      this.getYearAudit();
      setTimeout(() => {
        // console.log('Checking the props after refilling',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);

        // write the file
        RNFS.writeFile(path, stringify, 'utf8')
          .then(success => {
            // console.log('FILE WRITTEN!');
            this.setState(
              {
                progressVisible: false,
              },
              () => {
                //this.props.navigation.navigate('SupplyManage')
                console.log(
                  'supplier management value' +
                  this.props?.data?.audits?.suppliermanagementstatus,
                );
                if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                  // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                  console.log('current smIndex2----->', smIndex, smIndex == 2);
                  smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                  this.backHandler.remove();
                  setTimeout(() => {
                    this.setState({loading: false});
                    this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                  }, 2000);
                } else {
                  this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                }

                //  this.props.navigation.navigate("AllTabAuditList");
              },
            );
          })
          .catch(err => {
            // console.log(err.message);
          });
      }, 500);
    }
  }

  async refillStoreValues(ID) {
    console.log('Store refilling is in progress');
    console.log('getting id from store', ID);
    //alert('refilling store values'+ID)
    var smIndex = await AsyncStorage.getItem('supplierIndex');
    console.log('smIndex----->', smIndex);
    var isException = false;
    var UserId = ID;
    if (Platform.OS == 'android') {
      var path =
        '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
        '/' +
        this.propsServerUrl +
        UserId;
      console.log('path-->', path);
      RNFS.readFile(path).then(res => {
        // console.log('reading from the User file',JSON.parse(res))
        var LoggedUserDetails = JSON.parse(res);
        console.log(LoggedUserDetails[0].audits.userName + 'user name');
        if (LoggedUserDetails[0].audits.userName == null) {
          // console.log('Exception handled')
          console.log('not refilled props');
          this.WriteFile(ID);
          isException = true;
        } else {
          console.log('Refillign props', LoggedUserDetails[0].audits);
          var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
          this.props.updateAuditCount(auditCount);
          var dynamicAuditCount =
            LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
          this.props.updateDynamicAuditCount(dynamicAuditCount);

          this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
          this.props.storeUserSession(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );
          //storing user details using asyncstorage
          // this.storelogindetails(
          //   LoggedUserDetails[0].audits.userName,
          //   LoggedUserDetails[0].audits.userId,
          //   LoggedUserDetails[0].audits.token,
          //   LoggedUserDetails[0].audits.siteId,
          //   LoggedUserDetails[0].audits.address,
          //   LoggedUserDetails[0].audits.companyname,
          //   LoggedUserDetails[0].audits.companyurl,
          //   LoggedUserDetails[0].audits.logo,
          //   LoggedUserDetails[0].audits.phone,
          // );

          var auditRecords = LoggedUserDetails[0].audits.auditRecords;
          this.props.storeAuditRecords(auditRecords);
          var auditList = LoggedUserDetails[0].audits.audits;
          this.props.storeAudits(auditList);
          var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
          this.props.storeYearAudits(getRawStartDate);
          var loginuser = LoggedUserDetails[0].audits.loginuser;
          this.props.storeUserName(loginuser);
          var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
          this.props.storeNCRecords(dupNCrecords);
          var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
          this.props.storeCameraCapture(cameraCapture);
          var newLanguage =
            this.state.ChineseScript === true ? 'Chinese' : 'English';
          this.props.storeLanguage(newLanguage);
          var recentAudits = LoggedUserDetails[0].audits.recentAudits;
          this.props.updateRecentAuditList(recentAudits);
          var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
          this.props.storeServerUrl(ServerUrl);
          var isConnected = LoggedUserDetails[0].audits.isConnected;
          this.props.changeConnectionState(isConnected);
          var bool = LoggedUserDetails[0].audits.isAuditing;
          this.props.changeAuditState(bool);
          var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
          this.props.storeDateFormat(selectedFormat);
          this.props.storeLoginSession(true);
          this.props.storeAuditStats(
            LoggedUserDetails[0].audits.scheduledAudits,
            LoggedUserDetails[0].audits.completedAudits,
            LoggedUserDetails[0].audits.DeadlineViolatedAudits
              .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
          );
          var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
          this.props.registrationState(bool1);
        }
      });

      setTimeout(() => {
        // console.log('After refilling props',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);
        if (Platform.OS == 'android') {
          var path =
            '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
            '/' +
            this.propsServerUrl +
            UserId;

          // write the file
          RNFS.writeFile(path, stringify, 'utf8')
            .then(success => {
              // console.log('FILE WRITTEN!');
              this.setState(
                {
                  progressVisible: false,
                },
                () => {
                  //this.props.navigation.navigate('AuditProDashboard')
                  console.log(
                    'checking props' +
                      this.props.data.audits.userFullName +
                      this.props.data.audits.siteId +
                      'user id:' +
                      this.props.data.audits.userId +
                      'token:' +
                      this.props.data.audits.token +
                      'isactive' +
                      this.props.data.audits.isActive +
                      'device registration status:' +
                      this.props.data.audits.isDeviceRegistered,
                  );
                  console.log(
                    this.props.data.audits.isDeviceRegistered,
                    '********DeviceID********',
                  );
                  // zthis.props.navigation.navigate("AllTabAuditList");z
                  //if (this.props.data.audits.siteId !=''&& this.props.data.audits.userId !=''){
                  //alert('navigated to alltabauditlist')
                  console.log(
                    'supplier management value' +
                    this.props?.data?.audits?.suppliermanagementstatus,
                  );
                  if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                    // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                    console.log('current smIndex1----->', smIndex, smIndex == 2);
                    smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                    this.backHandler.remove();
                    setTimeout(() => {
                      this.setState({loading: false});
                      this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                    }, 2000);
                  } else {
                    this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                  }

                  //}else{
                  //alert('navigated to dashboard to avoid null issue')
                  //  this.props.navigation.navigate('AuditDashboard')
                  //}
                },
              );
            })
            .catch(err => {
              // console.log(err.message);
            });
        } else {
          var iOSpath = RNFS.DocumentDirectoryPath;
          var path = iOSpath + '/' + this.propsServerUrl + UserId;

          // write the file
          RNFS.writeFile(path, stringify, 'utf8')
            .then(success => {
              // console.log('FILE WRITTEN!');
              // this.props.navigation.navigate('AuditProDashboard')
            })
            .catch(err => {
              // console.log(err.message);
            });
        }
      }, 500);
    } else {
      var iOSpath = RNFS.DocumentDirectoryPath;
      var path = iOSpath + '/' + this.propsServerUrl + UserId;
      // console.log('path-->',path)
      RNFS.readFile(path).then(res => {
        // console.log('reading from the User file',JSON.parse(res))
        var LoggedUserDetails = JSON.parse(res);
        if (LoggedUserDetails[0].audits.userName == null) {
          // console.log('Exception handled')
          this.WriteFile(ID);
          isException = true;
        } else {
          console.log('Refillign props', LoggedUserDetails[0]);
          var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
          this.props.updateAuditCount(auditCount);
          var dynamicAuditCount =
            LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
          this.props.updateDynamicAuditCount(dynamicAuditCount);
          this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
          this.props.storeUserSession(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );
          console.log( LoggedUserDetails[0].audits.siteId,"siteidinlogin");

          // this.storelogindetails(
          //   LoggedUserDetails[0].audits.userName,
          //   LoggedUserDetails[0].audits.userId,
          //   LoggedUserDetails[0].audits.token,
          //   LoggedUserDetails[0].audits.siteId,
          //   LoggedUserDetails[0].audits.address,
          //   LoggedUserDetails[0].audits.companyname,
          //   LoggedUserDetails[0].audits.companyurl,
          //   LoggedUserDetails[0].audits.logo,
          //   LoggedUserDetails[0].audits.phone,
          // );

          var auditRecords = LoggedUserDetails[0].audits.auditRecords;
          this.props.storeAuditRecords(auditRecords);
          var auditList = LoggedUserDetails[0].audits.audits;
          this.props.storeAudits(auditList);
          var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
          this.props.storeYearAudits(getRawStartDate);
          var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
          this.props.storeNCRecords(dupNCrecords);
          var loginuser = LoggedUserDetails[0].audits.loginuser;
          this.props.storeUserName(loginuser);
          var recentAudits = LoggedUserDetails[0].audits.recentAudits;
          this.props.updateRecentAuditList(recentAudits);
          var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
          this.props.storeCameraCapture(cameraCapture);
          var newLanguage =
            this.state.ChineseScript === true ? 'Chinese' : 'English';
          this.props.storeLanguage(newLanguage);
          var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
          this.props.storeServerUrl(ServerUrl);
          var isConnected = LoggedUserDetails[0].audits.isConnected;
          this.props.changeConnectionState(isConnected);
          var bool = LoggedUserDetails[0].audits.isAuditing;
          this.props.changeAuditState(bool);
          var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
          this.props.storeDateFormat(selectedFormat);
          this.props.storeLoginSession(true);
          this.props.storeAuditStats(
            LoggedUserDetails[0].audits.scheduledAudits,
            LoggedUserDetails[0].audits.completedAudits,
            LoggedUserDetails[0].audits.DeadlineViolatedAudits
              .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
          );
          var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
          this.props.registrationState(bool1);
        }
      });

      if (isException == false) {
        setTimeout(() => {
          // console.log('After refilling props',this.props.data)
          var UserDetails = [];
          UserDetails.push({
            UserId: this.props.data.audits.userId,
            audits: this.props.data.audits,
          });

          // console.log('UserDetails',UserDetails)
          var stringify = JSON.stringify(UserDetails);
          if (Platform.OS == 'android') {
            var path =
              '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
              '/' +
              this.propsServerUrl +
              UserId;

            // write the file
            RNFS.writeFile(path, stringify, 'utf8')
              .then(success => {
                // console.log('FILE WRITTEN!');
                this.setState(
                  {
                    progressVisible: false,
                  },
                  () => {
                    //this.props.navigation.navigate('SupplyManage')
                    console.log(
                      'supplier management value' +
                      this.props?.data?.audits?.suppliermanagementstatus,
                    );
                    if (this.props?.data?.audits?.suppliermanagementstatus == 'true') {
                      // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                      console.log('current smIndex1----->', smIndex, smIndex == 2);
                      smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                      this.backHandler.remove();
                      setTimeout(() => {
                        this.setState({loading: false});
                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                      }, 2000);
                    } else {
                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                    }

                    //this.props.navigation.navigate("AllTabAuditList");
                  },
                );
              })
              .catch(err => {
                // console.log(err.message);
              });
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            var path = iOSpath + '/' + this.propsServerUrl + UserId;

            // write the file
            RNFS.writeFile(path, stringify, 'utf8')
              .then(success => {
                // console.log('FILE WRITTEN!');
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
                      // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
                      console.log('current smIndex1----->', smIndex, smIndex == 2);
                      smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
                      this.backHandler.remove();
                      setTimeout(() => {
                        this.setState({loading: false});
                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
                      }, 2000);
                    } else {
                        this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
                    }
                  },
                );
              })
              .catch(err => {
                // console.log(err.message);
              });
          }
        }, 500);
      }
    }
  }

  multipleAuditUser(ID) {
    //alert('Called multiple audit user')
    var index = undefined;
    var FillArr = [];
    var Files = [];
    var isFileExist = false;
    //alert('MultipleAudit user'+ID)
    // console.log('RNFS.DocumentDirectoryPath',RNFS.DocumentDirectoryPath)
    if (Platform.OS == 'android') {
      RNFS.readDir('/data/user/0/com.omnex.suppliermanagement/cache/AuditUser')
        .then(result => {
          console.log('LoginUI:GOT RESULT', result);
          //alert('got result - readed directory:/data/user/0/com.omnex.auditpro/cache/AuditUser --login'+result)
          //alert('server url:'+this.propsServerUrl+' ID:'+id)
          Files = result;
          for (var i = 0; i < Files.length; i++) {
            console.log('LoginUI:propsURl', this.propsServerUrl, '+', ID);
            if (Files[i].name.includes(this.propsServerUrl + ID)) {
              FillArr.push(Files[i]);
              console.log('LoginUI:FillArr', FillArr);
              //alert("fileArr ---login:"+FillArr)
              index = i;
              isFileExist = true;
              //alert('File exists')
              // console.log('index',i)
              // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
              return Promise.all([
                RNFS.stat(Files[index].path),
                Files[index].path,
              ]);
            }
          }
          if (isFileExist === false) {
            //alert('File exists false')
            index = 0;
            // this.WriteFile(ID)
          }
        })
        .then(statResult => {
          console.log('LoginUI:statResult', statResult);
          if (FillArr.length == 0) {
            this.WriteFile(ID);
            //alert("fill arr lenght --login data:0")
            console.log('LoginUI:hitting here');
          } else {
            console.log('LoginUI:statResult reading', statResult);
            //alert('start result reading --login')
            RNFS.readFile(statResult[1])
              .then(result => {
                console.log(result + 'LoginUI:result value');
                var read = JSON.parse(result);
                console.log('LoginUI:Reading', read);
                // console.log('ID value',ID)
                this.refillStoreValues(ID);
              })
              .catch(err => {
                console.log(err.message, err.code, 'LoginUI:ERR MSG');
              });
          }
        });
    } else {
      // console.log('Ios detected')
      var iOSpath = RNFS.DocumentDirectoryPath;
      RNFS.readDir(iOSpath)
        .then(result => {
          // console.log('GOT RESULT', result);
          Files = result;
          for (var i = 0; i < Files.length; i++) {
            if (Files[i].name.includes(this.propsServerUrl + ID)) {
              FillArr.push(Files[i]);
              // console.log('FillArr',FillArr)
              index = i;
              isFileExist = true;
              // console.log('index',i)
              // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
              return Promise.all([
                RNFS.stat(Files[index].path),
                Files[index].path,
              ]);
            }
          }
          if (isFileExist === false) {
            // console.log('--ios---')
            index = 0;
            // this.WriteFile(ID)
          }
        })
        .then(statResult => {
          // console.log("statResult",statResult)
          if (FillArr.length == 0) {
            // console.log('FillArr is 0')
            this.WriteFile(ID);
            // console.log('hitting here')
          } else {
            // console.log('statResult reading',statResult)
            RNFS.readFile(statResult[1]).then(result => {
              var read = JSON.parse(result);
              // console.log('Reading',read)
              // console.log('ID value',ID)
              this.refillStoreValues(ID);
            });
          }
        })
        .then(contents => {
          // log the file contents
          // console.log('Filestorage',contents)
        })
        .catch(err => {
          // console.log(err.message, err.code);
        });
    }
  }

  checkUser(ID, token) {
    var UserStatus = '';
    console.log('Getting last user session',this.props.data, ID, this.state.deviceId,)
    // console.log('User trying to log in',ID)
    var currentID = this.props.data.audits.userId;
    // auth.getCheckUser(ID, token, (res, data) => {
    auth.getCheckUser(ID, this.state.deviceId, token, (res, data) => {
      console.log('LoginUI:User information', data);

      if (data.data.Message == 'Success') {
        if (data.data.Data.ActiveStatus)
          UserStatus = data.data.Data.ActiveStatus;
        else {
          //alert('Active Status not getting..:'+data.data.Data.ActiveStatus)
        }
        console.log('LoginUI:Currnt:', currentID, '--', 'id:', ID);
        if (UserStatus == 2) {
          if (currentID != ID) {
            console.log('LoginUI:multipleAuditUser');
            this.multipleAuditUser(ID);
            // this.refillStoreValues(ID);
          } else {
            console.log('LoginUI:Same user detected');
            this.refillStoreValues(ID);
          }
        } else {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              this.refs.toast.show(
                strings.not_permitted,
                DURATION.LENGTH_SHORT,
              );
            },
          );
        }
      } else {
        this.setState(
          {
            progressVisible: false,
          },
          () => {
            this.refs.toast.show(
              strings.error_connecting,
              DURATION.LENGTH_SHORT,
            );
          },
        );
      }
    });
  }

  _storeToken = async () => {
    // console.log('*********',this.state.username)
    try {
      // Store audit list in redux store to set it in persistant storage
      // this.props.storeSiteId(this.props?.data?.audits?.siteId);
      var smIndex = await AsyncStorage.getItem('supplierIndex');
      console.log('smIndex----->', smIndex);
      this.props.storeSiteId(this.state.siteId);
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
      console.log(this.state.siteId,'siteidinlogin1');
      
      // this.storelogindetails(
      //   this.state.userFullName,
      //   this.state.userId,
      //   this.state.accessToken,
      //   this.state.siteId,
      //   this.state.Address,
      //   this.state.CompanyName,
      //   this.state.CompanyUrl,
      //   this.state.Logo,
      //   this.state.Phone,
      // );
      // console.log('reach storelogindetails');
      this.props.storeLoginSession(true);
      console.log('reach storeLoginSession');
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
            // this.props.navigation.navigate(ROUTES.SUPPLY_MANAGE_SM);
            console.log('current smIndex1----->', smIndex, smIndex == 2);
            smIndex == 2 ? this.props.storeSupplierData(2) : this.props.storeSupplierData(3);
            this.backHandler.remove();
            this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
            setTimeout(() => {
              this.setState({loading: false});
              this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST_SM);
            }, 2000);
            } else {
              this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST);
          }
        },
      );
    } catch (error) {
      // Error saving data
      // console.log('Failed to create a login session!!!')
    }
  };

  getProfileCall(token) {
    var Token = token;
    // console.log('Profile getting details...',Token)
    //alert('profile called --login')
    auth.getProfile(Token, (res, data) => {
      // console.log('--->',data)
      if (data?.data) {
        if (data?.data?.Message === 'Success') {
          // console.log('getting into if',data)
          //alert('Profile data get --login')
          this.setState(
            {
              Address: data.data.Data.Address,
              CompanyName: data.data.Data.CompanyName,
              CompanyUrl: data.data.Data.CompanyUrl,
              Logo: data.data.Data.Logo,
              Phone: data.data.Data.Phone,
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
          this.refs.toast.show(
            strings.ProfileFetchFailed,
            DURATION.LENGTH_LONG,
          );
        }
      } else {
        this.refs.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
      }
    });
  }

  storeData = async (key, value) => {
    console.log('checking assync details----------',key , value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  loginCall = (email, password,loginflag, isSso) => {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    console.log('checkinglogin', loginflag)
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

    // console.log('login submit fcmToken',this.state.fcmToken)
    console.log('hi', auth.loginUser);
    console.log('Device ID:' + this.state.deviceId);
    console.log('Device ID:' + this.props?.data?.audits?.deviceregisterdetails);

    
    this.storeData('loginDeviceId', this.state.deviceId);
    this.storeData('loginFcmToken', this.state.fcmToken);
    this.storeData('loginEmail', email);
    auth.loginUser(
      email,
      encryptedpassword.toString(),
      this.state.fcmToken,
      this.state.deviceId,
      loginflag,
      isSso,
      (res, data) => {
        console.log('loginUser', data);
        console.log('checkingloginUserresponse', res);
        //this.props.storeSupplierManagement("true");
        if (data?.data?.Success == true) {
          console.log(
            'data value checking' + data?.data?.Data[0]?.SupplierManagementAccess,
          );
          this.props.storeLoginData(data?.data?.Data);
          this.props.storeSupplierManagement(
            data.data.Data[0].SupplierManagementAccess,
          );
          console.log('storeUserName', email);

          this.props.storeUserName(email);
          this.setState(
            {
              userId: data.data.Data[0].UserId.toString(),
              siteId: data.data.Data[0].Siteid,
              accessToken: data.data.Token,
              userFullName: data.data.Data[0].FullName,
            },
            () => {
              // console.log('userFullName',this.state.userFullName)
              // call below 2 methods later zzzss
              // this.getProfileCall(this.state.accessToken)
              // this.getYearAudit()
              this.getProfileCall(this.state.accessToken);
              this.checkUser(this.state.userId, this.state.accessToken);

              // alert('ok')
            },
          );
        } else {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              
              
              // this.refs.toast.show(data.data.Message, DURATION.LENGTH_LONG);
              Alert.alert(data.data.Message)
            },
          );
        }
      },
    );
  };

  callActiveDirectory(username, password) {
    var activeURL = this.props?.data?.audits?.serverUrl;
    var filterURL1 = activeURL.replace('AuditPro', 'EwQIMS');
    var filterURL2 = filterURL1.replace('api', 'common');
    var ADdomain =
      'ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=' +
      username +
      '&Password=' +
      password;

    // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=svibu&Password=P@ssw0rd

    const check = create({
      baseURL: filterURL2 + ADdomain,
    });
    check
      .post()
      .then(res => {
        // console.log('AD response',res)
        if (res.data == 'False') {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              alert(strings.usernotallowed);
            },
          );
        } else {
          this.loginCall(username, password);
        }
      })
      .catch(err => console.warn(err));
  }

  async initialLoginCall ()  {
    console.log("nR===>",this.props?.data?.audits?.isDeviceRegistered)
    const isDeviceRegisteredLog = await AsyncStorage.getItem('isdeviceregistered');
    console.log('loginscreenisDeviceRegisteredLog:::::=====',isDeviceRegisteredLog);
    if(isDeviceRegisteredLog == "no"){
      console.log('checking the device Registered or not-----------',this.props.data.audits.isDeviceRegistered);
      alert('Register the device before login..')
    }else{
    Keyboard.dismiss();
    // let pwdfield = this.state.password;
    // let usrfield = this.state.username;
    
    let usrfield = "omnex";
    let pwdfield = "a1";
    // let usrfield = "kaalaa";
    console.log("pwdfield &&& usrfield  ===>", pwdfield, usrfield)
    this.setState({
      username: usrfield,
      password: pwdfield,
      loginFlag: 1
    })
    if (pwdfield === '' || usrfield === '') {
      // this.refs.toast.show(strings.LoginCred, DURATION.LENGTH_LONG);
      alert( strings.LoginCred)
    } else {
      // console.log('Email and password', this.state.username, this.state.password)
      if (this.props?.data?.audits?.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice);
      } else {
        await AsyncStorage.setItem('ssologinstatusbool', "false");

        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.setState(
              {
                progressVisible: true,
              },
              () => {
                // check active directoery
                if (
                  this.state.isActiveDirectory == true &&
                  this.state.isAdvalue == true
                ) {
                  this.callActiveDirectory(usrfield, pwdfield);
                } else {
                  this.loginCall(usrfield, pwdfield, this.state.loginFlag);
                }
              },
            );
          } else {
            this.refs.toast.show(strings.NoInternet);
          }
        });
      }
    }
  }
  };

  loginHandler = async () => {
    console.log('Reach Login call---->')
    this.getSsoCreds();
    this.getDeviceId();
    // this.checkActiveDirectory();
    console.log(this.props.data.audits, 'serverurllogin');
    var propsServerUrl = this.props.data.audits.serverUrl;
    var cleanURL = propsServerUrl?.replace(/^https?:\/\//, '');

    var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    this.propsServerUrl = formatURL;
    console.log('cleanURL', this.propsServerUrl);
    this.getToken();
    this.initialLoginCall()
  }
 
  render() {
    let data = [];
    var logindata = this.props.data.audits.logindata;
    if (logindata != null) {
      for (var i = 0; i < logindata.length; i++) {
        data.push({
          value: logindata[i].Siteid,
          UserId: logindata[i].UserId,
          FullName: logindata[i].FullName,
          EntityNode: logindata[i].EntityNode,
          SupplierManagementAccess: logindata[i].SupplierManagementAccess,
        });
      }
    }
    console.log(data + "data");
    console.log('logpropssssssssss',this.state.ssoConfig)

    console.log("this.state?.loading", this.state?.loading);

    return (

        <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
          {this.state?.loading ? (
            <Modal
              transparent={true}
              animationType={'none'}
              visible={this.state?.loading}
              onRequestClose={() => { console.log('close modal') }}
            >
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', height: '50%'}}>
              <Bubbles size={10} color="#12C0CF" />
            </View>
          </Modal>
          ) : null }
          
          <OfflineNotice />
          {/* <Image source={Images.LoginBack2} style={styles.backgroundImage} /> */}
          <ImageBackground source={Images.LoginBack2} style={styles.backgroundImage}>
            {/* <View style={{ marginTop: '12%'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate(ROUTES.HOME_FAB_VIEW) }style={{left: 8}}>
                <Icon name="angle-left" size={35} color="#14D0AE" />
              </TouchableOpacity>
            </View> */}
          </ImageBackground>  
          <View style={{ flexDirection: "column", position: "absolute" }}>
            <View style={styles.loginOmnexlogoDiv}>
              <View style={styles.loginOmnexlogo}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#14D0AE" }}
                >
                  {strings.SUPPLIER_MANGEMENT}
                </Text>
              </View>
            </View>
            <View style={[styles.loginOmnexlogoDiv2]}>
              <View style={styles.inputBox1}>
                <TouchableOpacity
                  onPress={() => {
                    // this.props.storeSupplierData(2);
                    // this.backHandler.remove();
                    // this.props.navigation.navigate('AllTabAuditList');
                    // this.props.navigation.navigate(ROUTES.REGISTRATION_SM);
                    this.registerCall(2)
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#2EA4E2", "#14D0AE", "#1FBFD0"]}
                    style={styles.LoginBtn01}
                  >
                    <Text style={styles.buttonText}>
                      {strings.Supplier_initial_assessment}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={[styles.suppliereng]}>
                <TouchableOpacity
                  onPress={() => {
                    
                    // this.props.storeSupplierData(3);
                    // this.backHandler.remove();
                    // this.props.navigation.navigate('AllTabAuditList');
                    this.registerCall(3)
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#14D0AE", "#1FBFD0", "#2EA4E2"]}
                    style={styles.LoginBtn01}
                  >
                    <Text style={styles.buttonText}>
                      {strings.Supplier_routine_audit}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      data: state,
      siteId: state.siteId,
      isDeviceRegistered: state.isDeviceRegistered,
      notifications: state.notifications,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      changeAuditState: (isAuditing) =>
        dispatch({ type: "CHANGE_AUDIT_STATE", isAuditing }),
      storeAuditRecords: (auditRecords) =>
        dispatch({ type: "STORE_AUDIT_RECORDS", auditRecords }),
      storeAudits: (audits) => dispatch({ type: "STORE_AUDITS", audits }),
      storeNCRecords: (ncofiRecords) =>
        dispatch({ type: "STORE_NCOFI_RECORDS", ncofiRecords }),
      clearAudits: () => dispatch({ type: "CLEAR_AUDITS" }),
      storeSupplierData: (smdata) =>
        dispatch({ type: "STORE_SUPPLIER_DATA", smdata }),
      storeSiteId: (siteId) =>
        dispatch({ type: "STORE_SITE_ID", siteId }),
      registrationState: isDeviceRegistered =>
          dispatch({type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered}),
      storeDeviceid: deviceid => dispatch({type: 'STORE_DEVICEID', deviceid}),
      storeServerUrl: serverUrl =>
          dispatch({type: 'STORE_SERVER_URL', serverUrl}),
      //Static Login 
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
        storeCameraCapture: cameraCapture =>
          dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
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
        changeConnectionState: isConnected =>
          dispatch({type: 'CHANGE_CONNECTION_STATE', isConnected}),
        storeDateFormat: userDateFormat =>
          dispatch({type: 'STORE_DATE_FORMAT', userDateFormat}),
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
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SupplyManage);