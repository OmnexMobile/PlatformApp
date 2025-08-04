import { COLORS } from 'constants/theme-constants'
import { RFPercentage } from 'helpers/utils'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const NoDataFound = () => {
  return (
   <View style={[styles.container]}>
     <Image source={require('../../../assets/images/empty-box.png')} style={[styles.imageStyle]} />
     <Text style={[styles.textStyle]}>No Data Available</Text>
   </View>
  )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    imageStyle:{
        height:100,
        aspectRatio:1/1
    },
    textStyle:{
        fontFamily:'OpenSans-SemiBold',
        fontSize:18,
        color:COLORS.black
    }
})

export default NoDataFound
