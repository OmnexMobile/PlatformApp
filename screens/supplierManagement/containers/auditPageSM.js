import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    Button,
    Alert,
} from 'react-native';
import { Images } from '../../auditPro/Themes/index';
import styles from '../../auditPro/styles/AuditPageStyle';
import auth from '../../../services/SupplierMgnt-Auth';
import { connect } from 'react-redux';
import { width } from 'react-native-dimension';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs';
import Fonts from '../../auditPro/Themes/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import { strings } from '../../auditPro/language/Language';
import Toast, { DURATION } from 'react-native-easy-toast';
import Moment from 'moment';
import Modal from 'react-native-modal';
import { debounce, once } from 'underscore';
import NetInfo from '@react-native-community/netinfo';
import constant from '../../../constants/SupplierMgnt/AppConstants';
// import Conformacy from './Conformacy';

// Voice packages
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';
import ToastNew, { ErrorToast } from 'react-native-toast-message';
import { ROUTES } from 'constants/app-constant';
import GlobalHeader from 'components/GlobalHeader';
import CommonAlertModal from 'components/common_alert_modal';
let Window = Dimensions.get('window');
const window_width = Dimensions.get('window').width;
let timer = null;

const toastConfig = {
    error: props => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 12,
            }}
        />
    ),
};

class AuditPage extends Component {
    ACTUALAUDITID = '';

    constructor(props) {
        super(props);
        console.log('get this.props---------******************', this.props);
        this.state = {
            ButtonShowClick: false,
            auditDetailList: null,
            AuditProp: [],
            AUDIT_ID: '',
            AUDITPROG_ID: '',
            AUDITYPE_ORDER: '',
            AUDITYPE_ID: '',
            SITEID: '',
            AUDITPROGORDER: '',
            AUDIT_SITE_ID: '',
            AUDIT_NO: '',
            IFormID: '',
            Formname: '',
            ChecklistBtn: '',
            CheckListPropData: [],
            CheckpointLogic: [],
            AuditRecords: [],
            AuditResults: [],
            AuditProcessList: null,
            isDownloaded: false,
            ACTUALAUDITID: '',
            DropDownProps: '',
            NCdetailsprops: [],
            auditstatus: '',
            checklistID: '',
            token: '',
            userId: '',
            isLoading: true,
            isDownloading: false,
            dialogVisible: false,
            ActualAudit: '',
            checkSync: undefined,
            breadCrumb: undefined,
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,

            /** voice states */
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            startVoice: false,
            voicePopUp: false,
            isVisible: false,
            suggestionText: '',
            EnableDownload: true,
            txt: '',
            DocProPublish: false,
            agendaUrl: '',
            isSubmittedFinalValue: 0,
            progressVisible: false,
            attachmentLoaded: false,
            clauseMandatoryState: 0,
            ncofisetting: '',
            screenWidth: Dimensions.get('window').width,
            webToMob: false,
            dialogVisibleRefresh: false,
            downloadAsync: false,
            AUDIT_IDSync: '',
            AUDITPROG_IDSync: '',
            AUDITYPE_ORDERSync: '',
            AUDITYPE_IDSync: '',
            SITEIDSync: '',
            AUDITPROGORDERSync: '',
            AUDIT_SITE_IDSync: '',
            statusCheck: '',
            smData: null,
        };

        // Voice.onSpeechStart = this.onSpeechStart;
        // Voice.onSpeechRecognized = this.onSpeechRecognized;
        // Voice.onSpeechEnd = this.onSpeechEnd;
        // Voice.onSpeechError = this.onSpeechError;
        // Voice.onSpeechResults = this.onSpeechResults;
        // Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }
    componentWillMount() {
        console.log('cStatusfff', this.props?.route?.params?.datapass);

        NetInfo.fetch().then(isConnected => {
            if (isConnected.isConnected) {
                if (this.props?.route?.params?.datapass) {
                }
            }
        });
        this.getParamsDetails();
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.handleDimensionChange);

        console.log('auditprops', this.props);
        console.log(
            'navigationparamsauditpage',
            // this.props.navigation.state.params,
            this.props?.route?.params,
        );

        let Files = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');

        console.log('AuditPage:Ios-Android-Path', Files);
        RNFetchBlob.fs.exists(Files).then(exist => {
            if (!exist || exist == '') {
                RNFetchBlob.fs
                    .mkdir(Files)
                    .then(data => {
                        console.log('data directory created', data);
                    })
                    .catch(err => {
                        console.log('err', err);
                    });
            } else if (RNFetchBlob.fs.isDir(Files)) {
                RNFetchBlob.fs.ls(Files).then(data => {
                    console.log('AuditPage:All files', data);
                });
            }
        });

        const isSubmitted = this.props?.route?.params?.isSubmitted;

        console.log(isSubmitted, 'issubmittedrec');

        if (isSubmitted == true) {
            console.log('enteringdeletaudit');
            // this.deleteAuditRecord;
            this.deleteAuditRecord.bind(this);
        }
        //console.log("agendaurl==>",this.state.Data.auditDetailList.AuditAgendaUrl);
        console.log('v===>', this.props.data.audits.serverUrl);
        // console.log("venkat/v url==>", this.state.props.AuditAgendaUrl);

        var getCurrentPage = [];
        var PreviousPage = '';
        getCurrentPage = this.props.route.name;
        // var PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
        var routes = this.props.navigation.getState().routes;
        PreviousPage = routes[routes.length - 2]?.name;
        console.log('Previous---->', PreviousPage);
        this.setState({ PreviousPage: PreviousPage }, () => {
            console.log('QA testing mounted PreviousPage', this.state.PreviousPage);
        });
        if (this.props.data.audits.language === 'Chinese') {
            this.setState({ ChineseScript: true }, () => {
                strings.setLanguage('zh');
                this.setState({});
                console.log('Chinese script on', this.state.ChineseScript);
            });
        } else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
            this.setState({ ChineseScript: false }, () => {
                strings.setLanguage('en-US');
                this.setState({});
                console.log('Chinese script off', this.state.ChineseScript);
            });
        }
        this.setState(
            {
                EnableDownload:
                    this.props?.route?.params?.datapass?.AuditStatus && this.props?.route?.params?.datapass?.AuditStatus.toString() === '3'
                        ? false
                        : true,
            },
            () => {
                console.log('AuditPage mounted', this.props?.route?.params?.datapass);
                console.log('AuditPage props', this.props);
                console.log('EnableDownload is', this.state.EnableDownload);
                if (this.props?.route?.params?.datapass) {
                    this.ACTUALAUDITID = this.props?.route?.params?.datapass?.ActualAuditId;
                    this.ActualAudit = this.props?.route?.params?.datapass?.ActualAudit;
                    this.setState(
                        {
                            AuditProp: this.props?.route?.params?.datapass,
                            AUDITYPE_ORDER: this.props?.route?.params?.datapass?.ActualAuditOrderNo,
                        },
                        () => {
                            var isDownloadedAudit = false;
                            for (var i = 0; i < this.props.data.audits.auditRecords.length; i++) {
                                if (this.props.data.audits.auditRecords[i].AuditId == this.state.AuditProp.ActualAuditId) {
                                    isDownloadedAudit = true;
                                }
                            }
                            console.log('this.state.AuditProp', this.state.AuditProp);
                            this.getSessionValues(isDownloadedAudit ? isDownloadedAudit : null);
                            this.updateRecentAuditList();
                            this.checkDocPro(this.state.AuditProp.ActualAuditId);
                        },
                    );
                }
            },
        );
        this.checkUser();
        this.loadSupplierIndex();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadSupplierIndex();
            this.refreshAuditStatusFromStore();
        });
        this.blurListener = this.props.navigation.addListener('blur', this.loadSupplierIndex);
    }

    refreshAuditStatusFromStore = () => {
        const resolvedStatus = this.getCurrentAuditCStatus();
        if (!resolvedStatus) {
            return;
        }

        this.setState(prevState => ({
            AuditProp: {
                ...prevState.AuditProp,
                cStatus: resolvedStatus,
            },
        }));
        this.updateRecentAuditList(undefined, resolvedStatus);
    };

    componentDidUpdate(prevProps) {
        const prevAudits = prevProps.data?.audits?.audits;
        const nextAudits = this.props.data?.audits?.audits;
        if (prevAudits === nextAudits) {
            return;
        }

        const resolvedStatus = this.getCurrentAuditCStatus();
        if (!resolvedStatus || resolvedStatus === this.state.AuditProp?.cStatus) {
            return;
        }

        this.setState(prevState => ({
            AuditProp: {
                ...prevState.AuditProp,
                cStatus: resolvedStatus,
            },
        }));
        this.updateRecentAuditList(undefined, resolvedStatus);
    }

    getSupplierIndex = moduleName => {
        if (moduleName === 'Supplier Initial Assessment') {
            return 2;
        }

        if (moduleName === 'Supplier Routine Audit') {
            return 3;
        }

        return 1;
    };

    resolveSupplierData = async () => {
        const routeSmData = this.props?.route?.params?.smData;
        const dataPassSmData = this.props?.route?.params?.datapass?.smData;
        const moduleName = this.props?.route?.params?.datapass?.Module_name;

        if (routeSmData !== null && typeof routeSmData !== 'undefined') {
            return routeSmData;
        }

        if (dataPassSmData !== null && typeof dataPassSmData !== 'undefined') {
            return dataPassSmData;
        }

        if (moduleName) {
            return this.getSupplierIndex(moduleName);
        }

        const reduxSmData = this.props?.data?.audits?.smdata;
        if (reduxSmData !== null && typeof reduxSmData !== 'undefined') {
            return reduxSmData;
        }

        const smIndexRaw = await AsyncStorage.getItem('supplierIndex');
        return smIndexRaw ? JSON.parse(smIndexRaw) : null;
    };

    async getAccessToken() {
        try {
            const userDetailsString = await AsyncStorage.getItem('userDetails');
            const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
            const accessToken = userDetails?.accessToken || null;

            if (accessToken) {
                this.setState({ token: accessToken });
            }

            return accessToken;
        } catch (e) {
            console.log('error--->', e);
            return null;
        }
    }

    async checkDocPro(id) {
        console.log('checktokkenn------>', this.props);

        // var token = this.props.data.audits.token;
        var ActualAuditId = this.props?.route?.params?.datapass?.ActualAuditId;
        var auditRecords = this.props.data.audits.auditRecords;
        var CheckPointTemplateId = [];
        var FormID = [];
        var AuditOrderId = '';
        var isCallDocPro = false;

        if (auditRecords) {
            auditRecords.forEach(item => {
                console.log('item.AuditRecordStatus', item.AuditRecordStatus);
                console.log('constant.StatusSynced', constant.StatusSynced);

                if (item.AuditRecordStatus == constant.StatusSynced || item.AuditRecordStatus == constant.StatusNotSynced) {
                    isCallDocPro = true;
                }
            });

            if (isCallDocPro) {
                for (var i = 0; i < auditRecords.length; i++) {
                    if (id == auditRecords[i].AuditId) {
                        AuditOrderId = auditRecords[i].AuditOrderId;
                        for (var j = 0; j < auditRecords[i].Listdata.length; j++) {
                            if (auditRecords[i].Listdata[j].File != '') {
                                CheckPointTemplateId.push(auditRecords[i].Listdata[j].ChecklistTemplateId);
                            }
                        }
                        if (auditRecords[i].Formdata) {
                            for (var p = 0; p < auditRecords[i].Formdata.length; p++) {
                                FormID.push(parseInt(auditRecords[i].Formdata[p].FormId));
                            }
                        }
                    }
                }
                console.log('CheckPointTemplateId', CheckPointTemplateId);
                console.log('FormID', FormID);

                var reqCheckPointTemplateId = JSON.stringify(CheckPointTemplateId);
                var CheckpId = reqCheckPointTemplateId.toString().split('[');
                var CheckpId1 = CheckpId[1].split(']');
                console.log('CheckPointTemplateId', CheckpId1[0]);

                var reqFormID = JSON.stringify(FormID);
                var CheckFormid = reqFormID.toString().split('[');
                var CheckFormid1 = CheckFormid[1].split(']');
                console.log('formreCpID', CheckFormid1[0]);
                const storedToken = await this.getAccessToken();
                const token = storedToken || this.state.token || this.props?.data?.audits?.token;

                console.log('getAuditDetails SuccessfullgetAuditDetails TokengetcheckDocProPublish', this.props);
                console.log('state  TokengetcheckDocProPublish', this.state.token);
                console.log('finnaltokengetcheckDocProPublish', token);
                if (!token) {
                    console.log('DocPro publish check skipped: missing token');
                    return;
                }
                if (CheckPointTemplateId || FormID) {
                    var AuditIdOrder = ActualAuditId + '_' + AuditOrderId;
                    var CheckPointTemplateId = CheckpId1[0];
                    var FormID = CheckFormid1[0];
                    auth.getcheckDocProPublish(AuditIdOrder, CheckPointTemplateId, FormID, token, (res, data) => {
                        console.log('Doc Publish response', data);
                        if (data.data.Message == 'Success') {
                            if (data.data.Data.PublishText.toLowerCase() == 'not published') {
                                this.setState(
                                    {
                                        DocProPublish: false,
                                    },
                                    () => {
                                        console.log('Published status', this.state.DocProPublish);
                                    },
                                );
                            } else {
                                this.setState(
                                    {
                                        DocProPublish: true,
                                    },
                                    () => {
                                        console.log('Published status', this.state.DocProPublish);
                                    },
                                );
                            }
                        }
                    });
                }
            }
        }
    }
    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.handleDimensionChange);
        if (this.focusListener) {
            this.focusListener();
        }
        if (this.blurListener) {
            this.blurListener();
        }
    }

    async updateRecentAuditList(AuditId, status) {
        if (status === null || typeof status === 'undefined') {
            status = this.getCurrentAuditCStatus();
        }

        const targetId = AuditId ?? this.state.AuditProp?.ActualAuditId;
        const recentAuditListProps = this.props.data.audits.recentAudits || [];
        const recentAudits = [];
        let isAuditExistsInRecentList = false;
        const screenName = this.props?.route?.name || ROUTES.AUDIT_PAGE_SM;
        const smData = await this.resolveSupplierData();
        const recentModule = screenName;
        const auditPropWithModule = {
            ...this.state.AuditProp,
            cStatus: status,
            recent_Module: recentModule,
            smData,
        };

        if (recentAuditListProps.length > 0) {
            for (var i = 0; i < recentAuditListProps.length; i++) {
                const audit = recentAuditListProps[i];
                if (parseInt(audit.ActualAuditId, 10) === parseInt(targetId, 10)) {
                    recentAudits.push({ ...audit, cStatus: status, recent_Module: recentModule });
                    isAuditExistsInRecentList = true;
                } else {
                    recentAudits.push(audit);
                }
            }
            if (!isAuditExistsInRecentList) {
                recentAudits.push(auditPropWithModule);
            }
        } else {
            recentAudits.push(auditPropWithModule);
        }

        this.props.updateRecentAuditList(recentAudits, screenName);
    }

    async loadSupplierIndex() {
        try {
            const smIndex = await this.resolveSupplierData();
            console.log('Loaded supplierIndex:', smIndex);
            this.setState({ smData: smIndex }, () => {
                console.log('checksmdatavalue------>', this.state.smData);
            });
            if (this.props.storeSupplierData && smIndex !== null && typeof smIndex !== 'undefined') {
                this.props.storeSupplierData(smIndex);
            }
        } catch (error) {
            console.log('Error loading supplierIndex', error);
        }
    }

    InitVoice() {
        // Voice.onSpeechStart = this.onSpeechStart;
        // Voice.onSpeechRecognized = this.onSpeechRecognized;
        // Voice.onSpeechEnd = this.onSpeechEnd;
        // Voice.onSpeechError = this.onSpeechError;
        // Voice.onSpeechResults = this.onSpeechResults;
        // Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

        this.setState(
            {
                recognized: '',
                pitch: '',
                error: '',
                started: '',
                results: [],
                partialResults: [],
                end: '',
                startVoice: false,
                voicePopUp: false,
                isVisible: false,
                suggestionText: '',
            },
            () => {
                console.log('setSTate called');
            },
        );
    }

    componentWillUnmount() {
        if (Voice.isAvailable) Voice.destroy().then(Voice.removeAllListeners);
    }
    async componentWillReceiveProps(props) {
        console.log('navigationparamsauditpagewill', this.props?.route?.params);
        console.log('componentWillReceiveProps', props);
        this.getAuditDetails();

        const isSubmitted = this.props?.route?.params?.isSubmitted;

        console.log(isSubmitted, 'issubmittedrec');

        if (isSubmitted == true) {
            console.log('enteringdeletaudit');
            // this.deleteAuditRecord;
            this.deleteAuditRecord.bind(this);
        }

        var getCurrentPage = [];
        var CurrentPage = this.props.route.name;
        console.log('--CurrentPage--->', CurrentPage);

        if (CurrentPage == ROUTES.AUDIT_PAGE_SM) {
            console.log('Audit summary page focussed!');
            console.log('--AuditPage-PROPS-->', props);
            console.log('--AuditPage-this.PROPS-->', this.props, 'cstatus', this.props?.route?.params?.datapass?.cStatus);
            this.InitVoice();
            var Data = props.data.audits.audits;
            const resolvedStatus = this.getCurrentAuditCStatus();
            for (var i = 0; i < Data.length; i++) {
                if (this.state.AUDIT_ID === Data[i].ActualAuditId) {
                    if (Data[i].cStatus === constant.StatusSynced) {
                        if (this.state.checkSync === undefined) {
                            this.setState({
                                checkSync: Data[i].cStatus === constant.StatusSynced ? true : undefined,
                            });
                        } else {
                            console.log('Already synced');
                        }
                    } else {
                        console.log('Not yet updated');
                    }
                }
            }
            this.setState(
                {
                    recognized: '',
                    pitch: '',
                    error: '',
                    started: '',
                    results: [],
                    partialResults: [],
                    end: '',
                    startVoice: false,
                    voicePopUp: false,
                    isVisible: false,
                    suggestionText: '',
                    AuditProp: {
                        ...this.state.AuditProp,
                        cStatus: resolvedStatus,
                    },
                },
                () => {
                    console.log('setSTate called', this.state.statusCheck);
                },
            );
        } else {
            console.log('AuditPage pass');
        }
    }

    onSpeechError = e => {
        // eslint-disable-next-line
        console.log('onSpeechError: ', e);
        this.setState({
            error: JSON.stringify(e.error),
            startVoice: false,
            // isVisible:false
        });
    };

    onSpeechResults = e => {
        // eslint-disable-next-line
        if (Platform.OS == 'android') {
            console.log('onSpeechResults: ', e);
            this.setState(
                {
                    results: e.value[0],
                },
                () => {
                    this.VoiceLogic();
                },
            );
        } else {
            this.setState({ results: e.value });
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                this.stopRecording();
            }, 2000);
        }
    };

    onSpeechEnd = e => {
        // eslint-disable-next-line
        if (Platform.OS === 'ios') {
            timer = null;
            this.setState({ listening: false });
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
    }

    VoiceLogic() {
        this.setState({ txt: this.state.results }, () => {
            console.log('txt', this.state.txt);
            if (Platform.OS == 'ios') {
                var txt = this.state.txt[0];
            } else {
                var txt = this.state.txt;
            }

            if (txt.toLowerCase().includes(strings.v_Key_Open_Dash) || txt.toLowerCase().includes(strings.v_Key_Open_Dash3)) {
                this.setState({ isVisible: false, startVoice: false }, () => {
                    console.log('cloded');
                });
                if (txt.includes(strings.v_Key_Open_Dash3)) {
                    Tts.setDucking(true).then(() => {
                        Tts.setDucking(true).then(() => {
                            Tts.speak(strings.vr_reply_01);
                        });
                    });
                    this._stopRecognizing();
                    Voice.removeAllListeners();
                    this.InitVoice();
                    this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
                } else {
                    Tts.setDucking(true).then(() => {
                        Tts.setDucking(true).then(() => {
                            Tts.speak(strings.v_Key_Opening_Dash);
                        });
                    });
                    this._stopRecognizing();
                    Voice.removeAllListeners();
                    this.InitVoice();
                    this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
                }
            } else if (txt.includes('ofi') || txt.includes('Wi-Fi') || txt.includes('fi') || txt.includes('fy')) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.ap_reply_02);
                });
                this.setState({ isVisible: false, startVoice: false }, () => {
                    console.log('cloded');
                });
                setTimeout(() => {
                    this._destroyRecognizer();
                    this.props.navigation.navigate(ROUTES.CREATE_NC, {
                        CheckpointRoute: 'OFI',
                        AuditID: this.state.AUDIT_ID,
                        NCOFIDetails: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        templateId: 0,
                        type: 'ADD',
                        isUploaded: false,
                    });
                }, 2000);
            } else if (txt.toLowerCase().includes('nc') || txt.toLowerCase().includes('non')) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.v_Key_Opening_NC);
                });
                this.setState(
                    {
                        isVisible: false,
                        startVoice: false,
                        // recognized: '',
                        voicePopUp: false,
                        // isVisible:false,
                        suggestionText: '',
                    },
                    () => {
                        console.log('cloded');
                    },
                );
                setTimeout(() => {
                    this._destroyRecognizer();

                    this.props.navigation.navigate(ROUTES.CREATE_NC, {
                        CheckpointRoute: 'NC',
                        AuditID: this.state.AUDIT_ID,
                        NCOFIDetails: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        templateId: 0,
                        type: 'ADD',
                        isUploaded: false,
                    });
                }, 2000);
            } else if (txt.includes(strings.va_cmd24) || txt.includes(strings.va_cmd024)) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_reply8);
                });
                this.setState({ isVisible: false, startVoice: false }, () => {
                    console.log('cloded');
                });
                setTimeout(() => {
                    this._stopRecognizing();
                    Voice.removeAllListeners();
                    this.InitVoice();
                    this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                        datapassParam: this.props?.route?.params?.datapass,
                        AuditID: this.state.AUDIT_ID,
                        ChecklistBtn: this.state.ChecklistBtn,
                        CreateNCdataBundle: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            AuditProgramId: this.state.AUDITPROG_ID,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        SpeechCommand: 'Template',
                    });
                }, 2000);
            } else if (txt.includes(strings.va_cmd25) || txt.includes(strings.va_cmd025)) {
                Tts.setDucking(true).then(() => {
                    Tts.speak(strings.va_reply9);
                });
                this.setState({ isVisible: false, startVoice: false }, () => {
                    console.log('cloded');
                });
                setTimeout(() => {
                    this._stopRecognizing();
                    Voice.removeAllListeners();
                    this.InitVoice();
                    this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                        datapassParam: this.props?.route?.params?.datapass,
                        AuditID: this.state.AUDIT_ID,
                        ChecklistBtn: this.state.ChecklistBtn,
                        CreateNCdataBundle: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            AuditProgramId: this.state.AUDITPROG_ID,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        SpeechCommand: 'Reference',
                    });
                }, 2000);
            } else if (txt.toLowerCase().includes(strings.va_cmd26)) {
                setTimeout(() => {
                    this._stopRecognizing();
                    Voice.removeAllListeners();
                    this.InitVoice();
                    this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                        datapassParam: this.props?.route?.params?.datapass,
                        AuditID: this.state.AUDIT_ID,
                        ChecklistBtn: this.state.ChecklistBtn,
                        CreateNCdataBundle: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            AuditProgramId: this.state.AUDITPROG_ID,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                    });
                }, 2000);
            }
        });
    }

    onSpeechPartialResults = e => {
        // eslint-disable-next-line
        console.log('onSpeechPartialResults: ', e);
        this.setState({
            partialResults: e.value,
        });
    };

    onSpeechVolumeChanged = e => {
        this.setState({
            pitch: e.value,
        });
    };

    _suggestionPress(item) {
        console.log('pressed', item);
        if (item == strings.sugesstion1) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply4);
            });
            this.setState({ suggestionText: strings.sugesstion1 }, () => {
                console.log('');
                setTimeout(() => {
                    this.setState({ isVisible: false }, () => {
                        console.log('cloded');
                    });
                    this.props.navigation.navigate(ROUTES.CREATE_NC, {
                        CheckpointRoute: 'NC',
                        AuditID: this.state.AUDIT_ID,
                        NCOFIDetails: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        templateId: 0,
                        type: 'ADD',
                        data: null,
                        isUploaded: false,
                    });
                }, 5000);
            });
        } else if (item == strings.sugesstion2) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply5);
            });
            this.setState({ suggestionText: strings.sugesstion2 }, () => {
                setTimeout(() => {
                    this.setState({ isVisible: false }, () => {
                        console.log('cloded');
                    });
                    this.props.navigation.navigate(ROUTES.CREATE_NC, {
                        CheckpointRoute: 'OFI',
                        AuditID: this.state.AUDIT_ID,
                        NCOFIDetails: {
                            AuditID: this.state.AUDIT_ID,
                            AuditOrder: this.state.AUDITYPE_ORDER,
                            title: 'order by FormName asc',
                            auditstatus: this.state.auditstatus,
                            SiteID: this.state.SITEID,
                            Formid: this.state.IFormID,
                            ChecklistID: this.state.checklistID,
                            AUDIT_NO: this.state.AUDIT_NO,
                            breadCrumb: this.state.auditDetailList.Auditee,
                        },
                        templateId: 0,
                        type: 'ADD',
                        isUploaded: false,
                    });
                }, 5000);
            });
        } else if (item == strings.sugesstion3) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply6);
            });
            this.setState({ suggestionText: strings.sugesstion3 }, () => {
                setTimeout(() => {
                    this.setState({ isVisible: false }, () => {
                        console.log('cloded');
                    });
                    this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                        AuditID: this.state.AUDIT_ID,
                        isDeleted: 0,
                        breadCrumb: this.state.auditDetailList.Auditee,
                    });
                }, 500);
            });
        } else if (item == strings.sugesstion4) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply8);
            });
            setTimeout(() => {
                this.setState({ suggestionText: strings.sugesstion4, isVisible: false }, () => {
                    console.log('cloded');
                });
                this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                    datapassParam: this.props?.route?.params?.datapass,
                    AuditID: this.state.AUDIT_ID,
                    ChecklistBtn: this.state.ChecklistBtn,
                    CreateNCdataBundle: {
                        AuditID: this.state.AUDIT_ID,
                        AuditOrder: this.state.AUDITYPE_ORDER,
                        title: 'order by FormName asc',
                        auditstatus: this.state.auditstatus,
                        SiteID: this.state.SITEID,
                        Formid: this.state.IFormID,
                        ChecklistID: this.state.checklistID,
                        AUDIT_NO: this.state.AUDIT_NO,
                        AuditProgramId: this.state.AUDITPROG_ID,
                        breadCrumb: this.state.auditDetailList.Auditee,
                    },
                    SpeechCommand: 'Template',
                });
            }, 500);
        } else if (item == strings.sugesstion5) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply9);
            });
            setTimeout(() => {
                this.setState({ suggestionText: strings.sugesstion5, isVisible: false }, () => {
                    console.log('cloded');
                });
                this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                    datapassParam: this.props?.route?.params?.datapass,
                    AuditID: this.state.AUDIT_ID,
                    ChecklistBtn: this.state.ChecklistBtn,
                    CreateNCdataBundle: {
                        AuditID: this.state.AUDIT_ID,
                        AuditOrder: this.state.AUDITYPE_ORDER,
                        title: 'order by FormName asc',
                        auditstatus: this.state.auditstatus,
                        SiteID: this.state.SITEID,
                        Formid: this.state.IFormID,
                        ChecklistID: this.state.checklistID,
                        AUDIT_NO: this.state.AUDIT_NO,
                        AuditProgramId: this.state.AUDITPROG_ID,
                        breadCrumb: this.state.auditDetailList.Auditee,
                    },
                    SpeechCommand: 'Reference',
                });
            }, 500);
        } else if (item == strings.sugesstion6) {
            Tts.setDucking(true).then(() => {
                Tts.speak(strings.va_reply10);
            });
            setTimeout(() => {
                this.setState({ suggestionText: strings.sugesstion6, isVisible: false }, () => {
                    console.log('cloded');
                });
                this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                    datapassParam: this.props?.route?.params?.datapass,
                    AuditID: this.state.AUDIT_ID,
                    ChecklistBtn: this.state.ChecklistBtn,
                    CreateNCdataBundle: {
                        AuditID: this.state.AUDIT_ID,
                        AuditOrder: this.state.AUDITYPE_ORDER,
                        title: 'order by FormName asc',
                        auditstatus: this.state.auditstatus,
                        SiteID: this.state.SITEID,
                        Formid: this.state.IFormID,
                        ChecklistID: this.state.checklistID,
                        AUDIT_NO: this.state.AUDIT_NO,
                        AuditProgramId: this.state.AUDITPROG_ID,
                        breadCrumb: this.state.auditDetailList.Auditee,
                    },
                });
            }, 500);
        }
    }

    _startRecognizing = async () => {
        console.log('pressed');
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            startVoice: true,
            isVisible: true,
        });

        try {
            if (this.props.data.audits.language === 'Chinese') {
                await Voice.start('zh');
            } else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
                await Voice.start('en-US');
            }
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        try {
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
            results: [],
            partialResults: [],
            end: '',
        });
    };

    isAuditDownloaded = () => {
        var auditRecords = this.props.data.audits.auditRecords;
        var isDownloadedDone = false;
        var auditRecord = null;
        console.log('isAuditDownloaded auditRecords', auditRecords);
        console.log('isAuditDownloaded this.state.auditDetailList', this.state.auditDetailList);

        for (var i = 0; i < auditRecords.length; i++) {
            if (auditRecords[i].AuditId == this.state.AuditProp.ActualAuditId) {
                isDownloadedDone = true;
                auditRecord = auditRecords[i];
            }
        }

        if (isDownloadedDone) {
            if (auditRecord.CheckListPropData) {
                if (auditRecord.CheckListPropData.length > 0) {
                    var compArr = [];
                    for (var i = 0; i < auditRecord.CheckListPropData.length; i++) {
                        if (auditRecord.CheckListPropData[i].CompLevelId === 3 || auditRecord.CheckListPropData[i].CompLevelId === 1) {
                            compArr.push(auditRecord.CheckListPropData[i]);
                        }
                    }
                    console.log('CompArr', auditRecord.FormId);
                    if (compArr) {
                        if (compArr.length > 0) {
                            this.setState(
                                {
                                    ChecklistBtn: true,
                                    CheckListPropData: auditRecord.CheckListPropData,
                                    CheckpointLogic: auditRecord.CheckpointLogic,
                                    DropDownProps: auditRecord.DropDownProps,
                                    // NCdetailsprops: auditRecord.NCdetailsprops,
                                    IFormID: auditRecord.FormId,
                                    Formdata: auditRecord.Formdata,
                                    AuditResults: auditRecord.AuditResults,
                                    AuditProcessList: auditRecord.AuditProcessList,
                                    isDownloaded: true,
                                    isLoading: false,
                                },
                                () => {
                                    console.log('Checklist button', this.state.ChecklistBtn);
                                    console.log('this.state.CheckListPropData', this.state.CheckListPropData);
                                    console.log('Kishan this.state.CheckpointLogic', this.state.CheckpointLogic);
                                    console.log('this.state.DropDownProps', this.state.DropDownProps);
                                    console.log('this.state.NCdetailsprops', this.state.NCdetailsprops);
                                },
                            );
                        } else {
                            console.log('No checklists found!');
                            this.setState(
                                {
                                    ChecklistBtn: false,
                                    CheckListPropData: [],
                                    CheckpointLogic: [],
                                    DropDownProps: auditRecord.DropDownProps,
                                    // NCdetailsprops: auditRecord.NCdetailsprops,
                                    IFormID: auditRecord.FormId,
                                    Formdata: auditRecord.Formdata,
                                    AuditResults: auditRecord.AuditResults,
                                    AuditProcessList: auditRecord.AuditProcessList,
                                    isDownloaded: true,
                                    isLoading: false,
                                },
                                () => {
                                    console.log('Checklist button', this.state.ChecklistBtn);
                                    console.log('this.state.CheckListPropData', this.state.CheckListPropData);
                                    console.log('this.state.CheckpointLogic', this.state.CheckpointLogic);
                                    console.log('this.state.DropDownProps', this.state.DropDownProps);
                                    console.log('this.state.NCdetailsprops', this.state.NCdetailsprops);
                                },
                            );
                        }
                    }
                } else {
                    console.log('No checklist records found!');
                    this.setState(
                        {
                            ChecklistBtn: false,
                            CheckListPropData: [],
                            CheckpointLogic: [],
                            DropDownProps: auditRecord.DropDownProps,
                            // NCdetailsprops: auditRecord.NCdetailsprops,
                            IFormID: auditRecord.FormId,
                            Formdata: auditRecord.Formdata,
                            AuditResults: auditRecord.AuditResults,
                            AuditProcessList: auditRecord.AuditProcessList,
                            isDownloaded: true,
                            isLoading: false,
                        },
                        () => {
                            console.log('Checklist button', this.state.ChecklistBtn);
                            console.log('this.state.CheckListPropData', this.state.CheckListPropData);
                            console.log('this.state.CheckpointLogic', this.state.CheckpointLogic);
                            console.log('this.state.DropDownProps', this.state.DropDownProps);
                            console.log('this.state.NCdetailsprops', this.state.NCdetailsprops);
                        },
                    );
                }
            } else {
                console.log('No checklist records found!');
                this.setState(
                    {
                        ChecklistBtn: false,
                        CheckListPropData: [],
                        CheckpointLogic: [],
                        DropDownProps: auditRecord.DropDownProps,
                        // NCdetailsprops: auditRecord.NCdetailsprops,
                        IFormID: auditRecord.FormId,
                        Formdata: auditRecord.Formdata,
                        AuditResults: auditRecord.AuditResults,
                        AuditProcessList: auditRecord.AuditProcessList,
                        isDownloaded: true,
                        isLoading: false,
                    },
                    () => {
                        console.log('Checklist button', this.state.ChecklistBtn);
                        console.log('this.state.CheckListPropData', this.state.CheckListPropData);
                        console.log('this.state.CheckpointLogic', this.state.CheckpointLogic);
                        console.log('this.state.DropDownProps', this.state.DropDownProps);
                        console.log('this.state.NCdetailsprops', this.state.NCdetailsprops);
                    },
                );
            }
        } else {
            this.setState({
                isLoading: false,
            });
        }
    };

    getSessionValues = async isDownloaded => {
        console.log('isdownloaddedddd------', isDownloaded);
        try {
            const userDetailsString = await AsyncStorage.getItem('userDetails');
            const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
            var userid_val = userDetails.userId;
            var token_val = userDetails.accessToken;

            const TOKEN = this.props.data.audits.token;
            const USER_ID = this.props.data.audits.userId;

            this.setState({ token: token_val, userId: userid_val }, () => {
                console.log('this.state.token', this.state.token);
                console.log('this.state.userId', this.state.userId);
                console.log('this.props.data.audits.isOfflineMode', this.props.data.audits.isOfflineMode);

                if (this.props.data.audits.isOfflineMode || isDownloaded) {
                    const auditRecords = this.props.route?.params?.datapass;
                    const auditProp = this.state.AuditProp || auditRecords;
                    const targetAuditId = auditProp?.ActualAuditId;

                    if (!auditRecords || !targetAuditId) {
                        console.log('Audit data missing while loading session values', auditRecords, auditProp);
                        this.setState({ isLoading: false });
                        return;
                    }

                    var auditDetailList = null;
                    var auditNumber = '';
                    var auditStatus = '';
                    console.log('checkk838838383', this.props.route?.params?.datapass);

                    console.log('auditRecords.AuditId', auditRecords?.AuditId);
                    console.log('this.state.AuditProp.ActualAuditId', targetAuditId);

                    if (auditRecords.ActualAuditId == targetAuditId) {
                        auditDetailList = auditRecords;
                        console.log('✅ Found:', auditDetailList);
                    }
                    console.log('auditDetailList*****', auditDetailList);

                    if (auditDetailList) {
                        auditNumber = auditDetailList.AuditNumber;
                        auditStatus = auditDetailList.Status;
                    }

                    const clauseMandatory = this.props?.route?.params?.datapass?.ClauseMandatory;
                    this.setState(
                        {
                            auditDetailList: auditDetailList,
                            AUDIT_NO: auditNumber,
                            auditstatus: auditStatus,
                            clauseMandatoryState: clauseMandatory === undefined ? '0' : clauseMandatory,
                        },
                        () => {
                            console.log('auditDetailList loaded11111', this.state.auditDetailList);
                        },
                    );

                    if (auditDetailList) {
                        console.log('auditDetailList---->222', auditDetailList);
                        this._getLocalValues(auditDetailList);
                    } else {
                        this.setState({ isLoading: false, auditDetailList: null });
                    }
                } else {
                    NetInfo.fetch().then(isConnected => {
                        if (isConnected.isConnected) {
                            this.getAuditDetails();
                        } else {
                            var auditRecords = this.props.data.audits.auditRecords;
                            var auditDetailList = null;
                            var auditNumber = '';
                            var auditStatus = '';

                            for (var i = 0; i < auditRecords.length; i++) {
                                if (auditRecords[i].AuditId == this.state.AuditProp.ActualAuditId) {
                                    auditDetailList = auditRecords[i];
                                }
                            }

                            if (auditDetailList) {
                                auditNumber = auditDetailList.AuditNumber;
                                auditStatus = auditDetailList.AuditStatus;
                            }

                            this.setState(
                                {
                                    auditDetailList: auditDetailList,
                                    AUDIT_NO: auditNumber,
                                    auditstatus: auditStatus,
                                },
                                () => {
                                    console.log('auditDetailList loaded.....33333', this.state.auditDetailList);
                                },
                            );

                            if (auditDetailList) {
                                this._getLocalValues(auditDetailList);
                            } else {
                                this.setState({ isLoading: false, auditDetailList: null });
                            }
                        }
                    });
                }
            });
        } catch (error) {
            // Error retrieving data
            console.log('Failed to retrive a login session!!!', error);
        }
    };

    async getAuditDetails() {
        const storedToken = await this.getAccessToken();
        const token = storedToken || this.state.token || this.props?.data?.audits?.token;

        console.log('getAuditDetails SuccessfullgetAuditDetails getAuditDetails', this.props);
        console.log('state  getAuditDetails', this.state.token);
        console.log('getAuditDetails', token);
        if (!token) {
            console.log('DocPro publish check skipped: missing token');
            return;
        }

        auth.getAuditReportDetails(this.state.AuditProp, token, async (resp, data) => {
            console.log('Audit Report details data ', data);
            console.log('venkat url==>', data.data.Data[0].AuditAgendaUrl);
            var webview = data.data.Data[0].AuditAgendaUrl;
            var auditId = data.data.Data[0].AuditNumber;
            await AsyncStorage.setItem('AgendaURL' + auditId, webview);
            console.log('webview', webview);
            if (data.data) {
                if (resp === true) {
                    if (data.data.Message === 'Success') {
                        console.log('getAuditDetails Successfull');
                        var auditDetailList = null;
                        var auditNumber = '';
                        var auditStatus = '';
                        var clauseMandatory;
                        var agendaUrl = '';
                        if (data.data.Data.length > 0) {
                            auditDetailList = data.data.Data[0];
                            auditNumber = data.data.Data[0].AuditNumber;
                            auditStatus = data.data.Data[0].AuditStatus;
                            agendaUrl = data.data.Data[0].AuditAgendaUrl;
                            clauseMandatory = data.data.Data[0].ClauseMandatory;
                        }
                        this.setState(
                            {
                                auditDetailList: auditDetailList,
                                AUDIT_NO: auditNumber,
                                auditstatus: auditStatus,
                                agendaUrl: agendaUrl,
                                clauseMandatoryState: clauseMandatory,
                            },
                            () => {
                                this._getLocalValues(this.state.auditDetailList);
                                console.log('auditdetails......4444', this.state.auditDetailList);
                            },
                        );
                    }
                }
            } else {
                this.refs.toast.show(strings.Audit_Details_Failed, DURATION.LENGTH_LONG);
                this.isAuditDownloaded();
            }
        });
    }

    async _getLocalValues(data) {
        if (this.props.data.audits.isOfflineMode) {
            console.log('_getLocalValues', data);
            const AUDIT_ID = data.AuditId || data.ActualAuditId;
            const AUDITPROG_ID = data.AuditProgramId;
            const AUDITYPE_ORDER = data.AuditTypeOrder;
            const AUDITYPE_ID = data.AuditTypeId;
            const SITEID = data.SiteId;
            const AUDITPROGORDER = data.AuditProgOrder;
            const AUDIT_NO = data.AUDIT_NO;
            const AUDIT_SITE_ID = data.AuditAgendaUrl;

            this.setState(
                {
                    AUDIT_ID: AUDIT_ID,
                    AUDITPROG_ID: AUDITPROG_ID,
                    AUDITYPE_ORDER: AUDITYPE_ORDER,
                    AUDITYPE_ID: AUDITYPE_ID,
                    SITEID: SITEID,
                    AUDITPROGORDER: AUDITPROGORDER,
                    AUDIT_SITE_ID: AUDIT_SITE_ID,
                },
                () => {
                    console.log('this.state.AUDIT_ID', this.state.AUDIT_ID);
                    console.log('this.state.AUDITPROG_ID', this.state.AUDITPROG_ID);
                    console.log('this.state.AUDITYPE_ORDER', this.state.AUDITYPE_ORDER);
                    console.log('this.state.AUDITYPE_ID', this.state.AUDITYPE_ID);
                    console.log('this.state.SITEID', this.state.SITEID);
                    console.log('this.state.AUDITPROGORDER', this.state.AUDITPROGORDER);
                    console.log('this.state.AUDIT_SITE_ID', this.state.AUDIT_SITE_ID);

                    this.isAuditDownloaded();
                },
            );
        } else {
            console.log('_getLocalValues in online mode', data);
            if (this.state.downloadAsync == true) {
                const AUDIT_ID = this.props?.route?.params?.datapass?.ActualAuditId;
                const AUDITPROG_ID = this.props?.route?.params?.datapass?.AuditProgramId;
                const AUDITYPE_ORDER = this.props?.route?.params?.datapass?.ActualAuditOrderNo;
                const AUDITYPE_ID = this.props?.route?.params?.datapass?.AuditTypeId;
                const SITEID = data.SiteId;
                const AUDITPROGORDER = this.props?.route?.params?.datapass?.ActualAuditOrderNo;
                const AUDIT_SITE_ID = data.AuditAgendaUrl;
                this.setState(
                    {
                        AUDIT_ID: AUDIT_ID,
                        AUDITPROG_ID: AUDITPROG_ID,
                        AUDITYPE_ORDER: AUDITYPE_ORDER,
                        AUDITYPE_ID: AUDITYPE_ID,
                        SITEID: SITEID,
                        AUDITPROGORDER: AUDITPROGORDER,
                        // AUDIT_SITE_ID: AUDIT_SITE_ID,
                    },
                    () => {
                        console.log('this.state.AUDIT_IDif', this.state.AUDIT_ID);
                        console.log('this.state.AUDITPROG_IDif', this.state.AUDITPROG_ID);
                        console.log('this.state.AUDITYPE_ORDERif', this.state.AUDITYPE_ORDER);
                        console.log('this.state.AUDITYPE_IDif', this.state.AUDITYPE_ID);
                        console.log('this.state.SITEIDif', this.state.SITEID);
                        console.log('this.state.AUDITPROGORDERif', this.state.AUDITPROGORDER);
                        console.log('this.state.AUDIT_SITE_IDif', this.state.AUDIT_SITE_ID);
                        this.isAuditDownloaded();
                    },
                );
            } else {
                const AUDIT_ID = data.AuditId || data.ActualAuditId;
                const AUDITPROG_ID = data.AuditProgId;
                const AUDITYPE_ORDER = data.AuditTypeOrderId; // data.AuditTypeOrder;
                const AUDITYPE_ID = data.AuditTypeId;
                const SITEID = data.SiteId;
                const AUDITPROGORDER = data.AuditProgOrder;
                const AUDIT_NO = data.AUDIT_NO;
                const AUDIT_SITE_ID = data.AuditAgendaUrl;
                this.setState(
                    {
                        AUDIT_ID: AUDIT_ID,
                        AUDITPROG_ID: AUDITPROG_ID,
                        AUDITYPE_ORDER: AUDITYPE_ORDER,
                        AUDITYPE_ID: AUDITYPE_ID,
                        SITEID: SITEID,
                        AUDITPROGORDER: AUDITPROGORDER,
                        AUDIT_SITE_ID: AUDIT_SITE_ID,
                    },
                    () => {
                        console.log('this.state.AUDIT_IDelse', this.state.AUDIT_ID);
                        console.log('this.state.AUDITPROG_IDelse', this.state.AUDITPROG_ID);
                        console.log('this.state.AUDITYPE_ORDERelse', this.state.AUDITYPE_ORDER);
                        console.log('this.state.AUDITYPE_IDelse', this.state.AUDITYPE_ID);
                        console.log('this.state.SITEIDelse', this.state.SITEID);
                        console.log('this.state.AUDITPROGORDERelse', this.state.AUDITPROGORDER);
                        console.log('this.state.AUDIT_SITE_IDelse', this.state.AUDIT_SITE_ID);
                        this.isAuditDownloaded();
                    },
                );
            }
        }
    }

    async getParamsDetails() {
        console.log('this.props.navigation.state.params.datapass.SiteId)', this.props);

        AsyncStorage.setItem('AUDIT_ID', this.props?.route?.params?.datapass.ActualAuditId);
        AsyncStorage.setItem('AUDITPROG_ID', this.props?.route?.params?.datapass?.AuditProgramId);
        AsyncStorage.setItem('AUDITYPE_ORDER', this.props?.route?.params?.datapass?.ActualAuditOrderNo);
        AsyncStorage.setItem('AUDITYPE_ID', this.props?.route?.params?.datapass?.AuditTypeId);
        AsyncStorage.setItem('SITEID', `${this.props?.route?.params?.datapass?.SiteId}`);
        AsyncStorage.setItem('AUDITPROGORDER', this.props?.route?.params?.datapass?.ActualAuditOrderNo);
        // AsyncStorage.setItem('AUDIT_SITE_ID',this.state.AUDIT_SITE_ID);
        // AsyncStorage.setItem('AUDIT_STATUS',this.props.navigation.state.params.datapass.AuditStatus);
    }
    checkUser = async () => {
        console.log('user id', this.props.data.audits.userId);
        var UserStatus = '';
        var serverUrl = this.props.data.audits.serverUrl;
        var ID = this.props.data.audits.userId;
        var type = 3;
        var path = '';
        // var RegisterDevice = this.props.data.audits.deviceid;
        // const deviceId = await AsyncStorage.getItem('loginDeviceId');
        const deviceId = await AsyncStorage.getItem('deviceid');

        const userDetailsString = await AsyncStorage.getItem('userDetails');
        const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
        console.log('userDetails--->---------', userDetails);
        var userid = userDetails.userId;
        var token = userDetails.accessToken;

        console.log(userid, token, deviceId, 'checkUser');

        auth.getCheckUser(userid, deviceId, token, (res, data) => {
            console.log('User information', data);

            if (data.data.Message == 'Success') {
                console.log('Checking User status', data.data.Data.ActiveStatus);
                UserStatus = data.data.Data.ActiveStatus;
                if (this.props.data.audits.isOfflineMode) {
                    this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
                } else {
                    NetInfo.fetch().then(netState => {
                        if (netState.isConnected) {
                            // this.props.navigation.navigate('AuditPage', {
                            //   datapass: iAuditDetails,
                            //   auditStatusPass: this.props.item.cStatus,
                            // });
                        } else {
                            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
                        }
                    });
                }

                if (UserStatus == 2) {
                    console.log('User active /// bhuvi');
                    // this.syncAuditsToServerMethod()
                    // this.checkFilePath();
                } else if (UserStatus == 1) {
                    console.log('deleting user details');

                    var cleanURL = serverUrl.replace(/^https?:\/\//, '');
                    var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                    this.propsServerUrl = formatURL;

                    console.log('cleanURL', this.propsServerUrl);
                    // var ID = this.props.data.audits.userId
                    console.log('path', this.propsServerUrl + ID);

                    if (Platform.OS == 'android') {
                        path = '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' + '/' + this.propsServerUrl + ID;
                        console.log('path storing-->', path);
                    } else {
                        var iOSpath = RNFS.DocumentDirectoryPath;
                        path = iOSpath + '/' + this.propsServerUrl + ID;
                    }
                    console.log('*** path', path);
                    // this.deleteUserFile(path)
                    this.refs.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT);
                   console.log('Your session has expired,Please login again.33333333333333');

                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                } else if (UserStatus == 0) {
                    Alert.alert('Your session has expired,Please login again.');
                   console.log('Your session has expired,Please login again.');


                    this.refs.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT);
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                }
            }
        });
    };
    downloadAuditForm = () => {
        this.checkUser();

        if (this.props.data.audits.isOfflineMode) {
            this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        } else {
            console.log(this.state.auditDetailList, 'download:downloadauditform');
            var auditfilledStatus = this.state.auditDetailList?.AuditagendaFilledStatus;
            var auditmandatory = this.state.auditDetailList?.AuditAgendaMandatory;

            if (auditmandatory == 1 && auditfilledStatus == 0) {
                alert('EwQIMS : Please Fill Audit Agenda from Web to Continue');
            } else {
                NetInfo.fetch().then(isConnected => {
                    if (isConnected.isConnected) {
                        this.setState(
                            {
                                isDownloading: true,
                            },
                            () => {
                                this.auditFormCall();
                            },
                        );
                    } else {
                        this.refs.toast.show(strings.No_Download_Forms, DURATION.LENGTH_LONG);
                    }
                });
            }
        }
    };

    auditResultCall() {
        const TOKEN = this.state.token;
        const SiteID = this.state.SITEID;
        const strSortBy = 'order by FormName asc';
        const iAuditId = this.state.AUDIT_ID;
        const iAudProgId = this.state.AUDITPROG_ID;
        const iAudProgOrder = this.state.AUDITPROGORDER;
        const iAudTypeOrder = this.state.AUDITYPE_ORDER;
        const iAudTypeId = this.state.AUDITYPE_ID;
        const strFunction = 'AuditResult';

        auth.getauditResult(SiteID, strSortBy, iAuditId, iAudProgId, iAudProgOrder, iAudTypeOrder, iAudTypeId, strFunction, TOKEN, (res, data) => {
            console.log('download: Audit Result data', data);
            if (data.data) {
                if (data.data.Message === 'Success') {
                    this.setState({ AuditResults: data.data.Data }, () => {
                        this.auditProcessList(iAuditId, iAudProgId);
                    });
                } else {
                    this.auditProcessList(iAuditId, iAudProgId);
                }
            } else {
                this.auditProcessList(iAuditId, iAudProgId);
            }
        });
    }

    auditProcessList(iAuditId, iAudProgId) {
        const TOKEN = this.state.token;
        const SiteID = this.state.SITEID;
        const UserId = this.state.userId;
        const SearchCondition = 'and KeyProcessId in (' + this.state.AuditProp.ProcessId + ')';
        console.log('checkvalues0000', SiteID, UserId, SearchCondition, TOKEN, iAuditId, iAudProgId);

        auth.getAuditProcessList(SiteID, UserId, SearchCondition, TOKEN, iAuditId, iAudProgId, (res, data) => {
            console.log('download:1 Audit Process List data', data);
            if (data.data) {
                if (data.data.Message === 'Success') {
                    console.log('download:2');
                    this.setState({ AuditProcessList: data.data.Data }, () => {
                        this.updateAuditDetailsInStore();
                    });
                } else {
                    console.log('download:3');
                    this.updateAuditDetailsInStore();
                }
            } else {
                console.log('download:4');
                this.updateAuditDetailsInStore();
            }
        });
    }

    auditFormCall() {
        const TOKEN = this.state.token;
        const SiteID = this.state.SITEID;
        var strSortBy = 'order by FormName asc';
        if (this.state.AUDITPROG_ID == -1) {
            strSortBy = 'order by cast(FormName as nvarchar(max)) asc';
        }
        const iAuditId = this.state.AUDIT_ID;
        const iAudProgId = this.state.AUDITPROG_ID;
        const iAudProgOrder = this.state.AUDITPROGORDER;
        const iAudTypeOrder = this.state.AUDITYPE_ORDER;
        const iAudTypeId = this.state.AUDITYPE_ID;
        var strFunction = 'AuditForm';
        if (this.state.AUDITPROG_ID == -1) {
            strFunction = 'LPACheckList';
        }
        console.log('checkprops from new dashboard.........', this.props);

        console.log(
            'Audit form request',
            SiteID,
            strSortBy,
            iAuditId,
            iAudProgId, //*
            iAudProgOrder,
            iAudTypeOrder, //*
            iAudTypeId,
            strFunction,
        );

        auth.getAuditForm(SiteID, strSortBy, iAuditId, iAudProgId, iAudProgOrder, iAudTypeOrder, iAudTypeId, strFunction, TOKEN, (res, data) => {
            console.log('download: Audit form response', data);
            if (data.data) {
                if (data.data.Message == 'Success') {
                    if (data.data.Data.length === 0) {
                        console.log('No Audit form response');
                        this.checkListCall();
                    } else {
                        var Formdata = [];
                        var FormId = '';
                        if (data.data.Data.length > 0) {
                            for (var i = 0; i < data.data.Data.length; i++) {
                                if (data.data.Data[i].FormType == 1) {
                                    FormId = data.data.Data[i].FormId;
                                }
                                Formdata.push({
                                    Attachmenttype: data.data.Data[i].Attachmenttype,
                                    FormId: data.data.Data[i].FormId,
                                    DocumentId: data.data.Data[i].DocumentId,
                                    FormName: data.data.Data[i].FormName,
                                    DocName: data.data.Data[i].FileName,
                                    FormType: data.data.Data[i].FormType,
                                    AttachedDocument: '',
                                    isModified: false,
                                });
                            }
                        }
                        this.setState({ IFormID: FormId, Formdata: Formdata }, () => {
                            console.log('download:this.state.IFORMID', this.state.IFormID);
                            // this.checkUser();
                            this.checkListCall();
                        });
                    }
                } else {
                    console.log('No Audit form response');
                    this.checkListCall();
                }
            } else {
                console.log('No Audit form response');
                this.checkListCall();
            }
        });
    }

    checkListCall() {
        const ISiteID = this.state.SITEID;
        const IFormID = this.state.IFormID;
        const IAuditID = this.state.AUDIT_ID;
        const IAuditProgramID = this.state.AUDITPROG_ID;
        const IAuditTypeID = this.state.AUDITYPE_ID;
        const IAuditOrderID = this.state.AUDITPROGORDER;
        const TOKEN = this.state.token;

        console.log('checkkkkkkk99999-----', IAuditProgramID);

        auth.getChecklist(ISiteID, IFormID, IAuditID, IAuditProgramID, IAuditTypeID, IAuditOrderID, TOKEN, (res, data) => {
            console.log('download: CheckListCall() response', data);
            if (data.data) {
                if (data.data.Message === 'Success') {
                    var compArr = [];
                    for (var i = 0; i < data.data.Data.length; i++) {
                        //if(data.data.Data[i].CompLevelId === 3 || data.data.Data[i].CompLevelId === 1){
                        compArr.push(data.data.Data[i]);
                        //}
                    }
                    console.log('CompArr');
                    if (compArr.length > 0) {
                        for (var i = 0; i < data.data.Data.length; i++) {
                            //if(data.data.Data[i].CompLevelId === 3 || data.data.Data[i].CompLevelId === 1){
                            var checkListtemplateid = data.data.Data[i].ChecklistTemplateId;
                            //}
                        }
                        console.log('download: data present Checklist template id', checkListtemplateid);

                        this.setState(
                            {
                                ChecklistBtn: true,
                                CheckListPropData: data.data.Data,
                                checklistID: checkListtemplateid,
                            },
                            function () {
                                console.log('download:Checklist button', this.state.ChecklistBtn);
                                console.log('download:ChecklIst prop data', this.state.CheckListPropData);
                                console.log('download:ChecklIst checklistID data', this.state.checklistID);
                                this.checkPointLogicCall(compArr[0].ChildCount);
                            }.bind(this, compArr),
                        );
                    } else {
                        console.log('download:No checklists found!');
                        this.setState({ ChecklistBtn: false, CheckListPropData: [], checklistID: '' }, () => {
                            console.log('download:Checklist button', this.state.ChecklistBtn);
                            console.log('download:ChecklIst prop data', this.state.CheckListPropData);
                            this.getDropDown();
                        });
                    }
                } else {
                    console.log('download:No checklists found!');
                    this.setState({ ChecklistBtn: false, CheckListPropData: [], checklistID: '' }, () => {
                        console.log('Checklist button', this.state.ChecklistBtn);
                        console.log('ChecklIst prop data', this.state.CheckListPropData);
                        this.getDropDown();
                    });
                }
            } else {
                console.log('download:No checklists found!');
                this.setState({ ChecklistBtn: false, CheckListPropData: [], checklistID: '' }, () => {
                    console.log('Checklist button', this.state.ChecklistBtn);
                    console.log('ChecklIst prop data', this.state.CheckListPropData);
                    this.getDropDown();
                });
            }
        });
    }

    checkPointLogicCall(parentID) {
        const IFormID = this.state.IFormID;
        const IAuditID = this.state.AUDIT_ID;
        const IAuditProgramID = this.state.AUDITPROG_ID;
        const IAuditTypeID = this.state.AUDITYPE_ID;
        const IAuditOrderID = this.state.AUDITPROGORDER;
        const iParentId = parentID;
        const ISiteID = this.state.SITEID;
        const TOKEN = this.state.token;
        const SM = this.state.smData;
        console.log('download:sm==>', this.state.smData);
        auth.getCheckRadio(IFormID, IAuditID, IAuditProgramID, IAuditTypeID, IAuditOrderID, iParentId, ISiteID, SM, TOKEN, (res, odata) => {
            console.log('download: Checkpoint response', odata);
            //let data =  JSON.parse(odata.data);
            let data = odata;
            if (data.data) {
                if (data.data.Message === 'Success') {
                    this.setState({ CheckpointLogic: data.data.Data }, () => {
                        console.log('this.state.CheckpointLogic', this.state.CheckpointLogic);
                        this.getDropDown();
                    });
                } else {
                    this.getDropDown();
                }
            } else {
                this.getDropDown();
            }
        });
    }

    processJsonFile = async filePath => {
        const chunkSize = 1024 * 1024; // 1 MB
        let offset = 0;
        let jsonData = [];

        while (true) {
            const chunk = await RNFetchBlob.fs.readStream(filePath, offset, chunkSize, 'utf8');
            const text = await new Promise((resolve, reject) => {
                let data = '';
                chunk.open();
                chunk.onData(chunkData => {
                    data += chunkData;
                });
                chunk.onEnd(() => {
                    resolve(data);
                });
                chunk.onError(err => {
                    reject(err);
                });
            });

            if (!text) {
                break;
            }

            const chunkData = JSON.parse(text);
            jsonData = jsonData.concat(chunkData);

            offset += chunkSize;
        }

        setData(jsonData);
        setLoading(false);
    };

    getDropDown() {
        const AuditId = this.state.AUDIT_ID;
        //const AuditId = "842"
        const AuditProgramId = this.state.AUDITPROG_ID;
        //const AuditProgramId = "20"
        const SiteId = this.state.SITEID;
        //const SiteId = 1
        const AuditOrderId = this.state.AUDITPROGORDER;
        //const AuditOrderId ="1"
        const ActualAuditId = this.ActualAudit === true ? 1 : 0;
        //const ActualAuditId = ""
        const token = this.state.token;

        auth.getncofiDropdown(AuditId, AuditProgramId, SiteId, AuditOrderId, ActualAuditId, token, this.state.userId, (res, data) => {
            console.log('download: Dropdown data', data);
            if (data.data) {
                if (data.data.Message === 'Success') {
                    this.setState({ DropDownProps: data.data.Data }, () => {
                        console.log('Drop Down props', this.state.DropDownProps);
                        this.getNCDetails();
                    });
                } else {
                    this.getNCDetails();
                }
            } else {
                this.getNCDetails();
            }
        });
    }

    getNCDetails() {
        const SiteID = this.state.SITEID;
        const strSortBy = 'order by Title asc';
        const iAuditId = this.state.AUDIT_ID;
        const iAudProgId = this.state.AUDITPROG_ID;
        const iAudProgOrder = this.state.AUDITPROGORDER;
        const iAudTypeOrder = this.state.AUDITYPE_ORDER;
        const iAudTypeId = this.state.AUDITYPE_ID;
        const strFunction = 'AuditNCOFI';
        const TOKEN = this.state.token;
        console.log(this.state.AUDITYPE_ORDER, 'venkat/nc');
        console.log(iAudProgId, 'venkat/nciAudProgId');
        console.log(iAudTypeOrder, 'venkat/ncAuditTypeOrder');

        auth.getNCdetails(SiteID, strSortBy, iAuditId, iAudProgId, iAudProgOrder, iAudTypeOrder, iAudTypeId, strFunction, TOKEN, (res, data) => {
            console.log('download: getNC data', data);
            if (data.data) {
                this.setState({ NCdetailsprops: data.data.Data, isDownloaded: true }, () => {
                    console.log('download:Download Complete');
                    console.log('download:NC details', this.state.NCdetailsprops);
                    this.checkUser();
                    this.auditResultCall();
                });
            } else {
                this.auditResultCall();
            }
        });
    }

    onNavigateTo(id) {
        console.log('Navigating...', id, this.state.AUDITPROGORDER);
        const multiprocess = this.props?.route?.params?.datapass?.multiprocess;
        // return
        if (id === 1) {
            this.props.navigation.navigate(ROUTES.AUDIT_RESULT, {
                AuditID: this.state.AUDIT_ID,
                SiteID: this.state.SITEID,
                AuditProgramId: this.state.AUDITPROG_ID,
                AuditProgramOrder: this.state.AUDITPROGORDER,
                AuditOrder: this.state.AUDITYPE_ORDER,
                AuditTypeId: this.state.AUDITYPE_ID,
                breadCrumb: this.state.auditDetailList.Auditee,
            });
        } else if (id === 2) {
            this.props.navigation.navigate(ROUTES.AUDIT_FORM_SM, {
                datapassParam: this.props?.route?.params?.datapass,
                AuditID: this.state.AUDIT_ID,
                ChecklistBtn: this.state.ChecklistBtn,
                CreateNCdataBundle: {
                    AuditID: this.state.AUDIT_ID,
                    AuditOrder: this.state.AUDITYPE_ORDER,
                    title: 'order by FormName asc',
                    auditstatus: this.state.auditstatus,
                    SiteID: this.state.SITEID,
                    Formid: this.state.IFormID,

                    ChecklistID: this.state.checklistID,
                    AUDIT_NO: this.state.AUDIT_NO,
                    AuditProgramId: this.state.AUDITPROG_ID,
                    breadCrumb: this.state.auditDetailList.Auditee,
                },
            });
        } else if (id === 3) {
            console.log('this.state.AUDITYPE_ORDER', this.state.AUDITYPE_ORDER);
            console.log('this.state.auditstatus', this.state.auditstatus);
            this.props.navigation.navigate(ROUTES.NC_OFI_PAGE_SM, {
                CreateNCdataBundle: {
                    AuditID: this.state.AUDIT_ID,
                    AuditOrder: this.state.AUDITYPE_ORDER,
                    title: 'order by FormName asc',
                    auditstatus: this.state.auditstatus,
                    SiteID: this.state.SITEID,
                    Formid: this.state.IFormID,
                    FromIds: '',
                    ChecklistID: this.state.checklistID,
                    AUDIT_NO: this.state.AUDIT_NO,
                    breadCrumb: this.state.auditDetailList.Auditee,
                    clauseMandatory: this.state.clauseMandatoryState,
                    multiprocess: multiprocess == undefined ? '0' : multiprocess,
                },
            });
        } else if (id === 6) {
            console.log('this.state.AUDITYPE_ORDER', this.state.AUDITYPE_ORDER);
            console.log('this.state.auditstatus', this.state.auditstatus);
            console.log(this.props?.route?.params, 'stateparams');
            this.props.navigation.navigate(ROUTES.CONFORMACY, {
                AuditID: this.props?.route?.params?.datapass?.ActualAuditId,
                ChecklistBtn: this.state.ChecklistBtn,
                CreateNCdataBundle: {
                    AuditID: this.state.AUDIT_ID,
                    AuditOrder: this.state.AUDITYPE_ORDER,
                    title: 'order by FormName asc',
                    auditstatus: this.state.auditstatus,
                    SiteID: this.state.SITEID,
                    Formid: this.state.IFormID,
                    ChecklistID: this.state.checklistID,
                    AUDIT_NO: this.state.AUDIT_NO,
                    AuditProgramId: this.state.AUDITPROG_ID,
                    breadCrumb: this.state.auditDetailList.Auditee,
                    clauseMandatory: this.state.clauseMandatoryState,
                    multiprocess: multiprocess == undefined ? '0' : multiprocess,
                },
            });
        } else {
            this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                AuditID: this.state.AUDIT_ID,
                AuditProgramOrder: this.state.AUDITPROGORDER,
                isDeleted: 0,
                breadCrumb: this.state.auditDetailList.Auditee,
            });
        }
    }
    async onNavigationTo() {
        // const uri = this.props.data.audits.serverUrl;
        const uri = await AsyncStorage.getItem('storedserverrul');
        const agendaurlview = await AsyncStorage.getItem('AgendaURL' + this.state.auditDetailList.AuditNumber);
        console.log(agendaurlview, 'helloagenda');
        console.log(this.props.data.audits.agendaUrl, 'cturl');
        const response = uri.match(
            /^(?<protocol>https?:\/\/)(?=(?<fqdn>[^:/]+))(?:(?<service>www|ww\d|cdn|ftp|mail|pop\d?|ns\d?|git)\.)?(?:(?<subdomain>[^:/]+)\.)*(?<domain>[^:/]+\.[a-z0-9]+)(?::(?<port>\d+))?(?<path>\/[^?]*)?(?:\?(?<query>[^#]*))?(?:#(?<hash>.*))?/i,
        ).groups;

        const WebviewUrl = agendaurlview;
        console.log(uri, 'helloserverurl');
        console.log('webviewurl', this.state.AuditAgendaUrl, WebviewUrl, this.state.agendaUrl);
        console.log('webviewurl1', this.state.agendaUrl);
        this.props.navigation.navigate(ROUTES.AUDIT_WEBVIEW, {
            AuditID: this.state.AUDIT_ID,
            WebviewUrl,
            isShowModal: true,
        });
    }
    updateAuditDetailsInStore = () => {
        var auditDetailList = this.state.auditDetailList;
        var Formdata = this.state.Formdata;
        var CheckListPropData = this.state.CheckListPropData;
        var CheckpointLogic = this.state.CheckpointLogic || {};
        var CheckpointsDetails = CheckpointLogic.AuditCheckpointDetail || [];
        var checkPointAttachment = CheckpointLogic.CheckpointAttachment || [];
        var DropDownProps = this.state.DropDownProps;
        var formId = this.state.IFormID;
        var userId = this.state.userId;
        var auditResult = this.state.AuditResults;
        var auditProcessList = this.state.AuditProcessList;
        var AUDITYPEORDER = this.state.AUDITYPE_ORDER;
        console.log('download:5');
        console.log('download:this.state.AUDITYPE_ORDER------', this.state.AUDITYPE_ORDER);
        console.log('download:auditDetailList', auditDetailList);
        console.log('download:Formdata', Formdata);
        console.log('CheckListPropData', CheckListPropData);
        console.log('CheckpointLogic', CheckpointLogic);
        console.log('CheckpointsDetails', CheckpointsDetails);
        console.log('DropDownProps', DropDownProps);
        console.log('Attachment:download:checkPointAttachment:', checkPointAttachment);
        console.log('this.props.data.audits.auditRecords', this.props.data.audits.auditRecords);
        console.log('this.props.data.audits.auditRecords length', this.props.data.audits.auditRecords.length);

        var CheckData = [];
        var attachment = [];
        if (CheckpointsDetails) {
            console.log('download:6');
            for (var i = 0; i < CheckpointsDetails.length; i++) {
                console.log('download:7', i);
                console.log('Attachment:CheckpointsDetails-i', i);
                if (checkPointAttachment) {
                    console.log('download:8', i);
                    var docAttach = checkPointAttachment.filter(
                        item => item.FormID == CheckpointsDetails[i].FormId && item.ChecklistTemplateID == CheckpointsDetails[i].ChecklistTemplateId,
                    );
                    console.log('Attachment:docAttach', docAttach);
                    attachment = docAttach.length > 0 ? this.getAttachmentByFormID_TemplateID(docAttach) : [];
                    console.log('Attachment:res', attachment);
                }
                console.log('download:9', i);
                CheckData.push({
                    AttachforComp: CheckpointsDetails[i].AttachforComp,
                    AttachforNc: CheckpointsDetails[i].AttachforNc,
                    Modified: CheckpointsDetails[i].Modified,
                    AuditId: CheckpointsDetails[i].AuditId,
                    ChecklistName: CheckpointsDetails[i].ChecklistName,
                    ChecklistTemplateId: CheckpointsDetails[i].ChecklistTemplateId,
                    CompLevelId: CheckpointsDetails[i].CompLevelId,
                    LogicFormulae: CheckpointsDetails[i].LogicFormulae,
                    Maxscore: CheckpointsDetails[i].Maxscore,
                    MinScore: CheckpointsDetails[i].MinScore,
                    NeedScore: CheckpointsDetails[i].NeedScore,
                    ParentId: CheckpointsDetails[i].ParentId,
                    RemarkforNc: CheckpointsDetails[i].RemarkforNc,
                    ScoreType: CheckpointsDetails[i].ScoreType,
                    Score: CheckpointsDetails[i].Score,
                    Scoretext: CheckpointsDetails[i].Scoretext,
                    Remark: CheckpointsDetails[i].Remark,
                    RadioValue: 0,
                    Values: CheckpointsDetails[i].Values,
                    LPAValidation: CheckpointsDetails[i].LPAValidation,
                    Correction: CheckpointsDetails[i].CorrectionCloseOut,
                    Approach: '',
                    ApproachId: CheckpointsDetails[i].Approach,
                    ParamMode: 0,
                    IsNCAllowed: CheckpointsDetails[i].Status == 0 ? 1 : 0,
                    IsCorrect: CheckpointsDetails[i].Status,
                    Attachment: CheckpointsDetails[i].Attachment == undefined ? '' : CheckpointsDetails[i].Attachment,
                    AttachmentList: attachment,
                    FileName: '',
                    File: '',
                    FileType: '',
                    FileSize: 0,
                    Modified: false,
                    isScoreValid: true,
                    scoreInvalidMsg: '',
                    RemarkforOfi: CheckpointsDetails[i].RemarkforOfi,
                    AttachforOfi: CheckpointsDetails[i].AttachforOfi,
                    FailureCategoryId: CheckpointsDetails[i].FailureCategoryId,
                    FailureReasonId: CheckpointsDetails[i].FailureReasonId,
                    FormId: CheckpointsDetails[i].FormId,
                    immediateAction: CheckpointsDetails[i].immediateAction,
                    ncOFIStatus: CheckpointsDetails[i].ByteAttachment1,
                });
            }
        }

        console.log('CheckData', CheckData);

        if (this.props.data.audits.auditRecords.length == 0) {
            console.log('condition if state........');

            var auditStatus = constant.StatusDownloaded;
            if (auditDetailList.AuditStatus == 3) {
                auditStatus = constant.StatusCompleted;
            }
            var auditRecords = [
                {
                    AuditTypeOrder: this.state.AUDITYPE_ORDER,
                    AuditId: auditDetailList.AuditId,
                    AuditProgramId: auditDetailList.AuditProgId,
                    AuditTypeId: auditDetailList.AuditTypeId,
                    AuditOrderId: auditDetailList.AuditTypeOrderId,
                    SiteId: auditDetailList.SiteId,
                    Status: auditDetailList.AuditStatus,
                    AssignedTaskRoutes: auditDetailList.AssignedTaskRoutes,
                    AssociatesName: auditDetailList.AssociatesName,
                    AuditConductedByName: auditDetailList.AuditConductedByName,
                    AuditCycleCode: auditDetailList.AuditCycleCode,
                    AuditCycleName: auditDetailList.AuditCycleName,
                    AuditNumber: auditDetailList.AuditNumber,
                    AuditProgOrder: auditDetailList.AuditProgOrder,
                    AuditProgramName: auditDetailList.AuditProgramName,
                    // AuditAgendaUrl:auditDetailList.AuditAgendaUrl,
                    VDA: auditDetailList.VDA,
                    ReportId: auditDetailList.ReportId,
                    AuditTemplateId: auditDetailList.AuditTemplateId,
                    AuditTemplateName: auditDetailList.AuditTemplateName,
                    AuditTypeName: auditDetailList.AuditTypeName,
                    Auditee: auditDetailList.Auditee,
                    AuditeeContactPersonName: auditDetailList.AuditeeContactPersonName,
                    AuditorName: auditDetailList.AuditorName,
                    SeniorAuditor: auditDetailList.SeniorAuditor,
                    CycleShortName: auditDetailList.CycleShortName,
                    EndDate: auditDetailList.EndDate,
                    Formname: auditDetailList.Formname,
                    Formtype: auditDetailList.Formtype,
                    LeadAuditor: auditDetailList.LeadAuditor,
                    ProcessCategorysName: auditDetailList.ProcessCategorysName,
                    ProcessGroupsName: auditDetailList.ProcessGroupsName,
                    ProcessScopeName: auditDetailList.ProcessScopeName,
                    SchedulerName: auditDetailList.SchedulerName,
                    StartDate: auditDetailList.StartDate,
                    PerformStarted: auditDetailList.PerformStarted,
                    FormId: formId,
                    Formdata: Formdata,
                    CheckListPropData: CheckListPropData,
                    CheckpointLogic: CheckpointLogic,
                    DropDownProps: DropDownProps,
                    Listdata: CheckData,
                    UserId: userId,
                    FromDocPro: 0,
                    DocumentId: 0,
                    DocRevNo: 0,
                    AuditRecordStatus: auditStatus,
                    AuditResults: auditResult,
                    AuditProcessList: auditProcessList,
                },
            ];

            // Store audit list in redux store to set it in persistant storage
            this.props.storeAuditRecords(auditRecords);
            console.log('AuditDashBody Props After Props Changing...', this.props);
        } else {
            console.log('condition else state........');

            var auditRecordsOrg = this.props.data.audits.auditRecords;
            var auditRecords = [];
            var isAuditExists = false;

            for (var p = 0; p < auditRecordsOrg.length; p++) {
                auditRecords.push({
                    AuditId: auditRecordsOrg[p].AuditId,
                    AuditOrderId: auditRecordsOrg[p].AuditOrderId,
                    AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
                    AuditProgramId: auditRecordsOrg[p].AuditProgramId,
                    AuditTypeId: auditRecordsOrg[p].AuditTypeId,
                    SiteId: auditRecordsOrg[p].SiteId,
                    Status: auditRecordsOrg[p].Status,
                    AssignedTaskRoutes: auditRecordsOrg[p].AssignedTaskRoutes,
                    AssociatesName: auditRecordsOrg[p].AssociatesName,
                    AuditConductedByName: auditRecordsOrg[p].AuditConductedByName,
                    AuditCycleCode: auditRecordsOrg[p].AuditCycleCode,
                    AuditCycleName: auditRecordsOrg[p].AuditCycleName,
                    AuditNumber: auditRecordsOrg[p].AuditNumber,
                    AuditProgOrder: auditRecordsOrg[p].AuditProgOrder,
                    AuditProgramName: auditRecordsOrg[p].AuditProgramName,
                    //  AuditAgendaUrl: auditRecordsOrg[p].AuditAgendaUrl,
                    VDA: auditRecordsOrg[p].VDA,
                    ReportId: auditRecordsOrg[p].ReportId,
                    AuditTemplateId: auditRecordsOrg[p].AuditTemplateId,
                    AuditTemplateName: auditRecordsOrg[p].AuditTemplateName,
                    AuditTypeName: auditRecordsOrg[p].AuditTypeName,
                    Auditee: auditRecordsOrg[p].Auditee,
                    AuditeeContactPersonName: auditRecordsOrg[p].AuditeeContactPersonName,
                    AuditorName: auditRecordsOrg[p].AuditorName,
                    SeniorAuditor: auditRecordsOrg[p].SeniorAuditor,
                    CycleShortName: auditRecordsOrg[p].CycleShortName,
                    EndDate: auditRecordsOrg[p].EndDate,
                    Formname: auditRecordsOrg[p].Formname,
                    Formtype: auditRecordsOrg[p].Formtype,
                    LeadAuditor: auditRecordsOrg[p].LeadAuditor,
                    ProcessCategorysName: auditRecordsOrg[p].ProcessCategorysName,
                    ProcessGroupsName: auditRecordsOrg[p].ProcessGroupsName,
                    ProcessScopeName: auditRecordsOrg[p].ProcessScopeName,
                    SchedulerName: auditRecordsOrg[p].SchedulerName,
                    StartDate: auditRecordsOrg[p].StartDate,
                    FormId: auditRecordsOrg[p].FormId,
                    Formdata: auditRecordsOrg[p].Formdata,
                    CheckListPropData: auditRecordsOrg[p].CheckListPropData,
                    CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
                    DropDownProps: auditRecordsOrg[p].DropDownProps,
                    // NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
                    Listdata: auditRecordsOrg[p].Listdata,
                    UserId: auditRecordsOrg[p].UserId,
                    FromDocPro: auditRecordsOrg[p].FromDocPro,
                    DocumentId: auditRecordsOrg[p].DocumentId,
                    DocRevNo: auditRecordsOrg[p].DocRevNo,
                    AuditRecordStatus: auditRecordsOrg[p].AuditRecordStatus,
                    AuditResults: auditRecordsOrg[p].AuditResults,
                    AuditProcessList: auditRecordsOrg[p].AuditProcessList,
                });
                console.log('auditRecordsOrg[p].AuditProcessList', auditRecordsOrg[p]);
            }

            console.log('auditRecords created.', auditRecords);
            console.log('auditDetailList created.', auditDetailList);

            for (var i = 0; i < auditRecords.length; i++) {
                if (auditRecords[i]?.AuditId == auditDetailList?.AuditId) {
                    isAuditExists = true;
                }
            }

            if (!isAuditExists) {
                console.log('condition isAuditExists state........');

                var auditStatus = constant.StatusDownloaded;
                if (auditDetailList.AuditStatus == 3) {
                    auditStatus = constant.StatusCompleted;
                }
                auditRecords.push({
                    AuditTypeOrder: this.state.AUDITYPE_ORDER,
                    AuditId: auditDetailList.AuditId,
                    AuditProgramId: auditDetailList.AuditProgId,
                    AuditTypeId: auditDetailList.AuditTypeId,
                    AuditOrderId: auditDetailList.AuditTypeOrderId,
                    SiteId: auditDetailList.SiteId,
                    Status: auditDetailList.AuditStatus,
                    AssignedTaskRoutes: auditDetailList.AssignedTaskRoutes,
                    AssociatesName: auditDetailList.AssociatesName,
                    AuditConductedByName: auditDetailList.AuditConductedByName,
                    AuditCycleCode: auditDetailList.AuditCycleCode,
                    AuditCycleName: auditDetailList.AuditCycleName,
                    AuditNumber: auditDetailList.AuditNumber,
                    AuditProgOrder: auditDetailList.AuditProgOrder,
                    AuditProgramName: auditDetailList.AuditProgramName,
                    // AuditAgendaUrl: auditDetailList.AuditAgendaUrl,
                    VDA: auditDetailList.VDA,
                    ReportID: auditDetailList.ReportId,
                    AuditTemplateId: auditDetailList.AuditTemplateId,
                    AuditTemplateName: auditDetailList.AuditTemplateName,
                    AuditTypeName: auditDetailList.AuditTypeName,
                    Auditee: auditDetailList.Auditee,
                    AuditeeContactPersonName: auditDetailList.AuditeeContactPersonName,
                    AuditorName: auditDetailList.AuditorName,
                    SeniorAuditor: auditDetailList.SeniorAuditor,
                    CycleShortName: auditDetailList.CycleShortName,
                    EndDate: auditDetailList.EndDate,
                    Formname: auditDetailList.Formname,
                    Formtype: auditDetailList.Formtype,
                    LeadAuditor: auditDetailList.LeadAuditor,
                    ProcessCategorysName: auditDetailList.ProcessCategorysName,
                    ProcessGroupsName: auditDetailList.ProcessGroupsName,
                    ProcessScopeName: auditDetailList.ProcessScopeName,
                    SchedulerName: auditDetailList.SchedulerName,
                    StartDate: auditDetailList.StartDate,
                    PerformStarted: auditDetailList.PerformStarted,
                    FormId: formId,
                    Formdata: Formdata,
                    CheckListPropData: CheckListPropData,
                    CheckpointLogic: CheckpointLogic,
                    DropDownProps: DropDownProps,
                    Listdata: CheckData,
                    UserId: userId,
                    FromDocPro: 0,
                    DocumentId: 0,
                    DocRevNo: 0,
                    AuditRecordStatus: auditStatus,
                    AuditResults: auditDetailList.AuditResults,
                    AuditProcessList: auditProcessList,
                });
                console.log('auditRecordsOrg[p].AuditProcessList 2nd', auditDetailList);
            }

            // Store audit list in redux store to set it in persistant storage
            this.props.storeAuditRecords(auditRecords);
        }

        // Update NC/OFI details
        var NCrecords = this.props.data.audits.ncofiRecords;
        var dupNCrecords = [];

        if (NCrecords.length == 0) {
            dupNCrecords.push({
                AuditID: this.state.AUDIT_ID,
                Uploaded: this.state.NCdetailsprops ? this.state.NCdetailsprops : [],
                Pending: [],
            });
        } else {
            for (var i = 0; i < NCrecords.length; i++) {
                dupNCrecords.push({
                    AuditID: NCrecords[i].AuditID,
                    Uploaded: NCrecords[i].Uploaded,
                    Pending: NCrecords[i].Pending,
                });
            }
            dupNCrecords.push({
                AuditID: this.state.AUDIT_ID,
                Uploaded: this.state.NCdetailsprops ? this.state.NCdetailsprops : [],
                Pending: [],
            });
        }

        // Store NC/OFI details to redux store
        this.props.storeNCRecords(dupNCrecords);

        // Update audit status in the audit list
        console.log('checktheauditstatus------->', this.props.data.audits.audits);

        var auditListOrg = this.props.data.audits.audits;
        var auditList = [];

        for (var i = 0; i < auditListOrg.length; i++) {
            var auditStatus = auditListOrg[i].cStatus;
            var auditColor = auditListOrg[i].color;

            if (parseInt(auditListOrg[i].ActualAuditId) == parseInt(auditDetailList.AuditId)) {
                if (auditListOrg[i].AuditStatus != 3) {
                    auditStatus = constant.StatusDownloaded;
                }
            }

            // Set Audit Card color by checking its Status
            switch (auditStatus) {
                case constant.StatusScheduled:
                    auditColor = '#F1EB0E';
                    break;
                case constant.StatusDownloaded:
                    auditColor = '#cd8cff';
                    break;
                case constant.StatusNotSynced:
                    auditColor = '#2ec3c7';
                    break;
                case constant.StatusProcessing:
                    auditColor = '#e88316';
                    break;
                case constant.StatusSynced:
                    auditColor = '#48bcf7';
                    break;
                case constant.StatusCompleted:
                    auditColor = '#000';
                    break;
                case constant.Completed:
                    auditColor = 'green';
                    break;
                case constant.StatusDV:
                    auditColor = 'red';
                    break;
                case constant.StatusDVC:
                    auditColor = 'green';
                    break;
                default:
                    auditColor = '#2db816';
                    break;
            }

            auditList.push({
                ActualAudit: auditListOrg[i].ActualAudit,
                ActualAuditId: auditListOrg[i].ActualAuditId,
                ActualAuditOrderNo: auditListOrg[i].ActualAuditOrderNo,
                AssociatesName: auditListOrg[i].AssociatesName,
                AuditConductedByName: auditListOrg[i].AuditConductedByName,
                AuditCycleName: auditListOrg[i].AuditCycleName,
                AuditNumber: auditListOrg[i].AuditNumber,
                AuditPeriodId: auditListOrg[i].AuditPeriodId,
                AuditProgramId: auditListOrg[i].AuditProgramId,
                AuditProgramName: auditListOrg[i].AuditProgramName,
                // AuditAgendaUrl: auditListOrg[i].AuditAgendaUrl,
                VDA: auditListOrg[i].VDA,
                ReportId: auditListOrg[i].ReportId,
                AuditStatus: auditListOrg[i].AuditStatus,
                AuditTemplateId: auditListOrg[i].AuditTemplateId,
                AuditTypeId: auditListOrg[i].AuditTypeId,
                AuditTypeName: auditListOrg[i].AuditTypeName,
                Auditee: auditListOrg[i].Auditee,
                EndDate: auditListOrg[i].EndDate,
                EntityId: auditListOrg[i].EntityId,
                LeadAuditor: auditListOrg[i].LeadAuditor,
                ProcessScopeName: auditListOrg[i].ProcessScopeName,
                SchedulerName: auditListOrg[i].SchedulerName,
                SiteId: auditListOrg[i].SiteId,
                StartDate: auditListOrg[i].StartDate,
                cStatus: auditStatus,
                color: auditColor,
                key: auditListOrg[i].key,
            });
        }

        this.props.storeAudits(auditList);

        this.setState(
            prevState => ({
                isDownloading: false,
                isDownloaded: true,
                AuditProp: {
                    ...(prevState.AuditProp || {}),
                    cStatus: constant.StatusDownloaded,
                },
                auditDetailList: {
                    ...(prevState.auditDetailList || {}),
                    cStatus: constant.StatusDownloaded,
                },
            }),
            () => {
                console.log('Audit form downloaded successfully.');
                console.log('download:auditDetailList', auditDetailList);
                this.updateRecentAuditList(auditDetailList.AuditId, constant.StatusDownloaded);
            },
        );
    };

    async WriteAttachments(AttachmentList) {
        for (let i = 0; i < AttachmentList.length; i++) {
            if (AttachmentList[i].Attachment !== 'EMPTY' && AttachmentList[i].Attachment != '') {
                await RNFetchBlob.fs
                    .writeFile(AttachmentList[i].FileUri, AttachmentList[i].Attachment, 'base64')
                    .then(res => {
                        console.log('Attachment:File Written', AttachmentList[i]);
                    })
                    .catch(err => {
                        console.log('Attachment:Err:' + err);
                    });
            }
        }
    }
    getAttachmentByFormID_TemplateID(attachmentObj) {
        //return new Promise((resolve, reject) => {
        var AttachmentList = [];
        var FileContent = [];
        if (typeof attachmentObj == 'undefined' || attachmentObj == null || attachmentObj.length <= 0) {
            return null;
        } else {
            for (let i = 0; i < attachmentObj.length; i++) {
                console.log('Attachment:in-', attachmentObj[i]);
                let extn = attachmentObj[i].FileName.substring(attachmentObj[i].FileName.lastIndexOf('.') + 1);
                var fileName = 'file_' + attachmentObj[i].Docid + '.' + extn;
                var uripath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles') + '/' + fileName;
                console.log('Attachment:in', attachmentObj[i], uripath);
                const AttachmentData = attachmentObj[i].Attachment;
                AttachmentList.push({
                    id: Moment().unix() + '_' + i,
                    Attachment: AttachmentData == '' ? 'EMPTY' : AttachmentData, //attachmentObj[i].Attachment,
                    AuditID: attachmentObj[i].AuditID,
                    ChecklistTemplateID: attachmentObj[i].ChecklistTemplateID,
                    Docid: attachmentObj[i].Docid,
                    FileName: attachmentObj[i].FileName,
                    FormId: attachmentObj[i].FormID,
                    FileUri: uripath,
                    //mode : 'EMPTY',
                    FileType: this.getImageType(extn),
                });
                console.log('Attachment:-attachment', AttachmentList);
                //async () => { await this.WriteAttachments(uripath, attachmentObj[0].Attachment);}
            }
            this.WriteAttachments(AttachmentList);
            //this.WriteAttachments(FileContent);
            return AttachmentList;
        }

        // });
    }

    getImageType(extn) {
        switch (extn) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return 'image/' + extn;
            case 'pdf':
                return 'application/pdf';
            case 'doc':
            case 'docx':
                return 'application/msword';
            case 'xls':
                return 'application/vnd.ms-excel';
            case 'xlsx':
                return 'application/vnd.ms-excel';
            case 'mp4':
            case 'mpeg':
                return 'video/' + extn;
            default:
                return 'application/octet-stream';
        }
    }

    deleteAuditRecord = thiss => {
        console.log(thiss, 'thiscolsole');
        console.log('enteringdeletaudit1');
        this.setState(
            {
                isDownloading: true,
            },
            () => {
                var auditRecordsOrg = this.props.data.audits.auditRecords;
                var auditRecords = [];

                //Delete Audit Attachments
                var listDataArr = [];
                var deleteAudit = auditRecordsOrg.filter(item => parseInt(item.AuditId) === parseInt(this.state.AUDIT_ID));
                let Files = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
                console.log('Attachment:auditRecordsOrg', auditRecordsOrg);
                RNFetchBlob.fs.ls(Files).then(data => {
                    console.log('Attachment:All files', data);
                });
                if (deleteAudit) {
                    console.log('Attachment:Audit ID', this.state.AUDIT_ID, deleteAudit);
                    listDataArr = deleteAudit[0].Listdata;
                    var deleteAttachment = listDataArr ? listDataArr.filter(item => item.File !== '') : [];
                    console.log('Attachment:deleteAttachment', deleteAttachment);
                    if (deleteAttachment.length > 0) {
                        this.deleteAuditAttachments(deleteAttachment);
                    }
                }
                //return;
                /////////////
                for (var p = 0; p < auditRecordsOrg.length; p++) {
                    if (this.state.AUDIT_ID != auditRecordsOrg[p].AuditId) {
                        auditRecords.push({
                            AuditId: auditRecordsOrg[p].AuditId,
                            // AuditAgendaUrl: auditRecordsOrg[p].agendaUrl,
                            AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
                            AuditOrderId: auditRecordsOrg[p].AuditOrderId,
                            AuditProgramId: auditRecordsOrg[p].AuditProgramId,
                            AuditTypeId: auditRecordsOrg[p].AuditTypeId,
                            SiteId: auditRecordsOrg[p].SiteId,
                            Status: auditRecordsOrg[p].Status,
                            AssignedTaskRoutes: auditRecordsOrg[p].AssignedTaskRoutes,
                            AssociatesName: auditRecordsOrg[p].AssociatesName,
                            AuditConductedByName: auditRecordsOrg[p].AuditConductedByName,
                            AuditCycleCode: auditRecordsOrg[p].AuditCycleCode,
                            AuditCycleName: auditRecordsOrg[p].AuditCycleName,
                            AuditNumber: auditRecordsOrg[p].AuditNumber,
                            AuditProgOrder: auditRecordsOrg[p].AuditProgOrder,
                            AuditProgramName: auditRecordsOrg[p].AuditProgramName,
                            // AuditAgendaUrl: auditRecordsOrg[p].AuditAgendaUrl,
                            VDA: auditRecordsOrg[p].VDA,
                            ReportId: auditRecordsOrg[p].ReportId,
                            AuditTemplateId: auditRecordsOrg[p].AuditTemplateId,
                            AuditTemplateName: auditRecordsOrg[p].AuditTemplateName,
                            AuditTypeName: auditRecordsOrg[p].AuditTypeName,
                            Auditee: auditRecordsOrg[p].Auditee,
                            AuditeeContactPersonName: auditRecordsOrg[p].AuditeeContactPersonName,
                            AuditorName: auditRecordsOrg[p].AuditorName,

                            SeniorAuditor: auditRecordsOrg[p].SeniorAuditor,
                            CycleShortName: auditRecordsOrg[p].CycleShortName,
                            EndDate: auditRecordsOrg[p].EndDate,
                            Formname: auditRecordsOrg[p].Formname,
                            Formtype: auditRecordsOrg[p].Formtype,
                            LeadAuditor: auditRecordsOrg[p].LeadAuditor,
                            ProcessCategorysName: auditRecordsOrg[p].ProcessCategorysName,
                            ProcessGroupsName: auditRecordsOrg[p].ProcessGroupsName,
                            ProcessScopeName: auditRecordsOrg[p].ProcessScopeName,
                            SchedulerName: auditRecordsOrg[p].SchedulerName,
                            StartDate: auditRecordsOrg[p].StartDate,
                            FormId: auditRecordsOrg[p].FormId,
                            Formdata: auditRecordsOrg[p].Formdata,
                            CheckListPropData: auditRecordsOrg[p].CheckListPropData,
                            CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
                            DropDownProps: auditRecordsOrg[p].DropDownProps,
                            // NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
                            Listdata: auditRecordsOrg[p].Listdata,
                            UserId: auditRecordsOrg[p].UserId,
                            FromDocPro: auditRecordsOrg[p].FromDocPro,
                            DocumentId: auditRecordsOrg[p].DocumentId,
                            DocRevNo: auditRecordsOrg[p].DocRevNo,
                            AuditRecordStatus: auditRecordsOrg[p].AuditRecordStatus,
                            AuditResults: auditRecordsOrg[p].AuditResults,
                            AuditProcessList: auditRecordsOrg[p].AuditProcessList,
                            PerformStarted: auditRecordsOrg[p].PerformStarted,
                            // AuditAgendaUrl: auditListOrg[i].AuditAgendaUrl,
                        });
                    }
                }

                console.log('auditRecords created.', auditRecords);

                // Store audit list in redux store to set it in persistant storage
                this.props.storeAuditRecords(auditRecords);

                // Update audit status in the audit list
                var auditListOrg = this.props.data.audits.audits;
                var auditList = [];

                console.log('auditListOrg created.', auditListOrg);

                for (var i = 0; i < auditListOrg.length; i++) {
                    var auditStatus = auditListOrg[i].cStatus;
                    var auditColor = auditListOrg[i].color;

                    if (parseInt(auditListOrg[i].ActualAuditId) == parseInt(this.state.AUDIT_ID)) {
                        // Set Audit Status
                        if (auditListOrg[i].AuditStatus == 3) {
                            auditStatus = constant.StatusCompleted;
                        } else if (auditListOrg[i].AuditStatus == 2 && auditListOrg[i].PerformStarted == 0) {
                            auditStatus = constant.StatusScheduled;
                        } else if (auditListOrg[i].AuditStatus == 2 && auditListOrg[i].PerformStarted == 1) {
                            auditStatus = constant.StatusProcessing;
                        } else if (auditListOrg[i].AuditStatus == 4) {
                            auditStatus = constant.StatusDV;
                        } else if (auditListOrg[i].AuditStatus == 5) {
                            auditStatus = constant.StatusDVC;
                        }

                        if (
                            auditStatus == constant.StatusDownloaded ||
                            auditStatus == constant.StatusNotSynced ||
                            auditStatus == constant.StatusSynced
                        ) {
                            auditStatus = constant.StatusScheduled;
                        }
                    }

                    // Set Audit Card color by checking its Status
                    switch (auditStatus) {
                        case constant.StatusScheduled:
                            auditColor = '#F1EB0E';
                            break;
                        case constant.StatusDownloaded:
                            auditColor = '#cd8cff';
                            break;
                        case constant.StatusNotSynced:
                            auditColor = '#2ec3c7';
                            break;
                        case constant.StatusProcessing:
                            auditColor = '#e88316';
                            break;
                        case constant.StatusSynced:
                            auditColor = '#48bcf7';
                            break;
                        case constant.StatusCompleted:
                            auditColor = 'green';
                            break;
                        case constant.StatusDV:
                            auditColor = 'red';
                            break;
                        case constant.StatusDVC:
                            auditColor = 'green';
                            break;
                        default:
                            auditColor = '#2db816';
                            break;
                    }

                    auditList.push({
                        ActualAudit: auditListOrg[i].ActualAudit,
                        ActualAuditId: auditListOrg[i].ActualAuditId,
                        ActualAuditOrderNo: auditListOrg[i].ActualAuditOrderNo,
                        AssociatesName: auditListOrg[i].AssociatesName,
                        AuditConductedByName: auditListOrg[i].AuditConductedByName,
                        AuditCycleName: auditListOrg[i].AuditCycleName,
                        AuditNumber: auditListOrg[i].AuditNumber,
                        AuditPeriodId: auditListOrg[i].AuditPeriodId,
                        AuditProgramId: auditListOrg[i].AuditProgramId,
                        AuditProgramName: auditListOrg[i].AuditProgramName,
                        // AuditAgendaUrl: auditListOrg[i].AuditAgendaUrl,
                        VDA: auditListOrg[i].VDA,
                        ReportId: auditListOrg[i].ReportId,
                        AuditStatus: auditListOrg[i].AuditStatus,
                        AuditTemplateId: auditListOrg[i].AuditTemplateId,
                        AuditTypeId: auditListOrg[i].AuditTypeId,
                        AuditTypeName: auditListOrg[i].AuditTypeName,
                        Auditee: auditListOrg[i].Auditee,
                        EndDate: auditListOrg[i].EndDate,
                        EntityId: auditListOrg[i].EntityId,
                        LeadAuditor: auditListOrg[i].LeadAuditor,
                        ProcessScopeName: auditListOrg[i].ProcessScopeName,
                        SchedulerName: auditListOrg[i].SchedulerName,
                        SiteId: auditListOrg[i].SiteId,
                        StartDate: auditListOrg[i].StartDate,
                        cStatus: auditStatus,
                        color: auditColor,
                        key: auditListOrg[i].key,
                    });
                }

                this.props.storeAudits(auditList);

                this.setState(
                    {
                        isDownloading: false,
                        isDownloaded: false,
                        dialogVisible: false,
                        dialogVisibleRefresh: false,
                    },
                    () => {
                        // this.props.navigation.goBack();
                    },
                );

                // now clear the ncofi records
                this.deleteNCOFI();
            },
        );

        if (this.state.webToMob == true) {
            this.getSessionValues(true);
            this.downloadAuditForm();

            this.setState({
                webToMob: false,
            });
        } else {
            this.props.navigation.goBack();
        }
    };

    deleteAuditAttachments(auditAttachments) {
        console.log('Attachment:AuditAttachment Delete func in');
        for (var i = 0; i < auditAttachments.length; i++) {
            let filepath = auditAttachments[i].File;
            if (RNFetchBlob.fs.exists(filepath)) {
                RNFetchBlob.fs.unlink(filepath).then(() => {
                    console.log('Attachment:AuditAttachment Deleteted Successfully! ');
                });
            }
        }
    }

    deleteNCOFI() {
        var Data = this.props.data.audits;
        var AuditID = this.state.AUDIT_ID;
        var dupArray = [];
        console.log('delete data', Data);
        console.log('auditID', AuditID);

        for (var i = 0; i < Data.ncofiRecords.length; i++) {
            if (this.state.AUDIT_ID != Data.ncofiRecords[i].AuditID) {
                console.log('deleting nc ofi records from audit', this.state.AUDIT_ID);
                dupArray.push({
                    AuditID: Data.ncofiRecords[i].AuditID,
                    Pending: Data.ncofiRecords[i].Pending,
                    Uploaded: Data.ncofiRecords[i].Uploaded,
                });
            }
        }

        console.log('dupArray', dupArray);
        // Store audit list in redux store to set it in persistant storage
        this.props.storeNCRecords(dupArray);
    }

    displayStatus = (AuditStatus, PerformStarted) => {
        var status = '';
        var auditColor = '';

        var CloseOutStatus = this.props?.route?.params?.datapass?.CloseOutStatus;

        console.log('@auditstatus', AuditStatus, PerformStarted, CloseOutStatus);

        if (CloseOutStatus == 9) {
            status = constant.StatusCompleted;
        } else if (AuditStatus == 3 && PerformStarted == 0) {
            status = constant.Completed;
        } else if (AuditStatus == 3) {
            status = constant.StatusDVC;
        } else if (AuditStatus == 2 && PerformStarted == 0) {
            status = constant.StatusScheduled;
        } else if (AuditStatus == 2 && PerformStarted == 1) {
            status = constant.StatusProcessing;
        } else if (AuditStatus == 4) {
            status = constant.StatusDV;
        } else if (AuditStatus == 5) {
            status = constant.StatusDVC;
        }

        console.log('status===>', status);

        // Set Audit Card color by checking its Status
        switch (status) {
            case constant.StatusScheduled:
                auditColor = '#1081de';
                break;
            case constant.StatusDownloaded:
                auditColor = '#cd8cff';
                break;
            case constant.StatusCompleted:
                auditColor = '#00000';
                break;

            case constant.StatusDV:
                auditColor = 'red';
                break;
            case constant.StatusDVC:
                auditColor = 'green';
                break;
            case constant.Completed:
                auditColor = 'green';
                break;
            case 'In progress':
                auditColor = '#e88316';
                break;
            default:
                auditColor = '#BAB614';
                break;
        }
        console.log('STSCOLOR===>', status);
        return (
            <Text
                style={{
                    color: auditColor,
                    fontSize: Fonts.size.regular,
                    fontFamily: 'OpenSans-Bold',
                }}>
                {status}
            </Text>
        );
    };

    displayStatusNew = status => {
        console.log('displaystatusnew', status);

        let displayStatus = status;
        let auditColor = '';

        const CloseOutStatus = this.props?.route?.params?.datapass?.CloseOutStatus;

        console.log('status===>', status);
        console.log('status===>---------------------', this.props?.route?.params, this.props?.route?.params?.datapass?.cStatus);

        // When opened from Dashboard, map numeric AuditStatus codes
        // to the corresponding status text.
        if (this.props?.route?.params?.screenFrom === 'Dashboard') {
            const code = typeof displayStatus === 'string' ? parseInt(displayStatus, 10) : displayStatus;

            switch (code) {
                case 2:
                    // Scheduled
                    displayStatus = constant.StatusScheduled;
                    break;
                case 3:
                    // Completed / Closed Out
                    displayStatus = CloseOutStatus === 9 ? constant.StatusCompleted : constant.Completed;
                    break;
                case 4:
                    // Deadline Violated
                    displayStatus = constant.StatusDV;
                    break;
                case 5:
                    // Closed Out / Deadline Violated
                    displayStatus = constant.StatusDVC;
                    break;
                default:
                    break;
            }
        }

        // Set Audit Card color by checking its Status
        switch (displayStatus) {
            case constant.StatusScheduled:
                auditColor = '#1081de';
                break;
            case constant.StatusDownloaded:
                auditColor = '#cd8cff';
                break;
            case constant.StatusCompleted:
                auditColor = '#00000';
                break;

            case constant.StatusDV:
                auditColor = 'red';
                break;
            case constant.StatusDVC:
                auditColor = 'green';
                break;
            case constant.Completed:
                auditColor = 'green';
                break;
            case 'In progress':
                auditColor = '#e88316';
                break;
            case constant.StatusNotSynced:
                auditColor = '#2ec3c7';
                break;
            case constant.StatusSynced:
                auditColor = '#48bcf7';
                break;
            default:
                auditColor = '#BAB614';
                break;
        }

        if (this.state.statusCheck) {
            switch (this.state.statusCheck) {
                case constant.StatusScheduled:
                    auditColor = '#1081de';
                    break;
                case constant.StatusDownloaded:
                    auditColor = '#cd8cff';
                    break;
                case constant.StatusCompleted:
                    auditColor = '#00000';
                    break;
                case constant.StatusDV:
                    auditColor = 'red';
                    break;
                case constant.StatusDVC:
                    auditColor = 'green';
                    break;
                case constant.Completed:
                    auditColor = 'green';
                    break;
                case 'In progress':
                    auditColor = '#e88316';
                    break;
                case constant.StatusNotSynced:
                    auditColor = '#2ec3c7';
                    break;
                case constant.StatusSynced:
                    auditColor = '#48bcf7';
                    break;
                default:
                    break;
            }
        }

        console.log('STSCOLOR===>', displayStatus, auditColor);
        return (
            <Text
                style={{
                    color: auditColor,
                    fontSize: Fonts.size.regular,
                    fontFamily: 'OpenSans-Bold',
                }}>
                {displayStatus == null || displayStatus === '' ? this.state.statusCheck : displayStatus}
            </Text>
        );
    };

    getCurrentAuditCStatus = () => {
        const dataPass = this.props?.route?.params?.datapass;
        const routeAuditStatus = this.props?.route?.params?.auditStatusPass;
        const targetAuditId =
            this.state.AuditProp?.ActualAuditId || dataPass?.ActualAuditId || this.state.AUDIT_ID || this.state.auditDetailList?.AuditId;

        if (!targetAuditId) {
            return this.state.AuditProp?.cStatus || dataPass?.cStatus || routeAuditStatus || this.state.AuditProp?.AuditStatus || dataPass?.AuditStatus;
        }

        const auditRecords = this.props?.data?.audits?.auditRecords || [];
        const currentRecord = auditRecords.find(item => `${item.AuditId}` === `${targetAuditId}`);
        if (currentRecord?.AuditRecordStatus) {
            return currentRecord.AuditRecordStatus;
        }

        const auditList = this.props?.data?.audits?.audits || [];
        const currentAudit = auditList.find(item => `${item.ActualAuditId}` === `${targetAuditId}`);

        return (
            currentAudit?.cStatus ||
            this.state.AuditProp?.cStatus ||
            dataPass?.cStatus ||
            routeAuditStatus ||
            currentAudit?.AuditStatus ||
            this.state.AuditProp?.AuditStatus ||
            dataPass?.AuditStatus ||
            this.state.auditDetailList?.AuditStatus
        );
    };

    changeDateFormat = inDate => {
        console.log('Date format ==-->', this.state.selectedFormat);
        var DefaultFormatL = this.state.selectedFormat;
        var sDateArr = inDate.split('T');
        var sDateValArr = sDateArr[0].split('-');
        var sTimeValArr = sDateArr[1].split(':');
        var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1]);
        console.log('auditpage date with time', outDate);
        return Moment(outDate).format(DefaultFormatL);
    };
    async ncofisetting(value) {
        var ncofiSetting = await AsyncStorage.getItem('NCOFISetting');
        console.log(ncofiSetting, value, 'heloncofisetting');
        var dropdownnotokvalue = value;
        this.setState({
            ncofiSetting: ncofiSetting,
            dropdownnotokvalue: dropdownnotokvalue,
        });
    }

    handleDimensionChange = ({ window }) => {
        this.setState({ screenWidth: window.width });
    };

    render() {
        console.log(this.state.auditDetailList, 'AuditDetailsList');
        console.log(this.props?.route?.params, 'venkat12345');
        const suggestions = [
            { id: strings.sugesstion1 },
            { id: strings.sugesstion2 },
            // {id: strings.sugesstion3},
            { id: strings.sugesstion4 },
            { id: strings.sugesstion5 },
            { id: strings.sugesstion6 },
            { id: strings.sugesstion7 },
        ];
        const currentAuditStatus = this.getCurrentAuditCStatus();
        const canShowHeaderActions = !this.state.isLoading && !this.state.isDownloading;
        const scrollBottomPadding = this.state.isDownloaded ? 170 : 132;
        const headerActionButtonStyle = { paddingHorizontal: 8, paddingVertical: 6 };
        const downloadedFooterStyle = [
            styles.footer,
            {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: 'lightgrey',
                zIndex: 1000,
                elevation: 12,
            },
        ];
        const rightActions = canShowHeaderActions ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.state.isDownloaded ? (
                    <>
                        <TouchableOpacity
                            style={headerActionButtonStyle}
                            onPress={() => {
                                this.setState({ dialogVisible: true });
                            }}>
                            <Icon name="trash" size={25} color="#123C95" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={headerActionButtonStyle}
                            onPress={() => {
                                this.setState({ dialogVisibleRefresh: true, webToMob: true, downloadAsync: true });
                            }}>
                            {/* <ResponsiveImage initWidth='25' initHeight='25' source={Images.deleteIcon}/> */}
                            <Icon name="refresh-cw" size={25} color="#123C95" />
                        </TouchableOpacity>
                    </>
                ) : null}
                <TouchableOpacity onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}>
                    <Icon name="home" size={25} color="#123C95" />
                </TouchableOpacity>
            </View>
        ) : (
            <View style={{ width: 36, height: 36 }} />
        );

        return (
            <View style={styles.wrapper}>
                <OfflineNotice />

                {!this.state.isLoading ? (
                    <GlobalHeader
                        title={strings.Audit_Details}
                        subtitle={this.state.breadCrumb}
                        onLeftPress={() => {
                            if (!this.state.isLoading && !this.state.isDownloading) {
                                this.state.PreviousPage == ROUTES.ALLTABAUDITLIST
                                    ? this.props.navigation.navigate(ROUTES.ALLTABAUDITLIST)
                                    : this.props.navigation.goBack();
                            } else {
                                console.log('Component is not ready to goBack..');
                            }
                        }}
                        rightComponent={rightActions}
                    />
                ) : null}

                {!this.state.isLoading ? (
                    <View style={styles.auditPageBody}>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator>
                            {this.state.auditDetailList ? (
                                <View style={styles.detailsCard}>
                                    <View style={styles.card1}>
                                        <View style={styles.boxCard1}>
                                            {this.state.smData != 2 && this.state.smData != 3 ? (
                                                <Text style={styles.detailTitle}> {strings.Auditee}</Text>
                                            ) : (
                                                <Text style={styles.detailTitle}>{'Supplier'}</Text>
                                            )}
                                        </View>
                                        <View style={styles.boxCard2}>
                                            <Text numberOfLines={2} style={styles.detailContent}>
                                                {this.state.auditDetailList.Auditee}
                                            </Text>
                                        </View>
                                    </View>
                                    {this.state.smData != 2 ? (
                                        <View style={styles.card}>
                                            <View style={styles.boxCard1}>
                                                {this.state.smData != 2 && this.state.smData != 3 ? (
                                                    <Text style={styles.detailTitle}>{strings.Audit_contact_person}</Text>
                                                ) : (
                                                    <Text style={styles.detailTitle}>{'Supplier Contact person'}</Text>
                                                )}
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditeeContactPersonName}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text style={styles.detailTitle}>{strings.Start_date}</Text>
                                        </View>
                                        <View style={styles.boxCard2}>
                                            <Text style={styles.detailContent}>{this.changeDateFormat(this.state.auditDetailList.StartDate)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text style={styles.detailTitle}>{strings.End_date}</Text>
                                        </View>
                                        <View style={styles.boxCard2}>
                                            <Text style={styles.detailContent}>{this.changeDateFormat(this.state.auditDetailList.EndDate)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text style={styles.detailTitle}>{strings.Lead_Auditor}</Text>
                                        </View>
                                        <View style={styles.boxCard2}>
                                            <Text style={styles.detailContent}>{this.state.auditDetailList.LeadAuditor}</Text>
                                        </View>
                                    </View>
                                    {this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData !== 2 && this.state.smData !== 3 ? (
                                        <View style={styles.card1}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{strings.Auditor_name}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.AssociatesName ? this.state.auditDetailList.AssociatesName : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text style={styles.detailTitle}>{strings.Audit_Status}</Text>
                                        </View>
                                        <View style={styles.boxCard2}>
                                            {this.displayStatusNew(this.getCurrentAuditCStatus())}
                                            {/* } */}
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text style={styles.detailTitle}>{strings.Audit_number}</Text>
                                        </View>
                                        <View style={styles.boxCard2}>
                                            <Text numberOfLines={2} style={styles.detailContent}>
                                                {this.state.auditDetailList.AuditNumber}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* edited for supplier management "Starts"*/}
                                    {this.state.smData == 3 ? (
                                        <View style={styles.card1}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{strings.Audit_program}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditProgramName}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {this.state.smData != 2 && this.state.smData != 3 ? (
                                        <View style={styles.card}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{strings.Audit_conducted_by}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditConductedByName
                                                        ? this.state.auditDetailList.AuditConductedByName
                                                        : ' - '}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    {this.state.smData == 3 ? (
                                        <View style={styles.card}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{strings.audittype}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditTypeName ? this.state.auditDetailList.AuditTypeName : ' - '}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData === 3 ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>Audit Schedule Name</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditorName ? this.state.auditDetailList.AuditorName : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {(this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData === 2) || this.state.smData === 3 ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>Plant</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.props?.route?.params?.datapass?.Plant !== '' &&
                                                    this.props?.route?.params?.datapass?.Plant !== undefined
                                                        ? this.props?.route?.params?.datapass?.Plant
                                                        : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {(this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData === 2) || this.state.smData === 3 ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>Part</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.props?.route?.params?.datapass?.Part !== '' &&
                                                    this.props?.route?.params?.datapass?.Part !== undefined
                                                        ? this.props?.route?.params?.datapass?.Part
                                                        : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    {this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData != 2 && this.state.smData != 3 ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>Trainee Auditor</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.AuditorName ? this.state.auditDetailList.AuditorName : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {this.state.auditDetailList.AuditProgramName !== 'LPA' && this.state.smData != 2 && this.state.smData != 3 ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{strings.SeniAuditor}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <Text numberOfLines={2} style={styles.detailContent}>
                                                    {this.state.auditDetailList.SeniorAuditor ? this.state.auditDetailList.SeniorAuditor : 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                    {this.state.smData != 2 &&
                                    this.state.smData != 3 &&
                                    this.state.AuditProp.ReportId != 10 &&
                                    this.state.auditDetailList.AuditProgramName !== 'LPA' ? (
                                        <View style={styles.lastCard}>
                                            <View style={styles.boxCard1}>
                                                <Text style={styles.detailTitle}>{'Audit Agenda'}</Text>
                                            </View>
                                            <View style={styles.boxCard2}>
                                                <TouchableOpacity onPress={once(this.onNavigationTo.bind(this))}>
                                                    <Text style={styles.detailContent1}>{'View Audit Agenda'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginBottom: 40 }} />
                                        </View>
                                    ) : null}
                                </View>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <View style={styles.card}>
                                        <View style={styles.boxCard1}>
                                            <Text
                                                style={{
                                                    fontSize: Fonts.size.h5,
                                                    paddingTop: 10,
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {strings.NoInternet}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}>
                        <ActivityIndicator size={30} color="#123C95" />
                    </View>
                )}

                {this.state.EnableDownload == false && !this.state.isDownloaded ? (
                    <View></View>
                ) : !this.state.isDownloaded ? (
                    <View
                        style={[
                            styles.floatingDownload,
                            {
                                bottom: Platform.OS === 'ios' ? 52 : 30,
                                right: 22,
                            },
                        ]}>
                        <TouchableOpacity
                            disabled={this.state.isDownloading}
                            onPress={() => {
                                this.downloadAuditForm();
                                this.getParamsDetails();
                            }}
                            style={[styles.floatingDownloadBtn, this.state.isDownloading ? styles.floatingBtnDisabled : null]}>
                            <View style={styles.fabCenterContent}>
                                {this.state.isDownloading ? (
                                    <ActivityIndicator size={20} color="#123C95" />
                                ) : (
                                    <Icon name="download-cloud" size={24} color="white" />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={downloadedFooterStyle}>
                        {/* <Image source={Images.Footer}/> */}

                        <View style={styles.footerDiv}>
                            {!this.state.isDownloading ? (
                                <View style={styles.footerDivContent}>
                                    {this.state.checkSync === true ||
                                    currentAuditStatus == constant.StatusSynced ||
                                    currentAuditStatus == constant.StatusCompleted ? (
                                        <View style={{ width: '25%' }}>
                                            <TouchableOpacity
                                                onPress={this.onNavigateTo.bind(this, 4)}
                                                style={{
                                                    alignItems: 'center',
                                                }}>
                                                {/* <ResponsiveImage source={Images.BTN5} initWidth="26" initHeight="25"/> */}
                                                <Icon name="paperclip" size={20} color="#123C95" />
                                                <Text style={styles.footerTextContent}>{strings.Attach}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{ width: '25%' }}>
                                            {this.state.auditDetailList.AuditProgramName !== 'LPA' ? (
                                                <View style={{ width: '100%' }}>
                                                    <TouchableOpacity onPress={this.onNavigateTo.bind(this, 4)} style={{ alignItems: 'center' }}>
                                                        {/* <ResponsiveImage source={Images.BTN5} initWidth="26" initHeight="25"/> */}
                                                        <Icon name="paperclip" size={20} color="#123C95" />
                                                        <Text style={styles.footerTextContent}>{strings.Attach}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null}
                                        </View>
                                    )}

                                    <View
                                        style={
                                            this.state.checkSync === true ||
                                            currentAuditStatus == constant.StatusSynced ||
                                            currentAuditStatus == constant.StatusCompleted
                                                ? { width: '25%' }
                                                : {
                                                      width: this.state.auditDetailList.AuditProgramName !== 'LPA' ? '28%' : '30%',
                                                  }
                                        }>
                                        <TouchableOpacity onPress={this.onNavigateTo.bind(this, 2)} style={{ alignItems: 'center' }}>
                                            {/* <ResponsiveImage source={Images.BTN2} initWidth="26" initHeight="25"/> */}
                                            <Icon name="list" size={20} color="#123C95" />
                                            <Text style={styles.footerTextContent}>{strings.AuditRecords}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '22%' }}>
                                        <TouchableOpacity onPress={this.onNavigateTo.bind(this, 3)} style={{ alignItems: 'center' }}>
                                            {/* <ResponsiveImage source={Images.BTN5} initWidth="26" initHeight="25"/> */}
                                            <Icon name="file" size={20} color="#123C95" />
                                            <Text style={styles.footerTextContent}>{strings.NC_OFI}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* ) : null} */}
                                    {this.state.AuditProp.ReportId == 3 || this.state.AuditProp.ReportId == 7 ? (
                                        <View style={{ width: '25%' }}>
                                            <TouchableOpacity onPress={this.onNavigateTo.bind(this, 6)} style={{ alignItems: 'center' }}>
                                                {/* <ResponsiveImage source={Images.BTN5} initWidth="26" initHeight="25"/> */}
                                                <Icon name="file" size={20} color="#123C95" />
                                                <Text style={styles.footerTextContent}>Conformance</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null}
                                </View>
                            ) : (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size={20} color="#123C95" />
                                </View>
                            )}
                        </View>
                    </View>
                )}
                <Toast
                    ref={toast => {
                        this.toast = toast;
                    }}
                    style={{ backgroundColor: 'black', margin: 20 }}
                    position="top"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
                <CommonAlertModal
                    visible={this.state.dialogVisible}
                    title={'Confirm'}
                    message={strings.Confirm_delete}
                    showCancel
                    confirmText={strings.yes}
                    cancelText={strings.no}
                    onConfirm={this.deleteAuditRecord.bind(this)}
                    onCancel={() => this.setState({ dialogVisible: false })}
                />
                <CommonAlertModal
                    visible={this.state.dialogVisibleRefresh}
                    title={strings.Rrefresh}
                    message={strings.Confirm_refresh}
                    showCancel
                    confirmText={strings.yes}
                    cancelText={strings.no}
                    onConfirm={this.deleteAuditRecord.bind(this)}
                    onCancel={() => this.setState({ dialogVisibleRefresh: false })}
                />
                {/** yyy voice modal */}
                <Modal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({ isVisible: false, startVoice: false }, () => {
                                // this._stopRecognizing()
                            })
                        }>
                        <Icon name="times-circle" style={{ left: 0 }} size={30} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalBody}>
                            <Text
                                style={{
                                    fontSize: Fonts.size.h5,
                                    color: '#00b3d6',
                                    fontFamily: 'OpenSans-Regular',
                                }}>
                                {strings.Voice_Assistant}
                            </Text>
                        </View>
                        <ScrollView style={{ padding: 20 }}>
                            {this.state.partialResults.length > 0 ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="user-circle" size={20} color="#00b3d6" />
                                    </View>
                                    <View style={styles.speechTextBlock}>
                                        {this.state.partialResults.map((result, index) => {
                                            return (
                                                <Text key={`partial-result-${index}`} style={{ fontFamily: 'OpenSans-Regular' }}>
                                                    {result ? result : 'Sorry could not recognize!'}
                                                </Text>
                                            );
                                        })}
                                        {/* <TouchableOpacity onPress={this._destroyRecognizer}>
                <Text style={styles.action}>Clear</Text>
                <Icon name="trash" size={20} color="red"/>
              </TouchableOpacity> */}
                                    </View>
                                </View>
                            ) : null}
                            {this.state.suggestionText != '' ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="user-circle" size={15} color="#00b3d6" />
                                    </View>
                                    <View style={styles.speechTextBlock}>
                                        <Text style={{ fontFamily: 'OpenSans-Regular' }}>{this.state.suggestionText}</Text>
                                    </View>
                                </View>
                            ) : null}
                        </ScrollView>
                        <View style={{ bottom: 20, flexDirection: 'column' }}>
                            <Text
                                style={{
                                    paddingLeft: 10,
                                    fontSize: Fonts.size.small,
                                    color: 'lightgrey',
                                    fontFamily: 'OpenSans-Regular',
                                }}>
                                {strings.Quick_suggestions}
                            </Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={suggestions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this._suggestionPress(item.id);
                                        }}
                                        style={styles.suggestionbox}>
                                        <View>
                                            <Text
                                                style={{
                                                    color: '#000',
                                                    fontFamily: 'OpenSans-Regular',
                                                }}>
                                                {item.id}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        {/* <TouchableOpacity
              style={styles.modalFooter}
              onPress={debounce(this._startRecognizing.bind(this), 1000)}>
              {this.state.startVoice === true ? (
                <Icon
                  name="assistive-listening-systems"
                  size={30}
                  color="#00b678"
                />
              ) : (
                <Icon name="microphone" size={30} color="#00b3d6" />
              )}
            </TouchableOpacity> */}
                    </View>
                </Modal>
                <ProgressDialog
                    titleStyle={{ fontFamily: 'OpenSans-SemiBold' }}
                    messageStyle={{ fontFamily: 'OpenSans-Regular' }}
                    visible={this.state.progressVisible}
                    message={strings.loginpleaseWait}
                />
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
        storeAuditRecords: auditRecords => dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
        storeAudits: audits => dispatch({ type: 'STORE_AUDITS', audits }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        updateRecentAuditList: (recentAudits, screenName) => dispatch({ type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits, screenName }),
        storeSupplierData: smdata => dispatch({ type: 'STORE_SUPPLIER_DATA', smdata }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditPage);
