import { TextComponent } from 'components';
import strings from 'config/localization';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TabsCard from './home-tab-card';
import { FONT_TYPE } from 'constants/app-constant';
import AsyncStorage from '@react-native-community/async-storage';


// const renderLabel = ({ route, focused }) => { 
//   if (focused) { 
//     return <Text style={{ color: 'black', fontSize: 15, minWidth: 100, textAlign: 'center' }}> {route.title} </Text>;
//    } 
//   //  return <Text style={{ color: 'blue', fontSize: 15, minWidth: 100, textAlign: 'center' }}> {route.title} </Text>; 
//   }

const TabsView = ({ countDetails, currentName }) => {
  // console.log('CURRENT_PAGE---->', 'home-tab-view')
  const internal = true
  // const supplier = true
  // const internal = false
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  // const [isFocus, setIsFocus] = React.useState(false);
  const [isSupplier, setSupplier] = React.useState(false);
  const [isValue, setIsValue] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);
  
  // const isTab = ((internal && supplier) === true) ? true : false
  // const tabIndex = (internal === true) ? 0 : 1

  React.useEffect(() => {
    async function getAccessToken() {
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = JSON.parse(stringifiedUserDetails);
      setSupplier(value?.smAccess)
      if(value?.smAccess == "true") {
        setRoutes([
          { key: 'first', title: strings.internal },
          { key: 'second', title: strings.supplier }
        ]);
      } else if(value?.smAccess == "false") {
        setRoutes([
          { key: 'first', title: strings.internal }
        ]);
      } else {
        console.log('else userdata--->',  value?.smAccess)
      }
      setIsValue(1)
      console.log('current userdata--->',  value?.smAccess)
      // setTimeout(() => {
      //   setSupplier(value?.smAccess)
      //   console.log('current userdata--->',internal,  value?.smAccess, isSupplier)
      // }, 1000);
    }
    getAccessToken();
  }, []);

  const InternalTabRoute = () => (
    <View style={{ flex: 1 }} >
      <TabsCard {...{ countDetails }} tabIndex={index} currentUser={currentName} />
    </View>
  );
  
  const SupplierTabRoute = () => (
    <View style={{ flex: 1 }}>
      <TabsCard {...{ countDetails }}  tabIndex={index} currentUser={currentName} />
    </View>
  );
  
  const renderScene = SceneMap({
    first:  InternalTabRoute,
    second: SupplierTabRoute,
  });

  const handleRoutes = () => {
    if((internal && supplier) === true) {
      return <InternalTabRoute  />
    } else {
      return <SupplierTabRoute />
    }
  }

  // const renderScene = () => {
  //   switch (routes.key) {
  //     case 'first':
  //       return <InternalTabRoute  />;
  //     case 'second':
  //       return <SupplierTabRoute />;
  //     default:
  //       return null;
  //   }
  //   // if(isFocus) {
  //   //   return <InternalTabRoute  />
  //   // } else {
  //   //   return <SupplierTabRoute />
  //   // }
  // };

  const renderLabel = ({ route, focused }) => {
    return <TextComponent
    style={{
      fontFamily: 'ProximaNova-Bold',
      fontSize: FONT_SIZE.NORMAL,
      color: COLORS.white,
      paddingVertical: SPACING.SMALL,
      width: '100%'
    }}>
      {route.title}
    </TextComponent>
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#10A5B2', height: '100%', borderBottomColor: 'white', borderBottomWidth: 2 }}
      // style={{  backgroundColor: '#10A5B2' }}
      style={{  backgroundColor: '#12C0CF' }}
      labelStyle = {{ textTransform: 'capitalize' }}
      renderLabel={renderLabel}
    />
  );

  return (
    (isValue === 1)&& <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      // renderTabBar={() => null} //hide tab header
    />
  );
}

export default TabsView;