import {StyleSheet, Dimensions, Platform} from 'react-native';
import {width, height} from 'react-native-dimension';
import Fonts from '../Themes/Fonts';

let Window = Dimensions.get('window');
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor:'#F5F7FA',
  },
  backlogo: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginLeft: 10,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDiv: {
    width: '15%',
    height: 65,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  slide: {
    width: '100%',
    height: '30%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    width: '100%',
    // zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    alignContent: 'center',
    justifyContent: 'space-between',
    height: 65,
    elevation: 4,
    shadowOffset: {width: 2, height: 10},
    shadowColor: 'lightgrey',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  heading: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height: 65,
    paddingHorizontal: width(2),
  },
  headingText: {
    fontSize: Math.min(Fonts.size.mediump, width(6)),
    color: 'black',
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    fontWeight: 'bold',
    width: '100%',
  },
  headerStatText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    marginTop: 2,
  },
  headerDiv: {
    width: width(15),
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statistics: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgrey',
  },
  statCard1: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard2: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray',
  },
  statCard3: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray',
  },
  cart: {
    width: '78%',
    paddingVertical: 5,
    marginTop: 10,
    // height: '90%',
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 20,
    // bottom: 20,
    marginBottom: 10,
    marginLeft: 1,
    marginRight: 20,
    // flexDirection:'row'
  },
  body: {
    // height:'85%',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    marginTop: 5,
    // bottom:30
    // height: Height/2+80,
  },
  leftBtn: {
    width: '95%',
    padding: 10,
    borderColor: 'grey',
    borderWidth: 0.4,
    marginLeft: 2,
    paddingVertical: 15,
    flexDirection: 'row',
    // bottom:5
  },
  bottomBtnView: {
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    flex: 0.5,
    backgroundColor: '#00BAC8',
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backBtnDisabled: {
    backgroundColor: 'lightgrey',
  },
  nextBtn: {
    flex: 0.5,
                backgroundColor: '#00BAC8',
                marginHorizontal: 5,
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
  },
  backBtnText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'OpenSans-Regular',
  },
  buttonDisabledText: {
    color: 'grey',
  },
  quesText: {
    fontSize: Fonts.size.mediump,
    width: '100%',
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    padding: 5,
    marginTop: 5,
    // backgroundColor:'yellow',
  },
  boxsecRadio: {
    width: '99%',
    height: null,
    backgroundColor: 'transparent',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 5,
    justifyContent: 'space-between',
    paddingTop: 10,
    alignItems: 'center',
  },
  ncofi: {
    position: 'absolute',
    //top:height(2),
    right: 0,
    //width: 100,
    padding: 8,
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    bottom: 0,
  },
  ncofiLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
  },
  boxsecImageDisplay: {
    width: '50%',
    height: null,
    backgroundColor: 'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
  },
  boxsecVideoDisplay: {
    //width: '50%',
    height: null,
    backgroundColor: 'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    //right: 10,
    //height: 80,
    paddingRight: 10,
  },
  boxsec1: {
    width: '98%',
    height: null,
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  boxsecNone: {
    // width:'98%',
    // height: null,
    // backgroundColor:'yellow',
    // borderBottomColor: 'lightgrey',
    // borderBottomWidth: 0.5,
    // flexDirection: 'column',
    // paddingLeft: 10
    display: 'none',
  },
  checkPointsTextInputLabel: {
    fontSize: Fonts.size.mediump,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: 'OpenSans-Regular',
    color: '#000',
  },
  checkPointsTextInput: {
    fontSize: Fonts.size.mediump,
    paddingTop: 2,
    height: 50,
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  attachIcon: {
    top: 3,
    position: 'absolute',
    right: 5,
    height: 40,
  },
  scoreBox: {
    position: 'absolute',
    //top: height(2), -- changes done 16/12/2022
    left: 50,
  },
  scoreText: {
    top: height(0),
    left: 0, //-- changes done 16/12/2022
    width: width(75),
  },
  LPAsec1: {
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor: 'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  LPAsec1Label: {
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor: 'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
    paddingTop: 0,
    marginTop: 0,
  },
  LPAsec2: {
    //width:'100%',
    //height:'60%',
    // backgroundColor:'grey'
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderTopWidth: 0.5,
  },
  boxsecRemark: {
    width: Platform.OS === 'ios' ? '85%' : '90%',
    height: null,
    backgroundColor: '#ffffff',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 5,
    // marginLeft: 5,
    justifyContent: 'space-between',
  },
  modalOuterBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    top: 0,
    left: 0,
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
    borderWidth: 0.5,
  },
  ModalBox: {
    width: width(90),
    height: height(50),
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'column',
    top: height(40),
  },
  modalheader: {
    width: width(90),
    height: height(8),
    backgroundColor: 'transparent',
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  modalbody: {
    width: width(90),
    height: height(42),
    backgroundColor: 'white',
    padding: 20,
  },
  sectionTop: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10,
  },
  modalheading: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxContent: {
    width: '100%',
    color: 'black',
    fontSize: Fonts.size.mediump,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  sectionTopCancel: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  boxContentClose: {
    width: '100%',
    color: '#000',
    textAlign: 'center',
    fontSize: Fonts.size.mediump,
    fontFamily: 'OpenSans-Regular',
  },
  sectionBtn: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10,
  },
  boxContentCam: {
    //width: '100%',
    color: '#485B9E',
    fontSize: Fonts.size.mediump,
    // textAlign: 'center',
    // paddingLeft: 20,
    fontFamily: 'OpenSans-Regular',
  },
  modalavatar: {
    flex: 1,
    width: width(90),
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 20,
    margin: 20,
  },
  modelImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignContent: 'center',
  },
  footer: {
    //flex:1,
    // position: 'absolute',
    // bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    height: 65,
    // zIndex: 3000
  },
  footerDiv: {
    //flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%',
    height: 65,
    //top:height(1),
    position: 'absolute',
    //resizeMode:'cover',
  },
  footerWhite: {
    backgroundColor: '#FFFFFF',
  },
  footerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: width(3),
  },
  footerActionButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerActionButtonLeft: {
    marginRight: 8,
  },
  footerActionButtonRight: {
    marginLeft: 8,
  },
  footerGradientButton: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  footerActionText: {
    marginLeft: 10,
    fontSize: Fonts.size.regular,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
  },
  noRecordsFound: {
    width: '100%',
    textAlign: 'center',
    marginTop: 45,
    fontSize: Fonts.size.h5,
    paddingTop: 40,
    color: 'grey',
    fontFamily: 'OpenSans-Regular',
  },

  // Attachments
  attachmentFailedCard: {
    flexDirection: 'row',
    borderColor: 'darkgrey',
    paddingVertical: 10,
    margin: 2,
    borderWidth: 1,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
  },
  attachmentFilenameWrap: {
    width: width(65),
    marginTop: 5,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  attachmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    margin: 2,
    borderColor: 'darkgrey',
    borderWidth: 1,
    height: '90%',
    borderRadius: 5,
  },
  attachmentInnerPadding: {
    paddingVertical: 10,
    margin: 2,
  },
  attachmentImage: {
    width: width(65),
    height: 200,
    resizeMode: 'cover',
    marginRight: 15,
  },
  hiddenView: {
    display: 'none',
  },
  attachmentDocCard: {
    flexDirection: 'row',
    borderColor: 'darkgrey',
    borderWidth: 1,
    borderRadius: 5,
    height: '90%',
    paddingVertical: 10,
    margin: 2,
  },

  // Loader
  loaderContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Download icon
  downloadIndicator: {
    paddingTop: 70,
    height: 200,
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  downloadFileNameWrap: {
    width: width(65),
    marginTop: 5,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  downloadOverlayIcon: {
    position: 'absolute',
    paddingTop: 85,
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  attachmentIconLarge: {
    paddingTop: 70,
    height: 200,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  attachmentFailedLabel: {
    zIndex: 1,
    position: 'absolute',
    paddingTop: 135,
    flex: 1,
    color: 'red',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  paperclipIcon: {
    bottom: 2,
  },
  attachmentStarIcon: {
    bottom: 20,
    right: 10,
  },
  sliderColumn: {
    flexDirection: 'column',
  },
  sliderControl: {
    width: '80%',
  },
  sliderThumbStyle: {
    elevation: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 0.5,
  },
  sliderValueRow: {
    padding: 6,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  sliderValueText: {
    fontFamily: 'OpenSans-Regular',
  },
  sliderValueRowAlt: {
    padding: 5,
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  scoreLabelText: {
    color: 'black',
  },
  circleIconWrapper: {
    marginHorizontal: 5,
  },
  dropdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownTextStyle: {
    numberOfLines: 2,
  },
  scoreTypesContainer: {
    padding: 15,
    flexDirection: 'column',
  },
  scoreTypesHidden: {
    padding: 15,
    flexDirection: 'column',
    backgroundColor: 'lightgrey',
    width: '80%',
    borderRadius: 10,
    display: 'none',
  },
  scoreLabel: {
    padding: 0,
    margin: 0,
    color: '#A6A6A6',
    width: '90%',
    fontSize: Fonts.size.medium,
    fontFamily: 'OpenSans-Regular',
  },
  scoreLabelInvalid: {
    color: 'red',
  },
  scoreMaxText: {
    fontSize: Fonts.size.regular,
    fontFamily: 'OpenSans-Regular',
  },
  scoreSmallLabel: {
    padding: 0,
    margin: 0,
    color: '#A6A6A6',
    width: '90%',
    fontSize: Fonts.size.small,
    fontFamily: 'OpenSans-Regular',
  },
  fullWidth: {
    width: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownOffset: {
    top: 10,
    left: 0,
  },
  dropdownItemText: {
    fontFamily: 'OpenSans-Regular',
  },
  immediateDeleteButton: {
    marginLeft: 10,
    marginTop: 5,
    padding: 5,
  },
  dropdownAngleIcon: {
    marginLeft: 6,
    marginTop: 5,
  },
  bottomSpacer: {
    width: '100%',
    height: 400,
  },
  remarkStarIcon: {
    right: 10,
    top: 10,
  },
  sectionSpacer: {
    marginTop: 5,
  },
  dropdownContainer: {
    paddingTop: 5,
  },

  // Attachment loading
  attachmentLoadingRow: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  hourglassIcon: {
    padding: 5,
  },
  attachmentLoadingText: {
    color: '#A6A6A6',
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'flex-start',
    padding: 5,
  },

  // Content loader
  contentLoaderContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentLoaderTitle: {
    fontSize: Fonts.size.regular,
    fontFamily: 'OpenSans-Regular',
  },
  contentLoaderSubtitle: {
    fontSize: Fonts.size.small,
    fontFamily: 'OpenSans-Regular',
  },

  // Action buttons
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  resetButton: {
    flex: 0.45,
    backgroundColor: '#00BAC8',
    marginHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 0.45,
    backgroundColor: '#00BAC8',
    marginHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  listMarginTop: {
    marginTop: 55,
  },

  // Modal heading
  centerAlignedRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeadingText: {
    color: 'black',
    fontSize: Fonts.size.regular,
    fontFamily: 'OpenSans-Regular',
  },

  // Transparent close buttons
  transparentCloseButton: {
    backgroundColor: 'transparent',
    height: 60,
    width: 80,
  },
  transparentCloseInner: {
    backgroundColor: 'transparent',
    top: 18,
  },
  closeIconOffset: {
    left: 8,
  },

  // Video modal
  videoContainer: {
    backgroundColor: 'black',
    flex: 1,
  },
  videoInner: {
    height: '80%',
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Toast
  toastContainer: {
    backgroundColor: 'black',
    margin: 20,
  },
  toastText: {
    color: 'white',
  },

  // Generic helpers
  flexOne: {
    flex: 1,
  },
  iconOffsetTop: {
    marginTop: 10,
  },

  // Stats
  statLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  statValue: {
    fontSize: Fonts.size.h5,
    fontFamily: 'OpenSans-Regular',
  },

  // Checkpoint list
  checkpointListWrapper: {
    flex: 1,
    height: '100%',
    marginTop: 5,
    bottom: 5,
  },
  leftBtnLabelWrapper: {
    width: '90%',
  },
  checkpointSerialText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  checkpointSerialTextActive: {
    color: 'white',
  },
  checkpointSerialTextInactive: {
    color: 'black',
  },
  requirementIconCol: {
    width: '10%',
    marginRight: 5,
  },
  requirementIconWrapper: {
    bottom: 15,
  },
  requirementIconWrapperSmall: {
    bottom: 5,
  },
  requirementIconWrapperIos: {
    marginLeft: 2,
  },

  carouselWrapper: {
    flex: 4,
    height: '100%',
    marginBottom: 10,
  },
  checkpointScroll: {
    flex: 1,
    marginBottom: 20,
  },

  checkpointHeaderRow: {
    flexDirection: 'row',
    width: '90%',
  },
  checkpointHeaderCol: {
    width: '100%',
  },
  checkpointTitleRow: {
    flexDirection: 'row',
  },
  targetIconWrapper: {
    marginLeft: 5,
  },
  vetoIconWrapper: {
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginTop: 5,
  },
  statusSpacer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 5,
    width: '100%',
    marginLeft: 40,
  },

  scoreRow: {
    flexDirection: 'row',
    width: '15%',
  },
  scoreLabel: {
    padding: 0,
    margin: 0,
    color: '#A6A6A6',
    width: '90%',
    fontSize: Fonts.size.medium,
    fontFamily: 'OpenSans-Regular',
  },
  scoreValue: {
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
  },
  attachmentLabel: {
    paddingBottom: 10,
    margin: 0,
    color: '#A6A6A6',
    width: '90%',
    fontSize: Fonts.size.medium,
    fontFamily: 'OpenSans-Regular',
  },
});
