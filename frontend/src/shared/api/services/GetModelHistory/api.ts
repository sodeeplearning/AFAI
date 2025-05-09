import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";

//  ============= FETCH MODEL HISTORY =============
export const getModelHistory = async (model: string) => (
    (await baseInstanceV1.post(API_URL.UpdateModel(), {
        model_name: model
    })).data
);
