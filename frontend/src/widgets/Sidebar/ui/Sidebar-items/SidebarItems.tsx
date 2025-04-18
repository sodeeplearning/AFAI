import { NavLink } from 'react-router-dom';
import s from './SidebarItems.module.scss';
import { observer } from 'mobx-react-lite';
import classNames from "shared/library/classNames/classNames";
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';


interface MenuItem {
  id: number;
  text: string;
  url: string;
  icon: ReactNode;
}

interface SidebarMenuProps {
  items: MenuItem[];
  isCollapsed: boolean;
  className?: string;
}

export const SidebarItems = observer((props: SidebarMenuProps) => {
  const {
    items,
    isCollapsed,
    className
  } = props

  const { t } = useTranslation();

  return (
    <ul className={s.menu}>
      {items.map(({ url, text, icon }) => (
        <li
          key={url}
          className={classNames(s.menuItem, {}, [className])}
        >
          <NavLink to={url}
            className={s.link}
            >
            <div className={s.icon}>{icon}</div>
            {!isCollapsed && <a className={s.helper}><span className={s.label}>{t(text)}</span></a>}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
);

export default SidebarItems;
