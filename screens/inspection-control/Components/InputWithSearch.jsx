import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const InputWithSearch = ({ placeholder, onSearch }) => {
  return (
    <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder={placeholder || 'Search...'}
      placeholderTextColor="#888"
      onChangeText={onSearch}
    />
    <Icon name="search" size={20} color="#888" style={styles.icon} />
  </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#fff',
      marginLeft:20
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      height:30,
    },
  });

export default InputWithSearch