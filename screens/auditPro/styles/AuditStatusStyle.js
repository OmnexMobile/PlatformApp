import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  header: {
    width:'100%',
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    alignContent:'center',
    justifyContent: 'flex-start',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    flex:1
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(15),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: '70%',
    height: 65
  },  
  headingText:{
    fontSize: Fonts.size.h6,
    fontFamily : Fonts.type.base,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  headerDiv:{
    width:'15%',
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer:{
    bottom:0,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignContent:'center',
    width:'100%',
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:65,
    position:'absolute'
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
  alignSelf:'stretch'
  },
  scrollViewBody: {
    height:'70%', 
    backgroundColor: 'transparent' 
  },
  card1:{
  backgroundColor:'white',
  width:width(100),
  flexDirection: 'column',
  borderBottomWidth: 0.5,
  borderBottomColor: 'lightgrey', 
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 5,
  paddingLeft: 10
  },
  card:{
  backgroundColor:'white',
  width:'100%',
  flexDirection: 'column',
  borderBottomWidth: 0.5,
  borderBottomColor: 'lightgrey', 
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 5,
  paddingLeft: 10
  },
  cardT:{
  backgroundColor:'white',
  width:'98%',
  flexDirection: 'column',
  borderBottomWidth: 0.5,
  borderBottomColor: 'lightgrey', 
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  paddingTop: 5,
  paddingLeft: 10,
  borderBottomColor:'lightgrey'
  },
  boxCard1:{
    left: 0,
    //top: 10,
  },
  boxCard2:{
    left: 0,
    //marginTop: 11
  },
  detailTitle: { 
    fontSize: Fonts.size.medium,
    color: '#A6A6A6',
    fontFamily:'OpenSans-Regular'
  },
  detailContent: {
    fontSize: Fonts.size.regular, 
    color: '#1d1d1d',
    fontFamily:'OpenSans-Regular'
  },
  div1:{
  width:Window.width,
  //height:height(10),
  backgroundColor:'transparent',
  marginTop:10,
  alignItems:'center',
  justifyContent:'center',
  flexDirection:'row'
  },
  input07:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  },
  calenderModalView:{
  width:Window.width,
  height:null,
  justifyContent:'center',
  alignItems:'center'
  },
  calenderView:{ 
  width:'90%',
  height:'80%',
  backgroundColor:'white',
  borderRadius:10,
  flexDirection:'column',
  },
  calenderHeader:{
  width:'100%',
  height:'10%',
  backgroundColor:'white',
  top:20,
  justifyContent:'center',
  alignItems:'center',
  borderBottomWidth:0.5,
  borderBottomColor:'lightgrey'
  },
  calenderBody:{
  top:100,
  backgroundColor:'white',
  width:'100%',
  height:'80%',
  top:30,
  flex:1,
  backgroundColor:'white'
},
calenderFooter:{
  width:'100%',
  height:'10%',
  backgroundColor:'white',
  bottom:10,
  justifyContent:'center',
  alignItems:'center',
  borderTopWidth:0.5,
  borderTopColor:'lightgrey',
  paddingTop:10,
  marginTop:10
},
auditBox:{
  width:'100%',
  height:310,
  backgroundColor:'#fff',
  justifyContent:'center',
  alignItems:'center',
  borderWidth:0.8,
  borderRadius:5,
  marginBottom:5,
  elevation:5,
  borderColor:'lightgrey'
},
Carddiv:{
  width:'95%',
  height:300,
  backgroundColor:'grey',
  flexDirection:'column',
},
cardS:{
  width:'100%',
  // height:'20%',
  paddingVertical:10,
  backgroundColor:'#fff',
  borderBottomWidth:0.5,
  borderBottomColor:'lightgrey',
  flexDirection:'column',
  padding:5
  },
cardLast:{
  width:'100%',
  height:'18%',
  backgroundColor:'#fff',
  // borderBottomWidth:0.5,
  // borderBottomColor:'lightgrey',
  flexDirection:'column',
  padding:5
}
})
