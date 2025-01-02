import { TextComponent } from 'components'
import React from 'react'
import { Text, View } from 'react-native'
import CustomHeader from '../Components/CustomHeader'

const SupervisorSchedule = () => {
  return (
    <CustomHeader title='Supervisor Schedule' activeTabId={4}>
    <TextComponent>Supervisor Schedule</TextComponent>
   </CustomHeader>
  )
}

export default SupervisorSchedule
