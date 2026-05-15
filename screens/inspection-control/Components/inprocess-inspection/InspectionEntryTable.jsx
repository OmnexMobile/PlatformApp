import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const VISIBLE_COLUMNS = 2;

const initialData = [
  {
    id: '1',
    charNo: { value: 'PC001', isEditable: false },
    description: { value: 'Stem Length', isEditable: true },
    className: { value: 'Critical', isEditable: false },
    tolerance: { value: '3 ± 5', isEditable: true },
    gage: { value: 'Gage 01', isEditable: false },
    sampleSize: { value: '5', isEditable: true },
    sampleFreq: { value: '2 Hrs', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '3', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '4', isEditable: false },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: true },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
      { key: 'slot_4', label: '1 PM', value: '', isEditable: false },
    ],
  },

  {
    id: '2',
    charNo: { value: 'PC002', isEditable: false },
    description: { value: 'Pin Diameter', isEditable: true },
    className: { value: 'Major', isEditable: false },
    tolerance: { value: '1.5 ± 0.5', isEditable: true },
    gage: { value: 'Gage 02', isEditable: false },
    sampleSize: { value: '4', isEditable: true },
    sampleFreq: { value: '1 Hr', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '1.9', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '2.1', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '2.0', isEditable: false },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
    ],
  },

  {
    id: '3',
    charNo: { value: 'PC003', isEditable: false },
    description: { value: 'Outer Radius', isEditable: true },
    className: { value: 'Minor', isEditable: false },
    tolerance: { value: '5 ± 1', isEditable: true },
    gage: { value: 'Gage 03', isEditable: false },
    sampleSize: { value: '3', isEditable: true },
    sampleFreq: { value: '30 Min', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '5', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '5.2', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: false },
    ],
  },

  {
    id: '4',
    charNo: { value: 'PC004', isEditable: false },
    description: { value: 'Hole Diameter', isEditable: true },
    className: { value: 'Critical', isEditable: false },
    tolerance: { value: '10 ± 2', isEditable: true },
    gage: { value: 'Gage 04', isEditable: false },
    sampleSize: { value: '6', isEditable: true },
    sampleFreq: { value: '2 Hrs', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '9.8', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '10.1', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: true },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: false },
      { key: 'slot_4', label: '1 PM', value: '', isEditable: true },
      { key: 'slot_5', label: '2 PM', value: '', isEditable: true },
    ],
  },

  {
    id: '5',
    charNo: { value: 'PC005', isEditable: false },
    description: { value: 'Surface Finish', isEditable: true },
    className: { value: 'Major', isEditable: false },
    tolerance: { value: '0.8 ± 0.1', isEditable: true },
    gage: { value: 'Gage 05', isEditable: false },
    sampleSize: { value: '5', isEditable: true },
    sampleFreq: { value: '1 Hr', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '0.7', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: false },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: true },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
      { key: 'slot_4', label: '1 PM', value: '', isEditable: false },
    ],
  },

  {
    id: '6',
    charNo: { value: 'PC006', isEditable: false },
    description: { value: 'Thread Pitch', isEditable: true },
    className: { value: 'Minor', isEditable: false },
    tolerance: { value: '2 ± 0.2', isEditable: true },
    gage: { value: 'Gage 06', isEditable: false },
    sampleSize: { value: '4', isEditable: true },
    sampleFreq: { value: '45 Min', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '2', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: false },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
    ],
  },

  {
    id: '7',
    charNo: { value: 'PC007', isEditable: false },
    description: { value: 'Width Check', isEditable: true },
    className: { value: 'Critical', isEditable: false },
    tolerance: { value: '25 ± 1', isEditable: true },
    gage: { value: 'Gage 07', isEditable: false },
    sampleSize: { value: '3', isEditable: true },
    sampleFreq: { value: '2 Hrs', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '25', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: false },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: true },
    ],
  },

  {
    id: '8',
    charNo: { value: 'PC008', isEditable: false },
    description: { value: 'Height Validation', isEditable: true },
    className: { value: 'Major', isEditable: false },
    tolerance: { value: '18 ± 0.5', isEditable: true },
    gage: { value: 'Gage 08', isEditable: false },
    sampleSize: { value: '5', isEditable: true },
    sampleFreq: { value: '1 Hr', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '18', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: false },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
      { key: 'slot_4', label: '1 PM', value: '', isEditable: true },
    ],
  },

  {
    id: '9',
    charNo: { value: 'PC009', isEditable: false },
    description: { value: 'Weight Check', isEditable: true },
    className: { value: 'Minor', isEditable: false },
    tolerance: { value: '100 ± 5', isEditable: true },
    gage: { value: 'Gage 09', isEditable: false },
    sampleSize: { value: '4', isEditable: true },
    sampleFreq: { value: '30 Min', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: '98', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: false },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: true },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
    ],
  },

  {
    id: '10',
    charNo: { value: 'PC010', isEditable: false },
    description: { value: 'Visual Inspection', isEditable: true },
    className: { value: 'Critical', isEditable: false },
    tolerance: { value: 'OK / NOT OK', isEditable: true },
    gage: { value: 'Visual', isEditable: false },
    sampleSize: { value: '6', isEditable: true },
    sampleFreq: { value: '15 Min', isEditable: false },

    readings: [
      { key: 'slot_0', label: '9 AM', value: 'OK', isEditable: true },
      { key: 'slot_1', label: '10 AM', value: '', isEditable: true },
      { key: 'slot_2', label: '11 AM', value: '', isEditable: false },
      { key: 'slot_3', label: '12 PM', value: '', isEditable: true },
      { key: 'slot_4', label: '1 PM', value: '', isEditable: true },
      { key: 'slot_5', label: '2 PM', value: '', isEditable: false },
    ],
  },
];

const EditableCell = ({
  value,
  isEditable,
  onChangeText,
  keyboardType = 'default',
}) => {
  return (
    <TextInput
      value={String(value)}
      editable={isEditable}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={[
        styles.input,
        !isEditable && styles.disabledInput,
      ]}
    />
  );
};

const InspectionEntryTable = () => {
  const [data, setData] = useState(initialData);

  // current visible reading start index
  const [currentReadingIndex, setCurrentReadingIndex] =
    useState(0);

  // all unique headers
  const headers = useMemo(() => {
    const allHeaders = [];

    data.forEach(item => {
      item.readings.forEach(reading => {
        const exists = allHeaders.find(
          h => h.key === reading.key,
        );

        if (!exists) {
          allHeaders.push({
            key: reading.key,
            label: reading.label,
          });
        }
      });
    });

    return allHeaders;
  }, [data]);

  // visible reading columns
  const visibleHeaders = headers.slice(
    currentReadingIndex,
    currentReadingIndex + VISIBLE_COLUMNS,
  );

  // update normal field
  const updateField = (rowId, field, value) => {
    const updated = data.map(item => {
      if (item.id === rowId) {
        return {
          ...item,
          [field]: {
            ...item[field],
            value,
          },
        };
      }

      return item;
    });

    setData(updated);
  };

  // update reading
  const updateReading = (rowId, readingKey, value) => {
    const updated = data.map(item => {
      if (item.id === rowId) {
        return {
          ...item,
          readings: item.readings.map(reading => {
            if (reading.key === readingKey) {
              return {
                ...reading,
                value,
              };
            }

            return reading;
          }),
        };
      }

      return item;
    });

    setData(updated);
  };

  // header
  const renderHeader = () => {
    return (
      <>
        {/* NEXT BACK BUTTONS */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            disabled={currentReadingIndex === 0}
            onPress={() =>
              setCurrentReadingIndex(prev =>
                Math.max(
                  prev - VISIBLE_COLUMNS,
                  0,
                ),
              )
            }
            style={[
              styles.button,
              currentReadingIndex === 0 &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              currentReadingIndex +
                VISIBLE_COLUMNS >=
              headers.length
            }
            onPress={() =>
              setCurrentReadingIndex(
                prev => prev + VISIBLE_COLUMNS,
              )
            }
            style={[
              styles.button,
              currentReadingIndex +
                VISIBLE_COLUMNS >=
                headers.length &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* TABLE HEADER */}
        <View style={[styles.row, styles.headerRow]}>
          <Text
            style={[styles.headerCell, styles.charCell]}
          >
            Char No
          </Text>

          <Text
            style={[styles.headerCell, styles.descCell]}
          >
            Description
          </Text>

          <Text
            style={[styles.headerCell, styles.normalCell]}
          >
            Class
          </Text>

          <Text
            style={[styles.headerCell, styles.normalCell]}
          >
            Tolerance
          </Text>

          <Text
            style={[styles.headerCell, styles.normalCell]}
          >
            Gage
          </Text>

          <Text
            style={[styles.headerCell, styles.normalCell]}
          >
            Sample Size
          </Text>

          <Text
            style={[styles.headerCell, styles.normalCell]}
          >
            Sample Freq
          </Text>

          {/* DYNAMIC READING HEADERS */}
          {visibleHeaders.map(header => (
            <Text
              key={header.key}
              style={[
                styles.headerCell,
                styles.timeCell,
              ]}
            >
              {header.label}
            </Text>
          ))}
        </View>
      </>
    );
  };

  // row
  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        {/* Char No */}
        <View style={[styles.cell, styles.charCell]}>
          <EditableCell
            value={item.charNo.value}
            isEditable={item.charNo.isEditable}
            onChangeText={text =>
              updateField(item.id, 'charNo', text)
            }
          />
        </View>

        {/* Description */}
        <View style={[styles.cell, styles.descCell]}>
          <EditableCell
            value={item.description.value}
            isEditable={item.description.isEditable}
            onChangeText={text =>
              updateField(
                item.id,
                'description',
                text,
              )
            }
          />
        </View>

        {/* Class */}
        <View style={[styles.cell, styles.normalCell]}>
          <EditableCell
            value={item.className.value}
            isEditable={item.className.isEditable}
            onChangeText={text =>
              updateField(
                item.id,
                'className',
                text,
              )
            }
          />
        </View>

        {/* Tolerance */}
        <View style={[styles.cell, styles.normalCell]}>
          <EditableCell
            value={item.tolerance.value}
            isEditable={item.tolerance.isEditable}
            onChangeText={text =>
              updateField(
                item.id,
                'tolerance',
                text,
              )
            }
          />
        </View>

        {/* Gage */}
        <View style={[styles.cell, styles.normalCell]}>
          <EditableCell
            value={item.gage.value}
            isEditable={item.gage.isEditable}
            onChangeText={text =>
              updateField(item.id, 'gage', text)
            }
          />
        </View>

        {/* Sample Size */}
        <View style={[styles.cell, styles.normalCell]}>
          <EditableCell
            value={item.sampleSize.value}
            isEditable={item.sampleSize.isEditable}
            keyboardType="numeric"
            onChangeText={text =>
              updateField(
                item.id,
                'sampleSize',
                text,
              )
            }
          />
        </View>

        {/* Sample Freq */}
        <View style={[styles.cell, styles.normalCell]}>
          <EditableCell
            value={item.sampleFreq.value}
            isEditable={item.sampleFreq.isEditable}
            onChangeText={text =>
              updateField(
                item.id,
                'sampleFreq',
                text,
              )
            }
          />
        </View>

        {/* VISIBLE READING COLUMNS */}
        {visibleHeaders.map(header => {
          const reading = item.readings.find(
            r => r.key === header.key,
          );

          return (
            <View
              key={header.key}
              style={[
                styles.cell,
                styles.timeCell,
              ]}
            >
              {reading ? (
                <EditableCell
                  value={reading.value}
                  isEditable={reading.isEditable}
                  keyboardType="numeric"
                  onChangeText={text =>
                    updateReading(
                      item.id,
                      reading.key,
                      text,
                    )
                  }
                />
              ) : (
                <Text>-</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          {renderHeader()}

          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default InspectionEntryTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },

  disabledButton: {
    backgroundColor: '#94a3b8',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  row: {
    flexDirection: 'row',
  },

  headerRow: {
    backgroundColor: '#f1f5f9',
  },

  headerCell: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    justifyContent: 'center',
  },

  charCell: {
    width: 120,
  },

  descCell: {
    width: 180,
  },

  normalCell: {
    width: 120,
  },

  timeCell: {
    width: 100,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },

  disabledInput: {
    backgroundColor: '#e5e7eb',
    color: '#999',
  },
});