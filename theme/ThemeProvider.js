import React, { useEffect, useState } from 'react';
import localStorage from '../global/localStorage';
import { colors, mode } from './colors';
import { typography } from './typography';
import { LOCAL_STORAGE_VARIABLES, Modes, Themes } from '../constants/app-constant';

export const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        selectedColor: Themes.neon,
        colors: colors.neon,
        selectedMode: mode.light,
        mode: Modes.light,
        typography,
    });

    useEffect(() => {
        handleThemeOnLoad();
    }, []);

    const handleChangeMode = mode => {
        let activeMode = getMode(mode);
        setTheme({
            ...theme,
            mode: activeMode,
            selectedMode: mode,
        });
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SELECTED_MODE, mode);
    };

    const handleChangeTheme = colorName => {
        let activeColor = colors[colorName];
        setTheme({
            ...theme,
            colors: activeColor,
            selectedColor: colorName,
        });
        localStorage.storeData(LOCAL_STORAGE_VARIABLES.SELECTED_THEME, colorName);
    };

    const getMode = modeValue => {
        let activeMode = null;
        switch (modeValue) {
            case Modes.light:
                activeMode = mode.light;
                break;
            case Modes.dark:
                activeMode = mode.dark;
                break;
            default:
                break;
        }
        return activeMode;
    };

    const handleThemeOnLoad = async () => {
        const color = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SELECTED_THEME)) || Themes.neon;
        const mode = (await localStorage.getData(LOCAL_STORAGE_VARIABLES.SELECTED_MODE)) || Modes.light;
        // console.log('🚀 ~ file: ThemeProvider.js ~ line 60 ~ handleThemeOnLoad ~ mode', mode);
        let activeColor = colors[color];
        let activeMode = getMode(mode);
        setTheme({
            ...theme,
            selectedColor: color,
            selectedMode: mode,
            colors: activeColor,
            mode: activeMode,
        });
    };

    return <ThemeContext.Provider value={{ theme, handleChangeTheme, handleChangeMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
