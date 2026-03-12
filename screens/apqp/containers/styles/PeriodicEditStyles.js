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
    width: "100%",
    height: "100%",
  },
  textHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'OpenSans-SemiBold',
  },

  subTitle: {
    fontSize: 16,
    color: '#5b5b5b',
    fontFamily: 'OpenSans-Regular',
  },

  subTitle1: {
    color:'#123C95',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
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
  check: {
    position: "absolute",
    height: "85%",
    width: "10%",
    backgroundColor: "transparent",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  endDatecheck: {
    position: "absolute",
    height: "35%",
    width: "10%",
    backgroundColor: "transparent",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
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
    height: "81%",
    position: "absolute",
    marginTop: 50,
    padding: 8,
    flexDirection: "column",
    marginBottom: 10,
    marginLeft: '3%',
  },
  flatListWholeViewWithTopMargin: {
    flex: 1,
    width: "100%",
    marginTop: 0,
    padding: 8,
    flexDirection: "column",
  },
  formContentContainer: {
    paddingBottom: 70,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: SPACING.NORMAL,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    // elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#123C95",
    borderWidth: 1,
    borderColor: "#123C95",
    
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoHeaderTitle: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "OpenSans-SemiBold",
    paddingRight: 12,
  },
  progressPill: {
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#123C95",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#123C95",
  },
  progressPillText: {
    fontSize: 13,
    color: "#E8EEFF",
    fontFamily: "OpenSans-SemiBold",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#E8EEFF",
    marginVertical: 12,
  },
  infoBody: {
    marginBottom: 0,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    width: 90,
    fontSize: 15,
    color: "#000",
    fontFamily: "OpenSans-SemiBold",
  },
  infoValuePill: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoValuePillAlt: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9E1FF",
  },
  infoValuePillText: {
    fontSize: 16,
    color: "#5b5b5b",
    fontFamily: "OpenSans-Regular",
  },

  apqpTextStyle: {
    fontSize: 24,
    color: "white",
  },
  footerDiv: {
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    // bottom: 20 + android15FooterPadding ,
    bottom: 0,
    // borderTopColor: "lightgrey",
    // borderTopWidth: 0.5,
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
  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  footerButton1: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  footerButton11: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: "center",
  },
  vertBorder: {
    width: 1,
    height: "75%",
    backgroundColor: "lightgrey",
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
  headerTextDiv: {
    width: "70%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
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
  completedTextStyle: {
    fontSize: Fonts.size.regular,
    padding: 2,
    color: "black",
    fontWeight: "bold",
  },
  completedTextStyleWithTopMargin: {
    fontSize: Fonts.size.regular,
    padding: 2,
    color: "black",
    fontWeight: "bold",
    marginTop: "1%",
  },
  completedTextStyle1: {
    fontSize: Fonts.size.regular,
    color: "black",
    fontWeight: "bold",
  },
  completedTextStyleLabel: {
    fontSize: Fonts.size.regular,
    color: "black",
    fontWeight: "bold",
    marginLeft: "0.5%",
  },
  startDateTextStyle: {
    fontSize: Fonts.size.medium,
    padding: 2,
  },
  endDateTextStyle: {
    fontSize: Fonts.size.medium,
    padding: 2,
  },
  actualHoursTextStyle: {
    fontSize: Fonts.size.medium,
    padding: 2,
  },
  remarksTextStyle: {
    fontSize: Fonts.size.medium,
    padding: 6,
  },
  textInputStyle: {
    borderBottomWidth: 0.5,
    fontSize: Fonts.size.regular,
    color: "black",
  },
  dateTextInputStyle: {
    borderBottomWidth: 0.5,
    color: "#000000",
    fontSize: 17,
  },
  textInputStyle1: {
    borderBottomWidth: 0.5,
    fontSize: Fonts.size.regular,
    color: "black",
    textAlignVertical: 'top',
    minHeight: 65,
  },
  multilineInputEmpty: {
    height: 65,
  },
  multilineInputFilled: {
    height: 50,
  },

  sectionTop: {
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey",
    padding: 10,
  },
  sectionContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  boxHeader: {
    width: "100%",
    color: "#A6A6A6",
    fontSize: Fonts.size.medium,
  },
  boxContent: {
    width: "100%",
    color: "#485B9E",
    fontSize: Fonts.size.regular,
  },
  div1: {
    width: Window.width,
    //height:height(10),
    backgroundColor: "transparent",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  input02: {
    backgroundColor: "transparent",
    width: "90%",
    height: "90%",
  },
  placeholderT1: {
    fontSize: Fonts.size.regular,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.5,
  },
  placeholderT1Label: {
    fontSize: Fonts.size.regular,
    paddingTop: 5,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.5,
  },
  placeholderTextStyle: {
    padding: 0,
    margin: 0,
    fontSize: Fonts.size.small,
    color: "#A6A6A6",
  },
  remarkBoxStyle: {
    borderBottomWidth: 0.8,
    width: "99%",
    height: "40%",
    borderWidth: 0.6,
    borderRadius: 10,
  },
  sec1: {
    width: "100%",
    minHeight: 58,
    marginBottom: SPACING.X_SMALL,
  },
  startDateSectionEmpty: {
    marginTop: -10,
  },
  startDateSectionFilled: {
    marginTop: "5%",
  },
  remark: {
    width: "100%",
    marginBottom: SPACING.X_NORMAL,
  },
  remarkClientEmpty: {
    marginTop: -10,
    marginBottom: 0,
  },
  remarkClientFilled: {
    marginTop: 0,
    marginBottom: "2%",
  },
  remarkFieldEmpty: {
    marginTop: 0,
    marginBottom: 0,
  },
  remarkFieldFilled: {
    marginTop: "2.5%",
    marginBottom: "2%",
  },
  calendarDiv: {
    width: "100%",
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  LabelText: {
    paddingLeft: 5,
    fontSize: Fonts.size.h5,
    color: "#fff",
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
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
  footer: {
    width: "100%",
    height: 48,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "lightgrey",
    borderTopWidth: 0.5,
  },
  listText: {
    color: "black",
    fontSize: Fonts.size.regular,
    padding: 6,
    textAlignVertical: "top",
    fontWeight: "bold",
  },
  projectNameText: {
    marginLeft: 5,
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    color: "black",
    fontSize: 16,
  },
  taskNameText: {
    flexWrap: "wrap",
    width: "69%",
    color: "black",
    fontSize: 16,
  },
  periodText: {
    flexWrap: "wrap",
    color: "#1FBFD0",
    fontSize: 16,
  },
  roundView: {
    position: "absolute",
    top: 40,
    height: 40,
    width: 40,
    right: '5%',
    borderRadius: 40,
    borderColor: "#123C95",
    borderWidth: 0.7,
    backgroundColor: "#123C95",
    justifyContent: "center",
    alignItems: "center",
  },
  roundViewText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: 'OpenSans-Regular',
  },
  rowDirection: {
    flexDirection: "row",
  },
  requiredStar: {
    color: "red",
  },
  requiredAsteriskIcon: {
    left: 10,
  },
  defaultRemarksRowEmpty: {
    marginTop: 0,
    marginBottom: "1.2%",
  },
  defaultRemarksRowFilled: {
    marginTop: "6%",
    marginBottom: "1.2%",
  },
  fieldRowSpacing: {
    marginBottom: SPACING.X_SMALL,
  },
  defaultRemarksCompact: {
    paddingBottom: SPACING.X_SMALL,
  },
  bottomSpacer: {
    height: 50,
  },
  calendarTitleText: {
    fontSize: 20,
    color: "#61BAD0",
  },
  calendarErrorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  calendarErrorText: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
  },
  calendarPickerWrapper: {
    margin: 5,
  },
  topSpacerIos: {
    padding: SPACING.MEDIUM,
    flexDirection: "row",
  },
  topSpacerAndroid: {
    padding: SPACING.NORMAL,
    flexDirection: "row",
  },
  toastStyle: {
    backgroundColor: "black",
    margin: 20,
  },
  toastText: {
    color: "white",
  },
  inputNoHorizontalPadding: {
      paddingHorizontal: 0,
  },
  remarksMultilineInput: {
      minHeight: 90,
      textAlignVertical: "top",
  },
  inputContainerNoPad: {
      paddingHorizontal: 0,
      marginBottom: 0,
      marginLeft: 15,
  },
  inputContainer: {
      paddingHorizontal: 0,
      marginBottom: 0,
      marginLeft: 15,
  },
});
