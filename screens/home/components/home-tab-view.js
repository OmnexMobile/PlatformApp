import { TextComponent } from 'components';
import strings from 'config/localization';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TabsCard from './home-tab-card';
import { FONT_TYPE } from 'constants/app-constant';
import AsyncStorage from '@react-native-community/async-storage';


const TabsView = ({ countDetails, currentName }) => {
  console.log('CURRENT_PAGE---->', 'home-tab-view')
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  console.log('index---->', index)
  // const [isFocus, setIsFocus] = React.useState(false);
  const [isSupplier, setSupplier] = React.useState(false);
  const [isValue, setIsValue] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  React.useEffect(() => {
    async function getAccessToken() {
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = JSON.parse(stringifiedUserDetails);
      console.log('SM_ACESS--->', value?.smAccess, '---', value)
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
    }
    getAccessToken();
  }, []);

  const InternalTabRoute = () => (
    <View style={{ flex: 1 }} >
      <TabsCard {...{ countDetails }} tabIndex={index} currentUser={currentName} isSupplier={isSupplier} />
    </View>
  );
  
  const SupplierTabRoute = () => (
    <View style={{ flex: 1 }}>
      <TabsCard {...{ countDetails }}  tabIndex={index} currentUser={currentName} isSupplier={isSupplier} />
    </View>
  );
  
  const renderScene = SceneMap({
    first:  InternalTabRoute,
    second: SupplierTabRoute,
  });

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