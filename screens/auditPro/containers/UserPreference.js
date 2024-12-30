import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Switch,
  FlatList,
  TextInput,
  Alert, 
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Images} from '../Themes';
import styles from '../styles/UserPreferenceStyle';
import {width} from 'react-native-dimension';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import OfflineNotice from '../components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Fonts from '../../auditPro/Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../auditPro/language/Language';
import {Dropdown} from 'react-native-element-dropdown';
import {debounce, once} from 'underscore';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {type} from 'ramda';
import VersionCheck from 'react-native-version-check';
import { Platform } from 'react-native';
import { SPACING } from 'constants/theme-constants';
import { ROUTES } from 'constants/app-constant';
import AsyncStorage from '@react-native-community/async-storage';
let Window = Dimensions.get('window');

class UserPreference extends React.Component {
  constructor(props) {
    super(props);
    console.log('get this.props--->', props)
    this.state = {
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,

      enableOffline: this.props.data.audits.isOfflineMode ? true : false,
      SupplierManagementAccess: '',
      siteID: this.props.data.audits.siteId,
      SiteName: '',
      data: [],
      value: '',
      dateFormat: [
        {
          value: 'DD-MM-YYYY',
          id: 1,
        },
        {
          value: 'MM-DD-YYYY',
          id: 2,
        },
        {
          value: 'DD/MM/YYYY',
          id: 3,
        },
        {
          value: 'MM/DD/YYYY',
          id: 4,
        },
        {
          value: 'DD/MMM/YYYY',
          id: 5,
        },
        {
          value: 'DD-MMM-YYYY',
          id: 6,
        },
      ],
    };
    this.arrayNew = [
      {name: 'Robert'},
      {name: 'Bryan'},
      {name: 'Vicente'},
      {name: 'Tristan'},
      {name: 'Marie'},
      {name: 'Onni'},
      {name: 'sophie'},
      {name: 'Brad'},
      {name: 'Samual'},
      {name: 'Omur'},
      {name: 'Ower'},
      {name: 'Awery'},
      {name: 'Ann'},
      {name: 'Jhone'},
      {name: 'z'},
      {name: 'bb'},
      {name: 'cc'},
      {name: 'd'},
      {name: 'e'},
      {name: 'f'},
      {name: 'g'},
      {name: 'h'},
      {name: 'i'},
      {name: 'j'},
      {name: 'k'},
      {name: 'l'},
    ];
  }

  componentDidMount() {
    console.log('User pref mounted', this.props);
  }

  async updateSiteId(currentSiteId) {
    try {
      // Retrieve the existing object
      const jsonValue = await AsyncStorage.getItem('userDetails');
      let userDetails = jsonValue != null ? JSON.parse(jsonValue) : {};

      // Update the siteId parameter
      userDetails.siteId = currentSiteId;

      // Save the updated object back to AsyncStorage
      await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
      console.log("Updated userDetails: ", userDetails);
    } catch (e) {
      // handle error
      console.error("Error updating siteId: ", e);
    }
  }

  updateFormat() {
    var selectedFormat = this.state.selectedFormat;
    this.props.storeDateFormat(selectedFormat);
    this.toast.show(strings.SaveToast, DURATION.LENGTH_SHORT);
    setTimeout(() => {
      console.log('props updated', this.props);
    }, 1000);
  }

  onSave() {
    this.updateFormat();
  }

  changeOfflineMode() {
    this.setState(
      {
        enableOffline: !this.state.enableOffline,
      },
      () => {
        this.props.changeOfflineModeState(this.state.enableOffline);
        setTimeout(
          function () {
            if (!this.state.enableOffline) {
              console.log(
                'Offline mode disabled.',
                this.props.data.audits.isOfflineMode,
              );
              this.toast.show(
                strings.SaveOfflineDisabledToast,
                DURATION.LENGTH_SHORT,
              );
            } else {
              console.log(
                'Offline mode enabled.',
                this.props.data.audits.isOfflineMode,
              );
              this.toast.show(
                strings.SaveOfflineEnabledToast,
                DURATION.LENGTH_SHORT,
              );
            }
          }.bind(this),
          50,
        );
      },
    );
  }

  componentWillReceiveProps() {
    var logindata = this.props.data.audits.logindata;

    if (logindata != null) {
      for (var j = 0; j < logindata.length; j++) {
        if (logindata[j].Siteid == this.props.data.audits.siteId) {
          this.setState({
            SiteName: logindata[j].SiteName,
          });
        }
      }
    }
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  searchItems = text => {
    const newData = this.arrayNew.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
      value: text,
    });
  };

  onSelectedItemsChange = selectedItems => {};
  icon = ({name, size = 18, style}) => {
    // flatten the styles
    const flat = StyleSheet.flatten(style);
    // remove out the keys that aren't accepted on View
    const {color, fontSize, ...styles} = flat;

    let iconComponent;

    const iconColor =
      color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '';

    const Down = <Icon name="caret-down" size={20} color="grey" />;

    switch (name) {
      case 'keyboard-arrow-down':
        iconComponent = Down;
        break;
      default:
    }
    return <View style={styles}>{iconComponent}</View>;
  };

        //Version Check
  checkAppVersion = async () => {
    try {
        const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=org.omnex.auditpro`)
              .then(r => r.json())
              .then((res) => { return res?.results[0]?.version })
              : await VersionCheck.getLatestVersion({
                  provider: 'playStore',
                  packageName: 'com.omnex.auditpro',
                  ignoreErrors: true,
              });
      
      const currentVersion = VersionCheck.getCurrentVersion();
      
      if (latestVersion > currentVersion) {
          const url = Platform.OS === 'ios'
          ? await VersionCheck.getAppStoreUrl({ appID: '1516248089' })
          :await  VersionCheck.getPlayStoreUrl({ packageName: 'com.omnex.auditpro' })
          console.log("store url",await VersionCheck.getAppStoreUrl({ appID: '1516248089' }))
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => Linking.openURL(url)
                ,
              },
              {
                text: 'Later',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              ],
              { cancelable: false }
            );
          } else {
            // App is up-to-date; proceed with the app
          }
        } catch (error) {
          // Handle error while checking app version
          console.error('Error checking app version:', error);
        }
  };

  render() {
    let data = [];
    var logindata = this.props.data.audits.logindata;
    let section_list = [];

    console.log(this.state.siteID, typeof this.state.siteID, 'section_list');

    if (logindata != null) {
      for (var i = 0; i < logindata.length; i++) {
        data.push({
          //value: logindata?.[i]?.Siteid,
          value: logindata?.[i]?.SiteName,
          SiteID: logindata?.[i]?.Siteid,
          UserId: logindata?.[i]?.UserId,

          FullName: logindata?.[i]?.FullName,

          EntityNode: logindata?.[i]?.EntityNode,

          SupplierManagementAccess: logindata?.[i]?.SupplierManagementAccess,
        });
        section_list.push({
          name: logindata?.[i]?.SiteName,
          id: logindata?.[i]?.Siteid,

          // EntityNode: logindata?.[i]?.EntityNode,

          // SupplierManagementAccess: logindata?.[i]?.SupplierManagementAccess,
        });

        if (logindata?.[i]?.Siteid == this.props.data.audits.siteId) {
          //this.setState({
          //SiteName: logindata?.[i]?.SiteName
          //})
        }
        console.log(
          'vs===>',
          this.props.data.audits.siteId,
          this.props.data.audits.logindata?.[i]?.EntityNode,
        );
      }
      /*
      for(var j=0;j<logindata.length;j++){
        if(logindata[j].Siteid== this.props.data.audits.siteId){
          this.setState({
            SiteName: logindata[j].SiteName
          })
        }
      }
      */
    }
    console.log(data + 'data');
    console.log(
      this.props.data.audits.siteId,
      this.props.data.audits.EntityNode,
      'csi',
    );
    console.log('SSiteid', this.state.siteID);
    
    return (
      <View style={styles.wrapper}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => 
              this.props.navigation.navigate(ROUTES.AUDITPRODASHBOARD)
              }>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.UserSetting}</Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() =>
                  // this.props.navigation.navigate('Home')
                  this.props.navigation.navigate(ROUTES.AUDITPRODASHBOARD)
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/** ---------------------- */}
        <ImageBackground
          source={Images.BGlayerFooter}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: '100%',
          }}>
          {/* <ScrollableTabView
            renderTabBar={() =>
              <DefaultTabBar
                backgroundColor='white'
                activeTextColor='#2CB5FD'
                inactiveTextColor='#747474'
                underlineStyle={{ backgroundColor: '#2CB5FD', borderBottomColor: '#2CB5FD' }}
                textStyle={{ fontSize: Fonts.size.regular }}
              />
            }
            tabBarPosition='overlayTop'
          > */}
          <View style={styles.subHeading}>
            <Text style={styles.subText}>{strings.prefferedsettings}</Text>
          </View>
          <View style={styles.scrollViewBody}>
            <View
              style={{
                margin: 10,
                justifyContent: 'center',
              }}>
              <Dropdown
                value={this.state.selectedFormat}
                baseColor={'#A6A6A6'}
                selectedItemColor="#000"
                textColor="#000"
                itemColor="#000"
                labelField="value"
                valueField="value"
                data={this.state.dateFormat}
                label={strings.LabelText}
                fontSize={Fonts.size.regular}
                labelFontSize={Fonts.size.small}
                itemPadding={5}
                dropdownOffset={{top: 10, left: 0}}
                itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
                onChange={value => {
                  console.log('*****', value);
                  for (var i = 0; i < this.state.dateFormat.length; i++) {
                    if (value.value === this.state.dateFormat[i].value) {
                      this.setState({selectedFormat: value.value}, () => {
                        console.log(
                          'selected format is',
                          this.state.selectedFormat,
                        );
                        this.updateFormat();
                      });
                    }
                  }
                }}
              />
            </View>

            {/* <View
              style={{
                margin: 10,
                justifyContent: "center",
              }}
            > */}
            {/* <Dropdown
                //value={this.state.Siteid}
                value={this.state.SiteName}
                baseColor={"#A6A6A6"}
                selectedItemColor="#000"
                textColor="#000"
                itemColor="#000"
                data={data}
                label={strings.siteID}
                fontSize={Fonts.size.regular}
                labelFontSize={Fonts.size.small}
                itemPadding={5}
                dropdownOffset={{ top: 10, left: 0 }}
                itemTextStyle={{ fontFamily: "OpenSans-Regular" }}
                onChangeText={(value) => {
                  console.log("Text", value);
                  for (let i = 0; i < data.length; i++)
                    if (data[i].value == value) {
                      this.setState({
                        SupplierManagementAccess:
                          data[i].SupplierManagementAccess,
                        //siteID: data[i].value,
                        siteID: data[i].SiteID,
                      });
                      this.props.storeSupplierManagement(
                        data[i].SupplierManagementAccess
                      );
                    }
                  console.log("data", data);
                  this.props.storeSiteId(this.state.siteID);
                  //this.props.storeSiteId(259);
                }}
              /> */}
            {/* </View> */}
            {/* <View style={{marginLeft:5}}><Text style={{fontSize:18}}>{"Choose Site here"}</Text></View> */}

            <SectionedMultiSelect
              items={section_list}
              IconRenderer={this.icon}
              single
              uniqueKey="id"
              subKey="children"
              selectText="Choose site..."
              showDropDowns={true}
              hideConfirm
              modalWithTouchable
              styles={{
                modalWrapper: {
                   paddingVertical: SPACING.NORMAL
                },
                chipText: {
                  maxWidth: Dimensions.get('screen').width - 90,
                },
              }}
              onSelectedItemsChange={ async selectedItems => {
                console.log(selectedItems, 'selctedItems');
                const value = selectedItems[0];
                for (let i = 0; i < data.length; i++)
                  if (data[i].SiteID == value) {
                    console.log('Text', value, data);
                    this.setState({
                      SupplierManagementAccess:
                        data[i].SupplierManagementAccess,
                      //siteID: data[i].value,
                      siteID: data[i].SiteID,
                    });
                    this.props.storeSupplierManagement(
                      data[i].SupplierManagementAccess,
                    );
                  }
                console.log('data1', data);
                this.props.storeSiteId(value);
                await this.updateSiteId(value)
              }}
              selectedItems={[this.state.siteID]}
            />

            {/* <View
              style={{
                flex: 1,
                padding: 25,
                width: "98%",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                  <Text style={{ padding: 10 }}>{item.name} </Text>
                )}
                keyExtractor={(item) => item.SiteName}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
              />
            </View> */}
            <View
              style={{
                margin: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                flexDirection: 'row',
                borderBottomWidth: 0.8,
                borderBottomColor: 'lightgrey',
                marginTop: -5,
                paddingBottom: 7,
              }}>
              <View style={styles.detailTitle}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  Registration Device
                </Text>
                <Text style={styles.offlineDesc}>
                  {this.props.data.audits.serverUrl}
                </Text>
              </View>
            </View>
            <View
              style={{
                margin: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: -5,
                paddingBottom: 7,
              }}>
              <View style={styles.detailTitle}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  {strings.OfflineMode}
                </Text>
                <Text style={styles.offlineDesc}>
                  {strings.OfflineModeDesc}
                </Text>
              </View>
              <Switch
                style={[styles.switchElement,{marginTop:5}]}
                value={this.state.enableOffline}
                onValueChange={debounce(this.changeOfflineMode.bind(this), 600)}
              />
            </View>
            <View style={{ //flex: 0.1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: -5,
                            paddingBottom: 7,
                          }}>
                <TouchableOpacity  style={{flex: 5, flexDirection: 'row', marginLeft:10}}  onPress={this.checkAppVersion.bind(this)}>
                  <View>
                  <Icon name='arrow-circle-o-down' size={25} />
                  </View>
                  <View>
                  <Text style={{fontFamily: 'OpenSans-Regular', fontSize:15 , paddingLeft:5, marginTop:2}}>
                    Check for Update
                  </Text>
                  </View>
                </TouchableOpacity>
            
            </View>
          </View>
          {/* </ScrollableTabView> */}
        </ImageBackground>

        {/** --------footer------ */}
        <TouchableOpacity
          onPress={() => this.onSave()}
          style={[styles.footer, {display: 'none'}]}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                width: width(45),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="save" size={25} color="white" />
              <Text
                style={{
                  color: 'white',
                  fontSize: Fonts.size.regular,
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Save}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <Toast
          ref={(toast) => this.toast = toast}
          style={{backgroundColor: 'black', margin: 20}}
          position="top"
          positionValue={300}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
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
    storeDateFormat: userDateFormat =>
      dispatch({type: 'STORE_DATE_FORMAT', userDateFormat}),
    changeOfflineModeState: isOfflineMode =>
      dispatch({type: 'CHANGE_OFFLINE_MODE_STATE', isOfflineMode}),
    storeSupplierData: smdata =>
      dispatch({type: 'STORE_SUPPLIER_DATA', smdata}),
    storeSiteId: siteId =>
      dispatch({type: 'STORE_SITE_ID', siteId}),
    supplierMange: supplierMangeT =>
      dispatch({type: 'STORE_SUPPLY_MANAGE', supplierMangeT}),
    storeSupplierManagement: suppliermanagementstatus =>
      dispatch({type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPreference);
