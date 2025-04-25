import { API_URL } from 'shared/api/api_url';
import { baseInstanceV1 } from '../../../base';
import {  ImageToTextRequest, ImageToTextResponse } from './types';


// ============= IMAGE TO TEXT =============
export const imageToTextService = async (data: ImageToTextRequest) => (
    await baseInstanceV1.post<ImageToTextResponse>(API_URL.GenerateFromImageText(), data)
);