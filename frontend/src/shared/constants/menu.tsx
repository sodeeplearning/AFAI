import { MessageCircle, PersonStanding } from "lucide-react";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routeConfig";


export const menu = [
    { id: 2, text: 'Новый чат', url: RoutePath.main, icon: <MessageCircle  size={20} /> },
    { id: 2, text: 'Агенты', url: AppRoutes.MAIN, icon: <PersonStanding  size={20} /> },
 ];
 
 