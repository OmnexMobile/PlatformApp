import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class TokenValidation extends Component {
  constructor(props) {
    super(props);
    console.log("get props--->", props);
    this.state = {
      oldToken: 'oldToken123',  // This can be fetched or passed via props
      newToken: null,
      tokensAreEqual: false,
    };
  }

  componentDidMount() {
    // Simulate fetching a new token when the component mounts
    this.fetchNewToken();
  }

  async fetchNewToken() {
    try {
      // Using fetch to simulate an API call that returns a new token
      const response = await fetch(); // Replace with actual API
      const data = await response.json();
      
      const newToken = data.token;  // Assuming the API response returns { token: 'newToken123' }

      // Store new token in state
      this.setState({ newToken }, () => {
        this.compareTokens();
      });
      
    } catch (error) {
      console.error('Error fetching new token:', error);
    }
  }

  compareTokens() {
    const { oldToken, newToken } = this.state;

    // Compare the tokens
    if (oldToken && newToken && oldToken === newToken) {
      this.setState({ tokensAreEqual: true });
    } else {
      this.setState({ tokensAreEqual: false });
    }
  }

  render() {
    const { oldToken, newToken, tokensAreEqual } = this.state;

    return (
      <View>
        <Text>Old Token: {oldToken}</Text>
        <Text>New Token: {newToken || 'Fetching new token...'}</Text>
        <Text>Tokens are {tokensAreEqual ? 'equal' : 'not equal'}.</Text>
      </View>
    );
  }
}

export default TokenValidation;