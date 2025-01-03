import { COLORS } from 'constants/theme-constants';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, Divider } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon  from 'react-native-vector-icons/Ionicons'
import IconF  from 'react-native-vector-icons/Feather'
import IconM  from 'react-native-vector-icons/FontAwesome'

const FilterWithMenu = ({dataList=[],type='IconFilter'}) => {
    const [visible, setVisible] =useState(false);
    const [filterText, setFilterText] =useState('');
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const returnFilterBtn=()=>{
        return(
            <TouchableOpacity style={[styles.container]} onPress={()=>{openMenu()}}>
                <Text numberOfLines={1} style={[styles.textStyle]}>{filterText==''?"Filter":filterText}</Text>
                <Icon name='filter' size={20}/>
            </TouchableOpacity>
        )
    }
    const renderIconFilter=()=>{
        return(
            <TouchableOpacity style={[styles.containerIconBox]} onPress={()=>{openMenu()}}>
            <IconF name='more-vertical' size={20} color={COLORS.moreIcon}/>
            </TouchableOpacity>
        )
    }
    const onMenuPress=(item)=>{
        setFilterText(item.title)
        closeMenu()
    }
    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={type=='IconFilter'?renderIconFilter():returnFilterBtn()}
            contentStyle={{
                backgroundColor:"#000",
                borderRadius:10,
                paddingHorizontal:10
            }}
            anchorPosition='bottom'
            >

                {dataList.map((item,index)=>{
                    return(
                        <TouchableOpacity key={item?.id} style={{flexDirection:item?.iconName?'row':'',alignItems:item?.iconName?'center':'baseline',borderBottomWidth:dataList?.length!==index+1?StyleSheet.hairlineWidth:0,borderBottomColor:dataList?.length!==index+1?'#666666':'#000'}}>
                            {item?.iconName &&<IconM name={item.iconName} color='#fff' size={20}/>}
                            <Menu.Item onPress={() => {onMenuPress(item)}} title={item?.title} titleStyle={{color:'#fff',fontFamily:'ProximaNova-Regular',fontSize:RFPercentage(1.8)}}  />
                        </TouchableOpacity>
                    )
                })}
            
        </Menu>
    );
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
        paddingHorizontal:5,
    },
    textStyle:{
      fontSize:RFPercentage(1.5),
      fontFamily:'ProximaNova-Regular',
      flex:1,
    },
    containerIconBox:{
        flexDirection:'row',
        alignItems:'center',
        borderRadius:100,
        borderColor:COLORS.staysIcon,
        paddingVertical:7,
        paddingHorizontal:5,
        justifyContent:'center',
        backgroundColor:COLORS.icborder
    },
    
})

export default FilterWithMenu
