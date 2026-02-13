import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import Fonts from '../Themes/Fonts';

/**
 * Lightweight shared input for the Create NC flow.
 * Supports text and dropdown types with consistent label/error styling.
 */
const NCFormInput = ({
  type = 'text',
  label,
  value,
  placeholder,
  onChangeText,
  data = [],
  error,
  required = false,
  containerStyle,
  inputStyle,
  dropdownProps = {},
  multiline = false,
  editable = true,
  baseColor = '#A6A6A6',
}) => {
  const renderLabel = () =>
    label ? (
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
    ) : null;

  const renderError = () =>
    error ? <Text style={styles.error}>{error}</Text> : null;

  if (type === 'dropdown') {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderLabel()}
        <Dropdown
          {...dropdownProps}
          data={data}
          value={value}
          onChangeText={onChangeText}
          baseColor={baseColor}
          selectedItemColor="black"
          textColor="black"
          itemColor="black"
          fontSize={Fonts.size.regular}
          labelFontSize={Fonts.size.small}
          itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
        />
        {renderError()}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#A6A6A6"
      />
      {renderError()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: Fonts.size.small,
    color: '#A6A6A6',
    fontFamily: 'OpenSans-Regular',
    marginBottom: 4,
  },
  required: {
    color: 'red',
  },
  input: {
    fontSize: Fonts.size.regular,
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    paddingVertical: 6,
  },
  error: {
    marginTop: 4,
    color: 'red',
    fontSize: Fonts.size.small,
    fontFamily: 'OpenSans-Regular',
  },
});

export default NCFormInput;
