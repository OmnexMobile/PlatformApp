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
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  flatListWholeView: {
    width: "100%",
    height: "90%",
    //backgroundColor:'yellow',
    position: "absolute",
    marginTop: 70,
    padding: 8,
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
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey",
  },

  listView: {
    flexDirection: "row",
    padding: 5,
  },
  listText: {
    color: "#AFAAAC",
    fontSize: Fonts.size.medium,
    padding: 5,
  },
  listNextText: {
    fontSize: Fonts.size.regular,
    padding: 5,
  },

  deliveryTypeTextStyle: {
    color: "#7F7D7D",
    fontSize: Fonts.size.regular,
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
    width: "10%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
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
  apqpTextStyle: {
    fontSize: 24,
    color: "white",
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
    width: "50%",
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
    bottom: 0,
  },

  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
});
