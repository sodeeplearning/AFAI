

import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";


//  ============= ADD SYSTEM PROMPT =============
export const AddSystemPrompt = async (model_name: string, system_prompt: string) => (
    await baseInstanceV1.post(API_URL.AddSystemPrompt(), {
        model_name: model_name,
        system_prompt: system_prompt,
    })
);