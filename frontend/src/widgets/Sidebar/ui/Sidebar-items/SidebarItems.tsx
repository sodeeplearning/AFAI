import { NavLink } from 'react-router-dom';
import s from './SidebarItems.module.scss';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'app/providers/StoreProvider';

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

export const SidebarItems = observer(({ items, isCollapsed }: SidebarMenuProps) => {
  const { sidebarStore } = useStore();
  const { t } = useTranslation();

  const handleMenuClick = (id: number) => {
    sidebarStore.setSelectedKey(id);
  };

  return (
    <ul className={s.menu}>
      {items.map(({ id, url, text, icon }) => (
        <li
          key={url}
          className={classNames(s.menuItem, {
            [s.active]: sidebarStore.selectedKey === id,
          })}
        >
          <NavLink to={url}
            className={s.link}
            onClick={() => handleMenuClick(id)}>
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
