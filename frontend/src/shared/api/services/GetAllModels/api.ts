import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";

//  ============= FETCH ALL MODELS =============
export const getAllModels = async () => (
    await baseInstanceV1.get(API_URL.GetAllModels())
);

//  ============= FETCH ALL DOWNLOADED MODELS =============
export const getAllDownloadedModels = async () => (
    await baseInstanceV1.get(API_URL.GetActiveModel())
);
