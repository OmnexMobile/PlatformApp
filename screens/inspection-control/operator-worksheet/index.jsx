import { ButtonComponent, TextComponent } from 'components'
import React from 'react'
import CustomHeader from '../Components/CustomHeader'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from 'constants/theme-constants'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import  IconA  from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import { ROUTES } from 'constants/app-constant'

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

const OperatorWorksheet = () => {
    const navigation=useNavigation()
    const handleCIbtnpress=()=>{
      navigation.navigate(ROUTES.COMPLETED_INSPECTION)
    }
    const handleLaunchPress=()=>{
      navigation.navigate(ROUTES.INPROCESS_INSPECTION)
    }
  const renderItem=({item})=>{
    return(
      <View style={[styles.recordConatiner]}>
        <View style={[styles.iconBox]}>
          <Icon name='layers-outline' size={25} color={COLORS.white}/>
        </View>
        <View style={{flex:1,paddingHorizontal:10}}>
            <Text style={[styles.cardText]}>{item?.title}</Text>
            <Text style={[styles.operationText]}>Operation Name : <Text style={[styles.secondText]}>{item.OperationName}</Text></Text>
            <Text style={[styles.operationText]}>Frequency : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text></Text>
            <Text style={[styles.operationText]}>Lot Number : <Text style={[styles.secondText]}>{item.InvoiceNo}</Text></Text>
        </View>
        <View style={[styles.lastBox]}>
          <TouchableOpacity style={styles.launchCard} onPress={()=>{handleLaunchPress()}}>
            <Text style={[styles.launchText]}>Launch</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <IconA name='delete' size={20} color={COLORS.ERROR}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <CustomHeader title='Operator Worksheet' activeTabId={2}>
      <View style={[styles.container]}>
        <FlatList 
          data={listData} 
          renderItem={renderItem} 
          keyExtractor={item => item.id} 
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={[styles.btnContainer]}>
        <ButtonComponent style={{ height: 40 }} onPress={()=>{handleCIbtnpress()}}>
          Completed Inspections
        </ButtonComponent>
      </View>
    </CustomHeader>
  )
}
const styles=StyleSheet.create({
  container:{
    flex:1,
  },
  recordConatiner:{
    flex:1,
    padding:15,
    flexDirection:'row',
    backgroundColor:'#fff',
    marginBottom:10,
    borderRadius:10
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
  launchCard:{
    backgroundColor:COLORS.apptheme,
    paddingHorizontal:13,
    paddingVertical:4,
    borderRadius:5
  },
  launchText:{
    color:"#fff",
    fontFamily: 'ProximaNova-Bold',
  },
  lastBox:{
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'flex-end'
  },
  btnContainer:{
    paddingTop:10
  },
})

export default OperatorWorksheet
