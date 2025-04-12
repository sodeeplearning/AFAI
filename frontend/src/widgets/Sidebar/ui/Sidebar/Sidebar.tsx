import s from './Sidebar.module.scss';
import classNames from "shared/library/classNames/classNames";
import { LangSwitcher } from 'widgets/LangSwitcher';
import { SidebarItems } from '../Sidebar-items/SidebarItems';
import { menu } from 'shared/constants/menu'
import { observer } from 'mobx-react-lite';
import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher/ThemeSwitcher';

interface SidebarProps {
  isCollapsed: boolean;
  className?: string;
}

export const Sidebar = observer(({ className, isCollapsed }: SidebarProps) => {
  return (
    <nav className={classNames(s.Sidebar, { [s.collapsed]: isCollapsed }, [className])}>
      <div className={s.items}>
      <SidebarItems items={menu} isCollapsed={isCollapsed} />
      </div>
      <div className={s.switchers}>
        <ThemeSwitcher className={s.theme} />
        <LangSwitcher short={isCollapsed} className={s.lang} />
      </div>
    </nav>
  );
})

export default Sidebar;
