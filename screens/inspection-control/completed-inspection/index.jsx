import { TextComponent } from 'components'
import React from 'react'
import { Text, View } from 'react-native'
import CustomHeader from '../Components/CustomHeader'

const CompletedInspection = () => {
  return (
    <CustomHeader title='Completed Inspection' activeTabId={3}>
    <TextComponent>CompletedInspection</TextComponent>
   </CustomHeader>
  )
}

export default CompletedInspection
