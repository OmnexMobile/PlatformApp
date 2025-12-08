import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddProcessScreen = ({ navigation }) => {
  const dummyProcesses = [
    { id: 'd1', name: 'Inspection' },
    { id: 'd2', name: 'Welding' },
    { id: 'd3', name: 'Painting' },
    { id: 'd4', name: 'Assembly' },
  ];

  const [processName, setProcessName] = useState('');
  const [customProcesses, setCustomProcesses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedProcessId, setSelectedProcessId] = useState(null);

  const fullProcessList = [...dummyProcesses, ...customProcesses];
  const filteredList = fullProcessList.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addProcess = () => {
    if (processName.trim()) {
      const newProcess = {
        id: Date.now().toString(),
        name: processName.trim(),
      };
      setCustomProcesses([...customProcesses, newProcess]);
      setProcessName('');
      setModalVisible(false);
    }
  };

  const saveSelectedProcess = () => {
    const selected = fullProcessList.find(p => p.id === selectedProcessId);
    if (selected) {
      console.log('Saved Process:', selected);
      // You can return to previous screen or do something with selected process
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Process</Text>
        <View style={{ flexDirection: 'row',justifyContent:'space-evenly',alignContent:'flex-end' }}>
        <TouchableOpacity onPress={() => setSearchVisible((prev) => !prev)}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search process..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              item.id === selectedProcessId && styles.selectedItem,
            ]}
            onPress={() => setSelectedProcessId(item.id)}
          >
            <Text style={styles.listText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No processes found.</Text>}
      />

      {/* Save Selection Button */}
      {selectedProcessId && (
        <TouchableOpacity style={styles.saveSelectionButton} onPress={saveSelectedProcess}>
          <Text style={styles.saveSelectionText}>Save</Text>
        </TouchableOpacity>
      )}

      {/* Add Floating Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Process</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter process name"
              value={processName}
              onChangeText={setProcessName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addProcess}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddProcessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#15bae8',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#cceeff',
    borderWidth: 1,
    borderColor: '#15bae8',
  },
  listText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  saveSelectionButton: {
    backgroundColor: '#15bae8',
    margin: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveSelectionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#15bae8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#15bae8',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
