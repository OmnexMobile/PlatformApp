import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ImageBackground,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Images} from '../Themes/index';
import styles from '../styles/CheckListMenuStyle'
import {connect} from 'react-redux';
import OfflineNotice from '../components/OfflineNotice'
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../language/Language'
import {debounce, once} from 'underscore';

// Voice packages
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
// Moment
import Moment from 'moment';
import auth from '../../../services/Auditpro-Auth'
import NetInfo from '@react-native-community/netinfo'
import { ROUTES } from 'constants/app-constant'

let timer = null;
const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

class ConformacyVoice extends Component {
  VoiceFill = false;
  VoiceObjective = false;

  constructor(props) {
    super(props)
    console.log('get props--->', props)
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      txt: '',
      nextAudit: '',
      // pitch: '',
      // error: '',
      // started: '',
      // end: '',
      PageLoader: true,
      AttachModal: false,
      modalDisplay: [],
      suggestionPopUp: false,
      flag1: false,
      txt: '',
      startVoice: false,
      txtConformance: '',
      auditDetailList: {},
      ProcessId: '',
      loadingPoint: false,
      isRecognizing:false
    };
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentDidMount() {
    this.timer = setInterval(this.toggleButton, 8000); // 8 seconds
    const regex = /(<([^>]+)>)/gi;
    // const result = this.props.navigation.state.params?.txtConformance
    const result = this.props?.route?.params?.txtConformance
      .replace(regex, '')
      .replace(/&nbsp;/gi, ' ');
    this.setState({
      ProcessId:
        // this.props.navigation.state.params?.CreateNCdataBundle.ProcessID,
        this.props?.route?.params?.CreateNCdataBundle?.ProcessID,
      results: result,
      txtConformance: result,
      // auditDetailList: this.props.navigation.state.params?.auditDetailList,
      auditDetailList: this.props?.route?.params?.auditDetailList,
    });
    console.log(
      'this.props.navigation.state.params?.auditDetailsList',
      // this.props.navigation.state.params,
      this.props,
    );
    if (this.props.data.audits.language === 'Chinese') {
      Tts.setDefaultLanguage('zh');
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      Tts.setDefaultLanguage('en-US');
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    const SiteId = this.props?.data?.audits?.siteId;
    const UserId = this.props?.data?.audits?.userId;
    const token = this.props?.data?.audits?.token;
    console.log('getMynextAudit API', SiteId, UserId, token);
    auth.getMynextAudit(SiteId, UserId, token, (res, data) => {
      console.log('getMynextAudit', data);
      if (data.data.Message == 'Success') {
        this.setState({ nextAudit: data?.data?.Data[0] });
      } else {
        this.setState({ nextAudit: '' });
      }
    });
    Voice.onSpeechResults = this.onSpeechResults;
    console.log('NAVIGATIONVALUE::::::::::', this.props);
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps', this.props);
    // var getCurrentPage = [];
    // getCurrentPage = this.props.data.nav.routes;
    // var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    var CurrentPage = this.props?.route?.name;
    console.log('--CurrentPage--->', CurrentPage);

    if (CurrentPage == ROUTES.VOICE_RECOGNITION) {
      console.log('Voice form mounted');
      this.InitVoice();
      // this.onEventStop()
    }
  }

  toggleButton = () => {
    this.setState(prevState => ({
      startvoice: !prevState.startvoice,
    }));
  };
  StartVoicePress() {
    console.log('voice:StartVoicePressdebouncer activate');
    // if (Platform.OS == 'ios') {
    //   Voice.removeAllListeners();
    //   this.InitVoice();
    // }
    this._startRecognizing();
  }

  StopVoicePress() {
    console.log('voice:StopVoicePressdebouncer activate');
    this._stopRecognizing();
    Voice.removeAllListeners();
    this.InitVoice();
  }

  InitVoice() {
    console.log('voice:InitVoice');
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

    this.setState(
      {
        recognized: '',
        pitch: '',
        error: '',
        started: '',
        partialResults: [],
        end: '',
        startVoice: false,
      },
      () => {
        console.log('voice:setSTate called');
      },
    );
  }
  onEventStop() {
    Voice.removeAllListeners();
    this.InitVoice();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
  onSpeechError = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
      startVoice: false,
      // isVisible:false
    });
    // if (Platform.OS == 'ios') {
    //   this._startRecognizing();
    // }
    // Voice.removeAllListeners()
    // this.InitVoice()
  };
  onPressHandler = () => {
    // Set loading state to true when TouchableOpacity is pressed
    this.setState({loadingPoint: true});

    // Simulate an asynchronous operation (e.g., fetching data)
    setTimeout(() => {
      // After some time, reset loading state to false
      this.setState({loadingPoint: false});
      <ActivityIndicator />;
      // Perform any other actions you need here
    }, 8000); // Adjust the timeout as needed
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechResults: ', e);
    if (Platform.OS == 'android') {
      this.setState(
        previousState => ({
          results: previousState?.txtConformance + ' ' + e.value[0],
        }),
        // () => {
        //   this.VoiceLogic();
        // },
      );
    } else {
      this.setState(previousState => ({
        results: previousState?.txtConformance + ' ' + e.value,
      }));
      // if (timer !== null) {
      //   clearTimeout(timer);
      // }
      // timer = setTimeout(() => {
      //   this.stopRecording();
      // }, 8000);
    }
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechPartialResults: ', e);
    this.setState(
      {
        partialResults: e.value,
      },
      () => {
        console.log('_----_', this.state.partialResults);
      },
    );
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechEnd: ', e);
    if (Platform.OS === 'ios') {
      timer = null;
      this.setState({
        listening: false,
        startVoice: false,
        txtConformance: this.state?.results,
      });
      if (this.state.results != null && this.state.results != '') {
        console.log('--------------------');
        this.VoiceLogic();
      }
    } else {
      console.log('onSpeechEnd: ', e);
      this.setState({
        end: '√',
        started: '',
      });
    }
  };

  async stopRecording() {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {}, 8000);
  }

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
  //  console.log('voice:onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    console.log('voice:_startRecognizing');
    console.log('voice:startvoice', this.state.startVoice,this.state.recognized,this.state.pitch,this.state.partialResults);
    console.log("voice:pitch",this.state.pitch)
    console.log("voice:pitch",this.state.pitch)

    // this.setState(
    //   {
    //     recognized: '',
    //     pitch: '',
    //     error: '',
    //     started: '',
    //     partialResults: [],
    //     end: '',
    //     startVoice: true,
    //     flag1: false,
    //   },
    //   () => {
    //     console.log('flag reset');
    //   },

    // );
    // try {
    //   if (this.props.data.audits.language === 'Chinese') {
    //     await Voice.start('zh');
    //   } else if (
    //     this.props.data.audits.language === null ||
    //     this.props.data.audits.language === 'English'
    //   ) {
    //     await Voice.start('en-US');
    //   }
    // } catch (e) {
    //   //eslint-disable-next-line
    //   console.error(e);
    // }
    try {
      await Voice.start('en-US');
      this.setState({
        startVoice: true,
        recognized: '',
        pitch: '',
        error: '',
        started: '',
        partialResults: [],
        end: '',
        flag: false,
        isRecognizing:true
      });
      // if(this.state.partialResults.length === 0)
      // {
      //   setTimeout(() => {
      //     this._stopRecognizing();
      //   }, 5000);
      //           console.log("voice:partial12",this.state.partialResults.length)


      // }
      // else{
      //   console.log("voice:partial123")
      //   this._startRecognizing
      // }
      
       // setTimeout(this._stopRecognizing, 24000); // Stop recording after 8 seconds
    } catch (error) {
      console.error(error);
    }
  };

  _stopRecognizing = async () => {
    try {
      console.log('voice:_stopRecognizing');
      await Voice.stop();
      this.setState({startVoice: false,
        isRecognizing:false
      });
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      console.log('voice:_cancelRecognizing');
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      console.log('voice:_destroyRecognizer');
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      partialResults: [],
      end: '',
    });
  };

  VoiceLogic() {
    console.log('voice:VoiceLogic');
    if (Platform.OS == 'ios') {
      var txt = this.state.results[0];
    } else {
      var txt = this.state.results;
    }
    console.log('_---_results: ', this.state.results);
    console.log('_---txt: ', txt);

    this.setState(
      {
        documentRef: txt.charAt(0).toUpperCase() + txt.slice(1),
      },
      () => {
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.cn_reply_03);
        }, 8000);

        this._stopRecognizing();
        Voice.removeAllListeners();
      },
    );
  }

  changeDateFormatCard = inDate => {
    var dateStr = '';
    var sDateArr = inDate.split('T');
    var sDateValArr = sDateArr[0].split('-');
    var sTimeValArr = sDateArr[1].split(':');
    var outDate = new Date(
      sDateValArr[0],
      sDateValArr[1] - 1,
      sDateValArr[2],
      sTimeValArr[0],
      sTimeValArr[1],
    );

    if (sTimeValArr[0] == '00' && sTimeValArr[1] == '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY');
    } else if (sTimeValArr[0] == '00' && sTimeValArr[1] != '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY 12 m a');
    } else if (sTimeValArr[0] != '00' && sTimeValArr[1] == '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY h a');
    } else {
      dateStr = Moment(outDate).format('Do MMMM YYYY h m a');
    }

    return dateStr;
  };

  render() {
    console.log(
      'processid====>',
      this.props,
    );
    const {loadingPoint} = this.state;

    return (
      <View style={styles.wrapper}>
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                let conformacy = {
                  txtConformance: this.state?.results,
                  processId: this.state?.ProcessId,
                };
                this.props.storeConformance(conformacy);
                this.props.navigation.navigate(ROUTES.CONFORMACY, {
                  voiceProcessID:
                    // this.props.navigation.state.params.CreateNCdataBundle.ProcessID,
                    this.props?.route?.params?.CreateNCdataBundle?.ProcessID,
                  voiceText: this.state.results,
                });
              }}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.Voice_Recognition}
              </Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                onPress={() =>
                  // this.props.navigation.navigate('Home')}>
                this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.auditPageBody, {padding: 0}]}>
          <ImageBackground
            source={Images.BGlayerFooter}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: '100%',
            }}>
            <ScrollView>
              <View style={styles.container}>
                <Text style={styles.welcome}>
                  {'Process Name:'}{' '}
                  {
                    // this.props.navigation.state.params.CreateNCdataBundle.ProcessName
                    this.props?.route?.params?.CreateNCdataBundle?.ProcessName
                  }
                </Text>
                <View style={styles.speechSamples}>
                  {this.state.results == '' ? (
                    <Text style={styles.questionHead}>
                      {strings.Voice_guide}
                    </Text>
                  ) : (
                    <TextInput
                      style={[
                        styles.questionHead,
                        {width: '90%', height: window_height - 400},
                      ]}
                      value={this.state.results}
                      multiline={true}
                      editable={false}
                      onChangeText={text => {
                        this.setState({results: text}, () => {
                          // this.isCheck3 = true;
                        });
                      }}
                    />
                  )}
                </View>
                <Text style={styles.instructions}>{strings.Voice_press}</Text>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                // left:70,
                bottom: 50,
                zIndex: 1000,
                alignSelf: 'center',
              }}>
                
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  backgroundColor: 'white',
                  borderRadius: 100,
                  zIndex: 1000,
                  elevation: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.state.startVoice === false
                    ? debounce(this.StartVoicePress(),8000)
                    : debounce(this.StopVoicePress());
                  console.log('voicecheckkkk');
                }}>
                {this.state.startVoice === true ? (
                  <Icon name="stop" size={25} color="red" />
                ) : (
                  <Icon name="microphone" size={25} color="#00b3d6" />
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeConformance: conformance =>
      dispatch({type: 'STORE_CONFORMANCE', conformance}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConformacyVoice);