import {  RadioButton } from 'components'
import { COLORS } from 'constants/theme-constants'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Divider, Modal } from 'react-native-paper'
import { RFPercentage } from 'react-native-responsive-fontsize'

const InputDataModal = ({modalVisible=false,hideModal=()=>{}}) => {
    const handleSubmitPress=()=>{
        hideModal()
        showMessage({
            message: "Hello World",
            description: "This is our second message",
            type: "success",
            position:'top',
            statusBarHeight:40
          });
    }
  return (
    <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={{flexDirection:'row',justifyContent:'center'}}>
        <View style={[styles.container]}>
           <View style={[styles.containerOne]}>
                <Text style={styles.headertext}>Form Input Data</Text>
                <Divider/>
                <View style={[styles.inputContainer]}>
                    <Text>Lot Number <Text style={[styles.rquired]}>*</Text></Text>
                    <TextInput style={styles.inputBox}/>
                </View>
                <View style={[styles.inputContainer]}>
                    <Text>Lot Quantity <Text style={[styles.rquired]}>*</Text></Text>
                    <TextInput style={styles.inputBox}/>
                </View>
                <View style={[styles.inputContainer]}>
                    <Text>Choose Frequency <Text style={[styles.rquired]}>*</Text></Text>
                   <View style={{height:30,marginTop:-10}}>
                    <RadioButton value='' options={[
                            {value:'Each Lot',label:'Each Lot'}
                        ]}/>
                   </View>
                </View>
           </View>
           <Divider/>
           <View style={styles.btnConatiner}>
                <TouchableOpacity style={styles.cancelConatiner} onPress={hideModal}>
                    <Text style={styles.btnStyle}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelConatiner} onPress={()=>{handleSubmitPress()}}>
                    <Text style={styles.btnStyle}>SUBMIT</Text>
                </TouchableOpacity>
           </View>
        </View>
  </Modal>
  )
}
const styles=StyleSheet.create({
    container:{
        width:'90%',
        backgroundColor:'#fff',
        borderRadius:3
    },
    containerOne:{
        padding:20
    },
    headertext:{
        fontFamily:'ProximaNova-Bold',
        fontSize:RFPercentage(2.2),
        paddingBottom:12
    },
    inputContainer:{
        paddingVertical:15
    },
    inputBox:{
        borderWidth:1,
        height:40,
        borderRadius:3,
        borderColor:COLORS.icBottomBox,
        marginTop:15
    },
    btnConatiner:{
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingVertical:15
    },
    cancelConatiner:{
        marginRight:20
    },
    btnStyle:{
        color:COLORS.apptheme,
        fontFamily:'ProximaNova-Bold',
        fontSize:RFPercentage(1.8),
    },
    rquired:{
        color:COLORS.ERROR
    }
})

export default InputDataModal
