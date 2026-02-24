import { StyleSheet, Dimensions } from "react-native";
import { Metrics, ApplicationStyles } from "../../themes";
import Fonts from "../../themes/Fonts";
import { width, height } from "react-native-dimension";
import { SPACING } from "constants/theme-constants";
// import { android15FooterPadding } from "../../../auditPro/Themes/AndroidInsets";

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
  topSpacerIos: {
    padding: SPACING.MEDIUM,
    flexDirection: "row",
  },
  topSpacerAndroid: {
    padding: SPACING.NORMAL,
    flexDirection: "row",
  },
  contentContainer: {
    width: "100%",
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
    marginLeft: '2%',
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
    flexDirection: "row",
    padding:4,
    // borderBottomWidth: 0.5,

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
    color: "black",
    fontSize: Fonts.size.regular,
    padding: 2,
    fontWeight: "bold",
  },

  listText1: {
    color: "black",
    fontSize: Fonts.size.regular,
    padding: 2,
    // fontWeight: "bold",
  },
  listNextText: {
    color: "black",
    fontSize: 16,
    padding: 2,
  },
  attachmentsTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 40,
    padding: 5,
  },
  attachmentsTitleText: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },

  flatListFullSideView: {
    width: "93%",
    // height: 110,
    // borderWidth: 0.5,
    // borderTopColor: "lightgrey",
    // borderLeftWidth: 0,
    // borderLeftColor: "green",
    // padding: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    marginBottom: 10,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderColor: '#1FBFD0',
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    // borderRightWidth: 1,
    borderRadius: 8,
    marginLeft: '7%',
  },
  deliverablesList: {
    marginLeft: "4%",
    padding: 5,
  },
  outputDocAttachRow: {
    flexDirection: "row",
  },
  outputDocAttachText: {
    color: "#7F7D7D",
    paddingLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
  },
  outputDocNameRow: {
    flexDirection: "row",
  },
  outputDocNameText: {
    paddingRight: 5,
    color: "#1FBFD0",
    fontSize: 16,
  },
  commentsHtmlContainer: {
    marginLeft: 4,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  renderHtmlBaseStyle: {
    color: "#000",
  },
  emptyStateContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
  },

  deliveryTypeTextHeaderStyle: {
    // color: "#485B9E",
    color: '#1FBFD0',
    fontSize: 16,
    width: "85%",
  },
  deliveryTypeTextStyle: {
    color: '#1FBFD0',
    fontSize: 16,
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
    // bottom: 20 + android15FooterPadding,
    bottom: 0,
  },

  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    flexDirection: "row",
  },

  sectionHeaderContainer: {
    backgroundColor: '#fff',
    // paddingVertical: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    left: '4%',
    width: width(93),
  },

  sectionHeader: {
    // backgroundColor: '#e6f7f8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderColor: '#1FBFD0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    // shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 5,
  },
  toastStyle: {
    backgroundColor: "black",
    margin: 20,
  },
  toastText: {
    color: "white",
  },
});
