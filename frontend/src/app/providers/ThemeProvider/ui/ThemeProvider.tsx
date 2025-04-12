import { ReactNode, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from '../library/ThemeContext';
import { darkThemeConfig, lightThemeConfig } from '../../AntdProvider/antd-design';

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.LIGHT;

interface ThemeProviderProps {
    initialTheme?: Theme;
    children?: ReactNode;
}

const ThemeProvider = (props: ThemeProviderProps) => {
    const { initialTheme, children } = props;

    const [theme, setTheme] = useState<Theme>(initialTheme || defaultTheme);

    const config = useMemo(() => {
        return theme === Theme.DARK ? darkThemeConfig : lightThemeConfig;
    }, [theme]);

    const defaultProps = useMemo(
        () => ({
            theme,
            setTheme,
            config,
        }),
        [theme, config]
    );

    return (
        <ThemeContext.Provider value={defaultProps}>
            <ConfigProvider theme={config}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

