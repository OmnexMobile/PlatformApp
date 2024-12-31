import { TextComponent } from 'components';
import strings from 'config/localization';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TabsCard from './home-tab-card';
import { FONT_TYPE } from 'constants/app-constant';

// const renderLabel = ({ route, focused }) => { 
//   if (focused) { 
//     return <Text style={{ color: 'black', fontSize: 15, minWidth: 100, textAlign: 'center' }}> {route.title} </Text>;
//    } 
//   //  return <Text style={{ color: 'blue', fontSize: 15, minWidth: 100, textAlign: 'center' }}> {route.title} </Text>; 
//   }

const TabsView = ({ countDetails }) => {
  console.log('CURRENT_PAGE---->', 'home-tab-view')
  const internal = true
  const supplier = true
  // const internal = false
  // const supplier = false
  const isTab = ((internal && supplier) === true) ? true : false
  const tabIndex = (internal === true) ? 0 : 1
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [isFocus, setIsFocus] = React.useState(false);
  const [routes] = React.useState([
    { key: 'first', title: strings.internal },
    { key: 'second', title: strings.supplier }
  ]);

  const InternalTabRoute = () => (
    <View style={{ flex: 1 }} >
      <TabsCard {...{ countDetails }} tabIndex={index} />
    </View>
  );
  
  const SupplierTabRoute = () => (
    <View style={{ flex: 1 }}>
      <TabsCard {...{ countDetails }}  tabIndex={index} />
    </View>
  );
  
  const renderScene = SceneMap({
    first: InternalTabRoute,
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
      indicatorStyle={{ backgroundColor: '#12C0CF', height: '100%', borderBottomColor: 'white', borderBottomWidth: 2 }}
      style={{  backgroundColor: '#10A5B2' }}
      labelStyle = {{ textTransform: 'capitalize' }}
      renderLabel={renderLabel}
    />
  );

  return (
    <TabView
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