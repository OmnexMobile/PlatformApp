import React, { useEffect, useState} from 'react';
import { Content, Header, TextComponent, IconComponent } from 'components';
import { FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import TabsView from './home-tab-view'
import TabsCard from './home-tab-card';
import localStorage from 'global/localStorage';
import { Platform, Pressable, View, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { useAppContext } from 'contexts/app-context';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import { TouchableHighlight } from 'react-native';

const HomeFabFunctional = ({ countDetails }) => {
  const [currentName, setCurrentName] = useState("");
  const { sites } = useAppContext();
  const navigations = useNavigation();
	const { theme } = useTheme();
  // console.log('CURRENT_PAGE---->', 'home-fab-functional')
 
  useEffect(() => {
    async function fetchData() {
      const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
      // console.log('UserFullName------------', UserFullName)
      setCurrentName(UserFullName)
    }
    fetchData()
  },[currentName])

  const handleDashboard = () => {
    console.log('Click GLOBAL_DASHBOARD')
    navigations.navigate(ROUTES.GLOBAL_DASHBOARD);
  }

  const handleCalendar = () => {
    console.log('checkkinglist----->', sites?.selectedSite?.Siteid,  '++++++++++++++', sites?.selectedSite?.UserId );
    
    navigations.navigate(ROUTES.CALENDER_LIST);
  };

  const navigateToSettings = () => {
    console.log('click settings')
    navigations.navigate(ROUTES.GLOBAL_SETTINGS);
  }

  console.log('sites?.selectedSite?.FullName || currentName---->', sites?.selectedSite?.FullName, '---', currentName)

  return (
    <Content noPadding>

       {/* Header */}
       <View style={{ padding: SPACING.SMALL, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxHeight: '12%', backgroundColor: COLORS.white }}>
            <Pressable
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => handleDashboard()}
            >
             <IconComponent name="arrowleft" type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXLARGE} color="#05BFDB" />
            </Pressable>
             {/*<TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleCalendar}
            >
              <IconComponent name="calendar" type={ICON_TYPE.FontAwesome} size={FONT_SIZE.XXLARGE} color="#05BFDB" />
            </TouchableOpacity>*/}

           
      </View>
        <TabsView countDetails={countDetails} currentName={currentName} />
    </Content>
  );
};

export default HomeFabFunctional;
