import { MessageCircle, PersonStanding, Settings } from "lucide-react";
import { RoutePath } from "shared/config/routeConfig/routeConfig";


export const menu = [
    { id: 1, text: 'Новый чат', url: RoutePath.main, icon: <MessageCircle  size={20} /> },
    { id: 2, text: 'Агенты', url: RoutePath.agents, icon: <PersonStanding  size={20} /> },
    { id: 3, text: 'Настройки', url: RoutePath.settings, icon: <Settings  size={20} /> },
 ];
 
 