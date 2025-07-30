import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import styles from "./styles/HelpStyles";
import OfflineNotice from "../components/OfflineNotice";
import { Images } from "../themes";
import Icon from "react-native-vector-icons/FontAwesome";
import { strings } from "../language/Language";
import { WebView } from "react-native-webview";
import { ROUTES } from "constants/app-constant";
import { SPACING } from "constants/theme-constants";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class Help extends Component {
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.MEDIUM, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }
        <OfflineNotice />
        {this.renderHeader()}
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WebView
            source={{ uri: "https://www.omnexsystems.com/contact.aspx" }}
            style={{ width: deviceWidth, height: deviceHeight }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </View>
      </View>
    );
  }

  renderHeader() {
    return (
      <ImageBackground source={Images.headerBG} style={styles.header}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={styles.backlogo}>
              <Icon name="angle-left" size={40} color="white" />
              <Text style={styles.LabelText}>{strings.Back}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{strings.help}</Text>
          </View>
          <View style={styles.headerDiv}>
            <TouchableOpacity
              style={{ paddingRight: 20 }}
              onPress={() => this.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD)}
            >
              <Icon name="home" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
