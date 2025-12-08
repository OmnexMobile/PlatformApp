import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const AddEditReport = ({navigation}) => {
  const [supplier, setSupplier] = useState('');
  const [supplierNo, setSupplierNo] = useState('');
  const [dunsNo, setDunsNo] = useState('');
  const [dateOfSubmission, setDateOfSubmission] = useState('');
  const [location, setLocation] = useState('');
  const [auditRequest, setAuditRequest] = useState('');
  const [shift, setShift] = useState('');
  const [department, setDepartment] = useState('');
  const [auditReason, setAuditReason] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [auditCertificate, setAuditCertificate] = useState('');
  const [SeniorManagement, setSeniorManagement] = useState('');
  const [Plantmanagement, setPlantmanagement] = useState('');
  const [qmanagement, setqmanagement] = useState('');
  const [approver, setApprover] = useState('');
  const [reviewer, setReviewer] = useState('');

  const supplierOptions = [
    {label: 'Supplier A', value: 'supplierA'},
    {label: 'Supplier B', value: 'supplierB'},
    {label: 'Supplier C', value: 'supplierC'},
  ];
  const SeniorManagementArray = [
    {label: 'Supplier A', value: 'supplierA'},
    {label: 'Supplier B', value: 'supplierB'},
    {label: 'Supplier C', value: 'supplierC'},
  ]

  const richText = useRef();
  const [richTextContent, setRichTextContent] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add / Edit Report</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Supplier</Text>
        <Dropdown
          style={styles.dropdown}
          data={supplierOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          value={supplier}
          onChange={item => setSupplier(item.value)}
        />

        <Text style={styles.label}>Supplier No</Text>
        <TextInput
          style={styles.input}
          value={supplierNo}
          onChangeText={setSupplierNo}
          placeholder="Enter Supplier No"
        />

        <Text style={styles.label}>D.U.N.S No</Text>
        <TextInput
          style={styles.input}
          value={dunsNo}
          onChangeText={setDunsNo}
          placeholder="Enter D.U.N.S No"
        />

        <Text style={styles.label}>Date of Submission</Text>
        <TextInput
          style={styles.input}
          value={dateOfSubmission}
          onChangeText={setDateOfSubmission}
          placeholder="Enter Date of Submission"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter Location"
        />

        <Text style={styles.label}>Audit Request</Text>
        <TextInput
          style={styles.input}
          value={auditRequest}
          onChangeText={setAuditRequest}
          placeholder="Enter Audit Request"
        />

        <Text style={styles.label}>Shift</Text>
        <TextInput
          style={styles.input}
          value={shift}
          onChangeText={setShift}
          placeholder="Enter Shift"
        />

        <Text style={styles.label}>Department</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
          placeholder="Enter Department"
        />

        <Text style={styles.label}>Audit Reason</Text>
        <TextInput
          style={styles.input}
          value={auditReason}
          onChangeText={setAuditReason}
          placeholder="Enter Audit Reason"
        />

        <Text style={styles.label}>Order No</Text>
        <TextInput
          style={styles.input}
          value={orderNo}
          onChangeText={setOrderNo}
          placeholder="Enter Order No"
        />

        <Text style={styles.label}>Audit Certificate</Text>
        <TextInput
          style={styles.input}
          value={auditCertificate}
          onChangeText={setAuditCertificate}
          placeholder="Enter Audit Certificate"
        />
        <Text style={styles.label}>Senior Management</Text>
        <SectionedMultiSelect
          styles={{
            chipContainer: { backgroundColor: '#15bae8' },
            selectedItemText: { color: '#15bae8' },
            selectToggleText: { fontSize: 16 },
          }}
         IconRenderer={Icon}
          items={[
            {
              name: 'SeniorManagement',
              id: 0,
              children: SeniorManagementArray, 
            },
          ]}
          uniqueKey="id"
          subKey="children"
          selectText="Select Suppliers"
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={selected => setSeniorManagement(selected)}
          selectedItems={SeniorManagement}
        />
        <Text style={styles.label}>Plant Management</Text>
        <Dropdown
          style={styles.dropdown}
          data={supplierOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          value={supplier}
          onChange={item => setPlantmanagement(item.value)}
        />
        <Text style={styles.label}>Q-management</Text>
        <Dropdown
          style={styles.dropdown}
          data={supplierOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          value={supplier}
          onChange={item => setqmanagement(item.value)}
        />
        <Text style={styles.label}>Supplier</Text>
        <Dropdown
          style={styles.dropdown}
          data={supplierOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          value={supplier}
          onChange={item => setApprover(item.value)}
        />
        <Text style={styles.label}>Reviewer</Text>
        <Dropdown
          style={styles.dropdown}
          data={supplierOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          value={supplier}
          onChange={item => setReviewer(item.value)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={styles.label}>
            Statements / Requirements / Significant Findings / Further Action
          </Text>
          <RichEditor
            ref={richText}
            style={styles.richEditor}
            placeholder="Write your comments here..."
            onChange={text => setRichTextContent(text)}
          />
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
            ]}
            iconTint="black"
            selectedIconTint="blue"
            selectedButtonStyle={{backgroundColor: 'transparent'}}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddEditReport;

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
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    justifyContent: 'center',
  },
  richEditor: {
    minHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
