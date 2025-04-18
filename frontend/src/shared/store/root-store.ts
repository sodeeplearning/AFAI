import { GetAllModelsStore} from "./api/get-all-models/get-all-models-store";
import { DownloadModelStore } from "./api/download-model/download-model-store";

export class RootStore {
    getAllModelsStore = new GetAllModelsStore();
    downloadModelStore = new DownloadModelStore();
}