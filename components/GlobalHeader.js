import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const GlobalHeader = ({
  title,
  subtitle,
  onLeftPress,
  leftIcon = 'arrow-left',
  leftIconColor = '#00b3d6',
  onRightPress,
  rightIcon = 'home',
  rightIconColor = '#00b3d6',
  containerStyle,
  titleStyle,
  subtitleStyle,
  hideLeft = false,
  hideRight = false,
  rightComponent,
}) => {
  const renderLeft = () =>
    hideLeft || !leftIcon ? (
      <View style={styles.iconPlaceholder} />
    ) : (
      <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
        <Icon name={leftIcon} size={24} color={leftIconColor} />
      </TouchableOpacity>
    );

  const renderRight = () => {
    if (rightComponent) {
      return rightComponent;
    }
    return hideRight || !rightIcon ? (
      <View style={styles.iconPlaceholder} />
    ) : (
      <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
        <Icon name={rightIcon} size={24} color={rightIconColor} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLeft()}
      <View style={styles.titleContainer}>
        {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, subtitleStyle]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {renderRight()}
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#5f6a7a',
  },
  iconButton: {
    padding: 6,
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
  },
});

export default GlobalHeader;
