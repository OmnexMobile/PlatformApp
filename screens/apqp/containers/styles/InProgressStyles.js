import { StyleSheet, Dimensions } from 'react-native'
import { Metrics, ApplicationStyles } from '../../themes'
import Fonts from '../../themes/Fonts'
import { width, height } from 'react-native-dimension'


let Window = Dimensions.get('window')

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  fillcontainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    width: Window.width,
    height: Window.height,
  },
  bgImage: {
    width: Window.width,
    height: "140%",
    resizeMode: 'cover'
  },
  apqpTextStyle: {
    fontSize: 24,
    color: 'white'
  },
  buttonStyles: {
    borderTopColor: 'transparent',
    flexDirection: 'column',
  },
  buttonTouchableStyle: {
    width: 100,
    height: 30,
    borderRadius: 50,
    borderWidth: 0.5,
    elevation: 1,
    borderColor: 'lightgrey',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#AFAAAC',
  },
  buttonView: {
    paddingLeft: 10,
    borderColor: '#AFAAAC',
  },
  listView: {
    flexDirection: 'row',
    padding: 2,
  },
  listText: {
    color: '#AFAAAC',
    fontSize: Fonts.size.medium,
    padding: 2,
  },
  listNextText: {
    fontSize: Fonts.size.regular,
    padding: 2,
  },
  flatList: {
    width: Window.width,
    padding: 5,
  },
  flatListTouchableView: {
    width: '100%',
    //flex: 5,
    borderRadius: 1,
    borderWidth: 0.5,
    elevation: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    borderLeftWidth: 5,
    flexDirection: 'row'
  },
  // flatListInsideView: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   height: 25
  // },



  footerDiv: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },
  projectText: {
    flexDirection: 'column',
    width: width(45),
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionText: {
    flexDirection: 'column',
    width: width(45),
    justifyContent: 'center',
    alignItems: 'center'
  },
  lineIconStyle: {
    width: width(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerContainer: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  footerButton: {
    width: '50%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  footerButton1: {
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  footerButton2: {
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderLeftColor: 'white',
    borderLeftWidth: 0.5,
  },
  backLogo: {
    width: '10%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTextDiv: {
    width: '80%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarDiv: {
    width: '10%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },


  dullTextOverall: {
    width: '85%',
    height: 20,
    fontSize: 13,
    color: 'grey',
  },
  wrapper: {
    /*flex: 1,*/
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
    height: 70,
    top: 120,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingTop: 5
  },

  boxView: {
    width: '98%',
    height: 130,
    borderWidth: 0.5,
    borderRadius: 3,
    borderLeftWidth: 5,
    borderLeftColor: 'green',
    //backgroundColor:'yellow'

  },

  flatListWholeView: {
    width: window.width,
    height: 112,
    // backgroundColor: 'yellow',
    padding: 2,
    marginBottom: 10,
    borderWidth: 0.5,
    // borderColor:'lightgrey',
    borderRadius: 5,
    // elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: 'green'
  },


  bgImage: {
    width: Window.width,
    height: "140%",
    resizeMode: 'cover'
  },
  apqpTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: 'row',
    //color:'black',
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  apqpTextStyle: {
    fontSize: 24,
    color: 'white'
  },

  tabTextStyle: {
    color: 'black',
    fontSize: Fonts.size.small
  },
  tabsContainerStyle: {
    width: Metrics.screenWidth,
  },
  // buttonStyles: {
  //   position: 'absolute',
  //   marginTop: 85,
  //   // padding: 8,
  //   borderTopColor: 'transparent',
  //   // borderTopWidth: 0.5,
  //   //   backgroundColor:'yellow',
  //   flexDirection: 'column',
  //   height: 40

  // },
  buttonTouchableStyle: {
    width: 100,
    height: 30,
    borderRadius: 50,
    borderWidth: 0.5,
    elevation: 1,
    borderColor: 'lightgrey',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#AFAAAC',
  },
  buttonView: {
    paddingLeft: 10,
    borderColor: '#AFAAAC',
  },
  // listText: {
  //   color: '#AFAAAC',
  //   fontSize: Fonts.size.medium,
  //   padding: 3,
  //   marginLeft: 10
  // },
  // flatList: {
  //   width: Window.width,
  //   height: '100%',
  //   //flex:4,
  //   //flexDirection:'column',
  //   position: 'absolute',
  //   marginTop: 120,
  //   padding: 5,
  // },
  flatListView: {
    flex: 1,
    padding: 3,
  },
  flatListTouchableView: {
    width: '100%',
    //flex: 5,
    borderRadius: 1,
    borderWidth: 0.5,
    elevation: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    borderLeftWidth: 5,
    flexDirection: 'row'
  },
  flatListInsideView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    height: 25
  },
  actionTypeTextStylecb: {
    color: '#485B9E',
    fontSize: Fonts.size.input,
    width:'90%'
  },
  actionTypeTextStyle: {
    color: '#7F7D7D',
    fontSize: Fonts.size.regular,
  },
  dateTextStyle: {
    color: '#7F7D7D',
    fontSize: Fonts.size.medium,
  },
  actionTypeTextStyleDesc: {
    color: '#7F7D7D',
    fontSize: Fonts.size.regular,
    width: '55%'
  },
  actionTypeLineStyle: {
    //borderBottomColor:'black',
    //borderBottomWidth:0.5
  },
  recordStyle: {
    fontSize: Fonts.size.input,
  },
  circleView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    position: 'absolute',

    backgroundColor: 'red'
  },
  progressVal: {
    fontSize: Fonts.size.medium,
    color: '#1d1d1d'
  },
  footerDiv: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },
  projectText: {
    flexDirection: 'column',
    width: width(45),
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionText: {
    flexDirection: 'column',
    width: width(45),
    justifyContent: 'center',
    alignItems: 'center'
  },
  lineIconStyle: {
    width: width(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerContainer: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  footerButton: {
    width: '50%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  footerButton1: {
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  footerButton2: {
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderLeftColor: 'white',
    borderLeftWidth: 0.5,
  },
  backLogo: {
    width: '10%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // headerTextDiv: {
  //   width: '80%',
  //   height: 70,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  calendarDiv: {
    width: '10%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressText: {
    fontSize: 13,
    color: '#485B9E',
  },
  progressTextOverall: {
    width: '85%',
    height: 20,
    fontSize: 13,
    color: '#485B9E',
  },
  dullTextOverall: {
    width: '30%',
    height: 20,
    fontSize: 13,
    color: 'grey',
   paddingBottom:10
  },
  NumberTextOverall: {
    width: '20%',
    height: 23,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    justifyContent:'center',
    alignItems:'center',
    paddingBottom:10
  },
  NumberTextOverallred: {
    width: '20%',
    height: 23,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    justifyContent:'center',
    alignItems:'center',
    paddingBottom:10
  },
  dropdowndiv:{
    flex:1,
    width:'40%',
    height:40,
    flexDirection:'row',
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  searchDiv:{
    width:'100%',
    height:40,
    backgroundColor:'white',
    marginTop:10,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
    },
    header:{
      width:'100%',
      height:70,
      backgroundColor:'white',
      justifyContent:'center',
      alignItems:'center',
      borderBottomColor:'lightgrey',
      borderBottomWidth:0.5
    },  
    calendarDiv2:{
      width:'100%',
      backgroundColor:'white',
      borderRadius:10,
      padding:10
    },
    footer:{
      width:'100%',
      height:55,
      backgroundColor:'white',
      justifyContent:'center',
      alignItems:'center',
      borderTopColor:'lightgrey',
      borderTopWidth:0.5
    },  
    apqpTypeIcon: {
      width: 20,
      height: 17,
      right: 5,
      top: 5,
      position: 'absolute'
    },
    riskTypeIcon: {
      width: 20,
      height: 19,
      right: 5,
      top: 5,
      position: 'absolute'
    },
    meetingTypeIcon: {
      width: 20,
      height: 21,
      right: 5,
      top: 5,
      position: 'absolute'
    }
})