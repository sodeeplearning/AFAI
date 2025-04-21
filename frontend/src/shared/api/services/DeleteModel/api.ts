import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";


//  ============= DELETE MODEL =============
export const DeleteModel = async (model_name: string) => (
    await baseInstanceV1.delete(API_URL.DeleteModelAI(), {
        data: {
            model_name: model_name,
        }
    })
);