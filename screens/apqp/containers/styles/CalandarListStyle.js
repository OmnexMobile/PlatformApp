import { StyleSheet } from "react-native";
import { width } from "react-native-dimension";
import { Fonts } from "../../themes";

export default StyleSheet.create({
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
  },
  flex_one: {
    flex: 1,
    paddingRight: 2,
    backgroundColor: "grey",
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  loaderParent: {
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  //header
  header: {
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  backlogo: {
    flexDirection: "row",
    backgroundColor: "transparent",
    width: width(15),
    height: 65,
    justifyContent: "center",
    alignItems: "center",
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
    // fontWeight:'bold'
    fontFamily: "OpenSans-Bold",
  },
  headerDiv: {
    width: width(25),
    height: 65,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
  },
  calendar: {
    // borderTopWidth: 1,
    paddingTop: 5,
    fontFamily: "OpenSans-Regular",
    // marginLeft:20
    // borderBottomWidth: 1,
    // borderColor: '#eee',
    // height: 300
  },
  backlogo: {
    flexDirection: "row",
    backgroundColor: "transparent",
    width: width(15),
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  LabelText: {
    paddingLeft: 5,
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
});
