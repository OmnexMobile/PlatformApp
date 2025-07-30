import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity, SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Linking,
  Dimensions,
  Pressable,
  LogBox,
  Modal,
  ScrollView,
} from 'react-native';
// import { Card, IconButton } from 'react-native-paper';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import strings from 'config/localization';
import { ImageComponent, TextComponent } from 'components';
import { IMAGES } from 'assets/images';
import FastImage from 'react-native-fast-image';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FONT_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES, APP_VARIABLES, STATUS_CODES } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import { useAppContext } from 'contexts/app-context';
import localStorage from 'global/localStorage';
import globalAuth from '../../../services/Auditpro-Auth';
import auth from '../../../services/APQP-Auth';
import CryptoJS from 'react-native-crypto-js';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Bubbles } from 'react-native-loader';
import { useDispatch } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { Images } from 'theme/Apqp';
import { APQP_URL, AUDITPRO_URL, GLOBAL_BASE_URL, GLOBALSERVER_URL, IC_URL, PROBLEMSOLVING_URL } from 'screens/globalConstant/globalURL';

const screenWidth = Dimensions.get("window").width;

const TabsCard = ({ countDetails, tabIndex, currentUser, isSupplier }) => {
  // console.log('tabIndex--------', tabIndex, '--', currentUser, '--', isSupplier)
  // console.log('CURRENT_PAGE---->', 'home-tab-card')
  const navigations = useNavigation();
  const [currentUserData, setCurrentUserData] = useState([]);
  const [currentUserDataPS, setCurrentUserDataPS] = useState([]);
  // This hook returns `true` if the screen is focused, `false` otherwise
  const isFocused = useIsFocused();
  const [isRegister, setIsRegister] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  // const [dataSet, setDataSet] = useState(null);
  const { handleGlobalURL, globalDeviceDetails } = useAppContext();
  const dispatch = useDispatch();

  const data = [
    {
      id: 1,
      title: tabIndex === 0 ? strings.ppapProjects : strings.apqp_ppapManager,
      detail: [
        // { images: IMAGES.actions, category: strings.Actions, status: 0 },
        { images: tabIndex === 0 ? IMAGES.actions : null, category: tabIndex === 0 ? strings.Actions : null, status: 0 },
        // { images: IMAGES.projects, category: strings.projects, status: 0 },
        { images: IMAGES.projects, category: tabIndex === 0 ? strings.projects : strings.apap_ppap, status: 0 },
        { images: tabIndex === 0 ? null : IMAGES.risk, category: tabIndex === 0 ? null : strings.risk, status: 0 },
        { images: tabIndex === 0 ? null : IMAGES.meeting, category: tabIndex === 0 ? null : strings.meeting, status: 0 },
        { images: tabIndex === 0 ? IMAGES.todayTask : null, category: tabIndex === 0 ? strings.todayTask : null, status: 0 },
        { images: tabIndex === 0 ? IMAGES.dailyTask : null, category: tabIndex === 0 ? strings.dailyTask : null, status: 0 },


        // { images: IMAGES.todayTask, category: strings.todayTask, status: 0 },
        // { images: IMAGES.dailyTask, category: strings.dailyTask, status: 0 }
      ]
    },
    {
      id: 2,
      title: strings.auditPro,
      detail: [
        { images: IMAGES.scheduledAudit, category: strings.scheduledAudit, status: 2, auditTitle: strings.scheduled,  },
        { images: IMAGES.completedAudit, category: strings.completedAudit, status: 3, auditTitle: strings.completed },
        { images: IMAGES.deadlineViolated, category: strings.deadlineViolated, status: 4, auditTitle: strings.deadlineviolated },
        { images: IMAGES.closedOut, category: strings.closedOut, status: 5, auditTitle: strings.abb_deadlineviolatedandcompleted  }
      ]
    },
    {
      id: 3,
      title: strings.problemSolver,
      detail: [
        { images: tabIndex === 0 ? IMAGES.supplierConcerns : IMAGES.concerns, category: tabIndex === 0 ? strings.supplierConcerns : strings.concerns, status: 0 },
        { images: IMAGES.openConcerns, category: strings.openConcerns, status: 0 },
        { images: IMAGES.inProgressConcerns, category: strings.inProgressConcerns, status: 0 }
      ]
    },
    {
      id: 4,
      title: tabIndex === 0 ? strings.documentPro : strings.supplierMgnt,
      detail: tabIndex === 0 ? [
        { images: IMAGES.inProgressConcerns, category: strings.documentLevels, status: 0 },
        { images: IMAGES.inProgressConcerns, category: strings.actionList, status: 0 },
        { images: IMAGES.inProgressConcerns, category: strings.adminActions, status: 0 }
      ] : 
      // []
      [
        { images: IMAGES.scheduledAudit, category: strings.supplierInitialAssessment, status: 0 },
        { images: IMAGES.completedAudit, category: strings.supplierRoutineAudit, status: 0 },
      ]

    },
    {
        id: 5,
        title: tabIndex === 0 ? strings.inspectionControl : null,
        detail: tabIndex === 0 ? [
          { images: IMAGES.ICIS, category: strings.inspectionSchedule, status: 1, routeName: ROUTES.INSPECTION_SCHEDULE },
          { images: IMAGES.ICOS, category: strings.operatorWorksheet, status: 2, routeName: ROUTES.OPERATOR_WORKSHEET },
          { images: IMAGES.ICCI, category: strings.completedInspection, status: 3, routeName: ROUTES.COMPLETED_INSPECTION },
        //   { images: IMAGES.ICSS, category: strings.supervisorSchedule, status: 4, routeName: ROUTES.SUPERVISOR_SCHEDULE },
        ] : [],
    },
  ];

  const finalUser = currentUser.replace(/\s+/g, '');
  // console.log(finalUser, 'finalUser');
  const dataSet = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    // if (finalUser === "AzhalleAnna") return data.filter(item => item.id === 1);
    if (finalUser === "NVignesh") return data.filter(item => item.id === 2);
    if (finalUser === "PradeepaDeva") return data.filter(item => item.id === 3);
    if (finalUser === "NBhoopathy") return data.filter(item => item.id === 4);
    return data;
  }, [data, currentUser]);

  const redirectToPage = (title, status, category) => {
    ((status > 0) && (title === strings.auditPro)) 
      ? navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING, { projectTitle: title, status: status, category: category.replace(/\n/g, ' ') }) 
      : null
  }

  const navigateToSettings = () => {
    console.log('click settings')
    // navigations.navigate(ROUTES.GLOBAL_DASHBOARD);
  }

  // console.log('currentUserData---', isFocused, currentUserData, currentUserData?.siteId?.length)

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    async function getUserDetails() {
      try {
        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = JSON.parse(stringifiedUserDetails);
        // console.log('current userdata--->', value)
        if (value !== null) {
          // console.log('current token2 Auditpro--->', value?.accessToken)
          setCurrentUserData(value)
        } else {
          // console.log('current token3 Auditpro--->', value?.accessToken)
          setCurrentUserData('')
        }
      } catch (e) {
        // error reading value
        console.log('currentUserData error--->', e)
      }
    }
    getUserDetails();
  }, [currentUserData?.siteId, isFocused]);

  useEffect(() => {
    async function getUserDetailsPS() {
      try {
        const stringifiedUserDetailsPS = await AsyncStorage.getItem('userDetailsPS');
        const value = JSON.parse(stringifiedUserDetailsPS);
        // console.log('current userdata ps--->', value)
        if (value !== null) {
          // console.log('current token2 ps--->', value)
          setCurrentUserDataPS(value)
        } else {
          // console.log('current token3 ps--->', value)
          setCurrentUserDataPS('')
        }
      } catch (e) {
        // error reading value
        console.log('currentUserData ps error--->', e)
      }
    }
    getUserDetailsPS();
  }, [isFocused]);
  // }, [currentUserDataPS, isFocused]);

  useEffect(() => {
    async function getdeviceRegisterStatus() {
      try {
        const value = await AsyncStorage.getItem('isdeviceregistered')
        if (value !== null) {
          // value previously stored
          console.log('current isRegister app--->', value)
          setIsRegister(value)
        }
      } catch (e) {
        // error reading value
        console.log('isRegister error--->', e)
      }
    }
    getdeviceRegisterStatus()
  }, [isRegister, isFocused])

  // const showToast = () => {
  //   // Toast.show("This is a toast message!", Toast.SHORT);
  //   Toast.showWithGravity(
  //     "No Settings Data!",
  //     Toast.LONG,
  //     Toast.TOP,
  //   );
  // };

  const handleNavigation = async (title, status, category, auditTitle, routeName) => {
    console.log('handleNavigation currentUserData?.accessToken--->', currentUserData, globalDeviceDetails?.deviceDetails, 'token', currentUserData?.accessToken)
    let currentGlobalURL;
    // AUDITPRO //
    if(currentUserData?.accessToken?.length && currentUserData?.accessToken) {
      if(title === strings.auditPro) {
        currentGlobalURL = globalDeviceDetails?.deviceDetails?.AuditProURL ? globalDeviceDetails?.deviceDetails?.AuditProURL: AUDITPRO_URL;
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
        handleGlobalURL('serverUrl', currentGlobalURL)
        globalAuth.setServerUrl(currentGlobalURL);
        await AsyncStorage.setItem('storedserverrul', currentGlobalURL);
        console.log('current click--->', strings.auditPro)
        const projectDetails = {
          projectTitle: title,
          projectStatus: status,
          projectCategory: category.replace(/\n/g, ' '),
          auditTitle: auditTitle,
        };
        const stringifiedProjectDetails = JSON.stringify(projectDetails);
        AsyncStorage.setItem('projectDetails', stringifiedProjectDetails);
        // console.log('Set Async projectDetails ', stringifiedProjectDetails)
        redirectToPage(title, status, category)

        // PROBLEMSOLVER //
      } else if (title === strings.problemSolver) {

        // console.log('globalDeviceDetails?.deviceDetails?.PSApiURL ',globalDeviceDetails,'--', globalDeviceDetails?.deviceDetails?.PSApiURL)
        currentGlobalURL = globalDeviceDetails?.deviceDetails?.PSApiURL ? globalDeviceDetails?.deviceDetails?.PSApiURL: PROBLEMSOLVING_URL;
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
        handleGlobalURL('serverUrl', currentGlobalURL)
        console.log('current click--->', strings.problemSolver,'--', category.replace(/\n/g, ' '),'--', category, '--')
        await AsyncStorage.setItem('concerns', category.replace(/\n/g, ' '));
        navigateToStatusCount(category.replace(/\n/g, ' '));

        // APQP //
      } else if (title === (strings.apqp_ppapManager)) {
        console.log('apqp_ppapManager handleNavigation 1--->', title, status, category, globalDeviceDetails?.deviceDetails?.APQPApiURL)
        // Global API // 
        currentGlobalURL = globalDeviceDetails?.deviceDetails?.APQPApiURL ? globalDeviceDetails?.deviceDetails?.APQPApiURL: APQP_URL;
        console.log('currentGlobalURL APQPApiURL ', currentGlobalURL)
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
        handleGlobalURL('serverUrl', currentGlobalURL)
        globalAuth.setServerUrl(currentGlobalURL);
        auth.setServerUrl(currentGlobalURL);
        await AsyncStorage.setItem('storedserverrul', currentGlobalURL);
        // setLoading(true);
        console.log('current click--->', strings.apqp_ppapManager)
        //Global API //
        console.log('currentUserData--->', currentUserData)
        globalAPQPLogin(category, title, currentGlobalURL)

      // DOCUMENT PRO //
      } else if (title === strings.documentPro) {
        console.log('current click--->', strings.documentPro)

      // SUPPLIER MANAGEMENT //
      } else if (title === strings.supplierMgnt) {

        console.log('sm_ current click--->', strings.supplierMgnt)
        console.log('sm_ current category--->', category )
        let supplierIndex;
        if(category == strings.supplierInitialAssessment){
          supplierIndex = 2
        } else {
          supplierIndex = 3
        }
        await AsyncStorage.setItem('supplierIndex', JSON.stringify(supplierIndex));
        console.log('current supplierIndex--->', supplierIndex )
        localStorage.storeData('CurrentApp', strings.supplierMgnt);
        // const currentURL = 'https://cloudqa1.ewqims.com/auditproapi/api/'
        // const currentURL = 'https://training-michelin.ewqims.com/auditproapi/api/' // Training Server SM
        // console.log('currentURL--->', currentURL)
        // navigations.navigate(ROUTES.SUPPLY_MANAGE_SM)
        // Global API //
        currentGlobalURL = globalDeviceDetails?.deviceDetails?.AuditProURL ? globalDeviceDetails?.deviceDetails?.AuditProURL: AUDITPRO_URL;
        console.log('currentGlobalURL--->', currentGlobalURL )
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
        handleGlobalURL('serverUrl', currentGlobalURL)
        globalAuth.setServerUrl(currentGlobalURL);
        auth.setServerUrl(currentGlobalURL);
        await AsyncStorage.setItem('storedserverrul', currentGlobalURL);
        console.log('current click--->', strings.supplierMgnt)
        navigations.navigate(ROUTES.ALLTABAUDITLIST_SM)
      } else if (title === strings.documentPro) {
        if (category == 'Document\nLevels') {
            navigations.navigate(ROUTES.DOCPRO_DOCUMENTFOLDER);
        } else if (category == 'Actions\nList') {
            navigations.navigate(ROUTES.DOCPRO_ACTION);
        }
        console.log('current click--->', strings.documentPro);
      } else if (title === strings.inspectionControl) {
          currentGlobalURL = globalDeviceDetails?.deviceDetails?.ICApiURL ? globalDeviceDetails?.deviceDetails?.ICApiURL: IC_URL;
          console.log('currentGlobalURL--->', currentGlobalURL )
          localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
          handleGlobalURL('serverUrl', currentGlobalURL)
          globalAuth.setServerUrl(currentGlobalURL);
          auth.setServerUrl(currentGlobalURL);
          setLoading(true);
          loginCallIC(routeName);
          console.log('*************current click', globalDeviceDetails, category, strings.inspectionControl, routeName);
      } else {
        // console.log('current click--->')
      }
    } else {
      // Reach ELSE when Token is null or empty
        if(isRegister === 'yes') {
          console.log('else handleNavigation 2--->', currentUserData?.accessToken)
          navigations.navigate(ROUTES.GLOBAL_LOGIN)
        } else {
          console.log('else handleNavigation 3--->', currentUserData?.accessToken)
          navigations.navigate(ROUTES.GLOBAL_REGISTER)
        }
    }
  }

  //APQP API Changes

  const globalAPQPLogin = async (category, title, currentGlobalURL) => {
    console.log("globalAPQPLogin", currentUserData?.accessToken, currentUserData?.siteId, currentUserData?.userId)
    const API_URL = currentGlobalURL;
    console.log('globalAPQPLogin API_URL--->', API_URL)
    const loginData = currentUserData
    console.log('globalAPQPLogin loginData--->', loginData, 'loginData?.userId', loginData?.userId, 'loginData?.siteId', loginData?.siteId);
    console.log('globalAPQPLogin loginData1111--->',loginData?.accessToken, loginData?.userFullName, loginData, category, title)

    // Call  webAPQPLogin
    if (loginData != "") {
      const UserName = await AsyncStorage.getItem('loginUserName');
      const Password = await AsyncStorage.getItem('loginPassword');
      console.log("APQPWebTokenCheck---->urldoc--->"+API_URL, 'name', UserName,'pawd', Password, loginData);
      var key = CryptoJS.enc.Utf8.parse("8080808080808080");
      var iv = CryptoJS.enc.Utf8.parse("8080808080808080");
      var encryptedpassword = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(Password),
        key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      auth.getapqpweblogindata(
        GLOBAL_BASE_URL,
        UserName,
        encryptedpassword.toString(),
        async (res, data) => {
          console.log("webToken", data.data);
          if (data != "") {
            const userDataApqp = {
              userId: loginData?.userId,
              siteId: loginData?.siteId,
              accessToken: loginData?.accessToken,
              userFullName: loginData?.userFullName,
              // email: loginData?.Email.toString(), //need to add
              email: null, //need to add
              docattachurl: GLOBAL_BASE_URL, //need to add
              webToken: data?.data, //need to add
              currentServerUrl: API_URL,
              isDeviceRegistered: true,
              Address: "1/807A Pillaiyar Kovil Street, Thoraipakkam, Chennai - 600097",
              CompanyName: "Omnex Software Solutions",
              CompanyUrl: "http://www.omnexsystems.com",
              Logo: Images.topLogo,
              Phone: "044248634566",
              loginuser: loginData,
              category: category,
              title: title,
            };
            console.log('userDataApqp global-->', userDataApqp)
            const stringifiedUserDetails = JSON.stringify(userDataApqp);
            AsyncStorage.setItem('userDataApqp', stringifiedUserDetails);
            console.log('Set Async userDataApqp ', stringifiedUserDetails);

            if(category === 'APQP/PPAP') {
              console.log('reach APQP/PPAP')
              navigations.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                filterId: 2,
                title: strings.projects,
                todayn: 1,
                allprojects: null
                  // this.state.projects + this.state.risks + this.state.meetings,
              })
            } else if(category === 'Risk') {
              console.log('reach Risk')
              navigations.navigate(ROUTES.RISK_SCREEN, {
                filterId: 3,
                title: strings.risks,
              })
            } else if(category === 'Meeting') {
              console.log('reach Meeting')
              navigations.navigate(ROUTES.MEETING_SCREEN, {
                filterId: 4,
                title: strings.meetings,
                recentActivity: null
                // this.props.data.projects.recentActivity,
              })
            } else {
                console.log('reach Today Task')
            }
          }
        }
      );
    }
  };

  //PROBLEM SOLVER

  const navigateToStatusCount = (concerns) => {
    console.log('navigateToStatusCount---->', concerns)
    if (concerns == 'Supplier Concerns'){
        const field = 'TotalConcern'
        const title = 'All'
        navigations.navigate(ROUTES.LIST_SCREEN_PS, {
            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
            title,
        })
    } 
    else if (concerns == 'Open Concerns'){
        const field = 'OpenConcern'
        const title = 'Open'
        navigations.navigate(ROUTES.LIST_SCREEN_PS, {
            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
            title,
        })
    }
    else if (concerns == 'In Progress Concerns'){
        const field = 'InprogressConcern'
        const title = 'In-Progress'
        navigations.navigate(ROUTES.LIST_SCREEN_PS, {
            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
            title,
        })
    }
    else {
        const field = 'TotalConcern'
        const title = 'All'
        navigations.navigate(ROUTES.LIST_SCREEN_PS, {
            [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
            title,
        })
    } 
}

// IC Login

const loginCallIC = async routeName => {
    let Password = 'a1';
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(Password), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const formData = new FormData();
    formData.append('UserName', 'swetha');
    formData.append('RegisteredDeviceId', 'testdevice');
    formData.append('Password', encryptedpassword.toString());
    formData.append('LoginFlag', 1);
    const response = await postAPI(`${ApiUrl.IC_LOGIN}`, formData);
    if (response?.Success) {
        let icUserData = {
            userData: response?.Data[0] || {},
            token: response?.Token || '',
        };
        dispatch({ type: 'IC_USER_DATA', icUserData: icUserData });
        const settingsRes=await postAPI(`${ApiUrl.IC_SETTINGS}`)
        if(settingsRes.Success){
            dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
            navigations.navigate(routeName);
        }
    } else {
        showMessage({
            message: `${response.Message}`,
            backgroundColor: COLORS.ERROR,
            color: COLORS.white,
            duration: 1500,
            style: Platform.OS === 'ios' ? { height: 90, alignItems: 'flex-end' } : {},
        });
    }
    setLoading(false);
};

  const Item = ({ title, detail, images }) => (
    <>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.titleHeader}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardContainer}>
          {detail.map((items, index) => (
          items.category?.length && 
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cardContent}
            key={index} 
            onPress={() => {
            setOpacity(0.5),
            handleNavigation(title, items?.status, items?.category, items?.auditTitle, items?.routeName),
            setOpacity(1)}}
          >
            <ImageComponent style={styles.imageView} source={items.images} resizeMode={FastImage.resizeMode.contain} />
            <TextComponent style={styles.cardTitle}>
              {items.category}
            </TextComponent>
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL}>
                {0}
            </TextComponent>
          </TouchableOpacity>))}
        </View>
      </View>
      </ScrollView>
    </>
  )

  // console.log('dataSet--1--->', dataSet, 'data--->', data?.length, data)

  return (
    <SafeAreaView>
      {loading ? (
        <Modal
          transparent={true}
          animationType={'none'}
          visible={loading}
          onRequestClose={() => { console.log('close modal') }}
        >
        <View style={styles.modalBackground}>
          <Bubbles size={10} color="#12C0CF" />
        </View>
      </Modal>
      ) : null }
      
      {dataSet?.length > 0 && (
        <FlatList
          data={dataSet}
          renderItem={({ item }) => item?.title === null ?  null :  <Item detail={item?.detail} title={item?.title} images={item?.images} />}
          keyExtractor={item => item?.id}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#F1F9FE',
    paddingBottom: 20,
    marginTop: 0,
    marginBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: FONT_SIZE.NORMAL,
    color: COLORS.black,
    paddingVertical: SPACING.SMALL,
    marginHorizontal: 16,
    marginBottom: 0,
    width: '85%',
  },
  card: {
    paddingBottom: SPACING.SMALL,
    borderBottomWidth: 2,
    borderColor: COLORS.whiteGrey,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#F1F9FE',
    paddingBottom: 20,
    marginTop: 0,
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.SMALL
  },
  cardContent: {
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.white,
    width: RFPercentage(8.2),
    elevation: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: RFPercentage(2),
    marginHorizontal: screenWidth * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: FONT_SIZE.XXXX_SMALL,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
  },
  titleHeader: {
    backgroundColor: '#F1F9FE',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 15,
    flexDirection: 'row',
  },
  imageView: {
    height: 20,
    width: 18,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: '50%'
  },
});

export default TabsCard
