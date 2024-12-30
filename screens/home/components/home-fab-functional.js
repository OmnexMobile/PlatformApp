import React, { useEffect, useState} from 'react';
import { Content, Header, TextComponent, IconComponent } from 'components';
import { FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import TabsView from './home-tab-view'
import TabsCard from './home-tab-card';
import localStorage from 'global/localStorage';
import { Platform, Pressable, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';

import { useAppContext } from 'contexts/app-context';

const HomeFabFunctional = ({
    countDetails,
  }) => {
  const internal = true
  const supplier = true
  // const internal = false
  // const supplier = false
  const isTab = ((internal && supplier) === true) ? true : false
  const tabIndex = (internal === true) ? 0 : 1
  const [name, setName] = useState("");
  const { sites } = useAppContext();
  console.log('CURRENT_PAGE---->', 'home-fab-functional')
  console.log('sites---->', sites, sites?.selectedSite?.SiteId)
 
  useEffect(() => {
    async function fetchData() {
      const UserFullName = await localStorage.getData(LOCAL_STORAGE_VARIABLES.UserFullName);
      console.log('UserFullName------------', UserFullName)
      setName(UserFullName)
    }
    fetchData()
  },[name])

  

  return (
    <Content noPadding>
       {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
       {/* <Header title={name} backState={true} /> */}
       <View style={{ padding: SPACING.NORMAL, flexDirection: 'row', maxHeight: '9%', backgroundColor: '#05BFDB' }}>
              <View style={{ flex: 1, flexDirection:'row' }}>
                <TextComponent style={{ width: '90%' }}type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.XLARGE} color={COLORS.white}>
                  {'Welcome '}&nbsp;{sites?.selectedSite?.FullName || name}
                </TextComponent>
                <Pressable style={{ width: '10%' }} onPress={() => console.log('Click Search')}>
                  <IconComponent name="search" type={ICON_TYPE.FontAwesome} size={FONT_SIZE.XXLARGE} color={COLORS.white} />
                </Pressable>
              </View>
      </View>
      {(isTab) ? <TabsView countDetails={countDetails}/> :
        <TabsCard {...{ countDetails }} tabIndex={tabIndex}/>}
    </Content>
  );
};

export default HomeFabFunctional;
