import React, { useEffect, useState} from 'react';
import { Content, Header, TextComponent, IconComponent } from 'components';
import { FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import TabsView from './home-tab-view'
import TabsCard from './home-tab-card';
import localStorage from 'global/localStorage';
import { Platform, Pressable, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { useAppContext } from 'contexts/app-context';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'helpers/utils';
import { TouchableOpacity } from 'react-native';
import useTheme from 'theme/useTheme';
import { TouchableHighlight } from 'react-native';


const HomeFabFunctional = ({ countDetails }) => {
  const internal = true
  const supplier = true
  // const internal = false
  // const supplier = false
  const isTab = ((internal && supplier) === true) ? true : false
  const tabIndex = (internal === true) ? 0 : 1
  const [currentName, setCurrentName] = useState("");
  const { sites } = useAppContext();
  const navigations = useNavigation();
	const { theme } = useTheme();
  // console.log('CURRENT_PAGE---->', 'home-fab-functional')
  // console.log('sites---->', sites, sites?.selectedSite?.SiteId)
 
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

  const navigateToSettings = () => {
    console.log('click settings')
    navigations.navigate(ROUTES.GLOBAL_SETTINGS);
  }

  console.log('sites?.selectedSite?.FullName || currentName---->', sites?.selectedSite?.FullName, '---', currentName)

  return (
    <Content noPadding>
       {/* {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null } */}
       {/* <Header title={currentName} backState={true} /> */}

       {/* Header */}
       <View style={{ padding: SPACING.SMALL, flexDirection: 'row', maxHeight: '12%', backgroundColor: COLORS.white }}>
              
                
            {/* <TextComponent style={{ width: '80%', marginRight: '4%', height: RFPercentage(8) }} type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XLARGE} color={COLORS.white}>
              {'Welcome '}&nbsp;{sites?.selectedSite?.FullName || currentName}
            </TextComponent>
            <Pressable style={{ width: '10%', marginRight: '1%' }} onPress={() => console.log('search')}>
              <IconComponent name="search" type={ICON_TYPE.FontAwesome} size={FONT_SIZE.XXLARGE} color={COLORS.white} />
            </Pressable> 
            <Pressable style={{ width: '10%' }} onPress={() => navigateToSettings()}>
              <IconComponent name="cog" type={ICON_TYPE.FontAwesome} size={FONT_SIZE.XXLARGE} color={COLORS.white} />
            </Pressable> */}
            <Pressable hitSlop={{top: 100, bottom: 100, left: 100, right: 100}} style={{ width: '10%', marginRight: '1%'}} onPress={() => handleDashboard()}>
              <IconComponent name="arrowleft" type={ICON_TYPE.AntDesign} size={FONT_SIZE.XXLARGE} color='#05BFDB' />
            </Pressable>

           
      </View>
      {(isTab) ? <TabsView countDetails={countDetails} currentName={currentName} /> :
        <TabsCard {...{ countDetails }} tabIndex={tabIndex} currentUser={currentName} />}
    </Content>
  );
};

export default HomeFabFunctional;
