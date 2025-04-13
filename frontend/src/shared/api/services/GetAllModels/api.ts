import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";

//  ============= FETCH ANIME RELEASES =============
export const getAllModels = async () => (
    await baseInstanceV1.get(API_URL.GetAllModels())
).data;

