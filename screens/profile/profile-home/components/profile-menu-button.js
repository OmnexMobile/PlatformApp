import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/core';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { FONT_TYPE, LOCAL_STORAGE_VARIABLES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { IconComponent, TextComponent } from 'components';
import localStorage from 'global/localStorage';

const ProfileMenuButton = ({ menu, getProfileReset }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleMenu = async (menu) => {
		console.log("menu click", menu);
    // if (menu?.link) {
    //   console.log("menu.link", menu.link);
    //   return;
    // }
		// setLoading(true);
    if (menu?.route) {
      setLoading(true);
      if (menu.title == 'Logout') {
            const globURL = await localStorage.getData(LOCAL_STORAGE_VARIABLES.globalRegister);
            console.log('globURL logout', globURL);
            await localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globURL);
        }
      setTimeout(() => {
        setLoading(false);
        navigation.navigate(menu.route);
      }, 500);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {menu.title ? (
        <View style={{ width: '90%', alignSelf: 'center', paddingTop: 10 }}>
          <TextComponent
            type={FONT_TYPE.BOLD}
            style={{ fontSize: FONT_SIZE.REGULAR, color: theme.colors.primaryThemeColor }}
          >
            {menu.title}
          </TextComponent>
        </View>
      ) : null}

      {menu.menus.map((menu, i) => {
        const isLogout = menu.title === 'Logout';

        return (
          <View key={i}>
            <Ripple
              rippleColor={theme.mode.textColor}
              onPress={() => handleMenu(menu)}
              style={{ paddingVertical: 15 }}
            >
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TextComponent
                  style={[
                    { fontSize: FONT_SIZE.REGULAR },
                    isLogout && { color: COLORS.primaryThemeColor },
                  ]}
                >
                  {menu.title}
                </TextComponent>

                {!isLogout && (
                  <IconComponent
                    size={FONT_SIZE.X_LARGE}
                    color={theme.mode.textColor}
                    name={menu.iconName}
                    type={menu.iconType}
                  />
                )}
              </View>
            </Ripple>
            <View
              style={{
                height: 1,
                backgroundColor: theme.mode.borderColor,
                width: '90%',
                alignSelf: 'center',
              }}
            />
          </View>
        );
      })}

      {/* Full-screen centered loader */}
      <Modal
        visible={loading}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primaryThemeColor} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileMenuButton;
