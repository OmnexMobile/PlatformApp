import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const LogoutPresentational = ({ navigation, handleLogout }) => {

  const onCancel = () => {
    navigation.goBack();
  };

  const onConfirm = () => {
    handleLogout();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.alertBox}>
        <Text style={styles.title}>Confirm Logout</Text>
        <Text style={styles.message}>
          Are you sure you want to logout?
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelBtn]}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>No</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutBtn]}
            onPress={onConfirm}
          >
            <Text style={styles.logoutText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(LogoutPresentational);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: '#123C95',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
