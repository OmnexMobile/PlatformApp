import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList ,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ApprovalStatusModal = ({setModalVisible}) => {

  const data = [
    {
      round: 1,
      minApprovals: 1,
      approvers: 'Vasudevan Yamunadevi',
      isMandatory: 'Yes',
      date: '',
      comments: '',
      status: 'In Process',
    },
    
  ];

  return (
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
        <Text style={styles.tableTitle}>Status of Approval</Text>

        {/* Scrollable Table */}
        <ScrollView horizontal={true} style={styles.tableContainer}>
            <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Round</Text>
                    <Text style={styles.tableHeaderCell}>Minimum Approvals</Text>
                    <Text style={styles.tableHeaderCell}>Approvers</Text>
                    <Text style={styles.tableHeaderCell}>Is Mandatory?</Text>
                    <Text style={styles.tableHeaderCell}>Date</Text>
                    <Text style={styles.tableHeaderCell}>Approval Comments</Text>
                    <Text style={styles.tableHeaderCell}>Status</Text>
                </View>

                {/* Table Rows */}
                {data.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{item.round}</Text>
                        <View></View>
                        <Text style={styles.tableCell}>{item.minApprovals}</Text>
                        <Text style={styles.tableCell}>{item.approvers}</Text>
                        <Text style={styles.tableCell}>{item.isMandatory}</Text>
                        <Text style={styles.tableCell}>{item.date || '-'}</Text>
                        <Text style={styles.tableCell}>{item.comments || '-'}</Text>
                        <Text style={styles.tableCell}>{item.status}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>

        {/* Close Modal Button */}
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Icon name="close" size={24} color="#00c3d2" style={{ marginLeft: 10 }}></Icon>
        </TouchableOpacity>
    </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
openButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
},
buttonText: {
    color: '#fff',
    fontSize: 16,
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
},
modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
},
tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color:'black'
},
tableContainer: {
    flexDirection: 'row',
    marginBottom: 10,
},
tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00c3d2',
    padding: 5,
},
tableHeaderCell: {
    width: 150, // Set a fixed width for each column
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    color:'black'
},
tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
},
tableCell: {
    width: 150, // Same width as header for alignment
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    color:'black'

},
closeButton: {
    marginTop: 10,
    padding: 10,
    // backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'center',
},
});

export default ApprovalStatusModal;
