

import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";


//  ============= CHECK HEAVY MODEL =============
export const CheckHeavyModel = async (model_name: string) => (
    await baseInstanceV1.post(API_URL.CheckHeavyModel(), {
        model_name: model_name,
    })
);

//  ============= FETCH DOWNLOAD MODEL =============
export const DownloadModel = async (model_name: string) => (
    await baseInstanceV1.post(API_URL.LaunchModelAI(), {
        model_name: model_name,
    })
);

//  ============= FETCH DOWNLOAD HEAVY MODEL =============
export const DownloadHeavyModel = async (model_name: string) => (
    await baseInstanceV1.post(API_URL.LaunchHeavyModel(), {
        model_name: model_name,
    })
);
