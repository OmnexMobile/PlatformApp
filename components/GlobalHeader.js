import React, {useContext} from 'react';
import {Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaInsetsContext, initialWindowMetrics} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const HEADER_VERTICAL_PADDING = 12;

const GlobalHeader = ({
  title,
  subtitle,
  onLeftPress,
  leftIcon = 'arrow-left',
  leftIconColor = '#123C95',
  onRightPress,
  rightIcon = 'home',
  rightIconColor = '#123C95',
  containerStyle,
  titleStyle,
  subtitleStyle,
  hideLeft = false,
  hideRight = false,
  rightComponent,
  extraRightIcon,
  onExtraRightPress,
  extraRightIconColor = '#123C95',
  hideExtraRight = false,
  includeTopInset = true,
}) => {
  const contextInsets = useContext(SafeAreaInsetsContext);
  const fallbackInsets = initialWindowMetrics?.insets || {};
  const topInset = includeTopInset
    ? Math.max(
        contextInsets?.top || 0,
        fallbackInsets.top || 0,
        Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
      )
    : 0;

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

  const renderExtraRight = () =>
    hideExtraRight || !extraRightIcon ? (
      <View  />
    ) : (
      <TouchableOpacity onPress={onExtraRightPress} style={styles.iconButton}>
        <Icon name={extraRightIcon} size={24} color={extraRightIconColor} />
      </TouchableOpacity>
    );

  return (
    <View
      style={[
        styles.container,
        {paddingTop: HEADER_VERTICAL_PADDING + topInset},
        containerStyle,
      ]}>
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
      {renderExtraRight()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignContent: 'center',
    alignSelf: 'stretch',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    includeFontPadding: false,
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
