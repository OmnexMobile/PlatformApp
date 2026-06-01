import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const HtmlImageViewer = ({ base64String }) => {
  // Wrap the base64 string in an HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body>
        <img src="data:image/png;base64,${base64String}" style="width: 100%; height: auto;" />
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView 
        originWhitelist={['*']} 
        source={{ html: htmlContent }} 
        style={styles.webview} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default HtmlImageViewer;
