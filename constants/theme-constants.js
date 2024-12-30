import { RFPercentage, RFValue } from 'helpers/utils';
import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

// COLORS

export const COLORS = {
    primaryThemeColor: '#1FBFD0',
    primaryLightThemeColor: '#14D0AE',
    primaryDarkThemeColor: '#2EA4E2',
    primaryLightTransparentThemeColor: '#0180ff1a',
    secondaryColor: '#F19190',
    themeBlack1: '#191919',
    themeBlack: '#323232',
    white: '#ffffff',
    linearTextColor: '#264E1A',
    warningRed: '#E2A0A1',
    black: '#484848',
    textBlack: '#5D5B5B',
    textWhite: '#b0bbc0',
    red: '#ff2052',
    like: '#FF184C',
    mapDirectionGreen: '#29ad55',
    textGreen: '#147D38',
    transparent: 'transparent',
    transparentGrey: '#0000001f',
    transparentGreyDark: '#0000009e',
    grey: '#757575',
    whiteGrey: '#edf2f6',
    lightGrey: '#D2D2D2',
    darkGrey: '#222222',
    loginInputBorder: '#EBEBEB',
    loginInputBac: '#f9f9f9',
    loginInputBorder: '#EBEBEB',
    textDark: '#5D5B5B',
    like: '#ff1f6b',
    green: '#13b495',
    orange: '#FF8617',
    pink: '#EA0A8C',
    blue: '#178AFF',
    yellow: '#ffe024',
    diamond: '#A0C0C1',
    silver: '#B0BEBF',
    gold: '#755319',
    tabText: '#262626',
    searchText: '#A2A0A1',
    staysIcon: '#C1BFC0',
    accordionBorderColor: '#D2D2D2',
    dividerColor: '#e9e8e8',
    staysBackground: '#edf8f4',
    accDividerColor: '#F4F4F4',
    facebookColor: '#355287',
    twitterColor: '#29a9e1',
    orderRed: '#DA3743',
    SUCCESS: '#00CC52',
    WARNING: '#F7B500',
    INFO: '#008BF7',
    ALERT: '#cc4b37',
    ERROR: '#FF5858',
    background: '#1F0808',
    clear: 'rgba(0,0,0,0)',
    facebook: '#3b5998',
    transparent: 'rgba(0,0,0,0)',
    silver: '#F7F7F7',
    steel: '#CCCCCC',
    error: 'rgba(200, 0, 0, 0.8)',
    ricePaper: 'rgba(255,255,255, 0.75)',
    frost: '#D8D8D8',
    cloud: 'rgba(200,200,200, 0.35)',
    windowTint: 'rgba(0, 0, 0, 0.4)',
    panther: '#161616',
    charcoal: '#595959',
    coal: '#2d2d2d',
    bloodOrange: '#fb5f26',
    snow: 'white',
    ember: 'rgba(164, 0, 48, 0.5)',
    fire: '#e73536',
    drawer: 'rgba(30, 30, 29, 0.95)',
    eggplant: '#251a34',
    border: '#483F53',
    banner: '#5F3E63',
    text: '#E0D7E5',
};

// FONTS

export const FONT_SIZE = {
    XXXX_SMALL: RFValue(9),
    XXX_SMALL: RFValue(8),
    XX_SMALL: RFValue(10),
    X_SMALL: RFValue(10),
    SMALL: RFValue(12),
    NORMAL: RFValue(14),
    LARGE: RFValue(16),
    X_LARGE: RFValue(18),
    XLARGE: RFValue(22),
    XXLARGE: RFValue(24),
    XX_LARGE: RFValue(25),
    XXX_LARGE: RFValue(30),
};

export const SPACING = {
    XX_SMALL: RFPercentage(0.25),
    X_SMALL: RFPercentage(0.5),
    SMALL: RFPercentage(1),
    NORMAL: RFPercentage(2),
    LARGE: RFPercentage(4),
    X_LARGE: RFPercentage(6),
    XX_LARGE: RFPercentage(8),
};

// METRICS

// Used via Metrics.baseMargin
export const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
}
