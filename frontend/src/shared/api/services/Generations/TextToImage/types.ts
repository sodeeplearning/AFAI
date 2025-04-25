
export interface TextToImageRequest {
    model_name: string;
    prompt: string;
    image_size: number;
}


export interface TextToImageResponse {
    image_url: string;
}

