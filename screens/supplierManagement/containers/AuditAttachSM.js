import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Linking, Platform, Alert, PermissionsAndroid } from 'react-native';
// import { Dialog, ProgressDialog } from 'react-native-simple-dialogs';
import { Images } from '../../auditPro/Themes';
import styles from '../../auditPro/styles/AuditAttachStyle';
import Moment from 'moment';
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Pulse } from 'react-native-loader';
import auth from '../../../services/Auditpro-Auth';
import OfflineNotice from '../../auditPro/components/OfflineNotice';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import { strings } from '../../auditPro/language/Language';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from 'xlsx'; // Import the xlsx library
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import { ROUTES } from 'constants/app-constant';
import GlobalHeader from 'components/GlobalHeader';
import { Content, Header, ListSearch, NoRecordFound } from 'components';

class AuditAttach extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            pageLoad: true,
            ChineseScript: false,
            History: [],
            AuditID: '',
            NetInfo: false,
            breadCrumbText: '',
            currentUserData: [],
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
        };
    }

    componentDidMount() {
        console.log('AuditAttachSM componentDidMount', this.props);
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
                breadCrumbText: this.props.route?.params?.breadCrumb,
                AuditID: this.props.route?.params?.AuditID,
            },
            () => {
                console.log('Bobby', this.props.route?.params);
                if (this.props.route?.params?.isDeleted == 1) {
                    this.refs.toast.show(strings.AttachDelSuccess, DURATION.LENGTH_SHORT);
                    this.getHistory();
                } else if (this.props.route?.params?.isDeleted == 2) {
                    this.refs.toast.show(strings.AttachUpload, DURATION.LENGTH_SHORT);
                    this.getHistory();
                } else {
                    console.log('No toast');
                    this.getHistory();
                }
            },
        );
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

    componentWillReceiveProps() {
        var CurrentPage = this.props.route.name;
        console.log('checksreename', CurrentPage);

        if (CurrentPage == 'AUDIT_ATTACHSM') {
            this.getHistory();
        }
    }

    Refresh() {
        console.log('Refresh pressed');
        this.getHistory();
    }

    async getHistory() {
        const userDetails = await this.getAccessToken();
        if (this.props.data.audits.isOfflineMode) {
            this.setState({ pageLoad: false, NetInfo: true }, () => {
                console.log('Page load is off');
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_SHORT);
            });
        } else {
            NetInfo.fetch().then(async isConnected => {
                if (isConnected.isConnected) {
                    var auditRecords = this.props.data.audits.auditRecords;
                    var Token = userDetails?.accessToken || this.state.currentUserData?.accessToken || this.props.data.audits.token;
                    var SiteId = userDetails?.siteId || this.state.currentUserData?.siteId || this.props.data.audits.siteId;
                    var ObjectiveEvidence = this.props.data.audits;
                    console.log('objEvi==>', this.props.data.audits, ObjectiveEvidence);
                    var RequestParam = [];

                    var auditRecords = this.props.data.audits.auditRecords;
                    console.log('checkthewebtodocdetailsauditRecords.....', auditRecords);
                    console.log('this.prope9009090', this.props);

                    var AUDITPROG_ID = await AsyncStorage.getItem('AUDITPROG_ID');
                    var AUDITYPE_ORDER = await AsyncStorage.getItem('AUDITYPE_ORDER');
                    var AUDITYPE_ID = await AsyncStorage.getItem('AUDITYPE_ID');
                    var AUDITPROGORDER = await AsyncStorage.getItem('AUDITPROGORDER');
                    console.log('checkconnectionnnn', AUDITPROG_ID, AUDITYPE_ORDER, AUDITYPE_ID, AUDITPROGORDER);

                    for (var i = 0; i < auditRecords.length; i++) {
                        if (this.state.AuditID === auditRecords?.[i]?.AuditId) {
                            console.log('hello', auditRecords?.[i]?.AuditId, this.state.AuditID);
                            if (auditRecords?.[i]?.AuditProgramId == undefined) {
                                console.log('checking the programid----iffffff');
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
                                console.log('checking the programid----eelseeeee');
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
                    console.log('RequestParam-->', RequestParam);
                    console.log('Auditcheck-----AuditId', RequestParam[0].AuditId);
                    console.log('Auditcheck-----AuditProgramId', RequestParam[0].AuditProgramId);
                    console.log('Auditcheck-----AuditProgramOrder', RequestParam[0].AuditProgramOrder);
                    console.log('Auditcheck-----AuditTypeId', RequestParam[0].AuditTypeId);
                    console.log('Auditcheck-----AuditOrder', RequestParam[0].AuditOrder);

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
                    param.push({
                        Request: Request,
                        SiteId: SiteId,
                    });
                    console.log('Param-->Attach', param);

                    auth.getStatusHistory(param, Token, (res, data) => {
                        console.log('response', data, param, Token);
                        if (data.data) {
                            if (data.data.Message === 'Success') {
                                var HistoryArr = data.data.Data;
                                var HistoryForm = [];
                                for (var i = 0; i < HistoryArr.length; i++) {
                                    HistoryForm.push({
                                        Type: HistoryArr?.[i]?.AttachmentType,
                                        UncontrolledLink: HistoryArr?.[i]?.RefPath === null ? '-' : HistoryArr?.[i]?.RefPath,
                                        FileName: HistoryArr?.[i]?.ObjectiveEvidence === null ? '' : HistoryArr?.[i]?.ObjectiveEvidence,
                                        Comments: HistoryArr?.[i]?.Comments,
                                        key: HistoryArr?.[i]?.Id,
                                        filedata: HistoryArr?.[i]?.File,
                                        fileName: HistoryArr?.[i]?.FileName,
                                        UploadedBy: HistoryArr?.[i]?.UploadedBy,
                                        Uploadedon: HistoryArr?.[i]?.UploadedOn,
                                    });
                                }
                                this.setState({ History: HistoryForm, pageLoad: false, NetInfo: false }, () => {
                                    console.log('demo data', this.state.History);
                                });
                            } else {
                                this.setState({ pageLoad: false }, () => {
                                    this.refs.toast.show(strings.ErrFetch, DURATION.LENGTH_SHORT);
                                });
                            }
                        } else {
                            this.setState({ pageLoad: false }, () => {
                                this.refs.toast.show(strings.ErrFetch, DURATION.LENGTH_SHORT);
                            });
                        }
                    });
                } else {
                    this.setState({ pageLoad: false, NetInfo: true }, () => {
                        console.log('Page load is off');
                        this.refs.toast.show(strings.NoInternet, DURATION.LENGTH_SHORT);
                    });
                }
            });
        }
    }

    onPress(item) {
        console.log('Pressed', item);

        this.props.navigation.navigate(ROUTES.CREATE_ATTACHSM, {
            AuditID: this.state.AuditID,
            Type: 'Edit',
            EditDetails: item,
            breadCrumb: this.state.breadCrumbText,
        });
    }

    changeDateFormat = inDate => {
        console.log('--->', this.state.selectedFormat);
        var DefaultFormatL = this.state.selectedFormat; // + ' ' + 'HH:mm';
        var sDateArr = inDate.split('T');
        var sDateValArr = sDateArr[0].split('-');
        var sTimeValArr = sDateArr[1].split(':');
        var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1]);
        return Moment(outDate).format(DefaultFormatL);
    };

    addOfflineMode() {
        console.log('offline');
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_SHORT);
    }

    initiateDownload(docid) {
        var Token = this.props.data.audits.token;
        auth.downloadFile(docid, Token, (res, data) => {
            console.log('getFiles File download response', data.data.Data.DocId);
            if (data.data.Data.DocId === null) {
                Alert.alert('File is not synced with server yet, please try after sometime.');
            } else if (data.data.Message == 'Success') {
                // this.setState({
                //   isVisible : false
                // })
                this.WriteAttachments(data.data.Data);
            } else {
                this.refs.toast.show(strings.server_error, DURATION.LENGTH_LONG);
            }
        });
    }

    async WriteAttachments(data) {
        let newFilePath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');

        var newfileName = 'file_' + data.DocId + '.' + data.FileName.substring(data.FileName.lastIndexOf('.') + 1);
        newFilePath = newFilePath + '/' + newfileName;

        await RNFetchBlob.fs.exists(newFilePath).then(exist => {
            if (!exist || exist == '') {
                RNFetchBlob.fs
                    .writeFile(newFilePath, data.FileData, 'base64')
                    .then(res => {
                        console.log('Attachment:File Written', res);
                        this.openFile(newFilePath);
                    })
                    .catch(err => {
                        console.log('Attachment:Err:' + err);
                    });
            } else {
                this.setState(
                    {
                        // isVisible : false
                    },
                    () => {
                        setTimeout(() => {
                            this.openFile(newFilePath);
                        }, 1000);
                    },
                );
            }
        });
    }

    openFile = async filePath => {
        var extension = filePath;
        const parts = extension.split('.');
        const fileType = parts[parts.length - 1];
        console.log('File pathchecking-------: ', filePath);
        console.log('File extension: ', fileType, filePath);

        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
                FileViewer.open(filePath, { showOpenWithDialog: true });
            } else {
                console.log('File opened');
                FileViewer.open(filePath);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    render() {
        const { History } = this.state;
        console.log('Hist', History);
        return (
            <View style={styles.wrapper}>
                <OfflineNotice />

                <GlobalHeader
                    title={strings.AuditAttach}
                    subtitle={this.state.breadCrumbText}
                    onLeftPress={() => this.props.navigation.goBack()}
                    onRightPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
                    containerStyle={styles.headerContainer}
                />
                {/** ---------------------- */}
                <ScrollableTabView
                    renderTabBar={() => (
                        <DefaultTabBar
                            backgroundColor="white"
                            activeTextColor="#123C95"
                            inactiveTextColor="#747474"
                            underlineStyle={styles.tabUnderline}
                            textStyle={styles.tabText}
                        />
                    )}
                    tabBarPosition="overlayTop">
                    {this.state.History.length > 0 ? (
                        <View tabLabel={strings.History} style={styles.scrollViewBody}>
                            {this.state.NetInfo === true ? (
                                <View style={styles.networkInfoContainer}>
                                    <Text style={styles.noInternetText}>{strings.NoInternet}</Text>
                                </View>
                            ) : (
                                <View style={styles.historyContentTopMargin}>
                                    {this.state.pageLoad === true ? (
                                        <View style={styles.historyLoaderContainer}>
                                            <Pulse size={30} color={'#123C95'} />
                                        </View>
                                    ) : (
                                        <FlatList
                                            data={History}
                                            keyExtractor={item => item.key}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.onPress(item);
                                                    }}
                                                    style={styles.card}>
                                                    <View style={styles.card1}>
                                                        <View style={styles.boxCard1}>
                                                            <Text style={styles.detailTitle}>{strings.AttachType}</Text>
                                                            <Text style={styles.detailContent}>
                                                                {item.Type === 'Controlled' || item.Type === 'Attachment' ? 'Attachment' : item.Type}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.boxCard1}>
                                                            <Text style={styles.detailTitle}>{strings.AttachName}</Text>
                                                            <TouchableOpacity
                                                                onPress={index => {
                                                                    let url = item.UncontrolledLink;
                                                                    url = url.indexOf('http') !== 0 ? 'https://' + url : url;
                                                                    if (item.Type === 'Link') {
                                                                        Linking.openURL(url);
                                                                    } else if (item.Type === 'Attachment') {
                                                                        this.setState(
                                                                            {
                                                                                // isVisible : true
                                                                            },
                                                                            () => {
                                                                                this.initiateDownload(item.UncontrolledLink);
                                                                            },
                                                                        );
                                                                    }
                                                                }}>
                                                                <View>
                                                                    <Text
                                                                        style={[
                                                                            styles.detailContent,
                                                                            styles.attachmentLinkText,
                                                                            item.Type === 'Link'
                                                                                ? styles.attachmentLinkUnderline
                                                                                : styles.attachmentLinkNoUnderline,
                                                                        ]}
                                                                        numberOfLines={1}>
                                                                        {item.Type === 'UnControlled' || item.Type === 'Link'
                                                                            ? item.UncontrolledLink
                                                                            : item.FileName}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={styles.boxCard1}>
                                                            <Text style={styles.detailTitle}>{strings.AttachCom}</Text>
                                                            <Text style={styles.detailContent} numberOfLines={1}>
                                                                {item.Comments === 'null' || item.Comments === null ? '-' : item.Comments}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.boxCard1}>
                                                            <Text style={styles.detailTitle}>{strings.UploadedOn}</Text>
                                                            <Text style={styles.detailContent}>{this.changeDateFormat(item.Uploadedon)}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    ) : (
                        <NoRecordFound />
                    )}
                </ScrollableTabView>
                {/** Floating add button */}
                <TouchableOpacity
                    onPress={
                        this.state.NetInfo === true
                            ? () => this.addOfflineMode()
                            : () =>
                                  this.props.navigation.navigate(ROUTES.CREATE_ATTACHSM, {
                                      AuditID: this.state.AuditID,
                                      Type: 'Add',
                                      EditDetails: [],
                                      breadCrumb: this.state.breadCrumbText,
                                  })
                    }
                    style={[styles.floatingButton, Platform.OS === 'ios' ? styles.floatingButtonIOSOffset : styles.floatingButtonAndroidOffset]}>
                    <Icon name="plus" size={25} color="white" />
                </TouchableOpacity>
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
                <View>
                    {/* <ProgressDialog
              titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
              messageStyle={{fontFamily: 'OpenSans-Regular'}}
              message={'File is loading, Please Wait!!'}
              visible={this.state.isVisible}
            /> */}
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
        changeAuditState: isAuditing => dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
        storeNCRecords: ncofiRecords => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditAttach);
