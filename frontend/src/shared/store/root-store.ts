import { GetAllModelsStore } from "./api/get-all-models/get-all-models-store";
import { DownloadModelStore } from "./api/download-model/download-model-store";
import { SidebarStore } from "./Sidebar/SidebarStore";

export class RootStore {
    sidebarStore = new SidebarStore();
    getAllModelsStore = new GetAllModelsStore();
    downloadModelStore = new DownloadModelStore();
}