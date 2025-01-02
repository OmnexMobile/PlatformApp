import { TextComponent } from 'components'
import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomHeader from '../Components/CustomHeader'

const InspectionSchedule = ({route}) => {
  return (
   <CustomHeader title='Inspection Schedule' activeTabId={1}>
    <Text>Inspection Schedule</Text>
   </CustomHeader>
  )
}

export default InspectionSchedule
