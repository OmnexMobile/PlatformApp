import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const OnlineFileViewer = ({ fileUrl }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (error) => {
    setIsLoading(false);
    setError(error);
    Alert.alert('Error', 'Failed to load the file. Please try again.');
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={styles.loader} size="large" color="gray" />}

      {error ? (
        <Text style={styles.errorText}>Error: Failed to load the file. Please try again.</Text>
      ) : (
        <Image
          source={{ uri: fileUrl }}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
    </View>
  );
};

const OpenDocumentScreen = () => {
  const fileUrl = 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-download-10-mb.pdf'; // Replace with your online file URL

  return (
    <View style={styles.container}>
      <OnlineFileViewer fileUrl={fileUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  loader: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default OpenDocumentScreen;
