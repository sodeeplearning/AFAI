import { Flex } from 'antd';
import s from './Navbar.module.scss';
import classNames from "shared/library/classNames/classNames";
import Title from 'antd/es/typography/Title';
import { PanelRight } from 'lucide-react'


interface NavbarProps {
  toggleCollapse: () => void;
  className?: string;
}

export const Navbar = ({ className, toggleCollapse }: NavbarProps) => {
  return (

    <nav className={classNames(s.navbar, {}, [className])}>
      <Flex justify="start" align="center" className={s.row}>
          <PanelRight
            size={24}
            className={s.burMenu}
            onClick={toggleCollapse}
          />
          <Title level={4} className={s.text}>
            AFAI
          </Title>
      </Flex>
    </nav>

  );
};

export default Navbar;
