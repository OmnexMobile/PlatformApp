// Colors palette source https://flatuicolors.com/palette/defo

import { COLORS } from 'constants/theme-constants';

const SUN_FLOWER = '#f1c40f';
const ASBESTOS = '#7f8c8d';
const MIDNIGHT_BLUE = '#2c3e50';
const EMERALD = '#2ecc71';
const ALIZARIN = '#e74c3c';
const CLOUDS = '#ecf0f1';
const SILVER = '#bdc3c7';

const common = {
    PRIMARY: SUN_FLOWER,
    SUCCESS: EMERALD,
    ERROR: ALIZARIN,
};

const neon = {
    ...common,
    primaryThemeColor: '#1FBFD0',
    primaryLightThemeColor: '#14D0AE',
    primaryDarkThemeColor: '#2EA4E2',
};

const red = {
    ...common,
    primaryThemeColor: '#DA3743',
    primaryLightThemeColor: '#e87981',
    primaryDarkThemeColor: '#DA3743',
};

const blue = {
    ...common,
    primaryThemeColor: '#0180ff',
    primaryLightThemeColor: '#8ac7ff',
    primaryDarkThemeColor: '#2239b8',
};

const yellow = {
    ...common,
    primaryThemeColor: '#edb015',
    primaryLightThemeColor: '#f1d253',
    primaryDarkThemeColor: '#eb7103',
};

const pink = {
    ...common,
    primaryThemeColor: '#ea4c89',
    primaryLightThemeColor: '#f6bed5',
    primaryDarkThemeColor: '#aa2963',
};

const light = {
    backgroundColor: COLORS.white,
    disabledBackgroundColor: COLORS.whiteGrey,
    searchInputBackgroundColor: COLORS.loginInputBac,
    textColor: COLORS.black,
    borderColor: COLORS.whiteGrey,
};

const dark = {
    backgroundColor: COLORS.themeBlack,
    disabledBackgroundColor: COLORS.themeBlack,
    searchInputBackgroundColor: COLORS.themeBlack,
    textColor: COLORS.whiteGrey,
    borderColor: COLORS.black,
};

export const colors = { neon, red, blue, yellow, pink };
export const mode = { light, dark };
