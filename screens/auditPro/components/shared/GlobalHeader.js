import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GlobalHeader = ({
  title,
  onLeftPress,
  leftIcon,
  onRightPress,
  rightIcon,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLeftPress} style={styles.leftIconContainer}>
        <Icon name={leftIcon} size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onRightPress}
        style={styles.rightIconContainer}>
        <Icon name={rightIcon} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftIconContainer: {
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingRight: 8,
  },

});

export default GlobalHeader;