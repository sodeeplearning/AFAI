import { API_URL } from 'shared/api/api_url';
import { baseInstanceV1 } from '../../../base';
import { TextToImageRequest, TextToImageResponse } from './types';


// ============= TEXT TO IMAGE =============
export const textToImageService = async (data: TextToImageRequest) => (
    await baseInstanceV1.post<TextToImageResponse>(API_URL.GenerateImageFromText(), data)
);  