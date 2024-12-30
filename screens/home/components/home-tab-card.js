import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity, SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Linking,
  Dimensions
} from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import strings from 'config/localization';
import { IconComponent, ImageComponent } from 'components';
import { IMAGES } from 'assets/images';
import FastImage from 'react-native-fast-image';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import { RFPercentage, showWarningMessage } from 'helpers/utils';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import { useAppContext } from 'contexts/app-context';
import localStorage from 'global/localStorage';
import globalAuth from '../../../services/Auditpro-Auth';


const screenWidth = Dimensions.get("window").width;
const TabsCard = ({ countDetails, tabIndex, noTab, navigation }) => {
  console.log('tabIndex--------', tabIndex, noTab)
  // console.log('CURRENT_PAGE---->', 'home-tab-card')
  const navigations = useNavigation();
  const [currentUserData, setCurrentUserData] = useState([]);
  const [currentUserDataPS, setCurrentUserDataPS] = useState([]);
  // This hook returns `true` if the screen is focused, `false` otherwise
  const isFocused = useIsFocused();
  const [isRegister, setIsRegister] = useState(null)
  const [isRegisterPS, setIsRegisterPS] = useState(null)
  const { handleGlobalURL, globalDeviceDetails } = useAppContext();

  const data = [
    {
      id: 1,
      title: tabIndex === 0 ? strings.ppapProjects : strings.apqp_ppapManager,
      detail: [
        { images: IMAGES.actions, category: strings.Actions, status: 0 },
        { images: IMAGES.projects, category: strings.projects, status: 0 },
        { images: tabIndex === 0 ? null : IMAGES.risk, category: tabIndex === 0 ? null : strings.risk, status: 0 },
        { images: tabIndex === 0 ? null : IMAGES.meeting, category: tabIndex === 0 ? null : strings.meeting, status: 0 },
        { images: IMAGES.todayTask, category: strings.todayTask, status: 0 },
        { images: IMAGES.dailyTask, category: strings.dailyTask, status: 0 }
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
      title: tabIndex === 0 ? strings.documentPro : null,
      detail: tabIndex === 0 ? [
        { images: IMAGES.inProgressConcerns, category: strings.documentLevels, status: 0 },
        { images: IMAGES.inProgressConcerns, category: strings.actionList, status: 0 },
        { images: IMAGES.inProgressConcerns, category: strings.adminActions, status: 0 }
      ] : []
    },
  ];

  const redirectToPage = (title, status, category) => {
    ((status > 0) && (title === strings.auditPro)) 
      ? navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING, { projectTitle: title, status: status, category: category.replace(/\n/g, ' ') }) 
      : null
  }

  const navigateToSettings = () => {
    console.log('click settings')
    navigations.navigate(ROUTES.USER_PREFERENCE);
  }

  // console.log('currentUserData---', isFocused, currentUserData, currentUserData?.siteId?.length)

  useEffect(() => {
    async function getUserDetails() {
      try {
        const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
        const value = JSON.parse(stringifiedUserDetails);
        // console.log('current userdata--->', value)
        if (value !== null) {
          // value previously stored
          console.log('current token2 Auditpro--->', value?.accessToken)
          setCurrentUserData(value)
        } else {
          console.log('current token3 Auditpro--->', value?.accessToken)
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
          // value previously stored
          console.log('current token2 ps--->', value)
          setCurrentUserDataPS(value)
        } else {
          console.log('current token3 ps--->', value)
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
          console.log('current isRegister auditpro--->', value)
          setIsRegister(value)
        }
      } catch (e) {
        // error reading value
        console.log('isRegister error--->', e)
      }
    }
    getdeviceRegisterStatus()
  }, [isRegister, isFocused])

  useEffect(() => {
    async function getdeviceRegisterStatusPS() {
      try {
        const value = await AsyncStorage.getItem('isRegisterPS')
        if (value !== null) {
          // value previously stored
          console.log('current isRegister PS--->', value)
          setIsRegisterPS(value)
        }
      } catch (e) {
        // error reading value
        console.log('isRegister PS error--->', e)
      }
    }
    getdeviceRegisterStatusPS()
  }, [isFocused])

  const showToast = () => {
    // Toast.show("This is a toast message!", Toast.SHORT);
    Toast.showWithGravity(
      "No Settings Data!",
      Toast.LONG,
      Toast.TOP,
    );
  };

  const handleNavigation = async (title, status, category, auditTitle) => {
    // console.log('handleNavigation params--->', title, status, category, auditTitle)
    console.log('handleNavigation currentUserData?.accessToken--->', currentUserData, globalDeviceDetails?.deviceDetails)

    if(title === strings.auditPro) {
    	localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.AuditProURL);
			handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.AuditProURL)
      globalAuth.setServerUrl(globalDeviceDetails?.deviceDetails?.AuditProURL);
      await AsyncStorage.setItem('storedserverrul', globalDeviceDetails?.deviceDetails?.AuditProURL);
      console.log('current click--->', strings.auditPro)
      const projectDetails = {
        projectTitle: title,
        projectStatus: status,
        projectCategory: category.replace(/\n/g, ' '),
        auditTitle: auditTitle,
      };
      const stringifiedProjectDetails = JSON.stringify(projectDetails);
      AsyncStorage.setItem('projectDetails', stringifiedProjectDetails);
      console.log('Set Async projectDetails ', stringifiedProjectDetails)
      // redirectToPage(title, status, category)
      if(currentUserData?.accessToken?.length && currentUserData?.accessToken) {
          console.log('auditPro handleNavigation 1--->', title, status, category)
          redirectToPage(title, status, category)
        } 
      else {
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ServerUrl)
        handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.ServerUrl)
        globalAuth.setServerUrl(globalDeviceDetails?.deviceDetails?.ServerUrl);
        await AsyncStorage.setItem('storedserverrul', globalDeviceDetails?.deviceDetails?.ServerUrl);
        console.log('isRegister--->', isRegister)
        if(isRegister === 'yes') {
          console.log('auditPro handleNavigation 2--->', title, status, category)
          // navigations.navigate(ROUTES.LOGINUISCREEN, { title: title, projectStatus: status, category: category.replace(/\n/g, ' ')} )
          navigations.navigate(ROUTES.GLOBAL_LOGIN)
        } else {
          console.log('auditPro handleNavigation 3--->', title, status, category)
          // navigations.navigate(ROUTES.REGISTRATION, { title: title, projectStatus: status, category: category.replace(/\n/g, ' ')} )
          navigations.navigate(ROUTES.GLOBAL_REGISTER)
        }
      }
    } else if (title === strings.problemSolver) {
      localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.PSApiURL);
			handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.PSApiURL)
      console.log('current click--->', strings.problemSolver,'--', category.replace(/\n/g, ' '),'--', category, '--')
      await AsyncStorage.setItem('concerns', category.replace(/\n/g, ' '));
      if(currentUserData?.accessToken?.length && currentUserData?.accessToken) {
        navigations.navigate(ROUTES.HOME_PS)
      } else {
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.ServerUrl)
        handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.ServerUrl)
        console.log('isRegister--->PS', isRegisterPS)
        if(isRegisterPS === 'yes') {
          console.log('PS handleNavigation 1--->')
          navigations.navigate(ROUTES.GLOBAL_LOGIN)
        } else {
          console.log('PS handleNavigation 2--->')
          navigations.navigate(ROUTES.GLOBAL_REGISTER)
        }
      }
    } else if (title === strings.documentPro) {
      // navigations.navigate(ROUTES.DASHBOARD_APQP)
      console.log('current click--->', strings.documentPro)
    } else {
      // console.log('current click--->')
    }
  }

  const Item = ({ title, detail, images }) => (
    <>
      <View style={styles.titleHeader}>
        <Text style={styles.headerTitle}>{title}</Text>
        {/* {console.log('titile--->', title, strings.auditPro, currentUserData?.siteId?.length, (title === strings.auditPro) && (currentUserData?.siteId?.length > 0))} */}
        {/* <Pressable style={{ width: '15%', marginTop: '2%' }} onPress={() =>  (currentUserData?.siteId?.length > 0) && (title === strings.auditPro) ? navigateToSettings() : (title !== strings.auditPro) ? null : showWarningMessage('No Settings Data...Please Login')}>
          <IconComponent name="setting" type={ICON_TYPE.AntDesign} size={FONT_SIZE.LARGE} color={COLORS.black} />
        </Pressable> */}
      </View>
      <View style={styles.item}>
      {detail.map((items, index) => (
        items.category?.length && 
        <TouchableOpacity activeOpacity={0.9} key={index} onPress={() =>
          // console.log('currentUserData---->', currentUserData)
          handleNavigation(title, items?.status, items?.category, items?.auditTitle)
          // sendToOtherApps()
          // linkApps()
        }>
        {/* {detail.map((items, index) => (
            items.category?.length &&  */}
          <Card key={index} style={styles.card}>
            <View style={styles.cardContent}>
              {/* <TouchableOpacity key={index} onPress={() =>
                handleNavigation(title, items?.status, items?.category)
                // sendToOtherApps()
                // linkApps()
              }> */}
                <ImageComponent style={styles.imageView} source={items.images} resizeMode={FastImage.resizeMode.contain} />
              {/* </TouchableOpacity> */}
            </View>
            <Text style={styles.cardTitle}>{items.category}</Text>
          </Card>
        {/* ))} */}
        </TouchableOpacity>
      ))}
      </View>
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => item.title === null ?  null :  <Item detail={item.detail} title={item.title} images={item.images} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

//test

  container1: {
    alignItems: "flex-start",
    paddingHorizontal: 10, // Adjust padding as needed
  },
  item1: {
    backgroundColor: "#f9c2ff",
    padding: 10,
    margin: 5,
    width: (screenWidth - 60), // Adjust based on screen width
    alignItems: "center",
    justifyContent: "center",
  },



  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    backgroundColor: '#F1F9FE',
    paddingBottom: 20,
    // paddingVertical: RFPercentage(3),
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
    // paddingLeft: 5,
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
    backgroundColor: COLORS.white,
    elevation: 10,
    marginVertical: 10,
    marginHorizontal: 17,
    // marginTop: 20,
    // marginRight: 16,
    // marginLeft: 17,
    padding: 6,
    // padding: RFPercentage(1),
    // paddingHorizontal: RFPercentage(1),
    // paddingVertical: RFPercentage(1.5),
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: "center",
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
    flexDirection: 'row'
  },
  imageView: {
    height: 40,
    width: 36,
    marginVertical: 4,
    marginHorizontal: 8
  }
});

export default TabsCard
