import { Flex } from 'antd';
import s from './Navbar.module.scss';
import classNames from "shared/library/classNames/classNames";
import Title from 'antd/es/typography/Title';
import { PanelRight } from 'lucide-react'


interface NavbarProps {
  toggleCollapse: () => void;
  className?: string;
  isCollapsed?: boolean;
}

export const Navbar = ({ className, toggleCollapse, isCollapsed }: NavbarProps) => {
  return (
    <nav className={classNames(s.navbar, { [s.collapsed]: isCollapsed }, [className])}>
      <Flex justify="space-between" align="center" className={s.row}>
        <div className={s.burMenuContainer}>
          <PanelRight
            size={24}
            className={s.burMenu}
            onClick={toggleCollapse}
          />
        </div>
        {isCollapsed && (
          <Title level={4} className={s.title}>
            AFAI
          </Title>
        )}
        
        <div className={s.spacer}></div>
      </Flex>
    </nav>
  );
};

export default Navbar;
