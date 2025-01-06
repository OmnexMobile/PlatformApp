import { COLORS } from 'constants/theme-constants'
import { RFPercentage } from 'helpers/utils'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import  Icon  from 'react-native-vector-icons/FontAwesome'

const ICCheckBox = ({isChecked=false,label='label',onChange=()=>{}}) => {
  return (
    <View style={[styles.box]}>
      <TouchableOpacity style={[styles.container,{backgroundColor:isChecked?COLORS.apptheme:COLORS.white,borderColor:isChecked?COLORS.apptheme:COLORS.grey}]} onPress={onChange}>
        {isChecked && <Icon name='check' size={20} color={COLORS.white}/>}
      </TouchableOpacity>
      <Text style={[styles.radioText]}>{label}</Text>
    </View>
  
  )
}

const styles=StyleSheet.create({
  container:{
    borderWidth:1,
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
  },
  radioText:{
    fontFamily:'ProximaNova-Regular',
    fontSize:RFPercentage(2),
    marginLeft:10
  },
  box:{
    flexDirection:'row',
    alignItems:'center'
  }
})

export default ICCheckBox