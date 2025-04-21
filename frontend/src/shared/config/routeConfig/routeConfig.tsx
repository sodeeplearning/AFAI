import { AgentsPage } from "pages/Agents";
import { MainPage } from "pages/MainPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { SettingsPage } from "pages/SettingsPage";
import { RouteProps } from "react-router-dom";

export type AppRoutesProps = RouteProps & {
    // тут происходит скрытие сайдбара и навбара
    //  в зависимости от роута
    hideLayout?: boolean;
}

export enum AppRoutes {
    // ВСЕ ЧТО ОТНОСИТСЯ К ВЕБ 
    MAIN = 'main',
    AGENTS = 'agents',
    SETTINGS = 'settings',

    // ДОЛЖНА БЫТЬ САМОЙ ПОСЛЕДНЕЙ
    NOT_FOUND = 'not_found'
}

export const RoutePath: Record<AppRoutes, string> = {
    // ------------- ВЕБ ------------------
    [AppRoutes.MAIN]: '/',
    [AppRoutes.AGENTS]: '/agents',
    [AppRoutes.SETTINGS]: '/settings',
    // ------------- ВЕБ ------------------

    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {

    // ------------- ВЕБ ------------------
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    [AppRoutes.AGENTS]: {
        path: RoutePath.agents,
        element: <AgentsPage />,
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath.settings,
        element: <SettingsPage />,
    },

    // ------------- ВЕБ ------------------

    // всегда должен быть последним 
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
};
