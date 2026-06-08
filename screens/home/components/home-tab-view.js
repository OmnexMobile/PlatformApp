import { TextComponent } from 'components';
import strings from 'config/localization';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TabsCard from './home-tab-card';
import { FONT_TYPE } from 'constants/app-constant';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TabsView = ({ countDetails, currentName }) => {
  console.log('CURRENT_PAGE---->', 'home-tab-view')
  const [index, setIndex] = React.useState(0);
  console.log('index---->', index)
  // const [isFocus, setIsFocus] = React.useState(false);
  const [isSupplier, setSupplier] = React.useState(false);
  const [isValue, setIsValue] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  const loadTabRoutes = React.useCallback(async () => {
      setIsValue(0);
      const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
      const value = stringifiedUserDetails ? JSON.parse(stringifiedUserDetails) : null;
      console.log('SM_ACESS--->', value?.smAccess, '---', value)
      setSupplier(value?.smAccess || "false")
      if(value?.smAccess == "true") {
        setRoutes([
          { key: 'first', title: strings.internal },
          { key: 'second', title: strings.supplier }
        ]);
      } else {
        setRoutes([
          { key: 'first', title: strings.internal }
        ]);
        setIndex(0);
        if (value?.smAccess !== "false") {
          console.log('else userdata--->',  value?.smAccess)
        }
      }
      setIsValue(1)
      console.log('current userdata--->',  value?.smAccess)
  }, []);

  React.useEffect(() => {
    loadTabRoutes();
  }, [loadTabRoutes]);

  useFocusEffect(
    React.useCallback(() => {
      loadTabRoutes();
    }, [loadTabRoutes]),
  );

  const InternalTabRoute = () => (
    <View style={{ flex: 1 }} >
      <TabsCard {...{ countDetails }} tabIndex={0} currentUser={currentName} isSupplier={isSupplier} />
    </View>
  );
  
  const SupplierTabRoute = () => (
    <View style={{ flex: 1 }}>
      <TabsCard {...{ countDetails }} tabIndex={1} currentUser={currentName} isSupplier={isSupplier} />
    </View>
  );

  return (
    (isValue === 1) && (
      <View style={{ flex: 1, backgroundColor: '#F4F6FA' }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            borderBottomColor: '#E8EDF5',
            borderBottomWidth: 1,
            paddingHorizontal: SPACING.SMALL,
          }}
        >
          {routes.map((route, routeIndex) => {
            const focused = routeIndex === index;

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: SPACING.NORMAL,
                  borderBottomWidth: 3,
                  borderBottomColor: focused ? COLORS.primaryThemeColor : 'transparent',
                }}
                onPress={() => setIndex(routeIndex)}
              >
                <TextComponent
                  type={focused ? FONT_TYPE.BOLD : FONT_TYPE.REGULAR}
                  style={{
                    fontSize: FONT_SIZE.LARGE,
                    color: focused ? COLORS.primaryThemeColor : '#94A3B8',
                    textAlign: 'center',
                  }}
                >
                  {route.title}
                </TextComponent>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }}>
          {index === 0 ? <InternalTabRoute /> : <SupplierTabRoute />}
        </View>
      </View>
    )
  );
}

export default TabsView;
