import { GetAllModelsStore} from "./api/get-all-models/get-all-models-store";
import { DownloadModelStore } from "./api/download-model/download-model-store";
import { DeleteModelStore } from "./api/delete-model/delete-model-store";
import { AddSystemPromptStore } from "./api/add-system-prompt/add-system-prompt-store";

export class RootStore {
    getAllModelsStore = new GetAllModelsStore();
    downloadModelStore = new DownloadModelStore();
    deleteModelStore = new DeleteModelStore();
    addSystemPromptStore = new AddSystemPromptStore();
}