import { StyleSheet, Dimensions } from "react-native";
import { Metrics, ApplicationStyles } from "../../themes";
import Fonts from "../../themes/Fonts";
import { width, height } from "react-native-dimension";
import { android15FooterPadding } from "../../../auditPro/Themes/AndroidInsets";

let Window = Dimensions.get("window");

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  fillcontainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    // flexDirection: 'column',
    width: Window.width,
    height: Window.height,
  },
  bgImage: {
    width: Window.width,
    height: "60%",
    resizeMode: "stretch",
  },
  progressTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTextStyle: {
    fontSize: Fonts.size.h4,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width(70),
    height: 65,
  },
  headingText: {
    fontSize: Fonts.size.h5,
    //fontFamily : 'a_Avantelnt',
    //color: '#fff',
    //textAlign: 'center'
    fontFamily: "OpenSans-Bold",
  },
  headerDiv: {
    width: width(50),
    height: 65,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
  },
  LabelText: {
    paddingLeft: 5,
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  flatListWholeView: {
    width: "100%",
    height: Window.height - 140,
    //flex: 2,
    //backgroundColor:'yellow',
    //position: 'absolute',
    //marginTop: 70,
    padding: 10,
  },
  boxView: {
    width: "100%",
    height: 170,
    borderWidth: 0.5,
    borderRadius: 3,
    borderLeftWidth: 5,
    borderLeftColor: "green",
    //backgroundColor:'yellow'
  },

  listViewTop: {
    flexDirection: "column",
    //padding:6,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey",
  },

  listView: {
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapView: {
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  listText: {
    color: "#AFAAAC",
    fontSize: Fonts.size.medium,
    padding: 2,
  },
  listNextText: {
    fontSize: Fonts.size.regular,
    padding: 2,
  },

  flatListFullSideView: {
    width: "100%",
    // height: 110,
    // borderWidth: 0.5,
    // borderTopColor: "lightgrey",
    // borderLeftWidth: 0,
    // borderLeftColor: "green",
    padding: 5,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 1,
    backgroundColor: "white",
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  deliveryTypeTextHeaderStyle: {
    // color: "#485B9E",
    color: "#7F7D7D",
    fontSize: Fonts.size.regular,
    width: "85%",
  },
  deliveryTypeTextStyle: {
    color: "#7F7D7D",
    fontSize: Fonts.size.regular,
    width: "85%",
  },
  commentsTextStyle: {
    color: "#7F7D7D",
    fontSize: Fonts.size.medium,
    width: "85%",
  },

  textInputStyle: {
    padding: 6,
    borderBottomWidth: 0.1,
    fontSize: Fonts.size.input,
  },

  buttonTextDel: {
    textAlign: "center",
    fontSize: Fonts.size.input,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextDoc: {
    textAlign: "center",
    fontSize: Fonts.size.input,
  },
  buttonText: {
    textAlign: "center",
    fontSize: Fonts.size.input,
  },
  addTextStyle: {
    color: "#8B8D8C",
    fontSize: Fonts.size.regular,
  },
  backLogo: {
    width: "15%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  apqpTextView: {
    // flex: 1,
    width: Window.width,
    flexDirection: "row",
    //color:'black',
    //position: 'absolute',
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextDiv: {
    width: "70%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  apqpTextStyle: {
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  DeliveryButton: {
    width: width(38),
    height: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingLeft: 15,
  },

  RevisedButton: {
    width: width(80),
    height: 50,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingLeft: 25,
    padding: 15,
  },

  DocButton: {
    width: width(52),
    height: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingLeft: 15,
    borderWidth: 0.5,
    borderColor: "#0CCB92",
  },
  footerButton: {
    width: "50%",
    height: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  footerButton1: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  footerButton2: {
    width: "50%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderLeftColor: "white",
    borderLeftWidth: 0.5,
  },

  footerDiv: {
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 20 + android15FooterPadding,
  },

  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
});
