import { API_URL } from 'shared/api/api_url';
import { baseInstanceV1 } from '../../../base';
import { TextToSpeechRequest, TextToSpeechResponse } from './types';


// ============= TEXT TO SPEECH =============
export const textToSpeechService = async (data: TextToSpeechRequest) => (
    await baseInstanceV1.post<TextToSpeechResponse>(API_URL.GenerateTextToSpeech(), data)
);  