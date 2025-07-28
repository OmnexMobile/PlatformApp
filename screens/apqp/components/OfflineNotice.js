import React, { Component } from "react";
import { View, Text } from "react-native";
import styles from "./styles/OfflineNoticeStyle";
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../language/Language";
import { create } from "apisauce";
import * as constant from "../../../constants/Apqp/AppConstants";

let netListener = null;

MiniOfflineSign = () => {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{strings.NoInternet}</Text>
    </View>
  );
};

MiniSlowInternetSign = () => {
  return (
    <View style={styles.slowconnectionContainer}>
      <Text style={styles.offlineText}>{strings.SlowInternet}</Text>
    </View>
  );
};

MiniOfflineModeNotice = () => {
  return (
    <View style={styles.offlineModeContainer}>
      <Text style={styles.offlineText}>{strings.OfflineModeActivated}</Text>
    </View>
  );
};

class OfflineNotice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isLowConnection: false,
      baseURL: this.props.data.projects.serverUrl
        ? this.props.data.projects.serverUrl
        : this.props.data.projects.serverUrl,
    };
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    this.checkInternetStateStartup();
    netListener = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      if (!this.props.data.projects.isOfflineMode) {
        this.props.changeConnectionState(state.isConnected);
        this.setState({ isConnected: state.isConnected });
      } else {
        this.props.changeConnectionState(false);
        this.setState({ isConnected: false });
      }
    });

    // NetInfo.addEventListener("connectionChange", this.handleConnectivityChange);
    console.log("Event added.");
    //this.checkInternetConnection()
  }

  checkInternetConnection() {
    const check = create({
      baseURL: this.state.baseURL + "CheckConnection",
    });
    check.post().then((response) => {
      console.log("Download offline response", response);
      if (response.duration > constant.ThresholdSpeed) {
        this.setState(
          {
            isLowConnection: true,
          },
          () => {
            console.log("Low network", this.state.isLowConnection);
          }
        );
      }
    });
  }

  componentWillUnmount() {
    // NetInfo.removeEventListener(
    //   "connectionChange",
    //   this.handleConnectivityChange
    // );
    if (netListener) {
      netListener();
      netListener = null;
    }
    console.log("Event removed.");
  }

  checkInternetStateStartup() {
    if (this.props.data.projects.isOfflineMode) {
      this.setState({
        isConnected: false,
      });
    } else {
      NetInfo.fetch().then((netStatus) => {
        if (netStatus.isConnected) {
          this.setState({
            isConnected: true,
          });
        } else {
          this.setState({
            isConnected: false,
          });
        }
      });
    }
  }

  componentWillReceiveProps() {
    this.checkInternetStateStartup();
  }

  handleConnectivityChange = (isConnected) => {
    if (!this.props.data.projects.isOfflineMode) {
      this.props.changeConnectionState(isConnected);
      this.setState({ isConnected });
    } else {
      this.props.changeConnectionState(false);
      this.setState({ isConnected: false });
    }
  };

  render() {
    if (!this.props.data.projects.isOfflineMode && !this.state.isConnected) {
      return <MiniOfflineSign />;
    } else if (this.props.data.projects.isOfflineMode) {
      return <MiniOfflineModeNotice />;
    } else if (this.state.isLowConnection == true) {
      return <MiniSlowInternetSign />;
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeConnectionState: (isConnected) =>
      dispatch({ type: "CHANGE_CONNECTION_STATE", isConnected }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice);
