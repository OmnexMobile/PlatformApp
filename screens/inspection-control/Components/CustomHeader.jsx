import { useNavigation } from '@react-navigation/native';
import { ListSearch } from 'components';
import { COLORS, FONT_SIZE } from 'constants/theme-constants'
import React, { useRef, useState } from 'react'
import { Animated, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconO from 'react-native-vector-icons/Octicons';
import IconA from 'react-native-vector-icons/AntDesign';
import InputWithSearch from './InputWithSearch';
import InspectionInspectionSvg from '../../../assets/images/svg/inspection-scedule.svg'
import OperatorWorksheetSvg from '../../../assets/images/svg/operator-worksheet.svg'
import CompletedInspectionnSvg from '../../../assets/images/svg/completed-inspection.svg'
import SupervisorScheduleSvg from '../../../assets/images/svg/supervisor-schedule.svg'
import { ROUTES } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';

const footerList=[
  {
    id:1,
    title:'Inspection\nSchedule',
    svg:InspectionInspectionSvg,
    routeName:ROUTES.INSPECTION_SCHEDULE,
  },
  {
    id:2,
    title:'Operator\nWorksheet',
    svg:OperatorWorksheetSvg,
    routeName:ROUTES.OPERATOR_WORKSHEET,
  },
  {
    id:3,
    title:'Completed\nInspection',
    svg:CompletedInspectionnSvg,
    routeName:ROUTES.COMPLETED_INSPECTION,
  },
  {
    id:4,
    title:'Supervisor\nSchedule',
    svg:SupervisorScheduleSvg,
    routeName:ROUTES.SUPERVISOR_SCHEDULE,
  }
]


const CustomHeader = ({children,title='',activeTabId}) => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const widthAnim = useRef(new Animated.Value(0)).current;

  const toggleSearchBar = () => {
    if (isExpanded) {
      Animated.timing(widthAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsExpanded(false));
    } else {
      setIsExpanded(true);
      Animated.timing(widthAnim, {
        toValue: activeTabId!==4?RFPercentage(29):RFPercentage(25), // Width in pixels
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleTabPress=(value)=>{
    if(value){
      navigation.navigate(value)
    }
  }
  const renderTab=({item})=>{
    let RenderSvg=item.svg
   return (
    <TouchableOpacity style={[styles.tabBox]} onPress={()=>{handleTabPress(item?.routeName)}}>
      <View style={[styles.activeTabBox,{backgroundColor:activeTabId==item.id?COLORS.tabtheme:null}]}>
        <RenderSvg height={25} width={25} fill={activeTabId==item.id?COLORS.apptheme:COLORS.grey}/>
      </View>
      <Text style={[styles.tabTitle,{color:activeTabId==item.id?COLORS.apptheme:COLORS.headerText}]}>{item?.title}</Text>
    </TouchableOpacity>
    )
  }
  return (
   <SafeAreaView
   style={[styles.container]}
   >
    <View style={[styles.headerBox]}>
      <TouchableOpacity onPress={()=>{navigation.goBack()}}>
        <Icon name='arrowleft' size={25} color={COLORS.white}/>
      </TouchableOpacity>
      <View style={{flex:1,alignItems:'center'}}>
        {!isExpanded?<Text style={[styles.headerText]}>{title}</Text>:
         <Animated.View style={[ { width: widthAnim }]}>
          <InputWithSearch />
        </Animated.View>
        }
      </View>
      <View style={[styles.rightIconList]}>
        {(activeTabId==1 || activeTabId==4 )&&<TouchableOpacity onPress={()=>{
          toggleSearchBar()}
          }>
          <Icon name={!isExpanded?'search1':"close"} size={25} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>}
        {activeTabId==1 &&<TouchableOpacity>
          <IconF name='qrcode' size={25} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>}
        {activeTabId==2 &&<TouchableOpacity>
          <IconI name='settings-outline' size={25} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>}
        {activeTabId==4 &&<TouchableOpacity>
          <IconA name='filter' size={25} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>}
        {(activeTabId==3 || activeTabId==4) &&<TouchableOpacity>
          <IconO name='sync' size={25} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>}
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <IconI name='exit-outline' size={31} style={styles.iconButton} color={COLORS.white}/>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.contentContainer}>
      {children}
    </View>
    <View style={[styles.footerBox]}>
      <FlatList data={footerList} 
      renderItem={renderTab} 
      keyExtractor={item => item.id} 
      contentContainerStyle={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingTop:10}}/>
    </View>
   </SafeAreaView>
  )
}
const styles=StyleSheet.create({
  container:{
    flex:1
  },
  contentContainer:{
    flex:1,
    backgroundColor:COLORS.icBackground,
    padding:10
  },
  headerBox:{
    backgroundColor:COLORS.apptheme,
    height:65,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:15
  },
  rightIconList:{
    flexDirection:'row',
    alignItems:'center'
  },
  iconButton:{
    marginLeft:10
  },
  headerText:{
    color:COLORS.white,
    fontSize:FONT_SIZE.LARGE
  },
  footerBox:{
    backgroundColor:COLORS.white,
    height:80,
    paddingHorizontal:15,
  },
  tabBox:{
    alignItems:'center'
  },
  tabTitle:{
    textAlign:'center',
  },
  activeTabBox:{
    paddingHorizontal:14,
    paddingVertical:3,
    borderRadius:100
  },
  animatedContainer: {
    flex:1,
  },
})
export default CustomHeader
