import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Content, Header, TextComponent } from 'components'; // Assuming you have these components
import useTheme from 'theme/useTheme';
import { SPACING } from 'constants/theme-constants';
import { successMessage } from 'helpers/utils';
import { useAppContext } from 'contexts/app-context';

const TimeSettings = ({ }) => {
  const { theme } = useTheme();
  const { handleAppSetting, timeSettings } = useAppContext();

  const handleFormatSelection = (format) => {
    handleAppSetting('timeSettings', format);
    successMessage({ message: 'Success', description: 'Time format updated successfully' });
  };

  return (
    <Content noPadding>
      <Header title="Settings" />
      <View style={styles.container}>
        <TextComponent style={styles.title}>Select Time Format</TextComponent>
        <View style={styles.formatContainer}>
          {timeFormats.map((format) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.formatButton,
                timeSettings === format && {
                    backgroundColor: theme.colors.primaryThemeColor,
                    borderColor: theme.colors.primaryThemeColor,
                },
              ]}
              onPress={() => handleFormatSelection(format)}
            >
              <TextComponent style={styles.formatText}>{format}</TextComponent>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Content>
  );
};

const timeFormats = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'DD-MM-YYYY',
  'MM-DD-YYYY',
  'DD/MMM/YYYY',
  'DD-MMM-YYYY',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.SMALL,
  },
  formatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.X_SMALL,
  },
  formatButton: {
    padding: SPACING.SMALL,
    width: '32%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: SPACING.X_SMALL,
    alignItems: 'center'
  },
  selectedFormat: {
  },
  formatText: {
  },
});

export default TimeSettings;