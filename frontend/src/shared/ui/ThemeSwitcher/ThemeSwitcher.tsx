import classNames from 'shared/library/classNames/classNames';
import { memo } from 'react';
import { Theme, useTheme } from 'app/providers/ThemeProvider';
import { Button } from 'antd';
import { Moon, Sun } from 'lucide-react';
import s from './ThemeSwitcher.module.scss'

interface ThemeSwitcherProps {
    className?: string;
}

export const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
        variant="filled"
            className={classNames(s.btn, {}, [className])}
            onClick={toggleTheme}
        >
            {theme === Theme.DARK ? <Moon /> : <Sun />}
        </Button>
    );
});
