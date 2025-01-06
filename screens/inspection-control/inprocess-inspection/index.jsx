import React from 'react'
import CustomHeader from '../Components/CustomHeader'
import { TextComponent } from 'components'

const InprocessInspection = () => {
  return (
    <CustomHeader title='Inprocess Inspection' activeTabId={2} showIcons={false}>
    <TextComponent>Inprocess Inspection</TextComponent>
   </CustomHeader>
  )
}

export default InprocessInspection
