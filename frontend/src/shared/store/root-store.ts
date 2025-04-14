import { GetAllModelsStore } from "./api/get-all-models/get-all-models-store";
import { SidebarStore } from "./Sidebar/SidebarStore";

export class RootStore {
    sidebarStore = new SidebarStore();
    getAllModelsStore = new GetAllModelsStore();
}