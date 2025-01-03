import { COLORS } from 'constants/theme-constants'
import React, { useState } from 'react'
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon  from 'react-native-vector-icons/Entypo'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RFPercentage } from 'react-native-responsive-fontsize';

const DataPickerWithIcon = ({placeHolder='Start Date',onSelectedDate=()=>{}}) => {
    const [date, setDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
      // Update temporary date on change, but do not close
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    };
  
    const showDatePicker = () => {
      setShowPicker(true);
    };
  
    const handleDone = () => {
      setDate(tempDate);
      onSelectedDate(tempDate)
      setShowPicker(false);
    };
  
    const handleCancel = () => {
      setShowPicker(false);
    };

  return (
    <>
        <TouchableOpacity style={[styles.container]} onPress={()=>{showDatePicker()}}>
            <Text numberOfLines={1} style={[styles.textStyle]}>{date!==null?moment(date).format('DD/MM/YYYY'):placeHolder}</Text>
            <Icon name='calendar' size={20}/>
        </TouchableOpacity>
        {showPicker && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <DateTimePicker
                value={tempDate}
                mode={'date'}
                display="spinner"
                onChange={onChange} // Update only tempDate
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="Cancel" onPress={handleCancel} />
                <Button title="Done" onPress={handleDone} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
            value={tempDate}
            mode={'date'}
            display="default"
            onChange={(event, selectedDate) => {
                setShowPicker(false); // Close picker after selection
                if (selectedDate) {
                    onSelectedDate(selectedDate)
                    setDate(selectedDate)
                }
            }}
        />
      )}
    </>
  )
}
const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderRadius:10,
        justifyContent:'space-between',
        borderColor:COLORS.staysIcon,
        paddingVertical:7,
        paddingHorizontal:5
    },
    textStyle:{
      fontSize:RFPercentage(1.5),
      fontFamily:'ProximaNova-Regular',
      flex:1,
    }
})

export default DataPickerWithIcon
