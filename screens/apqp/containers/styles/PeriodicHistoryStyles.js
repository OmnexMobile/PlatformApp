import { StyleSheet, Dimensions } from "react-native";
import { Metrics, ApplicationStyles } from "../../themes";
import Fonts from "../../themes/Fonts";
import { width, height } from "react-native-dimension";

let Window = Dimensions.get("window");

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
    width: "100%",
    height: 65,
    resizeMode: "stretch",
  },
  bgImageFooter: {
    width: "100%",
    height: 65,
    resizeMode: "stretch",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  progressTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    // color: 'black',
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTextStyle: {
    color: "#FFFFFF",
    fontSize: Fonts.size.h4,
  },
  progressTextStyle: {
    fontSize: Fonts.size.h4,
  },

  flatListWholeView: {
    width: "100%",
    height: "83%",
    position: "absolute",
    marginTop: 50,
    padding: 5,
    flexDirection: "column",
    backgroundColor: "white",
  },
  flatList: {
    width: "100%",
    height: "100%",
    position: "absolute",
    marginTop: 60,
    paddingLeft: 8,
  },
  flatListView2: {
    flex: 1,
    padding: 3,
  },

  listText: {
    color: "#AFAAAC",
    fontSize: Fonts.size.medium,
    padding: 5,
  },
  listTextRemark: {
    color: "#AFAAAC",
    fontSize: Fonts.size.medium,
    padding: 5,
    paddingBottom: 8,
  },

  flatListFullSideView: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    height: undefined,
    borderBottomColor: "#DEDBDB",
    borderBottomWidth: 0.5,
  },

  flatListFullView: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    height: undefined,
    borderBottomColor: "#DEDBDB",
    borderBottomWidth: 0.5,
  },
  flatListInsideView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0.5,
    paddingLeft: 5,
  },

  deliveryTypeTextStyle: {
    color: "grey",
    fontSize: Fonts.size.regular,
    width: "85%",
  },

  deliveryTypeTextStyleRemark: {
    color: "grey",
    fontSize: Fonts.size.regular,
    width: "85%",
    paddingBottom: 8,
  },
  deliveryTypeTextStyleAdd: {
    color: "#485B9E",
    fontSize: Fonts.size.regular,
    width: "85%",
  },
  deliveryTypeTextStyleHours: {
    color: "green",
    fontSize: Fonts.size.regular,
    width: "85%",
  },
  buttonTextDel: {
    textAlign: "center",
    fontSize: Fonts.size.input,
    color: "white",
  },
  buttonText: {
    textAlign: "center",
    fontSize: Fonts.size.input,
  },
  addTextStyle: {
    color: "#8B8D8C",
    fontSize: Fonts.size.regular,
  },
  iconsWholeView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  editIconView: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteIconView: {
    //height:'50%',
    justifyContent: "center",
    alignItems: "center",
  },
  editTextStyle: {
    color: "#7F7D7D",
  },
  deleteTextStyle: {
    color: "#7F7D7D",
  },

  apqpTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    //color:'black',
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backLogo: {
    flexDirection: "row",
    backgroundColor: "transparent",
    width: width(15),
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },

  apqpTextStyle: {
    fontSize: 24,
    color: "white",
  },
  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    flexDirection: "row",
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
    width: "50%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  footerButton2: {
    flexDirection: "column",
    // width: width(32),
    // width:'25%',
    height: 60,
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    // textAlign: 'center',
    // color: 'white',
    backgroundColor: "transparent",
  },

  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF",
  },
  deliveryTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    // color: 'black',
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTextStyle: {
    fontSize: Fonts.size.h4,
  },

  flatListView: {
    backgroundColor: "green",
    position: "absolute",
    width: "100%",
    height: 70,
  },

  deliveryTextNameStyle: {
    color: "#485B9E",
    fontSize: Fonts.size.input,
    width: "85%",
  },

  apqpTextView: {
    flex: 1,
    width: Window.width,
    flexDirection: "row",
    //color:'black',
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTextDiv: {
    width: "80%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  DeliveryButton: {
    width: width(70),
    height: 60,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  DeliveryButton2: {
    width: width(70),
    height: 60,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: "#09578B",
  },
  buttonTextDel: {
    textAlign: "center",
    fontSize: Fonts.size.input,
    color: "white",
  },
  buttonText: {
    textAlign: "center",
    fontSize: Fonts.size.input,
  },
  progressVal: {
    fontSize: Fonts.size.medium,
    color: "#1d1d1d",
  },
  modalStyle: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: width(90),
    //height:280,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "column",
    // margin: 10,
    padding: 10,
    paddingBottom: 20,
  },
  makeSelectionText: {
    paddingLeft: 20,
    paddingBottom: 18,
    fontSize: Fonts.size.h5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  circleView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    padding: 10,
    position: "absolute",
    right: 0,
    paddingLeft: 2,
  },
  progressVal: {
    fontSize: Fonts.size.medium,
    color: "#1d1d1d",
  },
  LabelText: {
    paddingLeft: 5,
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width(70),
    height: 65,
  },
  header: {
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  headerDiv: {
    width: width(25),
    height: 65,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
  },
  headingText: {
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  footer: {
    width: "100%",
    height: 48,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "lightgrey",
    borderTopWidth: 0.5,
  },
  footerDiv: {
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
    borderTopColor: "#00BAC8",
    borderTopWidth: 0.5,
    position: "absolute",
    bottom: 0,
    borderTopColor: "lightgrey",
    borderTopWidth: 0.5,
  },
  separatorSection: {
    flexDirection: "column",
    alignItems: "center",
    width: width(0.2),
    height: 40,
    borderWidth: 0,
    backgroundColor: "lightgrey",
    marginTop: 10,
    marginBottom: 10,
  },
});
