// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import Voice from '@react-native-community/voice';

// const VoiceAssist = () => {
//   const [result, setResult] = useState('');
//   const [isLoading, setLoading] = useState(false);

//   useEffect(() => {
//     console.log('reach voice loading')
//     Voice.onSpeechStart = () => {
//       setLoading(true);
//     };

//     Voice.onSpeechResults = (e) => {
//       setResult(e.value);
//     };

//     Voice.onSpeechEnd = () => {
//       setLoading(false);
//     };

//     return () => {
//       Voice.destroy();
//     };
//   }, []);

//   const startSpeechRecognizing = async () => {
//     try {
//       await Voice.start('en-US');
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopSpeechRecognizing = async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.result}>{result}</Text>
//       <Button title="Start" onPress={startSpeechRecognizing} />
//       <Button title="Stop" onPress={stopSpeechRecognizing} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'red'
//   },
//   result: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default VoiceAssist;


import React, { Component } from "react";
import { Text, View, Button } from 'react-native';
import Voice from "@react-native-community/voice";

class VoiceAssist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }

  componentWillUnmount() {
    if (Voice.isAvailable) Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStartHandler(e) {
    this.setState({
      text: "Listening...",
    });
  }

  onSpeechEndHandler(e) {
    this.setState({
      text: "Done listening.",
    });
  }

  onSpeechResultsHandler(e) {
    console.log('voice---> onSpeechResultsHandler', e.value)
    this.setState({
      text: e.value,
    });
  }

  onStartButtonPress(e) {
    Voice.start("en-US");
  }

  onStopButtonPress() {
    try {
      Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    console.log('voice---> this.state.text', this.state.text)
    return (
      <View style={{ marginTop: 50}}>
        <Text>Text---{this.state.text}</Text>
        <Button title="Start Speech Recognition" onPress={this.onStartButtonPress} />
        <Button title="Stop Speech Recognition" onPress={this.onStopButtonPress} />
      </View>
    );
  }
}

export default VoiceAssist;