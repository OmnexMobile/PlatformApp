import { StyleSheet, Dimensions } from "react-native";
import { width, height } from "react-native-dimension";
import Fonts from "../../themes/Fonts";
const window_width = Dimensions.get("window").width;

export default StyleSheet.create({
  bgCont: {
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
  },
  bodyCont: {
    width: "100%",
    height: "90%",
  },
  headerCont: {
    width: "100%",
    height: 60,
  },
  container: {
    flex: 1,
  },

  LabelText: {
    paddingLeft: 5,
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },

  header: {
    width: width(100),
    zIndex: 3000,
    flexDirection: "row",
    //backgroundColor: 'white',
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  backlogo: {
    flexDirection: "row",
    backgroundColor: "transparent",
    width: width(20),
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width(70),
    height: 50,
  },
  headingText: {
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    //fontWeight:'bold',
    fontFamily: "OpenSans-Bold",
  },
  headerDiv: {
    width: width(15),
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
