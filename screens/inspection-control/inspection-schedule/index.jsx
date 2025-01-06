import { ButtonComponent, ModalComponent, TextComponent } from 'components'
import React, { useState } from 'react'
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustomHeader from '../Components/CustomHeader'
import { COLORS } from 'constants/theme-constants'
import { useNavigation } from '@react-navigation/native'
import { ROUTES } from 'constants/app-constant'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import  IconF  from 'react-native-vector-icons/Feather'
import  IconI  from 'react-native-vector-icons/Ionicons'
import DataPickerWithIcon from '../Components/DataPickerWithIcon'
import FilterWithMenu from '../Components/FilterWithMenu'
import InputDataModal from '../Components/inspection-schedule/InputDataModal'
// import ICFile from '../../../assets/images/svg/icFile.svg'

const listData=[
  {
    id:1,
    title:"0906 Engine",
    OperationName : "2-Stroke Engine",
    InvoiceNo : 3,
    createdDate:'04/06/2024',
    isDownloaded:false,
  },
  {
    id:2,
    title:"1000 IC Test",
    OperationName : "5-Stroke Engine",
    InvoiceNo : 4,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:3,
    title:"200 IC Test",
    OperationName : "6-Stroke Engine",
    InvoiceNo : 6,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:4,
    title:"400 IC Test",
    OperationName : "9-Stroke Engine",
    InvoiceNo : 7,
    createdDate:'01/07/2024',
    isDownloaded:false,
  },
  {
    id:5,
    title:"100 TC Test",
    OperationName : "9-Stroke Engine",
    InvoiceNo : 8,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:6,
    title:"9000 IC Test",
    OperationName : "900-Stroke Engine",
    InvoiceNo : 9,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:51,
    title:"100 TC Test",
    OperationName : "9-Stroke Engine",
    InvoiceNo : 8,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:16,
    title:"9000 IC Test",
    OperationName : "900-Stroke Engine",
    InvoiceNo : 9,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:7,
    title:"100 TC Test",
    OperationName : "9-Stroke Engine",
    InvoiceNo : 8,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
  {
    id:9,
    title:"9000 IC Test",
    OperationName : "900-Stroke Engine",
    InvoiceNo : 9,
    createdDate:'03/07/2024',
    isDownloaded:false,
  },
]
const filterList=[
  {
    id:1,
    title:'Inprocess Inspection'
  },
  {
    id:2,
    title:'Receiving Inspection'
  },
  {
    id:3,
    title:'Final Inspection'
  }
]
const moreList=[
  {
    id:1,
    title:'Get Schedule',
    iconName:'calendar-check-o'
  },
  {
    id:2,
    title:'Start Inspection',
    iconName:'search'

  }
]
const InspectionSchedule = ({route}) => {
  const navigation=useNavigation()
  const [showModal,setShowModal]=useState(false)
  const handleCIbtnpress=()=>{
    navigation.navigate(ROUTES.COMPLETED_INSPECTION)
  }
  const handleDownloadPress=(item)=>{
    setShowModal(true)
  }
  const handleMenuPress=(value)=>{
    console.log(value,'value')
    if(value.id==2){
      navigation.navigate(ROUTES.OPERATOR_WORKSHEET)
    }
  }
  const renderData=({item})=>{
    return(
      <View style={[styles.recordConatiner]}>
        <View style={[styles.iconBox]}>
          <Icon name='layers-outline' size={25} color={COLORS.white}/>
        </View>
        <View style={{flex:1,paddingHorizontal:10}}>
          <Text style={[styles.cardText]}>{item?.title}</Text>
          <Text style={[styles.operationText]}>Operation Name : <Text style={[styles.secondText]}>{item.OperationName}</Text></Text>
          <Text style={[styles.operationText]}>Invoice No : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text></Text>
        </View>
        <View style={[styles.lastBox]}>
          <Text style={[styles.secondText]}>{item.createdDate}</Text>
          <View style={[styles.iconlist]}>
            {/* <ICFile/> */}
            <TouchableOpacity style={{marginLeft:15}}>
              <IconI name='document-attach-outline'size={25} color="#666666" />
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:15}} onPress={()=>{handleDownloadPress(item)}}>
            <IconF name='download' size={25} color="#666666"  />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  return (
   <CustomHeader title='Inspection Schedule' activeTabId={1}>
    <View style={[styles.mainContainer]}>
      <View style={[styles.overAllBox]}>
        <View style={[styles.filterBox]}>
        <DataPickerWithIcon/>
        </View>
        <View style={[styles.filterBox]}>
        <DataPickerWithIcon placeHolder='End Date'/>
        </View>
        <View style={[styles.filterList]}>
          <FilterWithMenu dataList={filterList} type='BtnFilter'/>
        </View>
        <View style={[styles.iconFilter]}>
          <FilterWithMenu dataList={moreList} type='IconFilter' onSelectedPress={(value)=>{
            handleMenuPress(value)
          }}/>
        </View>
      </View>
      <FlatList
        data={listData}
        renderItem={renderData} 
        keyExtractor={item => item.id} 
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.bottombox]}>
        <Text style={[styles.bottomText]}>Total Inspections  </Text>
        <View style={[styles.totalBox]}>
          <Text style={[styles.bottomText,{color:COLORS.white}]}>{listData?.length}</Text>
        </View>
      </View>
    </View>
    <View style={[styles.btnContainer]}>
      <ButtonComponent style={{ height: 40 }} onPress={()=>{handleCIbtnpress()}}>
        Completed Inspections
      </ButtonComponent>
    </View>
    <InputDataModal modalVisible={showModal} hideModal={()=>{setShowModal(false)}}/>
   </CustomHeader>
  )
}
const styles=StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor:COLORS.white,
    borderRadius:10,
  },
  btnContainer:{
    paddingTop:10
  },
  recordConatiner:{
    flex:1,
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:COLORS.icborder,
    flexDirection:'row',
  },
  iconBox:{
    borderRadius:40,
    backgroundColor:COLORS.apptheme,
    height:40,
    width:40,
    alignItems:'center',
    justifyContent:'center'
  },
  cardText:{
    fontSize:16,
    fontFamily: 'ProximaNova-Bold',
    color:COLORS.ictextBlack,
  },
  operationText:{
    fontSize:14,
    fontFamily: 'ProximaNova-Regular',
    color:COLORS.ictextBlack,
    lineHeight:22
  },
  secondText:{
    color:COLORS.textDark,
    fontFamily: 'ProximaNova-Regular',
  },
  iconlist:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  lastBox:{
    flexDirection:'column',
    justifyContent:'space-between',
  },
  bottombox:{
    flexDirection:'row',
    height:34,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:COLORS.icBottomBox,
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
  },
  totalBox:{
    backgroundColor:COLORS.apptheme,
    paddingHorizontal:10,
    paddingVertical:3,
    borderRadius:4
  },
  bottomText:{
    fontSize:14,
    fontFamily:'ProximaNova-Bold',
  },
  filterBox:{
    width:'30%'
  },
  filterList:{
    width:'25%'
  },
  iconFilter:{
    width:"10%",
  },
  overAllBox:{
    padding:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  }
})

export default InspectionSchedule
