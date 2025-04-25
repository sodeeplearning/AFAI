import { API_URL } from 'shared/api/api_url';
import { baseInstanceV1 } from '../../../base';
import { SpeechToTextRequest, SpeechToTextResponse } from './types';


// ============= SPEECH TO TEXT =============
export const speechToTextService = async (data: SpeechToTextRequest) => (
    await baseInstanceV1.post<SpeechToTextResponse>(API_URL.GenerateSpeechToText(), data)
);