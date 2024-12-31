import React from 'react';
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/EvilIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';

const CustomHeader = ({title}) => {
    const navigation = useNavigation();

    // const navigation = useNavigation();
    console.log("bhbhbhbhbh------",navigation,title); 
    return (
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => 
          {
            console.log('haburger');
            
            // navigation.navigate(ROUTES.DOCPRO_DOCUMENTFOLDER)
          }
          }>
           <Icon name="reorder" size={30} color="white"/>
        </TouchableOpacity>
  
        <Text style={styles.title}>{title}</Text>
  
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Refresh icon pressed')}>
          <IconE name="refresh" size={50} color="white"></IconE>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Search icon pressed')}>
            <IconE name="search" size={50} color="white" />
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.iconButton} onPress={() =>{navigation.goBack();}}>
            <IconI name="exit-outline" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
        // <View
        //     style={styles.container}>
        //     <View style={styles.commonView}>
        //         <TouchableOpacity style={{alignContent:'center'}}onPress={() => navigation.navigate(ROUTES.DOCPRO_DOCUMENTFOLDER)}>
        //             <Icon name="align-justify" size={24} color="white" />
        //         </TouchableOpacity>
        //         {/* <View  style={{justifyContent: 'center',alignSelf:'center'}}> */}
        //         <Text  style={styles.headerText}>{title}</Text>

        //         {/* </View> */}
        //     </View>

        //     <View style={styles.iconContainer}>
        //         <View style={styles.iconView}>
        //             <TouchableOpacity>
        //                 <Icon name="refresh" size={24} color="white"></Icon>
        //             </TouchableOpacity>
        //         </View>
        //         <View style={styles.iconView}>
        //             <TouchableOpacity>
        //                 <Icon name="search" size={24} color="white"></Icon>
        //             </TouchableOpacity>
        //         </View>
        //         <View style={styles.iconView}>
        //             <TouchableOpacity
        //             onPress={()=>{
        //                 navigation.goBack();
        //             }}>
        //                 <Icon name="sign-out" size={24} color="white"></Icon>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </View>
    );
};
const styles = StyleSheet.create({

headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // paddingVertical: 10,
    backgroundColor: '#00c3d2',
    height: 80,
  },
  title: {
    fontSize: FONT_SIZE.X_LARGE,
    fontWeight: 'bold',
    // flex: 1,
    textAlign: 'center',
    color:'white'
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    // marginHorizontal: 5,  // Adds space between icons
  },
});
export default CustomHeader;
