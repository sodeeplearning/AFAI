import { NavLink } from 'react-router-dom';
import s from './SidebarItems.module.scss';
import { observer } from 'mobx-react-lite';
import classNames from "shared/library/classNames/classNames";
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageHistoryList } from 'entities/Chat/ui/MessageHistoryList/MessageHistoryList';
import { useStore } from 'app/providers/StoreProvider';
import { ChatHistory } from 'shared/api/services/GetChatHistory/types';


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
  const { getChatHistoryStore } = useStore()

  useEffect(() => {
    const fetchData = async () => {
        await getChatHistoryStore.getAllModelsAction();
    };
    fetchData();
}, [getChatHistoryStore]);

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
        <MessageHistoryList chatHistory={getChatHistoryStore.getChatHistoryData?.value as ChatHistory} />
      </ul>
  );
}
);

export default SidebarItems;
