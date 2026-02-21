import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    FlatList,
    ImageBackground,
    Button,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Images } from '../Themes/index';
import styles from '../styles/CreateAttachStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { width } from 'react-native-dimension';
import Moment from 'moment';
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import auth from '../../../services/Auditpro-Auth';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import { strings } from '../language/Language';
import { debounce, once } from 'underscore';
import { toast } from 'helpers/utils';
import { TOAST_STATUS } from 'constants/app-constant';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import FileViewer from 'react-native-file-viewer';
import NetInfo from '@react-native-community/netinfo';
import GlobalHeader from 'components/GlobalHeader';
import DropdownComponent from 'components/dropdown';
import InputComponent from 'components/input-component';
import AttachmentSelectionModal from 'components/attachment-selection-modal';

let Window = Dimensions.get('window');

class CreateAttach extends React.Component {
    documentID = null;
    sitelevelID = null;
    _filename = null;
    _extension = null;
    constructor(props) {
        super(props);
        console.log('get this.props--->', props);
        this.state = {
            mode: '',
            pageLoad: false,
            attachType: [],
            attachText: '',
            TypeID: '',
            attachedFilePath: '',
            attachedFileExt: '',
            fileName: '',
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
            AttachModal: false,
            ObjectiveEvidence: '',
            UploadedBy: '',
            UploadedOn: '',
            VersionNo: '',
            isErrorFound: false,
            isUrlInValid: false,
            isControllAttach: false,
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            saveLoader: false,
            commentFlag: true,
            type: '',
            fileloaded: true,
            currentUserData: [],
        };
    }

    async getAccessToken() {
        try {
            const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
            const value = JSON.parse(stringifiedUserDetails);
            console.log('current userdata--->', value);
            if (value !== null) {
                // value previously stored
                console.log('current token2--->', value.accessToken);
                this.setState({ currentUserData: value }, () => {
                    console.log('Token set');
                });
            }
        } catch (e) {
            // error reading value
            console.log('error--->', e);
        }
    }

    async componentDidMount() {
        await this.getAccessToken();
        console.log('Get formtype---->', this.state.currentUserData?.accessToken);
        // update this.props.navigation.state.params --> this.props?.route?.params
        console.log('Create attach mounted', this.props?.route?.params?.Type);
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
        if (this.props?.route?.params?.Type === 'Edit') {
            console.log('EDIT', this.props?.route?.params?.Type);
            console.log('this.props?.route?.params.EditDetails', this.props?.route?.params?.EditDetails?.Type);
            this.setState(
                {
                    breadCrumbText: this.props?.route?.params?.breadCrumb,
                    // breadCrumbText: this.props?.route?.params.breadCrumb.length > 30 ? this.props?.route?.params.breadCrumb.slice(0, 30) + '...' : this.props?.route?.params.breadCrumb,
                    EditFlag: true,
                    AuditID: this.props?.route?.params?.AuditID,
                    // isControllAttach: this.props?.route?.params.EditDetails.Type == 'Controlled' ? true : false,\
                    isControllAttach: false,
                    type: this.props?.route?.params?.Type,
                    attachText: this.props?.route?.params?.Type,
                    fileName: this.props?.route?.params?.FileName,
                    attachment: this.props?.route?.params?.FileName,
                    fileData: '',
                    attachedFileExt: '',
                },
                () => {
                    console.log('EditFlag', this.state.EditFlag);
                    console.log('Details', this.props?.route?.params?.EditDetails);
                    console.log('isControllAttach', this.state.isControllAttach);
                    this.FormType();
                    this.getFieldValue(this.props?.route?.params?.EditDetails);
                    // this.getUploadOn()
                },
            );
        } else if (this.props?.route?.params?.Type === 'Add') {
            this.setState(
                {
                    breadCrumbText: this.props?.route?.params?.breadCrumb,
                    AuditID: this.props?.route?.params?.AuditID,
                    type: this.props?.route?.params?.Type,
                    fileloaded: true,
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

    componentDidUpdate(prevProps) {
        const cancelled = this.props?.route?.params?.cancelpressed || 'empty';
        const currentPage = this.props?.route?.name;
        const previousCapture = prevProps?.data?.audits?.cameraCapture;
        const currentCapture = this.props?.data?.audits?.cameraCapture;

        // React to camera captures only when new data arrives
        if (currentPage === 'CREATE_ATTACH' && currentCapture !== previousCapture) {
            if (currentCapture) {
                if (cancelled == 1) {
                    this.setState({
                        fileData: undefined,
                        attachment: undefined,
                        attachedFilePath: undefined,
                        attachedFileExt: undefined,
                    });
                    console.log('exception1 cancel', currentCapture);
                }

                if (cancelled == 0 && currentCapture.length == 0) {
                    console.log('inside save set state part..');
                    let FileArrayTemp = this.state.fileArrayList;
                    let FileArrayTempOne = [
                        {
                            id: Moment().unix(),
                            fileName: video_name,
                            fileData: uri_details,
                            fileSize: video_type,
                            filetype: 'video/mp4',
                        },
                    ];
                    console.log(FileArrayTemp, 'filearraytemp - will rcv pop');
                    let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
                    this.setState(
                        {
                            fileArrayList: fileMergeResult,
                        },
                        () => {
                            console.log('fileName', this.state.fileName);
                        },
                    );
                }

                console.log('file name' + this.state.fileName);
                if (currentCapture.length > 0 && cancelled != 1) {
                    var res = currentCapture;
                    console.log('exception3', currentCapture);
                    RNFS.readFile(Platform.OS === 'ios' ? decodeURIComponent(res[0].uri) : res[0].uri, 'base64').then(resp => {
                        this.setState(
                            {
                                mode: 'camera',
                                fileName: res[0].name,
                                attachedFilePath: res[0].uri,
                                fileData: resp,
                                attachment: res[0].name,
                                attachedFileExt: res[0],
                                AttachModal: false,
                            },
                            () => {
                                console.log('mode ::', this.state.mode);
                            },
                        );
                    });
                } else {
                    console.log('no pic found');
                    console.log('inside file path' + this.state.fileData);
                    console.log('exception14', currentCapture);
                }
            } else {
                console.log('no pic found');
            }
        }
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
        const Type = [
            {
                label: 'Attachment',
                value: 'Attachment',
                id: 1,
            },
            {
                label: 'Link',
                value: 'Link',
                id: 2,
            },
        ];
        this.setState({ attachType: Type });
    }

    getFieldValue(item) {
        console.log('venkat--->', item);
        this.setState(
            {
                ShowTypeDiv: true,
                attachText: item.Type,
                fileName: item.FileName,
                attachment: item.UncontrolledLink,
                Uploadedon: item.Uploadedon,
                comments: item.Comments == '' ? null : item.Comments,
                TypeID: item.Type == 'UnControlled' ? 2 : 1,
                fileData: item.Type == 'UnControlled' ? '' : item.Filedata,
                EditFlag: true,
                AttachID: item.key,
            },
            () => {
                this.changeDateFormat();
                let filepath = this.getNewFilePath(this.state.fileName, this.state.attachment);
                if (this.state.attachText === 'Attachment' && this.state.attachment != '') {
                    this.setState(
                        {
                            fileloaded: false,
                            attachedFilePath: filepath,
                        },
                        () => {
                            this.initiateDownload(this.state.attachment);
                        },
                    );
                }
                console.log('AttachID', this.state.AttachID);
            },
        );
    }

    changeDateFormat = () => {
        var DefaultFormatL = this.state.selectedFormat + ' ' + 'HH:mm';
        var sDateArr = this.state.Uploadedon.split('T');
        var sDateValArr = sDateArr[0].split('-');
        var sTimeValArr = sDateArr[1].split(':');
        var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1]);

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

    initiateDownload(Docid) {
        if (Docid === 0 || Docid.trim() === '0' || Docid === null || Docid === undefined) {
            this.setState(
                {
                    fileloaded: true,
                },
                () => {
                    this.deleteAttachments();
                    this.toast.show('File is not synced with server yet, please try after sometime.', DURATION.LENGTH_LONG);
                },
            );
            return false;
        }
        var Token = this.props.data.audits.token;
        auth.downloadFile(Docid, Token, (res, data) => {
            console.log('getFiles File download response', data);
            if (data.data.Message == 'Success') {
                this.WriteAttachments(data.data.Data.FileData, this.state.attachedFilePath);
            } else {
                console.log('');
                this.toast.show(strings.server_error, DURATION.LENGTH_LONG);
                this.setState({ fileloaded: true });
            }
        });
    }

    async WriteAttachments(fileContent, FileUri) {
        if (fileContent == null) {
            this.toast.show(strings.server_error, DURATION.LENGTH_LONG);
            this.setState({ fileloaded: true });
        }
        await RNFetchBlob.fs.exists(FileUri).then(exist => {
            if (!exist || exist == '') {
                RNFetchBlob.fs
                    .writeFile(FileUri, fileContent, 'base64')
                    .then(res => {
                        console.log('Attachment:File Written', res);
                        this.setState({ fileloaded: true, attachment: this.state.fileName });
                    })
                    .catch(err => {
                        console.log('Attachment:Err:' + err);
                        this.toast.show(strings.server_error, DURATION.LENGTH_LONG);
                        this.setState({ fileloaded: true, attachment: this.state.fileName });
                    });
            } else {
                console.log('Attachment:File already exist');
                RNFetchBlob.fs.readFile(FileUri, 'base64').then(res => {
                    this.setState({
                        fileloaded: true,
                        fileData: res,
                        attachment: this.state.fileName,
                    });
                });
            }
        });
    }

    getNewFilePath(filename, docid) {
        let extn = filename.substring(filename.lastIndexOf('.') + 1);
        var newFileName = 'file_' + docid + '.' + extn;
        return '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles') + '/' + newFileName;
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
                this.checkUser();
            },
        );
    }
    async checkUser() {
        // console.log('user id', this.props.data.audits.userId);
        console.log('user id', this.state.currentUserData?.userId);
        // var userid = this.props.data.audits.userId;
        var userid = this.state.currentUserData?.userId;
        // var token = this.props.data.audits.token;
        var token = this.state.currentUserData?.accessToken;
        var UserStatus = '';
        var serverUrl = this.props.data.audits.serverUrl;
        // var ID = this.props.data.audits.userId;
        var ID = this.state.currentUserData?.userId;
        var type = 3;
        var path = '';
        console.log('checkUser params--->', userid, token);

        const deviceId = await AsyncStorage.getItem('loginDeviceId');

        var RegisterDevice = this.props?.data?.audits?.deviceid;
        console.log(userid, token, deviceId, RegisterDevice);

        // auth.getCheckUser(userid,RegisterDevice,token, (res, data) => {
        auth.getCheckUser(userid, deviceId, token, (res, data) => {
            // auth.getCheckUser(userid, token, (res, data) => {
            console.log('User information', data);
            if (data.data.Message == 'Success') {
                console.log('Checking User status', data.data.Data.ActiveStatus);
                UserStatus = data.data.Data.ActiveStatus;

                if (this.props.data.audits.isOfflineMode) {
                    this.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
                } else {
                    NetInfo.fetch().then(netState => {
                        if (netState.isConnected) {
                            // this.props.navigation.navigate('AuditPage', {
                            //   datapass: iAuditDetails,
                            //   auditStatusPass: this.props.item.cStatus,
                            // });
                        } else {
                            this.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
                        }
                    });
                }
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
                        path =
                            '/data/user/0/com.omnex.auditpro/cache/AuditUser' +
                            // '/data/user/0/com.Omnex.IntegratedApp/cache/AuditUser' +
                            //  //data/user/0/com.reactnativeboilerplatev70/files/AuditFiles/CapturedImage_1710838397.jpg
                            '/' +
                            this.propsServerUrl +
                            ID;
                        console.log('path storing-->', path);
                    } else {
                        var iOSpath = RNFS.DocumentDirectoryPath;
                        path = iOSpath + '/' + this.propsServerUrl + ID;
                    }
                    console.log('*** path', path);
                    // this.deleteUserFile(path)
                    this.toast.show(strings.user_disabled_text, DURATION.LENGTH_SHORT);
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                } else if (UserStatus == 0) {
                    Alert.alert('Your session has expired,Please login again.');
                    this.toast.show(strings.user_inactive_text, DURATION.LENGTH_SHORT);
                    // this.props.navigation.navigate('LoginUIScreen');
                    this.props.navigation.navigate(ROUTES.GLOBAL_LOGIN);
                }
            }
        });
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
            var isUrlInValid = false;
            if (this.state.TypeID == '') {
                isValid = false;
            }
            if (this.state.attachment == '') {
                isValid = false;
            }
            let errorMessage = '';
            if (this.state.TypeID == '') {
                isValid = false;
                errorMessage = strings.TypeMissing;
            } else if (this.state.attachment == '') {
                isValid = false;
                errorMessage = strings.AttachMissing || strings.TypeMissing;
            } else if (this.state.comments == '') {
                isValid = false;
                errorMessage = strings.commentMessage;
                this.setState({
                    commentFlag: false,
                });
            } else if (this.state.TypeID == 2 && !this.isUrlValid(this.state.attachment)) {
                isValid = false;
                isUrlInValid = true;
                errorMessage = strings.UrlMissing;
            }

            if (!isValid) {
                this.setState({
                    isErrorFound: true,
                    isUrlInValid: isUrlInValid,
                    saveLoader: false,
                });
                if (errorMessage) {
                    toast(errorMessage, '', TOAST_STATUS.ERROR);
                }
            } else {
                this.setState(
                    {
                        isErrorFound: false,
                    },
                    () => {
                        var auditRecords = this.props.data.audits.auditRecords;
                        var Token = this.state.currentUserData?.accessToken;
                        var SiteId = this.state.currentUserData?.siteId;
                        var UserId = this.state.currentUserData?.userId;
                        var RequestParam = [];

                        var auditRecords = this.props.data.audits.auditRecords;
                        for (var i = 0; i < auditRecords.length; i++) {
                            if (this.state.AuditID === auditRecords[i].AuditId) {
                                console.log('hello', auditRecords[i].AuditId, this.state.AuditID);
                                RequestParam.push({
                                    AuditId: auditRecords[i].AuditId,
                                    AuditProgramId: auditRecords[i].AuditProgramId,
                                    AuditProgramOrder: auditRecords[i].AuditProgOrder,
                                    AuditTypeOrder: auditRecords[i].AuditTypeOrder,
                                    AuditTypeId: auditRecords[i].AuditTypeId,
                                    AuditOrder: auditRecords[i].AuditOrderId,
                                });
                            }
                        }
                        console.log('RequestParam-->', RequestParam);

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
                                    this.state.attachText === 'Attachment' &&
                                    // this.props.navigation.state.params.Type == 'Add'
                                    this.props?.route?.params?.Type == 'Add'
                                        ? this.state.fileData == undefined
                                            ? ''
                                            : this.state.fileData
                                        : '',
                                Filename:
                                    this.state.attachText === 'Attachment' &&
                                    // this.props.navigation.state.params.Type == 'Add'
                                    this.props?.route?.params?.Type == 'Add'
                                        ? this.state.attachment.toLowerCase()
                                        : '',
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
                                        this.deleteAttachments();
                                        this.props.navigation.navigate(ROUTES.AUDIT_ATTACH, {
                                            AuditID: this.state.AuditID,
                                            isDeleted: 2,
                                            breadCrumb: this.state.breadCrumbText,
                                        });
                                    }
                                } else {
                                    this.props.navigation.navigate(ROUTES.AUDIT_ATTACH, {
                                        AuditID: this.state.AuditID,
                                        isDeleted: 2,
                                        breadCrumb: this.state.breadCrumbText,
                                    });
                                }
                            } else {
                                this.setState({ saveLoader: false }, () => {
                                    console.log('==error=>');
                                    this.toast.show(strings.ErrUploading, DURATION.LENGTH_LONG);
                                });
                            }
                        });
                    },
                );
            }
        });
    }

    renderItem = () => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                    margin: 2,
                    //borderColor: '#2a4944',
                    //borderWidth: 1,
                    height: '90%',
                }}>
                <View>
                    <View>
                        {this.state.attachedFilePath !== '' && this.state.attachedFilePath !== undefined && this.state.attachedFilePath !== null ? (
                            <TouchableOpacity onPress={this.openAttachmentFile.bind(this, this.state.attachedFilePath)}>
                                {this.getFileIcon(this.state.fileName, this.state.attachedFilePath)}
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: 'OpenSans-Regular',
                            alignSelf: 'center',
                        }}>
                        {this.state.fileName}
                    </Text>
                </View>
            </View>
        );
    };

    renderAttachmentLoading = () => {
        return (
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Icon name="hourglass" size={15} color="#A6A6A6" style={{ padding: 5 }} />
                <Text
                    numberOfLines={1}
                    style={{
                        color: '#A6A6A6',
                        fontFamily: 'OpenSans-Regular',
                        alignSelf: 'flex-start',
                        padding: 5,
                    }}>
                    Loading Attachments...
                </Text>
            </View>
        );
    };

    deleteAttachments() {
        this.setState(
            {
                fileName: '',
                attachedFilePath: '',
                fileData: '',
                attachment: '',
                attachedFileExt: '',
                mode: '',
                AttachModal: false,
            },
            () => {
                var cameraCapture = [];
                this.props.storeCameraCapture(cameraCapture);
            },
        );
    }

    getFileIcon(filename, fileData) {
        console.log('XXXXXXXXXXXX-------', fileData, filename);
        let icon = 'file';
        if (filename == null || typeof filename == 'undefined' || filename == '') return null;
        let type = filename !== '' ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : 'file';
        switch (type) {
            case 'pdf': {
                icon = 'file';
                break;
            }
            case 'doc':
            case 'docx': {
                icon = 'file';
                break;
            }
            case 'ppt':
            case 'pptx':
            case 'pps': {
                icon = 'file';
                break;
            }
            case 'xls':
            case 'xlsx':
            case 'numbers':
            case 'xlsm': {
                icon = 'file';
                break;
            }
            case 'mp4':
            case 'mpg':
            case 'mpeg': {
                icon = 'play';
                break;
            }
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'heic':
            case 'gif': {
                icon = 'image';
                break;
            }
            default: {
                icon = 'file';
            }
        }

        return icon === 'image' ? (
            <Image
                source={{
                    uri: this.state.attachedFilePath,
                }}
                style={{
                    width: width(70),
                    height: 200,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                }}
            />
        ) : (
            <View style={{ width: width(70), height: 200 }}>
                <Icon
                    name={icon}
                    size={65}
                    color="black"
                    style={{
                        flex: 1,
                        alignSelf: 'center',
                        marginTop: 70,
                    }}
                />
            </View>
        );
    }

    async formDocProObject() {
        console.log('forming doc pro request ...');

        // Dynamic fields
        var AuditID = this.state.AuditID;
        // var token = this.props.data.audits.token;
        var token = this.state.currentUserData?.accessToken;
        var fext = this._extension;

        console.log('fext fext', fext);
        // var getExt = fext.split('/');

        // var ext = getExt[1]
        var regexExt = /(?:\.([^.]+))?$/;
        // var ext = fext;
        // var siteId = this.props.data.audits.siteId;
        // var UserId = this.props.data.audits.userId;
        var siteId = this.state.currentUserData?.siteId;
        var UserId = this.state.currentUserData?.userId;
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
                        this.deleteAttachments();
                        // this.toast.show(strings.AttachUpload, DURATION.LENGTH_LONG)
                        this.props.navigation.navigate(ROUTES.AUDIT_ATTACH, {
                            AuditID: this.state.AuditID,
                            isDeleted: 2,
                            breadCrumb: this.state.breadCrumbText,
                        });
                    },
                );
            } else {
                this.setState({ saveLoader: false }, () => {
                    this.toast.show(strings.ErrUploading, DURATION.LENGTH_LONG);
                });
            }
        });
    }

    resetForm() {
        this.setState({ dialogVisible: false }, () => {
            console.log('dialog offf');
        });
        // var Token = this.props.data.audits.token;
        var Token = this.state.currentUserData?.accessToken;
        auth.deleteAttach(this.state.AttachID, Token, (res, data) => {
            console.log('data', data);
            if (data.data) {
                if (data.data.Message == 'Success') {
                    this.props.navigation.navigate(ROUTES.AUDIT_ATTACH, {
                        AuditID: this.state.AuditID,
                        isDeleted: 1,
                        breadCrumb: this.state.breadCrumbText,
                    });
                } else {
                    this.toast.show(strings.DelError, DURATION.LENGTH_LONG);
                }
            } else {
                this.toast.show(strings.DelError, DURATION.LENGTH_LONG);
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

                    var data = await RNFS.readFile(Platform.OS === 'ios' ? decodeURIComponent(response.uri) : response.uri, 'base64').then(res => {
                        this.setState({
                            mode: 'file',
                            fileData: res,
                            fileName: response.name.replace(/ /g, '_'),
                            attachment: response.name.replace(/ /g, '_'),
                            attachedFilePath: response.uri,
                            attachedFileExt: response.name,
                            AttachModal: false,
                        });
                    });
                    console.log(this.state.fileData, 'helloyes');
                    console.log('this.state:', this.state);
                    //console.log(fileData,"filedata")
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    openAttachmentFile = path => {
        console.log(path, 'Attachment:path');
        if (path == null || typeof path == 'undefined' || path == '') return;
        // const fpath = FileViewer.open('file:/' + path) // absolute-path-to-my-local-file.
        //   .then(() => {
        //     console.log('Attachmentfile opened');
        //   })
        //   .catch(err => {
        //     console.log('Attachmentfile opened error', err);
        //   });

        FileViewer.open(path, { showOpenWithDialog: true })
            .then(() => {
                // success
                console.log('SUCESSSSSPATH-----------', path);
            })
            .catch(error => {
                console.log('failure----------', error);
            });
    };

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

    render() {
        const attach = this.state.attachType;
        console.log('TYpe', this.state.attachType);

        return (
            <KeyboardAvoidingView style={styles.wrapper} behavior={'height'}>
                {Platform.OS === 'ios' ? (
                    <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }} />
                ) : (
                    <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }} />
                )}
                {/* <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
          }}> */}
                <GlobalHeader
                    title={this.state.EditFlag === false ? strings.HeadingTitle : strings.EditAttach}
                    subtitle={this.state.breadCrumbText}
                    onLeftPress={() =>
                        this.props.navigation.navigate(
                            ROUTES.AUDIT_ATTACH,
                            {
                                AuditID: this.state.AuditID,
                                isDeleted: 0,
                                breadCrumb: this.state.breadCrumbText,
                            },
                            this.deleteAttachments(),
                        )
                    }
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={{ backgroundColor: 'transparent', paddingVertical: 12 }}
                    // titleStyle={{color: '#fff'}}
                    // subtitleStyle={{color: '#fff', fontSize: 15}}
                    // leftIconColor="#fff"
                    // rightIconColor="#fff"
                />
                {/* </ImageBackground> */}

                <AttachmentSelectionModal
                    visible={this.state.AttachModal}
                    title={strings.Make_your_selection}
                    takePhotoText={strings.Camera_Capture_Head}
                    browseText={strings.Camera_Browse_Files}
                    cancelText={strings.Cancel}
                    onTakePhoto={() => this.cameraAction('Camera')}
                    onBrowseFiles={() => this.handleDocumentSelection()}
                    onCancel={() => this.setState({ AttachModal: false })}
                />
                {/** ---------------------- */}
                <View style={styles.auditPageBody}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        contentContainerStyle={{ paddingBottom: 140 }}>
                        {this.state.EditFlag === true ? (
                            <View style={styles.manFields}>
                                        <View
                                            style={{
                                                backgroundColor: 'transparent',
                                                width: '100%',
                                                height: 60,
                                            }}>
                                            <DropdownComponent
                                                data={attach}
                                                label={strings.DropType}
                                                value={this.state.attachText}
                                                editable={false}
                                                required
                                                containerStyle={{ paddingHorizontal: 0, marginBottom: 0, zIndex: 1000, elevation: 1000 }}
                                            />
                                    {this.state.isErrorFound && this.state.TypeID == '' ? (
                                        toast(strings.TypeMissing, '', TOAST_STATUS.ERROR)
                                    ) : null}
                                </View>

                                <View style={styles.check}>
                                    <Icon name="sun" style={{ bottom: 25, right: 0 }} size={8} color="green" />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.manFields}>
                                        <View
                                            style={{
                                                backgroundColor: 'transparent',
                                                width: '100%',
                                                height: 60,
                                            }}>
                                            <DropdownComponent
                                                data={attach}
                                                label={strings.DropType}
                                                value={this.state.attachText}
                                                required
                                                containerStyle={{ paddingHorizontal: 0, marginBottom: 0, zIndex: 1000, elevation: 1000 }}
                                        onChange={selectedValue => {
                                            const selectedType = attach.find(item => item.value === selectedValue);
                                            console.log('selectedType', selectedType);
                                            this.setState(
                                                {
                                                    attachText: selectedType?.value || '',
                                                    TypeID: selectedType?.id || '',
                                                    ShowTypeDiv: true,
                                                    comments: '',
                                                    attachment: '',
                                                },
                                                () => {
                                                    console.log('this.state', this.state);
                                                },
                                            );
                                        }}
                                    />
                                  
                                </View>
                            </View>
                        )}

                        {this.state.ShowTypeDiv === true ? (
                            <View style={styles.manFields}>
                                {this.state.TypeID === 1 && this.state.attachText === 'Attachment' ? (
                                    <TouchableOpacity
                                        style={styles.div01}
                                        onPress={
                                            this.state.isControllAttach === true
                                                ? () => {
                                                      this.toast.show(strings.NavErr, DURATION.LENGTH_SHORT);
                                                  }
                                                : () => {
                                                      // iPhone/Android
                                                      // this.handleDocumentSelection();
                                                      // this.props.navigation.state.params.Type == 'Add' &&
                                                      this.props?.route?.params?.Type == 'Add' &&
                                                          this.setState({ AttachModal: true }, () => {
                                                              console.log('opoened');
                                                          });
                                                  }
                                        }>
                                        {this.state.isControllAttach === true ? (
                                            <View
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    width: '80%',
                                                    height: null,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: Fonts.size.regular,
                                                        color: '#A6A6A6',
                                                        fontFamily: 'OpenSans-Regular',
                                                    }}>
                                                    {strings.Attach_EvidenceL}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: 'lightgray',
                                                        marginTop: 10,
                                                        width: '90%',
                                                        fontFamily: 'OpenSans-Regular',
                                                    }}
                                                    numberOfLines={1}>
                                                    {this.state.attachment}
                                                </Text>
                                                {/* {this.state.isErrorFound && this.state.attachment == '' ? (
                                                    <Text
                                                        style={{
                                                            color: 'red',
                                                            fontSize: Fonts.size.small,
                                                            fontFamily: 'OpenSans-Regular',
                                                        }}>
                                                        {strings.AttachMissing}
                                                    </Text>
                                                ) : null} */}
                                            </View>
                                        ) : this.state.fileloaded ? (
                                            <View
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    width: '95%',
                                                    height: this.state.attachment === '' ? '50%' : 270,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: Fonts.size.regular,
                                                        color: '#A6A6A6',
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginLeft: 20,
                                                    }}>
                                                    {strings.Attach_EvidenceL}
                                                </Text>

                                                {this.renderItem()}

                                                {/* {this.state.isErrorFound && this.state.attachment == '' ? (
                                                    <Text
                                                        style={{
                                                            color: 'red',
                                                            bottom: 10,
                                                            fontSize: Fonts.size.small,
                                                            fontFamily: 'OpenSans-Regular',
                                                        }}>
                                                        {strings.AttachMissing}
                                                    </Text>
                                                ) : null} */}
                                            </View>
                                        ) : (
                                            this.renderAttachmentLoading()
                                        )}

                                        {this.props?.route?.params?.Type == 'Add' && (
                                            // this.props.navigation.state.params.Type == 'Add' && (
                                            <View style={styles.check}>
                                                <ResponsiveImage
                                                    initWidth="24"
                                                    initHeight="22"
                                                    style={{ right: 8, top: 10 }}
                                                    source={Images.AttachIcon}
                                                />
                                                <Icon name="sun" style={{ bottom: 25, right: 8 }} size={8} color="red" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.manFields}>
                                        <InputComponent
                                            label={strings.UncontrolledLink}
                                            name="attachment"
                                            required
                                            value={this.state.attachment}
                                            placeholder={strings.UncontrolledLink}
                                            autoCapitalize="none"
                                            keyboardType="url"
                                            containerStyle={{ width: '100%', marginBottom: 0, paddingHorizontal: 0 }}
                                            onChangeText={(field, value) =>
                                                this.setState({ attachment: value }, () => {
                                                    console.log('printing', this.state.attachment);
                                                })
                                            }
                                        />
                                        {this.state.isErrorFound && (this.state.attachment == '' || this.state.isUrlInValid) ? null : null}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View></View>
                        )}

                        {this.state.isControllAttach === true ? (
                            <View style={[styles.manFields, { borderColor: 'brown', borderWidth: 1 }]}>
                                <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: '90%',
                                        height: null,
                                    }}>
                                    {this.state.comments != '' || this.state.comments == '' ? (
                                        //Edit Comments
                                        <View style={styles.boxCard}>
                                            <Text style={styles.detailTitle}>{strings.AttachComments}</Text>
                                            <View style={styles.check1}>
                                                <Icon style={{ top: 5, right: 0, bottom: 7 }} name="edit" size={20} color="lightgrey" />
                                            </View>
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                    <InputComponent
                                        label={strings.AttachComments}
                                        name="comments"
                                        required
                                        value={this.state.comments === null || this.state.comments == 'null' ? '' : this.state.comments}
                                        multiline
                                        numberOfLines={3}
                                        placeholder={strings.AttachComments}
                                        containerStyle={{ width: '100%', marginBottom: 0, paddingHorizontal: 0 }}
                                        onChangeText={(field, value) => this.setState({ comments: value })}
                                        returnKeyType="default"
                                    />
                                    {this.state.commentFlag == false && this.state.comments === '' ? null : null}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.manFields}>
                                <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: '100%',
                                        height: null,
                                    }}>
                                    {this.state.comments != '' || this.state.comments == '' ? (
                                        //Add Comment
                                        <View style={styles.boxCard}>
                                            {/* <Text style={styles.detailTitle}>{strings.AttachComments}</Text> */}

                                            <View style={styles.check1}>
                                                <Icon style={{ top: 8, right: 15, bottom: 0 }} name="edit" size={20} color="lightgrey" />
                                            </View>
                                        </View>
                                    ) : null}
                                    <InputComponent
                                        label={strings.AttachComments}
                                        name="comments"
                                        required
                                        value={this.state.comments === null || this.state.comments == 'null' ? '' : this.state.comments}
                                        placeholder={strings.AttachComments}
                                        containerStyle={{ width: '100%', marginBottom: 0, paddingHorizontal: 0 }}
                                        multiline
                                        numberOfLines={3}
                                        onChangeText={(field, value) =>
                                            this.setState({ comments: value }, () => {
                                                console.log('printing');
                                            })
                                        }
                                        returnKeyType="default"
                                    />
                                    {this.state.commentFlag == false && this.state.comments == '' ? null : null}
                                </View>
                            </View>
                        )}

                        {this.state.Uploadedon != '' && this.props?.route?.params?.Type == 'Edit' ? (
                            // this.props.navigation.state.params.Type == 'Edit' ? (
                            <View style={styles.manFields}>
                                <InputComponent
                                    label={strings.UploadedOn}
                                    name="uploadedOn"
                                    value={this.state.Uploadedon}
                                    placeholder={strings.UploadedOn}
                                    editable={false}
                                    containerStyle={{ width: '95%', marginBottom: 0, paddingHorizontal: 0 }}
                                />
                                <View style={styles.check}>
                                    <Icon style={{ top: 5, right: 13 }} name="calendar" size={20} color="lightgrey" />
                                </View>
                            </View>
                        ) : null}

                        <View></View>
                    </ScrollView>
                </View>

                {/* Floating FABs */}
                <View style={styles.fabContainer}>
                    {this.props?.route?.params?.Type === 'Edit' && (
                        <TouchableOpacity
                            style={[styles.floatingSaveButton, styles.deleteFab]}
                            onPress={() => this.setState({ dialogVisible: true })}>
                            <Icon name="trash" size={22} color="white" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.floatingSaveButton,
                            this.props?.route?.params?.Type === 'Edit' ? { marginLeft: 12 } : null,
                            this.props?.route?.params?.Type !== 'Add' ? styles.disabledFab : null,
                        ]}
                        disabled={this.props?.route?.params?.Type !== 'Add' || this.state.saveLoader}
                        onPress={debounce(this.checkuserstatus.bind(this), 1000)}>
                        {this.state.saveLoader ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Icon name="save" size={25} color="white" />
                        )}
                    </TouchableOpacity>
                </View>

                <ConfirmDialog
                    title={strings.Confirm}
                    message={strings.DeleteAtt}
                    titleStyle={{ fontFamily: 'OpenSans-SemiBold' }}
                    messageStyle={{ fontFamily: 'OpenSans-Regular' }}
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                    positiveButton={{
                        title: strings.yes,
                        onPress: this.resetForm.bind(this),
                    }}
                    negativeButton={{
                        title: strings.no,
                        onPress: () => this.setState({ dialogVisible: false }),
                    }}
                />
                <Toast
                    ref={toast => (this.toast = toast)}
                    style={{ backgroundColor: 'black', margin: 20 }}
                    position="top"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
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
        storeCameraCapture: cameraCapture => dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAttach);
