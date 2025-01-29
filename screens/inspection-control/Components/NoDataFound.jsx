import { COLORS } from 'constants/theme-constants'
import { RFPercentage } from 'helpers/utils'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const NoDataFound = () => {
  return (
   <View style={[styles.container]}>
     <Image source={require('../../../assets/images/empty-box.png')} style={[styles.imageStyle]} />
     <Text style={[styles.textStyle]}>No Data Found</Text>
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
        height:RFPercentage(15),
        aspectRatio:1/1
    },
    textStyle:{
        fontFamily:'OpenSans-SemiBold',
        fontSize:RFPercentage(2),
        color:COLORS.black
    }
})

export default NoDataFound
