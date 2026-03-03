import { StyleSheet } from "react-native";
import { Metrics, ApplicationStyles } from "../../themes";
import Fonts from "../../themes/Fonts";
import { width, height } from "react-native-dimension";
import { SPACING } from "constants/theme-constants";
// import { android15FooterPadding } from "../../../auditPro/Themes/AndroidInsets";

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
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: '2%'
  },
  bgImage: {
    width: "100%",
    height: "60%",
    resizeMode: "stretch",
  },
  progressTextView: {
    flex: 1,
    width: "100%",
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
    flex: 1,
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
    color: "#1D1D1D",
    fontSize: Fonts.size.regular,
    padding: 2,
    fontWeight: "bold",
  },

  listText1: {
    // color: "#4B5563",
    // fontSize: Fonts.size.small,

    fontSize: 16,
    color: "#000",
    fontFamily: 'OpenSans-SemiBold',
    minWidth: 92,
    // fontWeight: "600",
  },
  listNextText: {
    color: "#111827",
    fontSize: 16,
    padding: 2,
  },
  attachmentsTitleContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "92%",
    paddingTop: 8,
    paddingBottom: 6,
    marginLeft: "4%",
  },
  attachmentsTitleText: {
    fontSize: 16,
    color: "#000",
    // fontWeight: "700",
    fontFamily: "OpenSans-SemiBold",
  },

  flatListFullSideView: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "white",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1FBFD0",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  deliverablesList: {
    flex: 1,
    width: "92%",
    alignSelf: "center",
  },
  deliverablesListContent: {
    paddingBottom: 96,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIndexText: {
    color: "#111827",
    fontSize: Fonts.size.regular,
    fontWeight: "700",
  },
  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadgeSuccess: {
    backgroundColor: "#E7F7EF",
  },
  statusBadgePending: {
    backgroundColor: "#FEF4D6",
  },
  statusBadgeDanger: {
    backgroundColor: "#FDE8E8",
  },
  statusBadgeDefault: {
    backgroundColor: "#E5EEF7",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  outputDocAttachRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#B7DDE1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#F3FCFD",
  },
  outputDocAttachText: {
    color: "#1FBFD0",
    paddingLeft: 5,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  outputDocNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  outputDocNameText: {
    marginRight: 6,
    color: "#1FBFD0",
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  outputDocEditIcon: {
    alignSelf: "center",
    marginTop: 4,
  },
  commentsBlock: {
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
  },
  commentsHtmlContainer: {
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: "#F9FBFD",
    padding: 8,
  },
  renderHtmlBaseStyle: {
    // color: "#374151",
    // fontSize: 13,
    color: "#000",
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  emptyStateContainer: {
    width: "92%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },
  emptyStateContainer1: {
    width: "92%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 100,
    backgroundColor: "#FFFFFF",
  },
  emptyStateText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
  },

  deliveryTypeTextHeaderStyle: {
    color: "#1FBFD0",
    fontSize: 14,
    flex: 1,
    fontWeight: "700",
  },
  deliveryTypeTextStyle: {
    color: "#1FBFD0",
    fontSize: 16,
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    marginHorizontal: 10,
  },
  commentsTextStyle: {
    color: "#9CA3AF",
    fontSize: Fonts.size.small,
    marginTop: 4,
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
    width: "100%",
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
    paddingTop: 10,
    paddingHorizontal: 0,
    width: "92%",
    marginLeft: "4%",
  },

  sectionHeader: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#1FBFD0",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#1FBFD0",
  },
  summaryTitle: {
    fontSize: 16,
    color: '#5b5b5b',
    fontFamily: 'OpenSans-Regular',
    marginTop: 2,
    marginBottom: 4,
  },
  summaryDeliverableName: {
    fontSize: 16,
    color: "#000",
    fontFamily: 'OpenSans-SemiBold',
    marginBottom: 2,
  },
  summaryStatsRow: {
    marginTop: 12,
    flexDirection: "row",
  },
  summaryStatCard: {
    flex: 1,
    backgroundColor: "#F8FBFD",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4EEF2",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  summaryStatCardLast: {
    marginRight: 0,
  },
  summaryStatLabel: {
    fontSize: 16,
    color: "#000",
    fontFamily: 'OpenSans-SemiBold',
    marginBottom: 2,
  },
  summaryStatValue: {
    fontSize: 16,
    color: "#1FBFD0",
    fontWeight: "700",
  },
  toastStyle: {
    backgroundColor: "black",
    margin: 20,
  },
  toastText: {
    color: "white",
  },
});
