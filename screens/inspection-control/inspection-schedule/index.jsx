import { TextComponent } from 'components'
import React from 'react'
import { Text, View } from 'react-native'

const InspectionSchedule = ({route}) => {
  console.log(route,'route')
  return (
   <View>
    <TextComponent>InspectionSchedule</TextComponent>
   </View>
  )
}

export default InspectionSchedule
