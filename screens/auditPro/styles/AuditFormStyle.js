import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({

  // Header styles
  header: {
    width:'100%',
    //zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
   padding: 5,
    justifyContent: 'flex-start',
    alignContent:'center',
    height: 80,
    // elevation: 4,
    // shadowOffset: { width: 2, height: 10 },
    // shadowColor: "lightgrey",
    // shadowOpacity: 0.5,
    shadowRadius: 4,
    // flex:1,
    marginRight:10,
    // marginLeft:5,
  },
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: '70%',
    height: 60
  },
  headingText:{
    fontSize: Fonts.size.h6,
    fontFamily : Fonts.type.base,
    color: 'black',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: '25%',
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  headerDiv:{
    width:'15%',
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeader: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems:'center',
    right: 10,
    height: 80
  },
  backgroundImage: {
    resizeMode:'stretch',
    width:width(30),
    height: 80,
    zIndex: 0
  },

  // Footer styles
  footer:{
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    backgroundColor:'transparent',
    height: 60,
   // zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignContent:'center',
    width:'100%',
    height:70,
   // position:'absolute'
  },
  footerLoader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%'
  },
  footerTextContent: {
    color:'white', 
    fontSize: Fonts.size.regular
  },
  footerDivContent: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignContent:'center'
  },
  toastContainer: {
    backgroundColor: 'black',
    margin: 20,
  },
  toastText: {
    color: 'white',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b3d6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  syncButtonText: {
    color: 'white',
    fontSize: Fonts.size.h5,
    marginLeft: 8,
    fontFamily: 'OpenSans-Regular',
  },

  // Body styles
  auditPageBody: {
    flex: 1,
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf:'stretch'
  },
  uploadDiv:{
    width:Window.width,
    height:'15%',
    justifyContent: 'center',
    alignItems: 'center',
    top:height(20)
  },
  button:{
    top:height(12),
    width:Window.width,
    height:height(25),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonBox:{
    width:'75%',
    height:'23%',
    justifyContent: 'flex-start',
    alignContent:'center',
    borderWidth:1,
    borderRadius:8,
    backgroundColor: 'white'
  },
  uploadBox:{
    width:'75%',
    height:'28%',
    justifyContent:'flex-start',
alignContent:'center',    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8

  },
  text:{
    position: 'absolute',
    // alignItems:'center',
    // justifyContent:'center',
    width:Window.width,
    top:height(10),
    height:height(10),
    left: 10,
  },
  textFont:{
    fontSize: Fonts.size.h5,
    color:'transparent'
  },

  templatetext:{
    left: 10,
    backgroundColor:'transparent',
  },
  fontext:{
    fontSize: Fonts.size.h5,
  },
  secondDiv:{
    flexDirection: 'row',
    width:'100%',
    height: 70,
    backgroundColor: 'transparent',
    //position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 40000,
    paddingTop: 10
    //borderTopWidth:0.5
  },
  checkListDiv1:{
    width:Window.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: '30%'
  },
  checktBox:{
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderRadius: 5,
    //elevation: 2,
    // flexDirection:'column',
  },
  CheckButton:{
    width: '100%',
    height: 40,
    backgroundColor:'#00A2E5',
    borderRadius: 10,
   // justifyContent: "space-around",
    // alignItems: 'center',
    justifyContent:'center',
    alignContent:'center',
    flexDirection:"row",
    
    // left:0
  },
  CheckButton1:{
    width:"60%",
    height: 40,
    backgroundColor:'#00A2E5',
    borderRadius: 20,
    justifyContent: "space-around",
    alignItems: 'center',
    flexDirection:"row",
    
    // left:0
  },
  madatecircleDiv:{
    width:"5%",
    height:null,
    justifyContent:'center',
    alignItems:'center'
    },
    mandatecircle:{
      width:30,
      height:30,
      borderRadius:20,
      backgroundColor:'white',
      position:"absolute",
      left:8,
      justifyContent:'center',
      alignItems:'center'
    },
    LoginBtn01:{
      width:'90%',
      height: 50,
      backgroundColor:'transparent',
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 25
    },
  buttonText: {
    textAlign: 'center',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems:"center",
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular',marginTop:10
  },
  checkListDiv2:{
    width:Window.width,
    justifyContent: 'center',
    alignItems: 'center',
    height:height(18),
    // backgroundColor: 'grey',
    marginTop: 8,
    marginBottom: 8
  },
  checkListDiv3:{
    width:Window.width,
    justifyContent: 'center',
    alignItems: 'center',
    height:height(30),
    // backgroundColor: 'grey',
    marginTop: 20,
    marginBottom: 8,
    paddingTop: 30
  },
  checklistBox0:{
    width:'90%',
    height:height(7),
    borderWidth: 1,
    backgroundColor:'white',
    justifyContent: 'flex-start',
    alignContent:'center',
    flexDirection: 'column',
    borderRadius: 8,
  },
  body:{
    width:Window.width,
    height:'90%' ,
    backgroundColor:'transparent',
    position :'absolute' ,
    top: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checklistBox:{
    width:'95%',
    height:'16%',
    borderWidth: 1,
    backgroundColor:'white',

    flexDirection: 'column',
    borderRadius: 8
  },
  checkText:{
    fontSize: Fonts.size.regular,
    color:'#00008B'
  },
  scrollview:{
    backgroundColor:'transparent',
  },
  heading01:{
    width:Window.width,
    height:height(7),
    backgroundColor: 'transparent',
    justifyContent:'center',
    alignItems:'center'
  },
  headline:{
    backgroundColor:'transparent',
    width: width(95),
    height:height(6)
  },
  button1:{
    width:Window.width,
    height:height(31),
    // bootom:5,
    bottom:30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardDiv:{
    width:Window.width,
    height:height(18),
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDivBox:{
    width:'90%',
    height:'15%',
    backgroundColor:'white',
    elevation:5,
    flexDirection:'column',
    borderWidth:0.5
  },
  Box01:{
    width:'100%',
    height:height(8),
    backgroundColor:'transparent',
    borderTopWidth: 0
  },
  Box:{
    width:'100%',
    height:height(8),
    backgroundColor:'transparent',
    borderTopWidth: 0.5
  },
  Section1:{
    flexDirection:'column',
    left:15
  },
  Section2:{
    flexDirection:'column',
    flex:1,
    left:15
  },
  AttBox:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width:'90%',
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
  },

  // Card view styles
  scrollViewBody: {
    height:'100%', 
    backgroundColor: 'transparent' 
  },
  cardBox:{
    backgroundColor:'white',
    margin: 10,
    elevation: 3,
    flexDirection:'column',
    borderRadius: 5,
    padding: 5,
    borderWidth:0.5,
    borderColor:'lightgrey'

  },
  sectionTop:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    padding: 10    
  },
  sectionBottom:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10     
  },
  sectionContent: {
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxHeader: {
    width: '100%',
    color:'#A6A6A6', 
    fontSize: Fonts.size.small,
    fontFamily:'OpenSans-Regular'
  },
  boxContent: {
    // width: '100%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular'
  },
  boxContentAtt: {
    width: '80%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular
  },
  floatingDiv:{
    position:'absolute',
    right:20,
    bottom:20,
    zIndex:1000,
    justifyContent:'center',
    alignItems:'center'
  },
  floatingSync:{
    position:'absolute',
    right:20,
    bottom:90,
    zIndex:1000,
    justifyContent:'center',
    alignItems:'center'
  },
  floatinBtn:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:60,
    backgroundColor:'#123C95',
    borderRadius:100,
    zIndex:1000,
    elevation:15,
    justifyContent:'center',
    alignItems:'center'
  },
  missingModal:{
    width:'100%',
    height:null,
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column'
  },
  missingMContainer:{
    width:'100%',
    height:80,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    justifyContent:'center',
    alignItems:'center',
    borderBottomColor:'lightgrey',
    borderBottomWidth:0.7
  },
  missingBody:{
    width:'100%',
    height:300,
  },
  missingBodyHeader:{
    width:'100%',
    height:null,
    padding:20,
    flexDirection:'column'
  },
  bodyText1:{
    color:'grey',
    fontSize:16,
    fontFamily:'OpenSans-Regular'
  },
  bodyText2:{
    color:'black',
    fontSize:18,
    fontFamily:'OpenSans-Regular'
  },
  scrollBody:{
    width:'100%',
    height:'65%',                
  },
  carddivMissing:{
    width:'100%',
    height:null,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10
  },
  cardContMissing:{
    width:'95%',
    height:null,
    borderLeftWidth:6,
    borderLeftColor:'red',
    borderRadius:10,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:0.5
  },
  cardSecMissing:{
    width:'95%',
    height:45,
    justifyContent:'center',
    borderBottomWidth:0.7,
    borderBottomColor:'lightgrey',
    flexDirection:'column'
  },
  cardsec2Missing:{
    width:'95%',
    height:null,
    justifyContent:'center'
  },
  cardFooterMissing:{
    width:'100%',
    height:80,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    justifyContent:'center',
    alignItems:'center',
    borderTopColor:'lightgrey',
    borderTopWidth:0.7,
    flexDirection:'row'
  },
  cardBtnDiv:{
    width:'50%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    borderRightColor:'lightgrey',
    borderRightWidth:0.7
  },
  cardBtn2Div:{
    width:'50%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  sectionContentColumnFull: {
    width: '100%',
    flexDirection: 'column',
  },
  uncontrolledLinkText: {
    color: 'grey',
    left: 0,
    fontFamily: 'OpenSans-Regular',
  },
  uncontrolledLinkInput: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },

  // Upload status list
  uploadStatusHeader: {
    paddingBottom: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    alignSelf: 'center',
  },
  uploadItemRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    minHeight: 40,
    maxHeight: 60,
    borderBottomColor: 'lightgrey',
  },
  uploadIconWrapper: {
    justifyContent: 'center',
    width: '5%',
    padding: 2,
  },
  uploadFileNameWrapper: {
    width: '75%',
    justifyContent: 'center',
  },
  uploadFileName: {
    flexShrink: 1,
    paddingLeft: 5,
    color: 'black',
  },
  uploadFileNameMissing: {
    color: 'red',
  },
  uploadStatusWrapper: {
    width: '20%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  retryWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    fontSize: 10,
    color: 'red',
  },
  syncFileIcon: {
    padding: 6,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  // Lists and empty states
  listMarginLarge: {
    marginTop: 60,
  },
  formNameContainer: {
    width: '95%',
    height: null,
  },
  fullWidthAuto: {
    width: '100%',
    height: null,
  },
  emptyState: {
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLottie: {
    width: Window.width * 0.44,
    height: Window.width * 0.44,
  },
  emptyRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyImageSmall: {
    height: 50,
    resizeMode: 'contain',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: Fonts.size.h5,
    color: 'grey',
    fontFamily: 'OpenSans-Regular',
  },

  // Loader
  loaderContainer: {
    alignItems: 'center',
  },
  loaderText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  attachmentStatusContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },

  redDot: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  syncingIndicator: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#00b3d6',
    elevation: 6,
  },
  proceedBtnSuccess: {
    backgroundColor: '#14D0AE',
  },

  // Modal confirm password
  pwdModal: {
    width: '100%',
    height: 360,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
  },
  closeIconAlign: {
    alignSelf: 'flex-end',
  },
  flexOne: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pwdTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#2EA4E2',
    fontFamily: 'OpenSans-Bold',
  },
  pwdLabel: {
    fontSize: 16,
    color: 'grey',
    fontFamily: 'OpenSans-Regular',
  },
  pwdInputReadonly: {
    fontSize: 20,
    color: 'lightgrey',
    fontFamily: 'OpenSans-Bold',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.7,
  },
  pwdInput: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.7,
  },
  pwdError: {
    fontSize: 16,
    color: 'red',
    fontFamily: 'OpenSans-Regular',
  },
  pwdButton: {
    width: null,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2EA4E2',
    borderRadius: 30,
    padding: 10,
  },
  pwdButtonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: 'white',
  },

  // Confirm dialog typography
  confirmDialogTitle: {
    fontFamily: 'OpenSans-SemiBold',
  },
  confirmDialogMessage: {
    fontFamily: 'OpenSans-Regular',
  },

  // Missing modal extras
  missingTitle: {
    fontSize: 22,
    color: '#2EA4E2',
    fontFamily: 'OpenSans-Regular',
  },
  missingTypeLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  missingTypeValue: {
    fontSize: 18,
    color: 'red',
    fontFamily: 'OpenSans-Regular',
  },
  missingNameValue: {
    fontSize: Fonts.size.mediump,
    color: '#070F6E',
    fontFamily: 'OpenSans-Regular',
  },
  missingGoBackText: {
    fontSize: 20,
    color: 'red',
    fontFamily: 'OpenSans-Regular',
  },
  missingSkipText: {
    fontSize: 20,
    color: 'green',
    fontFamily: 'OpenSans-Regular',
  },

  // Icons and rows
  row: {
    flexDirection: 'row',
  },
  centerAlignRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIconWrapper: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
})
