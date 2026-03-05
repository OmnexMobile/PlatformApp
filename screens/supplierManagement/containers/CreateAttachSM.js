import { TextInput } from 'react-native';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    FlatList,
    Button,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Images } from '../../auditPro/Themes/index';
import styles from '../../auditPro/styles/CreateAttachStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { width } from 'react-native-dimension';
import Modal from 'react-native-modal';
import Moment from 'moment';
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import auth from '../../../services/Auditpro-Auth';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Fonts from '../../auditPro/Themes/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import { strings } from '../../auditPro/language/Language';
import { Dropdown } from 'react-native-element-dropdown';
import { debounce, once } from 'underscore';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import FileViewer from 'react-native-file-viewer';
import NetInfo from '@react-native-community/netinfo';
import { ThemeContext } from 'theme/ThemeProvider';
import GlobalHeader from 'components/GlobalHeader';
import CommonAlertModal from 'components/common_alert_modal';
let Window = Dimensions.get('window');

class CreateAttach extends React.Component {
    static contextType = ThemeContext;
    documentID = null;
    sitelevelID = null;
    _filename = null;
    _extension = null;
    constructor(props) {
        super(props);
        this.state = {
            pageLoad: false,
            attachType: [],
            attachText: '',
            TypeID: '',
            attachedFilePath: '',
            attachedFileExt: '',
            fileData: '',
            fileSize: '',
            ShowTypeDiv: false,
            comments: '',
            dialogVisible: false,
            EditFlag: false,
            Uploadedon: '',
            attachment: '',
            AuditID: '',
            AttachID: '',
            breadCrumbText: '',
            ObjectiveEvidence: '',
            UploadedBy: '',
            UploadedOn: '',
            VersionNo: '',
            isErrorFound: false,
            isUrlInValid: false,
            isControllAttach: false,
            currentUserData: [],
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            saveLoader: false,
            commentFlag: true,
            type: '',
            uncontrolledLink: '',
        };
    }

    componentDidMount() {
        console.log('Create attach mounted', this.props.route?.params.Type);
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
        if (this.props.route?.params.Type === 'Edit') {
            console.log('EDIT', this.props.route?.params.Type);
            console.log('this.props.route?.params.EditDetails', this.props.route?.params.EditDetails.Type);
            this.setState(
                {
                    breadCrumbText: this.props.route?.params.breadCrumb,
                    // breadCrumbText: this.props.route?.params.breadCrumb.length > 30 ? this.props.route?.params.breadCrumb.slice(0, 30) + '...' : this.props.route?.params.breadCrumb,
                    EditFlag: true,
                    AuditID: this.props.route?.params.AuditID,
                    isControllAttach: false,
                    type: this.props.route?.params.Type,
                },
                () => {
                    console.log('EditFlag', this.state.EditFlag);
                    console.log('Details', this.props.route?.params.EditDetails);
                    console.log('isControllAttach', this.state.isControllAttach);
                    this.getFieldValue(this.props.route?.params.EditDetails);
                    this.FormType();
                    // this.getUploadOn()
                },
            );
        } else if (this.props.route?.params.Type === 'Add') {
            this.setState(
                {
                    breadCrumbText: this.props.route?.params.breadCrumb,
                    AuditID: this.props.route?.params.AuditID,
                    type: this.props.route?.params.Type,
                },
                () => {
                    console.log('No params found');
                    console.log('Edit flag', this.state.EditFlag);
                    console.log('isControllAttach', this.state.isControllAttach);
                    this.FormType();
                    this.getUploadOn();
                },
            );
        }
    }

    async getAccessToken() {
        try {
            const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
            const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
            console.log('current userdata--->', value);
            if (value !== null) {
                console.log('current token2--->', value.accessToken);
                this.setState({ currentUserData: value }, () => {
                    console.log('Token set');
                });
            }
            return value;
        } catch (e) {
            console.log('error--->', e);
        }
        return null;
    }

    getUploadOn() {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        console.log('-->', date + '/' + month + '/' + year);
        // let UploadedDate = date +'/'+month+'/'+year
        this.setState({ Uploadedon: month + '/' + date + '/' + year }, () => {
            console.log('UploadedDate', this.state.Uploadedon);
        });
    }

    FormType() {
        var Type = [];
        Type.push(
            {
                value: 'Attachment',
                id: 1,
            },
            {
                value: 'Link',
                id: 2,
            },
        );
        this.setState({ attachType: Type }, () => {});
    }

    getFieldValue(item) {
        console.log('venkat--->', item);
        this.setState(
            {
                ShowTypeDiv: true,
                attachText: item.Type,
                attachment: item.Type == 'Link' ? item.UncontrolledLink : item.FileName,
                Uploadedon: item.Uploadedon,
                comments: item.Comments == '' ? null : item.Comments,
                TypeID: item.Type == 'Link' ? 2 : 1,
                fileData: item.Type == 'Link' ? '' : item.Filedata,
                EditFlag: true,
                AttachID: item.key,
                uncontrolledLink: item.UncontrolledLink,
            },
            () => {
                this.changeDateFormat();
                console.log('AttachID', this.state.AttachID);
                console.log('uncontrolled', this.state.uncontrolledLink);
                console.log('attachment', this.state.attachment);
            },
        );
    }

    changeDateFormat = () => {
        var DefaultFormatL = this.state.selectedFormat + ' ';
        var sDateArr = this.state.Uploadedon.split('T');
        var sDateValArr = sDateArr[0].split('-');
        // var sTimeValArr = sDateArr[1].split(':');
        var outDate = new Date(
            sDateValArr[0],
            sDateValArr[1] - 1,
            sDateValArr[2],
            // sTimeValArr[0],
            // sTimeValArr[1],
        );

        this.setState({ Uploadedon: Moment(outDate).format(DefaultFormatL) }, () => {
            console.log('------>', this.state.Uploadedon);
        });
    };

    dateFormat() {
        var uploadTime = this.state.Uploadedon;
        var DefaultFormatL = this.state.selectedFormat;
        console.log('uploadTime & ', uploadTime);
        console.log(' & DefaultFormatL', DefaultFormatL);
        var splitDate = uploadTime.split('T');
        var splitDate2 = splitDate[0].split('-');
        console.log('==--->', splitDate2[0], splitDate2[1], splitDate2[2]);

        switch (DefaultFormatL) {
            case 'dd/mm/yyyy':
                var newdate = splitDate2[2] + '/' + splitDate2[1] + '/' + splitDate2[0];
                this.setState({ Uploadedon: newdate + ' ' + splitDate[1] }, () => {
                    console.log('Newdate', this.state.Uploadedon);
                });
                break;
            case 'dd-mm-yyyy':
                var newdate = splitDate2[2] + '-' + splitDate2[1] + '-' + splitDate2[0];
                this.setState({ Uploadedon: newdate }, () => {
                    console.log('Newdate', this.state.Uploadedon);
                });
                break;
            case 'mm-dd-yyyy':
                var newdate = splitDate2[1] + '-' + splitDate2[2] + '-' + splitDate2[0];
                this.setState({ Uploadedon: newdate }, () => {
                    console.log('Newdate', this.state.Uploadedon);
                });
                break;
            case 'mm/dd/yyyy':
                var newdate = splitDate2[1] + '/' + splitDate2[2] + '/' + splitDate2[0];
                this.setState({ Uploadedon: newdate }, () => {
                    console.log('Newdate', this.state.Uploadedon);
                });
                break;
            default:
                var newdate = this.state.Uploadedon;
                break;
        }
    }

    isUrlValid = userInput => {
        var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res == null) {
            return false;
        } else {
            return true;
        }
    };

    checkuserstatus() {
        this.setState(
            {
                saveLoader: true,

                commentFlag: true,
            },
            () => {
                // this.checkUser();
            },
        );
    }
    checkUser() {
        console.log('user id', this.props.data.audits.userId);
        var userid = this.props.data.audits.userId;
        var token = this.props.data.audits.token;
        var UserStatus = '';
        var serverUrl = this.props.data.audits.serverUrl;
        var ID = this.props.data.audits.userId;
        var type = 3;
        var path = '';
        console.log(userid, token);

        auth.getCheckUser(userid, token, (res, data) => {
            console.log('User information', data);
            if (data.data.Message == 'Success') {
                console.log('Checking User status', data.data.Data.ActiveStatus);
                UserStatus = data.data.Data.ActiveStatus;
                if (UserStatus == 2) {
                    console.log('User active');
                    this.onSave();
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
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                } else if (UserStatus == 0) {
                    this.refs.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT);
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                }
            }
        });
    }
    cameraAction(type) {
        this.setState(
            {
                AttachModal: false,
                fileData: '',
                attachment: '',
                attachedFilePath: '',
                attachedFileExt: '',
            },
            () => {
                if (type == 'Camera') {
                    this.props.navigation.navigate(ROUTES.CAMERA_CAPTURE);
                } else if (type == 'Video') {
                    this.props.navigation.navigate('VideoCapture');
                }
            },
        );
    }
    deleteUserFile(path) {
        console.log('RNFS.DocumentDirectoryPath', path);
        var serURL = this.props.data.audits.serverUrl;
        RNFS.exists(path)
            .then(result => {
                console.log('path result', result);
                if (result) {
                    RNFetchBlob.fs
                        .unlink(path)
                        .then(() => {
                            console.log('deleted success');
                            setTimeout(() => {
                                RNFS.exists(path).then(res => {
                                    console.log('path', res);
                                    this.setState(
                                        {
                                            dialogVisible: false,
                                        },
                                        () => {
                                            this.props.clearAudits();
                                            setTimeout(() => {
                                                this.props.storeServerUrl(serURL);
                                                console.log('FILE DELETED!');
                                                this.props.navigation.navigate(ROUTES.LAUNCH_SCREEN);
                                                console.log('Check server url', this.props.data);
                                            }, 600);
                                        },
                                    );
                                }, 1500);
                            });
                        })
                        .catch(err => {
                            console.log('err', err);
                        });
                } else {
                    console.log('Patha not found');
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    onSave() {
        this.setState({ saveLoader: true, commentFlag: true }, () => {
            console.log('save clicked');

            var isValid = true;
            var isUrlInValid = true;
            if (this.state.TypeID == '') {
                isValid = false;
            }
            if (this.state.attachment == '') {
                isValid = false;
            }
            if (this.state.uncontrolledLink == '') {
                isUrlInValid = false;
            }
            if (this.state.comments == '') {
                isValid = false;
                this.setState({
                    commentFlag: false,
                });
                // this.commentFlag = false
            }
            if (this.state.TypeID == 2 && !this.isUrlValid(this.state.attachment)) {
                isValid = false;
                isUrlInValid = true;
            }

            if (!isValid) {
                this.setState({
                    isErrorFound: true,
                    isUrlInValid: isUrlInValid,
                    saveLoader: false,
                });
            } else {
                this.setState(
                    {
                        isErrorFound: false,
                    },
                    async () => {
                        var userDetails = await this.getAccessToken();
                        var auditRecords = this.props.data.audits.auditRecords;
                        var Token = userDetails?.accessToken || this.state.currentUserData?.accessToken || this.props.data.audits.token;
                        var SiteId = userDetails?.siteId || this.state.currentUserData?.siteId || this.props.data.audits.siteId;
                        var UserId = userDetails?.userId || this.state.currentUserData?.userId || this.props.data.audits.userId;
                        var RequestParam = [];

                        var auditRecords = this.props.data.audits.auditRecords;
                        var AUDITPROG_ID = await AsyncStorage.getItem('AUDITPROG_ID');
                        var AUDITYPE_ORDER = await AsyncStorage.getItem('AUDITYPE_ORDER');
                        var AUDITYPE_ID = await AsyncStorage.getItem('AUDITYPE_ID');
                        var AUDITPROGORDER = await AsyncStorage.getItem('AUDITPROGORDER');
                        console.log('checkconnectionnnncreateAttach', AUDITPROG_ID, AUDITYPE_ORDER, AUDITYPE_ID, AUDITPROGORDER);

                        for (var i = 0; i < auditRecords.length; i++) {
                            if (this.state.AuditID === auditRecords[i].AuditId) {
                                console.log('hello', auditRecords[i].AuditId, this.state.AuditID);
                                if (auditRecords?.[i]?.AuditProgramId == undefined) {
                                    console.log('checking the programid----iffffffcreateattach');
                                    RequestParam.push({
                                        AuditId: auditRecords?.[i]?.AuditId,
                                        AuditProgramId: AUDITPROG_ID,
                                        AuditProgramOrder:
                                            auditRecords?.[i]?.AuditProgOrder == undefined ? AUDITPROGORDER : auditRecords?.[i]?.AuditProgOrder,
                                        AuditTypeOrder: auditRecords?.[i]?.AuditTypeOrder,
                                        AuditTypeId: auditRecords?.[i]?.AuditTypeId,
                                        AuditOrder: auditRecords?.[i]?.AuditTypeOrder,
                                    });
                                } else {
                                    console.log('checking the programid----eelseeeeecreateattach');
                                    RequestParam.push({
                                        AuditId: auditRecords?.[i]?.AuditId,
                                        AuditProgramId: auditRecords?.[i]?.AuditProgramId,
                                        AuditProgramOrder:
                                            auditRecords?.[i]?.AuditProgOrder == undefined ? AUDITPROGORDER : auditRecords?.[i]?.AuditProgOrder,
                                        AuditTypeOrder: auditRecords?.[i]?.AuditTypeOrder,
                                        AuditTypeId: auditRecords?.[i]?.AuditTypeId,
                                        AuditOrder: auditRecords?.[i]?.AuditOrderId,
                                    });
                                }
                            }
                        }
                        console.log('RequestParam-->createattach', RequestParam);

                        var Request =
                            RequestParam[0].AuditId +
                            '_' +
                            RequestParam[0].AuditProgramId +
                            '_' +
                            RequestParam[0].AuditProgramOrder +
                            '_' +
                            RequestParam[0].AuditTypeId +
                            '_' +
                            RequestParam[0].AuditOrder;
                        console.log('checkkkkkkk212121createattach', Request);
                        var param = [];
                        if (this.state.TypeID == 1) {
                            param.push({
                                ObjectiveEvidence: this.state.attachText === 'Attachment' ? this.state.attachment.toLowerCase() : null,
                                Request: Request,
                                RefPath: this.state.attachText === 'Link' ? this.state.attachment.toLowerCase() : null,
                                SiteId: SiteId,
                                Comments: this.state.comments,
                                UploadedBy: UserId,
                                UploadedOn: this.state.Uploadedon,
                                VersionNo: 6,
                                AttachmentType: this.state.attachText === 'Attachment' ? 'Controlled' : this.state.attachText,
                                File:
                                    this.state.attachText === 'Attachment'
                                        ? this.state.fileData == undefined
                                            ? ''
                                            : this.state.fileData
                                        : this.state.fileData,
                                Filename:
                                    this.state.attachText === 'Attachment'
                                        ? this.state.attachment.toLowerCase()
                                        : this.state.attachment.toLowerCase(),
                                Id: this.state.AttachID,
                            });
                            console.log('Parammmmmmm-->', param);
                        } else {
                            param.push({
                                ObjectiveEvidence: this.state.attachText === 'Attachment' ? this.state.attachment.toLowerCase() : null,
                                Request: Request,
                                RefPath: this.state.attachText === 'Link' ? this.state.attachment.toLowerCase() : null,
                                SiteId: SiteId,
                                Comments: this.state.comments,
                                UploadedBy: UserId,
                                UploadedOn: this.state.Uploadedon,
                                uncontrolledLink: this.state.uncontrolledLink,
                                VersionNo: 6,
                                AttachmentType: this.state.attachText === 'Attachment' ? 'Controlled' : this.state.attachText,
                                //   File: this.state.attachText === 'Controlled' ? (this.state.fileData == undefined) ? '' : this.state.fileData  : null,
                                //   Filename : this.state.attachText === 'Controlled' ? this.state.attachment.toLowerCase() : null,
                                Id: this.state.AttachID,
                            });
                            console.log('Paramnnnnnn-->', param);
                        }

                        auth.getSaveStatusHistory(param, Token, (res, data) => {
                            console.log('Data ========>>', data, param);
                            if (data.data.Message == 'Success') {
                                console.log('===>', data.data);
                                this.documentID = data.data.Data[0].DocProParameter;
                                this.sitelevelID = data.data.Data[0].SiteLevelId;

                                if (this.state.TypeID == 1) {
                                    if (this.documentID && this.sitelevelID && this.state.type == 'Add') {
                                        this.formDocProObject();
                                        console.log('*****');
                                    } else {
                                        this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                                            AuditID: this.state.AuditID,
                                            isDeleted: 2,
                                            breadCrumb: this.state.breadCrumbText,
                                        });
                                    }
                                } else {
                                    this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                                        AuditID: this.state.AuditID,
                                        isDeleted: 2,
                                        breadCrumb: this.state.breadCrumbText,
                                    });
                                }
                            } else {
                                this.setState({ saveLoader: false }, () => {
                                    console.log('==error=>');
                                    this.refs.toast.show(strings.ErrUploading, DURATION.LENGTH_LONG);
                                });
                            }
                        });
                    },
                );
            }
        });
    }

    async formDocProObject() {
        console.log('forming doc pro request ...');

        // Dynamic fields
        const userDetails = await this.getAccessToken();
        var AuditID = this.state.AuditID;
        var token = userDetails?.accessToken || this.state.currentUserData?.accessToken || this.props.data.audits.token;
        var fext = this._extension;

        console.log('fext fext', fext);
        // var getExt = fext.split('/');

        // var ext = getExt[1]
        var regexExt = /(?:\.([^.]+))?$/;
        // var ext = fext;
        var siteId = userDetails?.siteId || this.state.currentUserData?.siteId || this.props.data.audits.siteId;
        var UserId = userDetails?.userId || this.state.currentUserData?.userId || this.props.data.audits.userId;
        var auditRecords = this.props.data.audits.auditRecords;
        // var dname = this._filename;
        var dname = this.state.attachment;
        // var filename = this._filename;
        var filename = this.state.attachment;
        var obj = this.documentID;
        var siteid = 'sit' + siteId;
        var sitelevelid = this.sitelevelID;
        var effectivedate = this.state.Uploadedon;
        var revdate = this.state.Uploadedon;
        var deviceId = await DeviceInfo.getUniqueId();
        // var filecontent =
        //   this.state.attachText === 'Controlled'
        //     ? this.state.fileData == undefined
        //       ? ''
        //       : this.state.fileData
        //     : null;
        var filecontent = this.state.fileData;
        // var ext = ext;
        // var ext = this.state.attachedFileExt;
        var ext = regexExt.exec(this.state.attachment)[1];
        console.log(ext, 'fileextensioncheck');
        for (var i = 0; i < auditRecords.length; i++) {
            if (AuditID == auditRecords[i].AuditId) {
                var dnum = auditRecords[i].AuditNumber;
            }
        }

        // Static fields
        var langid = 1;
        var userdtfmt = 'MM/DD/YYYY';
        var UserDtFmtDlm = '/';
        // var filepath = '';
        var filepath = this.state.attachedFilePath;
        var fromdocpro = 0;
        var frommod = 'mod2';
        var doctypeid = 0;
        var mod = 'mod2';
        var link = '';
        var keyword = 'AuditPro';
        var reason = '';
        var rev = 1;
        var paginate = '';
        var chgs_reqd = '';
        var spublic = 0;
        var ModEmailConFig = 0;
        // Request object
        var formRequestObj = [
            {
                dnum: dnum,
                dname: dname,
                filename: filename,
                ext: ext,
                filepath: filepath,
                obj: obj,
                fromdocpro: fromdocpro,
                frommod: frommod,
                doctypeid: doctypeid,
                siteid: siteid,
                mod: mod,
                sitelevelid: sitelevelid,
                link: link,
                keyword: keyword,
                reason: reason,
                rev: rev,
                effectivedate: effectivedate,
                revdate: revdate,
                paginate: paginate,
                chgs_reqd: chgs_reqd,
                spublic: spublic,
                ModEmailConFig: ModEmailConFig,
                deviceId: deviceId,
                filecontent: filecontent,
                lstUserPrefModel: [
                    {
                        siteid: siteId,
                        UserId: UserId,
                        langid: langid,
                        userdtfmt: userdtfmt,
                        UserDtFmtDlm: UserDtFmtDlm,
                    },
                ],
            },
        ];
        console.log('Request array formed', formRequestObj);

        auth.getdocProAttachment(formRequestObj, token, (res, data) => {
            console.log('uploading data', data);
            if (data.data.Success == true) {
                this.setState(
                    {
                        saveLoader: false,
                    },
                    () => {
                        // this.refs.toast.show(strings.AttachUpload, DURATION.LENGTH_LONG)
                        this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                            AuditID: this.state.AuditID,
                            isDeleted: 2,
                            breadCrumb: this.state.breadCrumbText,
                        });
                    },
                );
            } else {
                this.setState({ saveLoader: false }, () => {
                    this.refs.toast.show(strings.ErrUploading, DURATION.LENGTH_LONG);
                });
            }
        });
    }

    async resetForm() {
        this.setState({ dialogVisible: false }, () => {
            console.log('dialog offf');
        });
        var userDetails = await this.getAccessToken();
        var Token = userDetails?.accessToken || this.state.currentUserData?.accessToken || this.props.data.audits.token;
        auth.deleteAttach(this.state.AttachID, Token, (res, data) => {
            console.log('data', data);
            if (data.data) {
                if (data.data.Message == 'Success') {
                    this.props.navigation.navigate(ROUTES.AUDIT_ATTACHSM, {
                        AuditID: this.state.AuditID,
                        isDeleted: 1,
                        breadCrumb: this.state.breadCrumbText,
                    });
                } else {
                    this.refs.toast.show(strings.DelError, DURATION.LENGTH_LONG);
                }
            } else {
                this.refs.toast.show(strings.DelError, DURATION.LENGTH_LONG);
            }
        });
    }
    handleDocumentSelection = async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
            });
            if (response) {
                console.log(response, 'hello');
                if (response.size > 52428800) {
                    alert(strings.alert);
                } else if (response.size < 1910485760456) {
                    console.log('helloenter');
                    // RNFetchBlob.fs.readFile(Platform.OS === 'ios' ? decodeURIComponent(response.uri) : response.uri, 'base64').then(
                    //   data => {
                    //     response.data = data;
                    //     this.setState(
                    //       {
                    //         fileData:  response.data,
                    //         attachment: response.name.replace(/ /g,'_'),
                    //         attachedFilePath: response.uri,
                    //         attachedFileExt: response.name,
                    //     })
                    //   })

                    var data = await RNFS.readFile(Platform.OS === 'ios' ? decodeURIComponent(response.uri) : response.uri, 'base64').then(res => {
                        this.setState({
                            fileData: res,
                            attachment: response.name.replace(/ /g, '_'),
                            attachedFilePath: response.uri,
                            attachedFileExt: response.name,
                        });
                    });
                    console.log(this.state.fileData, 'helloyes');
                    //console.log(fileData,"filedata")
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    render() {
        const attach = this.state.attachType;
        console.log('TYpe', this.state.attachType);
        const { theme } = this.context || {};
        const textColor = theme && theme.mode && theme.mode.textColor ? theme.mode.textColor : '#000';
        const dropdownBackgroundColor = theme && theme.mode && theme.mode.backgroundColor ? theme.mode.backgroundColor : '#fff';
        const dropdownBorderColor = theme && theme.mode && theme.mode.borderColor ? theme.mode.borderColor : '#A6A6A6';
        const themedTextStyle = { color: textColor };
        const dropdownBorderStyle = { borderColor: dropdownBorderColor };
        const dropdownContainerBackground = { backgroundColor: dropdownBackgroundColor };

        return (
            <KeyboardAvoidingView style={styles.wrapper}>
                <GlobalHeader
                    title={this.state.EditFlag === false ? strings.HeadingTitle : strings.EditAttach}
                    subtitle={this.state.breadCrumbText}
                    onLeftPress={() =>
                        this.props.navigation.navigate({
                            name: ROUTES.AUDIT_ATTACHSM,
                            params: {
                                AuditID: this.state.AuditID,
                                isDeleted: 0,
                                breadCrumb: this.state.breadCrumbText,
                            },
                            merge: true,
                        })
                    }
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={styles.globalHeaderContainer}
                    // titleStyle={{color: '#fff'}}
                    // subtitleStyle={{color: '#fff', fontSize: 15}}
                    // leftIconColor="#fff"
                    // rightIconColor="#fff"
                />
                {/** ---------------------- */}
                <View style={styles.auditPageBody}>
                    {this.state.EditFlag === true ? (
                        <View style={styles.manFields}>
                            <View style={styles.attachTypeSection}>
                                <View style={styles.requiredLabelRow}>
                                    <Text style={styles.requiredLabelText}>{'Attachment Type'}</Text>
                                    <Text style={styles.requiredAsteriskText}>{'*'}</Text>
                                </View>

                                <View style={styles.marginTop5}>
                                    <Text style={styles.attachTypeValueText}>{this.state.attachText === 'Link' ? 'Link' : 'Attachment'}</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.manFields}>
                            <View style={styles.attachTypeSection}>
                                <Dropdown
                                    style={[styles.dropdownInput, dropdownBorderStyle]}
                                    placeholderStyle={styles.dropdownPlaceholderStyle}
                                    placeholder={
                                        <Text>
                                            <Text>{strings.Select_item}</Text>
                                            <Text style={styles.requiredAsteriskColor}> *</Text>
                                        </Text>
                                    }
                                    selectedTextStyle={styles.dropdownSelectedTextStyle}
                                    containerStyle={dropdownContainerBackground}
                                    data={attach}
                                    label={strings.DropType}
                                    value={this.state.attachText}
                                    fontSize={Fonts.size.regular}
                                    labelFontSize={Fonts.size.small}
                                    baseColor={'#A6A6A6'}
                                    selectedItemColor={textColor}
                                    textColor={textColor}
                                    itemColor={textColor}
                                    labelField="value"
                                    valueField="value"
                                    itemPadding={5}
                                    dropdownOffset={{ top: 10, left: 0 }}
                                    itemTextStyle={[styles.dropdownItemTextStyle, themedTextStyle]}
                                    onChange={text => {
                                        console.log('text1', text);
                                        this.setState({
                                            attachText: text.value,
                                            TypeID: text.id,
                                            ShowTypeDiv: true,
                                            comments: '',
                                            attachment: '',
                                        });
                                    }}
                                />
                                {this.state.isErrorFound && this.state.TypeID == '' ? (
                                    <Text style={styles.typeMissingText}>{strings.TypeMissing} </Text>
                                ) : null}
                            </View>
                        </View>
                    )}

                    {this.state.ShowTypeDiv === true ? (
                        <View style={styles.manFields}>
                            {this.state.TypeID === 1 ? (
                                <TouchableOpacity
                                    style={styles.div01}
                                    onPress={
                                        this.state.isControllAttach === true
                                            ? () => {
                                                  this.refs.toast.show(strings.NavErr, DURATION.LENGTH_SHORT);
                                              }
                                            : () => {
                                                  // iPhone/Android
                                                  this.handleDocumentSelection();
                                              }
                                    }>
                                    {this.state.isControllAttach === true ? (
                                        <View style={styles.attachmentFieldContainer}>
                                            <Text style={[styles.attachmentFieldLabel, themedTextStyle]}>{strings.Attach_EvidenceL}</Text>
                                            <Text style={[styles.attachmentFieldValue, themedTextStyle]} numberOfLines={1}>
                                                {this.state.attachment}
                                            </Text>
                                            {this.state.isErrorFound && this.state.attachment == '' ? (
                                                <Text style={styles.attachmentMissingText}>{strings.AttachMissing} </Text>
                                            ) : null}
                                        </View>
                                    ) : (
                                        <View style={styles.attachmentFieldContainer}>
                                            <View style={styles.requiredLabelRow}>
                                                <Text style={styles.requiredLabelText}>{strings.Attach_EvidenceL}</Text>
                                                <Text style={styles.requiredAsteriskNoMargin}>{'*'}</Text>
                                            </View>

                                            {this.state.attachText === 'Link' ? (
                                                <TextInput style={[styles.attachmentTextValueInput, themedTextStyle]} numberOfLines={1}>
                                                    {this.state.uncontrolledLink}
                                                </TextInput>
                                            ) : (
                                                <Text style={[styles.attachmentTextValueInput, themedTextStyle]} numberOfLines={1}>
                                                    {this.state.attachment}
                                                </Text>
                                            )}
                                            {this.state.isErrorFound && this.state.attachment == '' ? (
                                                <Text style={styles.attachmentMissingBottomText}>{strings.AttachMissing} </Text>
                                            ) : null}
                                        </View>
                                    )}

                                    <View style={styles.check}>
                                        {this.state.attachText == 'Link' ? null : (
                                            <Icon style={styles.editIconSmallOffset} name="paperclip" size={20} color="#123C95" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.manFields}>
                                    <View style={styles.linkInputSection}>
                                        <View>
                                            <TextInput
                                                style={[styles.linkTextInput, themedTextStyle]}
                                                value={this.state.attachment}
                                                //placeholder={strings.UncontrolledLink}
                                                //fontSize={Fonts.size.h6}
                                                onChangeText={text =>
                                                    this.setState({ attachment: text }, () => {
                                                        console.log('printing', this.state.attachment);
                                                    })
                                                }
                                                onBlur={() => {
                                                    console.log('this.state.AppreciableComments', this.state.attachment);
                                                }}
                                            />
                                            {this.state.isErrorFound && (this.state.attachment == '' || this.state.isUrlInValid) ? (
                                                <Text
                                                    style={[styles.urlMissingText, Platform.OS === 'android' ? styles.urlMissingTextAndroid : null]}>
                                                    {strings.UrlMissing}{' '}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <View style={styles.check}>
                                        <Text style={styles.requiredAsteriskNoMargin}>{'*'}</Text>
                                        <Icon style={styles.editIconSmallOffset} name="edit" size={20} color="#123C95" />
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View></View>
                    )}

                    {this.state.isControllAttach === true ? (
                        <View style={styles.manFields}>
                            <View style={styles.commentSectionContainer}>
                                {this.state.comments != '' || this.state.comments == '' ? (
                                    <View style={styles.boxCard}>
                                        <Text style={styles.detailTitle}>{strings.AttachComments}</Text>
                                        <View style={styles.check1}>
                                            <Icon style={styles.editIconComments} name="edit" size={20} color="#123C95" />
                                        </View>
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                                <View style={styles.boxCard}>
                                    <TextInput
                                        style={[styles.commentInputText, themedTextStyle]}
                                        value={this.state.comments === null || this.state.comments == 'null' ? '' : this.state.comments}
                                        //placeholder={strings.AttachComments}
                                        fontSize={Fonts.size.regular}
                                        onChangeText={text => this.setState({ comments: text })}
                                        returnKeyType="default"

                                        // editable={false}
                                        // style={{color:'lightgrey'}}
                                    />
                                    <View style={styles.check}></View>
                                </View>
                                {this.state.commentFlag == false && this.state.comments === '' ? (
                                    <Text style={styles.commentErrorControlled}>{strings.commentMessage}</Text>
                                ) : null}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.manFields}>
                            <View style={styles.commentSectionContainer}>
                                {this.state.comments != '' || this.state.comments == '' ? (
                                    <View style={styles.boxCard}>
                                        <View style={styles.requiredLabelRow}>
                                            <Text style={styles.requiredLabelText}>{strings.AttachComments}</Text>
                                            <Text style={styles.requiredAsteriskText}>{'*'}</Text>
                                        </View>

                                        <View style={styles.check1}>
                                            <Icon style={styles.editIconCommentsAlt} name="edit" size={20} color="#123C95" />
                                        </View>
                                    </View>
                                ) : null}
                                <TextInput
                                    style={[
                                        styles.commentInputTextEditable,
                                        themedTextStyle,
                                        Platform.OS === 'ios' ? styles.commentInputTextEditableIOS : null,
                                    ]}
                                    value={this.state.comments === null || this.state.comments == 'null' ? '' : this.state.comments}
                                    //placeholder={strings.AttachComments}
                                    fontSize={Fonts.size.regular}
                                    // onBlur={() => Keyboard.dismiss()}
                                    onChangeText={text =>
                                        this.setState({ comments: text }, () => {
                                            console.log('printing');
                                        })
                                    }
                                    onBlur={() => {
                                        console.log('this.state.comments', this.state.comments);
                                    }}
                                    returnKeyType="default"
                                />

                                {this.state.commentFlag == false && this.state.comments == '' ? (
                                    <Text style={[styles.commentErrorText, Platform.OS === 'android' ? styles.commentErrorTextAndroid : null]}>
                                        {strings.commentMessage}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    )}

                    {this.state.Uploadedon != '' && this.props.route?.params.Type == 'Edit' ? (
                        <View style={styles.manFields}>
                            <View style={styles.uploadedOnContainer}>
                                <View style={[styles.boxCard1]}>
                                    <Text style={styles.detailTitle}>{strings.UploadedOn}</Text>
                                    <TextInput
                                        style={[styles.uploadedOnInput, themedTextStyle]}
                                        value={this.state.Uploadedon}
                                        placeholder={strings.UploadedOn}
                                        fontSize={Fonts.size.regular}
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={styles.check}>
                                <Icon style={styles.calendarIconOffset} name="calendar" size={20} color="#123C95" />
                            </View>
                        </View>
                    ) : null}

                    <View></View>
                </View>

                {/** Floating Delete FAB (Edit mode only) */}
                {this.props.route?.params?.Type == 'Edit' ? (
                    <TouchableOpacity
                        style={[
                            styles.floatingSaveButton,
                            styles.deleteFloatingButton,
                            Platform.OS === 'ios' ? styles.floatingButtonIOSOffset : styles.floatingButtonAndroidOffset,
                        ]}
                        onPress={() => this.setState({ dialogVisible: true })}>
                        <Icon name="trash" size={24} color="white" />
                    </TouchableOpacity>
                ) : null}

                {/** Floating Save FAB */}
                <TouchableOpacity
                    style={[styles.floatingSaveButton, Platform.OS === 'ios' ? styles.floatingButtonIOSOffset : styles.floatingButtonAndroidOffset]}
                    disabled={this.state.saveLoader}
                    onPress={debounce(this.onSave.bind(this), 1000)}>
                    {this.state.saveLoader ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="save" size={25} color="#123C95" />}
                </TouchableOpacity>

                <CommonAlertModal
                    visible={this.state.dialogVisible}
                    title={strings.DeleteAtt}
                    showCancel
                    confirmText={strings.yes}
                    cancelText={strings.no}
                    onConfirm={this.resetForm.bind(this)}
                    onCancel={() => this.setState({ dialogVisible: false })}
                />
                <Toast
                    ref="toast"
                    style={styles.toastContainer}
                    position="top"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={styles.toastText}
                />
            </KeyboardAvoidingView>
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
        changeAuditState: isAuditing => dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
        clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAttach);
