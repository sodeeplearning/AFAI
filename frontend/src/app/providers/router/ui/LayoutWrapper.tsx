import { ReactNode, useState, useMemo } from "react";
import { Navbar } from "widgets/Navbar";
import { Sidebar } from "widgets/Sidebar";
import { useLocation } from "react-router-dom";
import { routeConfig } from "shared/config/routeConfig/routeConfig";
import { classNames, Mods } from "shared/library/classNames/classNames";

interface LayoutWrapperProps {
    children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const hideLayout = useMemo(() => {
        return Object.values(routeConfig).some(route => route.path === location.pathname && route.hideLayout);
    }, [location.pathname]);

    if (hideLayout) {
        return <>{children}</>;
    }

    const Mods: Mods = {
        "sidebar-collapsed": isCollapsed,
    }

    return (
        <>
            <Navbar 
                toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
                isCollapsed={isCollapsed} 
            />
            <Sidebar isCollapsed={isCollapsed} />
            <div className={classNames("content-page", Mods, [])}>
                {children}
            </div>
        </>
    );
};
