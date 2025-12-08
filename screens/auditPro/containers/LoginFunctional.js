import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InputField from '../Components/Shared/InputField';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {strings} from '../Language/Language';

const LoginFunctional = () => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.33}}></View>
      <View style={{flex: 0.33}}>
        <View>
          <InputField
            placeholder={strings.Username}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
          //  value={this.state.username}
            // onChangeText={username => this.setState({username})}
            // onBlur={this.usrFieldVal}
            type={'Username'}
          />
        </View>
        <View>
          <InputField
            placeholder={strings.Password}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            //  value={this.state.password}
            //   onChangeText={password => this.setState({password})}
            secureTextEntry
            type={'Password'}
          />
        </View>
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: '#2EA4E2',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 10,
              marginLeft: 20,
              marginRight: 20,
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>
              {'Login'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.33}}></View>
    </View>
  );
};

export default LoginFunctional;

const styles = StyleSheet.create({});
