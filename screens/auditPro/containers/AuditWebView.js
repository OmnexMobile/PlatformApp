import React, { Component } from 'react';
import { Linking, Modal, View, Text, Button,TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
//  import { TouchableOpacity } from 'react-native-gesture-handler';
import { ROUTES } from 'constants/app-constant';

export default class WebViewThatOpensLinksInNavigator extends Component {
  constructor(props) {
    super(props);
    console.log('get props --->', this.props)
    this.state = {
      // isShowModal : this.props.navigation?.state?.params?.isShowModal
      isShowModal : this.props?.route?.params?.isShowModal
    };
  }
  componentDidMount() {
    setTimeout(() => {
      // this.props.navigation.goBack();
    }, 5000);
  }

  goback() {
    console.log('goback====>clicked')
    this.setState({ isShowModal: false })
    // this.props.navigation.goBack();
    this.props.navigation.navigate(ROUTES.AUDIT_PAGE, {})
    console.log('goback====>clicked')
  }

  render() {
    console.log('navi====>', this.props, this.state.isShowModal, this.props?.route?.params?.isShowModal);
    const uri = this.props?.route?.params?.WebviewUrl;
    console.log('current uri--->', uri)
    if (this.state.isShowModal) {
      return (
        <View style={{
          flex:1,
        
        }}>
          <View style={{padding:20}}>
            <TouchableOpacity onPress={() => this.goback()}>
              <Icon name="angle-left" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <WebView style={{ flex: 1 }}
            ref={ref => {
              this.webview = ref;
            }}
            source={{ uri }}
            onNavigationStateChange={event => {
              if (event.url !== uri) {
                this.webview.stopLoading();
                Linking.openURL(event.url);
              }
            }}
          />
        </View>
      )
    }
    return null
  }
}
