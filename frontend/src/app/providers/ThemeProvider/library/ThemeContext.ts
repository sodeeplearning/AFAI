import type { ThemeConfig } from 'antd';
import { createContext } from 'react';

export enum Theme {
    LIGHT = 'app_light_theme',
    DARK = 'app_dark_theme',
}

export interface ThemeContextProps {
    theme?: Theme;
    setTheme?: (theme: Theme) => void;
    config?: ThemeConfig; // тип конфига antd
}

export const ThemeContext = createContext<ThemeContextProps>({});

export const LOCAL_STORAGE_THEME_KEY = 'theme';
