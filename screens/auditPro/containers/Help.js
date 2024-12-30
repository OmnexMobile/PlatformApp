import React, { Component } from 'react'
import { View, Image, Text, ImageBackground, Platform, TouchableOpacity, Dimensions } from 'react-native'
import styles from '../styles/HelpStyles'
import OfflineNotice from '../components/OfflineNotice'
import { Images } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../language/Language'
import { WebView } from 'react-native-webview';
import { ROUTES } from 'constants/app-constant'
import { SPACING } from 'constants/theme-constants'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Help extends Component {

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
                <OfflineNotice />
                <View style={styles.headerCont}>
                    <ImageBackground
                        source={Images.DashboardBG}
                        style={styles.bgCont}>
                        {this.renderHeader()}
                    </ImageBackground>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <WebView useWebKit={true} source={{ uri: 'https://www.omnexsystems.com/phone-support' }}
                        style={{ width: deviceWidth, height: deviceHeight }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true} />
                </View>
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={{flex:1,
                flexDirection:'row',justifyContent:'space-between',marginRight:10,marginLeft:40,marginBottom:10}}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.backlogo}>
                        <Icon name="angle-left" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>{strings.help}</Text>
                </View>
                <View style={styles.headerDiv}>
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.navigation.navigate(ROUTES.AUDITPRODASHBOARD)}>
                        <Icon name="home" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Help;