import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Platform,
  Linking,
  navigator,
  geolocation,
  ImageBackground,
} from 'react-native';
import {Images} from '../Themes/index';
import {connect} from 'react-redux';
import styles from '../styles/ProfileStyle';
import {width} from 'react-native-dimension';
import AuditHeader from '../components/AuditHeader';
import ResponsiveImage from 'react-native-responsive-image';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts';
import {strings} from '../language/Language';
// import Geocoder from 'react-native-geocoder';
import {Googel_API_KEY} from '../constants/AppConstants';
import {debounce, once} from 'underscore';
import { ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';

let Window = Dimensions.get('window');

class Profile extends Component {
  constructor(props) {
    super(props);
    console.log('props--->', props)
    this.state = {
      Address: '',
      CompanyName: '',
      CompanyUrl: '',
      Logo: '',
      Phone: '',
      username: '',
      isVisible: false,
    };
  }

  componentDidMount() {
    // console.log('Profile page mounted',this.props.data.audits)
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    this.setState(
      {
        username: this.props.data.audits.userName,
        CompanyName: this.props.data.audits.companyname,
        CompanyUrl: this.props.data.audits.companyurl,
        Logo: this.props.data.audits.logo,
        Address: this.props.data.audits.address,
        Phone: this.props.data.audits.phone,
      },
      () => {
        // console.log('Address data',this.state.Address)
        // console.log('userName data',this.state.username)
        // console.log('companyname data',this.state.CompanyName)
        // console.log('Logo logo',this.state.Logo)
        // console.log('Phone data',this.state.Phone)
        // console.log('CompanyUrl data',this.state.CompanyUrl)
      },
    );
  }

  redirectGoogle() {
    console.log('Redirecting to google map...', Platform);

  }

  render() {
    const logoSource = this.state.Logo
      ? {uri: this.state.Logo.startsWith('data:') || this.state.Logo.startsWith('http') || this.state.Logo.startsWith('file:') ? this.state.Logo : `data:image/png;base64,${this.state.Logo}`}
      : Images.OmnexLogo;
    const companyName = this.state.CompanyName || 'OmnexSystems';
    const companyUrl = this.state.CompanyUrl || 'http://www.omnexsystems.com';
    const phone = this.state.Phone || '(734) 761-4940';
    const address = this.state.Address || '3025 Boardwalk Suite 290, Ann Arbor, MI 48108';
    const InfoCard = ({icon, label, value, onPress}) => (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={{marginBottom: 24}}>
        <View
          style={{
            minHeight:120,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            shadowColor: '#7A8AA8',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.12,
            shadowRadius: 18,
            elevation: 5,
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 24,
              backgroundColor: '#1465F4',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 28,
            }}>
            <Icon name={icon} size={42} color="#FFFFFF" />
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'OpenSans-Regular', fontSize: 18, color: '#6B7890', marginBottom: 6}}>{label}</Text>
            <Text
              numberOfLines={3}
              style={{fontFamily: 'OpenSans-Bold', fontSize: 18, lineHeight: 29, color: '#1769EC'}}>
              {value}
            </Text>
          </View>
          <Icon name="angle-right" size={28} color="#7B879B" />
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{flex: 1, backgroundColor: '#F8FAFE'}}>
        <View pointerEvents="none" style={{position: 'absolute', top: 0, left: 0, right: 0, height: 365, backgroundColor: '#1165E9'}} />
        <View pointerEvents="none" style={{position: 'absolute', top: 315, left: -40, width: '115%', height: 130, backgroundColor: '#F8FAFE', borderRadius: 100, transform: [{rotate: '6deg'}]}} />
          <View style={{paddingTop: Platform.OS === 'ios' ? 58 : 28, paddingHorizontal: 28}}>
           
            <View style={{alignItems: 'center', marginTop: 48}}>
              <View style={{width: 220, height: 220, borderRadius: 110, backgroundColor: '#FFFFFF', borderWidth: 10, borderColor: '#3F8AF7', justifyContent: 'center', alignItems: 'center', shadowColor: '#1456C7', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8}}>
                <Image source={logoSource} resizeMode="contain" style={{width: 170, height: 170}} />
              </View>
              <Text style={{fontFamily: 'OpenSans-Bold', fontSize: 24, color: '#123C95', marginTop: 28, textAlign: 'center'}}>{companyName}</Text>
              <Text style={{fontFamily: 'OpenSans-Regular', fontSize: 21, color: '#718099', marginTop: 6}}>Company Information</Text>
              <View style={{width: 126, height: 4, borderRadius: 2, backgroundColor: '#1465F4', marginTop: 18}} />
            </View>
          </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
          <View style={{paddingHorizontal: 28, marginTop: 42}}>
            <InfoCard icon="globe" label="Company URL" value={companyUrl} onPress={() => Linking.openURL(companyUrl)} />
            <InfoCard icon="phone" label="Phone" value={phone} onPress={() => Linking.openURL(`tel:${phone}`)} />
            <InfoCard icon="map-marker" label="Address" value={address} onPress={() => this.redirectGoogle()} />
          </View>
        </ScrollView>
        <View
          pointerEvents="box-none"
          style={{position: 'absolute', top: 0, left: 0, right: 0, height: 125, zIndex: 100, elevation: 100}}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => this.props.navigation.goBack()}
            style={{position: 'absolute', top: Platform.OS === 'ios' ? 58 : 28, left: 28, padding: 8}}>
            <Icon name="angle-left" size={42} color="#FFFFFF" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            style={{position: 'absolute', top: Platform.OS === 'ios' ? 58 : 28, right: 28, padding: 8}}>
            <Icon name="home" size={38} color="#FFFFFF" />
          </TouchableOpacity> */}
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
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
