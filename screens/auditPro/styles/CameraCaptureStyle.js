import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../Themes'
import { width, height } from 'react-native-dimension'
import Fonts from '../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  // Header styles
  header: {
    width:width(100),
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  heading:{
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems:'center', 
    width: width(70),
    height: 65
  },
  headingText:{
    fontSize: Fonts.size.h4,
    fontFamily : Fonts.type.base,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(15),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  headerDiv:{
    width:width(15),
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
    width:width(100),
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    height:50,
    position:'absolute',
    // backgroundColor: 'red'
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
    justifyContent: 'center', 
    alignItems: 'center'
  },

  // Body styles
  detailsCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },  
  auditPageBody: {
    flex: 1,
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf:'stretch',
    paddingTop: 0,
    //borderColor: 'grey',
    //borderWidth: 5
  },  
  scrollView:{
    height: '80%',
    backgroundColor: 'black',
  },
  boxsecImageDisplay:{
    width:'95%',
    height: null,
    backgroundColor:'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10
  },
  // Modal styles
  ncModalBg: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%',
    height: '100%',
    backgroundColor: 'black'    
  },
  ncModal: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '90%',
    //height: '40%',
    backgroundColor: 'white',
    borderRadius: 10,    
    margin: 10,
    padding: 10,
    elevation: 8,
    borderColor: 'lightgrey',
    borderWidth: 0.5
  },
  modalOuterBox: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center',
    alignItems: 'center', 
    margin: 0, 
    top: 0, 
    left: 0
  },
  ModalBox:{
    width:width(90),
    height:height(50),
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column',
    top:height(40)
  },
  modalheader:{
    width:width(90),
    height:height(8),
    backgroundColor:'transparent',
    top:10,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  modalbody:{
    width:width(90),
    height:height(42),
    backgroundColor:'white',
    padding: 20
  },
  sectionTop:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    padding: 10,
    width: '40%'
  },
  sectionBtn:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    padding: 10    
  },
  modalheading:{
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor:'transparent',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent:'center',
    alignItems:'center',
    padding: 20
  },
  sectionTopCancel:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'center'    
  },
  boxHeader: {
    width: '100%',
    color:'#A6A6A6', 
    fontSize: Fonts.size.small
  },
  boxContent: {
    width: '100%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular,
    textAlign: 'center'
  },
  boxContentClose: {
    width: '100%',
    color:'#000', 
    textAlign: 'center',
    fontSize: Fonts.size.regular
  },
})