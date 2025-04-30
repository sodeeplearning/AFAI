import { API_URL } from "shared/api/api_url";
import { baseInstanceV1 } from "shared/api/base";

//  ============= FETCH CHAT HISTORY =============
export const getChatHistory = async () => (
    (await baseInstanceV1.get(API_URL.GetChat())).data
);
