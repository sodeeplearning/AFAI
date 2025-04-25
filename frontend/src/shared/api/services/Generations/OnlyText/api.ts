import { API_URL } from 'shared/api/api_url';
import { baseInstanceV1 } from '../../../base';
import { GenerateTextRequest, GenerateTextResponse } from './types';


// ============= GENERATE ONLY TEXT =============
export const onlyTextService = async (data: GenerateTextRequest) => (
    await baseInstanceV1.post<GenerateTextResponse>(API_URL.GenerateOnlyText(), data)
);